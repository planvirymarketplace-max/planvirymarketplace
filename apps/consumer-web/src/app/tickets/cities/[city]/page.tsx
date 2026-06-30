import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  TICKETS_CITIES,
  getCityBySlug,
  TICKETS_GROUPS,
} from '@/data/tickets-taxonomy'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getCityContent } from '@/data/ticket-landing-content'

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return TICKETS_CITIES.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const cityData = getCityBySlug(city)
  if (!cityData) return { title: 'Not Found' }
  return {
    title: `${cityData.name} Event Tickets | Concerts, Sports, Theater | Planviry`,
    description: `Find live event tickets in ${cityData.name}. Browse concerts, sports, arts, theater, comedy, and family shows in ${cityData.name}.`,
  }
}

export default async function CityTicketsPage({ params }: PageProps) {
  const { city } = await params
  const cityData = getCityBySlug(city)
  if (!cityData) notFound()

  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Cities', href: '/tickets/cities' },
    { label: cityData.name },
  ]

  const otherCities = TICKETS_CITIES.filter((c) => c.slug !== cityData.slug).slice(0, 16)

  const categoryCards: TicketCategoryCard[] = [
    ...TICKETS_GROUPS.map((group) => ({
      label: `${group.name} in ${cityData.name}`,
      slug: group.slug,
      href: group.slug === 'sports' ? '/tickets/sports' : `/tickets/${group.slug}`,
    })),
    ...otherCities.map((c) => ({
      label: c.name,
      slug: c.slug,
      href: `/tickets/cities/${c.slug}`,
    })),
  ]

  return <AppLayoutShell>
    <TicketDirectoryClient
      title={`Event Tickets in ${cityData.name}`}
      description={`Find concerts, sports, arts, theater, comedy, and family show tickets in ${cityData.name}.`}
      breadcrumbs={breadcrumbs}
      events={[]}
      categoryCards={categoryCards}
      cardsTitle={`Explore ${cityData.name} & Other Cities`}
      showFilters={false}
      richContent={getCityContent(cityData.slug, cityData.name)}
      defaultCity={cityData.name}
      defaultEventType="all"
    />
  </AppLayoutShell>

}
