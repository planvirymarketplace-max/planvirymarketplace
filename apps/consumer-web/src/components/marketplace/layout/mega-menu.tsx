'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Building2, Sparkles, Utensils, Wine, UtensilsCrossed, Music,
  Camera, Flower2, Scissors, Gem, Bus, Package, Hotel,
  ChevronRight, X, Search, Plane, ClipboardList, ChefHat,
  Car, Zap,
} from 'lucide-react'
import { NAV_CATEGORIES, type NavCategory, type NavSubcategory } from '@/lib/directory-filter-data'
import { STATIC_EVENT_TYPES, type EventType } from '@/hooks/use-event-types'

// ─── Icon map for category groups (no colored backgrounds) ─────────────────────
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  'building': <Building2 className="h-4 w-4" />,
  'clipboard': <ClipboardList className="h-4 w-4" />,
  'chef-hat': <ChefHat className="h-4 w-4" />,
  'wine': <Wine className="h-4 w-4" />,
  'utensils': <UtensilsCrossed className="h-4 w-4" />,
  'music': <Music className="h-4 w-4" />,
  'camera': <Camera className="h-4 w-4" />,
  'flower': <Flower2 className="h-4 w-4" />,
  'sparkles': <Sparkles className="h-4 w-4" />,
  'gem': <Gem className="h-4 w-4" />,
  'car': <Car className="h-4 w-4" />,
  'package': <Package className="h-4 w-4" />,
  'hotel': <Hotel className="h-4 w-4" />,
  'plane': <Plane className="h-4 w-4" />,
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

export function MegaMenu({ isOpen, onClose, onNavigate }: MegaMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<NavCategory>(NAV_CATEGORIES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'categories' | 'experiences'>('categories')
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      searchInputRef.current?.focus()
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Filter categories by search
  const filteredCategories = searchQuery
    ? NAV_CATEGORIES.filter(cat => {
        const q = searchQuery.toLowerCase()
        return (
          cat.label.toLowerCase().includes(q) ||
          cat.subcategories.some(sub => sub.label.toLowerCase().includes(q))
        )
      })
    : NAV_CATEGORIES

  const filteredSubcategories = (cat: NavCategory): NavSubcategory[] => {
    if (!searchQuery) return cat.subcategories
    const q = searchQuery.toLowerCase()
    return cat.subcategories.filter(sub => sub.label.toLowerCase().includes(q))
  }

  const handleCategoryClick = useCallback((cat: NavCategory, sub?: NavSubcategory) => {
    if (sub) {
      onNavigate(`/directory?category=${cat.key}&sub=${sub.filterSchemaKey}`)
    } else {
      onNavigate(`/directory?category=${cat.key}`)
    }
    onClose()
  }, [onNavigate, onClose])

  const handleExperienceClick = useCallback((et: EventType) => {
    onNavigate(`/explore/${et.slug}`)
    onClose()
  }, [onNavigate, onClose])

  if (!isOpen) return null

  // Top subcategories = first 5, rest are "more"
  const topSubs = hoveredCategory.subcategories.slice(0, 5)
  const moreSubs = hoveredCategory.subcategories.slice(5)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Mega menu panel - all white, clean */}
      <div
        ref={menuRef}
        className="fixed inset-x-0 top-0 z-[200] max-h-[90vh] overflow-hidden bg-white border-b border-border shadow-2xl"
      >
        {/* ── Header bar ──────────────────────────────────────────── */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <span className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-ember">Menu</span>
            </div>

            {/* Tab switcher - Categories (3-level) | Events (4-level) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-1.5 font-utility text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-ink text-ink-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Browse Categories
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`px-4 py-1.5 font-utility text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === 'experiences'
                    ? 'bg-ink text-ink-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Choose Event
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="border-b border-border bg-white">
            <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-3">
              <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories... (e.g. wedding venue, DJ, brunch)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border bg-white placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Categories Tab (3-level: Category → Subcategory → Filters) ── */}
        {activeTab === 'categories' && (
          <div className="mx-auto max-w-[1400px] px-4 md:px-6">
            <div className="flex min-h-[420px] max-h-[calc(90vh-120px)]">

              {/* ─── Column 1: Category Groups (Level 1) ─────────────── */}
              <div className="w-56 lg:w-64 flex-shrink-0 border-r border-border py-3 overflow-y-auto">
                <button
                  onClick={() => { onNavigate('/directory'); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors group"
                >
                  <span className="font-display text-sm font-bold group-hover:text-ember transition-colors">All Categories</span>
                </button>
                <div className="h-px bg-border my-1 mx-3" />

                {filteredCategories.map((cat) => {
                  const isActive = hoveredCategory.key === cat.key
                  return (
                    <button
                      key={cat.key}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-ink text-ink-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="font-display text-sm truncate text-left font-medium">{cat.label}</span>
                      <ChevronRight
                        size={14}
                        className={`ml-auto flex-shrink-0 ${isActive ? 'text-ink-foreground/60' : 'text-muted-foreground'}`}
                      />
                    </button>
                  )
                })}
              </div>

              {/* ─── Column 2: Subcategories (Level 2) ──────────────── */}
              <div className="flex-1 py-6 px-6 lg:px-8 overflow-y-auto">
                {hoveredCategory && (
                  <div>
                    {/* Category heading */}
                    <div className="mb-5">
                      <h3 className="font-display text-lg font-bold text-foreground">{hoveredCategory.label}</h3>
                      <p className="font-utility text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                        {hoveredCategory.subcategories.length} subcategories
                      </p>
                    </div>

                    {/* Top subcategories */}
                    {topSubs.length > 0 && (
                      <div className="mb-4">
                        <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-ember mb-2 block">Popular</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
                          {filteredSubcategories(hoveredCategory)
                            .slice(0, 5)
                            .map((sub) => (
                              <button
                                key={sub.filterSchemaKey + sub.label}
                                onClick={() => handleCategoryClick(hoveredCategory, sub)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:text-ember hover:bg-muted transition-colors text-left group"
                              >
                                <ChevronRight size={12} className="text-ember/60 group-hover:text-ember transition-colors flex-shrink-0" />
                                <span className="truncate font-medium">{sub.label}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* More subcategories */}
                    {moreSubs.length > 0 && (
                      <div>
                        {topSubs.length > 0 && (
                          <div className="h-px bg-border my-3" />
                        )}
                        <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                          More in {hoveredCategory.label}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
                          {filteredSubcategories(hoveredCategory)
                            .slice(5)
                            .map((sub) => (
                              <button
                                key={sub.filterSchemaKey + sub.label}
                                onClick={() => handleCategoryClick(hoveredCategory, sub)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-ember hover:bg-muted transition-colors text-left group"
                              >
                                <span className="w-1 h-1 bg-ember/40 group-hover:bg-ember flex-shrink-0 rounded-full transition-colors" />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* No results */}
                    {filteredSubcategories(hoveredCategory).length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No categories match &ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ─── Column 3: Quick Links ─────────────── */}
              <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 border-l border-border py-6 px-5 overflow-y-auto">
                {hoveredCategory && (
                  <div>
                    <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-ember mb-4 block">Quick Links</span>

                    {/* Top subcategories as prominent links */}
                    <div className="space-y-1 mb-6">
                      {hoveredCategory.subcategories
                        .slice(0, 5)
                        .map((sub) => (
                          <button
                            key={sub.filterSchemaKey + sub.label}
                            onClick={() => handleCategoryClick(hoveredCategory, sub)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 border border-border hover:bg-ink hover:text-ink-foreground hover:border-ink transition-all text-left group"
                          >
                            <span className="w-1.5 h-1.5 bg-ember rounded-full flex-shrink-0 group-hover:bg-ember" />
                            <span className="text-sm font-bold group-hover:text-ink-foreground transition-colors truncate">{sub.label}</span>
                            <ChevronRight size={12} className="ml-auto text-muted-foreground group-hover:text-ink-foreground/60 flex-shrink-0" />
                          </button>
                        ))}
                    </div>

                    {/* View all link */}
                    <button
                      onClick={() => handleCategoryClick(hoveredCategory)}
                      className="w-full flex items-center justify-between px-3 py-3 border border-ember/30 hover:bg-ember hover:text-ember-foreground transition-all group"
                    >
                      <span className="font-utility text-[10px] font-bold uppercase tracking-[0.15em] group-hover:text-ember-foreground transition-colors text-foreground">
                        All {hoveredCategory.label}
                      </span>
                      <ChevronRight size={14} className="text-ember group-hover:text-ember-foreground transition-colors" />
                    </button>

                    {/* Bottom directory link */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => { onNavigate('/directory'); onClose() }}
                        className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <Search size={14} />
                        <span className="font-utility text-[10px] tracking-[0.15em] uppercase font-bold">Full Directory</span>
                        <ChevronRight size={12} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Events Tab (4-level: Event Group → Type → Category → Subcategory) ── */}
        {activeTab === 'experiences' && (
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
            <div className="mb-6">
              <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-1">Planning an event?</p>
              <h3 className="font-display text-2xl font-bold text-foreground">Choose your event</h3>
              <p className="text-sm text-muted-foreground mt-1">Select the type of event you&apos;re planning and we&apos;ll match you with the perfect Milwaukee vendors.</p>
            </div>

            {/* Life Milestone Events */}
            <div className="mb-6">
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-ember mb-3 block">Life Milestones</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
                {STATIC_EVENT_TYPES.filter(et => et.category_group === 'life_milestone').map((et) => (
                  <button
                    key={et.slug}
                    onClick={() => handleExperienceClick(et)}
                    className="flex flex-col gap-1.5 px-4 py-4 bg-white hover:bg-ink hover:text-ink-foreground transition-colors group text-left"
                  >
                    <span className="font-display text-sm font-bold text-foreground group-hover:text-ink-foreground leading-tight">{et.name}</span>
                    <span className="font-utility text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-ink-foreground/40">
                      ${(et.budget_guidance_min / 1000).toFixed(0)}K–${(et.budget_guidance_max / 1000).toFixed(0)}K
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-ink-foreground/50 line-clamp-2">{et.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Celebration Events */}
            <div className="mb-6">
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-ember mb-3 block">Celebrations</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
                {STATIC_EVENT_TYPES.filter(et => et.category_group === 'celebration').map((et) => (
                  <button
                    key={et.slug}
                    onClick={() => handleExperienceClick(et)}
                    className="flex flex-col gap-1.5 px-4 py-4 bg-white hover:bg-ink hover:text-ink-foreground transition-colors group text-left"
                  >
                    <span className="font-display text-sm font-bold text-foreground group-hover:text-ink-foreground leading-tight">{et.name}</span>
                    <span className="font-utility text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-ink-foreground/40">
                      ${(et.budget_guidance_min / 1000).toFixed(0)}K–${(et.budget_guidance_max / 1000).toFixed(0)}K
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-ink-foreground/50 line-clamp-2">{et.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Events */}
            <div className="mb-4">
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-ember mb-3 block">Professional</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
                {STATIC_EVENT_TYPES.filter(et => et.category_group === 'professional').map((et) => (
                  <button
                    key={et.slug}
                    onClick={() => handleExperienceClick(et)}
                    className="flex flex-col gap-1.5 px-4 py-4 bg-white hover:bg-ink hover:text-ink-foreground transition-colors group text-left"
                  >
                    <span className="font-display text-sm font-bold text-foreground group-hover:text-ink-foreground leading-tight">{et.name}</span>
                    <span className="font-utility text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-ink-foreground/40">
                      ${(et.budget_guidance_min / 1000).toFixed(0)}K–${(et.budget_guidance_max / 1000).toFixed(0)}K
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-ink-foreground/50 line-clamp-2">{et.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onNavigate('/explore'); onClose() }}
              className="mt-3 font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground py-1 transition-colors"
            >
              See all events →
            </button>
          </div>
        )}

        {/* ── Footer bar ──────────────────────────────────────────── */}
        <div className="border-t border-border bg-white">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-3 flex items-center justify-between">
            <p className="font-utility text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
              {activeTab === 'categories'
                ? `${NAV_CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0)} subcategories across ${NAV_CATEGORIES.length} categories`
                : `${STATIC_EVENT_TYPES.length} experience types`
              }
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { onNavigate('/explore'); onClose() }}
                className="flex items-center gap-1 font-utility text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <Zap size={12} className="text-ember" /> Live Events
              </button>
              <button
                onClick={() => { onNavigate('/directory'); onClose() }}
                className="font-utility text-[10px] font-bold tracking-[0.15em] uppercase text-ember hover:text-foreground transition-colors flex items-center gap-1"
              >
                Browse All Vendors <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
