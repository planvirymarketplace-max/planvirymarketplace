'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  type DirectoryFilterParams,
  type ActiveFilterChip,
  getActiveFilterChips,
  removeFilter,
  buildFilterUrl,
} from '@/lib/directory-filter-utils'

interface ActiveFiltersProps {
  filters: DirectoryFilterParams
}

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const chips = getActiveFilterChips(filters)

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
      {chips.map((chip) => {
        const nextParams = removeFilter(filters, chip.key, chip.value)
        const href = buildFilterUrl(nextParams, {})

        return (
          <Link key={`${chip.key}-${chip.value}`} href={href}>
            <Badge
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              <span className="text-xs">{chip.label}</span>
              <span className="flex items-center justify-center h-4 w-4 rounded-full hover:bg-destructive/20 transition-colors">
                <X className="h-2.5 w-2.5" />
              </span>
            </Badge>
          </Link>
        )
      })}
      <Link href="/book">
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive">
          Clear all
        </Button>
      </Link>
    </div>
  )
}
