'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/ticketing/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Booking, Performance } from '@/lib/types/eventseats'

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  upcomingShows: number
  checkedInToday: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    upcomingShows: 0,
    checkedInToday: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [upcomingPerformances, setUpcomingPerformances] = useState<Performance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    // Load dashboard data
    loadDashboardData()
  }, [status, router])

    const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch comprehensive admin dashboard data
      const dashboardResponse = await fetch('/api/admin-dashboard')
      const dashboardData = await dashboardResponse.json()

      if (dashboardData.success) {
        // Set stats from the response
        setStats(dashboardData.data.stats)

        // Set recent bookings with proper formatting
        setRecentBookings(dashboardData.data.recentBookings.map((booking: any) => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          totalAmount: booking.totalAmount,
          bookingFee: booking.bookingFee,
          status: booking.status,
          customerId: booking.customer?.id || '',
          customer: booking.customer ? {
            id: booking.customer.id,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
            phone: booking.customer.phone,
            emailOptIn: true,
            smsOptIn: false,
            country: 'GB',
            createdAt: new Date(),
            updatedAt: new Date(),
            bookings: []
          } : null,
          showId: booking.show?.id || '',
          show: booking.show ? {
            id: booking.show.id,
            title: booking.show.title,
            slug: '',
            adultPrice: 25,
            childPrice: 15,
            concessionPrice: 20,
            status: 'PUBLISHED',
            organizationId: '',
            venueId: '',
            seatingLayoutId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            performances: []
          } : null,
          performanceId: booking.performance?.id || '',
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.createdAt),
          bookingItems: []
        })))

        // Set upcoming performances with booking data
        setUpcomingPerformances(dashboardData.data.upcomingPerformances.map((perf: any) => ({
          id: perf.id,
          dateTime: new Date(perf.dateTime),
          isMatinee: perf.isMatinee,
          notes: perf.notes,
          showId: perf.show.id,
          show: {
            id: perf.show.id,
            title: perf.show.title
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          bookings: perf.bookings || []
        })))

        console.log('📊 Dashboard data loaded:', {
          stats: dashboardData.data.stats,
          recentBookings: dashboardData.data.recentBookings.length,
          upcomingPerformances: dashboardData.data.upcomingPerformances.length
        })
      } else {
        console.error('Failed to fetch dashboard data:', dashboardData.error)
        // Fallback to empty data
        setStats({
          totalBookings: 0,
          totalRevenue: 0,
          upcomingShows: 0,
          checkedInToday: 0
        })
        setRecentBookings([])
        setUpcomingPerformances([])
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        upcomingShows: 0,
        checkedInToday: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}`)
  }

  const handleViewPerformance = (performanceId: string) => {
    router.push(`/admin/shows?performance=${performanceId}`)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Redirecting...
  }

  // SIDEBAR-4: standalone EventSeats header + sub-nav stripped — /tickets/layout.tsx
  // provides the Planviry AppLayoutShell (sidebar + global nav + SiteFooter).
  // useSession auth logic + redirect to /admin/login left intact.
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard
          stats={stats}
          recentBookings={recentBookings}
          upcomingPerformances={upcomingPerformances}
          onViewBooking={handleViewBooking}
          onViewPerformance={handleViewPerformance}
        />
      </main>
    </div>
  )
}