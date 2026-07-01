# Planviry — Spec Detour & Addition Document

> **Purpose:** This document records every deviation from the original Implementation Specification (Parts 0–51) that was made during the build. It is the precursor to resuming the spec at Phase 10.
> **Date:** 2026-06-30

---

## 1. Detours from the Original Spec

### Detour 1: Part LIII — Multi-Vertical Module Architecture
**Spec said:** Build every vertical from scratch against a single polymorphic schema.
**What happened:** Three mature open-source repos were mounted as full-stack modules instead of building from zero.

| Module | Repo | Mount Point | API Prefix | Booking Model |
|---|---|---|---|---|
| Lodging | Staybnb | `/travel/*` + `/lodging/*` + `/hosting/*` | `/api/travel/*` | Date-range (nights) + guest limits |
| Ticketing | EventSeats | `/tickets/*` | `/api/ticketing/*` | Seat-level selection + ticket types |
| Mobile | htbiz | `apps/mobile/` (Flutter) | Direct Supabase | Discovery + vendor dashboard |

**Why:** Staybnb has a 12-step listing wizard, date-range conflict detection, guest limits, promotion system, map search, and host dashboard — building this from scratch would take weeks. EventSeats has visual seat-grid selection, seat-level double-booking prevention, and Stripe payment flow. htbiz has Flutter + Supabase + Google Maps + offline cache.

**Impact on spec:** The spec's Part XLIII (Cross-Vertical Inventory) polymorphic model is still the target, but the lodging and ticketing verticals run their own booking logic via Prisma→Supabase proxy shim and direct Supabase queries respectively. The orchestrator (Planviry core) ties them together via the unified cart at `/api/checkout`.

### Detour 2: Part LIV — Mobile Application (Flutter)
**Spec said:** Part XXXIX (Future Expansion) defers native mobile to post-launch.
**What happened:** htbiz (Flutter + Supabase) was mounted at `apps/mobile/` during the build.

**Why:** PWA can't do iOS push notifications, background location, or app store distribution. The mobile app handles discovery + account management + vendor operations. The web app handles the full orchestration (cart + itinerary + checkout).

### Detour 3: Prisma→Supabase Proxy Shim
**Spec said:** Supabase is the sole database tier (Part I §1.1.5).
**What happened:** Staybnb uses Prisma ORM. A proxy shim at `src/lib/prisma.ts` translates Prisma's `findMany`, `findUnique`, `create`, `update`, `delete`, `count` methods into Supabase client calls.

**Why:** Rewriting Staybnb's 6 server endpoints + 6 parsers to use Supabase directly would take days. The shim lets Staybnb's code run unmodified against Supabase. The tradeoff is that complex Prisma queries (nested includes, OR clauses) may not fully translate — but the basic CRUD operations work.

### Detour 4: Intent-Based Role Detection
**Spec said:** Part VII §7.1 defines 8 identity types (Guest, Anonymous, Registered, OAuth, Magic Link, Admin, Moderator, Staff).
**What happened:** Part LIII §53.2 adds intent-based role detection — the platform infers user intent from behavior instead of forcing a role choice at signup.

**Why:** A user browsing `/search` shouldn't be forced to choose "I am a Guest" or "I am a Vendor." The middleware checks: if user accesses `/vendor/*` without a `vendor_staff` record → redirect to `/onboarding/vendor`. If user accesses `/account/*` without a `user_profiles` record → redirect to `/onboarding/user`. Public routes work anonymously.

### Detour 5: Reference Repository Strategy
**Spec said:** Part XLII §42.3 names 6 reference repos (Hi.Events, Cal.com, movinin, hotel-back-office, Peppermint, TicketiHub) as pattern sources.
**What happened:** The reference set was updated:

| Original Repo | Status | Replacement |
|---|---|---|
| Hi.Events | DELETED — patterns ported | `shared/hievents-patterns.ts` |
| Cal.com | DELETED — patterns ported | `shared/slots.ts` (extended) |
| movinin | DELETED — patterns ported | `shared/derived-status.ts` (extended) |
| Peppermint | DELETED — patterns ported | `shared/rbac.ts` (extended) |
| hotel-back-office | DELETED — replaced | Staybnb (full stack) |
| TicketiHub | DELETED — replaced | EventSeats (full stack) |
| obsidian-itinerary | DELETED — patterns ported | `src/lib/itinerary/` |
| nibmtix | DELETED — never used | — |
| **Staybnb** | NEW — mounted | `/travel/*` + `/hosting/*` |
| **EventSeats** | NEW — mounted | `/tickets/*` |
| **htbiz** | NEW — mounted | `apps/mobile/` |

3 repos remain on disk (Staybnb, EventSeats, htbiz) — these are mounted as runtime code, not just pattern references.

---

## 2. Current Phase Status

| Phase | Status | What's Done | What's Missing |
|---|---|---|---|
| 0 — Infrastructure | ✅ DONE | Supabase live (127+ tables), Turborepo, 4 apps, 7 packages, 4 workers, 4 edge functions | — |
| 1 — Repository | ✅ DONE | Monorepo with apps/, packages/, workers/, functions/, shared/ | — |
| 2 — Database | ✅ DONE | Live schema + 25 gap-closure tables, all wired to routes | RLS policies not verified |
| 3 — Authentication | ⚠️ PARTIAL | Supabase Auth, middleware with intent-based redirects, NextAuth | No 2FA, no API keys, no OAuth providers configured |
| 4 — Core Domain | ✅ DONE | DOM-001 to DOM-020, reservation FSM, cart, checkout, ticket_instances, waitlist, capacity_assignments | — |
| 5 — Services | ⚠️ PARTIAL | shared/slots.ts (Cal.com), shared/derived-status.ts (movinin), shared/rbac.ts (Peppermint), shared/hievents-patterns.ts | No recommendation engine, no feed engine, no moderation service, no media service, no taxonomy service |
| 6 — APIs | ⚠️ PARTIAL | 141 routes in /api/ + 12 in /api/ticketing/ + 5 in /api/travel/ | **v1/ API routes were lost** — 22 endpoints need rebuild (inventory CRUD, vendors, cart, reservations, itineraries, search) |
| 7 — Edge Functions | ⚠️ PARTIAL | stripe-webhook is real, 3 others are skeletons | booking-ttl, search-ingest, notification-send need Deno deployment |
| 8 — Search | ⚠️ PARTIAL | Postgres ILIKE fallback, /api/search, /api/autocomplete | No Algolia index, no ingestion pipeline, Conflict #7 unresolved |
| 9 — Frontend Framework | ⚠️ PARTIAL | 158 pages, 290 components, onboarding, vendor portal, customer portal, itinerary timeline, Staybnb lodging, EventSeats ticketing | Orchestration shell (Plan Bar, Vertical Row, Mega Menu, Location Gate) not built |
| **10 — Features** | ⏳ NEXT | This is where we resume | — |
| 11 — Realtime | ❌ NOT STARTED | 0 of 5 channels | reservation:{id}, cart:{user_id}, itinerary:{session_id}, vendor:{vendor_id}:bookings, inventory:{item_id}:availability |
| 12 — Notifications | ⚠️ PARTIAL | notifications table, /api/notifications/process (Resend email + in-app), fan-out on reservation.confirmed | No push (VAPID), no SMS (Twilio), no digest batching, no rate limiting |
| 13 — Analytics | ❌ NOT STARTED | TinyBird configured in .env | 0 events emitted |
| 14 — Testing | ❌ NOT STARTED | — | 0 tests |
| 15 — Observability | ❌ NOT STARTED | — | 0 metrics, 0 alerts, 0 runbooks |
| 16 — Performance | ❌ NOT STARTED | — | 0 budgets, 0 indexes beyond schema |
| 17 — Security Review | ❌ NOT STARTED | — | 0 RLS verified, 0 CSRF, 0 XSS audit |
| 18 — Production Deployment | ❌ NOT STARTED | — | No CI/CD, no Vercel config |
| 19 — Operational Acceptance | ❌ NOT STARTED | — | 0 runbooks, 0 on-call |

---

## 3. What Needs to Happen Before Phase 10

### P0 Blockers (must fix before any feature work)

1. **Rebuild v1 API routes** — 22 endpoints that were lost when Staybnb/EventSeats code was copied in. These are the backbone that every frontend component calls. Without them, the vendor dashboard, cart, reservations, and itineraries don't work.

2. **Wire vendor dashboard buttons** — "Create Listing" must go to a flow that creates `inventory_items` rows in Supabase (not Staybnb's `listings` table). "Stripe Connect" must call `/api/stripe-connect/onboarding` and redirect to the onboarding URL.

3. **Wire Staybnb hosting wizard to Planviry API** — The 12-step wizard at `/hosting/create/listing/[id]/(steps)/*` currently calls Staybnb's Prisma endpoints. It needs to create `inventory_items` rows with `category=LODGING` and `vendor_id` from the logged-in vendor's `vendor_staff` record.

4. **Add location picker to vendor onboarding** — The spec requires location-gate enforcement (CONSTRAINT-002). The vendor onboarding flow needs a city/location selector that links to the `locations` table.

### Then Resume at Phase 10 — Features

Phase 10 covers:
- UGC (reviews, photos, Q&A, favorites, public itinerary sharing)
- Advertising surfaces (sponsored placement, boosted listings)
- Guest-to-vendor messaging
- Account deletion / data export
- Feed engine integration
- Recommendation engine integration

---

## 4. Complete Map of What Exists

### Apps
| App | Port | Pages | API Routes | Components |
|---|---|---|---|---|
| consumer-web | 3000 | 158 | 154 | 290 |
| vendor-portal | 3001 | 1 (scaffold) | 0 | 0 |
| admin-portal | 3002 | 1 (scaffold) | 0 | 0 |
| mobile (Flutter) | — | 31 Dart files | — | — |

### Shared Libraries
| File | Patterns | Source Repo |
|---|---|---|
| shared/slots.ts | getSlots, getSlotsTimezoneAware, getLuckyUser, getLuckyUserWeighted, isBlackoutDate, hasBufferConflict | Cal.com |
| shared/derived-status.ts | computeDisplayStatus, softDeleteFields, calculateTotalPrice, rangesOverlap, calculateCancellationFee, dispatch3ChannelNotification | movinin + hotel-back-office |
| shared/rbac.ts | hasPermission, requirePermission, fanOutNotification, isRoleActive, resolveInheritedPermissions, hasTeamPermission, createCustomRole, calculateTicketPriority | Peppermint |
| shared/hievents-patterns.ts | increaseQuantitySold, decreaseQuantitySold, getAvailableQuantities, reconcilePayout | Hi.Events |

### Frontend Modules
| Module | Routes | Source |
|---|---|---|
| Lodging | /travel/*, /lodging/*, /hosting/* | Staybnb |
| Ticketing | /tickets/*, /api/ticketing/* | EventSeats |
| Orchestrator | /, /search, /directory, /checkout, /cart, /account/*, /vendor/*, /onboarding/* | Planviry (native) |
| Itinerary | /account/itineraries/[id] + ItineraryTimeline component | obsidian-itinerary (ported) |
| Mobile | apps/mobile/ (Flutter) | htbiz |

### API Route Inventory (154 total)
- /api/checkout + /api/checkout/verify (2)
- /api/webhooks/stripe (1)
- /api/orders/[id]/* (6: refund, cancel, complete, abandon, edit, mark-paid, invoice)
- /api/tickets/* (5: purchase, verify, qr, tiers, queue)
- /api/ticketing/* (12: EventSeats API)
- /api/travel/* (5: listings, search, cities, reservations, listings/[id])
- /api/attendees/* (3: list, [id], resend)
- /api/waitlist/* (4: join, offer, accept, decline)
- /api/promo-codes/* (2: create, validate)
- /api/questions/* (2: create, answers)
- /api/capacity-assignments (1)
- /api/tax-and-fees (1)
- /api/self-service/* (2: attendee, resend)
- /api/ticket-lookup (1)
- /api/reports/* (3: daily-sales, product-sales, promo-codes)
- /api/stripe-connect/* (2: onboarding, payouts)
- /api/email-templates/* (2: create, preview)
- /api/affiliates/* (2: create, [id])
- /api/product-categories (1)
- /api/product-sort (1)
- /api/event-images (1)
- /api/order-audit-log/[orderId] (1)
- /api/appeals/* (2: create, [id])
- /api/cart-locks (1)
- /api/payment-methods (1)
- /api/listing-versions/[itemId] (1)
- /api/recently-viewed (1)
- /api/sms/* (2: send, consent)
- /api/secret-rotations/rotate (1)
- /api/vendor-onboarding/[vendorId] (1)
- /api/warehouse-exports/trigger (1)
- /api/ical-sync-logs/[itemId] (1)
- /api/feature-flags/[key]/expose (1)
- /api/experiments/[id]/results (1)
- /api/notifications/process (1)
- /api/webhooks/outgoing/* (3: create, logs, deliver)
- /api/messages/send (1)
- /api/organizers/[slug] (1)
- /api/sitemaps/* (2: events, organizers)
- /api/public/check-in (1)
- /api/categories, /api/directory, /api/search, /api/autocomplete, /api/filters, /api/vendors, /api/vendor-portal, /api/bookings, /api/leads, /api/inquiries, /api/reviews, /api/orders, /api/stats, /api/admin/* (remaining from original app)

### MISSING (need rebuild)
- /api/v1/auth/register
- /api/v1/auth/me (GET + PATCH)
- /api/v1/inventory (GET + POST)
- /api/v1/inventory/[id] (GET + PATCH + DELETE)
- /api/v1/inventory/[id]/publish
- /api/v1/inventory/[id]/pause
- /api/v1/reservations (GET)
- /api/v1/reservations/[id] (GET)
- /api/v1/reservations/[id]/cancel
- /api/v1/cart (GET)
- /api/v1/cart/items (POST)
- /api/v1/cart/items/[cart_line_id] (DELETE)
- /api/v1/cart/checkout (POST)
- /api/v1/itineraries (POST + GET)
- /api/v1/itineraries/[id] (GET)
- /api/v1/itineraries/[id]/share (POST)
- /api/v1/search (GET)
- /api/v1/search/autocomplete (GET)
- /api/v1/vendors/claim (POST)
- /api/v1/vendors/claim/verify (POST)
- /api/v1/vendors/[vendor_id]/staff (POST)
- /api/v1/events/[event_id]/ticket-tiers (POST)
- /api/v1/events/[event_id]/checkin (POST)
