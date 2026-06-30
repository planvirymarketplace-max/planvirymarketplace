'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SORT_OPTIONS,
  type DirectoryFilterParams,
  buildFilterUrl,
} from '@/lib/directory-filter-utils'

interface SortDropdownProps {
  filters: DirectoryFilterParams
}

export function SortDropdown({ filters }: SortDropdownProps) {
  const router = useRouter()
  const currentSort = filters.sort || 'recommended'

  const handleSortChange = (value: string) => {
    const href = buildFilterUrl(filters, { sort: value })
    router.push(href)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px] h-9 text-sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.slug} value={opt.slug}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
