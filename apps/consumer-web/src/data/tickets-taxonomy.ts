/**
 * Tickets Taxonomy
 *
 * Data for the "Live Event Tickets" navbar dropdown and the tickets category
 * pages. Five top-level groups: Concerts, Sports, Arts/Theater/Comedy, Family,
 * and Cities. Slugs are kebab-cased for URL use: /tickets/[group]/[subcategory]
 */

export interface TicketSubcategory {
  name: string
  slug: string
}

export interface TicketLeague {
  name: string
  slug: string
  conferences: TicketSubcategory[]
}

export interface TicketGroup {
  name: string
  slug: string
  /** Flat list of subcategories (Concerts, Arts, Family) */
  subcategories?: TicketSubcategory[]
  /** League-style structure (Sports only) */
  leagues?: TicketLeague[]
  /** Additional "Discover more" subcategories shown in a secondary list */
  discoverMore?: TicketSubcategory[]
}

// ── CONCERTS ────────────────────────────────────────────────────────────────
const CONCERT_GENRES: TicketSubcategory[] = [
  { name: 'Rock', slug: 'rock' },
  { name: 'Hip-Hop/Rap', slug: 'hip-hop-rap' },
  { name: 'Country', slug: 'country' },
  { name: 'Latin', slug: 'latin' },
  { name: 'Alternative', slug: 'alternative' },
  { name: 'Ballads/Romantic', slug: 'ballads-romantic' },
  { name: 'Blues', slug: 'blues' },
  { name: "Children's Music", slug: 'childrens-music' },
  { name: 'Classical', slug: 'classical' },
  { name: 'Dance/Electronic', slug: 'dance-electronic' },
  { name: 'Folk', slug: 'folk' },
  { name: 'Holiday', slug: 'holiday' },
  { name: 'Jazz', slug: 'jazz' },
  { name: 'Medieval/Renaissance', slug: 'medieval-renaissance' },
  { name: 'Metal', slug: 'metal' },
  { name: 'New Age', slug: 'new-age' },
  { name: 'Other', slug: 'other' },
  { name: 'Pop', slug: 'pop' },
  { name: 'R&B', slug: 'rb' },
  { name: 'Reggae', slug: 'reggae' },
  { name: 'Religious', slug: 'religious' },
  { name: 'World', slug: 'world' },
]

// ── SPORTS ──────────────────────────────────────────────────────────────────
const SPORTS_LEAGUES: TicketLeague[] = [
  {
    name: 'MLB',
    slug: 'mlb',
    conferences: [
      { name: 'American League', slug: 'american-league' },
      { name: 'National League', slug: 'national-league' },
    ],
  },
  {
    name: 'NFL',
    slug: 'nfl',
    conferences: [
      { name: 'AFC', slug: 'afc' },
      { name: 'NFC', slug: 'nfc' },
    ],
  },
  {
    name: 'NBA',
    slug: 'nba',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
  },
  {
    name: 'NHL',
    slug: 'nhl',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
  },
  {
    name: 'MLS',
    slug: 'mls',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
  },
]

const SPORTS_OTHER: TicketSubcategory[] = [
  { name: 'Baseball', slug: 'baseball' },
  { name: 'Basketball', slug: 'basketball' },
  { name: 'Boxing', slug: 'boxing' },
  { name: 'Equestrian', slug: 'equestrian' },
  { name: 'eSports', slug: 'esports' },
  { name: 'Football', slug: 'football' },
  { name: 'Golf', slug: 'golf' },
  { name: 'Gymnastics', slug: 'gymnastics' },
  { name: 'Hockey', slug: 'hockey' },
  { name: 'Ice Skating', slug: 'ice-skating' },
  { name: 'Indoor Soccer', slug: 'indoor-soccer' },
  { name: 'LA28 Olympic and Paralympic Games', slug: 'la28-olympic-paralympic-games' },
  { name: 'Lacrosse', slug: 'lacrosse' },
  { name: 'Martial Arts', slug: 'martial-arts' },
  { name: 'Motorsports/Racing', slug: 'motorsports-racing' },
  { name: 'Rodeo', slug: 'rodeo' },
  { name: 'Rugby', slug: 'rugby' },
  { name: 'Soccer', slug: 'soccer' },
  { name: 'Softball', slug: 'softball' },
  { name: 'Swimming', slug: 'swimming' },
  { name: 'Tennis', slug: 'tennis' },
  { name: 'Track & Field', slug: 'track-field' },
  { name: 'Volleyball', slug: 'volleyball' },
]

// ── ARTS, THEATER & COMEDY ──────────────────────────────────────────────────
const ARTS_TOP: TicketSubcategory[] = [
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Broadway', slug: 'broadway' },
  { name: 'Spectacular', slug: 'spectacular' },
]

const ARTS_DISCOVER: TicketSubcategory[] = [
  { name: 'Broadway', slug: 'broadway' },
  { name: "Children's Theater", slug: 'childrens-theater' },
  { name: 'Circus & Specialty Acts', slug: 'circus-specialty-acts' },
  { name: 'Classical', slug: 'classical' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Cultural', slug: 'cultural' },
  { name: 'Dance', slug: 'dance' },
  { name: 'Espectaculo', slug: 'espectaculo' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Fine Art', slug: 'fine-art' },
  { name: 'Magic & Illusion', slug: 'magic-illusion' },
  { name: 'Miscellaneous', slug: 'miscellaneous' },
  { name: 'Multimedia', slug: 'multimedia' },
  { name: 'Music', slug: 'music' },
  { name: 'Opera', slug: 'opera' },
  { name: 'Performance Art', slug: 'performance-art' },
  { name: 'Puppetry', slug: 'puppetry' },
  { name: 'Spectacular', slug: 'spectacular' },
  { name: 'Theater', slug: 'theater' },
  { name: 'Variety', slug: 'variety' },
]

// ── FAMILY ──────────────────────────────────────────────────────────────────
const FAMILY_TOP: TicketSubcategory[] = [
  { name: 'Ice Shows', slug: 'ice-shows' },
  { name: 'Circus/Specialty Acts', slug: 'circus-specialty-acts' },
  { name: "Children's Theater", slug: 'childrens-theater' },
]

const FAMILY_DISCOVER: TicketSubcategory[] = [
  { name: "Children's Music", slug: 'childrens-music' },
  { name: "Children's Theater", slug: 'childrens-theater' },
  { name: 'Circus/Specialty Acts', slug: 'circus-specialty-acts' },
  { name: 'Fairs/Festivals', slug: 'fairs-festivals' },
  { name: 'Film/Family', slug: 'film-family' },
  { name: 'Ice Shows', slug: 'ice-shows' },
  { name: 'Latin Children\'s', slug: 'latin-childrens' },
  { name: 'Magic/Illusion', slug: 'magic-illusion' },
  { name: 'Miscellaneous/Family', slug: 'miscellaneous-family' },
  { name: 'Puppetry', slug: 'puppetry' },
  { name: 'Rodeo', slug: 'rodeo' },
]

// ── CITIES ──────────────────────────────────────────────────────────────────
const TICKETS_CITIES: TicketSubcategory[] = [
  'Albany', 'Albuquerque', 'Anaheim', 'Atlanta', 'Atlantic City', 'Austin',
  'Baltimore', 'Birmingham', 'Bloomington', 'Boston', 'Buffalo', 'Charleston',
  'Charlotte', 'Chicago', 'Cincinnati', 'Cleveland', 'Columbia', 'Columbus',
  'Dallas', 'Denver', 'Detroit', 'Durham', 'El Paso', 'Fort Worth',
  'Grand Rapids', 'Greensboro', 'Honolulu', 'Houston', 'Indianapolis',
  'Jacksonville', 'Kansas City', 'Knoxville', 'Las Vegas', 'Lexington',
  'Los Angeles', 'Louisville', 'Madison', 'Memphis', 'Miami', 'Milwaukee',
  'Minneapolis', 'Nashville', 'New Orleans', 'New York City', 'Newark',
  'Norfolk', 'Oakland', 'Oklahoma City', 'Omaha', 'Orlando', 'Philadelphia',
  'Phoenix', 'Pittsburgh', 'Portland', 'Raleigh', 'Reno', 'Richmond',
  'Rochester', 'Sacramento', 'Salt Lake City', 'San Antonio', 'San Diego',
  'San Francisco', 'San Jose', 'Scottsdale', 'Seattle', 'Springfield',
  'St. Louis', 'Syracuse', 'Tacoma', 'Tampa', 'Tempe', 'Tucson',
  'Virginia Beach', 'Washington, D.C.',
].map((name) => ({
  name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
}))

// ── EXPORTED GROUPS ─────────────────────────────────────────────────────────
export const TICKETS_GROUPS: TicketGroup[] = [
  {
    name: 'All Concerts',
    slug: 'concerts',
    subcategories: CONCERT_GENRES,
  },
  {
    name: 'All Sports',
    slug: 'sports',
    leagues: SPORTS_LEAGUES,
    subcategories: SPORTS_OTHER,
  },
  {
    name: 'All Arts, Theater & Comedy',
    slug: 'arts-theater-comedy',
    subcategories: ARTS_TOP,
    discoverMore: ARTS_DISCOVER,
  },
  {
    name: 'All Family',
    slug: 'family',
    subcategories: FAMILY_TOP,
    discoverMore: FAMILY_DISCOVER,
  },
]

export { TICKETS_CITIES }

/** Event-type filter options for the homepage search bar (top-level groups). */
export const EVENT_TYPE_FILTERS: { label: string; value: string }[] = [
  { label: 'All Event Types', value: 'all' },
  { label: 'Concerts', value: 'concerts' },
  { label: 'Sports', value: 'sports' },
  { label: 'Arts, Theater & Comedy', value: 'arts-theater-comedy' },
  { label: 'Family', value: 'family' },
]

// ===========================================================================
// Helper functions for page routes
// ===========================================================================

export function getGroupBySlug(slug: string): TicketGroup | undefined {
  return TICKETS_GROUPS.find((g) => g.slug === slug)
}

export function getSubcategoryInGroup(
  groupSlug: string,
  subSlug: string
): TicketSubcategory | undefined {
  const group = getGroupBySlug(groupSlug)
  if (!group) return undefined
  const all = [
    ...(group.subcategories || []),
    ...(group.discoverMore || []),
  ]
  return all.find((s) => s.slug === subSlug)
}

export function getLeagueBySlug(slug: string): TicketLeague | undefined {
  const sports = getGroupBySlug('sports')
  return sports?.leagues?.find((l) => l.slug === slug)
}

export function getOtherSportBySlug(slug: string): TicketSubcategory | undefined {
  const sports = getGroupBySlug('sports')
  return sports?.subcategories?.find((s) => s.slug === slug)
}

export function getConferenceInLeague(
  leagueSlug: string,
  confSlug: string
): TicketSubcategory | undefined {
  const league = getLeagueBySlug(leagueSlug)
  return league?.conferences.find((c) => c.slug === confSlug)
}

export function getCityBySlug(slug: string): TicketSubcategory | undefined {
  return TICKETS_CITIES.find((c) => c.slug === slug)
}

// ===========================================================================
// Flat search index for the mega menu search
// ===========================================================================

export interface TicketSearchEntry {
  name: string
  href: string
  group: string
  groupSlug: string
}

function buildSearchIndex(): TicketSearchEntry[] {
  const entries: TicketSearchEntry[] = []

  for (const group of TICKETS_GROUPS) {
    // Group landing
    entries.push({
      name: group.name,
      href: `/tickets/${group.slug}`,
      group: 'Category',
      groupSlug: group.slug,
    })

    // Leagues (sports)
    if (group.leagues) {
      for (const league of group.leagues) {
        entries.push({
          name: league.name,
          href: `/tickets/sports/${league.slug}`,
          group: group.name,
          groupSlug: group.slug,
        })
        for (const conf of league.conferences) {
          entries.push({
            name: `${league.name} ${conf.name}`,
            href: `/tickets/sports/${league.slug}/${conf.slug}`,
            group: group.name,
            groupSlug: group.slug,
          })
        }
      }
    }

    // Subcategories
    if (group.subcategories) {
      for (const sub of group.subcategories) {
        entries.push({
          name: sub.name,
          href: `/tickets/${group.slug}/${sub.slug}`,
          group: group.name,
          groupSlug: group.slug,
        })
      }
    }

    // Discover more
    if (group.discoverMore) {
      for (const sub of group.discoverMore) {
        entries.push({
          name: sub.name,
          href: `/tickets/${group.slug}/${sub.slug}`,
          group: group.name,
          groupSlug: group.slug,
        })
      }
    }
  }

  // Cities
  for (const city of TICKETS_CITIES) {
    entries.push({
      name: city.name,
      href: `/tickets/cities/${city.slug}`,
      group: 'Cities',
      groupSlug: 'cities',
    })
  }

  return entries
}

export const TICKETS_SEARCH_INDEX: TicketSearchEntry[] = buildSearchIndex()
