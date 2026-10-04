# Interim website lead operations

This is the approved pre-HeyAgain operating model for the public SR Energy website. It does not authorize automated follow-up, production deployment, or a response-time promise.

## Flow and ownership

1. The website validates product intent, ZIP, state/district, name and contact details, homeowner status, explicit consent, attribution, and bot/abuse controls.
2. The API attempts at most two configured channels: email notification and Notion persistence. A homeowner sees success only when at least one channel returns a receipt identifier. Notion success additionally requires a read-after-write reconstruction of the complete bounded lead record and its page-ID receipt.
3. The configured notification mailbox receives the complete validated lead and attribution record. The intended value for `LEAD_NOTIFICATION_EMAIL` is `JoinUs@SREnergy.US`; it must be set in the deployment secret/configuration manager rather than in source.
4. An authorized SR Energy operator monitors that mailbox and the configured Notion lead database, acknowledges the new record using the team's existing manual process, and performs manual follow-up. There is no automated follow-up or invented SLA in this candidate.

## Required configuration

Configure these only in the approved environment secret manager. Do not commit values.

- `LEAD_NOTIFICATION_EMAIL`: validated notification destination; expected approved destination is `JoinUs@SREnergy.US`.
- `LEAD_FROM_EMAIL`: validated sender on the verified `srenergy.us` sending domain.
- `RESEND_API_KEY`: Resend credential for email notification.
- `LEAD_NOTION_DATABASE_ID`: approved Notion persistence database. There is no source-code fallback.
- `NOTION_API_KEY`: integration credential with access only to the approved database.
- `LEAD_TRUSTED_PROXY_HOPS` (non-Vercel only, optional): an integer from 1 through 5. Set this only when the application is behind that exact number of trusted proxies which append or overwrite `X-Forwarded-For`; the client address is selected from the trusted right side of the chain. Leave unset for direct or unverified deployments.

Email is enabled only when all three email settings are present and syntactically valid. Notion is enabled only when both Notion settings are present. Missing or invalid configuration cannot create a false success.

## Failure visibility, monitoring, and failover

The endpoint writes structured, privacy-minimized JSON events to server logs. Events include a random request ID, channel name, outcome/control name, counts, timeout state, and circuit state; they exclude names, email addresses, phone numbers, ZIP codes, IP addresses, payloads, secrets, and receipt IDs.

Operators should monitor platform logs for `delivery_failed`, `all_channels_failed`, `provider_circuit_open`, `provider_budget_applied`, `rate_limited`, `bot_rejected`, and `duplicate_suppressed`. Provider dashboards are the source for provider-specific delivery status. Receipt identifiers returned by successful channels are evidence of provider acceptance, not proof that a human read an email.

The two channels are independent failover paths. If either returns a receipt identifier, the request is accepted and the operator can recover from the surviving mailbox or database. Notion stores the full normalized record as deterministic, independently valid JSON chunk envelopes in page blocks, appends the Notion page ID as a persistence receipt block, reads back up to 100 children, then verifies chunk order/count/hash, exact reconstruction, valid JSON, and the page-ID receipt before it reports success. If any create, append, pagination, or reconstruction check is incomplete, Notion fails honestly. If both channels fail, the endpoint returns HTTP 502, records `all_channels_failed`, removes the duplicate reservation so the homeowner can retry, and never shows “Request received.” If email alone succeeds, the operator handles the email manually; if Notion alone succeeds, the operator handles the database record manually.

Before release, the owner must verify the destination mailbox is monitored, the sender/domain is verified, the Notion database schema matches the properties used by the route, log alerts are routed to an approved operator, and a safe test lead produces a real provider receipt in the intended non-production or explicitly approved test destination.

## Abuse and provider-cost controls

- Body limit: 16 KiB, checked from `Content-Length` and actual UTF-8 bytes before provider work.
- Burst limit: 5 requests per source key per 60 seconds.
- Sustained limit: 20 requests per source key per hour.
- Client key trust boundary: on Vercel (`VERCEL=1`), only the platform-generated `X-Vercel-Forwarded-For` address is used. Outside Vercel, forwarded addresses are ignored unless `LEAD_TRUSTED_PROXY_HOPS` explicitly defines the trusted right-side hop. Unverified `X-Forwarded-For` and `X-Real-IP` values never select a new key; the safe fallback is one shared `unknown` key.
- Counter retention: expired burst/hour entries are deleted on each request. Each counter map has a hard cap of 1,024 source keys and deterministically evicts the least-recently-used timestamp (key order breaks ties) before admitting another key.
- Duplicate/replay suppression: normalized email, digits-only phone, ZIP, state/district, and product intent for 10 minutes; only a hash is retained in process memory.
- Honeypot: server-validated hidden `website` field; no visible CAPTCHA.
- Provider budget: at most two provider attempts per accepted request.
- Provider timeout: 5 seconds per channel.
- Circuit breaker: each channel opens for 60 seconds after 3 consecutive failures.

The in-memory counters are per running application instance and intentionally low-friction. They do not provide distributed enforcement across serverless instances, and the shared fallback can rate-limit unrelated clients when no trusted address is available. Deployment-level rate limiting/WAF should be layered on for global enforcement without weakening these application controls.
