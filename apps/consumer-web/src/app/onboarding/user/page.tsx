'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowRight, Check } from 'lucide-react'

export default function UserOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [locale, setLocale] = useState('en-US')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/onboarding/user'); return }
      setUser(user)
      const { data: p } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle()
      if (p) { setProfile(p); setDisplayName(p.display_name || '') }
      setLoading(false)
    }
    load()
  }, [])

  const [loading, setLoading] = useState(true)

  const handleSave = async () => {
    setSaving(true)
    if (profile) {
      await supabase.from('user_profiles').update({ display_name: displayName, locale }).eq('id', user.id)
    } else {
      await supabase.from('user_profiles').insert({ id: user.id, email: user.email, display_name: displayName, locale, notification_prefs: {} })
    }
    setSaving(false)
    setDone(true)
    setTimeout(() => router.push('/account'), 1500)
  }

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-black text-black mb-6">Set up your profile</h1>
          {done ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-green-800">Profile saved!</p>
              <p className="text-sm text-green-600">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Display name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Language</label>
                <select value={locale} onChange={e => setLocale(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                </select>
              </div>
              <button onClick={handleSave} disabled={saving || !displayName} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? 'Saving...' : <>Complete <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
