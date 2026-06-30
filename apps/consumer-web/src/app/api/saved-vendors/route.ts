import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * Saved vendors API
 *
 * NOTE: The original Prisma schema had a `savedVendor` join table
 * (user_id, vendor_id). No equivalent table exists on the remote
 * Supabase. We use `saved_searches` (which has user_id + JSONB filters)
 * as the storage layer, storing the vendorId inside `filters.vendor_id`.
 *
 * This keeps the API contract stable while we wait for a proper
 * `favorite_vendors` table to be added.
 */

interface SavedVendorRow {
  id: string
  user_id: string
  filters: { vendor_id?: string } | null
  created_at: string
}

// GET: List saved vendors for a userId
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json({ error: 'Invalid userId format (expected UUID)' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: rows, error } = await supabase
      .from('saved_searches')
      .select('id, user_id, filters, created_at')
      .eq('user_id', userId)
      .not('filters', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved vendors:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch saved vendors' },
        { status: 500 }
      )
    }

    const saved = (rows as SavedVendorRow[] | null) ?? []
    const vendorIds = saved
      .map((sv) => sv.filters?.vendor_id)
      .filter((v): v is string => Boolean(v))

    // Fetch vendor info for each saved vendor
    let vendorMap = new Map<string, Record<string, unknown>>()
    if (vendorIds.length > 0) {
      const { data: vendors } = await supabase
        .from('vendors')
        .select(
          'id, business_name, slug, category_id, contact_phone, logo_url, kyc_status, kyb_status'
        )
        .in('id', vendorIds)

      for (const v of vendors ?? []) {
        vendorMap.set(v.id, v)
      }
    }

    return NextResponse.json({
      savedVendors: saved
        .filter((sv) => sv.filters?.vendor_id)
        .map((sv) => {
          const vendorId = sv.filters!.vendor_id!
          const v = vendorMap.get(vendorId)
          return {
            id: sv.id,
            savedAt: sv.created_at,
            vendor: v
              ? {
                  id: v.id,
                  name: v.business_name,
                  slug: v.slug,
                  category: v.category_id,
                  address: null,
                  phone: v.contact_phone,
                  logoUrl: v.logo_url,
                  isVerified:
                    v.kyc_status === 'verified' ||
                    v.kyb_status === 'verified',
                  isFeatured: false,
                }
              : {
                  id: vendorId,
                  name: null,
                  slug: null,
                  category: null,
                  address: null,
                  phone: null,
                  logoUrl: null,
                  isVerified: false,
                  isFeatured: false,
                },
          }
        }),
    })
  } catch (error) {
    console.error('Error fetching saved vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved vendors' },
      { status: 500 }
    )
  }
}

// POST: Save a vendor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, vendorId } = body

    if (!userId || !vendorId) {
      return NextResponse.json(
        { error: 'userId and vendorId required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check for existing saved vendor (idempotency)
    const { data: existing } = await supabase
      .from('saved_searches')
      .select('id')
      .eq('user_id', userId)
      .eq('filters->>vendor_id', vendorId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Vendor already saved', savedVendor: existing },
        { status: 409 }
      )
    }

    const { data: savedVendor, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: userId,
        label: `Vendor: ${vendorId}`,
        filters: { vendor_id: vendorId },
        alert_enabled: false,
      })
      .select('id, user_id, filters, created_at')
      .single()

    if (error) {
      console.error('Error saving vendor:', error.message)
      return NextResponse.json(
        { error: 'Failed to save vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        savedVendor: {
          id: (savedVendor as SavedVendorRow).id,
          userId: (savedVendor as SavedVendorRow).user_id,
          vendorId,
          savedAt: (savedVendor as SavedVendorRow).created_at,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving vendor:', error)
    return NextResponse.json(
      { error: 'Failed to save vendor' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a saved vendor
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, vendorId } = body

    if (!userId || !vendorId) {
      return NextResponse.json(
        { error: 'userId and vendorId required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('user_id', userId)
      .eq('filters->>vendor_id', vendorId)

    if (error) {
      console.error('Error removing saved vendor:', error.message)
      return NextResponse.json(
        { error: 'Failed to remove saved vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing saved vendor:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved vendor' },
      { status: 500 }
    )
  }
}
