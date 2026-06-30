import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/admin/stats — Dashboard statistics
 *
 * Aggregates counts across the marketplace. Uses admin client
 * (service role) to bypass RLS.
 */
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Run all independent count queries in parallel
    const [
      totalVendors,
      totalUsers,
      totalBookings,
      pendingClaims,
      totalReviews,
      publishedVendors,
      featuredVendors,
      verifiedVendors,
      approvedReviews,
      pendingReviews,
    ] = await Promise.all([
      supabase.from('vendor_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase
        .from('claim_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase
        .from('vendor_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('vendor_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true),
      supabase
        .from('vendor_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true),
      supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('moderation_status', 'approved'),
      supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('moderation_status', 'pending'),
    ])

    return NextResponse.json({
      stats: {
        totalVendors: totalVendors.count ?? 0,
        totalUsers: totalUsers.count ?? 0,
        totalBookings: totalBookings.count ?? 0,
        pendingClaims: pendingClaims.count ?? 0,
        totalReviews: totalReviews.count ?? 0,
        publishedVendors: publishedVendors.count ?? 0,
        featuredVendors: featuredVendors.count ?? 0,
        verifiedVendors: verifiedVendors.count ?? 0,
        approvedReviews: approvedReviews.count ?? 0,
        pendingReviews: pendingReviews.count ?? 0,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
