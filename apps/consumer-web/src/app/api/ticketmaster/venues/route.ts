import { NextRequest, NextResponse } from 'next/server'

const TM_API_KEY = process.env.TICKETMASTER_API_KEY || 'wFwGN4aABbGR9v912xBy7WWD6M0WIBBK'

/**
 * GET /api/ticketmaster/venues
 *
 * Returns unique venues from Ticketmaster events with aggregated data:
 * venue name, city, state, address, lat/lng, image, event count, next event
 */
export async function GET() {
  try {
    const allVenues = new Map<string, any>()
    
    // Fetch events from multiple segments to get diverse venues
    const segments = ['Music', 'Sports', 'Arts & Theater', 'Family', 'Comedy']
    
    for (const seg of segments) {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_API_KEY}&size=200&page=0&countryCode=US&segmentName=${encodeURIComponent(seg)}&sort=date,asc`
      
      try {
        const res = await fetch(url, { next: { revalidate: 3600 } })
        if (!res.ok) continue
        
        const data = await res.json()
        const events = data._embedded?.events || []
        
        for (const event of events) {
          const venue = event._embedded?.venues?.[0]
          if (!venue?.name) continue
          
          const key = venue.id || venue.name
          const existing = allVenues.get(key)
          
          if (existing) {
            existing.event_count++
            // Update next event if this one is sooner
            const eventDate = event.dates?.start?.localDate
            if (eventDate && (!existing.next_event || eventDate < existing.next_event)) {
              existing.next_event = eventDate
              existing.next_event_name = event.name
            }
          } else {
            allVenues.set(key, {
              venue_name: venue.name,
              venue_id: venue.id,
              venue_type: venue.type,
              venue_city: venue.city?.name || null,
              venue_state: venue.state?.stateCode || null,
              venue_address: venue.address?.line1 || null,
              venue_postal: venue.postalCode || null,
              venue_lat: venue.location?.latitude ? parseFloat(venue.location.latitude) : null,
              venue_lng: venue.location?.longitude ? parseFloat(venue.location.longitude) : null,
              venue_image: venue.images?.[0]?.url || null,
              venue_url: venue.url || null,
              venue_parking: venue.parkingDetail || null,
              venue_accessible: venue.accessibleSeatingDetail || null,
              venue_general_rule: venue.generalInfo?.generalRule || null,
              venue_child_rule: venue.generalInfo?.childRule || null,
              event_count: 1,
              next_event: event.dates?.start?.localDate || null,
              next_event_name: event.name,
              next_event_segment: seg,
            })
          }
        }
      } catch (e) {
        console.error(`Error fetching ${seg} venues:`, e)
      }
    }
    
    // Sort by event count descending
    const venues = Array.from(allVenues.values()).sort((a, b) => b.event_count - a.event_count)
    
    return NextResponse.json({
      venues,
      total: venues.length,
    })
  } catch (error) {
    console.error('Venues API error:', error)
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 })
  }
}
