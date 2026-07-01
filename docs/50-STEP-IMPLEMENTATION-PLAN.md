# Planviry — 50-Step Implementation Plan to Production

> Based on: spec audit, repo audit, table audit, RLS audit, state management audit, user control inventory.
> Goal: One coherent system where a vendor lists multiple verticals from one portal, a customer books across verticals in one cart, and the itinerary timeline shows everything.

---

## Phase 1: Database Schema (Steps 1-10)

### Step 1: Fix RLS infinite recursion on vendor_staff + itinerary_sessions
- Extract membership check into `fn_user_vendor_ids()` SECURITY DEFINER function
- Replace self-referential policies with calls to this function
- Affects: vendor_accounts, inventory_items, reservations, payments, ticket_tiers, check_ins, ticket_instances, check_in_lists, capacity_assignments, itinerary_sessions

### Step 2: Enable RLS on unprotected tables
- `orders` — contains payment data, CRITICAL
- `discounts` — contains promo codes
- `waitlist_entries` — contains user PII
- Add policies: user can read own orders, vendor can read orders for their items, admin can read all

### Step 3: Create EventSeats tables in Supabase
- `organizations` (id, name, slug, email, stripe_account_id)
- `venues` (id, name, slug, address, city, capacity, organization_id)
- `seating_layouts` (id, name, rows, columns, layout_data JSONB, venue_id)
- `seats` (id, row, number, section, is_accessible, is_wheelchair_space, seating_layout_id)
- `shows` (id, title, slug, description, image_url, adult_price, child_price, concession_price, status, organization_id, venue_id, seating_layout_id)
- `performances` (id, date_time, is_matinee, capacity, show_id)
- `customers` (id, first_name, last_name, email, phone, email_opt_in, sms_opt_in)
- `bookings` (id, booking_number, total_amount, booking_fee, status, stripe_payment_intent_id, paid_at, customer_id, show_id, performance_id, checked_in_at, qr_code_data)
- `booking_items` (id, ticket_type, price, booking_id, seat_id)
- `settings` (id, organization_id, type, key, value)

### Step 4: Create missing vendor portal tables
- `vendor_analytics` (id, vendor_id, date, views, inquiries, conversions, revenue_cents)
- `vendor_packages` (id, vendor_id, name, description, price_cents, includes[])
- `vendor_portfolios` (id, vendor_id, title, description, image_url, sort_order)
- `vendor_gallery` (id, vendor_id, url, caption, sort_order)
- `vendor_socials` (id, vendor_id, platform, url)
- `vendor_signups` (id, vendor_id, step, status, data JSONB)

### Step 5: Create missing experience/restaurant tables
- `experience_listings` (id, vendor_id, title, description, duration_minutes, price_cents, max_participants, location_id)
- `experience_slots` (id, experience_id, start_time, end_time, capacity, reserved, is_available)
- `experience_reservations` (id, experience_slot_id, user_id, quantity, status, total_price_cents)
- `restaurant_availability_slots` (id, restaurant_id, date, time_slot, capacity, reserved)
- `restaurant_reservations` (id, restaurant_id, user_id, date, time_slot, party_size, status)

### Step 6: Create missing taxonomy/category tables
- `vendor_categories` (id, name, slug, parent_id, sort_order)
- `vendor_category_groups` (id, name, slug, sort_order)
- `vendor_category_assignments` (id, vendor_id, category_id)
- `vendor_filter_answers` (id, vendor_id, filter_key, filter_value)
- `vendor_lodging_blocks` (id, vendor_id, start_date, end_date, reason)
- `filter_definitions` (id, name, key, type, options JSONB)
- `filter_inheritance` (id, child_key, parent_key, excludes_keys[])

### Step 7: Create missing moderation/support tables
- `events` (id, title, slug, description, start_date, end_date, venue_id, organizer_id, status, capacity)
- `promotions` (id, code, description, discount_type, discount_value, max_uses, uses, expires_at, event_id)
- `promo_codes` (id, code, discount_type, discount_value, max_allowed_usages, applicable_product_ids[], expiry_date, event_id)

### Step 8: Add pricing_model column to inventory_items
- `ALTER TABLE inventory_items ADD COLUMN pricing_model TEXT DEFAULT 'FLAT' CHECK (pricing_model IN ('FLAT', 'NIGHTLY', 'PER_PERSON', 'PER_SEAT', 'PER_SLOT', 'HOURLY'))`
- Update existing rows: LODGING → NIGHTLY, EVENT_TICKET → PER_SEAT, DINING → PER_PERSON, VENDOR_SERVICE → FLAT

### Step 9: Fix rpc_create_pending_reservation
- Remove `SET LOCAL transaction_isolation = 'serializable'` line
- The Supabase pooler already handles transaction isolation
- Test the RPC end-to-end

### Step 10: Lift db-compat proxy to supabase/server.ts
- Wrap the cookie-scoped server client with the same table-name redirect proxy
- This fixes 15 routes that currently query mapped-but-missing table names

---

## Phase 2: Vendor Portal — One Portal, All Verticals (Steps 11-20)

### Step 11: Build category chooser at /vendor/create-listing
- Replace the current single form with a 6-option grid:
  - "List a property" → /hosting/create (Staybnb wizard, LODGING)
  - "List event tickets" → /tickets/admin/shows (EventSeats, EVENT_TICKET)
  - "List a venue" → /vendor/create-listing/venue (VENUE_RENTAL)
  - "List a service" → /vendor/create-listing/service (VENDOR_SERVICE)
  - "List a dining experience" → /vendor/create-listing/dining (DINING)
  - "List transport" → /vendor/create-listing/transport (TRANSPORT)

### Step 12: Build venue creation form
- /vendor/create-listing/venue — form with: title, description, capacity, hourly_rate, min_hours, amenities, blackout_dates, images
- Creates inventory_items with category=VENUE_RENTAL, pricing_model=HOURLY

### Step 13: Build service creation form
- /vendor/create-listing/service — form with: title, description, service_type (DJ, Photographer, Florist, etc.), flat_rate, availability_slots, buffer_before, buffer_after
- Creates inventory_items with category=VENDOR_SERVICE, pricing_model=FLAT

### Step 14: Build dining creation form
- /vendor/create-listing/dining — form with: title, cuisine_type, price_per_person, seat_capacity, time_slots, reservation_window_days
- Creates inventory_items with category=DINING, pricing_model=PER_PERSON

### Step 15: Wire /vendor/listings to show ALL categories
- Query inventory_items WHERE vendor_id = current vendor
- Show category badge (LODGING, EVENT_TICKET, VENDOR_SERVICE, etc.) on each row
- Sort/filter by category

### Step 16: Wire /vendor/bookings to show ALL reservation types
- Query reservations WHERE vendor_id = current vendor
- Show each reservation with: item title, category badge, customer name, date, status, price
- Filter by category, status, date range

### Step 17: Wire /vendor/payouts to real data
- Query vendor_payouts WHERE vendor_id = current vendor
- Show: payout amount, platform fee, net payout, status, date
- Link to Stripe Connect onboarding if not set up

### Step 18: Build PMS room status board at /vendor/pms
- For vendors with LODGING category items only
- Show grid of rooms with status: Clean / Dirty / Inspected / Out-of-Order
- Allow status changes

### Step 19: Build service ticket triage queue at /vendor/tickets
- Query service_tickets WHERE vendor_id = current vendor
- Show: ticket title, priority (calculated via calculateTicketPriority), status, assigned_to, created_at
- Allow: assign, change priority, change status, add note

### Step 20: Build vendor analytics dashboard at /vendor/analytics
- Query vendor_analytics + reservations + domain_events
- Show: revenue over time, reservation count, cancel reasons, occupancy rate, top sources
- Charts using recharts (already installed)

---

## Phase 3: Customer Portal — One Itinerary, All Verticals (Steps 21-28)

### Step 21: Wire /account/reservations to real data
- Already done by AUDIT-3 agent — verify it works
- Should show ALL reservation types (lodging + tickets + dining + services)

### Step 22: Wire /account/itineraries to real data
- Already done by AUDIT-3 agent — verify it works
- Should show itinerary_sessions with reservation counts + total cost

### Step 23: Wire /account/itineraries/[id] with ItineraryTimeline
- Already done — verify the FullCalendar timeline renders with real reservation data
- Should show all categories color-coded on the timeline

### Step 24: Wire /account/reservations/[id] detail page
- Show vertical-specific info based on category:
  - LODGING: check-in/check-out dates, nights, guest count, property address
  - EVENT_TICKET: seat numbers, ticket type, performance time, venue
  - DINING: reservation time, party size, restaurant address
  - VENDOR_SERVICE: service date, time slot, duration
- Invoice download button → /api/orders/[id]/invoice (PDF)
- Cancel button → /api/orders/[id]/cancel

### Step 25: Wire /account/payments to real data
- Query payment_methods WHERE user_id = current user
- Show saved cards with: label, last 4, is_default
- "Add payment method" button → Stripe SetupIntent

### Step 26: Wire /account/saved to real data
- Query saved_items WHERE user_id = current user
- Show favorited inventory_items with: title, image, price, category badge
- "Remove" button

### Step 27: Wire /account/profile to real data
- Query user_profiles WHERE id = current user
- Editable form: display_name, email, phone, avatar_url, locale, notification_prefs
- Save → PATCH /api/v1/auth/me

### Step 28: Make checkout redirect to itinerary after success
- After /api/checkout/verify returns CONFIRMED, redirect to /account/itineraries/[id]
- If no itinerary session, create one and attach the reservations

---

## Phase 4: Surface Routing — 9 Surfaces → Category Filters (Steps 29-35)

### Step 29: Map 9 surfaces to inventory_items.category filters
- /services → category = VENDOR_SERVICE
- /plan → all categories (occasion-based discovery)
- /things-to-do → category = EXPERIENCE
- /food-drink → category = DINING
- /live-shows → category = EVENT_TICKET
- /travel → category = LODGING
- /party → category IN (VENUE_RENTAL, VENDOR_SERVICE)
- /spaces → category = VENUE_RENTAL
- /vendors → all categories (raw marketplace)

### Step 30: Wire subcategory pills per surface
- Travel: property types (House, Villa, Cabin, Apartment, Hotel)
- Live-shows: show types (Concert, Sports, Theater, Comedy)
- Food-drink: cuisine types (Italian, Japanese, Mexican, French, American)
- Spaces: venue types (Loft, Mansion, Rooftop, Garden, Hall)
- Vendors: service types (DJ, Photographer, Florist, Catering, Planner, Limo)

### Step 31: Wire filter mega menu per surface
- Travel: amenities, guest limits, check-in time, price range
- Live-shows: ticket price, age restriction, seat section
- Food-drink: price range, dietary restrictions, party size
- Spaces: capacity, hours, amenities, outside alcohol
- Vendors: price, availability, rating, instant booking

### Step 32: Reconcile duplicate [slug] routes
- Keep /[slug] as the primary landing page route
- Redirect /v/[slug], /s/[slug], /browse/[slug] → /[slug] (301)
- Redirect /vendors/[slug] → /vendor/[slug]
- Redirect /venue/[slug] → /spaces/[slug]

### Step 33: Merge two ticketing systems
- Keep /tickets/whats-on (EventSeats) as the primary ticket listing
- Redirect /tickets/sports/* → /tickets/whats-on?type=sports
- Redirect /tickets/cities/* → /tickets/whats-on?city=...

### Step 34: Merge checkout flows
- Keep /api/checkout as the unified checkout
- /lodging/checkout/[listingId] → redirect to /checkout with the item pre-added
- /api/ticketing/payments/create-session → keep for standalone ticket purchases, but also support cart checkout

### Step 35: Build unified cart display
- CartDrawer shows items from ALL verticals with category badge
- Each item shows: title, category icon, date/time, price, quantity
- Subtotal + tax + discount = total
- One "Checkout" button → /api/checkout

---

## Phase 5: Pricing + Availability Adapters (Steps 36-42)

### Step 36: Build pricing adapter
- Function: `calculatePrice(item, reservation_params) → price_cents`
- NIGHTLY: base_price × nights (from Staybnb calculateTotalPrice)
- PER_SEAT: sum(selected seat prices)
- PER_PERSON: base_price × guest_count
- FLAT: base_price
- PER_SLOT: base_price × number_of_slots
- HOURLY: hourly_rate × hours

### Step 37: Build availability adapter for LODGING
- Date-range overlap check (from Staybnb pattern)
- `SELECT * FROM reservations WHERE item_id = $1 AND status IN ('PENDING','CONFIRMED') AND starts_at < $end AND ends_at > $start`

### Step 38: Build availability adapter for EVENT_TICKET
- Seat availability check (from EventSeats pattern)
- Query booking_items for booked seat IDs
- Return available seats from seating_layout

### Step 39: Build availability adapter for DINING
- Time-slot capacity check
- Query restaurant_availability_slots WHERE date = $date AND time_slot = $time AND reserved < capacity

### Step 40: Build availability adapter for VENUE_RENTAL
- Date + time-slot capacity check
- Combine lodging date overlap + dining slot capacity

### Step 41: Build availability adapter for VENDOR_SERVICE
- Time-slot availability (from Cal.com getSlots)
- Uses shared/slots.ts with blackout dates, buffers, timezone

### Step 42: Wire availability adapters into checkout
- /api/checkout calls the appropriate adapter based on item.category
- If any item fails availability → abort entire checkout (BR-C-004)

---

## Phase 6: Reconciliation + Polish (Steps 43-50)

### Step 43: Mount QueryProvider in root layout
- Wrap app in <QueryProvider> so TanStack Query works everywhere
- Mount in src/app/layout.tsx

### Step 44: Fix 18 lint errors
- Run `bun run lint` and fix each error

### Step 45: Fix ticketing route imports
- Change `import { supabase } from "@/lib/supabase/admin"` to `import { createAdminClient } from "@/lib/supabase/admin"` in all /api/ticketing/* routes
- Or create a re-export in eventseats/supabase.ts

### Step 46: Resolve state management conflicts
- Remove dead TripItineraryContext (not mounted, references non-existent table)
- Remove dead useListingForm Zustand store (wizard uses react-hook-form now)
- Consolidate cart state: keep CartContext as the single source of truth
- Consolidate location state: keep LocationProvider, remove useLocationStore

### Step 47: Write Part V (State Machines) spec
- Document the reservation FSM (6 states, transitions, guards)
- Document the inventory FSM (DRAFT → PUBLISHED → PAUSED → ARCHIVED)
- Document the vendor FSM (SEEDED → CLAIMED → ONBOARDED → ACTIVE → SUSPENDED)

### Step 48: Write Part VI (Data Layer) spec
- Document all tables, columns, indexes, constraints, RLS policies
- Document the pricing_model enum and availability_config JSONB schema
- Document the vertical_specific JSONB schema per category

### Step 49: Write critical tests
- Test: checkout race condition (two concurrent checkouts for last item)
- Test: reservation state transitions (PENDING → CONFIRMED → COMPLETED)
- Test: RLS policies (vendor can't see other vendor's data)
- Test: cart atomicity (BR-C-004: partial checkout fails entirely)
- Test: itinerary conflict detection

### Step 50: Deploy + smoke test
- Deploy to Vercel
- Run smoke tests: register → browse → add to cart → checkout → view itinerary
- Verify all 9 surfaces load
- Verify vendor portal: create listing → publish → view in marketplace
- Verify customer portal: reservations list → itinerary timeline → invoice download
