'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Frown, MapPin } from 'lucide-react';
import { MARKETPLACE_ITEMS, SUB_CATEGORIES } from '@/data/prototype-data';
import { CategoryLens } from '@/types';
import { TravelSearchBar } from '@/components/travel/TravelSearchBar';
import { DynamicFilterBar } from '@/components/DynamicFilterBar';

const TAXONOMY_MAP: Record<string, string> = {
  'travel': '11: Accommodations & Lodging',
};

export function TravelFeed({ category = 'travel' as CategoryLens }: { category?: CategoryLens }) {
  const {
    searchWhat,
    setSearchWhat,
    searchWhere,
    setSearchWhere,
    selectedSubcategory,
    setSelectedSubcategory,
    addToCart,
    setSelectedItem,
  } = useApp();

  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (filterName: string, values: string[]) => {
    setDynamicFilters(prev => {
      const next = { ...prev };
      if (values.length === 0) delete next[filterName];
      else next[filterName] = values;
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return MARKETPLACE_ITEMS.filter((item) => {
      if (item.category !== 'travel') return false;
      if (selectedSubcategory && selectedSubcategory !== 'all') {
        if (!item.subcategory || item.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
      }
      if (searchWhat.trim()) {
        const q = searchWhat.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !(item.description || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [category, selectedSubcategory, searchWhat]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Travel-specific search bar (Where to / Dates / Guests / Rooms) */}
      <section className="bg-white border-b border-midnight-slate/5 py-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <TravelSearchBar variant="plain" defaultDestination={searchWhere !== 'Savannah, GA' ? searchWhere : ''} />
        </div>
      </section>

      {/* Subcategories */}
      <div className="bg-refined-offwhite border-b border-midnight-slate/5 py-3">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex items-center gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-1">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-midnight-slate text-white'
                : 'bg-white border border-outline-variant/30 text-outline hover:border-primary hover:text-primary'
            }`}
          >
            All travel
          </button>
          {(SUB_CATEGORIES['travel'] || []).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedSubcategory.toLowerCase() === sub.toLowerCase()
                  ? 'bg-primary text-white font-bold'
                  : 'bg-white border border-outline-variant/30 text-outline hover:border-primary hover:text-primary'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic filters */}
      <DynamicFilterBar
        categoryKey={TAXONOMY_MAP['travel']}
        activeFilters={dynamicFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Results */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-midnight-slate font-bold uppercase tracking-tight">
              Travel
            </h1>
            <p className="text-midnight-slate/60 text-sm mt-1">
              Premium and curated entries for an exceptional, high-end experience.
            </p>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden vendor-card-shadow transition-all duration-500 border border-midnight-slate/5 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  {item.badge && (
                    <div className="absolute top-4 left-4 bg-midnight-slate text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{item.badge}</div>
                  )}
                  {item.rating && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-midnight-slate">★ {item.rating}</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-secondary-container uppercase tracking-[0.2em] mb-2">{item.category.replace('-', ' ')}</p>
                    <h3 className="font-display-lg text-2xl text-midnight-slate mb-2 cursor-pointer hover:text-champagne-gold transition-colors" onClick={() => setSelectedItem(item)}>{item.title}</h3>
                    <p className="text-on-surface-variant text-xs mb-4">📍 {item.location}</p>
                    <p className="text-midnight-slate/60 text-sm mb-6 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-midnight-slate/5 pt-4">
                    <div>
                      <p className="text-[10px] font-bold text-midnight-slate/40 uppercase mb-0.5">Price</p>
                      <p className="text-lg font-bold text-midnight-slate">${item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedItem(item)} className="px-4 py-2 border border-outline-variant text-primary text-xs font-semibold rounded-lg hover:bg-neutral-50">Details</button>
                      <button onClick={() => { addToCart(item); alert(`Added ${item.title} to your Unified Occasion Cart!`); }} className="bg-midnight-slate text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-champagne-gold transition-colors duration-300 active:scale-95">Orchestrate</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-outline-variant">
            <Frown className="w-10 h-10 text-outline mx-auto mb-2" />
            <h3 className="font-serif text-xl font-bold">No verified listings</h3>
            <p className="text-on-surface-variant text-sm mt-1">Try another destination or category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
