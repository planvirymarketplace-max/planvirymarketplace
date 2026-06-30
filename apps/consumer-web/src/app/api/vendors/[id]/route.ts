import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'
import type { Vendor, VendorCategory, SocialLink, Package, Review } from '@/lib/marketplace-types'

const slugToCategory: Record<string, VendorCategory> = {
  'bars-clubs': 'bar_club',
  'wedding-venues': 'wedding_venue',
  'bachelorette-bachelor': 'bachelorette_activity',
  'wedding-djs': 'wedding_dj',
  'wedding-bands': 'wedding_band',
  'live-bands': 'wedding_band',
  'photo-booths': 'photo_booth',
  'transportation': 'transportation',
  'party-buses': 'transportation',
  'videographers': 'videography',
  'wedding-planners': 'wedding_planner',
  'event-planners': 'wedding_planner',
  'photographers': 'photography',
  'wedding-photographers': 'photography',
  'caterers': 'catering',
  'wedding-catering': 'catering',
  'custom-cakes': 'wedding_cake',
  'bakeries': 'wedding_cake',
  'florists': 'florist',
  'floral-designers': 'florist',
  'hair-makeup': 'hair_makeup',
  'bridal-hair-makeup': 'hair_makeup',
  'officiants': 'officiant',
  'dress-attire': 'dress_attire',
  'jewelers': 'jeweler',
  'favors-gifts': 'favors_gifts',
  'invitations-print': 'invitations_print',
  'stationery': 'invitations_print',
  'hotels': 'hotel_accommodations',
  'honeymoon-travel': 'honeymoon_travel',
  'travel-agencies': 'honeymoon_travel',
  'lighting-av': 'lighting_av',
  'decor-rentals': 'decor_rentals',
  'party-rentals': 'rentals',
  'bounce-houses': 'rentals',
  'wellness-spa': 'wellness',
  'wine-spirits': 'wine_spirits',
  'alterations': 'decor_rentals',
  'party-decorations': 'decor_rentals',
}

const parseJsonArray = (val: any): string[] => {
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return []
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch vendor profile with category info
    const { data: vendor, error: vendorError } = await supabase
      .from('vendor_profiles')
      .select('*, vendor_categories!vendor_profiles_category_id_fkey(slug, name, filter_schema_key)')
      .eq('id', id)
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const catSlug = (vendor as any).vendor_categories?.slug || null
    const category: VendorCategory = (catSlug && slugToCategory[catSlug]) || 'wedding_venue'

    // Fetch related data in parallel
    const [galleryRes, socialsRes, packagesRes, reviewsRes, filterAnswersRes] = await Promise.all([
      supabase
        .from('vendor_gallery')
        .select('id, media_type, storage_path, video_url, caption, alt_text, sort_order, is_cover, team_name, team_role')
        .eq('vendor_id', id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('vendor_socials')
        .select('platform, url')
        .eq('vendor_id', id),
      supabase
        .from('vendor_packages')
        .select('id, name, description, sort_order, is_active, price_cents, price_label, show_price, deposit_pct, duration_hours, capacity_min, capacity_max, includes, excludes, addons, booking_mode')
        .eq('vendor_id', id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('reviews')
        .select('id, rating, title, body, is_approved, vendor_response, vendor_responded_at, created_at, customer_id')
        .eq('vendor_id', id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('vendor_filter_answers')
        .select('id, category_key, filter_key, value_text, value_bool, value_min, value_max')
        .eq('vendor_id', id),
    ])

    const gallery = (galleryRes.data || []).map((g: any) => ({
      ...g,
      url: g.storage_path || g.video_url,
    }))

    const socials: SocialLink[] = (socialsRes.data || []).map((s: any) => ({
      platform: s.platform,
      url: s.url,
    })) as SocialLink[]

    const packages: Package[] = (packagesRes.data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price_cents / 100,
      duration: p.duration_hours ? `${p.duration_hours}h` : undefined,
      capacity: p.capacity_max ? `${p.capacity_min || 0}–${p.capacity_max}` : undefined,
    }))

    const reviews: Review[] = (reviewsRes.data || []).map((r: any) => ({
      id: r.id,
      reviewerName: `Customer`, // Don't expose customer_id
      rating: r.rating,
      body: r.body || '',
      createdAt: r.created_at,
      isApproved: r.is_approved,
      response: r.vendor_response || undefined,
    }))

    const filterAnswers = filterAnswersRes.data || []

    const v = vendor as any
    const result: Vendor = {
      id: v.id,
      slug: v.slug || `vendor-${v.id}`,
      name: v.business_name || 'Unknown',
      category,
      address: [v.address_street, v.address_suite, v.address_city, v.address_state, v.address_zip].filter(Boolean).join(', ') || undefined,
      phone: v.phone || undefined,
      website: v.website || undefined,
      email: v.email || undefined,
      bio: v.bio || v.tagline || undefined,
      logoUrl: v.logo_url || undefined,
      coverUrl: v.cover_url || undefined,
      priceRange: v.price_range || '$$',
      serviceAreas: parseJsonArray(v.service_areas),
      tags: [],
      backlinkUrl: v.backlink_url || undefined,
      isClaimed: v.is_claimed || false,
      isPublished: v.is_published !== false,
      isFeatured: v.is_featured || false,
      isVerified: v.is_verified !== false,
      source: v.source || 'seed',
      averageRating: Number(v.avg_rating) || 0,
      reviewCount: v.review_count || 0,
      galleryUrl: gallery.filter((g: any) => g.media_type === 'photo').map((g: any) => g.url || g.storage_path),
      socials,
      packages,
      reviews,
      availability: [],
      depositPercent: Number(v.deposit_pct) || 20,
    }

    // Return vendor with extra related data
    return NextResponse.json({
      ...result,
      gallery,
      filterAnswers,
      categorySlug: catSlug,
      categoryName: (vendor as any).vendor_categories?.name || null,
      categoryFilterKey: (vendor as any).vendor_categories?.filter_schema_key || null,
      neighborhood: v.neighborhood || null,
      lat: v.lat || null,
      lng: v.lng || null,
      instantBooking: v.instant_booking || false,
      acceptsInquiries: v.accepts_inquiries !== false,
      priceStartingAt: v.price_starting_at || null,
    })
  } catch (error) {
    console.error('Failed to fetch vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}
