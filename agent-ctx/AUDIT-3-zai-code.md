# AUDIT-3 — State management audit + reservations/itineraries real-data wiring

**Task ID:** AUDIT-3
**Agent:** Z.ai Code
**Date:** 2026-07-01

## Scope

Two parts:

1. **Part A — State management audit:** enumerate every Zustand store, React Context provider, Redux usage (none), and TanStack Query usage in `apps/consumer-web/src/`. Identify conflicts where two stores manage the same logical domain. Write to `docs/AUDIT-state-management.md`.
2. **Part B — Wire `/account/reservations` and `/account/itineraries` to real Supabase data.** Both pages were 40-line `'use client'` placeholders; rewrite them to fetch from Supabase with the exact join queries specified in the task.

## Method

Read `worklog.md` (Tasks 1-8, 9-a/b/c, 12, MINE-1, MINE-HIEVENTS, P0-1/2/3, API-1+API-2) for context. Confirmed:
- `AppLayoutShell` (`components/AppLayoutShell.tsx`) is a thin client wrapper around the client `AppLayout` component — server components can render it and pass server-rendered JSX as `children` (standard Next.js 16 pattern).
- The dashboard `/account/page.tsx` defines the styling contract: `bg-gray-50 min-h-screen` wrapper, `max-w-3xl/4xl mx-auto px-4 py-8`, white cards `rounded-xl border border-gray-200 p-5/6`, `font-black text-black` titles, `text-gray-400 hover:text-black` back links, black-pill count badges.
- The existing `[id]/page.tsx` detail pages for both routes already query Supabase via `inventory_items!inner(...)` and `itinerary_session_id` FK joins — so the new list-page queries follow the same patterns.
- The reservation status enum is `PENDING | CONFIRMED | CANCELLED | COMPLETED | EXPIRED | REFUNDED` (`lib/api/schemas.ts:131`). The cancel endpoint at `app/api/orders/[id]/cancel/route.ts` accepts `{ reason, phase? }` and POSTs.

## Part A — state management audit

Ran the 4 required grep sweeps across `apps/consumer-web/src/**`:

```
grep -rn "create(" src/ | grep -i "zustand|persist|middleware"
grep -rn "createContext|useContext|Context.Provider" src/
grep -rn "redux|useSelector|useDispatch|createSlice" src/   # → 0 matches
grep -rn "useQuery|useMutation|QueryClient" src/
```

### Zustand stores (3)

| Store | File | Persisted? | State managed | Live consumers |
|---|---|---|---|---|
| `useAppStore` | `lib/store.ts:57` | no | `currentView`, `selectedVendorId`, `selectedCategory`, `searchQuery`, `user`, `sidebarOpen`, `activeSidebarSection`, `viewAs` | ~25 marketplace files. ⚠ Several read `s.navigate` / `s.selectedProductId` which DON'T exist on the store — those marketplace components are dead/broken. |
| `useLocationStore` | `lib/store.ts:95` | `localStorage["planviry-location"]` | `location`, `lat`, `lng`, `confirmed` | `location-search-bar.tsx`, `navbar-search-bar.tsx`, `TaxonomyDirectoryClient.tsx`, `PlanBar.tsx`, `use-location-context.ts` |
| `useListingForm` | `lib/useListingForm.ts:72` | `localStorage["listing-form-storage"]` | Staybnb `ListingForm` shape (16 fields) | ⚠ **DEAD** — wizard was refactored to `react-hook-form`; only the `ListingForm` type re-export is used by `lib/parsers/listing.ts`. No runtime consumer. |

### React Context providers (5)

| Context | File | Mounted at | State managed | Notes |
|---|---|---|---|---|
| `CartContext` | `lib/cart-context.tsx` | root layout (`app/layout.tsx:38`) | in-memory `items: CartItem[]` + 7 derived values | Live. No persistence (cart lost on refresh). |
| `TripItineraryContext` | `lib/trip-context.tsx` | ⚠ **NOT MOUNTED** | `trip`, `items: TripItineraryItem[]` | References `trips` table (remapped to `itinerary_sessions` by `db-compat.ts:49`) and `trip_itinerary_items` table (which **doesn't exist** in Planviry schema). Calling `useTripItinerary().addItem(...)` would `PGRST205`. |
| `AppContext` (AppProvider) | `context/AppContext.tsx` | root layout (`app/layout.tsx:39`) | ~50 fields: `activeCategory`, `cartItems` (DUPLICATE), `isCartOpen`, search filters, tasks, itinerary (DUPLICATE), collaborators, chat, activities, split-pay, vendor portal, blueprint vibe sliders, toast | Live. Seeds from `INITIAL_*` prototype data → logged-in users immediately have fabricated tasks/collaborators/messages in memory. |
| `CreateListingFormProvider` | `app/hosting/create/listing/[id]/components/CreateListingFormProvider.tsx` | per wizard step page | `react-hook-form` FormProvider + 4 wizard-specific fields (`markStepAsVisited`, `getCurrentFormData`, `handleStepClick`, `isRedirecting`) | No conflicts. |
| `LocationProvider` | `components/providers/LocationProvider.tsx` | root layout (`app/layout.tsx:37`) | none of its own — bootstrap wrapper around `useLocationStore` + `/api/geolocation` | No conflicts. |

### TanStack Query

- `QueryProvider` (`components/providers/query-provider.tsx`) defined with `staleTime: 60s`, `refetchOnWindowFocus: false`, `retry: 1`. **NOT mounted in `app/layout.tsx`** — only marketplace pages that wrap themselves in their own provider can use `useQuery`. ~25 consumer callsites across `components/marketplace/**`, `components/views/**`, `hooks/use-supabase.ts`. The `/account/**` routes cannot use TanStack Query without adding a per-route wrapper.
- `useQueryClient` is used for cache invalidation in `admin-dashboard.tsx`, `orders-management.tsx`, `leads-panel.tsx`, `products-management.tsx`.

### Redux

Not installed (`package.json` has no `redux`/`@reduxjs/toolkit`/`react-redux`). Zero matches.

### NextAuth.js

`next-auth@^4.24.11` installed. Two `<SessionProvider>` wrappers (`components/providers.tsx`, `components/ticketing/auth-provider.tsx`) — **neither is mounted in the root layout**, so neither does anything. Auth actually runs through Supabase SSR middleware (`lib/supabase/middleware.ts`) + per-page `supabase.auth.getUser()` calls. Two competing user hooks: `useAuth()` (adds `vendorInfo`) and `useUser()` (Supabase user only).

### 5 conflicts documented in the audit doc

1. **Cart** — `CartContext.items` vs `AppContext.cartItems` (both mounted at root, not synchronised).
2. **Itinerary** — `TripItineraryContext` (broken: unmounted + wrong tables) vs `AppContext.itinerary` (prototype-seeded) vs Supabase `itinerary_sessions`+`reservations` (canonical).
3. **Location** — `useLocationStore.location` (Zustand, persisted) vs `AppContext.searchWhere` (in-memory, default `"Savannah, GA"`).
4. **Current user** — `useAppStore.user` vs `useAuth()` vs `useUser()`/`useUserProfile()` vs per-page `supabase.auth.getUser()`.
5. **Search query** — `useAppStore.searchQuery` vs `AppContext.searchWhat/Where/When/...` vs URL params via `useQueryParams`.

Plus 8 follow-up recommendations in §7 of the audit doc.

## Part B — wired `/account/reservations` and `/account/itineraries` to real Supabase data

### Architecture decision

Converted both pages from `'use client'` placeholders to **async server components** (the task explicitly permitted either; server components are the modern Next.js 16 pattern). The cancel button on the reservations list needs to `fetch()` the API and `router.refresh()`, so the rendering was split into a sibling **client** component:

```
app/account/reservations/
  page.tsx                  # async server component — auth gate + Supabase query
  ReservationsList.tsx      # 'use client' — renders cards + cancel button
app/account/itineraries/
  page.tsx                  # async server component — auth gate + Supabase query
  ItinerariesList.tsx       # 'use client' — renders cards
```

`AppLayoutShell` is a client wrapper that accepts server-rendered children — standard Next.js server/client boundary pattern.

### Reservations page

`page.tsx` (server):
1. `createClient()` from `@/lib/supabase/server`
2. `supabase.auth.getUser()` → if no user, `redirect('/login?returnTo=/account/reservations')`
3. `supabase.from('reservations').select(`…`)` with the exact join from the task spec:
   ```
   id, status, starts_at, ends_at, quantity, total_price_cents, currency, created_at,
   inventory_items!inner(id, title, category, slug, vendor_accounts!inner(name, slug)),
   check_ins(id, checked_in_at)
   ```
4. `.eq('user_id', user.id).order('created_at', { ascending: false })`
5. Render through `AppLayoutShell` → either an error card, an empty-state card, or `<ReservationsList reservations={data} />`.

`ReservationsList.tsx` (client) — one card per reservation with:
- Item title + vendor name (linked to `/v/{vendor.slug}`).
- Status badge — CONFIRMED=green, PENDING=yellow, CANCELLED=red, COMPLETED/EXPIRED/REFUNDED=gray. Bonus "Checked in" pill if `check_ins.length > 0`.
- Category chip.
- 3-column grid: When (formatted date range, same-day collapses to one line), Quantity, Total price (`Intl.NumberFormat` with the reservation's `currency`, defaults to USD).
- "View Details" link (`Eye` icon) → `/account/reservations/{id}`.
- "Download Invoice" plain `<a href>` (`Download` icon) → `/api/orders/{id}/invoice` (browser streams PDF).
- "Cancel" button (`XCircle` icon) — only renders if `status === 'PENDING' || 'CONFIRMED'`. Confirms via `confirm()`, posts `{ reason: 'Cancelled by user' }` to `/api/orders/{id}/cancel`, shows `Loader2` spinner during the request, fires a `sonner` toast on success/error, then `router.refresh()` to re-render the server component with the updated status.

### Itineraries page

`page.tsx` (server):
1. Same auth gate pattern.
2. `supabase.from('itinerary_sessions').select(`…`)` with the exact join from the task spec:
   ```
   id, title, status, occasion_type, created_at,
   reservations(id, status, total_price_cents, inventory_items!inner(title, category))
   ```
3. `.eq('owner_id', user.id).order('created_at', { ascending: false })`
4. Render through `AppLayoutShell` → either an error card, an empty-state card, or `<ItinerariesList sessions={data} />`.

`ItinerariesList.tsx` (client) — one card per itinerary session with:
- Title + status badge (ACTIVE=green, PLANNING/DRAFT=yellow, ARCHIVED/COMPLETED=gray, CANCELLED=red).
- `occasion_type` chip if present.
- Created date (`Calendar` icon).
- 3-column grid: Number of reservations (`session.reservations.length`), Total cost (sum of `reservation.total_price_cents` across the session's reservations, formatted as USD), Categories represented (unique `inventory_items.category` values from the session's reservations, joined with `, `, underscores → spaces).
- "View Timeline" link (`Users` icon) → `/account/itineraries/{id}`.
- "Add items" secondary link → `/planner`.
- "Create New Itinerary" button at the top of the page (`Plus` icon) → `/planner`. Empty-state also has a "Create your first itinerary" CTA → `/planner`.

### Styling consistency with dashboard

Every card is `bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow`. Page wrapper is `bg-gray-50 min-h-screen` with `mx-auto max-w-3xl px-4 py-8`. Titles are `text-2xl font-black text-black`. Back link is `text-sm text-gray-400 hover:text-black` with `ArrowLeft` icon. Count badges are `text-xs bg-black text-white px-2 py-0.5 rounded-full`. All icons are from `lucide-react`. Matches the dashboard's `/account/page.tsx` styling contract verbatim.

## Verification

- **Auth redirect verified via `curl -I`:**
  - `http://localhost:3000/account/reservations` → `307 location: /login?returnTo=%2Faccount%2Freservations`
  - `http://localhost:3000/account/itineraries` → `307 location: /login?returnTo=%2Faccount%2Fitineraries`
  Both confirm: page compiles cleanly (no 500), redirect fires before any DB query for unauthenticated users, returnTo URL is preserved.
- **Lint:** `bunx eslint` on all 4 new/modified files → exit 0, no warnings.
- **Type-check:** `bunx tsc --noEmit` on the whole consumer-web app → only 3 pre-existing errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx` (untouched, unrelated). **Zero errors in any of the 4 new/modified files.**
- **Dev.log:** no new errors after the change.

## Files touched

- `docs/AUDIT-state-management.md` (NEW — 8 sections, 5 conflict tables, 8 follow-up recommendations, ~250 lines)
- `apps/consumer-web/src/app/account/reservations/page.tsx` (REWRITTEN — 41-line `'use client'` placeholder → 108-line async server component)
- `apps/consumer-web/src/app/account/reservations/ReservationsList.tsx` (NEW — 195-line `'use client'` component)
- `apps/consumer-web/src/app/account/itineraries/page.tsx` (REWRITTEN — 41-line `'use client'` placeholder → 108-line async server component)
- `apps/consumer-web/src/app/account/itineraries/ItinerariesList.tsx` (NEW — 175-line `'use client'` component)

## Notes for downstream agents

- The new pages are **server components**. Future client-side additions (e.g. a "filter by status" dropdown) must go in the `*List.tsx` client sibling, not in `page.tsx`. The pattern (server page + client sibling list) is now the established convention for `/account/**` data screens — `saved/page.tsx`, `notifications/page.tsx`, `payments/page.tsx`, `support/page.tsx` should be migrated to the same pattern in a follow-up (they're still the 40-line placeholder `'use client'` shape).
- The cancel button uses `confirm()` + `sonner` toasts. The `Toaster` is already mounted at the root `app/layout.tsx:43`, so toasts will render. If you replace `confirm()` with a Radix `AlertDialog` later, the `sonner` import path stays `'sonner'` (not `'@/components/ui/sonner'`, which only exports `Toaster`).
- The reservation card uses `formatPrice(cents, currency)` with `Intl.NumberFormat` — if the `currency` column is `null` (the API schema makes it optional), the formatter falls back to USD.
- The audit doc's "5 conflicts" are NOT fixed by this task — this task only wired two pages. The conflicts are flagged with 8 follow-up recommendations in `docs/AUDIT-state-management.md` §7. Whoever picks up the cart/location/itinerary consolidation work should start there.
- I did NOT touch the `[id]/page.tsx` detail pages — they were already wired to real Supabase data in the prior scaffold (P0-2 / API-1). The list pages now link into them via `<Link href="/account/reservations/{id}">` and `<Link href="/account/itineraries/{id}">`, both of which match the existing routes.
