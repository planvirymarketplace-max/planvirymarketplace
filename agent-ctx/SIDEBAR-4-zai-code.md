# SIDEBAR-4 — zai-code (sidebar fix sub-agent)

## Task
Wrap the ported EventSeats ticketing pages in Planviry's `<AppLayoutShell>` via a single segment-level `apps/consumer-web/src/app/tickets/layout.tsx`, and strip each page's standalone EventSeats chrome (own `<header>`/`<nav>`/`<aside>`/`<footer>`) to avoid double-chrome. Auth logic (next-auth `useSession`) left intact.

## Scope
- **Customer pages**: `/tickets/whats-on`, `/tickets/book/[showId]/[performanceId]`, `/tickets/book/success/[bookingId]`
- **Admin pages**: `/tickets/admin`, `/tickets/admin/{shows,customers,settings,bookings,bookings/[id]}`

## Context loaded
- `worklog.md` SIDEBAR-1 audit (categorized all 8 ticketing pages as STANDALONE) + ORCHESTRATOR-FINAL (sidebar IS the orchestration).
- `worklog.md` SIDEBAR-2 / SIDEBAR-3 entries — confirmed their `app/lodging/layout.tsx` and `app/hosting/layout.tsx` exist; no conflict with my `app/tickets/layout.tsx`.
- `apps/consumer-web/src/components/AppLayoutShell.tsx` — thin client wrapper rendering `<AppLayout>{children}</AppLayout>` (nav-rail + global nav + SiteFooter).
- tsconfig.json: `strict: true` but `noUnusedLocals` NOT set → unused imports/vars won't fail tsc.
- eslint.config.mjs: `@typescript-eslint/no-unused-vars` OFF → safe to leave now-unused `signOut`/`Button`/`settings` state without cleanup.

## Files Created (1)
- `apps/consumer-web/src/app/tickets/layout.tsx` — segment-level layout: `return <AppLayoutShell>{children}</AppLayoutShell>`. JSDoc documents the SIDEBAR-4 fix scope + the 4 de-duplicated pages.

## Files Modified (12)

### De-duplicated (4) — removed per-page `<AppLayoutShell>` wrapper to avoid double-chrome now that layout.tsx provides the shell:
- `apps/consumer-web/src/app/tickets/page.tsx`
- `apps/consumer-web/src/app/tickets/search/page.tsx`
- `apps/consumer-web/src/app/tickets/[group]/page.tsx`
- `apps/consumer-web/src/app/tickets/[group]/[subcategory]/page.tsx`

### Chrome-stripped (8) — removed own `<header>`/`<nav>`/`<aside>`/`<footer>`, kept all page content (forms, tables, seat grids, modals, booking flow):
- `apps/consumer-web/src/app/tickets/whats-on/page.tsx` — removed `<header>` (venue name + What's On/Admin nav) + `<footer>` (3-col venue/links/system info). Kept `<main>` with `<ShowListing>`.
- `apps/consumer-web/src/app/tickets/book/[showId]/[performanceId]/page.tsx` — removed `<header>` from success return. Kept `<Banner />` + `<main>` with `<BookingPage>`. Loading/error/not-found returns untouched.
- `apps/consumer-web/src/app/tickets/book/success/[bookingId]/page.tsx` — removed `<header>`. Kept step indicator + booking details + digital tickets cards. (Server component — layout.tsx's client `<AppLayoutShell>` wraps it fine.)
- `apps/consumer-web/src/app/tickets/admin/page.tsx` — removed `<header>` (incl. Sign Out button) + `<nav>` sub-tabs. Kept `<main>` with `<AdminDashboard>`. `useSession`/`signOut`/`handleSignOut` left intact (no-unused-vars off).
- `apps/consumer-web/src/app/tickets/admin/shows/page.tsx` — removed `<header>` + `<nav>`. **Relocated "Add New Show" button** to inline toolbar above table (preserves admin functionality). Show/performance edit modals untouched.
- `apps/consumer-web/src/app/tickets/admin/bookings/page.tsx` — removed header `<div>` + `<nav>`. Replaced with inline title block. Filters + table + pagination untouched. `useSession` intact.
- `apps/consumer-web/src/app/tickets/admin/customers/page.tsx` — removed header `<div>` + `<nav>`. Replaced with inline title block. Filters + stats + table untouched. `useSession` intact.
- `apps/consumer-web/src/app/tickets/admin/settings/page.tsx` — removed header `<div>` + `<nav>`. **Relocated "Save All Settings" button** to inline toolbar. Tab-navigation `<aside>` (Venue/Booking/System/Links/Appearance/Admin Users) kept as content. All 6 tab panels untouched. `useSession` intact.
- `apps/consumer-web/src/app/tickets/admin/bookings/[id]/page.tsx` — removed header `<div>`. Replaced with inline title block. All booking detail cards untouched. `useSession` intact.

## Auth logic preserved verbatim
Every admin page still calls `useSession()` from `next-auth/react`, still checks `status === 'unauthenticated'` and `router.push('/admin/login')`, still gates content behind `status === 'loading'` spinner returns. The `session` data variable is now unused in some pages' JSX (was only referenced in the removed headers) but the destructure is left intact to minimize churn.

## Verification
- `cd apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "src/app/tickets"` → **0 errors in any tickets file**.
- Full tsc reports 3 pre-existing errors in `src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx` — file is NOT in my modified list; pre-existing breakage from a prior port. Not my scope.
- `bun run lint 2>&1 | grep "tickets/"` → **0 errors, 0 warnings in any tickets file**.
- Lint reports 33 pre-existing errors elsewhere (`useMediaQuery.tsx`, `directory-view.tsx`, `vendor-portal.tsx` — `react-hooks/set-state-in-effect`). Not my scope.
- `tail -30 /home/z/my-project/dev.log` → server healthy, no crashes, no tickets-related errors. No `/tickets/*` requests yet (user hasn't navigated there since edits) but server compiled cleanly.
- `git status` → 13 tickets files modified (1 layout created + 4 de-duplicated + 8 chrome-stripped), no other files touched by me. Concurrent agents' changes (SIDEBAR-3's lodging/hosting layouts, travel/* edits) present but don't conflict.

## Decisions / edge cases
1. **Discovered during planning**: 4 pages under `/tickets/*` were ALREADY wrapped (`/tickets`, `/tickets/search`, `/tickets/[group]`, `/tickets/[group]/[subcategory]`) per SIDEBAR-1 audit. Adding the segment-level layout without touching those would have caused double-chrome. De-duplicated all 4 by removing their per-page `<AppLayoutShell>` wrapper.
2. **Action buttons in headers preserved**: `admin/shows` header had "Add New Show" button and `admin/settings` header had "Save All Settings" button — these are functionality, not chrome (per task: "admin functionality stays"). Relocated both to inline toolbars above the content so admin actions are not lost with the header chrome.
3. **"Back to Dashboard" / "Back to Bookings" buttons dropped**: these were chrome navigation. The Planviry sidebar + browser back covers navigation needs. (Note: these buttons linked to `/admin/*` paths which is the Planviry admin portal, NOT `/tickets/admin/*` — pre-existing broken links in the ported EventSeats code; dropping them removes the broken nav.)
4. **Loading/error/not-found returns untouched**: e.g., `book/[showId]/[performanceId]/page.tsx` has 3 early returns with centered spinners/messages. These now render inside the AppLayoutShell (sidebar shows during loading) — consistent with the existing Planviry loading pattern (see `account/page.tsx`).
5. **`settings` state in whats-on**: still fetched and stored, no longer rendered (was only in the removed header/footer). Left intact to avoid touching fetch logic. Minor perf cost (one extra `/api/settings` fetch) but no functional impact.
6. **Nested `<main>` tags**: AppLayout renders its own `<main>{children}</main>`. Several pages also render `<main>` inside. Nested `<main>` is technically invalid HTML but visually harmless. Left as-is to minimize churn (task: "be surgical — don't rewrite page logic, just remove the outer layout wrapper").

## Stage Summary
The entire `/tickets/*` route segment now renders inside the Planviry AppLayoutShell via a single segment-level `layout.tsx`. Users browsing `/tickets/whats-on`, booking seats at `/tickets/book/[showId]/[performanceId]`, seeing their confirmation at `/tickets/book/success/[bookingId]`, and vendors managing ticketing at `/tickets/admin{,shows,bookings,customers,settings,bookings/[id]}` will now see the hover-expanding left nav-rail + top "Planviry" wordmark + cart/account header + SiteFooter — restoring the orchestration that lets them jump hotel → dinner → tickets without leaving the app.
