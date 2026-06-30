'use client'

import React from 'react'
import { ArrowRight, Star, ShieldCheck, BadgeCheck, Calendar, DollarSign, Zap, Clock, ChevronRight, Heart, Gift, Music, Briefcase, Mountain, Award, Crown, Sparkles, Gem, Users, Baby } from 'lucide-react'
import { Vendor, getCategoryLabel } from '@/lib/marketplace-types'
import { STATIC_EVENT_TYPES, type EventType } from '@/hooks/use-event-types'
import { useRecentActivity } from '@/hooks/use-recent-activity'

// Lucide icon map for event types - no emojis
const EVENT_LUCIDE_MAP: Record<string, React.ElementType> = {
  rings: Gem, cake: Gift, 'party-popper': Music, sparkles: Sparkles,
  briefcase: Briefcase, gift: Gift, mountain: Mountain, award: Award,
  baby: Baby, heart: Heart, crown: Crown, star: Star, users: Users,
}

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

  const recentActivity = useRecentActivity()

  // Newest 8 vendors (non-featured first, then all)
  const newVendors = [...vendors]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 8)

  return (
    <div className="bg-[#FAF9F6]">
      {/* SPOTLIGHT */}
      <section id="featured-spotlights" className="py-20 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p className="font-utility text-[10px] text-ember mb-3">Curated Highlights</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-[1.0] mb-3">Milwaukee Spotlight Partners</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">Handpicked by local planners of <span className="font-semibold text-foreground">BestTimeMKE</span>. {vendors.length} verified vendors across Milwaukee county.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {spotlightVendors.map((vendor) => (
              <div key={vendor.id} className="group relative flex flex-col justify-between bg-card overflow-hidden hover:border-ember/40 transition-colors">
                <div>
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                      src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop&q=80'}
                      alt={vendor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-ink text-ink-foreground font-utility text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
                        {getCategoryLabel(vendor.category)}
                      </span>
                    </div>
                    {vendor.isFeatured && (
                      <div className="absolute top-4 right-4 h-6 w-6 bg-ember text-ember-foreground flex items-center justify-center">
                        <Star size={10} className="fill-current" strokeWidth={0} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between font-utility text-[11px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="text-ember fill-ember" strokeWidth={0} />
                        <b className="text-foreground font-bold">{vendor.averageRating || '-'}</b>
                        <span>({vendor.reviewCount || 0} reviews)</span>
                      </span>
                      <span>{vendor.priceRange || '$$'}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground leading-snug">{vendor.name}</h3>
                    <p className="font-body text-xs sm:text-[13px] text-muted-foreground leading-relaxed mt-3">
                      {vendor.bio || 'Premium Milwaukee event service awaiting owner connection.'}
                    </p>
                    {vendor.address && (
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 font-utility text-[11px] text-muted-foreground">
                        <span className="h-1.5 w-1.5 bg-ember flex-shrink-0" />
                        <span className="truncate">{vendor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button onClick={() => onSelectVendor(vendor.id)} className="w-full bg-ink text-ink-foreground hover:opacity-90 transition-opacity font-utility text-[12px] font-bold uppercase tracking-[0.12em] py-3 px-4 flex items-center justify-center gap-2">
                    <span>Inquire &amp; Reserve</span><ArrowRight size={13} />
                  </button>
                  <div className="text-center mt-2">
                    <span className="font-utility text-[10px] text-muted-foreground">
                      {vendor.isVerified ? 'Verified Partner' : 'Direct Lead Channel Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-start gap-6">
            <p className="font-body text-xs text-muted-foreground max-w-sm leading-relaxed">Are you an established local provider? Better exposure leads to 4× higher bookings.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={onOpenSignupModal} className="font-utility text-[11px] font-bold uppercase tracking-[0.15em] text-ember hover:opacity-70 transition-opacity">Register a Listing →</button>
              <button onClick={() => { const unclaimed = vendors.find(v => !v.isClaimed) || vendors[0]; if (unclaimed) onOpenClaimModal(unclaimed) }} className="font-utility text-[11px] font-bold uppercase tracking-[0.15em] text-foreground hover:text-ember transition-colors">Claim Existing Profile →</button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY MARKETPLACE */}
      {topCategories.length > 0 && (
        <section className="py-16 border-b border-border bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mb-10">
              <p className="font-utility text-[10px] text-ember mb-3">Browse by Category</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-[1.05]">Explore Milwaukee&apos;s Best</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border">
              {topCategories.map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => onSelectCategory?.(category)}
                  className="bg-card p-5 text-center hover:bg-ink hover:text-ink-foreground transition-colors group"
                >
                  <div className="font-display text-2xl font-bold text-foreground group-hover:text-ink-foreground">{count}</div>
                  <div className="font-utility text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-ink-foreground/70 mt-1">{getCategoryLabel(category)}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BENTO GRID */}
      <section id="unified-booking-how" className="py-20 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="font-utility text-[10px] text-ember mb-3">Marketplace Architecture</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-[1.0] mb-3">How Unified Booking Works</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">No more juggling dozens of separate invoices. Planviry unites the county&apos;s elite planners and performers into one smart marketplace engine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            <div className="md:col-span-2 bg-card p-8 flex flex-col justify-between hover:bg-muted transition-colors">
              <div className="max-w-md">
                <p className="font-utility text-[10px] text-ember mb-4">Unified Cart System</p>
                <h3 className="font-display text-3xl font-bold text-foreground mb-2">Assemble Your Dream Team in One Tap</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">Browse verified Milwaukee DJs, historic reception galleries, and local coordinators simultaneously. Add preferred rates, customized package tiers, or timing frames directly into a single unified event cart.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <span className="font-body text-xs text-muted-foreground">Eliminates chaotic billing chains and misaligned dates</span>
                <span className="font-utility text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Module 01</span>
              </div>
            </div>
            <div className="bg-card p-8 flex flex-col justify-between hover:bg-muted transition-colors">
              <div>
                <p className="font-utility text-[10px] text-ember mb-4">Consolidated Checkout</p>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Single Down Deposit</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">Pay one secure 20% retainer down payment to immediately lock in all vendors. Planviry manages automated, escrow-backed disbursements directly to verified bank accounts.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <span className="font-body text-[11px] text-muted-foreground">Escrow disbursement guarantee</span>
                <span className="font-utility text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Module 02</span>
              </div>
            </div>
            <div className="bg-card p-8 flex flex-col justify-between hover:bg-muted transition-colors">
              <div>
                <p className="font-utility text-[10px] text-ember mb-4">Automatic Sync</p>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Calendar Match Engine</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">The system checks permissions and dates in real-time. If a venue changes their availability hours, your booked DJs &amp; planners are instantly alerted to avoid logistical mishaps.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <span className="font-body text-[11px] text-muted-foreground">Real-time status tracking active</span>
                <span className="font-utility text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Module 03</span>
              </div>
            </div>
            <div className="md:col-span-2 bg-ink p-8 flex flex-col justify-between">
              <div className="max-w-lg">
                <p className="font-utility text-[10px] text-ember mb-4">Security Guard</p>
                <h3 className="font-display text-3xl font-bold text-ink-foreground mb-2">No Unverified Listings, No Bad Actors</h3>
                <p className="font-body text-sm text-ink-foreground/60 leading-relaxed">Planviry blocks bad actors by verifying registered domain credentials and ownership roles. The platform acts as a secure custody layer so that you are exclusively dealing with accredited local businesses.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-ink-foreground/10 flex items-center justify-between">
                <span className="font-body text-xs text-ink-foreground/40">Domain cross-checking and secure authentication standard</span>
                <span className="font-utility text-[10px] font-bold text-ember uppercase tracking-[0.15em]">Module 04</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW VENDORS ── */}
      <section className="py-16 border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-utility text-[10px] text-ember mb-1">Freshly Listed</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">New to the Marketplace</h2>
            </div>
            <button onClick={() => onSelectCategory?.('new')} className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember hover:opacity-70 transition-opacity hidden sm:block">View all →</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
            {newVendors.map(vendor => (
              <button
                key={vendor.id}
                onClick={() => onSelectVendor(vendor.id)}
                className="flex-shrink-0 w-44 snap-start bg-card border border-border overflow-hidden hover:border-ember/40 transition-colors group text-left"
              >
                <div className="h-28 bg-muted overflow-hidden relative">
                  <img
                    src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=260&fit=crop&q=80'}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=260&fit=crop&q=80'; }}
                  />
                  {vendor.isVerified && (
                    <div className="absolute top-2 right-2 bg-card/90 p-1 border border-border"><ShieldCheck size={10} className="text-teal" /></div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-utility text-[10px] text-ember uppercase tracking-[0.15em] mb-0.5">{getCategoryLabel(vendor.category)}</p>
                  <p className="font-display text-[13px] font-bold text-foreground truncate leading-tight">{vendor.name}</p>
                  {vendor.priceRange && <p className="font-utility text-[11px] text-muted-foreground mt-1">{vendor.priceRange}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR EVENT ── */}
      <section className="py-16 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="font-utility text-[10px] text-ember mb-3">Skip the Search</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-[1.05] mb-3">
              Choose Your <span className="italic font-normal text-teal">Event</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">Tell us what you&apos;re planning. We curate every vendor - venues, caterers, photographers, DJs, and more.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border">
            {STATIC_EVENT_TYPES.map((et: EventType) => {
              const Icon = EVENT_LUCIDE_MAP[et.icon] ?? Sparkles;
              return (
                <button
                  key={et.slug}
                  onClick={() => onSelectCategory?.(et.slug)}
                  className="group flex flex-col items-start p-5 bg-card hover:bg-ink hover:text-ink-foreground transition-colors text-left"
                >
                  <Icon size={20} className="text-ember group-hover:text-ink-foreground mb-3 flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-display text-[14px] font-bold text-foreground group-hover:text-ink-foreground leading-tight mb-1">{et.name}</span>
                  <span className="font-body text-[11px] text-muted-foreground group-hover:text-ink-foreground/70 leading-snug line-clamp-2">{et.wizard_hero_text}</span>
                  {(et as any).avg_budget_range && (
                    <span className="mt-2 font-utility text-[10px] text-ember group-hover:text-ink-foreground/60 uppercase tracking-[0.15em]">{(et as any).avg_budget_range}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLAIM YOUR PROFILE ── */}
      <section className="py-16 bg-ink border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-utility text-[10px] text-ember mb-4">For Vendors</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-foreground leading-[1.05] mb-4">
                Your business is already listed.<br />
                <span className="italic font-normal text-teal">Make it yours.</span>
              </h2>
              <p className="font-body text-sm text-ink-foreground/60 leading-relaxed mb-8">Planviry pre-seeds verified Milwaukee vendors. Claim your profile to unlock bookings, leads, and the trusted badge that converts browsers into clients.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onOpenClaimModal as () => void} className="inline-flex items-center gap-2 px-6 py-3 bg-ember text-ember-foreground font-utility text-[12px] font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity">
                  Claim My Profile <ArrowRight size={13} />
                </button>
                <button onClick={onOpenSignupModal} className="px-6 py-3 border border-ink-foreground/20 text-ink-foreground font-utility text-[12px] font-bold uppercase tracking-[0.12em] hover:border-ink-foreground/60 transition-colors">
                  Create New Listing
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-ink-foreground/10 border border-ink-foreground/10">
              {[
                { Icon: BadgeCheck, title: '4× More Bookings', desc: 'Verified profiles convert at 4× the rate of unverified listings.' },
                { Icon: DollarSign, title: 'Escrow Protection', desc: 'All payments flow through our secure escrow layer - zero chargebacks.' },
                { Icon: Calendar, title: 'Calendar Sync', desc: 'Real-time availability syncs with booked clients automatically.' },
                { Icon: Zap, title: 'Lead Alerts', desc: 'Get instant notifications when clients request your availability.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="p-5 bg-ink">
                  <Icon size={18} className="text-ember mb-3" strokeWidth={1.5} />
                  <p className="font-display text-[14px] font-bold text-ink-foreground mb-1">{title}</p>
                  <p className="font-body text-[11px] text-ink-foreground/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT ACTIVITY ── */}
      {recentActivity.items.length > 0 && (
        <section className="py-14 border-b border-border bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-utility text-[10px] text-ember mb-1">Live Platform</p>
                <h2 className="font-display text-2xl font-bold text-foreground">Recent Activity</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 bg-teal animate-pulse" />
                <span className="font-utility text-[10px] text-teal font-bold uppercase tracking-[0.15em]">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {recentActivity.items.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-5 bg-card hover:border-ember/40 transition-colors">
                  <ChevronRight size={14} className="text-ember flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[13px] font-bold text-foreground truncate">{item.vendor_name}</p>
                    <p className="font-body text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                    <div className="flex items-center gap-1 mt-2 font-utility text-[10px] text-muted-foreground">
                      <Clock size={9} />
                      <span>{item.time_ago}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export function ComprehensiveFooter({ onViewChange }: { onViewChange: (view: any) => void }) {
  return (
    <footer className="bg-ink text-ink-foreground/60 font-body mt-auto">
      <div className="h-[2px] bg-ember" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-ink-foreground">Best</span>
              <span className="font-display text-xl italic font-light text-ember">Time</span>
            </div>
            <p className="font-body text-xs text-ink-foreground/50 max-w-sm leading-relaxed">Planviry is the curated directory and multi-vendor coordination engine of Milwaukee, Wisconsin. Engineered to foster trusted alignments, unified event cart transactions, and zero bad actors.</p>
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-teal" />
              <span className="font-utility text-[10px] text-teal font-bold uppercase tracking-[0.15em]">All systems active</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-utility text-[10px] font-bold tracking-[0.2em] text-ember uppercase">Explore</h4>
            <ul className="space-y-2 font-body text-xs text-ink-foreground/50">
              <li><button onClick={() => onViewChange('directory')} className="hover:text-ink-foreground transition-colors">Milwaukee Directory</button></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Featured Planners</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Unified Booking Engine</span></li>
              <li><button onClick={() => onViewChange('cart')} className="hover:text-ink-foreground transition-colors">My Event Cart</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-utility text-[10px] font-bold tracking-[0.2em] text-ember uppercase">For Vendors</h4>
            <ul className="space-y-2 font-body text-xs text-ink-foreground/50">
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Claim Seeded Profile</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Interactive Lead Portal</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Calendar Sync Tools</span></li>
              <li><span className="text-ink-foreground/30">Advertising Solutions</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-utility text-[10px] font-bold tracking-[0.2em] text-ember uppercase">Trust &amp; Safety</h4>
            <ul className="space-y-2 font-body text-xs text-ink-foreground/50">
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Verification Protocols</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Escrow Guarantee Terms</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Operator Audit Records</span></li>
              <li><span className="hover:text-ink-foreground cursor-pointer transition-colors">Domain Claim Checklist</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-ink-foreground/30">
          <p>© 2026 Planviry Directory Index. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-ink-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-ink-foreground cursor-pointer transition-colors">Escrow Terms</span>
            <span className="hover:text-ink-foreground cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
