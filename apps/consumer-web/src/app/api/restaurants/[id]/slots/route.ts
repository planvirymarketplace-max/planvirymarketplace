import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/restaurants/[id]/slots
// Fetch available reservation slots for a date + party size (Part 43)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: restaurantId } = await params
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const date = searchParams.get('date')
  const partySize = parseInt(searchParams.get('partySize') ?? '2')

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('restaurant_availability_slots')
    .select('id, slot_date, slot_time, party_size_min, party_size_max, is_available')
    .eq('restaurant_id', restaurantId)
    .eq('slot_date', date)
    .eq('is_available', true)
    .gte('party_size_max', partySize)
    .order('slot_time', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slots: data ?? [] })
}
