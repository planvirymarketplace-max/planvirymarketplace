/**
 * GET /api/checkout/verify?session_id=<stripe_session_id>
 *
 * Called by the frontend after Stripe Checkout redirect back to the app.
 * Polls the reservation status — the Stripe webhook should have called
 * rpc_confirm_reservation by now, transitioning PENDING → CONFIRMED.
 *
 * Returns:
 *   200 { status: 'CONFIRMED', reservation_ids: [...] } — payment succeeded
 *   200 { status: 'PENDING', reservation_ids: [...] }   — webhook not yet processed
 *   200 { status: 'CANCELLED' }                          — payment failed
 *   404 { error: 'Session not found' }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
  }

  try {
    // Retrieve the Stripe Checkout Session to get metadata + payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const metadata = session.metadata ?? {}
    const reservationIdsJson = metadata.reservation_ids

    if (!reservationIdsJson) {
      return NextResponse.json({ error: 'No reservations in session metadata' }, { status: 404 })
    }

    const reservationIds: string[] = JSON.parse(reservationIdsJson)
    const supabase = createAdminClient()

    // Query the actual reservation statuses from the DB
    // (the webhook should have confirmed them by now)
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, status')
      .in('id', reservationIds)

    if (error) {
      console.error('[checkout/verify] DB error:', error)
      return NextResponse.json({ error: 'Failed to query reservations' }, { status: 500 })
    }

    // Determine overall status
    const statuses = (reservations ?? []).map((r: { status: string }) => r.status)
    let overallStatus: string

    if (session.payment_status === 'paid' && statuses.every((s: string) => s === 'CONFIRMED')) {
      overallStatus = 'CONFIRMED'
    } else if (statuses.some((s: string) => s === 'CANCELLED')) {
      overallStatus = 'FAILED'
    } else if (session.payment_status === 'unpaid' && statuses.some((s: string) => s === 'EXPIRED')) {
      overallStatus = 'FAILED'
    } else {
      overallStatus = 'PENDING'
    }

    return NextResponse.json({
      status: overallStatus,
      payment_status: session.payment_status,
      reservation_ids: reservationIds,
      reservations: reservations ?? [],
    })
  } catch (err) {
    console.error('[checkout/verify] error:', err)
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 })
  }
}
