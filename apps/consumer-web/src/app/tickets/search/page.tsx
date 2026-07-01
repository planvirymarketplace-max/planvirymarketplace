import type { Metadata } from 'next'
import { TicketDirectoryClient, type TicketBreadcrumb } from '@/components/tickets/TicketDirectoryClient'
import { EVENT_TYPE_FILTERS } from '@/data/tickets-taxonomy'
import { getTicketsRootContent, getGroupContent } from '@/data/ticket-landing-content'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    type?: string
    from?: string
    to?: string
    weekend?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const typeLabel = EVENT_TYPE_FILTERS.find((f) => f.value === params.type)?.label || 'All Events'
  const title = params.q
    ? `${params.q} — ${typeLabel} | Planviry Tickets`
    : `${typeLabel} Search | Planviry Tickets`
  return {
    title,
    description: `Search live event tickets${params.q ? ` matching "${params.q}"` : ''}. Filter by location, date, and event type.`,
  }
}

export default async function TicketSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Search Results' },
  ]

  const typeLabel = EVENT_TYPE_FILTERS.find((f) => f.value === params.type)?.label || 'All Events'
  const title = params.q
    ? `Events in ${params.q}`
    : `${typeLabel} — Search Results`

  const description = params.weekend === 'true'
    ? `Live events happening this weekend${params.q ? ` in ${params.q}` : ''}.`
    : `Browse ${typeLabel.toLowerCase()} events${params.q ? ` in ${params.q}` : ''}. Use the filters to narrow by date.`

  // Use rich content based on event type, but override title/subtitle for search context
  const baseContent = params.type && params.type !== 'all'
    ? getGroupContent(params.type)
    : getTicketsRootContent()
  const richContent = {
    ...baseContent,
    heroEyebrow: 'SEARCH RESULTS',
    title,
    subtitle: description,
  }

  return <TicketDirectoryClient
    title={title}
    description={description}
    breadcrumbs={breadcrumbs}
    events={[]}
    showFilters={true}
    richContent={richContent}
    defaultEventType={params.type || 'all'}
    defaultCity={params.q}
  />

}
