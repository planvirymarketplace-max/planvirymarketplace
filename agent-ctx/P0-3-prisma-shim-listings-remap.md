# P0-3 — Prisma shim: map `listings` → `inventory_items`

**Agent:** Z.ai Code (sub-agent for Task P0-3)
**Date:** 2026-07-01
**Scope:** `apps/consumer-web/src/lib/prisma.ts` (single file rewritten)
**Worklog parent:** `/home/z/my-project/worklog.md` (Task ID `P0-3` section appended)

## Goal

The Staybnb hosting wizard at `/hosting/create/listing/[id]/(steps)/*` writes to
Prisma's `listings` model. Planviry's Supabase has no `listings` table — the
correct target is the polymorphic `inventory_items` table (DOM-003). Without a
fix, every wizard write hits a Postgres "table not found" error.

## Pre-existing state found

- `apps/consumer-web/src/lib/db-compat.ts` already has a `TABLE_MAP` with
  `listings: "inventory_items"` AND wraps `createAdminClient()` so that any
  `supabase.from("listings")` call is transparently redirected to
  `supabase.from("inventory_items")`. So the **table-name redirect was already
  in place** — but no column-level translation existed.
- The old `src/lib/prisma.ts` was a thin Proxy that forwarded
  `prisma.<model>.<method>(...)` to `supabase.from(<model>)...`. It had no
  `createMany`, no `deleteMany`, no `$transaction`, and no column mapping.
- The wizard (via `daft-listings.ts`) uses ALL of: `create`, `count`, `update`,
  `findUnique`, `findFirst`, `findMany`, `delete`, `createMany` (on
  `listingAmenities`), and `$transaction` (both callback and array forms).

## What changed

Single file rewrite: `apps/consumer-web/src/lib/prisma.ts` (107 lines → 843
lines).

### 1. TABLE_MAP (Staybnb model → Planviry table)

```ts
const TABLE_MAP: Record<string, string> = {
  listings: "inventory_items",
  draft_listings: "inventory_items",      // drafts ARE inventory_items with status='DRAFT'
  experience_listings: "inventory_items",
  external_events: "inventory_items",
  vendor_packages: "inventory_items",
  profiles: "user_profiles",
  users: "user_profiles",
  vendors: "vendor_accounts",
  vendor_profiles: "vendor_accounts",
  reservations: "reservations",
  favorites: "saved_items",
  saved_searches: "saved_items",
  trips: "itinerary_sessions",
  // listingAmenities / amenities have NO backing table — handled via side-effect
}
```

### 2. Bidirectional column mapping (listings ↔ inventory_items)

`mapListingToInventory(data, model)` — write direction:

| Staybnb field         | Planviry target                                  |
|-----------------------|--------------------------------------------------|
| `host_id`             | `vendor_id`                                      |
| `night_price` (dollars) | `base_price_cents` (cents, ×100) + `is_free` if 0 |
| `status` (lowercase)  | `status` (UPPERCASE) — `draft`→`DRAFT`, `pending`/`published`→`PUBLISHED`, `paused`→`PAUSED` |
| `score` (JSONB)       | `metadata.score` + `quality_score` (decimal)     |
| `min_cancel_days` (int) | `cancellation_policy` (text) + `metadata.min_cancel_days` |
| `images`, `location`, `structure`, `guest_limits`, `promotions`, `safety_items`, `check_in_time`, `check_out_time`, `property_type`, `privacy_type`, `amenities`, `current_step`, `visited_steps` | `metadata.<field>` |
| (derived)             | `category` = `VACATION_RENTAL` if property_type is House/Apartment/Cabin/Boat, else `LODGING` |
| (derived)             | `slug` = slugify(title)                          |
| (derived)             | `created_at` / `updated_at` = now()              |
| (default)             | `status` defaults to `DRAFT` for `draft_listings` model, `PUBLISHED` for `listings` model (Staybnb's Prisma schema had a column default of `'draft'`; Planviry's status column is NOT NULL with no default) |

`unmapInventoryToListing(row)` — read direction (inverse). Fills in Staybnb
defaults (`images: []`, `promotions: []`, `safety_items: []`, `amenities: []`,
`score: { value: 0, reviews: [] }`, `guest_limits: {}`, `structure: {}`) so the
wizard's parsers don't crash on missing fields.

### 3. Where-clause translation

`applyWhere(query, model, where)`:
- Translates `host_id` → `vendor_id`, `night_price` → `base_price_cents` (with ×100 scaling).
- Translates `status` values (lowercase → UPPERCASE), including inside nested Prisma operators (`{ in: [...] }`, `{ gte: ... }`, etc.).
- Skips `undefined` values (the wizard passes `{ id: undefined, host_id: "..." }` to mean "no id filter" — without this skip, supabase would error on `.eq("id", undefined)`).
- Supports Prisma operators: `equals`, `gte`, `lte`, `gt`, `lt`, `in`, `ne`, `not`.

### 4. Default status filter

`applyDefaultStatusFilter(query, model, where)`:
- For `draft_listings` model: auto-adds `.eq("status", "DRAFT")` (unless `where.status` is explicitly set). This ensures `getDraftListing()` (no id) only returns draft rows, not the user's published listings.
- For `listings` model: auto-adds `.neq("status", "DRAFT")` (so `/hosting/listings` doesn't show in-progress drafts).
- Applied to all read/update/delete operations.

### 5. `listingAmenities` side-effect handler

Planviry has no `listing_amenities` join table — amenity IDs are stored as a
JSON array inside `inventory_items.metadata.amenities`. The shim intercepts:

- `prisma.listingAmenities.createMany({ data: [{ listing_id, amenity_id }, ...] })`
  → groups rows by `listing_id`, loads each parent inventory_items row's
  metadata, merges the amenity IDs (deduplicated), and updates the metadata.
- `prisma.listingAmenities.deleteMany({ where: { listing_id } })`
  → clears the parent row's `metadata.amenities` array.

This is what `completeDraftListing` uses to attach the user's selected amenities
to the newly-published listing.

### 6. `createMany` + `deleteMany` + `$transaction` + `upsert`

The old shim only had `findMany`, `findUnique`, `findFirst`, `count`, `create`,
`update`, `delete`. Added:

- `createMany` — bulk insert (used by `listingAmenities.createMany` and any
  future bulk-create call).
- `deleteMany` — bulk delete.
- `upsert` — minimal implementation for non-wizard callers.
- `prisma.$transaction(args)` — supports BOTH forms:
  - **Callback form**: `prisma.$transaction(async (tx) => { ... })` — passes
    `prisma` itself as `tx` (no real BEGIN/COMMIT in Supabase JS without an
    RPC; operations execute sequentially).
  - **Array form**: `prisma.$transaction([op1, op2, ...])` — awaits each in
    sequence.

### 7. Status enum mapping

```ts
draft    → DRAFT
pending  → PUBLISHED   // Staybnb "awaiting admin approval"; Planviry has no separate pending state
published→ PUBLISHED
paused   → PAUSED
active   → ACTIVE
archived → ARCHIVED
deleted  → DELETED
```

## Verification

- `bunx eslint src/lib/prisma.ts src/lib/api/server/endpoints/daft-listings.ts src/lib/api/server/endpoints/listings.ts` → **no errors**.
- `bunx tsc --noEmit` → only 3 pre-existing errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx` (JSX parsing, unrelated to this task).
- `dev.log` shows no new errors after the change.

## Wizard flow trace (with new shim)

1. **`createDraftListing()`** → `prisma.draft_listings.create({ data: {...} })`
   → `supabase.from('inventory_items').insert({ vendor_id, base_price_cents:0, status:'DRAFT', category:'VACATION_RENTAL', metadata:{...}, ... })`
   → returns new UUID id, unmapped back to Staybnb shape.

2. **`updateDraftListing(id, data)`** → `prisma.draft_listings.update({ where: { id, host_id }, data: {...} })`
   → `supabase.from('inventory_items').update({...}).eq('status','DRAFT').eq('id', id).eq('vendor_id', user.id)`

3. **`completeDraftListing(id)`** → `prisma.$transaction(async (tx) => { ... })`:
   - `tx.listings.create({ data: { host_id, ...listingData } })` → creates NEW `inventory_items` row with `status='PUBLISHED'`.
   - `tx.listingAmenities.createMany({ data: [...] })` → updates new row's `metadata.amenities`.
   - `tx.draft_listings.delete({ where: { id, host_id } })` → deletes OLD draft row.

## Known limitations / future work

1. **No real DB transactions**: `$transaction` runs operations sequentially
   without BEGIN/COMMIT. If `completeDraftListing`'s `listings.create` succeeds
   but `draft_listings.delete` fails, an orphan published listing is left
   behind. A future hardening pass should wrap the wizard's `$transaction`
   callback in compensating actions or use a Supabase RPC `BEGIN; ... COMMIT;`.

2. **`include` not supported**: Prisma's `include: { listing_amenities: {...}, reservations: {...} }` is ignored. The wizard itself doesn't use `include` (only `daft-listings.ts` does, and it doesn't pass `include`), but `listings.ts` callers like `getHostListings` and `getListingWithReservations` do — they'll get the listing back without the joined amenities/reservations. Out of scope for the wizard task; flagged for a follow-up.

3. **`prisma.amenities.findMany({ where: { id: { in: [...] } } })` in `editListing`**: queries the non-existent `amenities` table. Not in the wizard flow, so left as-is.

4. **`Number(id)` in `getListingWithReservations`**: converts UUID strings to `NaN`. Not in the wizard flow.

5. **Pause/unpause via direct `supabase.from("listings").update({ status: "paused" })` in `pauseListing`** (listings.ts:264) bypasses the shim's column mapping — it would set `status = 'paused'` (lowercase) directly on inventory_items, which Postgres's enum check would reject. Out of wizard scope but should be fixed in a follow-up by either using `prisma.listings.update` or uppercasing the status manually.

## Files touched

- `apps/consumer-web/src/lib/prisma.ts` (rewritten — 107 → 843 lines)

No other files modified. The wizard code (`daft-listings.ts`, `listings.ts`,
all `(steps)/*/page.tsx`, `NavigationButtons.tsx`, `CreateListingFormProvider.tsx`,
`ProgressBar.tsx`) runs **unmodified** — the shim translates at the data layer.
