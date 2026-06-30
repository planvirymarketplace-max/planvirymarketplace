import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-marketplace/admin';
import { createClient } from '@/lib/supabase-marketplace/server';

/**
 * GET /api/admin/claims?status=pending&page=1&limit=20
 *
 * Lists claim requests with listing + user joins.
 * Uses admin client (service role) to bypass RLS.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const admin = createAdminClient();

    // Build query
    let query = admin
      .from('claim_requests')
      .select(`
        id,
        listing_id,
        vendor_id,
        user_id,
        contact_name,
        contact_email,
        contact_phone,
        verification_method,
        verification_note,
        match_score,
        match_signals,
        status,
        admin_note,
        reviewed_at,
        created_at,
        listing:listings!inner(id, name, planviry_sub_category, city, state, is_claimed)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: claimRequests, count, error } = await query;

    if (error) {
      console.error('Error fetching admin claims:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      claimRequests: claimRequests || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin claims:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/claims
 * Body: { claimId, status: 'approved' | 'rejected', adminNote? }
 *
 * Approves or rejects a claim. Uses approve_claim / reject_claim RPCs.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, status, adminNote } = body;

    if (!claimId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, status' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // Verify the caller is an admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Check the claim exists and is pending
    const { data: claim, error: fetchError } = await admin
      .from('claim_requests')
      .select('id, status, listing_id, user_id')
      .eq('id', claimId)
      .single();

    if (fetchError || !claim) {
      return NextResponse.json({ error: 'Claim request not found' }, { status: 404 });
    }

    if (claim.status !== 'pending' && claim.status !== 'auto_approved') {
      return NextResponse.json(
        { error: `Claim is already ${claim.status}` },
        { status: 400 }
      );
    }

    // Call the appropriate RPC
    if (status === 'approved') {
      const { error: rpcError } = await admin.rpc('approve_claim', {
        claim_id: claimId,
        admin_user_id: user.id,
      });
      if (rpcError) {
        console.error('approve_claim RPC error:', rpcError.message);
        return NextResponse.json(
          { error: 'Failed to approve claim: ' + rpcError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: rpcError } = await admin.rpc('reject_claim', {
        claim_id: claimId,
        admin_user_id: user.id,
        note: adminNote || null,
      });
      if (rpcError) {
        console.error('reject_claim RPC error:', rpcError.message);
        return NextResponse.json(
          { error: 'Failed to reject claim: ' + rpcError.message },
          { status: 500 }
        );
      }
    }

    // Fetch the updated claim with listing join
    const { data: updated } = await admin
      .from('claim_requests')
      .select(`
        *,
        listing:listings(id, name, planviry_sub_category, city, state, is_claimed)
      `)
      .eq('id', claimId)
      .single();

    return NextResponse.json({ claimRequest: updated });
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
  }
}
