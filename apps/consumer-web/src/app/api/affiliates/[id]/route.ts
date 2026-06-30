import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/affiliates/[id] — update affiliate (commission, status)
// DELETE /api/affiliates/[id] — delete affiliate
// Adapted from Hi.Events: UpdateAffiliateHandler, DeleteAffiliateHandler

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params
  const body = await request.json()
  const { vendor_id, name, email, commission_type, commission_value, status } = body

  if (!vendor_id) return NextResponse.json({ error: 'vendor_id is required' }, { status: 400 })

  const { data: vendor } = await supabase
    .from('vendor_accounts')
    .select('metadata')
    .eq('id', vendor_id)
    .maybeSingle()

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const meta = (vendor.metadata as Record<string, unknown>) ?? {}
  const affiliates = (meta.affiliates as Array<Record<string, unknown>>) ?? []
  const affiliate = affiliates.find((a) => a.id === id)

  if (!affiliate) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })

  if (name !== undefined) affiliate.name = name
  if (email !== undefined) affiliate.email = email
  if (commission_type !== undefined) affiliate.commission_type = commission_type
  if (commission_value !== undefined) affiliate.commission_value = commission_value
  if (status !== undefined) affiliate.status = status

  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, affiliates } })
    .eq('id', vendor_id)

  return NextResponse.json({ affiliate })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params
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
  const filtered = affiliates.filter((a) => a.id !== id)

  if (affiliates.length === filtered.length) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  await supabase
    .from('vendor_accounts')
    .update({ metadata: { ...meta, affiliates: filtered } })
    .eq('id', vendorId)

  return NextResponse.json({ deleted: true, id })
}
