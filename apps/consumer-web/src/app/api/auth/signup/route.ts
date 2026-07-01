import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Sign-up route — uses the ANON key via @supabase/ssr so that:
 *   1. The new user is created through the public auth API (not the admin API)
 *   2. A session is returned immediately when email confirmation is disabled
 *   3. The session cookies are set on the response so the user is logged in
 *      right after sign-up (no separate sign-in step required).
 *
 * Previously this route used supabaseAdmin.auth.admin.createUser which (a) used
 * the service-role key in a client-reachable route and (b) created the user
 * without a session and without setting cookies — the user had to sign in
 * separately and the signup itself never logged them in.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name ?? '' },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({ user: data.user, session: data.session });
    cookiesToSet.forEach(({ name, value, options }) =>
      res.cookies.set(name, value, options as Record<string, unknown> & { path?: string })
    );
    return res;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
