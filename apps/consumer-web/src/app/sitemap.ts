import { MetadataRoute } from 'next'
import { getAllSitemapEntries } from '@/lib/seo-data'
import { createClient } from '@supabase/supabase-js'

function rawAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://planviry.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // SEO landing pages (500+ slugs from seo_pages table)
  const seoEntries = await getAllSitemapEntries()
  const seoRoutes: MetadataRoute.Sitemap = seoEntries.map((e) => ({
    url: `${base}/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
    changeFrequency: (e.sitemap_changefreq as MetadataRoute.Sitemap[0]['changeFrequency']) ?? 'weekly',
    priority: Number(e.sitemap_priority) ?? 0.6,
  }))

  // Vendor profile pages
  const supabase = rawAdmin()
  const { data: vendors } = await supabase
    .from('vendor_profiles')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  const vendorRoutes: MetadataRoute.Sitemap = (vendors ?? []).map((v) => ({
    url: `${base}/vendors/${v.slug}`,
    lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...seoRoutes, ...vendorRoutes]
}
