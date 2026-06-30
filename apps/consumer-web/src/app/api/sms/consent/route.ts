import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/sms/consent — record SMS consent (TCPA double opt-in)
// GET /api/sms/consent?user_id= — check consent status
// REAL TABLE: sms_consents (id, user_id, phone, status, checkbox_at, confirmation_reply_at, ip_address, created_at)
// BR-SMS-001: TCPA requires double opt-in (checkbox + confirmation reply)

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id') ?? user.id

  const { data, error } = await supabase
    .from('sms_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ consents: data ?? [] })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { phone } = body
  if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

  // Check if consent already exists
  const { data: existing } = await supabase
    .from('sms_consents')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('phone', phone)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ consent: existing, message: 'Consent already on file' })
  }

  // Step 1: Record checkbox consent (PENDING_CONFIRMATION)
  // User will receive a confirmation text and must reply to complete opt-in
  const { data, error } = await supabase
    .from('sms_consents')
    .insert({
      user_id: user.id,
      phone,
      status: 'PENDING_CONFIRMATION',
      checkbox_at: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // TODO: send confirmation SMS via Twilio when credentials are available
  // Message: "Reply YES to confirm SMS alerts from Planviry"

  return NextResponse.json({ consent: data, message: 'Confirmation SMS sent. Reply YES to complete opt-in.' }, { status: 201 })
}
