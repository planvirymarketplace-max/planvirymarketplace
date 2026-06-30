import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TicketDirectoryClient, type TicketBreadcrumb, type TicketCategoryCard } from '@/components/tickets/TicketDirectoryClient'
import { getLeagueBySlug, getOtherSportBySlug } from '@/data/tickets-taxonomy'
import { getTeamsByLeague, getTeamsByLeagueAndConference } from '@/data/sports-teams'
import { LEAGUES, OTHER_SPORTS } from '@/data/ticketing-taxonomy-full'
import { getLeagueContent, getOtherSportContent } from '@/data/ticket-landing-content'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const leagueParams = LEAGUES.map((l) => ({ slug: l.slug }))
  const otherSportParams = OTHER_SPORTS.map((sport) => ({
    slug: sport.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }))
  return [...leagueParams, ...otherSportParams]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const league = getLeagueBySlug(slug)
  const otherSport = getOtherSportBySlug(slug)
  if (!league && !otherSport) return { title: 'Not Found' }
  const name = league?.name || otherSport?.name
  return {
    title: `${name} Tickets | Planviry`,
    description: `Find and buy ${name} tickets. Browse teams, schedules, and seating charts.`,
  }
}

export default async function SportDetailPage({ params }: PageProps) {
  const { slug } = await params
  const league = getLeagueBySlug(slug)
  const otherSport = getOtherSportBySlug(slug)
  if (!league && !otherSport) notFound()

  const breadcrumbs: TicketBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: league?.name || otherSport?.name || '' },
  ]

  // League page (NFL, NBA, MLB, NHL, MLS)
  if (league) {
    const teams = getTeamsByLeague(slug)
    const categoryCards: TicketCategoryCard[] = [
      ...league.conferences.map((conf) => ({
        label: conf.name,
        slug: conf.slug,
        href: `/tickets/sports/${league.slug}/${conf.slug}`,
        description: `${getTeamsByLeagueAndConference(slug, conf.slug).length} teams`,
      })),
      ...teams.map((team) => ({
        label: team.name,
        slug: team.slug,
        href: `/tickets/sports/team/${team.slug}`,
        description: `${team.stadium} - ${team.city}, ${team.stateAbbr}`,
      })),
    ]

    return (
      <TicketDirectoryClient
        title={`${league.name} Tickets`}
        description={`${teams.length} teams. Click a team to view their schedule, stadium, and seating chart.`}
        breadcrumbs={breadcrumbs}
        events={[]}
        categoryCards={categoryCards}
        cardsTitle={`${league.name} Conferences & Teams`}
        showFilters={false}
        richContent={getLeagueContent(league.slug)}
        defaultEventType="sports"
      />
    )
  }

  // Other sport page (Golf, Tennis, Boxing, etc.)
  const sportName = otherSport!.name
  const categoryCards: TicketCategoryCard[] = LEAGUES.map((l) => ({
    label: l.name,
    slug: l.slug,
    href: `/tickets/sports/${l.slug}`,
    description: `${l.teamCount} teams`,
  }))

  return <AppLayoutShell>
    <TicketDirectoryClient
      title={`${sportName} Tickets`}
      description={`Find and buy tickets for upcoming ${sportName.toLowerCase()} events and competitions.`}
      breadcrumbs={breadcrumbs}
      events={[]}
      categoryCards={categoryCards}
      cardsTitle="Major Leagues"
      showFilters={false}
      richContent={getOtherSportContent(slug, sportName)}
      defaultEventType="sports"
    />
  </AppLayoutShell>

}
