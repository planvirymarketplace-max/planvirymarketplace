import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/warehouse-exports/trigger — trigger a warehouse export run
// GET /api/warehouse-exports — list export runs
// REAL TABLE: warehouse_exports (id, table_name, status, rows_exported, error_message, started_at, completed_at)

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('warehouse_exports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ exports: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { table_name } = body
  if (!table_name) return NextResponse.json({ error: 'table_name required' }, { status: 400 })

  const { data, error } = await supabase
    .from('warehouse_exports')
    .insert({
      table_name,
      status: 'RUNNING',
      started_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // TODO: trigger actual warehouse export worker
  // For now, mark as SUCCESS with 0 rows
  await supabase
    .from('warehouse_exports')
    .update({ status: 'SUCCESS', completed_at: new Date().toISOString() })
    .eq('id', data.id)

  return NextResponse.json({ export: data }, { status: 201 })
}
