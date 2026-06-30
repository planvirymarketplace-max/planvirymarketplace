/**
 * Routes utility - canonical categories, slug helpers, and label lookups
 * Used by directory and booking pages
 */

// ── Slugify ─────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Canonical Categories ────────────────────────────────────────────────────
export const CANONICAL_CATEGORIES = [
  'venues-spaces',
  'event-planning',
  'catering-food',
  'entertainment',
  'production-tech',
  'decor-rentals',
  'beauty-attire',
  'travel-lodging',
] as const;

// ── Category label map ──────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'venues-spaces': 'Venues & Spaces',
  'event-planning': 'Event Planning & Services',
  'catering-food': 'Catering & Food',
  'entertainment': 'Entertainment',
  'production-tech': 'Production & Tech',
  'decor-rentals': 'Decor & Rentals',
  'beauty-attire': 'Beauty & Attire',
  'travel-lodging': 'Travel & Lodging',
  'experiences-activities': 'Events & Activities',
  'live-events-tickets': 'Live Events & Tickets',
};

// ── Sub-categories per L1 ───────────────────────────────────────────────────
export const SUB_CATEGORIES: Record<string, string[]> = {
  'venues-spaces': ['Ballrooms', 'Barns', 'Historic', 'Hotels', 'Restaurants', 'Industrial', 'Gardens', 'Rooftops', 'Lofts', 'Conference Centers'],
  'event-planning': ['Full Service', 'Month-Of', 'Day-Of Coordination', 'Design Only', 'Corporate Events', 'Team Building'],
  'catering-food': ['Buffet', 'Plated', 'Food Trucks', 'Desserts', 'Bar Service', 'Personal Chef', 'Cake Baker'],
  'entertainment': ['DJs & MCs', 'Live Bands', 'Solo Musicians', 'Interactive', 'Magicians', 'Photo Booths', 'Karaoke', 'Comedians'],
  'production-tech': ['Photography', 'Videography', 'Lighting', 'Sound Systems', 'Staging', 'Drone', 'AV Rental', 'Live Streaming'],
  'decor-rentals': ['Tents', 'Linens', 'Furniture', 'Florals', 'Balloons', 'Signs', 'Event Styling', 'Centerpieces'],
  'beauty-attire': ['Hair', 'Makeup', 'Bridal', 'Tuxedo', 'Nails', 'Spray Tan', 'Wardrobe Stylist', 'Tailor'],
  'travel-lodging': ['Hotels', 'Resorts', 'Limousines', 'Party Buses', 'Shuttles', 'Boat Charters', 'Vacation Rentals'],
  'experiences-activities': ['Spa & Wellness', 'Adventure', 'Classes', 'Tours', 'Workshops'],
  'live-events-tickets': ['Concerts', 'Festivals', 'Sports', 'Theater', 'Comedy Shows'],
};

// ── Canonicalize a category slug ────────────────────────────────────────────
export function canonicalizeCategory(input: string): string {
  const normalized = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // Direct match
  if (CANONICAL_CATEGORIES.includes(normalized as any)) return normalized;
  // Partial match
  for (const cat of CANONICAL_CATEGORIES) {
    if (cat.includes(normalized) || normalized.includes(cat)) return cat;
  }
  return '';
}

// ── Get a human-readable label for a category slug ──────────────────────────
export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Build a canonical URL for a category (with optional location) ────────────
export function buildCategoryUrl(category: string, location?: string): string {
  const slug = canonicalizeCategory(category)
  if (!slug) return '/browse'
  if (location) {
    const locSlug = slugify(location)
    return `/${slug}/${locSlug}`
  }
  return `/${slug}`
}

// ── Map a category slug to its canonical SEO-friendly slug ───────────────────
export function seoCategoryToCanonical(slug: string): string {
  return canonicalizeCategory(slug) || slug
}

// ── Map vendor category display names to vertical slugs ────────────────────────
// Used by breadcrumbs so the category link always points to a valid /<vertical> page
const CATEGORY_NAME_TO_VERTICAL: Record<string, string> = {
  // Direct vertical matches
  'venues & spaces': 'venues-spaces',
  'venues': 'venues-spaces',
  'event planning & services': 'event-planning',
  'event planning': 'event-planning',
  'event services': 'event-planning',
  'catering & food': 'catering-food',
  'catering': 'catering-food',
  'entertainment': 'entertainment',
  'production & tech': 'production-tech',
  'decor & rentals': 'decor-rentals',
  'beauty & attire': 'beauty-attire',
  'travel & lodging': 'travel-lodging',
  // Sub-category / vendor category names → parent vertical
  'wedding venues': 'venues-spaces',
  'wedding venue': 'venues-spaces',
  'photography': 'production-tech',
  'photographer': 'production-tech',
  'videography': 'production-tech',
  'videographer': 'production-tech',
  'dj': 'entertainment',
  'djs': 'entertainment',
  'wedding dj': 'entertainment',
  'florist': 'decor-rentals',
  'florists': 'decor-rentals',
  'hair & makeup': 'beauty-attire',
  'makeup': 'beauty-attire',
  'wedding planning': 'event-planning',
  'wedding planner': 'event-planning',
  'bakery': 'catering-food',
  'bakeries & cakes': 'catering-food',
  'transportation': 'travel-lodging',
  'rentals': 'decor-rentals',
  'decor': 'decor-rentals',
  'photo booth': 'entertainment',
  'officiant': 'event-planning',
  'bar service': 'catering-food',
  'bartender': 'catering-food',
  'musicians': 'entertainment',
  'balloon': 'decor-rentals',
  'equipment rental': 'decor-rentals',
  'hotels & lodging': 'travel-lodging',
  'hotel': 'travel-lodging',
}

/**
 * Map a vendor category display name to its vertical slug for breadcrumb links.
 * Returns a valid vertical slug or null if no mapping exists.
 */
export function categoryNameToVerticalSlug(categoryName: string): string | null {
  if (!categoryName) return null
  const key = categoryName.toLowerCase().trim()
  // Direct lookup
  if (CATEGORY_NAME_TO_VERTICAL[key]) return CATEGORY_NAME_TO_VERTICAL[key]
  // Try canonicalizeCategory as fallback
  const canonical = canonicalizeCategory(key)
  if (canonical) return canonical
  // Partial match against keys
  for (const [name, slug] of Object.entries(CATEGORY_NAME_TO_VERTICAL)) {
    if (key.includes(name) || name.includes(key)) return slug
  }
  return null
}
