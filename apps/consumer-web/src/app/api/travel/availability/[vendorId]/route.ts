import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/travel/availability/[vendorId]
// Check vendor_lodging_blocks for date range availability (Part 36.3)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let query = supabase
    .from('vendor_lodging_blocks')
    .select('id, start_date, end_date, block_type, booking_id')
    .eq('vendor_id', vendorId)
    .order('start_date', { ascending: true })

  if (startDate) query = query.gte('start_date', startDate)
  if (endDate) query = query.lte('end_date', endDate)

  const { data: blocks, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Check if requested range overlaps any block
  let isAvailable = true
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    for (const block of blocks ?? []) {
      const blockStart = new Date(block.start_date)
      const blockEnd = new Date(block.end_date)
      if (start < blockEnd && end > blockStart) {
        isAvailable = false
        break
      }
    }
  }

  return NextResponse.json({
    vendor_id: vendorId,
    is_available: isAvailable,
    blocked_ranges: blocks ?? [],
  })
}
