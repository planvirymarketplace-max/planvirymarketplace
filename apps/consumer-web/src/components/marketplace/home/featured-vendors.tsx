'use client'

import { useQuery } from '@tanstack/react-query'
import { VendorCard, type VendorCardData } from '@/components/marketplace/common/vendor-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function FeaturedVendors() {
  const { setView } = useAppStore()

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?featured=true&limit=6')
      if (!res.ok) return []
      const data = await res.json()
      return (data.vendors || []) as VendorCardData[]
    },
    staleTime: 30000,
  })

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Vendors
            </h2>
            <p className="mt-2 text-slate-500 text-sm sm:text-base">
              Top-rated professionals for your special day
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 animate-pulse">
                <div className="h-36 bg-slate-100 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!vendors || vendors.length === 0) {
    return null
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Featured Vendors
          </h2>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Top-rated professionals for your special day
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium"
            onClick={() => setView('directory')}
          >
            View All Vendors
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
