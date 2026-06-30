import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { VERTICALS, TOP_CITIES, US_STATES, getVerticalBySlug } from '@/lib/planviry-data'
import { CityVerticalClient } from '@/components/city/CityVerticalClient'

// ─── ISR Configuration ──────────────────────────────────────────────────────
export const revalidate = 3600 // 1 hour
export const dynamicParams = true

// ─── Static Params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { slug: string; citySlug: string; verticalSlug: string }[] = []
  for (const city of TOP_CITIES) {
    for (const vertical of VERTICALS) {
      params.push({
        slug: city.stateSlug,
        citySlug: city.slug,
        verticalSlug: vertical.slug,
      })
    }
  }
  return params
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string; verticalSlug: string }>
}): Promise<Metadata> {
  const { slug, citySlug, verticalSlug } = await params
  const city = TOP_CITIES.find(c => c.stateSlug === slug && c.slug === citySlug)
  const vertical = getVerticalBySlug(verticalSlug)
  if (!city || !vertical) return {}

  const state = US_STATES.find(s => s.slug === slug)
  const stateName = state?.name ?? city.state
  const title = `${vertical.name} in ${city.name}, ${city.state} - Top Vendors | Planviry`
  const description = `Browse top ${vertical.name.toLowerCase()} vendors in ${city.name}, ${stateName}. ${vertical.description}. Compare, book, and pay on Planviry.`

  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/${slug}/${citySlug}/${verticalSlug}` },
    openGraph: {
      title,
      description,
      url: `https://planviry.com/${slug}/${citySlug}/${verticalSlug}`,
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
export default async function CityVerticalPage({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string; verticalSlug: string }>
}) {
  const { slug, citySlug, verticalSlug } = await params

  const city = TOP_CITIES.find(c => c.stateSlug === slug && c.slug === citySlug)
  if (!city) return notFound()

  const vertical = getVerticalBySlug(verticalSlug)
  if (!vertical) return notFound()

  const state = US_STATES.find(s => s.slug === slug)
  const stateName = state?.name ?? city.state

  // Fetch vendors for ISR - initial data
  let initialVendors: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendors?city=${encodeURIComponent(city.name)}&state=${encodeURIComponent(stateName)}&vertical=${encodeURIComponent(verticalSlug)}&limit=50`,
      { next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      initialVendors = data.vendors ?? []
    }
  } catch {
    // fallback to empty
  }

  return <AppLayoutShell>
    <>
      <CityVerticalClient
        vertical={{
          name: vertical.name,
          slug: vertical.slug,
          icon: vertical.icon,
          description: vertical.description,
          subCategories: vertical.subCategories,
        }}
        city={{ name: city.name, state: stateName }}
        stateSlug={slug}
        citySlug={citySlug}
        initialVendors={initialVendors}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${vertical.name} in ${city.name}, ${stateName}`,
            description: `Browse top ${vertical.name.toLowerCase()} vendors in ${city.name}, ${stateName}. ${vertical.description}`,
            url: `https://planviry.com/${slug}/${citySlug}/${verticalSlug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Planviry',
              url: 'https://planviry.com',
            },
            about: {
              '@type': 'City',
              name: city.name,
              containedInPlace: {
                '@type': 'State',
                name: stateName,
              },
            },
            ...(initialVendors.length > 0 ? {
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: initialVendors.length,
                itemListElement: initialVendors.slice(0, 10).map((v: any, i: number) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'LocalBusiness',
                    name: v.business_name || v.name,
                    url: `https://planviry.com/v/${v.slug || v.vendor_id}`,
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: v.city ?? city.name,
                      addressRegion: v.state ?? stateName,
                    },
                    ...(((v.avg_rating ?? v.rating ?? 0) > 0) ? {
                      aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: v.avg_rating ?? v.rating,
                        reviewCount: v.review_count ?? v.reviewCount,
                      },
                    } : {}),
                  },
                })),
              },
            } : {}),
          }),
        }}
      />
    </>
  )
}
