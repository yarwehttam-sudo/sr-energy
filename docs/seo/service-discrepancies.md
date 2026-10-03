# Service Territory Discrepancies

> Foundation snapshot only. This document records the Phase 1 state at `2e41fad2652ba5f26b217eff40e1600e0b55e56b`; it is preserved as historical evidence and is not the current candidate decision record. The authoritative reconciliation for the corrected candidate is `final-evidence-reconciliation.md`, and the current executable sources are `lib/serviceTerritories.ts`, `app/sitemap.ts`, and the pre-launch audits.

## Authoritative service scope

The approved scope is 20 territories: CA, CO, CT, DE, IL, IA, MD, MI, MT, NE, NH, NJ, OH, OR, PA, RI, TX, VA, WA, and Washington DC.

At this foundation snapshot, `lib/serviceTerritories.ts` was the typed Phase 1 source of truth and was intentionally not connected to route generation, so no existing URL was hidden or removed.

## Legacy dataset comparison

- Legacy `STATES`: 30 states, 138 cities.
- Present in both authoritative and legacy sets: 19 states.
- Authoritative but missing from legacy: Washington DC.
- Legacy but not authoritative: AR, GA, HI, ME, MA, NV, NM, NY, UT, VT, WV.

All URLs under the 11 unsupported legacy states default to `HOLD_DATA_REQUIRED`. This means preserve the URL and collect GSC index/click/impression data plus backlinks before choosing any redirect, noindex, consolidation, or retirement action.

## Hard-coded territory surfaces

| Surface | Current behavior | Phase 1 disposition |
|---|---|---|
| `lib/locations.ts` | 30-state legacy route/content dataset | Preserve; compare against typed source |
| `components/USMapHero.tsx` | Separate hard-coded active state map/count | HOLD; consolidate only after URL evidence |
| `components/CollapsibleStatesGrid.tsx` | Copy says 30 states | Claims review required |
| `app/locations/page.tsx` | 30-state copy and legacy grid | Claims review required |
| `app/components/ContactForm.tsx` | 50 states plus DC | HOLD; decide whether form captures out-of-area demand |
| Dynamic location routes | Generated from legacy 30-state dataset | Preserve all existing URLs |
| `app/sitemap.ts` | Emits every legacy state/city URL | Preserve pending GSC/backlink review |

## Texas and VPP preservation

Texas is authoritative. Existing Texas state, city, and VPP URLs remain preserved. VPP program claims are not treated as approved merely because the URL is preserved; they remain `PRESERVE_CLAIMS_REVIEW` until program terms, utility rules, warranty language, and ZIP/address eligibility are verified.

The generic city-product route currently generates `texas-vpp` pages for non-Texas cities. These are `HOLD_DATA_REQUIRED`: do not promote them, but do not delete or redirect them without index/backlink evidence.

## Washington DC

Washington DC is represented as code `DC`, name `Washington, DC`, candidate slug `washington-dc` in the typed registry. No route is added in Phase 1 because city scope, approved content, URL naming, and migration implications have not been researched.
