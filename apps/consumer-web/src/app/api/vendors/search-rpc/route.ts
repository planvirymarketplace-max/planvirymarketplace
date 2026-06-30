import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

interface FilterInput {
  filter_key: string
  value_text: string | null
  value_bool: boolean | null
  value_min: number | null
  value_max: number | null
}

interface SearchRequest {
  categoryKey: string
  filters?: FilterInput[]
  lat?: number
  lng?: number
  radiusMiles?: number
  availabilityDate?: string
  limit?: number
  offset?: number
}

/**
 * POST /api/vendors/search-rpc
 *
 * Calls the search_vendors() RPC function in Supabase with the provided
 * filter inputs. The RPC handles category matching, filter answer matching,
 * geo-distance, and availability checks.
 */
export async function POST(request: Request) {
  try {
    const body: SearchRequest = await request.json()

    if (!body.categoryKey) {
      return NextResponse.json(
        { error: 'categoryKey is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const filterInputs = body.filters ?? []

    // Transform filters into the format expected by the RPC
    // The RPC expects filter_input[] which is a composite type:
    // (filter_key TEXT, value_text TEXT, value_bool BOOLEAN, value_min NUMERIC, value_max NUMERIC)
    const rpcFilters = filterInputs.map((f) => ({
      filter_key: f.filter_key,
      value_text: f.value_text ?? null,
      value_bool: f.value_bool ?? null,
      value_min: f.value_min ?? null,
      value_max: f.value_max ?? null,
    }))

    const { data, error } = await supabase.rpc('search_vendors', {
      p_category_key: body.categoryKey,
      p_filters: rpcFilters,
      p_user_lat: body.lat ?? null,
      p_user_lng: body.lng ?? null,
      p_radius_miles: body.radiusMiles ?? 25,
      p_availability_date: body.availabilityDate ?? null,
      p_limit: body.limit ?? 12,
      p_offset: body.offset ?? 0,
    })

    if (error) {
      console.error('Supabase RPC error (search_vendors):', error)
      return NextResponse.json(
        { error: 'Failed to search vendors', details: error.message },
        { status: 500 }
      )
    }

    // The RPC returns an array of vendor results
    const vendors = Array.isArray(data) ? data : []
    const total = vendors.length

    return NextResponse.json({
      vendors,
      total,
      limit: body.limit ?? 12,
      offset: body.offset ?? 0,
    })
  } catch (error) {
    console.error('Error in search-rpc:', error)
    return NextResponse.json(
      { error: 'Failed to search vendors' },
      { status: 500 }
    )
  }
}
