import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Home,
  MapPin,
  Star,
  Bed,
  Bath,
  Users,
  Heart,
  Check,
  Shield,
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Snowflake,
  Shirt,
  Tv,
  Thermometer,
  Dumbbell,
  PawPrint,
  Umbrella,
  Flame,
  Calendar,
  Award,
  Clock,
  Banknote,
  Info,
  type LucideIcon,
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PropertyBookingSidebar } from '@/components/travel/PropertyBookingSidebar'
import {
  MOCK_PROPERTIES,
  getPropertyBySlug,
  ratingLabel,
  AMENITIES,
} from '@/data/travel-taxonomy'

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Snowflake,
  Shirt,
  Tv,
  Thermometer,
  Dumbbell,
  PawPrint,
  Umbrella,
  Flame,
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return MOCK_PROPERTIES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) {
    return {
      title: 'Property not found | Planviry Travel',
    }
  }
  return {
    title: `${property.title} | ${property.city}, ${property.stateCode} | Planviry Travel`,
    description: property.short_description,
  }
}

const GALLERY_GRADIENTS = [
  'from-sky-400 via-cyan-400 to-teal-400',
  'from-rose-400 via-pink-400 to-orange-400',
  'from-amber-400 via-yellow-500 to-orange-500',
  'from-emerald-500 via-green-500 to-lime-500',
  'from-fuchsia-500 via-purple-500 to-violet-500',
]

// Cleaning fee lookup by property type
const CLEANING_FEES: Record<string, number> = {
  hotel: 0,
  resort: 35,
  'vacation-home': 75,
  villa: 90,
  cabin: 50,
  cottage: 45,
  apartment: 40,
  'bed-and-breakfast': 0,
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) notFound()

  const ratingText = ratingLabel(property.rating)
  const totalReviews = property.reviews_breakdown.reduce((sum, r) => sum + r.count, 0)
  const cleaningFee = CLEANING_FEES[property.typeSlug] ?? 50

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <Link href="/travel" className="hover:text-black transition-colors">
              <span>Travel</span>
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <Link
              href={`/travel/destination/${property.citySlug}`}
              className="hover:text-black transition-colors"
            >
              <span>{property.city}</span>
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="text-black font-medium truncate max-w-[200px] sm:max-w-none">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Title + rating header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {property.is_loved_by_guests && (
                <span className="inline-flex items-center bg-gray-100 text-gray-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  Loved by Guests
                </span>
              )}
              <span className="inline-flex items-center bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                {property.type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
              {property.title}
            </h1>
            <p className="mt-1.5 text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {property.city}, {property.state}, {property.stateCode}
              </span>
              {property.distance_to_center && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{property.distance_to_center}</span>
                </>
              )}
              {property.distance_to_beach && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{property.distance_to_beach}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black border border-gray-300 hover:border-black rounded-lg px-3 py-2 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Save
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-[#003b95] text-white text-base font-black px-2.5 py-2 rounded-md flex flex-col items-center leading-none">
                <span>{property.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 leading-tight">
                  {ratingText}
                </span>
                <span className="text-xs text-gray-500 leading-tight">
                  {property.review_count.toLocaleString()} reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
          <div
            className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${property.gradient} sm:col-span-2 sm:row-span-2 sm:aspect-[16/10] relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-widest">
              Main view
            </span>
          </div>
          {GALLERY_GRADIENTS.slice(0, 4).map((g, i) => (
            <div
              key={i}
              className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${g} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Layout: content + sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Key details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 pb-6 border-b border-gray-200">
              <KeyDetail icon={Bed} label="Bedrooms" value={property.bedrooms.toString()} />
              <KeyDetail icon={Bath} label="Bathrooms" value={property.bathrooms.toString()} />
              <KeyDetail icon={Users} label="Max guests" value={property.max_guests.toString()} />
              <KeyDetail icon={Award} label="Property type" value={property.type} />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start h-auto p-0 overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm font-bold tracking-wide uppercase px-3 sm:px-4 py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="amenities"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm font-bold tracking-wide uppercase px-3 sm:px-4 py-3"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm font-bold tracking-wide uppercase px-3 sm:px-4 py-3"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm font-bold tracking-wide uppercase px-3 sm:px-4 py-3"
                >
                  House Rules
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs sm:text-sm font-bold tracking-wide uppercase px-3 sm:px-4 py-3"
                >
                  Map
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="pt-6 space-y-8">
                <Section title="Highlights">
                  <ul className="space-y-2">
                    {property.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#e87461] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="About this property">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </Section>

                <Section title="Rooms & beds">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.rooms.map((room, i) => (
                      <div
                        key={i}
                        className="p-4 border border-gray-200 rounded-xl bg-gray-50/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-sm text-black">{room.name}</h4>
                          <Bed className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="mt-1 text-xs font-bold text-gray-700">{room.beds}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{room.description}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="About the host">
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-black shrink-0">
                      {property.host_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-sm text-black">{property.host_name}</h4>
                        <Badge className="bg-[#e87461]/10 text-[#e87461] border border-[#e87461]/20 text-[10px] font-black uppercase tracking-widest">
                          Premier Host
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                        <span>Host since {property.host_since}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#e87461] text-[#e87461]" />
                          {property.host_rating.toFixed(1)} host rating
                        </span>
                      </p>
                      <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                        Responds within an hour on average. Has hosted thousands of happy guests
                        across the {property.city} area.
                      </p>
                    </div>
                  </div>
                </Section>

                <Section title="Where you will be">
                  <div className="relative aspect-[16/8] rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#e87461] flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <p className="mt-3 text-sm font-black text-gray-900">
                        {property.city}, {property.stateCode}
                      </p>
                      <p className="text-xs text-gray-500">Exact location provided after booking</p>
                    </div>
                  </div>
                </Section>
              </TabsContent>

              {/* AMENITIES */}
              <TabsContent value="amenities" className="pt-6">
                <Section title="Popular amenities">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {property.amenities.map((amenityName) => {
                      const am = AMENITIES.find((a) => a.name === amenityName)
                      const Icon = am ? AMENITY_ICONS[am.icon] : Check
                      return (
                        <div
                          key={amenityName}
                          className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-gray-700" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{amenityName}</span>
                        </div>
                      )
                    })}
                  </div>
                </Section>
              </TabsContent>

              {/* REVIEWS */}
              <TabsContent value="reviews" className="pt-6">
                <Section title="Reviews">
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 sm:w-48 shrink-0">
                      <div className="text-4xl font-black text-black">
                        {property.rating.toFixed(1)}
                      </div>
                      <div className="text-xs font-black text-gray-700 uppercase tracking-widest mt-1">
                        {ratingText}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {totalReviews.toLocaleString()} verified reviews
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {property.reviews_breakdown
                        .slice()
                        .sort((a, b) => b.rating - a.rating)
                        .map((r) => {
                          const pct = totalReviews > 0 ? (r.count / totalReviews) * 100 : 0
                          return (
                            <div key={r.rating} className="flex items-center gap-3">
                              <span className="text-xs font-black text-gray-900 w-12 shrink-0">
                                {r.rating} / 10
                              </span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#e87461] rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-12 text-right shrink-0">
                                {r.count}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Reviews are written by guests after their stay. All ratings and comments are
                      verified by Planviry Travel before publication.
                    </p>
                  </div>
                </Section>
              </TabsContent>

              {/* HOUSE RULES */}
              <TabsContent value="rules" className="pt-6 space-y-6">
                <Section title="House Rules">
                  <div className="space-y-2">
                    {property.house_rules.map((rule, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                          {rule.label}
                        </span>
                        <span className="text-sm text-gray-700 text-right">{rule.value}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Damage and incidentals">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-amber-900">
                          You will be asked to pay the following charges at the property:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-amber-800">
                          <li>- Refundable damage deposit: $200 (collected at check-in, refunded within 7 days of check-out)</li>
                          <li>- Cleaning fee: ${cleaningFee}</li>
                          <li>- Resort fee (if applicable): $25 per night</li>
                        </ul>
                        <p className="mt-2 text-xs text-amber-700">
                          These policies are determined by the property and may vary.
                        </p>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Important information">
                  <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-black text-gray-900">Check-in instructions:</span>{' '}
                        Guests receive an email with check-in instructions 24 hours before arrival.
                        Front desk staff will greet guests on arrival.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-black text-gray-900">Safety features:</span>{' '}
                        Smoke detectors, fire extinguisher, first aid kit, and carbon monoxide
                        detector are present on the property.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-black text-gray-900">Cancellation policy:</span>{' '}
                        Free cancellation up to 48 hours before check-in. After that, the first
                        night is non-refundable.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <PawPrint className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-black text-gray-900">Pets:</span>{' '}
                        {property.house_rules.find((r) => r.label === 'Pets')?.value ??
                          'Service animals welcome'}
                      </p>
                    </div>
                  </div>
                </Section>
              </TabsContent>

              {/* MAP */}
              <TabsContent value="map" className="pt-6">
                <Section title="Map & location">
                  <div className="relative aspect-[16/10] rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#e87461] flex items-center justify-center shadow-lg">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      <p className="mt-3 text-base font-black text-gray-900">
                        {property.city}, {property.state}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.distance_to_center ?? 'Location available after booking'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    The exact location will be shared once your booking is confirmed.
                  </p>
                </Section>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT SIDEBAR - sticky */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-20">
              <PropertyBookingSidebar property={property} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Small presentational helpers (server-safe)
   ──────────────────────────────────────────────────────────── */
function KeyDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="p-3 rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-black text-black truncate">{value}</p>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}
