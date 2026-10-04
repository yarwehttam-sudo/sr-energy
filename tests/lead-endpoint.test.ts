import test from 'node:test';
import assert from 'node:assert/strict';
import {
  handleLeadRequest,
  LEAD_BODY_LIMIT_BYTES,
  LEAD_BURST_LIMIT,
  PROVIDER_TIMEOUT_MS,
  resetLeadProtectionStateForTests,
  type LeadDeliveryProvider,
} from '../lib/leadEndpoint';

const attribution = {
  first_touch: { landing_page: '/contact?utm_source=test', referrer: 'https://example.test/', captured_at: '2026-10-04T00:00:00.000Z', utm_source: 'test', gclid: 'g-1' },
  latest_touch: { landing_page: '/contact?utm_source=test', referrer: 'https://example.test/', captured_at: '2026-10-04T00:01:00.000Z', utm_source: 'test', msclkid: 'm-1' },
};

const validLead = (suffix = '') => ({
  name: 'Test Homeowner',
  email: `test${suffix}@example.test`,
  phone: `38555501${suffix.padStart(2, '0')}`,
  zip: '84003',
  market: 'CO',
  product_intent: 'solar',
  homeowner: true,
  consent: true,
  attribution,
  website: '',
});

const provider = (name = 'mock', id: string | null = 'receipt-test-1'): LeadDeliveryProvider => ({
  name,
  async deliver() { return id; },
});

const failingProvider = (name = 'failing'): LeadDeliveryProvider => ({
  name,
  async deliver() { throw new Error('mock provider failure'); },
});

function request(body: unknown, ip = '192.0.2.1', headers: Record<string, string> = {}) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, ...headers },
    body: raw,
  });
}

test('normal lead succeeds only with a receipt identifier and preserves delivery metadata', async () => {
  resetLeadProtectionStateForTests();
  const response = await handleLeadRequest(request(validLead()), [provider()]);
  assert.equal(response.status, 200);
  const result = await response.json() as { success: boolean; lead_created_at: string; delivery: Array<{ channel: string; id: string }> };
  assert.equal(result.success, true);
  assert.match(result.lead_created_at, /^2026-/);
  assert.deepEqual(result.delivery, [{ channel: 'mock', id: 'receipt-test-1' }]);
});

test('malformed JSON and schema violations are rejected before providers', async () => {
  for (const [label, body] of [
    ['malformed', '{'],
    ['missing consent', { ...validLead(), consent: false }],
    ['invalid intent', { ...validLead(), product_intent: 'vpp' }],
    ['unsupported territory', { ...validLead(), market: 'UT' }],
  ] as const) {
    resetLeadProtectionStateForTests();
    let called = false;
    const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { called = true; return 'unexpected'; } };
    const response = await handleLeadRequest(request(body, `192.0.2.${label.length}`), [spy]);
    assert.equal(response.status, 400, label);
    assert.equal(called, false, label);
  }
});

test('oversized request is rejected before provider work', async () => {
  resetLeadProtectionStateForTests();
  let called = false;
  const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { called = true; return 'unexpected'; } };
  const response = await handleLeadRequest(request(validLead(), '192.0.2.20', { 'content-length': String(LEAD_BODY_LIMIT_BYTES + 1) }), [spy]);
  assert.equal(response.status, 413);
  assert.equal(called, false);
});

test('burst limit returns 429 with Retry-After and does not amplify provider calls', async () => {
  resetLeadProtectionStateForTests();
  let calls = 0;
  const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { calls += 1; return `receipt-${calls}`; } };
  for (let index = 0; index < LEAD_BURST_LIMIT; index += 1) {
    const response = await handleLeadRequest(request(validLead(String(index)), '192.0.2.30'), [spy]);
    assert.equal(response.status, 200);
  }
  const limited = await handleLeadRequest(request(validLead('99'), '192.0.2.30'), [spy]);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
  assert.equal(calls, LEAD_BURST_LIMIT);
});

test('successful lead is replay-suppressed during duplicate window', async () => {
  resetLeadProtectionStateForTests();
  let calls = 0;
  const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { calls += 1; return `receipt-${calls}`; } };
  assert.equal((await handleLeadRequest(request(validLead(), '192.0.2.40'), [spy])).status, 200);
  assert.equal((await handleLeadRequest(request(validLead(), '192.0.2.40'), [spy])).status, 409);
  assert.equal(calls, 1);
});

test('honeypot rejects bots without visible CAPTCHA or provider work', async () => {
  resetLeadProtectionStateForTests();
  let called = false;
  const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { called = true; return 'unexpected'; } };
  const response = await handleLeadRequest(request({ ...validLead(), website: 'spam.example' }, '192.0.2.50'), [spy]);
  assert.equal(response.status, 400);
  assert.equal(called, false);
});

test('one provider may fail while an approved channel receipt keeps response honest', async () => {
  resetLeadProtectionStateForTests();
  const response = await handleLeadRequest(request(validLead(), '192.0.2.60'), [failingProvider('email'), provider('notion', 'page-test-1')]);
  assert.equal(response.status, 200);
  const result = await response.json() as { delivery: Array<{ channel: string; id: string }> };
  assert.deepEqual(result.delivery, [{ channel: 'notion', id: 'page-test-1' }]);
});

test('all channels failing or returning no identifier returns 502 and permits a retry', async () => {
  resetLeadProtectionStateForTests();
  const first = await handleLeadRequest(request(validLead(), '192.0.2.70'), [failingProvider(), provider('empty', null)]);
  assert.equal(first.status, 502);
  const retry = await handleLeadRequest(request(validLead(), '192.0.2.70'), [provider()]);
  assert.equal(retry.status, 200);
});

test('provider timeout aborts stalled work and returns honest failure', async () => {
  resetLeadProtectionStateForTests();
  let aborted = false;
  const stalled: LeadDeliveryProvider = {
    name: 'stalled',
    deliver(_lead, _createdAt, signal) {
      signal.addEventListener('abort', () => { aborted = true; });
      return new Promise(() => undefined);
    },
  };
  const started = Date.now();
  const response = await handleLeadRequest(request(validLead(), '192.0.2.80'), [stalled]);
  assert.equal(response.status, 502);
  assert.equal(aborted, true);
  assert.ok(Date.now() - started >= PROVIDER_TIMEOUT_MS);
});

test('provider circuit opens after three consecutive failures', async () => {
  resetLeadProtectionStateForTests();
  let calls = 0;
  const failing: LeadDeliveryProvider = { name: 'circuit-test', async deliver() { calls += 1; throw new Error('failure'); } };
  for (let index = 0; index < 4; index += 1) {
    const response = await handleLeadRequest(request(validLead(), '192.0.2.90'), [failing]);
    assert.equal(response.status, 502);
  }
  assert.equal(calls, 3);
});
