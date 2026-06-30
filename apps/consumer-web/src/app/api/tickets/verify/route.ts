import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/tickets/verify
// QR code check-in — validates ticket via qr_code field (Part 24.2.1)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { qr_code } = body

  if (!qr_code) {
    return NextResponse.json({ error: 'qr_code is required' }, { status: 400 })
  }

  // Look up ticket by qr_code
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, qr_code, is_redeemed, checked_in_at, attendee_name, tier_name, order_id')
    .eq('qr_code', qr_code)
    .single()

  if (error || !ticket) {
    return NextResponse.json({ error: 'Invalid ticket', valid: false }, { status: 404 })
  }

  if (ticket.is_redeemed) {
    return NextResponse.json({
      valid: false,
      error: 'Ticket already checked in',
      checked_in_at: ticket.checked_in_at,
      attendee_name: ticket.attendee_name,
    }, { status: 409 })
  }

  // Mark as redeemed
  const { error: redeemError } = await supabase
    .from('tickets')
    .update({
      is_redeemed: true,
      checked_in_at: new Date().toISOString(),
    })
    .eq('id', ticket.id)

  if (redeemError) {
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 })
  }

  return NextResponse.json({
    valid: true,
    checked_in: true,
    attendee_name: ticket.attendee_name,
    tier_name: ticket.tier_name,
  })
}
