'use client';

import { useState } from 'react';
import { ChevronRight, MapPin, Grid, Briefcase, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/categories';
import { eventTypes } from '@/data/taxonomy';
import type { CategoryLevel1, CategoryLevel2 } from '@/data/categories';

const locations = [
  'New York City, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL',
  'Austin, TX', 'Dallas, TX', 'Las Vegas, NV', 'Nashville, TN', 'Atlanta, GA'
];

export default function VerticalMegaMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'service' | 'event' | 'location'>('event');
  const [selectedL1, setSelectedL1] = useState<CategoryLevel1>(categories[0]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-[80%] max-w-2xl bg-black border-l border-white/20 shadow-2xl z-[101] flex flex-col md:flex-row animate-in slide-in-from-right duration-300">

        {/* Navigation Sections */}
        <div className="w-full md:w-1/3 bg-[#0a0a0a] flex flex-col border-r border-white/10 relative">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white font-bold tracking-widest uppercase text-sm">Navigation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <button
              onMouseEnter={() => setActiveSection('event')}
              onClick={() => setActiveSection('event')}
              className={`w-full flex items-center justify-between px-6 py-5 border-b border-white/5 transition-colors ${
                activeSection === 'event' ? 'bg-black text-teal-400' : 'text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Grid className="w-5 h-5" />
                <span className="font-bold tracking-wide">Explore By Event</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeSection === 'event' ? 'text-teal-400' : 'text-gray-500'}`} />
            </button>

            <button
              onMouseEnter={() => setActiveSection('service')}
              onClick={() => setActiveSection('service')}
              className={`w-full flex items-center justify-between px-6 py-5 border-b border-white/5 transition-colors ${
                activeSection === 'service' ? 'bg-black text-teal-400' : 'text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5" />
                <span className="font-bold tracking-wide">Browse By Category</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeSection === 'service' ? 'text-teal-400' : 'text-gray-500'}`} />
            </button>

            <button
              onMouseEnter={() => setActiveSection('location')}
              onClick={() => setActiveSection('location')}
              className={`w-full flex items-center justify-between px-6 py-5 border-b border-white/5 transition-colors ${
                activeSection === 'location' ? 'bg-black text-teal-400' : 'text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span className="font-bold tracking-wide">Explore By Location</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeSection === 'location' ? 'text-teal-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-8 bg-black text-white h-full overflow-y-auto">
          {activeSection === 'location' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Popular Markets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleNavigate(`/book?loc=${encodeURIComponent(loc)}`)}
                    className="text-left text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors flex items-center hover:translate-x-1 transform duration-200"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'service' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 pb-12">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Browse By Category</h3>

              {/* L1 sidebar selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((l1) => (
                  <button
                    key={l1.slug}
                    onClick={() => setSelectedL1(l1)}
                    onMouseEnter={() => setSelectedL1(l1)}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
                      selectedL1.slug === l1.slug
                        ? 'bg-teal-500 text-black'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {l1.name}
                  </button>
                ))}
              </div>

              {/* L2 section headers with L3 items below */}
              <div className="space-y-6">
                {selectedL1.level2.map((l2) => (
                  <div key={l2.slug}>
                    <button
                      onClick={() => handleNavigate(`/categories/${selectedL1.slug}/${l2.slug}`)}
                      className="text-base font-bold text-white hover:text-teal-400 mb-3 block text-left group flex items-center gap-2"
                    >
                      {l2.name}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      {l2.level3.map((l3) => (
                        <button
                          key={l3.slug}
                          onClick={() => handleNavigate(`/categories/${selectedL1.slug}/${l2.slug}/${l3.slug}`)}
                          className="text-left text-xs font-medium text-gray-400 hover:text-teal-400 transition-colors py-1 truncate"
                        >
                          {l3.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'event' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 pb-12">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Event Types</h3>
              {eventTypes.map((event) => (
                <div key={event.id}>
                  <button
                    onClick={() => handleNavigate(`/book?type=${event.id}`)}
                    className="text-base font-bold text-white hover:text-teal-400 mb-3 block text-left group flex items-center gap-2"
                  >
                    {event.name}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {event.subcategories.slice(0, 6).map(sub => (
                      <button
                        key={sub}
                        onClick={() => handleNavigate(`/book?type=${event.id}&sub=${encodeURIComponent(sub)}`)}
                        className="text-left text-xs font-medium text-gray-400 hover:text-teal-400 transition-colors uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
                      >
                        {sub}
                      </button>
                    ))}
                    {event.subcategories.length > 6 && (
                      <span className="text-xs text-gray-600 px-2 py-1">+{event.subcategories.length - 6} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
