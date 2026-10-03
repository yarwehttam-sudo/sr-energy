import { readFileSync } from 'node:fs';
import { STATES } from '../lib/locations';
import { SERVICE_TERRITORIES, isServiceTerritory } from '../lib/serviceTerritories';
import { CLAIMS_REGISTRY, validateClaimsRegistry } from '../lib/claimsRegistry';

const root = process.cwd();
const read = (path: string) => readFileSync(`${root}/${path}`, 'utf8');
const sitemap = read('app/sitemap.ts');
const robots = read('app/robots.ts');
const sources = [
  read('app/layout.tsx'),
  read('app/page.tsx'),
  read('app/locations/page.tsx'),
  read('app/locations/[state]/page.tsx'),
  read('app/locations/[state]/[city]/page.tsx'),
  read('app/locations/[state]/[city]/[product]/page.tsx'),
  read('app/locations/texas/[city]/texas-vpp/page.tsx'),
  read('app/products/solar/page.tsx'),
  read('app/products/battery/page.tsx'),
  read('app/products/ev-charger/page.tsx'),
  read('app/contact/page.tsx'),
  read('app/privacy-policy/page.tsx'),
  read('app/terms-of-service/page.tsx'),
];

const cityCount = STATES.reduce((total, state) => total + state.cities.length, 0);
const unsupportedStates = STATES.filter(({ abbr }) => !isServiceTerritory(abbr)).map(({ abbr }) => abbr);
const canonicalDomains = [...new Set(sources.flatMap((source) => source.match(/https:\/\/srenergy\.(?:com|us)/g) ?? []))];
const warnings = [
  `Legacy locations contain ${STATES.length} states and ${cityCount} cities; authoritative scope has ${SERVICE_TERRITORIES.length} territories.`,
  `Legacy unsupported states: ${unsupportedStates.join(', ')}.`,
  'Washington DC is authoritative but absent from the legacy location dataset.',
  `Canonical hosts in source: ${canonicalDomains.join(', ')}.`,
  robots.includes('https://srenergy.com/sitemap.xml') && sitemap.includes("https://srenergy.us")
    ? 'robots sitemap host (.com) differs from generated sitemap host (.us).'
    : 'robots/sitemap host mismatch not detected.',
  'Sitemap includes routes with no matching app page: /products/texas-vpp, /calculator, /faq, /privacy.',
  `City-product generator can emit ${cityCount * 4} paths, while sitemap includes only the ${STATES.find(({ abbr }) => abbr === 'TX')?.cities.length ?? 0} dedicated Texas VPP paths.`,
  'No analytics tag/provider was found in the reviewed app sources.',
];

const errors = validateClaimsRegistry();
if (canonicalDomains.length !== 2) errors.push('Expected the documented .com/.us canonical split to be detectable.');
if (SERVICE_TERRITORIES.length !== 20) errors.push('Service territory count is not 20.');
if (!sitemap.includes('TEXAS.cities')) errors.push('Texas VPP preservation is missing from sitemap generation.');
if (!robots.includes("disallow: ['/api/', '/thank-you', '/_next/']")) errors.push('Expected robots protections changed.');
if (CLAIMS_REGISTRY.length === 0) errors.push('Claims registry is empty.');

console.log('SEO foundation audit');
console.log(`states=${STATES.length} cities=${cityCount} territories=${SERVICE_TERRITORIES.length} claims=${CLAIMS_REGISTRY.length}`);
for (const warning of warnings) console.log(`HOLD: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log('PASS: foundation invariants hold; acquisition remains HOLD pending research/GSC.');
}
