import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Admin Vendors API - Supabase (enterprise schema)
 * GET    /api/admin/vendors?search=xxx&published=true
 * PATCH  /api/admin/vendors - Update a vendor
 * DELETE /api/admin/vendors?vendorId=xxx - Delete a vendor
 */

/** Transform a snake_case vendor row to camelCase for frontend compatibility */
function transformVendor(v: any) {
  return {
    id: v.id,
    name: v.business_name,
    slug: v.slug,
    tagline: v.tagline,
    description: v.bio,
    address: v.address_street,
    city: v.address_city,
    state: v.address_state,
    phone: v.phone,
    email: v.email,
    website: v.website,
    imageUrl: v.logo_url,
    logoUrl: v.logo_url,
    coverUrl: v.cover_url,
    priceRange: v.price_range,
    isPromoted: v.is_premium,
    isFeatured: v.is_featured,
    isPublished: v.is_published,
    isClaimed: v.is_claimed,
    isVerified: v.is_verified,
    backlinkUrl: v.backlink_url,
    depositPercent: v.deposit_pct,
    source: v.source,
    averageRating: v.avg_rating || 0,
    reviewCount: v.review_count || 0,
    categoryId: v.category_id,
    createdAt: v.created_at,
  }
}

/** Mapping of camelCase frontend fields to snake_case DB columns */
const fieldToColumnMap: Record<string, string> = {
  name: 'business_name',
  slug: 'slug',
  tagline: 'tagline',
  description: 'bio',
  address: 'address_street',
  city: 'address_city',
  state: 'address_state',
  phone: 'phone',
  email: 'email',
  website: 'website',
  imageUrl: 'logo_url',
  logoUrl: 'logo_url',
  coverUrl: 'cover_url',
  priceRange: 'price_range',
  isPromoted: 'is_premium',
  isFeatured: 'is_featured',
  isPublished: 'is_published',
  isClaimed: 'is_claimed',
  isVerified: 'is_verified',
  backlinkUrl: 'backlink_url',
  depositPercent: 'deposit_pct',
  source: 'source',
  categoryId: 'category_id',
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const published = searchParams.get('published')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))

    let query = supabase
      .from('vendor_profiles')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,bio.ilike.%${search}%,address_street.ilike.%${search}%`)
    }
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data: vendors, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
    }

    return NextResponse.json({
      vendors: (vendors || []).map(transformVendor),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { vendorId, ...updates } = body

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId is required' }, { status: 400 })
    }

    // Map camelCase fields to snake_case columns
    const validFields = Object.keys(fieldToColumnMap)
    const updateData: Record<string, any> = {}
    for (const field of validFields) {
      if (updates[field] !== undefined) {
        updateData[fieldToColumnMap[field]] = updates[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data: vendor, error } = await supabase
      .from('vendor_profiles')
      .update(updateData)
      .eq('id', vendorId)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
    }

    return NextResponse.json({ vendor: transformVendor(vendor) })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('vendor_profiles')
      .delete()
      .eq('id', vendorId)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
