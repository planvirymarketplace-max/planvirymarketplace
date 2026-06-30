import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/waitlist — join waitlist when ticket tier is sold out
// GET /api/waitlist?tier_id= — get waitlist entries for a tier
// Adapted from Hi.Events: WaitlistEntry model, CreateWaitlistEntryHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const tierId = searchParams.get('tier_id')

  if (!tierId) return NextResponse.json({ error: 'tier_id is required' }, { status: 400 })

  // Waitlist stored in ticket_tiers metadata.waitlist array
  const { data: tier } = await supabase
    .from('ticket_tiers')
    .select('metadata, quantity_total, quantity_reserved')
    .eq('id', tierId)
    .maybeSingle()

  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  const meta = (tier.metadata as Record<string, unknown>) ?? {}
  const waitlist = (meta.waitlist as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({
    waitlist: waitlist.sort((a, b) => (a.position as number) - (b.position as number)),
    total: waitlist.length,
    tier_stats: {
      quantity_total: tier.quantity_total,
      quantity_reserved: tier.quantity_reserved,
      available: tier.quantity_total - tier.quantity_reserved,
    },
  })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { tier_id, quantity = 1, email } = body

  if (!tier_id) return NextResponse.json({ error: 'tier_id is required' }, { status: 400 })

  const { data: tier } = await supabase
    .from('ticket_tiers')
    .select('metadata, quantity_total, quantity_reserved')
    .eq('id', tier_id)
    .maybeSingle()

  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  // Only allow waitlist if sold out
  const available = tier.quantity_total - tier.quantity_reserved
  if (available >= quantity) {
    return NextResponse.json({ error: 'Tier is not sold out — purchase directly', available }, { status: 409 })
  }

  const meta = (tier.metadata as Record<string, unknown>) ?? {}
  const waitlist = (meta.waitlist as Array<Record<string, unknown>>) ?? []

  // Check if already on waitlist
  if (waitlist.some((e) => e.user_id === user.id)) {
    return NextResponse.json({ error: 'Already on waitlist' }, { status: 409 })
  }

  const entry = {
    id: randomUUID(),
    user_id: user.id,
    email: email ?? null,
    quantity,
    position: waitlist.length + 1,
    status: 'WAITING', // WAITING | OFFERED | ACCEPTED | DECLINED | EXPIRED
    created_at: new Date().toISOString(),
    offer_expires_at: null,
  }

  waitlist.push(entry)

  await supabase
    .from('ticket_tiers')
    .update({ metadata: { ...meta, waitlist } })
    .eq('id', tier_id)

  return NextResponse.json({ waitlist_entry: entry }, { status: 201 })
}
