import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHash } from 'crypto'

// POST /api/secret-rotations/rotate — record a secret rotation (audit log)
// REAL TABLE: secret_rotations (id, secret_name, provider, status, rotated_by, previous_hash, new_hash, notes, created_at, completed_at)

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { secret_name, provider = 'DOPPLER', previous_value, new_value, notes } = body
  if (!secret_name) return NextResponse.json({ error: 'secret_name required' }, { status: 400 })

  // Hash the values (never store raw secrets)
  const previous_hash = previous_value ? createHash('sha256').update(previous_value).digest('hex') : null
  const new_hash = new_value ? createHash('sha256').update(new_value).digest('hex') : null

  const { data, error } = await supabase
    .from('secret_rotations')
    .insert({
      secret_name,
      provider,
      status: 'COMPLETED',
      rotated_by: user.id,
      previous_hash,
      new_hash,
      notes: notes ?? null,
      completed_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await supabase.from('audit_log').insert({
    actor_id: user.id,
    action: 'CREATE',
    entity_type: 'secret_rotation',
    entity_id: data.id,
    changes: { secret_name, provider },
  })

  return NextResponse.json({ rotation: data }, { status: 201 })
}
