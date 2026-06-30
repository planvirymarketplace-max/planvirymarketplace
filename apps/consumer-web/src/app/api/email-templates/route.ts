import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// GET /api/email-templates — list email templates for a vendor/event
// POST /api/email-templates — create email template
// Adapted from Hi.Events: EmailTemplate model, CreateEmailTemplateHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendor_id')
  const eventId = searchParams.get('event_id')

  // Templates stored on vendor_accounts.metadata.email_templates
  let target: { table: string; id: string } | null = null
  if (eventId) {
    target = { table: 'inventory_items', id: eventId }
  } else if (vendorId) {
    target = { table: 'vendor_accounts', id: vendorId }
  } else {
    return NextResponse.json({ error: 'vendor_id or event_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from(target.table)
    .select('metadata')
    .eq('id', target.id)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const meta = (data.metadata as Record<string, unknown>) ?? {}
  const templates = (meta.email_templates as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ email_templates: templates })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { vendor_id, event_id, name, type, subject, body: templateBody } = body

  // type: 'TICKET_CONFIRMATION' | 'EVENT_REMINDER' | 'WAITLIST_OFFER' | 'REFUND_CONFIRMATION' | 'CUSTOM'

  if (!name || !type || !subject || !templateBody) {
    return NextResponse.json({ error: 'name, type, subject, body are required' }, { status: 400 })
  }

  const targetTable = event_id ? 'inventory_items' : 'vendor_accounts'
  const targetId = event_id ?? vendor_id

  if (!targetId) return NextResponse.json({ error: 'vendor_id or event_id is required' }, { status: 400 })

  const { data, error } = await supabase
    .from(targetTable)
    .select('metadata')
    .eq('id', targetId)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const meta = (data.metadata as Record<string, unknown>) ?? {}
  const templates = (meta.email_templates as Array<Record<string, unknown>>) ?? []

  const newTemplate = {
    id: randomUUID(),
    name,
    type,
    subject,
    body: templateBody,
    // Available tokens: {{attendee_name}}, {{event_title}}, {{event_date}}, {{qr_code_url}}, {{reservation_id}}, {{total_paid}}, {{vendor_name}}
    is_active: true,
    created_at: new Date().toISOString(),
  }

  templates.push(newTemplate)

  await supabase
    .from(targetTable)
    .update({ metadata: { ...meta, email_templates: templates } })
    .eq('id', targetId)

  return NextResponse.json({ email_template: newTemplate }, { status: 201 })
}
