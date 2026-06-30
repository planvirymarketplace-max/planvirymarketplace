'use client'

/**
 * AlgoliaSearch - Reusable search component powered by Algolia.
 *
 * Uses `algoliasearch/lite` for the search client and reads config
 * from `@/lib/algolia.ts` via `getBrowserSearchConfig()`.
 *
 * Features:
 * - Search box with instant results
 * - Faceted filters (category, city, state)
 * - Hit display with vendor cards
 * - Pagination
 *
 * Usage: Drop into any page component:
 *   <AlgoliaSearch initialQuery="DJ" initialFilters={{ vertical: 'entertainment' }} />
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import algoliasearch from 'algoliasearch/lite'
import { getBrowserSearchConfig, type AlgoliaVendorHit } from '@/lib/algolia'
import {
  Search, X, Star, MapPin, Building2, SlidersHorizontal,
  ChevronDown, ChevronUp, Loader2, ArrowRight,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface AlgoliaSearchProps {
  /** Pre-populate the search query */
  initialQuery?: string
  /** Pre-select facet filters */
  initialFilters?: {
    category?: string
    city?: string
    state?: string
    vertical?: string
  }
  /** Placeholder text for the search input */
  placeholder?: string
  /** Max number of hits per page */
  hitsPerPage?: number
  /** CSS class for the outermost container */
  className?: string
}

interface SearchState {
  query: string
  hits: AlgoliaVendorHit[]
  nbHits: number
  page: number
  nbPages: number
  facets: Record<string, Record<string, number>>
  isLoading: boolean
  error: string | null
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AlgoliaSearch({
  initialQuery = '',
  initialFilters = {},
  placeholder = 'Search vendors, categories, cities...',
  hitsPerPage = 12,
  className = '',
}: AlgoliaSearchProps) {
  // Algolia client
  const [client, setClient] = useState<ReturnType<typeof algoliasearch> | null>(null)
  const [index, setIndex] = useState<ReturnType<ReturnType<typeof algoliasearch>['initIndex']> | null>(null)

  // Search state
  const [state, setState] = useState<SearchState>({
    query: initialQuery,
    hits: [],
    nbHits: 0,
    page: 0,
    nbPages: 0,
    facets: {},
    isLoading: false,
    error: null,
  })

  // Facet filter selections
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string
    city: string
    state: string
    vertical: string
  }>({
    category: initialFilters.category ?? '',
    city: initialFilters.city ?? '',
    state: initialFilters.state ?? '',
    vertical: initialFilters.vertical ?? '',
  })

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize Algolia client
  useEffect(() => {
    try {
      const config = getBrowserSearchConfig()
      if (!config.appId || !config.apiKey) {
        console.warn('[AlgoliaSearch] Missing Algolia credentials')
        return
      }
      const c = algoliasearch(config.appId, config.apiKey)
      const i = c.initIndex(config.indexName)
      setClient(c)
      setIndex(i)
    } catch (err) {
      console.error('[AlgoliaSearch] Failed to initialize:', err)
    }
  }, [])

  // Perform search
  const performSearch = useCallback(async (
    query: string,
    filters: typeof selectedFilters,
    page: number = 0,
  ) => {
    if (!index) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const facetFilters: string[] = []
      if (filters.category) facetFilters.push(`category:${filters.category}`)
      if (filters.city) facetFilters.push(`city:${filters.city}`)
      if (filters.state) facetFilters.push(`state:${filters.state}`)
      if (filters.vertical) facetFilters.push(`vertical_slug:${filters.vertical}`)

      const result = await index.search(query, {
        facetFilters,
        page,
        hitsPerPage,
        facets: ['category', 'city', 'state', 'vertical_slug'],
      })

      setState({
        query,
        hits: result.hits as unknown as AlgoliaVendorHit[],
        nbHits: result.nbHits,
        page: result.page,
        nbPages: result.nbPages,
        facets: (result.facets ?? {}) as Record<string, Record<string, number>>,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      }))
    }
  }, [index, hitsPerPage])

  // Debounced search on query change
  useEffect(() => {
    if (!index) return

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(state.query, selectedFilters, 0)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [state.query, selectedFilters, index, performSearch])

  // Handle filter change
  const handleFilterChange = useCallback((facet: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facet]: prev[facet as keyof typeof prev] === value ? '' : value,
    }))
  }, [])

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    performSearch(state.query, selectedFilters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [state.query, selectedFilters, performSearch])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilters({ category: '', city: '', state: '', vertical: '' })
  }, [])

  // Check if any filter is active
  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== '')

  return (
    <div className={className}>
      {/* ── Search Bar ── */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={state.query}
              onChange={e => setState(prev => ({ ...prev, query: e.target.value }))}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 bg-white text-black text-sm focus:outline-none focus:border-black transition-colors rounded-lg"
            />
            {state.query && (
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, query: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
              hasActiveFilters
                ? 'border-black bg-black text-white'
                : 'border-gray-200 text-gray-700 hover:border-black'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </button>
        </div>
      </div>

      {/* ── Facet Filters Panel ── */}
      {showFilters && (
        <div className="mt-4 p-5 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">
              Filter Results
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <FilterSelect
              label="Category"
              facetKey="category"
              options={state.facets.category ?? {}}
              selected={selectedFilters.category}
              onChange={handleFilterChange}
            />

            {/* City Filter */}
            <FilterSelect
              label="City"
              facetKey="city"
              options={state.facets.city ?? {}}
              selected={selectedFilters.city}
              onChange={handleFilterChange}
            />

            {/* State Filter */}
            <FilterSelect
              label="State"
              facetKey="state"
              options={state.facets.state ?? {}}
              selected={selectedFilters.state}
              onChange={handleFilterChange}
            />

            {/* Vertical Filter */}
            <FilterSelect
              label="Vertical"
              facetKey="vertical_slug"
              options={state.facets.vertical_slug ?? {}}
              selected={selectedFilters.vertical}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      )}

      {/* ── Results Summary ── */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {state.isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </span>
          ) : state.nbHits > 0 ? (
            <>
              <strong className="text-black">{state.nbHits.toLocaleString()}</strong> vendor{state.nbHits !== 1 ? 's' : ''} found
              {state.query && (
                <> for &ldquo;<strong className="text-black">{state.query}</strong>&rdquo;</>
              )}
            </>
          ) : state.query ? (
            <>No vendors found for &ldquo;{state.query}&rdquo;</>
          ) : null}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(selectedFilters).map(([key, value]) =>
              value ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFilterChange(key, value)}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {value}
                  <X size={10} />
                </button>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {state.error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {/* ── Hit Display ── */}
      {state.hits.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.hits.map(hit => (
            <HitCard key={hit.objectID} hit={hit} query={state.query} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!state.isLoading && state.nbHits === 0 && state.query && (
        <div className="mt-10 text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <Search size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm mb-2">No vendors found matching your search.</p>
          <p className="text-gray-400 text-xs">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* ── Pagination ── */}
      {state.nbPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(state.page - 1)}
            disabled={state.page === 0}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-black transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(state.nbPages, 7) }, (_, i) => {
              // Show pages around current page
              let pageNum: number
              if (state.nbPages <= 7) {
                pageNum = i
              } else if (state.page < 3) {
                pageNum = i
              } else if (state.page > state.nbPages - 4) {
                pageNum = state.nbPages - 7 + i
              } else {
                pageNum = state.page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    pageNum === state.page
                      ? 'bg-black text-white'
                      : 'border border-gray-200 hover:border-black text-gray-700'
                  }`}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => handlePageChange(state.page + 1)}
            disabled={state.page >= state.nbPages - 1}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-black transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Filter Select Component ────────────────────────────────────────────────

function FilterSelect({
  label,
  facetKey,
  options,
  selected,
  onChange,
}: {
  label: string
  facetKey: string
  options: Record<string, number>
  selected: string
  onChange: (facetKey: string, value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const entries = Object.entries(options).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-black transition-colors"
      >
        <span className={selected ? 'text-black font-medium' : 'text-gray-500'}>
          {selected || label}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">No options available</div>
          ) : (
            <>
              {selected && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(facetKey, selected) // deselect
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 border-b border-gray-100"
                >
                  Clear selection
                </button>
              )}
              {entries.map(([value, count]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onChange(facetKey, value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    selected === value ? 'font-medium text-black bg-gray-50' : 'text-gray-700'
                  }`}
                >
                  <span>{value}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Highlighted Text (declared outside render to avoid state reset) ────────

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

// ─── Hit Card Component ─────────────────────────────────────────────────────

function HitCard({ hit, query }: { hit: AlgoliaVendorHit; query: string }) {
  const fullStars = Math.round(hit.rating)

  return (
    <Link href={`/vendors/${hit.slug}`} className="group block">
      <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-black transition-all rounded-lg">
        {/* Image */}
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {hit.image_url ? (
            <img
              src={hit.image_url}
              alt={hit.business_name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Building2 size={32} className="text-gray-300" />
            </div>
          )}
          {hit.is_verified && (
            <span className="absolute top-2 right-2 bg-white text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black/10 rounded">
              Verified
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-0.5 self-start rounded">
            <HighlightedText text={hit.sub_category || hit.category} query={query} />
          </span>
          <h3 className="text-sm font-bold text-black leading-snug group-hover:underline">
            <HighlightedText text={hit.business_name} query={query} />
          </h3>
          {hit.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < fullStars ? 'fill-black text-black' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-black">{hit.rating.toFixed(1)}</span>
              {hit.review_count > 0 && (
                <span className="text-xs text-gray-500">({hit.review_count})</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} />
            <span>
              <HighlightedText text={hit.city} query={query} />{', '}
              <HighlightedText text={hit.state} query={query} />
            </span>
          </div>
          {hit.price_range && (
            <span className="text-[10px] font-bold text-black border border-black px-2 py-0.5 self-start rounded">
              {hit.price_range}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
