# Part LIII — Multi-Vertical Module Architecture (Addendum)

> **Status:** APPROVED — Necessary pivot from the original monolithic approach.
> **Date:** 2026-06-30
> **Rationale:** The spec's original plan (build every vertical from scratch against a single schema) was correct in principle but underestimated the lift. Production-grade lodging booking, seat-based ticketing, and vendor management each have decades of domain-specific UX patterns that are faster to port from mature open-source implementations than to rebuild. This addendum formalizes the module mounting strategy.

## 53.1 Module Mount Points

Each vertical is a self-contained module mounted at a specific route prefix. The modules keep their own schema, booking logic, and UI patterns. The orchestrator (Planviry core) ties them together via the unified cart and itinerary.

| Module | Source Repo | Route Prefix | API Prefix | Booking Model |
|---|---|---|---|---|
| Lodging | Staybnb | `/travel/*` | `/api/travel/*` | Date-range (nights) + guest limits |
| Ticketing | EventSeats | `/tickets/*` | `/api/ticketing/*` | Seat-level selection + ticket types |
| Vendor Services | Planviry (native) | `/directory/*` | `/api/vendors/*` | Quantity + TTL reservation |
| Experiences | Planviry + Cal.com | `/experiences/*` | `/api/experiences/*` | Time-slot generation |
| Food & Drink | Planviry (native) | `/food-drink/*` | `/api/restaurants/*` | Reservation (no charge) |
| Orchestrator | Planviry (core) | `/*` (shell) | `/api/checkout` `/api/cart` | Cross-vertical cart + itinerary |

## 53.2 Intent-Based Role Detection

Users are not forced to choose "I am a vendor" or "I am a guest" at signup. Instead, the platform infers intent from behavior:

| User Action | Inferred Role | Redirect |
|---|---|---|
| Attempts to add item to cart | Guest/Consumer | Allow action; create user_profiles if missing |
| Attempts to checkout | Consumer | Require auth; redirect to /login then back to /checkout |
| Attempts to claim a listing | Vendor | Redirect to /onboarding/vendor |
| Attempts to create a listing | Vendor | Require vendor_staff record; redirect to /onboarding/vendor |
| Attempts to access /vendor/* | Vendor | Require vendor_staff; redirect to /onboarding/vendor |
| Attempts to access /admin/* | Admin | Require platform_staff record |
| Browses /search, /directory | Guest (no auth) | Allow; no account needed |

### Implementation
- Middleware checks auth state on protected routes
- Client-side: if user has no `user_profiles` row, redirect to `/onboarding/user`
- If user has no `vendor_staff` row and accesses `/vendor/*`, redirect to `/onboarding/vendor`
- Cart and search work without authentication (anonymous cart via session token)
- Checkout requires authentication (BR-C-005)

## 53.3 Cross-Vertical Cart

The unified cart (`/api/checkout`) accepts items from ALL verticals in a single POST:

```json
{
  "cart_items": [
    { "type": "lodging", "listing_id": "uuid", "amount": 199.00, "date": "2026-07-15", "start_date": "2026-07-15", "end_date": "2026-07-18" },
    { "type": "ticket", "listing_id": "uuid", "amount": 45.00, "quantity": 4 },
    { "type": "booking", "vendor_id": "uuid", "amount": 500.00, "date": "2026-07-15" },
    { "type": "restaurant", "restaurant_id": "uuid", "amount": 0, "date": "2026-07-16", "reservation_time": "19:00", "party_size": 8 }
  ]
}
```

Each item type is handled by its vertical's booking logic, but they all share:
- One Stripe Checkout Session
- One order record
- One itinerary session (optional)
- One confirmation email

## 53.4 Module Independence

Each module can be developed, tested, and deployed independently:
- Staybnb lodging code runs unmodified via Prisma→Supabase proxy shim
- EventSeats ticketing code runs unmodified against Supabase
- Adding a new vertical (e.g., flights) = mount new routes + add cart item type
- Removing a vertical = unmount routes (cart handles missing item types gracefully)

## 53.5 Reference Repository Update

| Repo | Role | Status |
|---|---|---|
| Staybnb | Lodging/hotels/vacation rentals — full stack | PORTED under /travel/* |
| EventSeats | Event ticketing with seat selection | PORTED under /tickets/* |
| Hi.Events | Ticketing lifecycle patterns | ADAPTED (patterns in code) |
| Cal.com | Slot generation | ADAPTED (shared/slots.ts) |
| movinin | FSM + TTL + calculateTotalPrice | ADAPTED (shared/derived-status.ts) |
| Peppermint | RBAC + notification fan-out | ADAPTED (shared/rbac.ts) |
| ~~hotel-back-office~~ | ~~Derived status, soft delete~~ | DROPPED — Staybnb replaces it |
| ~~TicketiHub~~ | ~~Stripe webhook~~ | DROPPED — EventSeats replaces it |
