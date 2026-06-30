import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-marketplace/server';
import { createAdminClient } from '@/lib/supabase-marketplace/admin';

/**
 * POST /api/claim-profile
 *
 * Legacy claim endpoint — creates a claim_requests record.
 * The preferred endpoint is /api/claim-requests (which uses listing_id).
 * This route accepts vendor_id and maps it to a listing.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, vendor_id, listing_id, contact_name, note, verification_method } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the current user (must be authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to submit a claim' },
        { status: 401 }
      );
    }

    // Resolve listing_id: use provided listing_id, or find by vendor_id
    let resolvedListingId = listing_id;
    if (!resolvedListingId && vendor_id) {
      const admin = createAdminClient();
      const { data: listing } = await admin
        .from('listings')
        .select('id')
        .eq('vendor_id', vendor_id)
        .limit(1)
        .single();
      if (listing) {
        resolvedListingId = listing.id;
      }
    }

    if (!resolvedListingId) {
      return NextResponse.json(
        { error: 'listing_id or vendor_id is required to identify the listing' },
        { status: 400 }
      );
    }

    // Insert into claim_requests
    const { error } = await supabase
      .from('claim_requests')
      .insert({
        listing_id: resolvedListingId,
        vendor_id: vendor_id || null,
        user_id: user.id,
        contact_name: contact_name || 'Unknown',
        contact_email: email,
        verification_method: verification_method || 'manual',
        verification_note: note || null,
        status: 'pending',
      });

    if (error) {
      console.error('claim_requests insert error:', error.message);
      return NextResponse.json(
        { error: 'Failed to create claim: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Claim profile error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
