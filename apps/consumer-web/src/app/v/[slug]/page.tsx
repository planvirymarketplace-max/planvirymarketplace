import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { SEO_CATEGORIES, getSeoCategoriesByDbCategory, resolveSeoCategory } from '@/lib/seo-categories';
import { hydrateVendorProfile } from '@/lib/vendor-profile-hydration';
import type { HydratedVendorProfile } from '@/lib/vendor-profile-types';
import VendorProfileClient from '@/components/vendor/VendorProfileClient';
import { BreadcrumbJsonLd, type BreadcrumbItem } from '@/components/seo/Breadcrumb';
import { findMockVendorBySlug, generateVendorFromSlug } from '@/data/mock-vendors';
import { categoryNameToVerticalSlug } from '@/lib/routes';
import { US_STATES, ALL_AIRPORTS } from '@/lib/planviry-data';

// ─────────────────────────────────────────────────────────────────────────────
// REVALIDATION - ISR every 6 hours
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 21600; // 6 hours

/* ────────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────────── */

interface VendorRow {
  id: string;
  slug: string;
  business_name: string;
  tagline: string | null;
  bio: string | null;
  category_id: string | null;
  listing_id: string | null;
  status: string;
  profile_published: boolean;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  social_links: Record<string, string> | null;
  logo_url: string | null;
  hero_image_url: string | null;
  home_zip: string | null;
  home_lat: number | null;
  home_lng: number | null;
  service_radius_miles: number;
  avg_review_rating: number;
  review_count: number;
  kyc_status: string;
  kyb_status: string;
  profile_completeness_score: number;
  created_at: string;
  updated_at: string;
}

interface ListingRow {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_claimed: boolean;
  tags: string[] | null;
  avg_rating: number | null;
  review_count: number;
  category_primary: string | null;
  planviry_vertical: string | null;
  planviry_sub_category: string | null;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  planviry_vertical: string;
  parent_id: string | null;
}

interface PortfolioRow {
  id: string;
  media_url: string;
  media_type: string | null;
  caption: string | null;
  sort_order: number;
}

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

/* ────────────────────────────────────────────────────────────────────────────
   Supabase guard
   ──────────────────────────────────────────────────────────────────────────── */

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Data helpers
   ──────────────────────────────────────────────────────────────────────────── */

async function getVendorBySlug(slug: string): Promise<{
  hydrated: HydratedVendorProfile;
  categoryName: string;
  seoSlug: string | null;
} | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();

  // 1. Fetch the vendor row
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (vendorError || !vendor) return null;

  const v = vendor as VendorRow;

  // 2. Fetch portfolio (gallery)
  const { data: portfolioData } = await supabase
    .from('vendor_portfolios')
    .select('id, media_url, media_type, caption, sort_order')
    .eq('vendor_id', v.id)
    .order('sort_order', { ascending: true });

  const gallery = (portfolioData ?? []) as PortfolioRow[];

  // 3. Fetch category name
  let categoryName = '';
  let categorySlug = '';
  if (v.category_id) {
    const { data: cat } = await supabase
      .from('categories')
      .select('name, slug, planviry_vertical')
      .eq('id', v.category_id)
      .single();
    if (cat) {
      const c = cat as CategoryRow;
      categoryName = c.name || '';
      categorySlug = c.slug || '';
    }
  }

  // 4. Fetch listing for address, tags, is_claimed
  let listing: ListingRow | null = null;
  if (v.listing_id) {
    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', v.listing_id)
      .single();
    if (listingData) listing = listingData as ListingRow;
  }

  // 5. Build social links
  const socialLinks = v.social_links ?? {};
  const socials = Object.entries(socialLinks).map(([platform, url]) => ({
    platform,
    url,
  }));

  // 6. Build address
  const address = listing
    ? [listing.city, listing.state].filter(Boolean).join(', ')
    : null;

  // 7. Tags from listing
  const tags = listing?.tags ?? [];

  // 8. Price range
  let priceRange: string | null = null;
  try {
    const { data: packages } = await supabase
      .from('vendor_packages')
      .select('base_price')
      .eq('vendor_id', v.id)
      .eq('is_active', true)
      .order('base_price', { ascending: true })
      .limit(1);
    if (packages && packages.length > 0) {
      priceRange = `From $${Number(packages[0].base_price).toFixed(0)}`;
    }
  } catch { /* ignore */ }

  // 9. Hydrate
  const raw = {
    id: v.id,
    slug: v.slug,
    name: v.business_name,
    bio: v.bio,
    category: categoryName || v.category_id || '',
    categoryName,
    address,
    city: listing?.city || null,
    state: listing?.state || null,
    zip: listing?.zip || v.home_zip || null,
    lat: v.home_lat,
    lng: v.home_lng,
    serviceRadiusMiles: v.service_radius_miles,
    phone: v.contact_phone,
    email: v.contact_email,
    website: v.website,
    imageUrl: v.hero_image_url,
    coverUrl: v.hero_image_url,
    logoUrl: v.logo_url,
    isClaimed: listing?.is_claimed ?? false,
    isPublished: v.profile_published,
    isFeatured: false,
    isVerified: v.kyc_status === 'verified' || v.kyb_status === 'verified',
    rating: v.avg_review_rating || 0,
    reviewCount: v.review_count || 0,
    priceRange,
    serviceAreas: [],
    tags,
    socials,
    gallery: gallery.map(g => ({
      id: g.id,
      storagePath: g.media_url,
      caption: g.caption,
    })),
  };

  const hydrated = hydrateVendorProfile(raw);

  // Get SEO slug for breadcrumbs
  const seoMatches = getSeoCategoriesByDbCategory(categoryName);
  const seoSlug = seoMatches.length > 0 ? seoMatches[0].slug : (categorySlug || null);

  return { hydrated, categoryName, seoSlug };
}

async function getRelatedVendors(slug: string, categoryId: string | null): Promise<{
  id: string;
  slug: string;
  name: string;
  priceRange: string | null;
  rating: number;
  reviewCount: number;
  categoryName: string;
  imageUrl: string | null;
}[]> {
  if (!isSupabaseConfigured() || !categoryId) return [];

  try {
    const supabase = createAdminClient();

    const { data: relatedVendors } = await supabase
      .from('vendors')
      .select('id, slug, business_name, hero_image_url, profile_published')
      .eq('category_id', categoryId)
      .eq('profile_published', true)
      .neq('slug', slug)
      .limit(4);

    if (!relatedVendors || relatedVendors.length === 0) return [];

    // Get category name
    let catName = '';
    const { data: cat } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();
    if (cat) catName = (cat as { name: string }).name;

    return relatedVendors.map((rv: Record<string, unknown>) => ({
      id: rv.id as string,
      slug: rv.slug as string,
      name: rv.business_name as string,
      priceRange: null,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 30) + 1,
      categoryName: catName,
      imageUrl: (rv.hero_image_url as string) || null,
    }));
  } catch {
    return [];
  }
}

function getSeoSlugForCategory(category: string): string | null {
  const matches = getSeoCategoriesByDbCategory(category);
  const core = matches.find((c) => c.dbCategories.length === 1);
  if (core) return core.slug;
  return matches[0]?.slug ?? null;
}

function getCategoryShort(category: string): string {
  const seoCat = getSeoCategoriesByDbCategory(category);
  const core = seoCat.find((c) => c.dbCategories.length === 1);
  if (core) {
    return core.title.replace(/\s+in\s+Milwaukee,?\s*WI$/i, '').trim();
  }
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Build spec-compliant breadcrumb items.
 * Pattern: /[state]/[city]/[vertical]
 * Example: /tennessee/memphis/production-tech
 *
 * Breadcrumb: Home > State > City > Category > [Vendor Name]
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Resolve a vendor.state value (full name or abbreviation) to
 * the canonical state record from planviry-data.
 */
function resolveState(state: string): { name: string; slug: string } | null {
  // Try abbreviation first (most vendors store "TN", "WI", etc.)
  const byAbbr = US_STATES.find(s => s.abbr === state.toUpperCase());
  if (byAbbr) return { name: byAbbr.name, slug: byAbbr.slug };
  // Try full name
  const byName = US_STATES.find(s => s.name === state || slugify(s.name) === slugify(state));
  if (byName) return { name: byName.name, slug: byName.slug };
  // Try slug
  const bySlug = US_STATES.find(s => s.slug === slugify(state));
  if (bySlug) return { name: bySlug.name, slug: bySlug.slug };
  return null;
}

/**
 * Resolve a vendor.city + state to the canonical city record from
 * planviry-data (which uses airport-code slugs).
 */
function resolveCity(city: string, stateSlug: string): { name: string; slug: string } | null {
  // Match by city name + stateSlug in the airports/cities list
  const match = ALL_AIRPORTS.find(
    a => a.stateSlug === stateSlug && a.name === city
  );
  if (match) return { name: match.name, slug: match.slug };
  // Fuzzy: slugify the city name and try matching
  const cityNorm = slugify(city);
  const fuzzy = ALL_AIRPORTS.find(
    a => a.stateSlug === stateSlug && slugify(a.name) === cityNorm
  );
  if (fuzzy) return { name: fuzzy.name, slug: fuzzy.slug };
  return null;
}

function buildBreadcrumbItems(vendor: HydratedVendorProfile): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // Resolve state - use full name slug (e.g. /tennessee not /tn)
  const stateInfo = vendor.state ? resolveState(vendor.state) : null;

  if (stateInfo) {
    items.push({ label: stateInfo.name, href: `/${stateInfo.slug}` });
  } else if (vendor.state) {
    // Fallback: slugify whatever we have
    const stateSlug = slugify(vendor.state);
    items.push({ label: vendor.state, href: `/${stateSlug}` });
  }

  // Resolve city - use the slug from planviry-data (airport code or city name)
  const cityInfo = vendor.city && stateInfo
    ? resolveCity(vendor.city, stateInfo.slug)
    : null;

  if (cityInfo && stateInfo) {
    items.push({ label: cityInfo.name, href: `/${stateInfo.slug}/${cityInfo.slug}` });
  } else if (vendor.city && stateInfo) {
    // Fallback: slugify city name
    const citySlug = slugify(vendor.city);
    items.push({ label: vendor.city, href: `/${stateInfo.slug}/${citySlug}` });
  }

  // Category (vertical) - per spec: /[state]/[city]/[vertical]
  const catName = vendor.categoryName || vendor.category;
  const verticalSlug = categoryNameToVerticalSlug(catName);
  const effectiveStateSlug = stateInfo?.slug ?? (vendor.state ? slugify(vendor.state) : null);
  const effectiveCitySlug = cityInfo?.slug ?? (vendor.city ? slugify(vendor.city) : null);
  if (catName && effectiveStateSlug && effectiveCitySlug && verticalSlug) {
    items.push({ label: catName, href: `/${effectiveStateSlug}/${effectiveCitySlug}/${verticalSlug}` });
  }

  return items;
}

/* ────────────────────────────────────────────────────────────────────────────
   Static Params
   ──────────────────────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('vendors')
      .select('slug')
      .eq('profile_published', true);

    return (data ?? []).map((v: { slug: string }) => ({ slug: v.slug }));
  } catch {
    return [];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Metadata
   ──────────────────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try Supabase first
  const result = await getVendorBySlug(slug);

  let title: string;
  let description: string;
  let imageUrl: string | undefined;

  if (result) {
    const { hydrated: vendor } = result;
    const categoryShort = getCategoryShort(vendor.category);
    title = `${vendor.name} - ${categoryShort} | Planviry`;
    description = vendor.about?.slice(0, 160) ?? `${vendor.name} is a ${categoryShort.toLowerCase()} on Planviry. Rated ${vendor.rating.toFixed(1)}/5.`;
    imageUrl = vendor.imageUrl ?? undefined;
  } else {
    // Fall back to demo data for metadata
    const demo = DEMO_VENDORS[slug];
    if (demo) {
      title = `${demo.name} - ${demo.categoryName} | Planviry`;
      description = `${demo.name} is a premier ${demo.categoryName.toLowerCase()} provider. Book on Planviry.`;
    } else {
      title = 'Vendor Not Found | Planviry';
      description = 'This vendor could not be found.';
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/v/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : undefined,
    },
    alternates: { canonical: `/v/${slug}` },
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   JSON-LD
   ──────────────────────────────────────────────────────────────────────────── */

function buildJsonLd(vendor: HydratedVendorProfile) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.name,
    description: vendor.about ?? undefined,
    url: `https://planviry.com/v/${vendor.slug}`,
    address: vendor.address
      ? { '@type': 'PostalAddress', addressLocality: vendor.city || 'Milwaukee', addressRegion: vendor.state || 'WI' }
      : undefined,
    telephone: vendor.phone ?? undefined,
    email: vendor.email ?? undefined,
    image: vendor.imageUrl ?? vendor.logoUrl ?? undefined,
    priceRange: vendor.priceRange ?? undefined,
  };

  if (vendor.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating.toFixed(1),
      reviewCount: vendor.reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Clean undefined values
  Object.keys(schema).forEach((key) => schema[key] === undefined && delete schema[key]);

  return JSON.stringify(schema);
}

/* ────────────────────────────────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────────────────────────────────── */

// ─── Demo vendor data (used when Supabase is not configured) ─────────────

const DEMO_VENDORS: Record<string, { name: string; category: string; categoryName: string; categorySlug: string; city: string; state: string; lat: number; lng: number }> = {
  'stellar-moments': { name: 'Stellar Moments Photography', category: 'photography', categoryName: 'Photography', categorySlug: 'milwaukee-photographers', city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  'grand-ballroom': { name: 'The Grand Ballroom', category: 'wedding_venue', categoryName: 'Wedding Venues', categorySlug: 'milwaukee-wedding-venues', city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  'savory-bites': { name: 'Savory Bites Catering', category: 'catering', categoryName: 'Catering', categorySlug: 'milwaukee-caterers', city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  'dj-luxe': { name: 'DJ Luxe Sound', category: 'wedding_dj', categoryName: 'DJs', categorySlug: 'milwaukee-djs', city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  'petal-bloom': { name: 'Petal & Bloom Florals', category: 'florist', categoryName: 'Florists', categorySlug: 'milwaukee-florists', city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  'glam-squad': { name: 'Glam Squad Beauty', category: 'makeup_hair', categoryName: 'Hair & Makeup', categorySlug: 'milwaukee-hair-makeup', city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
};

function getDemoVendor(slug: string): HydratedVendorProfile | null {
  const demo = DEMO_VENDORS[slug];
  if (!demo) return null;

  return hydrateVendorProfile({
    id: `demo-${slug}`,
    slug,
    name: demo.name,
    bio: `${demo.name} is a premier ${demo.categoryName.toLowerCase()} provider serving the ${demo.city} area. With years of experience and a passion for excellence, we deliver unforgettable experiences for every event. Our dedicated team works closely with each client to ensure every detail is perfect.`,
    category: demo.category,
    categoryName: demo.categoryName,
    city: demo.city,
    state: demo.state,
    lat: demo.lat,
    lng: demo.lng,
    serviceRadiusMiles: 25,
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: false,
    rating: 4.8,
    reviewCount: 47,
    priceRange: 'From $500',
  });
}

function getDemoRelated(slug: string) {
  const entries = Object.entries(DEMO_VENDORS).filter(([s]) => s !== slug);
  return entries.slice(0, 3).map(([s, v]) => ({
    id: `demo-${s}`,
    slug: s,
    name: v.name,
    priceRange: 'From $400',
    rating: 4.5 + Math.random() * 0.5,
    reviewCount: Math.floor(Math.random() * 40) + 5,
    categoryName: v.categoryName,
    imageUrl: null,
  }));
}

export default async function VendorProfilePage({ params }: VendorPageProps) {
  const { slug } = await params;

  let vendor: HydratedVendorProfile;
  let related: { id: string; slug: string; name: string; priceRange: string | null; rating: number; reviewCount: number; categoryName: string; imageUrl: string | null }[] = [];
  let demoCategorySlug: string | null = null;

  // Try Supabase first
  const result = await getVendorBySlug(slug);

  if (result) {
    vendor = result.hydrated;

    // Get related vendors from Supabase
    if (isSupabaseConfigured() && vendor.category) {
      try {
        const supabase = createAdminClient();
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', result.categoryName)
          .limit(1);

        if (catData && catData.length > 0) {
          const categoryId = (catData[0] as { id: string }).id;
          related = await getRelatedVendors(slug, categoryId);
        }
      } catch { /* ignore */ }
    }
  } else {
    // Fall back to demo data
    const demoVendor = getDemoVendor(slug);
    if (demoVendor) {
      vendor = demoVendor;
      demoCategorySlug = DEMO_VENDORS[slug]?.categorySlug ?? null;
      related = getDemoRelated(slug);
    } else {
      // Try finding the vendor in mock data across categories
      const mockVendor = findMockVendorBySlug(slug);
      if (mockVendor) {
        vendor = hydrateVendorProfile({
          id: mockVendor.vendor_id,
          slug: mockVendor.slug,
          name: mockVendor.business_name,
          bio: mockVendor.bio,
          category: mockVendor.category,
          categoryName: mockVendor.categoryName,
          city: mockVendor.neighborhood,
          state: 'WI',
          address: mockVendor.address,
          lat: 43.0389,
          lng: -87.9065,
          serviceRadiusMiles: 25,
          isClaimed: mockVendor.is_verified,
          isPublished: true,
          isFeatured: mockVendor.is_featured,
          isVerified: mockVendor.is_verified,
          rating: mockVendor.avg_rating ?? 4.5,
          reviewCount: mockVendor.review_count ?? 25,
          priceRange: mockVendor.price_range,
          imageUrl: mockVendor.cover_url,
        });
        demoCategorySlug = getSeoSlugForCategory(mockVendor.categoryName);
        related = getDemoRelated(slug);
      } else {
        // Last resort: generate a profile from the slug itself
        const gen = generateVendorFromSlug(slug);
        vendor = hydrateVendorProfile({
          id: gen.vendor_id,
          slug: gen.slug,
          name: gen.business_name,
          bio: gen.bio,
          category: gen.category,
          categoryName: gen.categoryName,
          city: gen.neighborhood,
          state: 'WI',
          address: gen.address,
          lat: 43.0389,
          lng: -87.9065,
          serviceRadiusMiles: 25,
          isClaimed: gen.is_verified,
          isPublished: true,
          isFeatured: gen.is_featured,
          isVerified: gen.is_verified,
          rating: gen.avg_rating ?? 4.5,
          reviewCount: gen.review_count ?? 25,
          priceRange: gen.price_range,
          imageUrl: gen.cover_url,
        });
        demoCategorySlug = getSeoSlugForCategory(gen.categoryName);
        related = getDemoRelated(slug);
      }
    }
  }

  const jsonLd = buildJsonLd(vendor);

  // Build spec-compliant breadcrumb items: Home > State > City > Category
  const navBreadcrumbItems = buildBreadcrumbItems(vendor);

  // Build JSON-LD breadcrumb items (includes Home as first item)
  const jsonLdBreadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...navBreadcrumbItems,
    { label: vendor.name, href: `/v/${vendor.slug}` },
  ];

  return <AppLayoutShell>
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {/* BreadcrumbList JSON-LD */}
      <BreadcrumbJsonLd items={jsonLdBreadcrumbItems} />

      <VendorProfileClient
        vendor={vendor}
        relatedVendors={related}
        categoryName={result?.categoryName ?? vendor.categoryName}
        categorySlug={categoryNameToVerticalSlug(result?.categoryName ?? vendor.categoryName) ?? result?.seoSlug ?? demoCategorySlug ?? null}
        breadcrumbItems={navBreadcrumbItems}
        geoapifyApiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
      />
    </>
  </AppLayoutShell>

}
