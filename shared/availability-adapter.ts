/**
 * Unified availability adapter — checks availability based on category.
 * One interface, 5 implementations: LODGING, EVENT_TICKET, DINING, VENUE_RENTAL, SERVICE.
 *
 * FIX-5: refactored for dependency injection. The Supabase client is now the
 * FIRST parameter of `checkAvailability` (and each per-vertical helper) so
 * callers can pass the db-compat-wrapped client from `@/lib/supabase/server`
 * (or `@/lib/supabase/admin`). The previous version imported the RAW
 * `supabase` singleton from `@planviry/db` at module top — that client is NOT
 * wrapped with the db-compat Proxy, so `.from('restaurant_availability_slots')`
 * would bypass the TABLE_MAP redirect to `availability_blocks` and 500.
 *
 * Also fixed: the ticket-availability query at L84-87 previously used
 * `.from('booking_items').in('bookings.status', [...])` which is structurally
 * invalid (`booking_items` is not in TABLE_MAP and Supabase would not perform
 * the implicit join). Now reads from `reservations` with a plain status filter
 * and extracts `metadata.seat_ids` for the booked-seat list.
 */

import type { SupabaseClientLike } from "./pricing-adapter"
import { rangesOverlap } from "./derived-status"

export type { SupabaseClientLike }

export interface AvailabilityResult {
  available: boolean
  reason?: string
  remaining?: number
  booked_seats?: string[]
}

/**
 * Check availability for an inventory item based on its category.
 *
 * `supabase` must be a db-compat-wrapped client (from `@/lib/supabase/server`
 * or `@/lib/supabase/admin`) so old-schema table names like
 * `restaurant_availability_slots` are transparently remapped to `availability_blocks`.
 */
export async function checkAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  category: string,
  params: {
    start_date?: string
    end_date?: string
    quantity?: number
    seat_ids?: string[]
    time_slot?: string
    party_size?: number
  }
): Promise<AvailabilityResult> {
  switch (category) {
    case 'LODGING':
    case 'VACATION_RENTAL':
      return checkLodgingAvailability(supabase, itemId, params.start_date!, params.end_date!)

    case 'EVENT_TICKET':
      return checkTicketAvailability(supabase, itemId, params.seat_ids || [])

    case 'DINING':
      return checkDiningAvailability(supabase, itemId, params.start_date!, params.time_slot!, params.party_size || 1)

    case 'VENUE_RENTAL':
      return checkVenueAvailability(supabase, itemId, params.start_date!, params.end_date!, params.time_slot)

    case 'SERVICE':
    case 'ACTIVITY':
      return checkServiceAvailability(supabase, itemId, params.start_date!, params.time_slot)

    default:
      return { available: true }
  }
}

/**
 * LODGING: date-range overlap check (Staybnb pattern).
 * No two CONFIRMED/PENDING reservations can overlap for the same item.
 */
async function checkLodgingAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityResult> {
  const { data: conflicts } = await (supabase as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: unknown) => { in: (col: string, vals: unknown[]) => Promise<{ data: unknown[] | null }> }
      }
    }
  })
    .from('reservations')
    .select('id, starts_at, ends_at')
    .eq('item_id', itemId)
    .in('status', ['PENDING', 'CONFIRMED'])

  if (conflicts && conflicts.length > 0) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const typedConflicts = conflicts as Array<{ starts_at: string; ends_at: string }>
    const hasConflict = typedConflicts.some((r) => {
      return rangesOverlap(start, end, new Date(r.starts_at), new Date(r.ends_at))
    })
    if (hasConflict) {
      return { available: false, reason: 'Selected dates overlap with an existing booking' }
    }
  }

  return { available: true }
}

/**
 * EVENT_TICKET: seat availability check (EventSeats pattern).
 * Returns booked seat IDs so the UI can grey them out.
 *
 * FIX-5: previously queried `.from('booking_items').in('bookings.status', [...])`
 * which is structurally invalid (no join). Now reads from `reservations` with
 * a plain status filter and extracts `metadata.seat_ids` for the booked-seat list.
 */
async function checkTicketAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  requestedSeatIds: string[],
): Promise<AvailabilityResult> {
  const { data: bookedReservations } = await (supabase as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: unknown) => { in: (col: string, vals: unknown[]) => Promise<{ data: unknown[] | null }> }
      }
    }
  })
    .from('reservations')
    .select('id, metadata')
    .eq('item_id', itemId)
    .in('status', ['PENDING', 'CONFIRMED'])

  const bookedSeats: string[] = []
  for (const r of (bookedReservations ?? []) as Array<{ metadata?: { seat_ids?: string[] } }>) {
    const seatIds = r.metadata?.seat_ids
    if (Array.isArray(seatIds)) {
      bookedSeats.push(...seatIds)
    }
  }

  if (requestedSeatIds.length > 0) {
    const conflicts = requestedSeatIds.filter(id => bookedSeats.includes(id))
    if (conflicts.length > 0) {
      return { available: false, reason: `${conflicts.length} seat(s) already booked`, booked_seats: bookedSeats }
    }
  }

  return { available: true, booked_seats: bookedSeats }
}

/**
 * DINING: time-slot capacity check.
 *
 * `restaurant_availability_slots` is in TABLE_MAP (db-compat) → `availability_blocks`,
 * so a wrapped client will redirect this call. The columns read here
 * (`restaurant_id`, `date`, `time_slot`, `capacity`, `reserved`) match the
 * original adapter signature; callers that want the new-schema column names
 * should bypass this helper and query `availability_blocks` directly. The
 * adapter is intentionally kept stable for backward-compat with callers that
 * pass a wrapped client + old-schema column expectations.
 */
async function checkDiningAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  date: string,
  timeSlot: string,
  partySize: number,
): Promise<AvailabilityResult> {
  const { data: slots } = await (supabase as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: unknown) => {
          eq: (col: string, val: unknown) => {
            eq: (col: string, val: unknown) => {
              maybeSingle: () => Promise<{ data: unknown | null }>
            }
          }
        }
      }
    }
  })
    .from('restaurant_availability_slots')
    .select('id, capacity, reserved')
    .eq('restaurant_id', itemId)
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .maybeSingle()

  if (!slots) {
    return { available: false, reason: 'No availability for this date/time' }
  }

  const slot = slots as { capacity: number; reserved: number }
  const remaining = slot.capacity - slot.reserved
  if (remaining < partySize) {
    return { available: false, reason: `Only ${remaining} seats remaining`, remaining }
  }

  return { available: true, remaining }
}

/**
 * VENUE_RENTAL: date + time-slot capacity check.
 */
async function checkVenueAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  startDate: string,
  endDate: string,
  timeSlot?: string,
): Promise<AvailabilityResult> {
  // Check date overlap first (like lodging)
  const lodgingCheck = await checkLodgingAvailability(supabase, itemId, startDate, endDate)
  if (!lodgingCheck.available) return lodgingCheck

  // If time slot specified, check capacity
  if (timeSlot) {
    const { data: blocks } = await (supabase as {
      from: (t: string) => {
        select: (c: string) => {
          eq: (col: string, val: unknown) => {
            eq: (col: string, val: unknown) => {
              lte: (col: string, val: unknown) => {
                gte: (col: string, val: unknown) => Promise<{ data: unknown[] | null }>
              }
            }
          }
        }
      }
    })
      .from('availability_blocks')
      .select('id, total_capacity, reserved_capacity')
      .eq('item_id', itemId)
      .eq('is_available', true)
      .lte('start_time', endDate)
      .gte('end_time', startDate)

    if (blocks && blocks.length > 0) {
      const block = blocks[0] as { total_capacity: number; reserved_capacity: number }
      const remaining = block.total_capacity - block.reserved_capacity
      if (remaining <= 0) {
        return { available: false, reason: 'Venue fully booked for this time' }
      }
      return { available: true, remaining }
    }
  }

  return { available: true }
}

/**
 * SERVICE / ACTIVITY: time-slot availability (Cal.com getSlots pattern).
 */
async function checkServiceAvailability(
  supabase: SupabaseClientLike,
  itemId: string,
  date: string,
  timeSlot?: string,
): Promise<AvailabilityResult> {
  // Check existing reservations for this date
  const dayStart = new Date(date + 'T00:00:00Z')
  const dayEnd = new Date(date + 'T23:59:59Z')

  const { data: reservations } = await (supabase as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: unknown) => {
          in: (col: string, vals: unknown[]) => {
            gte: (col: string, val: unknown) => {
              lte: (col: string, val: unknown) => Promise<{ data: unknown[] | null }>
            }
          }
        }
      }
    }
  })
    .from('reservations')
    .select('id, starts_at, ends_at')
    .eq('item_id', itemId)
    .in('status', ['PENDING', 'CONFIRMED'])
    .gte('starts_at', dayStart.toISOString())
    .lte('ends_at', dayEnd.toISOString())

  if (timeSlot) {
    const slotStart = new Date(timeSlot)
    const slotEnd = new Date(slotStart.getTime() + 60 * 60_000) // default 1hr

    const typedReservations = (reservations || []) as Array<{ starts_at: string; ends_at: string }>
    const hasConflict = typedReservations.some((r) => {
      return rangesOverlap(slotStart, slotEnd, new Date(r.starts_at), new Date(r.ends_at))
    })

    if (hasConflict) {
      return { available: false, reason: 'Time slot already booked' }
    }
  }

  return { available: true }
}
