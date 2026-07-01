/**
 * Unified pricing adapter — calculates price based on pricing_model.
 * One function handles ALL verticals: lodging, tickets, dining, venues, services.
 *
 * pricing_model values: FLAT | NIGHTLY | PER_PERSON | PER_SEAT | PER_SLOT | HOURLY
 */

export type PricingModel = 'FLAT' | 'NIGHTLY' | 'PER_PERSON' | 'PER_SEAT' | 'PER_SLOT' | 'HOURLY'

export interface PricingInput {
  base_price_cents: number
  pricing_model: PricingModel
  // NIGHTLY
  start_date?: string
  end_date?: string
  // PER_PERSON
  guest_count?: number
  // PER_SEAT
  seat_prices_cents?: number[]
  // PER_SLOT
  slot_count?: number
  // HOURLY
  hours?: number
  // Promotion
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

export function calculatePrice(input: PricingInput): PricingResult {
  let subtotal = 0
  let breakdown = ''
  let nights: number | undefined

  switch (input.pricing_model) {
    case 'FLAT':
      subtotal = input.base_price_cents
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)} flat rate`
      break

    case 'NIGHTLY': {
      if (!input.start_date || !input.end_date) {
        subtotal = input.base_price_cents
        breakdown = `$${(input.base_price_cents / 100).toFixed(2)} (1 night default)`
        break
      }
      const start = new Date(input.start_date)
      const end = new Date(input.end_date)
      nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      subtotal = input.base_price_cents * nights
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)} × ${nights} night${nights > 1 ? 's' : ''}`
      break
    }

    case 'PER_PERSON':
      subtotal = input.base_price_cents * (input.guest_count || 1)
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)} × ${input.guest_count || 1} guest${(input.guest_count || 1) > 1 ? 's' : ''}`
      break

    case 'PER_SEAT': {
      const seats = input.seat_prices_cents || [input.base_price_cents]
      subtotal = seats.reduce((sum, price) => sum + price, 0)
      breakdown = `${seats.length} seat${seats.length > 1 ? 's' : ''} × avg $${(subtotal / seats.length / 100).toFixed(2)}`
      break
    }

    case 'PER_SLOT':
      subtotal = input.base_price_cents * (input.slot_count || 1)
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)} × ${input.slot_count || 1} slot${(input.slot_count || 1) > 1 ? 's' : ''}`
      break

    case 'HOURLY':
      subtotal = input.base_price_cents * (input.hours || 1)
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)}/hr × ${input.hours || 1} hr${(input.hours || 1) > 1 ? 's' : ''}`
      break

    default:
      subtotal = input.base_price_cents
      breakdown = `$${(input.base_price_cents / 100).toFixed(2)}`
  }

  // Apply discount
  let discount = 0
  if (input.discount_percentage && input.discount_percentage > 0) {
    discount = Math.round(subtotal * (input.discount_percentage / 100))
  } else if (input.discount_cents && input.discount_cents > 0) {
    discount = input.discount_cents
  }

  return {
    subtotal_cents: subtotal,
    discount_cents: discount,
    total_cents: Math.max(0, subtotal - discount),
    nights,
    pricing_model: input.pricing_model,
    breakdown,
  }
}

/**
 * Get pricing model for a category.
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
    case 'EXPERIENCE':
      return 'PER_PERSON'
    case 'VENDOR_SERVICE':
    case 'TRANSPORT':
    case 'CAR_RENTAL':
    case 'CRUISE_CABIN':
    default:
      return 'FLAT'
  }
}
