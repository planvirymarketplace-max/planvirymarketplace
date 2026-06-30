import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/orders/[id]/invoice — generate invoice data (PDF in Part XXVIII)
// Adapted from Hi.Events: GetOrderInvoiceHandler, InvoiceCreateService

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select(`
      id, status, quantity, unit_price_cents, total_price_cents, currency,
      created_at, confirmed_at, cancelled_at, stripe_payment_intent_id,
      stripe_refund_id, refund_amount_cents,
      inventory_items!inner(id, title, category, vendor_accounts!inner(id, name, email, address)),
      user_profiles!inner(display_name, email)
    `)
    .eq('id', reservationId)
    .maybeSingle()

  if (error || !reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })

  // RLS
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  const vendor = Array.isArray(inv?.vendor_accounts) ? inv?.vendor_accounts[0] : inv?.vendor_accounts
  const profile = Array.isArray(reservation.user_profiles) ? reservation.user_profiles[0] : reservation.user_profiles

  const invoice = {
    invoice_number: `INV-${reservationId.slice(0, 8).toUpperCase()}`,
    invoice_date: reservation.confirmed_at ?? reservation.created_at,
    status: reservation.status,
    currency: reservation.currency,

    // Seller (vendor)
    seller: {
      name: vendor?.name,
      email: vendor?.email,
      address: vendor?.address,
    },

    // Buyer (attendee)
    buyer: {
      name: profile?.display_name,
      email: profile?.email,
    },

    // Line items
    line_items: [{
      description: inv?.title,
      quantity: reservation.quantity,
      unit_price_cents: reservation.unit_price_cents,
      total_cents: reservation.total_price_cents,
    }],

    // Totals
    subtotal_cents: reservation.total_price_cents,
    tax_cents: 0, // Part X: tax calculation
    fee_cents: 0, // Part X: platform fee
    total_cents: reservation.total_price_cents,

    // Payment
    payment: {
      stripe_payment_intent_id: reservation.stripe_payment_intent_id,
      stripe_refund_id: reservation.stripe_refund_id,
      refund_amount_cents: reservation.refund_amount_cents,
      paid: reservation.status === 'CONFIRMED' || reservation.status === 'COMPLETED',
    },

    reservation_id: reservationId,
  }

  return NextResponse.json({ invoice })
}
