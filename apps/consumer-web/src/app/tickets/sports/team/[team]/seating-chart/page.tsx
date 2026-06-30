import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, MapPin, Trophy, Ticket as TicketIcon } from 'lucide-react'
import {
  getTeamBySlug,
  getSeatingSections,
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
    title: `${teamData.stadium} Seating Chart | ${teamData.name} | Planviry`,
    description: `View the ${teamData.stadium} seating chart. Find tickets by section for ${teamData.name} home games.`,
  }
}

export default async function SeatingChartPage({ params }: PageProps) {
  const { team } = await params
  const teamData = getTeamBySlug(team)
  if (!teamData) notFound()

  const sections = getSeatingSections(team)
  const league = getLeagueBySlug(teamData.league)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: league?.name ?? teamData.league.toUpperCase(), href: `/tickets/sports/${teamData.league}` },
    { label: teamData.name, href: `/tickets/sports/team/${teamData.slug}` },
    { label: 'Seating Chart' },
  ]

  return <AppLayoutShell>
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
            {teamData.stadium} Seating Chart
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            {teamData.name} home venue. {teamData.stadiumAddress}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seating diagram + sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagram placeholder */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white h-80 flex flex-col items-center justify-center">
                <Trophy className="w-12 h-12 text-coral mb-3" />
                <p className="text-sm font-bold text-black">{teamData.stadium}</p>
                <p className="text-xs text-gray-400 mt-1">Interactive seating diagram coming soon</p>
              </div>
            </div>

            {/* Section list */}
            <div>
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
                Seating Sections
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sections.map((section) => (
                  <div
                    key={section.name}
                    className="p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all bg-white"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-black">{section.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                        Level {section.level}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-coral">{section.priceRange}</span>
                      <span className="text-[10px] text-gray-400">{section.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Stadium info */}
            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
              <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-gray-400" /> Stadium Info
              </h3>
              <h4 className="text-base font-bold text-black mb-2">{teamData.stadium}</h4>
              <p className="text-xs text-gray-600 flex items-start gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                {teamData.stadiumAddress}
              </p>
              {teamData.lat && teamData.lng && (
                <div className="rounded-lg border border-gray-200 bg-white h-32 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 text-coral mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">{teamData.lat.toFixed(4)}, {teamData.lng.toFixed(4)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/tickets/sports/team/${teamData.slug}`}
              className="block w-full text-center bg-black hover:bg-coral text-white text-sm font-bold px-4 py-3 rounded-lg transition-colors uppercase tracking-wider"
            >
              View Team Schedule
            </Link>
            <Link
              href={`/tickets/sports/team/${teamData.slug}/schedule`}
              className="block w-full text-center border-2 border-black text-black hover:bg-black hover:text-white text-sm font-bold px-4 py-3 rounded-lg transition-colors uppercase tracking-wider"
            >
              Full Schedule
            </Link>
          </aside>
        </div>
      </div>
    </div>
  </AppLayoutShell>

}
