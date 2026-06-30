/**
 * Planviry SEO Search Strings Data - 582 entries
 * Each entry represents a unique SEO landing page route.
 *
 * Two types:
 * - 'service': Service-based pages (e.g., 'Wedding DJs in Milwaukee')
 * - 'area': Area/landmark-based pages (e.g., 'Bars near Deer District')
 *
 * Data is stored in seo-data.json for fast Turbopack compilation.
 * The original inline array was 6,500+ lines and caused severe dev server slowdowns.
 */

import seoData from './seo-data.json'

export interface SeoSearchEntry {
  id: string;
  searchTag: string;
  slug: string;
  category: string;
  categorySlug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  pageType: 'service' | 'area';
  areaName?: string;
  areaSlug?: string;
}

// Cast JSON data to typed entries
export const SEO_SEARCH_ENTRIES: SeoSearchEntry[] = seoData as SeoSearchEntry[]

// Pre-computed area entries (only ~20 entries)
export const SEO_AREA_ENTRIES: SeoSearchEntry[] = SEO_SEARCH_ENTRIES.filter(
  (e) => e.pageType === 'area'
)

// O(1) slug lookup using a Map
const slugMap = new Map<string, SeoSearchEntry>()
for (const entry of SEO_SEARCH_ENTRIES) {
  slugMap.set(entry.slug, entry)
}

export function getEntryBySlug(slug: string): SeoSearchEntry | undefined {
  return slugMap.get(slug)
}

export function getEntriesByCategory(categorySlug: string): SeoSearchEntry[] {
  return SEO_SEARCH_ENTRIES.filter((e) => e.categorySlug === categorySlug)
}

// ─── Category-grouped helpers (used by directory page) ────────────────────
export const SEO_CATEGORY_SLUGS: string[] = [...new Set(
  SEO_SEARCH_ENTRIES.filter(e => e.pageType === 'service').map(e => e.categorySlug)
)]

export const SEO_BY_CATEGORY: Record<string, { name: string; entries: SeoSearchEntry[] }> = {}
for (const slug of SEO_CATEGORY_SLUGS) {
  const entries = SEO_SEARCH_ENTRIES.filter(e => e.categorySlug === slug)
  if (entries.length > 0) {
    SEO_BY_CATEGORY[slug] = {
      name: entries[0].category,
      entries,
    }
  }
}
