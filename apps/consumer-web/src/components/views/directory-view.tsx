'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Star, ShieldCheck, Bookmark, MapPin, ArrowRight,
  ChevronDown, ChevronLeft, ChevronRight, HelpCircle, X, Check,
  SlidersHorizontal, Zap, ShoppingCart,
} from 'lucide-react';
import { NAV_CATEGORIES, UNIVERSAL_FILTERS, NEIGHBORHOODS_BY_AREA, ALL_NEIGHBORHOODS,
  type NavCategory, type NavSubcategory, type FilterDef,
} from '@/lib/directory-filter-data';
import { type VendorSearchResult, type FilterInput } from '@/hooks/use-search-vendors';
import { STATIC_EVENT_TYPES, type EventType } from '@/hooks/use-event-types';
import { useRecentActivity } from '@/hooks/use-recent-activity';
import { useNewVendors, type NewVendor } from '@/hooks/use-new-vendors';

const ITEMS_PER_PAGE = 21; // 3 sections × (1 horizontal + 6 vertical)
const STICKY_TOP = '4rem';

// ── SEO search strings shown at the bottom of the filter mega menu ───────────
const SEO_SEARCH_STRINGS = [
  { label: 'Wedding venues Milwaukee', href: '/directory?cat=venues&sub=venues_wedding' },
  { label: 'Milwaukee wedding DJs', href: '/directory?cat=djs_entertainment&sub=entertainment_dj' },
  { label: 'Event photographers Milwaukee', href: '/directory?cat=photography' },
  { label: 'Milwaukee caterers for hire', href: '/directory?cat=catering' },
  { label: 'Florists near Milwaukee', href: '/directory?cat=floral_decor' },
  { label: 'Party planners Milwaukee', href: '/directory?cat=event_planning' },
  { label: 'Milwaukee rooftop venues', href: '/directory?cat=venues&q=rooftop' },
  { label: 'Milwaukee corporate event venues', href: '/directory?cat=venues&sub=venues_corporate' },
  { label: 'Live bands Milwaukee events', href: '/directory?cat=djs_entertainment&sub=entertainment_live_band' },
  { label: 'Wedding photographers Milwaukee', href: '/directory?cat=photography&sub=planning_wedding_photo' },
  { label: 'Bridal makeup Milwaukee', href: '/directory?cat=beauty' },
  { label: 'Milwaukee quinceañera vendors', href: '/directory?cat=venues' },
];

// ── Event type → nearest NAV_CATEGORY key ────────────────────────────────────
const EVENT_TO_NAV_CAT: Record<string, string> = {
  wedding: 'venues',
  birthday_party_kids: 'catering',
  birthday_party_adult: 'venues',
  birthday_milestone: 'venues',
  corporate_conference: 'venues',
  corporate_holiday_party: 'venues',
  corporate_team_offsite: 'venues',
  corporate_gala: 'venues',
  baby_shower: 'floral_decor',
  bridal_shower: 'floral_decor',
  quinceanera: 'venues',
  sweet_16: 'djs_entertainment',
  prom: 'djs_entertainment',
};



// ── VendorCardSkeleton (vertical) ────────────────────────────────────────────
function VendorCardSkeleton({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="bg-card border border-border overflow-hidden animate-pulse">
        <div className="h-44 bg-muted w-full" />
        <div className="p-4 space-y-2.5">
          <div className="h-4 bg-muted w-3/4" />
          <div className="h-3 bg-muted w-1/2" />
          <div className="h-3 bg-muted w-1/3" />
          <div className="h-8 bg-muted w-full mt-3" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border overflow-hidden flex w-full animate-pulse">
      <div className="w-[140px] sm:w-[200px] flex-shrink-0 bg-muted" style={{ minHeight: 160 }} />
      <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-5 bg-muted w-2/3" />
          <div className="h-4 bg-muted w-1/3" />
          <div className="h-4 bg-muted w-1/2" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-7 bg-muted w-24" />
          <div className="h-9 bg-muted w-36" />
        </div>
      </div>
    </div>
  );
}

type FilterValues = Record<string, string | string[] | boolean | null>;

function toFilterInputs(values: FilterValues): FilterInput[] {
  const out: FilterInput[] = [];
  for (const [key, v] of Object.entries(values)) {
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    if (typeof v === 'boolean') {
      out.push({ filter_key: key, value_bool: v, value_text: null, value_min: null, value_max: null });
    } else if (Array.isArray(v)) {
      out.push({ filter_key: key, value_text: v.join(','), value_bool: null, value_min: null, value_max: null });
    } else if (typeof v === 'string' && v.includes(':')) {
      // range_inputs stored as "min:max"
      const [minS, maxS] = v.split(':');
      out.push({ filter_key: key, value_text: null, value_bool: null, value_min: minS ? Number(minS) : null, value_max: maxS ? Number(maxS) : null });
    } else {
      out.push({ filter_key: key, value_text: String(v), value_bool: null, value_min: null, value_max: null });
    }
  }
  return out;
}

// ── FilterSection ──────────────────────────────────────────────────────────────
interface FilterSectionProps {
  filter: FilterDef;
  value: string | string[] | boolean | null;
  onChange: (v: string | string[] | boolean | null) => void;
  neighborhoodSearch: string;
  onNeighborhoodSearch: (v: string) => void;
}

function FilterSection({ filter, value, onChange, neighborhoodSearch, onNeighborhoodSearch }: FilterSectionProps) {
  const [open, setOpen] = useState(true);

  // Parse range_inputs value outside conditionals to avoid conditional hook call
  const [rangeMin, rangeMax] = useMemo(() => {
    if (!value || typeof value !== 'string') return ['', ''];
    const [a, b] = value.split(':');
    return [a ?? '', b ?? ''];
  }, [value]);

  // ── Toggle switch ──────────────────────────────────────────────────────────
  if (filter.type === 'toggle') {
    return (
      <div className="py-3 border-b border-border last:border-0">
        <label className="flex items-center justify-between cursor-pointer gap-3">
          <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
          <button
            type="button"
            onClick={() => onChange(value ? null : true)}
            className={`relative w-10 h-5 transition-colors flex-shrink-0 ${value ? 'bg-ink' : 'bg-muted'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-card border border-border shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </label>
      </div>
    );
  }

  // ── Price range pills ──────────────────────────────────────────────────────
  if (filter.type === 'price_range') {
    const selected = Array.isArray(value) ? value : (value ? [String(value)] : []);
    return (
      <div className="py-3 border-b border-border">
        <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
          <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="flex gap-1.5">
            {(filter.options ?? []).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = selected.includes(opt.value)
                    ? selected.filter(x => x !== opt.value)
                    : [...selected, opt.value];
                  onChange(next.length > 0 ? next : null);
                }}
                className={`flex-1 py-1.5 font-utility text-[11px] font-bold border transition-colors ${
                  selected.includes(opt.value)
                    ? 'bg-ink text-ink-foreground border-ink'
                    : 'bg-card text-muted-foreground border-border hover:border-ember/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Budget range inputs (min / max numbers) ────────────────────────────────
  if (filter.type === 'range_inputs') {
    const minV = rangeMin;
    const maxV = rangeMax;
    const update = (newMin: string, newMax: string) => {
      if (!newMin && !newMax) { onChange(null); return; }
      onChange(`${newMin}:${newMax}`);
    };
    return (
      <div className="py-3 border-b border-border">
        <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
          <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
          <div className="flex items-center gap-1.5">
            {value && (
              <span className="font-utility text-[10px] font-bold text-muted-foreground">
                {minV ? `$${minV}` : '$0'}–{maxV ? `$${maxV}` : 'any'}
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {open && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Min $</label>
              <input
                type="number" min="0" step="50" value={minV}
                onChange={e => update(e.target.value, maxV)}
                placeholder="0"
                className="w-full px-3 py-2 font-body text-xs border border-border bg-card text-foreground focus:outline-none focus:border-ember/60 transition-colors"
              />
            </div>
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Max $</label>
              <input
                type="number" min="0" step="50" value={maxV}
                onChange={e => update(minV, e.target.value)}
                placeholder="Any"
                className="w-full px-3 py-2 font-body text-xs border border-border bg-card text-foreground focus:outline-none focus:border-ember/60 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Slider (single range: distance, capacity, etc.) ───────────────────────
  if (filter.type === 'slider') {
    const minVal = filter.min ?? 0;
    const maxVal = filter.max ?? 100;
    const stepVal = filter.step ?? 1;
    const unit = filter.unit ?? '';
    const cur = typeof value === 'string' ? Number(value) : maxVal;
    return (
      <div className="py-3 border-b border-border">
        <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
          <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
          <div className="flex items-center gap-1.5">
            {value && (
              <span className="font-utility text-[10px] font-bold text-muted-foreground">≤ {cur}{unit}</span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {open && (
          <div className="px-1 space-y-2">
            <input
              type="range"
              min={minVal}
              max={maxVal}
              step={stepVal}
              value={cur}
              onChange={e => onChange(e.target.value)}
              className="w-full h-1.5 accent-ember cursor-pointer"
            />
            <div className="flex justify-between font-utility text-[11px] text-muted-foreground">
              <span>{minVal}{unit}</span>
              <span className="font-bold text-foreground text-[12px]">{value ? `${cur}${unit}` : 'Any'}</span>
              <span>{maxVal}{unit}</span>
            </div>
            {value && (
              <button type="button" onClick={() => onChange(null)} className="font-utility text-[11px] font-bold text-muted-foreground hover:text-ember transition-colors">
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Rating (radio style) ───────────────────────────────────────────────────
  if (filter.type === 'rating') {
    const cur = typeof value === 'string' ? value : null;
    return (
      <div className="py-3 border-b border-border">
        <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
          <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="space-y-0.5">
            {(filter.options ?? []).map(opt => (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
                onClick={() => onChange(cur === opt.value ? null : opt.value)}
              >
                <div className={`w-4 h-4 border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${cur === opt.value ? 'border-ember' : 'border-border group-hover:border-ember/40'}`}>
                  {cur === opt.value && <div className="w-2 h-2 bg-ember" />}
                </div>
                <span className={`font-body text-[13px] transition-colors ${cur === opt.value ? 'font-semibold text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Neighborhood (grouped checkboxes, no scroll trap) ─────────────────────
  if (filter.type === 'neighborhood') {
    const selected = Array.isArray(value) ? value : (value ? [String(value)] : []);
    const filtered = neighborhoodSearch
      ? ALL_NEIGHBORHOODS.filter(n => n.toLowerCase().includes(neighborhoodSearch.toLowerCase()))
      : null;
    const toggle = (n: string) => {
      const next = selected.includes(n) ? selected.filter(x => x !== n) : [...selected, n];
      onChange(next.length > 0 ? next : null);
    };
    return (
      <div className="py-3 border-b border-border">
        <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
          <span className="font-body text-[13px] font-semibold text-foreground">Neighborhood</span>
          <div className="flex items-center gap-1.5">
            {selected.length > 0 && (
              <span className="w-4 h-4 bg-ember text-ember-foreground font-utility text-[9px] font-bold flex items-center justify-center">{selected.length}</span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {open && (
          <>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text" value={neighborhoodSearch}
                onChange={e => onNeighborhoodSearch(e.target.value)}
                placeholder="Search neighborhoods..."
                className="w-full pl-7 pr-2 py-1.5 font-body text-xs bg-muted border border-border text-foreground focus:outline-none focus:border-ember/60 transition-colors"
              />
            </div>

            {/* Active chips */}
            {selected.length > 0 && !neighborhoodSearch && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selected.map(n => (
                  <span key={n} className="inline-flex items-center gap-1 font-utility text-[10px] font-bold bg-ink text-ink-foreground px-2 py-0.5">
                    {n}
                    <button type="button" onClick={() => toggle(n)} className="hover:text-ink-foreground/60 leading-none">×</button>
                  </span>
                ))}
                <button type="button" onClick={() => onChange(null)} className="font-utility text-[10px] font-bold text-muted-foreground hover:text-ember transition-colors ml-1">Clear all</button>
              </div>
            )}

            <div>
              {filtered ? (
                filtered.map(n => (
                  <label key={n} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                    <div className={`w-4 h-4 border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${selected.includes(n) ? 'bg-ink border-ink' : 'border-border group-hover:border-ember/40'}`}>
                      {selected.includes(n) && <Check className="h-2.5 w-2.5 text-ink-foreground" strokeWidth={3} />}
                    </div>
                    <span className={`font-body text-[12px] ${selected.includes(n) ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n}</span>
                  </label>
                ))
              ) : (
                NEIGHBORHOODS_BY_AREA.map(area => (
                  <div key={area.area} className="mb-1">
                    <div className="font-utility text-[10px] font-bold uppercase tracking-[0.15em] text-ember pt-2 pb-0.5">{area.area}</div>
                    {area.items.map(n => (
                      <label key={n} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                        <div className={`w-4 h-4 border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${selected.includes(n) ? 'bg-ink border-ink' : 'border-border group-hover:border-ember/40'}`}>
                          {selected.includes(n) && <Check className="h-2.5 w-2.5 text-ink-foreground" strokeWidth={3} />}
                        </div>
                        <span className={`font-body text-[12px] ${selected.includes(n) ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n}</span>
                      </label>
                    ))}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Multi (checkboxes) / Single (radios) ──────────────────────────────────
  const opts = filter.options ?? [];
  const isMulti = filter.type === 'multi';
  const selected = isMulti
    ? (Array.isArray(value) ? value : (value ? [String(value)] : []))
    : (typeof value === 'string' ? [value] : []);
  const toggle = (v: string) => {
    if (isMulti) {
      const next = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v];
      onChange(next.length > 0 ? next : null);
    } else {
      onChange(selected[0] === v ? null : v);
    }
  };

  return (
    <div className="py-3 border-b border-border">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between mb-2.5">
        <span className="font-body text-[13px] font-semibold text-foreground">{filter.label}</span>
        <div className="flex items-center gap-1.5">
          {selected.length > 0 && (
            <span className="w-4 h-4 bg-ember text-ember-foreground font-utility text-[9px] font-bold flex items-center justify-center">{selected.length}</span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="space-y-0.5">
          {opts.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
              onClick={() => toggle(opt.value)}
            >
              {isMulti ? (
                <div className={`w-4 h-4 border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${selected.includes(opt.value) ? 'bg-ink border-ink' : 'border-border group-hover:border-ember/40'}`}>
                  {selected.includes(opt.value) && <Check className="h-2.5 w-2.5 text-ink-foreground" strokeWidth={3} />}
                </div>
              ) : (
                <div className={`w-4 h-4 border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${selected.includes(opt.value) ? 'border-ember' : 'border-border group-hover:border-ember/40'}`}>
                  {selected.includes(opt.value) && <div className="w-2 h-2 bg-ember" />}
                </div>
              )}
              <span className={`font-body text-[13px] transition-colors ${selected.includes(opt.value) ? 'font-semibold text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
// ── Filter Mega Menu (slide-in from left) ─────────────────────────────────────
interface FilterMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: NavCategory | null;
  activeSubKey: string | null;
  filterValues: FilterValues;
  onFilterChange: (key: string, value: string | string[] | boolean | null) => void;
  onClearAll: () => void;
  activeCount: number;
  onNavigateToDirectory: (href: string) => void;
}

function FilterMegaMenu({
  isOpen, onClose, activeCategory, activeSubKey,
  filterValues, onFilterChange, onClearAll, activeCount, onNavigateToDirectory,
}: FilterMegaMenuProps) {
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const activeSub = activeSubKey ? activeCategory?.subcategories.find(s => s.filterSchemaKey === activeSubKey) : null;
  const categorySpecificFilters = activeSub?.filters ?? activeCategory?.filters ?? [];
  const universalTop = UNIVERSAL_FILTERS.filter(f => f.type !== 'neighborhood');
  const neighborhoodFilter = UNIVERSAL_FILTERS.filter(f => f.type === 'neighborhood');
  const allFilters = [...universalTop, ...categorySpecificFilters, ...neighborhoodFilter];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Slide-in panel */}
      <div className="fixed top-0 left-0 z-[151] h-full w-full max-w-sm bg-card shadow-2xl flex flex-col overflow-hidden border-r border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-foreground" />
            <span className="font-utility text-[11px] font-bold text-foreground uppercase tracking-[0.18em]">Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-ember text-ember-foreground text-[9px] font-bold flex items-center justify-center">{activeCount}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button onClick={onClearAll} className="font-utility text-[11px] font-bold text-ember hover:text-foreground transition-colors">Clear all</button>
            )}
            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>
        {/* Category label */}
        {activeCategory && (
          <div className="px-5 py-2 bg-background border-b border-border flex-shrink-0">
            <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">{activeCategory.label}</span>
          </div>
        )}
        {/* Filters - scrollable */}
        <div className="flex-1 overflow-y-auto px-5">
          {allFilters.map(filter => (
            <FilterSection
              key={filter.key}
              filter={filter}
              value={filterValues[filter.key] ?? null}
              onChange={v => onFilterChange(filter.key, v)}
              neighborhoodSearch={filter.type === 'neighborhood' ? neighborhoodSearch : ''}
              onNeighborhoodSearch={setNeighborhoodSearch}
            />
          ))}
          {allFilters.length === 0 && (
            <p className="py-8 text-xs text-muted-foreground text-center">Select a category<br />to see filters</p>
          )}
        </div>
        {/* SEO search strings */}
        <div className="flex-shrink-0 border-t border-border px-5 pt-4 pb-3 bg-background">
          <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember block mb-3">Popular Searches</span>
          <div className="flex flex-wrap gap-1.5">
            {SEO_SEARCH_STRINGS.map(s => (
              <button
                key={s.href}
                onClick={() => { onNavigateToDirectory(s.href); onClose(); }}
                className="font-utility text-[10px] font-semibold px-2.5 py-1 border border-border bg-card text-muted-foreground hover:border-ember/40 hover:text-ember transition-colors whitespace-nowrap"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {/* Apply */}
        <div className="flex-shrink-0 px-5 pb-4 pt-2">
          <button onClick={onClose} className="w-full py-3 bg-ink text-ink-foreground text-[13px] font-bold hover:opacity-90 transition-opacity">
            Show Results{activeCount > 0 ? ` (${activeCount} active)` : ''}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Promoted Horizontal Strip (paid / featured vendors) ───────────────────────
function HorizontalProfileCard({ vendor, onSelect }: { vendor: VendorSearchResult; onSelect: (id: string) => void }) {
  return (
    <div
      onClick={() => onSelect(vendor.vendor_id)}
      className="group grid grid-cols-[5fr_7fr] border border-black bg-white cursor-pointer hover:shadow-lg transition-shadow mb-6"
    >
      {/* Left: cover photo - 16:9 */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={vendor.cover_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop&q=80'}
          alt={vendor.business_name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {vendor.is_featured && (
            <span className="inline-flex items-center gap-1 bg-black text-white px-1.5 py-0.5 font-utility text-[8px] font-bold uppercase tracking-wider">
              <Zap size={7} /> Featured
            </span>
          )}
          {vendor.is_verified && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 font-utility text-[8px] font-bold text-black uppercase tracking-wider border border-black/10">
              <ShieldCheck size={7} /> Verified
            </span>
          )}
        </div>
      </div>
      {/* Right: details */}
      <div className="p-6 flex flex-col justify-between">
        <div>
          {/* Category badge */}
          {vendor.category && (
            <span className="inline-block font-utility text-[9px] font-bold uppercase tracking-wider text-black bg-gray-100 px-2 py-0.5 mb-2">
              {vendor.category}
            </span>
          )}
          {/* Vendor Name - Bold, BLACK, prominent */}
          <h3 className="font-display text-2xl font-bold text-black leading-tight mb-2">
            {vendor.business_name}
          </h3>
          {/* Description/Bio - 2-line truncated, BLACK */}
          {vendor.bio && (
            <p className="text-sm text-black line-clamp-2 leading-snug mb-2">{vendor.bio}</p>
          )}
          {/* Star Rating - 5-star display + rating number + review count */}
          {vendor.avg_rating !== null && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.round(vendor.avg_rating || 0) ? 'fill-black text-black' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-black">{vendor.avg_rating.toFixed(1)}</span>
              {vendor.review_count !== null && (
                <span className="text-xs text-gray-500">({vendor.review_count} reviews)</span>
              )}
            </div>
          )}
          {/* Address - with map pin icon, muted */}
          {vendor.address && (
            <div className="flex items-start gap-1 mb-2">
              <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-500 line-clamp-1">{vendor.address}</span>
            </div>
          )}
          {/* Price Range badge */}
          {vendor.price_range && (
            <span className="inline-block font-utility text-[11px] font-bold text-black border border-black px-2 py-0.5">
              {vendor.price_range}
            </span>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={e => { e.stopPropagation(); onSelect(vendor.vendor_id); }}
            className="px-5 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={e => { e.stopPropagation(); }}
            className="flex items-center justify-center gap-1 px-4 py-2.5 border border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition-colors"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Vertical VendorCard ────────────────────────────────────────────────────────
function VerticalVendorCard({ vendor, onClick }: { vendor: VendorSearchResult; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-black overflow-hidden cursor-pointer transition-all hover:shadow-lg flex flex-col"
    >
      {/* Cover image - 16:9 aspect ratio */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
        <img
          src={vendor.cover_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80'}
          alt={vendor.business_name} referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"
        />
        {/* Badges - no colored background icons, clean text badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {vendor.is_featured && (
            <span className="inline-flex items-center gap-1 bg-black text-white px-1.5 py-0.5 font-utility text-[8px] font-bold uppercase tracking-wider">
              <Zap size={7} /> Featured
            </span>
          )}
          {vendor.is_verified && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 font-utility text-[8px] font-bold text-black uppercase tracking-wider border border-black/10">
              <ShieldCheck size={7} /> Verified
            </span>
          )}
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          {/* Category badge */}
          {vendor.category && (
            <span className="inline-block font-utility text-[9px] font-bold uppercase tracking-wider text-black bg-gray-100 px-2 py-0.5 mb-2">
              {vendor.category}
            </span>
          )}
          {/* Vendor Name - Bold, BLACK, prominent */}
          <h3 className="font-display font-bold text-black text-base leading-snug">{vendor.business_name}</h3>

          {/* Description/Bio - 2-line truncated, BLACK */}
          {vendor.bio && (
            <p className="mt-1 text-sm text-black line-clamp-2 leading-snug">{vendor.bio}</p>
          )}

          {/* Address - with map pin icon, muted */}
          {vendor.address && (
            <div className="flex items-start gap-1 mt-2">
              <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-500 line-clamp-1">{vendor.address}</span>
            </div>
          )}

          {/* Star Rating - 5-star display + rating number + review count */}
          {vendor.avg_rating !== null && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.round(vendor.avg_rating || 0) ? 'fill-black text-black' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-black">{vendor.avg_rating.toFixed(1)}</span>
              {vendor.review_count !== null && (
                <span className="text-xs text-gray-500">({vendor.review_count} reviews)</span>
              )}
            </div>
          )}

          {/* Price Range badge */}
          {vendor.price_range && (
            <span className="inline-block mt-2 font-utility text-[11px] font-bold text-black border border-black px-2 py-0.5">
              {vendor.price_range}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            className="flex-1 px-4 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center"
          >
            Book Now
          </button>
          <button
            onClick={e => { e.stopPropagation(); }}
            className="flex items-center justify-center gap-1 px-4 py-2.5 border border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition-colors"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Directory Hero ─────────────────────────────────────────────────────────────
function DirectoryHero({
  onOpenFilters,
  totalCount,
}: {
  onOpenFilters: () => void;
  totalCount: number;
}) {
  return (
    <div className="bg-background border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Milwaukee&apos;s Largest Event Marketplace
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[80px] font-bold text-foreground leading-[0.90] mb-6">
              Find Every<br />Vendor You Need
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-md leading-relaxed">
              Verified venues, caterers, photographers, DJs, florists and more. Curated for Milwaukee events.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-5">
            {totalCount > 0 && (
              <div className="lg:text-right">
                <p className="font-display text-4xl font-bold text-foreground">{totalCount.toLocaleString()}</p>
                <p className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Vendors listed</p>
              </div>
            )}
            <button
              onClick={onOpenFilters}
              className="px-6 py-3.5 bg-ink text-ink-foreground font-utility text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Browse &amp; Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Experience Bento Section ──────────────────────────────────────────────────
function ExperienceBentoSection({
  onSelectExperience,
}: {
  onSelectExperience: (et: EventType) => void;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <div>
            <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">What are you planning?</p>
            <h2 className="font-display text-2xl font-bold text-foreground">Choose your event type</h2>
          </div>
          <span className="font-body text-[12px] text-muted-foreground hidden md:block leading-snug text-right max-w-[200px]">
            We surface the exact vendors you need
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-px bg-border border border-border">
          {STATIC_EVENT_TYPES.map((et: EventType) => (
            <button
              key={et.slug}
              onClick={() => onSelectExperience(et)}
              className="group flex flex-col justify-between p-5 bg-background hover:bg-ink transition-colors text-left"
              style={{ minHeight: '96px' }}
            >
              <span className="font-display text-[14px] font-bold text-foreground group-hover:text-ink-foreground leading-tight">
                {et.name}
              </span>
              <span className="font-utility text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-ink-foreground/40 mt-2">
                ${(et.budget_guidance_min / 1000).toFixed(0)}k – ${(et.budget_guidance_max / 1000).toFixed(0)}k
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── New Vendors Section ────────────────────────────────────────────────────────
function NewVendorsSection({
  vendors,
  isLoading,
  onSelectVendor,
}: {
  vendors: NewVendor[];
  isLoading: boolean;
  onSelectVendor: (id: string) => void;
}) {
  const skeletons = Array.from({ length: 8 });
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <div>
              <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-1">Freshly listed</p>
              <h2 className="font-display text-xl font-bold text-foreground">New to the marketplace</h2>
            </div>
          </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {isLoading
            ? skeletons.map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 snap-start w-[152px] bg-card border border-border animate-pulse"
                >
                  <div className="h-28 bg-muted" />
                  <div className="p-3 space-y-1.5">
                    <div className="h-3 bg-muted w-2/3" />
                    <div className="h-3 bg-muted w-1/2" />
                  </div>
                </div>
              ))
            : vendors.map((v) => (
                <button
                  key={v.vendor_id}
                  onClick={() => onSelectVendor(v.vendor_id)}
                  className="flex-shrink-0 snap-start w-[152px] bg-white border border-black overflow-hidden hover:shadow-lg transition-shadow group text-left"
                >
                  <div className="relative h-28 bg-gray-100 overflow-hidden">
                    <img
                      src={
                        v.cover_url ||
                        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=200&fit=crop&q=80'
                      }
                      alt={v.business_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {v.is_verified && (
                      <div className="absolute top-2 right-2 bg-black/90 px-1.5 py-0.5">
                        <span className="font-utility text-[8px] font-bold text-white uppercase tracking-wider">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-display text-[12px] font-bold text-black truncate leading-tight">
                      {v.business_name}
                    </p>
                    {v.neighborhood && (
                      <p className="font-utility text-[10px] text-gray-500 mt-0.5 truncate">{v.neighborhood}</p>
                    )}
                    {v.price_range && (
                      <span className="inline-block font-utility text-[10px] font-bold text-black border border-black px-1.5 py-0.5 mt-1">{v.price_range}</span>
                    )}
                  </div>
                </button>
              ))}
        </div>
      </div>
    </section>
  );
}

// ── Recent Activity Section ────────────────────────────────────────────────────
function RecentActivitySection() {
  const { items, isLoading } = useRecentActivity();
  if (isLoading || items.length === 0) return null;
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <div>
            <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-1">Platform activity</p>
            <h2 className="font-display text-xl font-bold text-foreground">Recent activity</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-foreground" />
            <span className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-5 bg-background hover:bg-muted transition-colors"
            >
              <p className="font-display text-[13px] font-bold text-foreground truncate">{item.vendor_name}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-snug">{item.description}</p>
              <p className="font-utility text-[10px] text-muted-foreground/50 mt-3">{item.time_ago}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Claim CTA Section ──────────────────────────────────────────────────────────
function ClaimCTASection({ onOpenSignupModal }: { onOpenSignupModal: () => void }) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-utility text-[10px] font-bold uppercase tracking-[0.25em] text-ink-foreground/30 mb-6">For Local Vendors</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-foreground leading-[1.0] mb-6">
              Your business is<br />already listed.
            </h2>
            <p className="font-body text-sm text-ink-foreground/50 leading-relaxed mb-10 max-w-sm">
              Planviry pre-seeds verified Milwaukee vendors. Claim your profile to unlock bookings, leads, and the trusted badge that converts browsers into clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/claim"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ink-foreground text-ink font-utility text-[11px] font-bold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
              >
                Claim My Profile
              </a>
              <button
                onClick={onOpenSignupModal}
                className="px-6 py-3.5 border border-ink-foreground/20 text-ink-foreground font-utility text-[11px] font-bold uppercase tracking-[0.18em] hover:border-ink-foreground/50 transition-colors"
              >
                Create New Listing
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-ink-foreground/10 border border-ink-foreground/10">
            {[
              { stat: '4×', title: 'More bookings', desc: 'Verified profiles convert at 4× the rate of unclaimed listings.' },
              { stat: '0%', title: 'Chargeback risk', desc: 'All payments flow through our secure escrow layer.' },
              { stat: '24h', title: 'Calendar sync', desc: 'Real-time availability syncs with booked clients automatically.' },
              { stat: '∞', title: 'Lead alerts', desc: 'Instant notifications when clients request your availability.' },
            ].map(({ stat, title, desc }) => (
              <div key={title} className="p-6">
                <p className="font-display text-3xl font-bold text-ink-foreground mb-2">{stat}</p>
                <p className="font-display text-[13px] font-bold text-ink-foreground mb-1.5">{title}</p>
                <p className="font-body text-[11px] text-ink-foreground/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Category Bento Navigation ──────────────────────────────────────────────────
function CategoryBentoGrid({ categories, activeCategoryKey, onSelectCategory }: {
  categories: NavCategory[]; activeCategoryKey: string | null; onSelectCategory: (cat: NavCategory) => void;
}) {
  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] w-4 bg-ember" />
        <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">Browse by Category</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-px bg-border border border-border">
        {categories.map(cat => (
          <button key={cat.key} onClick={() => onSelectCategory(cat)}
            className={`flex items-center justify-center p-3 text-center transition-colors ${
              activeCategoryKey === cat.key
                ? 'bg-ink text-ink-foreground'
                : 'bg-card text-foreground hover:bg-ink hover:text-ink-foreground'
            }`}
          >
            <span className="font-display text-[12px] font-bold leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main DirectoryView ─────────────────────────────────────────────────────────
interface DirectoryViewProps {
  onSelectVendor: (id: string) => void;
  onOpenSignupModal: () => void;
  initialCategoryKey?: string | null;
  initialSub?: NavSubcategory | null;
  /** Pre-fetched vendors from ISR server component - skips client-side fetch on first load */
  initialVendors?: VendorSearchResult[];
}

export function DirectoryView({ onSelectVendor, onOpenSignupModal, initialCategoryKey, initialSub, initialVendors }: DirectoryViewProps) {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(initialCategoryKey ?? null);
  const [activeSubKey, setActiveSubKey] = useState<string | null>(initialSub?.filterSchemaKey ?? null);
  const [activeSubLabel, setActiveSubLabel] = useState<string | null>(initialSub?.label ?? null);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [allVendors, setAllVendors] = useState<VendorSearchResult[]>(initialVendors ?? []);
  const [totalVendorCount, setTotalVendorCount] = useState<number>(0);
  const [initialFetching, setInitialFetching] = useState(!initialVendors || initialVendors.length === 0);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [planningExperience, setPlanningExperience] = useState<EventType | null>(null);

  const { vendors: newVendors, isLoading: newVendorsLoading } = useNewVendors(8);

  const activeCategory = useMemo(() => NAV_CATEGORIES.find(c => c.key === activeCategoryKey) ?? null, [activeCategoryKey]);

  const activeFilterCount = useMemo(() =>
    Object.values(filterValues).filter(v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)).length,
  [filterValues]);

  const isLandingView = !activeCategoryKey && !searchQuery && activeFilterCount === 0 && !planningExperience;

  const handleSelectExperience = useCallback((et: EventType) => {
    setPlanningExperience(et);
    const navCatKey = EVENT_TO_NAV_CAT[et.slug];
    if (navCatKey) {
      const navCat = NAV_CATEGORIES.find(c => c.key === navCatKey);
      if (navCat) setActiveCategoryKey(navCat.key);
    }
    // Scroll to vendor grid
    setTimeout(() => {
      const el = document.getElementById('directory-vendor-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const mapApiVendors = (list: Record<string, unknown>[]): VendorSearchResult[] =>
    list.map(v => ({
      vendor_id: (v.vendor_id || v.id) as string,
      business_name: v.business_name as string,
      slug: v.slug as string,
      // Handle both vendor_profiles (cover_url) and vendor_card_cache (primary_photo_url)
      cover_url: (v.cover_url || v.primary_photo_url || v.logo_url || null) as string | null,
      avg_rating: (v.avg_rating ?? null) as number | null,
      review_count: (v.review_count ?? null) as number | null,
      price_range: (v.price_range ?? null) as string | null,
      price_starting_at: (v.price_starting_at ?? null) as number | null,
      neighborhood: (v.neighborhood ?? null) as string | null,
      // Handle both vendor_profiles (is_featured) and vendor_card_cache (badge_featured)
      is_featured: ((v.is_featured || v.badge_featured) ?? false) as boolean,
      is_verified: ((v.is_verified || v.badge_verified) ?? false) as boolean,
      instant_booking: ((v.instant_booking || v.badge_instant_booking) ?? false) as boolean,
      distance_miles: null,
      match_count: 0,
      bio: (v.bio || v.tagline || null) as string | null,
      address: (v.address || v.address_city || null) as string | null,
      category: (v.category_name || v.category_slug || null) as string | null,
    }));

  const fetchAllVendors = useCallback(async (categoryKey?: string | null, subKey?: string | null, page = 1) => {
    try {
      setInitialFetching(true);
      const params = new URLSearchParams({ limit: String(ITEMS_PER_PAGE), page: String(page) });
      if (categoryKey) params.set('categoryKey', categoryKey);
      if (subKey) params.set('subKey', subKey);
      const res = await fetch(`/api/directory?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAllVendors(mapApiVendors(data.vendors || []));
        if (typeof data.total === 'number') setTotalVendorCount(data.total);
      }
    } catch { /* keep existing allVendors */ } finally { setInitialFetching(false); }
  }, []); // eslint-disable-line

  // When category or subcategory changes, re-fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchAllVendors(activeCategoryKey, activeSubKey);
  }, [activeCategoryKey, activeSubKey]); // eslint-disable-line

  useEffect(() => {
    fetchAllVendors(activeCategoryKey, activeSubKey, currentPage);
  }, [currentPage]); // eslint-disable-line

  useEffect(() => {
    const hasActiveFilters = Object.values(filterValues).some(
      v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
    );
    if (!hasActiveFilters && !activeSubKey) return;
    const t = setTimeout(() => fetchAllVendors(activeCategoryKey, activeSubKey), 250);
    return () => clearTimeout(t);
  }, [filterValues]); // eslint-disable-line

  // Only fire initial fetch if we didn't get pre-loaded data from the server
  useEffect(() => { if (!initialVendors || initialVendors.length === 0) fetchAllVendors(activeCategoryKey ?? null); }, []); // eslint-disable-line

  const handleSelectCategory = useCallback((cat: NavCategory) => {
    setActiveCategoryKey(cat.key); setActiveSubKey(null); setActiveSubLabel(null); setFilterValues({}); setCurrentPage(1);
  }, []);
  const handleSelectSub = useCallback((sub: NavSubcategory) => {
    if (!activeCategory) return;
    setActiveSubKey(sub.filterSchemaKey); setActiveSubLabel(sub.label); setFilterValues({}); setCurrentPage(1);
  }, [activeCategory]);
  const handleClearCategory = useCallback(() => {
    setActiveCategoryKey(null); setActiveSubKey(null); setActiveSubLabel(null); setFilterValues({}); setSearchQuery(''); setCurrentPage(1); fetchAllVendors(null);
  }, [fetchAllVendors]);
  const handleFilterChange = useCallback((key: string, value: string | string[] | boolean | null) => {
    setFilterValues(prev => ({ ...prev, [key]: value })); setCurrentPage(1);
  }, []);
  const handleClearAll = useCallback(() => { setFilterValues({}); setCurrentPage(1); }, []);

  const handleSeoNavigate = useCallback((href: string) => {
    try {
      const url = new URL(href, 'https://placeholder.com');
      const cat = url.searchParams.get('cat');
      const sub = url.searchParams.get('sub');
      const q = url.searchParams.get('q');
      if (cat) {
        const navCat = NAV_CATEGORIES.find(c => c.key === cat);
        if (navCat) {
          setActiveCategoryKey(cat);
          if (sub) {
            const navSub = navCat.subcategories.find(s => s.filterSchemaKey === sub);
            if (navSub) { setActiveSubKey(navSub.filterSchemaKey); setActiveSubLabel(navSub.label); }
            else { setActiveSubKey(null); setActiveSubLabel(null); }
          } else { setActiveSubKey(null); setActiveSubLabel(null); }
          setFilterValues({}); setCurrentPage(1);
        }
      }
      if (q) setSearchQuery(q);
    } catch { /* ignore */ }
  }, []);

  const baseVendors = allVendors;
  const sortedVendors = useMemo(() => {
    const arr = [...baseVendors];
    const w: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
    if (sortBy === 'rating') return arr.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    if (sortBy === 'reviews') return arr.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    if (sortBy === 'priceAsc') return arr.sort((a, b) => (w[a.price_range || ''] || 2) - (w[b.price_range || ''] || 2));
    if (sortBy === 'priceDesc') return arr.sort((a, b) => (w[b.price_range || ''] || 2) - (w[a.price_range || ''] || 2));
    return arr.sort((a, b) => a.business_name.localeCompare(b.business_name));
  }, [baseVendors, sortBy]);

  const displayVendors = useMemo(() => {
    if (!searchQuery) return sortedVendors;
    const q = searchQuery.toLowerCase();
    return sortedVendors.filter(v => v.business_name.toLowerCase().includes(q) || (v.neighborhood?.toLowerCase().includes(q)));
  }, [sortedVendors, searchQuery]);

  const serverTotal = totalVendorCount;
  const totalPages = searchQuery
    ? Math.max(1, Math.ceil(displayVendors.length / ITEMS_PER_PAGE))
    : Math.max(1, Math.ceil(serverTotal / ITEMS_PER_PAGE));
  const paginatedVendors = searchQuery
    ? displayVendors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : displayVendors;
  const resultCount = searchQuery ? displayVendors.length : serverTotal;
  const isLoading = initialFetching;

  // Layout: each section = 1 horizontal profile card + up to 6 vertical cards (3 cols x 2 rows)
  // 3 sections x 7 cards = 21 total (matches ITEMS_PER_PAGE)
  const displayGroups = useMemo(() => {
    const SECTION_SIZE = 7;
    const sections: { featured: VendorSearchResult; grid: VendorSearchResult[] }[] = [];
    for (let i = 0; i < paginatedVendors.length; i += SECTION_SIZE) {
      const chunk = paginatedVendors.slice(i, i + SECTION_SIZE);
      if (chunk.length > 0) sections.push({ featured: chunk[0], grid: chunk.slice(1) });
    }
    return sections;
  }, [paginatedVendors]);

  const otherCategories = useMemo(() => NAV_CATEGORIES.filter(c => c.key !== activeCategoryKey), [activeCategoryKey]);

  return (
    <div className="bg-background min-h-screen">

      {/* Filter Mega Menu */}
      <FilterMegaMenu
        isOpen={filterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        activeCategory={activeCategory}
        activeSubKey={activeSubKey}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        activeCount={activeFilterCount}
        onNavigateToDirectory={handleSeoNavigate}
      />

      {/* Landing sections - only shown when no category/filter/search is active */}
      {isLandingView && (
        <>
          <DirectoryHero
            onOpenFilters={() => setFilterMenuOpen(true)}
            totalCount={totalVendorCount || allVendors.length}
          />
          <ExperienceBentoSection onSelectExperience={handleSelectExperience} />
          <NewVendorsSection
            vendors={newVendors}
            isLoading={newVendorsLoading}
            onSelectVendor={onSelectVendor}
          />
          <RecentActivitySection />
        </>
      )}

      <div id="directory-vendor-section" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">

        {/* Planning experience banner */}
        {planningExperience && (
          <div className="flex items-start gap-3 mb-6 px-4 py-3 bg-muted border border-border">
            <span className="font-utility text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground border border-border px-1.5 py-0.5 flex-shrink-0">Planning</span>
            <div className="flex-1 min-w-0">
              <span className="font-utility text-[11px] font-bold text-foreground">Planning a {planningExperience.name} </span>
              <span className="font-utility text-[11px] text-muted-foreground">
                · Typical budget: ${planningExperience.budget_guidance_min.toLocaleString()}–${planningExperience.budget_guidance_max.toLocaleString()}
                · {planningExperience.typical_guest_min}–{planningExperience.typical_guest_max} guests
              </span>
            </div>
            <button
              onClick={() => { setPlanningExperience(null); setActiveCategoryKey(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Clear experience filter"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap border-b border-border pb-5">
          <button
            onClick={() => setFilterMenuOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 border font-utility text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
              activeFilterCount > 0
                ? 'bg-ember text-ember-foreground border-ember'
                : 'bg-card text-foreground border-border hover:border-ember/40 hover:text-ember'
            }`}
          >
            <SlidersHorizontal size={12} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-ember-foreground text-ember text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vendors..."
              className="pl-9 pr-4 h-9 w-44 sm:w-56 border border-border bg-card text-foreground placeholder-muted-foreground font-body text-sm focus:outline-none focus:border-ember/60"
            />
          </div>

          {activeSubLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-ink-foreground font-utility text-[11px] font-bold uppercase tracking-[0.12em]">
              {activeSubLabel}
              <button onClick={() => { setActiveSubKey(null); setActiveSubLabel(null); }}><X size={11} /></button>
            </span>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="font-utility text-[11px] text-muted-foreground whitespace-nowrap hidden sm:block">{resultCount.toLocaleString()} vendors</span>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="h-9 pl-3 pr-7 font-utility text-[11px] font-bold uppercase tracking-[0.12em] bg-card border border-border text-foreground focus:outline-none appearance-none cursor-pointer">
                <option value="name">A–Z</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="priceAsc">Price ↑</option>
                <option value="priceDesc">Price ↓</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {activeCategory && (
          <div className="flex items-center gap-1.5 mb-6">
            <button onClick={handleClearCategory} className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember hover:opacity-70 transition-opacity">All</button>
            <ChevronRight size={10} className="text-muted-foreground flex-shrink-0" />
            <button onClick={() => { setActiveSubKey(null); setActiveSubLabel(null); setFilterValues({}); setCurrentPage(1); }}
              className={`font-utility text-[10px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-70 ${!activeSubKey ? 'text-foreground' : 'text-muted-foreground'}`}>
              {activeCategory.label}
            </button>
            {activeSubLabel && (
              <>
                <ChevronRight size={10} className="text-muted-foreground flex-shrink-0" />
                <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">{activeSubLabel}</span>
              </>
            )}
          </div>
        )}

        {/* Vendor results */}
        {isLoading ? (
          <div>
            <div className="flex gap-4 overflow-hidden mb-6">
              {[1, 2, 3].map(i => <VendorCardSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <VendorCardSkeleton key={i} vertical />)}
            </div>
          </div>
        ) : paginatedVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <HelpCircle size={40} className="text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No results for this filter</h3>
            <p className="font-body text-sm text-muted-foreground max-w-sm mb-6">Try adjusting your filters or clearing them to see all vendors.</p>
            <button onClick={handleClearCategory} className="px-5 py-2 border border-border font-utility text-[11px] font-bold uppercase tracking-[0.18em] text-foreground hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors">
              Browse All Vendors
            </button>
          </div>
        ) : (
          <>
            {/* Layout: 1 horizontal profile card then 3-col x 2-row vertical grid, 3 sections = 21 cards */}
            {displayGroups.map((section, idx) => (
              <div key={idx} className={idx > 0 ? 'mt-16 pt-10 border-t border-border' : ''}>
                <HorizontalProfileCard vendor={section.featured} onSelect={onSelectVendor} />
                {section.grid.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {section.grid.map(v => (
                      <VerticalVendorCard key={v.vendor_id} vendor={v} onClick={() => onSelectVendor(v.vendor_id)} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center border border-border bg-card text-foreground disabled:opacity-30 hover:border-ember/40 hover:text-ember transition-colors">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) page = i + 1;
                  else if (currentPage <= 4) page = i + 1;
                  else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                  else page = currentPage - 3 + i;
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 font-utility text-[11px] font-bold transition-colors ${page === currentPage ? 'bg-ink text-ink-foreground' : 'bg-card border border-border text-foreground hover:border-ember/40 hover:text-ember'}`}>
                      {page}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center border border-border bg-card text-foreground disabled:opacity-30 hover:border-ember/40 hover:text-ember transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Subcategory pills */}
            {activeCategory && activeCategory.subcategories.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-4 bg-ember" />
                  <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">Browse {activeCategory.label}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setActiveSubKey(null); setActiveSubLabel(null); setFilterValues({}); setCurrentPage(1); }}
                    className={`px-3 py-1.5 border font-utility text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                      !activeSubKey ? 'bg-ink text-ink-foreground border-ink' : 'bg-card text-foreground border-border hover:border-ember/40 hover:text-ember'
                    }`}
                  >
                    All {activeCategory.label}
                  </button>
                  {activeCategory.subcategories.map(sub => (
                    <button key={sub.filterSchemaKey} onClick={() => handleSelectSub(sub)}
                      className={`px-3 py-1.5 border font-utility text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                        activeSubKey === sub.filterSchemaKey ? 'bg-ink text-ink-foreground border-ink' : 'bg-card text-foreground border-border hover:border-ember/40 hover:text-ember'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other category bento navigation */}
            <CategoryBentoGrid
              categories={otherCategories}
              activeCategoryKey={activeCategoryKey}
              onSelectCategory={handleSelectCategory}
            />
          </>
        )}
      </div>

      {/* Claim CTA - always at bottom */}
      <ClaimCTASection onOpenSignupModal={onOpenSignupModal} />
    </div>
  );
}