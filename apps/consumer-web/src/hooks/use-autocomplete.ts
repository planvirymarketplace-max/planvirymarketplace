'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface AutocompleteResult {
  label: string
  slug: string
  seoSlug: string | null
  categoryKey: string | null
  categorySlug: string | null
  neighborhood: string | null
  eventType: string | null
  weight: string
  href: string
}

interface UseAutocompleteOptions {
  debounceMs?: number
  limit?: number
  neighborhood?: string | null
  categoryKey?: string | null
}

export function useAutocomplete(query: string, opts: UseAutocompleteOptions = {}) {
  const { debounceMs = 180, limit = 8, neighborhood, categoryKey } = opts
  const [results, setResults] = useState<AutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setIsLoading(false); return }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    try {
      const params = new URLSearchParams({ q, limit: String(limit) })
      if (neighborhood) params.set('neighborhood', neighborhood)
      if (categoryKey) params.set('category_key', categoryKey)

      const res = await fetch(`/api/autocomplete?${params}`, { signal: abortRef.current.signal })
      if (!res.ok) return
      const json = await res.json()
      setResults(json.results ?? [])
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [limit, neighborhood, categoryKey])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query || query.length < 2) { setResults([]); return }
    timerRef.current = setTimeout(() => fetchResults(query), debounceMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, debounceMs, fetchResults])

  const clear = useCallback(() => setResults([]), [])

  return { results, isLoading, clear }
}
