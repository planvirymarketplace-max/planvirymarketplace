import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/tax-and-fees — create tax/fee config for an event
// GET /api/tax-and-fees?event_id= — list taxes/fees for an event
// Adapted from Hi.Events: TaxAndFee model, TaxAndFeeController

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const taxes = (meta.taxes_and_fees as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ taxes_and_fees: taxes })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, name, type, calculation_type, rate, is_active = true } = body

  // type: 'TAX' | 'FEE'
  // calculation_type: 'PERCENTAGE' | 'FIXED'
  // rate: percentage (0-100) or cents

  if (!event_id || !name || !type || !calculation_type || rate === undefined) {
    return NextResponse.json({ error: 'event_id, name, type, calculation_type, rate are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const taxes = (meta.taxes_and_fees as Array<Record<string, unknown>>) ?? []

  const newTax = {
    id: randomUUID(),
    name,
    type,
    calculation_type,
    rate,
    is_active,
    created_at: new Date().toISOString(),
  }

  taxes.push(newTax)

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, taxes_and_fees: taxes } })
    .eq('id', event_id)

  return NextResponse.json({ tax_or_fee: newTax }, { status: 201 })
}
