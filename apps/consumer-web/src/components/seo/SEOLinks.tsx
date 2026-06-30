'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronRight, Plane } from 'lucide-react';
import { US_STATES, POPULAR_CITIES, AIRPORT_CITIES } from '@/lib/planviry-data';

export function SEOLinks() {
  const [expandedState, setExpandedState] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Browse by State */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold mb-3">
              <MapPin className="w-4 h-4" /> Nationwide Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Browse by State
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Find event vendors across all 50 states. Select a state to explore local professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {US_STATES.map(state => {
              const isExpanded = expandedState === state.slug;
              const stateAirports = AIRPORT_CITIES.find(s => s.slug === state.slug)?.airports ?? [];

              return (
                <div key={state.slug} className="relative">
                  <button
                    onClick={() => setExpandedState(isExpanded ? null : state.slug)}
                    className={`w-full flex items-center justify-between gap-2 p-3 rounded-xl text-sm font-semibold transition-all border ${
                      isExpanded
                        ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    <span>{state.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && stateAirports.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-3 space-y-1">
                      {stateAirports.map(city => {
                        const cityName = city.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '');
                        return (
                          <Link
                            key={city.slug}
                            href={`/explore/city/${city.slug}`}
                            className="flex items-center gap-2 p-2 rounded-lg text-xs text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          >
                            <Plane className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate">{cityName}</span>
                            <span className="text-[10px] text-gray-400 font-mono shrink-0">{city.code}</span>
                          </Link>
                        );
                      })}
                      <Link
                        href={`/explore/state/${state.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-teal-600 hover:bg-teal-50 transition-colors border-t border-gray-100 mt-1 pt-2"
                      >
                        View all of {state.name} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Cities */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold mb-3">
              <Plane className="w-4 h-4" /> Popular Markets
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Top Cities
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Explore our most popular metro areas with the largest selection of verified event vendors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {POPULAR_CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/explore/city/${city.slug}`}
                className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="font-semibold text-teal-500">{city.code}</span> &middot; {city.state}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
