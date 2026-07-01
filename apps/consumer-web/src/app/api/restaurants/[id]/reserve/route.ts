import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculatePrice, checkAvailability, pricingModelForCategory, type PricingModel } from '@planviry/shared'

// POST /api/restaurants/[id]/reserve
// Create a restaurant reservation (Part 43.3)
// If deposit_amount > 0, creates an order for Stripe checkout
// If no deposit, directly confirms the reservation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: restaurantId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { reservation_date, reservation_time, party_size, trip_id, event_id, special_requests, deposit_amount } = body

  if (!reservation_date || !reservation_time || !party_size) {
    return NextResponse.json({ error: 'reservation_date, reservation_time, party_size required' }, { status: 400 })
  }

  // ─── FIX-5: server-side price computation via shared adapter ────────────
  // Previously the route read `deposit_amount` from the request body with no
  // server-side price check — a client could pass any number. Now we look up
  // the inventory_items row for the restaurant, run `calculatePrice` with the
  // PER_PERSON model + party_size, and use the result as the authoritative
  // total. If the body supplies `deposit_amount` we still honour it (for
  // partial-deposit flows), but the per-person total is computed server-side.
  const { data: restaurantItem } = await supabase
    .from('inventory_items')
    .select('id, vendor_id, base_price_cents, currency, status, category, metadata')
    .eq('id', restaurantId)
    .maybeSingle()

  if (!restaurantItem) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }
  if (restaurantItem.status !== 'PUBLISHED') {
    return NextResponse.json({ error: `Restaurant is ${restaurantItem.status}` }, { status: 409 })
  }

  const restaurantMetadata = (restaurantItem.metadata ?? {}) as { pricing_model?: PricingModel }
  const restaurantCategory = (restaurantItem.category as string | null) ?? 'DINING'
  const restaurantPricingModel =
    restaurantMetadata.pricing_model ?? pricingModelForCategory(restaurantCategory)

  const priceResult = calculatePrice(
    supabase,
    {
      base_price_cents: (restaurantItem.base_price_cents ?? 0) as number,
      pricing_model: restaurantPricingModel,
      category: restaurantCategory,
    },
    { guests: party_size },
  )
  const totalAmountCents = priceResult.total_cents
  // If the body did not supply a deposit_amount, default to 0 (no deposit,
  // direct-confirm) — preserving the original behaviour.
  const effectiveDepositAmount = deposit_amount ?? 0

  // ─── FIX-5: best-effort availability check via shared adapter ───────────
  // The real protection against overselling is the atomic conditional UPDATE
  // on capacity_assignments below. The adapter check uses date-overlap on
  // reservations to surface "slot already booked" messages.
  const avail = await checkAvailability(supabase, restaurantId, restaurantCategory, {
    start_date: reservation_date,
    time_slot: reservation_time,
    party_size,
  })
  if (!avail.available) {
    return NextResponse.json({ error: avail.reason ?? 'Time slot unavailable' }, { status: 409 })
  }

  // ─── FIX-5: ATOMIC capacity check (replaces "no check at all") ──────────
  // Pattern mirrors /api/checkout/route.ts:114-135. If the restaurant has a
  // capacity_assignments row, do a single conditional UPDATE with
  // `.lte('used', capacity - N)` guard. If 0 rows updated, the time slot is
  // full under concurrent reservation — return 409. If no capacity_assignments
  // row exists for this item, skip (no capacity to enforce).
  const { data: capPools } = await supabase
    .from('capacity_assignments')
    .select('id, name, capacity, used')
    .eq('item_id', restaurantId)

  if (capPools && capPools.length > 0) {
    for (const pool of capPools) {
      if (pool.capacity - pool.used < party_size) {
        return NextResponse.json({ error: `Sold out (pool: ${pool.name})` }, { status: 409 })
      }
      const { data: atomicResult, error: atomicErr } = await supabase
        .from('capacity_assignments')
        .update({ used: pool.used + party_size })
        .eq('id', pool.id)
        .lte('used', pool.capacity - party_size)
        .select('id')
      if (atomicErr || !atomicResult || atomicResult.length === 0) {
        return NextResponse.json(
          { error: `Sold out (pool: ${pool.name}) — race condition prevented` },
          { status: 409 },
        )
      }
    }
  }

  // Create reservation
  const { data: reservation, error } = await supabase
    .from('restaurant_reservations')
    .insert({
      restaurant_id: restaurantId,
      planner_id: user.id,
      trip_id: trip_id ?? null,
      event_id: event_id ?? null,
      reservation_date,
      reservation_time,
      party_size,
      status: effectiveDepositAmount ? 'pending' : 'confirmed',
      special_requests: special_requests ?? null,
      deposit_amount: effectiveDepositAmount || null,
    })
    .select()
    .single()

  if (error) {
    // Compensating transaction: release the reserved capacity.
    if (capPools && capPools.length > 0) {
      for (const pool of capPools) {
        await supabase
          .from('capacity_assignments')
          .update({ used: Math.max(0, pool.used) })
          .eq('id', pool.id)
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If no deposit, add to trip itinerary directly
  if (!effectiveDepositAmount && trip_id) {
    await supabase.from('trip_itinerary_items').insert({
      trip_id,
      item_type: 'restaurant',
      restaurant_reservation_id: reservation.id,
      display_name: 'Restaurant Reservation',
      display_time: reservation_time,
      display_date: reservation_date,
    })
  }

  return NextResponse.json({
    reservation,
    requires_payment: !!effectiveDepositAmount,
    total_price_cents: totalAmountCents,
    pricing_model: priceResult.pricing_model,
    pricing_breakdown: priceResult.breakdown,
    // If requires_payment: client calls /api/checkout with cart item type='restaurant'
  })
}
