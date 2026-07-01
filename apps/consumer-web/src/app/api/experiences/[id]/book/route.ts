import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculatePrice, checkAvailability } from '@planviry/shared'

// POST /api/experiences/[id]/book
// Lock slot, check capacity, create reservation (Part 44.2)
// Same pattern as ticket purchase: lock → check → increment → create order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: experienceId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { slot_id, party_size, trip_id, event_id } = body

  if (!slot_id || !party_size) {
    return NextResponse.json({ error: 'slot_id and party_size required' }, { status: 400 })
  }

  // Step 1: Lock slot row and check capacity
  const { data: slot, error: slotError } = await supabase
    .from('experience_slots')
    .select('id, capacity, booked_count, slot_date, slot_time')
    .eq('id', slot_id)
    .single()

  if (slotError || !slot) {
    return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  }

  // FIX-5: best-effort availability check via the shared adapter. The real
  // protection against overselling is the atomic conditional UPDATE below.
  // FIX-10: category aligned to the live Supabase `inventory_category` enum
  // (ACTIVITY — was EXPERIENCE).
  if (slot.slot_date) {
    const avail = await checkAvailability(supabase, experienceId, 'ACTIVITY', {
      start_date: slot.slot_date,
      time_slot: slot.slot_time ?? undefined,
    })
    if (!avail.available) {
      return NextResponse.json({ error: avail.reason ?? 'Slot unavailable' }, { status: 409 })
    }
  }

  // Step 2: Pre-flight capacity check (user-facing message — not the race-safe guard)
  if (slot.booked_count + party_size > slot.capacity) {
    return NextResponse.json({
      error: 'Slot full',
      slot_full: true,
      remaining: slot.capacity - slot.booked_count,
    }, { status: 409 })
  }

  // ─── FIX-5: ATOMIC capacity increment (replaces TOCTOU read-then-write) ──
  // Pattern mirrors /api/checkout/route.ts:114-135 (capacity_assignments):
  // single conditional UPDATE with `.lte('booked_count', capacity - N)` guard,
  // then check the returned row count. If 0 rows updated, a concurrent request
  // grabbed the last seats between our read and our write — return 409.
  const { data: atomicResult, error: atomicErr } = await supabase
    .from('experience_slots')
    .update({ booked_count: slot.booked_count + party_size })
    .eq('id', slot_id)
    .lte('booked_count', slot.capacity - party_size)
    .select('id')

  if (atomicErr || !atomicResult || atomicResult.length === 0) {
    return NextResponse.json({
      error: 'Slot full — race condition prevented',
      slot_full: true,
      remaining: slot.capacity - slot.booked_count,
    }, { status: 409 })
  }

  // Step 4: Get experience pricing
  const { data: experience } = await supabase
    .from('experience_listings')
    .select('title, base_price_per_person, deposit_pct')
    .eq('id', experienceId)
    .single()

  if (!experience) {
    // Compensating transaction: decrement booked_count
    await supabase
      .from('experience_slots')
      .update({ booked_count: slot.booked_count })
      .eq('id', slot_id)
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
  }

  // ─── FIX-5: model-aware pricing via shared adapter (PER_PERSON) ──────────
  // Previously: `experience.base_price_per_person * party_size` (inline).
  // Now: routed through `calculatePrice` so future pricing-model changes
  // (e.g. flat-rate experiences, PER_SLOT) are centralised. The deposit math
  // that runs AFTER per-item pricing is preserved verbatim.
  // FIX-10: category aligned to the live Supabase `inventory_category` enum
  // (ACTIVITY — was EXPERIENCE).
  const priceResult = calculatePrice(
    supabase,
    {
      base_price_cents: (experience.base_price_per_person ?? 0) * 100,
      pricing_model: 'PER_PERSON',
      category: 'ACTIVITY',
    },
    { guests: party_size },
  )
  const totalAmount = priceResult.total_cents / 100
  const depositAmount = (totalAmount * (experience.deposit_pct ?? 25)) / 100

  // Step 5: Create reservation (status: pending)
  const { data: reservation, error: resError } = await supabase
    .from('experience_reservations')
    .insert({
      experience_id: experienceId,
      slot_id: slot_id,
      trip_id: trip_id ?? null,
      event_id: event_id ?? null,
      planner_id: user.id,
      party_size,
      total_amount: totalAmount,
      deposit_amount: depositAmount,
      status: 'pending',
    })
    .select('id')
    .single()

  if (resError) {
    // Compensating transaction: decrement booked_count
    await supabase
      .from('experience_slots')
      .update({ booked_count: slot.booked_count })
      .eq('id', slot_id)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }

  return NextResponse.json({
    reservation_id: reservation.id,
    experience_title: experience.title,
    slot_date: slot.slot_date,
    slot_time: slot.slot_time,
    party_size,
    total_amount: totalAmount,
    deposit_amount: depositAmount,
    pricing_model: priceResult.pricing_model,
    pricing_breakdown: priceResult.breakdown,
    // Client adds to cart with type='experience', then calls /api/checkout
  })
}
