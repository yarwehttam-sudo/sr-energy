/**
 * Diagnostic script — one-off enrichment pipeline test.
 * Writes NO data to Notion or the Firecrawl Ops DB.
 * Results are saved to diagnostics/enrichment-test-<timestamp>.json (gitignored).
 *
 * Usage: npx tsx scripts/test-enrichment.ts
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import FirecrawlApp from '@mendable/firecrawl-js';
import {
  buildZillowSearchUrl,
  resolveCountyAssessorUrl,
  resolveUtilityRateUrl,
} from '../lib/enrichment/utah-lookup';
import { ENRICHMENT_PROMPT } from '../lib/firecrawl-prompts';
import type { PropertyEnrichment } from '../lib/firecrawl.types';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
if (!FIRECRAWL_API_KEY) {
  console.error('FIRECRAWL_API_KEY is not set in .env.local');
  process.exit(1);
}

const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// ─── Prompt helper ────────────────────────────────────────────────────────────

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrapeResult {
  url: string;
  label: string;
  success: boolean;
  markdownLength: number;
  markdownPreview: string;
  error?: string;
  creditsUsed: number;
}

interface ExtractResult {
  url: string;
  label: string;
  success: boolean;
  data: PropertyEnrichment | null;
  nullFields: string[];
  presentFields: string[];
  error?: string;
  creditsUsed: number;
}

interface DiagnosticReport {
  timestamp: string;
  address: string;
  zip: string;
  state: string;
  resolvedUrls: Record<string, string | null>;
  scrapeResults: ScrapeResult[];
  extractResults: ExtractResult[];
  summary: {
    totalCredits: number;
    perSource: Array<{
      label: string;
      url: string | null;
      scrapeStatus: 'success' | 'failed' | 'skipped';
      extractStatus: 'success' | 'failed' | 'skipped';
      fieldsReturned: string[];
      recommendation: 'keep' | 'drop' | 'needs tuning';
      notes: string;
    }>;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function redact(str: string, address: string): string {
  if (!address) return str;
  // Redact the street portion only (first line before any comma)
  const street = address.split(',')[0].trim();
  if (street.length < 5) return str;
  return str.replace(new RegExp(street.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<address>');
}

function getEnrichmentFields(data: PropertyEnrichment): { present: string[]; missing: string[] } {
  const keys: Array<keyof PropertyEnrichment> = [
    'homeValueEst',
    'roofSizeEstSqft',
    'yearBuilt',
    'roofOrientation',
    'avgUtilityBillEst',
    'utilityCompany',
  ];
  const present: string[] = [];
  const missing: string[] = [];
  for (const k of keys) {
    if (data[k] !== null && data[k] !== undefined) present.push(k);
    else missing.push(k);
  }
  return { present, missing };
}

function scoreSource(scrape: ScrapeResult, extract: ExtractResult | undefined): {
  recommendation: 'keep' | 'drop' | 'needs tuning';
  notes: string;
} {
  if (!scrape.success) return { recommendation: 'drop', notes: 'Scrape failed — likely blocked or no content' };
  if (!extract) return { recommendation: 'needs tuning', notes: 'Scrape succeeded but extract was not attempted' };
  if (!extract.success) return { recommendation: 'needs tuning', notes: 'Scrape OK but extract failed — check prompt or schema' };
  const fieldCount = extract.presentFields.length;
  if (fieldCount === 0) return { recommendation: 'needs tuning', notes: 'Extract succeeded but all fields null — content may not match prompt' };
  if (fieldCount >= 3) return { recommendation: 'keep', notes: `Returned ${fieldCount} fields: ${extract.presentFields.join(', ')}` };
  return { recommendation: 'needs tuning', notes: `Only ${fieldCount} field(s) returned: ${extract.presentFields.join(', ')} — consider prompt refinement` };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n=== SREnergy Enrichment Pipeline Diagnostic ===');
  console.log('This test will burn ~18 Firecrawl credits.');
  console.log('NO data will be written to Notion.\n');

  const address = (await prompt(rl, 'Street address (e.g. 1234 South Temple St): ')).trim();
  const zip = (await prompt(rl, 'ZIP code (5 digits): ')).trim();
  const state = (await prompt(rl, 'State [UT]: ')).trim() || 'UT';
  rl.close();

  if (!address || !/^\d{5}$/.test(zip)) {
    console.error('Invalid address or ZIP. Exiting.');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.resolve(process.cwd(), 'diagnostics');
  const outFile = path.join(outDir, `enrichment-test-${timestamp}.json`);
  fs.mkdirSync(outDir, { recursive: true });

  const countyUrl = resolveCountyAssessorUrl(zip);
  const zillowUrl = buildZillowSearchUrl(address, zip);
  const utilityUrl = resolveUtilityRateUrl(zip);

  const resolvedUrls = { county: countyUrl, zillow: zillowUrl, utility: utilityUrl };

  const sources = [
    { label: 'County Assessor', url: countyUrl },
    { label: 'Zillow', url: zillowUrl },
    { label: 'Rocky Mountain Power', url: utilityUrl },
  ].filter((s): s is { label: string; url: string } => s.url !== null);

  console.log('\n── Resolved URLs ──────────────────────────────────');
  console.log(`  County Assessor : ${countyUrl ?? '(none — ZIP outside Utah scope)'}`);
  console.log(`  Zillow          : ${redact(zillowUrl, address)}`);
  console.log(`  Utility         : ${utilityUrl ?? '(none — ZIP outside Utah scope)'}`);

  // ── Scrape phase ────────────────────────────────────────────────────────────
  const scrapeResults: ScrapeResult[] = [];
  let totalCredits = 0;

  console.log('\n── Scrape Phase ───────────────────────────────────');
  for (const source of sources) {
    console.log(`\n  [${source.label}] Scraping ${redact(source.url, address)} ...`);
    const t0 = Date.now();
    try {
      const result = await app.v1.scrapeUrl(source.url, { formats: ['markdown'] });
      const elapsed = Date.now() - t0;
      if (!result.success) {
        const err = result.error ?? 'unknown error';
        console.log(`  ✗ Failed (${elapsed}ms): ${err}`);
        scrapeResults.push({ url: source.url, label: source.label, success: false, markdownLength: 0, markdownPreview: '', error: err, creditsUsed: 1 });
        totalCredits += 1;
      } else {
        const md = result.markdown ?? '';
        const preview = redact(md.slice(0, 500), address);
        console.log(`  ✓ Success (${elapsed}ms) — ${md.length} chars`);
        console.log(`  Preview:\n${preview.split('\n').map(l => '    ' + l).join('\n')}`);
        scrapeResults.push({ url: source.url, label: source.label, success: true, markdownLength: md.length, markdownPreview: md.slice(0, 500), error: undefined, creditsUsed: 1 });
        totalCredits += 1;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ Exception: ${msg}`);
      scrapeResults.push({ url: source.url, label: source.label, success: false, markdownLength: 0, markdownPreview: '', error: msg, creditsUsed: 0 });
    }
    console.log(`  Running credits: ${totalCredits}`);
  }

  // ── Extract phase ───────────────────────────────────────────────────────────
  const extractResults: ExtractResult[] = [];
  const successfulSources = sources.filter((s) =>
    scrapeResults.find((r) => r.url === s.url && r.success),
  );

  console.log('\n── Extract Phase ──────────────────────────────────');
  for (const source of successfulSources) {
    console.log(`\n  [${source.label}] Extracting from ${redact(source.url, address)} ...`);
    const t0 = Date.now();
    try {
      const result = await app.v1.extract([source.url], {
        prompt: ENRICHMENT_PROMPT.prompt,
        schema: ENRICHMENT_PROMPT.schema,
      });
      const elapsed = Date.now() - t0;
      if (!result.success) {
        const err = result.error ?? 'unknown error';
        console.log(`  ✗ Failed (${elapsed}ms): ${err}`);
        extractResults.push({ url: source.url, label: source.label, success: false, data: null, nullFields: [], presentFields: [], error: err, creditsUsed: 5 });
        totalCredits += 5;
      } else {
        const data = result.data as PropertyEnrichment;
        const { present, missing } = getEnrichmentFields(data);
        console.log(`  ✓ Success (${elapsed}ms)`);
        console.log(`  Full extract:\n${JSON.stringify(data, null, 4).split('\n').map(l => '    ' + l).join('\n')}`);
        if (missing.length > 0) console.log(`  ⚠ Null fields: ${missing.join(', ')}`);
        extractResults.push({ url: source.url, label: source.label, success: true, data, nullFields: missing, presentFields: present, creditsUsed: 5 });
        totalCredits += 5;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ Exception: ${msg}`);
      extractResults.push({ url: source.url, label: source.label, success: false, data: null, nullFields: [], presentFields: [], error: msg, creditsUsed: 0 });
    }
    console.log(`  Running credits: ${totalCredits}`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const perSource = [
    { label: 'County Assessor', url: countyUrl },
    { label: 'Zillow', url: zillowUrl },
    { label: 'Rocky Mountain Power', url: utilityUrl },
  ].map(({ label, url }) => {
    const scrape = scrapeResults.find((r) => r.label === label);
    const extract = extractResults.find((r) => r.label === label);
    const { recommendation, notes } = scoreSource(
      scrape ?? { url: url ?? '', label, success: false, markdownLength: 0, markdownPreview: '', creditsUsed: 0 },
      extract,
    );
    return {
      label,
      url: url ?? null,
      scrapeStatus: (url === null ? 'skipped' : scrape?.success ? 'success' : 'failed') as 'success' | 'failed' | 'skipped',
      extractStatus: (url === null ? 'skipped' : extract?.success ? 'success' : 'failed') as 'success' | 'failed' | 'skipped',
      fieldsReturned: extract?.presentFields ?? [],
      recommendation,
      notes,
    };
  });

  const report: DiagnosticReport = {
    timestamp: new Date().toISOString(),
    address,
    zip,
    state,
    resolvedUrls,
    scrapeResults,
    extractResults,
    summary: { totalCredits, perSource },
  };

  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n══ SUMMARY TABLE ══════════════════════════════════');
  for (const s of perSource) {
    console.log(`\n  ${s.label}`);
    console.log(`    Scrape  : ${s.scrapeStatus.toUpperCase()}`);
    console.log(`    Extract : ${s.extractStatus.toUpperCase()}`);
    console.log(`    Fields  : ${s.fieldsReturned.length > 0 ? s.fieldsReturned.join(', ') : '(none)'}`);
    console.log(`    Verdict : ${s.recommendation.toUpperCase()} — ${s.notes}`);
  }

  console.log(`\n  Total credits burned : ${totalCredits}`);
  console.log(`  Report saved to      : ${outFile}`);
  console.log('\n══════════════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
