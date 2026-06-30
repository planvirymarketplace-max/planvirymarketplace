'use client'

import { Share2, ShieldCheck, Trash2, Calendar, MapPin, Users, Info } from 'lucide-react';
import { CartItem } from '@/lib/prototype-types';

interface CartViewProps {
  onNavigate: (screen: string) => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onBookOccasion: () => void;
}

export default function CartView({
  onNavigate,
  cartItems,
  onRemoveItem,
  onBookOccasion,
}: CartViewProps) {
  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const taxesAndFees = subtotal > 0 ? Number((subtotal * 0.088).toFixed(2)) : 0;
  const total = subtotal + taxesAndFees;

  const handleShare = () => {
    alert("Shareable group planning link copied to clipboard!\nSend this to your group to split payments.");
  };

  return (
    <div id="cart-page" className="min-h-screen bg-background text-on-background pb-xl pl-16 md:pl-20">
      {/* 1. Header Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest py-sm px-sm md:px-md flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-serif font-bold text-2xl tracking-tight text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
            Planviry
          </span>
          <nav className="hidden md:flex items-center gap-md">
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Services
            </button>
            <button onClick={() => onNavigate('itinerary')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Plan
            </button>
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Vendors
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

      {/* 2. Page Title Block */}
      <section className="px-sm md:px-md py-sm max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-sm">
        <div>
          <span className="text-label-caps text-secondary block mb-1">
            UNIFIED OCCASION CART
          </span>
          <h1 className="text-headline-lg text-primary leading-tight">
            Sam's 30th Birthday in Nashville
          </h1>
          <div className="flex flex-wrap items-center gap-sm text-xs text-on-surface-variant mt-2 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-outline" />
              <span>October 14–16, 2024</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-outline" />
              <span>Nashville, TN</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-xs px-md py-2 border border-primary text-primary hover:bg-surface-container-low text-utility-sm font-semibold rounded-full transition-all self-start md:self-auto"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Plan</span>
        </button>
      </section>

      {/* 3. Main content grid */}
      <section className="px-sm md:px-md max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (8 cols): Itemized cart list */}
        <div className="lg:col-span-8 flex flex-col gap-sm">
          {cartItems.map((item) => {
            // Label based on category
            let categoryLabel = 'LODGING';
            let categoryBg = 'bg-primary text-on-primary';
            if (item.category === 'live-shows') {
              categoryLabel = 'LIVE SHOW';
              categoryBg = 'bg-secondary-container text-on-secondary-container border border-primary';
            } else if (item.category === 'vendors') {
              categoryLabel = 'VENDOR';
              categoryBg = 'bg-tertiary-fixed text-on-tertiary-fixed';
            } else if (item.category === 'spaces') {
              categoryLabel = 'SPACE';
              categoryBg = 'bg-primary-fixed text-on-primary-fixed';
            } else if (item.category === 'things-to-do') {
              categoryLabel = 'ACTIVITY';
              categoryBg = 'bg-surface-container-high text-primary';
            }

            return (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-sm md:p-md shadow-sm grid grid-cols-1 md:grid-cols-12 gap-sm items-center relative group hover:shadow-md transition-all duration-300"
              >
                {/* Image panel (4 cols) */}
                <div className="md:col-span-4 h-36 rounded-md overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded font-bold ${categoryBg}`}>
                    {categoryLabel}
                  </span>
                </div>

                {/* Details panel (8 cols) */}
                <div className="md:col-span-8 flex flex-col justify-between h-full py-1">
                  <div>
                    <div className="flex justify-between items-start gap-sm">
                      <h3 className="font-serif text-xl font-bold text-primary hover:text-secondary transition-colors">
                        {item.title}
                      </h3>
                      <span className="font-serif font-bold text-xl text-primary shrink-0">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-md mt-1">
                      {item.time || item.details || 'Standard custom service selection.'}
                    </p>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-[11px] text-on-tertiary-fixed font-mono mt-2">
                        <span>★</span>
                        <span className="font-bold">{item.rating}</span>
                        <span className="text-outline">({item.reviews || 'No'} reviews)</span>
                      </div>
                    )}
                    {item.badge && (
                      <span className="inline-block bg-surface-container-low text-on-surface-variant font-mono text-[9px] px-2 py-0.5 rounded border border-outline-variant/30 mt-2">
                        ✓ {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Remove and actions bottom bar */}
                  <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30 mt-sm">
                    <span className="text-[10px] text-outline font-mono">📍 {item.location}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs font-semibold text-error hover:text-error/80 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {cartItems.length === 0 && (
            <div className="bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant py-16 text-center text-outline px-6">
              <span className="text-5xl block mb-3">🛒</span>
              <h3 className="font-serif text-xl font-bold text-on-surface-variant mb-1">Your Occasion Cart is empty</h3>
              <p className="text-xs text-outline max-w-sm mx-auto mb-6">
                Start adding luxury hotels, concert tickets, rooftop spaces, and photographers to build your unified party.
              </p>
              <button
                onClick={() => onNavigate('feed')}
                className="px-md py-2.5 bg-primary hover:opacity-90 text-on-primary text-utility-sm font-semibold rounded-md"
              >
                Browse Experiences
              </button>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Order Summary sidebar card */}
        <div className="lg:col-span-4 flex flex-col gap-sm">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-sm md:p-md shadow-sm flex flex-col gap-sm">
            <h3 className="font-serif text-2xl font-bold text-primary">Order Summary</h3>

            {/* Calculations lines */}
            <div className="flex flex-col gap-2.5 text-xs text-on-surface-variant border-b border-outline-variant/30 pb-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-on-surface font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span className="font-mono text-on-surface font-semibold">${taxesAndFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="font-mono text-secondary font-bold uppercase tracking-wider">Free</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline py-1">
              <span className="font-serif font-bold text-lg text-primary">Total</span>
              <span className="font-serif font-bold text-3xl text-primary">
                ${total.toLocaleString()}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5 mt-sm">
              <button
                onClick={onBookOccasion}
                disabled={cartItems.length === 0}
                className={`w-full text-center text-xs font-semibold py-4 rounded-md shadow-sm transition-all uppercase font-mono tracking-widest cursor-pointer ${
                  cartItems.length === 0
                    ? 'bg-surface-container-low text-outline cursor-not-allowed border border-outline-variant/30'
                    : 'bg-primary hover:opacity-90 text-on-primary'
                }`}
              >
                Book Occasion
              </button>
              <button
                onClick={handleShare}
                className="w-full bg-surface-container-lowest hover:bg-surface-container-low text-primary border border-primary text-xs font-semibold py-4 rounded-md flex items-center justify-center gap-xs transition-all font-mono uppercase tracking-widest"
              >
                <Users className="w-4 h-4" />
                <span>Split with Group</span>
              </button>
            </div>

            <p className="text-[10px] text-outline text-center leading-normal">
              By booking, you agree to the Planviry Terms of Service and Cancellation Policies.
            </p>
          </div>

          {/* Secure details tags */}
          <div className="flex flex-col gap-sm text-xs text-on-surface-variant px-1">
            <div className="flex gap-xs items-start">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-on-surface">Secure Checkout</p>
                <p className="text-on-surface-variant text-[11px] leading-normal mt-0.5">Your payment information is encrypted and protected with enterprise-grade SSL.</p>
              </div>
            </div>

            <div className="flex gap-xs items-start">
              <Info className="w-5 h-5 text-on-secondary-container shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-on-surface">24/7 Concierge Support</p>
                <p className="text-on-surface-variant text-[11px] leading-normal mt-0.5">Our world-class luxury team is here to assist you with flight delays, custom additions, or vendor swaps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
