'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FilterSidebar } from '@/components/directory/filter-sidebar'
import type { DirectoryFilterParams } from '@/lib/directory-filter-utils'

interface MobileFilterSheetProps {
  filters: DirectoryFilterParams
}

export function MobileFilterSheet({ filters }: MobileFilterSheetProps) {
  const activeCount = [
    filters.category?.length ?? 0,
    filters.price ? 1 : 0,
    filters.location?.length ?? 0,
    filters.rating && filters.rating !== 'any' ? 1 : 0,
    filters.availability?.length ?? 0,
    filters.vendor && filters.vendor !== 'all' ? 1 : 0,
  ].reduce((sum, n) => sum + n, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle>Filter Vendors</SheetTitle>
        </SheetHeader>
        <FilterSidebar filters={filters} className="border-0" />
      </SheetContent>
    </Sheet>
  )
}
