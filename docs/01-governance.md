# Part I — Governance (Layer 0)

> **Status: COMPLETE for the foundation release.**
> Part I is the Layer 0 / Volume 0 governance document for the Planviry
> platform. Everything built in Parts II–XLVI inherits the Vision, the
> Architecture, the Principles, and the ADRs recorded here. If a later Part
> contradicts Part I, Part I wins until Part I is formally amended.

---

## 1.1 Vision

### 1.1.1 Product Purpose

Planviry is a **multi-vertical occasion orchestration platform**. It is not a
vendor directory, not a travel site, and not a ticketing platform. It is the
first platform in the market with a cart and itinerary simultaneously aware
of lodging, transit, ticketed events, venues, vendors, dining, and
experiences — making the cross-vertical booking session structurally
impossible to replicate on any single-vertical competitor.

The "orchestrator" framing is load-bearing (see Part 0 §0.1). Every
architectural decision recorded in this Part must be evaluated against
whether it reinforces or weakens the cross-vertical cart and itinerary as the
platform's structural moat. This is encoded as a binding rule in §1.3 under
the Principle "Moat First".

### 1.1.2 Scope

The platform owns the following eight modules. Each module has a market
equivalent that Planviry displaces — these are listed so that contributors
calibrate expectations against the right reference, not so that Planviry
reproduces them feature-for-feature.

| Module                       | What It Owns                                            | Market Equivalent Displaced        |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------- |
| PMS (Property Management)    | Room/unit state, housekeeping, guest profiles           | Hotel PMS (Opera, Cloudbeds)       |
| Booking Engine               | Calendar, slot generation, availability windows         | Cal.com, Calendly                  |
| Travel Management            | Flights, hotel IDs, tickets as one itinerary session    | Expedia, Google Travel             |
| Reservation Management       | Status lifecycle, group permissions, cost-splitting     | OpenTable reservations             |
| Maintenance Management       | Work orders, room-status triggers, vendor staff tasks   | Maintenance management tools       |
| Ticketing Management         | Event tickets (Hi.Events model) + operational tasks (Peppermint model) | Ticketmaster, Eventbrite |
| Vendor Listing Management    | Multi-tenant marketplace, onboarding, partitioned visibility | Peerspace, GigSalad            |
| Events Booking & Management  | Event creation, capacity, recurring, registration       | Hi.Events, Eventbrite              |

### 1.1.3 Explicit Non-Goals

The following are **NOT** within scope of this platform and must not be
implemented unless this section is formally amended:

- Competing head-on with Ticketmaster for primary ticket distribution of
  major national tours — integration only.
- Building a standalone CRM or HR system — vendor staff management is scoped
  to operational tasks only.
- Processing payroll for vendor staff — payment scope is limited to Stripe
  Connect marketplace payouts.
- White-label resale of platform to third-party operators in v1 — deferred to
  Part XXXIX (Future Expansion).
- Native mobile application (iOS/Android) in v1 — mobile-responsive web only;
  native deferred to Part XXXIX.
- International multi-currency support in v1 — USD primary; i18n deferred to
  Part XXXIX.
- Building a content management system for editorial travel content — content
  is data-driven, not CMS-driven.

> **NOTE on amendment.** Moving any item from this list into scope requires a
> formal amendment to Part I, a new ADR (see §1.4), and a version bump to
> this document (see C-13 in Part 0 §0.3). Silent scope expansion is a
> GAC-001 violation.

### 1.1.4 Definitions & Terminology

These terms are normative throughout the specification. Where a later Part
uses one of them, it uses it with the meaning defined here.

| Term                | Definition                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Occasion            | Any planned social, professional, or recreational event that requires two or more vendor/service bookings   |
| Cart                | The cross-vertical container holding all line items for a single checkout session, regardless of category   |
| Itinerary           | The chronological view of all bookings across all verticals, attached to a single `ItinerarySession`        |
| Vertical            | A product category served by the platform: Stays, Flights, Experiences, Venues, Vendors, Dining, Tickets    |
| Vertical Row        | The persistent UI control that switches the content feed in place without navigation — NOT a nav element     |
| Orchestration Shell | The persistent Plan bar + Vertical Row + Facet Pills that live on every landing page                        |
| InventoryItem       | The polymorphic base entity from which every bookable thing inherits (hotel room, ticket, vendor service)   |
| Reservation Ledger  | The unified table of all bookings across all verticals, shared by all modules                              |
| Overture Seeding    | The bulk-import of unverified vendor listings from third-party data, which vendors later claim              |
| Claimed Listing     | A vendor-operated listing that has completed the profile claim flow and is fully managed in the portal      |
| TTL                 | Time-To-Live: the window after which a pending booking expires and held inventory is released              |
| FSM                 | Finite State Machine: the explicit set of states and allowed transitions governing entity lifecycles       |
| RPC                 | Remote Procedure Call: Supabase database functions callable from the API layer                              |
| RLS                 | Row-Level Security: Postgres policies enforcing tenant and role isolation at the database layer             |
| Two-Door Entry      | The dual entry model: search-first (header bar) and browse-first (mega menu) — both gate on location       |
| Implementation Specification | This document                                                                                       |

### 1.1.5 Assumptions

The assumptions below are the foundation the rest of the spec is built on. If
any assumption becomes false, the affected Parts must be re-evaluated.

- The existing Next.js 16 / Supabase / Algolia frontend stack is retained and
  retrofitted (not replaced) per Part XLVI.
- Supabase (PostgreSQL 15+) is the sole database tier; no secondary
  relational database is introduced.
- Stripe is the sole payment processor; Stripe Connect is used for
  multi-vendor marketplace payouts.
- Algolia is the search provider for the initial build; the federated ranking
  decision (Part XLII Conflict #7 — see §1.4.2 below) is unresolved and may
  require re-evaluation.
- The six reference repositories (Hi.Events, Cal.com, movinin,
  hotel-back-office, Peppermint, TicketiHub) are blueprints only — no service
  is run or imported as a dependency.
- Initial launch targets English-language, USD markets only.

### 1.1.6 Constraints

Constraints are rules that cannot be relaxed by any later Part without a
formal amendment to Part I. Each constraint has a stable ID so it can be
referenced from ADRs, business rules, and code.

- **CONSTRAINT-001:** No implementation decision may be made that breaks the
  cross-vertical cart invariant — every `InventoryItem` must be addable to
  the same `Cart` regardless of category.
- **CONSTRAINT-002:** No category page may render without a location being
  provided — the location gate is mandatory at both API and client guard
  layers.
- **CONSTRAINT-003:** The Vertical Row may only swap the content feed in
  place — it must never trigger full-page navigation or URL change to a
  different route.
- **CONSTRAINT-004:** Vendor dashboards must be account-scoped at the RLS
  layer — no vendor may see another vendor's dashboard data.
- **CONSTRAINT-005:** All booking state transitions must go through the
  Reservation FSM (Part V) — no direct status field writes from client code.

> **NOTE.** CONSTRAINT-001 is the moat rule in rule form; CONSTRAINT-002 and
> CONSTRAINT-003 are the two-door entry rule in rule form; CONSTRAINT-004 is
> the tenant-isolation rule; CONSTRAINT-005 is the FSM-enforcement rule.
> Each constraint maps to one Principle in §1.3.

---

## 1.2 Executive Architecture

### 1.2.1 High-Level Architecture

Planviry is a monorepo Next.js application backed by Supabase (Postgres +
Auth + Storage + Realtime + Edge Functions). It exposes a public-facing
consumer web app, a vendor portal web app, and an internal admin interface —
all sharing one Supabase project and one domain schema. External integrations
(Ticketmaster, Expedia content, Algolia, Stripe) are consumed via API and
normalized into the platform's own schema — **never** treated as live
pass-through queries at render time.

| Layer                | Technology                          | Responsibility                                                       |
| ------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| Frontend (Consumer) | Next.js 16, shadcn/ui, Tailwind, Zustand, TanStack Query | Guest-facing catalog, discovery, booking, cart, itinerary |
| Frontend (Vendor Portal) | Next.js 16, same stack, separate `app/` boundary | Vendor dashboard, listing management, PMS, service tickets |
| Frontend (Admin)    | Next.js 16, same stack, role-gated  | Platform moderation, taxonomy management, analytics                  |
| API Layer           | Next.js API Routes + Supabase RPC   | Business logic, validation, state transition enforcement             |
| Edge Functions      | Supabase Edge Functions (Deno)      | Webhooks, async triggers, external API sync, TTL sweeps              |
| Database            | Supabase / PostgreSQL 15+           | All persistent state; RLS for tenant isolation                       |
| Search              | Algolia                             | Full-text, geo, faceted search across all inventory                  |
| Auth                | Supabase Auth (native)              | JWT lifecycle, session management, OAuth, magic link                 |
| Payments            | Stripe + Stripe Connect             | Consumer checkout, multi-vendor split payouts                        |
| Storage             | Supabase Storage (S3-compatible)    | Listing images, media uploads, documents                             |
| Realtime            | Supabase Realtime (WebSocket)       | Live booking status, cart sync, presence                             |
| Email               | Resend                              | Transactional email: confirmations, notifications, digests           |
| Maps                | MapLibre                            | Venue/listing geo display, location-scoped search                    |

### 1.2.2 Component Map

The monorepo is partitioned into apps, packages, workers, and functions. The
partition is binding (see Part II §2.1 for the canonical tree and import
rules).

| Component       | App Boundary               | Owns                                                                   |
| --------------- | -------------------------- | ---------------------------------------------------------------------- |
| consumer-web    | `apps/consumer-web`        | All guest-facing pages, orchestration shell, booking flow, cart, itinerary UI |
| vendor-portal   | `apps/vendor-portal`       | Vendor dashboard, PMS grid, booking calendar, listing management, AI-assist surface |
| admin-portal    | `apps/admin-portal`        | Moderation queue, taxonomy engine UI, analytics, seeding management    |
| api             | `apps/api` (or Next.js route handlers) | REST + RPC endpoints shared across all apps               |
| db              | `packages/db`              | Drizzle/SQL schema definitions, migration files, seed scripts, RLS policies |
| ui              | `packages/ui`              | Shared shadcn component library, design system tokens                  |
| search          | `packages/search`          | Algolia client wrapper, index schema definitions, ingestion helpers    |
| analytics       | `packages/analytics`       | Event tracking, Segment/PostHog wrapper, event catalog                 |
| email-templates | `packages/email-templates` | Resend React Email templates                                           |
| workers         | `workers/`                 | Background jobs: TTL sweep, search re-index, notification digest, sync |
| functions       | `functions/`               | Supabase Edge Functions: webhooks, Stripe events, external sync        |

### 1.2.3 Request Lifecycle

Every guest- or vendor-initiated request flows through the same 11-step
lifecycle. The steps are ordered; skipping a step is a constraint violation.

1. **User action** triggers a client-side event (click, form submit, URL
   change).
2. **TanStack Query** dispatches the API call (or the Supabase client issues
   an RPC directly for reads).
3. **Next.js API Route** (or Supabase Edge Function) receives the request.
4. **Auth middleware** validates the JWT — rejects with `401` if invalid or
   expired.
5. **Authorization check** — RLS via Supabase, or an explicit role check in
   the route handler.
6. **Input validation** (Zod schema) — rejects with `422` if invalid.
7. **Business-rule evaluation** (`BR-` checks) — rejects with `409` or `400`
   if violated.
8. **Database transaction** — read-lock on inventory, write state transition,
   emit event. All transitions go through the Reservation FSM (Part V) per
   CONSTRAINT-005.
9. **Post-write** — search-index update queued, notification queued,
   analytics event emitted.
10. **Response** — structured JSON (success payload, or structured error with
    code + message — see Principle "Fail Loudly" in §1.3).
11. **Client** — TanStack Query updates cache optimistically if applicable;
    renders new state.

> **NOTE on numbering.** The spec source numbers these steps 15–25 because the
> list continues from a prior section; the lifecycle itself is 11 steps. The
> numbering above is normalized for this document.

### 1.2.4 Security Model Overview

- **Authentication:** Supabase Auth JWTs — short-lived access tokens (1h),
  refresh tokens (30d), rotation on use.
- **Authorization:** Postgres RLS policies enforce row-level isolation by
  `user_id`, `vendor_id`, and role — **no application-layer bypass possible**.
- **Tenant Isolation:** Every vendor's data is scoped by `vendor_id` in RLS —
  cross-tenant reads are impossible at the DB layer (binding form of
  CONSTRAINT-004).
- **Secrets:** Environment variables via Supabase secrets manager — never in
  source code or client bundles.
- **Input:** All external inputs validated through Zod schemas before any
  database or business-logic contact (binding form of step 6 above).
- **Rate Limiting:** Enforced at the Edge Function level and the Supabase
  connection pooler — see Part XXVIII for thresholds.

---

## 1.3 Architecture Principles

The principles below are binding rules, not aspirations. Each Principle has a
Rule (the imperative) and a Rationale (why the rule exists). When a Principle
and a convenience conflict, the Principle wins.

| Principle                    | Rule                                                                                | Rationale                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Moat First                   | Every architectural decision must be evaluated: does it reinforce or weaken the cross-vertical cart? | The cart/itinerary moat is the only structural differentiator; it must never be sacrificed for local convenience. |
| State in Postgres            | All canonical state lives in Postgres. Client state is derived, never authoritative. | Prevents split-brain between client cache and database truth.                                   |
| FSM Enforcement              | No state field may be written directly. All transitions go through defined FSM functions. | Prevents illegal state transitions and audit gaps.                                              |
| Location Gate                | No inventory query renders without a location parameter. Enforced at API + client guard. | Core UX invariant: every session is scoped to a place.                                          |
| Vertical Lens, Not Navigation | The Vertical Row swaps feed content in place. It never changes the page route.     | Preserves session context across verticals — the mechanism of orchestration made visible.       |
| Blueprint, Not Dependency    | Reference repos (Hi.Events, Cal.com, etc.) are patterns to translate, never runtime imports. | Avoids version coupling, license risk, and incompatible data models.                            |
| RLS as Last Defense          | Application-layer auth checks exist, but RLS policies are the authoritative access control. | Defense in depth; a bug in application auth cannot leak cross-tenant data.                      |
| Fail Loudly                  | Every failure mode has an explicit error code, user message, and recovery path.    | Silent failures are harder to debug and worse for users than explicit, recoverable errors.      |
| No Zero-Location Page        | Category landing pages without a location are an error state, not a valid empty state. | Enforces the two-door entry model; prevents useless unscoped results.                           |

### Principle-to-Constraint mapping

| Principle                | Constraint that codifies it |
| ------------------------ | --------------------------- |
| Moat First               | CONSTRAINT-001              |
| Location Gate            | CONSTRAINT-002              |
| Vertical Lens, Not Navigation | CONSTRAINT-003         |
| RLS as Last Defense      | CONSTRAINT-004              |
| FSM Enforcement          | CONSTRAINT-005              |

> The remaining Principles ("State in Postgres", "Blueprint, Not Dependency",
> "Fail Loudly", "No Zero-Location Page") do not have a single CONSTRAINT
> counterpart because they are enforced structurally — by the architecture
> (§1.2), the ADRs (§1.4), or the failure-mode registry (Part XXXIII).

---

## 1.4 Architectural Decision Records (ADR)

Each ADR below records a decision that has been made and **must not be
re-litigated without a formal amendment process**. The ADR format is fixed:
Problem, Alternatives, Decision, Rationale, Consequences, Status. Resolved
ADRs (§1.4.1) are binding. Open conflicts (§1.4.2) are tracked here for
visibility but live in Part XLII until resolved; an open conflict blocks the
Parts named in its "Resolution Required By" field.

### 1.4.1 Resolved ADRs

#### ADR-001 — Supabase Auth over Clerk

| Field         | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Problem       | Two identity providers were evaluated: Clerk (per TicketiHub reference) and Supabase Auth (native).   |
| Alternatives  | Clerk: better DX, built-in UI components, hosted user management. Supabase Auth: native Postgres integration, eliminates user-sync problem. |
| Decision      | **Supabase Auth.**                                                                                     |
| Rationale     | Clerk requires maintaining a user sync between Clerk's store and Supabase's `auth.users` table. Any desync creates a support and security surface. Supabase Auth writes directly to `auth.users`, which is the same table RLS policies reference — no sync layer required. |
| Consequences  | We build our own auth UI (sign-up, sign-in, magic link, OAuth flows) in shadcn components. No Clerk billing dependency. |
| Status        | RESOLVED                                                                                               |

#### ADR-002 — Derived Status + Stored Canonical Status

| Field         | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Problem       | Hi.Events stores derived status in a column (fast to query, stale-data risk). hotel-back-office computes status at runtime from sub-entity states (always fresh, no index to query against). |
| Decision      | **Both:** store a `canonical_status` column **AND** provide a computed `display_status` via RPC / materialized view. |
| Rationale     | `canonical_status` enables indexed queries and filtering. Computed `display_status` catches edge cases where sub-entity state has advanced but the canonical column hasn't been updated yet. The RPC is the source of truth for display; `canonical_status` is the source of truth for queries. |
| Status        | RESOLVED                                                                                               |

#### ADR-003 — Polymorphic Inventory Model

| Field         | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Problem       | Hi.Events models quantity-based ticket inventory. movinin models date-range resource blocking. These are fundamentally different models that must coexist for a cross-vertical cart. |
| Decision      | **Support both natively in the `InventoryItem` schema** using a category enum and category-specific metadata JSONB. |
| Rationale     | Forcing all inventory into either a quantity model or a date-range model breaks at least one category. The polymorphic model with per-category validation rules on the metadata JSONB satisfies both without schema compromise. |
| Consequences  | Part XLIII.2 defines the complete polymorphic schema. Adding a new category requires a new enum value and metadata validation rule — **not** a schema migration. |
| Status        | RESOLVED                                                                                               |

#### ADR-004 — Notifications: Peppermint Fan-Out + movinin 3-Channel Delivery

| Field         | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Problem       | Hi.Events implements tier-limited notification counts. Peppermint implements a fan-out queue. movinin implements 3-channel (in-app, email, push) delivery. All three were evaluated. |
| Decision      | **Peppermint fan-out mechanism combined with movinin 3-channel delivery.** Hi.Events tier-limiting explicitly rejected. |
| Rationale     | Hi.Events' tier approach is an OTA monetization mechanism (pay more for more notifications) that is not relevant to this platform's model. Peppermint's fan-out correctly handles multi-recipient events (e.g., all group members on an itinerary get notified of a booking change). movinin's 3-channel model maps to the platform's actual delivery surface. |
| Status        | RESOLVED                                                                                               |

### 1.4.2 Open ADRs (Conflicts — Must Be Resolved Before Dependent Parts Build)

The conflicts below are reproduced here for governance visibility. Their
canonical home is Part XLII. Each conflict blocks the Parts named in its
"Resolution Required By" field — those Parts cannot satisfy C-14 (Part 0
§0.3) until the conflict is resolved and the resolution is back-propagated
into a new ADR under §1.4.1.

> **NOTE.** Open conflicts are tracked separately from resolved ADRs to keep
> the "binding decision" set in §1.4.1 free of unresolved items. When a
> conflict is resolved, it is removed from §1.4.2 and a new ADR is added to
> §1.4.1 in a single versioned edit.

#### CONFLICT-005 — Geo + Booking-Overlap Logic on One Reservation Row

| Field                | Value                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Domains in Conflict  | Hi.Events (no geo modeling at all) vs. movinin (`checkIn`/`checkOut` overlap, night-by-night stays only). |
| Nature of Collision  | If geo-scoping **AND** overlap-checking must live on the same Reservation row for cross-vertical bookings, neither reference repo's row design handles both simultaneously. A hotel night has a date-range overlap constraint. A concert ticket has a geo constraint but no overlap (multiple tickets to same event are valid). A venue booking has both. |
| Resolution Required By | Part VI schema finalization (Reservation table DDL) and Part XLIII.3 (Unified Reservation Ledger).   |
| Status               | OPEN — must be resolved before Part VI and Part XLIII.3 are written.                                   |

#### CONFLICT-006 — Multi-Vendor Split Payouts from One Cart

| Field                | Value                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Domains in Conflict  | Hi.Events Stripe Connect (one organizer, one payout per order) vs. TicketiHub single-merchant checkout. |
| Nature of Collision  | Neither reference demonstrates splitting one Stripe checkout session across multiple connected accounts. A cart containing a hotel, a DJ, and a venue booking must route payment to three different Stripe Connect accounts in a single transaction. |
| Resolution Required By | Part XLIII.5 (Cart Service Contract) and Part XI (payment API endpoints).                            |
| Candidate Solutions  | Option A: Single Stripe payment intent with post-capture transfer splits. Option B: Multiple payment intents, one per vendor, coordinated at checkout. Option C: Platform collects full amount, distributes via Stripe Transfer API post-settlement. |
| Status               | OPEN — must be resolved before Part XLIII.5 is written.                                                |

#### CONFLICT-007 — Federated Search Ranking

| Field                | Value                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Domains in Conflict  | Single Algolia index with category facet vs. multiple indices merged at query time.                    |
| Nature of Collision  | When a query must rank a DJ, a hotel night, and a concert ticket against the same input, single-index boosting is insufficient — a DJ's relevance signals (reviews, response rate) are not comparable to a hotel's (star rating, cancellation policy). Cross-index merging adds latency and complexity. |
| Resolution Required By | Part VI (Algolia index schema) and Part XVII (Search spec) — must be resolved before either is written. |
| Status               | OPEN — must be resolved before Part XVII and the Part VI search-index section are written.            |

---

## Status

| Item                  | State                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| Part I completeness   | COMPLETE for the foundation release                                            |
| Open `SPEC-GAP` items | None in Part I scope (CONFLICT-005/006/007 are tracked in Part XLII)           |
| Resolved ADRs         | ADR-001, ADR-002, ADR-003, ADR-004 — all RESOLVED and binding                  |
| Open conflicts        | CONFLICT-005, CONFLICT-006, CONFLICT-007 — block named downstream Parts        |
| Next Part             | Part II — Repository Architecture, see `02-repository.md`                      |

Part I is the constitution. Everything below it is law only insofar as it is
consistent with what is written here.
