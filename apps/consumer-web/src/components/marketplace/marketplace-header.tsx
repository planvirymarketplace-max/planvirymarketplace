'use client'

import { Search, Menu, User, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function MarketplaceHeader() {
  const { setView, user, setUser, searchQuery, setSearchQuery } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Vendors', view: 'vendors' as const },
    { label: 'Venues', view: 'vendors' as const },
    { label: 'Bars & Clubs', view: 'vendors' as const },
    { label: 'DJs & Music', view: 'vendors' as const },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white supports-[backdrop-filter]:bg-white/95">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <div className="bg-blue-600 text-white flex size-8 items-center justify-center rounded-lg font-bold text-sm">
              MKE
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-blue-600 font-bold text-base leading-tight">Planviry</span>
              <span className="text-[10px] text-gray-500 leading-tight">Milwaukee Vendors</span>
            </div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link, i) => (
            <Button
              key={link.label + i}
              variant="ghost"
              size="sm"
              onClick={() => setView(link.view)}
              className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto lg:ml-4">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search Milwaukee vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 pr-0 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setView('vendors')
                }
              }}
            />
            <Button
              size="sm"
              className="h-9 rounded-l-none bg-orange-500 hover:bg-orange-600 text-white px-4"
              onClick={() => setView('vendors')}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            className="hidden sm:inline-flex cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setView('claim-vendor')}
          >
            List Your Business
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-blue-600/10 text-blue-600 text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setView('vendor-dashboard')} className="cursor-pointer">
                  Vendor Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('admin-dashboard')} className="cursor-pointer">
                  Admin Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => { setUser(null); setView('home') }}
                  className="cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                  <User className="size-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView('login')} className="cursor-pointer">
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('login')} className="cursor-pointer">
                  Create Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden size-9">
                <Menu className="size-4 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 px-2 mb-2">
                  <div className="bg-blue-600 text-white flex size-8 items-center justify-center rounded-lg font-bold text-sm">
                    MKE
                  </div>
                  <span className="text-blue-600 font-bold text-lg">Planviry</span>
                </div>
                {navLinks.map((link, i) => (
                  <Button
                    key={link.label + i}
                    variant="ghost"
                    className="justify-start cursor-pointer text-gray-600"
                    onClick={() => { setView(link.view); setMobileMenuOpen(false) }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  onClick={() => { setView('claim-vendor'); setMobileMenuOpen(false) }}
                >
                  List Your Business
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setView('login'); setMobileMenuOpen(false) }}
                  className="cursor-pointer border-blue-600 text-blue-600"
                >
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
