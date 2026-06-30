import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/contracts/[id]/sign
// Either party signs the contract (Part 12)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: contractId } = await params
  const body = await request.json()
  const { role } = body // 'vendor' or 'planner'

  if (!role || !['vendor', 'planner'].includes(role)) {
    return NextResponse.json({ error: 'role must be "vendor" or "planner"' }, { status: 400 })
  }

  // Get the contract
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('id, vendor_id, planner_id, status, vendor_signed_at, planner_signed_at')
    .eq('id', contractId)
    .single()

  if (contractError || !contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
  }

  if (contract.status === 'signed') {
    return NextResponse.json({ error: 'Contract already fully signed' }, { status: 400 })
  }

  // Verify the signer is the correct party
  if (role === 'vendor') {
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!vendor || vendor.id !== contract.vendor_id) {
      return NextResponse.json({ error: 'Only the assigned vendor can sign' }, { status: 403 })
    }

    if (contract.vendor_signed_at) {
      return NextResponse.json({ error: 'Vendor has already signed' }, { status: 400 })
    }

    const { error: signError } = await supabase
      .from('contracts')
      .update({ vendor_signed_at: new Date().toISOString() })
      .eq('id', contractId)

    if (signError) {
      return NextResponse.json({ error: signError.message }, { status: 500 })
    }
  } else {
    if (contract.planner_id !== user.id) {
      return NextResponse.json({ error: 'Only the assigned planner can sign' }, { status: 403 })
    }

    if (contract.planner_signed_at) {
      return NextResponse.json({ error: 'Planner has already signed' }, { status: 400 })
    }

    const { error: signError } = await supabase
      .from('contracts')
      .update({ planner_signed_at: new Date().toISOString() })
      .eq('id', contractId)

    if (signError) {
      return NextResponse.json({ error: signError.message }, { status: 500 })
    }
  }

  // Check if both parties have now signed
  const { data: updated } = await supabase
    .from('contracts')
    .select('vendor_signed_at, planner_signed_at, status')
    .eq('id', contractId)
    .single()

  let contractStatus = updated?.status ?? 'draft'
  let bothSigned = false

  if (updated?.vendor_signed_at && updated?.planner_signed_at) {
    bothSigned = true
    contractStatus = 'signed'
    await supabase
      .from('contracts')
      .update({ status: 'signed' })
      .eq('id', contractId)

    // Notify both parties
    await supabase.from('notifications').insert([
      {
        user_id: contract.vendor_id,
        category: 'booking',
        title: 'Contract fully signed',
        body: 'Contract signed. Proceed to checkout to confirm booking.',
        link: '/vendor/portal/bookings',
      },
      {
        user_id: contract.planner_id,
        category: 'booking',
        title: 'Contract fully signed',
        body: 'Contract signed. Proceed to checkout to confirm booking.',
        link: '/checkout',
      },
    ])
  }

  return NextResponse.json({
    contract_id: contractId,
    role_signed: role,
    both_parties_signed: bothSigned,
    contract_status: contractStatus,
    message: bothSigned
      ? 'Contract fully signed. Planner can now proceed to checkout.'
      : `${role} signed. Waiting for the other party.`,
  })
}
