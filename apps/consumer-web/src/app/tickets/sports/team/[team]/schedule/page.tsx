import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, MapPin, Calendar, Ticket as TicketIcon } from 'lucide-react'
import {
  getTeamBySlug,
  getTeamSchedule,
} from '@/data/sports-teams'
import { getLeagueBySlug } from '@/data/tickets-taxonomy'

interface PageProps {
  params: Promise<{ team: string }>
}

export async function generateStaticParams() {
  const { ALL_TEAMS } = await import('@/data/sports-teams')
  return ALL_TEAMS.map((t) => ({ team: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { team } = await params
  const teamData = getTeamBySlug(team)
  if (!teamData) return { title: 'Not Found' }
  return {
    title: `${teamData.name} Schedule | ${teamData.stadium} | Planviry`,
    description: `View the full ${teamData.name} schedule. Find tickets for all home games at ${teamData.stadium}.`,
  }
}

export default async function TeamSchedulePage({ params }: PageProps) {
  const { team } = await params
  const teamData = getTeamBySlug(team)
  if (!teamData) notFound()

  const games = getTeamSchedule(team)
  const league = getLeagueBySlug(teamData.league)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: league?.name ?? teamData.league.toUpperCase(), href: `/tickets/sports/${teamData.league}` },
    { label: teamData.name, href: `/tickets/sports/team/${teamData.slug}` },
    { label: 'Schedule' },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {breadcrumbs.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black transition-colors flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
            {teamData.name} Schedule
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            {games.length} upcoming home games at {teamData.stadium}, {teamData.city}, {teamData.stateAbbr}.
          </p>
        </div>

        {/* Game list */}
        {games.length > 0 ? (
          <div className="space-y-3 max-w-4xl">
            {games.map((game) => {
              const month = game.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = game.date.getDate()
              const dayName = game.date.toLocaleDateString('en-US', { weekday: 'short' })
              const time = game.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
              return <AppLayoutShell>
                <div
                  key={game.id}
                  className="flex items-stretch bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center w-16 sm:w-20 bg-gray-50 border-r border-gray-200 py-4 shrink-0">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{month}</span>
                    <span className="text-2xl font-black text-black leading-none mt-0.5">{day}</span>
                    <span className="text-[10px] text-gray-400 mt-1">{dayName}</span>
                  </div>
                  <div className="flex-1 min-w-0 p-4">
                    <h3 className="text-sm font-bold text-black">
                      {game.awayTeam} <span className="text-gray-400 font-normal">at</span> {game.homeTeam}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {time} - {game.venue}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {game.city}, {game.state}
                    </p>
                  </div>
                  <div className="flex items-center pr-4 shrink-0">
                    <button className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap">
                      Find Tickets
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </AppLayoutShell>

            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50 max-w-4xl">
            <Calendar className="w-10 h-10 text-coral mx-auto mb-3" />
            <p className="text-sm text-gray-600">No upcoming games scheduled.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/tickets/sports/team/${teamData.slug}/seating-chart`}
            className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
          >
            <TicketIcon className="w-3.5 h-3.5" /> Seating Chart
          </Link>
          <Link
            href={`/tickets/sports/team/${teamData.slug}`}
            className="inline-flex items-center gap-1.5 border-2 border-black text-black hover:bg-black hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
          >
            Team Page
          </Link>
        </div>
      </div>
    </div>
  )
}
