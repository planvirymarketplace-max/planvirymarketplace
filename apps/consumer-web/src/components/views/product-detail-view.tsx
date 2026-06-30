'use client'

import { ArrowLeft, Star, Clock, Shield, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { mockProducts, mockVendors } from '@/lib/mock-data'
import { CATEGORY_LABELS } from '@/lib/medusa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function ProductDetailView() {
  const { selectedProductId, selectedVendorId, setView, selectVendor } = useAppStore()
  const product = mockProducts.find((p) => p.id === selectedProductId) || mockProducts[0]
  const vendor = mockVendors.find((v) => v.id === product.vendorId) || mockVendors[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => setView('vendor-detail')} className="mb-4 cursor-pointer text-gray-500 hover:text-blue-600">
        <ArrowLeft className="size-4 mr-1" /> Back to Vendor
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product image placeholder */}
          <Card className="border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-50 via-blue-100/50 to-orange-50 flex items-center justify-center">
              <div className="text-center">
                <div className="size-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="size-8" />
                </div>
                <p className="text-sm text-gray-400">Service Image</p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{product.type}</Badge>
                {product.isFeatured && (
                  <Badge className="bg-orange-50 text-orange-600 border-0 hover:bg-orange-50">Featured</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{product.rating || 'N/A'}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-gray-500">{product.tags.length > 0 ? product.tags.join(', ') : 'Service'}</span>
              </div>
              <p className="text-gray-500 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">${product.price.toLocaleString()}</span>
                  {product.compareAtPrice && (
                    <span className="text-lg text-gray-400 line-through">${product.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>
                {product.compareAtPrice && (
                  <Badge variant="secondary" className="mt-1">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                  </Badge>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="size-4 text-gray-400" />
                  <span>Service duration varies</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="size-4 text-blue-600" />
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>

              <Button className="w-full mb-2 cursor-pointer bg-blue-600 hover:bg-blue-700" size="lg" onClick={() => setView('booking')}>
                Book Now
              </Button>
              <Button variant="outline" className="w-full cursor-pointer border-gray-200">
                Request Quote
              </Button>
            </CardContent>
          </Card>

          {/* Vendor info card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-all border-gray-200"
            onClick={() => { selectVendor(vendor.id); setView('vendor-detail') }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-gray-900">{vendor.name}</span>
                    {vendor.isVerified && <Shield className="size-3.5 text-blue-600" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    {vendor.rating} ({vendor.reviewCount})
                  </div>
                  <Badge className="text-[10px] mt-1 bg-blue-50 text-blue-700 border-0 hover:bg-blue-50">
                    {CATEGORY_LABELS[vendor.category]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
