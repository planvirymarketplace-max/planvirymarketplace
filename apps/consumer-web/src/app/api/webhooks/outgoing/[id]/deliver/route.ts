import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/webhooks/outgoing/[id]/deliver — manually trigger webhook delivery
// In production this is triggered by domain_events; this endpoint allows manual retry.
// Adapted from Hi.Events: CreateWebhookService (delivery logic)

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

  // Load the webhook config
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

  // Build the payload with signature
  const timestamp = Math.floor(Date.now() / 1000)
  const payloadString = JSON.stringify({
    event_type,
    timestamp,
    data: payload,
  })

  // Sign with HMAC if secret is set
  let signature: string | null = null
  if (webhook.secret) {
    signature = createHmac('sha256', webhook.secret as string)
      .update(payloadString)
      .digest('hex')
  }

  // Deliver with retry (3 attempts, exponential backoff: 1s, 5s, 25s)
  const maxRetries = 3
  const backoffMs = [1000, 5000, 25000]
  let lastError: string | null = null
  let responseStatus: number | null = null
  let responseBody: string | null = null
  let attempt = 0

  for (attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Planviry-Event': event_type,
        'X-Planviry-Timestamp': String(timestamp),
      }
      if (signature) {
        headers['X-Planviry-Signature'] = signature
      }

      const res = await fetch(webhook.url as string, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: AbortSignal.timeout(10000), // 10s timeout
      })

      responseStatus = res.status
      responseBody = await res.text()

      if (res.status >= 200 && res.status < 300) {
        // Success
        break
      }

      // Non-2xx — retry
      lastError = `HTTP ${res.status}: ${responseBody.slice(0, 200)}`
    } catch (err) {
      lastError = String(err)
    }

    // Wait before retry (except on last attempt)
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs[attempt]))
    }
  }

  // Update webhook stats
  const success = responseStatus !== null && responseStatus >= 200 && responseStatus < 300
  webhook.delivery_count = ((webhook.delivery_count as number) ?? 0) + 1
  if (!success) {
    webhook.failure_count = ((webhook.failure_count as number) ?? 0) + 1
  }
  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, outgoing_webhooks: webhooks } })
    .eq('id', vendor_id)

  // Log the delivery
  await supabase.from('domain_events').insert({
    event_type: 'webhook.delivered',
    entity_type: 'vendor_account',
    entity_id: vendor_id,
    payload: {
      webhook_id: webhookId,
      event_type,
      attempt: attempt + 1,
      response_status: responseStatus,
      success,
      error: lastError,
      delivered_at: new Date().toISOString(),
    },
  })

  return NextResponse.json({
    webhook_id: webhookId,
    event_type,
    attempts: attempt + 1,
    response_status: responseStatus,
    success,
    error: lastError,
  })
}
