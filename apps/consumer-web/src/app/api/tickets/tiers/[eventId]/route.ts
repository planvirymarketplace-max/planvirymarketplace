import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/tickets/tiers/[eventId]
// Fetches ticket tiers for an event with live availability calculation.
// Adapted from Hi.Events: available = quantity_total - quantity_reserved.
// Uses new schema: ticket_tiers (quantity_total, quantity_reserved — not sold_count).

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  const supabase = createAdminClient()

  // Load tiers
  const { data: tiers, error } = await supabase
    .from('ticket_tiers')
    .select('id, item_id, name, description, price_cents, quantity_total, quantity_reserved, sort_order')
    .eq('item_id', eventId)
    .order('sort_order', { ascending: true })
    .order('price_cents', { ascending: true })

  if (error) {
    console.error('[tiers] DB error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Compute availability (Hi.Events pattern: live calculation, not stored)
  const tiersWithAvailability = (tiers ?? []).map((tier: {
    id: string; name: string; description: string | null;
    price_cents: number; quantity_total: number; quantity_reserved: number; sort_order: number;
  }) => {
    const available = tier.quantity_total - tier.quantity_reserved
    return {
      id: tier.id,
      event_id: eventId,
      name: tier.name,
      description: tier.description,
      price: tier.price_cents, // keep old field name for frontend compat
      price_cents: tier.price_cents,
      capacity: tier.quantity_total,
      sold_count: tier.quantity_reserved, // keep old field name for frontend compat
      quantity_total: tier.quantity_total,
      quantity_reserved: tier.quantity_reserved,
      available: Math.max(0, available),
      is_sold_out: available <= 0,
      sort_order: tier.sort_order,
    }
  })

  return NextResponse.json({ tiers: tiersWithAvailability })
}
