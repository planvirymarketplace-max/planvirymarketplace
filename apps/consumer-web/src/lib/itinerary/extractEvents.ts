/**
 * Itinerary event extractor — adapted from obsidian-itinerary's extractor.ts.
 * Reads reservations + inventory_items from Supabase and converts them
 * into FullCalendar EventInput objects.
 *
 * Spec ref: Part XLIV §44.8 — ItineraryTimeline component
 */

export interface ItineraryEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    reservation_id: string
    category: string
    vendor_name: string
    status: string
    quantity: number
    total_price_cents: number
    item_id: string
  }
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  LODGING: { bg: '#2563eb', text: '#ffffff' },
  VACATION_RENTAL: { bg: '#2563eb', text: '#ffffff' },
  EVENT_TICKET: { bg: '#ea580c', text: '#ffffff' },
  DINING: { bg: '#16a34a', text: '#ffffff' },
  VENUE_RENTAL: { bg: '#9333ea', text: '#ffffff' },
  VENDOR_SERVICE: { bg: '#0891b2', text: '#ffffff' },
  EXPERIENCE: { bg: '#db2777', text: '#ffffff' },
  TRANSPORT: { bg: '#4b5563', text: '#ffffff' },
  CAR_RENTAL: { bg: '#4b5563', text: '#ffffff' },
  CRUISE_CABIN: { bg: '#1e40af', text: '#ffffff' },
  default: { bg: '#6b7280', text: '#ffffff' },
}

export function extractEventsFromReservations(reservations: Array<Record<string, unknown>>): ItineraryEvent[] {
  const events: ItineraryEvent[] = []

  for (const r of reservations) {
    const inv = Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items
    if (!inv) continue

    const category = (inv.category as string) || 'default'
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.default
    const startsAt = r.starts_at as string
    const endsAt = r.ends_at as string

    // Skip reservations without dates (vendor services without specific time)
    if (!startsAt) continue

    events.push({
      id: r.id as string,
      title: (inv.title as string) || 'Untitled',
      start: startsAt,
      end: endsAt || startsAt,
      backgroundColor: colors.bg,
      borderColor: colors.bg,
      textColor: colors.text,
      extendedProps: {
        reservation_id: r.id as string,
        category,
        vendor_name: (inv.vendor_accounts?.name as string) || (Array.isArray(inv.vendor_accounts) ? inv.vendor_accounts[0]?.name : '') || '',
        status: r.status as string,
        quantity: (r.quantity as number) ?? 1,
        total_price_cents: (r.total_price_cents as number) ?? 0,
        item_id: inv.id as string,
      },
    })
  }

  return events
}
