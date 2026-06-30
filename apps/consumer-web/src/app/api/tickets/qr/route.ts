import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// GET /api/tickets/qr?reservation_id=<id>
// Generates a HMAC-signed QR token for a confirmed reservation.
// The frontend renders this as a QR code; the vendor scans it at check-in.
// Pattern: HMAC-SHA256(reservation_id + user_id + event_id + secret) per Part XI §11.3.8.

const PLATFORM_SECRET = process.env.NEXTAUTH_SECRET ?? 'planviry-checkin-secret-dev'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reservationId = searchParams.get('reservation_id')

  if (!reservationId) {
    return NextResponse.json({ error: 'reservation_id is required' }, { status: 400 })
  }

  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  // Load reservation — must be CONFIRMED and owned by the user
  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('id, status, user_id, item_id, inventory_items!inner(id, title, category)')
    .eq('id', reservationId)
    .maybeSingle()

  if (error || !reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  // RLS: only the reservation owner can get their QR code
  if (reservation.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (reservation.status !== 'CONFIRMED') {
    return NextResponse.json({ error: `Reservation is ${reservation.status}, must be CONFIRMED` }, { status: 409 })
  }

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  if (inv.category !== 'EVENT_TICKET') {
    return NextResponse.json({ error: 'Not an event ticket' }, { status: 400 })
  }

  // Generate HMAC-signed QR token
  const eventId = inv.id
  const userId = reservation.user_id
  const signature = createHmac('sha256', PLATFORM_SECRET)
    .update(`${reservationId}:${userId}:${eventId}`)
    .digest('hex')

  const qrToken = `${reservationId}:${userId}:${eventId}:${signature}`

  return NextResponse.json({
    qr_token: qrToken,
    reservation_id: reservationId,
    event_title: inv.title,
    status: reservation.status,
  })
}
