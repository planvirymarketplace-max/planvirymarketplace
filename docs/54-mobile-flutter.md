# Part LIV — Mobile Application (Flutter)

> **Status:** SCAFFOLDED — mounted at `apps/mobile/`, adapted from htbiz (Flutter + Supabase).
> **Date:** 2026-06-30
> **Source:** https://github.com/AlexandreC1/htbiz (MIT license, Flutter + Supabase business directory)

## 54.1 Purpose

The web app (consumer-web) handles the full orchestration: cart, itinerary, checkout, multi-vertical booking. The mobile app handles discovery + account management + vendor operations on native iOS and Android. Both share the same Supabase backend — same auth, same database, same real-time subscriptions.

## 54.2 Why Flutter

- Same Supabase backend — no API translation layer
- Native iOS + Android from one codebase
- App store distribution (credibility + discoverability)
- Background location, native camera, iOS push notifications (PWA can't do these reliably)
- Offline cache (htbiz already has CacheService with SharedPreferences)

## 54.3 Adaptation Plan (htbiz → Planviry Mobile)

### Phase 1: Remap (1-2 days)
- Rename `businesses` → `vendor_accounts` + `inventory_items` in all Dart models
- Rename `reviews` → `reviews` (same table, different column names)
- Point `supabase_config.dart` at `gzbtmvzidmrnbcgyonlu`
- Update category enum to Planviry's inventory_category enum
- Replace Google Maps Haiti center with user's current location

### Phase 2: Add booking screens (3-5 days)
- Cart screen (reads from same `carts` + `cart_line_items` tables)
- Checkout screen (calls `/api/checkout` via HTTP, or Supabase directly)
- Reservations list (reads from `reservations` table)
- Itinerary view (reads from `itinerary_sessions` + `reservations`)
- QR code scanner (native camera → calls `/api/public/check-in`)

### Phase 3: Vendor portal mobile (3-5 days)
- Vendor dashboard (reads from `inventory_items` + `reservations` + `vendor_payouts`)
- Booking calendar (reads from `availability_blocks`)
- Check-in scanner (native camera, calls `/api/public/check-in`)
- Payouts view (reads from `vendor_payouts` + Stripe API)

### Phase 4: Polish + Ship (2-3 days)
- App icons, splash screen, theme matching Planviry brand (#F47245 primary)
- Push notifications (Supabase Realtime → local notifications)
- Deep linking (planviry.com/listing/[id] → opens in app)
- App store screenshots + submission

## 54.4 What htbiz Already Has (no rebuild needed)

| Feature | htbiz File | Planviry Mapping |
|---|---|---|
| Business search + filter | `screens/home/home_screen.dart` | Browse `inventory_items` by category |
| Map view | `screens/map/map_screen.dart` | Map of `inventory_items` with lat/lng |
| Business detail | `screens/business/business_detail_screen.dart` | `vendor_accounts` + `inventory_items` + `reviews` |
| Add business | `screens/business/add_business_screen.dart` | Create `vendor_accounts` + `inventory_items` |
| Owner dashboard | `screens/business/owner_dashboard_screen.dart` | Vendor portal (reads `reservations`) |
| Analytics | `screens/business/analytics_dashboard_screen.dart` | Reads `domain_events` for stats |
| Reviews + ratings | `models/review_model.dart` | `reviews` table |
| Favorites | `screens/business/business_detail_screen.dart` | `saved_items` table |
| Notifications | `screens/notifications/notifications_screen.dart` | `notifications` + `in_app_notifications` |
| Auth (email + Google) | `screens/auth/*` | Supabase Auth (same project) |
| Profile | `screens/profile/profile_screen.dart` | `user_profiles` table |
| Offline cache | `services/cache_service.dart` | SharedPreferences fallback |
| Image upload | `image_picker` | Supabase Storage |
| Localization | `services/localization_service.dart` | i18n framework |

## 54.5 What htbiz Does NOT Have (must build)

| Feature | Priority | Estimated Effort |
|---|---|---|
| Cart | P0 | 1 day |
| Checkout (Stripe) | P0 | 1 day |
| Reservations list | P0 | 0.5 day |
| Itinerary view | P1 | 1 day |
| QR scanner (check-in) | P1 | 0.5 day |
| Vendor booking calendar | P1 | 1 day |
| Vendor payouts view | P2 | 0.5 day |
| Push notifications | P2 | 1 day |
| Deep linking | P2 | 0.5 day |

## 54.6 Monorepo Structure

```
planviry/
├─ apps/
│  ├─ consumer-web/      Next.js — web orchestrator (full booking flow)
│  ├─ vendor-portal/     Next.js — vendor portal web (scaffold)
│  ├─ admin-portal/      Next.js — admin web (scaffold)
│  └─ mobile/            Flutter — mobile discovery + booking + vendor
│     ├─ lib/
│     │  ├─ config/      supabase_config.dart
│     │  ├─ models/      business_model.dart → vendor_account + inventory_item
│     │  ├─ screens/
│     │  │  ├─ auth/     login, signup, forgot password, reset
│     │  │  ├─ home/     search + category browse + favorites
│     │  │  ├─ map/      Google Maps with business markers
│     │  │  ├─ business/ detail, add, edit, owner dashboard, analytics
│     │  │  ├─ booking/  cart, checkout, reservations (NEW)
│     │  │  ├─ cart/     cross-vertical cart (NEW)
│     │  │  ├─ itinerary/ trip timeline (NEW)
│     │  │  ├─ notifications/
│     │  │  └─ profile/
│     │  ├─ services/    business_service, cache_service, connectivity
│     │  ├─ utils/
│     │  └─ widgets/
│     ├─ supabase/       edge functions (verify-business)
│     ├─ pubspec.yaml
│     └─ .env.example
```

## 54.7 Shared Backend

Both web and mobile use the same Supabase project:
- Same `auth.users` table (one account, works on web + mobile)
- Same `user_profiles` table
- Same `vendor_accounts`, `inventory_items`, `reservations`, `carts` tables
- Same `notifications` table (mobile reads via Supabase Realtime)
- Same Stripe keys (mobile checkout calls `/api/checkout` via HTTP, or creates Stripe PaymentIntent directly via `supabase_flutter`)

No API gateway needed. Both clients talk to Supabase directly.
