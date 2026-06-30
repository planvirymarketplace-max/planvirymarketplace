'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Frown,
  MapPin,
  DollarSign,
  Users,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import { MARKETPLACE_ITEMS, SUB_CATEGORIES } from '@/data/prototype-data';
import { SEO_SERVICE_PATTERNS } from '@/data/seo-pages';
import { CategoryLens, CartItem } from '@/types';
import { DateCalendarPopover } from '@/components/DateCalendarPopover';
import { getPrefixIndex, lookupByPrefix } from '@/data/prefix-index';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicFilterBar } from '@/components/DynamicFilterBar';
import { UniversalFilters, type UniversalFilterValues } from '@/components/UniversalFilters';
import { FilterMegaMenu } from '@/components/FilterMegaMenu';

// Map surface categories to taxonomy_filters.json keys
const TAXONOMY_MAP: Record<string, string> = {
  'plan': '1: Planning, Coordination & Event Services',
  'spaces': '2: Venues & Event Spaces',
  'live-shows': '3: Annual, Seasonal & Festival Events',
  'food-drink': '4: Catering, Food & Beverage',
  'vendors': '5: Entertainment, Musicians & Performers',
  'things-to-do': '6: Attractions, Amusement & Family Activities',
  'travel': '11: Accommodations & Lodging',
  'services': '1: Planning, Coordination & Event Services', // Concierge = vendors/professionals (planners, coordinators)
  'party': '10: Equipment & Event Rentals',
};

interface MarketplaceFeedProps {
  category: CategoryLens;
}

export const MarketplaceFeed: React.FC<MarketplaceFeedProps> = ({ category }) => {
  const {
    searchWhat,
    setSearchWhat,
    searchWhere,
    setSearchWhere,
    searchWhen,
    setSearchWhen,
    searchPrice,
    setSearchPrice,
    searchAttendees,
    setSearchAttendees,
    searchFilters,
    setSearchFilters,
    selectedSubcategory,
    setSelectedSubcategory,
    addToCart,
    setSelectedItem,
    activeCategory,
    setActiveCategory
  } = useApp();

  // ── Autocomplete state ────────────────────────────────────────────────────
  const [showWhatDropdown, setShowWhatDropdown] = useState(false);
  const [showWhereDropdown, setShowWhereDropdown] = useState(false);
  const [prefixIndex, setPrefixIndex] = useState<any>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [showBudgetPopover, setShowBudgetPopover] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>({});
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterValues>({});

  const handleFilterChange = (filterName: string, values: string[]) => {
    setDynamicFilters(prev => {
      const next = { ...prev };
      if (values.length === 0) delete next[filterName];
      else next[filterName] = values;
      return next;
    });
  };

  const whatContainerRef = useRef<HTMLDivElement>(null);
  const whereContainerRef = useRef<HTMLDivElement>(null);

  // Load the 25k city prefix index on mount
  useEffect(() => {
    let cancelled = false;
    getPrefixIndex().then((idx) => { if (!cancelled) setPrefixIndex(idx) });
    return () => { cancelled = true };
  }, []);

  // What autocomplete — from SEO_SERVICE_PATTERNS (574 patterns like "Wedding Dj In")
  const whatSuggestions = useMemo(() => {
    if (!searchWhat.trim()) return [];
    const q = searchWhat.toLowerCase().trim();
    return SEO_SERVICE_PATTERNS
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(p => ({ label: p.name, sub: p.slug, loc: '' }));
  }, [searchWhat]);

  // Where autocomplete — from the 25k city prefix index
  const whereSuggestions = useMemo(() => {
    if (!searchWhere.trim() || !prefixIndex) return [];
    return lookupByPrefix(prefixIndex, searchWhere.toLowerCase().trim()).slice(0, 8);
  }, [searchWhere, prefixIndex]);

  // Geolocation (manual — user clicks the button)
  const handleGeolocate = () => {
    setGeoLoading(true);
    fetch('/api/geolocation')
      .then(r => r.json())
      .then(data => {
        if (data.city) {
          const val = `${data.city}, ${data.region || data.state || ''}`;
          setSearchWhere(val);
        }
      })
      .catch(() => {})
      .finally(() => setGeoLoading(false));
  };

  // Outside click to close dropdowns
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (whatContainerRef.current && !whatContainerRef.current.contains(e.target as Node)) setShowWhatDropdown(false);
      if (whereContainerRef.current && !whereContainerRef.current.contains(e.target as Node)) setShowWhereDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Budget options — sets a budget, not a sort filter
  const budgetOptions = [
    { label: 'Any Price', value: 'all' },
    { label: 'Up to $100', value: 'budget' },
    { label: '$100 to $250', value: 'mid' },
    { label: '$250 to $500', value: 'premium' },
    { label: '$500 to $1000', value: 'luxury' },
    { label: '$1000+', value: 'ultra' },
  ];
  const budgetLabel = budgetOptions.find(b => b.value === searchPrice)?.label || 'Any Price';

  // Format category for display (matches zip)
  const formatCategory = (catStr: string) => {
    return catStr
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' & ');
  };

  // Page title and subtitle (matches zip)
  const pageTitle = formatCategory(category);
  const pageSubtitle = `Hand-selected local professionals and premium spaces for a memorable celebration.`;

  // Sync state category when prop changes
  React.useEffect(() => {
    if (activeCategory !== category) {
      setActiveCategory(category);
    }
  }, [category, activeCategory, setActiveCategory]);

  // Filtered Marketplace Items
  const filteredMarketplaceItems = useMemo(() => {
    return MARKETPLACE_ITEMS.filter((item) => {
      // 1. Category check — accept items matching the surface category
      //    OR items whose subcategory matches known subcategories for this surface
      if (item.category !== category) {
        const surfaceSubcats = SUB_CATEGORIES[category] || [];
        const itemSub = (item.subcategory || item.category || '').toLowerCase();
        const belongsToSurface = surfaceSubcats.some(s => s.toLowerCase() === itemSub);
        if (!belongsToSurface) return false;
      }

      // 2. Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'all') {
        if (!item.subcategory || item.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Search text query check (What) — lenient: if no items match, show all
      //    (the "What" field is more of a search hint than a hard filter)
      // Only filter by What if there are items that actually match
      if (searchWhat.trim()) {
        const query = searchWhat.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesSubcat = (item.subcategory || '').toLowerCase().includes(query);
        const matchesCategory = (item.category || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSubcat && !matchesCategory) {
          // Don't filter out — just deprioritize (return true, sort later)
          // This ensures cards always show instead of "No verified listings"
        }
      }

      // 4. Search location query check (Where)
      if (searchWhere.trim() && searchWhere !== 'Savannah, GA') {
        const query = searchWhere.toLowerCase();
        const matchesLoc = item.location.toLowerCase().includes(query);
        if (!matchesLoc) return false;
      }

      // 5. Price filter
      if (searchPrice && searchPrice !== 'all') {
        if (searchPrice === 'budget' && item.price >= 200) return false;
        if (searchPrice === 'mid' && (item.price < 200 || item.price > 1000)) return false;
        if (searchPrice === 'luxury' && item.price <= 1000) return false;
      }

      // 6. Filters (Universal filter)
      if (searchFilters && searchFilters !== 'all') {
        if (searchFilters === 'rated' && (!item.rating || item.rating < 4.8)) return false;
        if (searchFilters === 'verified' && !item.badge?.toLowerCase().includes('verified')) return false;
      }

      return true;
    });
  }, [category, selectedSubcategory, searchWhat, searchWhere, searchPrice, searchFilters]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* The Plan Bar Search/Filter in Marketplace */}
      <section className="bg-white border-b border-midnight-slate/5 py-8 px-margin-mobile md:px-margin-desktop">
        <div className="w-full">
          <div className="plan-bar-shadow bg-white border border-midnight-slate/10 rounded-full p-2 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-midnight-slate/5">
            {/* What — with autocomplete */}
            <div ref={whatContainerRef} className="flex-1 w-full px-6 py-2 group cursor-pointer hover:bg-gray-50 transition-colors rounded-l-full relative">
              <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1">What ▼</p>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-midnight-slate/30 shrink-0" />
                <input
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold placeholder:text-midnight-slate/30 text-midnight-slate outline-none border-b-0"
                  placeholder="What are we planning?"
                  type="text"
                  value={searchWhat}
                  onChange={(e) => { setSearchWhat(e.target.value); setSelectedSubcategory('all'); setShowWhatDropdown(true); }}
                  onFocus={() => setShowWhatDropdown(true)}
                />
              </div>
              {showWhatDropdown && whatSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-72 overflow-y-auto z-50">
                  {whatSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setSearchWhat(s.label); setSelectedSubcategory('all'); setShowWhatDropdown(false); }}
                      className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-midnight-slate/30" />
                      <span className="font-medium text-midnight-slate">{s.label}</span>
                      {s.loc && <span className="text-midnight-slate/40 text-xs">{s.loc}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Where — with 25k city autocomplete */}
            <div ref={whereContainerRef} className="flex-1 w-full px-6 py-2 group cursor-pointer hover:bg-gray-50 transition-colors relative">
              <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1">Where ▼</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-midnight-slate/30 shrink-0" />
                <input
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold placeholder:text-midnight-slate/30 text-midnight-slate outline-none"
                  placeholder="Where to?"
                  type="text"
                  value={searchWhere}
                  onChange={(e) => { setSearchWhere(e.target.value); setShowWhereDropdown(true); }}
                  onFocus={() => setShowWhereDropdown(true)}
                />
                {geoLoading ? (
                  <Loader2 className="w-4 h-4 text-midnight-slate/30 animate-spin shrink-0" />
                ) : (
                  <button onClick={handleGeolocate} className="text-midnight-slate/30 hover:text-midnight-slate transition-colors shrink-0" title="Use my location">
                    <span className="material-symbols-outlined text-sm">my_location</span>
                  </button>
                )}
              </div>
              {showWhereDropdown && whereSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-72 overflow-y-auto z-50">
                  {whereSuggestions.map((loc, i) => (
                    <button
                      key={`${loc.slug}-${i}`}
                      onClick={() => { const val = `${loc.city}, ${loc.state}`; setSearchWhere(val); setShowWhereDropdown(false); }}
                      className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-midnight-slate/30" />
                      <span className="font-medium text-midnight-slate">{loc.city}</span>
                      <span className="text-midnight-slate/40 text-xs">{loc.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* When — calendar popover */}
            <DateCalendarPopover label="When" />

            {/* Price — budget setter with radio options */}
            <Popover open={showBudgetPopover} onOpenChange={setShowBudgetPopover}>
              <PopoverTrigger asChild>
                <button className="flex-1 w-full px-6 py-2 text-left hover:bg-gray-50/50 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1">Price ▼</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-midnight-slate/30 shrink-0" />
                    <span className="text-sm font-semibold text-midnight-slate truncate">{budgetLabel}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                {budgetOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSearchPrice(opt.value); setShowBudgetPopover(false); }}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors ${searchPrice === opt.value ? 'bg-secondary-container/50 font-semibold' : ''}`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${searchPrice === opt.value ? 'border-midnight-slate bg-midnight-slate' : 'border-midnight-slate/20'}`} />
                    {opt.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <div className="flex-1 w-full px-6 py-2 group cursor-pointer hover:bg-gray-50 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1">Attendees ▼</p>
              <input
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold placeholder:text-midnight-slate/30 text-midnight-slate outline-none"
                placeholder="How many?"
                type="text"
                value={searchAttendees}
                onChange={(e) => setSearchAttendees(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full px-6 py-2 group cursor-pointer hover:bg-gray-50 transition-colors rounded-r-full md:rounded-r-none">
              <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1">Filters ▼</p>
              <FilterMegaMenu
                categoryKey={TAXONOMY_MAP[category]}
                subcategory={selectedSubcategory !== 'all' ? selectedSubcategory : undefined}
                universalValues={universalFilters}
                onUniversalChange={setUniversalFilters}
                dynamicFilters={dynamicFilters}
                onDynamicChange={handleFilterChange}
                resultCount={filteredMarketplaceItems.length}
              />
            </div>
            <div className="p-1 pr-1 pl-4 flex items-center gap-2">
              {(searchWhat || searchWhere !== 'Savannah, GA' || searchWhen !== 'Oct 18 - Oct 20' || searchPrice !== 'all' || searchAttendees !== '4 Guests' || searchFilters !== 'all' || selectedSubcategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchWhat('');
                    setSearchWhere('Savannah, GA');
                    setSearchWhen('Oct 18 - Oct 20');
                    setSearchPrice('all');
                    setSearchAttendees('4 Guests');
                    setSearchFilters('all');
                    setSelectedSubcategory('all');
                  }}
                  className="text-[11px] font-bold uppercase tracking-wider text-outline hover:text-primary transition-colors cursor-pointer mr-2"
                  title="Clear All Filters"
                >
                  Clear
                </button>
              )}
              <button className="bg-midnight-slate text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-champagne-gold transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Horizontal Scrollable Pill Bar */}
      <div className="bg-white border-b border-midnight-slate/10 py-3">
        <div className="w-full px-margin-mobile md:px-margin-desktop flex items-center gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-1">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-midnight-slate text-white'
                : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30 hover:text-midnight-slate'
            }`}
          >
            All {category.replace('-', ' ')}
          </button>

          {(SUB_CATEGORIES[category] || []).map((sub) => {
            const isActive = selectedSubcategory.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-midnight-slate text-white font-bold'
                    : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30 hover:text-midnight-slate'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory pills only — filters are in the Filters mega menu */}


      {/* Results Grid / Main Feed */}
      <main className="w-full px-margin-mobile md:px-margin-desktop py-12">

        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 text-left">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-midnight-slate font-bold capitalize tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-midnight-slate/60 text-sm mt-1">
              {pageSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40">Sort:</span>
            <select className="bg-transparent border-none text-sm font-bold text-midnight-slate focus:ring-0 cursor-pointer outline-none">
              <option>Most Exclusive</option>
              <option>New Arrivals</option>
              <option>Ticketmaster Verified</option>
            </select>
          </div>
        </div>

        {/* Feed Grid */}
        {filteredMarketplaceItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter text-left">
            {filteredMarketplaceItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden vendor-card-shadow transition-all duration-500 border border-midnight-slate/5 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {item.badge && (
                    <div className="absolute top-4 left-4 bg-midnight-slate text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {item.badge}
                    </div>
                  )}
                  {item.isTicketmaster && (
                    <div className="absolute top-4 left-4 bg-[#026cdf] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white" /> Ticketmaster Verified
                    </div>
                  )}
                  {item.rating && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-midnight-slate">
                      ★ {item.rating}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-champagne-gold uppercase tracking-[0.2em] mb-2">{formatCategory(item.category)}</p>
                    <h3
                      className="font-serif text-2xl text-midnight-slate mb-2 cursor-pointer hover:text-champagne-gold transition-colors"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs mb-4">📍 {item.location}</p>
                    <p className="text-midnight-slate/60 text-sm mb-6 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-midnight-slate/5 pt-4">
                    <div>
                      <p className="text-[10px] font-bold text-midnight-slate/40 uppercase mb-0.5">Price</p>
                      <p className="text-lg font-bold text-midnight-slate">${item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 border border-outline-variant text-primary text-xs font-semibold rounded-lg hover:bg-neutral-50"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          addToCart(item);
                          alert(`Added ${item.title} to your planning cart!`);
                        }}
                        className="bg-midnight-slate text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-champagne-gold transition-colors duration-300 active:scale-95"
                      >
                        Add to Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-outline-variant">
            <h3 className="font-serif text-xl font-bold">Loading listings...</h3>
            <p className="text-on-surface-variant text-sm mt-1">Browsing available options for {category.replace('-', ' ')}.</p>
          </div>
        )}
      </main>
    </div>
  );
};
