import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/event-images — upload event image (creates media_asset record)
// DELETE /api/event-images?id= — delete image
// Adapted from Hi.Events: CreateEventImageHandler, DeleteEventImageHandler

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, url, alt_text, media_type = 'IMAGE', is_primary = false, sort_order = 0 } = body

  if (!event_id || !url) {
    return NextResponse.json({ error: 'event_id and url are required' }, { status: 400 })
  }

  // Verify user owns the event
  const { data: event } = await supabase
    .from('inventory_items')
    .select('vendor_id')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('role')
    .eq('vendor_id', event.vendor_id)
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  // If is_primary, unset existing primary
  if (is_primary) {
    await supabase
      .from('media_assets')
      .update({ is_primary: false })
      .eq('item_id', event_id)
      .eq('is_primary', true)
  }

  const { data: media, error } = await supabase
    .from('media_assets')
    .insert({
      item_id: event_id,
      url,
      alt_text,
      media_type,
      is_primary,
      sort_order,
    })
    .select('id, url, alt_text, is_primary, sort_order')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ media }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const mediaId = searchParams.get('id')

  if (!mediaId) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', mediaId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deleted: true, id: mediaId })
}
