import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { TICKETS_CITIES, TICKETS_GROUPS } from '@/data/tickets-taxonomy'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getGroupContent } from '@/data/ticket-landing-content'

export const metadata: Metadata = {
  title: 'Tickets by City | Planviry',
  description:
    'Find live event tickets in cities across the United States. Concerts, sports, arts, theater, and family shows near you.',
}

export default function CitiesLandingPage() {
  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Cities' },
  ]

  const categoryCards: TicketCategoryCard[] = TICKETS_CITIES.map((city) => ({
    label: city.name,
    slug: city.slug,
    href: `/tickets/cities/${city.slug}`,
  }))

  return <AppLayoutShell>
    <TicketDirectoryClient
      title="All Cities in United States"
      description={`Find live event tickets in ${TICKETS_CITIES.length} cities across the country.`}
      breadcrumbs={breadcrumbs}
      events={[]}
      categoryCards={categoryCards}
      cardsTitle="Browse Cities"
      showFilters={false}
      richContent={getGroupContent('cities')}
      defaultEventType="all"
    />
  </AppLayoutShell>

}
