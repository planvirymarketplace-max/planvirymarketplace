import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/vendor-profile/by-user?userId=xxx
 *
 * Returns vendor profiles owned by a user. Maps the original Prisma
 * `db.vendorProfile.findMany({ where: { userId }, select: { ... vendor: { ... } } })`.
 *
 * In the live Supabase schema, vendor ownership is tracked on the
 * `vendors` table via `user_id` (and optionally via the `vendor_users`
 * join table for multi-user vendor accounts). We query `vendors`
 * directly and join `listings` for profile data when available.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      )
    }

    // Validate UUID format (Supabase user_id is uuid)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid userId format (expected UUID)' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vendor profiles:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch vendor profile' },
        { status: 500 }
      )
    }

    if (!vendors || vendors.length === 0) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Fetch listings in parallel for each vendor
    const listingIds = vendors
      .map((v) => (v as Record<string, unknown>).listing_id)
      .filter((id): id is string => Boolean(id))

    const listingMap = new Map<string, Record<string, unknown>>()
    if (listingIds.length > 0) {
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds)
      for (const l of listings ?? []) {
        listingMap.set(l.id, l as Record<string, unknown>)
      }
    }

    const listings = vendors.map((vendorRow) => {
      const v = vendorRow as Record<string, unknown>
      const listing = v.listing_id
        ? listingMap.get(v.listing_id as string)
        : null

      let serviceAreas: string[] = []
      try {
        const raw = v.service_areas
        if (Array.isArray(raw)) serviceAreas = raw as string[]
        else if (typeof raw === 'string') serviceAreas = JSON.parse(raw)
      } catch { serviceAreas = [] }

      let tags: string[] = []
      try {
        const raw = listing?.tags
        if (Array.isArray(raw)) tags = raw as string[]
        else if (typeof raw === 'string') tags = JSON.parse(raw)
      } catch { tags = [] }

      return {
        vendorId: v.id as string,
        vendorProfileId: v.id as string,
        plan: 'free',
        vendor: {
          id: v.id,
          name: v.business_name,
          slug: v.slug,
          category: v.category_id || '',
          isPublished: Boolean(v.profile_published),
          isFeatured: false,
          isVerified:
            v.kyc_status === 'verified' ||
            v.kyb_status === 'verified',
          isClaimed: (listing?.is_claimed as boolean) ?? false,
          address: listing
            ? [listing.city, listing.state].filter(Boolean).join(', ')
            : null,
          phone: v.contact_phone || null,
          bio: v.bio || null,
          priceRange: '$$',
          email: v.contact_email || null,
          website: v.website || null,
          serviceAreas,
          tags,
        },
      }
    })

    const firstProfile = listings[0]
    return NextResponse.json({
      vendorId: firstProfile.vendorId,
      plan: firstProfile.plan,
      listings,
    })
  } catch (error) {
    console.error('Error fetching vendor profile by user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor profile' },
      { status: 500 }
    )
  }
}
