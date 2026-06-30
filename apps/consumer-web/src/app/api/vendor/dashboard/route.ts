import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/vendor/dashboard?vendorId=xxx
 *
 * Returns vendor dashboard stats. Uses admin client to bypass RLS.
 *
 * Mapped from Prisma:
 *   db.vendor.findUnique({
 *     where: { id: vendorId },
 *     include: { vendorProfile, reviews, claimRequests, savedBy }
 *   })
 */
export async function GET(req: NextRequest) {
  try {
    const vendorId = req.nextUrl.searchParams.get('vendorId')
    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendorId required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single()

    if (error || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const v = vendor as Record<string, unknown>

    // Compute stats
    const now = new Date()
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    ).toISOString()

    // Fetch reviews, pending claim_requests, and saved-by count in parallel
    const [reviewsResult, claimsResult, savedByResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('id, rating')
        .eq('vendor_id', vendorId),
      supabase
        .from('claim_requests')
        .select('id, created_at')
        .eq('vendor_id', vendorId)
        .gte('created_at', thirtyDaysAgo),
      // "savedBy" is proxied via saved_searches where filters->>vendor_id = vendorId
      supabase
        .from('saved_searches')
        .select('id', { count: 'exact', head: true })
        .eq('filters->>vendor_id', vendorId),
    ])

    const reviews = reviewsResult.data ?? []
    const recentLeads = claimsResult.data?.length ?? 0
    const profileViews = savedByResult.count ?? 0
    const totalSaved = savedByResult.count ?? 0

    const avgRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce(
              (sum, r) => sum + (((r as Record<string, unknown>).rating as number) || 0),
              0
            ) /
              reviews.length) *
              10
          ) / 10
        : 0

    // Plan from vendor profile (if available) — fall back to 'free'
    let plan = 'free'
    if (v.listing_id) {
      const { data: vendorProfile } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('id', v.listing_id)
        .maybeSingle()
      if (vendorProfile) {
        // vendor_profiles doesn't expose a `plan` column directly; default to 'free'
        plan = 'free'
      }
    }

    return NextResponse.json({
      vendor: {
        id: v.id,
        name: v.business_name,
        slug: v.slug,
        category: v.category_id || '',
        plan,
        isVerified:
          v.kyc_status === 'verified' || v.kyb_status === 'verified',
        isFeatured: false,
      },
      stats: {
        leadsThisMonth: recentLeads,
        totalReviews: reviews.length,
        avgRating,
        profileViews,
        totalSaved,
      },
    })
  } catch (error) {
    console.error('Error fetching vendor dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
