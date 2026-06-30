import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/questions — create custom registration question for an event
// GET /api/questions?event_id= — list questions for an event
// Adapted from Hi.Events: Question model, CreateQuestionHandler

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
  const questions = (meta.questions as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ questions })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, title, type, options, required, sort_order } = body

  if (!event_id || !title || !type) {
    return NextResponse.json({ error: 'event_id, title, type are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const questions = (meta.questions as Array<Record<string, unknown>>) ?? []

  const newQuestion = {
    id: randomUUID(),
    title,
    type, // 'TEXT' | 'TEXTAREA' | 'SELECT' | 'MULTISELECT' | 'RADIO' | 'CHECKBOX' | 'DATE' | 'NUMBER' | 'PHONE' | 'EMAIL'
    options: options ?? null,
    required: required ?? false,
    sort_order: sort_order ?? questions.length,
  }

  questions.push(newQuestion)
  questions.sort((a, b) => (a.sort_order as number) - (b.sort_order as number))

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, questions } })
    .eq('id', event_id)

  return NextResponse.json({ question: newQuestion }, { status: 201 })
}
