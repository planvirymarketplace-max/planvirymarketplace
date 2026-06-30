# Part III — Domain Definition

> **Status: COMPLETE** — the full domain catalog (DOM-001 → DOM-020) is
> implemented as Zod schemas + TypeScript types in
> [`packages/types/src/domain/`](../packages/types/src/domain/). Event payloads
> are in [`packages/types/src/events/`](../packages/types/src/events/).

## 3.1 Domain Object Catalog

Every entity below has a unique ID (DOM-XXX), an owner (the module responsible
for its lifecycle), a description, key business rules, relationships, lifecycle
phases, and the events it emits and consumes. Schema DDL is authored in Part VI;
state machines are in Part V; API contracts are in Part XI.

The binding **runtime** shapes live in `@planviry/types`. The table below is the
human-readable index; each row links to the implementing file.

| DOM-ID | Entity | Owner | Implementing File | Key Business Rules |
| --- | --- | --- | --- | --- |
| DOM-001 | User | Auth Module (Part VII) | `packages/types/src/domain/user.ts` | BR-U-001 email unique · BR-U-002 one role per vendor · BR-U-003 deleted user bookings anonymized |
| DOM-002 | VendorAccount | Vendor Listing Mgmt | `packages/types/src/domain/vendor-account.ts` | BR-V-001 exactly one OWNER · BR-V-002 seeded has no account until claimed · BR-V-003 claim requires identity verification |
| DOM-003 | InventoryItem | Cross-Vertical Inventory (Part XLIII) | `packages/types/src/domain/inventory-item.ts` | BR-I-001 valid category · BR-I-002 metadata validated per category · BR-I-003 active reservations prevent delete |
| DOM-004 | Reservation | Reservation Mgmt | `packages/types/src/domain/reservation.ts` | BR-R-001 FSM only · BR-R-002 PENDING TTL 15min · BR-R-003 CONFIRMED not hard-deleted · BR-R-004 serializable txn + row lock · BR-R-005 no overlapping confirmed · BR-R-006 cancellation policy at cancel time |
| DOM-005 | ItinerarySession | Travel Mgmt | `packages/types/src/domain/itinerary-session.ts` | BR-IT-001 ≥1 reservation before share · BR-IT-002 members VIEW/EDIT · BR-IT-003 cost-split on session |
| DOM-006 | Cart | Cart Service (Part XLIII.5) | `packages/types/src/domain/cart.ts` | BR-C-001 multi-category multi-vendor · BR-C-002 idle SESSION_TTL cleared · BR-C-003 atomic checkout · BR-C-004 partial failure aborts all · BR-C-005 unverified email blocks checkout |
| DOM-007 | Event (Ticketed) | Ticketing Mgmt (Hi.Events TRANSLATE) | `packages/types/src/domain/event.ts` | BR-EV-001 ≥1 TicketTier before publish · BR-EV-002 total sold ≤ capacity · BR-EV-003 cancelled triggers refund |
| DOM-008 | ServiceTicket | Ticketing Mgmt (Peppermint PATTERN) | `packages/types/src/domain/service-ticket.ts` | BR-ST-001 assigned within ASSIGNMENT_SLA · BR-ST-002 COMPLETED needs note · BR-ST-003 URGENT triggers push |
| DOM-009 | Profile | Auth Module | `packages/types/src/domain/profile.ts` | display name, avatar, preferences, notification settings |
| DOM-010 | Review | UGC Module (Part XLIX) | `packages/types/src/domain/review.ts` | verified-booking-required-to-review policy pending (Part XLIX.4) |
| DOM-011 | MediaAsset | Media Service (Part X) | `packages/types/src/domain/media-asset.ts` | Supabase Storage; attached to Listing/Event/User |
| DOM-012 | PricingRule | Booking Engine | `packages/types/src/domain/pricing-rule.ts` | OVERRIDE or DERIVED rate; date range / condition scoped |
| DOM-013 | AvailabilityBlock | Booking Engine | `packages/types/src/domain/availability-block.ts` | MANUAL_CLOSE / MAINTENANCE / OTHER |
| DOM-014 | Notification | Notification Service (Part X) | `packages/types/src/domain/notification.ts` | IN_APP / EMAIL / PUSH; QUEUED→SENT|FAILED |
| DOM-015 | PaymentRecord | Payment Module | `packages/types/src/domain/payment-record.ts` | Stripe PaymentIntent; linked to ≥1 Reservations; payout splits |
| DOM-016 | Report | Moderation Module (Part XXI) | `packages/types/src/domain/report.ts` | flag on Listing/Review/User; OPEN→REVIEWING→RESOLVED|DISMISSED |
| DOM-017 | SearchDocument | Search Service (Part X) | `packages/types/src/domain/search-document.ts` | Algolia document; denormalized for query performance |
| DOM-018 | TaxonomyTag | Taxonomy Engine (Part XVIII) | `packages/types/src/domain/taxonomy-tag.ts` | GENRE/SUBGENRE/TAG/FACET/CATEGORY/DYNAMIC/STATIC/USER/SEARCH |
| DOM-019 | StripeConnectAccount | Payment Module | `packages/types/src/domain/stripe-connect-account.ts` | charges_enabled, payouts_enabled flags |
| DOM-020 | VendorStaff | Vendor Listing Mgmt | `packages/types/src/domain/vendor-staff.ts` | User × VendorAccount join; OWNER/MANAGER/STAFF + permissions |

## 3.2 Implementation Conventions

Each entity file in `packages/types/src/domain/` exports:

1. **`<PascalName>Schema`** — a Zod object schema (`.strict()`) that is the
   runtime-validation source of truth. Status / category / priority fields use
   `z.enum([...])`; timestamps use `z.string().datetime()`; cents use
   `z.number().int().nonnegative()`.
2. **`<PascalName>`** — the TypeScript type inferred from the schema, with the
   `id` field overridden to the branded nominal type from `../ids` (e.g.
   `UserId`, `InventoryItemId`). This makes cross-entity ID swaps a compile
   error without complicating runtime validation.
3. **`<PascalName>_META`** — a const object recording `{ id, owner, description,
   lifecycle, eventsEmitted, eventsConsumed, source? }` for traceability
   (Part XXXVI) and documentation generation.

### Leaf-package boundary

`@planviry/types` is a **leaf** per Part II §2.2: it may only import from
`@planviry/config`. It does **not** import from `@planviry/shared`. Where an
enum is shared (e.g. `INVENTORY_CATEGORIES`), it is redefined inline in
`inventory-item.ts` with a comment mandating sync with
`shared/constants.ts`. This keeps the dependency graph acyclic.

### Event payloads

`packages/types/src/events/` contains one file per event-producing entity
family. Each file exports a Zod schema per event type and a
`z.discriminatedUnion("type", [...])` so consumers can narrow on `event.type`
exhaustively. 36 event payload schemas are defined across 9 files.

## 3.3 Branded IDs

All entity IDs are branded nominal types (see `packages/types/src/ids.ts`):

```ts
type UserId          = Brand<string, "UserId">;
type InventoryItemId = Brand<string, "InventoryItemId">;
type ReservationId   = Brand<string, "ReservationId">;
// … 20 total
```

This prevents accidentally passing a `VendorAccountId` where a `UserId` is
expected — a class of bug that would otherwise be invisible until runtime.

## 3.4 NATIVE-NO-PATTERN Entities

The following entities have **no upstream precedent** in any of the six mined
reference repositories (Part XLII §42.2). They are designed from the moat
backward and are the structural expression of Planviry's differentiation:

- **DOM-005 ItinerarySession** — no reference repo implements trip aggregation
  across verticals.
- **DOM-006 Cart** (cross-vertical sense) — Hi.Events orders are hard-scoped to
  a single event; no reference repo models a one-cart-many-verticals container.
- **DOM-003 InventoryItem** (polymorphic sense) — the polymorphic unification
  of lodging/dining/tickets/venues into one schema is native.

These three are the entities that make the moat structurally true. Every other
entity has a translated or pattern-derived upstream source.

## 3.5 Verification

- `cd packages/types && bunx tsc --noEmit` → **exit code 0** (clean typecheck).
- Runtime smoke test: valid samples parse; unknown fields rejected via
  `.strict()`; invalid email rejected; invalid Reservation status rejected.
- 20 domain entity files + 9 event payload files = 29 implementation files,
  all re-exported through the barrel at `packages/types/src/index.ts`.
