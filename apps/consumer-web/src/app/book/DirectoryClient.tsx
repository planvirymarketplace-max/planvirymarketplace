'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, MapPin, Star } from 'lucide-react';
import VendorCard from '@/components/VendorCard';
import { LocationSearchBar } from '@/components/location-search-bar';

const mockVendors = [
  { id: 1, name: 'The Grand Ballroom', category: 'venues-spaces', categoryName: 'Wedding Venue', location: 'Downtown', rating: 4.9, reviews: 128, price: 'From $2,500', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', featured: true },
  { id: 2, name: 'Elevated Beats Entertainment', category: 'entertainment', categoryName: 'DJ & MC', location: 'Metro Area', rating: 5.0, reviews: 84, price: 'From $800', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', instant: true },
  { id: 3, name: 'Artisan Catering Co.', category: 'catering-food', categoryName: 'Food & Beverage', location: 'Third Ward', rating: 4.8, reviews: 215, price: 'From $45/pp', imageUrl: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=800', featured: true, instant: true },
  { id: 4, name: 'Luminous Photography', category: 'production-tech', categoryName: 'Photography', location: 'Wauwatosa', rating: 4.9, reviews: 156, price: 'From $1,800', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'Riverside Country Club', category: 'venues-spaces', categoryName: 'Wedding Venue', location: 'Shorewood', rating: 4.7, reviews: 92, price: 'From $3,200', imageUrl: 'https://images.unsplash.com/photo-1522771731478-44fb10e99340?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Elegant Events Planning', category: 'event-planning', categoryName: 'Wedding Planner', location: 'Brookfield', rating: 5.0, reviews: 45, price: 'From $1,500', imageUrl: 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?auto=format&fit=crop&q=80&w=800' },
  { id: 7, name: 'Velvet Draping & Tents', category: 'decor-rentals', categoryName: 'Tent & Decor', location: 'Wauwatosa', rating: 4.6, reviews: 110, price: 'From $500', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800' },
  { id: 8, name: 'Glow Up Beauty', category: 'beauty-attire', categoryName: 'Bridal Makeup', location: 'Downtown', rating: 4.9, reviews: 78, price: 'From $150', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800' },
];

export default function DirectoryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryCat = searchParams.get('cat') || '';
  const currentCategory = queryCat || '';
  const currentQuery = searchParams.get('q') || '';
  const currentCity = searchParams.get('city') || '';

  const subCategories = useMemo(() => {
    switch (currentCategory) {
      case 'venues-spaces': return ['Ballrooms', 'Barns', 'Historic', 'Hotels', 'Restaurants', 'Industrial'];
      case 'catering-food': return ['Buffet', 'Plated', 'Food Trucks', 'Desserts', 'Bar Service'];
      case 'entertainment': return ['DJs & MCs', 'Live Bands', 'Solo Musicians', 'Interactive'];
      case 'event-planning': return ['Full Service', 'Month-Of', 'Day-Of Coordination', 'Design Only'];
      case 'production-tech': return ['Lighting', 'Sound Systems', 'Staging', 'Video Mapping'];
      case 'decor-rentals': return ['Tents', 'Linens', 'Furniture', 'Florals', 'Balloons', 'Signs'];
      case 'beauty-attire': return ['Hair', 'Makeup', 'Bridal', 'Tuxedo'];
      default: return [];
    }
  }, [currentCategory]);

  const filteredVendors = useMemo(() => {
    return mockVendors.filter(vendor => {
      let match = true;
      if (currentCategory && vendor.category !== currentCategory) {
        match = false;
      }
      if (currentQuery) {
        const queryLower = currentQuery.toLowerCase();
        if (!vendor.name.toLowerCase().includes(queryLower) && !vendor.categoryName.toLowerCase().includes(queryLower)) {
          match = false;
        }
      }
      return match;
    });
  }, [currentCategory, currentQuery]);

  const handleCategoryChange = (val: string) => {
    if (val) {
      router.push(`/book?cat=${val}`);
    } else {
      router.push('/book');
    }
  };

  const handleSearch = (serviceSlug: string, locationSlug: string | null) => {
    if (locationSlug) {
      router.push(`/seo/${serviceSlug}/${locationSlug}`);
    } else {
      router.push(`/seo/${serviceSlug}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Search bar at the top of directory */}
      <div className="mb-8">
        <LocationSearchBar
          variant="compact"
          initialService={currentQuery}
          initialLocation={currentCity}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 align-top">
        {/* Faceted Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-black border-b border-gray-100 pb-2">Filter Results</h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <div className="space-y-2">
                {[
                  { id: '', label: 'All Categories' },
                  { id: 'venues-spaces', label: 'Venues & Spaces' },
                  { id: 'event-planning', label: 'Event Planning & Services' },
                  { id: 'catering-food', label: 'Catering & Food' },
                  { id: 'entertainment', label: 'Entertainment' },
                  { id: 'production-tech', label: 'Production & Tech' },
                  { id: 'decor-rentals', label: 'Decor & Rentals' },
                  { id: 'beauty-attire', label: 'Beauty & Attire' },
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
                    <span className="text-sm text-gray-600">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
              <input type="range" className="w-full accent-teal-500" min="0" max="5000" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$5k+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" className="accent-teal-500 rounded" />
                <span className="text-sm text-gray-600">Instant Booking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-teal-500 rounded" />
                <span className="text-sm text-gray-600">Verified Partner</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">
              {currentQuery ? `Results for "${currentQuery}"` : currentCategory ? `Directory: ${currentCategory.replace(/-/g, ' ')}` : 'All Vendors'}
              <span className="text-gray-400 text-lg ml-2 font-normal">({filteredVendors.length})</span>
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none">
                <option>Featured</option>
                <option>Top Rated</option>
                <option>Price: Low to High</option>
                <option>Most Reviewed</option>
              </select>
            </div>
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <VendorCard key={vendor.id} {...vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-2">No vendors found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
              <button
                onClick={() => router.push('/book')}
                className="mt-4 text-teal-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Dynamic Right Sidebar */}
        {currentCategory && (
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border-t-4 border-teal-500 border-x-gray-100 border-b-gray-100 border-x border-b p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-black">
                Explore {currentCategory.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>

              {subCategories.length > 0 && (
                <div className="mb-6">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sub-Categories</span>
                  <ul className="space-y-2">
                    {subCategories.map((sub, idx) => (
                      <li key={idx}>
                        <button className="w-full text-left flex justify-between items-center text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-lg py-1.5 px-2 transition-colors border border-transparent hover:border-teal-100">
                          {sub}
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6 pt-4 border-t border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Service Areas</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-teal-300 transition-colors">
                    <input type="checkbox" className="accent-teal-500 rounded" />
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Downtown</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-teal-300 transition-colors">
                    <input type="checkbox" className="accent-teal-500 rounded" />
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Metro Area</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-teal-300 transition-colors">
                    <input type="checkbox" className="accent-teal-500 rounded" />
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Suburbs</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Minimum Rating</span>
                <div className="flex gap-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button key={rating} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors group">
                      <Star className={`w-4 h-4 ${rating >= 4 ? 'text-teal-500 fill-teal-500' : 'text-gray-400 group-hover:text-teal-400'}`} />
                      <span className="text-[10px] font-bold text-gray-500 mt-1">{rating}+</span>
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
