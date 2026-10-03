export const PRODUCT_INTENTS = ['solar', 'battery', 'ev-charging'] as const;
export type ProductIntent = (typeof PRODUCT_INTENTS)[number];

export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'msclkid',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type AttributionFields = Partial<Record<AttributionKey, string>> & {
  landing_page: string;
  referrer: string;
  captured_at: string;
};

export interface LeadAttribution {
  first_touch: AttributionFields;
  latest_touch: AttributionFields;
}

export const LEAD_MILESTONES = [
  'lead_created_at',
  'contacted_at',
  'qualified_at',
  'appointment_booked_at',
  'proposal_sent_at',
  'closed_won_at',
  'closed_lost_at',
] as const;

export type LeadMilestone = (typeof LEAD_MILESTONES)[number];

export interface AcquisitionLead {
  name: string;
  email: string;
  phone: string;
  zip: string;
  market: string;
  product_intent: ProductIntent;
  homeowner?: boolean;
  consent: true;
  attribution: LeadAttribution;
  lead_created_at: string;
  milestones: Partial<Record<Exclude<LeadMilestone, 'lead_created_at'>, string>>;
}

export function isProductIntent(value: string): value is ProductIntent {
  return PRODUCT_INTENTS.includes(value as ProductIntent);
}

export function sanitizeAttributionValue(value: unknown, maxLength = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}
