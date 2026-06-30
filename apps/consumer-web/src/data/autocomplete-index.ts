// =============================================================================
// Planviry - Static Autocomplete Index
// =============================================================================
// "Poor man's genius architecture" - pre-compiled prefix lookup index built at
// import time from static data. Zero database reads. Zero API calls.
// Instant O(1) autocomplete for cities, states, zip codes, and services.
//
// This index is built once when the module is first imported on the client.
// Subsequent keystrokes just do a Map.get() - no iteration over arrays.
//
// How it works:
//   1. At build time, we iterate every city/state/service and create a
//      Map<string, Result[]> entry for each 1-character, 2-character, 3-character
//      prefix of each searchable string.
//   2. At runtime, the lookup is just: index.get(normalizedInput)
//   3. Results are pre-sorted by rank/popularity so the best match is first.
//
// Memory footprint: ~200KB for the full national dataset (well within budget).
// =============================================================================

import { SEO_LOCATIONS, SEO_STATES } from '@/data/seo-locations';
import { SEO_SERVICE_PATTERNS } from '@/data/seo-pages';

// ── Types ──────────────────────────────────────────────────────────────────

export interface AutocompleteLocation {
  slug: string;
  displayName: string;
  city: string;
  state: string;
  type: 'city' | 'state' | 'zip';
  /** For zip results: show matching zip codes */
  zipPreview?: string;
  /** Sort weight - higher = shown first */
  rank: number;
}

export interface AutocompleteService {
  slug: string;
  name: string;
  category: string;
  /** Sort weight */
  rank: number;
}

// ── Build the location prefix index ────────────────────────────────────────
// Map<"da", [Dallas TX, ...]>  Map<"902", [Beverly Hills, ...]>  etc.

const locationIndex = new Map<string, AutocompleteLocation[]>();

function addLocationPrefixes(
  key: string,
  result: AutocompleteLocation,
  maxPrefixLen: number = 5
) {
  const normalized = key.toLowerCase().trim();
  // Index every prefix from length 1 to maxPrefixLen
  for (let len = 1; len <= Math.min(normalized.length, maxPrefixLen); len++) {
    const prefix = normalized.slice(0, len);
    const existing = locationIndex.get(prefix);
    if (existing) {
      // Insert sorted by rank (higher rank = more popular = first)
      let inserted = false;
      for (let i = 0; i < existing.length; i++) {
        if (result.rank > existing[i].rank) {
          existing.splice(i, 0, result);
          inserted = true;
          break;
        }
      }
      if (!inserted) existing.push(result);
      // Cap at 12 results per prefix to keep memory bounded
      if (existing.length > 12) existing.length = 12;
    } else {
      locationIndex.set(prefix, [result]);
    }
  }
}

// Index cities by name
for (const loc of SEO_LOCATIONS) {
  const cityResult: AutocompleteLocation = {
    slug: loc.slug,
    displayName: loc.displayName,
    city: loc.city,
    state: loc.state,
    type: 'city',
    rank: 100 - loc.rank, // Higher rank = more populous = higher sort weight
  };

  // Index by city name (e.g. "dal" → Dallas)
  addLocationPrefixes(loc.city, cityResult, 5);

  // Index by "city, state" format (e.g. "dallas, t" → Dallas, TX)
  addLocationPrefixes(loc.displayName, cityResult, 7);

  // Index by state abbreviation (e.g. "tx" → first Texas city)
  // We give these lower rank so city matches come first
  const abbrResult: AutocompleteLocation = {
    slug: loc.slug,
    displayName: loc.displayName,
    city: loc.city,
    state: loc.state,
    type: 'city',
    rank: 20, // Lower than city name matches
  };
  addLocationPrefixes(loc.state.toLowerCase(), abbrResult, 2);

  // Index by zip codes - first 3 digits only (e.g. "752" → Dallas)
  const zipPrefixes = new Set<string>();
  for (const zip of loc.zipCodes) {
    if (zip.length >= 3) {
      zipPrefixes.add(zip.slice(0, 3));
    }
  }
  for (const zp of zipPrefixes) {
    const zipResult: AutocompleteLocation = {
      slug: loc.slug,
      displayName: loc.displayName,
      city: loc.city,
      state: loc.state,
      type: 'zip',
      zipPreview: loc.zipCodes.filter(z => z.startsWith(zp)).slice(0, 3).join(', '),
      rank: 10, // Lower than city name matches
    };
    addLocationPrefixes(zp, zipResult, 3);
  }
}

// Index states by name and abbreviation
for (const st of SEO_STATES) {
  const stateResult: AutocompleteLocation = {
    slug: '', // Will resolve to first city in that state
    displayName: st.name,
    city: st.name,
    state: st.abbr,
    type: 'state',
    rank: 5, // States rank below city matches
  };

  // Find first city in this state for slug resolution
  const firstCity = SEO_LOCATIONS.find(l => l.state === st.abbr);
  if (firstCity) stateResult.slug = firstCity.slug;

  addLocationPrefixes(st.name, stateResult, 5);

  // Also index 2-letter abbreviation
  const abbrLow = st.abbr.toLowerCase();
  for (let len = 1; len <= 2; len++) {
    const prefix = abbrLow.slice(0, len);
    const existing = locationIndex.get(prefix);
    if (existing) {
      // Don't add duplicate if already covered by city indexing
      if (!existing.some(e => e.type === 'state' && e.state === st.abbr)) {
        let inserted = false;
        for (let i = 0; i < existing.length; i++) {
          if (stateResult.rank > existing[i].rank) {
            existing.splice(i, 0, stateResult);
            inserted = true;
            break;
          }
        }
        if (!inserted) existing.push(stateResult);
        if (existing.length > 12) existing.length = 12;
      }
    } else {
      locationIndex.set(prefix, [stateResult]);
    }
  }
}

// ── Build the service prefix index ─────────────────────────────────────────

const serviceIndex = new Map<string, AutocompleteService[]>();

function addServicePrefixes(key: string, result: AutocompleteService, maxPrefixLen: number = 4) {
  const normalized = key.toLowerCase().trim();
  for (let len = 1; len <= Math.min(normalized.length, maxPrefixLen); len++) {
    const prefix = normalized.slice(0, len);
    const existing = serviceIndex.get(prefix);
    if (existing) {
      if (!existing.some(e => e.slug === result.slug)) {
        let inserted = false;
        for (let i = 0; i < existing.length; i++) {
          if (result.rank > existing[i].rank) {
            existing.splice(i, 0, result);
            inserted = true;
            break;
          }
        }
        if (!inserted) existing.push(result);
        if (existing.length > 10) existing.length = 10;
      }
    } else {
      serviceIndex.set(prefix, [result]);
    }
  }
}

// Index service patterns - by name words
let serviceRank = SEO_SERVICE_PATTERNS.length;
for (const pat of SEO_SERVICE_PATTERNS) {
  const result: AutocompleteService = {
    slug: pat.slug,
    name: pat.name,
    category: pat.category,
    rank: serviceRank--,
  };

  // Index by the full name
  addServicePrefixes(pat.name, result, 4);

  // Also index by each word in the name (e.g. "Wedding" from "Wedding Venues In")
  const words = pat.name.split(/\s+/);
  for (const word of words) {
    if (word.length >= 2 && word.toLowerCase() !== 'in' && word.toLowerCase() !== 'near' && word.toLowerCase() !== 'and' && word.toLowerCase() !== '&') {
      addServicePrefixes(word, result, 3);
    }
  }
}

// ── Lookup functions ───────────────────────────────────────────────────────

export function lookupLocations(query: string): AutocompleteLocation[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  // Try exact prefix match first (O(1))
  const exact = locationIndex.get(q);
  if (exact) return exact.slice(0, 8);

  // For queries longer than our max prefix length, do a secondary scan
  // This handles cases like "detroit" where we only indexed up to "detroi"
  if (q.length > 5) {
    const fallback: AutocompleteLocation[] = [];
    // Check city names
    for (const loc of SEO_LOCATIONS) {
      if (
        loc.city.toLowerCase().startsWith(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.displayName.toLowerCase().startsWith(q) ||
        loc.displayName.toLowerCase().includes(q)
      ) {
        fallback.push({
          slug: loc.slug,
          displayName: loc.displayName,
          city: loc.city,
          state: loc.state,
          type: 'city',
          rank: 100 - loc.rank,
        });
        if (fallback.length >= 8) break;
      }
    }
    // Check state names
    if (fallback.length < 8) {
      for (const st of SEO_STATES) {
        if (st.name.toLowerCase().startsWith(q) || st.name.toLowerCase().includes(q)) {
          const firstCity = SEO_LOCATIONS.find(l => l.state === st.abbr);
          fallback.push({
            slug: firstCity?.slug ?? '',
            displayName: st.name,
            city: st.name,
            state: st.abbr,
            type: 'state',
            rank: 5,
          });
          if (fallback.length >= 8) break;
        }
      }
    }
    return fallback;
  }

  return [];
}

export function lookupServices(query: string): AutocompleteService[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const exact = serviceIndex.get(q);
  if (exact) return exact.slice(0, 8);

  // Secondary scan for longer queries
  if (q.length > 4) {
    const fallback: AutocompleteService[] = [];
    for (const pat of SEO_SERVICE_PATTERNS) {
      if (pat.name.toLowerCase().includes(q)) {
        fallback.push({
          slug: pat.slug,
          name: pat.name,
          category: pat.category,
          rank: 0,
        });
        if (fallback.length >= 8) break;
      }
    }
    return fallback;
  }

  return [];
}

// ── Debug: index stats (removed in production) ────────────────────────────
// console.log(`[Autocomplete] Location prefixes: ${locationIndex.size}, Service prefixes: ${serviceIndex.size}`);
