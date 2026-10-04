import { createHash, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { isProductIntent, sanitizeAttributionValue, type LeadAttribution, type ProductIntent } from '@/lib/acquisition';
import { isServiceTerritory } from '@/lib/serviceTerritories';

export const LEAD_BODY_LIMIT_BYTES = 16_384;
export const LEAD_BURST_LIMIT = 5;
export const LEAD_BURST_WINDOW_MS = 60_000;
export const LEAD_SUSTAINED_LIMIT = 20;
export const LEAD_SUSTAINED_WINDOW_MS = 3_600_000;
export const LEAD_DUPLICATE_WINDOW_MS = 10 * 60_000;
export const LEAD_RATE_STORE_MAX_KEYS = 1_024;
export const PROVIDER_TIMEOUT_MS = 5_000;
export const PROVIDER_FAILURE_THRESHOLD = 3;
export const PROVIDER_CIRCUIT_OPEN_MS = 60_000;
export const MAX_PROVIDER_ATTEMPTS = 2;

export interface LeadRequest {
  name: string;
  phone: string;
  email: string;
  zip: string;
  market: string;
  product_intent: ProductIntent;
  homeowner: boolean;
  consent: true;
  attribution: LeadAttribution;
}

export interface DeliveryReceipt {
  channel: string;
  id: string;
}

export interface LeadDeliveryProvider {
  name: string;
  deliver: (lead: LeadRequest, leadCreatedAt: string, signal: AbortSignal) => Promise<string | null>;
}

interface WindowCounter {
  timestamps: number[];
}

interface CircuitState {
  failures: number;
  openedAt?: number;
}

const burstCounters = new Map<string, WindowCounter>();
const sustainedCounters = new Map<string, WindowCounter>();
const duplicateKeys = new Map<string, number>();
const circuits = new Map<string, CircuitState>();

const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function emit(event: string, fields: Record<string, string | number | boolean | undefined> = {}) {
  console.info(JSON.stringify({ scope: 'public_lead', event, ...fields }));
}

function normalizeAttribution(value: unknown): LeadAttribution | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const normalizeTouch = (touch: unknown) => {
    const item = touch && typeof touch === 'object' ? touch as Record<string, unknown> : {};
    return {
      landing_page: sanitizeAttributionValue(item.landing_page),
      referrer: sanitizeAttributionValue(item.referrer),
      captured_at: sanitizeAttributionValue(item.captured_at, 50),
      utm_source: sanitizeAttributionValue(item.utm_source),
      utm_medium: sanitizeAttributionValue(item.utm_medium),
      utm_campaign: sanitizeAttributionValue(item.utm_campaign),
      utm_term: sanitizeAttributionValue(item.utm_term),
      utm_content: sanitizeAttributionValue(item.utm_content),
      gclid: sanitizeAttributionValue(item.gclid),
      msclkid: sanitizeAttributionValue(item.msclkid),
    };
  };
  return { first_touch: normalizeTouch(record.first_touch), latest_touch: normalizeTouch(record.latest_touch) };
}

export function parseLead(body: Record<string, unknown>): LeadRequest | null {
  const name = text(body.name, 100);
  const phone = text(body.phone, 30);
  const email = text(body.email, 254).toLowerCase();
  const zip = text(body.zip, 5);
  const market = text(body.market, 2).toUpperCase();
  const intent = text(body.product_intent, 30);
  const attribution = normalizeAttribution(body.attribution);
  if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{5}$/.test(zip) || !isServiceTerritory(market) || !isProductIntent(intent) || body.consent !== true || !attribution) return null;
  return { name, phone, email, zip, market, product_intent: intent, homeowner: body.homeowner === true, consent: true, attribution };
}

function configuredTrustedProxyHops() {
  const raw = process.env.LEAD_TRUSTED_PROXY_HOPS;
  if (!raw || !/^\d+$/.test(raw)) return 0;
  const hops = Number(raw);
  return hops >= 1 && hops <= 5 ? hops : 0;
}

function trustedClientAddress(request: Request) {
  if (process.env.VERCEL === '1') {
    const platformAddress = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
    return platformAddress && isIP(platformAddress) ? platformAddress : 'unknown';
  }

  const trustedProxyHops = configuredTrustedProxyHops();
  if (trustedProxyHops) {
    const chain = request.headers.get('x-forwarded-for')?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
    const trustedAddress = chain.at(-trustedProxyHops);
    return trustedAddress && isIP(trustedAddress) ? trustedAddress : 'unknown';
  }

  return 'unknown';
}

function clientKey(request: Request) {
  const raw = trustedClientAddress(request);
  return createHash('sha256').update(raw).digest('hex').slice(0, 24);
}

function evictOldestCounter(store: Map<string, WindowCounter>) {
  const oldest = [...store.entries()].sort(([leftKey, left], [rightKey, right]) => {
    const timestampDifference = (left.timestamps.at(-1) ?? 0) - (right.timestamps.at(-1) ?? 0);
    return timestampDifference || leftKey.localeCompare(rightKey);
  })[0];
  if (oldest) store.delete(oldest[0]);
}

function exceedsWindow(store: Map<string, WindowCounter>, key: string, now: number, windowMs: number, limit: number, maxKeys: number) {
  const current = store.get(key)?.timestamps.filter((timestamp) => now - timestamp < windowMs) ?? [];
  if (current.length >= limit) {
    store.set(key, { timestamps: current });
    return true;
  }
  if (!store.has(key) && store.size >= maxKeys) evictOldestCounter(store);
  current.push(now);
  store.set(key, { timestamps: current });
  return false;
}

function duplicateKey(lead: LeadRequest) {
  const normalized = [lead.email, lead.phone.replace(/\D/g, ''), lead.zip, lead.market, lead.product_intent].join('|').toLowerCase();
  return createHash('sha256').update(normalized).digest('hex');
}

function cleanup(now: number) {
  for (const [key, counter] of burstCounters) {
    const timestamps = counter.timestamps.filter((timestamp) => now - timestamp < LEAD_BURST_WINDOW_MS);
    if (timestamps.length) burstCounters.set(key, { timestamps });
    else burstCounters.delete(key);
  }
  for (const [key, counter] of sustainedCounters) {
    const timestamps = counter.timestamps.filter((timestamp) => now - timestamp < LEAD_SUSTAINED_WINDOW_MS);
    if (timestamps.length) sustainedCounters.set(key, { timestamps });
    else sustainedCounters.delete(key);
  }
  for (const [key, timestamp] of duplicateKeys) if (now - timestamp >= LEAD_DUPLICATE_WINDOW_MS) duplicateKeys.delete(key);
}

async function deliverWithControls(provider: LeadDeliveryProvider, lead: LeadRequest, leadCreatedAt: string, requestId: string, now: number): Promise<DeliveryReceipt | null> {
  const circuit = circuits.get(provider.name) ?? { failures: 0 };
  if (circuit.openedAt && now - circuit.openedAt < PROVIDER_CIRCUIT_OPEN_MS) {
    emit('provider_circuit_open', { request_id: requestId, provider: provider.name });
    return null;
  }
  if (circuit.openedAt) circuits.set(provider.name, { failures: 0 });

  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout>;
  const timeoutFailure = new Promise<never>((_resolve, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error('provider timeout'));
    }, PROVIDER_TIMEOUT_MS);
  });
  try {
    const id = await Promise.race([provider.deliver(lead, leadCreatedAt, controller.signal), timeoutFailure]);
    if (!id) throw new Error('provider returned no receipt identifier');
    circuits.set(provider.name, { failures: 0 });
    emit('delivery_succeeded', { request_id: requestId, provider: provider.name });
    return { channel: provider.name, id };
  } catch {
    const prior = circuits.get(provider.name)?.failures ?? circuit.failures;
    const failures = prior + 1;
    circuits.set(provider.name, { failures, openedAt: failures >= PROVIDER_FAILURE_THRESHOLD ? now : undefined });
    emit('delivery_failed', {
      request_id: requestId,
      provider: provider.name,
      timeout: controller.signal.aborted,
      circuit_opened: failures >= PROVIDER_FAILURE_THRESHOLD,
    });
    return null;
  } finally {
    clearTimeout(timeout!);
  }
}

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

export async function handleLeadRequest(
  request: Request,
  providers: LeadDeliveryProvider[],
  options: { now?: () => number; rateStoreMaxKeys?: number } = {},
): Promise<Response> {
  const now = options.now?.() ?? Date.now();
  const requestId = randomUUID();
  const key = clientKey(request);
  cleanup(now);

  const rateStoreMaxKeys = Math.max(1, options.rateStoreMaxKeys ?? LEAD_RATE_STORE_MAX_KEYS);
  if (exceedsWindow(burstCounters, key, now, LEAD_BURST_WINDOW_MS, LEAD_BURST_LIMIT, rateStoreMaxKeys)
    || exceedsWindow(sustainedCounters, key, now, LEAD_SUSTAINED_WINDOW_MS, LEAD_SUSTAINED_LIMIT, rateStoreMaxKeys)) {
    emit('rate_limited', { request_id: requestId });
    return json({ error: 'Too many requests. Please wait and try again.' }, 429, { 'Retry-After': '60' });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > LEAD_BODY_LIMIT_BYTES) {
    emit('body_rejected', { request_id: requestId, reason: 'declared_oversize' });
    return json({ error: 'Request is too large.' }, 413);
  }

  let raw = '';
  try {
    raw = await request.text();
  } catch {
    emit('body_rejected', { request_id: requestId, reason: 'read_failure' });
    return json({ error: 'Unable to read request.' }, 400);
  }
  if (Buffer.byteLength(raw, 'utf8') > LEAD_BODY_LIMIT_BYTES) {
    emit('body_rejected', { request_id: requestId, reason: 'actual_oversize' });
    return json({ error: 'Request is too large.' }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid body');
    body = parsed as Record<string, unknown>;
  } catch {
    emit('validation_failed', { request_id: requestId, reason: 'malformed_json' });
    return json({ error: 'Please provide a valid request.' }, 400);
  }

  if (text(body.website, 200)) {
    emit('bot_rejected', { request_id: requestId, control: 'honeypot' });
    return json({ error: 'Unable to submit this request.' }, 400);
  }

  const lead = parseLead(body);
  if (!lead) {
    emit('validation_failed', { request_id: requestId, reason: 'lead_schema' });
    return json({ error: 'Please provide valid contact, ZIP, market, product intent, consent, and attribution fields.' }, 400);
  }

  const replayKey = duplicateKey(lead);
  if (duplicateKeys.has(replayKey)) {
    emit('duplicate_suppressed', { request_id: requestId });
    return json({ error: 'This request was already received recently.' }, 409);
  }
  duplicateKeys.set(replayKey, now);

  const leadCreatedAt = new Date(now).toISOString();
  const activeProviders = providers.slice(0, MAX_PROVIDER_ATTEMPTS);
  if (providers.length > MAX_PROVIDER_ATTEMPTS) emit('provider_budget_applied', { request_id: requestId, configured: providers.length, attempted: activeProviders.length });
  const settled = await Promise.all(activeProviders.map((provider) => deliverWithControls(provider, lead, leadCreatedAt, requestId, now)));
  const receipts = settled.filter((receipt): receipt is DeliveryReceipt => receipt !== null);

  if (!receipts.length) {
    duplicateKeys.delete(replayKey);
    emit('all_channels_failed', { request_id: requestId, attempted: activeProviders.length });
    return json({ error: 'Unable to save your request right now. Please try again.' }, 502);
  }

  emit('lead_accepted', { request_id: requestId, successful_channels: receipts.length });
  return json({ success: true, lead_created_at: leadCreatedAt, delivery: receipts }, 200);
}

export function resetLeadProtectionStateForTests() {
  burstCounters.clear();
  sustainedCounters.clear();
  duplicateKeys.clear();
  circuits.clear();
}

export function leadProtectionStateForTests() {
  return {
    burstKeys: [...burstCounters.keys()],
    sustainedKeys: [...sustainedCounters.keys()],
  };
}
