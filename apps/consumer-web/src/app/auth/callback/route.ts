import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const { error } = await supabaseAdmin.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Auth callback error:', error.message);
      }
    } catch (err) {
      console.error('Auth callback exception:', err);
    }
  }

  // Redirect to home after auth
  return NextResponse.redirect(requestUrl.origin);
}
