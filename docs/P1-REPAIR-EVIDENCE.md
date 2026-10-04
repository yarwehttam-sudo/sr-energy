# SR Energy P1 repair evidence

Scope: local isolated candidate only. No deployment, push, merge, remote traffic, production credential use, or production change occurred.

## Automated gates

- `npm test`: PASS, 22/22 tests.
- `npm run lint`: PASS, zero warnings/errors.
- `npm run typecheck`: PASS.
- `NOTION_API_KEY=build-placeholder FIRECRAWL_API_KEY=build-placeholder npm run build`: PASS, 738/738 static pages. Placeholder values were used only to satisfy unrelated legacy build-time module guards; no provider requests were made by the build.
- `npm run audit:seo`: PASS candidate invariants; expected external-evidence HOLD remains.
- `npm run audit:routes`: PASS, 182 unique sitemap paths, 596 internal paths, zero route/canonical/schema/H1/internal-link failures, zero non-Texas VPP internal links.
- `npm run inventory:seo`: PASS, total 733 inventory records.
- `git diff --check`: PASS.

## Rendered checks

An isolated local production-mode server at `127.0.0.1:3290` was exercised with cached headless Chromium. The homepage, Solar, Battery, EV charging, contact, and Denver location pages were checked at 1280, 390, 640, and 320 CSS-pixel widths. Every case reported `scrollWidth === clientWidth`, all five primary navigation links visible, and the header CTA fully within the viewport.

Keyboard CDP evidence: first Tab focused “Skip to content”; Enter left `location.hash` as `#main-content` and moved focus to the programmatically focusable `#main-content` (`tabIndex=-1`); the next Tab moved to “Explore your options.”

The rendered contact form submitted with no delivery credentials, displayed the HTTP 502 failure message in `role=alert`, and did not render the success state. Static screenshots and machine-readable checks are stored outside tracked source in the task artifact directory.

## Delivery boundary

Mocked tests verify valid success receipts, malformed body, missing consent, invalid intent, unsupported territory, declared oversize, burst limit, duplicate/replay, honeypot, partial provider failure, all-channel failure, retry after total failure, timeout abort, and circuit breaker behavior. No approved test credentials or destination configuration were present, so no real provider receipt was attempted or claimed.
