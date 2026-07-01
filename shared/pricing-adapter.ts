/**
 * Unified pricing adapter — calculates price based on pricing_model.
 * One function handles ALL verticals: lodging, tickets, dining, venues, services.
 *
 * pricing_model values: FLAT | NIGHTLY | PER_PERSON | PER_SEAT | PER_SLOT | HOURLY
 *
 * FIX-5: refactored for dependency injection. The Supabase client is now the
 * FIRST parameter of `calculatePrice` so callers can pass the db-compat-wrapped
 * client from `@/lib/supabase/server` (or `@/lib/supabase/admin`). The function
 * itself does not need to query the DB today — the supabase param is accepted
 * for signature consistency with `availability-adapter.ts` and so future
 * enhancements (e.g. looking up `inventory_items.metadata.pricing_model` when
 * the caller has not supplied it) can do so without another breaking change.
 */

export type PricingModel = 'FLAT' | 'NIGHTLY' | 'PER_PERSON' | 'PER_SEAT' | 'PER_SLOT' | 'HOURLY'

/**
 * Minimal structural type for a Supabase client. Avoids importing
 * `@supabase/supabase-js` in this leaf package (Part II §2.2 — shared/ is a
 * LEAF that may only import from packages/types). The real client passed by
 * callers (createClient / createAdminClient from `@/lib/supabase/*`) satisfies
 * this shape because both wrap the client with the db-compat Proxy that
 * preserves the `.from(table)` signature.
 */
export interface SupabaseClientLike {
  from: (table: string) => unknown
  auth?: unknown
  rpc?: (fn: string, args?: Record<string, unknown>) => unknown
}

/**
 * The item being priced. `base_price_cents` is the per-unit price. The
 * pricing_model is resolved as `item.pricing_model ?? pricingModelForCategory(item.category)`.
 * For NIGHTLY, supply `start_date` + `end_date` (ISO date strings) OR override
 * via `opts.nights`.
 */
export interface PricingItem {
  base_price_cents: number
  pricing_model?: PricingModel
  category?: string | null
  // NIGHTLY date-range source
  start_date?: string
  end_date?: string
}

/**
 * Runtime multipliers + promotion. All optional — sensible defaults are
 * applied per pricing_model when a field is absent.
 */
export interface PricingOpts {
  // NIGHTLY override (skips start_date/end_date math)
  nights?: number
  // Generic multiplier (rooms for LODGING, units for FLAT, fallback for others)
  quantity?: number
  // PER_PERSON
  guests?: number
  // PER_SEAT (array of seat prices in CENTS — overrides base_price_cents when present)
  seats?: number[]
  // PER_SLOT
  slots?: number
  // HOURLY
  hours?: number
  // Promotion (only one is applied; percentage takes precedence)
  discount_percentage?: number
  discount_cents?: number
}

export interface PricingResult {
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  nights?: number
  pricing_model: PricingModel
  breakdown: string
}

/**
 * Calculate the price of an item based on its pricing_model.
 *
 * Callers pass the supabase client (so future DB lookups for
 * `inventory_items.metadata.pricing_model` are possible without a signature
 * change), the item (with base_price_cents + category/pricing_model), and
 * runtime multipliers (quantity / nights / guests / seats / slots / hours).
 */
export function calculatePrice(
  supabase: SupabaseClientLike,
  item: PricingItem,
  opts: PricingOpts = {},
): PricingResult {
  // Reference the injected client for future use (lookup of inventory_items
  // metadata, discount codes, etc.) without forcing an async call today.
  void supabase

  const model: PricingModel =
    item.pricing_model ?? pricingModelForCategory(item.category ?? '')

  const base = item.base_price_cents ?? 0
  const quantity = opts.quantity ?? 1

  let subtotal = 0
  let breakdown = ''
  let nights: number | undefined

  switch (model) {
    case 'FLAT':
      // Flat per-unit rate; quantity multiplies (e.g. 2 × service packages).
      subtotal = base * quantity
      breakdown = quantity > 1
        ? `$${(base / 100).toFixed(2)} × ${quantity}`
        : `$${(base / 100).toFixed(2)} flat rate`
      break

    case 'NIGHTLY': {
      // nights = explicit override | derived from start/end_date | 1
      if (opts.nights != null) {
        nights = Math.max(1, opts.nights)
      } else if (item.start_date && item.end_date) {
        const start = new Date(item.start_date)
        const end = new Date(item.end_date)
        nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      } else {
        nights = 1
      }
      subtotal = base * nights * quantity
      breakdown = quantity > 1
        ? `$${(base / 100).toFixed(2)} × ${nights} night${nights > 1 ? 's' : ''} × ${quantity}`
        : `$${(base / 100).toFixed(2)} × ${nights} night${nights > 1 ? 's' : ''}`
      break
    }

    case 'PER_PERSON': {
      const guests = opts.guests ?? quantity
      subtotal = base * guests
      breakdown = `$${(base / 100).toFixed(2)} × ${guests} guest${guests > 1 ? 's' : ''}`
      break
    }

    case 'PER_SEAT': {
      // If caller supplies per-seat prices (cents), sum them.
      if (opts.seats && opts.seats.length > 0) {
        subtotal = opts.seats.reduce((sum, price) => sum + price, 0)
        breakdown = `${opts.seats.length} seat${opts.seats.length > 1 ? 's' : ''} × avg $${(subtotal / opts.seats.length / 100).toFixed(2)}`
      } else {
        // Fall back to base × quantity (e.g. general-admission tier).
        subtotal = base * quantity
        breakdown = `$${(base / 100).toFixed(2)} × ${quantity} seat${quantity > 1 ? 's' : ''}`
      }
      break
    }

    case 'PER_SLOT': {
      const slots = opts.slots ?? quantity
      subtotal = base * slots
      breakdown = `$${(base / 100).toFixed(2)} × ${slots} slot${slots > 1 ? 's' : ''}`
      break
    }

    case 'HOURLY': {
      const hours = opts.hours ?? 1
      subtotal = base * hours * quantity
      breakdown = quantity > 1
        ? `$${(base / 100).toFixed(2)}/hr × ${hours} hr${hours > 1 ? 's' : ''} × ${quantity}`
        : `$${(base / 100).toFixed(2)}/hr × ${hours} hr${hours > 1 ? 's' : ''}`
      break
    }

    default:
      subtotal = base * quantity
      breakdown = `$${(base / 100).toFixed(2)}`
  }

  // Apply discount (percentage takes precedence over flat cents).
  let discount = 0
  if (opts.discount_percentage && opts.discount_percentage > 0) {
    discount = Math.round(subtotal * (opts.discount_percentage / 100))
  } else if (opts.discount_cents && opts.discount_cents > 0) {
    discount = opts.discount_cents
  }

  return {
    subtotal_cents: subtotal,
    discount_cents: discount,
    total_cents: Math.max(0, subtotal - discount),
    nights,
    pricing_model: model,
    breakdown,
  }
}

/**
 * Get pricing model for a category. Used as a fallback when the item does not
 * carry an explicit `pricing_model` (e.g. when `inventory_items.metadata.pricing_model`
 * is absent).
 */
export function pricingModelForCategory(category: string): PricingModel {
  switch (category) {
    case 'LODGING':
    case 'VACATION_RENTAL':
      return 'NIGHTLY'
    case 'EVENT_TICKET':
      return 'PER_SEAT'
    case 'DINING':
      return 'PER_PERSON'
    case 'VENUE_RENTAL':
      return 'HOURLY'
    case 'ACTIVITY':
      return 'PER_PERSON'
    case 'SERVICE':
    case 'TRANSPORT':
    case 'CAR_RENTAL':
    case 'CRUISE_CABIN':
    default:
      return 'FLAT'
  }
}
