'use client'

import { Search, Menu, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAppStore } from '@/lib/store'

export function Header() {
  const { goHome, setView, navigateToSearch, navigateToCategory } = useAppStore()
  const [localSearch, setLocalSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearch.trim()) {
      navigateToSearch(localSearch.trim())
      setLocalSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              Planviry
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={goHome}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setView('directory')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Vendors
            </button>
            <button
              onClick={() => navigateToCategory('wedding_venue')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Venues
            </button>
            <button
              onClick={() => navigateToCategory('photography')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Photography
            </button>
            <button
              onClick={() => navigateToCategory('catering')}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Catering
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search vendors..."
                  className="pl-9 h-9 w-56 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 text-sm"
                />
              </div>
            </form>

            <Button
              className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-white h-9 text-sm font-medium shadow-sm"
              onClick={() => setView('claim')}
            >
              <Plus className="size-4 mr-1.5" />
              List Your Business
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <SheetHeader>
                  <SheetTitle className="text-blue-600 font-bold">
                    Planviry
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-6">
                  {/* Mobile Search */}
                  <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search vendors..."
                        className="pl-9 bg-slate-50 border-slate-200"
                      />
                    </div>
                  </form>

                  <nav className="flex flex-col gap-1">
                    <button
                      className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => { goHome(); setMobileOpen(false) }}
                    >
                      Home
                    </button>
                    <button
                      className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => { setView('directory'); setMobileOpen(false) }}
                    >
                      Browse Vendors
                    </button>
                    <button
                      className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => { navigateToCategory('wedding_venue'); setMobileOpen(false) }}
                    >
                      Venues
                    </button>
                    <button
                      className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => { navigateToCategory('photography'); setMobileOpen(false) }}
                    >
                      Photography
                    </button>
                    <button
                      className="text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => { navigateToCategory('catering'); setMobileOpen(false) }}
                    >
                      Catering
                    </button>
                  </nav>

                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-2"
                    onClick={() => { setView('claim'); setMobileOpen(false) }}
                  >
                    <Plus className="size-4 mr-1.5" />
                    List Your Business
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
