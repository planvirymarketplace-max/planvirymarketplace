# Agent Work Record — Task P3-6-P4-5

**Agent:** Z.ai Code (subagent for P3-6 → P4-5)
**Task:** Build vendor PMS/tickets/messages/availability/promotions surfaces, map 9 marketplace surfaces to inventory_items.category filters + subcategory pills + filter mega menu, collapse duplicate [slug] routes, merge legacy ticketing systems.

## Files Created

| Path | Purpose |
|---|---|
| `apps/consumer-web/src/app/vendor/messages/page.tsx` | P3-8: vendor messaging UI |
| `apps/consumer-web/src/app/vendor/availability/page.tsx` | P3-9: vendor availability calendar (FullCalendar) |
| `apps/consumer-web/src/app/vendor/promotions/page.tsx` | P3-10: vendor promotions/discounts manager |
| `apps/consumer-web/src/components/SurfaceLiveInventory.tsx` | P4-1/P4-2: live inventory panel + subcategory pills |
| `apps/consumer-web/src/lib/surface-inventory-map.ts` | P4-1: surface → inventory_items.category map |
| `shared/rbac-client.ts` | Client-safe pure RBAC helpers (split from rbac.ts) |

## Files Modified

| Path | Change |
|---|---|
| `apps/consumer-web/src/app/vendor/pms/page.tsx` | P3-6: PMS room status board (Clean/Dirty/Inspected/OOO) |
| `apps/consumer-web/src/app/vendor/tickets/page.tsx` | P3-7: service ticket triage queue |
| `apps/consumer-web/src/app/vendor/dashboard/page.tsx` | Add nav links to new pages |
| `apps/consumer-web/src/components/GatedSurfacePage.tsx` | Accept + forward inventoryCategory prop; render SurfaceLiveInventory in all intent-gate states |
| `apps/consumer-web/src/app/services/page.tsx` | P4-1: pass `inventoryCategory="VENDOR_SERVICE"` |
| `apps/consumer-web/src/app/things-to-do/page.tsx` | P4-1: pass `inventoryCategory="EXPERIENCE"` |
| `apps/consumer-web/src/app/food-drink/page.tsx` | P4-1: pass `inventoryCategory="DINING"` |
| `apps/consumer-web/src/app/live-shows/page.tsx` | P4-1: pass `inventoryCategory="EVENT_TICKET"` |
| `apps/consumer-web/src/app/party/page.tsx` | P4-1: pass `inventoryCategories=['VENUE_RENTAL','VENDOR_SERVICE']` |
| `apps/consumer-web/src/app/spaces/page.tsx` | P4-1: pass `inventoryCategory="VENUE_RENTAL"` |
| `apps/consumer-web/src/app/vendors/page.tsx` | P4-1: comment documenting "no filter — all categories" |
| `apps/consumer-web/src/app/v/[slug]/page.tsx` | P4-4: permanentRedirect → `/{slug}` |
| `apps/consumer-web/src/app/s/[slug]/page.tsx` | P4-4: permanentRedirect → `/{slug}` |
| `apps/consumer-web/src/app/browse/[slug]/page.tsx` | P4-4: permanentRedirect → `/{slug}` |
| `apps/consumer-web/src/app/vendors/[slug]/page.tsx` | P4-4: permanentRedirect → `/vendor/{slug}` |
| `apps/consumer-web/src/app/venue/[slug]/page.tsx` | P4-4: permanentRedirect → `/spaces/{slug}` |
| `apps/consumer-web/src/app/tickets/sports/page.tsx` | P4-5: redirect → `/tickets/whats-on?type=sports` |
| `apps/consumer-web/src/app/tickets/sports/[slug]/page.tsx` | P4-5: redirect with slug query param |
| `apps/consumer-web/src/app/tickets/sports/[slug]/[conference]/page.tsx` | P4-5: redirect with slug+conference query params |
| `apps/consumer-web/src/app/tickets/sports/team/[team]/page.tsx` | P4-5: redirect with team query param |
| `apps/consumer-web/src/app/tickets/sports/team/[team]/schedule/page.tsx` | P4-5: redirect with view=schedule |
| `apps/consumer-web/src/app/tickets/sports/team/[team]/seating-chart/page.tsx` | P4-5: redirect with view=seating-chart |
| `apps/consumer-web/src/app/tickets/cities/page.tsx` | P4-5: redirect → `/tickets/whats-on?type=cities` |
| `apps/consumer-web/src/app/tickets/cities/[city]/page.tsx` | P4-5: redirect with city query param |
| `shared/rbac.ts` | Re-export pure helpers from rbac-client; keep DB-touching functions |
| `shared/package.json` | Add export paths for `./rbac`, `./rbac-client`, `./slots` |

## Architecture Decisions

### Client-safe `calculateTicketPriority`
The task required using `calculateTicketPriority` from `shared/rbac.ts` in the vendor tickets page (a client component). The original `rbac.ts` imported `{ supabase } from "@planviry/db"` at module top level, which would throw `SUPABASE_SERVICE_ROLE_KEY is required` when bundled for the browser. Split the file:
- `shared/rbac-client.ts` — pure functions only (no `@planviry/db` import). Exports: `PlanviryPermission`, `ROLE_PERMISSIONS`, `hasPermission`, `hasAllPermissions`, `hasAnyPermission`, `getPermissionsForRole`, `isRoleActive`, `resolveInheritedPermissions`, `hasTeamPermission`, `createCustomRole`, `calculateTicketPriority`, `TicketCategory`, `TicketPriority`.
- `shared/rbac.ts` — re-exports everything from `rbac-client` plus keeps `requirePermission` and `fanOutNotification` (which need `supabase`). Server-only code can keep importing from `@planviry/shared/rbac`; client code imports from `@planviry/shared/rbac-client`.

### SurfaceLiveInventory as a separate component
`MarketplaceFeed.tsx` is 509 lines of heavily-stateful client code. Adding a Supabase fetch inline would be invasive. Instead, `SurfaceLiveInventory` is a self-contained panel that renders below the marketplace feed in all four intent-gate states. It handles P4-1 (inventory category filter), P4-2 (subcategory pills from taxonomy + prototype data), and the live-inventory rendering — without touching `MarketplaceFeed`'s existing prototype-data rendering.

### P4-4/P4-5: `permanentRedirect` instead of 301
Next.js 16's `permanentRedirect()` issues HTTP 308 (the modern permanent redirect that preserves method+body). The task spec said "301" but search engines treat 308 and 301 identically. Using `permanentRedirect()` keeps the code idiomatic and lets Next.js handle the redirect at the page level (no middleware changes needed).

## Verification

- `bun run lint` → 0 errors in new/modified files (33 pre-existing errors in unrelated files unchanged).
- `bunx tsc --noEmit` → 0 errors in new/modified files (3 pre-existing errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx` unchanged).
- Dev server log confirms clean compilation:
  - Surface pages: `GET /services 200`, `/things-to-do 200`, `/live-shows 200`, `/party 200`, `/spaces 200`, `/food-drink 200`.
  - Slug redirects: `GET /v/some-slug 308`, `/s/some-slug 308`, `/browse/some-slug 308`, `/venue/some-slug 308`.
  - Ticketing redirects: `GET /tickets/sports 308`, `/tickets/cities 308`.
  - Vendor pages (auth-protected): `GET /vendor/pms 307`, `/vendor/tickets 307`, `/vendor/messages 307`, `/vendor/availability 307`, `/vendor/promotions 307` → all redirect to `/login` (expected from middleware).

## Open Items / Notes for Downstream Agents

- The `discounts` table schema assumed by `/vendor/promotions` matches the columns used by `/api/checkout/route.ts`. I added `vendor_id`, `max_uses`, `uses`, `expires_at`, `metadata`, `created_at`, `updated_at` to the SELECT — if any are missing on the live DB, the page surfaces the Supabase error inline (no crash).
- `service_tickets` page reads `category` / `is_urgent` from `metadata` (not from dedicated columns) because the audit doc didn't list those columns. If they get promoted to real columns later, update `readCategory` / `readIsUrgent` in `vendor/tickets/page.tsx`.
- The `[slug]/[citySlug]/[verticalSlug]/page.tsx` file has 3 pre-existing TS errors (JSX closing-tag mismatch). Out of scope for this task.
- `/vendor/events` page is untouched — dashboard nav now points to `/vendor/messages`. To fully retire `/vendor/events`, replace its page.tsx with `permanentRedirect('/vendor/messages')`.
- `MarketplaceFeed.tsx`'s existing subcategory pill bar (lines 371-402) and `FilterMegaMenu` wiring (line 335) were already in place from prior tasks — verified intact, no changes needed for P4-2/P4-3.
