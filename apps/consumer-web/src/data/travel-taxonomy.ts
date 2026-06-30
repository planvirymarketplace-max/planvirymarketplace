/**
 * Travel Taxonomy
 *
 * Data for the Planviry Travel section (Booking.com/Expedia-style).
 * Six top-level categories: Stays, Flights, Cars, Packages, Things to do, Cruises.
 * Includes popular US destinations, property types, amenities, and mock property data.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface TravelCategory {
  name: string
  slug: string
  icon: string // lucide-react icon name
  description: string
}

export interface Destination {
  name: string
  slug: string
  state: string
  stateCode: string
  tagline: string
}

export interface PropertyType {
  name: string
  slug: string
  description: string
}

export interface Amenity {
  name: string
  slug: string
  icon: string // lucide-react icon name
}

export interface TravelProperty {
  id: string
  slug: string
  title: string
  type: string // matches PropertyType.name
  typeSlug: string
  city: string
  state: string
  stateCode: string
  citySlug: string
  price_per_night: number
  original_price_per_night?: number
  rating: number // 0-10 scale (Booking.com style)
  review_count: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  image_url: string
  gradient: string // tailwind gradient classes for placeholder
  description: string
  short_description: string
  amenities: string[]
  highlights: string[]
  host_name: string
  host_rating: number
  host_since: string
  distance_to_beach?: string
  distance_to_center?: string
  is_loved_by_guests: boolean
  rooms: { name: string; beds: string; description: string }[]
  house_rules: { label: string; value: string }[]
  reviews_breakdown: { rating: number; count: number }[]
}

// ── Travel Categories (Expedia-style top nav) ──────────────────────────────

export const TRAVEL_CATEGORIES: TravelCategory[] = [
  {
    name: 'Stays',
    slug: 'stays',
    icon: 'Bed',
    description: 'Hotels, resorts, vacation homes, and more',
  },
  {
    name: 'Flights',
    slug: 'flights',
    icon: 'Plane',
    description: 'Domestic and international airfare',
  },
  {
    name: 'Cars',
    slug: 'cars',
    icon: 'Car',
    description: 'Airport and city car rentals',
  },
  {
    name: 'Packages',
    slug: 'packages',
    icon: 'Package',
    description: 'Bundle flight + hotel and save',
  },
  {
    name: 'Things to do',
    slug: 'things-to-do',
    icon: 'Compass',
    description: 'Tours, attractions, and experiences',
  },
  {
    name: 'Cruises',
    slug: 'cruises',
    icon: 'Ship',
    description: 'Ocean, river, and luxury cruises',
  },
]

// ── Popular Destinations (12 US cities) ─────────────────────────────────────

export const POPULAR_DESTINATIONS: Destination[] = [
  { name: 'New York', slug: 'new-york', state: 'New York', stateCode: 'NY', tagline: 'The Big Apple' },
  { name: 'Los Angeles', slug: 'los-angeles', state: 'California', stateCode: 'CA', tagline: 'Hollywood & Beaches' },
  { name: 'Chicago', slug: 'chicago', state: 'Illinois', stateCode: 'IL', tagline: 'Architecture & Food' },
  { name: 'Miami', slug: 'miami', state: 'Florida', stateCode: 'FL', tagline: 'Beach & Nightlife' },
  { name: 'Las Vegas', slug: 'las-vegas', state: 'Nevada', stateCode: 'NV', tagline: 'Entertainment Capital' },
  { name: 'Orlando', slug: 'orlando', state: 'Florida', stateCode: 'FL', tagline: 'Theme Park Central' },
  { name: 'San Francisco', slug: 'san-francisco', state: 'California', stateCode: 'CA', tagline: 'Bay & Golden Gate' },
  { name: 'Seattle', slug: 'seattle', state: 'Washington', stateCode: 'WA', tagline: 'Emerald City' },
  { name: 'Nashville', slug: 'nashville', state: 'Tennessee', stateCode: 'TN', tagline: 'Music City' },
  { name: 'New Orleans', slug: 'new-orleans', state: 'Louisiana', stateCode: 'LA', tagline: 'Culture & Festivals' },
  { name: 'Denver', slug: 'denver', state: 'Colorado', stateCode: 'CO', tagline: 'Mile High City' },
  { name: 'Austin', slug: 'austin', state: 'Texas', stateCode: 'TX', tagline: 'Live Music Scene' },
]

// ── Property Types ──────────────────────────────────────────────────────────

export const PROPERTY_TYPES: PropertyType[] = [
  { name: 'Hotel', slug: 'hotel', description: 'Full-service properties with daily housekeeping' },
  { name: 'Resort', slug: 'resort', description: 'Self-contained properties with pools, dining, and activities' },
  { name: 'Vacation Home', slug: 'vacation-home', description: 'Whole houses for families and groups' },
  { name: 'Apartment', slug: 'apartment', description: 'Self-catering units in residential buildings' },
  { name: 'Villa', slug: 'villa', description: 'Luxury standalone homes with private amenities' },
  { name: 'Cabin', slug: 'cabin', description: 'Rustic getaways in mountain and forest settings' },
  { name: 'Cottage', slug: 'cottage', description: 'Cozy small homes, often near lakes or coast' },
  { name: 'Bed & Breakfast', slug: 'bed-and-breakfast', description: 'Intimate inns with included morning meals' },
]

// ── Amenities ───────────────────────────────────────────────────────────────

export const AMENITIES: Amenity[] = [
  { name: 'Free WiFi', slug: 'free-wifi', icon: 'Wifi' },
  { name: 'Pool', slug: 'pool', icon: 'Waves' },
  { name: 'Free parking', slug: 'free-parking', icon: 'Car' },
  { name: 'Kitchen', slug: 'kitchen', icon: 'UtensilsCrossed' },
  { name: 'Air conditioning', slug: 'air-conditioning', icon: 'Snowflake' },
  { name: 'Washer/Dryer', slug: 'washer-dryer', icon: 'Shirt' },
  { name: 'TV', slug: 'tv', icon: 'Tv' },
  { name: 'Hot tub', slug: 'hot-tub', icon: 'Thermometer' },
  { name: 'Gym', slug: 'gym', icon: 'Dumbbell' },
  { name: 'Pet-friendly', slug: 'pet-friendly', icon: 'PawPrint' },
  { name: 'Beach access', slug: 'beach-access', icon: 'Umbrella' },
  { name: 'Fireplace', slug: 'fireplace', icon: 'Flame' },
]

// ── Mock Property Data (8 properties) ──────────────────────────────────────

export const MOCK_PROPERTIES: TravelProperty[] = [
  {
    id: '1',
    slug: 'oceanfront-miami-beach-resort',
    title: 'Oceanfront Miami Beach Resort',
    type: 'Resort',
    typeSlug: 'resort',
    city: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    citySlug: 'miami',
    price_per_night: 289,
    original_price_per_night: 429,
    rating: 9.4,
    review_count: 1284,
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-sky-400 via-cyan-400 to-teal-400',
    short_description: 'Beachfront resort with ocean-view pool, spa, and direct sand access on South Beach.',
    description:
      'Wake up to the sound of waves at this beachfront Miami resort. Every room features a private balcony with sweeping Atlantic views, while the property offers a lagoon-style pool, full-service spa, two on-site restaurants, and direct access to South Beach. Located steps from Ocean Drive and the Art Deco Historic District, this is the perfect base for couples and families looking to soak up the Miami sun.',
    amenities: ['Free WiFi', 'Pool', 'Free parking', 'Air conditioning', 'Gym', 'Beach access', 'Hot tub', 'TV'],
    highlights: [
      'Direct beach access - steps from the sand',
      'Ocean-view pool with cabana service',
      'Full-service spa and wellness center',
      'Two on-site restaurants and a rooftop bar',
      'Walking distance to Ocean Drive and Art Deco District',
    ],
    host_name: 'Miami Coastal Hospitality Group',
    host_rating: 9.8,
    host_since: '2014',
    distance_to_beach: 'On the beach',
    distance_to_center: '1.2 mi to city center',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Ocean View King', beds: '1 king bed', description: 'Sleeps 2, balcony, 350 sq ft' },
      { name: 'Ocean Suite', beds: '1 king + 1 sofa bed', description: 'Sleeps 3, separate living area, 550 sq ft' },
      { name: 'Beachfront Bungalow', beds: '1 king + 2 twins', description: 'Sleeps 4, ground floor, 700 sq ft' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 4:00 PM' },
      { label: 'Check-out', value: 'Before 11:00 AM' },
      { label: 'No smoking', value: 'Property is smoke-free' },
      { label: 'Pets', value: 'Service animals welcome' },
      { label: 'Parties', value: 'No parties or events' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 612 },
      { rating: 9, count: 421 },
      { rating: 8, count: 188 },
      { rating: 7, count: 42 },
      { rating: 6, count: 21 },
    ],
  },
  {
    id: '2',
    slug: 'downtown-nashville-loft',
    title: 'Downtown Nashville Music Loft',
    type: 'Apartment',
    typeSlug: 'apartment',
    city: 'Nashville',
    state: 'Tennessee',
    stateCode: 'TN',
    citySlug: 'nashville',
    price_per_night: 174,
    original_price_per_night: 239,
    rating: 9.7,
    review_count: 842,
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 4,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-rose-400 via-pink-400 to-orange-400',
    short_description: 'Stylish two-bedroom loft in the heart of Broadway, walking distance to honky-tonks.',
    description:
      'A music-lovers retreat in the heart of downtown Nashville. This open-concept loft features exposed brick, hardwood floors, and a wall of windows overlooking Broadway. Two bedrooms with king beds, a fully stocked kitchen, and a living area with a record player and vintage Nashville posters. Walk out the door to the honky-tonks on Lower Broad, the Ryman Auditorium, and the Country Music Hall of Fame.',
    amenities: ['Free WiFi', 'Kitchen', 'Air conditioning', 'Washer/Dryer', 'TV', 'Free parking'],
    highlights: [
      'Steps from Broadway honky-tonks and live music',
      'Walking distance to Ryman Auditorium',
      'Record player and curated Nashville vinyl collection',
      'Full kitchen with premium appliances',
      'Exposed brick and industrial-chic design',
    ],
    host_name: 'Sarah & Marcus',
    host_rating: 9.9,
    host_since: '2017',
    distance_to_center: 'In the city center',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Primary Bedroom', beds: '1 king bed', description: 'Sleeps 2, city view' },
      { name: 'Second Bedroom', beds: '1 queen bed', description: 'Sleeps 2, quiet rear-facing' },
      { name: 'Living Area', beds: '1 sofa bed', description: 'Sleeps 1, optional' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 3:00 PM' },
      { label: 'Check-out', value: 'Before 10:00 AM' },
      { label: 'No smoking', value: 'No smoking inside' },
      { label: 'Pets', value: 'Pet-friendly - dogs up to 50 lbs' },
      { label: 'Noise', value: 'Quiet hours after 10 PM' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 521 },
      { rating: 9, count: 248 },
      { rating: 8, count: 58 },
      { rating: 7, count: 10 },
      { rating: 6, count: 5 },
    ],
  },
  {
    id: '3',
    slug: 'aspen-mountain-cabin-retreat',
    title: 'Aspen Mountain Cabin Retreat',
    type: 'Cabin',
    typeSlug: 'cabin',
    city: 'Denver',
    state: 'Colorado',
    stateCode: 'CO',
    citySlug: 'denver',
    price_per_night: 312,
    rating: 9.2,
    review_count: 467,
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    short_description: 'Three-bedroom log cabin in the Rockies with fireplace, hot tub, and mountain views.',
    description:
      'Escape to this authentic log cabin tucked into the Colorado Rockies. Three bedrooms, two full baths, a stone fireplace, and a private hot tub on the deck overlooking the continental divide. The kitchen is fully stocked for family meals, and the living room has a wood stove and oversized sectional. A short drive to skiing, hiking trails, and downtown Denver.',
    amenities: ['Free WiFi', 'Free parking', 'Kitchen', 'Fireplace', 'Hot tub', 'Washer/Dryer', 'TV', 'Pet-friendly'],
    highlights: [
      'Private hot tub with mountain views',
      'Stone wood-burning fireplace',
      'Three acres of private forest',
      'Pet-friendly - dogs welcome free of charge',
      'Fifteen minutes from ski resorts',
    ],
    host_name: 'Mountain Haven Stays',
    host_rating: 9.6,
    host_since: '2015',
    distance_to_center: '22 mi to downtown Denver',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Primary Suite', beds: '1 king bed', description: 'Sleeps 2, en-suite bath, mountain view' },
      { name: 'Bunk Room', beds: '2 twin-over-full bunks', description: 'Sleeps 4, kids favorite' },
      { name: 'Loft Bedroom', beds: '1 queen bed', description: 'Sleeps 2, vaulted ceilings' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 4:00 PM' },
      { label: 'Check-out', value: 'Before 11:00 AM' },
      { label: 'No smoking', value: 'No smoking on premises' },
      { label: 'Pets', value: 'Dogs welcome - up to 2 per stay' },
      { label: 'Fire pit', value: 'Allowed with provided firewood only' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 198 },
      { rating: 9, count: 167 },
      { rating: 8, count: 72 },
      { rating: 7, count: 22 },
      { rating: 6, count: 8 },
    ],
  },
  {
    id: '4',
    slug: 'manhattan-boutique-hotel',
    title: 'Manhattan Boutique Hotel',
    type: 'Hotel',
    typeSlug: 'hotel',
    city: 'New York',
    state: 'New York',
    stateCode: 'NY',
    citySlug: 'new-york',
    price_per_night: 348,
    original_price_per_night: 459,
    rating: 9.0,
    review_count: 2104,
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-slate-600 via-gray-700 to-zinc-800',
    short_description: 'Mid-century boutique hotel in Midtown Manhattan, steps from Times Square.',
    description:
      'A design-forward boutique hotel in the heart of Midtown Manhattan. Each room is individually curated with mid-century furniture, premium linens, and locally commissioned art. The hotel features a rooftop terrace with skyline views, a 24-hour fitness center, and a lobby coffee bar serving pastries from a Michelin-starred bakery. Walking distance to Times Square, Bryant Park, and Rockefeller Center.',
    amenities: ['Free WiFi', 'Gym', 'Air conditioning', 'TV', 'Hot tub'],
    highlights: [
      'Rooftop terrace with Manhattan skyline views',
      'Walking distance to Times Square',
      '24-hour fitness center',
      'Individually designed rooms with curated art',
      'Michelin-starred bakery pastries in lobby',
    ],
    host_name: 'The Manhattan Collection',
    host_rating: 9.4,
    host_since: '2012',
    distance_to_center: 'In Midtown Manhattan',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Deluxe King', beds: '1 king bed', description: 'Sleeps 2, 280 sq ft, city view' },
      { name: 'Corner Suite', beds: '1 king bed', description: 'Sleeps 2, 450 sq ft, skyline view' },
      { name: 'Twin Room', beds: '2 twin beds', description: 'Sleeps 2, 240 sq ft' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 3:00 PM' },
      { label: 'Check-out', value: 'Before 12:00 PM' },
      { label: 'No smoking', value: 'Smoke-free property' },
      { label: 'Pets', value: 'No pets, service animals only' },
      { label: 'Quiet hours', value: '11 PM - 7 AM' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 824 },
      { rating: 9, count: 798 },
      { rating: 8, count: 354 },
      { rating: 7, count: 92 },
      { rating: 6, count: 36 },
    ],
  },
  {
    id: '5',
    slug: 'french-quarter-villa',
    title: 'French Quarter Creole Villa',
    type: 'Villa',
    typeSlug: 'villa',
    city: 'New Orleans',
    state: 'Louisiana',
    stateCode: 'LA',
    citySlug: 'new-orleans',
    price_per_night: 268,
    original_price_per_night: 348,
    rating: 9.6,
    review_count: 593,
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    short_description: 'Restored 1840s Creole villa with courtyard pool in the French Quarter.',
    description:
      'A meticulously restored 1840s Creole townhouse in the heart of the French Quarter. Four bedrooms across three floors, a private courtyard with a plunge pool, and a rooftop terrace overlooking the St. Louis Cathedral. Original heart-pine floors, fourteen-foot ceilings, and a chef kitchen with commercial appliances. Walking distance to Bourbon Street, Jackson Square, and Cafe du Monde.',
    amenities: ['Free WiFi', 'Pool', 'Kitchen', 'Air conditioning', 'Washer/Dryer', 'TV', 'Free parking', 'Fireplace'],
    highlights: [
      'Private courtyard with plunge pool',
      'Rooftop terrace with cathedral views',
      'Original 1840s architectural details',
      'Walking distance to Jackson Square',
      'Chef kitchen with commercial appliances',
    ],
    host_name: 'Creole Heritage Stays',
    host_rating: 9.7,
    host_since: '2016',
    distance_to_center: 'In the French Quarter',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Master Suite', beds: '1 king bed', description: 'Sleeps 2, en-suite, balcony' },
      { name: 'Garden Room', beds: '1 queen bed', description: 'Sleeps 2, courtyard view' },
      { name: 'Attic Loft', beds: '2 full beds', description: 'Sleeps 4, vaulted ceilings' },
      { name: 'Carriage House', beds: '1 king + 1 twin', description: 'Sleeps 3, separate entrance' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 4:00 PM' },
      { label: 'Check-out', value: 'Before 11:00 AM' },
      { label: 'No smoking', value: 'No smoking inside' },
      { label: 'Pets', value: 'Pet-friendly with prior notice' },
      { label: 'Events', value: 'Small gatherings allowed with approval' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 312 },
      { rating: 9, count: 198 },
      { rating: 8, count: 64 },
      { rating: 7, count: 14 },
      { rating: 6, count: 5 },
    ],
  },
  {
    id: '6',
    slug: 'hollywood-hills-vacation-home',
    title: 'Hollywood Hills Vacation Home',
    type: 'Vacation Home',
    typeSlug: 'vacation-home',
    city: 'Los Angeles',
    state: 'California',
    stateCode: 'CA',
    citySlug: 'los-angeles',
    price_per_night: 425,
    rating: 9.3,
    review_count: 318,
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-fuchsia-500 via-purple-500 to-violet-500',
    short_description: 'Modernist hillside home with infinity pool, hot tub, and sign views.',
    description:
      'A sleek modernist home perched in the Hollywood Hills with floor-to-ceiling glass framing downtown LA and the Hollywood sign. Four bedrooms, an infinity-edge pool, a separate hot tub, and a sun deck with lounge seating. The kitchen features Italian cabinetry and a wine fridge, and the home theater has a 120-inch screen. Private gated parking for two vehicles.',
    amenities: ['Free WiFi', 'Pool', 'Hot tub', 'Kitchen', 'Air conditioning', 'Washer/Dryer', 'TV', 'Free parking'],
    highlights: [
      'Infinity pool with Hollywood sign views',
      'Home theater with 120-inch screen',
      'Floor-to-ceiling walls of glass',
      'Private gated driveway',
      'Walking distance to Runyon Canyon',
    ],
    host_name: 'LA Luxury Stays',
    host_rating: 9.5,
    host_since: '2018',
    distance_to_center: '6 mi to downtown LA',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Primary Suite', beds: '1 king bed', description: 'Sleeps 2, en-suite, city view' },
      { name: 'Pool Suite', beds: '1 king bed', description: 'Sleeps 2, pool deck access' },
      { name: 'Garden Room', beds: '1 queen bed', description: 'Sleeps 2, garden view' },
      { name: 'Guest Bunk', beds: '2 twin bunks', description: 'Sleeps 4, kids room' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 4:00 PM' },
      { label: 'Check-out', value: 'Before 10:00 AM' },
      { label: 'No smoking', value: 'Non-smoking property' },
      { label: 'Pets', value: 'No pets allowed' },
      { label: 'Parties', value: 'No parties or events' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 142 },
      { rating: 9, count: 112 },
      { rating: 8, count: 48 },
      { rating: 7, count: 12 },
      { rating: 6, count: 4 },
    ],
  },
  {
    id: '7',
    slug: 'seattle-waterfront-cottage',
    title: 'Seattle Waterfront Cottage',
    type: 'Cottage',
    typeSlug: 'cottage',
    city: 'Seattle',
    state: 'Washington',
    stateCode: 'WA',
    citySlug: 'seattle',
    price_per_night: 198,
    original_price_per_night: 258,
    rating: 9.4,
    review_count: 412,
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 4,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    short_description: 'Cozy two-bedroom cottage on Puget Sound with private dock and mountain views.',
    description:
      'A waterfront cottage on Puget Sound with a private dock, fire pit, and unobstructed views of the Olympic Mountains. Two bedrooms, a wood-burning stove, and a sunroom with a writing desk. The kitchen is stocked for simple meals, and the dock is perfect for swimming, crabbing, or launching a kayak. A thirty-minute drive to downtown Seattle and Pike Place Market.',
    amenities: ['Free WiFi', 'Kitchen', 'Fireplace', 'Free parking', 'Washer/Dryer', 'TV', 'Pet-friendly'],
    highlights: [
      'Private dock on Puget Sound',
      'Unobstructed Olympic Mountain views',
      'Wood-burning stove and fire pit',
      'Kayak launch from the dock',
      'Pet-friendly with no fee',
    ],
    host_name: 'Pacific Northwest Retreats',
    host_rating: 9.6,
    host_since: '2019',
    distance_to_center: '14 mi to downtown Seattle',
    distance_to_beach: 'On the water',
    is_loved_by_guests: true,
    rooms: [
      { name: 'Water Bedroom', beds: '1 queen bed', description: 'Sleeps 2, sound view' },
      { name: 'Garden Bedroom', beds: '2 twin beds', description: 'Sleeps 2, garden view' },
      { name: 'Sunroom', beds: '1 daybed', description: 'Sleeps 1, optional' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 3:00 PM' },
      { label: 'Check-out', value: 'Before 11:00 AM' },
      { label: 'No smoking', value: 'No smoking on property' },
      { label: 'Pets', value: 'Dogs welcome - no fee' },
      { label: 'Dock use', value: 'At guests own risk' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 174 },
      { rating: 9, count: 152 },
      { rating: 8, count: 64 },
      { rating: 7, count: 16 },
      { rating: 6, count: 6 },
    ],
  },
  {
    id: '8',
    slug: 'strip-view-las-vegas-suite',
    title: 'Strip View Las Vegas Suite',
    type: 'Hotel',
    typeSlug: 'hotel',
    city: 'Las Vegas',
    state: 'Nevada',
    stateCode: 'NV',
    citySlug: 'las-vegas',
    price_per_night: 219,
    original_price_per_night: 329,
    rating: 8.9,
    review_count: 1763,
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 3,
    image_url: '/images/travel/placeholder.svg',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    short_description: 'High-floor suite with panoramic Strip views, kitchenette, and resort pool access.',
    description:
      'A high-floor suite on the 42nd level of a premier Strip resort, with floor-to-ceiling windows framing the Bellagio fountains and the Las Vegas skyline. The suite features a king bed, separate sitting area with a sofa bed, kitchenette, and marble bathroom with a soaking tub. Guests have access to the resorts four pools, full-service spa, ten restaurants, and a casino.',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Air conditioning', 'TV', 'Hot tub'],
    highlights: [
      '42nd-floor panoramic Strip views',
      'Access to four resort pools',
      'Full-service spa and wellness floor',
      'Walking distance to Bellagio and Cosmopolitan',
      'Kitchenette with mini-fridge and microwave',
    ],
    host_name: 'Vegas Tower Suites',
    host_rating: 9.2,
    host_since: '2013',
    distance_to_center: 'On the Las Vegas Strip',
    is_loved_by_guests: false,
    rooms: [
      { name: 'Strip View Suite', beds: '1 king + 1 sofa bed', description: 'Sleeps 3, 580 sq ft, high floor' },
      { name: 'Fountain View Suite', beds: '1 king bed', description: 'Sleeps 2, Bellagio fountain view' },
      { name: 'Penthouse', beds: '1 king + 2 twins', description: 'Sleeps 4, 1200 sq ft, butler service' },
    ],
    house_rules: [
      { label: 'Check-in', value: 'After 4:00 PM' },
      { label: 'Check-out', value: 'Before 11:00 AM' },
      { label: 'No smoking', value: 'Non-smoking' },
      { label: 'Pets', value: 'No pets allowed' },
      { label: 'Min age', value: '21+ to check in' },
    ],
    reviews_breakdown: [
      { rating: 10, count: 524 },
      { rating: 9, count: 612 },
      { rating: 8, count: 421 },
      { rating: 7, count: 158 },
      { rating: 6, count: 48 },
    ],
  },
]

// ── Helper Functions ────────────────────────────────────────────────────────

export function getDestinationBySlug(slug: string): Destination | undefined {
  return POPULAR_DESTINATIONS.find((d) => d.slug === slug)
}

export function getPropertyBySlug(slug: string): TravelProperty | undefined {
  return MOCK_PROPERTIES.find((p) => p.slug === slug)
}

export function getPropertiesByCity(citySlug: string): TravelProperty[] {
  return MOCK_PROPERTIES.filter((p) => p.citySlug === citySlug)
}

export function getCategoryBySlug(slug: string): TravelCategory | undefined {
  return TRAVEL_CATEGORIES.find((c) => c.slug === slug)
}

export function getPropertyTypeBySlug(slug: string): PropertyType | undefined {
  return PROPERTY_TYPES.find((t) => t.slug === slug)
}

export function getAmenityBySlug(slug: string): Amenity | undefined {
  return AMENITIES.find((a) => a.slug === slug)
}

export function getFeaturedProperties(limit = 6): TravelProperty[] {
  return MOCK_PROPERTIES.slice(0, limit)
}

export function searchProperties(query: {
  destination?: string
  checkIn?: string
  checkOut?: string
  travelers?: string
  category?: string
}): TravelProperty[] {
  let results = [...MOCK_PROPERTIES]
  if (query.destination) {
    const q = query.destination.toLowerCase().trim()
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.citySlug.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    )
  }
  // Category filter (only 'stays' returns properties by default)
  if (query.category && query.category !== 'stays') {
    // For other categories we still return properties (demo mode), but could filter
  }
  return results
}

/**
 * Format a rating (0-10) as a Booking.com-style label.
 * 9.5+ = Exceptional, 9+ = Wonderful, 8+ = Very Good, etc.
 */
export function ratingLabel(rating: number): string {
  if (rating >= 9.5) return 'Exceptional'
  if (rating >= 9) return 'Wonderful'
  if (rating >= 8.5) return 'Excellent'
  if (rating >= 8) return 'Very Good'
  if (rating >= 7) return 'Good'
  return 'Pleasant'
}
