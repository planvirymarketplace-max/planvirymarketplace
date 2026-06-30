'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Music, Building2, Camera, Sparkles, Utensils, Flower2, Flame, MapPin, Scissors, Gem, Bus, Lightbulb, Package, Video, Heart, Award, Cake, Wine, GraduationCap, Headphones, Users, ClipboardCheck, Radio, Volume2, Clapperboard, PartyPopper, type LucideIcon } from 'lucide-react'
import { searchAutocomplete, POPULAR_SEARCHES, type SearchTerm } from '@/lib/seo-data'
import { getCategoryLabel } from '@/lib/types'

// Icon mapping for search term types
const TYPE_ICONS: Record<string, LucideIcon> = {
  category: Search,
  service: Lightbulb,
  location: MapPin,
  event: Sparkles,
  venue: Building2,
  amenity: Flame,
}

// Category-specific icon mapping
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  wedding_venue: Building2,
  wedding_dj: Music,
  wedding_band: Music,
  photography: Camera,
  catering: Utensils,
  florist: Flower2,
  bar_club: Flame,
  makeup_hair: Scissors,
  jeweler: Gem,
  transportation: Bus,
  wedding_planner: Sparkles,
  decor_rentals: PartyPopper,
  photo_booth: Camera,
  videography: Video,
  lighting_av: Lightbulb,
  rentals: Package,
  bakery: Cake,
  officiant: Heart,
  bachelorette_activity: Wine,
  fine_dining: Award,
  restaurant_food: Utensils,
}

function getIconForTerm(term: SearchTerm): LucideIcon {
  return CATEGORY_ICONS[term.category] || TYPE_ICONS[term.type] || Search
}

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (searchTerm: SearchTerm) => void
  onSubmit?: (query: string) => void
  placeholder?: string
  className?: string
  /** Show popular searches when focused but empty */
  showPopular?: boolean
  /** Compact mode for navbar/directory header */
  compact?: boolean
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = 'Search Milwaukee vendors...',
  className = '',
  showPopular = true,
  compact = false,
}: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchTerm[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search - use ref for timer
  useEffect(() => {
    // Clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const timer = setTimeout(() => {
      if (value.trim().length < 2) {
        setResults([])
      } else {
        const matches = searchAutocomplete(value, 8)
        setResults(matches)
      }
    }, 200)
    debounceRef.current = timer

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayResults = results.length > 0
    ? results
    : (showPopular && isFocused && !value.trim() ? POPULAR_SEARCHES.slice(0, 8) : [])

  const showDropdown = isFocused && displayResults.length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const visibleItems = displayResults

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => {
        const next = Math.min(prev + 1, visibleItems.length - 1)
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < visibleItems.length) {
        onSelect(visibleItems[selectedIndex])
        setIsFocused(false)
      } else if (onSubmit && value.trim()) {
        onSubmit(value.trim())
        setIsFocused(false)
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  // When value changes, reset selected index since results will change
  const handleChange = (newValue: string) => {
    setSelectedIndex(-1)
    onChange(newValue)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`relative flex items-center ${compact ? 'rounded-lg' : 'rounded-2xl'} border border-stone-200 bg-white ${compact ? '' : 'p-2'} shadow-sm focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 transition duration-300`}>
        <div className={`pointer-events-none ${compact ? 'pl-2.5' : 'pl-3'} text-stone-400`}>
          <Search className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={`w-full border-0 bg-transparent ${compact ? 'pl-2 pr-2 py-1.5' : 'pl-3 pr-2'} text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-0 ${compact ? 'text-sm' : 'text-xs sm:text-sm'} font-light`}
        />
        {!compact && (
          <span className="hidden sm:inline-flex items-center space-x-1 rounded-xl bg-stone-50 px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 border border-stone-200/60">
            <MapPin size={11} className="text-stone-400" />
            <span>Milwaukee, WI</span>
          </span>
        )}
      </div>

      {showDropdown && (
        <div className={`absolute z-50 left-0 right-0 mt-1 ${compact ? 'rounded-lg' : 'rounded-xl'} border border-stone-200 bg-white shadow-xl overflow-hidden`}>
          {results.length === 0 && showPopular && !value.trim() && (
            <div className="px-3 py-2 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Popular Searches</span>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin' }}>
            {displayResults.map((term, index) => {
              const Icon = getIconForTerm(term)
              const isSelected = index === selectedIndex
              return (
                <button
                  key={term.slug}
                  onClick={() => {
                    onSelect(term)
                    setIsFocused(false)
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-stone-50' : 'hover:bg-stone-50'
                  }`}
                >
                  <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg ${isSelected ? 'bg-stone-200' : 'bg-stone-100'}`}>
                    <Icon className="h-3.5 w-3.5 text-stone-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium text-stone-900 truncate ${compact ? 'text-xs' : ''}`}>
                      {term.searchQuery || term.term}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {getCategoryLabel(term.category)} · {term.type}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
