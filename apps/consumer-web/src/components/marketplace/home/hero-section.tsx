'use client'

import { Search, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'

const SERVICE_TYPES = [
  { label: 'All Categories', value: '' },
  { label: 'Venues', value: 'wedding_venue' },
  { label: 'Wedding DJs', value: 'wedding_dj' },
  { label: 'Dramatics & Activities', value: 'bachelorette_activity' },
  { label: 'Live Bands', value: 'wedding_band' },
  { label: 'Planners', value: 'wedding_planner' },
]

export function HeroSection() {
  const { navigateToSearch, navigateToCategory, setView } = useAppStore()
  const [searchValue, setSearchValue] = useState('')
  const [activeType, setActiveType] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigateToSearch(searchValue.trim())
    } else {
      setView('directory')
    }
  }

  return (
    <section className="bg-[#F8F7F2] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase shadow-sm">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            Official Directory of BestTimeMKE
          </div>

          {/* Headline - Serif */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-tight leading-[1.15] font-[var(--font-playfair)]">
            Find & Hire the Perfect{' '}
            <span className="text-blue-600">Milwaukee Event</span>{' '}
            Vendors
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Browse 500+ verified vendors across 22 categories. From venues to DJs,
            photographers to florists - your perfect Milwaukee event starts here.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
              <Search className="absolute left-4 size-5 text-slate-400" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search through professional Milwaukee directories..."
                className="pl-11 pr-32 h-12 bg-transparent border-0 focus-visible:ring-0 text-base placeholder:text-slate-400"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="size-3" />
                  Milwaukee, WI
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-xs font-semibold rounded-md"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Service Type Selector */}
          <div className="mt-8">
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">
              Select Service Type
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SERVICE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={activeType === type.value ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 text-[11px] font-semibold tracking-wide rounded-md ${
                    activeType === type.value
                      ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    setActiveType(type.value)
                    if (type.value) {
                      navigateToCategory(type.value)
                    }
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
