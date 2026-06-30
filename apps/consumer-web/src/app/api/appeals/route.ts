import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/appeals — submit an appeal for a moderation action
// GET /api/appeals?moderation_action_id= — list appeals
// PATCH /api/appeals/[id] — resolve (uphold/overturn)
// REAL TABLE: appeals (id, moderation_action_id, user_id, reason, status, submitted_at, resolved_at, resolved_by)

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const actionId = searchParams.get('moderation_action_id')

  let query = supabase.from('appeals').select('*')
  if (actionId) query = query.eq('moderation_action_id', actionId)

  const { data, error } = await query.order('submitted_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ appeals: data ?? [] })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { moderation_action_id, reason } = body
  if (!reason) return NextResponse.json({ error: 'reason required' }, { status: 400 })

  const { data, error } = await supabase
    .from('appeals')
    .insert({
      moderation_action_id: moderation_action_id ?? null,
      user_id: user.id,
      reason,
      status: 'SUBMITTED',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ appeal: data }, { status: 201 })
}
