import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSlots } from '@/../../../../../shared/slots'

// GET /api/inventory/[id]/slots?date=2026-07-01&interval=60&duration=60
// Returns available time slots for an inventory item on a given date.
// Adapted from Cal.com getSlots.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')
  const interval = parseInt(searchParams.get('interval') ?? '60', 10)
  const duration = parseInt(searchParams.get('duration') ?? '60', 10)

  if (!dateStr) return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 })

  const date = new Date(dateStr + 'T00:00:00Z')
  const slots = await getSlots(id, date, interval, duration)

  return NextResponse.json({ slots, date: dateStr, total: slots.length, available: slots.filter(s => s.available).length })
}
