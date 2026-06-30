'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Clock,
  Calendar,
  ChevronRight,
  Store,
  Shield,
  Users,
  Send,
  Tag,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'
import type { Vendor, VendorAvailability, Review } from '@/lib/types'

interface VendorDetailData {
  vendor: Vendor & {
    analyticsSummary?: {
      totalViews: number
      totalLeads: number
      totalOrders: number
      totalRevenue: number
      avgConversionRate: number
    }
    _count?: {
      products: number
      reviews: number
      leads: number
      orders: number
    }
  }
}

interface ProductListItem {
  id: string
  name: string
  slug: string
  shortDesc?: string
  price: number
  compareAtPrice?: number
  type: string
  images?: string
  tags?: string
  isFeatured: boolean
  category?: { id: string; name: string; slug: string }
  reviewCount: number
}

interface VendorsResponse {
  vendors: Array<{
    id: string
    name: string
    slug: string
    rating: number
    reviewCount: number
    isVerified: boolean
    shortDescription?: string
    productCount: number
  }>
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function VendorDetail() {
  const { selectedVendorId, navigate } = useAppStore()
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const { data, isLoading, error } = useQuery<VendorDetailData>({
    queryKey: ['vendor-detail', selectedVendorId],
    queryFn: async () => {
      const res = await fetch(`/api/vendors/${selectedVendorId}`)
      if (!res.ok) throw new Error('Failed to fetch vendor')
      return res.json()
    },
    enabled: !!selectedVendorId,
  })

  const vendor = data?.vendor

  // Fetch similar vendors (same category)
  const { data: similarData } = useQuery<VendorsResponse>({
    queryKey: ['similar-vendors', vendor?.products?.[0]?.category?.slug],
    queryFn: async () => {
      const catSlug = vendor?.products?.[0]?.category?.slug
      if (!catSlug) return { vendors: [], pagination: { page: 1, limit: 4, total: 0, totalPages: 0 } }
      const res = await fetch(`/api/vendors?category=${catSlug}&limit=4&sort=rating`)
      if (!res.ok) throw new Error('Failed to fetch similar vendors')
      return res.json()
    },
    enabled: !!vendor?.products?.[0]?.category?.slug,
  })

  const similarVendors = similarData?.vendors?.filter((v) => v.id !== selectedVendorId) ?? []

  const leadMutation = useMutation({
    mutationFn: async (formData: typeof contactForm) => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: selectedVendorId,
          ...formData,
          source: 'vendor_profile',
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      return res.json()
    },
    onSuccess: () => {
      setContactSubmitted(true)
      setContactForm({ name: '', email: '', phone: '', message: '' })
    },
  })

  if (isLoading) return <VendorDetailSkeleton />
  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Vendor not found</h2>
          <p className="text-muted-foreground mb-4">The vendor you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('vendors')} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            Browse Vendors
          </Button>
        </div>
      </div>
    )
  }

  const tags = vendor.tags ? vendor.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
  const specialties = vendor.specialties ? vendor.specialties.split(',').map((s) => s.trim()).filter(Boolean) : []
  const services = vendor.products?.filter((p) => p.type === 'service') ?? []
  const products = vendor.products?.filter((p) => p.type === 'product') ?? []
  const allProducts = vendor.products ?? []

  const availabilityByDay = (vendor.availability ?? []).reduce<Record<number, VendorAvailability[]>>(
    (acc, a) => {
      if (!acc[a.dayOfWeek]) acc[a.dayOfWeek] = []
      acc[a.dayOfWeek].push(a)
      return acc
    },
    {}
  )

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
                <BreadcrumbPage>{vendor.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-40 sm:h-56 rounded-2xl overflow-hidden mb-6"
        >
          {vendor.coverImage ? (
            <img src={vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>

        {/* Vendor Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 -mt-12 sm:-mt-16 relative z-10 px-2"
        >
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-background bg-white shadow-lg overflow-hidden shrink-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                <Store className="h-10 w-10 text-emerald-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{vendor.name}</h1>
              {vendor.isVerified && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {vendor.isFeatured && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Featured</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{vendor.rating.toFixed(1)}</span>
                <span>({vendor.reviewCount} reviews)</span>
              </div>
              {(vendor.city || vendor.state) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                </div>
              )}
              {vendor._count && (
                <span>{vendor._count.products} services</span>
              )}
            </div>

            {vendor.shortDescription && (
              <p className="text-sm text-muted-foreground max-w-2xl">{vendor.shortDescription}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0 sm:self-center">
            <Button
              onClick={() => navigate('booking', { vendorId: vendor.id })}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
            {!vendor.isClaimed && (
              <Button
                variant="outline"
                onClick={() => navigate('claim-vendor', { vendorId: vendor.id })}
                className="rounded-xl"
              >
                <Shield className="h-4 w-4 mr-2" />
                Claim Business
              </Button>
            )}
          </div>
        </motion.div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          {vendor.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              {vendor.phone}
            </div>
          )}
          {vendor.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-emerald-600" />
              {vendor.email}
            </div>
          )}
          {vendor.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              {vendor.website}
            </div>
          )}
          {vendor.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              {vendor.address}
            </div>
          )}
        </motion.div>

        {/* Tags/Specialties */}
        {(tags.length > 0 || specialties.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {specialties.map((s) => (
              <Badge key={s} className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                <Tag className="h-3 w-3 mr-1" />
                {s}
              </Badge>
            ))}
            {tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full justify-start rounded-xl bg-muted/50 p-1 mb-6">
              <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Services & Products
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Services/Products Tab */}
            <TabsContent value="services">
              <div className="space-y-8">
                {services.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      Services
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => navigate('product-detail', { productId: product.id, vendorId: vendor.id })}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Store className="h-5 w-5 text-emerald-600" />
                      Products
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => navigate('product-detail', { productId: product.id, vendorId: vendor.id })}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {allProducts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No services or products listed yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-card border border-border rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">About {vendor.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {vendor.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Team Members */}
                  {vendor.teamMembers && vendor.teamMembers.length > 0 && (
                    <Card className="bg-card border border-border rounded-xl">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-emerald-600" />
                          Team Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {vendor.teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.user?.avatar} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                  {member.user?.name?.split(' ').map((n) => n[0]).join('') ?? '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.user?.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Business Hours */}
                  <Card className="bg-card border border-border rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-600" />
                        Business Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(availabilityByDay).length > 0 ? (
                        <div className="space-y-2">
                          {DAY_NAMES.map((dayName, i) => {
                            const slots = availabilityByDay[i]
                            if (!slots || slots.length === 0) {
                              return (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{dayName}</span>
                                  <span className="text-muted-foreground/60">Closed</span>
                                </div>
                              )
                            }
                            const isAvailable = slots.some((s) => s.isAvailable)
                            return (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dayName}</span>
                                <span className={isAvailable ? 'text-emerald-700 font-medium' : 'text-muted-foreground/60'}>
                                  {isAvailable
                                    ? slots.filter((s) => s.isAvailable).map((s) => `${s.startTime} - ${s.endTime}`).join(', ')
                                    : 'Closed'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No business hours listed.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  {vendor._count && (
                    <Card className="bg-card border border-border rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Services</span>
                            <span className="font-medium">{vendor._count.products}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reviews</span>
                            <span className="font-medium">{vendor._count.reviews}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completed Orders</span>
                            <span className="font-medium">{vendor._count.orders}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Leads</span>
                            <span className="font-medium">{vendor._count.leads}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card className="bg-card border border-border rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Customer Reviews</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="text-xl font-bold">{vendor.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({vendor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vendor.reviews && vendor.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {vendor.reviews.map((review: Review) => (
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
                      <p>No reviews yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border border-border rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Send a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold mb-1">Message Sent!</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          We&apos;ve sent your inquiry to {vendor.name}. They&apos;ll get back to you soon.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setContactSubmitted(false)}
                          className="rounded-xl"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          leadMutation.mutate(contactForm)
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Name *</Label>
                          <Input
                            id="contact-name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email *</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input
                            id="contact-phone"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-message">Message *</Label>
                          <Textarea
                            id="contact-message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            required
                            rows={4}
                            className="rounded-xl"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={leadMutation.isPending}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {leadMutation.isPending ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vendor.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium">{vendor.email}</p>
                        </div>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium">{vendor.phone}</p>
                        </div>
                      </div>
                    )}
                    {vendor.address && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium">
                            {vendor.address}
                            {[vendor.city, vendor.state, vendor.zipCode].filter(Boolean).length > 0 && (
                              <><br />{[vendor.city, vendor.state, vendor.zipCode].filter(Boolean).join(', ')}</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Website</p>
                          <p className="text-sm font-medium text-emerald-700">{vendor.website}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Similar Vendors */}
        {similarVendors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Similar Vendors</h2>
              <Button variant="ghost" onClick={() => navigate('vendors')} className="text-emerald-700">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarVendors.map((sv) => (
                <Card
                  key={sv.id}
                  className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate('vendor-detail', { vendorId: sv.id })}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Store className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{sv.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {sv.rating.toFixed(1)} ({sv.reviewCount})
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ProductCard({
  product,
  onClick,
}: {
  product: ProductListItem
  onClick: () => void
}) {
  return (
    <Card
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
      onClick={onClick}
    >
      <div className="h-32 bg-gradient-to-br from-teal-100 to-emerald-100 relative">
        {product.images ? (
          <img src={product.images.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="h-8 w-8 text-emerald-400" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-white/90 text-emerald-700 border-0 text-[10px]">
          {product.type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h4 className="text-sm font-semibold group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
          {product.name}
        </h4>
        {product.shortDesc && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.shortDesc}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-emerald-700">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.compareAtPrice}</span>
            )}
          </div>
          {product.category && (
            <Badge variant="outline" className="text-[9px]">{product.category.name}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function VendorDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-56 rounded-2xl mb-6" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-full max-w-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card border border-border rounded-xl">
              <Skeleton className="h-32" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
