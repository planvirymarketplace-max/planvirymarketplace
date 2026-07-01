# Planviry — Build Status Update (2026-06-30)

## What's Done

### Infrastructure
- Turborepo monorepo: 4 apps (consumer-web, vendor-portal, admin-portal, mobile)
- 7 shared packages (config, types, db, ui, search, analytics, email-templates)
- 4 background workers (ttl-sweep, search-sync, notification-digest, external-sync)
- 4 Supabase edge functions (stripe-webhook, booking-ttl, search-ingest, notification-send)
- Live Supabase project (gzbtmvzidmrnbcgyonlu) with 127+ tables
- GitHub repo: https://github.com/planvirymarketplace-max/planvirymarket

### Reference Repos — All Cloned + Adapted
| Repo | Adaptation | Status |
|---|---|---|
| Hi.Events | 141 API routes (ticketing, attendees, check-in, waitlist, promo codes, questions, capacity, reports, etc.) | DONE |
| movinin | shared/derived-status.ts (FSM, calculateTotalPrice, rangesOverlap, soft delete) + TTL worker | DONE |
| Cal.com | shared/slots.ts (getSlots, getLuckyUser) + 2 slot API routes | DONE |
| Peppermint | shared/rbac.ts (30+ permissions, 6 roles, fanOutNotification) | DONE |
| Staybnb | /travel/* + /lodging/* + /hosting/* (12-step listing wizard, map search, booking calendar, guest limits, promotions, cancellation policy, Prisma→Supabase shim) | DONE |
| EventSeats | /tickets/* + /api/ticketing/* (seat-grid, booking, QR codes, admin, 12 API routes) | DONE |
| htbiz | apps/mobile/ (Flutter mobile: search, map, business detail, reviews, auth, owner dashboard, analytics, offline cache) | MOUNTED |
| hotel-back-office | DROPPED — replaced by Staybnb | N/A |
| TicketiHub | DROPPED — replaced by EventSeats | N/A |

### Web App (consumer-web) — 158 pages, 154 API routes, 290 components
- Homepage, search, directory, events, food-drink, live-shows, party, spaces, browse
- /travel/* — lodging search, listing detail, checkout (Staybnb)
- /tickets/* — show listing, seat selection, booking confirmation, admin (EventSeats)
- /hosting/* — 12-step listing creation wizard, host dashboard, reservations (Staybnb)
- /onboarding — unified role chooser (Guest or Vendor)
- /onboarding/vendor — claim existing listing OR create new vendor account
- /onboarding/user — user profile setup
- /vendor/* — vendor portal (dashboard, PMS, bookings, tickets, events, payouts, analytics, onboarding)
- /account/* — customer portal (dashboard, profile, reservations, itineraries, payments, saved, notifications, support)
- /check-in — QR code scanner page
- /checkout — checkout flow with Stripe redirect + verification polling

### API Routes (154 total)
- Checkout: orders, reservation_line_items, checkout_sessions, idempotency_keys, tax_lines, capacity_assignments (atomic), discounts
- Stripe: webhook (checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed, charge.refunded, account.updated), onboarding, payouts
- Reservations: create, confirm, cancel, refund, complete, abandon, edit, mark-paid
- Tickets: purchase, verify (HMAC QR), qr generation, tiers listing
- Attendees: list, create, edit, cancel, resend
- Waitlist: join, offer, accept, decline
- Promo codes: create, validate, apply at checkout
- Questions: create, answer, store at checkout
- Capacity assignments: create, list, enforced at checkout (atomic)
- Tax & fees: config, calculated at checkout
- Check-in lists: create, update, delete, public check-in (no auth)
- Reports: daily-sales, product-sales, promo-codes
- Stripe Connect: Express onboarding, payout reconciliation
- Notifications: process (Resend email, in-app, push), fan-out on reservation.confirmed
- Email templates: create, preview with token substitution
- Affiliates, appeals, ical-sync-logs, audit_log, cart_locks, discounts, payment_methods, recently_viewed, listing_versions, search_logs, secret_rotations, sms_messages, sms_consents, vendor_onboarding_steps, warehouse_exports, webhook_deliveries, feature_flag_exposures, experiment_results

### Database — 25 gap-closure tables wired
checkout_sessions, idempotency_keys, orders, reservation_line_items, refunds, vendor_payouts, webhook_deliveries, experiment_results, feature_flag_exposures, sms_messages, sms_consents, warehouse_exports, secret_rotations, ical_sync_logs, appeals, audit_log, cart_locks, discounts, tax_lines, waitlist_entries, payment_methods, vendor_onboarding_steps, search_logs, recently_viewed_items, listing_versions

### Middleware — intent-based role detection
- /vendor/* without vendor_staff → redirect to /onboarding/vendor
- /account/* without user_profiles → redirect to /onboarding/user
- /checkout requires auth (BR-C-005)
- /admin requires auth
- Public routes (/, /search, /directory, /travel/*, /tickets/whats-on) — no auth needed

### Security Fixes
- Checkout race condition: atomic UPDATE with WHERE clause (BR-R-004/BR-C-004)
- Stripe webhook: signature verification + payment_intent.succeeded fallback
- Middleware: server-side auth enforcement (not client-only)

---

## What's NOT Done (Gaps)

### P0 — Blocking Production

1. **v1 API routes were overwritten** — The `/api/v1/*` routes I built earlier (inventory CRUD, reservations, cart, itineraries, search, vendors, events) were inside `apps/consumer-web/src/app/api/v1/` but that directory no longer exists. When the Staybnb/EventSeats code was copied in, it may have overwritten the v1 directory. Need to rebuild.

2. **Staybnb hosting wizard not wired to Planviry API** — The 12-step listing wizard exists (`/hosting/create/listing/[id]/(steps)/*`) but it calls Staybnb's Prisma endpoints, not Planviry's API. It needs to be rewired to create `inventory_items` rows in Supabase.

3. **No vendor UI for entering Stripe keys** — `/api/stripe-connect/onboarding` creates a Stripe Express account and returns an onboarding URL, but there's no button on the vendor dashboard that calls it. The dashboard has a link but it points to the wrong place.

4. **No global city/location selection** — The onboarding/vendor page doesn't ask for the vendor's city. The spec requires location-gate enforcement (CONSTRAINT-002) but there's no location picker in the vendor flow.

5. **Vendor can't CRUD listings from the dashboard** — `/vendor/dashboard` shows stats but has no "Create Listing" button that works. The link points to `/hosting/create` which uses the Staybnb wizard (Prisma) not the Planviry API.

### P1 — Needed for Launch

6. **Realtime channels** — 0 of 5 channels implemented (reservation:{id}, cart:{user_id}, itinerary:{session_id}, vendor:{vendor_id}:bookings, inventory:{item_id}:availability)

7. **Algolia search** — No Algolia index created. Search uses Postgres ILIKE only.

8. **Push notifications** — Table exists, no VAPID keys, no web push subscription flow.

9. **SMS** — Table exists, no Twilio integration.

10. **Analytics** — TinyBird configured but 0 events emitted.

11. **Testing** — 0 tests.

12. **CI/CD** — No GitHub Actions, no deployment pipeline.

### P2 — Post-Launch

13. Observability (metrics, dashboards, alerts, runbooks)
14. Performance budgets
15. RLS policy verification
16. AI agent layer (itinerary constraint solver, vendor AI assistant)
17. Advertising surfaces
18. UGC (reviews submission UI, photo uploads, Q&A)
19. Feed engine
20. Recommendation engine

---

## Next Steps (Priority Order)

1. Rebuild v1 API routes (inventory CRUD, vendors, cart, reservations, itineraries, search)
2. Wire Staybnb hosting wizard to create inventory_items via Planviry API
3. Wire vendor dashboard "Create Listing" + "Stripe Connect" buttons
4. Add location/city picker to vendor onboarding
5. Implement realtime channels
6. Set up Algolia index + ingestion
7. Add analytics event emission
8. Write tests
9. Set up CI/CD
