/**
 * Maps each consumer-facing "surface" page (Part XLIV Vertical Row) to the
 * inventory_items.category filter that backs it.
 *
 * Spec ref: Part XLIV §44.4 — Vertical Row canonical order. P4-1 wires each
 * surface page to its inventory_items.category so the marketplace feed can
 * fetch live items alongside the prototype seed data.
 *
 * Notes:
 * - `category` is a single value when one category maps to a surface.
 * - `categories` is supplied when the surface spans multiple categories
 *   (e.g. /party mixes VENUE_RENTAL + SERVICE).
 * - /vendors keeps an empty filter — it shows all categories.
 * - /travel already redirects to /lodging/search (LODGING) — not listed here.
 *
 * FIX-10: aligned to the live Supabase `inventory_category` enum. The enum
 * only allows {LODGING, DINING, EVENT_TICKET, ACTIVITY, TRANSPORT,
 * VENUE_RENTAL, SERVICE}. The previous values VENDOR_SERVICE → SERVICE and
 * EXPERIENCE → ACTIVITY were rejected by Postgres with
 * `invalid input value for enum inventory_category`.
 */

export type SurfaceSlug =
  | 'services'
  | 'things-to-do'
  | 'food-drink'
  | 'live-shows'
  | 'party'
  | 'spaces'
  | 'vendors'
  | 'plan'
  | 'travel';

export interface SurfaceInventoryFilter {
  /** Single category, or undefined when the surface uses `categories`. */
  category?: string;
  /** Multiple categories (IN-style filter). */
  categories?: string[];
  /** Human-readable label for the live-inventory panel. */
  label: string;
}

export const SURFACE_TO_INVENTORY: Record<SurfaceSlug, SurfaceInventoryFilter> = {
  services: { category: 'SERVICE', label: 'Vendor services' },
  'things-to-do': { category: 'ACTIVITY', label: 'Experiences & attractions' },
  'food-drink': { category: 'DINING', label: 'Dining & catering' },
  'live-shows': { category: 'EVENT_TICKET', label: 'Live shows & event tickets' },
  party: { categories: ['VENUE_RENTAL', 'SERVICE'], label: 'Venues & event services' },
  spaces: { category: 'VENUE_RENTAL', label: 'Venue rentals' },
  vendors: { label: 'All vendors' }, // no category filter — show everything
  plan: { category: 'SERVICE', label: 'Planning services' },
  travel: { category: 'LODGING', label: 'Lodging' },
};

/** Returns the categories to filter inventory_items by for a given surface. */
export function getInventoryCategoriesForSurface(surface: string): string[] {
  const entry = SURFACE_TO_INVENTORY[surface as SurfaceSlug]
  if (!entry) return []
  if (entry.categories && entry.categories.length > 0) return entry.categories
  if (entry.category) return [entry.category]
  return []
}
