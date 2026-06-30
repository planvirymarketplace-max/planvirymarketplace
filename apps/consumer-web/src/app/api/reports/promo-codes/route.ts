import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/reports/promo-codes?event_id=
// Returns per-promo-code usage stats: uses, revenue impact, remaining.
// Adapted from Hi.Events: PromoCodesReport

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  // Load promo codes from event metadata
  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const promoCodes = (meta.promo_codes as Array<Record<string, unknown>>) ?? []

  // Load all reservations for this event to count promo code usage
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, status, total_price_cents, metadata, created_at')
    .eq('item_id', eventId)
    .in('status', ['CONFIRMED', 'COMPLETED', 'CANCELLED'])

  // Build usage stats per promo code
  const report = promoCodes.map((promo) => {
    const code = promo.code as string
    const usedBy = (reservations ?? []).filter((r: Record<string, unknown>) => {
      const rMeta = (r.metadata as Record<string, unknown>) ?? {}
      return rMeta.promo_code === code
    })

    const confirmedUses = usedBy.filter((r: Record<string, unknown>) =>
      ['CONFIRMED', 'COMPLETED'].includes(r.status as string)
    )

    const revenueImpact = confirmedUses.reduce((s: number, r: Record<string, unknown>) => {
      const rMeta = (r.metadata as Record<string, unknown>) ?? {}
      return s + ((rMeta.promo_discount_cents as number) ?? 0)
    }, 0)

    const revenueAfterDiscount = confirmedUses.reduce((s: number, r: Record<string, unknown>) => {
      return s + ((r.total_price_cents as number) ?? 0)
    }, 0)

    return {
      id: promo.id,
      code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      max_uses: promo.max_uses,
      uses: confirmedUses.length,
      remaining: promo.max_uses !== null ? Math.max(0, (promo.max_uses as number) - confirmedUses.length) : null,
      revenue_after_discount_cents: revenueAfterDiscount,
      discount_impact_cents: revenueImpact,
      expires_at: promo.expires_at,
      is_expired: promo.expires_at ? new Date(promo.expires_at as string) < new Date() : false,
      created_at: promo.created_at,
    }
  })

  const totals = {
    total_codes: report.length,
    active_codes: report.filter((r) => !r.is_expired && (r.remaining === null || r.remaining > 0)).length,
    total_uses: report.reduce((s, r) => s + r.uses, 0),
    total_discount_impact_cents: report.reduce((s, r) => s + r.discount_impact_cents, 0),
  }

  return NextResponse.json({ promo_codes: report, totals })
}
