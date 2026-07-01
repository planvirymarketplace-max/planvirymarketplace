/**
 * Planviry — v1 API Request Schemas
 *
 * Zod validators for every v1 route's body / query string. Each schema is
 * exported as a `*Schema` constant; the inferred TS type is exported as the
 * matching `*Input` alias so handlers can stay typed end-to-end:
 *
 *   const parsed = registerSchema.parse(body)        // throws ZodError
 *   // or with safe parsing:
 *   const result = registerSchema.safeParse(body)
 *
 * Note: Zod 4 is installed (`zod@^4`). The `z.string().email()` shape works
 * in v4; if it's ever upgraded we'll switch to `z.email()`.
 */

import { z } from "zod"

// ─── Shared primitives ───────────────────────────────────────────────────────

const uuid = z.string().uuid()
const nonEmpty = z.string().trim().min(1)
const positiveInt = z.number().int().positive()
const nonNegInt = z.number().int().nonnegative()
const isoCurrency = z.string().length(3).regex(/^[A-Z]{3}$/)
const slug = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "invalid slug")
const isoTimestamp = z.string().min(1)

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  display_name: z.string().trim().min(1).max(120).optional(),
  locale: z.string().trim().max(16).optional(),
  phone: z.string().trim().max(40).optional(),
  // Optional metadata that frontend onboarding may send up front.
  invite_token: z.string().optional(),
})
export type RegisterInput = z.infer<typeof registerSchema>

export const updateProfileSchema = z
  .object({
    display_name: z.string().trim().min(1).max(120).optional(),
    locale: z.string().trim().max(16).optional(),
    phone: z.string().trim().max(40).optional(),
    avatar_url: z.string().url().optional(),
    notification_prefs: z.record(z.unknown()).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "No fields to update")
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ─── Inventory ───────────────────────────────────────────────────────────────

export const createInventorySchema = z.object({
  vendor_id: uuid,
  location_id: uuid,
  title: z.string().trim().min(2).max(200),
  slug: slug.optional(),
  description: z.string().trim().max(8_000).optional(),
  category: z.string().trim().max(120).optional(),
  base_price_cents: nonNegInt.optional(),
  currency: isoCurrency.optional(),
  max_quantity_per_booking: positiveInt.optional(),
  cancellation_policy: z.enum(["FLEXIBLE", "MODERATE", "STRICT", "CUSTOM"]).optional(),
  metadata: z.record(z.unknown()).optional(),
  // Optional inline media + ticket tiers (saved in one round-trip)
  media: z
    .array(
      z.object({
        url: z.string().url(),
        alt_text: z.string().max(300).optional(),
        media_type: z.enum(["IMAGE", "VIDEO"]).optional(),
        is_primary: z.boolean().optional(),
        sort_order: z.number().int().optional(),
      }),
    )
    .max(50)
    .optional(),
  ticket_tiers: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        description: z.string().max(2_000).optional(),
        price_cents: nonNegInt,
        quantity_total: positiveInt,
        sort_order: z.number().int().optional(),
      }),
    )
    .max(50)
    .optional(),
})
export type CreateInventoryInput = z.infer<typeof createInventorySchema>

export const updateInventorySchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    slug: slug.optional(),
    description: z.string().trim().max(8_000).optional(),
    category: z.string().trim().max(120).optional(),
    base_price_cents: nonNegInt.optional(),
    currency: isoCurrency.optional(),
    max_quantity_per_booking: positiveInt.optional(),
    cancellation_policy: z.enum(["FLEXIBLE", "MODERATE", "STRICT", "CUSTOM"]).optional(),
    metadata: z.record(z.unknown()).optional(),
    location_id: uuid.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "No fields to update")
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>

export const inventoryListQuerySchema = z.object({
  location_id: uuid.optional(),
  vendor_id: uuid.optional(),
  category: z.string().trim().max(120).optional(),
  q: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
  // Sort: newest | price_asc | price_desc | quality
  sort: z.enum(["newest", "price_asc", "price_desc", "quality"]).default("newest"),
})
export type InventoryListQuery = z.infer<typeof inventoryListQuerySchema>

// ─── Reservations ────────────────────────────────────────────────────────────

export const reservationListQuerySchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "EXPIRED", "REFUNDED"])
    .optional(),
  itinerary_session_id: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
})
export type ReservationListQuery = z.infer<typeof reservationListQuerySchema>

export const cancelReservationSchema = z.object({
  // Two-phase: "preview" returns refund estimate without committing,
  // "confirm" actually cancels.
  phase: z.enum(["preview", "confirm"]).default("confirm"),
  reason: z.string().trim().max(1_000).optional(),
})
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>

// ─── Cart ────────────────────────────────────────────────────────────────────

export const addCartItemSchema = z.object({
  item_id: uuid,
  quantity: positiveInt.default(1),
  // Optional override (used by lodging/ticketing verticals where price is
  // computed at booking time). If omitted we read base_price_cents from the
  // inventory row.
  unit_price_cents: nonNegInt.optional(),
  starts_at: isoTimestamp.optional(),
  ends_at: isoTimestamp.optional(),
  ticket_tier_id: uuid.optional(),
})
export type AddCartItemInput = z.infer<typeof addCartItemSchema>

export const checkoutSchema = z.object({
  // Optional: client may pass cart_items directly (skipping the carts table)
  // OR omit to use the user's ACTIVE cart.
  cart_items: z
    .array(
      z.object({
        item_id: uuid,
        quantity: positiveInt,
        unit_price_cents: nonNegInt.optional(),
        starts_at: isoTimestamp.optional(),
        ends_at: isoTimestamp.optional(),
        ticket_tier_id: uuid.optional(),
      }),
    )
    .optional(),
  itinerary_session_id: uuid.optional(),
  promo_code: z.string().trim().max(60).optional(),
  idempotency_key: z.string().trim().max(200).optional(),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
})
export type CheckoutInput = z.infer<typeof checkoutSchema>

// ─── Itineraries ─────────────────────────────────────────────────────────────

export const createItinerarySchema = z.object({
  title: z.string().trim().min(1).max(200),
  occasion_type: z.string().trim().max(80).optional(),
  // Optional: seed the itinerary with a reservation ID
  reservation_id: uuid.optional(),
  // Optional: invite members at creation time
  members: z
    .array(
      z.object({
        user_id: uuid.optional(),
        email: z.string().email().optional(),
        permission: z.enum(["OWNER", "EDITOR", "VIEWER"]).default("VIEWER"),
      }),
    )
    .max(50)
    .optional(),
})
export type CreateItineraryInput = z.infer<typeof createItinerarySchema>

export const shareItinerarySchema = z.object({
  permission: z.enum(["VIEWER", "EDITOR"]).default("VIEWER"),
  // TTL in hours (max 30 days)
  ttl_hours: z.number().int().min(1).max(24 * 30).default(168),
})
export type ShareItineraryInput = z.infer<typeof shareItinerarySchema>

// ─── Search ──────────────────────────────────────────────────────────────────

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  location_id: uuid.optional(),
  // Location slug (e.g. "milwaukee-wi") — resolved alongside location_id
  location_slug: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  vendor_id: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
  min_price_cents: z.coerce.number().int().min(0).optional(),
  max_price_cents: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["relevance", "newest", "price_asc", "price_desc"]).default("relevance"),
})
export type SearchQuery = z.infer<typeof searchQuerySchema>

export const autocompleteQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),
  location_id: uuid.optional(),
  limit: z.coerce.number().int().min(1).max(20).default(8),
})
export type AutocompleteQuery = z.infer<typeof autocompleteQuerySchema>
