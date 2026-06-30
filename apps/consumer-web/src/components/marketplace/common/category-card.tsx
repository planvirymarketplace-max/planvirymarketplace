'use client'

import {
  Music, MapPin, PartyPopper, Disc3, Guitar, Camera, Bus, Video, ClipboardList,
  Aperture, UtensilsCrossed, Cake, Flower2, Scissors, BookOpen, Shirt,
  Gift, Gem, Mail, Hotel, Plane, Lamp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import type { LucideIcon } from 'lucide-react'

export interface CategoryCardData {
  slug: string
  label: string
  icon: LucideIcon
  count?: number
}

const CATEGORIES: CategoryCardData[] = [
  { slug: 'bar_club', label: 'Bar & Club', icon: Music },
  { slug: 'wedding_venue', label: 'Wedding Venue', icon: MapPin },
  { slug: 'bachelorette_activity', label: 'Bachelorette Activity', icon: PartyPopper },
  { slug: 'wedding_dj', label: 'Wedding DJ', icon: Disc3 },
  { slug: 'wedding_band', label: 'Wedding Band', icon: Guitar },
  { slug: 'photo_booth', label: 'Photo Booth', icon: Camera },
  { slug: 'transportation', label: 'Transportation', icon: Bus },
  { slug: 'videography', label: 'Videography', icon: Video },
  { slug: 'wedding_planner', label: 'Wedding Planner', icon: ClipboardList },
  { slug: 'photography', label: 'Photography', icon: Aperture },
  { slug: 'catering', label: 'Catering', icon: UtensilsCrossed },
  { slug: 'wedding_cake', label: 'Wedding Cake', icon: Cake },
  { slug: 'florist', label: 'Florist', icon: Flower2 },
  { slug: 'hair_makeup', label: 'Hair & Makeup', icon: Scissors },
  { slug: 'officiant', label: 'Officiant', icon: BookOpen },
  { slug: 'dress_attire', label: 'Dress & Attire', icon: Shirt },
  { slug: 'favors_gifts', label: 'Favors & Gifts', icon: Gift },
  { slug: 'jeweler', label: 'Jeweler', icon: Gem },
  { slug: 'invitations_print', label: 'Invitations & Print', icon: Mail },
  { slug: 'hotel_accommodations', label: 'Hotel & Accommodations', icon: Hotel },
  { slug: 'honeymoon_travel', label: 'Honeymoon & Travel', icon: Plane },
  { slug: 'decor_rentals', label: 'Decor & Rentals', icon: Lamp },
]

export { CATEGORIES }

export function CategoryCard({ category }: { category: CategoryCardData }) {
  const { navigateToCategory } = useAppStore()
  const Icon = category.icon

  return (
    <Card
      className="group bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
      onClick={() => navigateToCategory(category.slug)}
    >
      <div className="flex flex-col items-center text-center gap-2.5">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <Icon className="size-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors leading-tight">
          {category.label}
        </span>
        {category.count != null && (
          <span className="text-xs text-slate-400">{category.count} vendors</span>
        )}
      </div>
    </Card>
  )
}
