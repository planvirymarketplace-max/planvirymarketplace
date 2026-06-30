import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import Link from 'next/link';
import { SEO_SERVICE_PATTERNS, getSeoPattern, SEO_CATEGORIES } from '@/data/seo-pages';
import { SEO_LOCATIONS, getSeoLocation, SEO_STATES } from '@/data/seo-locations';
import { seoCategoryToCanonical, buildCategoryUrl } from '@/lib/routes';
import { SeoDirectoryClient } from '@/components/seo/SeoDirectoryClient';

// ---------------------------------------------------------------------------
// Dynamic rendering - all service × location combinations served on demand
// No generateStaticParams - national scale means millions of combinations.
// Pages are SSR'd on first request and cached by ISR.
// ---------------------------------------------------------------------------

export const revalidate = 3600; // ISR: revalidate every hour

interface SeoPageProps {
  params: Promise<{ serviceSlug: string; locationSlug: string }>;
}

export async function generateMetadata({ params }: SeoPageProps): Promise<Metadata> {
  const { serviceSlug, locationSlug } = await params;
  const pattern = getSeoPattern(serviceSlug);
  const location = getSeoLocation(locationSlug);

  if (!pattern || !location) {
    return { title: 'Not Found - Planviry' };
  }

  const serviceLabel = pattern.name.replace(/\s+(In|Near|By)$/, '').trim();
  const title = `${serviceLabel} ${location.displayName} - Planviry`;
  const description = pattern.type === 'near'
    ? `Find ${serviceLabel.toLowerCase()} near ${location.displayName}. Browse verified providers on Planviry.`
    : `Find the best ${serviceLabel.toLowerCase()} in ${location.displayName}. Browse verified local providers on Planviry.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://planviry.com/seo/${serviceSlug}/${locationSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://planviry.com/seo/${serviceSlug}/${locationSlug}`,
      siteName: 'Planviry',
      type: 'website',
    },
  };
}

export default async function SeoPage({ params }: SeoPageProps) {
  const { serviceSlug, locationSlug } = await params;
  const pattern = getSeoPattern(serviceSlug);
  const location = getSeoLocation(locationSlug);

  if (!pattern || !location) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <h1 className="text-2xl font-bold text-black">Page Not Found</h1>
        <Link href="/" className="text-teal-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const stateInfo = SEO_STATES.find(s => s.abbr === location.state);
  const stateName = stateInfo?.name ?? location.state;
  const serviceLabel = pattern.name.replace(/\s+(In|Near|By)$/, '').trim();

  // Map SEO category to canonical vertical for API queries
  const canonicalVertical = seoCategoryToCanonical(pattern.category);

  // Related patterns in the same category
  const relatedPatterns = SEO_SERVICE_PATTERNS.filter(
    p => p.category === pattern.category && p.slug !== pattern.slug
  ).slice(0, 8);

  // Other cities in the same state
  const nearbyLocations = SEO_LOCATIONS.filter(
    l => l.state === location.state && l.slug !== location.slug
  ).slice(0, 6);

  // Other major cities nationally for "near" type pages
  const majorCities = pattern.type === 'near'
    ? SEO_LOCATIONS.filter(l => l.primary && l.slug !== location.slug).slice(0, 8)
    : [];

  // Fetch initial vendor data for ISR
  let initialVendors: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendors?city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(stateName)}&vertical=${encodeURIComponent(canonicalVertical)}&limit=50`,
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

      <SeoDirectoryClient
        pattern={pattern}
        location={location}
        stateName={stateName}
        canonicalVertical={canonicalVertical}
        relatedPatterns={relatedPatterns}
        nearbyLocations={nearbyLocations}
        majorCities={majorCities}
        initialVendors={initialVendors}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${serviceLabel} ${location.displayName}`,
            description: `Browse verified ${serviceLabel.toLowerCase()} providers ${pattern.type === 'near' ? 'near' : 'in'} ${location.displayName} on Planviry.`,
            url: `https://planviry.com/seo/${serviceSlug}/${locationSlug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Planviry',
              url: 'https://planviry.com',
            },
            about: {
              '@type': 'City',
              name: location.city,
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
                      addressLocality: v.city ?? location.city,
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

  </AppLayoutShell>

}
