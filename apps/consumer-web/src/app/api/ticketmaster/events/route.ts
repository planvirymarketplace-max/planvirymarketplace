import { NextRequest, NextResponse } from 'next/server'

const TM_API_KEY = process.env.TICKETMASTER_API_KEY || 'wFwGN4aABbGR9v912xBy7WWD6M0WIBBK'

/**
 * GET /api/ticketmaster/events
 *
 * Query params:
 *   segment  — Music, Sports, Arts & Theater, Family, Comedy
 *   genre    — Rock, Hip-Hop/Rap, etc.
 *   city     — city name
 *   state    — state code
 *   lat/lng  — coordinates for radius search
 *   radius   — miles
 *   page     — page number
 *   size     — results per page (max 200)
 *   keyword  — search keyword
 *   startDateTime — ISO date
 *   sort     — date,asc / date,desc / name,asc / relevance,asc
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const params = new URLSearchParams()
  params.set('apikey', TM_API_KEY)
  params.set('countryCode', 'US')
  params.set('size', searchParams.get('size') || '50')
  
  if (searchParams.get('page')) params.set('page', searchParams.get('page')!)
  if (searchParams.get('segment')) params.set('segmentName', searchParams.get('segment')!)
  if (searchParams.get('genre')) params.set('genreName', searchParams.get('genre')!)
  if (searchParams.get('city')) params.set('city', searchParams.get('city')!)
  if (searchParams.get('state')) params.set('stateCode', searchParams.get('state')!)
  if (searchParams.get('keyword')) params.set('keyword', searchParams.get('keyword')!)
  if (searchParams.get('startDateTime')) params.set('startDateTime', searchParams.get('startDateTime')!)
  if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
  
  if (searchParams.get('lat') && searchParams.get('lng')) {
    params.set('latlng', `${searchParams.get('lat')},${searchParams.get('lng')}`)
    if (searchParams.get('radius')) params.set('radius', searchParams.get('radius')!)
    params.set('unit', 'miles')
  }

  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`
    )
    
    if (!res.ok) {
      return NextResponse.json(
        { error: `Ticketmaster API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    
    // Transform events for frontend
    const events = (data._embedded?.events || []).map((event: any) => {
      const venue = event._embedded?.venues?.[0] || {}
      const classification = event.classifications?.[0] || {}
      const images = event.images || []
      const bestImage = images.find((img: any) => img.width >= 640) || images[0]
      const priceRange = event.priceRanges?.[0]
      
      return {
        id: event.id,
        name: event.name,
        type: event.type,
        segment: classification.segment?.name || null,
        genre: classification.genre?.name || null,
        subgenre: classification.subGenre?.name || null,
        date: event.dates?.start?.localDate || null,
        time: event.dates?.start?.localTime || null,
        on_sale: event.dates?.status?.code === 'onsale',
        url: event.url,
        image_url: bestImage?.url || null,
        image_count: images.length,
        min_price: priceRange?.min || null,
        max_price: priceRange?.max || null,
        currency: priceRange?.currency || null,
        venue: {
          name: venue.name,
          id: venue.id,
          city: venue.city?.name || null,
          state: venue.state?.stateCode || null,
          address: venue.address?.line1 || null,
          postal_code: venue.postalCode || null,
          lat: venue.location?.latitude ? parseFloat(venue.location.latitude) : null,
          lng: venue.location?.longitude ? parseFloat(venue.location.longitude) : null,
          url: venue.url || null,
          image: venue.images?.[0]?.url || null,
          parking: venue.parkingDetail || null,
          accessible_seating: venue.accessibleSeatingDetail || null,
          general_rule: venue.generalInfo?.generalRule || null,
          child_rule: venue.generalInfo?.childRule || null,
        },
        seatmap: event.seatmap?.staticUrl || null,
        info: event.info || null,
        please_note: event.pleaseNote || null,
      }
    })

    return NextResponse.json({
      events,
      page: data.page,
      total_events: data.page?.totalElements || 0,
      total_pages: data.page?.totalPages || 0,
    })
  } catch (error) {
    console.error('Ticketmaster API error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
