# SEO Acquisition Implementation Plan

## Current decision

HOLD. The isolated foundation is safe to review, but acquisition launch and URL migration require external research, Google Search Console data, backlink evidence, and claim substantiation.

## Phase 1 completed in this candidate

1. Isolated the work from verified `origin/main` rather than the local unpushed removal commit.
2. Recorded repository, route, metadata, sitemap, robots, form/API, analytics, and claims baselines.
3. Added a typed authoritative 19-state-plus-DC territory registry without connecting it to routing.
4. Added a typed claims registry whose entries default to `HOLD_DATA_REQUIRED`.
5. Generated a 733-record URL inventory and non-destructive migration matrix.
6. Added tests for territory exactness, legacy discrepancy preservation, Texas VPP preservation, unsupported-state HOLD behavior, and claims-registry integrity.
7. Added reproducible `inventory:seo` and `audit:seo` commands.

## Required evidence before implementation

- GSC page export: URL, index status, canonical selected by Google, clicks, impressions, CTR, average position, and query data for at least 12–16 months where available.
- Backlink export by exact URL, including referring domains and link quality.
- Server/CDN access or crawl logs if available.
- Confirmed primary domain (`srenergy.us` or `srenergy.com`) and redirect ownership.
- Current signed service territory and product-by-territory matrix.
- VPP customer agreement, utility eligibility, warranty, fees, monitoring, ownership, and address qualification rules.
- Financing program terms and compliant no-credit-check/no-FICO wording.
- Evidence and consent for testimonials, ratings, experience, response SLA, certifications, and product claims.
- Current, citable state incentive/rate/net-metering sources with review dates.

## Proposed sequence after evidence review

1. Select one canonical host and map every current canonical/sitemap/structured-data signal to it.
2. Join GSC and backlink evidence to `url-inventory.csv`.
3. Assign each URL an evidence-backed action: KEEP, UPDATE, CONSOLIDATE, REDIRECT, NOINDEX, or RETIRE. Until then, keep HOLD.
4. Confirm the Washington DC URL/content model and exact city/service coverage.
5. Connect the typed territory registry to new acquisition surfaces first; do not use it as a destructive router filter.
6. Replace unsubstantiated claims with approved registry-backed copy and add source/review dates for factual data.
7. Resolve sitemap-only URLs, duplicate contact entries, sitemap omissions, and non-Texas VPP generation according to evidence-backed actions.
8. Add analytics and conversion measurement only after consent/privacy requirements and event definitions are approved.
9. Validate lead capture, consent storage, input validation/escaping, API abuse controls, and CRM delivery before paid or SEO traffic expansion.
10. Re-run lint, typecheck, tests, build, a production-like crawl, canonical/sitemap/robots checks, structured-data validation, and broken-link checks.

## Explicitly out of scope

- Production deployment or push.
- URL deletion, redirect, noindex, or retirement.
- Removal of Texas or VPP URLs.
- HeyAgain, proposal, installer, financing, or other workflow automation.
- Claims approval without evidence.
