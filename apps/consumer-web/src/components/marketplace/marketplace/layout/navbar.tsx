'use client';

import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { CartItem } from '@/lib/marketplace-types';

interface NavbarProps {
  cart: CartItem[];
  setView: (view: 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events') => void;
  onOpenCart: () => void;
}

export function Navbar({ cart, setView, onOpenCart }: NavbarProps) {

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex cursor-pointer items-center space-x-2.5" onClick={() => setView('home')}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 border border-stone-700 shadow-sm">
                <span className="font-[var(--font-display)] text-lg font-bold text-white tracking-widest">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-stone-900">Planviry</span>
                <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-stone-400 uppercase -mt-1">Milwaukee Directory & Curated Registry</span>
              </div>
            </div>

          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setView('directory')} className="font-sans text-xs font-semibold tracking-wider uppercase text-stone-600 hover:text-stone-950 transition-colors">Explore directory</button>
            <a onClick={() => setView('home')} className="font-sans text-xs font-semibold tracking-wider uppercase text-stone-500 hover:text-stone-950 transition-colors cursor-pointer">Featured Gems</a>
            <button onClick={() => setView('live-events')} className="font-sans text-xs font-semibold tracking-wider uppercase text-stone-500 hover:text-stone-950 transition-colors inline-flex items-center space-x-1">
              <Zap size={12} className="text-red-500" />
              <span>Live Events</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setView('login')} className="hidden sm:inline-flex font-sans text-xs font-semibold tracking-wider uppercase text-stone-600 hover:text-stone-950 transition-colors">
              Log In
            </button>
            <button onClick={() => setView('signup')} className="hidden sm:inline-flex rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm uppercase tracking-wider">
              Sign Up
            </button>
            <button onClick={onOpenCart} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm hover:border-stone-400 hover:text-stone-900 transition" aria-label="Shopping Cart">
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[9px] font-bold text-white ring-2 ring-white">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
