import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/tickets/queue/[tierId]
// Gets waitlist position for a ticket tier (Part 12)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's queue entry
  const { data: myEntry } = await supabase
    .from('ticket_queue')
    .select('id, position, status, offer_expires_at')
    .eq('ticket_tier_id', tierId)
    .eq('user_id', user.id)
    .single()

  // Get total in queue
  const { count } = await supabase
    .from('ticket_queue')
    .select('*', { count: 'exact', head: true })
    .eq('ticket_tier_id', tierId)
    .eq('status', 'waiting')

  return NextResponse.json({
    my_entry: myEntry,
    total_waiting: count ?? 0,
  })
}

// POST /api/tickets/queue/[tierId]
// Join the waitlist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get current max position
  const { data: lastEntry } = await supabase
    .from('ticket_queue')
    .select('position')
    .eq('ticket_tier_id', tierId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const nextPosition = (lastEntry?.position ?? 0) + 1

  const { data, error } = await supabase
    .from('ticket_queue')
    .insert({
      ticket_tier_id: tierId,
      user_id: user.id,
      position: nextPosition,
      status: 'waiting',
    })
    .select('id, position, status')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
