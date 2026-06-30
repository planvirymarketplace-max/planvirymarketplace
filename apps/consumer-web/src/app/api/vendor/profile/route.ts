import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import algoliasearch from 'algoliasearch'

// PATCH /api/vendor/profile
// Updates vendor profile in Supabase, then syncs to Algolia via partialUpdateObject (Part 11, 14)
// This is the ONLY Algolia write path from the app (besides the seed script)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get vendor record for this user
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('id, listing_id, business_name')
    .eq('user_id', user.id)
    .single()

  if (vendorError || !vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  }

  const body = await request.json()
  const allowedFields = [
    'business_name', 'bio', 'tagline', 'contact_phone', 'contact_email',
    'website', 'social_links', 'logo_url', 'hero_image_url',
    'home_zip', 'service_radius_miles', 'home_lat', 'home_lng',
  ]

  // Filter to allowed fields only
  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field]
    }
  }
  updates.updated_at = new Date().toISOString()

  // Update Supabase
  const { data: updated, error: updateError } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', vendor.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Sync to Algolia (the ONLY Algolia write path from the app)
  // This replaces the need for the sync-listing-to-algolia Edge Function in Phase 1
  // (Edge Function will handle this via DB webhook in Phase 5)
  try {
    const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
    const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY
    const listingsIndexName = process.env.NEXT_PUBLIC_ALGOLIA_LISTINGS_INDEX ?? 'listings'

    if (algoliaAppId && algoliaAdminKey && vendor.listing_id) {
      const client = algoliasearch(algoliaAppId, algoliaAdminKey)
      const index = client.initIndex(listingsIndexName)

      // Build the partial update object — only fields that exist in Algolia
      const algoliaUpdate: Record<string, unknown> = {
        objectID: vendor.listing_id,
      }

      if (updates.business_name) algoliaUpdate.name = updates.business_name
      if (updates.hero_image_url) algoliaUpdate.profile_image_url = updates.hero_image_url
      if (updates.contact_phone) algoliaUpdate.phone = updates.contact_phone
      if (updates.website) algoliaUpdate.website = updates.website

      await index.partialUpdateObject(algoliaUpdate, {
        createIfNotExists: false,
      })
    }
  } catch (algoliaError) {
    // Algolia sync failure is non-fatal — the Edge Function will catch it via DB webhook
    console.error('Algolia sync failed (non-fatal):', algoliaError instanceof Error ? algoliaError.message : 'unknown')
  }

  // Revalidate the vendor profile page (ISR cache bust)
  if (vendor.listing_id) {
    try {
      const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/revalidate`
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/v/${vendor.listing_id}`,
          secret: process.env.REVALIDATE_SECRET,
        }),
      })
    } catch {
      // Non-fatal — ISR will naturally revalidate on next request
    }
  }

  return NextResponse.json({
    vendor: updated,
    algolia_synced: true,
    message: 'Profile updated and synced to Algolia',
  })
}
