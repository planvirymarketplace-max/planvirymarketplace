import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-marketplace/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

interface ClaimRequestBody {
  listingId?: string
  vendorId?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  verificationMethod?: 'phone' | 'email' | 'document'
  verificationNote?: string
  businessName?: string
  businessWebsite?: string
}

/**
 * POST /api/claim-requests
 *
 * Submit a claim request for a listing.
 * 1. If listingId provided, use it directly.
 * 2. If businessName provided (no listingId), call match_vendor_claim RPC.
 * 3. Verify listing exists and is not already claimed.
 * 4. Insert into claim_requests table.
 */
export async function POST(request: Request) {
  try {
    const body: ClaimRequestBody = await request.json()

    if (!body.contactName || !body.contactEmail) {
      return NextResponse.json(
        { error: 'contactName and contactEmail are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the current user (must be authenticated)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to submit a claim' },
        { status: 401 }
      )
    }

    let matchedListingId = body.listingId
    let matchScore = 0
    let matchSignals: string[] = []

    // If no listingId, try to match by business name
    if (!matchedListingId && body.businessName) {
      const admin = createAdminClient()
      const { data: matches, error: matchError } = await admin.rpc(
        'match_vendor_claim',
        {
          input_name: body.businessName,
          input_phone: body.contactPhone || '',
          input_domain: body.businessWebsite || '',
        }
      )

      if (matchError) {
        console.error('match_vendor_claim RPC error:', matchError.message)
      } else if (matches && matches.length > 0) {
        const top = matches[0] as any
        matchedListingId = top.listing_id || top.vendor_id
        matchScore = top.match_score || 0
        matchSignals = top.match_signals || []
      }
    }

    if (!matchedListingId) {
      return NextResponse.json(
        { error: 'No matching listing found. Please provide a listingId.' },
        { status: 404 }
      )
    }

    // Verify the listing exists and is not already claimed
    const admin = createAdminClient()
    const { data: listing, error: listingError } = await admin
      .from('listings')
      .select('id, name, is_claimed, planviry_sub_category, city, state')
      .eq('id', matchedListingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.is_claimed) {
      return NextResponse.json(
        { error: 'This listing has already been claimed' },
        { status: 409 }
      )
    }

    // Check for existing claim by this user
    const { data: existing } = await supabase
      .from('claim_requests')
      .select('id, status')
      .eq('listing_id', matchedListingId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted a claim for this listing', claim: existing },
        { status: 409 }
      )
    }

    // Insert the claim request
    const { data: claim, error: claimError } = await supabase
      .from('claim_requests')
      .insert({
        listing_id: matchedListingId,
        vendor_id: body.vendorId || null,
        user_id: user.id,
        contact_name: body.contactName,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone || null,
        verification_method: body.verificationMethod || 'manual',
        verification_note: body.verificationNote || null,
        match_score: matchScore,
        match_signals: matchSignals,
        status: matchScore >= 2 ? 'auto_approved' : 'pending',
      })
      .select()
      .single()

    if (claimError) {
      console.error('claim_requests insert error:', claimError.message)
      return NextResponse.json(
        { error: 'Failed to create claim request: ' + claimError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ claim, listing }, { status: 201 })
  } catch (error) {
    console.error('Error creating claim request:', error)
    return NextResponse.json(
      { error: 'Failed to create claim request' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/claim-requests
 * Returns the current user's claim requests.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: claims, error } = await supabase
      .from('claim_requests')
      .select(`
        *,
        listing:listings(id, name, planviry_sub_category, city, state)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching claims:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ claims })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 })
  }
}
