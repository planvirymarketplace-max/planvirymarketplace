import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getMockVendors } from '@/data/mock-vendors'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const vertical = searchParams.get('vertical') ?? ''
  const city = searchParams.get('city') ?? ''
  const state = searchParams.get('state') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  // Try Supabase first
  try {
    const supabase = createAdminClient()

    let qb = supabase.from('vendors').select('*')

    if (query) {
      qb = qb.or(`business_name.ilike.%${query}%,description.ilike.%${query}%`)
    }
    if (vertical) {
      qb = qb.eq('vertical_slug', vertical)
    }
    if (city) {
      qb = qb.ilike('city', `%${city}%`)
    }
    if (state) {
      qb = qb.eq('state', state)
    }

    qb = qb.order('rating', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error } = await qb

    if (!error && data && data.length > 0) {
      return NextResponse.json({ vendors: data, count: data.length })
    }
  } catch {
    // Supabase not available or table doesn't exist - fall through to mock data
  }

  // Fallback: generate mock vendors using the query as the category
  const category = query || vertical || 'Services'
  const mockData = getMockVendors(category, undefined, Math.min(limit, 50))

  return NextResponse.json({ vendors: mockData, count: mockData.length })
}
