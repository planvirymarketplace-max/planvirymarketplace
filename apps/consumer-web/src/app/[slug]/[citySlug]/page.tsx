import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TOP_CITIES, US_STATES } from '@/lib/planviry-data'
import { SeoLanding } from '@/components/seo/SeoLanding'

// ─── ISR Configuration ──────────────────────────────────────────────────────
export const revalidate = 3600 // 1 hour
export const dynamicParams = true

// ─── Static Params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return TOP_CITIES.map(c => ({
    slug: c.stateSlug,
    citySlug: c.slug,
  }))
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string }>
}): Promise<Metadata> {
  const { slug, citySlug } = await params
  const city = TOP_CITIES.find(c => c.stateSlug === slug && c.slug === citySlug)
  if (!city) return {}

  const state = US_STATES.find(s => s.slug === slug)
  const title = `${city.name}, ${city.state} Event Vendors - Venues, DJs, Caterers & More | Planviry`
  const description = `Find and book top event vendors in ${city.name}, ${city.state}. Browse venues, caterers, DJs, photographers, florists, and more on Planviry.`

  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/${slug}/${citySlug}` },
    openGraph: {
      title,
      description,
      url: `https://planviry.com/${slug}/${citySlug}`,
      siteName: 'Planviry',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string }>
}) {
  const { citySlug } = await params
  return <SeoLanding pageType="city" citySlug={citySlug} />
}
