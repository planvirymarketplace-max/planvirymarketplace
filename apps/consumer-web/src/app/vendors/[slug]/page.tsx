import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getVendorBySlug, getAllVendorSlugs, type VendorSummary } from '@/lib/static-data'
import { getVerticalBySlug } from '@/lib/planviry-data'
import {
  Star, MapPin, Globe, Phone, Mail, ChevronRight,
  ShieldCheck, ArrowLeft, Building2, DollarSign,
} from 'lucide-react'

// ─── ISR Configuration ──────────────────────────────────────────────────────
export const revalidate = 1800 // 30 minutes
export const dynamicParams = true

// ─── Static Params from Supabase ────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllVendorSlugs()
  return slugs.map(slug => ({ slug }))
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const vendor = await getVendorBySlug(slug)
  if (!vendor) return {}

  const title = `${vendor.businessName} - ${vendor.subCategory || vendor.category} in ${vendor.city}, ${vendor.state} | Planviry`
  const description = vendor.description
    ? vendor.description.slice(0, 155) + (vendor.description.length > 155 ? '…' : '')
    : `Book ${vendor.businessName} for your next event on Planviry.`

  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/vendors/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://planviry.com/vendors/${slug}`,
      siteName: 'Planviry',
      type: 'website',
      ...(vendor.imageUrl ? { images: [{ url: vendor.imageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Star Rating ────────────────────────────────────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={16}
          className={
            n <= Math.round(rating)
              ? 'fill-black text-black'
              : 'text-gray-300'
          }
        />
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vendor = await getVendorBySlug(slug)
  if (!vendor) return notFound()

  const vertical = getVerticalBySlug(vendor.verticalSlug)
  const location = [vendor.city, vendor.state].filter(Boolean).join(', ')

  return <AppLayoutShell>
    <div className="bg-white">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={13} className="text-gray-400" />
          {vertical && (
            <>
              <Link href={`/${vertical.slug}`} className="hover:text-black transition-colors">{vertical.name}</Link>
              <ChevronRight size={13} className="text-gray-400" />
            </>
          )}
          <span className="text-black truncate">{vendor.businessName}</span>
        </div>
      </div>

      {/* ── Cover image ── */}
      {vendor.imageUrl && (
        <div className="relative h-[240px] sm:h-[320px] bg-gray-100 overflow-hidden">
          <img
            src={vendor.imageUrl}
            alt={`${vendor.businessName} cover`}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Business identity */}
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {vendor.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-0.5 text-[9px] font-bold text-gray-600 uppercase tracking-wider">
                      <ShieldCheck size={9} /> Verified
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
                  {vendor.businessName}
                </h1>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {vendor.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={vendor.rating} />
                      <span className="font-bold text-black text-sm">{vendor.rating.toFixed(1)}</span>
                      {vendor.reviewCount > 0 && (
                        <span className="text-gray-500 text-sm">({vendor.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                  {vendor.priceRange && (
                    <span className="font-semibold text-gray-500 text-sm">{vendor.priceRange}</span>
                  )}
                  {location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={12} /><span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category & Sub-category */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-gray-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Category</span>
                </div>
                <span className="text-sm font-medium text-black">{vendor.category}</span>
                {vendor.subCategory && (
                  <>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-black">{vendor.subCategory}</span>
                  </>
                )}
              </div>
              {vendor.priceRange && (
                <div className="flex items-center gap-2 mt-3">
                  <DollarSign size={14} className="text-gray-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Pricing</span>
                  <span className="text-sm font-medium text-black">{vendor.priceRange}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {vendor.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-3">About</h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{vendor.description}</p>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <MapPin size={13} /> Location
                </h2>
                <p className="text-gray-700 text-sm">{vendor.city}, {vendor.state}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vendor.businessName} ${vendor.city} ${vendor.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-gray-600 hover:text-black mt-2 inline-block"
                >
                  Get Directions &rarr;
                </a>
              </div>
            )}
          </div>

          {/* ── Sidebar / CTA column ── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Contact card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">Contact</h2>
              <Link
                href={`/booking?vendor=${vendor.slug}`}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Request a Quote
              </Link>
              <Link
                href={`/booking?vendor=${vendor.slug}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Check Availability
              </Link>
            </div>

            {/* Trust signals */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-2.5">
              {[
                vendor.isVerified && 'Verified business',
                vendor.rating > 0 && `${vendor.reviewCount}+ reviews`,
              ].filter(Boolean).map(item => (
                <div key={String(item)} className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck size={14} className="text-gray-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Back to category */}
            {vertical && (
              <Link
                href={`/${vertical.slug}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
              >
                <ArrowLeft size={13} /> Back to {vertical.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── JSON-LD structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: vendor.businessName,
            url: `https://planviry.com/vendors/${vendor.slug}`,
            ...(vendor.imageUrl ? { image: vendor.imageUrl } : {}),
            address: {
              '@type': 'PostalAddress',
              addressLocality: vendor.city,
              addressRegion: vendor.state,
              addressCountry: 'US',
            },
            ...(vendor.rating > 0 ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: vendor.rating,
                reviewCount: vendor.reviewCount,
              },
            } : {}),
          }),
        }}
      />
    </div>
  </AppLayoutShell>

}
