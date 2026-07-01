import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac, randomUUID } from 'crypto'
import { calculatePrice, pricingModelForCategory, type PricingModel } from '@planviry/shared'

// GET /api/attendees?event_id=&status=&search=
// POST /api/attendees — create single attendee (admin/vendor manual add)
// Adapted from Hi.Events: Attendee/GetAttendeesHandler, CreateAttendeeHandler

const PLATFORM_SECRET = process.env.NEXTAUTH_SECRET ?? 'planviry-checkin-secret-dev'

function generatePublicId(): string {
  return 'A-' + randomUUID().slice(0, 7).toUpperCase()
}

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50', 10))

  // Attendees are stored as reservations with category=EVENT_TICKET
  // For per-attendee records we need a separate table — but for now we use
  // the reservation + a metadata field for attendee details
  let query = supabase
    .from('reservations')
    .select(`
      id, status, user_id, quantity, created_at,
      inventory_items!inner(id, title, category),
      user_profiles!inner(display_name, email),
      check_ins(id, checked_in_at)
    `, { count: 'exact' })
    .eq('inventory_items.category', 'EVENT_TICKET')

  if (eventId) query = query.eq('item_id', eventId)
  if (status) query = query.eq('status', status)
  if (search) {
    query = query.or(`user_profiles.display_name.ilike.%${search}%,user_profiles.email.ilike.%${search}%`)
  }

  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) {
    console.error('[attendees GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform: each reservation is an "attendee group"
  const attendees = (data ?? []).map((r: Record<string, unknown>) => {
    const profile = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles
    const inv = Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items
    const checkIns = (r.check_ins as Array<Record<string, unknown>>) ?? []
    return {
      id: r.id,
      public_id: generatePublicId(), // deterministic would be better — stored in metadata in prod
      attendee_name: profile?.display_name ?? 'Unknown',
      email: profile?.email ?? '',
      status: r.status,
      quantity: r.quantity,
      event_id: inv?.id,
      event_title: inv?.title,
      checked_in: checkIns.length > 0,
      checked_in_at: checkIns[0]?.checked_in_at ?? null,
      created_at: r.created_at,
    }
  })

  return NextResponse.json({ attendees, total: count ?? 0, page, limit })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, user_id, quantity = 1, attendee_name, email } = body

  if (!event_id || !user_id) {
    return NextResponse.json({ error: 'event_id and user_id are required' }, { status: 400 })
  }

  // Create a reservation (manual attendee add by vendor/admin)
  const { data: event } = await supabase
    .from('inventory_items')
    .select('id, vendor_id, base_price_cents, category, metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event || event.category !== 'EVENT_TICKET') {
    return NextResponse.json({ error: 'Event not found or not an event ticket' }, { status: 404 })
  }

  // ─── FIX-5: model-aware pricing via shared adapter ──────────────────────
  // Previously: `event.base_price_cents * quantity` (inline). Now routed
  // through `calculatePrice` with PER_SEAT model (EVENT_TICKET category).
  // For general-admission events without per-seat pricing, the adapter sums
  // `quantity` seats at `base_price_cents` each — equivalent to the prior
  // math, but centralised so future per-seat price variations work too.
  const metadata = (event.metadata ?? {}) as { pricing_model?: PricingModel }
  const eventCategory = (event.category as string | null) ?? 'EVENT_TICKET'
  const pricingModel = metadata.pricing_model ?? pricingModelForCategory(eventCategory)
  const priceResult = calculatePrice(
    supabase,
    {
      base_price_cents: (event.base_price_cents ?? 0) as number,
      pricing_model: pricingModel,
      category: eventCategory,
    },
    { quantity },
  )
  const total_price_cents = priceResult.total_cents
  const unit_price_cents = Math.round(priceResult.subtotal_cents / Math.max(1, quantity))
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      user_id,
      item_id: event_id,
      vendor_id: event.vendor_id,
      status: 'CONFIRMED', // manual add = confirmed
      quantity,
      unit_price_cents,
      total_price_cents,
      currency: 'USD',
      confirmed_at: new Date().toISOString(),
    })
    .select('id, public_id')
    .single()

  if (error) {
    console.error('[attendees POST]', error)
    return NextResponse.json({ error: 'Failed to create attendee' }, { status: 500 })
  }

  // Generate QR token
  const signature = createHmac('sha256', PLATFORM_SECRET)
    .update(`${reservation.id}:${user_id}:${event_id}`)
    .digest('hex')
  const qrToken = `${reservation.id}:${user_id}:${event_id}:${signature}`

  return NextResponse.json({
    id: reservation.id,
    public_id: generatePublicId(),
    attendee_name,
    email,
    quantity,
    qr_token: qrToken,
    status: 'CONFIRMED',
  }, { status: 201 })
}
