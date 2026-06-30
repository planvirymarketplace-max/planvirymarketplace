'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Star,
  Store,
  MapPin,
  CheckCircle,
  Calendar,
  Tag,
  ChevronRight,
  ShoppingCart,
  Clock,
  Minus,
  Plus,
  Shield,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'
import type { Review } from '@/lib/types'

interface ProductDetailData {
  product: {
    id: string
    vendorId: string
    categoryId?: string
    name: string
    slug: string
    description: string
    shortDesc?: string
    price: number
    compareAtPrice?: number
    images?: string
    type: 'product' | 'service'
    status: string
    isFeatured: boolean
    tags?: string
    sku?: string
    stock: number
    minBookingHours?: number
    maxBookingHours?: number
    depositPercent?: number
    createdAt: string
    vendor: {
      id: string
      name: string
      slug: string
      logo?: string
      coverImage?: string
      rating: number
      reviewCount: number
      isVerified: boolean
      city?: string
      state?: string
    }
    category?: { id: string; name: string; slug: string }
    reviews: Review[]
    avgRating: number
    _count: { reviews: number }
  }
}

interface ProductsResponse {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    type: string
    images?: string
    shortDesc?: string
    isFeatured: boolean
    vendor: { id: string; name: string; rating: number; isVerified: boolean }
    category?: { id: string; name: string; slug: string }
  }>
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export function ProductDetail() {
  const { selectedProductId, selectedVendorId, navigate } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [dateOpen, setDateOpen] = useState(false)

  const { data, isLoading, error } = useQuery<ProductDetailData>({
    queryKey: ['product-detail', selectedProductId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${selectedProductId}`)
      if (!res.ok) throw new Error('Failed to fetch product')
      return res.json()
    },
    enabled: !!selectedProductId,
  })

  const product = data?.product

  // Fetch similar products
  const { data: similarData } = useQuery<ProductsResponse>({
    queryKey: ['similar-products', product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return { products: [], pagination: { page: 1, limit: 4, total: 0, totalPages: 0 } }
      const res = await fetch(`/api/products?categoryId=${product.categoryId}&limit=4&sort=created`)
      if (!res.ok) throw new Error('Failed to fetch similar products')
      return res.json()
    },
    enabled: !!product?.categoryId,
  })

  const similarProducts = similarData?.products?.filter((p) => p.id !== selectedProductId) ?? []

  if (isLoading) return <ProductDetailSkeleton />
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('vendors')} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            Browse Vendors
          </Button>
        </div>
      </div>
    )
  }

  const tags = product.tags ? product.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0
  const depositAmount = product.depositPercent
    ? (product.price * quantity * product.depositPercent) / 100
    : 0
  const totalPrice = product.price * quantity

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('vendors')} className="cursor-pointer">Vendors</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('vendor-detail', { vendorId: product.vendor.id })}
                  className="cursor-pointer"
                >
                  {product.vendor.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden"
            >
              {product.images ? (
                <img src={product.images.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-100 flex items-center justify-center">
                  <Store className="h-20 w-20 text-emerald-300" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-emerald-600 text-white border-0 capitalize">{product.type}</Badge>
                {product.isFeatured && (
                  <Badge className="bg-amber-500 text-white border-0">Featured</Badge>
                )}
              </div>
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white border-0">
                  {discount}% OFF
                </Badge>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product._count.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
                )}
                {product.type === 'service' && (
                  <span className="text-sm text-muted-foreground">
                    {product.minBookingHours ? `/ ${product.minBookingHours}hr` : '/ service'}
                  </span>
                )}
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-lg">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.sku && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">SKU: </span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.type === 'product' && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stock: </span>
                      <span className={`font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  )}
                  {product.category && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category: </span>
                      <span className="font-medium">{product.category.name}</span>
                    </div>
                  )}
                  {product.minBookingHours && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Min booking: </span>
                      <span className="font-medium">{product.minBookingHours} hour{product.minBookingHours !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {product.maxBookingHours && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Max booking: </span>
                      <span className="font-medium">{product.maxBookingHours} hour{product.maxBookingHours !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Reviews */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
                {product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review: Review) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.user?.avatar} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                              {review.user?.name?.split(' ').map((n) => n[0]).join('') ?? '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{review.user?.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.isVerified && (
                                <Badge className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0">Verified</Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                        {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No reviews yet for this {product.type}.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Booking / Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-card border border-border rounded-xl sticky top-6">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Date Picker (for services) */}
                  {product.type === 'service' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select Date</Label>
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start rounded-xl text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              setDateOpen(false)
                            }}
                            disabled={{ before: new Date() }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {product.type === 'service' ? 'Duration (hours)' : 'Quantity'}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.type === 'service' && product.minBookingHours && (
                      <p className="text-xs text-muted-foreground">
                        Minimum {product.minBookingHours} hour{product.minBookingHours !== 1 ? 's' : ''} required
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Price Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        ${product.price.toFixed(2)} × {quantity} {product.type === 'service' ? 'hour' : 'item'}{quantity !== 1 ? 's' : ''}
                      </span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {depositAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Deposit required ({product.depositPercent}%)</span>
                        <span className="font-medium">${depositAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="text-emerald-700">${totalPrice.toFixed(2)}</span>
                    </div>
                    {depositAmount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Pay ${depositAmount.toFixed(2)} now, remainder due at appointment
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11"
                    onClick={() => navigate('booking', { vendorId: product.vendor.id, productId: product.id })}
                  >
                    {product.type === 'service' ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  {product.depositPercent && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Secure booking with {product.depositPercent}% deposit</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Vendor Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="bg-card border border-border rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate('vendor-detail', { vendorId: product.vendor.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {product.vendor.logo ? (
                        <img src={product.vendor.logo} alt={product.vendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-6 w-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold truncate">{product.vendor.name}</p>
                        {product.vendor.isVerified && <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.vendor.rating.toFixed(1)} ({product.vendor.reviewCount})
                      </div>
                      {(product.vendor.city || product.vendor.state) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {[product.vendor.city, product.vendor.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Info */}
            {product.type === 'service' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="bg-card border border-border rounded-xl">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold">Service Info</h3>
                    {product.minBookingHours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        Minimum {product.minBookingHours} hour{product.minBookingHours !== 1 ? 's' : ''}
                      </div>
                    )}
                    {product.maxBookingHours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        Maximum {product.maxBookingHours} hour{product.maxBookingHours !== 1 ? 's' : ''}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Similar Products</h2>
              <Button variant="ghost" onClick={() => navigate('vendors')} className="text-emerald-700">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts.map((sp) => (
                <Card
                  key={sp.id}
                  className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                  onClick={() => navigate('product-detail', { productId: sp.id, vendorId: sp.vendor.id })}
                >
                  <div className="h-28 bg-gradient-to-br from-teal-100 to-emerald-100 relative">
                    {sp.images ? (
                      <img src={sp.images.split(',')[0]} alt={sp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {sp.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-emerald-700">${sp.price.toFixed(2)}</span>
                      <Badge className="text-[9px] bg-emerald-50 text-emerald-700 border-0">{sp.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-5 w-64 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
