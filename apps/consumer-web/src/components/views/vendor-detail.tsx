'use client'

import React, { useState } from 'react'
import {
  ChevronLeft,
  MapPin,
  Phone,
  Globe,
  Star,
  Mail,
  Calendar,
  Sparkles,
  Send,
  CheckCircle,
  ShieldAlert,
  ShoppingBag,
  Play,
  X,
  ChevronRight,
  ImageIcon,
  BadgeCheck,
  Share2,
  Heart,
} from 'lucide-react'
import { Vendor, Package, CartItem, Review } from '@/lib/marketplace-types'

interface VendorDetailProps {
  vendor: Vendor
  allVendors: Vendor[]
  onBack: () => void
  onAddToCart: (item: Omit<CartItem, 'id'>) => void
  onAddReview: (vendorId: string, rating: number, body: string, reviewerName: string) => void
  onSendLead: (vendorId: string, contactName: string, contactEmail: string, contactPhone: string, eventDate: string, budget: number, message: string) => void
  onSelectVendor: (id: string) => void
}

export function VendorDetail({
  vendor,
  allVendors,
  onBack,
  onAddToCart,
  onAddReview,
  onSendLead,
  onSelectVendor,
}: VendorDetailProps) {
  // ── Gallery state ──
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  // ── Package selection ──
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packageEventDate, setPackageEventDate] = useState('')

  // ── Review form state ──
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // ── Lead inquiry form state ──
  const [leadContactName, setLeadContactName] = useState('')
  const [leadContactEmail, setLeadContactEmail] = useState('')
  const [leadContactPhone, setLeadContactPhone] = useState('')
  const [leadEventDate, setLeadEventDate] = useState('')
  const [leadBudget, setLeadBudget] = useState(0)
  const [leadMessage, setLeadMessage] = useState('')
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // ── Date availability check ──
  const [dateCheckValue, setDateCheckValue] = useState('')
  const [dateCheckResult, setDateCheckResult] = useState<'available' | 'unavailable' | null>(null)

  // ── Derived data ──
  const galleryImages = vendor.galleryUrl && vendor.galleryUrl.length > 0
    ? vendor.galleryUrl
    : [vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80']

  const recommendations = allVendors
    .filter((v) => v.id !== vendor.id && v.category === vendor.category)
    .slice(0, 3)

  const getCategoryLabel = (cat: string) =>
    cat.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  // ── Handlers ──
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setShowVideoPlayer(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleCheckAvailability = () => {
    if (!dateCheckValue) return
    const isAvailable = !vendor.availability || !vendor.availability.includes(dateCheckValue)
    setDateCheckResult(isAvailable ? 'available' : 'unavailable')
  }

  const handleAddPackageToCart = () => {
    if (!selectedPackage || !packageEventDate) return
    onAddToCart({
      vendorId: vendor.id,
      vendorName: vendor.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      eventDate: packageEventDate,
      priceSnapshot: selectedPackage.price,
      depositPercent: vendor.depositPercent,
      depositAmount: Math.round(selectedPackage.price * (vendor.depositPercent / 100)),
      logoUrl: vendor.logoUrl,
    })
    setSelectedPackage(null)
    setPackageEventDate('')
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewBody.trim() || !reviewerName.trim()) return
    onAddReview(vendor.id, reviewRating, reviewBody, reviewerName)
    setReviewBody('')
    setReviewerName('')
    setReviewRating(5)
    setReviewSubmitted(true)
    setTimeout(() => setReviewSubmitted(false), 3000)
  }

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadContactName.trim() || !leadContactEmail.trim() || !leadMessage.trim()) return
    onSendLead(vendor.id, leadContactName, leadContactEmail, leadContactPhone, leadEventDate, leadBudget, leadMessage)
    setLeadContactName('')
    setLeadContactEmail('')
    setLeadContactPhone('')
    setLeadEventDate('')
    setLeadBudget(0)
    setLeadMessage('')
    setLeadSubmitted(true)
    setTimeout(() => setLeadSubmitted(false), 4000)
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* ── Lightbox Modal ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white transition z-10" onClick={closeLightbox}>
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition z-10"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft size={36} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition z-10"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight size={36} />
          </button>

          {showVideoPlayer ? (
            <div className="relative w-full max-w-4xl aspect-video bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <Play size={36} className="text-white ml-1" />
                </div>
                <p className="text-white/70 text-sm font-medium">Video player simulation</p>
                <p className="text-white/40 text-xs">{vendor.name} - Highlight Reel</p>
                <div className="w-64 mx-auto bg-white/10 rounded-full h-1.5 mt-4">
                  <div className="bg-white/50 h-1.5 rounded-full w-1/3" />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={galleryImages[lightboxIndex]}
                alt={`Gallery image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <p className="text-center text-white/50 text-sm mt-3">
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Cover Banner ── */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-gradient-to-br from-stone-300 via-stone-200 to-stone-100">
        {vendor.coverUrl ? (
          <img
            src={vendor.coverUrl}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="size-20 text-stone-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />

        {/* Badges on cover */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {vendor.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm uppercase tracking-wider">
              <Sparkles size={10} />
              Elite Partner
            </span>
          )}
          {vendor.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-stone-900 backdrop-blur-sm">
              <BadgeCheck size={12} className="text-stone-900" />
              Verified
            </span>
          )}
        </div>

        {/* Back button on cover */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-stone-900 hover:bg-white transition shadow-sm"
        >
          <ChevronLeft size={14} />
          Back
        </button>

        {/* Vendor name overlay at bottom of cover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest">
              {getCategoryLabel(vendor.category)}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-[var(--font-display)] font-medium text-white tracking-tight leading-tight">
              {vendor.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-white/80 text-xs">
              {vendor.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {vendor.address}
                </span>
              )}
              {vendor.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {vendor.phone}
                </span>
              )}
              {vendor.priceRange && (
                <span className="font-mono font-bold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px]">
                  {vendor.priceRange} Price Grade
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════════════════════════════════════════════
               LEFT COLUMN (2/3)
          ════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── Rating + Quick Actions Bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(vendor.averageRating || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-stone-900">{(vendor.averageRating || 0).toFixed(1)}</span>
                <span className="text-xs text-stone-500">({vendor.reviewCount || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition">
                  <Share2 size={14} />
                  Share
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition">
                  <Heart size={14} />
                  Save
                </button>
              </div>
            </div>

            {/* ── Bio Section ── */}
            {vendor.bio && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">About</h2>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-light">
                  {vendor.bio}
                </p>
                {vendor.tags && vendor.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {vendor.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex rounded bg-stone-50 border border-stone-200 px-2 py-0.5 text-[9px] text-stone-600 font-mono"
                      >
                        #{tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Gallery Section ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Gallery</h2>
                <span className="text-[10px] text-stone-500 font-mono">{galleryImages.length} photos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); setShowVideoPlayer(false) }}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-stone-100 group cursor-pointer ${
                      i === 0 ? 'col-span-2 row-span-2' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vendor.name} gallery ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  </button>
                ))}

                {/* Video player tile */}
                <button
                  onClick={() => { setLightboxOpen(true); setShowVideoPlayer(true) }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold text-white/70 uppercase tracking-wider">Video</span>
                </button>

                {/* "View all" tile if more images */}
                {galleryImages.length > 5 && (
                  <button
                    onClick={() => { setLightboxIndex(5); setLightboxOpen(true); setShowVideoPlayer(false) }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 flex items-center justify-center group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-stone-700 group-hover:text-stone-900 transition">
                      +{galleryImages.length - 5}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Packages Section ── */}
            {vendor.packages && vendor.packages.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Packages & Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendor.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg)}
                      className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                        selectedPackage?.id === pkg.id
                          ? 'border-stone-900 bg-stone-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm'
                      }`}
                    >
                      {selectedPackage?.id === pkg.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle size={18} className="text-stone-900" />
                        </div>
                      )}
                      <h3 className="font-[var(--font-display)] text-lg font-medium text-stone-900 tracking-tight">
                        {pkg.name}
                      </h3>
                      <p className="mt-1 text-2xl font-bold text-stone-900 font-sans">
                        ${pkg.price.toLocaleString()}
                      </p>
                      {pkg.duration && (
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          {pkg.duration}
                        </span>
                      )}
                      <p className="mt-3 text-xs text-stone-600 leading-relaxed font-light">
                        {pkg.description}
                      </p>
                      {pkg.capacity && (
                        <p className="mt-2 text-[10px] text-stone-500 font-mono">
                          Capacity: {pkg.capacity}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                {/* Add to cart for selected package */}
                {selectedPackage && (
                  <div className="mt-5 rounded-xl bg-stone-50 border border-stone-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Selected</p>
                        <p className="font-[var(--font-display)] text-lg font-medium text-stone-900 mt-0.5">{selectedPackage.name}</p>
                      </div>
                      <p className="text-xl font-bold text-stone-900">${selectedPackage.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={packageEventDate}
                          onChange={(e) => setPackageEventDate(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleAddPackageToCart}
                          disabled={!packageEventDate}
                          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    {packageEventDate && (
                      <p className="text-[10px] text-stone-500 font-mono">
                        Deposit: ${Math.round(selectedPackage.price * (vendor.depositPercent / 100)).toLocaleString()} ({vendor.depositPercent}%)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Reviews Section ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Reviews</h2>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-stone-900">{(vendor.averageRating || 0).toFixed(1)}</span>
                  <span className="text-xs text-stone-500">({vendor.reviewCount || 0})</span>
                </div>
              </div>

              {/* Existing reviews list */}
              {vendor.reviews && vendor.reviews.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-1">
                  {vendor.reviews.map((review) => (
                    <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                            {review.reviewerName?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <span className="text-xs font-semibold text-stone-900">{review.reviewerName}</span>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={11}
                              className={
                                star <= review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-stone-200'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed font-light">{review.body}</p>
                      {review.response && (
                        <div className="mt-2 ml-4 pl-3 border-l-2 border-stone-200">
                          <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Vendor Response</p>
                          <p className="text-xs text-stone-500 leading-relaxed font-light">{review.response}</p>
                        </div>
                      )}
                      <p className="mt-1 text-[10px] text-stone-400 font-mono">{review.createdAt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 mb-6 font-light">No reviews yet. Be the first to share your experience!</p>
              )}

              {/* Review submission form */}
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-3">Write a Review</h3>

                {reviewSubmitted && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-800">Review submitted successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star rating selector */}
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-200 hover:text-amber-300'
                            }
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-stone-700">{reviewRating}.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Jane D."
                        required
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Your Review</label>
                    <textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Share your experience working with this vendor..."
                      rows={3}
                      required
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 transition"
                  >
                    <Send size={14} />
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════
               RIGHT SIDEBAR (1/3)
          ════════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── Date Availability Checker ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-3">Check Availability</h3>
              <div className="space-y-3">
                <input
                  type="date"
                  value={dateCheckValue}
                  onChange={(e) => { setDateCheckValue(e.target.value); setDateCheckResult(null) }}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                />
                <button
                  onClick={handleCheckAvailability}
                  disabled={!dateCheckValue}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Calendar size={14} />
                  Check Date
                </button>

                {dateCheckResult && (
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
                      dateCheckResult === 'available'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    {dateCheckResult === 'available' ? (
                      <>
                        <CheckCircle size={16} />
                        Date appears available - send an inquiry to confirm!
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={16} />
                        This date may be booked - contact vendor for waitlist.
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Lead Inquiry Form ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-1">Send Inquiry</h3>
              <p className="text-[10px] text-stone-500 mb-4 font-light">Get a direct response from {vendor.name}</p>

              {leadSubmitted && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-800">Inquiry sent! Expect a response soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmitLead} className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={leadContactName}
                    onChange={(e) => setLeadContactName(e.target.value)}
                    placeholder="Megan Fox"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Email *</label>
                  <input
                    type="email"
                    value={leadContactEmail}
                    onChange={(e) => setLeadContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={leadContactPhone}
                    onChange={(e) => setLeadContactPhone(e.target.value)}
                    placeholder="(414) 555-0000"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Event Date</label>
                  <input
                    type="date"
                    value={leadEventDate}
                    onChange={(e) => setLeadEventDate(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Budget</label>
                  <input
                    type="number"
                    value={leadBudget || ''}
                    onChange={(e) => setLeadBudget(Number(e.target.value))}
                    placeholder="5000"
                    min={0}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">Message *</label>
                  <textarea
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="Tell us about your event..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-stone-400 font-medium resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 transition"
                >
                  <Send size={14} />
                  Send Inquiry
                </button>
              </form>
            </div>

            {/* ── Contact Info ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {vendor.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-stone-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-stone-600 font-light">{vendor.address}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-stone-400 shrink-0" />
                    <a href={`tel:${vendor.phone}`} className="text-xs text-stone-900 hover:text-stone-600 font-medium transition">
                      {vendor.phone}
                    </a>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center gap-3">
                    <Globe size={14} className="text-stone-400 shrink-0" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-900 hover:text-stone-600 font-medium transition truncate">
                      {vendor.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-stone-400 shrink-0" />
                    <a href={`mailto:${vendor.email}`} className="text-xs text-stone-900 hover:text-stone-600 font-medium transition truncate">
                      {vendor.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social links */}
              {vendor.socials && vendor.socials.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mb-2">Social</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.socials.map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-stone-50 border border-stone-200 px-2.5 py-1 text-[10px] font-semibold text-stone-700 hover:bg-stone-100 transition"
                      >
                        {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Details Card ── */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Details</h3>
              <div className="space-y-3 text-xs">
                {vendor.priceRange && (
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-light">Price Range</span>
                    <span className="font-semibold text-stone-900">{vendor.priceRange}</span>
                  </div>
                )}
                {vendor.capacity && (
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-light">Capacity</span>
                    <span className="font-semibold text-stone-900">{vendor.capacity}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500 font-light">Deposit</span>
                  <span className="font-semibold text-stone-900">{vendor.depositPercent}%</span>
                </div>
                {vendor.serviceAreas && vendor.serviceAreas.length > 0 && (
                  <div>
                    <span className="text-stone-500 font-light text-[10px]">Service Areas</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {vendor.serviceAreas.map((area) => (
                        <span key={area} className="inline-flex rounded bg-stone-50 border border-stone-200 px-2 py-0.5 text-[9px] text-stone-600 font-mono">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Recommendations ── */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Similar Vendors</h3>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => onSelectVendor(rec.id)}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        {rec.coverUrl ? (
                          <img
                            src={rec.coverUrl}
                            alt={rec.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-stone-600 transition">
                          {rec.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="fill-black text-black" />
                          <span className="text-[10px] text-stone-500">{(rec.averageRating || 0).toFixed(1)}</span>
                          {rec.priceRange && (
                            <span className="text-[10px] text-stone-400 font-mono ml-1">{rec.priceRange}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
