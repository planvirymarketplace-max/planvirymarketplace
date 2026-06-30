'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

/**
 * Drop-in replacement for the hash-based navigate function.
 * Uses Next.js App Router under the hood.
 * Keeps the same `(path: string) => void` signature that all page components expect.
 */
export function useAppNavigate(): (path: string) => void {
  const router = useRouter()

  return useCallback((path: string) => {
    // Support paths with query params like "/vendor?slug=foo"
    router.push(path)
  }, [router])
}

/**
 * Get current URL search params (replaces getHashQueryParams)
 */
export function useUrlQueryParams(): Record<string, string> {
  const searchParams = useSearchParams()
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}
