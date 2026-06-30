import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim()
  const phone = searchParams.get('phone')?.trim() ?? null
  const zip = searchParams.get('zip')?.trim() ?? null

  if (!query) {
    return NextResponse.json({ candidates: [] })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.rpc('fn_vendor_claim_search', {
      p_query: query,
      p_phone: phone ?? undefined,
      p_zip: zip ?? undefined,
      p_limit: 10,
    })

    if (error) {
      console.error('claim-search RPC error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ candidates: data ?? [] })
  } catch (err) {
    console.error('claim-search error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
