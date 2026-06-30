import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/email-templates/[id]/preview — preview template with token substitution
// Replaces {{attendee_name}}, {{event_title}}, etc. with sample values.
// Adapted from Hi.Events: PreviewEmailTemplateHandler

const SAMPLE_DATA: Record<string, string> = {
  '{{attendee_name}}': 'Jane Doe',
  '{{event_title}}': 'Austin Music Festival 2026',
  '{{event_date}}': 'August 15, 2026 at 7:00 PM',
  '{{event_location}}': 'Zilker Park, Austin TX',
  '{{qr_code_url}}': 'https://planviry.com/tickets/qr?reservation_id=sample',
  '{{reservation_id}}': 'RES-ABC12345',
  '{{total_paid}}': '$245.00',
  '{{vendor_name}}': 'The Austin Grand Hotel',
  '{{check_in_time}}': '6:00 PM',
  '{{seating}}': 'General Admission',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createAdminClient()
  const { id } = await params
  const body = await request.json()
  const { vendor_id, event_id, override_data } = body

  // Find the template
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
  const template = templates.find((t) => t.id === id)

  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  // Substitute tokens
  const substitutionData = { ...SAMPLE_DATA, ...(override_data ?? {}) }
  let previewSubject = template.subject as string
  let previewBody = template.body as string

  for (const [token, value] of Object.entries(substitutionData)) {
    previewSubject = previewSubject.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value)
    previewBody = previewBody.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  return NextResponse.json({
    template_id: id,
    template_name: template.name,
    preview_subject: previewSubject,
    preview_body: previewBody,
    sample_data: substitutionData,
  })
}
