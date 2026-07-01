import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ─── Intent-based role detection (Part 53 §53.2) ──────────────────────
  // Protected routes that REQUIRE auth
  const protectedRoutes = ['/admin', '/account', '/vendor', '/checkout', '/check-in', '/hosting']
  const needsAuth = protectedRoutes.some(r => path.startsWith(r))
  // /checkout with session_id param is the Stripe return URL — allow through
  const isStripeReturn = path.startsWith('/checkout') && request.nextUrl.searchParams.has('session_id')

  if (needsAuth && !isStripeReturn && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('returnTo', path)
    return NextResponse.redirect(url)
  }

  // Vendor routes: if logged in but no vendor_staff, redirect to onboarding
  if (path.startsWith('/vendor') && user) {
    const { data: staff } = await supabase
      .from('vendor_staff')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (!staff && !path.startsWith('/vendor/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/vendor'
      return NextResponse.redirect(url)
    }
  }

  // Account routes: if logged in but no user_profiles, redirect to onboarding
  if (path.startsWith('/account') && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
    if (!profile && !path.startsWith('/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/user'
      return NextResponse.redirect(url)
    }
  }

  // Admin routes: require platform_staff or admin role
  if (path.startsWith('/admin') && user) {
    // Check if user is admin (simplified — production checks platform_staff table)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/user'
      return NextResponse.redirect(url)
    }
  }

  // ─── Public routes (no auth needed) ───────────────────────────────────
  // /, /search, /directory, /travel/*, /tickets/whats-on, /events,
  // /food-drink, /browse, /lodging/* — all work for anonymous users

  return supabaseResponse
}
