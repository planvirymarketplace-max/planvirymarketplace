import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/tickets/tiers/[eventId]
// Fetches ticket tiers for an event (Part 12)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ticket_tiers')
    .select('id, event_id, name, price, capacity, sold_count, description')
    .eq('event_id', eventId)
    .order('price', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Compute availability
  const tiers = (data ?? []).map((tier) => ({
    ...tier,
    available: tier.capacity - tier.sold_count,
    is_sold_out: tier.sold_count >= tier.capacity,
  }))

  return NextResponse.json({ tiers })
}
