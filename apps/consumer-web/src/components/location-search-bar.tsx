'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Loader2, Locate, Navigation } from 'lucide-react';
import { getPrefixIndex, lookupByPrefix, type AutocompleteResult } from '@/data/prefix-index';
import type { SeoLocation } from '@/data/seo-locations';
import { useLocationStore } from '@/lib/store';

// =============================================================================
// Planviry - LocationSearchBar (National Scale)
// =============================================================================
// "Poor man's genius architecture" - 25K cities, instant autocomplete, zero API calls.
//
// How it works:
//   1. On mount, lazy-loads the 25K city dataset and builds a Map prefix index
//   2. Each keystroke = O(1) Map lookup → instant results
//   3. While the index is loading (~50ms), falls back to empty results
//   4. Once loaded, autocomplete works for every city, state, and zip in the US
//
// Location services:
//   - Auto-detect on page load (IP geolocation)
//   - Click map pin → browser GPS → fills input
//   - Both paths resolve to nearest city using haversine on all 25K cities
//
// Persistence:
//   - Location is saved to Zustand store with localStorage persistence
//   - Returning users see their previously entered location pre-filled
// =============================================================================

interface LocationSearchBarProps {
  variant?: 'hero' | 'compact';
  initialService?: string;
  initialLocation?: string;
  onSearch?: (serviceSlug: string, locationSlug: string | null) => void;
}

// ── Result types (from prefix index) ─────────────────────────────────────────

interface LocationResult {
  slug: string;
  displayName: string;
  city: string;
  state: string;
  type: 'city' | 'state' | 'zip';
  zipPreview?: string;
  rank: number;
}

interface ServiceResult {
  slug: string;
  name: string;
  category: string;
}

// ── Service data (lightweight, ~562 patterns - always inline) ────────────────

interface FlatServiceEntry {
  searchText: string;
  slug: string;
  name: string;
  category: string;
  sortRank: number;
}

let serviceEntriesCache: FlatServiceEntry[] | null = null;

// ── State capitals lookup ──────────────────────────────────────────────────
// Used when a state name is entered without a specific city - we route to the
// capital instead of the first alphabetical city in our dataset.
const STATE_CAPITALS: Record<string, string> = {
  AL: 'Montgomery', AK: 'Juneau', AZ: 'Phoenix', AR: 'Little Rock',
  CA: 'Sacramento', CO: 'Denver', CT: 'Hartford', DE: 'Dover',
  DC: 'Washington', FL: 'Tallahassee', GA: 'Atlanta', HI: 'Honolulu',
  ID: 'Boise', IL: 'Springfield', IN: 'Indianapolis', IA: 'Des Moines',
  KS: 'Topeka', KY: 'Frankfort', LA: 'Baton Rouge', ME: 'Augusta',
  MD: 'Annapolis', MA: 'Boston', MI: 'Lansing', MN: 'Saint Paul',
  MS: 'Jackson', MO: 'Jefferson City', MT: 'Helena', NE: 'Lincoln',
  NV: 'Carson City', NH: 'Concord', NJ: 'Trenton', NM: 'Santa Fe',
  NY: 'Albany', NC: 'Raleigh', ND: 'Bismarck', OH: 'Columbus',
  OK: 'Oklahoma City', OR: 'Salem', PA: 'Harrisburg', RI: 'Providence',
  SC: 'Columbia', SD: 'Pierre', TN: 'Nashville', TX: 'Austin',
  UT: 'Salt Lake City', VT: 'Montpelier', VA: 'Richmond',
  WA: 'Olympia', WV: 'Charleston', WI: 'Madison', WY: 'Cheyenne',
};

async function getServiceEntries(): Promise<FlatServiceEntry[]> {
  if (serviceEntriesCache) return serviceEntriesCache;
  const { SEO_SERVICE_PATTERNS } = await import('@/data/seo-pages');
  const entries: FlatServiceEntry[] = [];
  let rank = SEO_SERVICE_PATTERNS.length;
  for (const pat of SEO_SERVICE_PATTERNS) {
    entries.push({ searchText: pat.name.toLowerCase(), slug: pat.slug, name: pat.name, category: pat.category, sortRank: rank-- });
    const words = pat.name.split(/\s+/);
    for (const word of words) {
      const w = word.toLowerCase();
      if (w.length >= 2 && w !== 'in' && w !== 'near' && w !== 'and' && w !== '&') {
        entries.push({ searchText: w, slug: pat.slug, name: pat.name, category: pat.category, sortRank: rank });
      }
    }
  }
  serviceEntriesCache = entries;
  return entries;
}

// ── The Component ─────────────────────────────────────────────────────────────

export function LocationSearchBar({
  variant = 'hero',
  initialService = '',
  initialLocation = '',
  onSearch,
}: LocationSearchBarProps) {
  const router = useRouter();
  const { location: savedLocation, setLocation: setSavedLocation, setCoords: setSavedCoords } = useLocationStore();

  const [serviceQuery, setServiceQuery] = useState(initialService);
  const [locationQuery, setLocationQuery] = useState(initialLocation || savedLocation);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [serviceResults, setServiceResults] = useState<ServiceResult[]>([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(-1);
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1);
  const [indexReady, setIndexReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const autoDetectedRef = useRef(false);
  const indexRef = useRef<Map<string, AutocompleteResult[]> | null>(null);

  // ── Hydrate from persisted store ────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
      // Only use saved location if no initialLocation was provided
      if (!initialLocation && savedLocation) {
        setLocationQuery(savedLocation);
      }
    }
  }, [hydrated, initialLocation, savedLocation]);

  // ── Load the prefix index on mount ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        const index = await getPrefixIndex();
        if (!cancelled) {
          indexRef.current = index;
          setIndexReady(true);
        }
      } catch (err) {
        console.error('[Planviry] Failed to load location index:', err);
      }
    }

    loadIndex();
    return () => { cancelled = true; };
  }, []);

  // ── Auto-detect location on first mount (only if no saved location) ────
  useEffect(() => {
    if (autoDetectedRef.current) return;
    autoDetectedRef.current = true;

    // If user already has a saved location, don't auto-detect
    if (savedLocation) return;

    async function autoDetect() {
      try {
        if ('geolocation' in navigator) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 6000,
              maximumAge: 600_000,
            });
          });
          const res = await fetch(`/api/geolocation?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.displayName) { setDetectedCity(data.displayName); return; }
          }
        }
      } catch { /* GPS denied - fall through to IP */ }

      try {
        const res = await fetch('/api/geolocation');
        if (res.ok) {
          const data = await res.json();
          if (data.displayName) setDetectedCity(data.displayName);
        }
      } catch { /* IP geolocation failed - that's OK */ }
    }

    autoDetect();
  }, [savedLocation]);

  // ── Location autocomplete using the prefix index ────────────────────────
  const searchLocations = useCallback((q: string) => {
    setLocationQuery(q);
    setSavedLocation(q);
    setActiveLocationIndex(-1);

    if (!indexRef.current || q.trim().length === 0) {
      setLocationResults([]);
      setShowLocationDropdown(false);
      return;
    }

    const results = lookupByPrefix(indexRef.current, q);
    const mapped: LocationResult[] = results.map(r => ({
      slug: r.slug,
      displayName: r.displayName,
      city: r.city,
      state: r.state,
      type: r.type,
      zipPreview: r.zipPreview,
      rank: r.sortRank,
    }));

    setLocationResults(mapped);
    setShowLocationDropdown(mapped.length > 0);
  }, [setSavedLocation]);

  // ── Service autocomplete ────────────────────────────────────────────────
  const searchServices = useCallback(async (q: string) => {
    setServiceQuery(q);
    setActiveServiceIndex(-1);

    if (q.trim().length === 0) {
      setServiceResults([]);
      setShowServiceDropdown(false);
      return;
    }

    const entries = await getServiceEntries();
    const qLower = q.trim().toLowerCase();
    const seen = new Set<string>();
    const results: ServiceResult[] = [];
    const MAX = 8;

    // Pass 1: startsWith
    for (const entry of entries) {
      if (results.length >= MAX) break;
      if (entry.searchText.startsWith(qLower)) {
        if (seen.has(entry.slug)) continue;
        seen.add(entry.slug);
        results.push({ slug: entry.slug, name: entry.name, category: entry.category });
      }
    }

    // Pass 2: includes
    for (const entry of entries) {
      if (results.length >= MAX) break;
      if (entry.searchText.includes(qLower)) {
        if (seen.has(entry.slug)) continue;
        seen.add(entry.slug);
        results.push({ slug: entry.slug, name: entry.name, category: entry.category });
      }
    }

    setServiceResults(results);
    setShowServiceDropdown(results.length > 0);
  }, []);

  // ── Combined query parser ────────────────────────────────────────────────
  // Detects when a user types a combined query like "dj in mississippi" or
  // "wedding venue nashville" and auto-splits into service + location.
  const parseAndSplitQuery = useCallback(async (q: string) => {
    // Don't split if the location input already has user-typed content
    if (locationQuery.trim()) return;

    const trimmed = q.trim();
    if (!trimmed) return;

    // Pattern 1: "service in/near/by location" (e.g. "dj in mississippi")
    const prepositionMatch = trimmed.match(/^(.+?)\s+(in|near|by|at|around)\s+(.+)$/i);
    if (prepositionMatch) {
      const servicePart = prepositionMatch[1].trim();
      const locationPart = prepositionMatch[3].trim();
      if (servicePart && locationPart) {
        setServiceQuery(servicePart);
        searchServices(servicePart);
        setLocationQuery(locationPart);
        setSavedLocation(locationPart);
        searchLocations(locationPart);
        return;
      }
    }

    // Pattern 2: "service StateName" or "service StateAbbr"
    // (e.g. "dj mississippi", "dj ms", "caterers tx")
    const { SEO_STATES } = await import('@/data/seo-locations');
    const words = trimmed.split(/\s+/);
    if (words.length >= 2) {
      const lastWord = words[words.length - 1];
      const lastTwoWords = words.length >= 3 ? words.slice(-2).join(' ') : '';

      // Check two-word states first (e.g. "New York", "North Dakota")
      if (lastTwoWords) {
        const twoWordMatch = SEO_STATES.find(
          s => s.name.toLowerCase() === lastTwoWords.toLowerCase()
        );
        if (twoWordMatch) {
          const servicePart = words.slice(0, -2).join(' ');
          if (servicePart) {
            setServiceQuery(servicePart);
            searchServices(servicePart);
            setLocationQuery(twoWordMatch.name);
            setSavedLocation(twoWordMatch.name);
            searchLocations(twoWordMatch.name);
            return;
          }
        }
      }

      // Single-word state match (name or abbreviation)
      const stateMatch = SEO_STATES.find(
        s => s.name.toLowerCase() === lastWord.toLowerCase() ||
             s.abbr.toLowerCase() === lastWord.toLowerCase()
      );
      if (stateMatch) {
        const servicePart = words.slice(0, -1).join(' ');
        if (servicePart) {
          setServiceQuery(servicePart);
          searchServices(servicePart);
          setLocationQuery(stateMatch.name);
          setSavedLocation(stateMatch.name);
          searchLocations(stateMatch.name);
          return;
        }
      }
    }
  }, [locationQuery, searchServices, searchLocations, setSavedLocation]);

  // ── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setShowServiceDropdown(false);
        setActiveServiceIndex(-1);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
        setActiveLocationIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Selection handlers ──────────────────────────────────────────────────
  function handleServiceSelect(result: ServiceResult) {
    setServiceQuery(result.name.replace(/\s+(In|Near|By)\s*$/i, ''));
    setShowServiceDropdown(false);
    setActiveServiceIndex(-1);
  }

  function handleLocationSelect(result: LocationResult) {
    const displayName = result.displayName;
    setLocationQuery(displayName);
    setSavedLocation(displayName);
    setShowLocationDropdown(false);
    setActiveLocationIndex(-1);
  }

  function handleAcceptDetected() {
    if (detectedCity) {
      setLocationQuery(detectedCity);
      setSavedLocation(detectedCity);
      setDetectedCity(null);
    }
  }

  // ── Search execution ────────────────────────────────────────────────────
  async function handleSearch() {
    // Resolve service slug
    const { SEO_SERVICE_PATTERNS } = await import('@/data/seo-pages');
    const serviceSlug =
      serviceResults[0]?.slug ??
      SEO_SERVICE_PATTERNS.find(p =>
        p.name.toLowerCase() === serviceQuery.toLowerCase() ||
        p.name.toLowerCase().includes(serviceQuery.toLowerCase())
      )?.slug ??
      'event-planners-in';

    let locationSlug: string | null = null;

    // From autocomplete results
    if (locationResults.length > 0) {
      locationSlug = locationResults[0].slug;
    }

    // Exact city/state match
    if (!locationSlug) {
      const { SEO_LOCATIONS } = await import('@/data/seo-locations');
      const exact = SEO_LOCATIONS.find(
        l => l.city.toLowerCase() === locationQuery.toLowerCase() ||
             l.displayName.toLowerCase() === locationQuery.toLowerCase()
      );
      if (exact) locationSlug = exact.slug;
    }

    // Zip code exact match
    if (!locationSlug && /^\d{5}$/.test(locationQuery.trim())) {
      const { SEO_LOCATIONS } = await import('@/data/seo-locations');
      const zipMatch = SEO_LOCATIONS.find(l => l.zipCodes.includes(locationQuery.trim()));
      if (zipMatch) locationSlug = zipMatch.slug;
    }

    // State match - prefer primary city, then state capital, then first city
    if (!locationSlug) {
      const { SEO_STATES, SEO_LOCATIONS } = await import('@/data/seo-locations');
      const stateMatch = SEO_STATES.find(
        s => s.abbr.toLowerCase() === locationQuery.toLowerCase() ||
             s.name.toLowerCase() === locationQuery.toLowerCase()
      );
      if (stateMatch) {
        const stateCities = SEO_LOCATIONS.filter(l => l.state === stateMatch.abbr);
        const primaryCity = stateCities.find(l => l.primary);
        const capitalCity = STATE_CAPITALS[stateMatch.abbr]
          ? stateCities.find(l => l.city.toLowerCase() === STATE_CAPITALS[stateMatch.abbr]!.toLowerCase())
          : undefined;
        const bestCity = primaryCity ?? capitalCity ?? stateCities[0];
        if (bestCity) locationSlug = bestCity.slug;
      }
    }

    // Save location to store before navigating
    if (locationQuery) {
      setSavedLocation(locationQuery);
    }

    if (onSearch) {
      onSearch(serviceSlug, locationSlug);
    } else if (locationSlug) {
      router.push(`/seo/${serviceSlug}/${locationSlug}`);
    } else {
      router.push(`/seo/${serviceSlug}`);
    }
  }

  // ── Geolocation (manual click on map pin or "Use my location" button) ──
  async function handleGeolocate() {
    setGeoLoading(true);
    try {
      if ('geolocation' in navigator) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            maximumAge: 300_000,
          });
        });
        setSavedCoords(pos.coords.latitude, pos.coords.longitude);
        const res = await fetch(`/api/geolocation?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
        if (res.ok) {
          const data = await res.json();
          if (data.slug) {
            const displayName = data.displayName;
            setLocationQuery(displayName);
            setSavedLocation(displayName);
            setDetectedCity(null);
          }
        }
      } else {
        const res = await fetch('/api/geolocation');
        if (res.ok) {
          const data = await res.json();
          if (data.slug) {
            const displayName = data.displayName;
            setLocationQuery(displayName);
            setSavedLocation(displayName);
            setDetectedCity(null);
          }
        }
      }
    } catch { /* optional */ } finally {
      setGeoLoading(false);
    }
  }

  // ── Keyboard navigation ─────────────────────────────────────────────────
  function handleServiceKeyDown(e: React.KeyboardEvent) {
    if (!showServiceDropdown || serviceResults.length === 0) {
      if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveServiceIndex(prev => prev < serviceResults.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveServiceIndex(prev => prev > 0 ? prev - 1 : serviceResults.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeServiceIndex >= 0 && activeServiceIndex < serviceResults.length) {
          handleServiceSelect(serviceResults[activeServiceIndex]);
        } else { handleSearch(); }
        break;
      case 'Escape':
        setShowServiceDropdown(false);
        setActiveServiceIndex(-1);
        break;
    }
  }

  function handleLocationKeyDown(e: React.KeyboardEvent) {
    if (!showLocationDropdown || locationResults.length === 0) {
      if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveLocationIndex(prev => prev < locationResults.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveLocationIndex(prev => prev > 0 ? prev - 1 : locationResults.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeLocationIndex >= 0 && activeLocationIndex < locationResults.length) {
          handleLocationSelect(locationResults[activeLocationIndex]);
        } else { handleSearch(); }
        break;
      case 'Escape':
        setShowLocationDropdown(false);
        setActiveLocationIndex(-1);
        break;
    }
  }

  // ── Sizing classes ──────────────────────────────────────────────────────
  const isHero = variant === 'hero';
  const formRounded = isHero ? 'rounded-2xl' : 'rounded-xl';
  const inputBg = 'bg-gray-50';
  const inputRounded = isHero ? 'rounded-xl' : 'rounded-lg';
  const iconSize = isHero ? 'w-6 h-6' : 'w-5 h-5';
  const textSize = isHero ? 'text-lg' : 'text-sm';
  const pySize = isHero ? 'py-4' : 'py-3';
  const btnPx = isHero ? 'px-10' : 'px-6';
  const btnPy = isHero ? 'py-5' : 'py-3';
  const btnText = isHero ? 'text-lg' : 'text-sm';
  const maxW = isHero ? 'max-w-4xl' : 'max-w-3xl';

  const typeBadge: Record<string, string> = {
    city: 'bg-coral/10 text-coral',
    state: 'bg-orange-50 text-orange-600',
    zip: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="w-full">
      {/* ── Auto-detected location badge ────────────────────────────────── */}
      {detectedCity && !locationQuery && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <Locate className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-500">Detected:</span>
          <button
            type="button"
            onClick={handleAcceptDetected}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            {detectedCity}
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className={`bg-white ${formRounded} p-2 flex flex-col md:flex-row gap-2 shadow-2xl ${maxW} mx-auto relative z-30`}
      >
        {/* ── Service input ──────────────────────────────────────────────── */}
        <div ref={serviceRef} className="relative flex-1 min-w-0">
          <div className={`flex items-center gap-3 px-5 ${pySize} ${inputBg} ${inputRounded} focus-within:border-coral border border-transparent transition-colors`}>
            <Search className={`${iconSize} text-coral shrink-0`} />
            <input
              type="text"
              value={serviceQuery}
              onChange={(e) => {
                const val = e.target.value;
                searchServices(val);
                parseAndSplitQuery(val);
              }}
              onFocus={() => {
                if (serviceQuery.trim().length > 0 && serviceResults.length > 0) {
                  setShowServiceDropdown(true);
                }
              }}
              onKeyDown={handleServiceKeyDown}
              placeholder="e.g. DJ, Wedding Venue, Caterer..."
              className={`bg-transparent w-full outline-none text-black font-semibold placeholder-gray-400 ${textSize}`}
              autoComplete="off"
            />
          </div>

          {showServiceDropdown && serviceResults.length > 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              {serviceResults.map((r, idx) => (
                <button
                  key={r.slug}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleServiceSelect(r); }}
                  onMouseEnter={() => setActiveServiceIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    idx === activeServiceIndex ? 'bg-coral/10 text-coral' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{r.name.replace(/\s+(In|Near|By)\s*$/i, '')}</span>
                  <span className="text-xs text-gray-400 ml-2 capitalize">
                    {r.category.replace(/-/g, ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Location input ──────────────────────────────────────────────── */}
        <div ref={locationRef} className="relative flex-1 min-w-0">
          <div className={`flex items-center gap-3 px-5 ${pySize} ${inputBg} ${inputRounded} focus-within:border-coral border border-transparent transition-colors`}>
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={geoLoading}
              className="shrink-0"
              title="Use my location"
            >
              {geoLoading ? (
                <Loader2 className={`${iconSize} text-orange-500 animate-spin`} />
              ) : (
                <MapPin className={`${iconSize} text-orange-500`} />
              )}
            </button>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => searchLocations(e.target.value)}
              onFocus={() => {
                if (locationQuery.trim().length > 0 && locationResults.length > 0) {
                  setShowLocationDropdown(true);
                }
              }}
              onKeyDown={handleLocationKeyDown}
              placeholder={indexReady ? "City, State or Zip Code" : "Loading locations..."}
              className={`bg-transparent w-full outline-none text-black font-semibold placeholder-gray-400 ${textSize}`}
              autoComplete="off"
              disabled={!indexReady}
            />
            {/* ── Use my location button ──────────────────────────────────── */}
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={geoLoading}
              className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
              title="Use my current location"
            >
              <Navigation className="w-3.5 h-3.5" />
              {isHero && <span className="hidden sm:inline">Locate</span>}
            </button>
          </div>

          {showLocationDropdown && locationResults.length > 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              {locationResults.map((r, idx) => (
                <button
                  key={`${r.slug}-${r.type}-${idx}`}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleLocationSelect(r); }}
                  onMouseEnter={() => setActiveLocationIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    idx === activeLocationIndex ? 'bg-orange-50 text-orange-700' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.displayName}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeBadge[r.type] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.type}
                    </span>
                  </div>
                  {r.type === 'zip' && r.zipPreview && (
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      Zip{r.zipPreview.includes(',') ? 's' : ''}: {r.zipPreview}
                    </span>
                  )}
                  {r.type === 'state' && (
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      Browse {r.state} locations
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Search button ────────────────────────────────────────────────── */}
        <button
          type="submit"
          className={`bg-teal-600 hover:bg-teal-700 text-white font-bold ${btnPx} ${btnPy} ${inputRounded} transition-colors md:w-auto w-full ${btnText} shadow-md shrink-0`}
        >
          Search
        </button>
      </form>
    </div>
  );
}
