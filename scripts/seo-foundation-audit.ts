import { readFileSync } from 'node:fs';
import sitemap from '../app/sitemap';
import { STATES } from '../lib/locations';
import { SERVICE_TERRITORIES, isServiceTerritory } from '../lib/serviceTerritories';
import { CLAIMS_REGISTRY, validateClaimsRegistry } from '../lib/claimsRegistry';

const read = (path: string) => readFileSync(`${process.cwd()}/${path}`, 'utf8');
const sourcePaths = ['app/layout.tsx','app/page.tsx','app/components/LeadCaptureForm.tsx','app/api/contact/route.ts','app/locations/page.tsx','app/locations/[state]/page.tsx','app/locations/[state]/[city]/page.tsx','app/locations/[state]/[city]/[product]/page.tsx','app/locations/texas/[city]/texas-vpp/page.tsx','app/products/solar/page.tsx','app/products/battery/page.tsx','app/products/ev-charger/page.tsx','app/contact/page.tsx','app/privacy-policy/page.tsx','app/terms-of-service/page.tsx','app/sitemap.ts','app/robots.ts'];
const sources = sourcePaths.map(read).join('\n');
const urls = sitemap().map((entry) => entry.url);
const errors = validateClaimsRegistry();
const unsupportedStates = STATES.filter(({ abbr }) => !isServiceTerritory(abbr)).map(({ abbr }) => abbr);

if (SERVICE_TERRITORIES.length !== 20 || !SERVICE_TERRITORIES.some(({ code }) => code === 'DC')) errors.push('Authoritative territory config must contain 19 states plus DC.');
if (STATES.length !== 30) errors.push('Legacy state inventory changed; preserve all 30 routes.');
if (sources.includes('https://srenergy.com')) errors.push('Active canonical/SEO source still references srenergy.com.');
if (!sources.includes('https://srenergy.us')) errors.push('srenergy.us canonical base is missing.');
if (urls.length !== new Set(urls).size) errors.push('Sitemap contains duplicate URLs.');
if (urls.some((url) => ['/products/texas-vpp','/calculator','/faq','/privacy'].includes(new URL(url).pathname))) errors.push('Sitemap contains a known 404-only route.');
if (!urls.some((url) => url.endsWith('/locations/texas/houston/texas-vpp'))) errors.push('Texas VPP preservation is missing from sitemap.');
if (!sources.includes('first_touch') || !sources.includes('latest_touch')) errors.push('Attribution architecture is missing.');
if (!sources.includes('lead_created_at')) errors.push('Lead-created event timestamp is missing.');

console.log('SEO pre-launch candidate audit');
console.log(`legacy_states=${STATES.length} legacy_cities=${STATES.reduce((sum, state) => sum + state.cities.length, 0)} territories=${SERVICE_TERRITORIES.length} claims=${CLAIMS_REGISTRY.length} sitemap_urls=${urls.length}`);
console.log(`HOLD: legacy unsupported states remain preserved: ${unsupportedStates.join(', ')}`);
console.log('HOLD: GSC, backlink exports, paid keyword metrics, signed program documents, and numeric production CWV remain unavailable.');
if (errors.length) { for (const error of errors) console.error(`ERROR: ${error}`); process.exitCode = 1; } else console.log('PASS: candidate invariants hold; launch remains HOLD pending external evidence.');