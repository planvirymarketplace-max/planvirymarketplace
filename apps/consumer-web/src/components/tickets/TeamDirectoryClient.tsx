'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Home, MapPin, Navigation, Search, X,
  SlidersHorizontal, Calendar, Ticket as TicketIcon, Trophy,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { Team, Game } from '@/data/sports-teams'

/**
 * TeamDirectoryClient
 *
 * Client component for conference pages and team pages. Shows team cards
 * (not generic event cards) with stadium, city, and division info.
 *
 * Sidebar is contextual: shows teams/divisions for THIS conference only
 * (not unrelated sports). Location filter shows teams in the user's city.
 */

export interface TeamBreadcrumb {
  label: string
  href?: string
}

interface TeamDirectoryClientProps {
  title: string
  description: string
  breadcrumbs: TeamBreadcrumb[]
  teams: Team[]
  games?: Game[]
  sidebarTeams: { name: string; href: string; division?: string }[]
  sidebarTitle: string
  showTeamCards?: boolean // true on conference page, false on team detail page
  featuredTeam?: Team // for team detail page
}

type SortOption = 'recommended' | 'city' | 'name'

export function TeamDirectoryClient({
  title,
  description,
  breadcrumbs,
  teams,
  games = [],
  sidebarTeams,
  sidebarTitle,
  showTeamCards = true,
  featuredTeam,
}: TeamDirectoryClientProps) {
  const [locationInput, setLocationInput] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [divisionFilter, setDivisionFilter] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('recommended')

  const clearLocation = () => {
    setLocationInput('')
    setLocationFilter('')
  }

  const toggleDivision = (div: string) => {
    setDivisionFilter((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    )
  }

  const filteredTeams = useMemo(() => {
    let result = [...teams]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.stadium.toLowerCase().includes(q)
      )
    }

    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase()
      result = result.filter(
        (t) =>
          t.city.toLowerCase().includes(loc) ||
          t.state.toLowerCase().includes(loc) ||
          t.stateAbbr.toLowerCase() === loc
      )
    }

    if (divisionFilter.length > 0) {
      result = result.filter((t) => t.division && divisionFilter.includes(t.division))
    }

    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'city') {
      result.sort((a, b) => a.city.localeCompare(b.city))
    }

    return result
  }, [teams, searchQuery, locationFilter, divisionFilter, sort])

  // Group sidebar teams by division
  const divisions = useMemo(() => {
    const grouped: Record<string, typeof sidebarTeams> = {}
    sidebarTeams.forEach((t) => {
      const div = t.division || 'Other'
      if (!grouped[div]) grouped[div] = []
      grouped[div].push(t)
    })
    return grouped
  }, [sidebarTeams])

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

      <div className="mx-auto max-w-7xl w-full py-6 flex flex-col lg:flex-row gap-6 px-4 sm:px-6">
        {/* ══════ SIDEBAR ══════ */}
        <aside className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-20 lg:self-start lg:pr-0">
          {/* Location Input - filters teams by city/state */}
          {showTeamCards && (
            <>
              {locationFilter ? (
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
                  <span className="text-sm font-semibold truncate flex-1">{locationFilter}</span>
                  <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && locationInput.trim()) {
                        setLocationFilter(locationInput.trim())
                      }
                    }}
                    placeholder="Filter by city or state..."
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(() => {
                          setLocationFilter('Current Location')
                        })
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                    aria-label="Use my location"
                    title="Near me"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${title}...`}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Sidebar nav: teams grouped by division (contextual to THIS conference) */}
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-gray-400" /> {sidebarTitle}
            </h3>
          </div>

          {Object.entries(divisions).map(([div, divTeams]) => (
            <div key={div}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{div}</p>
              <ul className="space-y-1">
                {divTeams.map((t) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="text-sm text-gray-600 hover:text-black transition-colors block py-1"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Division filter (for team cards view) */}
          {showTeamCards && Object.keys(divisions).length > 1 && (
            <>
              <div className="border-b border-gray-200 pb-2 pt-3">
                <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" /> Filters
                </h3>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Division</p>
                <div className="space-y-1.5">
                  {Object.keys(divisions).map((div) => (
                    <label key={div} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={divisionFilter.includes(div)}
                        onCheckedChange={() => toggleDivision(div)}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs text-gray-700">{div}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ══════ MAIN CONTENT ══════ */}
        <div className="flex-1 min-w-0 lg:pl-0">
          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">{description}</p>
          </div>

          {/* Featured team detail (for team page) */}
          {featuredTeam && !showTeamCards && (
            <FeaturedTeamDetail team={featuredTeam} games={games} />
          )}

          {/* Team cards (for conference page) */}
          {showTeamCards && (
            <>
              {/* Result count + sort bar */}
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                <span className="text-sm font-black text-black uppercase tracking-wider">
                  {filteredTeams.length} {filteredTeams.length === 1 ? 'Team' : 'Teams'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black bg-white text-black"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="name">Team Name (A-Z)</option>
                    <option value="city">City (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTeams.map((team) => (
                    <TeamCard key={team.slug} team={team} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
                  <Trophy className="w-10 h-10 text-coral mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No teams match your filters.</p>
                  {(locationFilter || searchQuery || divisionFilter.length > 0) && (
                    <button
                      onClick={() => {
                        clearLocation()
                        setSearchQuery('')
                        setDivisionFilter([])
                      }}
                      className="mt-4 text-xs font-bold text-coral hover:text-coral/80 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Team Card ──
function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/tickets/sports/team/${team.slug}`}
      className="group flex flex-col bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg overflow-hidden"
    >
      {/* Color bar */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: team.colors.primary }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-black group-hover:text-coral transition-colors leading-tight">
            {team.name}
          </h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
            {team.division}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            {team.city}, {team.stateAbbr}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-gray-400 shrink-0" />
            {team.stadium}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{team.stadiumAddress.split(',').slice(-2).join(',').trim()}</span>
          <span className="text-xs font-bold text-coral inline-flex items-center gap-0.5">
            View Schedule <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Featured Team Detail (team page) ──
function FeaturedTeamDetail({ team, games }: { team: Team; games: Game[] }) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'stadium' | 'seating'>('schedule')

  return (
    <div>
      {/* Team header */}
      <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-2 w-full" style={{ backgroundColor: team.colors.primary }} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight">{team.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {team.division} - {team.city}, {team.stateAbbr}
              </p>
            </div>
            <Link
              href={`/tickets/sports/team/${team.slug}/seating-chart`}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap"
            >
              <TicketIcon className="w-3.5 h-3.5" /> Seating Chart
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-4">
        {(['schedule', 'stadium', 'seating'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-bold capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            {tab === 'seating' ? 'Seating Chart' : tab}
          </button>
        ))}
      </div>

      {/* Schedule tab */}
      {activeTab === 'schedule' && (
        <div>
          <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
            Upcoming Home Games
          </h3>
          {games.length > 0 ? (
            <div className="space-y-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
              <Calendar className="w-10 h-10 text-coral mx-auto mb-3" />
              <p className="text-sm text-gray-600">Schedule coming soon.</p>
            </div>
          )}
        </div>
      )}

      {/* Stadium tab */}
      {activeTab === 'stadium' && (
        <div>
          <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
            Stadium Information
          </h3>
          <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
            <div className="flex items-start gap-3 mb-4">
              <Trophy className="w-6 h-6 text-coral shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-black">{team.stadium}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {team.stadiumAddress}
                </p>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-white h-64 flex items-center justify-center">
              {team.lat && team.lng ? (
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-coral mx-auto mb-2" />
                  <p className="text-xs text-gray-500">{team.lat}, {team.lng}</p>
                  <p className="text-xs text-gray-400 mt-1">Interactive map coming soon</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Map data unavailable</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seating tab */}
      {activeTab === 'seating' && (
        <div>
          <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
            Seating Chart
          </h3>
          <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
            <div className="rounded-lg border border-gray-200 bg-white h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <TicketIcon className="w-8 h-8 text-coral mx-auto mb-2" />
                <p className="text-xs text-gray-500">Stadium seating diagram</p>
              </div>
            </div>
            <Link
              href={`/tickets/sports/team/${team.slug}/seating-chart`}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
            >
              View Full Seating Chart <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Game Card ──
function GameCard({ game }: { game: Game }) {
  const month = game.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = game.date.getDate()
  const dayName = game.date.toLocaleDateString('en-US', { weekday: 'short' })
  const time = game.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="flex items-stretch bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg overflow-hidden">
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
        <Link
          href={`/tickets/sports/team`}
          className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap"
        >
          Find Tickets
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
