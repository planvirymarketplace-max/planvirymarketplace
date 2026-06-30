import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import { SeoLanding } from '@/components/seo/SeoLanding';
import { US_STATES } from '@/lib/planviry-data';

export function generateStaticParams() {
  return US_STATES.map(s => ({ state: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  // Next.js 16 - params is a Promise
  return params.then(({ state }) => {
    const stateName = US_STATES.find(s => s.slug === state)?.name ?? 'State';
    return {
      title: `Event Vendors in ${stateName} | Planviry`,
      description: `Find top-rated event planners, venues, caterers, DJs, and more in ${stateName}. Compare prices, read reviews, and book on Planviry.`,
    };
  });
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  return <AppLayoutShell><SeoLanding pageType="state" stateSlug={state} /></AppLayoutShell>;
}
