import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/events/[eventId]/stats
// Returns: total_sold, total_revenue, check_in_count, attendance_rate, daily_breakdown
// Adapted from Hi.Events: EventStatsFetchService, GetEventStatsHandler

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const supabase = createAdminClient()
  const { eventId } = await params

  // Total reservations by status
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, status, quantity, total_price_cents, created_at')
    .eq('item_id', eventId)

  const stats = {
    total_reservations: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    expired: 0,
    completed: 0,
    no_show: 0,
    total_tickets_sold: 0,
    total_revenue_cents: 0,
    check_in_count: 0,
    attendance_rate: 0,
    daily_sales: [] as Array<{ date: string; tickets: number; revenue: number }>,
  }

  if (!reservations || reservations.length === 0) {
    return NextResponse.json({ stats })
  }

  // Aggregate
  const dailyMap: Record<string, { tickets: number; revenue: number }> = {}

  for (const r of reservations as Array<Record<string, unknown>>) {
    stats.total_reservations++
    const status = r.status as string
    const qty = (r.quantity as number) ?? 0
    const revenue = (r.total_price_cents as number) ?? 0
    const date = (r.created_at as string)?.slice(0, 10) ?? 'unknown'

    if (!dailyMap[date]) dailyMap[date] = { tickets: 0, revenue: 0 }
    dailyMap[date].tickets += qty
    dailyMap[date].revenue += revenue

    if (status in stats) {
      ;(stats as Record<string, number>)[status] = ((stats as Record<string, number>)[status] ?? 0) + 1
    }

    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      stats.total_tickets_sold += qty
      stats.total_revenue_cents += revenue
    }
  }

  stats.daily_sales = Object.entries(dailyMap)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Check-in count
  const { count: checkInCount } = await supabase
    .from('check_ins')
    .select('id', { count: 'exact', head: true })

  // Need to filter check_ins by event — join through reservations
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('id, reservation_id')
    .limit(10000)

  if (checkIns) {
    const reservationIds = new Set(reservations.map((r: Record<string, unknown>) => r.id))
    stats.check_in_count = checkIns.filter((c: Record<string, unknown>) =>
      reservationIds.has(c.reservation_id as string)
    ).length
  }

  stats.attendance_rate = stats.total_tickets_sold > 0
    ? Math.round((stats.check_in_count / stats.total_tickets_sold) * 100)
    : 0

  return NextResponse.json({ stats })
}
