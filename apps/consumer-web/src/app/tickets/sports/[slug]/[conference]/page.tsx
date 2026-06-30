import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getLeagueBySlug, getConferenceInLeague } from '@/data/tickets-taxonomy'
import { getTeamsByLeagueAndConference } from '@/data/sports-teams'
import { getConferenceContent } from '@/data/ticket-landing-content'

interface PageProps {
  params: Promise<{ slug: string; conference: string }>
}

export async function generateStaticParams() {
  const leagues = ['mlb', 'nfl', 'nba', 'nhl', 'mls']
  const params: { slug: string; conference: string }[] = []
  for (const leagueSlug of leagues) {
    const league = getLeagueBySlug(leagueSlug)
    if (league) {
      for (const conf of league.conferences) {
        params.push({ slug: leagueSlug, conference: conf.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, conference } = await params
  const league = getLeagueBySlug(slug)
  const conf = getConferenceInLeague(slug, conference)
  if (!league || !conf) return { title: 'Not Found' }
  return {
    title: `${league.name} ${conf.name} Tickets | Planviry`,
    description: `Find and buy ${league.name} ${conf.name} tickets. Browse teams, schedules, and seating charts.`,
  }
}

export default async function ConferencePage({ params }: PageProps) {
  const { slug, conference } = await params
  const league = getLeagueBySlug(slug)
  const conf = getConferenceInLeague(slug, conference)
  if (!league || !conf) notFound()

  const teams = getTeamsByLeagueAndConference(slug, conference)
  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: league.name, href: `/tickets/sports/${league.slug}` },
    { label: conf.name },
  ]

  const categoryCards: TicketCategoryCard[] = teams.map((team) => ({
    label: team.name,
    slug: team.slug,
    href: `/tickets/sports/team/${team.slug}`,
    description: `${team.stadium} - ${team.city}, ${team.stateAbbr}`,
  }))

  return <AppLayoutShell>
    <TicketDirectoryClient
      title={`${league.name} ${conf.name}`}
      description={`${teams.length} teams in the ${conf.name}. Click a team to view their schedule, stadium, and seating chart.`}
      breadcrumbs={breadcrumbs}
      events={[]}
      categoryCards={categoryCards}
      cardsTitle={`${conf.name} Teams`}
      showFilters={false}
      richContent={getConferenceContent(league.slug, league.name, conf.name, conf.slug)}
      defaultEventType="sports"
    />
  </AppLayoutShell>

}
