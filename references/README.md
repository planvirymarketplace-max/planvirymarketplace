# Reference Repositories — Blueprint Sources

> **Part XLII §42.2 — Translation Mode**: These repos are **blueprints, not
> dependencies**. Each is mined for a single hard-won piece of logic (a state
> machine, an algorithm, a permission model) and that logic is rewritten
> natively into Planviry's own Supabase/Postgres schema and Next.js API routes.
>
> **No repo is ever run as a service or imported as an npm dependency.**

This directory is gitignored. Engineers inspect these sources for patterns
during implementation; they are not part of the build.

## The 6 Reference Repositories

| # | Directory | Source | Domain (Part XLII §42.3) | Translation Mode | What We Mine |
|---|-----------|--------|--------------------------|------------------|--------------|
| 1 | `hi-events/` | [HiEventsDev/hi.events](https://github.com/HiEventsDev/hi.events) | Event ticketing lifecycle | TRANSLATE | Ticket lifecycle, capacity, tiers, Stripe Connect, check-in |
| 2 | `cal-com/` | [calcom/cal.com](https://github.com/calcom/cal.com) | Scheduling / slot generation | PATTERN | `getSlots` algorithm, `getLuckyUser` round-robin assignment |
| 3 | `movinin/` | [aelassas/movinin](https://github.com/aelassas/movinin) | Booking state machine + TTL | PATTERN | 6-state booking FSM, TTL sweep, `calculateTotalPrice`, 3-channel delivery |
| 4 | `hotel-back-office/` | [MikkoTirronen/hotel-back-office](https://github.com/MikkoTirronen/hotel-back-office) | Derived runtime status | PATTERN | `currentReservationStatus()` computed-status pattern, soft delete, guest KYC |
| 5 | `peppermint/` | [Peppermint-Lab/peppermint](https://github.com/Peppermint-Lab/peppermint) | RBAC + notification fan-out | PATTERN | Permission model, ticket queue, notification fan-out |
| 6 | `ticketihub/` | [TheODDYSEY/TicketiHub](https://github.com/TheODDYSEY/TicketiHub) | Stripe Checkout + webhooks | PATTERN | Stripe Checkout session creation, webhook signature verification |

## Translation Modes (Part XLII §42.2)

- **DIRECT** — port the code near-verbatim (rare; only when logic is trivially
  correct and license-compatible).
- **PATTERN** — reimplement the approach, not the code. The algorithm or
  architecture is studied and rewritten natively.
- **TRANSLATE** — rebuild the data model and logic natively. The source's
  schema is mapped to Planviry's Postgres tables; the source's ORM calls become
  Supabase RPCs.

Every repo in this directory is PATTERN or TRANSLATE — never DIRECT, never
imported.

## Confirmed Gaps (Part XLII §42.2)

Each winning reference has gaps — capabilities the orchestrator vision
requires that the winning repo does NOT provide. The full gap audit for
Hi.Events is in the spec; the remaining 17 rows are pending audit. Gaps are
classified as:

- **NATIVE-NO-PATTERN** — must be designed from zero (no upstream precedent).
  Examples: ItinerarySession (DOM-005), cross-vertical Cart (DOM-006).
- **SOLVABLE-ELSEWHERE** — a different reference or spec Part covers it.

## Cloning

These repos were cloned with `--depth 1` (shallow). To update:

```bash
cd references/<repo>
git fetch --depth 1 origin main
git reset --hard origin/main
```
