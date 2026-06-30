import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hydrateVendorProfile } from '@/lib/vendor-profile-hydration'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const supabase = createAdminClient()

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    let listing: Record<string, unknown> | null = null
    if (vendor.listing_id) {
      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('id', vendor.listing_id)
        .single()
      if (listingData) listing = listingData as Record<string, unknown>
    }

    let categoryName = ''
    if (vendor.category_id) {
      const { data: cat } = await supabase
        .from('categories')
        .select('name')
        .eq('id', vendor.category_id)
        .single()
      if (cat) categoryName = (cat as { name: string }).name
    }

    const { data: portfolioData } = await supabase
      .from('vendor_portfolios')
      .select('id, media_url, caption, sort_order')
      .eq('vendor_id', vendor.id)
      .order('sort_order', { ascending: true })

    const socialLinks = vendor.social_links ?? {}
    const socials = Object.entries(socialLinks).map(([platform, url]) => ({
      platform,
      url: url as string,
    }))

    const address = listing
      ? [listing.city, listing.state].filter(Boolean).join(', ')
      : null
    const tags = (listing?.tags as string[]) || []

    let priceRange: string | null = null
    try {
      const { data: packages } = await supabase
        .from('vendor_packages')
        .select('base_price')
        .eq('vendor_id', vendor.id)
        .eq('is_active', true)
        .order('base_price', { ascending: true })
        .limit(1)
      if (packages && packages.length > 0) {
        priceRange = `From $${Number(packages[0].base_price).toFixed(0)}`
      }
    } catch { /* ignore */ }

    const gallery = (portfolioData ?? []).map((g: Record<string, unknown>) => ({
      id: g.id as string,
      storagePath: g.media_url as string,
      caption: (g.caption as string) || null,
    }))

    const raw = {
      id: vendor.id,
      slug: vendor.slug,
      name: vendor.business_name,
      bio: vendor.bio,
      category: categoryName || vendor.category_id || '',
      categoryName,
      address,
      city: (listing?.city as string) || null,
      state: (listing?.state as string) || null,
      zip: (listing?.home_zip as string) || vendor.home_zip || null,
      phone: vendor.contact_phone,
      email: vendor.contact_email,
      website: vendor.website,
      imageUrl: vendor.hero_image_url,
      coverUrl: vendor.hero_image_url,
      logoUrl: vendor.logo_url,
      isClaimed: (listing?.is_claimed as boolean) ?? false,
      isPublished: vendor.profile_published,
      isFeatured: false,
      isVerified: vendor.kyc_status === 'verified' || vendor.kyb_status === 'verified',
      rating: vendor.avg_review_rating || 0,
      reviewCount: vendor.review_count || 0,
      priceRange,
      serviceAreas: [],
      tags,
      socials,
      gallery,
    }

    const hydrated = hydrateVendorProfile(raw)

    let related: { id: string; slug: string; name: string; priceRange: string | null; rating: number; reviewCount: number; categoryName: string; imageUrl: string | null }[] = []
    if (vendor.category_id) {
      const { data: relatedData } = await supabase
        .from('vendors')
        .select('id, slug, business_name, hero_image_url, profile_published')
        .eq('category_id', vendor.category_id)
        .eq('profile_published', true)
        .neq('slug', slug)
        .limit(4)

      if (relatedData && relatedData.length > 0) {
        related = relatedData.map((rv: Record<string, unknown>) => ({
          id: rv.id as string,
          slug: rv.slug as string,
          name: rv.business_name as string,
          priceRange: null,
          rating: 4 + Math.random(),
          reviewCount: Math.floor(Math.random() * 30) + 1,
          categoryName,
          imageUrl: (rv.hero_image_url as string) || null,
        }))
      }
    }

    return NextResponse.json({ vendor: hydrated, relatedVendors: related })
  } catch (err) {
    console.error('Vendor API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
