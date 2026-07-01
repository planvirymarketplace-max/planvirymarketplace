# AUDIT-3 — State Management Audit (apps/consumer-web/src)

**Scope:** every file under `apps/consumer-web/src/`.
**Date:** performed as part of Task AUDIT-3.
**Method:** `grep` for `create(` (Zustand), `createContext`/`useContext`/`Context.Provider`
(React Context), `redux|useSelector|useDispatch|createSlice` (Redux), and
`useQuery|useMutation|QueryClient` (TanStack Query).

## TL;DR

The consumer-web app ships **four** state-management mechanisms and uses them
**in parallel with significant overlap**:

| Mechanism              | Installed? | Used?     | Files defining state |
|------------------------|------------|-----------|----------------------|
| Zustand                | ✅ `^5.0.6`| ✅        | 2 files (3 stores)   |
| React Context          | (built-in) | ✅        | 5 files (5 contexts) |
| TanStack Query         | ✅ `^5.82` | ✅        | 1 provider + ~25 consumers |
| Redux / Redux Toolkit  | ❌ not installed | ❌ | none |
| NextAuth.js (SessionProvider) | ✅ `^4.24` | ✅ (mounted twice) | 2 wrappers |
| Supabase `auth.getUser()` per-page (no provider) | ✅ | ✅ | ~6 page-level usages |

There are **three concrete conflicts** where two stores manage the same logical
domain (cart, location, current-user). See §6.

---

## 1. Zustand stores

### 1.1 `useAppStore` — global marketplace view-state
- **File:** `src/lib/store.ts` (lines 6–80)
- **Persistence:** none (in-memory)
- **State managed:** `currentView`, `selectedVendorId`, `selectedCategory`,
  `searchQuery`, `user` (AppUser), `sidebarOpen`, `activeSidebarSection`,
  `viewAs`.
- **Actions:** `setView`, `selectVendor`, `selectCategory`, `setSearchQuery`,
  `setUser`, `goHome`, `navigateToVendor`, `navigateToCategory`,
  `navigateToSearch`, `toggleSidebar`, `setSidebarOpen`,
  `setActiveSidebarSection`, `setViewAs`.
- **Consumers:** ~25 files under `src/components/marketplace/**` and
  `src/components/views/**` plus `src/components/admin/admin-{sidebar,header}.tsx`.
- **⚠ Drift:** Several marketplace consumers (e.g.
  `src/components/marketplace/dashboard/dashboard-layout.tsx:78`,
  `src/components/marketplace/products/product-detail.tsx:100`,
  `src/components/marketplace/booking/booking-view.tsx:90`) read
  `useAppStore((s) => s.navigate)` and `s.selectedProductId`, **neither of which
  exists on the store.** These selectors therefore always return `undefined`
  at runtime — the marketplace UI is dead/broken code that imports a store
  shape that no longer matches the source.

### 1.2 `useLocationStore` — user's location (persisted)
- **File:** `src/lib/store.ts` (lines 82–109)
- **Persistence:** `localStorage` via `persist` middleware, key
  `planviry-location`.
- **State managed:** `location` (string), `lat`, `lng`, `confirmed`.
- **Actions:** `setLocation`, `setCoords`, `clearLocation`, `confirmLocation`.
- **Consumers:** `src/components/location-search-bar.tsx`,
  `src/components/navbar-search-bar.tsx`,
  `src/components/taxonomy/TaxonomyDirectoryClient.tsx`,
  `src/components/orchestration/PlanBar.tsx`,
  `src/hooks/use-location-context.ts`.
- **Mount-time hydration:** the persisted store is hydrated client-side by the
  `LocationProvider` (`src/components/providers/LocationProvider.tsx` →
  `useLocationContext()` in `src/hooks/use-location-context.ts`), which also
  fires a `/api/geolocation` lookup on first mount.

### 1.3 `useListingForm` — Staybnb hosting wizard form state (persisted)
- **File:** `src/lib/useListingForm.ts` (lines 1–83)
- **Persistence:** `localStorage` via `persist` middleware, key
  `listing-form-storage`.
- **State managed:** the full Staybnb `ListingForm` shape
  (`propertyType`, `privacyType`, `location`, `checkInTime`, `checkOutTime`,
  `title`, `description`, `nightPrice`, `promotions`, `structure`,
  `guestLimits`, `amenities`, `safetyItems`, `images`, `score`,
  `minCancelDays`, `status`).
- **Actions:** `setField<K>(key, value)`, `reset()`.
- **Consumers:** none in the active wizard flow. The hosting wizard was
  refactored (see `apps/consumer-web/src/app/hosting/create/listing/[id]/components/CreateListingFormProvider.tsx`)
  to use **react-hook-form** (`FormProvider`/`useForm`) with a Zod resolver,
  not this Zustand store. `useListingForm` is therefore **dead code** — kept
  only because `src/lib/parsers/listing.ts` imports the `ListingForm` type
  from it. The runtime store itself has no live consumers.

---

## 2. React Context providers

### 2.1 `CartContext` (Planviry Unified Cart — Part 41)
- **File:** `src/lib/cart-context.tsx`
- **State managed:** in-memory `items: CartItem[]` (no persistence — cart is
  lost on refresh). Derived values: `totalAmount`, `totalDeposit`,
  `itemCount`, `chargeableItems`, `nonChargeableItems`, `groupedByVendor`,
  `groupedByType`.
- **Actions:** `addItem`, `removeItem`, `updateItem`, `clearCart`.
- **Mounted at:** `src/app/layout.tsx:38` (`<CartProvider>` wraps the whole
  app).
- **Consumers:** `src/components/cart/CartDrawer.tsx`,
  `src/components/cart/PromoCodeInput.tsx`,
  `src/components/orchestration/CartView.tsx`,
  `src/components/checkout/CheckoutContent.tsx`, etc.
- **⚠ Conflict:** the parallel `AppContext` (§2.4) also has a `cartItems`
  state + `addToCart`/`removeFromCart`/`updateCartQuantity`. The two are not
  synchronised — components that read from `useCart()` see one cart, while
  components that read from `useApp()` see a different one.

### 2.2 `TripItineraryContext` (Planviry Trip Itinerary — Part 41)
- **File:** `src/lib/trip-context.tsx`
- **State managed:** `trip` (single selected trip), `items: TripItineraryItem[]`
  (day-by-day plan with 6 item types), `loading`, `error`. Derived:
  `itemsByDate`, `itemsByType`.
- **Actions:** `createTrip`, `loadTrip`, `addItem`, `removeItem`,
  `reorderItems`. Backed by Supabase `trips` + `trip_itinerary_items` tables
  (NOT the Planviry canonical `itinerary_sessions`/`reservations` tables —
  see conflict note in §6).
- **Realtime:** subscribes to `postgres_changes` on
  `trip_itinerary_items` for the loaded trip.
- **Mounted at:** not wired into `src/app/layout.tsx`. A `TripItineraryProvider`
  would need to be added per-route. Components that call `useTripItinerary()`
  without a provider will throw.
- **Consumers:** `src/components/itinerary/ItineraryTimeline.tsx` references
  the type but the context hook itself has **zero call sites** in the
  rendered tree. The itinerary pages (`/account/itineraries/[id]/page.tsx`)
  use direct `supabase.from('itinerary_sessions')` queries instead.

### 2.3 `AppProvider` (prototype "kitchen-sink" context)
- **File:** `src/context/AppContext.tsx`
- **State managed:** an extremely large bag of prototype state —
  `activeCategory`, **`cartItems`** (DUPLICATE of CartContext),
  `isCartOpen`, `selectedItem`, search/filter fields (`searchWhat`,
  `searchWhere`, `searchWhen`, `searchPrice`, `searchAttendees`,
  `searchFilters`, `selectedSubcategory`), task management (`tasks`,
  `newTask*`, `isAddTaskOpen`, `taskFilter*`), concierge itinerary
  (`itinerary`, `collaborators`, `chatMessages`, `activities`, `chatInput`,
  `isChatOpen`, `showShareModal`, `shareEmail`), split-payment
  (`splitStrategy`, `paymentSentStates`, `personalPaymentCompleted`),
  vendor portal (`bookingRequests`, `vendorInput`), blueprint vibe sliders
  (`vibeIntimacy`, `vibeOpulence`, `vibeActivity`, `selectedBlueprintTheme`,
  `showBlueprintSuccessDrawer`), toast (`toastMessage`).
- **Mounted at:** `src/app/layout.tsx:39` (wraps whole app inside
  `AppProvider`).
- **Consumers:** `src/components/AppLayout.tsx` (the layout itself calls
  `useApp()` to read `cartItems`, `activeCategory`, etc.) — so the prototype
  context **is** live.
- **⚠ Conflicts:**
  - Cart state is duplicated with `CartContext` (§2.1).
  - `itinerary` state is duplicated with `TripItineraryContext` (§2.2).
  - Search/filter state is duplicated with `useAppStore.searchQuery` (§1.1)
    and the URL-based search params (`useQueryParams` /
    `src/app/search/page.tsx`).
- **Initialization:** the prototype state seeds from `src/data/prototype-data.ts`
  (`INITIAL_TASKS`, `INITIAL_ITINERARY`, `INITIAL_COLLABORATORS`,
  `INITIAL_MESSAGES`, `INITIAL_ACTIVITIES`, `INITIAL_BOOKING_REQUESTS`). This
  means a logged-in user landing on `/account` immediately has fabricated
  tasks/collaborators/messages in memory even though the Supabase DB has none.
- **Type drift:** `AppContextProps` declares `toastMessage`/`setToastMessage`/
  `showToast` but they are NOT in the destructure contract — TypeScript
  won't enforce them, and the comment at line 410 ("Add toast support to
  AppContext") is left unfinished.

### 2.4 `CreateListingFormProvider` (hosting wizard form context)
- **File:** `src/app/hosting/create/listing/[id]/components/CreateListingFormProvider.tsx`
- **State managed:** React Context wrapping a `react-hook-form` `FormProvider`
  with a `useForm<CreateListingForm>()` instance. The context value exposes
  `markStepAsVisited`, `getCurrentFormData`, `handleStepClick`,
  `isRedirecting` (saving state during step transitions).
- **Persistence:** none — form state lives in RHF's internal store, but the
  underlying Supabase `inventory_items` row (status=DRAFT) is the source of
  truth; `handleStepClick` writes a partial update via
  `updateDraftListing(...)` (server action → prisma shim → Supabase).
- **Mounted at:** each wizard step page wraps itself in
  `CreateListingFormProvider`.
- **Consumers:** `NavigationButtons.tsx`, `ProgressBar.tsx`, and the step
  pages under `src/app/hosting/create/listing/[id]/(steps)/*`.
- **No conflicts.**

### 2.5 `LocationProvider`
- **File:** `src/components/providers/LocationProvider.tsx`
- **State managed:** none of its own — it's a side-effect mount wrapper that
  calls `useLocationContext()` (which itself calls `useLocationStore()` and
  fires the `/api/geolocation` request on first mount).
- **Mounted at:** `src/app/layout.tsx:37`.
- **No conflicts** (it is just the bootstrap wrapper for the Zustand
  `useLocationStore`).

---

## 3. TanStack Query

### 3.1 `QueryProvider`
- **File:** `src/components/providers/query-provider.tsx`
- **State managed:** a single `QueryClient` (`staleTime: 60s`,
  `refetchOnWindowFocus: false`, `retry: 1`).
- **Mounted at:** **NOT wired into `src/app/layout.tsx`.** The provider is
  defined but never used at the root layout. Components that call
  `useQuery`/`useMutation` therefore only work if they are mounted beneath a
  `QueryProvider` somewhere in their subtree — which, today, only happens
  inside `src/components/marketplace/**` pages that wrap themselves in their
  own provider (see `src/components/marketplace/marketplace/shell.tsx`).
  The `/account/*` pages do **not** mount `QueryProvider`, so they cannot
  use TanStack Query without adding the wrapper.

### 3.2 Consumer callsites (25+ files)
All under `src/components/marketplace/**` and `src/components/views/**` and
`src/hooks/use-supabase.ts`. Examples:
- `src/components/marketplace/home/marketplace-home.tsx:63,72,81` — three
  parallel `useQuery` calls (featured vendors, categories, stats).
- `src/components/marketplace/vendors/vendor-directory.tsx:226,235` — vendors
  list + categories.
- `src/components/marketplace/admin/admin-dashboard.tsx` — 6 `useQuery`
  instances + 2 `useQueryClient` for cache invalidation.
- `src/components/marketplace/booking/booking-view.tsx:101,152` — vendor
  detail query + booking `useMutation`.
- `src/hooks/use-supabase.ts:128,147,165,185` — server-state hooks for
  category groups / category filters / vendors / search results.

### 3.3 Conflicts
TanStack Query is **server-state** (read-mostly, cache-coherent) and does not
overlap with the Zustand/Context *client-state* stores. The only overlap is
that some `useQuery` hooks fetch vendor data and `useAppStore.selectedVendorId`
tracks the currently-selected vendor ID — these are complementary, not
conflicting.

---

## 4. Redux / Redux Toolkit

**Not installed.** `package.json` contains no `redux`, `@reduxjs/toolkit`,
or `react-redux` dependencies. A `grep` for
`redux|useSelector|useDispatch|createSlice` returns zero matches in
`src/`. **No Redux usage.**

---

## 5. NextAuth.js

`next-auth@^4.24.11` is installed. Two separate wrappers mount
`<SessionProvider>`:
1. `src/components/providers.tsx` (`Providers`) — intended to be the root
   provider, but **NOT mounted in `src/app/layout.tsx`**.
2. `src/components/ticketing/auth-provider.tsx` (`AuthProvider`) — also
   mounts `SessionProvider`.

Neither is wired into the root layout (which instead mounts `CartProvider`
and `AppProvider`). The Supabase SSR middleware in `src/middleware.ts`
(`src/lib/supabase/middleware.ts`) is what actually refreshes auth sessions
via cookies, and pages that need the current user call
`supabase.auth.getUser()` directly (e.g. every `src/app/account/*/page.tsx`,
`src/components/orchestration/*`, etc.).

`useAuth()` (`src/hooks/use-auth.ts`) and `useUser()`
(`src/hooks/useUserProfile.ts` chain via `src/hooks/useUser.ts`) are the
two competing hooks that both expose `user`/`session`/`loading` from the
Supabase auth client. They are not unified — `useAuth` also fetches a
`vendor_users` row for `vendorInfo`, while `useUser` only returns the
Supabase user/session. Components pick one or the other ad-hoc.

---

## 6. Conflicts / overlaps (the actual problem list)

### 6.1 CART — three sources of truth
| Source | Where | Backed by | Live? |
|---|---|---|---|
| `CartContext.items` | `src/lib/cart-context.tsx` | in-memory | ✅ mounted at root |
| `AppContext.cartItems` | `src/context/AppContext.tsx:134` | in-memory, seeded `[]` | ✅ mounted at root |
| `carts`/`cart_items` tables | Supabase (per `lib/api/schemas.ts:147`) | DB | only via `/api/v1/cart` routes, not loaded into either context |

The two in-memory stores are **not synchronised**. `AppLayout.tsx` reads
`cartItems` from `useApp()`; `CartDrawer.tsx` reads `items` from `useCart()`.
A user who adds an item via `useApp().addToCart(...)` will not see it in the
drawer if the drawer reads from `useCart()` (and vice versa).

### 6.2 ITINERARY — three sources of truth
| Source | Where | Backed by | Live? |
|---|---|---|---|
| `TripItineraryContext` | `src/lib/trip-context.tsx` | Supabase `trips` + `trip_itinerary_items` | ⚠ not mounted anywhere |
| `AppContext.itinerary` | `src/context/AppContext.tsx:160` | in-memory, seeded from `INITIAL_ITINERARY` (prototype-data) | ✅ mounted at root |
| `itinerary_sessions`/`reservations` (Planviry canonical) | `/account/itineraries/**` + `/api/v1/itineraries` + `/api/v1/itineraries/[id]/share` | Supabase | ✅ direct `supabase.from(...)` queries |

`TripItineraryContext` references a `trips` table and a
`trip_itinerary_items` table that **do not exist** in the Planviry schema
(`db-compat.ts:49` maps `trips → itinerary_sessions`, but the items table
has no Planviry equivalent). Calling `useTripItinerary().createTrip(...)`
would insert into `itinerary_sessions` (via the db-compat redirect), but
`addItem(...)` would insert into `trip_itinerary_items` which doesn't exist
— the Supabase call would fail with `PGRST205` (table not found).

### 6.3 LOCATION — two sources of truth
| Source | Where | Backed by | Live? |
|---|---|---|---|
| `useLocationStore` (Zustand, persisted) | `src/lib/store.ts:95` | `localStorage["planviry-location"]` | ✅ |
| `AppContext.searchWhere` | `src/context/AppContext.tsx:140` | in-memory, default `"Savannah, GA"` | ✅ |

Both store a "where" string the user typed. They are not synchronised — the
navbar search bars (`location-search-bar.tsx`, `navbar-search-bar.tsx`)
write to `useLocationStore`, while the prototype search bars
(`AppLayout.tsx`) write to `AppContext.searchWhere`.

### 6.4 CURRENT USER — three sources of truth
| Source | Where | Backed by |
|---|---|---|
| `useAppStore.user` (Zustand) | `src/lib/store.ts:36` | in-memory; only set by `marketplace-header.tsx` |
| `AppContext` (no `user` field, but `setUser` on `useAppStore`) | — | — |
| `useAuth()` hook | `src/hooks/use-auth.ts` | Supabase auth + `vendor_users` table |
| `useUser()`/`useUserProfile()` hook | `src/hooks/useUser.ts` | Supabase auth only |
| Per-page `supabase.auth.getUser()` | `src/app/account/**/page.tsx` | Supabase auth |

Pages in `/account/**` re-fetch the user on every navigation rather than
reading from any shared store. The marketplace header writes the user into
`useAppStore.user`, but `/account/**` does not read from that store — so
logging out via the marketplace header does not reliably redirect
`/account/*` routes.

### 6.5 SEARCH QUERY — two sources of truth
| Source | Where | Backed by |
|---|---|---|
| `useAppStore.searchQuery` (Zustand) | `src/lib/store.ts:35` | in-memory |
| `AppContext.searchWhat/searchWhere/searchWhen/searchPrice/searchAttendees/searchFilters` | `src/context/AppContext.tsx:139-145` | in-memory, seeded with hardcoded defaults |

Marketplace components read `useAppStore.searchQuery`; prototype
`AppLayout.tsx` reads `AppContext.search*`. URL query params
(`useQueryParams` in `src/hooks/useQueryParams.ts`) are a third source of
truth for the lodging booking form and the search page.

---

## 7. Recommendations (out of scope for AUDIT-3 — flagged for follow-up)

1. **Pick one cart store.** Either delete `AppContext.cartItems`/`addToCart`/
   `removeFromCart`/`updateCartQuantity` and route all cart reads/writes
   through `CartContext`, or delete `CartContext` and consolidate into
   `AppContext`. Given `CartContext` is more thoroughly typed (with the
   `requiresStripeCharge` helper, `groupedByVendor`, `groupedByType`), the
   recommended direction is to **delete the cart fields from `AppContext`**
   and migrate `AppLayout.tsx` to use `useCart()`.

2. **Pick one itinerary store.** Either fix `TripItineraryContext` to use the
   Planviry canonical tables (`itinerary_sessions` + `reservations` with
   `itinerary_session_id`) and mount it at the root, **or** delete
   `TripItineraryContext` entirely (since `/account/itineraries/**` already
   queries Supabase directly) and remove `AppContext.itinerary` (which is
   prototype-only, seeded from `INITIAL_ITINERARY`).

3. **Pick one location store.** Consolidate on `useLocationStore` (persisted
   Zustand). Remove `AppContext.searchWhere` and have the prototype
   `AppLayout.tsx` search bar bind to `useLocationStore().location` instead.

4. **Pick one current-user source.** Mount `useUser()` (or `useAuth()` if
   vendor role is needed) at the root layout and have all consumers read
   from that hook. Stop calling `supabase.auth.getUser()` per-page in
   `/account/**`; instead, gate routes via middleware + the shared hook.

5. **Mount `QueryProvider` at the root layout.** Today it is defined but
   not wired in, so `/account/**` cannot use TanStack Query without
   per-route wrapping. Moving it to the root would let
   `/account/reservations` and `/account/itineraries` use `useQuery` for
   cache-coherent fetching (with auto-refetch on cancel, etc.).

6. **Delete dead code:** `useListingForm` Zustand store
   (`src/lib/useListingForm.ts`) has no live consumers — the wizard uses
   react-hook-form. Either delete the store or convert it to a thin type
   re-export.

7. **Fix the broken marketplace selectors.** Components in
   `src/components/marketplace/**` read `useAppStore((s) => s.navigate)` and
   `s.selectedProductId`, neither of which exists on the store. Either add
   those fields to `useAppStore` or remove the marketplace components
   entirely (they appear to be from a pre-Planviry scaffold iteration).

8. **Mount `Providers`** (`src/components/providers.tsx`, with
   `SessionProvider`) at the root layout, or delete both
   `Providers` and `AuthProvider` — they currently do nothing.
