'use client'

import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Users,
  SlidersHorizontal,
  Heart,
  Plus,
  Compass,
  Briefcase,
  Utensils,
  Music,
  Plane,
  Sparkles,
  Building,
  Store,
  RefreshCw,
} from 'lucide-react';
import { CategoryLens, CartItem, SearchParams } from '@/lib/prototype-types';
import { LENS_ITEMS } from '@/data/prototype-data';

interface FeedViewProps {
  onNavigate: (screen: string) => void;
  activeCategory: CategoryLens;
  onSelectCategory: (category: CategoryLens) => void;
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export default function FeedView({
  onNavigate,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  cartItems,
}: FeedViewProps) {
  // Local state for filters
  const [priceRange, setPriceRange] = useState<number>(350);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    where: 'Austin, TX',
    when: 'Oct 24 - Oct 27',
    who: '4 Guests',
  });

  const categoriesList: { id: CategoryLens; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'things-to-do', label: 'Things to Do', icon: Compass },
    { id: 'food-drink', label: 'Food & Drink', icon: Utensils },
    { id: 'live-shows', label: 'Live Shows', icon: Music },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'party', label: 'Party', icon: Sparkles },
    { id: 'spaces', label: 'Spaces', icon: Building },
    { id: 'vendors', label: 'Vendors', icon: Store },
  ];

  // Filter listings based on category, price, and genre
  const filteredListings = LENS_ITEMS.filter((item) => {
    // Category check
    if (item.category !== activeCategory) return false;
    // Price check
    if (item.price > priceRange) return false;
    // Genre filter check (if live shows)
    if (activeCategory === 'live-shows' && selectedGenre !== 'All') {
      const match = item.tag?.toLowerCase().includes(selectedGenre.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  // Spotlight Item - let's select "Midnight Jazz at Elephant Room" if live shows is active
  const spotlightItem = activeCategory === 'live-shows' 
    ? LENS_ITEMS.find((i) => i.id === 'live-austin-3') 
    : filteredListings[0];

  // Rest of listings without spotlight
  const otherListings = spotlightItem 
    ? filteredListings.filter((item) => item.id !== spotlightItem.id) 
    : filteredListings;

  return (
    <div id="feed-page" className="min-h-screen bg-background text-on-background pb-xl pl-16 md:pl-20">
      {/* 1. Header Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest py-sm px-sm md:px-md flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-serif font-bold text-2xl tracking-tight text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
            Planviry
          </span>
          <nav className="hidden md:flex items-center gap-md">
            <button onClick={() => onNavigate('landing')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Explore
            </button>
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-primary border-b-2 border-primary pb-1">
              Plans
            </button>
            <button onClick={() => onNavigate('itinerary')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Bookings
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-sm">
          <button onClick={() => onNavigate('cart')} className="relative p-2 text-on-surface-variant hover:text-primary transition-all">
            <span className="text-lg">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold cursor-pointer">
            JD
          </div>
        </div>
      </header>

      {/* 2. Unified Search / Query Parameter Panel */}
      <section className="px-sm md:px-md py-sm max-w-7xl mx-auto">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm p-sm flex flex-col md:flex-row items-center justify-between gap-sm">
          <div className="flex flex-wrap gap-md items-center text-xs font-mono">
            <div>
              <span className="text-outline block mb-0.5">WHERE</span>
              <input
                type="text"
                value={searchParams.where}
                onChange={(e) => setSearchParams({ ...searchParams, where: e.target.value })}
                className="font-semibold text-on-surface outline-none bg-transparent border-b border-transparent focus:border-outline-variant w-28"
              />
            </div>
            <div className="border-l border-outline-variant h-8 hidden md:block" />
            <div>
              <span className="text-outline block mb-0.5">WHEN</span>
              <input
                type="text"
                value={searchParams.when}
                onChange={(e) => setSearchParams({ ...searchParams, when: e.target.value })}
                className="font-semibold text-on-surface outline-none bg-transparent border-b border-transparent focus:border-outline-variant w-36"
              />
            </div>
            <div className="border-l border-outline-variant h-8 hidden md:block" />
            <div>
              <span className="text-outline block mb-0.5">WHO</span>
              <input
                type="text"
                value={searchParams.who}
                onChange={(e) => setSearchParams({ ...searchParams, who: e.target.value })}
                className="font-semibold text-on-surface outline-none bg-transparent border-b border-transparent focus:border-outline-variant w-20"
              />
            </div>
          </div>

          <button
            onClick={() => alert(`Query updated: Scoping results to ${searchParams.where} for ${searchParams.who}`)}
            className="w-full md:w-auto px-md py-2.5 bg-primary text-on-primary text-utility-sm font-semibold rounded-md flex items-center justify-center gap-xs hover:opacity-90 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Update Search</span>
          </button>
        </div>
      </section>

      {/* 3. Columns Layout */}
      <section className="px-sm md:px-md max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Category Switcher Sidebar & Secondary Filters */}
        <div className="lg:col-span-3 flex flex-col gap-sm bg-surface-container-lowest p-sm rounded-xl border border-outline-variant/40 shadow-sm">
          {/* Category Rail Switcher inside Sidebar */}
          <div>
            <h3 className="text-label-caps text-secondary mb-xs">What's your plan?</h3>
            <span className="text-[10px] text-outline font-sans block mb-sm">Browse categories</span>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-utility-sm transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separation line */}
          <div className="border-t border-outline-variant/30" />

          {/* Secondary Filter Widget Suite */}
          <div className="flex flex-col gap-sm text-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-caps text-secondary">FILTERS</span>
              <button
                onClick={() => {
                  setPriceRange(350);
                  setSelectedGenre('All');
                }}
                className="text-[10px] font-mono hover:underline text-outline"
              >
                RESET
              </button>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant mb-1">
                <span>Price Limit</span>
                <span className="font-serif font-bold text-primary">${priceRange}</span>
              </div>
              <input
                type="range"
                min="30"
                max="850"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-mono text-outline mt-1">
                <span>$30</span>
                <span>$850+</span>
              </div>
            </div>

            {/* Live-show specific genre filters */}
            {activeCategory === 'live-shows' && (
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block mb-1">Genre</span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Rock', 'Jazz', 'Comedy', 'Theater', 'Sports'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-medium transition-all ${
                        selectedGenre === genre
                          ? 'bg-secondary-container text-on-secondary-container border border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant border border-transparent'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Place Swapped Feed Items */}
        <div className="lg:col-span-9 flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md text-primary">
              {activeCategory === 'live-shows' && `Live Shows in ${searchParams.where}`}
              {activeCategory === 'travel' && `Premium Lodging in ${searchParams.where}`}
              {activeCategory === 'things-to-do' && `Experiences in ${searchParams.where}`}
              {activeCategory === 'vendors' && `Elite Vendors in ${searchParams.where}`}
              {activeCategory === 'spaces' && `Venues & Private Dining in ${searchParams.where}`}
              {activeCategory !== 'live-shows' && activeCategory !== 'travel' && activeCategory !== 'things-to-do' && activeCategory !== 'vendors' && activeCategory !== 'spaces' && `Curated ${activeCategory} in ${searchParams.where}`}
            </h2>
            <div className="text-xs text-outline font-mono">
              Showing <strong className="text-on-surface font-sans">{filteredListings.length}</strong> results
            </div>
          </div>

          {/* A. Spotlight Banner Card (Only shown if results exist and fits categories) */}
          {spotlightItem && (
            <div id={`spotlight-card-${spotlightItem.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 group">
              <div className="md:col-span-5 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={spotlightItem.image}
                  alt={spotlightItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <span className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-mono tracking-widest px-2 py-0.5 rounded uppercase font-bold shadow-sm">
                  Spotlight
                </span>
              </div>
              <div className="md:col-span-7 p-sm md:p-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-secondary uppercase block mb-1">
                    {spotlightItem.tag || 'CURATED OCCASION'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                    {spotlightItem.title}
                  </h3>
                  <p className="text-on-surface-variant text-body-md mb-sm">
                    {spotlightItem.details || 'A highly coveted, luxury experience curated exclusively for bachelorette parties, birthdays, or grand celebrations. Fully responsive schedule, VIP amenities, and prime seating.'}
                  </p>
                  <p className="text-xs text-outline mb-3 font-mono">📍 {spotlightItem.location}</p>
                </div>

                <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30">
                  <div>
                    <span className="text-outline text-[10px] font-mono block">Tickets/Rates from</span>
                    <span className="font-serif font-bold text-2xl text-primary">${spotlightItem.price}</span>
                  </div>

                  <div className="flex items-center gap-xs">
                    <button
                      onClick={() => {
                        onAddToCart(spotlightItem);
                        alert(`Added spotlight experience: "${spotlightItem.title}" to cart!`);
                      }}
                      className="px-4 py-2 border border-primary text-primary hover:bg-surface-container-low text-xs font-semibold rounded-md transition-all"
                    >
                      Add to Occasion
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(spotlightItem);
                        onNavigate('cart');
                      }}
                      className="px-5 py-2 bg-primary hover:opacity-90 text-on-primary text-xs font-semibold rounded-md transition-all"
                    >
                      Get Tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. Regular Feed Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-xs">
            {otherListings.map((item) => (
              <div key={item.id} id={`feed-item-${item.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                <div>
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container-lowest transition-all shadow-sm">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute top-4 left-4 bg-primary/70 backdrop-blur-md text-on-primary text-[9px] font-mono tracking-widest px-2.5 py-1 rounded">
                      {item.tag || item.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-sm">
                    <div className="flex justify-between items-baseline text-xs font-mono text-outline mb-1">
                      <span>{item.date} • {item.time}</span>
                      <span className="text-primary font-serif font-bold text-base">${item.price}</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-primary line-clamp-1 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-outline truncate mb-1">📍 {item.location}</p>
                    {item.details && <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mt-1">{item.details}</p>}
                  </div>
                </div>

                <div className="px-sm pb-sm pt-xs border-t border-outline-variant/30 flex items-center justify-between gap-xs">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      alert(`Added "${item.title}" to Occasion!`);
                    }}
                    className="w-10 h-10 rounded-md bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-primary hover:border-primary transition-all"
                    title="Add to Occasion Cart"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onNavigate('cart');
                    }}
                    className="flex-1 bg-primary hover:opacity-90 text-on-primary font-sans text-xs font-medium py-2.5 rounded-md text-center transition-colors"
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            ))}

            {filteredListings.length === 0 && (
              <div className="col-span-2 bg-surface-container-low rounded-xl border border-dashed border-outline-variant py-16 text-center text-outline">
                <span className="text-4xl block mb-2">📭</span>
                <p className="font-medium text-sm">No items matching your price and genre limits.</p>
                <button
                  onClick={() => {
                    setPriceRange(500);
                    setSelectedGenre('All');
                  }}
                  className="mt-3 text-xs text-primary underline font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* C. Load More Events Segment */}
          {filteredListings.length > 0 && (
            <div className="flex justify-center mt-xs">
              <button
                onClick={() => alert('Loading more curated listings for Austin...')}
                className="px-6 py-2.5 border border-outline-variant text-on-surface-variant text-xs font-medium rounded-full flex items-center gap-2 hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load More Events</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
