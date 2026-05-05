# Decision 002: Step 9 Replaced with Web Scraper Builds

**Date:** 2026-05-05
**Status:** Decided - active
**Author:** Matthew (execution in Cursor)

## Context

Decision 001 shelved the original Phase 2 lead enrichment pipeline and queued Phase 3 as a DSIRE-focused State Incentive Crawler (Step 9).

Since then, the business model changed:

- UEG (United Energy Group) is now the customer-facing brand
- Core offer is a 50-year prepaid energy lease, positioned as a utility-style bill savings product
- SR Energy remains the behind-the-scenes installer and biannual maintenance operator

This changes the highest-value data signals. Incentive intelligence is useful, but it is no longer the next bottleneck. Immediate growth depends on finding intent-rich prospects for both UEG customer acquisition and LoadMax equipment rental sales.

## Decision

Step 9 (State Incentive Crawler) is replaced and removed from the active build sequence.

It is replaced by two parallel builds:

1. **UEG Web Scraper**
   - Goal: Identify Utah homeowners actively expressing electric bill pain
   - Output: Notion database `UEG Web Scraper Leads`
   - Handoff: Auto-send leads with score >= 70 to HeyAgain.ai via webhook
   - Cadence: Daily cron

2. **LoadMax Scout V1**
   - Goal: Identify Wasatch Front contractors/PMs likely to need boom lifts, telehandlers, or dump trucks
   - Output: Notion database `LoadMax Scout Leads`
   - Handoff: Manual phone outreach by Matthew (no automation in V1)
   - Cadence: Daily cron

## Why

1. The new UEG positioning wins on monthly bill relief messaging, so lead-source monitoring for real complaint/intent signals is now more valuable than incentive aggregation.
2. LoadMax has a separate, high-value demand generation need that benefits from a focused, local, permit-and-classifieds scouting engine.
3. Both builds reuse existing foundation patterns (API clients, validation, Notion write flows) while producing faster commercial feedback than a DSIRE crawler.

## Scope Notes

- Keep the two lead pipelines fully separate at the database level.
- Do not mix either pipeline with existing UEG Doorstep leads or legacy LoadMax rental databases.
- Phase labels may continue for continuity, but Step 9 is formally superseded by this decision.
