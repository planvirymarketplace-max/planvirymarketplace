'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, Star, X, SlidersHorizontal, ArrowRight, Sparkles } from 'lucide-react';
import VendorCard from '@/components/VendorCard';
import { LocationSearchBar } from '@/components/location-search-bar';
import {
  canonicalizeCategory,
  getCategoryLabel,
  CANONICAL_CATEGORIES,
  SUB_CATEGORIES,
} from '@/lib/routes';
import { getMockVendors } from '@/data/mock-vendors';
import { eventTypes, taxonomy } from '@/data/taxonomy';

type SortOption = 'featured' | 'rating' | 'price-low' | 'price-high' | 'reviews';

interface BookDirectoryClientProps {
  slug?: string[];
}

export default function BookDirectoryClient({ slug }: BookDirectoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugSegments = slug;

  // Read ALL possible param names from incoming links
  const rawCat = searchParams.get('cat') || searchParams.get('category') || '';
  const serviceParam = searchParams.get('service') || '';
  const typeParam = searchParams.get('type') || '';
  const subParam = searchParams.get('sub') || '';
  const rawLoc = searchParams.get('loc') || searchParams.get('location') || searchParams.get('city') || '';
  const queryParam = searchParams.get('q') || '';
  const servicesParam = searchParams.get('services') || '';

  // Determine category: slug path takes priority, then URL params
  const slugCategory = slugSegments?.[0] ? canonicalizeCategory(slugSegments[0]) : '';
  const currentCategory = slugCategory || canonicalizeCategory(rawCat) || '';
  const currentQuery = queryParam || serviceParam;
  const currentLocation = rawLoc;

  // Build event context title from slug segments
  const eventContext = slugSegments && slugSegments.length > 1
    ? slugSegments.slice(1).map(s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(' - ')
    : '';

  // Local filter state
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(subParam);
  const [selectedServiceArea, setSelectedServiceArea] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showInstantBooking, setShowInstantBooking] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get sub-categories for the current category
  const subCategories = useMemo(() => {
    if (currentCategory && SUB_CATEGORIES[currentCategory]) {
      return SUB_CATEGORIES[currentCategory];
    }
    return [];
  }, [currentCategory]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let results = getMockVendors().filter(vendor => {
      // Category filter
      if (currentCategory && vendor.category !== currentCategory) return false;

      // Sub-category filter
      if (selectedSubCategory && vendor.subCategory !== selectedSubCategory) return false;

      // Text search filter
      if (currentQuery) {
        const q = currentQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(q);
        const matchesCategory = vendor.categoryName.toLowerCase().includes(q);
        const matchesSubCategory = vendor.subCategory.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesSubCategory) return false;
      }

      // Service area filter
      if (selectedServiceArea && !vendor.location.toLowerCase().includes(selectedServiceArea.toLowerCase())) return false;

      // Rating filter
      if (minRating > 0 && vendor.rating < minRating) return false;

      // Instant booking filter
      if (showInstantBooking && !vendor.instant) return false;

      // Verified filter (featured = verified for mock data)
      if (showVerified && !vendor.featured) return false;

      return true;
    });

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'price-low': return extractPrice(a.price) - extractPrice(b.price);
        case 'price-high': return extractPrice(b.price) - extractPrice(a.price);
        case 'reviews': return b.reviews - a.reviews;
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

    return results;
  }, [currentCategory, currentQuery, selectedSubCategory, selectedServiceArea, minRating, showInstantBooking, showVerified, sortBy]);

  // Handle category change - update URL
  const handleCategoryChange = useCallback((val: string) => {
    const sp = new URLSearchParams();
    if (val) sp.set('cat', val);
    if (currentLocation) sp.set('loc', currentLocation);
    if (currentQuery) sp.set('q', currentQuery);
    const qs = sp.toString();
    router.push(qs ? `/book?${qs}` : '/book');
  }, [router, currentLocation, currentQuery]);

  // Handle sub-category click
  const handleSubCategoryClick = useCallback((sub: string) => {
    setSelectedSubCategory(prev => prev === sub ? '' : sub);
  }, []);

  // Handle search from LocationSearchBar
  const handleSearch = useCallback((serviceSlug: string, locationSlug: string | null) => {
    if (locationSlug) {
      router.push(`/seo/${serviceSlug}/${locationSlug}`);
    } else {
      router.push(`/seo/${serviceSlug}`);
    }
  }, [router]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('/book');
  }, [router]);

  // Active filter count for mobile badge
  const activeFilterCount = [
    currentCategory,
    selectedSubCategory,
    selectedServiceArea,
    minRating > 0,
    showInstantBooking,
    showVerified,
  ].filter(Boolean).length;

  // Category title for display
  const categoryTitle = currentCategory ? getCategoryLabel(currentCategory) : 'All Vendors';

  // Event type title from URL
  const eventTypeTitle = typeParam
    ? typeParam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '';

  // ── Event context: get recommended services from taxonomy ──────────────
  const eventTypeInfo = useMemo(() => {
    if (!typeParam) return null;
    const eventGroup = eventTypes.find(e => e.id === typeParam);
    if (!eventGroup) return null;
    return {
      name: eventGroup.name,
      subtypes: eventGroup.subcategories,
      selectedSub: subParam || null,
    };
  }, [typeParam, subParam]);

  // Get recommended services for the event type + subtype
  const recommendedServices = useMemo(() => {
    if (!eventTypeInfo) return [];
    // Find the taxonomy section that matches
    const taxonomyKeys = Object.keys(taxonomy);
    // Try to match the event type name to a taxonomy key
    let matchedKey = taxonomyKeys.find(k =>
      k.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() ===
      eventTypeInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    );
    if (!matchedKey) {
      // Fuzzy match
      matchedKey = taxonomyKeys.find(k =>
        k.toLowerCase().includes(eventTypeInfo.name.toLowerCase().split(' ')[0]) ||
        eventTypeInfo.name.toLowerCase().includes(k.toLowerCase().split(' ')[0])
      );
    }
    if (!matchedKey) return [];

    const section = taxonomy[matchedKey];
    const services: { name: string; category: string; href: string }[] = [];

    if (subParam && section[subParam]) {
      // Specific subtype selected - get its services
      const subtypes = section[subParam] as Record<string, string[]>;
      Object.entries(subtypes).forEach(([subtypeName, serviceList]) => {
        serviceList.forEach(s => {
          if (!services.find(existing => existing.name === s)) {
            const catSlug = mapServiceToCategory(s);
            services.push({ name: s, category: catSlug, href: `/book?cat=${catSlug}&q=${encodeURIComponent(s)}` });
          }
        });
      });
    } else {
      // No specific subtype - show all services across all subtypes
      Object.entries(section).forEach(([subtypeName, subtypes]) => {
        const subtypesObj = subtypes as Record<string, string[]>;
        Object.values(subtypesObj).forEach(serviceList => {
          serviceList.forEach(s => {
            if (!services.find(existing => existing.name === s)) {
              const catSlug = mapServiceToCategory(s);
              services.push({ name: s, category: catSlug, href: `/book?cat=${catSlug}&q=${encodeURIComponent(s)}` });
            }
          });
        });
      });
    }

    return services;
  }, [eventTypeInfo, subParam]);

  // Map a service name to a category slug
  function mapServiceToCategory(service: string): string {
    const s = service.toLowerCase();
    if (s.includes('venue') || s.includes('ballroom') || s.includes('barn') || s.includes('loft') || s.includes('rooftop') || s.includes('garden') || s.includes('hotel') || s.includes('restaurant') || s.includes('conference')) return 'venues-spaces';
    if (s.includes('planner') || s.includes('coordinator') || s.includes('officiant') || s.includes('stylist')) return 'event-planning';
    if (s.includes('cater') || s.includes('chef') || s.includes('cake') || s.includes('bakery') || s.includes('bartend') || s.includes('food') || s.includes('dinner') || s.includes('brunch') || s.includes('wine') || s.includes('beer') || s.includes('spirits') || s.includes('dessert')) return 'catering-food';
    if (s.includes('dj') || s.includes('band') || s.includes('music') || s.includes('entertainment') || s.includes('magician') || s.includes('comedian') || s.includes('karaoke') || s.includes('photo booth') || s.includes('trivia') || s.includes('interactive') || s.includes('party character') || s.includes('comedy') || s.includes('escape') || s.includes('lawn game') || s.includes('bounce') || s.includes('face paint') || s.includes('balloon') || s.includes('fire dancer') || s.includes('lifeguard') || s.includes('auction')) return 'entertainment';
    if (s.includes('photo') || s.includes('video') || s.includes('drone') || s.includes('av') || s.includes('sound') || s.includes('lighting') || s.includes('stage') || s.includes('stream') || s.includes('camera')) return 'production-tech';
    if (s.includes('florist') || s.includes('decor') || s.includes('tent') || s.includes('linen') || s.includes('furniture') || s.includes('balloon') || s.includes('sign') || s.includes('stationery') || s.includes('invitation') || s.includes('party favor') || s.includes('party suppl') || s.includes('centerpiece') || s.includes('red carpet')) return 'decor-rentals';
    if (s.includes('hair') || s.includes('makeup') || s.includes('attire') || s.includes('tuxedo') || s.includes('tailor') || s.includes('nail') || s.includes('spray tan') || s.includes('wardrobe') || s.includes('jewelry')) return 'beauty-attire';
    if (s.includes('hotel') || s.includes('resort') || s.includes('limo') || s.includes('bus') || s.includes('shuttle') || s.includes('boat') || s.includes('vacation') || s.includes('travel') || s.includes('lodging') || s.includes('transport')) return 'travel-lodging';
    if (s.includes('security') || s.includes('medical') || s.includes('permit') || s.includes('parking') || s.includes('porta') || s.includes('coat check') || s.includes('wifi') || s.includes('insurance') || s.includes('timing')) return 'event-planning';
    return 'event-planning';
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Search bar at the top */}
      <div className="mb-8">
        <LocationSearchBar
          variant="compact"
          initialService={currentQuery}
          initialLocation={currentLocation}
          onSearch={handleSearch}
        />
      </div>

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          {eventContext ? `${eventContext} - ` : eventTypeTitle ? `${eventTypeTitle} - ` : ''}
          {currentQuery ? `Results for "${currentQuery}"` : categoryTitle}
          <span className="text-gray-400 text-lg ml-2 font-normal">({filteredVendors.length})</span>
        </h1>
        {currentLocation && (
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Near {currentLocation}
          </p>
        )}
        {servicesParam && (
          <p className="text-gray-400 text-sm mt-1">
            Looking for: {servicesParam.replace(/,/g, ', ')}
          </p>
        )}
      </div>

      {/* ── Event Context: Recommended Services ─────────────────────────── */}
      {eventTypeInfo && recommendedServices.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-coral/5 to-teal/5 rounded-2xl border border-coral/20 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-coral" />
            <h2 className="text-lg font-bold text-black">
              Vendors for {eventTypeInfo.name}
              {eventTypeInfo.selectedSub && (
                <span className="text-coral"> - {eventTypeInfo.selectedSub}</span>
              )}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These are the services typically needed for this type of event. Click any to find vendors.
          </p>

          {/* Subtype tabs */}
          {eventTypeInfo.subtypes.length > 0 && !subParam && (
            <div className="flex flex-wrap gap-2 mb-4">
              {eventTypeInfo.subtypes.slice(0, 8).map((sub) => (
                <Link
                  key={sub}
                  href={`/book?type=${typeParam}&sub=${encodeURIComponent(sub)}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-coral hover:text-coral transition-colors"
                >
                  {sub}
                </Link>
              ))}
              {eventTypeInfo.subtypes.length > 8 && (
                <span className="text-xs text-gray-400 px-2 py-1.5">
                  +{eventTypeInfo.subtypes.length - 8} more
                </span>
              )}
            </div>
          )}

          {/* Service links grouped by category */}
          <div className="flex flex-wrap gap-2">
            {recommendedServices.slice(0, 20).map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                {service.name}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
            {recommendedServices.length > 20 && (
              <span className="text-sm text-gray-400 px-3 py-2">
                +{recommendedServices.length - 20} more services
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4 flex items-center gap-3">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-teal-500 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-teal-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex-1"></div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
        >
          <option value="featured">Featured</option>
          <option value="rating">Top Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 align-top">
        {/* Left Sidebar - Filters */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-lg text-black">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-teal-600 font-semibold hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <div className="space-y-2">
                {[
                  { id: '', label: 'All Categories' },
                  ...CANONICAL_CATEGORIES.slice(0, 8).map(id => ({
                    id,
                    label: getCategoryLabel(id),
                  })),
                ].map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={currentCategory === cat.id}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="accent-teal-500 w-4 h-4"
                    />
                    <span className={`text-sm ${currentCategory === cat.id ? 'text-teal-700 font-semibold' : 'text-gray-600'}`}>
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price: ${priceRange.toLocaleString()}
              </label>
              <input
                type="range"
                className="w-full accent-teal-500"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$5k+</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  className="accent-teal-500 rounded"
                  checked={showInstantBooking}
                  onChange={(e) => setShowInstantBooking(e.target.checked)}
                />
                <span className="text-sm text-gray-600">Instant Booking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal-500 rounded"
                  checked={showVerified}
                  onChange={(e) => setShowVerified(e.target.checked)}
                />
                <span className="text-sm text-gray-600">Verified Partner</span>
              </label>
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {currentCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                      {getCategoryLabel(currentCategory)}
                      <button onClick={() => handleCategoryChange('')} className="hover:text-teal-900"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedSubCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                      {selectedSubCategory}
                      <button onClick={() => setSelectedSubCategory('')} className="hover:text-teal-900"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                      {minRating}+ stars
                      <button onClick={() => setMinRating(0)} className="hover:text-teal-900"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Results Area */}
        <section className="flex-1">
          {/* Desktop sort */}
          <div className="hidden lg:flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="text-teal-600 font-semibold hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Dynamic Right Sidebar - shows when a category is selected */}
        {currentCategory && (
          <aside className="w-full lg:w-72 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border-t-4 border-teal-500 border-x-gray-100 border-b-gray-100 border-x border-b p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-black">
                Explore {getCategoryLabel(currentCategory)}
              </h3>

              {subCategories.length > 0 && (
                <div className="mb-6">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sub-Categories</span>
                  <ul className="space-y-2">
                    {subCategories.map((sub) => (
                      <li key={sub}>
                        <button
                          onClick={() => handleSubCategoryClick(sub)}
                          className={`w-full text-left flex justify-between items-center text-sm font-medium rounded-lg py-1.5 px-2 transition-colors border ${
                            selectedSubCategory === sub
                              ? 'text-teal-700 bg-teal-50 border-teal-200'
                              : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 border-transparent hover:border-teal-100'
                          }`}
                        >
                          {sub}
                          {selectedSubCategory === sub ? (
                            <X className="w-3 h-3 text-teal-500" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6 pt-4 border-t border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Service Areas</span>
                <div className="space-y-2">
                  {['Downtown', 'Metro Area', 'Suburbs'].map((area) => (
                    <label key={area} className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors ${
                      selectedServiceArea === area
                        ? 'bg-teal-50 border-teal-200'
                        : 'bg-gray-50 border-gray-100 hover:border-teal-300'
                    }`}>
                      <input
                        type="checkbox"
                        className="accent-teal-500 rounded"
                        checked={selectedServiceArea === area}
                        onChange={() => setSelectedServiceArea(prev => prev === area ? '' : area)}
                      />
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Minimum Rating</span>
                <div className="flex gap-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(prev => prev === rating ? 0 : rating)}
                      className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border transition-colors ${
                        minRating === rating
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
                      } group`}
                    >
                      <Star className={`w-4 h-4 ${rating >= 4 ? 'text-teal-500 fill-teal-500' : minRating === rating ? 'text-teal-500 fill-teal-500' : 'text-gray-400 group-hover:text-teal-400'}`} />
                      <span className={`text-[10px] font-bold mt-1 ${minRating === rating ? 'text-teal-700' : 'text-gray-500'}`}>{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/** Extract numeric price from strings like "From $2,500" or "From $45/pp" */
function extractPrice(priceStr: string): number {
  const match = priceStr.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10);
}
