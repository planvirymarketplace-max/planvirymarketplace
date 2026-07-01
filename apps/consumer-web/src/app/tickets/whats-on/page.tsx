'use client'

import React, { useEffect, useState } from 'react'
import { ShowListing } from '@/components/ticketing/show-listing'
import { Show, ShowStatus } from '@/lib/types/eventseats'

interface ApiShow {
  id: string
  title: string
  slug: string
  description?: string
  imageUrl?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  status: string
  performances: {
    id: string
    dateTime: string
    isMatinee: boolean
    notes?: string
  }[]
}

// Converting API shows to the Show interface format
const convertApiShowToShow = (apiShow: ApiShow): Show => ({
  id: apiShow.id,
  title: apiShow.title,
  slug: apiShow.slug,
  description: apiShow.description || '',
  imageUrl: apiShow.imageUrl || '',
  genre: apiShow.genre || '',
  duration: apiShow.duration || 120,
  ageRating: apiShow.ageRating || 'PG',
  warnings: undefined,
  adultPrice: apiShow.adultPrice,
  childPrice: apiShow.childPrice,
  concessionPrice: apiShow.concessionPrice,
  status: apiShow.status as ShowStatus,
  organizationId: '1', // Default for now
  venueId: '1', // Default for now
  seatingLayoutId: '1', // Default for now
  createdAt: new Date(),
  updatedAt: new Date(),
  performances: apiShow.performances.map(p => ({
    id: p.id,
    dateTime: new Date(p.dateTime),
    isMatinee: p.isMatinee,
    showId: apiShow.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: []
  }))
})

export default function WhatsOnPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch settings and shows in parallel
        const [settingsResponse, showsResponse] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/shows?published=true')
        ])

        const settingsData = await settingsResponse.json()
        const showsData = await showsResponse.json()

        if (settingsData.success) {
          setSettings(settingsData.data)
        }

        if (showsData.success) {
          const convertedShows = showsData.data.map(convertApiShowToShow)
          setShows(convertedShows)
        } else {
          setError(showsData.error || 'Failed to fetch shows')
        }
      } catch (err) {
        setError('Error fetching data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBookShow = (showId: string, performanceId: string) => {
    console.log('Book show:', { showId, performanceId })
    // Navigate to booking page
    window.location.href = `/book/${showId}/${performanceId}`
  }

  // SIDEBAR-4: standalone EventSeats header/footer stripped — /tickets/layout.tsx
  // provides the Planviry AppLayoutShell (sidebar + global nav + SiteFooter).
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'color-mix(in srgb, var(--highlight) 6%, white)' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
          </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">Error loading shows</h3>
            <p className="text-red-600 mt-1">{error}</p>
             <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ShowListing
            shows={shows}
            onBookShow={handleBookShow}
          />
        )}
      </main>
    </div>
  )
}
