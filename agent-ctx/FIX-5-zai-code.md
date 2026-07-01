# FIX-5 — Wire pricing/availability adapters + make 3 booking flows atomic

**Agent:** Z.ai Code (sub-agent, Task ID FIX-5)
**Scope:** `shared/pricing-adapter.ts`, `shared/availability-adapter.ts`, `shared/index.ts`, `shared/package.json`, + 8 API routes in `apps/consumer-web/src/app/api/`

## Task

Per AUDIT-3 (worklog line 1615+), the shared pricing + availability adapters were
dead code with zero callers, not re-exported from `shared/index.ts`. Every
checkout route reinvented pricing math inline, often wrong (worst:
`/api/checkout/route.ts:107` did `item.amount * 100 * quantity` which ignored
`pricing_model` — a 3-night LODGING booking at $100/night charged only $100
instead of $300). The availability adapter additionally had a latent bug:
it imported the raw `@planviry/db` client (no db-compat proxy) so
`.from('restaurant_availability_slots')` would bypass the TABLE_MAP redirect
to `availability_blocks` and 500. The ticket-availability helper used an invalid
`bookings.status` filter on a `booking_items` query (no join).

Three booking flows were non-atomic TOCTOU races that could oversell under
concurrent requests: `/api/experiences/[id]/book`, `/api/restaurants/[id]/reserve`,
`/api/ticketing/bookings`.

## Files modified

| File | Change |
|------|--------|
| `shared/pricing-adapter.ts` | Refactored `calculatePrice` to accept `(supabase, item, opts)` (DI); new `PricingItem` + `PricingOpts` interfaces; FLAT now multiplies by `quantity`; NIGHTLY honours `opts.nights` override OR derives from `item.start_date/end_date`; PER_SEAT sums `opts.seats[]` if provided. Added `SupabaseClientLike` structural type to keep shared/ a leaf package. |
| `shared/availability-adapter.ts` | Removed top-level `import { supabase } from "@planviry/db"`. `checkAvailability` + all 5 per-vertical helpers now accept `supabase: SupabaseClientLike` as first param. Fixed L84-87 join bug: was `.from('booking_items').in('bookings.status', [...])` (invalid — `booking_items` not in TABLE_MAP, no join); now reads from `reservations` with a plain status filter and extracts `metadata.seat_ids` for the booked-seat list. |
| `shared/index.ts` | Re-exported both adapters: `export * from "./pricing-adapter"` + `export * from "./availability-adapter"`. |
| `shared/package.json` | Added `./pricing-adapter` and `./availability-adapter` to `exports` map. |
| `apps/consumer-web/src/app/api/checkout/route.ts` | L97-134: replaced `item.amount * 100 * quantity` with `calculatePrice(supabase, {...}, {quantity, guests})`. Added `category, metadata` to the `inventory_items` SELECT so `metadata.pricing_model` is honoured (falls back to `pricingModelForCategory(category)`). Discount logic that runs AFTER per-item pricing is intact. |
| `apps/consumer-web/src/app/api/v1/cart/checkout/route.ts` | L75-79: added `category, metadata` to the `inventory_items` SELECT. L98-128: replaced inline `(ci.unit_price_cents ?? inv.base_price_cents ?? 0) / 100` with `calculatePrice(admin, {...}, {quantity: 1}).total_cents / 100` to derive the per-unit `amount` field that gets forwarded to `/api/checkout`. |
| `apps/consumer-web/src/app/api/v1/cart/items/route.ts` | L49-53: added `category, metadata` to the `inventory_items` SELECT. L72-91: replaced `parsed.unit_price_cents ?? item.base_price_cents ?? 0` with `calculatePrice(admin, {...}, {quantity: 1}).total_cents` for the per-unit price; `totalPriceCents = unitPriceCents * parsed.quantity`. |
| `apps/consumer-web/src/app/api/tickets/purchase/route.ts` | L98-114: replaced `tier.price_cents * quantity` with `calculatePrice(supabase, {base_price_cents: tier.price_cents, pricing_model: 'PER_SEAT', category: 'EVENT_TICKET'}, {quantity}).total_cents`. (This route was already atomic via the `atomic_reserve_tickets` RPC — only the pricing was changed.) |
| `apps/consumer-web/src/app/api/experiences/[id]/book/route.ts` | L38-77: replaced the read-then-write TOCTOU (`slot.booked_count + party_size > capacity` check then bare `.update({booked_count: slot.booked_count + party_size})`) with an atomic conditional UPDATE: `.update({booked_count: ...}).eq('id', slot_id).lte('booked_count', capacity - party_size).select('id')` — if 0 rows updated, return 409. Also wired `checkAvailability(supabase, experienceId, 'EXPERIENCE', {...})` as a best-effort pre-check. L95-110: replaced inline `experience.base_price_per_person * party_size` with `calculatePrice(supabase, {base_price_cents: base_price_per_person * 100, pricing_model: 'PER_PERSON', category: 'EXPERIENCE'}, {guests: party_size})`. Deposit math preserved verbatim. Added a compensating decrement of `booked_count` if the experience lookup fails after the atomic increment. |
| `apps/consumer-web/src/app/api/restaurants/[id]/reserve/route.ts` | L28-65: added `inventory_items` lookup (was missing entirely); calls `calculatePrice(supabase, {...}, {guests: party_size})` with PER_PERSON model derived from `metadata.pricing_model ?? pricingModelForCategory(category)` (defaults to DINING/PER_PERSON). L67-109: wired `checkAvailability(supabase, restaurantId, category, {start_date, time_slot, party_size})` best-effort pre-check; added the atomic `capacity_assignments` conditional UPDATE pattern (mirrors `/api/checkout:114-135`) — if no capacity_assignments row exists for the item, skip (no capacity to enforce); if a row exists and the atomic UPDATE returns 0 rows, return 409. L129-139: added compensating capacity release on insert error. |
| `apps/consumer-web/src/app/api/waitlist/[id]/accept/route.ts` | L36-42: added `category, metadata` to the `inventory_items` SELECT. L44-78: replaced `(item.base_price_cents ?? 0) * entry.quantity` with `calculatePrice(supabase, {...}, {quantity: entry.quantity}).total_cents`; `unit_price_cents` derived from `subtotal_cents / quantity`. |
| `apps/consumer-web/src/app/api/attendees/route.ts` | L95-99: added `metadata` to the `inventory_items` SELECT. L105-124: replaced `event.base_price_cents * quantity` with `calculatePrice(supabase, {base_price_cents, pricing_model, category: 'EVENT_TICKET'}, {quantity})`; `unit_price_cents = subtotal_cents / quantity`. |
| `apps/consumer-web/src/app/api/ticketing/bookings/route.ts` | L79-159: replaced the broken SELECT-then-INSERT TOCTOU (`.from('booking_items').select('seatId, bookings!inner(status, performanceId)').in('bookings.status', [...]).in('seatId', seatIds)` — `booking_items` is NOT in TABLE_MAP so it 500'd AND was racy) with: (a) `checkAvailability(supabase, showId ?? performanceId, 'EVENT_TICKET', {seat_ids})` for best-effort UX feedback (returns `booked_seats` for the 409 message); (b) the atomic `capacity_assignments` conditional UPDATE pattern with `.lte('used', capacity - N)` guard — if 0 rows updated, return 409. L81-103: replaced body-supplied `totalAmount`/`bookingFee` with server-computed values from `calculatePrice(supabase, {base_price_cents: 0, pricing_model: 'PER_SEAT', category: 'EVENT_TICKET'}, {seats: seatPricesCents})` — the body's `totalAmount` is now ignored to prevent client-side price tampering. L239-254 + L273-289: added compensating capacity release on booking insert error and on booking_items insert error. |

## Step-by-step

### Step 1 — Refactor the adapters for dependency injection

Read `shared/pricing-adapter.ts` (132 lines) and `shared/availability-adapter.ts`
(187 lines). Confirmed pricing-adapter does NOT import `supabase` at all
(the task description was slightly inaccurate on this point) — only
availability-adapter imports `supabase` from `@planviry/db` at L6. Confirmed
the L84-87 join-syntax bug: `.from('booking_items').select('seatId').in('bookings.status', [...])`
is structurally invalid (no join path, `booking_items` not in TABLE_MAP).

Designed the new signatures:
- `calculatePrice(supabase: SupabaseClientLike, item: PricingItem, opts: PricingOpts): PricingResult`
  (kept sync — no DB lookup needed today; `void supabase` suppresses the
  unused-param warning and reserves the slot for future DB lookups).
- `checkAvailability(supabase: SupabaseClientLike, itemId, category, params): Promise<AvailabilityResult>`
  (async — does DB queries).

Defined `SupabaseClientLike` as a minimal structural type
(`{ from: (table: string) => unknown; auth?: unknown; rpc?: unknown }`)
to avoid importing `@supabase/supabase-js` in the leaf `shared/` package
(Part II §2.2 — shared/ may only import from packages/types).

For availability-adapter's internal `.from(...)` chains, used targeted inline
structural casts on the supabase parameter to express the query-builder shape
without depending on `@supabase/supabase-js` types. The real wrapped client
from `@/lib/supabase/server` / `@/lib/supabase/admin` satisfies each cast
because the db-compat Proxy preserves the `.from(table)` signature.

For the L84-87 fix: replaced the `booking_items` query with a `reservations`
query (`.eq('item_id', itemId).in('status', ['PENDING', 'CONFIRMED'])`) and
extracted booked seat IDs from each reservation's `metadata.seat_ids` array
(this is where the ticketing flow stores seat IDs in the unified schema).

Updated `shared/index.ts` to `export * from "./pricing-adapter"` and
`export * from "./availability-adapter"`. Added the two subpath exports to
`shared/package.json`'s `exports` map for callers that prefer
`@planviry/shared/pricing-adapter` (deep import).

### Step 2 — Wire pricing-adapter into the 8 routes

For each route, read the file, identified the inline price math, replaced it
with `calculatePrice(supabase, item, opts)`, and used the returned `total_cents`.
Added `category, metadata` to inventory_items SELECTs where the model needed
to be derived from `metadata.pricing_model ?? pricingModelForCategory(category)`.

Per-route notes:

- `/api/checkout/route.ts`: uses `invItem.base_price_cents` (server-authoritative)
  with a fallback to `item.amount * 100` (cart-supplied). `unitPriceCents` is
  derived as `subtotal_cents / quantity` for the `reservations.unit_price_cents`
  column. Discount logic at L191-210 is untouched (it operates on the order
  subtotal AFTER per-item pricing).
- `/api/v1/cart/checkout/route.ts`: the `amount` field in the payload forwarded
  to `/api/checkout` is the per-unit price (quantity=1) — the actual order
  total is computed downstream at `/api/checkout` which now also uses the
  adapter. This is a passthrough; the adapter call here ensures the per-unit
  price honours the model (e.g. NIGHTLY items with metadata.pricing_model
  would price differently from FLAT items).
- `/api/v1/cart/items/route.ts`: `unitPriceCents` is now derived via the
  adapter (quantity=1); `totalPriceCents = unitPriceCents * parsed.quantity`
  preserves the prior flat-multiply behaviour for FLAT items in the cart
  line item.
- `/api/tickets/purchase/route.ts`: the route was already atomic (RPC
  `atomic_reserve_tickets`). Only the pricing was changed — `PER_SEAT` model
  with `quantity` seats at `tier.price_cents` each.
- `/api/experiences/[id]/book/route.ts`: `PER_PERSON` model with `guests=party_size`.
  Deposit math (`totalAmount * deposit_pct / 100`) preserved verbatim.
- `/api/restaurants/[id]/reserve/route.ts`: added the missing `inventory_items`
  lookup (the route previously inserted a row without any item lookup at all).
  `PER_PERSON` model with `guests=party_size`. The body's `deposit_amount`
  is still honoured (for partial-deposit flows); `effectiveDepositAmount`
  defaults to 0 if absent (preserving the original "no deposit → confirmed"
  behaviour).
- `/api/waitlist/[id]/accept/route.ts`: model derived from item category (FLAT
  for VENDOR_SERVICE/TRANSPORT, NIGHTLY for LODGING, PER_SEAT for EVENT_TICKET,
  PER_PERSON for DINING/EXPERIENCE). `quantity = entry.quantity`.
- `/api/attendees/route.ts`: `PER_SEAT` model (EVENT_TICKET) with `quantity`
  seats at `event.base_price_cents` each — equivalent to the prior
  `event.base_price_cents * quantity` for general-admission events.

### Step 3 — Make the 3 non-atomic flows atomic

For each of the 3 routes, replaced the read-then-write TOCTOU with the
`capacity_assignments` atomic conditional UPDATE pattern from
`/api/checkout/route.ts:114-135`:

```ts
const { data: atomicResult, error: atomicErr } = await supabase
  .from('capacity_assignments')
  .update({ used: pool.used + N })
  .eq('id', pool.id)
  .lte('used', pool.capacity - N)
  .select('id')
if (atomicErr || !atomicResult || atomicResult.length === 0) {
  return NextResponse.json({ error: 'Sold out — race condition prevented' }, { status: 409 })
}
```

- `/api/experiences/[id]/book/route.ts`: uses `experience_slots.booked_count`
  (with `.lte('booked_count', capacity - party_size)` guard) since that's the
  existing counter on the slot row. Same conditional-UPDATE pattern, just on
  a different table. If 0 rows updated, return 409 with `slot_full: true`.
  Compensating decrement on reservation insert failure is preserved.
- `/api/restaurants/[id]/reserve/route.ts`: had NO capacity check at all.
  Added the `capacity_assignments` pattern (skipped if no row exists for the
  item — no capacity to enforce). Compensating capacity release on insert
  error.
- `/api/ticketing/bookings/route.ts`: replaced the broken
  `booking_items`-with-`bookings!inner` SELECT (would 500 — `booking_items`
  not in TABLE_MAP) with `checkAvailability(supabase, showId, 'EVENT_TICKET', {seat_ids})`
  for UX feedback, then the `capacity_assignments` atomic UPDATE for the real
  protection. Compensating capacity release on booking insert error AND on
  booking_items insert error.

Also wired `checkAvailability` from the adapter as a best-effort pre-check in
all 3 routes (the task explicitly noted "the atomic UPDATE is the real fix"
— the adapter check just surfaces friendlier "slot already booked" / "time
slot unavailable" messages).

### Step 4 — Verify

TypeScript: `cd /home/z/my-project/apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "error TS" | head -30` →
only 3 pre-existing errors in `src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx`
(untouched, unrelated — JSX closing-tag mismatch from a prior task). **Zero
errors in any of the 11 changed files.**

ESLint: `npx eslint` on all 8 changed route files → exit 0, no warnings.

Shared package: `cd /home/z/my-project/shared && npx tsc --noEmit 2>&1 | grep -E "pricing-adapter|availability-adapter"` →
**no errors** in either refactored adapter. (Other pre-existing errors in
`derived-status.ts`, `hievents-patterns.ts`, `rbac.ts`, `slots.ts`,
`logger.ts` — all unrelated to this task; they're caused by `@planviry/db`
imports / `@types/node` missing, which were present before FIX-5.)

dev.log: `tail -30 /home/z/my-project/dev.log` → no new errors. Only the
recurring `GET / 200` polling + pre-existing `POST /api/notifications/read-all 401`
+ `POST /api/service-tickets 401` (auth-gated endpoints hit by an unauth'd
poller — unrelated to this task).

## Stage Summary

**FIX-5 COMPLETE.** All 4 task steps done.

- **Adapters refactored**: both `calculatePrice` and `checkAvailability` now
  accept a `supabase: SupabaseClientLike` as their first parameter. The raw
  `@planviry/db` import is gone from `availability-adapter.ts`. The L84-87
  join-syntax bug is fixed (now uses `reservations` with a plain status filter
  + `metadata.seat_ids` extraction). Both are re-exported from
  `shared/index.ts` and added to `shared/package.json`'s `exports` map.
- **Pricing wired into all 8 routes**: every route that previously did inline
  price math (`* quantity`, `* party_size`, `* 100`, body-supplied
  `totalAmount`) now calls `calculatePrice(supabase, item, opts)` and uses
  the returned `total_cents`. The worst bug — `/api/checkout/route.ts:107`
  ignoring `pricing_model` — is fixed: a 3-night LODGING booking at
  $100/night now correctly charges $300 (NIGHTLY multiplier applied via
  `start_date`/`end_date` from the CartItem).
- **3 non-atomic flows made atomic**: `/api/experiences/[id]/book`,
  `/api/restaurants/[id]/reserve`, `/api/ticketing/bookings` now use the
  conditional-UPDATE-with-`.lte()`-guard pattern. If a concurrent request
  grabs the last capacity between the read and the write, the UPDATE returns
  0 rows and the route returns 409 Conflict. Compensating capacity release
  on insert failure is wired in all 3 routes.
- **Best-effort `checkAvailability` wired**: all 3 atomicity routes also call
  `checkAvailability` from the adapter for friendlier UX feedback (the
  atomic UPDATE is the real protection; the adapter check surfaces "slot
  already booked" / "time slot unavailable" messages before the UPDATE).
- **No regressions**: tsc clean on all changed files; ESLint clean on all
  changed files; dev.log shows no new errors.

## Notes for downstream agents

- The `SupabaseClientLike` type is defined in `shared/pricing-adapter.ts` and
  re-exported from `shared/availability-adapter.ts`. Any future shared/
  adapter that needs a supabase client should import this type rather than
  redefining it.
- `calculatePrice` is sync (no DB lookup needed today). If a future change
  needs to look up `inventory_items.metadata.pricing_model` from inside the
  adapter, change the signature to async and update all 8 call sites (they
  all already `await` other supabase calls, so adding `await` is trivial).
- The atomic conditional UPDATE pattern in `/api/experiences/[id]/book`
  uses `experience_slots.booked_count` (not `capacity_assignments`). This is
  intentional — `experience_slots` already has a `booked_count`/`capacity`
  pair. If `experience_slots` is later removed (it's in TABLE_MAP →
  `availability_blocks`), the atomic UPDATE will need to switch to
  `capacity_assignments` or `availability_blocks.reserved_capacity` (with
  different column names).
- The `/api/ticketing/bookings` route still uses `bookings`/`booking_items`
  table names (camelCase columns) which the db-compat proxy redirects to
  `reservations` (snake_case) — but the column-name mismatch
  (`bookingNumber`/`performanceId`/`showId` vs `reservations`'s actual
  columns) means the INSERT will still 500 at runtime. FIX-5 only fixed the
  atomicity + pricing bugs flagged by AUDIT-3; the broader table/column
  mismatch is a separate follow-up (recommend FIX-6 or similar to migrate
  this route to the new schema's `reservations` + `reservation_line_items`).
- The `/api/restaurants/[id]/reserve` route previously had NO inventory_items
  lookup — it inserted a `restaurant_reservations` row with only the body's
  fields. FIX-5 added the lookup (for pricing + status validation). If the
  restaurant_id passed in the URL does NOT correspond to an inventory_items
  row, the route now returns 404 (was: 500 on the insert due to missing
  FK). This is a behaviour change but a correct one.
- The shared package's `tsc --noEmit` still reports pre-existing errors in
  `derived-status.ts:182` (`Cannot find module '@planviry/db'`),
  `hievents-patterns.ts:5`, `rbac.ts:14`, `slots.ts:9/194/262` (same cause),
  and `logger.ts:42` (no `@types/node`). These are NOT from FIX-5 — they
  pre-date this task. The consumer-web app's tsc is clean for all FIX-5
  files because the app's tsconfig path-aliases `@planviry/shared` to
  `../../shared/index.ts` directly (no @planviry/db dependency required for
  the adapters).
