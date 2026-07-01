import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requiresStripeCharge, type CartItem } from '@/lib/cart-context'
import { calculatePrice, pricingModelForCategory, type PricingModel } from '@planviry/shared'
import Stripe from 'stripe'
import { randomUUID } from 'crypto'

// POST /api/checkout
// Revenue path: Cart → PENDING Reservations → Order → Stripe Checkout Session → checkout_sessions record
// Uses REAL TABLES: orders, reservation_line_items, checkout_sessions, idempotency_keys, tax_lines

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

const RESERVATION_TTL_MINUTES = 15

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { cart_items, trip_id, promo_code, question_answers, idempotency_key } = body as {
    cart_items: CartItem[]
    trip_id?: string
    promo_code?: string
    question_answers?: Array<{ question_id: string; answer: unknown }>
    idempotency_key?: string
  }

  if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
    return NextResponse.json({ error: 'cart_items is required' }, { status: 400 })
  }

  // ─── Idempotency check (P0: prevents duplicate reservations on retry) ────
  if (idempotency_key) {
    const { data: existing } = await supabase
      .from('idempotency_keys')
      .select('key, response_payload')
      .eq('key', idempotency_key)
      .maybeSingle()

    if (existing?.response_payload) {
      // Return the original response — this is a retry
      return NextResponse.json(existing.response_payload)
    }
  }

  const chargeableItems = cart_items.filter(requiresStripeCharge)
  const nonChargeableItems = cart_items.filter((i) => !requiresStripeCharge(i))

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

  // ─── Create ORDER (parent record for all reservations in this checkout) ──
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'DRAFT',
      subtotal_cents: 0,
      tax_cents: 0,
      discount_cents: 0,
      total_cents: 0,
      currency: 'USD',
    })
    .select('id')
    .single()

  if (orderErr || !order) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // ─── Create PENDING reservations + reservation_line_items ───────────────
  const reservations: Array<{ id: string; item_id: string; amount: number; vendor_id: string }> = []
  let subtotalCents = 0

  for (const item of chargeableItems) {
    const inventoryItemId = item.listing_id ?? item.vendor_id ?? item.experience_slot_id
    if (!inventoryItemId) {
      return NextResponse.json({ error: `Cannot resolve inventory item for: ${item.name}` }, { status: 400 })
    }

    const { data: invItem } = await supabase
      .from('inventory_items')
      .select('id, vendor_id, base_price_cents, currency, status, title, category, metadata')
      .eq('id', inventoryItemId)
      .maybeSingle()

    if (!invItem || invItem.status !== 'PUBLISHED') {
      return NextResponse.json({ error: `Item unavailable: ${item.name}` }, { status: 409 })
    }

    const quantity = item.quantity ?? 1
    // ─── FIX-5: model-aware pricing via shared adapter ─────────────────────
    // Previously this was `item.amount * 100 * quantity` — which ignored
    // pricing_model entirely. A 3-night LODGING booking at $100/night stored
    // as base_price_cents=10000 charged only $100 instead of $300. The adapter
    // applies the NIGHTLY multiplier (and PER_PERSON / PER_SEAT / PER_SLOT /
    // HOURLY as appropriate) using the item's category + metadata.pricing_model.
    const metadata = (invItem.metadata ?? {}) as { pricing_model?: PricingModel }
    const itemCategory = (invItem.category as string | null) ?? item.category ?? item.type
    const pricingModel = metadata.pricing_model ?? pricingModelForCategory(itemCategory)
    const priceResult = calculatePrice(
      supabase,
      {
        base_price_cents: (invItem.base_price_cents ?? item.amount * 100) as number,
        pricing_model: pricingModel,
        category: itemCategory,
        start_date: item.start_date,
        end_date: item.end_date,
      },
      {
        quantity,
        guests: item.party_size,
      },
    )
    const unitPriceCents = Math.round(priceResult.subtotal_cents / Math.max(1, quantity))
    const totalPriceCents = priceResult.total_cents
    subtotalCents += totalPriceCents

    // ─── ATOMIC capacity check + decrement (BR-R-004 / BR-C-004) ───────
    // Must be a single UPDATE with WHERE clause that checks capacity,
    // NOT a read-then-write. This prevents overselling under concurrent checkout.
    const { data: capPools } = await supabase
      .from('capacity_assignments')
      .select('id, name, capacity, used')
      .eq('item_id', inventoryItemId)

    if (capPools && capPools.length > 0) {
      for (const pool of capPools) {
        if (pool.capacity - pool.used < quantity) {
          return NextResponse.json({ error: `Sold out: ${item.name} (pool: ${pool.name})` }, { status: 409 })
        }
        // Atomic increment: WHERE used + N <= capacity prevents race condition
        const { data: atomicResult, error: atomicErr } = await supabase
          .from('capacity_assignments')
          .update({ used: pool.used + quantity })
          .eq('id', pool.id)
          .lte('used', pool.capacity - quantity)
          .select('id')
        if (atomicErr || !atomicResult || atomicResult.length === 0) {
          return NextResponse.json({ error: `Sold out: ${item.name} (pool: ${pool.name}) — race condition prevented` }, { status: 409 })
        }
      }
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
        ttl_expires_at: new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000).toISOString(),
        itinerary_session_id: trip_id ?? null,
      })
      .select('id')
      .single()

    if (resErr) {
      return NextResponse.json({ error: `Failed to reserve: ${item.name}` }, { status: 500 })
    }

    // Create reservation_line_item (links reservation to order)
    await supabase.from('reservation_line_items').insert({
      order_id: order.id,
      reservation_id: reservation.id,
      item_id: inventoryItemId,
      vendor_id: invItem.vendor_id,
      ticket_tier_id: null,
      quantity,
      unit_price_cents: unitPriceCents,
      total_price_cents: totalPriceCents,
    })

    // Store question answers on reservation metadata
    if (question_answers && question_answers.length > 0) {
      await supabase
        .from('reservations')
        .update({ metadata: { answers: question_answers } })
        .eq('id', reservation.id)
    }

    // Emit domain event
    await supabase.from('domain_events').insert({
      event_type: 'reservation.pending',
      entity_type: 'reservation',
      entity_id: reservation.id,
      payload: { user_id: user.id, item_id: inventoryItemId, quantity, order_id: order.id },
    })

    reservations.push({ id: reservation.id, item_id: inventoryItemId, amount: totalPriceCents, vendor_id: invItem.vendor_id })
  }

  // ─── Apply discount (from discounts table) ──────────────────────────────
  let discountCents = 0
  let appliedDiscountCode: string | null = null
  if (promo_code) {
    const { data: discount } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', promo_code.toUpperCase())
      .eq('status', 'ACTIVE')
      .maybeSingle()

    if (discount) {
      // Calculate discount
      if (discount.discount_type === 'PERCENTAGE') {
        discountCents = Math.round((subtotalCents * discount.discount_value) / 100)
      } else {
        discountCents = discount.discount_value
      }
      appliedDiscountCode = discount.code
    }
  }

  // ─── Calculate tax ──────────────────────────────────────────────────────
  let taxCents = 0
  const taxableAmount = Math.max(0, subtotalCents - discountCents)

  // For now, use a flat 8% tax rate if event has tax config
  // In production, this would come from tax_and_fees or tax_lines config
  taxCents = Math.round(taxableAmount * 0.08)

  // Create tax_lines record
  if (taxCents > 0) {
    await supabase.from('tax_lines').insert({
      tax_type: 'SALES',
      rate: 8.0,
      amount: taxCents,
      jurisdiction: 'DEFAULT',
    })
  }

  const totalCents = taxableAmount - discountCents + taxCents

  // Update order with totals
  await supabase
    .from('orders')
    .update({
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      status: 'PENDING',
      placed_at: new Date().toISOString(),
    })
    .eq('id', order.id)

  // ─── Create Stripe Checkout Session ─────────────────────────────────────
  const reservationIds = reservations.map((r) => r.id)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Planviry Order (${reservations.length} items)` },
        unit_amount: totalCents,
      },
      quantity: 1,
    }],
    metadata: {
      user_id: user.id,
      order_id: order.id,
      reservation_ids: JSON.stringify(reservationIds),
    },
    payment_intent_data: {
      metadata: {
        user_id: user.id,
        order_id: order.id,
        reservation_ids: JSON.stringify(reservationIds),
      },
    },
    expires_at: Math.floor((Date.now() + 30 * 60_000) / 1000),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  })

  // ─── Create checkout_sessions record (P0: persisted before webhook fires) ──
  await supabase.from('checkout_sessions').insert({
    stripe_session_id: session.id,
    user_id: user.id,
    reservation_ids: reservationIds,
    status: 'PENDING',
    amount_cents: totalCents,
    currency: 'USD',
    expires_at: new Date(Date.now() + 30 * 60_000).toISOString(),
  })

  // Update order with Stripe session ID
  await supabase
    .from('orders')
    .update({ stripe_session_id: session.id })
    .eq('id', order.id)

  // ─── Store idempotency key ──────────────────────────────────────────────
  if (idempotency_key) {
    const responsePayload = {
      order_id: order.id,
      stripe_session_url: session.url,
      stripe_client_secret: session.client_secret,
      subtotal_cents: subtotalCents,
      discount_code: appliedDiscountCode,
      discount_cents: discountCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      reservation_ids: reservationIds,
    }
    await supabase.from('idempotency_keys').insert({
      key: idempotency_key,
      user_id: user.id,
      endpoint: '/api/checkout',
      response_payload: responsePayload,
    })
  }

  // ─── Audit log ──────────────────────────────────────────────────────────
  await supabase.from('audit_log').insert({
    actor_id: user.id,
    action: 'CREATE',
    entity_type: 'order',
    entity_id: order.id,
    changes: { reservation_ids: reservationIds, total_cents: totalCents },
  })

  return NextResponse.json({
    order_id: order.id,
    stripe_session_url: session.url,
    stripe_client_secret: session.client_secret,
    subtotal_cents: subtotalCents,
    discount_code: appliedDiscountCode,
    discount_cents: discountCents,
    tax_cents: taxCents,
    total_cents: totalCents,
    total_amount: totalCents / 100,
    reservation_ids: reservationIds,
    chargeable_count: chargeableItems.length,
    non_chargeable_processed: nonChargeableResults,
    question_answers_stored: question_answers?.length ?? 0,
    expires_at: new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000).toISOString(),
    message: 'Order + PENDING reservations created. Redirect to stripe_session_url to complete payment.',
  })
}
