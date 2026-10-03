export type ClaimReviewStatus = 'APPROVED' | 'HOLD_DATA_REQUIRED' | 'PROHIBITED';
export type ClaimProduct = 'sitewide' | 'solar' | 'battery' | 'ev-charging' | 'vpp';

export interface ClaimSource { label: string; url: string; publisher: string; accessedAt: string; }
export interface ClaimRegistryEntry {
  id: string;
  summary: string;
  status: ClaimReviewStatus;
  geographies: readonly string[];
  products: readonly ClaimProduct[];
  sources: readonly ClaimSource[];
  requiredEvidence: readonly string[];
  verifiedAt: string | null;
  reviewBy: string | null;
  guardrail: string;
}

const hold = (entry: Omit<ClaimRegistryEntry, 'status' | 'sources' | 'verifiedAt' | 'reviewBy'>): ClaimRegistryEntry => ({ ...entry, status: 'HOLD_DATA_REQUIRED', sources: [], verifiedAt: null, reviewBy: null });

/** Runtime claims policy: only APPROVED, sourced and in-review-date entries may be published. */
export const CLAIMS_REGISTRY: readonly ClaimRegistryEntry[] = [
  hold({ id: 'service.territory', summary: 'Service is available across the listed footprint.', geographies: ['CA','CO','CT','DE','IL','IA','MD','MI','MT','NE','NH','NJ','OH','OR','PA','RI','TX','VA','WA','DC'], products: ['sitewide'], requiredEvidence: ['Signed product-by-territory confirmation'], guardrail: 'Describe the footprint as accepting availability reviews; require address and product confirmation.' }),
  hold({ id: 'financing.no-credit-check', summary: 'No-credit-check or no-FICO financing is available.', geographies: ['US'], products: ['solar','battery','ev-charging'], requiredEvidence: ['Current financing terms','Territory and product eligibility'], guardrail: 'Do not state or imply approval, universal eligibility, $0 down or any credit policy.' }),
  hold({ id: 'savings.performance', summary: 'A project will reduce bills, save a stated amount or meet an offset.', geographies: ['US'], products: ['solar','battery','ev-charging'], requiredEvidence: ['Documented methodology','Property inputs','Utility tariff','Customer disclaimer'], guardrail: 'Do not publish numeric savings, payback, bill reduction or performance promises.' }),
  hold({ id: 'equipment.warranty', summary: 'Equipment type, brand, capacity, lifespan or warranty terms.', geographies: ['US'], products: ['solar','battery','ev-charging'], requiredEvidence: ['Executed supplier terms','Current manufacturer specification and warranty'], guardrail: 'Discuss categories and review factors only; provide equipment and warranty terms in writing for a property.' }),
  hold({ id: 'installation.timeline', summary: 'Installation or activation will occur within a stated period.', geographies: ['US'], products: ['solar','battery','ev-charging'], requiredEvidence: ['Documented operational SLA by market and product'], guardrail: 'Do not promise assessment, permitting, installation or activation timing.' }),
  hold({ id: 'vpp.participation', summary: 'SR Energy operates or participates in a Texas VPP.', geographies: ['TX'], products: ['vpp','battery'], requiredEvidence: ['Executed program agreement','Operator identity and role','Current customer terms'], guardrail: 'Explain VPPs generally and state that SR Energy participation is unverified.' }),
  hold({ id: 'vpp.cost-credit-ownership', summary: 'A Texas VPP includes free equipment, bill credits, ownership, fixed fees or a warranty.', geographies: ['TX'], products: ['vpp','battery'], requiredEvidence: ['Executed customer agreement','Utility/REP terms','Manufacturer warranty'], guardrail: 'Do not claim free/no-cost equipment, credits, ownership, capacity, fees or warranty.' }),
  hold({ id: 'vpp.eligibility', summary: 'A ZIP code, utility or city establishes VPP eligibility.', geographies: ['TX'], products: ['vpp','battery'], requiredEvidence: ['Current address-level eligibility dataset','Program terms'], guardrail: 'A ZIP is an intake field only; never present it as an eligibility decision.' }),
  hold({ id: 'incentives.programs', summary: 'An incentive, tax credit, rebate, export rate or net-metering term is available.', geographies: ['US'], products: ['solar','battery','ev-charging','vpp'], requiredEvidence: ['Current official program page','Eligibility and expiration terms','Geography/product mapping'], guardrail: 'Do not publish program amounts or availability without current official evidence and dated review.' }),
  hold({ id: 'reviews.experience-certification', summary: 'Testimonials, ratings, experience, licensing or certification claims.', geographies: ['US'], products: ['sitewide'], requiredEvidence: ['Consent and source records','License records','Business history evidence'], guardrail: 'Do not publish reviews, ratings, years, license or certification claims until verified.' }),
] as const;

export function isClaimPublishable(entry: ClaimRegistryEntry, onDate = new Date()): boolean { return entry.status === 'APPROVED' && entry.sources.length > 0 && !!entry.verifiedAt && !!entry.reviewBy && new Date(entry.reviewBy) >= onDate; }

export function validateClaimsRegistry(entries: readonly ClaimRegistryEntry[] = CLAIMS_REGISTRY): string[] {
  const errors: string[] = []; const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) errors.push(`Duplicate claim id: ${entry.id}`); ids.add(entry.id);
    if (!entry.geographies.length || !entry.products.length || !entry.requiredEvidence.length || !entry.guardrail) errors.push(`Incomplete claim governance: ${entry.id}`);
    if (entry.status === 'APPROVED' && !isClaimPublishable(entry)) errors.push(`Approved claim is not publishable: ${entry.id}`);
  }
  return errors;
}