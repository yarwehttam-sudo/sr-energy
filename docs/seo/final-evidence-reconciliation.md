# SR Energy Final Evidence Reconciliation and Correction Gate

Evidence date: 2026-10-03 UTC  
Branch: `seo/prelaunch-acquisition`  
Deployment, push, merge, URL retirement, redirect, noindex, and production changes: none

## A. Starting SHA

Starting report HEAD: `64f7dd8e9b14abe6189e35f49f9f9e127e5b26d6`. Starting implementation candidate: `b92159f9fb7febccd131c0fd1e14735a8501292b`. Verified base remains `origin/main` at `e83d18cc8fddf27f36aa11b0ea59e1b3be0279c7`.

## B. Files changed

Correction commits `5b912cc7353b77275011d8f76c899fbb286ff3be` and `94e95c7248bdc1e0430c826fbb02a1c3e2d5bda6` changed `app/terms-of-service/page.tsx`, `app/privacy-policy/page.tsx`, `lib/businessInfo.ts`, `package.json`, `scripts/prelaunch-route-audit.ts`, and `tests/prelaunch-candidate.test.ts`. This evidence commit changes `docs/seo/service-discrepancies.md`, `docs/seo/prelaunch-implementation-report.md`, `docs/seo/prelaunch-route-audit.json`, and this report. No route, architecture, territory, claim, or acquisition-flow redesign was made.

## C. Legal-domain finding

Repository evidence establishes `srenergy.us` as the intended website reference: `docs/PROGRESS.md` records the production-domain confirmation; sitemap, metadata base, robots, active canonicals, API sender domain, and the candidate report consistently select `srenergy.us`. Git history shows the Terms page retained body copy from its original `srenergy.com` version while the candidate corrected only its canonical. The stale Terms body and unused `BUSINESS_INFO.url` value are now `srenergy.us`. A recursive source-level test scans `app/**/*.{ts,tsx}` and `lib/**/*.{ts,tsx}` for `srenergy.com`; any future legitimate exception must be explicitly allowlisted with a non-empty reason. Current exceptions: none.

## D. 595/596 internal-path reconciliation

The committed canonical method is `npm run audit:routes` in `scripts/prelaunch-route-audit.ts`: crawl all sitemap pages; collect same-origin anchor targets; drop query strings and fragments; normalize duplicate/trailing slashes; deduplicate by pathname; retain root as `/`; then require HTTP 200 for each target. Result: 596 = 182 sitemap paths + 414 linked non-sitemap city-product paths. The reported 595 is reproduced only by excluding the valid root path `/`. Query variants of `/contact`, fragment-only links, and trailing slashes do not add canonical paths. No route was changed to force equality.

## E. Evidence-version and sitemap reconciliation

`docs/seo/service-discrepancies.md` is now explicitly labeled as the historical Phase 1 foundation snapshot at `2e41fad`. It is not the current candidate decision record. This report, the executable sources, and `docs/seo/prelaunch-route-audit.json` are authoritative for the corrected candidate. The candidate sitemap contains 182 unique canonical URLs. The four historical sitemap-only 404 paths (`/products/texas-vpp`, `/calculator`, `/faq`, `/privacy`) remain in inventory evidence but are excluded from the current sitemap pending legacy evidence.

## F. Non-Texas Texas-VPP result

Generated historical catch-all Texas-VPP routes outside Texas remain routable and classified `HOLD_DATA_REQUIRED`; none was deleted, redirected, or noindexed. The executable crawl found zero non-Texas Texas-VPP links in the sitemap-page navigation or page anchors. They are absent from the sitemap and from current service-availability copy and campaigns. No new intentional link was added. The five Texas city VPP URLs remain in the sitemap with neutral, unverified-program language.

## G. Territory regression

PASS. The active service-review footprint is exactly CA, CO, CT, DE, IL, IA, MD, MI, MT, NE, NH, NJ, OH, OR, PA, RI, TX, VA, WA, and DC. Washington state (`WA`) and Washington, DC (`DC`) remain distinct. The 11 unsupported legacy state families remain routable only as preserved legacy surfaces, not represented as current support.

## H. Claims regression

PASS. All 10 governed claims remain `HOLD_DATA_REQUIRED`, with no sources and no publishable approvals. Candidate copy makes no affirmative promises for approval/eligibility, no-FICO, savings, free/$0 equipment, VPP participation/compensation/ownership, warranties, incentives/rebates/tax credits, financing, timelines, utility eligibility, testimonials/ratings, or SLAs. A stale Privacy Policy example naming “Texas VPP eligibility” was replaced with neutral requested-product/service-review wording and covered by a regression assertion. Neutral disclaimers and property-specific review language remain allowed. No independent claim evidence was introduced.

## I. SEO regression

PASS. The production-like audit reports 182 sitemap URLs; 0 route failures; 0 canonical mismatches; 0 invalid JSON-LD blocks; 0 one-main/one-H1 failures; 596 intended internal paths; 0 broken internal paths; and 0 non-Texas VPP internal links. Sitemap, robots, active canonicals, business URL, and legal website copy use `srenergy.us`. Breadcrumb schema remains factual only.

## J. Acquisition regression

PASS. Architecture is unchanged: Solar is neutral pre-launch/property review, Battery is resilience/backup, and EV Charging is electrical/charging review. Cross-sell remains downstream. Lead capture retains product intent, ZIP, state/district, contact data, consent, first/latest touch, UTMs, landing page, referrer, `gclid`, and `msclkid`. No HeyAgain, proposal automation, installer assignment, or new location page was added.

## K. Test and build evidence

PASS: `npm run inventory:seo` generated 733 records; `npm test` passed 12/12; `npm run lint` passed with zero warnings/errors; `npm run typecheck` passed; `npm run audit:seo` passed with expected HOLD findings; production build with non-secret placeholders compiled and generated 738/738 static pages; `npm run audit:routes` passed the exact SEO/route counts in section I; invalid lead payload validation remains HTTP 400. The repository diff check passed.

## L. Corrected candidate SHA

Corrected implementation/tooling SHA: `94e95c7248bdc1e0430c826fbb02a1c3e2d5bda6`. The final evidence SHA is the commit containing this report and must be read from `git rev-parse HEAD`; no self-referential SHA is asserted inside its own commit.

## M. Remaining blockers by boundary

Candidate-code blockers: none found by this gate.

Legacy-retirement blockers: authenticated GSC page/query/index/canonical evidence and URL-level backlink/referring-domain evidence. These block retirement decisions only; they do not invalidate the safe acquisition architecture.

Pre-production blockers: production-credential lead-delivery test; explicit lead ownership and alerting confirmation; abuse-control decision; rendered mobile, keyboard, screen-reader, and zoom QA; production Lighthouse/CrUX/Core Web Vitals evidence.

Optimization/data blockers: paid DataForSEO/OpenSEO demand/rank/CPC/difficulty evidence and independently reviewed, signed/current service, financing, equipment, ownership, warranty, incentive, utility, and VPP documentation. No unavailable evidence was fabricated.

## N. Recommendation

GO for independent verification of the corrected local candidate at the exact final HEAD. HOLD for deployment, launch, paid acquisition, claim publication, production lead traffic, and any legacy URL retirement until the applicable blockers in section M are closed. This gate authorizes no push, merge, deploy, redirect, deletion, mass noindex, or campaign activation.
