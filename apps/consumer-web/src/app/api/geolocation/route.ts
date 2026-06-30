import { NextResponse } from 'next/server'

export async function GET() {
  // Default geolocation for Milwaukee, WI (Planviry's home market)
  // When Supabase is connected, this will use the user's IP via Geoapify
  return NextResponse.json({
    city: 'Milwaukee',
    state: 'WI',
    lat: 43.0389,
    lng: -87.9065,
    country: 'US',
  })
}
