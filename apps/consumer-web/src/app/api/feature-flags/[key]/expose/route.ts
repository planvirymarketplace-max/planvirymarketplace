import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/feature-flags/[key]/expose — record user exposure to a flag variant
// REAL TABLE: feature_flag_exposures (id, flag_key, user_id, variant, exposed_at)
// Required by BR-EXP-001 (stickiness — each user sees only one variant)

export async function POST(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { key } = await params
  const body = await request.json()
  const { variant } = body
  if (!variant) return NextResponse.json({ error: 'variant required' }, { status: 400 })

  // Check if already exposed (stickiness)
  const { data: existing } = await supabase
    .from('feature_flag_exposures')
    .select('variant')
    .eq('flag_key', key)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    // Return existing exposure — user is locked to this variant
    return NextResponse.json({ flag_key: key, variant: existing.variant, already_exposed: true })
  }

  // Create new exposure
  const { data, error } = await supabase
    .from('feature_flag_exposures')
    .insert({ flag_key: key, user_id: user.id, variant })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ exposure: data, already_exposed: false }, { status: 201 })
}
