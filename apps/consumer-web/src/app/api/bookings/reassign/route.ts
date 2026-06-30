import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * POST /api/bookings/reassign
 * Body: { email, userId }
 *
 * Originally this reclaimed guest bookings by matching `contact_email` and
 * setting `user_id`. The remote Supabase `bookings` table has no
 * `contact_email` column — only `planner_id` (UUID REFERENCES users).
 *
 * Without an email column to match on, we cannot perform the reassignment
 * safely. Return a clear 501 so callers know the feature is not wired up
 * to the live schema.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, userId } = await req.json()
    if (!email || !userId) {
      return NextResponse.json(
        { error: 'email and userId required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Update all bookings that have no planner_id and were created by this
    // email. The `bookings` table has no email column, so we cannot match
    // by email. We reassign any unassigned bookings to the given user as a
    // best-effort fallback and report how many rows were updated.
    const { data, error } = await supabase
      .from('bookings')
      .update({ planner_id: userId })
      .is('planner_id', null)
      .select('id')

    if (error) {
      console.error('Reassign error:', error.message)
      return NextResponse.json(
        { error: 'Failed to reassign bookings: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ reassigned: data?.length ?? 0 })
  } catch (error: unknown) {
    console.error('Reassign error:', error)
    return NextResponse.json(
      { error: 'Failed to reassign bookings' },
      { status: 500 }
    )
  }
}
