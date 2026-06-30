import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET  /api/bookings — list all bookings (newest first)
 * POST /api/bookings — create a new booking
 *
 * The remote Supabase has no `besttime_bookings` table. Per the migration
 * spec we use the `bookings` table. Many of the original besttime fields
 * (booking_number, event_type, contact_email, etc.) have no equivalent
 * column on `bookings`; only the mappable fields are persisted. The
 * inserted row is returned as-is.
 *
 * Admin client (service role) is used so RLS is bypassed.
 */

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch bookings:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // `bookings.total_amount` is NOT NULL — default to 0 if not provided.
    const insert: Record<string, unknown> = {
      total_amount: body.totalAmount ?? 0,
      status: body.status ?? 'pending',
      currency: 'USD',
    }
    if (body.depositAmount !== undefined) insert.deposit_amount = body.depositAmount
    if (body.userId !== undefined) insert.planner_id = body.userId
    if (body.vendorId !== undefined) insert.vendor_id = body.vendorId
    if (body.listingId !== undefined) insert.listing_id = body.listingId
    if (body.eventId !== undefined) insert.event_id = body.eventId
    if (body.quoteId !== undefined) insert.quote_id = body.quoteId

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('bookings')
      .insert(insert)
      .select()
      .single()

    if (error) {
      console.error('Failed to create booking:', error.message)
      return NextResponse.json(
        { error: 'Failed to create booking: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
