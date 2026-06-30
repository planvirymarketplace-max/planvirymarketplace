import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

// GET /api/stripe-connect/payouts — list payouts for vendor
// Reconciles Stripe payouts to reservations + platform fees.
// Adapted from Hi.Events: PayoutPaidHandler, StripePayment model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  // Get vendor
  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('vendor_id, role')
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff) return NextResponse.json({ error: 'No vendor account' }, { status: 403 })

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('id, name, stripe_connect_account_id')
    .eq('id', staff.vendor_id)
    .maybeSingle()

  if (!vendor?.stripe_connect_account_id) {
    return NextResponse.json({ error: 'Stripe Connect not set up' }, { status: 400 })
  }

  // Fetch payouts from Stripe for this connected account
  const payouts = await stripe.payouts.list(
    { limit: 50 },
    { stripeAccount: vendor.stripe_connect_account_id },
  )

  // For each payout, reconcile with reservations
  const reconciledPayouts = []
  for (const payout of payouts.data) {
    // Get balance transactions for this payout
    const balanceTransactions = await stripe.balanceTransactions.list(
      { payout: payout.id, limit: 100 },
      { stripeAccount: vendor.stripe_connect_account_id },
    )

    // Match to reservations via payment intents
    const linkedReservations: string[] = []
    let platformFeesTotal = 0
    let netAmount = 0

    for (const bt of balanceTransactions.data) {
      if (bt.type === 'application_fee') {
        platformFeesTotal += bt.fee
      }
      netAmount += bt.net

      // Try to trace back to a reservation
      if (bt.source?.originating_transaction) {
        const piId = bt.source.originating_transaction as string
        const { data: res } = await supabase
          .from('reservations')
          .select('id')
          .eq('stripe_payment_intent_id', piId)
          .maybeSingle()
        if (res) linkedReservations.push(res.id)
      }
    }

    reconciledPayouts.push({
      payout_id: payout.id,
      amount_cents: payout.amount,
      currency: payout.currency,
      arrival_date: payout.arrival_date,
      status: payout.status,
      method: payout.method,
      platform_fees_cents: platformFeesTotal,
      net_amount_cents: netAmount,
      linked_reservations: linkedReservations,
      reservation_count: linkedReservations.length,
    })
  }

  // Summary
  const totalPayouts = reconciledPayouts.reduce((s, p) => s + p.amount_cents, 0)
  const totalFees = reconciledPayouts.reduce((s, p) => s + p.platform_fees_cents, 0)
  const totalNet = reconciledPayouts.reduce((s, p) => s + p.net_amount_cents, 0)

  return NextResponse.json({
    vendor: { id: vendor.id, name: vendor.name },
    stripe_account_id: vendor.stripe_connect_account_id,
    payouts: reconciledPayouts,
    summary: {
      total_payouts_cents: totalPayouts,
      total_platform_fees_cents: totalFees,
      total_net_cents: totalNet,
      payout_count: reconciledPayouts.length,
    },
  })
}
