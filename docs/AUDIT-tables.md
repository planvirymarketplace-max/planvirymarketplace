# AUDIT-1 — API Routes vs Live Supabase Tables

**Task ID:** AUDIT-1
**Agent:** general-purpose sub-agent
**Scope:** `apps/consumer-web/src/app/api/**/*.ts`
**Method:**
1. Extracted every `supabase.from('tablename')` call from all route files under `apps/consumer-web/src/app/api/`.
2. Probed each unique table name against the live Supabase instance
   `https://gzbtmvzidmrnbcgyonlu.supabase.co` using the service-role key
   (script at `/home/z/my-project/audit_tables.ts`).
3. Cross-referenced any missing table against the two compatibility shims:
   - `apps/consumer-web/src/lib/db-compat.ts` → `TABLE_MAP` (table-name redirect
     applied as a Proxy around `createAdminClient()` from `@/lib/supabase/admin`,
     `@/lib/supabase-marketplace/admin`, and `@/lib/supabase`).
   - `apps/consumer-web/src/lib/prisma.ts` → `TABLE_MAP` (Prisma→Supabase model
     redirect; used only by code that goes through `prisma.<model>.*`).
4. For every missing-but-mapped table, traced which Supabase client the calling
   route actually uses (wrapped admin vs. unwrapped server SSR client) — the
   `db-compat` Proxy is installed ONLY on `createAdminClient()` / `supabaseAdmin`.
   It is NOT installed on `createClient()` from `@/lib/supabase/server` or
   `@/lib/supabase-marketplace/server`. Routes that use the unwrapped server
   client to query a redirected table will still hit PostgREST's
   `Could not find the table 'public.<name>'` error at runtime.

---

## 1. Summary

| Bucket | Count |
|---|---|
| Unique tables referenced by `apps/consumer-web/src/app/api/**` | **90** |
| Tables that exist in live Supabase | 49 |
| Tables missing in live Supabase | 41 |
| └─ Missing AND mapped by `db-compat` `TABLE_MAP` | 35 |
| └─ Missing AND mapped by `prisma.ts` `TABLE_MAP` only (covered above) | (subset) |
| └─ Missing AND **not** mapped by any shim → **genuine bug** | **6** |
| Routes that query a mapped-but-missing table via an **unwrapped** client → **bug** | **15** |

The compatibility shim is real and works for routes that use the wrapped
admin client (`createAdminClient()` or `supabaseAdmin`). It silently fails to
protect routes that use the cookie-scoped SSR server client
(`createClient()` from `@/lib/supabase/server` or
`@/lib/supabase-marketplace/server`), because that client is **not** wrapped by
the `db-compat` Proxy.

---

## 2. All Tables Queried by Code — Full Inventory

### 2a. Tables that EXIST in live Supabase (49 — safe)

```
appeals, audit_log, capacity_assignments, cart_line_items, cart_locks, carts,
check_in_lists, check_ins, checkout_sessions, discounts, domain_events,
experiment_results, feature_flag_exposures, ical_sync_logs, idempotency_keys,
in_app_notifications, inventory_items, itinerary_members, itinerary_sessions,
listing_versions, locations, media_assets, notifications, orders,
payment_methods, payments, push_subscription_endpoints, recently_viewed_items,
refunds, reservation_line_items, reservations, reviews, search_logs,
secret_rotations, sms_consents, sms_messages, tax_lines, taxonomy_nodes,
ticket_instances, ticket_tiers, user_profiles, vendor_accounts,
vendor_onboarding_steps, vendor_payouts, vendor_staff, waitlist_entries,
warehouse_exports, webhook_deliveries
```

### 2b. Tables MISSING in live Supabase (41)

Each row lists the table, whether it is mapped by a shim, the target of the
redirect, and the verdict.

| # | Table | db-compat MAP | prisma MAP | Redirect target | Verdict |
|---|---|---|---|---|---|
| 1 | `admin_lead_stats` | ✅ → `domain_events` | — | domain_events | Safe (used via wrapped admin client) |
| 2 | `booking_items` | ❌ | ❌ | — | **BUG — ghost table** |
| 3 | `bookings` | ✅ → `reservations` | — | reservations | Safe (when used via wrapped admin) |
| 4 | `categories` | ✅ → `taxonomy_nodes` | — | taxonomy_nodes | Safe |
| 5 | `claim_requests` | ✅ → `vendor_accounts` | — | vendor_accounts | Mixed — see §3b |
| 6 | `contracts` | ✅ → `service_tickets` | — | service_tickets | **BUG via unwrapped client** |
| 7 | `customers` | ❌ | ❌ | — | **BUG — ghost table** |
| 8 | `experience_listings` | ✅ → `inventory_items` | ✅ | inventory_items | **BUG via unwrapped client** |
| 9 | `experience_reservations` | ✅ → `reservations` | — | reservations | **BUG via unwrapped client** |
| 10 | `experience_slots` | ✅ → `availability_blocks` | — | availability_blocks | **BUG via unwrapped client** |
| 11 | `external_events` | ✅ → `inventory_items` | ✅ | inventory_items | **BUG via unwrapped client** |
| 12 | `filter_definitions` | ✅ → `taxonomy_nodes` | — | taxonomy_nodes | Safe |
| 13 | `filter_inheritance` | ✅ → `taxonomy_nodes` | — | taxonomy_nodes | Safe |
| 14 | `inquiries` | ✅ → `service_tickets` | — | service_tickets | **BUG via unwrapped client** |
| 15 | `leads` | ✅ → `service_tickets` | — | service_tickets | **BUG via unwrapped client** |
| 16 | `listings` | ✅ → `inventory_items` | ✅ | inventory_items | Safe (when used via wrapped admin) |
| 17 | `performances` | ❌ | ❌ | — | **BUG — ghost table** |
| 18 | `quotes` | ✅ → `service_tickets` | — | service_tickets | **BUG via unwrapped client** |
| 19 | `restaurant_availability_slots` | ✅ → `availability_blocks` | — | availability_blocks | **BUG via unwrapped client** |
| 20 | `restaurant_reservations` | ✅ → `reservations` | — | reservations | **BUG via unwrapped client** |
| 21 | `saved_searches` | ✅ → `saved_items` | ✅ | saved_items | Safe (when used via wrapped admin) |
| 22 | `seating_layouts` | ❌ | ❌ | — | **BUG — ghost table** |
| 23 | `seats` | ❌ | ❌ | — | **BUG — ghost table** |
| 24 | `shows` | ❌ | ❌ | — | **BUG — ghost table** |
| 25 | `ticket_queue` | ✅ → `service_tickets` | — | service_tickets | **BUG via unwrapped client** |
| 26 | `trip_itinerary_items` | ✅ → `reservations` | — | reservations | **BUG via unwrapped client** |
| 27 | `trips` | ✅ → `itinerary_sessions` | ✅ | itinerary_sessions | **BUG via unwrapped client** |
| 28 | `users` | ✅ → `user_profiles` | ✅ | user_profiles | **BUG via unwrapped client** |
| 29 | `vendor_analytics` | ✅ → `domain_events` | — | domain_events | Safe |
| 30 | `vendor_categories` | ✅ → `taxonomy_nodes` | — | taxonomy_nodes | Safe |
| 31 | `vendor_category_groups` | ✅ → `taxonomy_nodes` | — | taxonomy_nodes | Safe |
| 32 | `vendor_filter_answers` | ✅ → `vendor_accounts` | — | vendor_accounts | Safe |
| 33 | `vendor_gallery` | ✅ → `media_assets` | — | media_assets | Safe |
| 34 | `vendor_lodging_blocks` | ✅ → `availability_blocks` | — | availability_blocks | **BUG via unwrapped client** |
| 35 | `vendor_packages` | ✅ → `inventory_items` | ✅ | inventory_items | Safe |
| 36 | `vendor_portfolios` | ✅ → `media_assets` | — | media_assets | Safe |
| 37 | `vendor_profiles` | ✅ → `vendor_accounts` | ✅ | vendor_accounts | Safe (when used via wrapped admin) |
| 38 | `vendor_signups` | ✅ → `vendor_accounts` | — | vendor_accounts | Safe |
| 39 | `vendor_socials` | ✅ → `vendor_accounts` | — | vendor_accounts | Safe |
| 40 | `vendor_users` | ✅ → `vendor_staff` | — | vendor_staff | Safe (used via `supabaseAdmin`) |
| 41 | `vendors` | ✅ → `vendor_accounts` | ✅ | vendor_accounts | Mixed — see §3b |

---

## 3. Bugs

### 3a. Category A — Ghost tables (missing AND unmapped)

These six tables are referenced by API routes but do **not** exist in the live
Supabase database AND are not present in either compatibility `TABLE_MAP`.
Every call to `.from('<name>')` against them will return PostgREST's
`Could not find the table 'public.<name>' in the schema cache` error at runtime.

All six live in the **ticketing cluster** (`/api/ticketing/*`). They appear to
belong to a separate "EventSeats" schema (see `apps/consumer-web/src/lib/eventseats/supabase.ts`,
which declares a `Database` type with `organizations`, `venues`, `shows`,
`bookings` — none of which exist in Planviry's `public` schema).

| Ghost table | Routes that query it |
|---|---|
| `booking_items` | `ticketing/stripe/webhook/route.ts`, `ticketing/payments/create-session/route.ts`, `ticketing/booked-seats/[performanceId]/route.ts`, `ticketing/bookings/route.ts` |
| `customers` | `ticketing/customers/route.ts`, `ticketing/bookings/route.ts`, `ticketing/stripe/webhook/route.ts` |
| `performances` | `ticketing/performances/[id]/route.ts`, `ticketing/performances/route.ts`, `ticketing/payments/create-session/route.ts`, `ticketing/bookings/route.ts` |
| `seating_layouts` | `ticketing/seats-for-layout/[layoutId]/route.ts` |
| `seats` | `ticketing/seats-for-layout/[layoutId]/route.ts` |
| `shows` | `ticketing/performances/route.ts`, `ticketing/stripe/webhook/route.ts`, `ticketing/shows/[id]/route.ts`, `ticketing/shows/route.ts` |

**Compounding defect — broken imports in the ticketing cluster:**
Every `/api/ticketing/*` route imports its Supabase client from
`@/lib/supabase/admin`:

```ts
import { supabase } from '@/lib/supabase/admin'              // 9 routes
import { getServerSupabase } from '@/lib/supabase/admin'    // 2 routes
```

… but `apps/consumer-web/src/lib/supabase/admin.ts` exports **only**
`createAdminClient()` — there is no `supabase` named export and no
`getServerSupabase` named export there. The two symbols actually live in
`apps/consumer-web/src/lib/eventseats/supabase.ts`. So the entire ticketing
cluster is doubly broken: the routes fail to import the symbols they reference,
and even if the imports were fixed, the table names they query don't exist.
This cluster should be either (a) wired to its own dedicated event-seats
database, (b) remapped into Planviry's `inventory_items`/`reservations`/
`ticket_tiers` schema with column translation, or (c) deleted if it's dead
code from an earlier prototype.

### 3b. Category B — Mapped missing tables queried via an UNWRAPPED client

These routes import `createClient` from `@/lib/supabase/server` (or
`@/lib/supabase-marketplace/server`), which is the cookie-scoped SSR client.
That client is **NOT** wrapped by the `db-compat` Proxy (only the admin
clients are — see `apps/consumer-web/src/lib/supabase/admin.ts:5-14` and
`apps/consumer-web/src/lib/supabase.ts:21-30`). So when these routes call
`.from('vendors')`, `.from('trips')`, etc., PostgREST sees the literal old
table name, which doesn't exist — the redirect in `TABLE_MAP` never fires.

| Route | Tables queried via unwrapped client |
|---|---|
| `inquiries/route.ts` | `inquiries`, `vendors` |
| `vendor/profile/route.ts` | `vendors` |
| `contracts/[id]/sign/route.ts` | `contracts`, `vendors` |
| `quotes/route.ts` | `inquiries`, `vendors`, `quotes` |
| `leads/route.ts` | `leads` |
| `tickets/queue/[tierId]/route.ts` | `ticket_queue` |
| `trips/route.ts` | `trips` |
| `user/profile/route.ts` | `users` |
| `travel/availability/[vendorId]/route.ts` | `vendor_lodging_blocks` |
| `events/external/route.ts` | `external_events` |
| `experiences/[id]/book/route.ts` | `experience_listings`, `experience_slots`, `experience_reservations` |
| `restaurants/[id]/reserve/route.ts` | `restaurant_reservations`, `trip_itinerary_items` |
| `restaurants/[id]/slots/route.ts` | `restaurant_availability_slots` |
| `trips/[id]/items/route.ts` | `trips`, `trip_itinerary_items` |
| `claim-requests/route.ts` | `claim_requests` (line 168 — the GET handler) |

Each of these routes has a complete `TABLE_MAP` redirect available in
`db-compat.ts`, but the Proxy that performs the redirect is never installed
on the client they use. The fix is one-line per route: swap the import from
`@/lib/supabase/server` (or `@/lib/supabase-marketplace/server`) to
`@/lib/supabase/admin` (or `@/lib/supabase-marketplace/admin`) — but note
the admin client bypasses RLS, so each call site must also do its own
ownership check. Alternatively (and safer), the `db-compat` Proxy wrap should
be lifted into `@/lib/supabase/server` and `@/lib/supabase-marketplace/server`
so every server-side client gets the redirect for free.

### 3c. Not-a-bug but worth noting — `admin/leads/route.ts`

This route imports both the wrapped admin client and the unwrapped server
client. However, all `.from('leads')` and `.from('admin_lead_stats')` calls
go through the wrapped `admin` variable (lines 32, 53, 56, 57, 107, 124, 135,
168). The unwrapped `createClient()` is only used for auth/session retrieval.
Safe — included here only because a careless refactor could break it.

---

## 4. Recommendation — minimum fix surface

1. **Lift the `db-compat` Proxy wrap into the SSR server client factories**
   (`apps/consumer-web/src/lib/supabase/server.ts` and
   `apps/consumer-web/src/lib/supabase-marketplace/server.ts`). This is a
   ~5-line change in each file and instantly fixes all 15 Category B routes
   without touching any route file. RLS still applies because the client uses
   the anon key — only the table NAME is rewritten before the request leaves
   the client.

2. **Either delete the `/api/ticketing/*` cluster or wire it to a real
   schema.** Its imports are already broken (Category A compounding defect),
   so it cannot be serving traffic today. If it's prototype code, remove it;
   if it's intentional, create the 6 missing tables
   (`booking_items`, `customers`, `performances`, `seating_layouts`, `seats`,
   `shows`) in Planviry's database — OR map them into Planviry's existing
   `inventory_items` (for shows/performances) + `reservations` (for bookings)
   + `user_profiles` (for customers) + new `seating_layouts`/`seats`
   tables if seat-level inventory is required.

3. **Add a one-shot regression test** (this audit script, promoted to
   `scripts/audit-tables.ts`) to CI so the next time someone adds a new
   `.from('foo')` call against a non-existent table, the build fails.
