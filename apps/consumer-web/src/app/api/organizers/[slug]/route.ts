import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/organizers/[slug] — public organizer page data
// Returns: vendor profile, public events, stats.
// Adapted from Hi.Events: GetPublicOrganizerHandler

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const supabase = createAdminClient()
  const { slug } = await params

  const { data: vendor, error } = await supabase
    .from('vendor_accounts')
    .select(`
      id, name, slug, description, address, phone, email, website_url,
      latitude, longitude, status, onboarded_at, created_at,
      locations(name, region)
    `)
    .eq('slug', slug)
    .in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])
    .maybeSingle()

  if (error || !vendor) {
    return NextResponse.json({ error: 'Organizer not found' }, { status: 404 })
  }

  // Get public events for this vendor
  const { data: events } = await supabase
    .from('inventory_items')
    .select('id, title, slug, description, category, base_price_cents, metadata, published_at')
    .eq('vendor_id', vendor.id)
    .eq('status', 'PUBLISHED')
    .order('published_at', { ascending: false })

  // Get stats
  const { data: reservations } = await supabase
    .from('reservations')
    .select('total_price_cents, quantity, status')
    .in('status', ['CONFIRMED', 'COMPLETED'])
    .eq('inventory_items.vendor_id', vendor.id)

  const stats = {
    total_events: events?.length ?? 0,
    total_reservations: reservations?.length ?? 0,
    total_tickets_sold: (reservations ?? []).reduce((s: number, r: { quantity: number }) => s + r.quantity, 0),
    total_revenue_cents: (reservations ?? []).reduce((s: number, r: { total_price_cents: number }) => s + r.total_price_cents, 0),
  }

  // Get media
  const { data: media } = await supabase
    .from('media_assets')
    .select('url, alt_text, is_primary')
    .in('item_id', (events ?? []).map((e: { id: string }) => e.id))
    .eq('is_primary', true)
    .limit(10)

  const loc = Array.isArray(vendor.locations) ? vendor.locations[0] : vendor.locations

  return NextResponse.json({
    organizer: {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      description: vendor.description,
      address: vendor.address,
      phone: vendor.phone,
      email: vendor.email,
      website_url: vendor.website_url,
      location: loc?.name ? `${loc.name}, ${loc.region}` : null,
      created_at: vendor.created_at,
    },
    events: (events ?? []).map((e: Record<string, unknown>) => ({
      ...e,
      media: (media ?? []).filter((m: { url: string }) =>
        // link media to events — simplified
        true
      ).slice(0, 1),
    })),
    stats,
  })
}
