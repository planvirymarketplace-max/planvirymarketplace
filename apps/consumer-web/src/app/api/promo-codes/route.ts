import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/promo-codes — create promo code
// GET /api/promo-codes?event_id= — list promo codes for an event
// Adapted from Hi.Events: CreatePromoCodeHandler, PromoCode model

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  // Promo codes stored in inventory_items.metadata.promo_codes array
  if (!eventId) {
    return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const promoCodes = (meta.promo_codes as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ promo_codes: promoCodes })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, code, discount_type, discount_value, max_uses, expires_at } = body

  if (!event_id || !code || !discount_type || !discount_value) {
    return NextResponse.json({ error: 'event_id, code, discount_type, discount_value are required' }, { status: 400 })
  }

  // Load event metadata
  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const promoCodes = (meta.promo_codes as Array<Record<string, unknown>>) ?? []

  // Check for duplicate code
  if (promoCodes.some((p) => p.code === code.toUpperCase())) {
    return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 })
  }

  const newCode = {
    id: randomUUID(),
    code: code.toUpperCase(),
    discount_type, // 'PERCENTAGE' | 'FIXED'
    discount_value, // percentage (0-100) or cents
    max_uses: max_uses ?? null, // null = unlimited
    uses: 0,
    expires_at: expires_at ?? null,
    created_by: user.id,
    created_at: new Date().toISOString(),
  }

  promoCodes.push(newCode)

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, promo_codes: promoCodes } })
    .eq('id', event_id)

  return NextResponse.json({ promo_code: newCode }, { status: 201 })
}
