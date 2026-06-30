'use client'

import { CategoryCard, CATEGORIES, type CategoryCardData } from '@/components/marketplace/common/category-card'
import { useQuery } from '@tanstack/react-query'

interface CategoryCount {
  category: string
  count: number
}

export function CategoryGrid() {
  const { data: categoryCounts } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) return []
      const data = await res.json()
      return (data.categories || []) as CategoryCount[]
    },
    staleTime: 60000,
  })

  const categoriesWithCounts = CATEGORIES.map((cat) => {
    const found = categoryCounts?.find((c) => c.category === cat.slug)
    return { ...cat, count: found?.count ?? 0 }
  })

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Explore all 22 vendor categories for your Milwaukee event
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoriesWithCounts.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
