const baseUrl = (process.env.PRELAUNCH_BASE_URL ?? 'http://localhost:3289').replace(/\/$/, '');
const publicOrigin = 'https://srenergy.us';

const normalizePath = (value: string, fromPath = '/') => {
  const url = new URL(value, `${publicOrigin}${fromPath}`);
  const pathname = url.pathname || '/';
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
};

const fetchText = async (path: string) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' });
  return { response, text: await response.text() };
};

const countTags = (html: string, tag: string) =>
  [...html.matchAll(new RegExp(`<${tag}(?:\\s|>)`, 'gi'))].length;

const anchorHrefs = (html: string) =>
  [...html.matchAll(/<a\b[^>]*\bhref=(['"])(.*?)\1/gi)].map((match) => match[2]);

const canonicalHref = (html: string) => {
  const match = html.match(/<link\b(?=[^>]*\brel=(['"])canonical\1)[^>]*\bhref=(['"])(.*?)\2[^>]*>/i)
    ?? html.match(/<link\b(?=[^>]*\bhref=(['"])(.*?)\1)[^>]*\brel=(['"])canonical\3[^>]*>/i);
  return match?.[3] ?? match?.[2] ?? null;
};

const jsonLdBlocks = (html: string) =>
  [...html.matchAll(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[2]);

async function inBatches<T, R>(values: T[], worker: (value: T) => Promise<R>, size = 24) {
  const results: R[] = [];
  for (let index = 0; index < values.length; index += size) {
    results.push(...await Promise.all(values.slice(index, index + size).map(worker)));
  }
  return results;
}

async function main() {
const sitemapResponse = await fetchText('/sitemap.xml');
const sitemapUrls = [...sitemapResponse.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapPaths = sitemapUrls.map((url) => normalizePath(url));
const routeFailures: string[] = [];
const canonicalFailures: string[] = [];
const schemaJsonFailures: string[] = [];
const mainH1Failures: string[] = [];
const internalPaths = new Set<string>();
const nonTexasVppLinks = new Set<string>();

await inBatches(sitemapPaths, async (path) => {
  const { response, text } = await fetchText(path);
  if (response.status !== 200) routeFailures.push(`${path}: ${response.status}`);

  const canonical = canonicalHref(text);
  if (!canonical || new URL(canonical, publicOrigin).origin !== publicOrigin || normalizePath(canonical) !== path) {
    canonicalFailures.push(`${path}: ${canonical ?? 'missing'}`);
  }

  jsonLdBlocks(text).forEach((block, index) => {
    try { JSON.parse(block); } catch { schemaJsonFailures.push(`${path}: block ${index + 1}`); }
  });

  const mainCount = countTags(text, 'main');
  const h1Count = countTags(text, 'h1');
  if (mainCount !== 1 || h1Count !== 1) mainH1Failures.push(`${path}: main=${mainCount} h1=${h1Count}`);

  for (const href of anchorHrefs(text)) {
    if (/^(?:mailto|tel|javascript):/i.test(href)) continue;
    const resolved = new URL(href, `${publicOrigin}${path}`);
    if (resolved.origin !== publicOrigin) continue;
    const linkedPath = normalizePath(resolved.pathname);
    internalPaths.add(linkedPath);
    if (/^\/locations\/(?!texas(?:\/|$))[^/]+\/[^/]+\/texas-vpp$/.test(linkedPath)) {
      nonTexasVppLinks.add(linkedPath);
    }
  }
});

const internalLinkFailures: string[] = [];
await inBatches([...internalPaths].sort(), async (path) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' });
  if (response.status !== 200) internalLinkFailures.push(`${path}: ${response.status}`);
});

const sitemapPathSet = new Set(sitemapPaths);
const linkedNonSitemapPaths = [...internalPaths].filter((path) => !sitemapPathSet.has(path));
const rootExcludedCount = [...internalPaths].filter((path) => path !== '/').length;
const result = {
  base_url: baseUrl,
  canonical_methodology: 'Distinct same-origin anchor target pathnames; query strings and fragments are dropped, duplicate and trailing slashes are normalized, and root is retained as /.',
  sitemap_status: sitemapResponse.response.status,
  sitemap_url_count: sitemapUrls.length,
  sitemap_unique_path_count: sitemapPathSet.size,
  route_failures: routeFailures.sort(),
  canonical_failures: canonicalFailures.sort(),
  schema_json_failures: schemaJsonFailures.sort(),
  main_h1_failures: mainH1Failures.sort(),
  internal_paths_checked: internalPaths.size,
  internal_path_derivation: {
    sitemap_paths: [...internalPaths].filter((path) => sitemapPathSet.has(path)).length,
    linked_non_sitemap_paths: linkedNonSitemapPaths.length,
    total: internalPaths.size,
  },
  root_excluded_reproduction: {
    count: rootExcludedCount,
    explanation: "595 is reproduced only by excluding the valid root path '/'; the canonical method retains root and therefore reports 596.",
  },
  internal_link_failures: internalLinkFailures.sort(),
  non_texas_vpp_internal_links: [...nonTexasVppLinks].sort(),
};

console.log(JSON.stringify(result, null, 2));
if (
  sitemapResponse.response.status !== 200
  || sitemapUrls.length !== 182
  || sitemapPathSet.size !== 182
  || internalPaths.size !== 596
  || routeFailures.length
  || canonicalFailures.length
  || schemaJsonFailures.length
  || mainH1Failures.length
  || internalLinkFailures.length
  || nonTexasVppLinks.size
) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
