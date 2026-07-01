# FIX-7 — Graduate 4 vendor portal pages from PARTIAL/PLACEHOLDER to REAL

**Agent:** Z.ai Code (sub-agent, Task ID FIX-7)
**Scope:** `apps/consumer-web/src/app/vendor/{dashboard,events,analytics,onboarding}/page.tsx`

## Task

AUDIT-1 (worklog line 1522+) classified 4 vendor pages as PARTIAL or PLACEHOLDER:

| Route | Before | After |
|-------|--------|-------|
| `/vendor/dashboard` | PARTIAL — `revenue: 0, checkIns: 0` hardcoded | REAL — confirmed-reservation revenue + check_ins-or-fallback count + 6-module cards |
| `/vendor/analytics` | PLACEHOLDER — static "loads data from Supabase" text | REAL — 3 KPI cards + listings-by-category table + reservations-by-status table + recent-reservations table |
| `/vendor/events` | PLACEHOLDER — static text | REAL — lists `inventory_items` where `category='EVENT_TICKET'` + empty-state CTA to `/tickets/admin/shows` |
| `/vendor/onboarding` | PLACEHOLDER — static text | REAL — single-form wizard that INSERTs `vendor_accounts` + `vendor_staff` (OWNER), then redirects to `/vendor/dashboard` |

## Files modified

| File | Lines before | Lines after |
|------|-------------:|------------:|
| `apps/consumer-web/src/app/vendor/dashboard/page.tsx` | 177 | 354 |
| `apps/consumer-web/src/app/vendor/analytics/page.tsx` | 41 | 401 |
| `apps/consumer-web/src/app/vendor/events/page.tsx` | 41 | 240 |
| `apps/consumer-web/src/app/vendor/onboarding/page.tsx` | 41 | 360 |

No other files touched. No new packages installed. No schema migrations.

## Step-by-step

### Step 1 — `/vendor/dashboard` real stats + modules section

**Before (line 59):**
```ts
setStats({ listings: listings ?? 0, reservations: reservations ?? 0, revenue: 0, checkIns: 0 })
```

**After — three real queries:**

1. **Revenue** — fetches `total_price_cents` for all CONFIRMED reservations for this vendor and sums in JS (Supabase REST has no SUM RPC wired up). Wrapped in try/catch; failure leaves revenue at 0.
   ```ts
   const { data: revRows, error: revErr } = await supabase
     .from('reservations')
     .select('total_price_cents')
     .eq('vendor_id', vendorId)
     .eq('status', 'CONFIRMED')
   if (!revErr && Array.isArray(revRows)) {
     revenue = revRows.reduce((sum, r) => sum + (typeof r.total_price_cents === 'number' ? r.total_price_cents : 0), 0)
   }
   ```

2. **Check-ins** — tries the literal query from the spec (`supabase.from('check_ins').select('id', { count: 'exact', head: true }).eq('vendor_id', vendorId)`). The live `check_ins` table has no `vendor_id` column (FK is via `reservation_id`), so this query errors → fallback path activates: counts reservations with `status='COMPLETED'`. Tracks the source (`check_ins` / `reservations` / `none`) and shows it as a small caption under the stat so it's transparent which path is active. Outer try/catch protects against the table-missing case.
   ```ts
   try {
     const { count: ciCount, error: ciErr } = await supabase
       .from('check_ins').select('id', { count: 'exact', head: true }).eq('vendor_id', vendorId)
     if (!ciErr && ciCount != null) { checkIns = ciCount; checkInsSource = 'check_ins' }
     else { /* fall back to COMPLETED reservations */ }
   } catch { /* outer fallback */ }
   ```

3. **Modules section** — new `<section>` between the stat cards and the Stripe CTA. Six cards (Lodging, Event Tickets, Venues, Services, Dining, Transport), each linking to its create-listing branch:
   - Lodging → `/hosting/create`
   - Event Tickets → `/tickets/admin/shows`
   - Venues → `/vendor/create-listing/venue`
   - Services → `/vendor/create-listing/service`
   - Dining → `/vendor/create-listing/dining`
   - Transport → `/vendor/create-listing/transport`

   Each card shows the icon, the category enum badge (`LODGING` / `EVENT_TICKET` / etc.), title, description, and a "Manage" affordance that animates on hover. Same visual pattern as `/vendor/create-listing` (which I read first as the canonical reference). The spec said "5 modules" but listed 6 categories — I implemented all 6 because (a) the canonical inventory_category enum has 7 values (added EXPERIENCE in the listings page), (b) `/vendor/create-listing` already exposes all 6 as equal-weight choices, and (c) cutting one would have created an inconsistency between the dashboard and the create-listing picker.

   Added a small caption under the Revenue card ("confirmed bookings") and under the Check-ins card (showing the data source — `from check_ins table` / `via COMPLETED reservations` / `unavailable`) for transparency.

### Step 2 — `/vendor/analytics` real page

Replaced the 41-line placeholder with a 401-line real analytics page. Same Supabase auth pattern as `/vendor/dashboard` (`createClient` → `getUser` → `vendor_staff` lookup → redirect to `/onboarding/vendor` if unstaffed).

**Queries (each wrapped in try/catch so a single failure doesn't tank the page):**

1. `inventory_items` for the vendor → counts total + aggregates by `category` (Lodging / Event Tickets / Venues / Services / Dining / Experiences / Transport).
2. `reservations` for the vendor → counts total, sums `total_price_cents` WHERE `status='CONFIRMED'` for revenue, aggregates by `status` (PENDING / CONFIRMED / COMPLETED / CANCELLED / REFUNDED / EXPIRED).
3. `reservations` ordered by `created_at DESC` limit 10, joined with `inventory_items(title)` for the recent-bookings table.

**UI:**

- Top KPI row: 3 shadcn `Card`s — Listings, Reservations, Revenue (confirmed).
- Two side-by-side `Card`s with `Table`s — Listings by category (with share %), Reservations by status (with status badge + share %).
- Full-width `Card` with `Table` — Recent 10 reservations (item title, status badge, total price, booked date).
- Graceful empty state: if all three KPIs are 0, shows a single Card with a CTA to `/vendor/create-listing`.
- Each table has its own per-section empty state ("Category breakdown unavailable." / "Status breakdown unavailable." / "No reservations yet.") so partial failures still render.

### Step 3 — `/vendor/events` real page

Replaced the 41-line placeholder with a 240-line real events page.

**Queries:**
- `inventory_items` WHERE `vendor_id = vendorId` AND `category = 'EVENT_TICKET'`, ordered by `created_at DESC`. Wrapped in try/catch; on error sets `error` state and renders an error banner but does not crash.

**UI:**
- Header with title, description, and a primary "Create event" button linking to `/tickets/admin/shows` (the EventSeats admin flow).
- Empty state: if the vendor has 0 event-ticket listings, shows a `Card` with a "No event tickets yet" message and a CTA button to `/tickets/admin/shows`.
- Populated state: `Card` containing a `Table` with columns — Event (title + slug), Status (badge), Price (formatted), Created (date), Actions (Edit → `/vendor/listings/[id]/edit`, Shows → `/tickets/admin/shows`).

### Step 4 — `/vendor/onboarding` real wizard

Replaced the 41-line placeholder with a 360-line real onboarding wizard.

**Auth pattern (IMPORTANT DIFFERENCE):** Unlike the other 3 pages, this page does NOT redirect unstaffed users to `/onboarding/vendor`. The page IS the onboarding flow. The middleware (`src/lib/supabase/middleware.ts`) already exempts `/vendor/onboarding` from the staff-check redirect, so authenticated-but-unstaffed users reach the wizard. If the user already has a vendor account, the page shows an "You're all set!" state with a CTA to `/vendor/dashboard`.

**Read first:** `/onboarding/vendor/page.tsx` (the canonical claim/create flow) — reused its patterns:
- Slug derivation: `name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6)` to avoid UNIQUE collisions.
- Vendor account INSERT shape: `name, slug, description, status, claimed_at, onboarded_at, metadata`.
- Vendor staff INSERT shape: `vendor_id, user_id, role, status, accepted_at`.

**Form fields:**
- Business name (required) — drives the auto-derived slug.
- Slug (required) — auto-derived from business name with a random 4-char suffix, editable. Sanitized to `[a-z0-9-]` on input. Auto-derivation stops the moment the user manually edits the slug (tracked via `slugTouched` state).
- Primary category (required) — shadcn `Select` with 6 options (LODGING / EVENT_TICKET / VENUE_RENTAL / VENDOR_SERVICE / DINING / TRANSPORT). Stored in `metadata.primary_category` because `vendor_accounts` has no `category` column.
- Description (optional) — shadcn `Textarea`, written directly to the `description` column.

**Submit flow:**
1. INSERT into `vendor_accounts` with `status='ACTIVE'`, `claimed_at`, `onboarded_at`, and `metadata={ primary_category, onboarding_source: 'self_serve_vendor_portal' }`. Returns the new `id`.
2. INSERT into `vendor_staff` with `vendor_id=newVendor.id`, `user_id=user.id`, `role='OWNER'`, `status='ACTIVE'`, `accepted_at`.
3. If step 2 fails, best-effort cleanup: DELETE the orphan `vendor_accounts` row so the user can retry without a slug collision.
4. On success, show a "Vendor account created!" success state for 1.2s, then `router.push('/vendor/dashboard')`.

**Lint refactor:** Initial implementation used a `useEffect` to sync the slug from business name → triggered `react-hooks/set-state-in-effect` error. Refactored to compute the slug in the `onChange` handler (`handleBusinessNameChange`) using `useCallback`, eliminating the effect entirely. ESLint now clean.

**Footer:** Link to `/onboarding/vendor` ("Prefer to claim an existing listing? Use the claim flow.") so users who want the claim flow can still reach it.

## Verification

### TypeScript check
```
cd /home/z/my-project/apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "vendor/(dashboard|events|analytics|onboarding)|error TS" | head -20
```
Output:
```
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(94,11): error TS17008: JSX element 'AppLayoutShell' has no corresponding closing tag.
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(165,1): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(166,1): error TS1005: '</' expected.
```
**Zero errors in any of the 4 vendor pages I touched.** The 3 errors are pre-existing in an unrelated file (`[slug]/[citySlug]/[verticalSlug]/page.tsx`) and were already flagged by FIX-3 (worklog line 1939+) and FIX-4 (worklog line 1999) as out-of-scope and untouched. Total tsc error count unchanged.

### ESLint check (on just my 4 files)
```
cd apps/consumer-web && ./node_modules/.bin/eslint src/app/vendor/dashboard/page.tsx src/app/vendor/events/page.tsx src/app/vendor/analytics/page.tsx src/app/vendor/onboarding/page.tsx
```
Output: **no errors, no warnings.** (Initial run flagged 1 `react-hooks/set-state-in-effect` error in `/vendor/onboarding` line 80 — fixed by moving slug derivation into the onChange handler.)

### Dev log
`tail -40 /home/z/my-project/dev.log` → no errors related to any of the 4 vendor pages. The log shows pre-existing unrelated errors only:
- `[next-auth]: useSession must be wrapped in a <SessionProvider />` on `/tickets/admin/{customers,settings,bookings}` (pre-existing — separate from this task).
- `TypeError: Cannot read properties of undefined (reading 'city')` on `/lodging/search?city=Denver` (pre-existing — `HomeListingCard.tsx:56` — flagged by FIX-2 as out-of-scope, worklog line 2179+).

### Route smoke test (curl, unauthenticated)
```
/vendor/dashboard   HTTP 307 -> /login?returnTo=%2Fvendor%2Fdashboard
/vendor/events      HTTP 307 -> /login?returnTo=%2Fvendor%2Fevents
/vendor/analytics   HTTP 307 -> /login?returnTo=%2Fvendor%2Fanalytics
/vendor/onboarding  HTTP 307 -> /login?returnTo=%2Fvendor%2Fonboarding
```
All 4 routes return HTTP 307 redirect to `/login?returnTo=...` — expected middleware behavior for unauthenticated users (the task spec explicitly says "they'll redirect to login if unauthenticated — that's fine"). The middleware (`src/lib/supabase/middleware.ts`) intercepts at the server level before the page ever renders, so no on-demand compilation happens for unauthenticated requests. Authenticated users with `vendor_staff` rows will see the real pages; authenticated users without `vendor_staff` will be redirected to `/onboarding/vendor` by the middleware (except for `/vendor/onboarding` itself, which is exempted so the wizard is reachable).

## Out of scope (intentionally NOT touched)

- **Pre-existing 3 tsc errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx`** — flagged by FIX-3 and FIX-4 as out-of-scope. Not touched.
- **`/onboarding/vendor` (the canonical claim/create flow)** — read for reference but not modified. The new `/vendor/onboarding` wizard is a parallel self-serve create path that doesn't replace the claim flow; both coexist (the wizard's footer links to the claim flow).
- **Middleware-level auth pattern** — read for understanding the 307 behavior but not modified. The `/vendor/onboarding` exemption was already in place.
- **`/vendor/[slug]`, `/vendor/portal`, `/vendor/messages`, `/vendor/availability`, `/vendor/promotions`, `/vendor/pms`, `/vendor/bookings`, `/vendor/payouts`, `/vendor/tickets`, `/vendor/create-listing/[type]`, `/vendor/listings/[id]/edit`** — all out of scope, untouched.
- **`/account/notifications` and `/account/support` placeholders** — also flagged by AUDIT-1 as placeholders, but not in scope for this task (FIX-7 only covers the 4 vendor routes). Recommend a follow-up FIX task to graduate those.
