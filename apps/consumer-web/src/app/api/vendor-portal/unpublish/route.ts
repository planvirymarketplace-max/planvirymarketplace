import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: vendorUser, error: vuError } = await supabaseAdmin
    .from('vendor_users')
    .select('vendor_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (vuError || !vendorUser) return NextResponse.json({ error: 'No vendor account found' }, { status: 403 });
  if (vendorUser.role === 'viewer') return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const reason = body.reason || null;

  try {
    const { error: rpcError } = await supabaseAdmin.rpc('unpublish_listing', {
      p_vendor_id: vendorUser.vendor_id,
      p_changed_by: user.id,
      p_reason: reason,
    });
    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 422 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unpublish listing error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
