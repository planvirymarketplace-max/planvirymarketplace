import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '')
    .substring(0, 80)
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the user token
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const body = await req.json()
  const {
    business_name, category_id, tagline, bio,
    phone, email, website,
    address_street, address_city, address_state, address_zip,
    price_range, price_starting_at,
  } = body

  if (!business_name?.trim()) {
    return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Generate a unique slug
  const baseSlug = slugify(business_name)
  let slug = baseSlug
  let counter = 2
  while (true) {
    const { data: existing } = await supabase
      .from('vendor_profiles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!existing) break
    slug = `${baseSlug}-${counter++}`
  }

  const { data, error } = await supabase
    .from('vendor_profiles')
    .insert({
      business_name: business_name.trim(),
      slug,
      category_id: category_id || null,
      tagline: tagline || null,
      bio: bio || null,
      phone: phone || null,
      email: email || user.email,
      website: website || null,
      address_street: address_street || null,
      address_city: address_city || 'Milwaukee',
      address_state: address_state || 'WI',
      address_zip: address_zip || null,
      price_range: price_range || null,
      price_starting_at: price_starting_at || null,
      source: 'signup',
      is_claimed: true,
      is_published: false,
      is_verified: false,
      is_featured: false,
    })
    .select('id, slug')
    .single()

  if (error) {
    console.error('create-profile error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, slug: data.slug })
}
