# SR Energy P1 correction evidence

Scope: local isolated correction candidate only. No deployment, push, merge, production traffic, real provider use, credential exposure, legacy migration, gated-claim publication, automation, or production change occurred.

## Exact start and implementation

- Rejected evidence HEAD and exact clean branch point: `4091b33f4fa98b9dc9a1896d4aa2c2b49780ca75`.
- Rejected implementation parent: `4b2a531078ab7c4cc01b726cb374530f396a3356`.
- Original verified implementation/evidence: `94e95c7248bdc1e0430c826fbb02a1c3e2d5bda6` / `b3295822df198c57a45b08b272840aac0db67278`.
- Isolated correction branch: `repair/preproduction-p1-corrections`.
- Corrected implementation: `b06c532e86923347753f20c97dda026adc105150`, a direct descendant of the rejected evidence HEAD.
- Bounded diff: four files, 371 insertions and 21 deletions: `app/api/contact/route.ts`, `lib/leadEndpoint.ts`, `tests/lead-endpoint.test.ts`, and `docs/INTERIM-LEAD-OPERATIONS.md`.

## Notion lossless persistence

The route no longer slices serialized JSON. It serializes the complete normalized lead in a deterministic schema containing name, email, phone, ZIP, state/DC market, product intent, homeowner status, explicit consent, first and latest touch, landing page, referrer, captured timestamps, every UTM field, `gclid`, `msclkid`, `lead_created_at`, and milestone slots. The serialized record is SHA-256 hashed and split into independently valid JSON code-block envelopes. Every envelope carries type, zero-based index, total count, hash, and payload and is kept at or below Notion's 2,000-character rich-text limit.

After page creation, the route appends a separate valid JSON receipt block containing provider `notion` and the returned Notion page ID. It then reads back up to 100 page children and reports success only when pagination is complete, every chunk is present and ordered, total/hash metadata agrees, the exact serialized record reconstructs, the reconstruction parses as JSON, its SHA-256 matches, and the page-ID receipt is present. Any create, append, read, pagination, reconstruction, hash, JSON, or receipt failure fails the Notion channel rather than returning homeowner success.

The route-level maximum-bound mock uses a 100-character name, 254-character email, 30-character phone, both attribution touches, 500 characters in landing page, referrer, every UTM, `gclid`, and `msclkid`, plus 50-character captured timestamps. It proves every emitted envelope is valid JSON and at most 2,000 characters, reconstructs every required field exactly, and accepts Notion-only success only after verified readback. A separate mock returns a page acknowledgment but incomplete readback and proves the homeowner receives HTTP 502, not success. These are mocked transport/receipt tests; no real Notion API request or receipt is claimed.

## Rate-limit trust and bounded storage

- Vercel policy: only `X-Vercel-Forwarded-For` is used when the server-provided `VERCEL=1` environment invariant is present; the address must pass Node IP validation.
- Non-Vercel policy: forwarded input is ignored by default. An operator may set `LEAD_TRUSTED_PROXY_HOPS` to 1–5 only behind that exact trusted append/overwrite proxy chain; the address is selected from the trusted right side. Arbitrary first-token `X-Forwarded-For` and `X-Real-IP` values are never trusted.
- Safe fallback: a shared hashed `unknown` key. This prevents spoofed key rotation but may rate-limit unrelated clients when no trusted address exists.
- Burst/sustained behavior remains 5 requests per 60 seconds and 20 requests per hour; a limited request returns 429 and does not call providers.
- Expired timestamps are filtered and empty keys are deleted on every request. Burst and sustained maps each have a hard 1,024-key cap. Before a new key is admitted at capacity, the entry with the oldest most-recent timestamp is evicted; hashed-key order breaks ties deterministically.
- Regression tests prove rotating attacker-controlled `X-Forwarded-For` and `X-Real-IP` values cannot bypass a stable Vercel platform key, the sixth request is 429 with only five provider calls, cap eviction removes the deterministic oldest entry, and advancing beyond the one-hour window removes expired keys.

These counters remain per process/application instance. They do not provide distributed serverless enforcement; a deployment-layer shared limiter/WAF remains the appropriate global control.

## Automated gates

- Targeted endpoint suite: PASS, 14/14.
- Full `npm test`: PASS, 26/26. Existing normal success, schema rejection, duplicate, honeypot, declared oversize, partial provider failure, all-channel failure/retry, timeout, circuit, acquisition, service-territory, claim, canonical, sitemap, and legacy-route checks remain closed.
- `npm run lint`: PASS, zero warnings/errors.
- `npm run typecheck`: PASS.
- `NOTION_API_KEY=build-placeholder FIRECRAWL_API_KEY=build-placeholder npm run build`: PASS, 738/738 static pages. Non-secret placeholders satisfied unrelated legacy import-time guards; the build made no provider request.
- `npm run audit:seo`: PASS candidate invariants; external-evidence HOLD remains.
- `npm run audit:routes`: PASS, 182 sitemap URLs/unique paths, 596 internal paths, zero route/canonical/JSON-LD/H1/internal-link failures, and zero non-Texas VPP links.
- `npm run inventory:seo`: PASS, 733 records: 9 static, 4 sitemap-only, 30 state, 138 city, and 552 city-product.
- `git diff --check`: PASS.
- Territory/source assertions remain exactly 19 states plus DC (20 total), with WA and DC distinct; canonical host remains `srenergy.us`; legacy routes and fail-closed claims registry remain preserved.

## Rendered smoke regression

The corrected production build was run locally and exercised with headless Chromium. Twenty-four combinations covered `/`, Solar, Battery, EV charging, Contact, and Denver at 1280, 390, 640, and 320 CSS pixels. Results: zero horizontal-overflow failures, zero navigation-visibility failures, zero header-CTA-bound failures, and zero duplicate-title-suffix failures. `Residential Solar | SR Energy` remains single-suffixed.

Keyboard flow remains: first Tab focuses “Skip to content”; Enter sets `#main-content` and focuses `main-content` with `tabIndex=-1`; the next Tab reaches “Explore your options.” A no-credential form submission displayed “Unable to save your request right now. Please try again.” in the form alert and did not render “Request received.” Machine-readable output is `/home/hermes/.hermes/cache/scratch/sr-energy-p1-correction-rendered.json`. The local correction server was stopped after capture.

## Remaining severity and gates

- P0: none found.
- Candidate-code P1: none known after these two bounded corrections; a second independent read-only verification is still required.
- Owner/external P1 launch gates: approved safe real Resend/Notion receipt remains absent; mailbox/database monitoring ownership, sender/domain verification, Notion schema compatibility, and alert routing remain unconfirmed.
- P2 residuals unchanged: undeclared-length bodies are fully buffered before actual-byte rejection; rate/duplicate/circuit state is per instance and the safe fallback is shared; prior deferred footer touch targets, assistive-technology coverage, CrUX/CLS, and historical evidence cleanup remain outside this correction.

Candidate decision: `GO` for a second independent read-only re-verification of the exact corrected implementation and evidence commits. Production/launch decision: `HOLD` until that verification passes and all owner/external receipt and operational gates are satisfied. Production remains unchanged.
