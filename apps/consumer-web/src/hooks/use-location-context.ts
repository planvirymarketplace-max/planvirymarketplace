'use client'

import { useEffect } from 'react'
import { useLocationStore } from '@/lib/store'

export function useLocationContext() {
  const { location, setLocation, setCoords } = useLocationStore()

  useEffect(() => {
    if (location) return
    let cancelled = false

    async function detectLocation() {
      try {
        const res = await fetch('/api/geolocation')
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (data && data.city) {
          const cityState = data.state ? `${data.city}, ${data.state}` : data.city
          setLocation(cityState)
          if (data.lat && data.lng) setCoords(data.lat, data.lng)
        }
      } catch {}
    }

    detectLocation()
    return () => { cancelled = true }
  }, [location, setLocation, setCoords])

  return useLocationStore()
}
