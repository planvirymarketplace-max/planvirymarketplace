'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { User, Store, ArrowRight, Check } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [hasVendor, setHasVendor] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/onboarding'); return }
      setUser(user)
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, role')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      setHasVendor(!!staff)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-black mb-2">Welcome to Planviry</h1>
          <p className="text-gray-500 mb-8">Choose how you want to get started.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User path */}
            <button onClick={() => router.push('/onboarding/user')}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-black transition-colors group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-black mb-1">I'm a Guest</h2>
              <p className="text-sm text-gray-500 mb-4">Book events, lodging, dining, and experiences. Build itineraries. Manage reservations.</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-black group-hover:gap-2 transition-all">
                Get started <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Vendor path */}
            <button onClick={() => router.push('/onboarding/vendor')}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-black transition-colors group">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <Store className="w-7 h-7 text-orange-600" />
              </div>
              <h2 className="text-xl font-black text-black mb-1">I'm a Vendor</h2>
              <p className="text-sm text-gray-500 mb-4">List your business, manage bookings, accept payments, track analytics. Claim your profile or create a new one.</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-black group-hover:gap-2 transition-all">
                Get started <ArrowRight className="w-4 h-4" />
              </span>
              {hasVendor && <span className="block mt-2 text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Vendor account linked</span>}
            </button>
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
