import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

/**
 * Geoapify Routing API - calculates travel distance and duration
 * between two points. Used for travel fee radius calculation.
 *
 * Query params:
 *   fromLat, fromLon - origin coordinates
 *   toLat, toLon     - destination coordinates
 *   mode             - travel mode: "drive" (default), "walk", "bicycle"
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fromLat = searchParams.get('fromLat')
  const fromLon = searchParams.get('fromLon')
  const toLat = searchParams.get('toLat')
  const toLon = searchParams.get('toLon')
  const mode = searchParams.get('mode') || 'drive'

  if (!fromLat || !fromLon || !toLat || !toLon) {
    return NextResponse.json(
      { error: 'Missing coordinates. Required: fromLat, fromLon, toLat, toLon' },
      { status: 400 },
    )
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ error: 'Geoapify API key not configured' }, { status: 500 })
  }

  try {
    const modeMap: Record<string, string> = {
      drive: 'car',
      walk: 'foot',
      bicycle: 'bicycle',
    }
    const profile = modeMap[mode] || 'car'

    const url = new URL(`https://api.geoapify.com/v1/routing`)
    url.searchParams.set('waypoints', `${fromLat},${fromLon}|${toLat},${toLon}`)
    url.searchParams.set('mode', profile)
    url.searchParams.set('apiKey', GEOAPIFY_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    const data = await res.json()

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ error: 'No route found' }, { status: 404 })
    }

    const feature = data.features[0]
    const props = feature.properties || {}

    return NextResponse.json({
      distanceMeters: props.distance,
      durationSeconds: props.time,
      distanceMiles: props.distance ? Math.round((props.distance / 1609.34) * 10) / 10 : null,
      durationMinutes: props.time ? Math.round(props.time / 60) : null,
    })
  } catch (error) {
    console.error('[Geoapify route error]', error)
    return NextResponse.json({ error: 'Routing request failed' }, { status: 500 })
  }
}
