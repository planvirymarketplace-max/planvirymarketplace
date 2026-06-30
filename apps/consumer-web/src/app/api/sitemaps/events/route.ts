import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/sitemaps/events
// Returns XML sitemap of all published events for SEO.
// Adapted from Hi.Events: GetSitemapEventsHandler

export async function GET() {
  const supabase = createAdminClient()

  const { data: events, error } = await supabase
    .from('inventory_items')
    .select('slug, updated_at, category')
    .eq('status', 'PUBLISHED')
    .order('updated_at', { ascending: false })
    .limit(50000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planviry.com'
  const now = new Date().toISOString()

  const urls = (events ?? []).map((e: { slug: string; updated_at: string; category: string }) => {
    const categoryPath = e.category === 'EVENT_TICKET' ? 'events' :
                         e.category === 'LODGING' ? 'hotels' :
                         e.category === 'DINING' ? 'food-drink' :
                         e.category === 'VENUE_RENTAL' ? 'venues' : 'browse'
    return `  <url>
    <loc>${baseUrl}/${categoryPath}/${e.slug}</loc>
    <lastmod>${e.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
