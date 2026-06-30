'use client'

import { Search, Calendar, Users, ArrowRight, Heart, Globe, Mail, Phone, PlaySquare } from 'lucide-react';
import { IMAGES } from '@/data/prototype-data';
import { CartItem } from '@/lib/prototype-types';

interface LandingViewProps {
  onNavigate: (screen: string) => void;
  onSelectCategory: (category: any) => void;
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export default function LandingView({
  onNavigate,
  onSelectCategory,
  onAddToCart,
  cartItems,
}: LandingViewProps) {
  const categories = [
    { name: 'Eco-Luxury Retreats', image: IMAGES.luxuryPool, tag: 'IMMERSIVE', cat: 'travel' },
    { name: 'Gastronomy', image: IMAGES.gastronomy, tag: 'CURATED', cat: 'food-drink' },
    { name: 'Private Travel', image: IMAGES.yacht, tag: 'EXCLUSIVE', cat: 'travel' },
    { name: 'Live Events', image: IMAGES.concertLarge, tag: 'FEATURED', cat: 'live-shows' },
  ];

  const recommendations: CartItem[] = [
    {
      id: 'travel-1',
      title: 'Alpine Sanctuary',
      category: 'travel',
      price: 450,
      date: 'Flexible',
      time: 'Check-in 3PM',
      location: 'Swiss Alps, Switzerland',
      image: IMAGES.swissAlps,
      badge: 'New',
    },
    {
      id: 'travel-2',
      title: 'Desert Oasis Villa',
      category: 'travel',
      price: 320,
      date: 'Flexible',
      time: 'Check-in 4PM',
      location: 'Joshua Tree, USA',
      image: IMAGES.desertOasis,
      badge: 'Popular',
    },
    {
      id: 'todo-1',
      title: 'Coastal Cave Tour',
      category: 'things-to-do',
      price: 120,
      date: 'Daily',
      time: '9:00 AM',
      location: 'Algarve, Portugal',
      image: IMAGES.coastalCave,
      badge: 'Featured',
    },
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-background text-on-background pb-xl pl-16 md:pl-20">
      {/* 1. Header Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest py-sm px-sm md:px-md flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-serif font-bold text-2xl tracking-tight text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
            Planviry
          </span>
          <nav className="hidden md:flex items-center gap-md">
            <button onClick={() => onNavigate('landing')} className="text-utility-sm text-primary border-b-2 border-primary pb-1">
              Discover
            </button>
            <button onClick={() => { onNavigate('feed'); onSelectCategory('live-shows'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Concierge
            </button>
            <button onClick={() => onNavigate('discover')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Impact
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-sm">
          <button
            onClick={() => onNavigate('feed')}
            className="hidden sm:inline-block px-sm py-2 text-label-caps bg-surface-container-lowest border border-primary hover:bg-surface-container-low transition-all rounded-full"
          >
            Download App
          </button>
          <button className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors px-2 py-1">
            Sign In
          </button>
          <button onClick={() => onNavigate('cart')} className="relative p-2 text-on-surface-variant hover:text-primary transition-all">
            <span className="text-lg">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg md:py-xl max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-sm">
          <h1 className="text-display-xl text-primary leading-none">
            ORCHESTRATE <br />YOUR <span className="italic font-normal">PERFECT</span> OCCASION
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            We have the largest selection of unique experiences. Try our quick orchestration tools for any request. 24-hour support is always happy to assist.
          </p>
          <div className="flex flex-wrap items-center gap-sm mt-xs">
            <button
              onClick={() => onNavigate('feed')}
              className="px-md py-3 bg-primary text-on-primary text-utility-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            >
              Get Started
            </button>
            <div className="flex items-center gap-xs text-xs text-outline font-mono">
              <span>Available on</span>
              <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant transition-all">
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant transition-all">
                <PlaySquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mock Mobile device */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-[300px] h-[600px] bg-surface-container-lowest rounded-xl shadow-2xl border-8 border-primary overflow-hidden flex flex-col">
            {/* Speaker & Camera bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-primary rounded-b-lg z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-surface-tint rounded-full" />
            </div>

            {/* In-app Screen Content */}
            <div className="flex-1 bg-surface pt-lg px-sm pb-sm flex flex-col h-full">
              {/* Internal Nav */}
              <div className="flex items-center justify-between mb-sm">
                <span className="font-serif font-bold text-primary">My Trips</span>
                <span className="text-outline text-xs">•••</span>
              </div>

              {/* Internal Tabs */}
              <div className="flex border-b border-outline-variant text-[10px] font-bold tracking-wider mb-sm">
                <button className="flex-1 text-primary border-b-2 border-primary pb-2 text-center">UPCOMING</button>
                <button className="flex-1 text-outline pb-2 text-center">WISHLIST</button>
                <button className="flex-1 text-outline pb-2 text-center">VIEWED</button>
              </div>

              {/* Internal Trip Notification Card */}
              <div className="bg-tertiary-fixed border border-tertiary-fixed-dim rounded-md p-xs mb-sm text-[11px] text-on-tertiary-fixed leading-normal">
                <p className="font-bold mb-1">Tip for your trip</p>
                <p className="text-on-tertiary-fixed-variant">Make copies of documents. Keep extra copies of your passport and important docs in your luggage.</p>
              </div>

              {/* Internal Bali Card */}
              <div className="bg-surface-container-lowest rounded-md border border-outline-variant shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.luxuryPool})` }} />
                <div className="p-xs flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-primary">Exotic Bali</h4>
                    {/* Friends stack */}
                    <div className="flex items-center gap-xs mt-xs">
                      <div className="flex -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-secondary-fixed border border-surface-container-lowest" />
                        <div className="w-4 h-4 rounded-full bg-tertiary-fixed border border-surface-container-lowest" />
                        <div className="w-4 h-4 rounded-full bg-primary-fixed border border-surface-container-lowest" />
                      </div>
                      <span className="text-[9px] text-outline font-mono">+10 friends been there</span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-xs flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate">The Bali Dream Villa & Resort</span>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('feed')} className="w-full bg-primary hover:bg-primary-container text-on-primary font-sans text-xs py-2 rounded-md mt-xs transition-colors">
                    Explore
                  </button>
                </div>
              </div>

              {/* Internal Tabbar */}
              <div className="flex justify-around items-center pt-xs border-t border-outline-variant text-outline text-xs mt-sm">
                <span>🏠</span>
                <span>📅</span>
                <span>🗑️</span>
                <span>👤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Plan Bar Search Control */}
      <section className="px-margin-mobile md:px-margin-desktop mx-auto max-w-7xl -mt-6 relative z-30">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg p-sm grid grid-cols-1 md:grid-cols-4 gap-xs items-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          <div className="flex items-center gap-xs px-xs py-1 text-utility-sm">
            <Search className="w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Where are you going?"
              defaultValue="Austin, TX"
              className="bg-transparent border-none outline-none text-on-surface placeholder-outline w-full"
            />
          </div>
          <div className="flex items-center gap-xs px-xs py-1 text-utility-sm">
            <Calendar className="w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Add dates"
              defaultValue="Oct 24 - Oct 27"
              className="bg-transparent border-none outline-none text-on-surface placeholder-outline w-full"
            />
          </div>
          <div className="flex items-center gap-xs px-xs py-1 text-utility-sm">
            <Users className="w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Add guests"
              defaultValue="4 Guests"
              className="bg-transparent border-none outline-none text-on-surface placeholder-outline w-full"
            />
          </div>
          <div className="px-xs py-1 flex items-center justify-end">
            <button
              onClick={() => onNavigate('feed')}
              className="w-full bg-primary hover:opacity-95 text-on-primary text-utility-sm py-2.5 px-md rounded-md transition-all text-center font-semibold"
            >
              Search Now
            </button>
          </div>
        </div>
      </section>

      {/* 4. Browse by Category Mosaic Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-sm">
          <div>
            <span className="text-label-caps text-secondary block mb-1">COLLECTIONS</span>
            <h2 className="text-headline-lg text-primary">Browse by Category</h2>
          </div>
          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-1.5 text-utility-sm font-semibold hover:underline text-primary cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter min-h-[480px]">
          {/* Card 1: Large Immersive Landscape (Left Column, spanned 7) */}
          <div
            onClick={() => { onNavigate('feed'); onSelectCategory('travel'); }}
            className="md:col-span-7 bg-surface-container-lowest rounded-xl overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${categories[0].image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] px-2.5 py-1 rounded-full">
              {categories[0].tag}
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                {categories[0].name}
              </h3>
            </div>
          </div>

          {/* Right Column: Split of items (Spanned 5 total) */}
          <div className="md:col-span-5 flex flex-col gap-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-sm flex-1">
              {/* Gastronomy Item */}
              <div
                onClick={() => { onNavigate('feed'); onSelectCategory('food-drink'); }}
                className="bg-surface-container-lowest rounded-xl overflow-hidden relative cursor-pointer group h-[140px] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${categories[1].image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-primary-container/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-serif text-lg font-bold">{categories[1].name}</h4>
                </div>
              </div>

              {/* Private Travel Item */}
              <div
                onClick={() => { onNavigate('feed'); onSelectCategory('travel'); }}
                className="bg-surface-container-lowest rounded-xl overflow-hidden relative cursor-pointer group h-[140px] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${categories[2].image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-primary-container/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-serif text-lg font-bold">{categories[2].name}</h4>
                </div>
              </div>
            </div>

            {/* Live Events (Tall layout overlaying the others) */}
            <div
              onClick={() => { onNavigate('feed'); onSelectCategory('live-shows'); }}
              className="bg-surface-container-lowest rounded-xl overflow-hidden relative cursor-pointer group h-[160px] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${categories[3].image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-serif text-xl font-bold">{categories[3].name}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recommended For You Cards */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto bg-surface-container border-y border-outline-variant/30">
        <div className="mb-sm">
          <span className="text-label-caps text-secondary block mb-1">TAILORED SELECTION</span>
          <h2 className="text-headline-lg text-primary">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container-lowest transition-all shadow-sm">
                  <Heart className="w-4 h-4" />
                </button>
                {item.badge && (
                  <span className="absolute top-4 left-4 bg-surface-container-lowest text-on-surface text-label-caps px-3 py-1 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="p-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-outline text-xs font-mono mb-sm">📍 {item.location}</p>
                </div>

                <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30">
                  <div>
                    <span className="font-serif font-bold text-lg text-primary">${item.price}</span>
                    <span className="text-on-surface-variant text-xs"> / night</span>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      alert(`Added ${item.title} to your Unified Occasion Cart!`);
                    }}
                    className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary hover:border-primary transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Stay Inspired Newsletter */}
      <section className="px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto">
        <div className="bg-secondary-container rounded-xl p-md md:p-lg flex flex-col items-center text-center max-w-4xl mx-auto shadow-sm border border-outline-variant/20">
          <h2 className="text-headline-lg text-primary mb-2">Stay Inspired</h2>
          <p className="text-on-secondary-container text-body-md max-w-xl mb-md">
            Join our exclusive concierge list for weekly curated experiences and travel insights tailored for orchestrating the perfect life.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Successfully joined Planviry Concierge circle!"); }} className="w-full max-w-md flex flex-col sm:flex-row gap-xs">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-surface-container-lowest text-on-surface rounded-md border border-outline-variant outline-none text-utility-sm placeholder-outline shadow-sm focus:border-primary"
            />
            <button
              type="submit"
              className="px-md py-3 bg-primary text-on-primary text-label-caps rounded-md hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest pt-lg pb-sm px-margin-mobile md:px-margin-desktop mt-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-md mb-md">
          {/* Column 1 */}
          <div className="flex flex-col gap-xs">
            <span className="font-serif font-bold text-3xl text-primary">Planviry</span>
            <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs">
              Crafting meaningful connections through orchestrated experiences. Luxury travel, shows, and local listings in one single cart.
            </p>
            <div className="flex items-center gap-xs mt-1">
              <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">
                <Globe className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h5 className="text-label-caps text-secondary mb-xs">PLATFORM</h5>
            <ul className="flex flex-col gap-xs text-xs text-on-surface-variant">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-primary">Discover</button></li>
              <li><button onClick={() => onNavigate('discover')} className="hover:text-primary">Impact</button></li>
              <li><button onClick={() => onNavigate('cart')} className="hover:text-primary">Vendor Portal</button></li>
              <li><button className="hover:text-primary">Careers</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h5 className="text-label-caps text-secondary mb-xs">SUPPORT</h5>
            <ul className="flex flex-col gap-xs text-xs text-on-surface-variant">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary">Legal Notice</a></li>
              <li><a href="#" className="hover:text-primary">API Status</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h5 className="text-label-caps text-secondary mb-xs">MOCK PRESET NAVIGATION</h5>
            <div className="flex flex-wrap gap-xs">
              <button onClick={() => onNavigate('discover')} className="px-xs py-1 bg-surface-container-low border border-outline-variant text-on-surface-variant text-[10px] rounded hover:bg-surface-container-high">Live Shows</button>
              <button onClick={() => onNavigate('feed')} className="px-xs py-1 bg-surface-container-low border border-outline-variant text-on-surface-variant text-[10px] rounded hover:bg-surface-container-high">In-Place Feed</button>
              <button onClick={() => onNavigate('cart')} className="px-xs py-1 bg-surface-container-low border border-outline-variant text-on-surface-variant text-[10px] rounded hover:bg-surface-container-high">Nashville Cart</button>
              <button onClick={() => onNavigate('itinerary')} className="px-xs py-1 bg-surface-container-low border border-outline-variant text-on-surface-variant text-[10px] rounded hover:bg-surface-container-high">Savannah Timeline</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-sm border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between text-[11px] text-outline">
          <span>© 2026 Planviry Orchestration. All rights reserved. Built for US markets.</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-4 md:mt-0 px-3 py-1 bg-surface-container-low border border-outline-variant hover:bg-surface-container-high text-on-surface-variant rounded flex items-center gap-1 transition-all"
          >
            <span>Back to top</span>
            <span>▲</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
