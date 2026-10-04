import test from 'node:test';
import assert from 'node:assert/strict';
import {
  handleLeadRequest,
  LEAD_BODY_LIMIT_BYTES,
  LEAD_BURST_LIMIT,
  LEAD_SUSTAINED_WINDOW_MS,
  leadProtectionStateForTests,
  PROVIDER_TIMEOUT_MS,
  resetLeadProtectionStateForTests,
  type LeadDeliveryProvider,
} from '../lib/leadEndpoint';
import { POST } from '../app/api/contact/route';

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

function restoreEnvironment(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
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

test('rotating attacker-controlled forwarding headers cannot multiply provider calls', async () => {
  resetLeadProtectionStateForTests();
  const priorVercel = process.env.VERCEL;
  const priorTrustedHops = process.env.LEAD_TRUSTED_PROXY_HOPS;
  process.env.VERCEL = '1';
  delete process.env.LEAD_TRUSTED_PROXY_HOPS;
  let calls = 0;
  const spy: LeadDeliveryProvider = { name: 'spy', async deliver() { calls += 1; return `receipt-${calls}`; } };
  try {
    for (let index = 0; index < LEAD_BURST_LIMIT; index += 1) {
      const response = await handleLeadRequest(request(validLead(String(index)), `203.0.113.${index + 1}`, {
        'x-real-ip': `198.51.100.${index + 1}`,
        'x-vercel-forwarded-for': '192.0.2.44',
      }), [spy]);
      assert.equal(response.status, 200);
    }
    const limited = await handleLeadRequest(request(validLead('98'), '203.0.113.200', {
      'x-real-ip': '198.51.100.200',
      'x-vercel-forwarded-for': '192.0.2.44',
    }), [spy]);
    assert.equal(limited.status, 429);
    assert.equal(calls, LEAD_BURST_LIMIT);
  } finally {
    restoreEnvironment('VERCEL', priorVercel);
    restoreEnvironment('LEAD_TRUSTED_PROXY_HOPS', priorTrustedHops);
  }
});

test('rate stores evict deterministically at the cap and delete expired keys', async () => {
  resetLeadProtectionStateForTests();
  const priorVercel = process.env.VERCEL;
  const priorTrustedHops = process.env.LEAD_TRUSTED_PROXY_HOPS;
  process.env.VERCEL = '1';
  delete process.env.LEAD_TRUSTED_PROXY_HOPS;
  try {
    let now = 1_000;
    const sendInvalid = (ip: string) => handleLeadRequest(request('{', 'spoofed', { 'x-vercel-forwarded-for': ip }), [], { now: () => now, rateStoreMaxKeys: 3 });
    for (const ip of ['192.0.2.1', '192.0.2.2', '192.0.2.3']) {
      assert.equal((await sendInvalid(ip)).status, 400);
      now += 1;
    }
    const beforeEviction = leadProtectionStateForTests();
    assert.equal(beforeEviction.burstKeys.length, 3);
    assert.equal(beforeEviction.sustainedKeys.length, 3);
    const oldestBurstKey = beforeEviction.burstKeys[0];
    const oldestSustainedKey = beforeEviction.sustainedKeys[0];

    assert.equal((await sendInvalid('192.0.2.4')).status, 400);
    const afterEviction = leadProtectionStateForTests();
    assert.equal(afterEviction.burstKeys.length, 3);
    assert.equal(afterEviction.sustainedKeys.length, 3);
    assert.ok(!afterEviction.burstKeys.includes(oldestBurstKey));
    assert.ok(!afterEviction.sustainedKeys.includes(oldestSustainedKey));

    now += LEAD_SUSTAINED_WINDOW_MS + 1;
    assert.equal((await sendInvalid('192.0.2.5')).status, 400);
    const afterExpiry = leadProtectionStateForTests();
    assert.equal(afterExpiry.burstKeys.length, 1);
    assert.equal(afterExpiry.sustainedKeys.length, 1);
  } finally {
    restoreEnvironment('VERCEL', priorVercel);
    restoreEnvironment('LEAD_TRUSTED_PROXY_HOPS', priorTrustedHops);
  }
});

test('Notion-only success round-trips every maximum bounded lead field without truncation', async () => {
  resetLeadProtectionStateForTests();
  const priorFetch = globalThis.fetch;
  const environment = ['NOTION_API_KEY', 'LEAD_NOTION_DATABASE_ID', 'RESEND_API_KEY', 'LEAD_NOTIFICATION_EMAIL', 'LEAD_FROM_EMAIL'] as const;
  const priorEnvironment = Object.fromEntries(environment.map((name) => [name, process.env[name]]));
  process.env.NOTION_API_KEY = 'test-notion-key';
  process.env.LEAD_NOTION_DATABASE_ID = 'test-database';
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFICATION_EMAIL;
  delete process.env.LEAD_FROM_EMAIL;

  const maximum = 'x'.repeat(500);
  const maximumCapturedAt = '2'.repeat(50);
  const maximumTouch = {
    landing_page: maximum,
    referrer: maximum,
    captured_at: maximumCapturedAt,
    utm_source: maximum,
    utm_medium: maximum,
    utm_campaign: maximum,
    utm_term: maximum,
    utm_content: maximum,
    gclid: maximum,
    msclkid: maximum,
  };
  const maximumLead = {
    ...validLead(),
    name: 'N'.repeat(100),
    email: `${'e'.repeat(241)}@example.test`,
    phone: '1'.repeat(30),
    attribution: { first_touch: maximumTouch, latest_touch: maximumTouch },
  };
  let persistedChildren: unknown[] = [];
  let receiptBlock: unknown;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith('/v1/pages')) {
      const body = JSON.parse(String(init?.body)) as { children: unknown[] };
      persistedChildren = body.children;
      return Response.json({ id: 'page-max-fields' });
    }
    if (init?.method === 'PATCH') {
      const body = JSON.parse(String(init.body)) as { children: unknown[] };
      receiptBlock = body.children[0];
      return Response.json({ results: body.children });
    }
    return Response.json({ results: [...persistedChildren, receiptBlock], has_more: false });
  }) as typeof fetch;

  try {
    const response = await POST(request(maximumLead));
    assert.equal(response.status, 200);
    const result = await response.json() as { delivery: Array<{ channel: string; id: string }> };
    assert.deepEqual(result.delivery, [{ channel: 'notion', id: 'page-max-fields' }]);

    const envelopes = persistedChildren.map((block) => {
      const content = (block as { code: { rich_text: Array<{ text: { content: string } }> } }).code.rich_text[0].text.content;
      assert.ok(content.length <= 2_000);
      return JSON.parse(content) as { type: string; index: number; total: number; payload: string };
    }).sort((left, right) => left.index - right.index);
    assert.ok(envelopes.length > 1);
    assert.ok(envelopes.every((item) => item.type === 'sr-energy-lead-v1' && item.total === envelopes.length));
    const reconstructed = JSON.parse(envelopes.map((item) => item.payload).join('')) as Record<string, unknown>;
    assert.deepEqual(reconstructed, {
      name: maximumLead.name,
      phone: maximumLead.phone,
      email: maximumLead.email,
      zip: maximumLead.zip,
      market: maximumLead.market,
      product_intent: maximumLead.product_intent,
      homeowner: true,
      consent: true,
      attribution: maximumLead.attribution,
      lead_created_at: reconstructed.lead_created_at,
      milestones: {},
    });
    assert.match(reconstructed.lead_created_at as string, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    globalThis.fetch = priorFetch;
    for (const name of environment) restoreEnvironment(name, priorEnvironment[name]);
  }
});

test('Notion acknowledgment without complete persistence cannot produce homeowner success', async () => {
  resetLeadProtectionStateForTests();
  const priorFetch = globalThis.fetch;
  const environment = ['NOTION_API_KEY', 'LEAD_NOTION_DATABASE_ID', 'RESEND_API_KEY', 'LEAD_NOTIFICATION_EMAIL', 'LEAD_FROM_EMAIL'] as const;
  const priorEnvironment = Object.fromEntries(environment.map((name) => [name, process.env[name]]));
  process.env.NOTION_API_KEY = 'test-notion-key';
  process.env.LEAD_NOTION_DATABASE_ID = 'test-database';
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFICATION_EMAIL;
  delete process.env.LEAD_FROM_EMAIL;
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    if (init?.method === 'POST') return Response.json({ id: 'page-incomplete' });
    if (init?.method === 'PATCH') return Response.json({ results: [] });
    return Response.json({ results: [], has_more: false });
  }) as typeof fetch;

  try {
    const response = await POST(request(validLead('incomplete')));
    assert.equal(response.status, 502);
    const result = await response.json() as { success?: boolean; error?: string };
    assert.equal(result.success, undefined);
    assert.match(result.error ?? '', /Unable to save/);
  } finally {
    globalThis.fetch = priorFetch;
    for (const name of environment) restoreEnvironment(name, priorEnvironment[name]);
  }
});
