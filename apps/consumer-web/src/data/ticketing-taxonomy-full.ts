/**
 * Full Ticketing Taxonomy
 *
 * Source: TICKETING TAXONNOMY.docx (uploaded)
 *
 * Structure:
 * - Concerts (22 genres)
 * - Sports (5 leagues with teams + stadiums + conferences/divisions)
 * - Arts, Theater & Comedy (3 top + 20 discover more)
 * - Family (3 top + 11 discover more)
 * - All Cities (78 US cities)
 *
 * Each league has full team data with stadiums, addresses, conferences.
 * This data feeds the ticket skeleton pages: League → Conference → Teams → Team Page (schedule + stadium + seating chart)
 *
 * The ticketing taxonomy for LOCAL and SMALL events uses the 19 Eventbrite-style
 * categories from userEventCategories in taxonomy.ts (Music, Food and Drink, etc.)
 */

// ── Concerts ────────────────────────────────────────────────────────────────
export const CONCERT_GENRES = [
  'Rock', 'Hip-Hop/Rap', 'Country', 'Latin', 'Alternative', 'Ballads/Romantic',
  'Blues', "Children's Music", 'Classical', 'Dance/Electronic', 'Folk',
  'Holiday', 'Jazz', 'Medieval/Renaissance', 'Metal', 'New Age', 'Other',
  'Pop', 'R&B', 'Reggae', 'Religious', 'World',
] as const

// ── Arts, Theater & Comedy ──────────────────────────────────────────────────
export const ARTS_TOP = ['Comedy', 'Broadway', 'Spectacular'] as const
export const ARTS_DISCOVER = [
  'Broadway', "Children's Theater", 'Circus & Specialty Acts', 'Classical',
  'Comedy', 'Cultural', 'Dance', 'Espectaculo', 'Fashion', 'Fine Art',
  'Magic & Illusion', 'Miscellaneous', 'Multimedia', 'Music', 'Opera',
  'Performance Art', 'Puppetry', 'Spectacular', 'Theater', 'Variety',
] as const

// ── Family ──────────────────────────────────────────────────────────────────
export const FAMILY_TOP = ['Ice Shows', 'Circus/Specialty Acts', "Children's Theater"] as const
export const FAMILY_DISCOVER = [
  "Children's Music", "Children's Theater", 'Circus/Specialty Acts',
  'Fairs/Festivals', 'Film/Family', 'Ice Shows', "Latin Children's",
  'Magic/Illusion', 'Miscellaneous/Family', 'Puppetry', 'Rodeo',
] as const

// ── All Cities ──────────────────────────────────────────────────────────────
export const TICKET_CITIES = [
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
] as const

// ── Stadium/Ticket Venue Types (from booking engine doc) ────────────────────
export const VENUE_TYPES = [
  'Amusement & Theme Parks',
  'Cultural Sites & Landmarks',
  'Museums & Galleries',
  'Natural Attraction',
  'Observation Decks & Towers',
  'Zoos & Aquariums',
  'Festivals',
  'Performing arts',
] as const

// ── Travel/Hospitality Categories (from booking engine doc) ─────────────────
export const TRAVEL_BOOKING_TYPES = {
  accommodations: [
    'Hotels', 'Resorts', 'Vacation Rentals', 'Bed & Breakfasts',
    'Hostels', 'Cabins', 'Cottages', 'Lodges', 'Guest Houses',
  ],
  activities: [
    'Air-based adventure', 'Cultural activity/experience/classes',
    'Land-based adventure', 'Water-based adventure', 'Wellness',
  ],
  tours: [
    'Active/adventure tours', 'Boat Tours', 'Cultural & Specialty Tours',
    'Food & Drink Tours', 'Multi-day Tours', 'Sightseeing',
    'Tour of a specific attraction',
  ],
  transportation: [
    'Car Rental', 'Airport Shuttle', 'Bus Lines', 'Train Tickets',
    'Private Transfer', 'Limousine Service',
  ],
  destinations: 989, // count from doc
  lifestyle: 18,
} as const

// ── Sports Leagues (from TICKETING TAXONNOMY.docx) ──────────────────────────
// The sports-teams.ts file already has all 152 teams with stadiums.
// This maps the doc's structure to what we have.

export interface LeagueInfo {
  name: string
  slug: string
  conferences: { name: string; slug: string }[]
  teamCount: number
}

export const LEAGUES: LeagueInfo[] = [
  {
    name: 'NFL',
    slug: 'nfl',
    conferences: [
      { name: 'AFC', slug: 'afc' },
      { name: 'NFC', slug: 'nfc' },
    ],
    teamCount: 32,
  },
  {
    name: 'NBA',
    slug: 'nba',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
    teamCount: 30,
  },
  {
    name: 'MLB',
    slug: 'mlb',
    conferences: [
      { name: 'American League', slug: 'american-league' },
      { name: 'National League', slug: 'national-league' },
    ],
    teamCount: 30,
  },
  {
    name: 'NHL',
    slug: 'nhl',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
    teamCount: 32,
  },
  {
    name: 'MLS',
    slug: 'mls',
    conferences: [
      { name: 'Eastern Conference', slug: 'eastern-conference' },
      { name: 'Western Conference', slug: 'western-conference' },
    ],
    teamCount: 28,
  },
]

// ── Other Sports (from doc) ─────────────────────────────────────────────────
export const OTHER_SPORTS = [
  'Minor League Baseball', 'G League Basketball', 'Boxing', 'Equestrian',
  'eSports', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Ice Skating',
  'Indoor Soccer', 'LA28 Olympic and Paralympic Games', 'Lacrosse',
  'Martial Arts', 'Motorsports/Racing', 'Rodeo', 'Rugby', 'Soccer',
  'Softball', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball',
] as const

// ── Local Event Categories (Eventbrite layer — user-published events) ──────
// These come from userEventCategories in taxonomy.ts
export const LOCAL_EVENT_CATEGORIES = [
  'music', 'food-and-drink', 'community-and-culture', 'business',
  'performing-and-visual-art', 'seasonal', 'sports-and-fitness',
  'health-and-wellness', 'science-and-technology', 'charity-and-causes',
  'travel-and-outdoor', 'religion-and-spirituality', 'family-and-education',
  'film-media-and-entertainment', 'government-and-politics',
  'fashion-and-beauty', 'home-and-lifestyle', 'school-activities', 'other',
] as const
