'use client'

import { Search, Menu, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/lib/store'

export function TopBar() {
  const {
    goHome,
    setView,
    navigateToSearch,
    toggleSidebar,
    sidebarOpen,
    viewAs,
    setViewAs,
    setActiveSidebarSection,
  } = useAppStore()
  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearch.trim()) {
      navigateToSearch(localSearch.trim())
      setLocalSearch('')
    }
  }

  const handleNavClick = (section: 'explore' | 'featured' | 'cart-booking') => {
    setActiveSidebarSection(section)
    if (section === 'explore') {
      setView('directory')
    } else if (section === 'featured') {
      setView('home')
    } else if (section === 'cart-booking') {
      setView('directory')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      {/* Upper row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-slate-100"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? (
                <X className="size-5 text-slate-700" />
              ) : (
                <Menu className="size-5 text-slate-700" />
              )}
            </Button>

            <button
              onClick={goHome}
              className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
            >
              {/* Logo mark */}
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold tracking-tight">B</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  Planviry
                </span>
                <span className="text-[9px] font-medium text-slate-400 tracking-widest uppercase leading-none mt-0.5">
                  Milwaukee Directory & Curated Registry
                </span>
              </div>
            </button>
          </div>

          {/* Center: View As + Nav */}
          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-200 gap-1.5">
                  View As: {viewAs === 'customer' ? 'Customer' : 'Vendor'}
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => setViewAs('customer')}>
                  Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewAs('vendor')}>
                  Vendor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <nav className="flex items-center gap-5">
              <button
                onClick={() => handleNavClick('explore')}
                className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 tracking-wider uppercase transition-colors"
              >
                Explore Directory
              </button>
              <button
                onClick={() => handleNavClick('featured')}
                className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 tracking-wider uppercase transition-colors"
              >
                Featured Gems
              </button>
              <button
                onClick={() => handleNavClick('cart-booking')}
                className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 tracking-wider uppercase transition-colors"
              >
                Unified Cart Booking
              </button>
            </nav>
          </div>

          {/* Right: Cart */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <ShoppingCart className="size-5 text-slate-700" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search bar row */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 size-4 text-slate-400" />
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search through professional Milwaukee directories..."
                className="pl-9 pr-24 h-9 bg-white border-slate-200 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-400"
              />
              <div className="absolute right-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Milwaukee, WI</span>
                <Button
                  type="submit"
                  className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
