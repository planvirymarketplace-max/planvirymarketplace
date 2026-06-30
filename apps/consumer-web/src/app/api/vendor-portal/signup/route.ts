import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id, business_name, category_slug, contact_name, contact_email,
      phone, website, address, city, state, zip, bio, price_range,
    } = body;

    if (!business_name || !category_slug || !contact_name || !contact_email) {
      return NextResponse.json({ error: 'business_name, category_slug, contact_name, and contact_email are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('vendor_signups')
      .insert({
        user_id: user_id ?? null,
        business_name,
        category_slug,
        contact_name,
        contact_email,
        phone: phone || null,
        website: website || null,
        address: address || null,
        city: city || 'Milwaukee',
        state: state || 'WI',
        zip: zip || null,
        bio: bio || null,
        price_range: price_range || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('Vendor signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
