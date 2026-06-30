import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { LEAGUES, OTHER_SPORTS } from '@/data/ticketing-taxonomy-full'
import { getGroupContent } from '@/data/ticket-landing-content'

export const metadata: Metadata = {
  title: 'Sports Tickets | Planviry',
  description: 'Browse sports tickets for MLB, NFL, NBA, NHL, MLS and more. Find tickets for live sporting events across the United States.',
}

export default function SportsTicketsPage() {
  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports' },
  ]

  const categoryCards: TicketCategoryCard[] = [
    ...LEAGUES.map((league) => ({
      label: league.name,
      slug: league.slug,
      href: `/tickets/sports/${league.slug}`,
      description: `${league.teamCount} teams`,
    })),
    ...OTHER_SPORTS.map((sport) => ({
      label: sport,
      slug: sport.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      href: `/tickets/sports/${sport.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    })),
  ]

  return <AppLayoutShell>
    <TicketDirectoryClient
      title="All Sports Tickets"
      description={`${LEAGUES.reduce((sum, l) => sum + l.teamCount, 0)} teams across ${LEAGUES.length} major leagues and ${OTHER_SPORTS.length} other sports. Find tickets for live sporting events across the United States.`}
      breadcrumbs={breadcrumbs}
      events={[]}
      categoryCards={categoryCards}
      cardsTitle="Major Leagues & Other Sports"
      showFilters={false}
      richContent={getGroupContent('sports')}
      defaultEventType="sports"
    />
  </AppLayoutShell>

}
