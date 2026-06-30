'use client'

import React from 'react'
import { Sparkles, ArrowRight, Star, ShieldCheck, ExternalLink } from 'lucide-react'
import { Vendor, getCategoryLabel } from '@/lib/marketplace-types'

interface LandingSectionsProps {
  onSelectVendor: (id: string) => void
  onOpenSignupModal: () => void
  onOpenClaimModal: (vendor: any) => void
  vendors: Vendor[]
  onSelectCategory?: (category: string) => void
}

export function LandingSections({ onSelectVendor, onOpenSignupModal, onOpenClaimModal, vendors, onSelectCategory }: LandingSectionsProps) {
  // Use real featured vendors from the database, or fallback to top verified vendors
  const spotlightVendors = vendors
    .filter(v => v.isFeatured || v.isVerified)
    .slice(0, 3)

  // Get vendor count by category for the marketplace section
  const categoryCounts = vendors.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)

  return (
    <div className="bg-[#FAF9F6]">
      {/* SPOTLIGHT */}
      <section id="featured-spotlights" className="py-20 border-b border-stone-200/80 relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_bottom_right,rgba(28,25,23,0.01),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 block mb-3 font-mono">Curated Highlights</span>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-none">Milwaukee Spotlight Partners</h2>
            <p className="text-stone-600 mt-4 text-sm font-light leading-relaxed">Handpicked by local planners of <span className="font-semibold text-stone-900">BestTimeMKE</span>. {vendors.length} verified vendors across Milwaukee county.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spotlightVendors.map((vendor) => (
              <div key={vendor.id} className="group relative flex flex-col justify-between bg-white border border-stone-200/80 rounded-3xl overflow-hidden hover:border-stone-900 transition-all duration-300 shadow-sm">
                <div>
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    <img
                      src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop&q=80'}
                      alt={vendor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-stone-950 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {getCategoryLabel(vendor.category)}
                      </span>
                    </div>
                    {vendor.isFeatured && (
                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-stone-950/80 text-white backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[9px] font-bold">★</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-2">
                      <span className="flex items-center">
                        <Star size={12} className="text-stone-800 fill-stone-800 mr-1" />
                        <b className="text-stone-950 font-bold mr-1">{vendor.averageRating || '-'}</b>
                        ({vendor.reviewCount || 0} reviews)
                      </span>
                      <span>{vendor.priceRange || '$$'} Premium Range</span>
                    </div>
                    <h3 className="font-[var(--font-display)] text-2xl font-normal text-stone-900 leading-snug tracking-tight">{vendor.name}</h3>
                    <p className="text-stone-600 font-light text-xs sm:text-[13px] leading-relaxed mt-3">
                      {vendor.bio || 'Premium Milwaukee event service awaiting owner connection.'}
                    </p>
                    {vendor.address && (
                      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-xs text-stone-700">
                        <span className="h-2 w-2 rounded-full bg-stone-900 mr-2"></span>
                        <span className="font-medium truncate">{vendor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button onClick={() => onSelectVendor(vendor.id)} className="w-full rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-3 px-4 transition-colors tracking-wider uppercase text-center flex items-center justify-center space-x-1.5">
                    <span>Inquire & Reserve Date</span><ArrowRight size={13} />
                  </button>
                  <div className="text-center mt-2">
                    <span className="text-[10px] font-mono text-stone-400">
                      {vendor.isVerified ? 'Verified Partner' : 'Direct Lead Channel Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-xs text-stone-500 font-light">Are you an established local provider looking to get featured in our spotlight partners section? Better exposure leads to 4x higher bookings.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <button onClick={onOpenSignupModal} className="inline-flex items-center space-x-1 font-semibold text-stone-900 text-xs hover:underline"><span>Register a Brand Listing</span><ExternalLink size={11} /></button>
              <span className="text-stone-300">|</span>
              <button onClick={() => { const unclaimed = vendors.find(v => !v.isClaimed) || vendors[0]; if (unclaimed) onOpenClaimModal(unclaimed) }} className="inline-flex items-center space-x-1 font-semibold text-stone-900 text-xs hover:underline"><span>Claim Existing Profile Page</span><ShieldCheck size={11} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY MARKETPLACE */}
      {topCategories.length > 0 && (
        <section className="py-16 border-b border-stone-200/80 bg-[#FAF9F6]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 block mb-3 font-mono">Browse by Category</span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight leading-none">Explore Milwaukee&apos;s Best</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {topCategories.map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => onSelectCategory?.(category)}
                  className="bg-white border border-stone-200/80 rounded-2xl p-4 text-center hover:border-stone-400 hover:shadow-sm transition-all group"
                >
                  <div className="font-[var(--font-display)] text-2xl font-semibold text-stone-900 group-hover:text-stone-600 transition">{count}</div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 mt-1">{getCategoryLabel(category)}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BENTO GRID */}
      <section id="unified-booking-how" className="py-20 border-b border-stone-200/80 bg-[#FAF9F6] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 block mb-3 font-mono">Marketplace Architecture</span>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-none">How Unified Booking Works</h2>
            <p className="text-stone-600 mt-4 text-sm font-light leading-relaxed">No more juggling dozens of separate invoices. Planviry unites the county&apos;s elite planners and performers into one smart marketplace engine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-stone-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div className="max-w-md">
                <span className="bg-stone-100 text-stone-800 text-[9px] font-bold uppercase tracking-widest font-mono px-2 py-0.5 rounded">Unified Cart System</span>
                <h3 className="font-[var(--font-display)] text-3xl font-normal text-stone-900 mt-4 mb-2">Assemble Your Dream Team in One Tap</h3>
                <p className="text-stone-600 font-light text-xs sm:text-sm leading-relaxed">Browse verified Milwaukee DJs, historic reception galleries, and local coordinators simultaneously. Add preferred rates, customized package tiers, or timing frames directly into a single unified event cart.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-light">Eliminates chaotic billing chains and misaligned dates</span>
                <span className="font-mono text-xs font-bold text-stone-900">Module 01</span>
              </div>
            </div>
            <div className="bg-white border border-stone-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div>
                <span className="bg-stone-100 text-stone-800 text-[9px] font-bold uppercase tracking-widest font-mono px-2 py-0.5 rounded">Consolidated Checkout</span>
                <h3 className="font-[var(--font-display)] text-2xl font-normal text-stone-900 mt-4 mb-2">Single Down Deposit</h3>
                <p className="text-stone-600 font-light text-xs leading-relaxed">Pay one secure 20% retainer down payment to immediately lock in all vendors. Planviry manages automated, escrow-backed disbursements directly to verified bank accounts.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-light">Escrow disbursement guarantee</span>
                <span className="font-mono text-xs font-bold text-stone-900">Module 02</span>
              </div>
            </div>
            <div className="bg-white border border-stone-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div>
                <span className="bg-stone-100 text-stone-800 text-[9px] font-bold uppercase tracking-widest font-mono px-2 py-0.5 rounded">Automatic Sync</span>
                <h3 className="font-[var(--font-display)] text-2xl font-normal text-stone-900 mt-4 mb-2">Calendar Match Engine</h3>
                <p className="text-stone-600 font-light text-xs leading-relaxed">The system checks permissions and dates in real-time. If a venue changes their availability hours, your booked DJs & planners are instantly alerted to avoid logistical mishaps.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-light">Real-time status tracking active</span>
                <span className="font-mono text-xs font-bold text-stone-900">Module 03</span>
              </div>
            </div>
            <div className="md:col-span-2 bg-white border border-stone-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-stone-400 transition-colors">
              <div className="max-w-lg">
                <span className="bg-stone-100 text-stone-800 text-[9px] font-bold uppercase tracking-widest font-mono px-2 py-0.5 rounded">Security Guard</span>
                <h3 className="font-[var(--font-display)] text-3xl font-normal text-stone-900 mt-4 mb-2">No Unverified Listings, No Bad Actors</h3>
                <p className="text-stone-600 font-light text-xs sm:text-sm leading-relaxed">Planviry blocks bad actors by verifying registered domain credentials and ownership roles. The platform acts as a secure custody layer so that you are exclusively dealing with accredited local businesses.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-light">Domain cross-checking and secure authentication standard</span>
                <span className="font-mono text-xs font-bold text-stone-900">Module 04</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function ComprehensiveFooter({ onViewChange }: { onViewChange: (view: any) => void }) {
  return (
    <footer className="bg-white border-t border-stone-200/80 text-stone-600 font-sans mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white"><span className="font-[var(--font-display)] text-sm font-bold tracking-widest">B</span></div>
              <span className="font-[var(--font-display)] text-lg font-semibold text-stone-900">Planviry</span>
            </div>
            <p className="text-xs text-stone-500 font-light max-w-sm leading-relaxed">Planviry is the curated directory and multi-vendor coordination engine of Milwaukee, Wisconsin. Engineered to foster trusted alignments, unified event cart transactions, and zero bad actors.</p>
            <div className="text-[11px] text-stone-400 flex items-center space-x-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>All systems active • Planviry Directory</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-stone-900 uppercase">Explore Services</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><button onClick={() => onViewChange('directory')} className="hover:text-stone-900">Milwaukee Directory</button></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Featured Planners</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Unified Booking Engine</span></li>
              <li><button onClick={() => onViewChange('cart')} className="hover:text-stone-900">My Live Event Cart</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-stone-900 uppercase">For Vendors</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><span className="hover:text-stone-900 cursor-pointer">Claim Seeded Profile</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Interactive Lead Portal</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Calendar Sync Tools</span></li>
              <li><span className="text-stone-400">Advertising Solutions</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-stone-900 uppercase">Trust & Safety</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><span className="hover:text-stone-900 cursor-pointer">Verification Protocols</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Escrow Guarantee Terms</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Operator Audit Records</span></li>
              <li><span className="hover:text-stone-900 cursor-pointer">Domain Claim Checklist</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-200/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="font-light">© 2026 Planviry Directory Index. Formulated alongside BestTimeMKE planners. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-stone-800 cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-stone-800 cursor-pointer">Secured Escrow</span>
            <span className="hover:text-stone-800 cursor-pointer">Operator System API</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
