import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/travel/listings/[id] — lodging listing detail + availability
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: listing, error } = await supabase
    .from('inventory_items')
    .select(`
      *,
      vendor_accounts!inner(name, slug),
      media_assets(url, alt_text, is_primary),
      availability_blocks(id, start_time, end_time, total_capacity, reserved_capacity, is_available)
    `)
    .eq('id', id)
    .eq('category', 'LODGING')
    .maybeSingle()

  if (error || !listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  // Get existing reservations for date-range conflict display
  const { data: reservations } = await supabase
    .from('reservations')
    .select('starts_at, ends_at, status')
    .eq('item_id', id)
    .in('status', ['PENDING', 'CONFIRMED'])

  return NextResponse.json({
    listing,
    booked_dates: (reservations ?? []).map((r: { starts_at: string; ends_at: string }) => ({
      start: r.starts_at,
      end: r.ends_at,
    })),
  })
}
