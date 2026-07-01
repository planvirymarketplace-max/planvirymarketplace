/**
 * Unified availability adapter — checks availability based on category.
 * One interface, 5 implementations: LODGING, EVENT_TICKET, DINING, VENUE_RENTAL, VENDOR_SERVICE.
 */

import { supabase } from "@planviry/db"
import { rangesOverlap } from "./derived-status"

export interface AvailabilityResult {
  available: boolean
  reason?: string
  remaining?: number
  booked_seats?: string[]
}

/**
 * Check availability for an inventory item based on its category.
 */
export async function checkAvailability(
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
      return checkLodgingAvailability(itemId, params.start_date!, params.end_date!)

    case 'EVENT_TICKET':
      return checkTicketAvailability(itemId, params.seat_ids || [])

    case 'DINING':
      return checkDiningAvailability(itemId, params.start_date!, params.time_slot!, params.party_size || 1)

    case 'VENUE_RENTAL':
      return checkVenueAvailability(itemId, params.start_date!, params.end_date!, params.time_slot)

    case 'VENDOR_SERVICE':
    case 'EXPERIENCE':
      return checkServiceAvailability(itemId, params.start_date!, params.time_slot)

    default:
      return { available: true }
  }
}

/**
 * LODGING: date-range overlap check (Staybnb pattern).
 * No two CONFIRMED/PENDING reservations can overlap for the same item.
 */
async function checkLodgingAvailability(itemId: string, startDate: string, endDate: string): Promise<AvailabilityResult> {
  const { data: conflicts } = await supabase
    .from('reservations')
    .select('id, starts_at, ends_at')
    .eq('item_id', itemId)
    .in('status', ['PENDING', 'CONFIRMED'])

  if (conflicts && conflicts.length > 0) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const hasConflict = conflicts.some((r: { starts_at: string; ends_at: string }) => {
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
 */
async function checkTicketAvailability(itemId: string, requestedSeatIds: string[]): Promise<AvailabilityResult> {
  const { data: bookedItems } = await supabase
    .from('booking_items')
    .select('seatId')
    .in('bookings.status', ['PENDING', 'CONFIRMED', 'PAID'])

  const bookedSeats = (bookedItems || []).map((b: { seatId: string }) => b.seatId)

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
 */
async function checkDiningAvailability(itemId: string, date: string, timeSlot: string, partySize: number): Promise<AvailabilityResult> {
  const { data: slots } = await supabase
    .from('restaurant_availability_slots')
    .select('id, capacity, reserved')
    .eq('restaurant_id', itemId)
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .maybeSingle()

  if (!slots) {
    return { available: false, reason: 'No availability for this date/time' }
  }

  const remaining = slots.capacity - slots.reserved
  if (remaining < partySize) {
    return { available: false, reason: `Only ${remaining} seats remaining`, remaining }
  }

  return { available: true, remaining }
}

/**
 * VENUE_RENTAL: date + time-slot capacity check.
 */
async function checkVenueAvailability(itemId: string, startDate: string, endDate: string, timeSlot?: string): Promise<AvailabilityResult> {
  // Check date overlap first (like lodging)
  const lodgingCheck = await checkLodgingAvailability(itemId, startDate, endDate)
  if (!lodgingCheck.available) return lodgingCheck

  // If time slot specified, check capacity
  if (timeSlot) {
    const { data: blocks } = await supabase
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
 * VENDOR_SERVICE / EXPERIENCE: time-slot availability (Cal.com getSlots pattern).
 */
async function checkServiceAvailability(itemId: string, date: string, timeSlot?: string): Promise<AvailabilityResult> {
  // Check existing reservations for this date
  const dayStart = new Date(date + 'T00:00:00Z')
  const dayEnd = new Date(date + 'T23:59:59Z')

  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, starts_at, ends_at')
    .eq('item_id', itemId)
    .in('status', ['PENDING', 'CONFIRMED'])
    .gte('starts_at', dayStart.toISOString())
    .lte('ends_at', dayEnd.toISOString())

  if (timeSlot) {
    const slotStart = new Date(timeSlot)
    const slotEnd = new Date(slotStart.getTime() + 60 * 60_000) // default 1hr

    const hasConflict = (reservations || []).some((r: { starts_at: string; ends_at: string }) => {
      return rangesOverlap(slotStart, slotEnd, new Date(r.starts_at), new Date(r.ends_at))
    })

    if (hasConflict) {
      return { available: false, reason: 'Time slot already booked' }
    }
  }

  return { available: true }
}
