import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import { SeoLanding } from '@/components/seo/SeoLanding';
import { SEO_LOCATIONS } from '@/data/seo-locations';
import { AIRPORT_CITIES } from '@/lib/planviry-data';

// Generate pages for primary cities AND airport-code slugs
const PRIMARY_CITIES = SEO_LOCATIONS.filter(c => c.primary);
const AIRPORT_SLUGS = AIRPORT_CITIES.flatMap(s => s.airports.map(a => ({ city: a.slug })));

export function generateStaticParams() {
  const seoParams = PRIMARY_CITIES.map(c => ({ city: c.slug }));
  // Merge, deduplicating by city slug
  const seen = new Set(seoParams.map(p => p.city));
  const airportParams = AIRPORT_SLUGS.filter(p => !seen.has(p.city));
  return [...seoParams, ...airportParams];
}

// Allow dynamic params for any city slug not pre-generated
export const dynamicParams = true;

export function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  return params.then(({ city }) => {
    // Try SEO_LOCATIONS first
    const location = SEO_LOCATIONS.find(c => c.slug === city);
    if (location) {
      return {
        title: `Event Vendors in ${location.displayName} | Planviry`,
        description: `Find top-rated event planners, venues, caterers, DJs, and more in ${location.displayName}. Compare prices, read reviews, and book on Planviry.`,
      };
    }
    // Fallback to AIRPORT_CITIES
    for (const stateGroup of AIRPORT_CITIES) {
      const airport = stateGroup.airports.find(a => a.slug === city);
      if (airport) {
        const cityName = airport.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '');
        return {
          title: `Event Vendors in ${cityName}, ${airport.stateAbbr} | Planviry`,
          description: `Find top-rated event planners, venues, caterers, DJs, and more in ${cityName}, ${airport.stateAbbr}. Compare prices, read reviews, and book on Planviry.`,
        };
      }
    }
    return { title: 'City Not Found - Planviry' };
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  return <AppLayoutShell><SeoLanding pageType="city" citySlug={city} /></AppLayoutShell>;
}
