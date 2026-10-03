import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATES } from '../lib/locations';
import { getLegacyUrlDisposition, isServiceTerritory } from '../lib/serviceTerritories';

const BASE_URL = 'https://srenergy.us';
const PRODUCTS = ['solar', 'battery', 'ev-charger', 'texas-vpp'] as const;
const outputDir = join(process.cwd(), 'docs', 'seo');

type Row = {
  url: string;
  routeKind: string;
  state: string;
  territoryStatus: string;
  currentDiscovery: string;
  disposition: string;
  notes: string;
};

const rows: Row[] = [];
const add = (row: Row) => rows.push(row);

for (const route of ['/', '/how-it-works', '/contact', '/locations/', '/products/solar', '/products/battery', '/products/ev-charger', '/privacy-policy', '/terms-of-service']) {
  add({
    url: `${BASE_URL}${route}`,
    routeKind: 'static-page',
    state: '',
    territoryStatus: 'N/A',
    currentDiscovery: ['/privacy-policy', '/terms-of-service'].includes(route) ? 'ROUTE_ONLY' : 'SITEMAP',
    disposition: 'PRESERVE_EXISTING',
    notes: '',
  });
}

for (const route of ['/products/texas-vpp', '/calculator', '/faq', '/privacy']) {
  add({
    url: `${BASE_URL}${route}`,
    routeKind: 'sitemap-only',
    state: '',
    territoryStatus: 'N/A',
    currentDiscovery: 'SITEMAP_NO_MATCHING_APP_PAGE',
    disposition: 'HOLD_DATA_REQUIRED',
    notes: 'Do not redirect or remove until GSC/backlink evidence is reviewed.',
  });
}

for (const state of STATES) {
  const supported = isServiceTerritory(state.abbr);
  const territoryStatus = supported ? 'SUPPORTED' : 'LEGACY_UNSUPPORTED';
  const disposition = getLegacyUrlDisposition(state.abbr);

  add({
    url: `${BASE_URL}/locations/${state.slug}/`,
    routeKind: 'state',
    state: state.abbr,
    territoryStatus,
    currentDiscovery: 'SITEMAP',
    disposition,
    notes: supported ? '' : 'HOLD — DATA REQUIRED; preserve URL.',
  });

  for (const city of state.cities) {
    const cityPath = `/locations/${state.slug}/${city.slug}/`;
    add({
      url: `${BASE_URL}${cityPath}`,
      routeKind: 'city',
      state: state.abbr,
      territoryStatus,
      currentDiscovery: 'SITEMAP',
      disposition,
      notes: supported ? '' : 'HOLD — DATA REQUIRED; preserve URL.',
    });

    for (const product of PRODUCTS) {
      const productDisposition = getLegacyUrlDisposition(state.abbr, product);
      add({
        url: `${BASE_URL}${cityPath}${product}/`,
        routeKind: 'city-product',
        state: state.abbr,
        territoryStatus,
        currentDiscovery: product === 'texas-vpp' && state.abbr === 'TX' ? 'SITEMAP' : 'GENERATED_NOT_SITEMAPPED',
        disposition: product === 'texas-vpp' && state.abbr !== 'TX' ? 'HOLD_DATA_REQUIRED' : productDisposition,
        notes: product === 'texas-vpp'
          ? (state.abbr === 'TX' ? 'Preserve URL; all VPP claims require evidence review.' : 'Catch-all currently generates a non-Texas VPP page; do not publish or retire without evidence.')
          : (supported ? '' : 'HOLD — DATA REQUIRED; preserve URL.'),
      });
    }
  }
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

const headers = ['url', 'routeKind', 'state', 'territoryStatus', 'currentDiscovery', 'disposition', 'notes'] as const;
const csv = [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
].join('\n') + '\n';
writeFileSync(join(outputDir, 'url-inventory.csv'), csv);

const matrix = `route_family,current_state,phase_1_disposition,evidence_required,next_action\n` +
  `"Supported legacy state/city/product URLs","Live/generatable","PRESERVE_SUPPORTED","GSC coverage and backlink export","Keep unchanged in Phase 1"\n` +
  `"Unsupported legacy state/city/product URLs","Live/generatable","HOLD_DATA_REQUIRED","GSC impressions/clicks/indexing and backlink export","Preserve; decide redirect/noindex/retire only after evidence"\n` +
  `"Washington DC territory","Authoritative territory absent from legacy dataset","HOLD_DATA_REQUIRED","Approved city/service scope and URL naming","Add only in a later implementation after scope approval"\n` +
  `"Texas VPP URLs","Live/generatable and sitemapped","PRESERVE_CLAIMS_REVIEW","Executed program terms, utility rules, warranty, consented proof","Preserve URLs; review or qualify copy before acquisition"\n` +
  `"Non-Texas texas-vpp catch-all URLs","Generatable but not sitemapped","HOLD_DATA_REQUIRED","GSC/indexing/backlink evidence plus product applicability","Do not promote; do not delete until evidence review"\n` +
  `"Sitemap-only URLs with no app page","Published in sitemap","HOLD_DATA_REQUIRED","GSC/indexing/backlink evidence and intended destination","Do not redirect/remove in Phase 1"\n`;
writeFileSync(join(outputDir, 'legacy-migration-matrix.csv'), matrix);

const counts = rows.reduce<Record<string, number>>((acc, row) => {
  acc[row.routeKind] = (acc[row.routeKind] ?? 0) + 1;
  return acc;
}, {});
console.log(JSON.stringify({ total: rows.length, byRouteKind: counts }, null, 2));
