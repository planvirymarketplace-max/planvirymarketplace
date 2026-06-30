import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/vendor-onboarding/[vendorId] — get onboarding step status
// PATCH /api/vendor-onboarding/[vendorId] — update a step (mark complete/incomplete)
// REAL TABLE: vendor_onboarding_steps (id, vendor_id, step_name, status, data, completed_at, updated_at)

export async function GET(request: NextRequest, { params }: { params: Promise<{ vendorId: string }> }) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { vendorId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('vendor_onboarding_steps')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If no steps exist, return the default onboarding template
  if (!data || data.length === 0) {
    const defaultSteps = [
      { step_name: 'profile', status: 'NOT_STARTED' },
      { step_name: 'stripe_connect', status: 'NOT_STARTED' },
      { step_name: 'first_listing', status: 'NOT_STARTED' },
      { step_name: 'payout_setup', status: 'NOT_STARTED' },
    ]
    return NextResponse.json({ steps: defaultSteps, vendor_id: vendorId, initialized: false })
  }

  return NextResponse.json({ steps: data, vendor_id: vendorId, initialized: true })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ vendorId: string }> }) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { vendorId } = await params
  const supabase = createAdminClient()
  const body = await request.json()
  const { step_name, status, data: stepData } = body

  if (!step_name || !status) return NextResponse.json({ error: 'step_name and status required' }, { status: 400 })

  // Upsert the step
  const { data: existing } = await supabase
    .from('vendor_onboarding_steps')
    .select('id')
    .eq('vendor_id', vendorId)
    .eq('step_name', step_name)
    .maybeSingle()

  let result
  if (existing) {
    const update: Record<string, unknown> = { status }
    if (stepData !== undefined) update.data = stepData
    if (status === 'COMPLETED') update.completed_at = new Date().toISOString()
    ;({ data: result, error: null } = await supabase.from('vendor_onboarding_steps').update(update).eq('id', existing.id).select('*').single())
  } else {
    ;({ data: result, error: null } = await supabase.from('vendor_onboarding_steps').insert({
      vendor_id: vendorId,
      step_name,
      status,
      data: stepData ?? {},
      completed_at: status === 'COMPLETED' ? new Date().toISOString() : null,
    }).select('*').single())
  }

  return NextResponse.json({ step: result })
}
