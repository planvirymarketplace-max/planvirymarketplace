import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, MapPin, Trophy, Ticket as TicketIcon, Calendar } from 'lucide-react'
import {
  getTeamBySlug,
  getTeamSchedule,
  getRelatedTeams,
} from '@/data/sports-teams'
import { getLeagueBySlug } from '@/data/tickets-taxonomy'
import { TeamDirectoryClient, type TeamBreadcrumb } from '@/components/tickets/TeamDirectoryClient'

interface PageProps {
  params: Promise<{ team: string }>
}

export async function generateStaticParams() {
  // Generate params for all teams across all leagues
  const { ALL_TEAMS } = await import('@/data/sports-teams')
  return ALL_TEAMS.map((t) => ({ team: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { team } = await params
  const teamData = getTeamBySlug(team)
  if (!teamData) return { title: 'Not Found' }
  return {
    title: `${teamData.name} Tickets | Schedule & Seating Chart | Planviry`,
    description: `Buy ${teamData.name} tickets. View the ${teamData.stadium} schedule, seating chart, and find tickets for upcoming home games in ${teamData.city}, ${teamData.stateAbbr}.`,
  }
}

export default async function TeamPage({ params }: PageProps) {
  const { team } = await params
  const teamData = getTeamBySlug(team)
  if (!teamData) notFound()

  const games = getTeamSchedule(team)
  const relatedTeams = getRelatedTeams(teamData)
  const league = getLeagueBySlug(teamData.league)

  const breadcrumbs: TeamBreadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: league?.name ?? teamData.league.toUpperCase(), href: `/tickets/sports/${teamData.league}` },
    { label: teamData.name },
  ]

  const sidebarTeams = relatedTeams.map((t) => ({
    name: t.name,
    href: `/tickets/sports/team/${t.slug}`,
    division: t.division,
  }))

  return <AppLayoutShell>
    <TeamDirectoryClient
      title={teamData.name}
      description={`${teamData.division} - ${teamData.city}, ${teamData.stateAbbr}. Home venue: ${teamData.stadium}.`}
      breadcrumbs={breadcrumbs}
      teams={[]}
      games={games}
      sidebarTeams={sidebarTeams}
      sidebarTitle={`Teams in ${teamData.division ?? 'Conference'}`}
      showTeamCards={false}
      featuredTeam={teamData}
    />
  </AppLayoutShell>

}
