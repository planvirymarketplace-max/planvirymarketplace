import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  TICKETS_GROUPS,
  getGroupBySlug,
  getSubcategoryInGroup,
} from '@/data/tickets-taxonomy'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getSubcategoryContent } from '@/data/ticket-landing-content'

interface PageProps {
  params: Promise<{ group: string; subcategory: string }>
}

export async function generateStaticParams() {
  const params: { group: string; subcategory: string }[] = []
  for (const group of TICKETS_GROUPS) {
    if (group.slug === 'sports') continue
    const allSubs = [
      ...(group.subcategories || []),
      ...(group.discoverMore || []),
    ]
    for (const sub of allSubs) {
      params.push({ group: group.slug, subcategory: sub.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group, subcategory } = await params
  const groupData = getGroupBySlug(group)
  const sub = getSubcategoryInGroup(group, subcategory)
  if (!groupData || !sub) return { title: 'Not Found' }
  return {
    title: `${sub.name} Tickets | ${groupData.name} | Planviry`,
    description: `Find and buy ${sub.name.toLowerCase()} tickets. Browse upcoming ${sub.name.toLowerCase()} events across the United States.`,
  }
}

export default async function TicketSubcategoryPage({ params }: PageProps) {
  const { group, subcategory } = await params
  const groupData = getGroupBySlug(group)
  const sub = getSubcategoryInGroup(group, subcategory)
  if (!groupData || !sub || groupData.slug === 'sports') notFound()

  // Deduplicate by slug (some groups list the same subcategory in both arrays)
  const seen = new Set<string>()
  const relatedSubs = [
    ...(groupData.subcategories || []),
    ...(groupData.discoverMore || []),
  ].filter((s) => {
    if (s.slug === sub.slug) return false
    if (seen.has(s.slug)) return false
    seen.add(s.slug)
    return true
  })

  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: groupData.name, href: `/tickets/${groupData.slug}` },
    { label: sub.name },
  ]

  const categoryCards: TicketCategoryCard[] = relatedSubs.slice(0, 12).map((rel) => ({
    label: rel.name,
    slug: rel.slug,
    href: `/tickets/${groupData.slug}/${rel.slug}`,
  }))

  const eventTypeMap: Record<string, string> = {
    concerts: 'concerts',
    'arts-theater-comedy': 'arts-theater-comedy',
    family: 'family',
  }

  return <TicketDirectoryClient
    title={`${sub.name} Tickets`}
    description={`Find and buy tickets for upcoming ${sub.name.toLowerCase()} events. Browse live events across the United States.`}
    breadcrumbs={breadcrumbs}
    events={[]}
    categoryCards={categoryCards}
    cardsTitle={`More in ${groupData.name}`}
    showFilters={false}
    richContent={getSubcategoryContent(groupData.slug, sub.slug, sub.name)}
    defaultEventType={eventTypeMap[groupData.slug] || 'all'}
  />

}
