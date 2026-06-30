import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/promo-codes/[id]/validate?code=X&event_id=Y
// Validates a promo code: exists, not expired, under max_uses.
// Adapted from Hi.Events: promo code validation in OrderCreateRequestValidationService

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createAdminClient()
  const { id: eventId } = await params
  const body = await request.json()
  const { code, order_total_cents } = body

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Code is required' }, { status: 400 })
  }

  // Load event metadata
  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ valid: false, error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const promoCodes = (meta.promo_codes as Array<Record<string, unknown>>) ?? []

  const promo = promoCodes.find((p) => p.code === code.toUpperCase())

  if (!promo) {
    return NextResponse.json({ valid: false, error: 'Invalid promo code' }, { status: 404 })
  }

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at as string) < new Date()) {
    return NextResponse.json({ valid: false, error: 'Promo code has expired' }, { status: 410 })
  }

  // Check max uses
  if (promo.max_uses !== null && (promo.uses as number) >= (promo.max_uses as number)) {
    return NextResponse.json({ valid: false, error: 'Promo code usage limit reached' }, { status: 410 })
  }

  // Calculate discount
  let discountCents = 0
  if (promo.discount_type === 'PERCENTAGE') {
    discountCents = Math.round((order_total_cents * (promo.discount_value as number)) / 100)
  } else {
    discountCents = promo.discount_value as number
  }

  const newTotal = Math.max(0, order_total_cents - discountCents)

  return NextResponse.json({
    valid: true,
    promo_code: promo.code,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_cents: discountCents,
    new_total_cents: newTotal,
  })
}
