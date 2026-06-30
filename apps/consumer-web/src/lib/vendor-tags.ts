/**
 * vendor-tags.ts - Tag-driven vendor capability system
 *
 * Replaces the hard-coded isVenueCategory / isDJCategory / isPhotographyCategory /
 * isDecorCategory functions in VendorProfileClient.tsx with an extensible,
 * declarative tag map.
 *
 * How it works:
 *   1. Every VendorCategory maps to one or more VendorTag values via VENDOR_TAG_MAP.
 *   2. getVendorTags() resolves a category (+ optional DB-sourced tags) into a
 *      deduplicated VendorTag[].
 *   3. Section-visibility helpers (shouldShowMenu, shouldShowSeatingMap, etc.)
 *      consume the tag array to decide what renders on the vendor profile page.
 *
 * When we wire to the database later, the vendor record will have a `tags` column,
 * and we just query that - the existingTags parameter in getVendorTags already
 * supports merging those in.
 */

import type { VendorCategory } from '@/lib/types'

// ─── Tag union type ─────────────────────────────────────────────────────────
// Add new tags here to extend the system.

export type VendorTag =
  | 'venue'
  | 'catering'
  | 'dj'
  | 'music'
  | 'photography'
  | 'videography'
  | 'decor'
  | 'floral'
  | 'rental'
  | 'beauty'
  | 'hair_makeup'
  | 'planning'
  | 'coordination'
  | 'transportation'
  | 'entertainment'
  | 'lighting_av'
  | 'officiant'
  | 'bakery'
  | 'bar'
  | 'wellness'
  | 'stationery'
  | 'jewelry'
  | 'attire'
  | 'hotel'
  | 'travel'
  | 'photo_booth'

// ─── Category → Tag map ─────────────────────────────────────────────────────
// Each VendorCategory maps to the capability tags that describe what a vendor
// in that category can do.  To add a new mapping, just add an entry here.

export const VENDOR_TAG_MAP: Record<string, VendorTag[]> = {
  wedding_venue:            ['venue'],
  bar_club:                 ['venue', 'bar'],
  catering:                 ['catering'],
  wedding_dj:               ['dj', 'music'],
  wedding_band:             ['music'],
  photography:              ['photography'],
  videography:              ['videography'],
  decor_rentals:            ['decor', 'rental'],
  florist:                  ['floral'],
  makeup_hair:              ['beauty', 'hair_makeup'],
  hair_makeup:              ['beauty', 'hair_makeup'],
  wedding_planner:          ['planning', 'coordination'],
  event_planner:            ['planning', 'coordination'],
  entertainment:            ['entertainment'],
  lighting_av:              ['lighting_av'],
  transportation:           ['transportation'],
  officiant:                ['officiant'],
  bakery:                   ['bakery'],
  wedding_cake:             ['bakery'],
  photo_booth:              ['photo_booth'],
  rentals:                  ['rental'],
  wellness:                 ['wellness'],
  wine_spirits:             ['bar'],
  dress_attire:             ['attire'],
  favors_gifts:             ['decor'],
  hotel_accommodations:     ['hotel'],
  honeymoon_travel:         ['travel'],
  restaurant_food:          ['catering'],
  fine_dining:              ['catering'],
  restaurant:               ['catering'],
  bachelorette_activity:    ['entertainment'],
  jeweler:                  ['jewelry'],
  stationery:               ['stationery'],
  invitations_print:        ['stationery'],
}

// ─── Tag resolver ────────────────────────────────────────────────────────────

/**
 * Resolve the effective tags for a vendor.
 *
 * @param category    - The vendor's `VendorCategory` value
 * @param existingTags - Optional tags sourced from the vendor's DB record
 *                       (the future `tags` column). These are merged in and
 *                       take precedence on duplicates.
 * @returns Deduplicated `VendorTag[]`. Falls back to `['venue']` when the
 *          category is not found in the map.
 */
export function getVendorTags(
  category: string,
  existingTags?: string[],
): VendorTag[] {
  const mapped = VENDOR_TAG_MAP[category] ?? ['venue']

  if (!existingTags || existingTags.length === 0) {
    return mapped
  }

  // Merge and deduplicate while preserving order (mapped first, then extras)
  const seen = new Set<string>(mapped)
  const merged = [...mapped]

  for (const tag of existingTags) {
    if (!seen.has(tag)) {
      seen.add(tag)
      merged.push(tag as VendorTag)
    }
  }

  return merged as VendorTag[]
}

// ─── Tag-checking primitive ─────────────────────────────────────────────────

/** Simple membership test - true when `tag` appears in the array. */
export function hasTag(tags: VendorTag[], tag: VendorTag): boolean {
  return tags.includes(tag)
}

// ─── Section visibility helpers ─────────────────────────────────────────────
// Each helper answers "should this section render?" based on the resolved tags.

/** Menu / catering section - shown for food & drink vendors. */
export function shouldShowMenu(tags: VendorTag[]): boolean {
  return tags.some((t) => t === 'catering' || t === 'bakery')
}

/** Seating map - shown for venues that have physical layouts. */
export function shouldShowSeatingMap(tags: VendorTag[]): boolean {
  return tags.includes('venue')
}

/** Package selector - every vendor has packages. */
export function shouldShowPackageSelector(_tags: VendorTag[]): boolean {
  return true
}

/** Availability calendar - venues and planners manage date availability. */
export function shouldShowAvailabilityCalendar(tags: VendorTag[]): boolean {
  return tags.some((t) => t === 'venue' || t === 'planning')
}

/** Team section - all vendors can showcase their team. */
export function shouldShowTeamSection(_tags: VendorTag[]): boolean {
  return true
}

/** Music samples - DJs and bands can embed audio previews. */
export function shouldShowMusicSamples(tags: VendorTag[]): boolean {
  return tags.some((t) => t === 'dj' || t === 'music')
}
