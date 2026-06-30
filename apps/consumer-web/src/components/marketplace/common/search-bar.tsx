'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string, category?: string) => void
  size?: 'sm' | 'md' | 'lg'
  showCategory?: boolean
  className?: string
  defaultQuery?: string
  defaultCategory?: string
}

const sizeConfig = {
  sm: { input: 'h-8 text-sm', button: 'h-8 px-3', icon: 'size-3.5', select: 'h-8 text-xs' },
  md: { input: 'h-10 text-sm', button: 'h-10 px-4', icon: 'size-4', select: 'h-10 text-sm' },
  lg: { input: 'h-12 text-base', button: 'h-12 px-6', icon: 'size-5', select: 'h-12 text-base' },
}

export function SearchBar({
  placeholder = 'Search for services...',
  onSearch,
  size = 'md',
  showCategory = false,
  className,
  defaultQuery = '',
  defaultCategory = 'all',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery)
  const [category, setCategory] = useState(defaultCategory)
  const [categories, setCategories] = useState<Category[]>([])
  const config = sizeConfig[size]

  useEffect(() => {
    if (showCategory) {
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => setCategories(data.categories || []))
        .catch(() => {})
    }
  }, [showCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, category === 'all' ? undefined : category)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2', className)}>
      {showCategory && categories.length > 0 && (
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={cn('w-[160px] shrink-0 border-r-0 rounded-r-none focus:ring-0', config.select)}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'pr-2',
            showCategory && categories.length > 0 ? 'rounded-l-none border-l-0' : '',
            config.input,
            'focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500'
          )}
        />
      </div>
      <Button
        type="submit"
        className={cn(
          'bg-emerald-600 hover:bg-emerald-700 text-white shrink-0',
          config.button
        )}
      >
        <Search className={config.icon} />
        {size === 'lg' && <span className="ml-1">Search</span>}
      </Button>
    </form>
  )
}
