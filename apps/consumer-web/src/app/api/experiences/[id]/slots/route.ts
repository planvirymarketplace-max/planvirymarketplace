import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSlots } from '@/../../../../../shared/slots'

// GET /api/experiences/[id]/slots?date=2026-07-01
// Returns available time slots for an experience on a given date.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  if (!dateStr) return NextResponse.json({ error: 'date is required' }, { status: 400 })

  const date = new Date(dateStr + 'T00:00:00Z')
  const slots = await getSlots(id, date, 60, 90) // 60min interval, 90min experience

  return NextResponse.json({ slots, date: dateStr })
}
