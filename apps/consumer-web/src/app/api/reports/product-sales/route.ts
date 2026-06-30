import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/reports/product-sales?event_id=
// Returns per-tier sales breakdown: sold, revenue, available, sold-out status.
// Adapted from Hi.Events: ProductSalesReport

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  // Load all tiers for this event
  const { data: tiers, error: tierErr } = await supabase
    .from('ticket_tiers')
    .select('id, name, price_cents, quantity_total, quantity_reserved, sort_order')
    .eq('item_id', eventId)
    .order('sort_order', { ascending: true })

  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 500 })

  // Load all confirmed reservations for this event
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, status, quantity, total_price_cents')
    .eq('item_id', eventId)
    .in('status', ['CONFIRMED', 'COMPLETED'])

  const totalSold = (reservations ?? []).reduce((s: number, r: { quantity: number }) => s + r.quantity, 0)
  const totalRevenue = (reservations ?? []).reduce((s: number, r: { total_price_cents: number }) => s + r.total_price_cents, 0)

  const products = (tiers ?? []).map((t: {
    id: string; name: string; price_cents: number; quantity_total: number; quantity_reserved: number; sort_order: number;
  }) => {
    const available = t.quantity_total - t.quantity_reserved
    const soldCount = t.quantity_reserved
    const revenue = soldCount * t.price_cents
    return {
      tier_id: t.id,
      name: t.name,
      price_cents: t.price_cents,
      capacity: t.quantity_total,
      sold: soldCount,
      available: Math.max(0, available),
      revenue_cents: revenue,
      sell_through_rate: t.quantity_total > 0 ? Math.round((soldCount / t.quantity_total) * 100) : 0,
      is_sold_out: available <= 0,
    }
  })

  return NextResponse.json({
    products,
    totals: {
      total_tiers: products.length,
      total_sold: totalSold,
      total_revenue_cents: totalRevenue,
      total_capacity: (tiers ?? []).reduce((s: number, t: { quantity_total: number }) => s + t.quantity_total, 0),
    },
  })
}
