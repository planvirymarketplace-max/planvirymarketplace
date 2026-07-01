# TRAVEL-REDESIGN — zai-code

**Task:** Rebuild `/travel` page to match user's original design (horizontal
search filter bar + dark navy secondary nav + section header + 3-column premium
card grid), replacing the GatedSurfacePage 2-column immersive gate.

## Context loaded
- `worklog.md` (full history) — especially SIDEBAR-2 (created
  `apps/consumer-web/src/app/travel/layout.tsx` wrapping the segment in
  `<AppLayoutShell>`) and the surface-inventory context.
- `apps/consumer-web/src/app/travel/page.tsx` (pre-edit) — rendered
  `<GatedSurfacePage surface="travel" inventoryCategory="LODGING" />`.
- `apps/consumer-web/src/app/travel/layout.tsx` — already wraps every
  `/travel/*` route in `<AppLayoutShell>`. So the page only needs to render
  `<TravelPage />` (no double shell).
- `apps/consumer-web/src/components/SurfaceLiveInventory.tsx` — pattern for
  querying `inventory_items` with `category = 'LODGING'`,
  `status = 'PUBLISHED'`, joining `locations(name, region)`, and rendering
  cards. Used as the structural reference for the Supabase query + price
  formatting + location label helpers.
- `apps/consumer-web/src/lib/surface-data.ts` — `SURFACE_DATA.travel.whatOptions`
  used as the source of truth for the WHAT dropdown options.
- `apps/consumer-web/src/lib/surface-inventory-map.ts` — confirmed
  `SURFACE_TO_INVENTORY.travel.category = 'LODGING'`.
- `apps/consumer-web/src/lib/cart-context.tsx` — `useCart` + `cartItemId` +
  `CartItem` interface. CartProvider wraps the whole app in
  `app/layout.tsx`, so `useCart()` is safe to call inside TravelPage.
- `apps/consumer-web/src/lib/supabase/client.ts` — `createClient()` returns the
  browser Supabase client.
- `apps/consumer-web/src/app/api/travel/listings/[id]/route.ts` and
  `apps/consumer-web/src/app/api/directory/route.ts` — confirmed the join
  syntax `media_assets(url, alt_text, is_primary, media_type)` works on
  `inventory_items` (with the `!inventory_items` FK hint not needed when
  queried directly from inventory_items).
- `apps/consumer-web/src/app/globals.css` — confirmed design tokens:
  `--color-midnight-slate: #0F172A` (project dark navy),
  `--color-champagne-gold: #C5A059`, `--color-brand-orange: #F47245`,
  `--color-outline-variant: #c6c6cd`. Used `bg-midnight-slate` /
  `text-midnight-slate` / `text-champagne-gold` etc. throughout for
  consistency with the rest of the app.
- `apps/consumer-web/src/components/ui/{button,select,input}.tsx` — shadcn
  primitives used directly (no custom builds).
- Cart provider scope verified: `app/layout.tsx` line 40 wraps children in
  `<CartProvider>`.

## Files created
1. **`apps/consumer-web/src/components/travel/TravelPage.tsx`** (NEW, ~470
   lines, client component `'use client'`). Renders the user's original
   single-page layout:
   - **Horizontal search filter bar** — a white rounded-2xl container
     (`bg-white rounded-2xl border border-midnight-slate/10 shadow-sm`)
     holding a single horizontal row (stacks to vertical under `md:`) of:
     WHAT (Select w/ Search icon), WHERE (Input w/ MapPin icon, placeholder
     "Savannah"), WHEN (button "Add dates" w/ Calendar icon), PRICE (Select
     w/ DollarSign icon, default "Any Price"), ATTENDEES (Select w/ Users
     icon, default "4 Guests"), FILTERS (outline Button w/
     SlidersHorizontal), CLEAR (text button), SEARCH (dark navy Button w/
     Search icon). Each control has an uppercase gray `FilterLabel` above
     it. `FilterDivider` (a 1px-wide `bg-midnight-slate/10` vertical rule,
     hidden on mobile) sits between controls.
   - **Dark navy secondary nav bar** — `<nav className="bg-midnight-slate
     rounded-xl px-4 py-3">` containing "All travel" (bold, white,
     left-aligned) + 5 right-aligned tabs ("Places to stay", "Flights",
     "Cars", "Destinations", "Group Trip"). Active tab turns
     `text-champagne-gold`; inactive are `text-white/70`.
   - **Section header** — `<h1 className="font-serif text-3xl md:text-4xl
     font-bold text-midnight-slate">Travel</h1>` + subtitle "Hand-selected
     local professionals and premium spaces for a memorable celebration." +
     a right-aligned SORT `Select` (default "Most Exclusive").
   - **Travel cards grid** — `grid grid-cols-1 md:grid-cols-2
     lg:grid-cols-3 gap-6` of premium cards. Each card:
     - **Image** (`aspect-[16/9]`): from `media_assets` (primary first, then
       first-available) → fallback to `metadata.image` / `image_url` /
       `photo_url` / `thumbnail` → fallback to a `<Sparkles>` placeholder
       on `bg-midnight-slate/5`. Hover scales the image 1.05× over 500ms.
     - **Badge** (top-left): `bg-midnight-slate text-white text-[10px] font-bold
       uppercase tracking-widest px-2.5 py-1 rounded`. Derived from
       `metadata.badge` / `metadata.tier` / `metadata.verification`, else
       inferred from `metadata.subcategory` ("resort"/"hotel" → "VERIFIED
       HOTEL", "luxury"/"estate" → "LUXURY STAY", "villa"/"rental" →
       "PREMIUM RENTAL"), else "VERIFIED STAY".
     - **Star rating** (top-right): only rendered when `metadata.rating` /
       `star_rating` / `stars` is a number > 0. Rendered as
       `bg-midnight-slate/70 backdrop-blur-sm text-white` pill with a filled
       `Star` icon in `champagne-gold`. Format `5.0 ★` (one decimal).
     - **Category label**: "TRAVEL" (`text-[10px] font-bold uppercase
       tracking-widest text-midnight-slate/50`).
     - **Title**: `font-serif text-lg font-bold text-midnight-slate
       line-clamp-1`.
     - **Location**: `text-xs text-midnight-slate/60` with `<MapPin>` icon,
       `line-clamp-1`. From `locations(name, region)` joined.
     - **Description**: `text-xs text-midnight-slate/70 line-clamp-2`. From
       `metadata.description` / `short_description` / `summary`, then
       `inventory_items.description`, then a Planviry default string.
     - **Price**: `text-lg font-bold text-midnight-slate` formatted from
       `base_price_cents / 100` via `Intl.NumberFormat` (currency-style),
       with "/ night" suffix when price > 0. Free → "Free".
     - **Buttons**: "Details" (outline Button, `asChild` wrapping a `<Link
       href="/travel/[slug-or-id]">`) + "Add to Plan" (filled dark navy
       Button, `bg-midnight-slate text-white`). "Add to Plan" calls
       `useCart().addItem(...)` with a `lodging`-type CartItem
       (`cartItemId('lodging', item.id, 'travel')`, image from
       `primaryImage(item)`, amount from `base_price_cents`, today's date,
       vendor_id from `item.vendor_id`).
   - **Loading state**: `<Loader2 className="animate-spin">` + "Loading
     premium stays…" text.
   - **Empty state**: `<Sparkles>` icon + "No live lodging inventory yet." +
     "Be the first to list a stay — it will appear here automatically."
   - **Error state**: red-tinted alert box with `<AlertCircle>` (uses the
     Supabase `error.message`).
   - **Responsive**: 1 column on mobile (`grid-cols-1`), 2 on tablet
     (`md:grid-cols-2`), 3 on desktop (`lg:grid-cols-3`). The filter bar
     stacks vertically on mobile via `flex-col md:flex-row`. The dark navy
     nav bar stacks via `flex-col sm:flex-row`. The section header stacks
     via `flex-col sm:flex-row`.
   - **Data fetching**: browser Supabase client, `inventory_items` where
     `category = 'LODGING'` and `status = 'PUBLISHED'`, joining
     `locations(name, region)` and `media_assets(url, is_primary)`, ordered
     by `created_at desc`, limit 24. The `useEffect` calls `load()` on
     mount with `eslint-disable-next-line react-hooks/set-state-in-effect`
     (matching the existing `SurfaceLiveInventory.tsx` pattern).
   - The "Search" button re-runs `load()` (so the user gets visual feedback
     that something happens) but does NOT yet wire the WHAT/WHERE/PRICE/
     ATTENDEES values into the query — the spec said "visually present but
     doesn't need full functional filtering yet".

2. **`apps/consumer-web/src/app/travel/page.tsx`** (MODIFIED). Replaced the
   `<GatedSurfacePage surface="travel" inventoryCategory="LODGING" />`
   render with `<TravelPage />` (imported from
   `@/components/travel/TravelPage`). Updated the explanatory comment to
   document the redesign rationale. The page is still a server component
   (no `'use client'`) — the client boundary is inside TravelPage itself.
   The segment-level `app/travel/layout.tsx` continues to wrap children in
   `<AppLayoutShell>` so the sidebar + header + footer are unchanged.

## Verification
- `cd apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "components/travel|app/travel"`
  → **0 errors** in any travel file. (The only 3 tsc errors anywhere in the
  project are in the pre-existing unrelated file
  `src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx` — flagged by
  SIDEBAR-3 and SIDEBAR-4 as predating this task.)
- `cd apps/consumer-web && bun run lint 2>&1 | grep -B 1 -A 4 "travel/TravelPage\|app/travel/page"`
  → **0 errors, 0 warnings**. (Initial draft had an unused
  `// eslint-disable-next-line @next/next/no-img-element` directive on the
  `<img>` tag — the rule didn't actually fire because no `next/image`
  import is needed for an external URL. Removed the directive; lint now
  clean.)
- `curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/travel`
  → `HTTP 200` (455 ms total, 97 ms compile, 353 ms render — fresh compile
  after the file edit).
- `tail -20 dev.log` → most recent `/travel` request logged as
  `GET /travel 200 in 454ms (compile: 97ms, proxy.ts: 4ms, render: 353ms)`.
  No errors, no warnings, no `⨯` markers.

## Stage summary
The `/travel` page now matches the user's original design: a single-page
horizontal layout (search filter bar at top → dark navy secondary nav →
section header → 3-column premium card grid), all rendered inside the
existing AppLayoutShell provided by `app/travel/layout.tsx` (so the left
sidebar, the Planviry header, and the SiteFooter are unchanged). The
GatedSurfacePage 2-column immersive gate is gone. The card grid pulls live
`inventory_items` rows where `category = 'LODGING'` and `status =
'PUBLISHED'`, joining `locations` for the location label and
`media_assets` for the primary image. "Add to Plan" buttons add the item
to the global cart (via `useCart` from `@/lib/cart-context`). "Details"
buttons link to `/travel/[slug-or-id]` (which redirects to `/lodging/[id]`
per the existing `app/travel/[id]/page.tsx`). The filter bar's WHAT/WHERE/
PRICE/ATTENDEES controls are visually present and have working Select /
Input state, but the values don't yet drive the Supabase query — that's
the next iteration (spec said "just the UI matching the design" was
sufficient for this pass). tsc clean for travel scope; ESLint clean; dev
server healthy at HTTP 200.
