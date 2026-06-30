import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { UnifiedPageShell, type Breadcrumb, type Pill, type RelatedLink } from '@/components/UnifiedPageShell'
import { UnifiedCard } from '@/components/UnifiedCard'
import { UnifiedGrid } from '@/components/UnifiedGrid'
import { TicketmasterVenueClient } from '@/components/tickets/TicketmasterVenueClient'

export const metadata: Metadata = {
  title: 'Venues | Planviry',
  description: 'Browse venues with upcoming events, capacity info, and nearby hotels, restaurants, and attractions.',
}

export default function VenuesPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Venues' },
  ]

  const pills: Pill[] = [
    { label: 'All Venues', href: '/venues', active: true },
    { label: 'Concerts', href: '/tickets/concerts' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: 'Events', href: '/events' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Restaurants', href: '/travel' },
  ]

  const related: RelatedLink[] = [
    { label: 'Concerts', href: '/tickets/concerts' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: 'Theater', href: '/tickets/arts-theater-comedy' },
    { label: 'Family', href: '/tickets/family' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Travel', href: '/travel' },
  ]

  return <AppLayoutShell>
    <UnifiedPageShell
      eyebrow="VENUES"
      title="Venues"
      subtitle="Browse venues with upcoming events, capacity, and nearby services."
      breadcrumbs={breadcrumbs}
      pills={pills}
      related={related}
      relatedTitle="Browse Related"
    >
      <TicketmasterVenueClient />
    </UnifiedPageShell>
  </AppLayoutShell>

}
