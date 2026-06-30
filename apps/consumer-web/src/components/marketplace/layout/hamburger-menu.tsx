'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, ChevronRight, MapPin, Grid3X3, Link2, LogIn, UserPlus } from 'lucide-react';
import { CATEGORY_GROUPS, type CategoryGroup, type CategoryLevel2, type SubCategory } from '@/lib/marketplace-categories';
import { STATIC_EVENT_TYPES, type EventType } from '@/hooks/use-event-types';
import seoAreas from '@/lib/seo-areas.json';
import { useRouter } from 'next/navigation';

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewName) => void;
  onNavigateToDirectory: (categoryKeyOrSlug: string, sub?: { filterSchemaKey: string; label: string } | undefined) => void;
}

/* ─── Unique area names deduped from seo-areas.json ────────────────── */
interface AreaItem {
  name: string;
  slug: string;
}

function getUniqueAreas(): AreaItem[] {
  const seen = new Set<string>();
  const areas: AreaItem[] = [];
  for (const entry of seoAreas as { searchTag: string; slug: string; h1?: string; areaName?: string; areaSlug?: string }[]) {
    const key = entry.areaName ?? entry.h1 ?? entry.searchTag;
    if (key && !seen.has(key)) {
      seen.add(key);
      areas.push({ name: key, slug: entry.areaSlug ?? entry.slug });
    }
  }
  return areas;
}

const UNIQUE_AREAS = getUniqueAreas();

/* ─── QUICK LINKS ────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { label: 'Directory', view: 'directory' as ViewName, slug: null },
  { label: 'About', view: null, slug: '/about' },
  { label: 'Contact', view: null, slug: '/contact' },
  { label: 'FAQ', view: null, slug: '/faq' },
  { label: 'Blog', view: null, slug: '/blog' },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export function HamburgerMenu({ isOpen, onClose, setView, onNavigateToDirectory }: HamburgerMenuProps) {
  const router = useRouter();

  // Accordion state: which group / category is expanded
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Body scroll lock + accordion reset on close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset accordion state after exit animation completes
      const id = setTimeout(() => {
        setExpandedGroup(null);
        setExpandedCategory(null);
      }, 300);
      return () => clearTimeout(id);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // ── Navigation helpers ────────────────────────────────────────────
  const navigateToDirectory = (slug: string) => {
    onNavigateToDirectory(slug);
    handleClose();
  };

  const navigateToArea = (slug: string) => {
    router.push(`/${slug}`);
    handleClose();
  };

  const navigateToEventType = (slug: string) => {
    onNavigateToDirectory(slug);
    handleClose();
  };

  // ── Accordion toggle ──────────────────────────────────────────────
  const toggleGroup = (groupSlug: string) => {
    if (expandedGroup === groupSlug) {
      setExpandedGroup(null);
      setExpandedCategory(null);
    } else {
      setExpandedGroup(groupSlug);
      setExpandedCategory(null);
    }
  };

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategory(prev => prev === categorySlug ? null : categorySlug);
  };

  return (
    <>
      {/* Backdrop - always in DOM, visible only when animIn */}
      <div
        className={`fixed inset-0 z-[200] bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Half-page overlay panel - always in DOM, slides in/out */}
      <div
        className={`fixed top-0 right-0 z-[201] h-full w-full lg:w-1/2 bg-white flex flex-col overflow-hidden shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header with close button ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 flex-shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">Menu</span>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center border border-black/20 text-black hover:bg-black hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Live Events CTA */}
          <div className="px-6 pt-5 pb-3">
            <button
              onClick={() => { setView('live-events'); handleClose(); }}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-black text-white hover:bg-black/90 transition-colors"
            >
              <span className="text-[15px] font-bold">Live Events</span>
              <ChevronRight size={14} className="text-white/60" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t border-black/10" />

          {/* ── Browse Categories (3-level accordion) ── */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 size={13} className="text-black/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Browse Categories</span>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-px">
            {CATEGORY_GROUPS.map((group: CategoryGroup) => {
              const isGroupExpanded = expandedGroup === group.slug;
              return (
                <div key={group.slug} className="border border-black/10 overflow-hidden">
                  {/* Level 1: Group */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleGroup(group.slug)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleGroup(group.slug); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer select-none ${isGroupExpanded ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}
                  >
                    <span className="text-[14px] font-bold">{group.name}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigateToDirectory(group.slug); }}
                        className={`text-[9px] font-bold uppercase tracking-[0.18em] transition-colors ${isGroupExpanded ? 'text-white/50 hover:text-white' : 'text-black/40 hover:text-black'}`}
                      >
                        All
                      </button>
                      {isGroupExpanded
                        ? <ChevronDown size={13} />
                        : <ChevronRight size={13} />
                      }
                    </div>
                  </div>

                  {/* Level 2 & 3: Categories and Subcategories */}
                  {isGroupExpanded && (
                    <div className="border-t border-black/5 bg-black/[0.02]">
                      {group.categories.map((cat: CategoryLevel2) => {
                        const isCatExpanded = expandedCategory === cat.slug;
                        return (
                          <div key={cat.slug}>
                            {/* Level 2: Category */}
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleCategory(cat.slug)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCategory(cat.slug); }}
                              className={`w-full flex items-center justify-between pl-8 pr-4 py-2.5 text-left transition-colors cursor-pointer select-none ${isCatExpanded ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
                            >
                              <span className="text-[13px] font-medium">{cat.name}</span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigateToDirectory(cat.slug); }}
                                  className={`text-[8px] font-bold uppercase tracking-[0.15em] transition-colors ${isCatExpanded ? 'text-white/50 hover:text-white' : 'text-black/30 hover:text-black'}`}
                                >
                                  All
                                </button>
                                {isCatExpanded
                                  ? <ChevronDown size={11} />
                                  : <ChevronRight size={11} />
                                }
                              </div>
                            </div>

                            {/* Level 3: Subcategories */}
                            {isCatExpanded && (
                              <div className="border-t border-black/5">
                                {cat.subcategories.map((sub: SubCategory) => (
                                  <button
                                    key={sub.slug}
                                    onClick={() => navigateToDirectory(sub.slug)}
                                    className="w-full text-left pl-12 pr-4 py-2 text-[12px] text-black/70 hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                                  >
                                    <span className="w-1 h-1 bg-black/30 flex-shrink-0" />
                                    <span>{sub.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t border-black/10" />

          {/* ── Choose Your Event ── */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 size={13} className="text-black/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Choose Your Event</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
              {STATIC_EVENT_TYPES.map((et: EventType) => (
                <button
                  key={et.slug}
                  onClick={() => navigateToEventType(et.slug)}
                  className="flex flex-col gap-1 px-3 py-3 bg-white hover:bg-black hover:text-white transition-colors group text-left"
                >
                  <span className="text-[13px] font-bold text-black group-hover:text-white leading-tight">{et.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/40 group-hover:text-white/50">
                    ${(et.budget_guidance_min / 1000).toFixed(0)}k–${(et.budget_guidance_max / 1000).toFixed(0)}k
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t border-black/10" />

          {/* ── By Area ── */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={13} className="text-black/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">By Area</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {UNIQUE_AREAS.map((area) => (
                <button
                  key={area.slug}
                  onClick={() => navigateToArea(area.slug)}
                  className="px-3 py-1.5 border border-black/15 text-[12px] font-medium text-black hover:bg-black hover:text-white hover:border-black transition-colors"
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t border-black/10" />

          {/* ── Quick Links ── */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <Link2 size={13} className="text-black/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Quick Links</span>
            </div>
            <div className="space-y-0.5">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.view) {
                      setView(link.view);
                    } else if (link.slug) {
                      router.push(link.slug);
                    }
                    handleClose();
                  }}
                  className="w-full text-left px-3 py-2.5 text-[14px] font-medium text-black hover:bg-black hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t border-black/10" />

          {/* ── Auth buttons ── */}
          <div className="px-6 pt-4 pb-8 flex gap-3">
            <button
              onClick={() => { setView('login'); handleClose(); }}
              className="flex-1 py-3 border border-black font-bold text-[12px] uppercase tracking-[0.12em] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={14} />
              Log In
            </button>
            <button
              onClick={() => { setView('signup'); handleClose(); }}
              className="flex-1 py-3 bg-black text-white font-bold text-[12px] uppercase tracking-[0.12em] hover:bg-black/90 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={14} />
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
