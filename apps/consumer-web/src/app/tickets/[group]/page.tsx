import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  TICKETS_GROUPS,
  getGroupBySlug,
} from '@/data/tickets-taxonomy'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getGroupContent } from '@/data/ticket-landing-content'

interface PageProps {
  params: Promise<{ group: string }>
}

export async function generateStaticParams() {
  return TICKETS_GROUPS.filter((g) => g.slug !== 'sports').map((g) => ({
    group: g.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group } = await params
  const groupData = getGroupBySlug(group)
  if (!groupData) return { title: 'Not Found' }
  return {
    title: `${groupData.name} Tickets | Planviry`,
    description: `Browse ${groupData.name.toLowerCase()} tickets. Find and book live events across the United States.`,
  }
}

export default async function TicketGroupPage({ params }: PageProps) {
  const { group } = await params
  const groupData = getGroupBySlug(group)
  if (!groupData || groupData.slug === 'sports') notFound()

  // Deduplicate by slug (some groups list the same subcategory in both arrays)
  const seen = new Set<string>()
  const allSubs = [
    ...(groupData.subcategories || []),
    ...(groupData.discoverMore || []),
  ].filter((s) => {
    if (seen.has(s.slug)) return false
    seen.add(s.slug)
    return true
  })

  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: groupData.name },
  ]

  const categoryCards: TicketCategoryCard[] = allSubs.map((sub) => ({
    label: sub.name,
    slug: sub.slug,
    href: `/tickets/${groupData.slug}/${sub.slug}`,
  }))

  const eventTypeMap: Record<string, string> = {
    concerts: 'concerts',
    'arts-theater-comedy': 'arts-theater-comedy',
    family: 'family',
  }

  return <TicketDirectoryClient
    title={`${groupData.name} Tickets`}
    description={`Browse ${allSubs.length} ${groupData.name.toLowerCase()} categories. Find tickets for live events near you.`}
    breadcrumbs={breadcrumbs}
    events={[]}
    categoryCards={categoryCards}
    cardsTitle={`${groupData.name} Categories`}
    showFilters={false}
    richContent={getGroupContent(groupData.slug)}
    defaultEventType={eventTypeMap[groupData.slug] || 'all'}
  />

}
