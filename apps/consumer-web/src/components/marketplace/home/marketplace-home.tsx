'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Star,
  Store,
  CheckCircle,
  MapPin,
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingBag,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import type { Category } from '@/lib/types'

interface VendorListItem {
  id: string
  name: string
  slug: string
  shortDescription?: string
  logo?: string
  city?: string
  state?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  isClaimed: boolean
  productCount: number
}

interface VendorsResponse {
  vendors: VendorListItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

interface CategoriesResponse {
  categories: Category[]
}

interface StatsResponse {
  totals: {
    vendors: number
    products: number
    orders: number
    users: number
    revenue: number
  }
  avgVendorRating: number
}

export function MarketplaceHome() {
  const { navigate, setSearchQuery } = useAppStore()

  const { data: featuredData, isLoading: featuredLoading } = useQuery<VendorsResponse>({
    queryKey: ['featured-vendors'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?featured=true&limit=6&sort=rating')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const { data: statsData } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const featuredVendors = featuredData?.vendors ?? []
  const categories = categoriesData?.categories ?? []

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    navigate('vendors')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-white/20 text-white border-0 mb-4 hover:bg-white/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Your Local Marketplace
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Discover & Book Local Services
            </h1>
            <p className="text-emerald-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Find trusted vendors, book appointments, and get things done - all in one place.
            </p>
            <div className="flex gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="What are you looking for?"
                  className="pl-12 h-12 rounded-xl text-base bg-white border-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleSearch(e.currentTarget.value)
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => navigate('vendors')}
                className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl h-12 px-6 font-semibold"
              >
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {statsData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: 'Vendors', value: statsData.totals.vendors, icon: Store },
              { label: 'Services', value: statsData.totals.products, icon: ShoppingBag },
              { label: 'Orders', value: statsData.totals.orders, icon: TrendingUp },
              { label: 'Avg Rating', value: statsData.avgVendorRating?.toFixed(1) ?? '4.5', icon: Star },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border border-border rounded-xl shadow-sm">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-5 w-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Browse Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">Find services by category</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('vendors')} className="text-emerald-700">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.slice(0, 8).map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card
                    className="bg-card border border-border rounded-xl cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group"
                    onClick={() => {
                      navigate('vendors')
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 transition-colors">
                        <span className="text-lg">
                          {category.icon || '📁'}
                        </span>
                      </div>
                      <p className="text-sm font-medium group-hover:text-emerald-700 transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(category as Record<string, unknown>).productCount as number ?? category._count?.products ?? 0} services
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Vendors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Vendors</h2>
              <p className="text-sm text-muted-foreground mt-1">Top-rated businesses in your area</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('vendors')} className="text-emerald-700">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredVendors.map((vendor, i) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => navigate('vendor-detail', { vendorId: vendor.id })}
                  >
                    <div className="h-28 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 relative">
                      {vendor.isFeatured && (
                        <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0 text-[10px]">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl border-2 border-white bg-white shadow-sm flex items-center justify-center">
                        {vendor.logo ? (
                          <img src={vendor.logo} alt={vendor.name} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <Store className="h-6 w-6 text-emerald-600" />
                        )}
                      </div>
                    </div>
                    <CardContent className="pt-8 pb-4 px-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {vendor.name}
                        </h3>
                        {vendor.isVerified && (
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({vendor.reviewCount})</span>
                        {(vendor.city || vendor.state) && (
                          <>
                            <span className="text-muted-foreground/40">·</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                            </div>
                          </>
                        )}
                      </div>
                      {vendor.shortDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {vendor.shortDescription}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Are you a business owner?</h2>
              <p className="text-muted-foreground max-w-md">
                Claim your business profile, manage your listings, and connect with customers on MarketHub.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('claim-vendor')}
                variant="outline"
                className="rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Claim Business
              </Button>
              <Button
                onClick={() => navigate('vendors')}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Explore Vendors
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
