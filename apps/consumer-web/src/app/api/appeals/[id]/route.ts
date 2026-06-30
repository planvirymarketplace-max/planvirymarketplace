import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/appeals/[id] — resolve an appeal (status: UNDER_REVIEW → UPHELD/OVERTURNED)
// REAL TABLE: appeals

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params
  const body = await request.json()
  const { status } = body // UPHELD | OVERTURNED | UNDER_REVIEW

  if (!['UPHELD', 'OVERTURNED', 'UNDER_REVIEW'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const update: Record<string, unknown> = { status }
  if (status === 'UPHELD' || status === 'OVERTURNED') {
    update.resolved_at = new Date().toISOString()
    update.resolved_by = user.id
  }

  const { data, error } = await supabase
    .from('appeals')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await supabase.from('audit_log').insert({ actor_id: user.id, action: 'UPDATE', entity_type: 'appeal', entity_id: id, changes: { status } })

  return NextResponse.json({ appeal: data })
}
