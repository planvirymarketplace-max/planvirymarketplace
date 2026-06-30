import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/reports/daily-sales?event_id=&from=&to=
// Returns daily ticket sales + revenue breakdown.
// Adapted from Hi.Events: DailySalesReport, AbstractOrganizerReportService

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')
  const from = searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  const to = searchParams.get('to') ?? new Date().toISOString().slice(0, 10)

  let query = supabase
    .from('reservations')
    .select('id, status, quantity, total_price_cents, created_at, cancelled_at, confirmed_at')
    .gte('created_at', from + 'T00:00:00Z')
    .lte('created_at', to + 'T23:59:59Z')

  if (eventId) {
    query = query.eq('item_id', eventId)
  }

  const { data: reservations, error } = await query.order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by day
  const dailyMap: Record<string, {
    date: string
    tickets_sold: number
    revenue_cents: number
    refunds_cents: number
    reservations_created: number
    reservations_confirmed: number
    reservations_cancelled: number
  }> = {}

  for (const r of (reservations ?? []) as Array<Record<string, unknown>>) {
    const date = (r.created_at as string)?.slice(0, 10) ?? 'unknown'
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        tickets_sold: 0,
        revenue_cents: 0,
        refunds_cents: 0,
        reservations_created: 0,
        reservations_confirmed: 0,
        reservations_cancelled: 0,
      }
    }

    dailyMap[date].reservations_created++
    const status = r.status as string
    const qty = (r.quantity as number) ?? 0
    const revenue = (r.total_price_cents as number) ?? 0

    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      dailyMap[date].tickets_sold += qty
      dailyMap[date].revenue_cents += revenue
      dailyMap[date].reservations_confirmed++
    }
    if (status === 'CANCELLED') {
      dailyMap[date].refunds_cents += (r.refund_amount_cents as number) ?? 0
      dailyMap[date].reservations_cancelled++
    }
  }

  const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date))

  // Totals
  const totals = daily.reduce((acc, d) => ({
    tickets_sold: acc.tickets_sold + d.tickets_sold,
    revenue_cents: acc.revenue_cents + d.revenue_cents,
    refunds_cents: acc.refunds_cents + d.refunds_cents,
    reservations_created: acc.reservations_created + d.reservations_created,
    reservations_confirmed: acc.reservations_confirmed + d.reservations_confirmed,
    reservations_cancelled: acc.reservations_cancelled + d.reservations_cancelled,
  }), {
    tickets_sold: 0,
    revenue_cents: 0,
    refunds_cents: 0,
    reservations_created: 0,
    reservations_confirmed: 0,
    reservations_cancelled: 0,
  })

  return NextResponse.json({ daily, totals, from, to })
}
