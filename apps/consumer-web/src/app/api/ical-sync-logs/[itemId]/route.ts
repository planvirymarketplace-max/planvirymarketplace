import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/ical-sync-logs/[itemId] — list iCal sync logs for an item
// REAL TABLE: ical_sync_logs (id, item_id, feed_url, status, events_imported, parse_errors, synced_at)

export async function GET(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('ical_sync_logs')
    .select('*')
    .eq('item_id', itemId)
    .order('synced_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data ?? [] })
}
