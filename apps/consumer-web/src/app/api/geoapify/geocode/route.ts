import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text')
  const limit = searchParams.get('limit') || '1'

  if (!text) {
    return NextResponse.json({ error: 'Missing "text" query parameter' }, { status: 400 })
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ error: 'Geoapify API key not configured' }, { status: 500 })
  }

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/search')
    url.searchParams.set('text', text)
    url.searchParams.set('limit', limit)
    url.searchParams.set('apiKey', GEOAPIFY_API_KEY)
    url.searchParams.set('format', 'json')
    url.searchParams.set('country', 'US')
    url.searchParams.set('type', 'city')

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } }) // cache 24h
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
      })),
    })
  } catch (error) {
    console.error('[Geoapify geocode error]', error)
    return NextResponse.json({ error: 'Geocoding request failed' }, { status: 500 })
  }
}
