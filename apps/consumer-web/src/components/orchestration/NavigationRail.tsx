'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  Calendar,
  Compass,
  Utensils,
  Music,
  Plane,
  Sparkles,
  Building,
  Store,
} from 'lucide-react'
import { CategoryLens } from '@/lib/prototype-types'

interface NavigationRailProps {
  activeCategory: CategoryLens | null
  onCategorySelect: (category: CategoryLens) => void
  activeScreen: string
  onScreenChange: (screen: string) => void
}

export default function NavigationRail({
  activeCategory,
  onCategorySelect,
  activeScreen,
  onScreenChange,
}: NavigationRailProps) {
  const items: { category: CategoryLens; label: string; icon: React.ComponentType<any> }[] = [
    { category: 'services', label: 'Services', icon: Briefcase },
    { category: 'plan', label: 'Plan', icon: Calendar },
    { category: 'things-to-do', label: 'Things to Do', icon: Compass },
    { category: 'food-drink', label: 'Food & Drink', icon: Utensils },
    { category: 'live-shows', label: 'Live Shows', icon: Music },
    { category: 'travel', label: 'Travel', icon: Plane },
    { category: 'party', label: 'Party', icon: Sparkles },
    { category: 'spaces', label: 'Spaces', icon: Building },
    { category: 'vendors', label: 'Vendors', icon: Store },
  ];

  const handleItemClick = (category: CategoryLens) => {
    onCategorySelect(category);
    // If we're not on the search feed screen, navigate there
    if (activeScreen !== 'feed') {
      onScreenChange('feed');
    }
  };

  return (
    <div
      id="nav-rail"
      className="fixed left-0 top-0 bottom-0 w-16 md:w-20 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col items-center py-6 z-40 shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
    >
      {/* Brand Icon or Spacing */}
      <div className="mb-8 cursor-pointer group" onClick={() => onScreenChange('landing')}>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-serif font-bold text-lg transition-transform duration-300 group-hover:scale-105">
          P
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col justify-center gap-4 w-full px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === 'feed' && activeCategory === item.category;

          return (
            <button
              key={item.category}
              id={`nav-rail-item-${item.category}`}
              onClick={() => handleItemClick(item.category)}
              className={`relative group w-full py-3 flex flex-col items-center justify-center rounded-md transition-all duration-300 ${
                isActive
                  ? 'bg-secondary-container text-primary font-semibold'
                  : 'text-outline hover:text-primary hover:bg-surface-container-low'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[9px] font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center max-w-full truncate px-1">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
