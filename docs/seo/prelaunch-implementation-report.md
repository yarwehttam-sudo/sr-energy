# SR Energy Pre-launch Acquisition Candidate — Consolidated Implementation Report

Evidence date: 2026-10-03 UTC  
Candidate code SHA: `b92159f9fb7febccd131c0fd1e14735a8501292b`  
Branch: `seo/prelaunch-acquisition`  
Verified base: `origin/main` at `e83d18cc8fddf27f36aa11b0ea59e1b3be0279c7`  
Deployment/push: none

## 1. Executive decision

HOLD. The local candidate is technically coherent and passes the available repository and production-like HTTP checks, but it must not launch until the evidence gates in section 23 are closed. This report does not authorize deployment, URL retirement, claim publication, paid traffic, or workflow automation.

## 2. Candidate isolation and provenance

The branch merge-base and current `origin/main` are both `e83d18cc8fddf27f36aa11b0ea59e1b3be0279c7`. The candidate includes foundation commits `06a1b80` and `2e41fad`, followed by implementation commit `dc4feb2` and verification-gate commit `b92159f`. It does not contain local commit `1487ac5`. All work remains local.

## 3. Scope and non-goals

Implemented: three top-level acquisition paths, neutral copy, lead capture, attribution, delivery safeguards, lifecycle field architecture, claims governance, typed territories, legacy preservation, metadata, canonical/schema/internal-link cleanup, sitemap/robots correction, tests and evidence. Excluded: deployment, GSC-driven migration, mass URL retirement, HeyAgain, proposal automation, installer assignment, financing automation and approval of unsupported claims.

## 4. Homepage acquisition architecture

`app/components/HomePageClient.tsx` presents Solar, Battery / Backup Power and EV Charging as independent paths. Battery and EV are not subordinate Solar variants. Each path links to its own top-level page, and the homepage has a product-intent form.

## 5. Solar pre-launch experience

`/products/solar` uses property-review and possibility language. It identifies roof, shade, usage, utility, permitting/interconnection and property-specific financing as review inputs. It does not promise eligibility, approval, savings, incentives, equipment, financing, timeline or warranty.

## 6. Battery / backup-power experience

`/products/battery` is a distinct acquisition page. It explains essential loads, desired runtime, operating mode, panel conditions and solar compatibility without making capacity, runtime, ownership, credit, warranty, VPP or free-equipment promises.

## 7. EV charging experience

`/products/ev-charger` is a distinct acquisition page. It frames the review around vehicle, parking location, panel capacity, wiring path and rate-plan context without implying universal installation, incentive, savings or timeline outcomes.

## 8. Lead-capture fields and friction

`app/components/LeadCaptureForm.tsx` requests product intent, ZIP, state/district, name, phone, email, homeowner status and explicit contact consent. The market selector is generated from the authoritative territory configuration. ZIP and product intent are mandatory. No proposal or installer workflow is triggered.

## 9. First-touch and latest-touch attribution

The client records landing page, referrer, capture timestamp, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid` and `msclkid`. First touch is retained in local storage when available; latest touch is captured for every request. The API bounds and sanitizes values before persistence or email rendering.

## 10. Lead events, persistence and delivery behavior

`lead_created_at` is generated server-side. The typed model reserves `contacted_at`, `qualified_at`, `appointment_booked_at`, `proposal_sent_at`, `closed_won_at` and `closed_lost_at` for future systems without implementing them. Email and Notion persistence are attempted independently. The API returns success only when at least one channel produces an ID; if both fail it returns HTTP 502, preventing a false-success lead loss. A live invalid-payload check returned HTTP 400. Real delivery with production credentials remains a launch gate.

## 11. Claims registry and publication controls

`lib/claimsRegistry.ts` stores status, geography, product applicability, sources, required evidence, verification date, review date and a guardrail. All ten candidate claims are `HOLD_DATA_REQUIRED`; none is publishable. The audit rejects unsupported approvals. Published candidate copy uses conservative, property-specific qualifiers.

## 12. Authoritative service footprint

`lib/serviceTerritories.ts` contains exactly CA, CO, CT, DE, IL, IA, MD, MI, MT, NE, NH, NJ, OH, OR, PA, RI, TX, VA, WA and DC. The same typed configuration powers the user-facing form and locations selector. Washington DC is available as a selector option but has no invented city pages.

## 13. Legacy URL inventory and non-destructive policy

The evidence package inventories 733 legacy/static records: 9 static, 4 historical sitemap-only, 30 state, 138 city and 552 city-product records. All 30 legacy state families remain represented. Unsupported legacy territories are explicitly marked HOLD. No redirect, `noindex`, retirement or deletion policy was introduced for uncertain legacy URLs.

## 14. Texas and VPP preservation

Texas state/city pages and the five Texas city VPP URLs remain generated and crawlable. VPP copy is informational and explicitly states that SR Energy participation, eligibility, equipment, credits, ownership, fees, warranties and timing are unverified. Non-Texas catch-all VPP paths remain preserved but are not promoted in the sitemap.

## 15. First-wave content and keyword evidence

No evidence-free first-wave city expansion was added. Top-level Solar, Battery and EV pages are the only new acquisition content pattern. Parent research suggests CA/TX and selected focus markets, but paid DataForSEO/OpenSEO volume, rank, CPC and keyword-difficulty evidence was unavailable; therefore no numeric demand or ranking claim is used to authorize launch.

## 16. Metadata and canonical host

Active metadata uses `https://srenergy.us`. Each of the 182 sitemap URLs returned exactly one matching `srenergy.us` canonical during the local production crawl. Active page, sitemap and robots sources contain no `https://srenergy.com` canonical. Titles and descriptions are product/location specific but conservative.

## 17. Structured data, breadcrumbs and internal links

Only factual `BreadcrumbList` JSON-LD remains; unverified LocalBusiness, Service, FAQ and Review schema generators were removed. Every JSON-LD block encountered in the 182-URL crawl parsed successfully. Breadcrumbs exist on preserved location routes. The canonical methodology in `scripts/prelaunch-route-audit.ts` checks distinct same-origin anchor target pathnames after dropping query strings and fragments and normalizing duplicate/trailing slashes while retaining `/`. It found 596 paths (182 sitemap paths plus 414 linked non-sitemap city-product paths), all HTTP 200. A 595 count is reproducible only when the valid root path is excluded.

## 18. Sitemap and robots

The candidate sitemap has 182 unique canonical URLs: 9 static routes, 30 state routes, 138 city routes and 5 Texas VPP routes. The four historical sitemap-only 404s (`/products/texas-vpp`, `/calculator`, `/faq`, `/privacy`) were removed from the sitemap but retained in the inventory pending evidence. `robots.txt` allows public pages, disallows API/thank-you/framework paths, and declares the `srenergy.us` host and sitemap.

## 19. Route-integrity results

The production build generated 738 static pages. A local production server returned HTTP 200 for all 182 sitemap URLs. Failures: routes 0, canonicals 0, JSON-LD parsing 0, one-main/one-H1 semantics 0, internal links 0 of 596 checked. The machine-readable record is `docs/seo/prelaunch-route-audit.json`.

## 20. Forms, analytics and privacy boundaries

The form validates required inputs in the browser and API, bounds strings, escapes email HTML, requires explicit consent and links to privacy/terms. Attribution is first-party request metadata; no third-party analytics or ad tags were introduced. No HeyAgain, proposal automation or downstream milestone automation exists. Production credential delivery and consent/legal review remain required.

## 21. Accessibility and mobile checks

The global layout has a skip link and `main-content` target. Candidate pages expose one main landmark and one H1 in the HTTP crawl. Form controls have explicit labels or grouped fieldset/legend text, status/error live semantics, autocomplete hints and responsive `sm`/`lg` layout guards. No local browser executable or browser automation package was available, so keyboard, focus order, screen-reader, zoom and rendered multi-viewport checks remain manual pre-launch requirements.

## 22. Performance and regression evidence

The optimized Next.js build passed and generated 738/738 pages. Recorded first-load JavaScript: homepage and product pages 98.6 kB, contact 89.9 kB, shared 87.2 kB. Lint, TypeScript, 12 tests, SEO audit and build passed. Numeric production Lighthouse/CrUX/Core Web Vitals and a production before/after baseline were unavailable, so this is not a CWV GO decision.

Commands executed successfully:

- `npm run inventory:seo`
- `npm run typecheck`
- `npm test` — 12/12 passed
- `npm run lint` — zero warnings/errors
- `npm run audit:seo` — invariant PASS with expected HOLD findings
- `NOTION_API_KEY=test FIRECRAWL_API_KEY=test RESEND_API_KEY=test npm run build` — compiled; 738/738 generated
- `PRELAUNCH_BASE_URL=http://localhost:3289 npm run audit:routes` — 182 sitemap URLs and 596 canonical internal paths checked; the 595 root-excluded variant is reported explicitly

## 23. Blockers, release gates and final recommendation

Final recommendation: HOLD.

Required before any launch or migration GO:

1. Authenticated Google Search Console page/query/index/canonical evidence.
2. URL-level backlink/referring-domain evidence.
3. Paid DataForSEO/OpenSEO metrics if numeric keyword prioritization is required.
4. Signed/current SR Energy service, financing, equipment, ownership, warranty, incentive, utility and VPP program documentation.
5. Production credential end-to-end lead delivery test, ownership/alerting confirmation and abuse-control decision.
6. Numeric production Lighthouse/CrUX/Core Web Vitals evidence and before/after regression review.
7. Rendered desktop/mobile, keyboard, screen-reader and zoom accessibility QA.
8. Independent verification of this exact candidate by child task `t_ac8d4713`.

Until those gates close: do not deploy, push, merge, retire URLs, issue mass redirects, add `noindex`, publish held claims or enable paid acquisition.

## Evidence package

- `docs/seo/prelaunch-implementation-report.md` — this 23-section report
- `docs/seo/prelaunch-route-audit.json` — machine-readable crawl/build summary
- `docs/seo/url-inventory.csv` — 733-record inventory
- `docs/seo/legacy-migration-matrix.csv` — non-destructive URL policy
- `docs/seo/baseline.md` — foundation baseline
- `docs/seo/claims-inventory.md` — original claims baseline
- `docs/seo/service-discrepancies.md` — territory discrepancies
- `lib/claimsRegistry.ts` — governed claims model
- `lib/serviceTerritories.ts` — authoritative 20-territory config
- `tests/prelaunch-candidate.test.ts` and `tests/seo-foundation.test.ts` — executable acceptance evidence
