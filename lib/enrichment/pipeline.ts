/**
 * 🚫 SHELVED — DO NOT USE — 2026-04-19
 *
 * This module is part of the abandoned Phase 2 lead enrichment pipeline.
 * Diagnostic test (Step 6) proved that property enrichment via Firecrawl
 * does not return usable data from county assessors, Zillow, or utilities.
 *
 * Why: URL-guessing patterns can't reach real parcel/property data on these
 * sources. County assessor pages return search forms, Zillow is JS-rendered
 * and hostile to scrapers, utility rate pages are PDFs.
 *
 * Decision: Property enrichment removed from SREnergy strategy. Sales reps
 * can look up Zillow on mobile during the call instead. Enrichment was not
 * needed for the "no credit check" value proposition anyway.
 *
 * See: docs/decisions/001-enrichment-shelved.md
 *
 * If reviving: scope it to one well-structured public source (DSIRE, US
 * Census API, etc.) — NOT three-source merge across hostile platforms.
 */
import { firecrawl } from '../firecrawl';
import { updateSalesCRMLead } from '../notion';
import { ENRICHMENT_PROMPT } from '../firecrawl-prompts';
import type { PropertyEnrichment, SalesCRMEnrichmentUpdate } from '../firecrawl.types';
import {
  buildZillowSearchUrl,
  resolveCountyAssessorUrl,
  resolveUtilityRateUrl,
} from './utah-lookup';

// NOTE: Firecrawl's extract() endpoint requires URLs — it does not accept raw
// markdown strings. The scrape step below captures markdown for context, but
// extract() re-fetches each URL independently. Revisit in Step 9 when we
// evaluate passing pre-scraped content to avoid duplicate credit spend.

function makeStatusUpdate(
  status: SalesCRMEnrichmentUpdate['Enrichment Status'],
  notes?: string,
): SalesCRMEnrichmentUpdate {
  return {
    'Home Value Est': null,
    'Roof Size Est (sqft)': null,
    'Year Built': null,
    'Roof Orientation': null,
    'Avg Utility Bill Est': null,
    'Utility Company': null,
    'Enrichment Status': status,
    'Enrichment Raw JSON': '',
    'Enrichment Source URLs': '',
    ...(notes ? { Notes: notes } : {}),
  };
}

export async function enrichLead(
  leadId: string,
  address: string,
  zip: string,
  state: string,
): Promise<void> {
  await updateSalesCRMLead(leadId, makeStatusUpdate('In Progress'));

  if (state !== 'UT' && state.toLowerCase() !== 'utah') {
    await updateSalesCRMLead(leadId, makeStatusUpdate('Skipped'));
    return;
  }

  try {
    const urlEntries = [
      { url: resolveCountyAssessorUrl(zip), priority: 0 },
      { url: buildZillowSearchUrl(address, zip), priority: 1 },
      { url: resolveUtilityRateUrl(zip), priority: 2 },
    ].filter((e): e is { url: string; priority: number } => e.url !== null);

    const scrapeResults = await Promise.allSettled(
      urlEntries.map((e) => firecrawl.scrape(e.url)),
    );

    const successfulEntries: Array<{ url: string; priority: number }> = [];
    const markdownParts: string[] = [];

    scrapeResults.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        successfulEntries.push(urlEntries[i]);
        markdownParts.push(`## Source: ${urlEntries[i].url}\n\n${result.value.markdown}`);
      } else {
        console.error(`[enrichment] Scrape failed for ${urlEntries[i].url}:`, result.reason);
      }
    });

    const extractResults = await Promise.allSettled(
      successfulEntries.map((e) =>
        firecrawl.extract<PropertyEnrichment>({
          url: e.url,
          schema: ENRICHMENT_PROMPT.schema,
          prompt: ENRICHMENT_PROMPT.prompt,
        }),
      ),
    );

    // Merge: apply lowest priority (utility) first so highest priority (county) wins
    const pairs = successfulEntries
      .map((entry, i) => ({
        priority: entry.priority,
        data: extractResults[i].status === 'fulfilled' ? extractResults[i].value : null,
      }))
      .sort((a, b) => b.priority - a.priority);

    const merged: PropertyEnrichment = {
      homeValueEst: null,
      roofSizeEstSqft: null,
      yearBuilt: null,
      roofOrientation: null,
      avgUtilityBillEst: null,
      utilityCompany: null,
      sourceUrls: successfulEntries.map((e) => e.url),
    };

    for (const { data } of pairs) {
      if (!data) continue;
      if (data.homeValueEst !== null) merged.homeValueEst = data.homeValueEst;
      if (data.roofSizeEstSqft !== null) merged.roofSizeEstSqft = data.roofSizeEstSqft;
      if (data.yearBuilt !== null) merged.yearBuilt = data.yearBuilt;
      if (data.roofOrientation !== null) merged.roofOrientation = data.roofOrientation;
      if (data.avgUtilityBillEst !== null) merged.avgUtilityBillEst = data.avgUtilityBillEst;
      if (data.utilityCompany !== null) merged.utilityCompany = data.utilityCompany;
    }

    await updateSalesCRMLead(leadId, {
      'Home Value Est': merged.homeValueEst,
      'Roof Size Est (sqft)': merged.roofSizeEstSqft,
      'Year Built': merged.yearBuilt,
      'Roof Orientation': merged.roofOrientation,
      'Avg Utility Bill Est': merged.avgUtilityBillEst,
      'Utility Company': merged.utilityCompany,
      'Enrichment Status': 'Complete',
      'Enrichment Raw JSON': JSON.stringify(merged),
      'Enrichment Source URLs': successfulEntries.map((e) => e.url).join(', '),
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[enrichment] enrichLead failed:', errorMsg);
    await updateSalesCRMLead(leadId, makeStatusUpdate('Failed', errorMsg));
  }
}
