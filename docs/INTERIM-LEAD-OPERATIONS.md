# Interim website lead operations

This is the approved pre-HeyAgain operating model for the public SR Energy website. It does not authorize automated follow-up, production deployment, or a response-time promise.

## Flow and ownership

1. The website validates product intent, ZIP, state/district, name and contact details, homeowner status, explicit consent, attribution, and bot/abuse controls.
2. The API attempts at most two configured channels: email notification and Notion persistence. A homeowner sees success only when at least one channel returns a receipt identifier.
3. The configured notification mailbox receives the complete validated lead and attribution record. The intended value for `LEAD_NOTIFICATION_EMAIL` is `JoinUs@SREnergy.US`; it must be set in the deployment secret/configuration manager rather than in source.
4. An authorized SR Energy operator monitors that mailbox and the configured Notion lead database, acknowledges the new record using the team's existing manual process, and performs manual follow-up. There is no automated follow-up or invented SLA in this candidate.

## Required configuration

Configure these only in the approved environment secret manager. Do not commit values.

- `LEAD_NOTIFICATION_EMAIL`: validated notification destination; expected approved destination is `JoinUs@SREnergy.US`.
- `LEAD_FROM_EMAIL`: validated sender on the verified `srenergy.us` sending domain.
- `RESEND_API_KEY`: Resend credential for email notification.
- `LEAD_NOTION_DATABASE_ID`: approved Notion persistence database. There is no source-code fallback.
- `NOTION_API_KEY`: integration credential with access only to the approved database.

Email is enabled only when all three email settings are present and syntactically valid. Notion is enabled only when both Notion settings are present. Missing or invalid configuration cannot create a false success.

## Failure visibility, monitoring, and failover

The endpoint writes structured, privacy-minimized JSON events to server logs. Events include a random request ID, channel name, outcome/control name, counts, timeout state, and circuit state; they exclude names, email addresses, phone numbers, ZIP codes, IP addresses, payloads, secrets, and receipt IDs.

Operators should monitor platform logs for `delivery_failed`, `all_channels_failed`, `provider_circuit_open`, `provider_budget_applied`, `rate_limited`, `bot_rejected`, and `duplicate_suppressed`. Provider dashboards are the source for provider-specific delivery status. Receipt identifiers returned by successful channels are evidence of provider acceptance, not proof that a human read an email.

The two channels are independent failover paths. If either returns a receipt identifier, the request is accepted and the operator can recover from the surviving mailbox or database. If both fail, the endpoint returns HTTP 502, records `all_channels_failed`, removes the duplicate reservation so the homeowner can retry, and never shows “Request received.” If email alone succeeds, the operator handles the email manually; if Notion alone succeeds, the operator handles the database record manually.

Before release, the owner must verify the destination mailbox is monitored, the sender/domain is verified, the Notion database schema matches the properties used by the route, log alerts are routed to an approved operator, and a safe test lead produces a real provider receipt in the intended non-production or explicitly approved test destination.

## Abuse and provider-cost controls

- Body limit: 16 KiB, checked from `Content-Length` and actual UTF-8 bytes before provider work.
- Burst limit: 5 requests per source key per 60 seconds.
- Sustained limit: 20 requests per source key per hour.
- Duplicate/replay suppression: normalized email, digits-only phone, ZIP, state/district, and product intent for 10 minutes; only a hash is retained in process memory.
- Honeypot: server-validated hidden `website` field; no visible CAPTCHA.
- Provider budget: at most two provider attempts per accepted request.
- Provider timeout: 5 seconds per channel.
- Circuit breaker: each channel opens for 60 seconds after 3 consecutive failures.

The in-memory counters are per running application instance and intentionally low-friction. Deployment-level rate limiting/WAF may be layered on later without weakening these application controls.
