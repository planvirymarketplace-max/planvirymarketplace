'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function PayoutsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/vendor/payouts'); return }
      const { data: staff } = await supabase.from('vendor_staff').select('vendor_id').eq('user_id', user.id).eq('status', 'ACTIVE').maybeSingle()
      if (!staff) { router.push('/onboarding/vendor'); return }
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link href="/vendor/dashboard" className="text-sm text-gray-400 hover:text-black mb-4 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-black text-black mb-6 capitalize">payouts</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400">This screen loads data from Supabase.</p>
            <p className="text-sm text-gray-300 mt-2">API routes for payouts are wired at /api/payouts</p>
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
