import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/events/[eventId]/duplicate
// Clones an event (inventory_item) + all ticket_tiers + media_assets.
// Adapted from Hi.Events: DuplicateEventService.php

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { eventId } = await params
  const body = await request.json().catch(() => ({}))
  const { new_title, new_start_date } = body as { new_title?: string; new_start_date?: string }

  // Load original event
  const { data: original, error: loadErr } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', eventId)
    .maybeSingle()

  if (loadErr || !original) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  // Clone with new slug + DRAFT status
  const newSlug = `${original.slug}-copy-${Date.now().toString(36)}`
  const { data: cloned, error: cloneErr } = await supabase
    .from('inventory_items')
    .insert({
      vendor_id: original.vendor_id,
      location_id: original.location_id,
      title: new_title ?? `${original.title} (Copy)`,
      slug: newSlug,
      description: original.description,
      category: original.category,
      status: 'DRAFT',
      base_price_cents: original.base_price_cents,
      currency: original.currency,
      max_quantity_per_booking: original.max_quantity_per_booking,
      cancellation_policy: original.cancellation_policy,
      metadata: {
        ...(original.metadata as object),
        ...(new_start_date ? { starts_at: new_start_date } : {}),
        duplicated_from: original.id,
      },
    })
    .select('id, title, slug, status')
    .single()

  if (cloneErr) {
    console.error('[duplicate] clone error:', cloneErr)
    return NextResponse.json({ error: 'Failed to duplicate event' }, { status: 500 })
  }

  // Clone ticket_tiers
  const { data: tiers } = await supabase
    .from('ticket_tiers')
    .select('*')
    .eq('item_id', eventId)

  if (tiers && tiers.length > 0) {
    const newTiers = tiers.map((t: Record<string, unknown>) => ({
      item_id: cloned.id,
      name: t.name,
      description: t.description,
      price_cents: t.price_cents,
      quantity_total: t.quantity_total,
      quantity_reserved: 0, // reset
      sort_order: t.sort_order,
    }))
    await supabase.from('ticket_tiers').insert(newTiers)
  }

  // Clone media_assets
  const { data: media } = await supabase
    .from('media_assets')
    .select('*')
    .eq('item_id', eventId)

  if (media && media.length > 0) {
    const newMedia = media.map((m: Record<string, unknown>) => ({
      item_id: cloned.id,
      url: m.url,
      alt_text: m.alt_text,
      media_type: m.media_type,
      sort_order: m.sort_order,
      is_primary: m.is_primary,
    }))
    await supabase.from('media_assets').insert(newMedia)
  }

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'event.duplicated',
    entity_type: 'inventory_item',
    entity_id: cloned.id,
    payload: { original_event_id: eventId, duplicated_by: user.id },
  })

  return NextResponse.json({
    original_id: eventId,
    new_event: cloned,
    cloned_tiers: tiers?.length ?? 0,
    cloned_media: media?.length ?? 0,
  }, { status: 201 })
}
