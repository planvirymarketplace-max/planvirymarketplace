import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/service-tickets
//
// Creates a consumer-side support ticket in the `service_tickets` table.
//
// Schema note (FIX-8 live-DB probe): the live `service_tickets` table has
// these columns (NOT the names the task spec suggested):
//   id, vendor_id (NOT NULL FK → vendor_accounts),
//   reporter_id (NOT NULL — the consumer-side user.id),
//   reservation_id (nullable), title, description,
//   priority (default 'MEDIUM'), status (default 'OPEN'),
//   category (NOT NULL), assigned_to (nullable), due_at (nullable),
//   created_at, updated_at
//
// So the mapping from the task spec is:
//   task `user_id`    → actual `reporter_id` (resolved from auth.getUser())
//   task `subject`    → actual `title`
//   task `message`    → actual `description`
//   task `category`   → actual `category`
//   task `status='OPEN'` → actual `status` (DB has default 'OPEN')
//
// `vendor_id` is NOT NULL with an FK to `vendor_accounts`, so the form must
// include a real vendor_id. The form on /account/support exposes a vendor
// dropdown (populated from ACTIVE vendor_accounts) so the consumer can
// indicate which vendor the ticket is about. The endpoint validates that the
// provided vendor_id exists in vendor_accounts before INSERT.
// ─────────────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'RESERVATION',
  'BILLING',
  'TECHNICAL',
  'FEEDBACK',
  'OTHER',
] as const

const VALID_PRIORITIES = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const

type Body = {
  subject?: unknown
  category?: unknown
  message?: unknown
  vendor_id?: unknown
  reservation_id?: unknown
  priority?: unknown
}

export async function POST(request: NextRequest) {
  // 1. Authenticate via cookie-scoped server client.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse + validate the body.
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const category =
    typeof body.category === 'string' && (VALID_CATEGORIES as readonly string[]).includes(body.category)
      ? body.category
      : 'OTHER'
  const vendorId =
    typeof body.vendor_id === 'string' && body.vendor_id.length > 0
      ? body.vendor_id
      : null
  const reservationId =
    typeof body.reservation_id === 'string' && body.reservation_id.length > 0
      ? body.reservation_id
      : null
  const priority =
    typeof body.priority === 'string' && (VALID_PRIORITIES as readonly string[]).includes(body.priority)
      ? body.priority
      : 'MEDIUM'

  if (!subject) {
    return NextResponse.json({ error: 'Subject is required.' }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }
  if (!vendorId) {
    return NextResponse.json(
      { error: 'Please choose which vendor this ticket is about.' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()

  try {
    // 3. Verify the vendor_id exists (FK safety + friendly error).
    const { data: vendor, error: vendorErr } = await admin
      .from('vendor_accounts')
      .select('id, name')
      .eq('id', vendorId)
      .maybeSingle()

    if (vendorErr) {
      return NextResponse.json(
        { error: 'Could not validate vendor.', detail: vendorErr.message },
        { status: 500 },
      )
    }
    if (!vendor) {
      return NextResponse.json(
        { error: 'Selected vendor does not exist.' },
        { status: 400 },
      )
    }

    // 4. INSERT into service_tickets.
    const insertRow: Record<string, unknown> = {
      vendor_id: vendorId,
      reporter_id: user.id,
      title: subject,
      description: message,
      category,
      status: 'OPEN',
      priority,
    }
    if (reservationId) {
      insertRow.reservation_id = reservationId
    }

    const { data: inserted, error: insertErr } = await admin
      .from('service_tickets')
      .insert(insertRow)
      .select(
        'id, vendor_id, reporter_id, reservation_id, title, description, priority, status, category, assigned_to, created_at, updated_at',
      )
      .single()

    if (insertErr) {
      return NextResponse.json(
        { error: 'Could not create ticket.', detail: insertErr.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        ticket: inserted,
        message: 'Support ticket created.',
      },
      { status: 201 },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Unexpected server error.', detail: msg },
      { status: 500 },
    )
  }
}
