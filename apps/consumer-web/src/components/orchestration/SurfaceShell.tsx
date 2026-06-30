'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { PlanBar } from './PlanBar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SURFACE_ROUTES, SURFACE_DATA } from '@/lib/surface-data'

interface SurfaceShellProps {
  surface: string
  title: string
  subtitle: string
  children: React.ReactNode
  what?: string
  where?: string
}

export function SurfaceShell({ surface, title, subtitle, children, what, where }: SurfaceShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeSub, setActiveSub] = useState(searchParams.get('sub') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'exclusive')

  const surfaceData = SURFACE_DATA[surface]
  const subOptions = surfaceData?.whatOptions || []

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubClick = (value: string) => {
    setActiveSub(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete('sub')
    else params.set('sub', value)
    router.push(`/${surface}?${params.toString()}`, { scroll: false })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'exclusive') params.delete('sort')
    else params.set('sort', value)
    router.push(`/${surface}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top Nav */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-refined-offwhite/90 backdrop-blur-md border-b border-midnight-slate/10 h-20 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">
          <div className="flex items-center gap-12">
            <Link href="/" className="font-display-lg text-2xl md:text-3xl text-primary tracking-tighter">Planviry</Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/plan" className="font-body-md text-body-md uppercase tracking-widest text-brand-teal font-bold">Concierge</Link>
              <Link href="/vendors" className="font-body-md text-body-md uppercase tracking-widest text-midnight-slate/60 hover:text-brand-teal transition-colors duration-300">Marketplace</Link>
              <Link href="/things-to-do" className="font-body-md text-body-md uppercase tracking-widest text-midnight-slate/60 hover:text-brand-teal transition-colors duration-300">Inspiration</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/login" className="hidden md:block px-6 py-2 border border-midnight-slate/20 rounded-full font-label-md hover:bg-midnight-slate hover:text-white transition-all">Sign In</Link>
            <Link href="/cart" className="p-2 hover:bg-surface-variant rounded-full transition-colors">
              <span className="material-symbols-outlined text-midnight-slate">shopping_bag</span>
            </Link>
            <Link href="/portal" className="p-2 hover:bg-surface-variant rounded-full transition-colors">
              <span className="material-symbols-outlined text-midnight-slate">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Left Nav Rail */}
      <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] flex flex-col py-6 bg-surface-container-low border-r border-outline-variant/20 w-20 hover:w-64 transition-all duration-300 overflow-hidden z-40 group shadow-lg">
        <div className="px-6 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-display-lg text-headline-md text-primary uppercase tracking-wider">Lenses</h3>
          <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Choose your view</p>
        </div>
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto hide-scrollbar w-full">
          {SURFACE_ROUTES.map((item) => {
            const isActive = pathname === `/${item.slug}`
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className={`flex items-center w-[calc(100%-16px)] mx-2 py-3 rounded-lg shadow-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-primary translate-x-1 font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <div className="w-16 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="font-label-caps text-[12px] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pl-20 pt-20">
        {/* Plan Bar */}
        <PlanBar surface={surface} initialWhat={what} initialWhere={where} />

        {/* Subcategory Chip Row — on gray (bg-refined-offwhite), not white */}
        <div className="bg-refined-offwhite border-b border-midnight-slate/5">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => handleSubClick('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                  activeSub === 'all'
                    ? 'bg-midnight-slate border-midnight-slate text-white'
                    : 'bg-refined-offwhite border-outline-variant/40 text-midnight-slate/60 hover:text-midnight-slate'
                }`}
              >
                All {title.toLowerCase()}
              </button>
              {subOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSubClick(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                    activeSub === opt.value
                      ? 'bg-midnight-slate border-midnight-slate text-white'
                      : 'bg-refined-offwhite border-outline-variant/40 text-midnight-slate/60 hover:text-midnight-slate'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Heading + Sort */}
        <div className="px-margin-mobile md:px-margin-desktop py-lg">
          <div className="max-w-container-max mx-auto flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-3xl md:text-4xl text-midnight-slate uppercase tracking-tight">{title}</h1>
              <p className="text-sm text-midnight-slate/50 mt-1">Premium and curated entries for an exceptional, high-end experience.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-midnight-slate focus:ring-0 cursor-pointer outline-none"
              >
                <option value="exclusive">Most Exclusive</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-margin-mobile md:px-margin-desktop pb-lg min-h-[60vh]">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
