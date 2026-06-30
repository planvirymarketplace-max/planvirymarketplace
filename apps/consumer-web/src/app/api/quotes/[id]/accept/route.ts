import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/quotes/[id]/accept
// Planner accepts a quote — auto-creates a contract (Part 12)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: quoteId } = await params

  // Get the quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .select('id, inquiry_id, vendor_id, planner_id, total_amount, deposit_amount, status, expires_at')
    .eq('id', quoteId)
    .single()

  if (quoteError || !quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  // Verify the current user is the planner
  if (quote.planner_id !== user.id) {
    return NextResponse.json({ error: 'Only the planner can accept quotes' }, { status: 403 })
  }

  // Check quote is still pending and not expired
  if (quote.status !== 'pending') {
    return NextResponse.json({ error: `Quote is ${quote.status}, cannot accept` }, { status: 400 })
  }

  if (quote.expires_at && new Date(quote.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Quote has expired' }, { status: 400 })
  }

  // Accept the quote
  const { error: acceptError } = await supabase
    .from('quotes')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', quoteId)

  if (acceptError) {
    return NextResponse.json({ error: acceptError.message }, { status: 500 })
  }

  // Auto-create contract (Part 12: "contracts row auto-created (status: draft)")
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      vendor_id: quote.vendor_id,
      planner_id: quote.planner_id,
      booking_id: null, // Booking is created at checkout, not at contract creation
      version: 1,
      body_html: '', // Contract template to be filled
      status: 'draft',
    })
    .select()
    .single()

  if (contractError) {
    return NextResponse.json({ error: contractError.message }, { status: 500 })
  }

  // Notify vendor
  await supabase.from('notifications').insert({
    user_id: quote.vendor_id,
    category: 'booking',
    title: 'Quote accepted',
    body: 'Quote accepted. Contract ready to sign.',
    link: `/vendor/portal/bookings`,
  })

  return NextResponse.json({
    quote_id: quoteId,
    status: 'accepted',
    contract_id: contract.id,
    contract_status: 'draft',
    message: 'Quote accepted. Contract created. Both parties must sign before checkout.',
  })
}
