import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/travel/search
// Search lodging vendors via Supabase listings table (Travel & Lodging vertical)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let query = supabase
    .from('listings')
    .select('id, name, slug, city, state, planviry_vertical, planviry_sub_category, lat, lng, phone, website, profile_image_url, avg_rating, review_count, price_tier, is_claimed, instant_book')
    .eq('planviry_vertical', 'Accommodations & Lodging')
    .limit(limit)

  if (city) query = query.eq('city', city)
  if (state) query = query.eq('state', state)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ properties: data ?? [] })
}
