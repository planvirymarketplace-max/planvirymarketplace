'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';

export interface VendorInfo {
  vendor_id: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  vendorInfo: VendorInfo | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    vendorInfo: null,
  });

  const fetchVendorInfo = useCallback(async (userId: string): Promise<VendorInfo | null> => {
    try {
      const { data } = await supabaseClient
        .from('vendor_users')
        .select('vendor_id, role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
      return data ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    supabaseClient.auth.getSession().then(async ({ data: { session } }) => {
      const vendorInfo = session?.user ? await fetchVendorInfo(session.user.id) : null;
      setState({ user: session?.user ?? null, session, loading: false, vendorInfo });
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      const vendorInfo = session?.user ? await fetchVendorInfo(session.user.id) : null;
      setState({ user: session?.user ?? null, session, loading: false, vendorInfo });
    });

    return () => subscription.unsubscribe();
  }, [fetchVendorInfo]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata: Record<string, string>
  ) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}
