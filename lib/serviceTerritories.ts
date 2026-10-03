export const SERVICE_TERRITORIES = [
  { code: 'CA', name: 'California', slug: 'california' },
  { code: 'CO', name: 'Colorado', slug: 'colorado' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut' },
  { code: 'DE', name: 'Delaware', slug: 'delaware' },
  { code: 'IL', name: 'Illinois', slug: 'illinois' },
  { code: 'IA', name: 'Iowa', slug: 'iowa' },
  { code: 'MD', name: 'Maryland', slug: 'maryland' },
  { code: 'MI', name: 'Michigan', slug: 'michigan' },
  { code: 'MT', name: 'Montana', slug: 'montana' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey' },
  { code: 'OH', name: 'Ohio', slug: 'ohio' },
  { code: 'OR', name: 'Oregon', slug: 'oregon' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island' },
  { code: 'TX', name: 'Texas', slug: 'texas' },
  { code: 'VA', name: 'Virginia', slug: 'virginia' },
  { code: 'WA', name: 'Washington', slug: 'washington' },
  { code: 'DC', name: 'Washington, DC', slug: 'washington-dc' },
] as const;

export type ServiceTerritory = (typeof SERVICE_TERRITORIES)[number];
export type ServiceTerritoryCode = ServiceTerritory['code'];
export type LegacyUrlDisposition =
  | 'PRESERVE_SUPPORTED'
  | 'PRESERVE_CLAIMS_REVIEW'
  | 'HOLD_DATA_REQUIRED';

const SERVICE_TERRITORY_CODES = new Set<string>(
  SERVICE_TERRITORIES.map((territory) => territory.code),
);

export function isServiceTerritory(code: string): code is ServiceTerritoryCode {
  return SERVICE_TERRITORY_CODES.has(code.toUpperCase());
}

/**
 * This is an SEO migration classification, not a router guard. It deliberately
 * preserves every legacy URL until GSC/backlink evidence supports a migration.
 */
export function getLegacyUrlDisposition(
  stateCode: string,
  product?: string,
): LegacyUrlDisposition {
  const normalizedCode = stateCode.toUpperCase();

  if (normalizedCode === 'TX' && product === 'texas-vpp') {
    return 'PRESERVE_CLAIMS_REVIEW';
  }

  return isServiceTerritory(normalizedCode)
    ? 'PRESERVE_SUPPORTED'
    : 'HOLD_DATA_REQUIRED';
}
