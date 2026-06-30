'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './star-rating'
import { useAppStore } from '@/lib/store'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

const typeGradients: Record<string, string> = {
  product: 'from-emerald-400 to-teal-500',
  service: 'from-amber-400 to-orange-500',
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useAppStore((s) => s.navigate)

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer border border-border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-lg"
        onClick={() => navigate('product-detail', { productId: product.id })}
      >
        {/* Image placeholder with gradient */}
        <div
          className={`h-36 bg-gradient-to-br ${typeGradients[product.type] || typeGradients.service} relative flex items-center justify-center`}
        >
          <span className="text-white/80 font-medium text-sm">
            {product.name.slice(0, 20)}{product.name.length > 20 ? '...' : ''}
          </span>
          <Badge
            className={`absolute top-2 right-2 text-[10px] ${
              product.type === 'service'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {product.type === 'service' ? 'Service' : 'Product'}
          </Badge>
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 text-[10px] bg-amber-100 text-amber-700">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
            {product.name}
          </h3>

          {product.vendor && (
            <p className="text-xs text-muted-foreground mt-0.5">
              by {product.vendor.name}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-emerald-700 text-base">
              ${product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ${product.compareAtPrice!.toLocaleString()}
                </span>
                <Badge className="text-[10px] bg-red-100 text-red-700 h-4 px-1.5">
                  -{discountPercent}%
                </Badge>
              </>
            )}
          </div>

          {product.shortDesc && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {product.shortDesc}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
