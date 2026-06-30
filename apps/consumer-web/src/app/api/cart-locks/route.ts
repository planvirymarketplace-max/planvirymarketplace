import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/cart-locks — lock a cart (prevent double-checkout)
// GET /api/cart-locks?cart_id= — check if locked
// DELETE /api/cart-locks/[id] — unlock
// REAL TABLE: cart_locks (id, cart_id, user_id, status, locked_at, expires_at, released_at, created_at, updated_at)

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const cartId = searchParams.get('cart_id')
  if (!cartId) return NextResponse.json({ error: 'cart_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('cart_locks')
    .select('*')
    .eq('cart_id', cartId)
    .eq('status', 'LOCKED')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ locked: !!data, lock: data })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { cart_id } = body
  if (!cart_id) return NextResponse.json({ error: 'cart_id required' }, { status: 400 })

  // Check if already locked
  const { data: existing } = await supabase
    .from('cart_locks')
    .select('id, expires_at')
    .eq('cart_id', cart_id)
    .eq('status', 'LOCKED')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Cart is already locked', lock: existing }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('cart_locks')
    .insert({
      cart_id,
      user_id: user.id,
      status: 'LOCKED',
      locked_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 10 * 60_000).toISOString(), // 10 min lock
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lock: data }, { status: 201 })
}
