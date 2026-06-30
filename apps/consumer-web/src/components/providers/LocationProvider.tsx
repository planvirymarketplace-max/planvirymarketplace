'use client'

import { useLocationContext } from '@/hooks/use-location-context'

export function LocationProvider({ children }: { children: React.ReactNode }) {
  useLocationContext()
  return <>{children}</>
}
