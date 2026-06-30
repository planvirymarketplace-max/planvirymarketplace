# Part XI — APIs

> **Status: CONTRACT COMPLETE.** The API surface types, global standards, and
> the full nine-section endpoint catalog below are the binding specification for
> every HTTP-facing entry point in the Planviry platform. Supporting
> infrastructure — response envelope, error-code catalog, JWT auth context,
> rate limiter, and Zod input schemas — is implemented in
> `apps/consumer-web/src/lib/api/` (six modules: `envelope.ts`, `errors.ts`,
> `auth.ts`, `rate-limit.ts`, `schemas.ts`, `index.ts`). The Next.js App
> Router route-segment directory tree is scaffolded under
> `apps/consumer-web/src/app/api/v1/` for every endpoint listed in §11.3;
> per-endpoint `route.ts` handlers are the subject of the API-001…API-030
> implementation tasks and must conform to the contracts in this document.
> See §Verification for the on-disk directory inventory and the exact
> `route.ts` paths the implementers must populate.

This Part is the **binding spec** for the Planviry HTTP API. Every endpoint
shipped to `apps/consumer-web/src/app/api/v1/`, `apps/vendor-portal/`, or
`apps/admin-portal/` must reproduce the contract recorded here. Deviations
require an ADR amendment under `docs/adr/` and an explicit version bump per
§11.2.5.

## 11.1 API Surface Types

The platform exposes six distinct API surface types, each with different
transport, authentication, and latency characteristics. A given feature may
span multiple surfaces (e.g. checkout fires REST → RPC → Edge Function in a
single user action).

| Surface Type        | Transport                       | Auth Required                  | Primary Use                                                       |
| ------------------- | ------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| REST                | HTTPS/JSON via Next.js Route Handlers | JWT (most endpoints); public read on catalog | CRUD operations, checkout, user management                        |
| RPC (Supabase)      | Supabase client → PostgreSQL functions | JWT + RLS                      | FSM transitions, atomic operations, complex queries               |
| Edge Functions      | Supabase Edge (Deno) over HTTPS | Stripe/webhook signature or JWT | Webhooks, async triggers, external API calls                      |
| Cron (pg_cron)      | PostgreSQL scheduler            | Internal (DB-level)            | TTL sweeps, digest batches, sync jobs                             |
| Webhooks (Inbound)  | HTTPS POST from external providers | Signature verification (Stripe, etc.) | Payment events, external status updates                           |
| Realtime (WebSocket) | Supabase Realtime over WSS      | JWT anon or authenticated       | Live booking status, cart sync, presence                          |

This Part focuses on the **REST** surface (§11.3.1 through §11.3.8) and the
**Inbound Webhook** surface (§11.3.9). RPC functions are catalogued per
operation in the relevant domain Part (e.g. `rpc_publish_inventory_item` is
specified in Part V §FSM-INV-002). Cron schedules live in Part XIV
(Background Jobs). Edge Functions are fully specified in Part XII.
Realtime channels are specified in Part XIII (Event Bus).

## 11.2 Global API Standards

The following standards apply to every endpoint across all surface types.
Deviations require an explicit ADR entry.

### 11.2.1 Request / Response Envelope

All REST endpoints return a structured JSON envelope. The shapes are
implemented in `apps/consumer-web/src/lib/api/envelope.ts` and are the
canonical wire format.

Success:

```json
{ "data": <payload>, "meta": { "request_id": "<uuid>" } }
```

Error:

```json
{
  "error": {
    "code": "<CODE>",
    "message": "<human-readable>",
    "field": "<field|null>"
  },
  "meta": { "request_id": "<uuid>" }
}
```

The `request_id` is generated server-side via `crypto.randomUUID()` and is
logged with every analytics event for cross-layer traceability (Part XXIX
Observability). The `field` member is `null` for non-field errors and the
dotted path (e.g. `"params.attendees"`) for field-level validation
failures.

### 11.2.2 HTTP Status Code Convention

| Status Code        | Meaning              | When Used                                                        |
| ------------------ | -------------------- | ---------------------------------------------------------------- |
| 200 OK             | Success with body    | GET, successful PUT/PATCH                                        |
| 201 Created        | Resource created     | POST that creates a new record                                   |
| 204 No Content     | Success, no body     | DELETE, status-only actions                                      |
| 400 Bad Request    | Validation failure   | Zod schema rejection; malformed input                            |
| 401 Unauthorized   | Not authenticated    | Missing or invalid JWT                                           |
| 403 Forbidden      | Not authorized       | JWT valid but RLS or role check failed                           |
| 404 Not Found      | Resource absent      | ID not found or RLS hides it                                     |
| 409 Conflict       | Business rule violation | Duplicate booking, inventory exhausted, FSM conflict           |
| 422 Unprocessable  | Semantic validation failure | Valid JSON but fails business rule (not Zod)              |
| 429 Too Many Requests | Rate limit exceeded | See per-endpoint rate limits below                               |
| 500 Internal Server Error | Unexpected failure | Unhandled exception; logs to observability (Part XXIX)   |
| 503 Service Unavailable | Dependency down   | Algolia, Stripe, or Supabase unreachable                         |

The full error-code catalog (~50 codes) is implemented in
`apps/consumer-web/src/lib/api/errors.ts`. Every error code is
`SCREAMING_SNAKE_CASE` and resolves to exactly one HTTP status.

### 11.2.3 Request Lifecycle (All REST Endpoints)

Every REST request passes through the following middleware chain, in
order. Failure at any stage halts the chain and returns the mapped status
code.

1. **Rate limit check** (Edge middleware) → `429` if exceeded. Implemented
   in `apps/consumer-web/src/lib/api/rate-limit.ts` as an in-memory
   sliding-window limiter; production swaps to Upstash Redis (Part XXX).
2. **JWT validation** (Supabase Auth middleware) → `401` if invalid or
   missing. Implemented in `apps/consumer-web/src/lib/api/auth.ts`; full
   Supabase Auth verification wired in Part VII.
3. **Zod input schema validation** → `400` with field-level errors.
   Schemas declared in `apps/consumer-web/src/lib/api/schemas.ts`.
4. **Business rule pre-checks** (BR- assertions) → `409` / `422`.
5. **RLS enforcement** (Supabase DB layer) → `403` / `404`.
6. **Database operation** (within transaction where specified).
7. **Post-write side effects**: search index update queued, analytics
   event emitted, notifications queued.
8. **Response serialized and returned** in the §11.2.1 envelope.

### 11.2.4 Authentication

Bearer token in `Authorization` header:

```
Authorization: Bearer <supabase_access_token>
```

Public endpoints (catalog read, search) accept requests without a token
but operate under the `anon` RLS role. Authenticated requests carry a
Supabase-issued JWT whose claims include `sub` (user id), `role`,
`vendor_id` (nullable), `vendor_role` (nullable), and `email_verified`.
The `AuthContext` type in `apps/consumer-web/src/lib/api/auth.ts` is the
canonical shape consumed by every route handler.

Webhook endpoints authenticate via provider-specific signature
verification (e.g. `Stripe-Signature` header), not JWT. See §11.3.9 and
Part XII §12.1.

### 11.2.5 Versioning

API versioning is path-based: `/api/v1/...`. All endpoints in this
specification are `v1`. Breaking changes increment the version and
maintain the prior version for a minimum of **90 days** before
deprecation. Non-breaking changes (additive fields, new optional query
params, new error codes) do not require a version bump but must be
announced in the API changelog under `docs/runbooks/api-changelog.md`.

## 11.3 Endpoint Catalog

Endpoints are grouped by domain. Each entry specifies the full contract.
Rate limits are per-user unless marked per-IP. Endpoint identifiers
(API-001…API-030) are stable references for the implementation tasks and
traceability matrix (Part XXXVI).

### 11.3.1 Authentication Endpoints

> **NOTE.** Auth flows are primarily handled by the Supabase Auth client
> SDK. The endpoints below are platform-side complements: profile creation
> hooks, session state queries, and vendor-claim flows.

#### API-001 — POST `/api/v1/auth/register`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/auth/register`                                                                     |
| Purpose            | Creates `user_profiles` record after Supabase Auth signup; triggers welcome email           |
| Auth               | Supabase anon JWT (new user token from signup)                                              |
| Rate Limit         | 10 requests / hour / IP                                                                     |
| Input Schema       | `{ display_name: string (1–80 chars), timezone?: string (IANA), locale?: string (BCP-47) }` |
| Output Schema      | `{ data: { user_id: uuid, display_name: string, created_at: iso8601 } }`                    |
| Side Effects       | Inserts `user_profiles` row; queues welcome email (template: `email-welcome`); emits `user.registered` analytics event |
| Error Codes        | 409 `USER_ALREADY_EXISTS` if profile already exists for this `auth.uid()`                   |
| Performance Budget | P95 < 500ms                                                                                 |

#### API-002 / API-003 — GET, PATCH `/api/v1/auth/me`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET (API-002), PATCH (API-003)                                                              |
| Route              | `/api/v1/auth/me`                                                                           |
| Purpose (GET)      | Returns authenticated user's profile, role, and vendor memberships                          |
| Purpose (PATCH)    | Updates user profile fields: `display_name`, `timezone`, `locale`, `notification_prefs`     |
| Auth               | Authenticated JWT required                                                                  |
| Rate Limit (GET)   | 120 requests / minute / user                                                                |
| Rate Limit (PATCH) | 30 requests / hour / user                                                                   |
| Input Schema (PATCH) | `Partial<{ display_name: string (1–80), timezone: string, locale: string, notification_prefs: object }>` |
| Validation (PATCH) | `display_name`: 1–80 chars, no leading/trailing whitespace. `timezone`: valid IANA string. `locale`: BCP-47 format |
| Output Schema (GET) | `{ data: { user_id, display_name, role, email_verified, vendor_memberships: [{ vendor_id, vendor_name, role }], notification_prefs, created_at } }` |
| Output Schema (PATCH) | `{ data: { updated fields } }`                                                           |
| Side Effects (PATCH) | Updates `user_profiles`; emits `user.profile_updated` analytics event                      |
| Caching (GET)      | `Cache-Control: private, max-age=60` — client caches for 60s; busted on role change         |
| Performance Budget | P95 < 100ms (GET, cached); P95 < 300ms (PATCH)                                              |

### 11.3.2 Inventory Endpoints

Inventory endpoints govern the lifecycle of `InventoryItem`s (DOM-003,
see Part III). Vendor-write endpoints enforce `vendor_id` scoping via
RLS. Public read endpoints are available without authentication.

#### API-004 — GET `/api/v1/inventory`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/inventory`                                                                         |
| Purpose            | Returns paginated list of published `InventoryItem`s matching filters. Primary catalog browse endpoint. |
| Auth               | Optional (anon or authenticated)                                                            |
| Rate Limit         | 300 requests / minute / IP                                                                  |
| Required Query Params | `location_id: uuid` OR (`lat: float`, `lng: float`, `radius_km: integer 1–100`)          |
| Optional Query Params | `category: inventory_category` enum; `price_min_cents: integer`; `price_max_cents: integer`; `date_from: ISO8601`; `date_to: ISO8601`; `attendees: integer`; `page: integer (default 1)`; `per_page: integer (default 24, max 48)`; `sort: 'relevance' \| 'price_asc' \| 'price_desc' \| 'newest'` |
| Output Schema      | `{ data: { items: InventoryItem[], total: integer, page: integer, per_page: integer, has_next: boolean }, meta: { request_id } }` |
| Business Rules     | BR-GLOBAL-001: location param is required — returns 400 `LOCATION_REQUIRED` if missing      |
| Caching            | `Cache-Control: public, max-age=60, stale-while-revalidate=300`                             |
| Error Codes        | 400 `LOCATION_REQUIRED`; 400 `INVALID_CATEGORY`; 400 `INVALID_DATE_RANGE`                   |
| Performance Budget | P95 < 200ms (Algolia-backed); < 800ms (DB fallback)                                         |

#### API-005 — POST `/api/v1/inventory`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/inventory`                                                                         |
| Purpose            | Creates a new `InventoryItem` in `DRAFT` state for the authenticated vendor                 |
| Auth               | Authenticated JWT; `vendor_id` in JWT claims (`VENDOR_OWNER` or `VENDOR_MANAGER` role)      |
| Rate Limit         | 60 creates / hour / vendor                                                                  |
| Input Schema       | `{ category: inventory_category; title: string (3–200); description?: string (max 5000); price_cents: integer >= 0; is_free?: boolean; location_id: uuid; metadata: object; capacity?: integer; quantity_available?: integer }` |
| Validation         | BR-I-001 (valid category); BR-I-006 (price); metadata shape validated per category enum     |
| Output Schema      | `{ data: { id: uuid, status: 'DRAFT', ...fields } }`                                       |
| Side Effects       | Inserts `inventory_items` row; does NOT push to Algolia (only on publish); emits `inventory.draft` analytics event |
| Error Codes        | 400 `INVALID_CATEGORY`; 400 `INVALID_PRICE`; 400 `INVALID_METADATA`; 403 `NOT_A_VENDOR`     |
| Performance Budget | P95 < 500ms                                                                                 |

#### API-006 / API-007 / API-010 — GET, PATCH, DELETE `/api/v1/inventory/:id`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET (API-006), PATCH (API-007), DELETE (API-010)                                            |
| Route              | `/api/v1/inventory/:id`                                                                     |
| Purpose (GET)      | Returns full detail for a single `InventoryItem` including pricing rules, availability, media, and vendor info |
| Purpose (PATCH)    | Updates fields on a `DRAFT` or `PAUSED` `InventoryItem`. `PUBLISHED` items require publish re-validation after update. |
| Purpose (DELETE)   | Archives (soft-deletes) an `InventoryItem`. Hard delete is not permitted.                   |
| Auth (GET)         | Optional                                                                                    |
| Auth (PATCH/DELETE) | Authenticated JWT; must be member of owning `VendorAccount` (BR-I-004). DELETE: `VENDOR_OWNER` only |
| Rate Limit (GET)   | 600 requests / minute / IP                                                                  |
| Rate Limit (PATCH) | 120 / hour / vendor                                                                         |
| Path Params        | `id: uuid`                                                                                  |
| Input Schema (PATCH) | `Partial<{ title, description, price_cents, metadata, capacity, quantity_available, location_id }>` |
| Output Schema (GET) | `{ data: { ...InventoryItem, vendor: { id, name, slug, stripe_charges_enabled }, media: MediaAsset[], pricing_rules: PricingRule[], availability: AvailabilityBlock[] } }` |
| Output Schema (PATCH) | `{ data: { ...updated InventoryItem } }`                                                 |
| Output Schema (DELETE) | 204 No Content                                                                           |
| Business Rules (GET) | RLS: only `PUBLISHED` items visible to anon/consumer; `DRAFT`/`PAUSED` visible to owning vendor staff |
| Business Rules (PATCH) | BR-I-004: only owning vendor may update. `CONFIRMED` Reservations trigger validation to ensure update does not break existing bookings |
| Business Rules (DELETE) | BR-I-003: item with active (`PENDING` or `CONFIRMED`) Reservations cannot be archived — returns 409 |
| Side Effects (PATCH) | If item is `PUBLISHED`: re-queues Algolia index update. Emits `inventory.updated` analytics event |
| Side Effects (DELETE) | Sets `status = 'ARCHIVED'`, `archived_at = NOW()`; Algolia document removed                |
| Caching (GET)      | `Cache-Control: public, max-age=120, stale-while-revalidate=600`                            |
| Error Codes        | 404 `NOT_FOUND` (GET); 403 `NOT_AUTHORIZED`; 409 `HAS_ACTIVE_RESERVATIONS` (PATCH capacity reduction / DELETE) |
| Performance Budget | P95 < 150ms (GET); P95 < 400ms (PATCH); P95 < 400ms (DELETE)                                |

#### API-008 — POST `/api/v1/inventory/:id/publish`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/inventory/:id/publish`                                                             |
| Purpose            | Transitions `InventoryItem` from `DRAFT → PUBLISHED`. Runs full metadata validation before transition. |
| Auth               | Authenticated JWT; `VENDOR_OWNER` role required                                             |
| Input Schema       | None (empty body or `{}`)                                                                   |
| Validation         | BR-EV-001 (events: at least one `TicketTier`); BR-I-002 (metadata complete); BR-EV-006 (event date future) |
| Output Schema      | `{ data: { id, status: 'PUBLISHED', published_at: iso8601 } }`                              |
| Side Effects       | FSM transition via RPC (`rpc_publish_inventory_item`); Algolia document pushed (`search-ingest` Edge Function queued); `inventory.published` event emitted; analytics event |
| Error Codes        | 400 `METADATA_INCOMPLETE` (with field list); 409 `INVALID_STATE_TRANSITION` (item not in `DRAFT`/`PAUSED`) |
| Performance Budget | P95 < 800ms (includes Algolia queue)                                                        |

#### API-009 — POST `/api/v1/inventory/:id/pause`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/inventory/:id/pause`                                                               |
| Purpose            | Transitions `PUBLISHED → PAUSED`. Item removed from search; no new Reservations accepted.   |
| Auth               | `VENDOR_OWNER` or `VENDOR_MANAGER`; or `MODERATOR`/`ADMIN` for moderation pause             |
| Output Schema      | `{ data: { id, status: 'PAUSED' } }`                                                        |
| Side Effects       | FSM transition; Algolia document deleted; Cart items containing this item flagged with `ITEM_UNAVAILABLE`; users with pending Cart items notified |
| Error Codes        | 409 `HAS_ACTIVE_CHECKOUT` (item in a checkout session with held inventory — must wait for TTL) |
| Performance Budget | P95 < 600ms                                                                                 |

### 11.3.3 Reservation Endpoints

Reservation endpoints govern the booking lifecycle. All state transitions
go through named RPCs — no direct status writes from API routes.

#### API-011 — GET `/api/v1/reservations`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/reservations`                                                                      |
| Purpose            | Returns the authenticated user's reservations, or vendor's incoming reservations (scoped by role) |
| Auth               | Authenticated JWT required                                                                  |
| Query Params       | `status?: reservation_status[]`; `from?: ISO8601`; `to?: ISO8601`; `page?: integer`; `per_page?: integer (max 50)` |
| Output Schema (Consumer) | `{ data: { reservations: [{ id, status, inventory_item: { id, title, category }, starts_at, ends_at, total_price_cents, confirmed_at }], total, page } }` |
| Output Schema (Vendor) | Same shape; scoped to reservations on vendor's `inventory_items` via RLS                |
| Caching            | No caching — reservation status is real-time sensitive                                      |
| Performance Budget | P95 < 300ms                                                                                 |

#### API-012 — GET `/api/v1/reservations/:id`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/reservations/:id`                                                                  |
| Purpose            | Returns full detail of a single `Reservation` including payment status, cancellation policy snapshot, and itinerary context |
| Auth               | Authenticated JWT; RLS enforces consumer sees own, vendor sees bookings on own inventory    |
| Output Schema      | `{ data: { ...Reservation, inventory_item: { id, title, category, vendor: { id, name } }, payment: { status, stripe_payment_intent_id }, itinerary_session_id } }` |
| Error Codes        | 404 `NOT_FOUND`                                                                             |
| Performance Budget | P95 < 200ms                                                                                 |

#### API-013 — POST `/api/v1/reservations/:id/cancel`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/reservations/:id/cancel`                                                           |
| Purpose            | Initiates the cancellation FSM for a `CONFIRMED` or `PENDING` `Reservation`                 |
| Auth               | Authenticated JWT; consumer (own reservation) or vendor (their inventory's reservation) or `ADMIN` |
| Input Schema       | `{ reason?: string (max 500 chars) }`                                                       |
| Business Rules     | BR-R-006: cancellation policy terms evaluated at cancellation time. Refund amount calculated and returned in response before confirmation. Cancellation is two-phase for `CONFIRMED`: preview refund → confirm cancel. |
| Output Schema (Preview, first call) | `{ data: { refund_amount_cents: integer, refund_policy_applied: string, confirm_token: string (expires 5 min) } }` |
| Output Schema (Confirm, second call with `confirm_token`) | `{ data: { reservation_id, status: 'CANCELLED', refund_amount_cents, stripe_refund_id } }` |
| Side Effects       | FSM: `CONFIRMED → CANCELLED`; Stripe refund initiated; inventory released; `reservation.cancelled` event; both parties notified |
| Error Codes        | 409 `INVALID_STATE` (not cancellable); 409 `CONFIRM_TOKEN_EXPIRED`                          |
| Performance Budget | P95 < 1000ms (includes Stripe API call)                                                     |

### 11.3.4 Cart & Checkout Endpoints

> **CRITICAL.** BR-C-004: If any Cart item fails inventory lock at
> checkout, the entire checkout aborts. No partial checkouts are
> permitted. The checkout endpoint must run all inventory locks inside a
> single serializable database transaction.

#### API-014 — GET `/api/v1/cart`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/cart`                                                                              |
| Purpose            | Returns the current cart state for the authenticated user (or anon session)                 |
| Auth               | Optional (anon JWT or authenticated JWT)                                                    |
| Output Schema      | `{ data: { cart_id: uuid, items: [{ cart_line_id, inventory_item_id, title, category, quantity, price_cents, params: { starts_at?, ends_at?, attendees? }, item_status: 'AVAILABLE' \| 'UNAVAILABLE' \| 'PRICE_CHANGED' }], subtotal_cents: integer, expires_at: iso8601 } }` |
| Caching            | No caching — cart is real-time                                                              |
| Performance Budget | P95 < 150ms                                                                                 |

#### API-015 — POST `/api/v1/cart/items`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/cart/items`                                                                        |
| Purpose            | Adds an `InventoryItem` to the cart. Does NOT hold inventory — holding occurs at checkout.  |
| Auth               | Optional (anon or authenticated)                                                            |
| Input Schema       | `{ inventory_item_id: uuid; quantity: integer (>= 1); params?: { starts_at?: ISO8601; ends_at?: ISO8601; attendees?: integer } }` |
| Business Rules     | BR-I-005: `PAUSED` items cannot be added. Item availability is checked at add time (soft check — hard lock at checkout). BR-C-001: cross-category/cross-vendor items allowed. |
| Output Schema      | `{ data: { cart_line_id: uuid, cart: <full cart state> } }`                                 |
| Side Effects       | Emits `cart.item_added` analytics event                                                     |
| Error Codes        | 404 `ITEM_NOT_FOUND`; 409 `ITEM_UNAVAILABLE`; 400 `INVALID_QUANTITY`                        |
| Performance Budget | P95 < 250ms                                                                                 |

#### API-016 / API-017 — PATCH, DELETE `/api/v1/cart/items/:cart_line_id`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | PATCH (API-016 — adjust quantity), DELETE (API-017 — remove line)                           |
| Route              | `/api/v1/cart/items/:cart_line_id`                                                          |
| Purpose            | PATCH: updates quantity on an existing line. DELETE: removes a line item from the cart.     |
| Auth               | Optional (same session as cart)                                                             |
| Output Schema      | `{ data: { cart: <full cart state> } }`                                                     |
| Side Effects       | Emits `cart.item_removed` (DELETE) analytics event                                          |
| Performance Budget | P95 < 150ms                                                                                 |

#### API-018 — POST `/api/v1/cart/checkout`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/cart/checkout`                                                                     |
| Purpose            | Initiates checkout: locks inventory, creates `PENDING` `Reservation`s, creates Stripe `PaymentIntent`, returns `client_secret` for frontend payment confirmation |
| Auth               | Authenticated JWT required (BR-C-005: must upgrade from anon before checkout)               |
| Rate Limit         | 20 requests / hour / user                                                                   |
| Input Schema       | `{ itinerary_session_id?: uuid (attach to existing itinerary); guest_details?: { name: string, email: string, phone?: string } }` |
| Transaction Boundary | Single serializable Postgres transaction: (1) lock all `InventoryItem`s; (2) check availability; (3) create `Reservation`s (`PENDING`); (4) decrement `quantity_reserved`; (5) set `expires_at = NOW() + TTL`. If any step fails, full rollback. |
| Business Rules     | BR-C-003; BR-C-004; BR-R-004; BR-U-005 (email verified). For CONFLICT-006 (multi-vendor split payouts) — interim implementation: single Stripe `PaymentIntent` with platform fee; split payouts via Transfer API post-capture. Full resolution in Part XLII Conflict #6. |
| Output Schema      | `{ data: { checkout_session_id: uuid, stripe_client_secret: string, reservations: [{ id, inventory_item_id, status: 'PENDING', expires_at }], total_price_cents: integer, expires_at: iso8601 } }` |
| Side Effects       | Creates `Reservation` rows (`PENDING`); starts TTL clock; emits `checkout.started` analytics event; `cart.checkout_started` event for Realtime |
| Error Codes        | 409 `ITEM_UNAVAILABLE` (with item list); 409 `INVENTORY_LOCK_FAILED`; 400 `EMPTY_CART`; 403 `EMAIL_NOT_VERIFIED`; 400 `CART_EXPIRED` |
| Performance Budget | P95 < 2000ms (serializable transaction + Stripe API)                                        |

### 11.3.5 Itinerary Endpoints

Itinerary endpoints manage `ItinerarySession`s (DOM-005) — the parent
record that groups cross-vertical `Reservation`s into a single trip or
occasion.

#### API-019 — POST `/api/v1/itineraries`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/itineraries`                                                                       |
| Purpose            | Creates a new `ItinerarySession`, optionally attaching existing confirmed `Reservation`s    |
| Auth               | Authenticated JWT                                                                           |
| Input Schema       | `{ title?: string (max 200); occasion_type?: string; reservation_ids?: uuid[] }`            |
| Business Rules     | BR-IT-001: session must have at least one `Reservation` before sharing (enforced at share-time, not creation). `Reservation`s in `reservation_ids` must belong to the calling user. |
| Output Schema      | `{ data: { id: uuid, title, status: 'ACTIVE', reservations: [...], created_at } }`          |
| Side Effects       | Emits `itinerary.created` analytics event                                                   |
| Performance Budget | P95 < 400ms                                                                                 |

#### API-020 / API-021 / API-022 — GET, PATCH, DELETE `/api/v1/itineraries/:id`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET (API-020), PATCH (API-021 — update title/occasion_type), DELETE (API-022 — soft delete) |
| Route              | `/api/v1/itineraries/:id`                                                                   |
| Purpose (GET)      | Returns full itinerary with all `Reservation`s, members, and conflict warnings              |
| Auth               | Authenticated JWT; owner or member (per `ItineraryMember.permission`)                       |
| Output Schema      | `{ data: { id, title, status, owner: { user_id, display_name }, members: [{ user_id, display_name, permission }], reservations: [{ ...Reservation, inventory_item, vendor }], conflicts: [{ type: 'TIME_OVERLAP' \| 'LOCATION_GAP', reservation_ids: [uuid, uuid], message: string }], total_cost_cents: integer } }` |
| Notes              | `conflicts` array is computed at read time by comparing `starts_at` / `ends_at` across all reservations. Geo-proximity warnings deferred to CONFLICT-005 resolution. |
| Error Codes        | 404 `NOT_FOUND`; 403 `NOT_A_MEMBER`                                                         |
| Performance Budget | P95 < 400ms                                                                                 |

#### API-023 — POST `/api/v1/itineraries/:id/share`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/itineraries/:id/share`                                                             |
| Purpose            | Generates a shareable link or invites specific users by email with `VIEW` or `EDIT` permission |
| Auth               | Authenticated JWT; itinerary owner or `EDIT` member                                         |
| Input Schema       | `{ type: 'link' \| 'email'; permission: 'VIEW' \| 'EDIT'; emails?: string[] (required if type=email) }` |
| Business Rules     | BR-IT-001: itinerary must have >= 1 `Reservation`. BR-IT-002: invited users get the specified permission; link recipients get `VIEW` by default. |
| Output Schema      | `{ data: { share_url?: string (if type=link); invited_emails?: string[]; expires_at?: iso8601 } }` |
| Side Effects       | Sends invitation emails (template: `email-itinerary-invite`); emits `itinerary.shared` analytics event |
| Performance Budget | P95 < 600ms                                                                                 |

### 11.3.6 Search Endpoints

> **BLOCKED (implementation only — contract is stable).** CONFLICT-007
> (federated search ranking: single Algolia index vs. multi-index merge)
> must be resolved before the Algolia index schema is finalized. The
> endpoint contracts below are stable; the backing implementation detail
> (how results are assembled) depends on that resolution.

#### API-024 — GET `/api/v1/search`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/search`                                                                            |
| Purpose            | Primary full-text + faceted search across all published `InventoryItem`s                    |
| Auth               | Optional                                                                                    |
| Rate Limit         | 300 / minute / IP                                                                            |
| Required Query Params | `q: string (1–200 chars)` AND (`location_id: uuid` OR (`lat: float`, `lng: float`, `radius_km: integer`)) |
| Optional Query Params | `category: inventory_category[]`; `price_min_cents`; `price_max_cents`; `date_from`; `date_to`; `attendees: integer`; `sort: 'relevance' \| 'price_asc' \| 'price_desc' \| 'newest' \| 'distance'`; `page`; `per_page (max 48)` |
| Output Schema      | `{ data: { hits: [{ item_id, title, category, price_cents, location, distance_km, score, media: [url] }], facets: { category: {[key]: count}, price_range: {...} }, total_hits, page, per_page, query_id: string } }` |
| Fallback Behavior  | If Algolia unavailable: fall back to Postgres `pg_trgm` full-text search; response includes `meta.degraded_mode: true` |
| Error Codes        | 400 `QUERY_TOO_SHORT`; 400 `LOCATION_REQUIRED`                                              |
| Performance Budget | P95 < 150ms (Algolia); < 1500ms (DB fallback)                                               |

#### API-025 — GET `/api/v1/search/autocomplete`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | GET                                                                                         |
| Route              | `/api/v1/search/autocomplete`                                                               |
| Purpose            | Returns autocomplete suggestions for the Plan bar "What" field                              |
| Auth               | Optional                                                                                    |
| Rate Limit         | 600 / minute / IP (high-frequency; called on keypress)                                       |
| Query Params       | `q: string (min 2 chars)`; `category?: inventory_category`; `location_id?: uuid`            |
| Output Schema      | `{ data: { suggestions: [{ text: string, type: 'category' \| 'query' \| 'item', category?: inventory_category }] } }` |
| Caching            | Results for `q >= 4` chars cached at Edge for 300s                                          |
| Performance Budget | P99 < 80ms                                                                                  |

### 11.3.7 Vendor Endpoints

Vendor endpoints cover account management, claim flow, staff management,
and onboarding. Booking dashboards are covered under Reservation
endpoints with vendor-scoped RLS.

#### API-026 — POST `/api/v1/vendors/claim`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/vendors/claim`                                                                     |
| Purpose            | Initiates the claim flow for a seeded `VendorAccount` listing                               |
| Auth               | Authenticated JWT (any registered user)                                                     |
| Input Schema       | `{ vendor_id: uuid; verification_method: 'email' \| 'phone'; contact_value: string }`       |
| Business Rules     | BR-V-003: claiming requires identity verification. A verification code is sent to `contact_value`. The `vendor_id` must currently be in `SEEDED` status. |
| Output Schema      | `{ data: { claim_token: string (expires 10 min); message: 'Verification code sent' } }`     |
| Side Effects       | Sends verification code via email/SMS; `claim_token` stored server-side for 10 min          |
| Error Codes        | 409 `ALREADY_CLAIMED`; 400 `INVALID_CONTACT`; 404 `VENDOR_NOT_FOUND`                        |
| Performance Budget | P95 < 800ms                                                                                 |

#### API-027 — POST `/api/v1/vendors/claim/verify`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/vendors/claim/verify`                                                              |
| Purpose            | Completes claim flow by verifying the code; creates `VendorAccount` ownership link          |
| Auth               | Authenticated JWT                                                                           |
| Input Schema       | `{ claim_token: string; verification_code: string }`                                        |
| Output Schema      | `{ data: { vendor_id, status: 'CLAIMED', vendor_portal_url: string } }`                     |
| Side Effects       | FSM: `SEEDED → CLAIMED`; `VendorStaff` row created (user → `OWNER`); `vendor.claimed` event emitted; onboarding email sent |
| Error Codes        | 400 `INVALID_CODE`; 400 `CLAIM_TOKEN_EXPIRED`; 409 `ALREADY_CLAIMED`                        |
| Performance Budget | P95 < 500ms                                                                                 |

#### API-028 — POST `/api/v1/vendors/:vendor_id/staff`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/vendors/:vendor_id/staff`                                                          |
| Purpose            | Invites a user to join a `VendorAccount` as staff                                           |
| Auth               | `VENDOR_OWNER` of the specified `vendor_id`                                                 |
| Input Schema       | `{ email: string; role: 'VENDOR_MANAGER' \| 'VENDOR_STAFF' }`                               |
| Business Rules     | BR-V-002: a user may hold at most one role per `VendorAccount`. Invited user must have an existing platform account. |
| Output Schema      | `{ data: { invitation_id: uuid, email, role, status: 'PENDING' } }`                         |
| Side Effects       | Sends staff invitation email; emits `vendor.staff_invited` analytics event                  |
| Error Codes        | 409 `ALREADY_A_MEMBER`; 404 `USER_NOT_FOUND`; 403 `NOT_VENDOR_OWNER`                        |
| Performance Budget | P95 < 600ms                                                                                 |

### 11.3.8 Event (Ticketed) Endpoints

These endpoints manage the ticketed `Event` lifecycle (DOM-007), built on
the Hi.Events-derived model. An `Event` is also an `InventoryItem`
(`category=EVENT_TICKET`), so inventory CRUD endpoints apply for basic
fields; these endpoints handle the Event-specific layers.

#### API-029 — POST `/api/v1/events/:event_id/ticket-tiers`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/events/:event_id/ticket-tiers`                                                     |
| Purpose            | Adds a ticket tier to an existing `Event`                                                   |
| Auth               | `VENDOR_OWNER` or `VENDOR_MANAGER` of the event's `VendorAccount`                           |
| Input Schema       | `{ name: string; type: ticket_tier_type; price_cents: integer >= 0; is_free?: boolean; capacity: integer; sales_start_at?: ISO8601; sales_end_at?: ISO8601; min_per_order?: integer; max_per_order?: integer; is_hidden?: boolean }` |
| Validation         | BR-EV-007; BR-EV-008. `sales_end_at <= event starts_at`.                                     |
| Output Schema      | `{ data: { tier_id: uuid, ...fields } }`                                                    |
| Error Codes        | 400 `INVALID_TIER_TYPE`; 400 `INVALID_SALES_WINDOW`; 409 `EVENT_SOLD_OUT` (capacity already exceeded) |
| Performance Budget | P95 < 400ms                                                                                 |

#### API-030 — POST `/api/v1/events/:event_id/checkin`

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Method             | POST                                                                                        |
| Route              | `/api/v1/events/:event_id/checkin`                                                          |
| Purpose            | Validates a QR check-in token and records check-in for a ticket `Reservation`               |
| Auth               | `VENDOR_OWNER`, `VENDOR_MANAGER`, or `VENDOR_STAFF` of the event's `VendorAccount`          |
| Rate Limit         | 600 / minute / vendor (burst 1000/5s for scanning)                                          |
| Input Schema       | `{ qr_token: string; method?: 'QR_SCAN' \| 'MANUAL' }`                                      |
| Business Rules     | BR-EV-004: duplicate check-in returns error with prior timestamp. BR-EV-005: check-in window enforced. |
| QR Token Validation | HMAC-SHA256 `verify(token, reservation_id + user_id + event_id + platform_secret)`. Reject if signature invalid or token expired (TTL: `event_end_at + 30 min`). |
| Output Schema      | `{ data: { reservation_id, attendee_name: string, tier_name: string, checked_in_at: iso8601 } }` |
| Error Codes        | 400 `INVALID_QR_TOKEN`; 409 `ALREADY_CHECKED_IN` (with `checked_in_at`); 409 `OUTSIDE_CHECKIN_WINDOW` |
| Performance Budget | P99 < 300ms (high-frequency; multiple scanners simultaneously)                              |

### 11.3.9 Inbound Webhook Endpoints

Inbound webhooks are handled by Supabase Edge Functions (see Part XII),
not Next.js route handlers. They are documented here for API surface
completeness. Every webhook authenticates via provider-specific signature
verification — never JWT.

| Route                             | Source                        | Auth Method                | Purpose                                                                                          |
| --------------------------------- | ----------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `POST /functions/v1/stripe-webhook` | Stripe                      | `Stripe-Signature` HMAC verification | Handles `payment_intent.succeeded`, `payment_intent.payment_failed`, `transfer.created`, `refund.created`, `account.updated` (Stripe Connect) |
| `POST /functions/v1/search-ingest`  | Internal (inventory change trigger) | Supabase `service_role` key | Triggered by DB trigger on `inventory_items` changes; pushes document to Algolia                 |
| `POST /functions/v1/notification-send` | Internal (notification queue) | Supabase `service_role` key | Dequeues and delivers notifications via Resend (email) or Web Push API                          |
| `POST /functions/v1/booking-ttl`    | `pg_cron` (scheduled)         | Supabase `service_role` key | Runs TTL sweep: expires `PENDING` `Reservation`s past `expires_at`; releases inventory          |

### 11.3.10 Rate Limit Summary

Rate limits are enforced by the middleware in
`apps/consumer-web/src/lib/api/rate-limit.ts`. The buckets below are
defined as the `RATE_LIMITS` constant and applied per-endpoint by the
route handlers.

| Endpoint Group                    | Limit      | Window   | Scope        | Burst Allowed                  |
| --------------------------------- | ---------- | -------- | ------------ | ------------------------------ |
| Search (`/api/v1/search`)         | 300 req    | 1 min    | per IP       | Yes — burst to 500 for 10s     |
| Autocomplete (`/api/v1/search/autocomplete`) | 600 req | 1 min | per IP   | Yes — burst to 1000 for 5s     |
| Catalog browse (`/api/v1/inventory`) | 300 req | 1 min    | per IP       | No                             |
| Auth endpoints (`/api/v1/auth/*`) | 10 req     | 1 hour   | per IP       | No                             |
| Checkout (`/api/v1/cart/checkout`) | 20 req    | 1 hour   | per user     | No                             |
| Inventory write (POST/PATCH/DELETE) | 60 req   | 1 hour   | per vendor   | No                             |
| Check-in endpoint (`/api/v1/events/:event_id/checkin`) | 600 req | 1 min | per vendor | Yes — scanning burst |
| All other authenticated endpoints | 120 req    | 1 min    | per user     | No                             |

Rate-limit scope falls back to IP when the user/vendor claim is absent
(e.g. anon requests to `/api/v1/search` use IP scope even though the
bucket scope is `ip`; authenticated requests to a `user`-scoped bucket
use `userId`, falling back to IP if the JWT is missing the `sub` claim).

## Verification

The supporting API infrastructure is implemented in
`apps/consumer-web/src/lib/api/`. The Next.js App Router route-segment
directory tree is scaffolded under `apps/consumer-web/src/app/api/v1/`
but the per-endpoint `route.ts` handlers themselves are pending the
API-001…API-030 implementation tasks.

### Implemented Infrastructure (`apps/consumer-web/src/lib/api/`)

The six modules below form the runtime that every `route.ts` handler
imports from.

| File            | Purpose                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| `envelope.ts`   | §11.2.1 response envelope: `ok()`, `noContent()`, `error()`, `requestId()`; `ApiSuccessResponse` / `ApiErrorResponse` / `ApiMeta` types |
| `errors.ts`     | §11.2.2 error code catalog: ~50 named builders (`LOCATION_REQUIRED`, `ITEM_UNAVAILABLE`, `INVALID_QR_TOKEN`, etc.) each returning the correct HTTP status; `zodErrors()` helper for field-level 400s |
| `auth.ts`       | §11.2.4 authentication: `AuthContext` type, `getAuthContext(req)` (decodes JWT payload), `requireAuth()`, `requireVendorRole()`; signature verification deferred to Part VII |
| `rate-limit.ts` | §11.3.10 rate limit buckets: `RATE_LIMITS` constant with the 8 named buckets, `checkRateLimit(req, config, auth)` sliding-window implementation, `getClientIp(req)` |
| `schemas.ts`    | §11.3 input schemas: `AuthRegisterInput`, `AuthMePatchInput`, `InventoryListQuery`, `InventoryCreateInput`, `InventoryPatchInput`, `ReservationListQuery`, `ReservationCancelInput`, `CartAddItemInput`, `CartCheckoutInput`, `ItineraryCreateInput`, `ItineraryShareInput`, `SearchQuery`, `AutocompleteQuery`, `VendorClaimInput`, `VendorClaimVerifyInput`, `VendorStaffInviteInput`, `EventTicketTierInput`, `EventCheckinInput` |
| `index.ts`      | Barrel re-exporting `ok` / `noContent` / `error` / `Errors` / `getAuthContext` / `requireAuth` / `checkRateLimit` / `RATE_LIMITS` / `Schemas` / `parseQuery()` |

### Scaffolded Route-Segment Directory Tree

Running `find /home/z/my-project/apps/consumer-web/src/app/api/v1 -type d | sort`
yields the following 29 directories (1 root + 28 route segments). The
leaf directories are the ones that must hold a `route.ts` file:

```
apps/consumer-web/src/app/api/v1/
├─ auth/
│  ├─ me/                                  # API-002 (GET), API-003 (PATCH)
│  └─ register/                            # API-001 (POST)
├─ cart/
│  ├─ checkout/                            # API-018 (POST)
│  └─ items/
│     └─ [cartLineId]/                     # API-016 (PATCH), API-017 (DELETE)
├─ events/
│  └─ [eventId]/
│     ├─ checkin/                          # API-032 (POST)
│     └─ ticket-tiers/                     # API-031 (POST)
├─ inventory/
│  └─ [id]/
│     ├─ pause/                            # API-009 (POST)
│     └─ publish/                          # API-008 (POST)
├─ itineraries/
│  └─ [id]/
│     └─ share/                            # API-023 (POST)
├─ reservations/
│  └─ [id]/
│     └─ cancel/                           # API-013 (POST)
├─ search/
│  └─ autocomplete/                        # API-025 (GET)
└─ vendors/
   ├─ [vendorId]/
   │  └─ staff/                            # API-028 (POST)
   └─ claim/
      └─ verify/                           # API-027 (POST)
```

### Expected `route.ts` File Inventory (23 files)

Each path below is the absolute `route.ts` location that the API-001…API-030
implementation tasks must populate. Eighteen of these locations are
scaffolded as empty leaf route-segment directories (the leaf dirs in the
tree above). The remaining five root-level locations (`/inventory`,
`/reservations`, `/cart`, `/itineraries`, `/search`) exist as scaffolded
parent directories but do not yet contain a `route.ts` file. The
verification command:

```bash
find /home/z/my-project/apps/consumer-web/src/app/api/v1 -name "route.ts" | sort
```

currently returns **zero results** — the contract documented in §11.3 is
the binding source that the implementers must reproduce. Every handler
must:

1. Import `ok`, `noContent`, `error`, `getAuthContext`, `requireAuth`,
   `requireVendorRole`, `checkRateLimit`, `RATE_LIMITS`, and the relevant
   Zod schema from `@/lib/api` (or `@/lib/api/index`).
2. Apply the §11.2.3 request lifecycle in order: rate limit → auth →
   schema → business rules → DB → side effects → response.
3. Return the §11.2.1 envelope for every success and every error.

| #  | Endpoint(s)                                                                                  | Route File                                                                                          |
| -- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1  | API-001 — `POST /api/v1/auth/register`                                                       | `apps/consumer-web/src/app/api/v1/auth/register/route.ts`                                           |
| 2  | API-002 — `GET /api/v1/auth/me` & API-003 — `PATCH /api/v1/auth/me`                          | `apps/consumer-web/src/app/api/v1/auth/me/route.ts`                                                 |
| 3  | API-004 — `GET /api/v1/inventory` & API-005 — `POST /api/v1/inventory`                       | `apps/consumer-web/src/app/api/v1/inventory/route.ts`                                               |
| 4  | API-006 — `GET`, API-007 — `PATCH`, API-010 — `DELETE /api/v1/inventory/:id`                 | `apps/consumer-web/src/app/api/v1/inventory/[id]/route.ts`                                          |
| 5  | API-008 — `POST /api/v1/inventory/:id/publish`                                               | `apps/consumer-web/src/app/api/v1/inventory/[id]/publish/route.ts`                                  |
| 6  | API-009 — `POST /api/v1/inventory/:id/pause`                                                 | `apps/consumer-web/src/app/api/v1/inventory/[id]/pause/route.ts`                                    |
| 7  | API-011 — `GET /api/v1/reservations`                                                         | `apps/consumer-web/src/app/api/v1/reservations/route.ts`                                            |
| 8  | API-012 — `GET /api/v1/reservations/:id`                                                     | `apps/consumer-web/src/app/api/v1/reservations/[id]/route.ts`                                       |
| 9  | API-013 — `POST /api/v1/reservations/:id/cancel`                                             | `apps/consumer-web/src/app/api/v1/reservations/[id]/cancel/route.ts`                                |
| 10 | API-014 — `GET /api/v1/cart`                                                                  | `apps/consumer-web/src/app/api/v1/cart/route.ts`                                                    |
| 11 | API-015 — `POST /api/v1/cart/items`                                                           | `apps/consumer-web/src/app/api/v1/cart/items/route.ts`                                              |
| 12 | API-016 — `PATCH` & API-017 — `DELETE /api/v1/cart/items/:cart_line_id`                       | `apps/consumer-web/src/app/api/v1/cart/items/[cartLineId]/route.ts`                                 |
| 13 | API-018 — `POST /api/v1/cart/checkout`                                                        | `apps/consumer-web/src/app/api/v1/cart/checkout/route.ts`                                           |
| 14 | API-019 — `POST /api/v1/itineraries`                                                          | `apps/consumer-web/src/app/api/v1/itineraries/route.ts`                                             |
| 15 | API-020 — `GET`, API-021 — `PATCH`, API-022 — `DELETE /api/v1/itineraries/:id`                | `apps/consumer-web/src/app/api/v1/itineraries/[id]/route.ts`                                        |
| 16 | API-023 — `POST /api/v1/itineraries/:id/share`                                                | `apps/consumer-web/src/app/api/v1/itineraries/[id]/share/route.ts`                                  |
| 17 | API-024 — `GET /api/v1/search`                                                                | `apps/consumer-web/src/app/api/v1/search/route.ts`                                                  |
| 18 | API-025 — `GET /api/v1/search/autocomplete`                                                   | `apps/consumer-web/src/app/api/v1/search/autocomplete/route.ts`                                     |
| 19 | API-026 — `POST /api/v1/vendors/claim`                                                        | `apps/consumer-web/src/app/api/v1/vendors/claim/route.ts`                                           |
| 20 | API-027 — `POST /api/v1/vendors/claim/verify`                                                 | `apps/consumer-web/src/app/api/v1/vendors/claim/verify/route.ts`                                    |
| 21 | API-028 — `POST /api/v1/vendors/:vendor_id/staff`                                             | `apps/consumer-web/src/app/api/v1/vendors/[vendorId]/staff/route.ts`                                |
| 22 | API-029 — `POST /api/v1/events/:event_id/ticket-tiers`                                        | `apps/consumer-web/src/app/api/v1/events/[eventId]/ticket-tiers/route.ts`                           |
| 23 | API-030 — `POST /api/v1/events/:event_id/checkin`                                             | `apps/consumer-web/src/app/api/v1/events/[eventId]/checkin/route.ts`                                |

### Example Handler Skeleton

Every `route.ts` file in the table above must conform to the skeleton
below. The skeleton imports every helper from `@/lib/api`, applies the
§11.2.3 request lifecycle, and returns the §11.2.1 envelope. Concrete
implementations substitute the correct schema, rate-limit bucket, auth
check, and DB call.

```ts
import { NextRequest } from "next/server";
import {
  ok, error, getAuthContext, requireAuth, checkRateLimit,
  RATE_LIMITS, Schemas, Errors, parseQuery,
} from "@/lib/api";

export async function POST(req: NextRequest) {
  // 1. Rate limit check
  const auth = getAuthContext(req);
  const rl = checkRateLimit(req, RATE_LIMITS.checkout, auth);
  if (rl) return rl;

  // 2. Auth
  const authErr = requireAuth(auth);
  if (authErr) return authErr.error;

  // 3. Input schema validation
  const body = await req.json().catch(() => null);
  const parsed = Schemas.CartCheckoutInput.safeParse(body);
  if (!parsed.success) return Errors.zodErrors(parsed.error);

  // 4. Business rule pre-checks (BR-*)
  // 5. RLS-enforced DB operation (single serializable txn)
  // 6. Post-write side effects (search queue, analytics, notifications)
  // 7. Response
  return ok({ /* checkout_session_id, stripe_client_secret, ... */ }, 201);
}
```

### Open Items

- The five root `route.ts` files (`/inventory`, `/reservations`, `/cart`,
  `/itineraries`, `/search`) are not yet present — their parent
  directories exist (holding the `[id]/`, `[cartLineId]/`, `items/`,
  `checkout/`, `autocomplete/` sub-routes) but no `route.ts` is committed
  at the root. The API-001…API-030 implementers must add the `route.ts`
  file at each of these five locations. The other 18 leaf directories in
  the tree above are scaffolded but empty.
- `vendors/[vendorId]/` and `events/[eventId]/` exist as parent
  directories for the `staff/` and `ticket-tiers` + `checkin` sub-routes
  respectively; the spec does not define a GET endpoint at the parent
  path, so no `route.ts` is expected there.
- Supabase Auth JWT signature verification is currently a no-op
  (`auth.ts` decodes the payload without verifying the signature).
  Part VII wires the real `supabase.auth.getUser(token)` call.
- The rate limiter is in-memory and correct only for single-instance
  dev. Production swaps to Upstash Redis or Supabase Edge rate-limiting
  in Part XXX (Infrastructure).
- CONFLICT-007 (federated search ranking) blocks the Algolia index
  schema decision; the §11.3.6 endpoint contracts are stable.
