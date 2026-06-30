import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// GET /api/affiliates?vendor_id= — list affiliates
// POST /api/affiliates — create affiliate (referral tracking + commission)
// Adapted from Hi.Events: Affiliate model, CreateAffiliateHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendor_id')

  if (!vendorId) return NextResponse.json({ error: 'vendor_id is required' }, { status: 400 })

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendorId)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const affiliates = (meta.affiliates as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ affiliates })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { vendor_id, name, email, commission_type, commission_value, code } = body

  if (!vendor_id || !name || !commission_type || !commission_value) {
    return NextResponse.json({ error: 'vendor_id, name, commission_type, commission_value are required' }, { status: 400 })
  }

  // commission_type: 'PERCENTAGE' | 'FIXED'
  // commission_value: percentage (0-100) or cents

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendor_id)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const affiliates = (meta.affiliates as Array<Record<string, unknown>>) ?? []

  const affiliateCode = code ?? `${name.toUpperCase().replace(/[^A-Z0-9]/g, '')}${randomUUID().slice(0, 4)}`

  // Check for duplicate code
  if (affiliates.some((a) => a.code === affiliateCode)) {
    return NextResponse.json({ error: 'Affiliate code already exists' }, { status: 409 })
  }

  const newAffiliate = {
    id: randomUUID(),
    name,
    email: email ?? null,
    code: affiliateCode,
    commission_type,
    commission_value,
    status: 'ACTIVE',
    clicks: 0,
    conversions: 0,
    total_commission_cents: 0,
    created_at: new Date().toISOString(),
  }

  affiliates.push(newAffiliate)

  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, affiliates } })
    .eq('id', vendor_id)

  return NextResponse.json({ affiliate: newAffiliate }, { status: 201 })
}
