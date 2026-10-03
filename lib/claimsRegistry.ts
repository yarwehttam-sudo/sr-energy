export type ClaimReviewStatus = 'APPROVED' | 'HOLD_DATA_REQUIRED' | 'PROHIBITED';

export interface ClaimEvidence {
  label: string;
  url: string;
  verifiedAt: string;
}

export interface ClaimRegistryEntry {
  id: string;
  summary: string;
  scopes: readonly string[];
  status: ClaimReviewStatus;
  requiredEvidence: readonly string[];
  evidence: readonly ClaimEvidence[];
}

/**
 * Phase 1 inventory only. A claim may not become APPROVED until evidence is
 * attached and independently reviewed. Runtime copy is intentionally unchanged.
 */
export const CLAIMS_REGISTRY: readonly ClaimRegistryEntry[] = [
  {
    id: 'service.30-states',
    summary: 'SR Energy serves 30 or 30+ states.',
    scopes: ['sitewide', '/locations/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Current signed service-territory confirmation'],
    evidence: [],
  },
  {
    id: 'financing.no-credit-check',
    summary: 'No credit check or no-FICO financing is available.',
    scopes: ['sitewide', '/locations/**', '/products/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Current financing program terms', 'Territory/product eligibility rules'],
    evidence: [],
  },
  {
    id: 'vpp.free-battery',
    summary: 'Eligible Texas homeowners receive a free or $0 battery.',
    scopes: ['/locations/texas/**/texas-vpp/**', '/products/battery'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Executed VPP program terms', 'Utility and address eligibility rules'],
    evidence: [],
  },
  {
    id: 'vpp.20-year-terms',
    summary: 'VPP includes a 20-year term, warranty, ownership, or capacity guarantee.',
    scopes: ['/locations/texas/**/texas-vpp/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Executed customer agreement', 'Manufacturer warranty'],
    evidence: [],
  },
  {
    id: 'vpp.zip-eligibility',
    summary: 'A ZIP-code match establishes or strongly implies VPP eligibility.',
    scopes: ['/locations/texas/**/texas-vpp/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Authoritative utility territory dataset', 'Address-level eligibility disclaimer'],
    evidence: [],
  },
  {
    id: 'reviews.testimonials',
    summary: 'Named testimonials and location-specific customer experiences are genuine.',
    scopes: ['/locations/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Customer consent', 'Source record for every testimonial'],
    evidence: [],
  },
  {
    id: 'reviews.aggregate-rating',
    summary: 'SR Energy has a 4.9 rating from 127 reviews.',
    scopes: ['/locations/**', 'structured-data'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Public review profile matching rating and count'],
    evidence: [],
  },
  {
    id: 'experience.13-years',
    summary: 'SR Energy has 13 years of experience.',
    scopes: ['sitewide', '/locations/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Business formation or operating-history evidence'],
    evidence: [],
  },
  {
    id: 'response.within-hour',
    summary: 'A person will respond within one hour.',
    scopes: ['/contact', '/locations'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Documented and monitored response-time SLA'],
    evidence: [],
  },
  {
    id: 'incentive.federal-itc-30',
    summary: 'A 30% federal Investment Tax Credit is currently available.',
    scopes: ['/locations/**'],
    status: 'HOLD_DATA_REQUIRED',
    requiredEvidence: ['Current IRS guidance', 'Tax eligibility disclaimer'],
    evidence: [],
  },
] as const;

export function validateClaimsRegistry(
  entries: readonly ClaimRegistryEntry[] = CLAIMS_REGISTRY,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const entry of entries) {
    if (ids.has(entry.id)) errors.push(`Duplicate claim id: ${entry.id}`);
    ids.add(entry.id);

    if (entry.status === 'APPROVED' && entry.evidence.length === 0) {
      errors.push(`Approved claim has no evidence: ${entry.id}`);
    }
  }

  return errors;
}
