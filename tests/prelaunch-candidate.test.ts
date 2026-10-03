import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import sitemap from '../app/sitemap';
import { SERVICE_TERRITORIES } from '../lib/serviceTerritories';
import { ATTRIBUTION_KEYS, LEAD_MILESTONES, PRODUCT_INTENTS } from '../lib/acquisition';
import { CLAIMS_REGISTRY, isClaimPublishable } from '../lib/claimsRegistry';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sourceFiles = (directory: string): string[] => readdirSync(new URL(`../${directory}`, import.meta.url), { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? sourceFiles(`${directory}/${entry.name}`)
    : entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')
      ? [`${directory}/${entry.name}`]
      : []);
// Exact-host exceptions must be source files with a reason. There are currently none.
const LEGITIMATE_SR_ENERGY_DOT_COM_EXCEPTIONS: Readonly<Record<string, string>> = {};
const activePages = [
  'app/layout.tsx', 'app/page.tsx', 'app/components/HomePageClient.tsx',
  'app/components/ProductLanding.tsx', 'app/components/LeadCaptureForm.tsx',
  'app/contact/page.tsx', 'app/locations/page.tsx',
  'app/locations/[state]/page.tsx', 'app/locations/[state]/[city]/page.tsx',
  'app/locations/[state]/[city]/[product]/page.tsx',
  'app/locations/texas/[city]/texas-vpp/page.tsx',
  'app/products/solar/page.tsx', 'app/products/battery/page.tsx',
  'app/products/ev-charger/page.tsx', 'app/how-it-works/page.tsx',
].map(read).join('\n');

test('candidate exposes three independent product intents and routes', () => {
  assert.deepEqual(PRODUCT_INTENTS, ['solar', 'battery', 'ev-charging']);
  for (const route of ['/products/solar', '/products/battery', '/products/ev-charger']) assert.match(activePages, new RegExp(route.replace('/', '\\/')));
});

test('lead schema preserves first/latest attribution and downstream milestone slots', () => {
  assert.deepEqual(ATTRIBUTION_KEYS, ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','msclkid']);
  assert.deepEqual(LEAD_MILESTONES, ['lead_created_at','contacted_at','qualified_at','appointment_booked_at','proposal_sent_at','closed_won_at','closed_lost_at']);
  const form = read('app/components/LeadCaptureForm.tsx');
  const api = read('app/api/contact/route.ts');
  for (const token of ['first_touch', 'latest_touch', 'landing_page', 'referrer']) assert.match(`${form}\n${api}`, new RegExp(token));
  for (const token of ['zip', 'market', 'product_intent', 'consent', 'lead_created_at', 'milestones']) assert.match(api, new RegExp(token));
  assert.doesNotMatch(`${form}\n${api}`, /HeyAgain|proposal automation/i);
  assert.match(api, /if \(!emailId && !notionPageId\)/);
  assert.match(api, /status: 502/);
});

test('lead form has labelled required controls and responsive layout guards', () => {
  const form = read('app/components/LeadCaptureForm.tsx');
  for (const id of ['product_intent', 'zip', 'market', 'name', 'phone', 'email']) {
    assert.match(form, new RegExp(`htmlFor=\\"${id}\\"`));
    assert.match(form, new RegExp(`id=\\"${id}\\"`));
  }
  assert.match(form, /aria-label="Home energy request"/);
  assert.match(form, /role="alert"/);
  assert.match(form, /sm:grid-cols-2/);
  assert.match(read('app/layout.tsx'), /href="#main-content"/);
});

test('claims remain held and are not publishable', () => {
  assert.ok(CLAIMS_REGISTRY.every((claim) => claim.status === 'HOLD_DATA_REQUIRED'));
  assert.ok(CLAIMS_REGISTRY.every((claim) => !isClaimPublishable(claim)));
  assert.ok(CLAIMS_REGISTRY.every((claim) => claim.geographies.length && claim.products.length && claim.guardrail));
});

test('canonical, sitemap and robots use srenergy.us only', () => {
  const sources = `${activePages}\n${read('app/sitemap.ts')}\n${read('app/robots.ts')}`;
  assert.doesNotMatch(sources, /https:\/\/srenergy\.com/);
  assert.match(sources, /https:\/\/srenergy\.us/);
  const urls = sitemap().map((entry) => entry.url);
  assert.equal(urls.length, 182);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every((url) => url.startsWith('https://srenergy.us/')));
  for (const invalid of ['/products/texas-vpp', '/calculator', '/faq', '/privacy']) assert.ok(!urls.some((url) => new URL(url).pathname === invalid));
  for (const city of ['houston', 'san-antonio', 'dallas', 'austin', 'fort-worth']) assert.ok(urls.includes(`https://srenergy.us/locations/texas/${city}/texas-vpp`));
});

test('active website sources use the selected srenergy.us host', () => {
  const staleHostFiles = [...sourceFiles('app'), ...sourceFiles('lib')]
    .filter((path) => /(?:https?:\/\/)?(?:www\.)?srenergy\.com\b/i.test(read(path)))
    .filter((path) => !LEGITIMATE_SR_ENERGY_DOT_COM_EXCEPTIONS[path]);
  assert.deepEqual(staleHostFiles, []);
  for (const [path, reason] of Object.entries(LEGITIMATE_SR_ENERGY_DOT_COM_EXCEPTIONS)) {
    assert.ok(reason.trim(), `Host exception ${path} must document a reason.`);
  }
  assert.equal(read('lib/businessInfo.ts').match(/https:\/\/srenergy\.us/g)?.length, 1);
  assert.match(read('app/terms-of-service/page.tsx'), /located at <strong>srenergy\.us<\/strong>/);
});

test('authoritative selector comes from the single typed 20-territory config', () => {
  const form = read('app/components/LeadCaptureForm.tsx');
  const hub = read('app/locations/page.tsx');
  assert.equal(SERVICE_TERRITORIES.length, 20);
  assert.ok(SERVICE_TERRITORIES.some((territory) => territory.code === 'DC'));
  assert.match(form, /SERVICE_TERRITORIES\.map/);
  assert.match(hub, /SERVICE_TERRITORIES\.map/);
});

test('legacy surfaces use preservation language without irreversible directives', () => {
  const legacy = [read('app/locations/[state]/page.tsx'), read('app/locations/[state]/[city]/page.tsx'), read('app/locations/[state]/[city]/[product]/page.tsx'), read('app/locations/texas/[city]/texas-vpp/page.tsx')].join('\n');
  assert.match(legacy, /Preserved legacy URL|preserved/i);
  assert.doesNotMatch(legacy, /redirect\(|permanentRedirect\(|robots:\s*\{\s*index:\s*false|<meta[^>]+noindex/i);
});
