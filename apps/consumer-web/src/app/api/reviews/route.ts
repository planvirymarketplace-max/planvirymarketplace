import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/reviews?vendor_id=xxx
 *
 * Return approved reviews for a given vendor.
 * Uses admin client for public review display.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendor_id')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendor_id query parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, rating, title, body, is_approved, vendor_response, vendor_responded_at, created_at')
      .eq('vendor_id', vendorId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Supabase error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: (reviews || []).length,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
