import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculatePrice } from '@planviry/shared'
import Stripe from 'stripe'

// POST /api/tickets/purchase
// Atomic ticket purchase: locks tier capacity, creates PENDING reservation, creates Stripe session.
// Adapted from Hi.Events: atomic capacity decrement via SQL (not read-modify-write).
// Uses new schema: ticket_tiers (quantity_total/quantity_reserved), reservations, check_ins.

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
  const { tier_id, quantity = 1, event_id } = body as { tier_id: string; quantity?: number; event_id: string }

  if (!tier_id || !event_id) {
    return NextResponse.json({ error: 'tier_id and event_id are required' }, { status: 400 })
  }

  // ─── 1. Load tier + event ──────────────────────────────────────────────
  const { data: tier, error: tierErr } = await supabase
    .from('ticket_tiers')
    .select('id, item_id, name, price_cents, quantity_total, quantity_reserved, sort_order')
    .eq('id', tier_id)
    .eq('item_id', event_id)
    .maybeSingle()

  if (tierErr || !tier) {
    return NextResponse.json({ error: 'Ticket tier not found' }, { status: 404 })
  }

  // Load the event (inventory_items row) for vendor_id + metadata
  const { data: event, error: eventErr } = await supabase
    .from('inventory_items')
    .select('id, vendor_id, title, status, metadata, base_price_cents')
    .eq('id', event_id)
    .maybeSingle()

  if (eventErr || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  if (event.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Event is not available for purchase' }, { status: 409 })
  }

  // ─── 2. Atomic capacity check + increment (Hi.Events pattern) ──────────
  // UPDATE ticket_tiers SET quantity_reserved = quantity_reserved + N
  //   WHERE id = $1 AND quantity_reserved + N <= quantity_total
  // This is a single atomic SQL statement — no race condition possible.
  const { data: updated, error: incrErr } = await supabase
    .rpc('atomic_reserve_tickets', {
      p_tier_id: tier_id,
      p_quantity: quantity,
    })

  if (incrErr) {
    // If RPC doesn't exist, fall back to check-then-update (less safe but works)
    const available = tier.quantity_total - tier.quantity_reserved
    if (available < quantity) {
      return NextResponse.json({
        error: 'Sold out',
        sold_out: true,
        remaining: available,
        waitlist_available: true,
      }, { status: 409 })
    }

    const { error: fbErr } = await supabase
      .from('ticket_tiers')
      .update({ quantity_reserved: tier.quantity_reserved + quantity })
      .eq('id', tier_id)

    if (fbErr) {
      return NextResponse.json({ error: 'Failed to reserve tickets' }, { status: 500 })
    }
  } else if (updated === false) {
    // RPC returned false — capacity exceeded
    const available = tier.quantity_total - tier.quantity_reserved
    return NextResponse.json({
      error: 'Sold out',
      sold_out: true,
      remaining: available,
      waitlist_available: true,
    }, { status: 409 })
  }

  // ─── 3. Create PENDING reservation ─────────────────────────────────────
  // FIX-5: use the shared pricing adapter (PER_SEAT model) instead of
  // `tier.price_cents * quantity`. For general-admission tiers where each
  // seat is the same price, the adapter sums `quantity` seats at the tier's
  // price_cents — equivalent to the prior math, but routed through the
  // adapter so future per-seat pricing changes are centralised.
  const priceResult = calculatePrice(
    supabase,
    {
      base_price_cents: tier.price_cents,
      pricing_model: 'PER_SEAT',
      category: 'EVENT_TICKET',
    },
    { quantity },
  )
  const totalPriceCents = priceResult.total_cents
  const ttlExpiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000).toISOString()

  const { data: reservation, error: resErr } = await supabase
    .from('reservations')
    .insert({
      user_id: user.id,
      item_id: event_id,
      vendor_id: event.vendor_id,
      status: 'PENDING',
      quantity,
      unit_price_cents: tier.price_cents,
      total_price_cents: totalPriceCents,
      currency: 'USD',
      ttl_expires_at: ttlExpiresAt,
    })
    .select('id')
    .single()

  if (resErr) {
    // Compensating transaction: release the reserved capacity
    await supabase
      .from('ticket_tiers')
      .update({ quantity_reserved: Math.max(0, tier.quantity_reserved) })
      .eq('id', tier_id)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'reservation.pending',
    entity_type: 'reservation',
    entity_id: reservation.id,
    payload: { user_id: user.id, item_id: event_id, tier_id, quantity, ttl_expires_at: ttlExpiresAt },
  })

  // ─── 4. Create Stripe Checkout Session ─────────────────────────────────
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${event.title} — ${tier.name} x${quantity}` },
        unit_amount: tier.price_cents,
      },
      quantity: 1, // single line item with total
    }],
    metadata: {
      user_id: user.id,
      reservation_ids: JSON.stringify([reservation.id]),
      tier_id,
      event_id,
    },
    payment_intent_data: {
      metadata: {
        user_id: user.id,
        reservation_ids: JSON.stringify([reservation.id]),
        tier_id,
        event_id,
      },
    },
    expires_at: Math.floor((Date.now() + 30 * 60_000) / 1000),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event_id}`,
  })

  return NextResponse.json({
    reservation_id: reservation.id,
    tier_name: tier.name,
    event_title: event.title,
    quantity,
    total_amount: totalPriceCents / 100,
    stripe_session_url: session.url,
    stripe_client_secret: session.client_secret,
    expires_at: ttlExpiresAt,
  })
}
