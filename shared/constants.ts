/**
 * Platform-wide constants — Part I §1.1.6 Constraints + Part II §2.1 shared/.
 */

// Part I §1.1.6 — binding constraints (mirrored here for runtime reference).
export const CONSTRAINTS = {
  /** CONSTRAINT-001: every InventoryItem addable to the same Cart. */
  CROSS_VERTICAL_CART: "CONSTRAINT-001",
  /** CONSTRAINT-002: no inventory query without a location. */
  LOCATION_GATE: "CONSTRAINT-002",
  /** CONSTRAINT-003: Vertical Row swaps feed in place, no navigation. */
  VERTICAL_LENS_NOT_NAV: "CONSTRAINT-003",
  /** CONSTRAINT-004: vendor dashboards account-scoped via RLS. */
  VENDOR_RLS_TENANCY: "CONSTRAINT-004",
  /** CONSTRAINT-005: all booking transitions through Reservation FSM. */
  RESERVATION_FSM: "CONSTRAINT-005",
} as const;

// Part XLIV §44.4 — Vertical Row canonical order (binding).
export const VERTICAL_ROW = [
  "Services",
  "Plan",
  "Things to Do",
  "Food & Drink",
  "Live Shows",
  "Travel",
  "Party",
  "Spaces",
  "Vendors",
] as const;

export type Vertical = (typeof VERTICAL_ROW)[number];

// Part XLIV §44.4 — Plan bar fields (binding, persistent on every landing page).
export const PLAN_BAR_FIELDS = ["What", "Where", "When", "Price", "Attendees"] as const;

// DOM-003 — InventoryItem.category enum values (Part III §3.1, binding).
// FIX-10: aligned to the live Supabase `inventory_category` enum
// (LODGING, DINING, EVENT_TICKET, ACTIVITY, TRANSPORT, VENUE_RENTAL, SERVICE).
// Legacy non-enum categories (VACATION_RENTAL, FLIGHT, CAR_RENTAL,
// VENUE_SPACE, DINING_RESERVATION, CRUISE_CABIN, TRANSIT) are kept for
// backward-compat with callers that still use them as ad-hoc metadata
// labels — they are NOT valid INSERT values for inventory_items.category.
export const INVENTORY_CATEGORIES = [
  "LODGING",
  "DINING",
  "EVENT_TICKET",
  "ACTIVITY",
  "TRANSPORT",
  "VENUE_RENTAL",
  "SERVICE",
  // ── legacy / non-enum categories (NOT insertable into inventory_items) ──
  "VACATION_RENTAL",
  "FLIGHT",
  "CAR_RENTAL",
  "VENUE_SPACE",
  "DINING_RESERVATION",
  "CRUISE_CABIN",
  "TRANSIT",
] as const;

// DOM-004 — Reservation FSM default TTL (BR-R-002).
export const DEFAULT_RESERVATION_TTL_MINUTES = 15;
// DOM-006 — Cart idle TTL (BR-C-002).
export const DEFAULT_CART_TTL_MINUTES = 60;
