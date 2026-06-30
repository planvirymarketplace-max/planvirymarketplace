/**
 * Directory Filter Utilities for /book route
 * URL-driven filtering - all state lives in the query string
 */

// ─── Filter option definitions ───────────────────────────────────────────────

export const CATEGORY_OPTIONS = [
  { slug: 'venues', label: 'Venues & Spaces' },
  { slug: 'event-planning', label: 'Event Planning & Services' },
  { slug: 'catering', label: 'Catering & Food' },
  { slug: 'entertainment', label: 'Entertainment' },
  { slug: 'production', label: 'Production & Tech' },
  { slug: 'decor', label: 'Decor & Rentals' },
  { slug: 'beauty', label: 'Beauty & Attire' },
  { slug: 'travel', label: 'Travel & Lodging' },
  { slug: 'live-events', label: 'Live Events & Tickets' },
  { slug: 'experiences', label: 'Events & Activities' },
] as const

export const PRICE_OPTIONS = [
  { slug: 'budget', label: 'Budget', description: 'Under $500' },
  { slug: 'mid', label: 'Mid-Range', description: '$500 – $2,000' },
  { slug: 'premium', label: 'Premium', description: '$2,000 – $5,000' },
  { slug: 'luxury', label: 'Luxury', description: '$5,000+' },
] as const

export const LOCATION_OPTIONS = [
  { slug: 'downtown', label: 'Downtown' },
  { slug: 'third-ward', label: 'Third Ward' },
  { slug: 'east-side', label: 'East Side' },
  { slug: 'bay-view', label: 'Bay View' },
  { slug: 'riverwest', label: 'Riverwest' },
  { slug: 'bronzeville', label: 'Bronzeville' },
  { slug: 'deer-district', label: 'Deer District' },
  { slug: 'walkers-point', label: "Walker's Point" },
  { slug: 'west-allis', label: 'West Allis' },
  { slug: 'wauwatosa', label: 'Wauwatosa' },
  { slug: 'shorewood', label: 'Shorewood' },
  { slug: 'whitefish-bay', label: 'Whitefish Bay' },
  { slug: 'oak-creek', label: 'Oak Creek' },
  { slug: 'greenfield', label: 'Greenfield' },
  { slug: 'brookfield', label: 'Brookfield' },
] as const

export const RATING_OPTIONS = [
  { slug: '5', label: '5 Stars' },
  { slug: '4plus', label: '4+ Stars' },
  { slug: '3plus', label: '3+ Stars' },
  { slug: 'any', label: 'Any Rating' },
] as const

export const AVAILABILITY_OPTIONS = [
  { slug: 'today', label: 'Available Today' },
  { slug: 'this-week', label: 'Available This Week' },
  { slug: 'this-month', label: 'Available This Month' },
  { slug: 'instant', label: 'Instant Booking' },
] as const

export const VENDOR_TYPE_OPTIONS = [
  { slug: 'all', label: 'All' },
  { slug: 'free', label: 'Free Listing' },
  { slug: 'premium', label: 'Premium ($49/mo claimed profile)' },
] as const

export const SORT_OPTIONS = [
  { slug: 'recommended', label: 'Recommended' },
  { slug: 'price-asc', label: 'Price: Low → High' },
  { slug: 'price-desc', label: 'Price: High → Low' },
  { slug: 'rating', label: 'Highest Rated' },
  { slug: 'newest', label: 'Newest' },
] as const

// ─── Filter params type ──────────────────────────────────────────────────────

export interface DirectoryFilterParams {
  category?: string[]       // multi-select
  price?: string            // single-select (radio)
  location?: string[]       // multi-select
  rating?: string           // single-select (radio)
  availability?: string[]   // multi-select
  vendor?: string           // single-select (radio)
  sort?: string             // single-select
  q?: string                // search query
}

// ─── URL building ────────────────────────────────────────────────────────────

/**
 * Parse raw searchParams from Next.js into a clean DirectoryFilterParams object.
 * Handles string | string[] | undefined values.
 */
export function parseFilterParams(
  searchParams: Record<string, string | string[] | undefined>
): DirectoryFilterParams {
  const toArray = (val: string | string[] | undefined): string[] | undefined => {
    if (!val) return undefined
    if (Array.isArray(val)) return val.length > 0 ? val : undefined
    return [val]
  }

  return {
    category: toArray(searchParams.category),
    price: typeof searchParams.price === 'string' ? searchParams.price : undefined,
    location: toArray(searchParams.location),
    rating: typeof searchParams.rating === 'string' ? searchParams.rating : undefined,
    availability: toArray(searchParams.availability),
    vendor: typeof searchParams.vendor === 'string' ? searchParams.vendor : undefined,
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : undefined,
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
  }
}

/**
 * Build a new URL pathname + search string for the /book page
 * by merging current params with updates.
 *
 * Usage: <Link href={buildFilterUrl(currentParams, { category: ['venues'] })}>
 */
export function buildFilterUrl(
  current: DirectoryFilterParams,
  updates: Partial<DirectoryFilterParams>
): string {
  const merged: DirectoryFilterParams = { ...current, ...updates }

  const params = new URLSearchParams()

  // Multi-select fields - append each value
  for (const key of ['category', 'location', 'availability'] as const) {
    const vals = merged[key]
    if (vals && vals.length > 0) {
      for (const v of vals) {
        params.append(key, v)
      }
    }
  }

  // Single-select fields
  if (merged.price) params.set('price', merged.price)
  if (merged.rating && merged.rating !== 'any') params.set('rating', merged.rating)
  if (merged.vendor && merged.vendor !== 'all') params.set('vendor', merged.vendor)
  if (merged.sort && merged.sort !== 'recommended') params.set('sort', merged.sort)
  if (merged.q) params.set('q', merged.q)

  const qs = params.toString()
  return `/book${qs ? `?${qs}` : ''}`
}

/**
 * Toggle a value in a multi-select array filter.
 */
export function toggleMultiValue(
  current: string[] | undefined,
  value: string
): string[] | undefined {
  const arr = current || []
  const next = arr.includes(value)
    ? arr.filter(v => v !== value)
    : [...arr, value]
  return next.length > 0 ? next : undefined
}

/**
 * Remove a specific filter key (or a specific value within a multi-select key).
 * Returns a new DirectoryFilterParams with that filter removed.
 */
export function removeFilter(
  current: DirectoryFilterParams,
  key: keyof DirectoryFilterParams,
  value?: string
): DirectoryFilterParams {
  const next = { ...current }

  if (key === 'category' || key === 'location' || key === 'availability') {
    if (value) {
      const arr = next[key] || []
      const filtered = arr.filter(v => v !== value)
      next[key] = filtered.length > 0 ? filtered : undefined
    } else {
      next[key] = undefined
    }
  } else {
    next[key] = undefined
  }

  return next
}

/**
 * Get a list of active filter chips for display.
 */
export interface ActiveFilterChip {
  key: keyof DirectoryFilterParams
  value: string
  label: string
}

export function getActiveFilterChips(params: DirectoryFilterParams): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []

  const findLabel = (
    options: readonly { slug: string; label: string }[],
    slug: string
  ) => options.find(o => o.slug === slug)?.label || slug

  if (params.category) {
    for (const v of params.category) {
      chips.push({ key: 'category', value: v, label: findLabel(CATEGORY_OPTIONS, v) })
    }
  }
  if (params.price) {
    chips.push({ key: 'price', value: params.price, label: findLabel(PRICE_OPTIONS, params.price) })
  }
  if (params.location) {
    for (const v of params.location) {
      chips.push({ key: 'location', value: v, label: findLabel(LOCATION_OPTIONS, v) })
    }
  }
  if (params.rating && params.rating !== 'any') {
    chips.push({ key: 'rating', value: params.rating, label: findLabel(RATING_OPTIONS, params.rating) })
  }
  if (params.availability) {
    for (const v of params.availability) {
      chips.push({ key: 'availability', value: v, label: findLabel(AVAILABILITY_OPTIONS, v) })
    }
  }
  if (params.vendor && params.vendor !== 'all') {
    chips.push({ key: 'vendor', value: params.vendor, label: findLabel(VENDOR_TYPE_OPTIONS, params.vendor) })
  }

  return chips
}

// ─── Mock vendor data ────────────────────────────────────────────────────────

export interface MockVendor {
  id: string
  name: string
  slug: string
  category: string
  categoryLabel: string
  description: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  priceRange: string
  priceSlug: string
  location: string
  vendorType: 'free' | 'premium'
  isAvailable: boolean
  isInstantBooking: boolean
}

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: 'v1',
    name: 'The Ambassador Hotel',
    slug: 'the-ambassador-hotel',
    category: 'venues',
    categoryLabel: 'Venues & Spaces',
    description: 'Historic Art Deco hotel with elegant ballrooms and modern event spaces in the heart of downtown Milwaukee.',
    address: '2308 W Wisconsin Ave, Milwaukee, WI 53233',
    phone: '(414) 342-8400',
    rating: 4.8,
    reviewCount: 234,
    priceRange: '$$$',
    priceSlug: 'premium',
    location: 'downtown',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v2',
    name: 'Milwaukee Public Market',
    slug: 'milwaukee-public-market',
    category: 'catering',
    categoryLabel: 'Catering & Food',
    description: 'Premier catering from Milwaukee\'s iconic market. Farm-to-table menus featuring local artisan vendors.',
    address: '400 N Water St, Milwaukee, WI 53202',
    phone: '(414) 336-1111',
    rating: 4.7,
    reviewCount: 412,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'third-ward',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v3',
    name: 'Bay View Sound Co.',
    slug: 'bay-view-sound-co',
    category: 'entertainment',
    categoryLabel: 'Entertainment',
    description: 'Milwaukee\'s top-rated DJ and live music booking agency. Specializing in weddings, corporate events, and nightlife.',
    address: '2566 S Kinnickinnic Ave, Milwaukee, WI 53207',
    phone: '(414) 744-8200',
    rating: 4.9,
    reviewCount: 189,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'bay-view',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v4',
    name: 'Third Ward Productions',
    slug: 'third-ward-productions',
    category: 'production',
    categoryLabel: 'Production & Tech',
    description: 'Full-service event production - lighting, sound, staging, and AV for events of any scale.',
    address: '207 E Buffalo St, Milwaukee, WI 53202',
    phone: '(414) 273-1166',
    rating: 4.6,
    reviewCount: 97,
    priceRange: '$$$',
    priceSlug: 'premium',
    location: 'third-ward',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v5',
    name: 'Bloom MKE Florals',
    slug: 'bloom-mke-florals',
    category: 'decor',
    categoryLabel: 'Decor & Rentals',
    description: 'Stunning floral design and event decor for weddings, galas, and celebrations. Locally sourced blooms.',
    address: '2210 N Farwell Ave, Milwaukee, WI 53202',
    phone: '(414) 964-0200',
    rating: 4.9,
    reviewCount: 156,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'east-side',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v6',
    name: 'Harper & Pearl Beauty Lounge',
    slug: 'harper-pearl-beauty-lounge',
    category: 'beauty',
    categoryLabel: 'Beauty & Attire',
    description: 'On-location hair and makeup artistry for bridal parties, proms, and special events. Airbrush and traditional.',
    address: '714 N Broadway, Milwaukee, WI 53202',
    phone: '(414) 224-0170',
    rating: 4.5,
    reviewCount: 83,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'downtown',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v7',
    name: 'Riverwest Event Rentals',
    slug: 'riverwest-event-rentals',
    category: 'decor',
    categoryLabel: 'Decor & Rentals',
    description: 'Affordable tent, table, chair, and linen rentals for outdoor and indoor events across the Milwaukee area.',
    address: '901 E Locust St, Milwaukee, WI 53212',
    phone: '(414) 562-1700',
    rating: 4.3,
    reviewCount: 67,
    priceRange: '$',
    priceSlug: 'budget',
    location: 'riverwest',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v8',
    name: 'Deer District Event Space',
    slug: 'deer-district-event-space',
    category: 'venues',
    categoryLabel: 'Venues & Spaces',
    description: 'Modern, versatile event space steps from Fiserv Forum. Perfect for corporate events, watch parties, and receptions.',
    address: '1130 N Vel R Phillips Ave, Milwaukee, WI 53203',
    phone: '(414) 227-0800',
    rating: 4.7,
    reviewCount: 201,
    priceRange: '$$$$',
    priceSlug: 'luxury',
    location: 'deer-district',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v9',
    name: "Walker's Point Catering Co.",
    slug: 'walkers-point-catering-co',
    category: 'catering',
    categoryLabel: 'Catering & Food',
    description: 'Bold, creative menus inspired by Milwaukee\'s foodie scene. From BBQ to fine dining, we do it all.',
    address: '820 S 2nd St, Milwaukee, WI 53204',
    phone: '(414) 672-3300',
    rating: 4.6,
    reviewCount: 128,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'walkers-point',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v10',
    name: 'Milwaukee Limo & Transport',
    slug: 'milwaukee-limo-transport',
    category: 'travel',
    categoryLabel: 'Travel & Lodging',
    description: 'Luxury transportation - limousines, party buses, and sprinter vans for weddings, proms, and corporate events.',
    address: '3133 W State St, Milwaukee, WI 53208',
    phone: '(414) 444-5466',
    rating: 4.4,
    reviewCount: 91,
    priceRange: '$$$',
    priceSlug: 'premium',
    location: 'downtown',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v11',
    name: 'Tosa Event Planning',
    slug: 'tosa-event-planning',
    category: 'event-planning',
    categoryLabel: 'Event Planning & Services',
    description: 'Full-service event planning for corporate, social, and nonprofit events. Local expertise, national caliber.',
    address: '7420 W State St, Wauwatosa, WI 53213',
    phone: '(414) 453-2200',
    rating: 4.8,
    reviewCount: 73,
    priceRange: '$$$',
    priceSlug: 'premium',
    location: 'wauwatosa',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v12',
    name: 'Shorewood Photo Studio',
    slug: 'shorewood-photo-studio',
    category: 'production',
    categoryLabel: 'Production & Tech',
    description: 'Professional photography and videography for events. Photo booths, drone coverage, and same-day edits.',
    address: '4225 N Oakland Ave, Shorewood, WI 53211',
    phone: '(414) 961-1000',
    rating: 4.7,
    reviewCount: 104,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'shorewood',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v13',
    name: 'Bronzeville Live',
    slug: 'bronzeville-live',
    category: 'live-events',
    categoryLabel: 'Live Events & Tickets',
    description: 'Curated live entertainment - jazz, spoken word, and cultural performances celebrating Milwaukee\'s heritage.',
    address: '3400 W Fond du Lac Ave, Milwaukee, WI 53216',
    phone: '(414) 449-2600',
    rating: 4.5,
    reviewCount: 58,
    priceRange: '$',
    priceSlug: 'budget',
    location: 'bronzeville',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: false,
  },
  {
    id: 'v14',
    name: 'MKE Event Tours',
    slug: 'mke-experience-tours',
    category: 'experiences',
    categoryLabel: 'Events & Activities',
    description: 'Unique Milwaukee events - brewery tours, lakefront adventures, and team-building activities.',
    address: '241 N Broadway, Milwaukee, WI 53202',
    phone: '(414) 810-3500',
    rating: 4.6,
    reviewCount: 142,
    priceRange: '$',
    priceSlug: 'budget',
    location: 'downtown',
    vendorType: 'premium',
    isAvailable: true,
    isInstantBooking: true,
  },
  {
    id: 'v15',
    name: 'Brookfield Banquet Hall',
    slug: 'brookfield-banquet-hall',
    category: 'venues',
    categoryLabel: 'Venues & Spaces',
    description: 'Elegant suburban banquet facility with on-site catering, dance floor, and free parking. 50-500 guests.',
    address: '17500 W Capitol Dr, Brookfield, WI 53045',
    phone: '(262) 785-1200',
    rating: 4.4,
    reviewCount: 176,
    priceRange: '$$',
    priceSlug: 'mid',
    location: 'brookfield',
    vendorType: 'free',
    isAvailable: true,
    isInstantBooking: false,
  },
]

/**
 * Filter and sort mock vendors based on DirectoryFilterParams.
 */
export function filterMockVendors(
  vendors: MockVendor[],
  params: DirectoryFilterParams
): MockVendor[] {
  let result = [...vendors]

  // Category filter
  if (params.category && params.category.length > 0) {
    result = result.filter(v => params.category!.includes(v.category))
  }

  // Price filter
  if (params.price) {
    result = result.filter(v => v.priceSlug === params.price)
  }

  // Location filter
  if (params.location && params.location.length > 0) {
    result = result.filter(v => params.location!.includes(v.location))
  }

  // Rating filter
  if (params.rating) {
    switch (params.rating) {
      case '5':
        result = result.filter(v => v.rating >= 5)
        break
      case '4plus':
        result = result.filter(v => v.rating >= 4)
        break
      case '3plus':
        result = result.filter(v => v.rating >= 3)
        break
      // 'any' shows all
    }
  }

  // Availability filter
  if (params.availability && params.availability.length > 0) {
    result = result.filter(v => {
      return params.availability!.some(avail => {
        if (avail === 'instant') return v.isInstantBooking
        return v.isAvailable // today/this-week/this-month all map to available for mock
      })
    })
  }

  // Vendor type filter
  if (params.vendor && params.vendor !== 'all') {
    result = result.filter(v => v.vendorType === params.vendor)
  }

  // Search query
  if (params.q) {
    const q = params.q.toLowerCase()
    result = result.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.categoryLabel.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q)
    )
  }

  // Sort
  const sort = params.sort || 'recommended'
  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => {
        const order: Record<string, number> = { budget: 1, mid: 2, premium: 3, luxury: 4 }
        return (order[a.priceSlug] || 0) - (order[b.priceSlug] || 0)
      })
      break
    case 'price-desc':
      result.sort((a, b) => {
        const order: Record<string, number> = { budget: 1, mid: 2, premium: 3, luxury: 4 }
        return (order[b.priceSlug] || 0) - (order[a.priceSlug] || 0)
      })
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      // Mock - just reverse the default order
      result.reverse()
      break
    default:
      // 'recommended' - premium vendors first, then by rating
      result.sort((a, b) => {
        if (a.vendorType === 'premium' && b.vendorType !== 'premium') return -1
        if (a.vendorType !== 'premium' && b.vendorType === 'premium') return 1
        return b.rating - a.rating
      })
  }

  return result
}
