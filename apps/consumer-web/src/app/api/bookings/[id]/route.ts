import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET   /api/bookings/[id]
 * PATCH /api/bookings/[id]
 *
 * Reads and updates a single booking in the `bookings` table.
 * Uses admin client (service role) so RLS is bypassed.
 *
 * NOTE: The original code targeted a `besttime_bookings` table which does
 * not exist on the remote Supabase. We use `bookings` and only map fields
 * that have equivalent columns.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Map incoming camelCase fields to the bookings table columns.
    // Only fields with an equivalent column are honored.
    const patch: Record<string, unknown> = {}
    if (body.totalAmount   !== undefined) patch.total_amount    = body.totalAmount
    if (body.depositAmount !== undefined) patch.deposit_amount  = body.depositAmount
    if (body.status        !== undefined) patch.status          = body.status
    if (body.userId        !== undefined) patch.planner_id      = body.userId
    if (body.vendorId      !== undefined) patch.vendor_id       = body.vendorId
    if (body.listingId     !== undefined) patch.listing_id      = body.listingId
    if (body.eventId       !== undefined) patch.event_id        = body.eventId
    if (body.quoteId       !== undefined) patch.quote_id        = body.quoteId
    if (body.paymentStatus !== undefined) patch.escrow_status   = body.paymentStatus

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'No updatable fields for the bookings table' },
        { status: 400 }
      )
    }

    patch.updated_at = new Date().toISOString()

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('bookings')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      console.error('Failed to update booking:', error.message)
      return NextResponse.json(
        { error: 'Failed to update booking: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
