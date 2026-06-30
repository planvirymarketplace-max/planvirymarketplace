'use client'

import { Search, ArrowRight, SlidersHorizontal, Sparkles, MapPin, Flame, Star } from 'lucide-react';
import { IMAGES, LENS_ITEMS } from '@/data/prototype-data';
import { CartItem } from '@/lib/prototype-types';

interface DiscoverViewProps {
  onNavigate: (screen: string) => void;
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export default function DiscoverView({
  onNavigate,
  onAddToCart,
  cartItems,
}: DiscoverViewProps) {
  // Pull live shows
  const showsNearYou = LENS_ITEMS.filter((item) => item.category === 'live-shows').slice(0, 3);

  return (
    <div id="discover-page" className="min-h-screen bg-background text-on-background pb-xl pl-16 md:pl-20">
      {/* 1. Header Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest py-sm px-sm md:px-md flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-serif font-bold text-2xl tracking-tight text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
            Planviry
          </span>
          <nav className="hidden md:flex items-center gap-md">
            <button onClick={() => onNavigate('landing')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Discover
            </button>
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Concierge
            </button>
            <button onClick={() => onNavigate('discover')} className="text-utility-sm text-primary border-b-2 border-primary pb-1">
              Impact
            </button>
          </nav>
        </div>

        {/* Search input in the middle */}
        <div className="hidden lg:flex items-center gap-xs bg-surface-container border border-outline-variant rounded-full py-1.5 px-4 w-72">
          <Search className="w-3.5 h-3.5 text-outline" />
          <input
            type="text"
            placeholder="Search experiences..."
            className="bg-transparent border-none outline-none text-xs text-on-surface w-full"
          />
        </div>

        <div className="flex items-center gap-sm">
          <button onClick={() => onNavigate('feed')} className="hidden sm:inline-block px-sm py-2 text-label-caps bg-primary hover:opacity-90 text-on-primary transition-all rounded-full">
            Download App
          </button>
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

      {/* 2. Hero Section: "LIVE & UNFILTERED" */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg md:py-xl max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-7 flex flex-col items-start gap-sm">
          <span className="text-label-caps bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
            Trending Now
          </span>
          <h1 className="text-display-xl text-primary leading-none uppercase">
            LIVE &<br />UNFILTERED.
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            Experience the energy of the world's most exclusive performances. From underground jazz to stadium anthems, curated for your next occasion.
          </p>
          <div className="flex flex-wrap items-center gap-sm mt-xs">
            <button
              onClick={() => onNavigate('feed')}
              className="px-md py-3 bg-primary text-on-primary text-utility-sm font-semibold rounded-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-xs"
            >
              <span>Explore Full Lineup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { onNavigate('feed'); }}
              className="px-md py-3 border border-outline-variant text-primary text-utility-sm font-semibold rounded-md hover:bg-surface-container-low transition-all"
            >
              View Map
            </button>
          </div>
        </div>

        {/* Featured Show Card on the Right */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[360px] h-[400px] rounded-xl overflow-hidden shadow-xl group border border-outline-variant">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${IMAGES.indigoGirlsStage})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[9px] font-mono tracking-widest text-secondary-container uppercase block mb-1">Featured Show</span>
              <h3 className="font-serif text-xl font-bold mb-1">The Midnight Session</h3>
              <p className="text-xs text-on-primary/80 font-mono">📍 Secret Location, London</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discover Genres Mosaic Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto border-t border-outline-variant/30">
        <div className="flex items-baseline justify-between mb-sm">
          <h2 className="text-headline-lg text-primary">Discover Genres</h2>
          <button onClick={() => onNavigate('feed')} className="text-utility-sm font-semibold text-primary hover:underline underline-offset-4">
            See All Categories
          </button>
        </div>

        {/* Custom Styled Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Card 1: Opera & Theatre (Tall layout - 4 cols) */}
          <div
            onClick={() => onNavigate('feed')}
            className="md:col-span-4 h-[340px] rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/25"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${IMAGES.operaTheater})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-serif text-2xl font-bold mb-1">Opera & Theatre</h3>
              <p className="text-xs text-on-primary/70">Classical grandeur and stagecraft.</p>
            </div>
          </div>

          {/* Right Area: Split into two horizontal grid lanes */}
          <div className="md:col-span-8 flex flex-col gap-sm">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-sm">
              {/* Indie & Jazz (Lavender background - 9 cols) */}
              <div
                onClick={() => onNavigate('feed')}
                className="sm:col-span-9 h-[160px] bg-secondary-container rounded-xl p-sm flex flex-col justify-between cursor-pointer group hover:opacity-95 transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest/40 flex items-center justify-center text-primary">
                    <span>💿</span>
                  </div>
                  <span className="text-[10px] font-mono text-on-secondary-container tracking-wider font-semibold">24 Events Today</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-primary">Indie & Jazz</h3>
              </div>

              {/* VIP Access (Peach background - 3 cols) */}
              <div
                onClick={() => onNavigate('feed')}
                className="sm:col-span-3 h-[160px] bg-tertiary-fixed rounded-xl p-sm flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-95 transition-all"
              >
                <Star className="w-6 h-6 text-on-tertiary-fixed fill-on-tertiary-fixed mb-2" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-tertiary-fixed">VIP Access</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-sm">
              {/* Festivals (Yellow background - 4 cols) */}
              <div
                onClick={() => onNavigate('feed')}
                className="sm:col-span-4 h-[156px] bg-primary-fixed rounded-xl p-sm flex flex-col justify-between cursor-pointer hover:opacity-95 transition-all"
              >
                <span className="text-[9px] font-mono text-on-primary-fixed bg-surface-container-lowest/50 px-2 py-0.5 rounded self-start">New</span>
                <h4 className="font-serif text-lg font-bold text-on-primary-fixed">Festivals</h4>
              </div>

              {/* Rock & Pop (Image backdrop - 8 cols) */}
              <div
                onClick={() => onNavigate('feed')}
                className="sm:col-span-8 h-[156px] rounded-xl overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/25"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${IMAGES.lasersStage})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">Rock & Pop</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Shows Near You Feed list */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-xs mb-sm">
          <div>
            <span className="text-label-caps text-secondary block mb-1">Current Selection</span>
            <h2 className="text-headline-lg text-primary">Live Shows Near You</h2>
          </div>
          <div className="flex items-center gap-xs">
            <button onClick={() => onNavigate('feed')} className="px-4 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-primary text-utility-sm rounded-full transition-all flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filter</span>
            </button>
            <button onClick={() => onNavigate('feed')} className="px-4 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-primary text-utility-sm rounded-full transition-all">
              Sort by Date
            </button>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {showsNearYou.map((show) => (
            <div key={show.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              <div className="h-56 relative overflow-hidden">
                <img
                  src={show.image}
                  alt={show.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {show.tag && (
                  <span className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-on-primary text-[9px] font-mono tracking-widest px-2.5 py-1 rounded">
                    {show.tag}
                  </span>
                )}
                {show.badge && (
                  <span className="absolute top-4 left-24 bg-error text-on-error text-[9px] font-mono tracking-widest px-2.5 py-1 rounded flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-on-error" />
                    <span>{show.badge}</span>
                  </span>
                )}
              </div>

              <div className="p-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-on-surface-variant text-xs font-mono mb-sm flex items-center justify-between">
                    <span>📅 {show.date} • {show.time}</span>
                    <span className="font-serif text-primary font-bold text-lg">${show.price}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-xs line-clamp-1 group-hover:text-secondary transition-all">
                    {show.title}
                  </h3>
                  <div className="text-xs text-outline flex items-center gap-1 mb-sm">
                    <MapPin className="w-3 h-3 text-outline shrink-0" />
                    <span className="truncate">{show.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(show);
                    alert(`Added "${show.title}" ticket package to your Occasion Cart!`);
                  }}
                  className="w-full bg-primary hover:opacity-95 text-on-primary text-utility-sm py-3 rounded-md flex items-center justify-center gap-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add to Occasion</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Immersive Newsletter block: "NEVER MISS THE BEAT." */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto">
        <div className="bg-tertiary-container rounded-xl p-sm md:p-md text-on-tertiary grid grid-cols-1 lg:grid-cols-12 gap-sm items-center overflow-hidden border border-outline-variant/20 shadow-xl">
          <div className="lg:col-span-7 flex flex-col items-start gap-xs">
            <h2 className="text-headline-lg text-on-tertiary uppercase leading-tight">
              NEVER MISS THE BEAT.
            </h2>
            <p className="text-on-tertiary-container text-body-md max-w-lg">
              Join the inner circle for early access to tickets, back-stage passes, and curated lists of the most anticipated shows globally.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for joining the beat circle!"); }} className="w-full max-w-md flex flex-col sm:flex-row gap-xs mt-sm">
              <input
                type="email"
                required
                placeholder="Email address"
                className="flex-1 px-4 py-3 bg-surface-container-lowest/15 text-white rounded-md border border-outline-variant outline-none text-utility-sm placeholder-outline focus:bg-surface-container-lowest/25"
              />
              <button type="submit" className="px-md py-3 bg-surface-container-lowest text-primary font-bold text-label-caps rounded-md hover:bg-surface-container-low transition-colors">
                Join Now
              </button>
            </form>
          </div>

          {/* Right Column decoration image of phone (mock hand device) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-56 rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 group">
              <img
                src={IMAGES.mobilePhone}
                alt="Mobile preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container/80 to-transparent" />
              <div className="absolute bottom-4 left-4 text-xs font-mono text-tertiary-fixed">
                <span>⚡ Experience Planviry Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
