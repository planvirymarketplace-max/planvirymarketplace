import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/stats
 *
 * Return marketplace stats: total vendors, categories, reviews.
 * Uses admin client.
 */
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Run counts in parallel
    const [vendorsRes, categoriesRes, reviewsRes, groupsRes] = await Promise.all([
      supabase
        .from('vendor_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('vendor_categories')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('is_approved', true),
      supabase
        .from('vendor_category_groups')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
    ])

    const totalVendors = vendorsRes.count || 0
    const totalCategories = categoriesRes.count || 0
    const totalReviews = reviewsRes.count || 0
    const totalGroups = groupsRes.count || 0

    return NextResponse.json({
      totalVendors,
      totalCategories,
      totalReviews,
      totalGroups,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
