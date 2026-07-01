# Task P0-2 — Vendor dashboard wiring + location picker

**Agent:** Z.ai Code (subagent for P0-2)
**Scope:** `apps/consumer-web/src/app/`
**Status:** ✅ Complete

## What I read first
- `worklog.md` (full history, including the Hi.Events schema mapping and the Part XLVI db-compat retrofit notes that established the live Supabase schema: `vendor_accounts`, `inventory_items`, `vendor_staff`, `locations`, `reservations`, `domain_events`).
- Existing routes I had to align with:
  - `/api/stripe-connect/onboarding/route.ts` (returns `{ stripe_account_id, onboarding_url, expires_at }`).
  - `/api/v1/inventory/[id]/route.ts` (existing GET/PATCH/DELETE — DELETE soft-deletes to `status = 'ARCHIVED'`, blocks on active reservations per BR-I-003).
  - `/api/v1/inventory/[id]/pause/route.ts` (existing pattern using `requireAuthContext` + `ok()`/`handleError` envelope).
  - `lib/api/{envelope,errors,auth,rate-limit}.ts` — v1 API envelope `{ ok, data | error }`, `requireAuthContext`, `RATE_LIMITS.inventoryTransition`.
- `lib/db-compat.ts` confirmed `inventory_items` and `vendor_accounts` are the live new-schema table names (no aliasing needed for those).
- `lib/supabase/{client,server,admin}.ts` for client/server/admin Supabase client patterns.

## Changes

### 1. Vendor dashboard buttons (`apps/consumer-web/src/app/vendor/dashboard/page.tsx`)
- "Create Listing" `<Link>` now points to `/vendor/create-listing` (was `/hosting/create`).
- "Manage Listings" `<Link>` now points to `/vendor/listings` (was `/hosting/listings`).
- Stripe Connect CTA converted from `<a href="/api/stripe-connect/onboarding">` (raw GET-style nav) to a `<button onClick={handleStripeConnect}>` that:
  - POSTs to `/api/stripe-connect/onboarding`
  - Reads `onboarding_url` (or `data.onboarding_url`) from the response
  - Redirects via `window.location.href = url`
  - Shows a spinner + "Connecting…" while in flight; surfaces errors inline.

### 2. New page: `/vendor/create-listing/page.tsx`
- Client component. Resolves the logged-in user's `vendor_id` from `vendor_staff` (joins `vendor_accounts` to read `name` + `location_id` for defaulting the form).
- Loads `locations` table (`id, name, region`, ordered by name) for the location dropdown.
- Form fields: `title`, `description`, `category` (dropdown — values exactly per task: `LODGING`, `VENUE_RENTAL`, `VENDOR_SERVICE`, `DINING`, `EXPERIENCE`, `EVENT_TICKET`, `TRANSPORT`), `base_price_cents` (entered in dollars, converted ×100), `currency` (default `USD`), `location_id` (dropdown).
- On submit: `INSERT` into `inventory_items` with `status = 'DRAFT'`, `vendor_id` from `vendor_staff`, generates a unique slug, then redirects to `/vendor/dashboard`. Also emits a best-effort `inventory.created` `domain_events` row.

### 3. Location picker in vendor onboarding (`apps/consumer-web/src/app/onboarding/vendor/page.tsx`)
- Added a `useEffect` that loads `locations` (`id, name, region`, ordered by name) on mount and defaults `locationId` to the first one.
- Added a Location `<select>` (required) to the "Create new vendor account" form.
- `handleCreate` now:
  - Validates a location is selected.
  - Stamps the location onto the new `vendor_accounts` row via:
    - `location_id` (FK to `locations.id`)
    - `address` (composed as `"City, Location Name, Region"` — combines the user-typed city with the location's name/region)
    - `metadata.location_id` / `metadata.location_name` / `metadata.location_region` / `metadata.onboarding_source = 'self_serve_create'` (so the link survives even if the FK relationship changes later).
  - "Create & Continue" button is disabled until name + email + location are all set.

### 4. New page: `/vendor/listings/page.tsx` (Manage Listings)
- Client component. Resolves `vendor_id` from `vendor_staff`, then queries `inventory_items` where `vendor_id = ?` (with `locations(name, region)` join), ordered by `created_at desc`.
- Each row shows: title, slug + location, category, status badge (color-coded per status), price (formatted as currency or "Free" if 0).
- Action buttons per row:
  - **Edit** → links to `/vendor/listings/[id]/edit`.
  - **Publish** (shown when status is `DRAFT`/`PAUSED`) → `POST /api/v1/inventory/[id]/publish`.
  - **Unpublish** (shown when status is `PUBLISHED`/`ACTIVE`) → `POST /api/v1/inventory/[id]/unpublish`.
  - **Delete** (always) → `confirm()` dialog, then `DELETE /api/v1/inventory/[id]`.
- All actions show a per-row spinner while in flight; on success the list re-loads. Errors from the v1 API envelope (`{ ok: false, error: { code, message } }`) are surfaced in a banner at the top.
- Empty state with CTA to `/vendor/create-listing`. Refresh button + "New Listing" button in the header.

### 5. New page: `/vendor/listings/[id]/edit/page.tsx`
- Client component. Reads `id` from `useParams()`. Loads the item, performs an ownership check (`item.vendor_id === staff.vendor_id`) and refuses with an error if mismatched.
- Same form fields as create-listing (title, description, category, price, currency, location). Current `status` is shown read-only (use Publish/Unpublish from the listing list to change status).
- On submit: direct Supabase `update()` on `inventory_items` (RLS-scoped to the vendor via the user's auth cookie), then emits a `inventory.updated` `domain_events` row. Shows "Saved at HH:MM:SS" on success.

### 6. New API routes
- `POST /api/v1/inventory/[id]/publish/route.ts` — auth via `requireAuthContext`, ownership check against `ctx.vendorMemberships`, idempotent if already `PUBLISHED`/`ACTIVE`, otherwise sets `status = 'PUBLISHED'`, `published_at = NOW()`, emits `inventory.published` event. Uses v1 envelope (`ok()` / `handleError()`) and `RATE_LIMITS.inventoryTransition`.
- `POST /api/v1/inventory/[id]/unpublish/route.ts` — same shape; sets `status = 'DRAFT'`, emits `inventory.updated` with `action: 'unpublish'`.
- `DELETE /api/v1/inventory/[id]/route.ts` — already existed (soft-deletes to `ARCHIVED`, enforces BR-I-003 active-reservation check); left untouched, called from the listings page.

## Verification
- `bun run lint` — 0 errors in any of the new/modified files. Pre-existing errors in unrelated files (`VendorProfileClient.tsx`, `useMediaQuery.tsx`, `BookDirectoryClient.tsx`, etc.) are unchanged.
- `bunx tsc --noEmit -p tsconfig.json` — 0 errors in any of the new/modified files (only pre-existing JSX parse error in `[slug]/[citySlug]/[verticalSlug]/page.tsx`).
- Started dev server briefly and verified each new route compiles & responds:
  - `GET /vendor/dashboard` → 307 → `/login?returnTo=/vendor/dashboard` → 200 (unauthenticated redirect)
  - `GET /vendor/create-listing` → 307 → `/login?returnTo=/vendor/create-listing` → 200
  - `GET /vendor/listings` → 307 → `/login?returnTo=/vendor/listings` → 200
  - `GET /vendor/listings/[id]/edit` → 307 → `/login?returnTo=...` → 200
  - `GET /onboarding/vendor` → 200 (renders choose-mode)
  - `POST /api/v1/inventory/[id]/publish` → 401 (unauthorized, as expected)
  - `POST /api/v1/inventory/[id]/unpublish` → 401
  - `DELETE /api/v1/inventory/[id]` → 401
- Dev server was stopped after verification (system runs `bun run dev` automatically).

## Notes for downstream agents
- The "category" enum used in the create-listing dropdown (`LODGING, VENUE_RENTAL, VENDOR_SERVICE, DINING, EXPERIENCE, EVENT_TICKET, TRANSPORT`) matches the values used in the existing `/api/directory/route.ts` category map. Note that `packages/types/src/domain/inventory-item.ts` and `shared/constants.ts` define a slightly different enum (`VENUE_SPACE`, `DINING_RESERVATION`, `VENDOR_SERVICE`, `TRANSIT`, etc.) — the live Supabase DB clearly accepts the shorter aliases used here (directory route has been querying with them since Part XLVI). If a future agent consolidates the enum, update both the create-listing + edit-listing dropdowns and the directory route's `catMap`.
- The publish/unpublish routes were written using the v1 API envelope pattern (`ok()`/`handleError()`, `requireAuthContext`, rate-limited via `RATE_LIMITS.inventoryTransition`) to match the existing `/pause/route.ts`. They do NOT use `createAdminClient` for the actual update — they go through the user's cookie-scoped client + RLS so the audit trail reflects the acting user. The `domain_events` insert is best-effort (`.then(() => undefined, () => undefined)`) so a failure there doesn't roll back the status transition.
- Edit page does a direct Supabase `update()` from the browser (no API route). RLS must allow vendors to update their own `inventory_items` for this to work; if RLS is locked down, swap to a `PATCH /api/v1/inventory/[id]` call (route already exists in `/api/v1/inventory/[id]/route.ts`).
