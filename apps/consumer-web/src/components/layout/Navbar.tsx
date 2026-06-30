'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronRight, ChevronDown, ChevronLeft, LogIn, UserPlus, MapPin, Search, Ticket, Plane, Building2, CalendarPlus, Home as HomeIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import {
  serviceCategories,
  categoryByOverture,
  eventCategories,
  activityCategories,
  roleCategories,
  slugify,
} from '@/data/taxonomy';
import { AIRPORT_CITIES, US_STATES } from '@/lib/planviry-data';
import { SEO_LOCATIONS, type SeoLocation } from '@/data/seo-locations';
import { NavbarSearchBar } from '@/components/navbar-search-bar';
import { TICKETS_GROUPS, TICKETS_CITIES } from '@/data/tickets-taxonomy';
import { TicketsMegaMenuSearch } from '@/components/TicketsMegaMenuSearch';
import { MegaMenuSearch } from '@/components/MegaMenuSearch';

type MegaMenuMode = 'closed' | 'service' | 'category' | 'events' | 'activity' | 'role' | 'location' | 'tickets';
type MenuLevel = 1 | 2 | 3;

export function Navbar() {
  const [megaMenuMode, setMegaMenuMode] = useState<MegaMenuMode>('closed');
  const [megaMenuPathname, setMegaMenuPathname] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'none' | 'service' | 'category' | 'events' | 'activity' | 'role' | 'location'>('none');
  const router = useRouter();
  const pathname = usePathname();

  // ── Progressive disclosure state ──
  const [menuLevel, setMenuLevel] = useState<MenuLevel>(1);
  const [level1Id, setLevel1Id] = useState<string>('');
  const [level2Id, setLevel2Id] = useState<string>('');

  // ── Location search state ──
  const [locationSearchInput, setLocationSearchInput] = useState('');

  // Filter locations as user types (useMemo instead of useEffect to avoid cascading renders)
  const locationSearchResults = useMemo(() => {
    if (!locationSearchInput.trim()) return [];
    const q = locationSearchInput.toLowerCase().trim();
    return SEO_LOCATIONS.filter(
      (loc) =>
        loc.city.toLowerCase().startsWith(q) ||
        loc.displayName.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [locationSearchInput]);

  // ── Tickets mega menu search state (removed — redundant with header search bar) ──

  // Reset drill-down when menu mode changes (handled in toggleMegaMenu)

  // ── Handlers ──

  const toggleMegaMenu = useCallback(
    (mode: MegaMenuMode) => {
      setMegaMenuMode((prev) => (prev === mode ? 'closed' : mode));
      setMegaMenuPathname(pathname);
      // Reset drill-down when switching modes
      setMenuLevel(1);
      setLevel1Id('');
      setLevel2Id('');
      setLocationSearchInput('');
    },
    [pathname]
  );

  const closeMegaMenu = useCallback(() => {
    setMegaMenuMode('closed');
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileSubmenu('none');
  }, []);

  const drillDown = useCallback((level: MenuLevel, id: string) => {
    if (level === 1) { setLevel1Id(id); setMenuLevel(2); }
    else if (level === 2) { setLevel2Id(id); setMenuLevel(3); }
  }, []);

  const goBack = useCallback(() => {
    if (menuLevel === 2) { setLevel1Id(''); setMenuLevel(1); }
    else if (menuLevel === 3) { setLevel2Id(''); setMenuLevel(2); }
  }, [menuLevel]);

  // Effective menu mode: close if pathname changed since opening
  const effectiveMenuMode: MegaMenuMode =
    megaMenuMode !== 'closed' && megaMenuPathname !== pathname ? 'closed' : megaMenuMode;

  // ── Derived data for each dimension at each level ──

  // By Service
  const activeServiceCat = useMemo(
    () => serviceCategories.find((c) => c.id === level1Id),
    [level1Id]
  );

  // Tickets (progressive disclosure: level 1 = group boxes, level 2 = subcategories)
  const activeTicketsGroup = useMemo(
    () => TICKETS_GROUPS.find((g) => g.slug === level1Id) ?? (level1Id === 'cities' ? { name: 'Cities', slug: 'cities' } : undefined),
    [level1Id]
  );

  // By Category (Overture)
  const activeOvertureCat = useMemo(
    () => categoryByOverture.find((c) => c.id === level1Id),
    [level1Id]
  );
  const activeOvertureSubGroup = useMemo(
    () => activeOvertureCat?.subGroups.find((sg) => sg.slug === level2Id),
    [activeOvertureCat, level2Id]
  );

  // By Event
  const activeEventCat = useMemo(
    () => eventCategories.find((c) => c.id === level1Id),
    [level1Id]
  );

  // By Activity
  const activeActivityGroup = useMemo(
    () => activityCategories.find((g) => g.id === level1Id),
    [level1Id]
  );
  const activeActivitySub = useMemo(
    () => activeActivityGroup?.activities.find((a) => a.slug === level2Id),
    [activeActivityGroup, level2Id]
  );

  // By Role
  const activeRoleGroup = useMemo(
    () => roleCategories.find((g) => g.id === level1Id),
    [level1Id]
  );

  // By Location
  const activeStateData = useMemo(
    () => AIRPORT_CITIES.find((s) => s.slug === level1Id),
    [level1Id]
  );

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close mega menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaMenuMode('closed');
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // ── Menu title for header ──
  const getMenuTitle = (): string => {
    switch (effectiveMenuMode) {
      case 'service': return 'By Service';
      case 'category': return 'By Category';
      case 'events': return 'By Event';
      case 'activity': return 'By Activity';
      case 'role': return 'By Role';
      case 'location': return 'By Location';
      case 'tickets': return 'Live Event Tickets';
      default: return '';
    }
  };

  const getLevel2Title = (): string => {
    switch (effectiveMenuMode) {
      case 'service': return activeServiceCat?.name ?? '';
      case 'category': return activeOvertureCat?.name ?? '';
      case 'events': return activeEventCat?.name ?? '';
      case 'activity': return activeActivityGroup?.name ?? '';
      case 'role': return activeRoleGroup?.name ?? '';
      case 'location': return activeStateData?.state ?? '';
      case 'tickets': return activeTicketsGroup?.name ?? '';
      default: return '';
    }
  };

  const getLevel3Title = (): string => {
    switch (effectiveMenuMode) {
      case 'category': return activeOvertureSubGroup?.label ?? '';
      case 'activity': return activeActivitySub?.name ?? '';
      default: return '';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-black text-white">
        <div className="flex items-center justify-between px-4 h-14 gap-4">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="shrink-0 group flex items-center h-14 overflow-hidden">
              <Image
                src="/Planvirylogo.png"
                alt="Planviry - event planning simplified"
                width={2048}
                height={2048}
                className="h-40 w-auto"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-4 text-[13px] font-medium text-white/70 ml-4">
              <button onClick={() => toggleMegaMenu('service')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Service <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'service' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('category')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Category <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'category' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('events')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Event <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'events' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('activity')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Activity <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'activity' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('role')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Role <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'role' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('location')} className="flex items-center gap-1 hover:text-white transition-colors">
                By Location <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'location' ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => toggleMegaMenu('tickets')} className="flex items-center gap-1 hover:text-white transition-colors">
                <Ticket className="w-3.5 h-3.5" /> Live Event Tickets
                <ChevronDown className={`w-3 h-3 transition-transform ${effectiveMenuMode === 'tickets' ? 'rotate-180' : ''}`} />
              </button>
              <Link href="/travel" className="flex items-center gap-1 hover:text-white transition-colors">
                <Plane className="w-3.5 h-3.5" /> Travel
              </Link>
            </div>
          </div>
          {/* Right: Auth + Mobile */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
              <Link href="/login" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
                <LogIn className="w-4 h-4" /> Log In
              </Link>
              <Link href="/register" className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </div>
            <button
              onClick={() => { setMobileMenuOpen((prev) => !prev); setMobileSubmenu('none'); }}
              className="md:hidden text-white hover:text-coral transition-colors p-1"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Row 2: Search bar + List Your links */}
        <div className="flex items-center px-4 py-1.5 gap-5">
          <div className="hidden md:flex max-w-md flex-1">
            <NavbarSearchBar />
          </div>
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <Link href="/list/business" className="flex items-center gap-1.5 text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" /> List Your Business
            </Link>
            <Link href="/list/event" className="flex items-center gap-1.5 text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              <CalendarPlus className="w-3.5 h-3.5" /> List Your Event
            </Link>
            <Link href="/list/property" className="flex items-center gap-1.5 text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              <HomeIcon className="w-3.5 h-3.5" /> List Your Property
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* UNIFIED MEGA MENU PANEL                                       */}
      {/* 3-level progressive disclosure, consistent design, no scroll  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {effectiveMenuMode !== 'closed' && (
        <div className="sticky top-14 z-40 w-full bg-white text-black shadow-2xl border-b border-gray-200">
          {/* Header bar: breadcrumb + X close */}
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-medium">
              {menuLevel === 1 && (
                <span className="font-bold text-black">{getMenuTitle()}</span>
              )}
              {menuLevel === 2 && (
                <>
                  <button onClick={goBack} className="text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> {getMenuTitle()}
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="font-bold text-black">{getLevel2Title()}</span>
                </>
              )}
              {menuLevel === 3 && (
                <>
                  <button onClick={goBack} className="text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> {getLevel2Title()}
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="font-bold text-black">{getLevel3Title()}</span>
                </>
              )}
            </div>
            <button onClick={closeMegaMenu} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close menu">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content area */}
          <div className="max-w-7xl mx-auto px-6 py-6">

            {/* ══════════════ BY SERVICE ══════════════ */}
            {effectiveMenuMode === 'service' && menuLevel === 1 && (
              <>
              <div className="mb-5"><MegaMenuSearch dimension="service" /></div>
              <div className="grid grid-cols-3 gap-3">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => drillDown(1, cat.id)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{cat.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{cat.subcategories.length} services</div>
                  </button>
                ))}
              </div>
              </>
            )}
            {effectiveMenuMode === 'service' && menuLevel === 2 && activeServiceCat && (
              <div className="grid grid-cols-4 gap-3">
                {activeServiceCat.subcategories.map((sub) => {
                  const subSlug = slugify(sub);
                  return (
                    <Link
                      key={subSlug}
                      href={`/categories/service/${activeServiceCat.slug}/${subSlug}`}
                      onClick={closeMegaMenu}
                      className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                    >
                      <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub}</div>
                    </Link>
                  );
                })}
                <Link
                  href={`/categories/service/${activeServiceCat.slug}`}
                  onClick={closeMegaMenu}
                  className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                >
                  <div className="font-bold text-sm">View All {activeServiceCat.name}</div>
                  <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* ══════════════ BY CATEGORY (Overture) ══════════════ */}
            {effectiveMenuMode === 'category' && menuLevel === 1 && (
              <>
              <div className="mb-5"><MegaMenuSearch dimension="category" /></div>
              <div className="grid grid-cols-4 gap-3">
                {categoryByOverture.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => drillDown(1, cat.id)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{cat.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {cat.subGroups.reduce((sum, sg) => sum + sg.items.length, 0)} types
                    </div>
                  </button>
                ))}
              </div>
              </>
            )}
            {effectiveMenuMode === 'category' && menuLevel === 2 && activeOvertureCat && (
              <div className="grid grid-cols-4 gap-3">
                {activeOvertureCat.subGroups.map((sg) => (
                  <div key={sg.slug}>
                    <button
                      onClick={() => drillDown(2, sg.slug)}
                      className="w-full text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                    >
                      <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">
                        {sg.label !== 'Main' ? sg.label : activeOvertureCat.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{sg.items.length} listings</div>
                    </button>
                    {/* Show items inline for small groups so users can click directly */}
                    {sg.items.length <= 6 && (
                      <div className="mt-1 space-y-0.5">
                        {sg.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/categories/category/${activeOvertureCat.slug}/${sg.slug}/${item.slug}`}
                            onClick={closeMegaMenu}
                            className="block px-3 py-1.5 text-xs text-gray-600 hover:text-coral hover:bg-coral/5 rounded transition-colors truncate"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href={`/categories/category/${activeOvertureCat.slug}`}
                  onClick={closeMegaMenu}
                  className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                >
                  <div className="font-bold text-sm">View All {activeOvertureCat.name}</div>
                  <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
            {effectiveMenuMode === 'category' && menuLevel === 3 && activeOvertureSubGroup && (
              <div className="grid grid-cols-4 gap-3">
                {activeOvertureSubGroup.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/category/${activeOvertureCat?.slug}/${activeOvertureSubGroup?.slug}/${item.slug}`}
                    onClick={closeMegaMenu}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.count.toLocaleString()} listings</div>
                  </Link>
                ))}
              </div>
            )}

            {/* ══════════════ BY EVENT ══════════════ */}
            {effectiveMenuMode === 'events' && menuLevel === 1 && (
              <>
              <div className="mb-5"><MegaMenuSearch dimension="events" /></div>
              <div className="grid grid-cols-4 gap-3">
                {eventCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => drillDown(1, cat.id)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{cat.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{cat.subcategories.length} types</div>
                  </button>
                ))}
              </div>
              </>
            )}
            {effectiveMenuMode === 'events' && menuLevel === 2 && activeEventCat && (
              <div className="grid grid-cols-4 gap-3">
                {activeEventCat.subcategories.map((sub) => {
                  const subSlug = slugify(sub);
                  return (
                    <Link
                      key={subSlug}
                      href={`/categories/event/${activeEventCat.slug}/${subSlug}`}
                      onClick={closeMegaMenu}
                      className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                    >
                      <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub}</div>
                    </Link>
                  );
                })}
                <Link
                  href={`/categories/event/${activeEventCat.slug}`}
                  onClick={closeMegaMenu}
                  className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                >
                  <div className="font-bold text-sm">View All {activeEventCat.name}</div>
                  <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* ══════════════ BY ACTIVITY ══════════════ */}
            {effectiveMenuMode === 'activity' && menuLevel === 1 && (
              <>
              <div className="mb-5"><MegaMenuSearch dimension="activity" /></div>
              <div className="grid grid-cols-3 gap-3">
                {activityCategories.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => drillDown(1, group.id)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{group.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{group.activities.length} categories</div>
                  </button>
                ))}
              </div>
              </>
            )}
            {effectiveMenuMode === 'activity' && menuLevel === 2 && activeActivityGroup && (
              <div className="grid grid-cols-4 gap-3">
                {activeActivityGroup.activities.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => drillDown(2, sub.slug)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{sub.items.length} activities</div>
                  </button>
                ))}
              </div>
            )}
            {effectiveMenuMode === 'activity' && menuLevel === 3 && activeActivitySub && (
              <div className="grid grid-cols-4 gap-3">
                {activeActivitySub.items.map((item) => {
                  const itemSlug = slugify(item);
                  return (
                    <Link
                      key={itemSlug}
                      href={`/categories/activity/${activeActivityGroup?.slug}/${activeActivitySub.slug}/${itemSlug}`}
                      onClick={closeMegaMenu}
                      className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                    >
                      <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{item}</div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ══════════════ BY ROLE ══════════════ */}
            {effectiveMenuMode === 'role' && menuLevel === 1 && (
              <>
              <div className="mb-5"><MegaMenuSearch dimension="role" /></div>
              <div className="grid grid-cols-3 gap-3">
                {roleCategories.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => drillDown(1, group.id)}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{group.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{group.roles.length} roles</div>
                  </button>
                ))}
              </div>
              </>
            )}
            {effectiveMenuMode === 'role' && menuLevel === 2 && activeRoleGroup && (
              <div className="grid grid-cols-3 gap-3">
                {activeRoleGroup.roles.map((role) => (
                  <Link
                    key={role.slug}
                    href={`/categories/role/${activeRoleGroup.slug}/${role.slug}`}
                    onClick={closeMegaMenu}
                    className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                  >
                    <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{role.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                  </Link>
                ))}
                <Link
                  href={`/categories/role/${activeRoleGroup.slug}`}
                  onClick={closeMegaMenu}
                  className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                >
                  <div className="font-bold text-sm">View All {activeRoleGroup.name}</div>
                  <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* ══════════════ BY LOCATION ══════════════ */}
            {effectiveMenuMode === 'location' && menuLevel === 1 && (
              <div>
                {/* Location search input */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={locationSearchInput}
                      onChange={(e) => setLocationSearchInput(e.target.value)}
                      placeholder="Search for a city..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white text-black"
                    />
                  </div>
                  {/* Autocomplete results */}
                  {locationSearchResults.length > 0 && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {locationSearchResults.map((loc) => (
                        <Link
                          key={loc.slug}
                          href={`/explore/city/${loc.slug}`}
                          onClick={closeMegaMenu}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-black"
                        >
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-medium">{loc.city}</span>
                          <span className="text-gray-400">,</span>
                          <span className="text-gray-500">{loc.state}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {/* State grid */}
                <div className="grid grid-cols-8 gap-2">
                  {US_STATES.map((state) => (
                    <button
                      key={state.slug}
                      onClick={() => drillDown(1, state.slug)}
                      className="text-center py-2.5 px-2 border border-gray-200 hover:border-black hover:shadow-[2px_2px_0px_#e87461] transition-all text-sm font-medium text-gray-700 hover:text-coral"
                    >
                      {state.abbr}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {effectiveMenuMode === 'location' && menuLevel === 2 && activeStateData && (
              <div>
                {/* Location search in level 2 as well */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={locationSearchInput}
                      onChange={(e) => setLocationSearchInput(e.target.value)}
                      placeholder="Search for a city..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white text-black"
                    />
                  </div>
                  {locationSearchResults.length > 0 && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {locationSearchResults.map((loc) => (
                        <Link
                          key={loc.slug}
                          href={`/explore/city/${loc.slug}`}
                          onClick={closeMegaMenu}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-black"
                        >
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-medium">{loc.city}</span>
                          <span className="text-gray-400">,</span>
                          <span className="text-gray-500">{loc.state}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {/* City grid */}
                <div className="grid grid-cols-4 gap-3">
                  {activeStateData.airports.map((city) => {
                    const cityName = city.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '');
                    return (
                      <Link
                        key={city.slug}
                        href={`/explore/city/${city.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{cityName}</div>
                      </Link>
                    );
                  })}
                  <Link
                    href={`/explore/state/${activeStateData.slug}`}
                    onClick={closeMegaMenu}
                    className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                  >
                    <div className="font-bold text-sm">View All of {activeStateData.state}</div>
                    <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* ══════════════ LIVE EVENT TICKETS (progressive disclosure with boxes) ══════════════ */}
            {effectiveMenuMode === 'tickets' && menuLevel === 1 && (
              <div>
                {/* Search bar: Location, Event Type, Dates, This Weekend, Search */}
                <div className="mb-5">
                  <TicketsMegaMenuSearch />
                </div>

                {/* View All Tickets link */}
                <div className="mb-5 flex justify-end">
                  <Link
                    href="/tickets"
                    onClick={closeMegaMenu}
                    className="text-sm font-bold text-coral hover:text-coral/80 transition-colors"
                  >
                    View All Tickets →
                  </Link>
                </div>

                {/* Level 1: category boxes (progressive disclosure, matches By Service pattern) */}
                <div className="grid grid-cols-3 gap-3">
                    {TICKETS_GROUPS.map((group) => {
                      const totalSubs =
                        (group.subcategories?.length || 0) +
                        (group.leagues?.length || 0) +
                        (group.discoverMore?.length || 0)
                      return (
                        <button
                          key={group.slug}
                          onClick={() => drillDown(1, group.slug)}
                          className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                        >
                          <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{group.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{totalSubs} categories</div>
                        </button>
                      )
                    })}
                    {/* Cities box */}
                    <button
                      onClick={() => drillDown(1, 'cities')}
                      className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                    >
                      <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">All Cities</div>
                      <div className="text-xs text-gray-400 mt-1">{TICKETS_CITIES.length} cities</div>
                    </button>
                    {/* View All Tickets box */}
                    <Link
                      href="/tickets"
                      onClick={closeMegaMenu}
                      className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                    >
                      <div className="font-bold text-sm">View All Tickets</div>
                      <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            )}
            {effectiveMenuMode === 'tickets' && menuLevel === 2 && activeTicketsGroup && (
              <div className="grid grid-cols-4 gap-3">
                {activeTicketsGroup.slug === 'cities' ? (
                  <>
                    {TICKETS_CITIES.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/tickets/cities/${city.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{city.name}</div>
                      </Link>
                    ))}
                    <Link
                      href="/tickets/cities"
                      onClick={closeMegaMenu}
                      className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                    >
                      <div className="font-bold text-sm">View All Cities</div>
                      <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                ) : activeTicketsGroup.slug === 'sports' ? (
                  <>
                    {/* Sports: leagues first, then other sports, all as boxes */}
                    {(activeTicketsGroup as typeof TICKETS_GROUPS[number]).leagues?.map((league) => (
                      <Link
                        key={league.slug}
                        href={`/tickets/sports/${league.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{league.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{league.conferences.length} conferences</div>
                      </Link>
                    ))}
                    {activeTicketsGroup.subcategories?.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/tickets/sports/${sub.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub.name}</div>
                      </Link>
                    ))}
                    <Link
                      href="/tickets/sports"
                      onClick={closeMegaMenu}
                      className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                    >
                      <div className="font-bold text-sm">View All Sports</div>
                      <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Concerts, Arts, Family: subcategories + discoverMore as boxes */}
                    {activeTicketsGroup.subcategories?.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/tickets/${activeTicketsGroup.slug}/${sub.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub.name}</div>
                      </Link>
                    ))}
                    {activeTicketsGroup.discoverMore?.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/tickets/${activeTicketsGroup.slug}/${sub.slug}`}
                        onClick={closeMegaMenu}
                        className="text-left p-4 border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all group"
                      >
                        <div className="font-bold text-sm text-black group-hover:text-coral transition-colors">{sub.name}</div>
                      </Link>
                    ))}
                    <Link
                      href={activeTicketsGroup.slug === 'sports' ? '/tickets/sports' : `/tickets/${activeTicketsGroup.slug}`}
                      onClick={closeMegaMenu}
                      className="text-left p-4 border-2 border-black bg-black text-white hover:bg-coral hover:border-coral transition-all group"
                    >
                      <div className="font-bold text-sm">View All {activeTicketsGroup.name}</div>
                      <ChevronRight className="w-4 h-4 mt-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MOBILE MENU                                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />
        <div
          className={`absolute top-0 left-0 right-0 bg-white text-black transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <Link href="/" onClick={closeMobileMenu} className="shrink-0 flex items-center h-12 overflow-hidden">
              <Image
                src="/Planvirylogo.png"
                alt="Planviry - event planning simplified"
                width={2048}
                height={2048}
                className="h-36 w-auto"
              />
            </Link>
            <button onClick={closeMobileMenu} className="text-black p-2 -mr-2" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Nav Content */}
          <div className="px-4 py-4">

            {/* By Service */}
            <MobileAccordion label="By Service" value="service" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {serviceCategories.map((cat) => (
                <div key={cat.id} className="mb-3">
                  <Link href={`/categories/service/${cat.slug}`} onClick={closeMobileMenu} className="text-sm font-bold text-black hover:text-coral transition-colors">
                    {cat.name}
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.subcategories.map((sub) => (
                      <Link key={slugify(sub)} href={`/categories/service/${cat.slug}/${slugify(sub)}`} onClick={closeMobileMenu}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </MobileAccordion>

            {/* By Category */}
            <MobileAccordion label="By Category" value="category" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {categoryByOverture.map((cat) => (
                <div key={cat.id} className="mb-3">
                  <Link href={`/categories/category/${cat.slug}`} onClick={closeMobileMenu} className="text-sm font-bold text-black hover:text-coral transition-colors">
                    {cat.name}
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.subGroups.flatMap((sg) => sg.items.map(item => ({ ...item, _sgSlug: sg.slug }))).map((item) => (
                      <Link key={item.slug} href={`/categories/category/${cat.slug}/${item._sgSlug}/${item.slug}`} onClick={closeMobileMenu}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </MobileAccordion>

            {/* By Event */}
            <MobileAccordion label="By Event" value="events" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {eventCategories.map((cat) => (
                <div key={cat.id} className="mb-3">
                  <Link href={`/categories/event/${cat.slug}`} onClick={closeMobileMenu} className="text-sm font-bold text-black hover:text-coral transition-colors">
                    {cat.name}
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.subcategories.map((sub) => (
                      <Link key={slugify(sub)} href={`/categories/event/${cat.slug}/${slugify(sub)}`} onClick={closeMobileMenu}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </MobileAccordion>

            {/* By Activity */}
            <MobileAccordion label="By Activity" value="activity" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {activityCategories.map((group) => (
                <div key={group.id} className="mb-3">
                  <Link href={`/categories/activity/${group.slug}`} onClick={closeMobileMenu} className="text-sm font-bold text-black hover:text-coral transition-colors">
                    {group.name}
                  </Link>
                  <div className="space-y-1.5 mt-1">
                    {group.activities.map((sub) => (
                      <div key={sub.slug}>
                        <span className="text-xs font-semibold text-gray-600">{sub.name}</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {sub.items.map((item) => (
                            <Link key={slugify(item)} href={`/categories/activity/${group.slug}/${sub.slug}/${slugify(item)}`} onClick={closeMobileMenu}
                              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </MobileAccordion>

            {/* By Role */}
            <MobileAccordion label="By Role" value="role" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {roleCategories.map((group) => (
                <div key={group.id} className="mb-3">
                  <Link href={`/categories/role/${group.slug}`} onClick={closeMobileMenu} className="text-sm font-bold text-black hover:text-coral transition-colors">
                    {group.name}
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {group.roles.map((role) => (
                      <Link key={role.slug} href={`/categories/role/${group.slug}/${role.slug}`} onClick={closeMobileMenu}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                        {role.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </MobileAccordion>

            {/* By Location */}
            <MobileAccordion label="By Location" value="location" current={mobileSubmenu} toggle={setMobileSubmenu}>
              {/* City search input */}
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={locationSearchInput}
                    onChange={(e) => setLocationSearchInput(e.target.value)}
                    placeholder="Search for a city..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
                {locationSearchResults.length > 0 && (
                  <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {locationSearchResults.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/explore/city/${loc.slug}`}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-medium">{loc.city}</span>
                        <span className="text-gray-400">,</span>
                        <span className="text-gray-500">{loc.state}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* State links */}
              <div className="flex flex-wrap gap-1">
                {US_STATES.map((state) => (
                  <Link key={state.slug} href={`/explore/state/${state.slug}`} onClick={closeMobileMenu}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 hover:bg-coral/10 hover:text-coral transition-colors">
                    {state.abbr}
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            {/* Tickets & Travel - Prominent mobile links */}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                href="/tickets"
                onClick={closeMobileMenu}
                className="flex flex-col items-center gap-2 p-4 bg-coral/5 border-2 border-coral/20 rounded-xl hover:border-coral hover:bg-coral/10 transition-all"
              >
                <Ticket className="w-6 h-6 text-coral" />
                <span className="text-sm font-bold text-coral">Event Tickets</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">SeatGeek</span>
              </Link>
              <Link
                href="/travel"
                onClick={closeMobileMenu}
                className="flex flex-col items-center gap-2 p-4 bg-orange-500/5 border-2 border-orange-500/20 rounded-xl hover:border-orange-500 hover:bg-orange-500/10 transition-all"
              >
                <Plane className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-bold text-orange-600">Travel & Hotels</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trawex</span>
              </Link>
            </div>

            {/* List Your links */}
            <div className="py-3 border-b border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">List on Planviry</p>
              <div className="flex flex-col gap-1">
                <Link href="/list/business" onClick={closeMobileMenu}
                  className="flex items-center gap-2 py-2 text-sm font-bold text-black hover:text-coral transition-colors">
                  <Building2 className="w-4 h-4 text-coral" /> List Your Business
                </Link>
                <Link href="/list/event" onClick={closeMobileMenu}
                  className="flex items-center gap-2 py-2 text-sm font-bold text-black hover:text-coral transition-colors">
                  <CalendarPlus className="w-4 h-4 text-coral" /> List Your Event
                </Link>
                <Link href="/list/property" onClick={closeMobileMenu}
                  className="flex items-center gap-2 py-2 text-sm font-bold text-black hover:text-coral transition-colors">
                  <HomeIcon className="w-4 h-4 text-coral" /> List Your Property
                </Link>
              </div>
            </div>

            {/* Utility links */}
            <Link href="/support" onClick={closeMobileMenu}
              className="block py-3 text-base font-medium text-gray-700 hover:text-coral border-b border-gray-100 transition-colors">
              Support
            </Link>

            {/* Auth buttons */}
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/login" onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-black border border-gray-300 rounded-full hover:border-black transition-colors">
                <LogIn className="w-4 h-4" /> Log In
              </Link>
              <Link href="/register" onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-black rounded-full hover:bg-coral hover:text-white transition-colors">
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Click-away overlay for desktop mega menus */}
      {effectiveMenuMode !== 'closed' && (
        <div className="fixed inset-0 z-30 hidden md:block" onClick={closeMegaMenu} aria-hidden="true" />
      )}
    </>
  );
}

/* ── Mobile Accordion Sub-component ── */
function MobileAccordion({
  label,
  value,
  current,
  toggle,
  children,
}: {
  label: string;
  value: 'service' | 'category' | 'events' | 'activity' | 'role' | 'location';
  current: string;
  toggle: (v: 'none' | 'service' | 'category' | 'events' | 'activity' | 'role' | 'location') => void;
  children: React.ReactNode;
}) {
  const isOpen = current === value;
  return (
    <div>
      <button
        onClick={() => toggle(isOpen ? 'none' : value)}
        className="w-full flex items-center justify-between py-3 text-base font-bold text-black border-b border-gray-100"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="py-3 pl-4 border-b border-gray-100 max-h-96 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}
