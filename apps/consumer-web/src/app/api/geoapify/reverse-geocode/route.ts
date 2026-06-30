import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing "lat" and "lon" query parameters' }, { status: 400 })
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ error: 'Geoapify API key not configured' }, { status: 500 })
  }

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/reverse')
    url.searchParams.set('lat', lat)
    url.searchParams.set('lon', lon)
    url.searchParams.set('apiKey', GEOAPIFY_API_KEY)
    url.searchParams.set('format', 'json')

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
    const data = await res.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ results: [] })
    }

    return NextResponse.json({
      results: data.results.map((r: Record<string, unknown>) => ({
        lat: r.lat,
        lon: r.lon,
        formatted: r.formatted,
        city: r.city,
        state: r.state,
        country: r.country,
        postcode: r.postcode,
        street: r.street,
        housenumber: r.housenumber,
      })),
    })
  } catch (error) {
    console.error('[Geoapify reverse geocode error]', error)
    return NextResponse.json({ error: 'Reverse geocoding request failed' }, { status: 500 })
  }
}
