import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

// POST /api/stripe-connect/onboarding
// Creates Stripe Express account for a vendor + returns account link URL for onboarding.
// Adapted from Hi.Events: CreateStripeConnectAccountHandler, StripeAccountSyncService

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  // Get vendor_id from vendor_staff
  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('vendor_id, role')
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff || staff.role !== 'OWNER') {
    return NextResponse.json({ error: 'Must be a vendor owner' }, { status: 403 })
  }

  // Load vendor account
  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('id, name, email, stripe_connect_account_id')
    .eq('id', staff.vendor_id)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  let accountId = vendor.stripe_connect_account_id

  // Create Stripe Express account if not exists
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: vendor.email,
      metadata: { vendor_id: vendor.id, platform: 'planviry' },
    })
    accountId = account.id

    // Save to vendor_accounts
    await supabase
      .from('vendor_accounts')
      .update({ stripe_connect_account_id: accountId })
      .eq('id', vendor.id)
  }

  // Create account link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/payouts?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/payouts?onboarding=complete`,
    type: 'account_onboarding',
  })

  return NextResponse.json({
    stripe_account_id: accountId,
    onboarding_url: accountLink.url,
    expires_at: accountLink.expires_at,
  })
}
