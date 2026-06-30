import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/quotes
// Vendor sends a quote in response to an inquiry (Part 12)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { inquiry_id, package_id, total_amount, deposit_amount, line_items, addons, custom_terms, vendor_notes } = body

  if (!inquiry_id || !total_amount) {
    return NextResponse.json({ error: 'inquiry_id and total_amount are required' }, { status: 400 })
  }

  // Get the inquiry to find vendor_id and planner_id
  const { data: inquiry, error: inquiryError } = await supabase
    .from('inquiries')
    .select('id, vendor_id, planner_id')
    .eq('id', inquiry_id)
    .single()

  if (inquiryError || !inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
  }

  // Verify the current user is the vendor
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!vendor || vendor.id !== inquiry.vendor_id) {
    return NextResponse.json({ error: 'Only the vendor can send quotes' }, { status: 403 })
  }

  // Create quote — expires_at set by vendor_booking_settings.quote_expiry_hours (default 48h)
  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      inquiry_id,
      vendor_id: inquiry.vendor_id,
      planner_id: inquiry.planner_id,
      package_id: package_id ?? null,
      total_amount,
      deposit_amount: deposit_amount ?? 0,
      line_items: line_items ?? [],
      addons: addons ?? [],
      custom_terms: custom_terms ?? null,
      vendor_notes: vendor_notes ?? null,
      status: 'pending',
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update inquiry status
  await supabase
    .from('inquiries')
    .update({ status: 'quoted' })
    .eq('id', inquiry_id)

  // Notify planner
  await supabase.from('notifications').insert({
    user_id: inquiry.planner_id,
    category: 'booking',
    title: 'Quote received',
    body: `Quote for $${total_amount}. Expires in 48h.`,
    link: `/dashboard`,
  })

  return NextResponse.json(quote)
}
