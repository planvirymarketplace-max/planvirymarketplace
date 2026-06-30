import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/webhooks/outgoing/[id]/deliver — deliver webhook + log to webhook_deliveries
// REAL TABLE: webhook_deliveries (id, target_url, vendor_id, event_type, entity_type,
//   entity_id, payload, state, attempt_count, max_attempts, last_status_code,
//   last_response, next_attempt_at, delivered_at, created_at, updated_at)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createAdminClient()
  const { id: webhookId } = await params
  const body = await request.json()
  const { vendor_id, event_type, payload } = body

  if (!vendor_id || !event_type || !payload) {
    return NextResponse.json({ error: 'vendor_id, event_type, payload are required' }, { status: 400 })
  }

  // Load the webhook config from vendor metadata
  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendor_id)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const webhooks = (meta.outgoing_webhooks as Array<Record<string, unknown>>) ?? []
  const webhook = webhooks.find((w) => w.id === webhookId)

  if (!webhook) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  if (!webhook.events.includes(event_type)) {
    return NextResponse.json({ error: `Webhook not subscribed to ${event_type}` }, { status: 400 })
  }

  // ─── Create webhook_deliveries record BEFORE delivery ───────────────────
  const { data: delivery } = await supabase
    .from('webhook_deliveries')
    .insert({
      target_url: webhook.url,
      vendor_id,
      event_type,
      entity_type: payload.entity_type ?? 'unknown',
      entity_id: payload.entity_id ?? null,
      payload,
      state: 'PENDING',
      attempt_count: 0,
      max_attempts: 3,
    })
    .select('id')
    .single()

  // Build payload with signature
  const timestamp = Math.floor(Date.now() / 1000)
  const payloadString = JSON.stringify({ event_type, timestamp, data: payload })
  let signature: string | null = null
  if (webhook.secret) {
    signature = createHmac('sha256', webhook.secret as string).update(payloadString).digest('hex')
  }

  // Deliver with retry (3 attempts, exponential backoff)
  const maxRetries = 3
  const backoffMs = [1000, 5000, 25000]
  let lastError: string | null = null
  let responseStatus: number | null = null
  let responseBody: string | null = null
  let attempt = 0
  let success = false

  for (attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Planviry-Event': event_type,
        'X-Planviry-Timestamp': String(timestamp),
      }
      if (signature) headers['X-Planviry-Signature'] = signature

      const res = await fetch(webhook.url as string, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: AbortSignal.timeout(10000),
      })

      responseStatus = res.status
      responseBody = (await res.text()).slice(0, 500)

      if (res.status >= 200 && res.status < 300) {
        success = true
        break
      }
      lastError = `HTTP ${res.status}: ${responseBody}`
    } catch (err) {
      lastError = String(err)
    }

    if (attempt < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, backoffMs[attempt]))
    }
  }

  // ─── Update webhook_deliveries with result ──────────────────────────────
  await supabase
    .from('webhook_deliveries')
    .update({
      state: success ? 'DELIVERED' : 'FAILED',
      attempt_count: attempt + 1,
      last_status_code: responseStatus,
      last_response: responseBody,
      delivered_at: success ? new Date().toISOString() : null,
      next_attempt_at: success ? null : new Date(Date.now() + backoffMs[Math.min(attempt, 2)]).toISOString(),
    })
    .eq('id', delivery?.id)

  // Update webhook stats on vendor
  webhook.delivery_count = ((webhook.delivery_count as number) ?? 0) + 1
  if (!success) webhook.failure_count = ((webhook.failure_count as number) ?? 0) + 1
  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, outgoing_webhooks: webhooks } })
    .eq('id', vendor_id)

  // Audit log
  await supabase.from('domain_events').insert({
    event_type: success ? 'webhook.delivered' : 'webhook.failed',
    entity_type: 'webhook_delivery',
    entity_id: delivery?.id,
    payload: { webhook_id: webhookId, event_type, attempts: attempt + 1, status: responseStatus, error: lastError },
  })

  return NextResponse.json({
    webhook_id: webhookId,
    delivery_id: delivery?.id,
    event_type,
    attempts: attempt + 1,
    response_status: responseStatus,
    success,
    error: lastError,
  })
}
