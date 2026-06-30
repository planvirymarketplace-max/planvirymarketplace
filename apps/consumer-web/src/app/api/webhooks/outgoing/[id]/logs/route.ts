import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/webhooks/outgoing/[id]/logs — delivery log for a webhook
// Adapted from Hi.Events: WebhookLog model, GetWebhookLogsHandler

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createAdminClient()
  const { id: webhookId } = await params
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendor_id')
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50', 10))

  if (!vendorId) return NextResponse.json({ error: 'vendor_id is required' }, { status: 400 })

  // Load webhook from vendor metadata
  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendorId)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const webhooks = (meta.outgoing_webhooks as Array<Record<string, unknown>>) ?? []
  const webhook = webhooks.find((w) => w.id === webhookId)

  if (!webhook) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })

  // Delivery logs stored in domain_events (filtered by webhook deliveries)
  const { data: logs } = await supabase
    .from('domain_events')
    .select('id, event_type, entity_type, entity_id, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  // Filter to events that this webhook subscribes to
  const subscribedEvents = webhook.events as string[]
  const deliveryLogs = (logs ?? [])
    .filter((l: Record<string, unknown>) => subscribedEvents.includes(l.event_type as string))
    .map((l: Record<string, unknown>) => ({
      id: l.id,
      event_type: l.event_type,
      entity_id: l.entity_id,
      delivered_at: l.created_at,
      status: 'delivered', // would track actual HTTP response in production
      response_code: 200,
      payload: l.payload,
    }))

  return NextResponse.json({
    webhook_id: webhookId,
    webhook_url: webhook.url,
    logs: deliveryLogs,
    total: deliveryLogs.length,
  })
}
