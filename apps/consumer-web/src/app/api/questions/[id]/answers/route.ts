import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/questions/[id]/answers — store attendee's answer to a custom question
// Stores answers in the reservation's metadata.answers array.
// Adapted from Hi.Events: QuestionAnswer model, EditQuestionAnswerHandler

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: questionId } = await params
  const body = await request.json()
  const { reservation_id, answer } = body

  if (!reservation_id || answer === undefined) {
    return NextResponse.json({ error: 'reservation_id and answer are required' }, { status: 400 })
  }

  // Load reservation
  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, user_id, metadata')
    .eq('id', reservation_id)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Store answer in reservation metadata
  const meta = (reservation.metadata as Record<string, unknown>) ?? {}
  const answers = (meta.answers as Array<Record<string, unknown>>) ?? []

  // Remove existing answer for this question
  const filtered = answers.filter((a) => a.question_id !== questionId)
  filtered.push({ question_id: questionId, answer, answered_at: new Date().toISOString() })

  await supabase
    .from('reservations')
    .update({ metadata: { ...meta, answers: filtered } })
    .eq('id', reservation_id)

  return NextResponse.json({ question_id: questionId, answer, stored: true }, { status: 201 })
}
