import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/experiments/[id]/results — get A/B test results
// REAL TABLE: experiment_results (id, analytics_id, flag_key, variant, metric_name, metric_value, sample_count, period_start, period_end)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const metric = searchParams.get('metric')

  let query = supabase.from('experiment_results').select('*').eq('flag_key', id)
  if (metric) query = query.eq('metric_name', metric)

  const { data, error } = await query.order('period_start', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by variant
  const byVariant: Record<string, Array<Record<string, unknown>>> = {}
  for (const r of data ?? []) {
    const v = (r as Record<string, unknown>).variant as string
    if (!byVariant[v]) byVariant[v] = []
    byVariant[v].push(r as Record<string, unknown>)
  }

  return NextResponse.json({ experiment_id: id, results: data ?? [], by_variant: byVariant })
}
