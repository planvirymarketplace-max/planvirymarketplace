// =============================================================================
// Planviry - Runtime Prefix Index Builder
// =============================================================================
// "Poor man's genius architecture" at national scale.
//
// This module lazy-loads the 25K city dataset and builds a Map<string, Result[]>
// prefix index at runtime. The index is built once (~50ms) and cached forever.
// All subsequent keystrokes are O(1) Map lookups.
//
// Why runtime instead of static?
//   - 25K cities = 5.5MB data file → too big for inline in a component
//   - Pre-compiled index = 12MB → way too big
//   - Runtime build = 5.5MB data (lazy loaded) + ~50ms to build index = perfect
//   - The data file is code-split and only loaded when the search bar mounts
//
// The flow:
//   1. SearchBar mounts → calls getPrefixIndex()
//   2. First call: dynamic import seo-locations → build Map → cache
//   3. All future calls: return cached Map instantly
//   4. Each keystroke: index.get(query.toLowerCase()) → results
//
// Ranking:
//   - Primary cities (39 top metros): sortRank 500
//   - Cities with 10+ zip codes: sortRank 300
//   - Cities with 5-9 zip codes: sortRank 200
//   - Cities with 2-4 zip codes: sortRank 100
//   - Cities with 1 zip code: sortRank 50
//   - State abbreviation matches: sortRank 40
//   - Zip code matches: sortRank 30
//   - State name matches: sortRank 20
// =============================================================================

export interface AutocompleteResult {
  slug: string;
  displayName: string;
  city: string;
  state: string;
  type: 'city' | 'state' | 'zip';
  zipPreview?: string;
  sortRank: number;
}

type PrefixMap = Map<string, AutocompleteResult[]>;

let indexCache: PrefixMap | null = null;
let buildPromise: Promise<PrefixMap> | null = null;

// ── Get or build the prefix index ────────────────────────────────────────────

export async function getPrefixIndex(): Promise<PrefixMap> {
  if (indexCache) return indexCache;
  if (buildPromise) return buildPromise;

  buildPromise = buildIndex();
  indexCache = await buildPromise;
  return indexCache;
}

// ── Rank a city based on its size ────────────────────────────────────────────

function getCityRank(loc: { primary: boolean; zipCodes: string[] }): number {
  if (loc.primary) return 500;

  const zipCount = loc.zipCodes.length;
  if (zipCount >= 10) return 300;
  if (zipCount >= 5) return 200;
  if (zipCount >= 2) return 100;
  return 50;
}

// ── Build the index from the lazy-loaded data ────────────────────────────────

async function buildIndex(): Promise<PrefixMap> {
  const index: PrefixMap = new Map();

  // Dynamic import - code-split, only loaded when needed
  const { SEO_LOCATIONS, SEO_STATES } = await import('@/data/seo-locations');

  // ── Index cities by name prefix ───────────────────────────────────────────
  for (const loc of SEO_LOCATIONS) {
    const baseRank = getCityRank(loc);

    const cityResult: AutocompleteResult = {
      slug: loc.slug,
      displayName: loc.displayName,
      city: loc.city,
      state: loc.state,
      type: 'city',
      sortRank: baseRank,
    };

    // Index by city name (up to 4 chars: "d", "da", "dal", "dall")
    addPrefixes(index, loc.city.toLowerCase(), cityResult, 4);

    // Index by "City, ST" (up to 6 chars: "dallas", "dallas,", "dallas, ", "dallas, t", "dallas, tx")
    addPrefixes(index, loc.displayName.toLowerCase(), cityResult, 6);

    // Index by state abbreviation (2 chars max) - lower priority than city name match
    const abbrResult: AutocompleteResult = {
      ...cityResult,
      sortRank: Math.min(baseRank, 40), // state abbr matches are always low priority
    };
    addPrefixes(index, loc.state.toLowerCase(), abbrResult, 2);
  }

  // ── Index zip codes (3-digit prefixes only) ──────────────────────────────
  for (const loc of SEO_LOCATIONS) {
    const zipPrefixes = new Set<string>();
    for (const zip of loc.zipCodes) {
      if (zip.length >= 3) zipPrefixes.add(zip.slice(0, 3));
    }
    for (const zp of zipPrefixes) {
      const zipResult: AutocompleteResult = {
        slug: loc.slug,
        displayName: loc.displayName,
        city: loc.city,
        state: loc.state,
        type: 'zip',
        zipPreview: loc.zipCodes.filter(z => z.startsWith(zp)).slice(0, 3).join(', '),
        sortRank: 30,
      };
      addPrefixes(index, zp, zipResult, 3);
    }
  }

  // ── Index states by name ──────────────────────────────────────────────────
  for (const st of SEO_STATES) {
    const stateResult: AutocompleteResult = {
      slug: SEO_LOCATIONS.find(l => l.state === st.abbr)?.slug ?? '',
      displayName: st.name,
      city: st.name,
      state: st.abbr,
      type: 'state',
      sortRank: 20,
    };
    addPrefixes(index, st.name.toLowerCase(), stateResult, 4);
  }

  return index;
}

// ── Add prefixes to the index ────────────────────────────────────────────────

function addPrefixes(
  index: PrefixMap,
  key: string,
  result: AutocompleteResult,
  maxPrefixLen: number
) {
  for (let len = 1; len <= Math.min(key.length, maxPrefixLen); len++) {
    const prefix = key.slice(0, len);
    const existing = index.get(prefix);
    if (existing) {
      // Don't add duplicates
      if (existing.some(e => e.slug === result.slug && e.type === result.type)) continue;

      // Insert sorted by rank (higher = shown first)
      let inserted = false;
      for (let i = 0; i < existing.length; i++) {
        if (result.sortRank > existing[i].sortRank) {
          existing.splice(i, 0, result);
          inserted = true;
          break;
        }
      }
      if (!inserted) existing.push(result);
      // Cap at 10 results per prefix to keep memory bounded
      if (existing.length > 10) existing.length = 10;
    } else {
      index.set(prefix, [result]);
    }
  }
}

// ── Lookup function (called on every keystroke) ──────────────────────────────

export function lookupByPrefix(
  index: PrefixMap,
  query: string
): AutocompleteResult[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  // For zip-like input, do a secondary pass with zip priority
  const isZipLike = /^\d/.test(q);

  // Direct prefix match - O(1)
  const results = index.get(q);
  if (results) {
    if (isZipLike) {
      // Boost zip results to the top
      const sorted = [...results].sort((a, b) => {
        if (a.type === 'zip' && b.type !== 'zip') return -1;
        if (b.type === 'zip' && a.type !== 'zip') return 1;
        return b.sortRank - a.sortRank;
      });
      return sorted.slice(0, 8);
    }
    return results.slice(0, 8);
  }

  return [];
}
