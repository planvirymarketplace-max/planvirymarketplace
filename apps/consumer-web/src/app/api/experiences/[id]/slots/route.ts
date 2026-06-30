import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/experiences/[id]/slots
// Fetch available experience slots (Part 44)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: experienceId } = await params
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let query = supabase
    .from('experience_slots')
    .select('id, slot_date, slot_time, capacity, booked_count, is_available')
    .eq('experience_id', experienceId)
    .eq('is_available', true)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  if (startDate) query = query.gte('slot_date', startDate)
  if (endDate) query = query.lte('slot_date', endDate)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Compute remaining capacity
  const slots = (data ?? []).map((slot) => ({
    ...slot,
    remaining: slot.capacity - slot.booked_count,
  }))

  return NextResponse.json({ slots })
}
