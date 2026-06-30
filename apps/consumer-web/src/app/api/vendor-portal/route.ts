import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

async function getAuthedVendor(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return { error: 'Unauthorized', status: 401 };

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return { error: 'Unauthorized', status: 401 };

  const { data: vendorUser, error: vuError } = await supabaseAdmin
    .from('vendor_users')
    .select('vendor_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (vuError || !vendorUser) return { error: 'No vendor account found', status: 403 };
  return { userId: user.id, vendorId: vendorUser.vendor_id, role: vendorUser.role };
}

export async function GET(req: NextRequest) {
  const auth = await getAuthedVendor(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await supabaseAdmin
    .from('vendor_profiles')
    .select(`
      id, business_name, dba, slug, category_id,
      address_street, address_suite, address_city, address_state, address_zip,
      neighborhood, phone, email, website,
      tagline, bio, logo_url, cover_url,
      price_range, price_starting_at,
      is_published, is_verified, is_featured, listing_status,
      avg_rating, review_count,
      accepts_inquiries, instant_booking, deposit_pct,
      cancellation_policy, min_booking_notice_days,
      created_at, updated_at
    `)
    .eq('id', auth.vendorId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

const ALLOWED_FIELDS = [
  'business_name', 'dba', 'tagline', 'bio',
  'category_id',
  'address_street', 'address_suite', 'address_city', 'address_state', 'address_zip',
  'neighborhood', 'phone', 'email', 'website',
  'logo_url', 'cover_url', 'price_range', 'price_starting_at',
  'accepts_inquiries', 'instant_booking', 'deposit_pct',
  'cancellation_policy', 'min_booking_notice_days',
];

export async function PUT(req: NextRequest) {
  const auth = await getAuthedVendor(req);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.role === 'viewer') return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('vendor_profiles')
    .update(updates)
    .eq('id', auth.vendorId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
