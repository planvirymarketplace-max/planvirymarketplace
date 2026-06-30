'use client'

import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function StarRating({ rating, count, size = 'md', className }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeMap[size], 'fill-amber-400 text-amber-400')}
          />
        ))}
        {hasHalf && (
          <StarHalf className={cn(sizeMap[size], 'fill-amber-400 text-amber-400')} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeMap[size], 'text-muted-foreground/30')}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={cn(textSizeMap[size], 'text-muted-foreground ml-0.5')}>
          ({count})
        </span>
      )}
    </div>
  )
}
