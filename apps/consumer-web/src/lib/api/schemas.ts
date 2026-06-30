/**
 * Part XI §11.3 — Input schemas (Zod) for every REST endpoint.
 *
 * Part XI §11.2.3 — Request Lifecycle step 3: Zod input schema validation.
 * Rejected with 400 + field-level errors.
 *
 * Part III domain types (from @planviry/types) define the entity shapes;
 * these schemas define the API request/response contracts specifically.
 */

import { z } from "zod";

// ─── 11.3.1 Auth ────────────────────────────────────────────────────────────

export const AuthRegisterInput = z.object({
  display_name: z.string().min(1).max(80),
  timezone: z.string().optional(),
  locale: z.string().optional(),
});

export const AuthMePatchInput = z.object({
  display_name: z.string().min(1).max(80).refine((v) => v === v.trim(), "No leading/trailing whitespace").optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  notification_prefs: z.record(z.unknown()).optional(),
});

// ─── 11.3.2 Inventory ───────────────────────────────────────────────────────

export const INVENTORY_CATEGORY = z.enum([
  "LODGING", "VACATION_RENTAL", "FLIGHT", "CAR_RENTAL", "EXPERIENCE",
  "EVENT_TICKET", "VENUE_SPACE", "VENDOR_SERVICE", "DINING_RESERVATION",
  "CRUISE_CABIN", "TRANSIT",
]);

export const InventoryListQuery = z.object({
  location_id: z.string().uuid().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius_km: z.coerce.number().int().min(1).max(100).optional(),
  category: INVENTORY_CATEGORY.optional(),
  price_min_cents: z.coerce.number().int().nonnegative().optional(),
  price_max_cents: z.coerce.number().int().nonnegative().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  attendees: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(48).default(24),
  sort: z.enum(["relevance", "price_asc", "price_desc", "newest"]).default("relevance"),
}).refine(
  (d) => d.location_id !== undefined || (d.lat !== undefined && d.lng !== undefined && d.radius_km !== undefined),
  { message: "Either location_id or (lat, lng, radius_km) is required" },
);

export const InventoryCreateInput = z.object({
  category: INVENTORY_CATEGORY,
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  price_cents: z.number().int().min(0),
  is_free: z.boolean().optional(),
  location_id: z.string().uuid(),
  metadata: z.record(z.unknown()),
  capacity: z.number().int().positive().optional(),
  quantity_available: z.number().int().nonnegative().optional(),
});

export const InventoryPatchInput = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(5000).optional(),
  price_cents: z.number().int().min(0).optional(),
  metadata: z.record(z.unknown()).optional(),
  capacity: z.number().int().positive().optional(),
  quantity_available: z.number().int().nonnegative().optional(),
  location_id: z.string().uuid().optional(),
});

// ─── 11.3.3 Reservations ────────────────────────────────────────────────────

export const ReservationListQuery = z.object({
  status: z.array(z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW", "EXPIRED"])).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(50).default(20),
});

export const ReservationCancelInput = z.object({
  reason: z.string().max(500).optional(),
  confirm_token: z.string().optional(),
});

// ─── 11.3.4 Cart & Checkout ────────────────────────────────────────────────

export const CartAddItemInput = z.object({
  inventory_item_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  params: z.object({
    starts_at: z.string().datetime().optional(),
    ends_at: z.string().datetime().optional(),
    attendees: z.number().int().positive().optional(),
  }).optional(),
});

export const CartCheckoutInput = z.object({
  itinerary_session_id: z.string().uuid().optional(),
  guest_details: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
});

// ─── 11.3.5 Itineraries ─────────────────────────────────────────────────────

export const ItineraryCreateInput = z.object({
  title: z.string().max(200).optional(),
  occasion_type: z.string().optional(),
  reservation_ids: z.array(z.string().uuid()).optional(),
});

export const ItineraryShareInput = z.object({
  type: z.enum(["link", "email"]),
  permission: z.enum(["VIEW", "EDIT"]),
  emails: z.array(z.string().email()).optional(),
}).refine(
  (d) => d.type !== "email" || (d.emails !== undefined && d.emails.length > 0),
  { message: "emails required when type=email" },
);

// ─── 11.3.6 Search ──────────────────────────────────────────────────────────

export const SearchQuery = z.object({
  q: z.string().min(1).max(200),
  location_id: z.string().uuid().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius_km: z.coerce.number().int().min(1).max(100).optional(),
  category: z.array(INVENTORY_CATEGORY).optional(),
  price_min_cents: z.coerce.number().int().nonnegative().optional(),
  price_max_cents: z.coerce.number().int().nonnegative().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  attendees: z.coerce.number().int().positive().optional(),
  sort: z.enum(["relevance", "price_asc", "price_desc", "newest", "distance"]).default("relevance"),
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(48).default(24),
}).refine(
  (d) => d.location_id !== undefined || (d.lat !== undefined && d.lng !== undefined && d.radius_km !== undefined),
  { message: "Either location_id or (lat, lng, radius_km) is required" },
);

export const AutocompleteQuery = z.object({
  q: z.string().min(2),
  category: INVENTORY_CATEGORY.optional(),
  location_id: z.string().uuid().optional(),
});

// ─── 11.3.7 Vendor ──────────────────────────────────────────────────────────

export const VendorClaimInput = z.object({
  vendor_id: z.string().uuid(),
  verification_method: z.enum(["email", "phone"]),
  contact_value: z.string().min(1),
});

export const VendorClaimVerifyInput = z.object({
  claim_token: z.string().min(1),
  verification_code: z.string().min(1),
});

export const VendorStaffInviteInput = z.object({
  email: z.string().email(),
  role: z.enum(["VENDOR_MANAGER", "VENDOR_STAFF"]),
});

// ─── 11.3.8 Events ──────────────────────────────────────────────────────────

export const TICKET_TIER_TYPE = z.enum(["FREE", "PAID", "DONATION", "TIERED"]);

export const EventTicketTierInput = z.object({
  name: z.string().min(1),
  type: TICKET_TIER_TYPE,
  price_cents: z.number().int().min(0),
  is_free: z.boolean().optional(),
  capacity: z.number().int().positive(),
  sales_start_at: z.string().datetime().optional(),
  sales_end_at: z.string().datetime().optional(),
  min_per_order: z.number().int().positive().optional(),
  max_per_order: z.number().int().positive().optional(),
  is_hidden: z.boolean().optional(),
});

export const EventCheckinInput = z.object({
  qr_token: z.string().min(1),
  method: z.enum(["QR_SCAN", "MANUAL"]).optional(),
});
