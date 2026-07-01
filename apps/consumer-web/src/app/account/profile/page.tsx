import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ProfileForm } from './ProfileForm'

// ─── Types ────────────────────────────────────────────────────────────────
export type NotificationPrefs = {
  email?: boolean
  push?: boolean
  sms?: boolean
  [k: string]: unknown
}

export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  phone: string | null
  avatar_url: string | null
  locale: string | null
  notification_prefs: NotificationPrefs | null
}

export const metadata = {
  title: 'Profile — Planviry',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/profile')
  }

  // Load the user_profiles row. The cookie-scoped server client is wrapped
  // by db-compat only on the admin client — `user_profiles` matches the
  // canonical table name, so no shim is needed here. If the row is missing
  // (e.g. user signed up before the profile trigger ran), fall back to the
  // admin client to insert a stub.
  let { data: profile } = await supabase
    .from('user_profiles')
    .select(
      'id, email, display_name, phone, avatar_url, locale, notification_prefs',
    )
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    const admin = createAdminClient()
    const { data: stub } = await admin
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: null,
        locale: 'en',
        notification_prefs: { email: true, push: true, sms: false },
      })
      .select(
        'id, email, display_name, phone, avatar_url, locale, notification_prefs',
      )
      .single()
    profile = stub
  }

  if (!profile) {
    redirect('/login?returnTo=/account/profile')
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href="/account"
            className="text-sm text-gray-400 hover:text-black mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Account
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-black text-black">Profile</h1>
          </div>

          <ProfileForm
            profile={profile as unknown as Profile}
            authEmail={user.email ?? null}
          />
        </div>
      </div>
    </AppLayoutShell>
  )
}
