# Task ID: P1-3-P2
# Agent: Z.ai Code (sub-agent for P1-3 + P2-1..4)

## Scope
Five items bundled by the orchestrator:
- **P1-3** — Unify the three Planviry checkout paths onto `/api/checkout`.
- **P2-1** — Verify `/account/reservations` is wired to real Supabase data.
- **P2-2** — Verify `/account/itineraries/[id]` timeline works.
- **P2-3** — Make `/checkout` redirect to `/account/itineraries/[id]` after success.
- **P2-4** — Wire `/account/saved`, `/account/payments`, `/account/profile` to real Supabase data.

## Prior context read
- `/home/z/my-project/worklog.md` — full history (Tasks 1-8 scaffold, 9-a/b/c docs, 12 verification, MINE-1, MINE-HIEVENTS, P0-1/2/3, API-1+2, AUDIT-3).
- `/home/z/my-project/agent-ctx/AUDIT-3-zai-code.md` — confirmed AUDIT-3 had already converted `/account/reservations/page.tsx` + `/account/itineraries/page.tsx` to async server components querying Supabase directly with `inventory_items!inner(...) + vendor_accounts!inner(...)` joins. Established the "server page + client list sibling" pattern under `AppLayoutShell`.
- Probed live Supabase to confirm column shapes for `saved_items` (id, user_id, item_id, created_at only), `payment_methods` (id, user_id, stripe_payment_method_id, brand, last4, exp_month, exp_year, is_default, nickname, created_at), `user_profiles` (id, email, display_name, phone, avatar_url, locale, notification_prefs, …), and `inventory_items` join shape (`vendor_accounts(name, slug)`, `media_assets(url, is_primary, sort_order)`).

## Work Log

### P1-3 — Unified checkout bridge
- `/apps/consumer-web/src/app/lodging/checkout/[listingId]/page.tsx` — **REWRITTEN** as a server component.
  - Removed broken `requireUserWithProfile` import (file `../../auth/components/requireUserWithProfile` did not exist — the page was dead code).
  - Removed broken `ListingSearchParams` import from `@/lib/staybnb-types` (that type is not exported from there).
  - New auth gate uses `createClient()` from `@/lib/supabase/server` → `supabase.auth.getUser()` → `redirect('/login?returnTo=/lodging/checkout/<id>?<qs>')`.
  - Still loads the listing via `getListingWithReservations` (prisma shim → `inventory_items`) and validates `startDate/endDate/adults`.
  - Renders `<LodgingCheckoutRedirect listing searchParams />` (new client component) instead of the old single-item `<Checkout>` UI.
- `/apps/consumer-web/src/app/lodging/checkout/[listingId]/components/LodgingCheckoutRedirect.tsx` — **NEW** client component.
  - Builds a `lodging` `CartItem` from the listing + search params (price = `nights * nightPrice * (1 - promoPct/100)`, using `calculateNights` + `getListingPromotion` from `@/lib/utils`).
  - Calls `useCart().addItem(item)` (idempotent — `addItem` replaces if the same `id` already exists).
  - `router.replace('/checkout')` — hands off to the unified Planviry checkout page.
  - Guarded by `addedRef` so it only runs once per mount (Strict Mode safe).
  - Shows a "Preparing checkout…" spinner while the redirect is in flight.
- `/apps/consumer-web/src/components/lodging/BookingForm.tsx` — **PATCHED** the `router.push` URL from `/checkout/${listing.id}?${query}` (which 404'd — there's no `/checkout/[id]` route) to `/lodging/checkout/${listing.id}?${query}` (which now hits the bridge above). Added a comment explaining the P1-3 bridge.
- `/apps/consumer-web/src/app/api/ticketing/payments/create-session/route.ts` — **DOCUMENTED** as the secondary/standalone ticket purchase flow. Added a 25-line block comment at the top explaining that `/api/checkout` is the canonical unified flow, and this route is preserved only for single-show seat-map purchases (EventSeats pricing in GBP, no cart composition). The implementation is unchanged — it still works for standalone ticket purchases.

### P2-1 — `/account/reservations` verification
- Read `apps/consumer-web/src/app/account/reservations/page.tsx` + `ReservationsList.tsx`.
- Confirmed AUDIT-3 already wired this to real Supabase data: async server component, `createClient()` from `@/lib/supabase/server`, `supabase.auth.getUser()` → `redirect('/login?returnTo=…')` if no session, then a rich join query:
  ```ts
  supabase.from('reservations').select(`
    id, status, starts_at, ends_at, quantity, total_price_cents, currency, created_at,
    inventory_items!inner(id, title, category, slug, vendor_accounts!inner(name, slug)),
    check_ins(id, checked_in_at)
  `).eq('user_id', user.id).order('created_at', { ascending: false })
  ```
  Matches the task spec ("queries Supabase for the user's reservations with inventory_items + vendor_accounts joins").
- The sibling `ReservationsList.tsx` is a `'use client'` component with status badges, date/quantity/price grid, cancel button (`POST /api/orders/{id}/cancel`), invoice download link, and view-details link.
- Verified via `curl -I http://localhost:3000/account/reservations` → `307 location: /login?returnTo=%2Faccount%2Freservations` (auth gate fires before any DB query for unauth users).
- **No changes needed** — page was already production-ready.

### P2-2 — `/account/itineraries/[id]` timeline verification + bugfix
- Read `apps/consumer-web/src/app/account/itineraries/[id]/page.tsx`.
- Confirmed it loads `itinerary_sessions` by id, then loads `reservations` with `inventory_items!inner(...) + vendor_accounts!inner(name)` join, ordered by `starts_at`. Passes the reservations to `extractEventsFromReservations` and renders `<ItineraryTimeline events=… itineraryTitle=… totalCostCents=… />`.
- Found a typo in `apps/consumer-web/src/lib/itinerary/extractEvents.ts:52` — `const endsAt = r.endss_at as string` (triple-s). The reservation row column is `ends_at`. With the typo, every event's `end` defaulted to `start`, so multi-day events appeared as instantaneous. **Fixed** to `r.ends_at as string`.
- The timeline page also gracefully handles reservations with `starts_at: null` (the extractor `continue`s past them — common case for vendor-service reservations without specific times).

### P2-3 — Checkout → itinerary hand-off
- `apps/consumer-web/src/components/checkout/CheckoutContent.tsx` — **REWRITTEN** the success branch.
  - Added an `itineraryHandoff` state machine: `idle → resolving → creating → attaching → done | error`.
  - New `useEffect` runs once after `status === 'success'` and `reservationIds.length > 0`:
    1. **resolving** — fetch the just-confirmed reservations via the client-side `createClient()` and check if any have an `itinerary_session_id`.
    2. If yes → `router.replace('/account/itineraries/<id>')` immediately.
    3. If no → **creating** — `POST /api/v1/itineraries` with `title: "Trip — <today>"` and `reservation_id: reservationIds[0]` (the v1 endpoint attaches one reservation at creation time).
    4. **attaching** — update the remaining `reservationIds.slice(1)` rows to set `itinerary_session_id = <new id>` via the client-side Supabase client. Failures here are non-fatal (logged, not thrown).
    5. **done** → `router.replace('/account/itineraries/<new id>')`.
  - Added a transitional "Reservations Confirmed / Creating your itinerary…" spinner UI shown while the hand-off is in flight so the user sees activity during the redirect.
  - Kept the static success screen as a fallback if the hand-off errors (with manual nav options: View Itinerary / Go to Itineraries / Dashboard / Continue Browsing).
  - The non-chargeable path now also captures `data.reservation_ids` if the API returns them (currently `/api/checkout` returns them only on the chargeable path — that's fine).
  - `handoffStartedRef` guards against double-execution in React Strict Mode.
  - Added `Loader2` to the lucide imports.

### P2-4 — Real-data wiring for `saved`, `payments`, `profile`
Followed the AUDIT-3 server-page + client-list sibling pattern under `AppLayoutShell`. All three pages were 40-line `'use client'` placeholders rendering "This screen is wired to Supabase and loads real data." cards.

#### `/account/saved/page.tsx` + `SavedList.tsx`
- Server component: auth gate + query `saved_items` joined with `inventory_items!inner(id, title, category, slug, base_price_cents, currency, vendor_accounts!inner(name, slug), media_assets(url, is_primary, sort_order))`, ordered by `created_at desc`.
- Client sibling `SavedList.tsx`: one card per saved item with:
  - 96×96 image (primary `media_assets` row, fallback to `Heart` icon).
  - Category badge (`item.category.replace(/_/g, ' ')`), "Saved <date>" chip.
  - Title + vendor link (`/v/<slug>`).
  - Price (`Intl.NumberFormat` with `currency || 'USD'`, falls back to `$`).
  - View button (links to `/s/<slug>` or `/search`) + Remove button (client-side `supabase.from('saved_items').delete().eq('id', …).eq('user_id', …)` then `router.refresh()`).
  - `confirm()` + `sonner` toast on remove.
- Empty state and error state both rendered as white cards.

#### `/account/payments/page.tsx` + `PaymentsList.tsx`
- Server component: auth gate + query `payment_methods` (`id, user_id, stripe_payment_method_id, brand, last4, exp_month, exp_year, is_default, nickname, created_at`), ordered by `is_default desc, created_at desc`.
- Client sibling `PaymentsList.tsx`:
  - "Add Payment Method" button at top (placeholder — calls `toast.info(...)` explaining that wiring this up requires a Stripe SetupIntent, future-phase work).
  - One card per method with:
    - Brand badge (visa/mastercard/amex/discover/etc. with brand-specific Tailwind colors).
    - "Default" star badge + optional nickname badge.
    - Masked card number `•••• •••• •••• {last4}`.
    - Expiry `MM/YY`.
    - "Set as default" button (non-default cards only) — first unsets `is_default` on all other rows for the user, then sets it on this row.
    - Remove button (client-side `supabase.from('payment_methods').delete().eq('id', …).eq('user_id', …)`).
  - `confirm()` + `sonner` toast on every action.

#### `/account/profile/page.tsx` + `ProfileForm.tsx`
- Server component: auth gate + query `user_profiles` by `id = user.id`. If the row is missing (rare — signup before profile trigger ran), falls back to `createAdminClient()` to insert a stub with `locale: 'en'` + default `notification_prefs`.
- Client sibling `ProfileForm.tsx`:
  - Identity section: Display name, Email (disabled — managed by auth provider), Phone, Locale.
  - Notification preferences section: three custom toggle rows (Email / Push / SMS) with a real switch UI (`role="switch"`, `aria-checked`).
  - Save button calls `PATCH /api/v1/auth/me` with `{ display_name, phone, locale, notification_prefs: { email, push, sms } }`.
  - `sonner` toast on success + `router.refresh()` to re-render the server component with the saved data.
  - Email field is disabled because the v1 schema (`updateProfileSchema`) doesn't accept email updates.

## Verification
- **Lint:** `bunx eslint --max-warnings=0` on all 8 of my new/modified files → exit 0, no warnings.
- **Type-check:** `bunx tsc --noEmit` on the whole consumer-web app → 3 pre-existing errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx` (untouched, unrelated to this task); **zero errors in any of my new/modified files**.
- **Auth gate smoke test (curl):**
  - `/account/saved` → `307 location: /login?returnTo=%2Faccount%2Fsaved` ✓
  - `/account/payments` → `307 location: /login?returnTo=%2Faccount%2Fpayments` ✓
  - `/account/profile` → `307 location: /login?returnTo=%2Faccount%2Fprofile` ✓
  - `/account/reservations` → `307 location: /login?returnTo=%2Faccount%2Freservations` ✓ (pre-existing, verified)
  - `/account/itineraries` → `307 location: /login?returnTo=%2Faccount%2Fitineraries` ✓ (pre-existing, verified)
  - `/lodging/checkout/1?startDate=…&endDate=…&adults=2` → `307 location: /login?returnTo=%2Flodging%2Fcheckout%2F1%3F…` ✓ (new bridge)
- All gates fire before any DB query for unauthenticated users.

## Files touched (P1-3-P2)
- `apps/consumer-web/src/app/lodging/checkout/[listingId]/page.tsx` — REWRITTEN (server-component bridge).
- `apps/consumer-web/src/app/lodging/checkout/[listingId]/components/LodgingCheckoutRedirect.tsx` — NEW (client bridge).
- `apps/consumer-web/src/components/lodging/BookingForm.tsx` — PATCHED (router.push URL: `/checkout/<id>` → `/lodging/checkout/<id>`).
- `apps/consumer-web/src/app/api/ticketing/payments/create-session/route.ts` — DOCUMENTED as secondary flow (no behavior change).
- `apps/consumer-web/src/lib/itinerary/extractEvents.ts` — BUGFIX (`endss_at` → `ends_at`).
- `apps/consumer-web/src/components/checkout/CheckoutContent.tsx` — REWRITTEN success branch with itinerary hand-off state machine.
- `apps/consumer-web/src/app/account/saved/page.tsx` — REWRITTEN (server component, real Supabase query).
- `apps/consumer-web/src/app/account/saved/SavedList.tsx` — NEW (client list with remove button).
- `apps/consumer-web/src/app/account/payments/page.tsx` — REWRITTEN (server component, real Supabase query).
- `apps/consumer-web/src/app/account/payments/PaymentsList.tsx` — NEW (client list with set-default + remove buttons).
- `apps/consumer-web/src/app/account/profile/page.tsx` — REWRITTEN (server component, real Supabase query + auto-stub fallback).
- `apps/consumer-web/src/app/account/profile/ProfileForm.tsx` — NEW (editable form, PATCH /api/v1/auth/me).

## Notes for downstream agents
- The lodging checkout bridge runs `addItem` + `router.replace('/checkout')` on mount. If a user already has the same lodging item in their cart (same `cartItemId`), `addItem` is idempotent — it replaces, not duplicates.
- The old `apps/consumer-web/src/app/lodging/checkout/[listingId]/components/{Checkout,ListingResume,PaymentSection,DateRangeSelector}.tsx` files are now **orphaned** — nothing imports them. They're left in place as reference but can be deleted in a future cleanup. Don't try to "fix" them — they referenced a `requireUserWithProfile` module that never existed and the page was dead code.
- The `/api/checkout` route already supports a `trip_id` body field that sets `itinerary_session_id` on each created reservation. P2-3 doesn't use it (the CheckoutContent client component doesn't pass `trip_id`), so all reservations start with `itinerary_session_id = null` and the hand-off creates a fresh itinerary. If you want future cart flows to attach to an existing trip, just pass `trip_id` in the `fetch('/api/checkout', { body: JSON.stringify({ cart_items, trip_id }) })` call — the P2-3 hand-off will detect the pre-attached `itinerary_session_id` and skip creation.
- The P2-3 itinerary hand-off uses the client-side `createClient()` to query reservations + update them. This works because RLS allows users to read/update their own reservations. If you change RLS policies on `reservations`, double-check the client-side update in `CheckoutContent.tsx` still works.
- The `payment_methods` table has no `label` column — only `nickname`. The `PaymentsList.tsx` UI shows the nickname (if set) as a badge. The `Add Payment Method` button is a placeholder; when you wire up Stripe SetupIntents, the POST `/api/payment-methods` route already exists and accepts `{ user_id, stripe_payment_method_id, label }` — but the `label` field doesn't exist in the live table, so the route will need to be updated to write `nickname` instead.
- The `profile.email` field on `user_profiles` is independent of the auth user's email (managed by Supabase Auth). The ProfileForm disables the email input for that reason — the v1 PATCH schema at `lib/api/schemas.ts:46` doesn't accept email updates either. If you want users to be able to change their email, that needs a Supabase Auth `updateUser({ email })` call, not a profile update.
- The `extractEventsFromReservations` typo fix (`endss_at` → `ends_at`) is the only behavior change in this task that affects existing functionality. Before the fix, multi-day reservations appeared as instantaneous events in the calendar view. After the fix, they span the correct date range. No data migration needed — the fix is read-side only.
