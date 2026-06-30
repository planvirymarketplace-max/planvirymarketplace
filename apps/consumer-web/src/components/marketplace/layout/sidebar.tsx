'use client'

import { useAppStore, type SidebarSection } from '@/lib/store'
import { CATEGORIES } from '@/components/marketplace/common/category-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutGrid,
  Star,
  ShoppingCart,
  MapPin,
  Building2,
  Search,
} from 'lucide-react'

const NEARBY_CITIES = [
  'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Waukesha',
  'Appleton', 'Wauwatosa', 'West Allis', 'Brookfield', 'Mequon',
]

const NEIGHBORHOODS = [
  'Third Ward', 'East Side', 'Brady Street', 'Riverwest', 'Bay View',
  'Walker\'s Point', 'Downer Ave', 'Historic Third Ward', 'Westown', 'Juneau Town',
]

const RELATED_SEARCHES = [
  'Wedding venues Milwaukee', 'Outdoor ceremony venues', 'Rooftop event spaces',
  'Affordable wedding DJs', 'Photo booth rental', 'Limo service Milwaukee',
  'Wedding planners near me', 'Catering companies Milwaukee', 'Florist downtown',
]

const SIDEBAR_NAV_ITEMS: { key: SidebarSection; label: string; icon: React.ElementType }[] = [
  { key: 'explore', label: 'Explore Directory', icon: LayoutGrid },
  { key: 'featured', label: 'Featured Gems', icon: Star },
  { key: 'cart-booking', label: 'Unified Cart Booking', icon: ShoppingCart },
]

export function AppSidebar() {
  const {
    sidebarOpen,
    activeSidebarSection,
    setActiveSidebarSection,
    navigateToCategory,
    setView,
  } = useAppStore()

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-[105px] bottom-0 z-40 w-64 bg-white border-r border-slate-200 lg:relative lg:top-0">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeSidebarSection === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveSidebarSection(item.key)
                    if (item.key === 'explore') setView('directory')
                    else if (item.key === 'featured') setView('home')
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              )
            })}
          </div>

          <Separator className="bg-slate-100" />

          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 px-3">
              Categories
            </h3>
            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.slug}
                    onClick={() => navigateToCategory(cat.slug)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded transition-colors"
                  >
                    <Icon className="size-3.5 text-slate-400" />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Nearby Cities */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 px-3">
              Nearby Cities
            </h3>
            <div className="space-y-0.5">
              {NEARBY_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => navigateToCategory('wedding_venue')}
                  className="w-full flex items-center gap-2 px-3 py-1 text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors"
                >
                  <MapPin className="size-3 text-slate-300" />
                  {city}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Neighborhoods */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 px-3">
              Neighborhoods
            </h3>
            <div className="space-y-0.5">
              {NEIGHBORHOODS.map((hood) => (
                <button
                  key={hood}
                  onClick={() => navigateToCategory('wedding_venue')}
                  className="w-full flex items-center gap-2 px-3 py-1 text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors"
                >
                  <Building2 className="size-3 text-slate-300" />
                  {hood}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Related Searches */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 px-3">
              Related Searches
            </h3>
            <div className="space-y-0.5">
              {RELATED_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    const { navigateToSearch } = useAppStore.getState()
                    navigateToSearch(term)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1 text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors"
                >
                  <Search className="size-3 text-slate-300" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
