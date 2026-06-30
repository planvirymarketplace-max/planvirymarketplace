'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Star,
  MessageSquare,
  Filter,
  Send,
  Verified,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReviewsPanelProps {
  vendorId: string
}

interface ReviewItem {
  id: string
  userId: string
  vendorId?: string
  productId?: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: string
  user?: { id: string; name: string; avatar?: string }
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating
              ? 'text-amber-500 fill-amber-500'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-3 text-right">{rating}</span>
      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8">{count}</span>
    </div>
  )
}

export function ReviewsPanel({ vendorId }: ReviewsPanelProps) {
  const [ratingFilter, setRatingFilter] = React.useState('all')
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['vendor-reviews', vendorId],
    queryFn: async () => {
      const res = await fetch(`/api/vendors/${vendorId}`)
      if (!res.ok) throw new Error('Failed to fetch vendor')
      return res.json()
    },
    enabled: !!vendorId,
  })

  const reviews: ReviewItem[] = data?.vendor?.reviews || []
  const vendorRating: number = data?.vendor?.rating || 0
  const reviewCount: number = data?.vendor?.reviewCount || 0

  // Filter reviews
  const filteredReviews =
    ratingFilter === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(ratingFilter))

  // Rating distribution
  const ratingDistribution = React.useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      if (dist[r.rating] !== undefined) dist[r.rating]++
    })
    return dist
  }, [reviews])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
          <p className="text-sm text-muted-foreground">
            Customer feedback and ratings
          </p>
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating Summary */}
      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{vendorRating.toFixed(1)}</p>
              <StarRating rating={Math.round(vendorRating)} size="lg" />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {[5, 4, 3, 2, 1].map((r) => (
                <RatingBar
                  key={r}
                  rating={r}
                  count={ratingDistribution[r]}
                  total={reviewCount}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="bg-card border border-border rounded-xl">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No reviews found</p>
              <p className="text-xs">
                {ratingFilter !== 'all'
                  ? 'Try changing the filter'
                  : 'Reviews will appear here when customers leave feedback'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="bg-card border border-border rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {review.user?.avatar && (
                        <AvatarImage src={review.user.avatar} />
                      )}
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {review.user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{review.user?.name || 'Anonymous'}</p>
                        {review.isVerified && (
                          <Verified className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <p className="text-sm font-semibold mt-2">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                )}

                <div className="mt-3 flex items-center gap-2">
                  {replyingTo === review.id ? (
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                        >
                          Send Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-muted-foreground"
                      onClick={() => setReplyingTo(review.id)}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Reply
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
