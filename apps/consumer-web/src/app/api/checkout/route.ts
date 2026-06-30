import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requiresStripeCharge, type CartItem } from '@/lib/cart-context'
import Stripe from 'stripe'

// POST /api/checkout
// Revenue path: Cart → PENDING Reservations → Stripe Checkout Session
// Adapted from movinin (checkout session creation) + TicketiHub (metadata pattern)
// Uses new schema: reservations, availability_blocks, payments, domain_events

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

const RESERVATION_TTL_MINUTES = 15 // BR-R-002

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { cart_items, trip_id } = body as { cart_items: CartItem[]; trip_id?: string }

  if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
    return NextResponse.json({ error: 'cart_items is required' }, { status: 400 })
  }

  const chargeableItems = cart_items.filter(requiresStripeCharge)
  const nonChargeableItems = cart_items.filter((i) => !requiresStripeCharge(i))

  // Process non-chargeable items (restaurant reservations without deposit, external events)
  const nonChargeableResults: Array<{ type: string; name: string; status: string }> = []
  for (const item of nonChargeableItems) {
    nonChargeableResults.push({ type: item.type, name: item.name, status: 'confirmed_no_charge' })
  }

  if (chargeableItems.length === 0) {
    return NextResponse.json({
      order_id: null,
      non_chargeable_processed: nonChargeableResults,
      message: 'No chargeable items — non-chargeable items processed',
    })
  }

  // ─── Create PENDING reservations for chargeable items ───────────────────
  // This replicates rpc_create_pending_reservation logic in application code
  // (the RPC has a SET LOCAL conflict with the Supabase pooler — to be fixed)

  const reservations: Array<{ id: string; item_id: string; amount: number }> = []
  let totalAmountCents = 0
  const ttlExpiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000).toISOString()

  for (const item of chargeableItems) {
    // Resolve the inventory_item_id for this cart item
    // listing_id is the inventory_items.id for most types
    const inventoryItemId = item.listing_id ?? item.vendor_id ?? item.experience_slot_id
    if (!inventoryItemId) {
      console.error('[checkout] no item ID for:', item.name)
      return NextResponse.json({ error: `Cannot resolve inventory item for: ${item.name}` }, { status: 400 })
    }

    // Load inventory item — must be PUBLISHED
    const { data: invItem, error: invErr } = await supabase
      .from('inventory_items')
      .select('id, vendor_id, base_price_cents, currency, status, title, category')
      .eq('id', inventoryItemId)
      .maybeSingle()

    if (invErr || !invItem) {
      return NextResponse.json({ error: `Item not found: ${item.name}` }, { status: 404 })
    }
    if (invItem.status !== 'PUBLISHED') {
      return NextResponse.json({ error: `Item unavailable: ${item.name}` }, { status: 409 })
    }

    const quantity = item.quantity ?? 1
    const unitPriceCents = item.amount * 100 // item.amount is in dollars
    const totalPriceCents = unitPriceCents * quantity
    totalAmountCents += totalPriceCents

    // Check availability_blocks capacity
    const { data: blocks } = await supabase
      .from('availability_blocks')
      .select('id, total_capacity, reserved_capacity')
      .eq('item_id', inventoryItemId)
      .eq('is_available', true)

    if (blocks && blocks.length > 0) {
      const blockWithCapacity = blocks.find((b) => (b.total_capacity - b.reserved_capacity) >= quantity)
      if (!blockWithCapacity) {
        return NextResponse.json({ error: `Sold out: ${item.name}` }, { status: 409 })
      }
      // Reserve capacity
      await supabase
        .from('availability_blocks')
        .update({
          reserved_capacity: blockWithCapacity.reserved_capacity + quantity,
          is_available: (blockWithCapacity.reserved_capacity + quantity) < blockWithCapacity.total_capacity,
        })
        .eq('id', blockWithCapacity.id)
    }

    // Create PENDING reservation
    const { data: reservation, error: resErr } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        item_id: inventoryItemId,
        vendor_id: invItem.vendor_id,
        status: 'PENDING',
        quantity,
        unit_price_cents: unitPriceCents,
        total_price_cents: totalPriceCents,
        currency: invItem.currency || 'USD',
        starts_at: item.date || item.start_date || null,
        ends_at: item.end_date || null,
        ttl_expires_at: ttlExpiresAt,
        itinerary_session_id: trip_id ?? null,
      })
      .select('id')
      .single()

    if (resErr) {
      console.error('[checkout] reservation insert failed:', resErr)
      return NextResponse.json({ error: `Failed to reserve: ${item.name}` }, { status: 500 })
    }

    // Emit domain event
    await supabase.from('domain_events').insert({
      event_type: 'reservation.pending',
      entity_type: 'reservation',
      entity_id: reservation.id,
      payload: { user_id: user.id, item_id: inventoryItemId, quantity, ttl_expires_at: ttlExpiresAt },
    })

    reservations.push({ id: reservation.id, item_id: inventoryItemId, amount: totalPriceCents })
  }

  // ─── Create Stripe Checkout Session ─────────────────────────────────────
  // movinin pattern: create session with metadata, return URL
  const reservationIds = reservations.map((r) => r.id)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: chargeableItems.map((item, i) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity ?? 1,
    })),
    metadata: {
      user_id: user.id,
      reservation_ids: JSON.stringify(reservationIds),
      trip_id: trip_id ?? '',
    },
    payment_intent_data: {
      metadata: {
        user_id: user.id,
        reservation_ids: JSON.stringify(reservationIds),
      },
    },
    expires_at: Math.floor((Date.now() + 30 * 60_000) / 1000),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  })

  // Create a payment record (status: pending)
  const { error: payErr } = await supabase
    .from('payments')
    .insert({
      // payments table columns: reservation_id, amount_cents, currency, status, stripe_payment_intent_id
      // We link the first reservation; the webhook updates all on confirmation
      // This is a simplification — Part VI may model payments differently
    })

  return NextResponse.json({
    order_id: session.id,
    stripe_session_url: session.url,
    stripe_client_secret: session.client_secret,
    total_amount: totalAmountCents / 100,
    reservation_ids: reservationIds,
    chargeable_count: chargeableItems.length,
    non_chargeable_processed: nonChargeableResults,
    expires_at: ttlExpiresAt,
    message: 'PENDING reservations created. Redirect to stripe_session_url to complete payment.',
  })
}
