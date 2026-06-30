import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/sitemaps/organizers
// Returns XML sitemap of all active vendor accounts (organizers) for SEO.
// Adapted from Hi.Events: GetSitemapOrganizersHandler

export async function GET() {
  const supabase = createAdminClient()

  const { data: vendors, error } = await supabase
    .from('vendor_accounts')
    .select('slug, updated_at, name')
    .in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])
    .order('updated_at', { ascending: false })
    .limit(50000)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://planviry.com'
  const now = new Date().toISOString()

  const urls = (vendors ?? []).map((v: { slug: string; updated_at: string }) => `  <url>
    <loc>${baseUrl}/organizers/${v.slug}</loc>
    <lastmod>${v.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/organizers</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
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
