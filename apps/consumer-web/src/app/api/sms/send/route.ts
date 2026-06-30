import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/sms/send — queue an SMS message
// REAL TABLE: sms_messages (id, user_id, phone, message, twilio_message_id, status, sent_at, delivered_at, is_critical, created_at, updated_at)

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { phone, message, is_critical = false } = body
  if (!phone || !message) return NextResponse.json({ error: 'phone and message required' }, { status: 400 })

  // Check SMS consent (BR-SMS-001: TCPA compliance)
  const { data: consent } = await supabase
    .from('sms_consents')
    .select('status')
    .eq('user_id', user.id)
    .eq('phone', phone)
    .eq('status', 'CONFIRMED')
    .maybeSingle()

  if (!consent && !is_critical) {
    return NextResponse.json({ error: 'No SMS consent on file for this phone number' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('sms_messages')
    .insert({
      user_id: user.id,
      phone,
      message,
      status: 'QUEUED',
      is_critical,
    })
    .select('id, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // TODO: wire to Twilio API when SMS credentials are provided
  // For now, the message is queued and a worker picks it up

  return NextResponse.json({ sms_message: data }, { status: 201 })
}
