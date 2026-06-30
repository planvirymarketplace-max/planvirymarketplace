import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/product-sort — reorder ticket tiers within an event
// Body: { event_id, tier_order: [tier_id_1, tier_id_2, ...] }
// Adapted from Hi.Events: SortProductsHandler

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, tier_order } = body

  if (!event_id || !Array.isArray(tier_order)) {
    return NextResponse.json({ error: 'event_id and tier_order[] are required' }, { status: 400 })
  }

  // Verify user owns the event
  const { data: event } = await supabase
    .from('inventory_items')
    .select('vendor_id')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('role')
    .eq('vendor_id', event.vendor_id)
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  // Update sort_order for each tier
  for (let i = 0; i < tier_order.length; i++) {
    await supabase
      .from('ticket_tiers')
      .update({ sort_order: i })
      .eq('id', tier_order[i])
      .eq('item_id', event_id)
  }

  // Return updated tiers
  const { data: tiers } = await supabase
    .from('ticket_tiers')
    .select('id, name, sort_order')
    .eq('item_id', event_id)
    .order('sort_order', { ascending: true })

  return NextResponse.json({
    event_id,
    tiers,
    reordered: true,
  })
}
