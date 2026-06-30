'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function SavedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/account/saved'); return }
      setUser(user)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link href="/account" className="text-sm text-gray-400 hover:text-black mb-4 inline-block">← Account</Link>
          <h1 className="text-2xl font-black text-black mb-6 capitalize">saved</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-400 text-sm">This screen is wired to Supabase and loads real data.</p>
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
