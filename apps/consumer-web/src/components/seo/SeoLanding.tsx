'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Star,
  Phone,
  Mail,
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  ChevronDown,
  Plane,
  Shield,
  Award,
  ArrowRight,
  Sparkles,
  DollarSign,
  HelpCircle,
  Check,
  Building2,
  Search,
} from 'lucide-react';
import { AIRPORT_CITIES, US_STATES, VERTICALS } from '@/lib/planviry-data';
import { SEO_LOCATIONS } from '@/data/seo-locations';

/* ─── Vertical → SEO Service Slug Mapping ────────────────────────────────── */

const VERTICAL_SEO_SLUGS: Record<string, string> = {
  'venues-spaces': 'venues-in',
  'event-planning': 'event-planners-in',
  'catering-food': 'caterers-in',
  'entertainment': 'djs-parties-in',
  'production-tech': 'photographers-in',
  'decor-rentals': 'party-rentals-in',
  'beauty-attire': 'makeup-artists-in',
  'travel-lodging': 'limo-service-in',
};

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface SeoLandingProps {
  pageType: 'state' | 'city';
  stateSlug?: string;
  citySlug?: string;
}

/* ─── SEO Content Map (from user spec) ───────────────────────────────────── */

const SEO_CONTENT: Record<string, {
  title: string;
  badge: string;
  tagline: string;
  description: string;
  perks: string[];
}> = {
  'event-planner': {
    title: 'Professional Event Planners',
    badge: 'Elite Event Management',
    tagline: 'Meticulous coordination, creative design, and flawless execution for your milestone moments.',
    description: 'Connect with award-winning local planners who turn complex ideas into seamless, luxurious affairs. Whether organizing a high-profile corporate product launch or an intimate anniversary, these verified professionals manage every detail-from custom vendor curation and budget modeling to Day-Of coordination.',
    perks: [
      'End-to-End Coordination & Layout Design',
      'Extensive Local Vendor Networks & Contract Negotiations',
      'Sleek Timeline Planning & Emergency Contingency Management',
    ],
  },
  'party-planner': {
    title: 'Bespoke Party Planners',
    badge: 'Distinctive Social Gatherings',
    tagline: 'Designing immersive themes, sensory events, and unforgettable celebrations.',
    description: 'Make your upcoming social celebration the talk of the town. These specialized planners excel in creative thematic development, high-end decor installations, interactive entertainment bookings, and custom dessert table curations.',
    perks: [
      'Innovative Theme Curation & Visual Board Development',
      'Innovative Decor, Lighting, & Floral Integrations',
      'Premium DJ, Catering, & Live Entertainment Matchmaking',
    ],
  },
  'corporate-events': {
    title: 'Corporate Event Directors',
    badge: 'High-Impact Brand Activations',
    tagline: 'Precision production, polished hospitality, and flawless execution for professional events.',
    description: 'Elevate your brand presence, motivate your teams, and satisfy high-value clients. Our network of corporate specialists designs and manages summits, retreats, elegant reward galas, trade shows, and brand pop-ups.',
    perks: [
      'Full Technical AV & Staging Management',
      'Corporate Policy & ADA Compliance Integration',
      'Strategic Attendee Flow Metrics & High-End Catering Setup',
    ],
  },
  'small-venues': {
    title: 'Small Venues & Event Spaces',
    badge: 'Curated Intimate Spaces',
    tagline: 'Unique micro-venues and boutique settings that foster genuine connection and premium comfort.',
    description: 'Step away from cavernous spaces and elevate your event in styled boutique venues. From modern minimalist downtown high-rises to lush historic garden greenhouses, these intimate event spaces are ideal for private celebrations.',
    perks: [
      'Unique Architectural Aesthetics & Tailored Vibe',
      'In-House Premium Amenity Packages (WiFi, Sound, Kitchen)',
      'Flexible Capacities Perfect for 15 to 80 Guests',
    ],
  },
};

/* ─── Premium Vendors (from user spec) ───────────────────────────────────── */

const PREMIUM_VENDORS = [
  {
    id: 101,
    name: 'Sovereign Event Design',
    category: 'event-planner',
    rating: 5.0,
    reviews: 142,
    startingPrice: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?auto=format&fit=crop&q=80&w=800',
    verified: true,
    instant: true,
    badge: 'Top Rated Premium Planner',
    about: 'Sovereign specializing in high-contrast editorial-grade event production and styling for private clients.',
  },
  {
    id: 102,
    name: 'Vanguard Audio-Visual',
    category: 'corporate-events',
    rating: 4.9,
    reviews: 96,
    startingPrice: 1950,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    verified: true,
    instant: false,
    badge: 'Media Production Partner',
    about: 'Clean, broadcast-quality audio, precision staging, intelligent lighting, and seamless presentation streaming.',
  },
  {
    id: 103,
    name: 'Aura Intimate Penthouse',
    category: 'small-venues',
    rating: 4.8,
    reviews: 114,
    startingPrice: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    verified: true,
    instant: true,
    badge: 'Exclusive Curated Space',
    about: 'Sleek floor-to-ceiling glass design with beautiful natural light, custom designer furniture, and downtown views.',
  },
  {
    id: 104,
    name: 'Linen & Bloom Socials',
    category: 'party-planner',
    rating: 4.9,
    reviews: 73,
    startingPrice: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
    verified: false,
    instant: true,
    badge: 'Aesthetic Party Styling',
    about: 'Creating magical color stories, organic balloon arrangements, and custom photo ops.',
  },
  {
    id: 105,
    name: 'Atelier Table Catering',
    category: 'corporate-events',
    rating: 5.0,
    reviews: 81,
    startingPrice: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=800',
    verified: true,
    instant: false,
    badge: 'Artisanal Fine Dining',
    about: 'Custom-designed plated multi-course meals, corporate lunches, and molecular drink bars.',
  },
  {
    id: 106,
    name: 'Echoes Live Sound Co.',
    category: 'party-planner',
    rating: 4.7,
    reviews: 58,
    startingPrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
    verified: true,
    instant: true,
    badge: 'Premium Sound & DJ Mix',
    about: 'Interactive DJs and high-end sounds systems optimized for private events and dynamic celebrations.',
  },
];

/* ─── Localized Reviews (from user spec) ─────────────────────────────────── */

const LOCALIZED_REVIEWS = [
  {
    id: 1,
    customer: 'Eleanor H.',
    role: 'Corporate HR Lead',
    stars: 5,
    date: 'May 2026',
    comment: 'Having a physical, clear budget estimator right on the site gave us immediate confidence. The coordination with the planning team was flawless-10/10 level of detail and responsiveness!',
    type: 'Corporate Retreat',
  },
  {
    id: 2,
    customer: 'Michael S.',
    role: 'Private Client',
    stars: 5,
    date: 'April 2026',
    comment: 'Finding a micro-venue that matched our vision took weeks, until we searched here and found Aura Penthouse. The white-glove onboarding and pricing transparency are truly exceptional.',
    type: 'Milestone Anniversary',
  },
  {
    id: 3,
    customer: 'Clarissa K.',
    role: 'Brand Manager',
    stars: 5,
    date: 'June 2026',
    comment: 'The pricing estimates provided were incredibly accurate. Highly professional company, pristine communication patterns, and incredibly sleek workflow interfaces.',
    type: 'Product Launch Showcase',
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export function SeoLanding({ pageType, stateSlug, citySlug }: SeoLandingProps) {
  const [guestCount, setGuestCount] = useState<number>(50);
  const [serviceTier, setServiceTier] = useState<'standard' | 'premium'>('premium');
  const [eventDuration, setEventDuration] = useState<number>(6);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', notes: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number>(0);
  const [citySearch, setCitySearch] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);

  /* ── Data lookups ─────────────────────────────────────────────────────── */

  const airportCity = useMemo(() => {
    if (pageType === 'city' && citySlug) {
      // Try to find the city in AIRPORT_CITIES by slug (airport code like 'mke', 'ord')
      for (const stateGroup of AIRPORT_CITIES) {
        const found = stateGroup.airports.find(a => a.slug === citySlug);
        if (found) return found;
      }
    }
    return undefined;
  }, [pageType, citySlug]);

  const stateData = useMemo(() => {
    if (pageType === 'state' && stateSlug) {
      return US_STATES.find(s => s.slug === stateSlug);
    }
    if (pageType === 'city' && citySlug) {
      // First try SEO_LOCATIONS lookup
      const city = SEO_LOCATIONS.find(c => c.slug === citySlug);
      if (city) {
        const abbrToSlug: Record<string, string> = {};
        US_STATES.forEach(s => { abbrToSlug[s.abbr] = s.slug; });
        const sSlug = abbrToSlug[city.state];
        return US_STATES.find(s => s.slug === sSlug);
      }
      // Fallback: look up from AIRPORT_CITIES
      if (airportCity) {
        return US_STATES.find(s => s.slug === airportCity.stateSlug);
      }
    }
    return undefined;
  }, [pageType, stateSlug, citySlug, airportCity]);

  const cityData = useMemo(() => {
    if (pageType === 'city' && citySlug) {
      // First try SEO_LOCATIONS lookup (slugs like 'milwaukee-wi')
      const seoLoc = SEO_LOCATIONS.find(c => c.slug === citySlug);
      if (seoLoc) return seoLoc;
      // Fallback: construct from AIRPORT_CITIES data (slugs like 'mke')
      if (airportCity) {
        return {
          city: airportCity.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, ''),
          state: airportCity.stateAbbr,
          slug: airportCity.slug,
          displayName: `${airportCity.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '')}, ${airportCity.stateAbbr}`,
          lat: 0,
          lng: 0,
          zipCodes: [],
          primary: true,
        };
      }
    }
    return undefined;
  }, [pageType, citySlug, airportCity]);

  const airportHubs = useMemo(() => {
    if (!stateData) return [];
    return AIRPORT_CITIES.find(s => s.slug === stateData.slug)?.airports ?? [];
  }, [stateData]);

  /* ── Location name & stats ────────────────────────────────────────────── */

  const locationName = useMemo(() => {
    if (pageType === 'state' && stateData) return stateData.name;
    if (pageType === 'city' && cityData) return cityData.displayName;
    return 'Your Area';
  }, [pageType, stateData, cityData]);

  const vendorCount = useMemo(() => {
    if (pageType === 'state') return airportHubs.length * 8;
    return 48;
  }, [pageType, airportHubs]);

  const reviewCount = useMemo(() => {
    if (pageType === 'state') return airportHubs.length * 47;
    return 230;
  }, [pageType, airportHubs]);

  const regionalCenter = useMemo(() => {
    if (pageType === 'state' && airportHubs.length > 0) {
      return airportHubs[0].name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '');
    }
    if (pageType === 'city' && cityData) return cityData.city;
    return '';
  }, [pageType, airportHubs, cityData]);

  /* ── SEO content (default to event-planner) ──────────────────────────── */

  const content = SEO_CONTENT['event-planner'];

  /* ── All cities in this state (for state pages) ─────────────────────────── */

  const allStateCities = useMemo(() => {
    if (pageType !== 'state' || !stateData) return [];
    return SEO_LOCATIONS.filter(loc => loc.state === stateData.abbr)
      .sort((a, b) => {
        // Primary cities first, then alphabetically
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return a.city.localeCompare(b.city);
      });
  }, [pageType, stateData]);

  const filteredStateCities = useMemo(() => {
    if (!citySearch.trim()) return allStateCities;
    const q = citySearch.toLowerCase().trim();
    return allStateCities.filter(loc =>
      loc.city.toLowerCase().includes(q) || loc.displayName.toLowerCase().includes(q)
    );
  }, [allStateCities, citySearch]);

  /* ── Budget calculation (from user spec) ──────────────────────────────── */

  const estimatedCost = useMemo(() => {
    const baseRate = 250;
    const tierMultiplier = serviceTier === 'premium' ? 1.6 : 1.0;
    const sizeAddon = guestCount * 12;
    const hourlyCost = eventDuration * 80;
    return Math.round((baseRate + sizeAddon + hourlyCost) * tierMultiplier);
  }, [guestCount, serviceTier, eventDuration]);

  /* ── FAQ data ──────────────────────────────────────────────────────────── */

  const faqs = [
    {
      q: `What is the typical booking window for ${content.title} in ${locationName}?`,
      a: `For peak seasons in ${locationName}, we recommend booking at least 6 to 9 months in advance. High-end venues and elite creative planning houses fill up quickly. However, our platform also showcases verified partners offering customizable consultation rounds to match your timeline.`,
    },
    {
      q: 'Can partners adapt to specialized municipal safety guidelines?',
      a: 'Absolutely. Every partner listed on this platform is verified and adheres to strict local sanitation, staging safety guidelines, and event licensing codes. Planners will coordinate any local permits required for public setups or private outdoor structural assembly.',
    },
    {
      q: 'Who controls vendor rates and package services?',
      a: 'Every verified vendor independently defines, adjusts, and manages their own custom packages, rates, and terms. Our self-guided planning tool is designed exclusively to help couples and corporate hosts outline baseline budgets before requesting official proposals.',
    },
  ];

  /* ── Form submit handler ──────────────────────────────────────────────── */

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  /* ── Not found check ──────────────────────────────────────────────────── */

  if ((pageType === 'state' && !stateData) || (pageType === 'city' && !cityData)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Location Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find the page you&apos;re looking for.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
            Go Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="bg-white text-gray-900 selection:bg-teal-100">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - White premium design with dot pattern
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#0dd6b0_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Main Hero Copy */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/50 rounded-full text-teal-800 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              {content.badge} &bull; Verified Partner Network
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              {content.title}{' '}
              <span className="text-teal-500 font-extrabold block md:inline">In {locationName}</span>
            </h1>

            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
              {content.tagline} {content.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#local-pricing-tool"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold tracking-wide rounded-full shadow-md shadow-teal-500/10 hover:shadow-lg transition-all duration-300 flex items-center gap-2 group text-sm"
              >
                Plan Event Budget Guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#consultation-inbox"
                className="px-6 py-3 border-2 border-gray-200 hover:border-gray-900 text-gray-800 hover:text-black font-bold rounded-full transition-all duration-200 text-sm"
              >
                Book Custom Matchmaking
              </a>
            </div>
          </div>

          {/* Location Statistics Card */}
          <div className="w-full md:w-96 bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative mt-8 md:mt-0">
            <div className="absolute top-4 right-4 p-1.5 bg-teal-500 text-white rounded-full">
              <Award className="w-4 h-4" />
            </div>

            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Location Statistics</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">{locationName}</h3>

            <div className="divide-y divide-gray-200 text-sm mt-4 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-500" /> Regional Center</span>
                <span className="text-gray-900 font-bold">{regionalCenter || locationName} Area</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><Shield className="w-4 h-4 text-teal-500" /> Active Pros</span>
                <span className="text-gray-900 font-bold">{vendorCount} Verified Partners</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4">
                <span className="text-gray-500 font-medium flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-teal-500" /> Average Project Size</span>
                <span className="text-teal-600 font-bold">$$ to $$$$ (Custom Quote)</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-700">A</div>
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700">M</div>
                <div className="w-8 h-8 rounded-full bg-teal-50 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-600">S</div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Over {reviewCount} local reviews matched in this {pageType === 'state' ? 'state' : 'city'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BROWSE BY CATEGORY (State pages)
          ═══════════════════════════════════════════════════════════════════ */}
      {pageType === 'state' && stateData && allStateCities.length > 0 && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-5">
              Browse Categories in {stateData.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {VERTICALS.map(v => {
                const seoSlug = VERTICAL_SEO_SLUGS[v.slug]
                const firstCity = allStateCities[0]
                return (
                  <Link
                    key={v.slug}
                    href={seoSlug && firstCity ? `/seo/${seoSlug}/${firstCity.slug}` : '#'}
                    className="group p-5 border border-gray-200 hover:border-black transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors mb-3">
                      <Building2 size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-black group-hover:underline mb-1">{v.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{v.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-black mt-2 transition-colors">
                      Browse <ArrowRight size={11} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BROWSE BY CATEGORY (City pages only)
          ═══════════════════════════════════════════════════════════════════ */}
      {pageType === 'city' && cityData && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-5">
              Browse Categories in {cityData.city}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {VERTICALS.map(v => {
                const seoSlug = VERTICAL_SEO_SLUGS[v.slug]
                return (
                  <Link
                    key={v.slug}
                    href={seoSlug ? `/seo/${seoSlug}/${cityData.slug}` : '#'}
                    className="group p-5 border border-gray-200 hover:border-black transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors mb-3">
                      <Building2 size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-black group-hover:underline mb-1">{v.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{v.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-black mt-2 transition-colors">
                      Browse <ArrowRight size={11} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PERKS / WHY HIRE SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why Hire Verified Local Partners?</h2>
            <p className="text-gray-500 font-medium">Bypass endless scrolling and hire with deep absolute trust. Our curated network is built with quality and absolute transparency at its center.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.perks.map((perk, index) => (
              <div key={index} className="bg-white border border-gray-100 p-8 rounded-3xl transition-shadow duration-300 hover:shadow-lg flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{perk.split(' & ')[0]}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Highly experienced local specialists that handle resource optimization, vendor logistics, layouts, and day-of support, aligned perfectly for {locationName}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VERIFIED VENDOR LISTINGS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Verified Listings in <span className="text-teal-500">{locationName}</span>
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Handpicked local companies matched with your specific search query.</p>
            </div>
            <Link
              href="/vendors"
              className="text-teal-500 hover:text-teal-600 font-bold inline-flex items-center gap-1.5 mt-4 md:mt-0 hover:underline text-sm"
            >
              View entire directory map ({PREMIUM_VENDORS.length + 3} more) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PREMIUM_VENDORS.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white border border-gray-200 hover:border-teal-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div className="relative overflow-hidden h-52">
                  <Image
                    src={vendor.imageUrl}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {vendor.verified && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white border border-gray-100 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Multi-Verified
                    </span>
                  )}
                  {vendor.instant && (
                    <span className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                      Instant Book
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600">{vendor.badge}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{vendor.rating}</span>
                        <span className="text-xs font-medium text-gray-400">({vendor.reviews})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-teal-500 transition-colors">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">{vendor.about}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold uppercase block">Budget Class</span>
                      <span className="text-base font-bold text-gray-900">$$$ (Custom Quote)</span>
                    </div>
                    <Link
                      href="/vendors"
                      className="px-4 py-2 bg-gray-50 hover:bg-teal-500 border border-gray-200 hover:border-teal-500 rounded-full text-sm font-bold text-gray-800 hover:text-white transition-all duration-200"
                    >
                      Connect Pros
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SELF-GUIDED BUDGET CALCULATOR
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="local-pricing-tool" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Context Copy */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-500">Event Budget Planner</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Self-Guided Budgeting Tool for{' '}
                <span className="font-extrabold block">{content.title} in {locationName}</span>
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Our database does not dictate professional rates. Individual verified vendors completely set and control their custom quotes based on season, date, and layout specs. Use this calculator to simulate a realistic total event budget allocation based on typical localized benchmarks in {locationName}.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white rounded-full text-teal-500 shadow-sm mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                  <p className="text-sm text-gray-600 font-semibold">Self-guided visualization helper based on local benchmarks</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white rounded-full text-teal-500 shadow-sm mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                  <p className="text-sm text-gray-600 font-semibold">Helps define and allocate resources prior to final custom quoting</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-white rounded-full text-teal-500 shadow-sm mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                  <p className="text-sm text-gray-600 font-semibold">Directly connected to local partner review logs and metrics</p>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-3xl shadow-sm space-y-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-teal-400 to-emerald-500" />

              <div className="space-y-6">
                {/* Slider 1: Guest count */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-teal-500" /> Expected Guest Size
                    </label>
                    <span className="text-sm font-extrabold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{guestCount} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-semibold mt-1">
                    <span>10 guests</span>
                    <span>500+ guests</span>
                  </div>
                </div>

                {/* Tier Selection: Standard vs Luxury */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-500" /> Event Execution Tier
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceTier('standard')}
                      className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 text-center transition-all ${
                        serviceTier === 'standard'
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-white border-gray-200 hover:border-gray-900 text-gray-500 font-medium'
                      }`}
                    >
                      <span className="text-sm uppercase tracking-wide block mb-1">Standard</span>
                      <span className="text-xs opacity-75">Verified Standard Pros</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceTier('premium')}
                      className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 text-center transition-all ${
                        serviceTier === 'premium'
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-900 text-gray-500 font-medium'
                      }`}
                    >
                      <span className="text-sm uppercase tracking-wide block mb-1">Luxury</span>
                      <span className="text-xs opacity-75">Award-Winning Elite</span>
                    </button>
                  </div>
                </div>

                {/* Slider 2: Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-500" /> Booking/Service Duration
                    </label>
                    <span className="text-sm font-extrabold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{eventDuration} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={eventDuration}
                    onChange={(e) => setEventDuration(Number(e.target.value))}
                    className="w-full accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-semibold mt-1">
                    <span>2 hours</span>
                    <span>24-hour full reserve</span>
                  </div>
                </div>
              </div>

              {/* Aggregated Output Panel */}
              <div className="bg-gray-50 border border-gray-200/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Target Allocation Projection</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl md:text-4xl font-black text-gray-900">${estimatedCost.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 font-bold">est. guidance</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold mt-1">A self-guided budget design placeholder. Partners define custom pricing.</p>
                </div>
                <a
                  href="#consultation-inbox"
                  className="w-full md:w-auto px-6 py-3 bg-[#0a0a0a] hover:bg-teal-500 text-white font-bold leading-normal rounded-full transition-all text-sm whitespace-nowrap"
                >
                  Request Custom Quotes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          EVENT SUCCESS STORIES / TESTIMONIALS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Event Success Stories</h2>
            <p className="text-gray-500 font-medium">Read testimonials from high-profile client hosts and corporate organizers in your sector.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LOCALIZED_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-gray-50 border border-gray-200 p-8 rounded-3xl relative">
                <div className="flex gap-1 text-teal-400 mb-4">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-gray-700 italic leading-relaxed mb-6">&ldquo;{rev.comment}&rdquo;</p>

                <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm">{rev.customer}</h4>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{rev.role}</span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-600 bg-teal-50/50 px-2.5 py-1 rounded-full border border-teal-100">
                    {rev.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ ACCORDION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 mt-2 font-medium">Clear answers to your vital booking questions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-teal-500' : ''}`} />
                </button>

                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 text-sm text-gray-600 leading-relaxed font-semibold">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DARK CONSULTATION FORM (from user spec)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="consultation-inbox" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#050505] text-white rounded-[32px] p-8 md:p-16 relative overflow-hidden text-center shadow-lg space-y-8">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Find Your Perfect Event Planner Match</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                Provide your basic detail specs below. Our marketplace coordinators will match you with the absolute ideal verified solutions in {locationName}. Completely complimentary, no-obligation callback.
              </p>
            </div>

            {formSubmitted ? (
              <div className="relative z-10 bg-teal-500/20 border border-teal-500/30 p-6 rounded-2xl max-w-lg mx-auto text-center space-y-2">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto text-white">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-bold text-xl">Consultation Query Received!</h3>
                <p className="text-sm text-gray-300">Our concierge representative is compiling estimates with verified local premium operators now. Check your inbox within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Charlotte Evans"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/25 focus:border-teal-500 focus:outline-none p-3.5 rounded-xl text-white placeholder-gray-500 text-sm font-medium transition-colors"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="E.g., corporate@brand.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/25 focus:border-teal-500 focus:outline-none p-3.5 rounded-xl text-white placeholder-gray-500 text-sm font-medium transition-colors"
                  />
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Event Date (Anticipated)</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/25 focus:border-teal-500 focus:outline-none p-3.5 rounded-xl text-white placeholder-gray-500 text-sm font-medium transition-colors"
                  />
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Custom Notes / Unique Requirements</label>
                  <textarea
                    placeholder="Describe specific themes, layout demands, or styling vibes..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/25 focus:border-teal-500 focus:outline-none p-3.5 rounded-xl text-white placeholder-gray-500 text-sm font-medium transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-1 md:col-span-2 mt-4 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold leading-normal rounded-xl transition-all duration-200 text-center shadow-lg shadow-teal-500/20 hover:shadow-xl"
                >
                  Send Consultation Intake Match List
                </button>
              </form>
            )}

            <div className="relative z-10 pt-4 flex justify-center items-center gap-6 text-xs text-gray-400 font-semibold">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-teal-500" /> Secure Data Privacy</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-teal-500" /> Multi-Award Verified Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ALL CITIES IN THIS STATE (STATE PAGES ONLY)
          ═══════════════════════════════════════════════════════════════════ */}
      {pageType === 'state' && stateData && allStateCities.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                All Cities in <span className="text-teal-500">{stateData.name}</span>
              </h2>
              <p className="text-gray-500 mt-3">
                Browse event vendors in any city across {stateData.name}. {allStateCities.length} cities available.
              </p>
            </div>

            {/* City search/filter */}
            {allStateCities.length > 20 && (
              <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => { setCitySearch(e.target.value); setShowAllCities(true) }}
                  placeholder={`Search cities in ${stateData.name}...`}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                />
                {citySearch && (
                  <button type="button" onClick={() => setCitySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {(showAllCities ? filteredStateCities : filteredStateCities.slice(0, 36)).map(loc => (
                <Link
                  key={loc.slug}
                  href={`/explore/city/${loc.slug}`}
                  className="group flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-black hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors shrink-0 rounded-lg">
                    <MapPin size={14} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-black group-hover:text-teal-600 truncate transition-colors">{loc.city}</h3>
                    <p className="text-[10px] text-gray-400">{loc.state}</p>
                  </div>
                </Link>
              ))}
            </div>

            {!showAllCities && filteredStateCities.length > 36 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllCities(true)}
                  className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1 transition-colors px-6 py-2.5 border border-gray-200 rounded-full hover:border-black"
                >
                  Show All {filteredStateCities.length} Cities <ArrowRight size={13} />
                </button>
              </div>
            )}
            {showAllCities && filteredStateCities.length > 36 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setShowAllCities(false); setCitySearch('') }}
                  className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1 transition-colors px-6 py-2.5 border border-gray-200 rounded-full hover:border-black"
                >
                  Show Less <ChevronDown className="w-3 h-3 rotate-180" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          AIRPORT HUB LINKS (STATE PAGES ONLY)
          ═══════════════════════════════════════════════════════════════════ */}
      {pageType === 'state' && airportHubs.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold mb-3">
                <Plane className="w-4 h-4" /> Regional Hubs
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Explore Regional Airport Hubs in {stateData?.name}
              </h2>
              <p className="text-gray-500 mt-3">
                Find event vendors near major transportation hubs across {stateData?.name}.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {airportHubs.map(hub => {
                const hubCityName = hub.name.replace(/\s*(International\s*)?Airport\s*$/i, '').replace(/\s*Regional\s*$/i, '');
                return (
                  <Link
                    key={hub.slug}
                    href={`/explore/city/${hub.slug}`}
                    className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 text-teal-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                        {hubCityName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-teal-500">{hub.code}</span> &middot; {hub.name}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CITY PAGES - Explore Nearby Cities
          ═══════════════════════════════════════════════════════════════════ */}
      {pageType === 'city' && cityData && stateData && (
        <section className="py-10 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-5">
              Explore Nearby Cities in {stateData.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {SEO_LOCATIONS
                .filter(loc => loc.state === stateData.abbr && loc.slug !== cityData.slug)
                .slice(0, 8)
                .map(loc => (
                  <Link
                    key={loc.slug}
                    href={`/explore/city/${loc.slug}`}
                    className="group flex items-center gap-3 p-4 border border-gray-200 hover:border-black transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-black group-hover:underline truncate">{loc.city}</h3>
                      <p className="text-xs text-gray-500">{loc.displayName}</p>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 group-hover:text-black ml-auto shrink-0 transition-colors" />
                  </Link>
                ))
              }
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/explore/state/${stateData.slug}`}
                className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1 transition-colors"
              >
                View all cities in {stateData.name} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CONTACT QUICK BAR
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Ready to plan your event in {locationName}?</h3>
            <p className="text-gray-400 text-sm mt-1">Get connected with top local vendors today.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+18005551234"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Us
            </a>
            <a
              href="mailto:hello@planviry.com"
              className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors"
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
