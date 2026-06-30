import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/payment-methods?user_id= — list saved payment methods
// POST /api/payment-methods — save a payment method (stripe_payment_method_id)
// DELETE /api/payment-methods/[id] — remove
// REAL TABLE: payment_methods

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ payment_methods: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { user_id, stripe_payment_method_id, label } = body
  if (!user_id || !stripe_payment_method_id) return NextResponse.json({ error: 'user_id and stripe_payment_method_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('payment_methods')
    .insert({ user_id, stripe_payment_method_id, label: label ?? null })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ payment_method: data }, { status: 201 })
}
