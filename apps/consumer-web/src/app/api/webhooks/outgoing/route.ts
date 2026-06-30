import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/webhooks/outgoing — register an outgoing webhook (event-triggered)
// GET /api/webhooks/outgoing?vendor_id= — list webhooks for a vendor
// Adapted from Hi.Events: Webhook model, CreateWebhookHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendor_id')

  // Outgoing webhooks stored in vendor_accounts.metadata.outgoing_webhooks
  if (!vendorId) return NextResponse.json({ error: 'vendor_id is required' }, { status: 400 })

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendorId)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const webhooks = (meta.outgoing_webhooks as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ webhooks })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { vendor_id, url, events, secret } = body

  if (!vendor_id || !url || !events || !Array.isArray(events)) {
    return NextResponse.json({ error: 'vendor_id, url, events[] are required' }, { status: 400 })
  }

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendor_id)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const webhooks = (meta.outgoing_webhooks as Array<Record<string, unknown>>) ?? []

  const newWebhook = {
    id: randomUUID(),
    url,
    events, // e.g. ['reservation.confirmed', 'reservation.cancelled', 'ticket.checked_in']
    secret: secret ?? null, // HMAC signing secret for payload verification
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    delivery_count: 0,
    failure_count: 0,
  }

  webhooks.push(newWebhook)

  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, outgoing_webhooks: webhooks } })
    .eq('id', vendor_id)

  return NextResponse.json({ webhook: newWebhook }, { status: 201 })
}
