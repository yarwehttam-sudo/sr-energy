# Claims Inventory

`lib/claimsRegistry.ts` is the machine-readable design. Every inventoried claim is `HOLD_DATA_REQUIRED`; no evidence has been invented or inferred.

| Claim ID | Existing claim theme | Evidence required before approval |
|---|---|---|
| `service.30-states` | 30 or 30+ states served | Current signed service-territory confirmation |
| `financing.no-credit-check` | No-FICO/no-credit-check approval or financing | Current financing terms and territory/product eligibility |
| `vpp.free-battery` | Free/$0 Texas battery | Executed VPP terms and address/utility rules |
| `vpp.20-year-terms` | 20-year term, warranty, ownership, 50% capacity | Customer agreement and manufacturer warranty |
| `vpp.zip-eligibility` | ZIP match implies program eligibility | Authoritative utility dataset and address-level disclaimer |
| `reviews.testimonials` | Named testimonials/local customer outcomes | Consent and source record for every testimonial |
| `reviews.aggregate-rating` | 4.9 rating and 127 reviews in JSON-LD | Matching public review profile |
| `experience.13-years` | 13 years of experience | Business formation/operating-history evidence |
| `response.within-hour` | A person responds within an hour | Monitored operational SLA |
| `incentive.federal-itc-30` | Current 30% federal tax credit | Current IRS guidance and eligibility disclaimer |

## Additional unsafe or unsupported patterns observed

- Savings ranges and percentage offsets without cited methodology.
- “Certified installers/electricians,” “Tier 1,” and nationwide/local installation-team representations without supporting records in the repository.
- Specific installation and permit timelines presented as universal.
- “Limited slots” urgency.
- Statements that SR Energy handles monitoring/maintenance or has a homeowner dashboard.
- Static location-specific testimonials reused across cities and VPP pages.
- LocalBusiness schema with city addresses even though no physical street address is provided.
- Service schema with a zero-dollar offer and broad availability.
- State utility-rate, sun-hour, incentive, and net-metering statements without source dates.

These observations are an inventory, not a determination that a claim is false. They must remain on HOLD until evidence and legal/compliance review establish safe wording.

## Promotion rule

A registry entry may become `APPROVED` only when evidence records are attached and independently reviewed. `validateClaimsRegistry()` rejects an approved entry with no evidence. Runtime copy is deliberately not driven by the registry in Phase 1.
