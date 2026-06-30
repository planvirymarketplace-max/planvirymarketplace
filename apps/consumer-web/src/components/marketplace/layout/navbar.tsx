'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { CartItem } from '@/lib/marketplace-types';
import { HamburgerMenu } from './hamburger-menu';
import type { NavSubcategory } from '@/lib/directory-filter-data';
import { useAuth } from '@/hooks/use-auth';

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events';

interface NavbarProps {
  cart: CartItem[];
  setView: (view: ViewName) => void;
  onOpenCart: () => void;
  onNavigateToDirectory: (categoryKey: string, sub?: NavSubcategory) => void;
}

export function Navbar({ cart, setView, onOpenCart, onNavigateToDirectory }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, vendorInfo, signOut } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    setView('home');
  };

  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <div className="flex cursor-pointer items-center space-x-3" onClick={() => setView('home')}>
                <div className="flex h-9 w-9 items-center justify-center bg-ink border border-ink">
                  <span className="font-display text-lg font-bold text-ink-foreground">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-foreground">Planviry</span>
                  <span className="font-utility text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase -mt-0.5">Milwaukee Directory &amp; Curated Registry</span>
                </div>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center space-x-3">
              {/* Cart */}
              <button onClick={onOpenCart} className="relative flex h-10 w-10 items-center justify-center border border-border bg-card text-foreground hover:border-ember/40 hover:text-ember transition-colors" aria-label="Shopping Cart">
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-ember text-ember-foreground font-utility text-[9px] font-bold">{cart.length}</span>
                )}
              </button>

              {/* Auth area */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 h-10 px-3 border border-border bg-card text-foreground hover:border-ember/40 transition-colors"
                    aria-label="Account menu"
                  >
                    <div className="h-6 w-6 bg-ink text-ink-foreground flex items-center justify-center font-utility text-[11px] font-bold">{initials}</div>
                    <ChevronDown size={13} />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-52 bg-card border border-border shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">Signed in as</p>
                        <p className="font-body text-sm text-foreground font-medium truncate">{user.email}</p>
                      </div>
                      {vendorInfo && (
                        <a href="/vendor"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted transition-colors">
                          <LayoutDashboard size={15} />Vendor Dashboard
                        </a>
                      )}
                      <button onClick={() => { setUserDropdownOpen(false); setView('home'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted transition-colors">
                        <User size={15} />My Account
                      </button>
                      <div className="border-t border-border">
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-muted-foreground hover:bg-muted transition-colors">
                          <LogOut size={15} />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setView('login')}
                  className="hidden sm:flex h-10 px-4 items-center border border-border bg-card text-foreground font-utility text-[12px] font-bold uppercase tracking-[0.12em] hover:border-ember/40 transition-colors">
                  Sign In
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center border border-border bg-card text-foreground hover:border-ember/40 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        setView={setView}
        onNavigateToDirectory={onNavigateToDirectory}
      />
    </>
  );
}

