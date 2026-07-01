'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  ArrowLeft,
  Building2,
  Ticket,
  MapPin,
  Briefcase,
  UtensilsCrossed,
  Car,
  Loader2,
  ArrowRight,
} from 'lucide-react'

type Choice = {
  href: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category?: string
}

const CHOICES: Choice[] = [
  {
    href: '/hosting/create',
    title: 'List a property',
    description: 'Vacation rental, loft, or short-stay — built on the Staybnb 12-step wizard.',
    icon: Building2,
    category: 'LODGING',
  },
  {
    href: '/tickets/admin/shows',
    title: 'List event tickets',
    description: 'Run a show with performances, tiers, and reserved seating via EventSeats.',
    icon: Ticket,
    category: 'EVENT_TICKET',
  },
  {
    href: '/vendor/create-listing/venue',
    title: 'List a venue',
    description: 'Hourly-rental spaces — banquet halls, rooftops, studios — with capacity and amenities.',
    icon: MapPin,
    category: 'VENUE_RENTAL',
  },
  {
    href: '/vendor/create-listing/service',
    title: 'List a service',
    description: 'Pro vendors — DJs, photographers, florists, planners — with a flat service fee.',
    icon: Briefcase,
    category: 'SERVICE',
  },
  {
    href: '/vendor/create-listing/dining',
    title: 'List a dining experience',
    description: 'Chef tables, tasting menus, private dinners — priced per person with seat capacity.',
    icon: UtensilsCrossed,
    category: 'DINING',
  },
  {
    href: '/vendor/create-listing/transport',
    title: 'List transport',
    description: 'Shuttles, party buses, limos, charter vans — base rate plus per-seat capacity.',
    icon: Car,
    category: 'TRANSPORT',
  },
]

export default function CreateListingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [vendorName, setVendorName] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?returnTo=/vendor/create-listing')
        return
      }
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, vendor_accounts!inner(name)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (!staff) {
        router.push('/onboarding/vendor')
        return
      }
      setVendorName((staff.vendor_accounts as { name?: string } | null)?.name ?? '')
      setLoading(false)
    }
    init()
  }, [router, supabase])

  if (loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <h1 className="text-2xl font-black text-black mb-1">Create a Listing</h1>
          <p className="text-sm text-gray-500 mb-1">
            Pick what you want to list. Each option is built on the right tool for the job.
          </p>
          {vendorName && (
            <p className="text-sm text-gray-500 mb-6">
              New listings are created for{' '}
              <strong className="text-gray-700">{vendorName}</strong> with status{' '}
              <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">DRAFT</span>.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHOICES.map((c) => {
              const Icon = c.icon
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-black hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                    {c.category && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                        {c.category.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-black mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 leading-snug flex-1">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gray-700 group-hover:text-black">
                    Get started
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
