import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Sign-in route — uses the ANON key (NOT the service-role key) via the
 * @supabase/ssr server client so that:
 *   1. RLS is respected (security)
 *   2. The session cookies are set on the response so the middleware
 *      (src/lib/supabase/middleware.ts) can authenticate subsequent requests.
 *
 * Previously this route used the admin client and returned the session as JSON
 * without setting cookies — the middleware never saw the session and every
 * protected route redirected to /login.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Collect cookies that the Supabase client wants to set; we attach them to
    // the JSON response below. (Route Handlers can't use the `cookies()`
    // setter from next/headers — only Server Actions / middleware can — so we
    // set them on the NextResponse directly.)
    const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = [];
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cs) {
            cs.forEach((c) => cookiesToSet.push(c));
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const res = NextResponse.json({ user: data.user, session: data.session });
    cookiesToSet.forEach(({ name, value, options }) =>
      res.cookies.set(name, value, options as Record<string, unknown> & { path?: string })
    );
    return res;
  } catch (err) {
    console.error('Signin error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
