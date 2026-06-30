/**
 * Planviry - Brand data, category taxonomy, and SEO configuration
 * Based on Planviry Build Specification v3.0
 */

// ── 8 Verticals (from Part 23 / Part 27) ──────────────────────────────────
export interface Vertical {
  name: string
  slug: string
  icon: string
  feePercent: number
  description: string
  subCategories: string[]
  placeholderTheme: string
  gradient: string
}

export const VERTICALS: Vertical[] = [
  {
    name: 'Venues & Spaces',
    slug: 'venues-spaces',
    icon: '🏛️',
    feePercent: 8,
    description: 'Wedding venues, rooftops, galleries, ballrooms, gardens, lofts',
    subCategories: ['Wedding Venue', 'Music Venue', 'Rooftop Bar', 'Private Dining Room', 'Art Gallery', 'Museum', 'Barn Venue', 'Garden Venue', 'Loft Space', 'Conference Center', 'Hotel Ballroom', 'Outdoor Space'],
    placeholderTheme: 'Architectural line drawings',
    gradient: 'from-slate-700 to-slate-900',
  },
  {
    name: 'Event Planning & Services',
    slug: 'event-planning',
    icon: '📋',
    feePercent: 10,
    description: 'Wedding planners, coordinators, team building, corporate events',
    subCategories: ['Wedding Planner', 'Event Coordinator', 'Corporate Event Planner', 'Team Building Facilitator', 'Day-Of Coordinator', 'Event Designer'],
    placeholderTheme: 'Planning tool illustrations',
    gradient: 'from-indigo-700 to-indigo-900',
  },
  {
    name: 'Catering & Food',
    slug: 'catering-food',
    icon: '🍽️',
    feePercent: 10,
    description: 'Caterers, personal chefs, bartenders, food trucks, sommeliers',
    subCategories: ['Caterer', 'Personal Chef', 'Bartender', 'Food Truck', 'Sommelier', 'Cake Baker', 'Pastry Chef'],
    placeholderTheme: 'Food illustration set',
    gradient: 'from-amber-700 to-amber-900',
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    icon: '🎵',
    feePercent: 12,
    description: 'DJs, live bands, magicians, photo booths, comedians, karaoke',
    subCategories: ['DJ Service', 'Live Band', 'Magician', 'Photo Booth', 'Escape Room', 'Comedian', 'Karaoke Host', 'Dancer', 'Hypnotist', 'Caricaturist'],
    placeholderTheme: 'Performer silhouettes',
    gradient: 'from-purple-700 to-purple-900',
  },
  {
    name: 'Production & Tech',
    slug: 'production-tech',
    icon: '📸',
    feePercent: 12,
    description: 'Photographers, videographers, AV rental, sound, lighting',
    subCategories: ['Photographer', 'Videographer', 'AV Rental', 'Sound System', 'Lighting Rental', 'Photo Booth Tech', 'Drone Videographer', 'Live Streaming'],
    placeholderTheme: 'Equipment line art',
    gradient: 'from-cyan-700 to-cyan-900',
  },
  {
    name: 'Decor & Rentals',
    slug: 'decor-rentals',
    icon: '💐',
    feePercent: 10,
    description: 'Floral designers, balloon artists, furniture, tents, linens',
    subCategories: ['Floral Designer', 'Balloon Artist', 'Furniture Rental', 'Tent Rental', 'Linen Rental', 'Centerpiece Designer', 'Event Stylist', 'Arch & Chuppah Rental'],
    placeholderTheme: 'Floral and decor illustrations',
    gradient: 'from-rose-700 to-rose-900',
  },
  {
    name: 'Beauty & Attire',
    slug: 'beauty-attire',
    icon: '💄',
    feePercent: 10,
    description: 'Makeup artists, hair stylists, nail salons, spas, spray tans',
    subCategories: ['Makeup Artist', 'Hair Stylist', 'Nail Salon', 'Spa Service', 'Spray Tan', 'Airbrush Artist', 'Wardrobe Stylist', 'Tailor'],
    placeholderTheme: 'Beauty tool illustrations',
    gradient: 'from-pink-700 to-pink-900',
  },
  {
    name: 'Travel & Lodging',
    slug: 'travel-lodging',
    icon: '🏨',
    feePercent: 8,
    description: 'Hotels, resorts, limos, party buses, boat charters, tours',
    subCategories: ['Hotel', 'Resort', 'Limo Service', 'Party Bus', 'Boat Charter', 'Tour Operator', 'Vacation Rental', 'Shuttle Service'],
    placeholderTheme: 'Transport and hospitality illustrations',
    gradient: 'from-teal-700 to-teal-900',
  },
]

// ── 5 Occasions ────────────────────────────────────────────────────────────
export const OCCASIONS = [
  { name: 'Social & Casual', slug: 'social-casual', icon: '🎉' },
  { name: 'Life Milestones', slug: 'life-milestones', icon: '💍' },
  { name: 'Corporate & Professional', slug: 'corporate-professional', icon: '💼' },
  { name: 'Community & Cultural', slug: 'community-cultural', icon: '🎭' },
  { name: 'Events & Activities', slug: 'experiences-activities', icon: '🌊' },
] as const

// ── Airport Codes as Popular Cities (organized by state) ───────────────────
export interface AirportCity {
  name: string
  code: string
  state: string
  stateAbbr: string
  stateSlug: string
  slug: string
  vendorCount: number
}

export interface StateAirports {
  state: string
  abbr: string
  slug: string
  airports: AirportCity[]
}

export const AIRPORT_CITIES: StateAirports[] = [
  {
    state: 'Alabama', abbr: 'AL', slug: 'alabama',
    airports: [
      { name: 'Birmingham International Airport', code: 'BHM', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'alabama', slug: 'bhm', vendorCount: 0 },
      { name: 'Dothan Regional Airport', code: 'DHN', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'alabama', slug: 'dhn', vendorCount: 0 },
      { name: 'Huntsville International Airport', code: 'HSV', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'alabama', slug: 'hsv', vendorCount: 0 },
      { name: 'Mobile', code: 'MOB', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'alabama', slug: 'mob', vendorCount: 0 },
      { name: 'Montgomery', code: 'MGM', state: 'Alabama', stateAbbr: 'AL', stateSlug: 'alabama', slug: 'mgm', vendorCount: 0 },
    ],
  },
  {
    state: 'Alaska', abbr: 'AK', slug: 'alaska',
    airports: [
      { name: 'Anchorage International Airport', code: 'ANC', state: 'Alaska', stateAbbr: 'AK', stateSlug: 'alaska', slug: 'anc', vendorCount: 0 },
      { name: 'Fairbanks International Airport', code: 'FAI', state: 'Alaska', stateAbbr: 'AK', stateSlug: 'alaska', slug: 'fai', vendorCount: 0 },
      { name: 'Juneau International Airport', code: 'JNU', state: 'Alaska', stateAbbr: 'AK', stateSlug: 'alaska', slug: 'jnu', vendorCount: 0 },
    ],
  },
  {
    state: 'Arizona', abbr: 'AZ', slug: 'arizona',
    airports: [
      { name: 'Flagstaff', code: 'FLG', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'arizona', slug: 'flg', vendorCount: 0 },
      { name: 'Phoenix Sky Harbor International Airport', code: 'PHX', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'arizona', slug: 'phx', vendorCount: 0 },
      { name: 'Tucson International Airport', code: 'TUS', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'arizona', slug: 'tus', vendorCount: 0 },
      { name: 'Yuma International Airport', code: 'YUM', state: 'Arizona', stateAbbr: 'AZ', stateSlug: 'arizona', slug: 'yum', vendorCount: 0 },
    ],
  },
  {
    state: 'Arkansas', abbr: 'AR', slug: 'arkansas',
    airports: [
      { name: 'Fayetteville', code: 'FYV', state: 'Arkansas', stateAbbr: 'AR', stateSlug: 'arkansas', slug: 'fyv', vendorCount: 0 },
      { name: 'Little Rock National Airport', code: 'LIT', state: 'Arkansas', stateAbbr: 'AR', stateSlug: 'arkansas', slug: 'lit', vendorCount: 0 },
      { name: 'Northwest Arkansas Regional Airport', code: 'XNA', state: 'Arkansas', stateAbbr: 'AR', stateSlug: 'arkansas', slug: 'xna', vendorCount: 0 },
    ],
  },
  {
    state: 'California', abbr: 'CA', slug: 'california',
    airports: [
      { name: 'Burbank', code: 'BUR', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'bur', vendorCount: 0 },
      { name: 'Fresno', code: 'FAT', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'fat', vendorCount: 0 },
      { name: 'Long Beach', code: 'LGB', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'lgb', vendorCount: 0 },
      { name: 'Los Angeles International Airport', code: 'LAX', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'lax', vendorCount: 0 },
      { name: 'Oakland', code: 'OAK', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'oak', vendorCount: 0 },
      { name: 'Ontario', code: 'ONT', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'ont', vendorCount: 0 },
      { name: 'Palm Springs', code: 'PSP', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'psp', vendorCount: 0 },
      { name: 'Sacramento', code: 'SMF', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'smf', vendorCount: 0 },
      { name: 'San Diego', code: 'SAN', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'san', vendorCount: 0 },
      { name: 'San Francisco International Airport', code: 'SFO', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'sfo', vendorCount: 0 },
      { name: 'San Jose', code: 'SJC', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'sjc', vendorCount: 0 },
      { name: 'Santa Ana', code: 'SNA', state: 'California', stateAbbr: 'CA', stateSlug: 'california', slug: 'sna', vendorCount: 0 },
    ],
  },
  {
    state: 'Colorado', abbr: 'CO', slug: 'colorado',
    airports: [
      { name: 'Aspen', code: 'ASE', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'colorado', slug: 'ase', vendorCount: 0 },
      { name: 'Colorado Springs', code: 'COS', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'colorado', slug: 'cos', vendorCount: 0 },
      { name: 'Denver International Airport', code: 'DEN', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'colorado', slug: 'den', vendorCount: 0 },
      { name: 'Grand Junction', code: 'GJT', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'colorado', slug: 'gjt', vendorCount: 0 },
      { name: 'Pueblo', code: 'PUB', state: 'Colorado', stateAbbr: 'CO', stateSlug: 'colorado', slug: 'pub', vendorCount: 0 },
    ],
  },
  {
    state: 'Connecticut', abbr: 'CT', slug: 'connecticut',
    airports: [
      { name: 'Hartford', code: 'BDL', state: 'Connecticut', stateAbbr: 'CT', stateSlug: 'connecticut', slug: 'bdl', vendorCount: 0 },
      { name: 'Tweed New Haven', code: 'HVN', state: 'Connecticut', stateAbbr: 'CT', stateSlug: 'connecticut', slug: 'hvn', vendorCount: 0 },
    ],
  },
  {
    state: 'District of Columbia', abbr: 'DC', slug: 'district-of-columbia',
    airports: [
      { name: 'Washington Dulles International Airport', code: 'IAD', state: 'District of Columbia', stateAbbr: 'DC', stateSlug: 'district-of-columbia', slug: 'iad', vendorCount: 0 },
      { name: 'Washington National Airport', code: 'DCA', state: 'District of Columbia', stateAbbr: 'DC', stateSlug: 'district-of-columbia', slug: 'dca', vendorCount: 0 },
    ],
  },
  {
    state: 'Florida', abbr: 'FL', slug: 'florida',
    airports: [
      { name: 'Daytona Beach', code: 'DAB', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'dab', vendorCount: 0 },
      { name: 'Fort Lauderdale-Hollywood International Airport', code: 'FLL', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'fll', vendorCount: 0 },
      { name: 'Fort Meyers', code: 'RSW', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'rsw', vendorCount: 0 },
      { name: 'Jacksonville', code: 'JAX', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'jax', vendorCount: 0 },
      { name: 'Key West International Airport', code: 'EYW', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'eyw', vendorCount: 0 },
      { name: 'Miami International Airport', code: 'MIA', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'mia', vendorCount: 0 },
      { name: 'Orlando', code: 'MCO', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'mco', vendorCount: 0 },
      { name: 'Pensacola', code: 'PNS', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'pns', vendorCount: 0 },
      { name: 'St. Petersburg', code: 'PIE', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'pie', vendorCount: 0 },
      { name: 'Sarasota', code: 'SRQ', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'srq', vendorCount: 0 },
      { name: 'Tampa', code: 'TPA', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'tpa', vendorCount: 0 },
      { name: 'West Palm Beach', code: 'PBI', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'pbi', vendorCount: 0 },
      { name: 'Panama City-Bay County International Airport', code: 'PFN', state: 'Florida', stateAbbr: 'FL', stateSlug: 'florida', slug: 'pfn', vendorCount: 0 },
    ],
  },
  {
    state: 'Georgia', abbr: 'GA', slug: 'georgia',
    airports: [
      { name: 'Atlanta Hartsfield International Airport', code: 'ATL', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'georgia', slug: 'atl', vendorCount: 0 },
      { name: 'Augusta', code: 'AGS', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'georgia', slug: 'ags', vendorCount: 0 },
      { name: 'Savannah', code: 'SAV', state: 'Georgia', stateAbbr: 'GA', stateSlug: 'georgia', slug: 'sav', vendorCount: 0 },
    ],
  },
  {
    state: 'Hawaii', abbr: 'HI', slug: 'hawaii',
    airports: [
      { name: 'Hilo', code: 'ITO', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hawaii', slug: 'ito', vendorCount: 0 },
      { name: 'Honolulu International Airport', code: 'HNL', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hawaii', slug: 'hnl', vendorCount: 0 },
      { name: 'Kahului', code: 'OGG', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hawaii', slug: 'ogg', vendorCount: 0 },
      { name: 'Kailua', code: 'KOA', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hawaii', slug: 'koa', vendorCount: 0 },
      { name: 'Lihue', code: 'LIH', state: 'Hawaii', stateAbbr: 'HI', stateSlug: 'hawaii', slug: 'lih', vendorCount: 0 },
    ],
  },
  {
    state: 'Idaho', abbr: 'ID', slug: 'idaho',
    airports: [
      { name: 'Boise', code: 'BOI', state: 'Idaho', stateAbbr: 'ID', stateSlug: 'idaho', slug: 'boi', vendorCount: 0 },
    ],
  },
  {
    state: 'Illinois', abbr: 'IL', slug: 'illinois',
    airports: [
      { name: 'Chicago Midway Airport', code: 'MDW', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'illinois', slug: 'mdw', vendorCount: 0 },
      { name: "Chicago O'Hare International Airport", code: 'ORD', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'illinois', slug: 'ord', vendorCount: 0 },
      { name: 'Moline', code: 'MLI', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'illinois', slug: 'mli', vendorCount: 0 },
      { name: 'Peoria', code: 'PIA', state: 'Illinois', stateAbbr: 'IL', stateSlug: 'illinois', slug: 'pia', vendorCount: 0 },
    ],
  },
  {
    state: 'Indiana', abbr: 'IN', slug: 'indiana',
    airports: [
      { name: 'Evansville', code: 'EVV', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'indiana', slug: 'evv', vendorCount: 0 },
      { name: 'Fort Wayne', code: 'FWA', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'indiana', slug: 'fwa', vendorCount: 0 },
      { name: 'Indianapolis International Airport', code: 'IND', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'indiana', slug: 'ind', vendorCount: 0 },
      { name: 'South Bend', code: 'SBN', state: 'Indiana', stateAbbr: 'IN', stateSlug: 'indiana', slug: 'sbn', vendorCount: 0 },
    ],
  },
  {
    state: 'Iowa', abbr: 'IA', slug: 'iowa',
    airports: [
      { name: 'Cedar Rapids', code: 'CID', state: 'Iowa', stateAbbr: 'IA', stateSlug: 'iowa', slug: 'cid', vendorCount: 0 },
      { name: 'Des Moines', code: 'DSM', state: 'Iowa', stateAbbr: 'IA', stateSlug: 'iowa', slug: 'dsm', vendorCount: 0 },
    ],
  },
  {
    state: 'Kansas', abbr: 'KS', slug: 'kansas',
    airports: [
      { name: 'Wichita', code: 'ICT', state: 'Kansas', stateAbbr: 'KS', stateSlug: 'kansas', slug: 'ict', vendorCount: 0 },
    ],
  },
  {
    state: 'Kentucky', abbr: 'KY', slug: 'kentucky',
    airports: [
      { name: 'Lexington', code: 'LEX', state: 'Kentucky', stateAbbr: 'KY', stateSlug: 'kentucky', slug: 'lex', vendorCount: 0 },
      { name: 'Louisville', code: 'SDF', state: 'Kentucky', stateAbbr: 'KY', stateSlug: 'kentucky', slug: 'sdf', vendorCount: 0 },
    ],
  },
  {
    state: 'Louisiana', abbr: 'LA', slug: 'louisiana',
    airports: [
      { name: 'Baton Rouge', code: 'BTR', state: 'Louisiana', stateAbbr: 'LA', stateSlug: 'louisiana', slug: 'btr', vendorCount: 0 },
      { name: 'New Orleans International Airport', code: 'MSY', state: 'Louisiana', stateAbbr: 'LA', stateSlug: 'louisiana', slug: 'msy', vendorCount: 0 },
      { name: 'Shreveport', code: 'SHV', state: 'Louisiana', stateAbbr: 'LA', stateSlug: 'louisiana', slug: 'shv', vendorCount: 0 },
    ],
  },
  {
    state: 'Maine', abbr: 'ME', slug: 'maine',
    airports: [
      { name: 'Augusta', code: 'AUG', state: 'Maine', stateAbbr: 'ME', stateSlug: 'maine', slug: 'aug', vendorCount: 0 },
      { name: 'Bangor', code: 'BGR', state: 'Maine', stateAbbr: 'ME', stateSlug: 'maine', slug: 'bgr', vendorCount: 0 },
      { name: 'Portland', code: 'PWM', state: 'Maine', stateAbbr: 'ME', stateSlug: 'maine', slug: 'pwm', vendorCount: 0 },
    ],
  },
  {
    state: 'Maryland', abbr: 'MD', slug: 'maryland',
    airports: [
      { name: 'Baltimore', code: 'BWI', state: 'Maryland', stateAbbr: 'MD', stateSlug: 'maryland', slug: 'bwi', vendorCount: 0 },
    ],
  },
  {
    state: 'Massachusetts', abbr: 'MA', slug: 'massachusetts',
    airports: [
      { name: 'Boston Logan International Airport', code: 'BOS', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'massachusetts', slug: 'bos', vendorCount: 0 },
      { name: 'Hyannis', code: 'HYA', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'massachusetts', slug: 'hya', vendorCount: 0 },
      { name: 'Nantucket', code: 'ACK', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'massachusetts', slug: 'ack', vendorCount: 0 },
      { name: 'Worcester', code: 'ORH', state: 'Massachusetts', stateAbbr: 'MA', stateSlug: 'massachusetts', slug: 'orh', vendorCount: 0 },
    ],
  },
  {
    state: 'Michigan', abbr: 'MI', slug: 'michigan',
    airports: [
      { name: 'Battlecreek', code: 'BTL', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'btl', vendorCount: 0 },
      { name: 'Detroit Metropolitan Airport', code: 'DTW', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'dtw', vendorCount: 0 },
      { name: 'Detroit', code: 'DET', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'det', vendorCount: 0 },
      { name: 'Flint', code: 'FNT', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'fnt', vendorCount: 0 },
      { name: 'Grand Rapids', code: 'GRR', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'grr', vendorCount: 0 },
      { name: 'Kalamazoo-Battle Creek International Airport', code: 'AZO', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'azo', vendorCount: 0 },
      { name: 'Lansing', code: 'LAN', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'lan', vendorCount: 0 },
      { name: 'Saginaw', code: 'MBS', state: 'Michigan', stateAbbr: 'MI', stateSlug: 'michigan', slug: 'mbs', vendorCount: 0 },
    ],
  },
  {
    state: 'Minnesota', abbr: 'MN', slug: 'minnesota',
    airports: [
      { name: 'Duluth', code: 'DLH', state: 'Minnesota', stateAbbr: 'MN', stateSlug: 'minnesota', slug: 'dlh', vendorCount: 0 },
      { name: 'Minneapolis/St. Paul International Airport', code: 'MSP', state: 'Minnesota', stateAbbr: 'MN', stateSlug: 'minnesota', slug: 'msp', vendorCount: 0 },
      { name: 'Rochester', code: 'RST', state: 'Minnesota', stateAbbr: 'MN', stateSlug: 'minnesota', slug: 'rst', vendorCount: 0 },
    ],
  },
  {
    state: 'Mississippi', abbr: 'MS', slug: 'mississippi',
    airports: [
      { name: 'Gulfport', code: 'GPT', state: 'Mississippi', stateAbbr: 'MS', stateSlug: 'mississippi', slug: 'gpt', vendorCount: 0 },
      { name: 'Jackson', code: 'JAN', state: 'Mississippi', stateAbbr: 'MS', stateSlug: 'mississippi', slug: 'jan', vendorCount: 0 },
    ],
  },
  {
    state: 'Missouri', abbr: 'MO', slug: 'missouri',
    airports: [
      { name: 'Kansas City', code: 'MCI', state: 'Missouri', stateAbbr: 'MO', stateSlug: 'missouri', slug: 'mci', vendorCount: 0 },
      { name: 'St. Louis Lambert International Airport', code: 'STL', state: 'Missouri', stateAbbr: 'MO', stateSlug: 'missouri', slug: 'stl', vendorCount: 0 },
      { name: 'Springfield', code: 'SGF', state: 'Missouri', stateAbbr: 'MO', stateSlug: 'missouri', slug: 'sgf', vendorCount: 0 },
    ],
  },
  {
    state: 'Montana', abbr: 'MT', slug: 'montana',
    airports: [
      { name: 'Billings', code: 'BIL', state: 'Montana', stateAbbr: 'MT', stateSlug: 'montana', slug: 'bil', vendorCount: 0 },
    ],
  },
  {
    state: 'Nebraska', abbr: 'NE', slug: 'nebraska',
    airports: [
      { name: 'Lincoln', code: 'LNK', state: 'Nebraska', stateAbbr: 'NE', stateSlug: 'nebraska', slug: 'lnk', vendorCount: 0 },
      { name: 'Omaha', code: 'OMA', state: 'Nebraska', stateAbbr: 'NE', stateSlug: 'nebraska', slug: 'oma', vendorCount: 0 },
    ],
  },
  {
    state: 'Nevada', abbr: 'NV', slug: 'nevada',
    airports: [
      { name: 'Las Vegas McCarran International Airport', code: 'LAS', state: 'Nevada', stateAbbr: 'NV', stateSlug: 'nevada', slug: 'las', vendorCount: 0 },
      { name: 'Reno-Tahoe International Airport', code: 'RNO', state: 'Nevada', stateAbbr: 'NV', stateSlug: 'nevada', slug: 'rno', vendorCount: 0 },
    ],
  },
  {
    state: 'New Hampshire', abbr: 'NH', slug: 'new-hampshire',
    airports: [
      { name: 'Manchester', code: 'MHT', state: 'New Hampshire', stateAbbr: 'NH', stateSlug: 'new-hampshire', slug: 'mht', vendorCount: 0 },
    ],
  },
  {
    state: 'New Jersey', abbr: 'NJ', slug: 'new-jersey',
    airports: [
      { name: 'Atlantic City International Airport', code: 'ACY', state: 'New Jersey', stateAbbr: 'NJ', stateSlug: 'new-jersey', slug: 'acy', vendorCount: 0 },
      { name: 'Newark International Airport', code: 'EWR', state: 'New Jersey', stateAbbr: 'NJ', stateSlug: 'new-jersey', slug: 'ewr', vendorCount: 0 },
      { name: 'Trenton', code: 'TTN', state: 'New Jersey', stateAbbr: 'NJ', stateSlug: 'new-jersey', slug: 'ttn', vendorCount: 0 },
    ],
  },
  {
    state: 'New Mexico', abbr: 'NM', slug: 'new-mexico',
    airports: [
      { name: 'Albuquerque International Airport', code: 'ABQ', state: 'New Mexico', stateAbbr: 'NM', stateSlug: 'new-mexico', slug: 'abq', vendorCount: 0 },
      { name: 'Alamogordo', code: 'ALM', state: 'New Mexico', stateAbbr: 'NM', stateSlug: 'new-mexico', slug: 'alm', vendorCount: 0 },
    ],
  },
  {
    state: 'New York', abbr: 'NY', slug: 'new-york',
    airports: [
      { name: 'Albany International Airport', code: 'ALB', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'alb', vendorCount: 0 },
      { name: 'Buffalo', code: 'BUF', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'buf', vendorCount: 0 },
      { name: 'Islip', code: 'ISP', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'isp', vendorCount: 0 },
      { name: 'John F. Kennedy International Airport', code: 'JFK', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'jfk', vendorCount: 0 },
      { name: 'LaGuardia Airport', code: 'LGA', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'lga', vendorCount: 0 },
      { name: 'Newburgh', code: 'SWF', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'swf', vendorCount: 0 },
      { name: 'Rochester', code: 'ROC', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'roc', vendorCount: 0 },
      { name: 'Syracuse', code: 'SYR', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'syr', vendorCount: 0 },
      { name: 'Westchester', code: 'HPN', state: 'New York', stateAbbr: 'NY', stateSlug: 'new-york', slug: 'hpn', vendorCount: 0 },
    ],
  },
  {
    state: 'North Carolina', abbr: 'NC', slug: 'north-carolina',
    airports: [
      { name: 'Asheville', code: 'AVL', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'avl', vendorCount: 0 },
      { name: 'Charlotte/Douglas International Airport', code: 'CLT', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'clt', vendorCount: 0 },
      { name: 'Fayetteville', code: 'FAY', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'fay', vendorCount: 0 },
      { name: 'Greensboro', code: 'GSO', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'gso', vendorCount: 0 },
      { name: 'Raleigh', code: 'RDU', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'rdu', vendorCount: 0 },
      { name: 'Winston-Salem', code: 'INT', state: 'North Carolina', stateAbbr: 'NC', stateSlug: 'north-carolina', slug: 'int', vendorCount: 0 },
    ],
  },
  {
    state: 'North Dakota', abbr: 'ND', slug: 'north-dakota',
    airports: [
      { name: 'Bismarck', code: 'BIS', state: 'North Dakota', stateAbbr: 'ND', stateSlug: 'north-dakota', slug: 'bis', vendorCount: 0 },
      { name: 'Fargo', code: 'FAR', state: 'North Dakota', stateAbbr: 'ND', stateSlug: 'north-dakota', slug: 'far', vendorCount: 0 },
    ],
  },
  {
    state: 'Ohio', abbr: 'OH', slug: 'ohio',
    airports: [
      { name: 'Akron', code: 'CAK', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'cak', vendorCount: 0 },
      { name: 'Cincinnati', code: 'CVG', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'cvg', vendorCount: 0 },
      { name: 'Cleveland', code: 'CLE', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'cle', vendorCount: 0 },
      { name: 'Columbus', code: 'CMH', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'cmh', vendorCount: 0 },
      { name: 'Dayton', code: 'DAY', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'day', vendorCount: 0 },
      { name: 'Toledo', code: 'TOL', state: 'Ohio', stateAbbr: 'OH', stateSlug: 'ohio', slug: 'tol', vendorCount: 0 },
    ],
  },
  {
    state: 'Oklahoma', abbr: 'OK', slug: 'oklahoma',
    airports: [
      { name: 'Oklahoma City', code: 'OKC', state: 'Oklahoma', stateAbbr: 'OK', stateSlug: 'oklahoma', slug: 'okc', vendorCount: 0 },
      { name: 'Tulsa', code: 'TUL', state: 'Oklahoma', stateAbbr: 'OK', stateSlug: 'oklahoma', slug: 'tul', vendorCount: 0 },
    ],
  },
  {
    state: 'Oregon', abbr: 'OR', slug: 'oregon',
    airports: [
      { name: 'Eugene', code: 'EUG', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'oregon', slug: 'eug', vendorCount: 0 },
      { name: 'Portland International Airport', code: 'PDX', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'oregon', slug: 'pdx', vendorCount: 0 },
      { name: 'Portland Hillsboro Airport', code: 'HIO', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'oregon', slug: 'hio', vendorCount: 0 },
      { name: 'Salem', code: 'SLE', state: 'Oregon', stateAbbr: 'OR', stateSlug: 'oregon', slug: 'sle', vendorCount: 0 },
    ],
  },
  {
    state: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania',
    airports: [
      { name: 'Allentown', code: 'ABE', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'abe', vendorCount: 0 },
      { name: 'Erie', code: 'ERI', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'eri', vendorCount: 0 },
      { name: 'Harrisburg', code: 'MDT', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'mdt', vendorCount: 0 },
      { name: 'Philadelphia', code: 'PHL', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'phl', vendorCount: 0 },
      { name: 'Pittsburgh', code: 'PIT', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'pit', vendorCount: 0 },
      { name: 'Scranton', code: 'AVP', state: 'Pennsylvania', stateAbbr: 'PA', stateSlug: 'pennsylvania', slug: 'avp', vendorCount: 0 },
    ],
  },
  {
    state: 'Rhode Island', abbr: 'RI', slug: 'rhode-island',
    airports: [
      { name: 'Providence T.F. Green Airport', code: 'PVD', state: 'Rhode Island', stateAbbr: 'RI', stateSlug: 'rhode-island', slug: 'pvd', vendorCount: 0 },
    ],
  },
  {
    state: 'South Carolina', abbr: 'SC', slug: 'south-carolina',
    airports: [
      { name: 'Charleston', code: 'CHS', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'south-carolina', slug: 'chs', vendorCount: 0 },
      { name: 'Columbia', code: 'CAE', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'south-carolina', slug: 'cae', vendorCount: 0 },
      { name: 'Greenville', code: 'GSP', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'south-carolina', slug: 'gsp', vendorCount: 0 },
      { name: 'Myrtle Beach', code: 'MYR', state: 'South Carolina', stateAbbr: 'SC', stateSlug: 'south-carolina', slug: 'myr', vendorCount: 0 },
    ],
  },
  {
    state: 'South Dakota', abbr: 'SD', slug: 'south-dakota',
    airports: [
      { name: 'Pierre', code: 'PIR', state: 'South Dakota', stateAbbr: 'SD', stateSlug: 'south-dakota', slug: 'pir', vendorCount: 0 },
      { name: 'Rapid City', code: 'RAP', state: 'South Dakota', stateAbbr: 'SD', stateSlug: 'south-dakota', slug: 'rap', vendorCount: 0 },
      { name: 'Sioux Falls', code: 'FSD', state: 'South Dakota', stateAbbr: 'SD', stateSlug: 'south-dakota', slug: 'fsd', vendorCount: 0 },
    ],
  },
  {
    state: 'Tennessee', abbr: 'TN', slug: 'tennessee',
    airports: [
      { name: 'Bristol', code: 'TRI', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tennessee', slug: 'tri', vendorCount: 0 },
      { name: 'Chattanooga', code: 'CHA', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tennessee', slug: 'cha', vendorCount: 0 },
      { name: 'Knoxville', code: 'TYS', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tennessee', slug: 'tys', vendorCount: 0 },
      { name: 'Memphis', code: 'MEM', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tennessee', slug: 'mem', vendorCount: 0 },
      { name: 'Nashville', code: 'BNA', state: 'Tennessee', stateAbbr: 'TN', stateSlug: 'tennessee', slug: 'bna', vendorCount: 0 },
    ],
  },
  {
    state: 'Texas', abbr: 'TX', slug: 'texas',
    airports: [
      { name: 'Amarillo', code: 'AMA', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'ama', vendorCount: 0 },
      { name: 'Austin Bergstrom International Airport', code: 'AUS', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'aus', vendorCount: 0 },
      { name: 'Corpus Christi', code: 'CRP', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'crp', vendorCount: 0 },
      { name: 'Dallas Love Field Airport', code: 'DAL', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'dal', vendorCount: 0 },
      { name: 'Dallas/Fort Worth International Airport', code: 'DFW', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'dfw', vendorCount: 0 },
      { name: 'El Paso', code: 'ELP', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'elp', vendorCount: 0 },
      { name: 'Houston William B. Hobby Airport', code: 'HOU', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'hou', vendorCount: 0 },
      { name: 'Houston George Bush Intercontinental Airport', code: 'IAH', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'iah', vendorCount: 0 },
      { name: 'Lubbock', code: 'LBB', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'lbb', vendorCount: 0 },
      { name: 'Midland', code: 'MAF', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'maf', vendorCount: 0 },
      { name: 'San Antonio International Airport', code: 'SAT', state: 'Texas', stateAbbr: 'TX', stateSlug: 'texas', slug: 'sat', vendorCount: 0 },
    ],
  },
  {
    state: 'Utah', abbr: 'UT', slug: 'utah',
    airports: [
      { name: 'Salt Lake City', code: 'SLC', state: 'Utah', stateAbbr: 'UT', stateSlug: 'utah', slug: 'slc', vendorCount: 0 },
    ],
  },
  {
    state: 'Vermont', abbr: 'VT', slug: 'vermont',
    airports: [
      { name: 'Burlington', code: 'BTV', state: 'Vermont', stateAbbr: 'VT', stateSlug: 'vermont', slug: 'btv', vendorCount: 0 },
      { name: 'Montpelier', code: 'MPV', state: 'Vermont', stateAbbr: 'VT', stateSlug: 'vermont', slug: 'mpv', vendorCount: 0 },
      { name: 'Rutland', code: 'RUT', state: 'Vermont', stateAbbr: 'VT', stateSlug: 'vermont', slug: 'rut', vendorCount: 0 },
    ],
  },
  {
    state: 'Virginia', abbr: 'VA', slug: 'virginia',
    airports: [
      { name: 'Dulles', code: 'IAD', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'virginia', slug: 'iad-va', vendorCount: 0 },
      { name: 'Newport News', code: 'PHF', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'virginia', slug: 'phf', vendorCount: 0 },
      { name: 'Norfolk', code: 'ORF', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'virginia', slug: 'orf', vendorCount: 0 },
      { name: 'Richmond', code: 'RIC', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'virginia', slug: 'ric', vendorCount: 0 },
      { name: 'Roanoke', code: 'ROA', state: 'Virginia', stateAbbr: 'VA', stateSlug: 'virginia', slug: 'roa', vendorCount: 0 },
    ],
  },
  {
    state: 'Washington', abbr: 'WA', slug: 'washington',
    airports: [
      { name: 'Pasco Tri-Cities Airport', code: 'PSC', state: 'Washington', stateAbbr: 'WA', stateSlug: 'washington', slug: 'psc', vendorCount: 0 },
      { name: 'Seattle Tacoma International Airport', code: 'SEA', state: 'Washington', stateAbbr: 'WA', stateSlug: 'washington', slug: 'sea', vendorCount: 0 },
      { name: 'Spokane International Airport', code: 'GEG', state: 'Washington', stateAbbr: 'WA', stateSlug: 'washington', slug: 'geg', vendorCount: 0 },
    ],
  },
  {
    state: 'West Virginia', abbr: 'WV', slug: 'west-virginia',
    airports: [
      { name: 'Charleston', code: 'CRW', state: 'West Virginia', stateAbbr: 'WV', stateSlug: 'west-virginia', slug: 'crw', vendorCount: 0 },
      { name: 'Clarksburg', code: 'CKB', state: 'West Virginia', stateAbbr: 'WV', stateSlug: 'west-virginia', slug: 'ckb', vendorCount: 0 },
      { name: 'Huntington Tri-State Airport', code: 'HTS', state: 'West Virginia', stateAbbr: 'WV', stateSlug: 'west-virginia', slug: 'hts', vendorCount: 0 },
    ],
  },
  {
    state: 'Wisconsin', abbr: 'WI', slug: 'wisconsin',
    airports: [
      { name: 'Green Bay', code: 'GRB', state: 'Wisconsin', stateAbbr: 'WI', stateSlug: 'wisconsin', slug: 'grb', vendorCount: 0 },
      { name: 'Madison', code: 'MSN', state: 'Wisconsin', stateAbbr: 'WI', stateSlug: 'wisconsin', slug: 'msn', vendorCount: 0 },
      { name: 'Milwaukee', code: 'MKE', state: 'Wisconsin', stateAbbr: 'WI', stateSlug: 'wisconsin', slug: 'mke', vendorCount: 0 },
    ],
  },
  {
    state: 'Wyoming', abbr: 'WY', slug: 'wyoming',
    airports: [
      { name: 'Casper', code: 'CPR', state: 'Wyoming', stateAbbr: 'WY', stateSlug: 'wyoming', slug: 'cpr', vendorCount: 0 },
      { name: 'Cheyenne', code: 'CYS', state: 'Wyoming', stateAbbr: 'WY', stateSlug: 'wyoming', slug: 'cys', vendorCount: 0 },
      { name: 'Jackson Hole', code: 'JAC', state: 'Wyoming', stateAbbr: 'WY', stateSlug: 'wyoming', slug: 'jac', vendorCount: 0 },
      { name: 'Rock Springs', code: 'RKS', state: 'Wyoming', stateAbbr: 'WY', stateSlug: 'wyoming', slug: 'rks', vendorCount: 0 },
    ],
  },
]

// Flat list for easy iteration
export const ALL_AIRPORTS: AirportCity[] = AIRPORT_CITIES.flatMap(s => s.airports)

// Alias used by dynamic route pages
export const TOP_CITIES: AirportCity[] = ALL_AIRPORTS

// ── Popular Cities for Homepage Cards (curated top 20) ──────────────────────
export interface PopularCity {
  name: string
  code: string
  state: string
  stateSlug: string
  slug: string
}

export const POPULAR_CITIES: PopularCity[] = [
  { name: 'New York', code: 'JFK', state: 'New York', stateSlug: 'new-york', slug: 'jfk' },
  { name: 'Los Angeles', code: 'LAX', state: 'California', stateSlug: 'california', slug: 'lax' },
  { name: 'Chicago', code: 'ORD', state: 'Illinois', stateSlug: 'illinois', slug: 'ord' },
  { name: 'Miami', code: 'MIA', state: 'Florida', stateSlug: 'florida', slug: 'mia' },
  { name: 'Nashville', code: 'BNA', state: 'Tennessee', stateSlug: 'tennessee', slug: 'bna' },
  { name: 'Atlanta', code: 'ATL', state: 'Georgia', stateSlug: 'georgia', slug: 'atl' },
  { name: 'Denver', code: 'DEN', state: 'Colorado', stateSlug: 'colorado', slug: 'den' },
  { name: 'Dallas', code: 'DFW', state: 'Texas', stateSlug: 'texas', slug: 'dfw' },
  { name: 'San Francisco', code: 'SFO', state: 'California', stateSlug: 'california', slug: 'sfo' },
  { name: 'Phoenix', code: 'PHX', state: 'Arizona', stateSlug: 'arizona', slug: 'phx' },
  { name: 'Seattle', code: 'SEA', state: 'Washington', stateSlug: 'washington', slug: 'sea' },
  { name: 'Boston', code: 'BOS', state: 'Massachusetts', stateSlug: 'massachusetts', slug: 'bos' },
  { name: 'Las Vegas', code: 'LAS', state: 'Nevada', stateSlug: 'nevada', slug: 'las' },
  { name: 'Houston', code: 'IAH', state: 'Texas', stateSlug: 'texas', slug: 'iah' },
  { name: 'Orlando', code: 'MCO', state: 'Florida', stateSlug: 'florida', slug: 'mco' },
  { name: 'Detroit', code: 'DTW', state: 'Michigan', stateSlug: 'michigan', slug: 'dtw' },
  { name: 'Minneapolis', code: 'MSP', state: 'Minnesota', stateSlug: 'minnesota', slug: 'msp' },
  { name: 'Philadelphia', code: 'PHL', state: 'Pennsylvania', stateSlug: 'pennsylvania', slug: 'phl' },
  { name: 'Charlotte', code: 'CLT', state: 'North Carolina', stateSlug: 'north-carolina', slug: 'clt' },
  { name: 'Milwaukee', code: 'MKE', state: 'Wisconsin', stateSlug: 'wisconsin', slug: 'mke' },
]

// ── How It Works Steps ─────────────────────────────────────────────────────
export const PLANNER_STEPS = [
  { step: 1, title: 'Search', description: 'Find photographers, venues, caterers, DJs and more by city and category.' },
  { step: 2, title: 'Book', description: 'Compare vendors, check availability, and book multiple vendors in one cart.' },
  { step: 3, title: 'Manage', description: 'Coordinate every detail from contracts to payments all in one place.' },
]

export const VENDOR_STEPS = [
  { step: 1, title: 'List', description: 'Create your free profile with portfolio, packages, and availability.' },
  { step: 2, title: 'Get Booked', description: 'Receive inquiries, send quotes, and confirm bookings through the platform.' },
  { step: 3, title: 'Get Paid', description: 'Secure payments with Stripe. Deposits upfront, full payout after the event.' },
]

// ── 50 US States (+ DC) for National Seeding ──────────────────────────────
export const US_STATES = [
  { name: 'Alabama', abbr: 'AL', slug: 'alabama', vendorCount: 0 },
  { name: 'Alaska', abbr: 'AK', slug: 'alaska', vendorCount: 0 },
  { name: 'Arizona', abbr: 'AZ', slug: 'arizona', vendorCount: 0 },
  { name: 'Arkansas', abbr: 'AR', slug: 'arkansas', vendorCount: 0 },
  { name: 'California', abbr: 'CA', slug: 'california', vendorCount: 0 },
  { name: 'Colorado', abbr: 'CO', slug: 'colorado', vendorCount: 0 },
  { name: 'Connecticut', abbr: 'CT', slug: 'connecticut', vendorCount: 0 },
  { name: 'Delaware', abbr: 'DE', slug: 'delaware', vendorCount: 0 },
  { name: 'District of Columbia', abbr: 'DC', slug: 'district-of-columbia', vendorCount: 0 },
  { name: 'Florida', abbr: 'FL', slug: 'florida', vendorCount: 0 },
  { name: 'Georgia', abbr: 'GA', slug: 'georgia', vendorCount: 0 },
  { name: 'Hawaii', abbr: 'HI', slug: 'hawaii', vendorCount: 0 },
  { name: 'Idaho', abbr: 'ID', slug: 'idaho', vendorCount: 0 },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois', vendorCount: 0 },
  { name: 'Indiana', abbr: 'IN', slug: 'indiana', vendorCount: 0 },
  { name: 'Iowa', abbr: 'IA', slug: 'iowa', vendorCount: 0 },
  { name: 'Kansas', abbr: 'KS', slug: 'kansas', vendorCount: 0 },
  { name: 'Kentucky', abbr: 'KY', slug: 'kentucky', vendorCount: 0 },
  { name: 'Louisiana', abbr: 'LA', slug: 'louisiana', vendorCount: 0 },
  { name: 'Maine', abbr: 'ME', slug: 'maine', vendorCount: 0 },
  { name: 'Maryland', abbr: 'MD', slug: 'maryland', vendorCount: 0 },
  { name: 'Massachusetts', abbr: 'MA', slug: 'massachusetts', vendorCount: 0 },
  { name: 'Michigan', abbr: 'MI', slug: 'michigan', vendorCount: 0 },
  { name: 'Minnesota', abbr: 'MN', slug: 'minnesota', vendorCount: 0 },
  { name: 'Mississippi', abbr: 'MS', slug: 'mississippi', vendorCount: 0 },
  { name: 'Missouri', abbr: 'MO', slug: 'missouri', vendorCount: 0 },
  { name: 'Montana', abbr: 'MT', slug: 'montana', vendorCount: 0 },
  { name: 'Nebraska', abbr: 'NE', slug: 'nebraska', vendorCount: 0 },
  { name: 'Nevada', abbr: 'NV', slug: 'nevada', vendorCount: 0 },
  { name: 'New Hampshire', abbr: 'NH', slug: 'new-hampshire', vendorCount: 0 },
  { name: 'New Jersey', abbr: 'NJ', slug: 'new-jersey', vendorCount: 0 },
  { name: 'New Mexico', abbr: 'NM', slug: 'new-mexico', vendorCount: 0 },
  { name: 'New York', abbr: 'NY', slug: 'new-york', vendorCount: 0 },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina', vendorCount: 0 },
  { name: 'North Dakota', abbr: 'ND', slug: 'north-dakota', vendorCount: 0 },
  { name: 'Ohio', abbr: 'OH', slug: 'ohio', vendorCount: 0 },
  { name: 'Oklahoma', abbr: 'OK', slug: 'oklahoma', vendorCount: 0 },
  { name: 'Oregon', abbr: 'OR', slug: 'oregon', vendorCount: 0 },
  { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania', vendorCount: 0 },
  { name: 'Rhode Island', abbr: 'RI', slug: 'rhode-island', vendorCount: 0 },
  { name: 'South Carolina', abbr: 'SC', slug: 'south-carolina', vendorCount: 0 },
  { name: 'South Dakota', abbr: 'SD', slug: 'south-dakota', vendorCount: 0 },
  { name: 'Tennessee', abbr: 'TN', slug: 'tennessee', vendorCount: 0 },
  { name: 'Texas', abbr: 'TX', slug: 'texas', vendorCount: 0 },
  { name: 'Utah', abbr: 'UT', slug: 'utah', vendorCount: 0 },
  { name: 'Vermont', abbr: 'VT', slug: 'vermont', vendorCount: 0 },
  { name: 'Virginia', abbr: 'VA', slug: 'virginia', vendorCount: 0 },
  { name: 'Washington', abbr: 'WA', slug: 'washington', vendorCount: 0 },
  { name: 'West Virginia', abbr: 'WV', slug: 'west-virginia', vendorCount: 0 },
  { name: 'Wisconsin', abbr: 'WI', slug: 'wisconsin', vendorCount: 0 },
  { name: 'Wyoming', abbr: 'WY', slug: 'wyoming', vendorCount: 0 },
] as const

// ── Helper Functions ───────────────────────────────────────────────────────
export function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find(v => v.slug === slug)
}

export function getTagline(subCategory: string, city: string, state: string): string {
  return `${subCategory} in ${city}, ${state}`
}

export function getPlaceholderSvg(verticalSlug: string): string {
  const map: Record<string, string> = {
    'venues-spaces': '/placeholders/venues.svg',
    'event-planning': '/placeholders/planning.svg',
    'catering-food': '/placeholders/catering.svg',
    'entertainment': '/placeholders/entertainment.svg',
    'production-tech': '/placeholders/production.svg',
    'decor-rentals': '/placeholders/decor.svg',
    'beauty-attire': '/placeholders/beauty.svg',
    'travel-lodging': '/placeholders/travel.svg',
  }
  return map[verticalSlug] ?? '/placeholders/venues.svg'
}
