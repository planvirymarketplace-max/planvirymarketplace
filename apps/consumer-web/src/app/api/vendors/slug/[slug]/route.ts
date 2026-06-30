import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/vendors/slug/[slug]
 *
 * Fetches a single vendor by slug with reviews, gallery, and socials.
 * Uses admin client (service role) to bypass RLS so any vendor can be
 * looked up regardless of published status.
 *
 * Mapped from Prisma `db.vendor.findUnique({ where: { slug }, include: { reviews, socials, gallery } })`.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = createAdminClient()

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Fetch related data in parallel
    const [reviewsResult, galleryResult, listingResult, categoryResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('id, rating, body, created_at')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('vendor_portfolios')
        .select('id, media_url, caption, sort_order')
        .eq('vendor_id', vendor.id)
        .order('sort_order', { ascending: true }),
      vendor.listing_id
        ? supabase.from('listings').select('*').eq('id', vendor.listing_id).single()
        : Promise.resolve({ data: null }),
      vendor.category_id
        ? supabase.from('categories').select('name').eq('id', vendor.category_id).single()
        : Promise.resolve({ data: null }),
    ])

    const reviews = reviewsResult.data || []
    const gallery = galleryResult.data || []
    const listing = listingResult.data as Record<string, unknown> | null
    const category = categoryResult.data as { name?: string } | null

    // Parse JSON / array fields defensively
    let serviceAreas: string[] = []
    try {
      const raw = (vendor as Record<string, unknown>).service_areas
      if (Array.isArray(raw)) serviceAreas = raw as string[]
      else if (typeof raw === 'string') serviceAreas = JSON.parse(raw)
    } catch { serviceAreas = [] }

    let tags: string[] = []
    try {
      const raw = listing?.tags
      if (Array.isArray(raw)) tags = raw as string[]
      else if (typeof raw === 'string') tags = JSON.parse(raw)
    } catch { tags = [] }

    const socialLinks =
      ((vendor as Record<string, unknown>).social_links as Record<string, string>) ?? {}
    const socials = Object.entries(socialLinks).map(([platform, url]) => ({
      platform,
      url: url as string,
    }))

    const address = listing
      ? [listing.city, listing.state].filter(Boolean).join(', ')
      : null

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0

    const v = vendor as Record<string, unknown>
    const vendorDetail = {
      id: v.id,
      name: v.business_name,
      slug: v.slug,
      category: category?.name || (v.category_id as string) || '',
      address,
      phone: (v.contact_phone as string) || null,
      website: (v.website as string) || null,
      email: (v.contact_email as string) || null,
      bio: (v.bio as string) || null,
      logoUrl: (v.logo_url as string) || null,
      coverUrl: (v.hero_image_url as string) || null,
      priceRange: '$$', // Not directly available on vendors table
      serviceAreas,
      tags,
      capacity: null,
      isFeatured: false,
      isVerified:
        v.kyc_status === 'verified' || v.kyb_status === 'verified',
      isClaimed: (listing?.is_claimed as boolean) ?? false,
      isPublished: Boolean(v.profile_published),
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      gallery: gallery.map((g: Record<string, unknown>) => ({
        id: g.id,
        url: g.media_url,
        caption: g.caption,
      })),
      socials,
      reviews: reviews.map((r: Record<string, unknown>) => ({
        id: r.id,
        rating: r.rating,
        body: r.body,
        createdAt: r.created_at,
      })),
    }

    return NextResponse.json({ vendor: vendorDetail })
  } catch (error) {
    console.error('Error fetching vendor by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}
