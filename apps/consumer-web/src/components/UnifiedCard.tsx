/**
 * UnifiedCard — THE one card component every page uses.
 *
 * Props:
 *   name, image, category, city, state, price, rating, href, badge
 *
 * Design: white card, border, hover shadow, image top, content bottom.
 * No gradients. No custom colors. Same on every page.
 */

import Link from 'next/link'
import { MapPin, Star, ChevronRight } from 'lucide-react'

export interface UnifiedCardProps {
  name: string
  image?: string
  category?: string
  city?: string
  state?: string
  price?: string | number
  rating?: number
  href: string
  badge?: string
  date?: string
  description?: string
}

export function UnifiedCard({
  name,
  image,
  category,
  city,
  state,
  price,
  rating,
  href,
  badge,
  date,
  description,
}: UnifiedCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl overflow-hidden"
    >
      {/* Image */}
      {image ? (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-50 flex items-center justify-center">
          <span className="text-xs text-gray-300 font-bold uppercase">{category || 'No Image'}</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {badge && (
          <span className="text-[9px] font-black uppercase tracking-widest text-coral mb-1">
            {badge}
          </span>
        )}
        <h3 className="text-sm font-bold text-black group-hover:text-coral transition-colors line-clamp-2">
          {name}
        </h3>

        {date && (
          <p className="text-xs text-gray-400 mt-1">
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {city && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city}{state ? `, ${state}` : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {rating != null && (
              <span className="text-xs font-bold text-black flex items-center gap-0.5">
                <Star className="w-3 h-3 text-coral fill-coral" />
                {rating.toFixed(1)}
              </span>
            )}
            {price != null && (
              <span className="text-xs font-bold text-black">
                {typeof price === 'number' ? `$${price}` : price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
