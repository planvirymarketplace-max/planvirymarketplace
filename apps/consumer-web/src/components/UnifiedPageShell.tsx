/**
 * UnifiedPageShell — THE one template every page uses.
 *
 * Layout (top to bottom):
 *   1. Breadcrumb
 *   2. Hero: eyebrow + title + subtitle + search bar (what + where)
 *   3. Category pills (horizontal scroll, on-page navigation)
 *   4. Main content (card grid, passed as children)
 *   5. Browse related (at the BOTTOM, not sidebar)
 *   6. (Footer is in root layout)
 *
 * Usage:
 *   <UnifiedPageShell
 *     eyebrow="LIVE EVENTS"
 *     title="Concert Tickets"
 *     subtitle="Find and buy tickets for upcoming concerts."
 *     breadcrumbs={[...]}
 *     pills={[{ label: 'Rock', href: '/tickets/concerts/rock' }, ...]}
 *     related={[{ label: 'Sports', href: '/tickets/sports' }, ...]}
 *   >
 *     {card grid content}
 *   </UnifiedPageShell>
 */

import Link from 'next/link'
import { ChevronRight, Home, Search, MapPin } from 'lucide-react'

export interface Breadcrumb {
  label: string
  href?: string
}

export interface Pill {
  label: string
  href: string
  active?: boolean
}

export interface RelatedLink {
  label: string
  href: string
  description?: string
}

interface UnifiedPageShellProps {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumbs: Breadcrumb[]
  pills?: Pill[]
  related?: RelatedLink[]
  relatedTitle?: string
  children: React.ReactNode
  /** Optional hero image URL (real image, not gradient) */
  heroImage?: string
  /** Show the search bar in the hero */
  showSearch?: boolean
}

export function UnifiedPageShell({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  pills = [],
  related = [],
  relatedTitle = 'Browse Related',
  children,
  heroImage,
  showSearch = true,
}: UnifiedPageShellProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* ── BREADCRUMB ────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    <span>{item.label}</span>
                  </Link>
                ) : null}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className={`border-b border-gray-200 ${heroImage ? 'relative' : 'bg-white'}`}>
        {heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroImage} alt="" className="w-full h-full object-cover opacity-10" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          {eyebrow && (
            <p className="text-[10.5px] font-black uppercase tracking-widest text-coral mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">{subtitle}</p>
          )}

          {/* Search bar — "what + where" like PeerSpace */}
          {showSearch && (
            <div className="mt-5 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="What are you planning?"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Where?"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>
              <button className="bg-black text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
                Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORY PILLS (on-page navigation) ──────────────────────── */}
      {pills.length > 0 && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-thin">
              {pills.map((pill) => (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    pill.active
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black'
                  }`}
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {children}
      </div>

      {/* ── BROWSE RELATED (at the BOTTOM) ───────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              {relatedTitle}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group p-3 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg"
                >
                  <p className="text-xs font-bold text-black group-hover:text-coral transition-colors">
                    {link.label}
                  </p>
                  {link.description && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{link.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
