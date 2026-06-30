import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect account portal
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect vendor portal
  if (request.nextUrl.pathname.startsWith("/vendor/portal")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect checkout (must be authenticated to pay — BR-C-005)
  if (request.nextUrl.pathname.startsWith("/checkout") && !request.nextUrl.searchParams.has("session_id")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect check-in scanner (vendor staff only)
  if (request.nextUrl.pathname.startsWith("/check-in")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
