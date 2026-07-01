import type { Metadata } from 'next'
import { TICKETS_GROUPS, TICKETS_CITIES } from '@/data/tickets-taxonomy'
import { UnifiedPageShell, type Breadcrumb, type Pill, type RelatedLink } from '@/components/UnifiedPageShell'
import { UnifiedCard } from '@/components/UnifiedCard'
import { UnifiedGrid } from '@/components/UnifiedGrid'
import sampleImages from '@/data/tm-sample-images.json'

export const metadata: Metadata = {
  title: 'Live Event Tickets | Planviry',
  description: 'Browse concert, sports, arts, theater, comedy, and family event tickets across the United States.',
}

export default function TicketsLandingPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
  ]

  const pills: Pill[] = [
    { label: 'Concerts', href: '/tickets/concerts' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: 'Arts & Theater', href: '/tickets/arts-theater-comedy' },
    { label: 'Family', href: '/tickets/family' },
    { label: 'Cities', href: '/tickets/cities' },
  ]

  const related: RelatedLink[] = [
    ...TICKETS_GROUPS.map((g) => ({
      label: g.name,
      href: g.slug === 'sports' ? '/tickets/sports' : `/tickets/${g.slug}`,
      description: g.subcategories?.length ? `${g.subcategories.length} categories` : undefined,
    })),
    { label: 'All Cities', href: '/tickets/cities', description: `${TICKETS_CITIES.length} cities` },
    { label: 'Venues', href: '/venues', description: 'Browse all venues' },
    { label: 'Events', href: '/events', description: 'Live events' },
  ]

  // Build category cards with real images from Ticketmaster
  const musicImage = (sampleImages as any).Music?.[0]?.url
  const sportsImage = (sampleImages as any).Sports?.[0]?.url

  const categoryCards = [
    { name: 'Concerts', slug: 'concerts', href: '/tickets/concerts', description: '22 genres', image: musicImage, badge: 'MUSIC' },
    { name: 'Sports', slug: 'sports', href: '/tickets/sports', description: '5 leagues + 25 sports', image: sportsImage, badge: 'SPORTS' },
    { name: 'Arts & Theater', slug: 'arts-theater-comedy', href: '/tickets/arts-theater-comedy', description: '20 categories', image: undefined, badge: 'STAGE' },
    { name: 'Family', slug: 'family', href: '/tickets/family', description: '11 categories', image: undefined, badge: 'FAMILY' },
    { name: 'Cities', slug: 'cities', href: '/tickets/cities', description: `${TICKETS_CITIES.length} US cities`, image: undefined, badge: 'CITIES' },
  ]

  return <UnifiedPageShell
      eyebrow="LIVE EVENT TICKETS"
      title="Tickets"
      subtitle="Concerts, sports, arts, theater, comedy, and family events — all in one place, all bookable together."
      breadcrumbs={breadcrumbs}
      pills={pills}
      related={related}
      relatedTitle="Browse by Category"
      heroImage={musicImage}
    >
      {/* Category cards */}
      <UnifiedGrid>
        {categoryCards.map((card) => (
          <UnifiedCard
            key={card.slug}
            name={card.name}
            href={card.href}
            badge={card.badge}
            description={card.description}
            image={card.image}
            category={card.badge}
          />
        ))}
      </UnifiedGrid>
    </UnifiedPageShell>

}
