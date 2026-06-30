import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  SEARCH_TERMS,
  type SearchTerm,
} from "@/lib/seo-data";
import {
  SEO_CATEGORIES,
  resolveSeoCategory,
} from "@/lib/seo-categories";

// ─────────────────────────────────────────────────────────────────────────────
// REVALIDATION - ISR every 6 hours
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 21600;

// ─────────────────────────────────────────────────────────────────────────────
// SLUG LOOKUP MAP - build once at module level
// ─────────────────────────────────────────────────────────────────────────────

const SEARCH_TERM_MAP: Record<string, SearchTerm> = Object.fromEntries(
  SEARCH_TERMS.map((st) => [st.slug, st]),
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

/** Map a search-term category string to one or more DB categories */
function categoryToDbCategories(category: string): string[] {
  // Direct match from SEO_CATEGORIES
  const matches = SEO_CATEGORIES.filter((c) =>
    c.dbCategories.includes(category),
  );
  if (matches.length > 0) {
    return [...new Set(matches.flatMap((m) => m.dbCategories))];
  }
  // Try the category directly
  return [category];
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC PARAMS & METADATA
// ─────────────────────────────────────────────────────────────────────────────

export function generateStaticParams(): { slug: string }[] {
  return SEARCH_TERMS.map((st) => ({ slug: st.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const searchTerm = SEARCH_TERM_MAP[slug];
    if (!searchTerm) return {};

    return {
      title: `${searchTerm.h1} | Planviry`,
      description: searchTerm.metaDescription,
      openGraph: {
        title: `${searchTerm.h1} | Planviry`,
        description: searchTerm.metaDescription,
        type: "website",
        siteName: "Planviry",
      },
      alternates: {
        canonical: `/s/${searchTerm.slug}`,
      },
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default async function SearchStringPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const searchTerm = SEARCH_TERM_MAP[slug];

  if (!searchTerm) {
    notFound();
  }

  // ── Fetch vendors matching the category ──
  // TODO: migrate this lookup to Supabase (vendor_profiles joined to
  // categories + reviews). Previously this used the Prisma stub which
  // returned an empty array, so the page rendered with no vendors.
  const rawVendors: Array<{
    name: string;
    slug: string;
    address?: string | null;
    phone?: string | null;
    reviews: Array<{ rating: number; isApproved: boolean }>;
  }> = [];

  const vendors = rawVendors.map((v) => {
    const approvedReviews = v.reviews.filter((r) => r.isApproved);
    const reviewCount = approvedReviews.length;
    const averageRating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : null;
    return { ...v, reviewCount, averageRating };
  });

  const vendorCount = vendors.length;

  // ── Find related search terms (same category, different slug) ──
  const relatedSearchTerms = SEARCH_TERMS.filter(
    (st) => st.category === searchTerm.category && st.slug !== searchTerm.slug,
  ).slice(0, 8);

  // ── Find the matching SEO category page for internal linking ──
  const seoCategory = resolveSeoCategory(
    SEO_CATEGORIES.find((c) => c.dbCategories.includes(searchTerm.category))?.slug ?? "",
  );

  // ── JSON-LD Structured Data ──
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: searchTerm.h1,
    description: searchTerm.metaDescription,
    numberOfItems: vendorCount,
    itemListElement: vendors.slice(0, 20).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: v.name,
        url: `https://planviry.com/v/${v.slug}`,
        address: v.address
          ? { "@type": "PostalAddress", streetAddress: v.address }
          : undefined,
        telephone: v.phone || undefined,
        aggregateRating:
          v.averageRating && v.reviewCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: v.averageRating.toFixed(1),
                reviewCount: v.reviewCount,
              }
            : undefined,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://planviry.com",
      },
      ...(seoCategory
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: seoCategory.title,
              item: `https://planviry.com/mke/${seoCategory.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: seoCategory ? 3 : 2,
        name: searchTerm.h1,
        item: `https://planviry.com/s/${searchTerm.slug}`,
      },
    ],
  };

  return <AppLayoutShell>
    <div className="min-h-screen flex flex-col">
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── TOP NAV ── */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold">Best</span>
            <span className="font-display text-xl italic font-light text-ember">Time</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#/directory"
              className="font-utility text-[10px] tracking-wider text-muted-foreground hover:text-ember transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/#/booking"
              className="font-utility text-[10px] tracking-wider text-muted-foreground hover:text-ember transition-colors"
            >
              Book an Event
            </Link>
            <Link
              href="/"
              className="font-utility text-[10px] tracking-wider text-muted-foreground hover:text-ember transition-colors"
            >
              Home
            </Link>
          </nav>
          <div className="flex md:hidden items-center gap-4">
            <Link
              href="/#/directory"
              className="font-utility text-[9px] tracking-wider text-muted-foreground hover:text-ember transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/#/booking"
              className="font-utility text-[9px] tracking-wider text-ember border border-ember/30 px-3 py-2 hover:bg-ember hover:text-ember-foreground transition-all"
            >
              Book
            </Link>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <nav aria-label="Breadcrumb" className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-3 md:px-10">
          <ol className="flex flex-wrap items-center gap-1 font-utility text-[10px] tracking-wider text-foreground/60">
            <li>
              <Link href="/" className="hover:text-ember transition-colors">
                Home
              </Link>
            </li>
            {seoCategory && (
              <>
                <li aria-hidden="true" className="text-foreground/30">/</li>
                <li>
                  <Link
                    href={`/mke/${seoCategory.slug}`}
                    className="hover:text-ember transition-colors"
                  >
                    {seoCategory.title}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true" className="text-foreground/30">/</li>
            <li className="text-foreground/90">{searchTerm.h1}</li>
          </ol>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-ember" />
            <p className="font-utility text-[10px] text-ember tracking-widest">
              Milwaukee, WI
            </p>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] max-w-4xl">
            {searchTerm.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
            {searchTerm.metaDescription}
          </p>

          {/* Vendor count stat */}
          <div className="mt-8 flex items-center gap-4">
            <div className="border border-border bg-background px-5 py-3">
              <span className="font-display text-2xl md:text-3xl font-bold text-ember">
                {vendorCount}
              </span>
              <span className="ml-2 font-utility text-[10px] tracking-wider text-muted-foreground">
                {vendorCount === 1 ? "Result" : "Results"} Found
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#/directory"
              className="font-utility inline-flex items-center bg-ember px-7 py-4 text-[11px] text-ember-foreground tracking-wider transition-all hover:bg-ink hover:text-ink-foreground"
            >
              Browse Directory
            </Link>
            <Link
              href="/#/booking"
              className="font-utility inline-flex items-center border border-foreground/20 px-7 py-4 text-[11px] text-foreground tracking-wider transition-all hover:border-ember hover:text-ember"
            >
              Book an Event
            </Link>
          </div>
        </div>
      </section>

      {/* ── VENDOR GRID ── */}
      {vendorCount > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-ember" />
              <p className="font-utility text-[10px] text-ember tracking-widest">
                Top Rated
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08] mb-10">
              {searchTerm.searchQuery} in Milwaukee
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {vendors.map((v) => (
                <Link
                  key={v.id}
                  href={`/v/${v.slug}`}
                  className="group block bg-background border border-border p-6 transition-colors hover:bg-ink hover:text-ink-foreground hover:border-ink"
                >
                  {/* Badges row */}
                  <div className="flex items-center gap-2 mb-3">
                    {v.isFeatured && (
                      <span className="font-utility text-[8px] tracking-widest text-ember border border-ember/30 px-2 py-0.5 group-hover:border-ember group-hover:text-ember">
                        Featured
                      </span>
                    )}
                    {v.isVerified && (
                      <span className="font-utility text-[8px] tracking-widest text-teal border border-teal/30 px-2 py-0.5 group-hover:border-teal group-hover:text-teal">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-lg md:text-xl font-bold leading-tight group-hover:text-ink-foreground">
                    {v.name}
                  </h3>

                  {/* Category */}
                  <p className="mt-1 font-utility text-[9px] tracking-wider text-muted-foreground group-hover:text-ink-foreground/60 uppercase">
                    {v.category.replace(/_/g, " ")}
                  </p>

                  {/* Address */}
                  {v.address && (
                    <p className="mt-2 text-xs text-muted-foreground group-hover:text-ink-foreground/60">
                      {v.address}
                    </p>
                  )}

                  {/* Bio excerpt */}
                  {v.bio && (
                    <p className="mt-3 text-sm text-muted-foreground/80 group-hover:text-ink-foreground/60 line-clamp-2">
                      {truncate(v.bio, 140)}
                    </p>
                  )}

                  {/* Bottom row: Price + Rating */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 group-hover:border-ink-foreground/15">
                    {v.priceRange && (
                      <span className="font-utility text-[10px] tracking-wider text-muted-foreground group-hover:text-ink-foreground/60">
                        {v.priceRange}
                      </span>
                    )}
                    {v.averageRating !== null && v.reviewCount > 0 && (
                      <span className="text-sm text-ember group-hover:text-ember">
                        {renderStars(v.averageRating)}{" "}
                        <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 ml-1">
                          ({v.reviewCount})
                        </span>
                      </span>
                    )}
                    {!v.averageRating && !v.priceRange && <span />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EMPTY STATE ── */}
      {vendorCount === 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
            <p className="font-utility text-[10px] text-ember tracking-widest mb-4">
              Coming Soon
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              We&apos;re Building This Page
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              We&apos;re curating the best {searchTerm.searchQuery.toLowerCase()} for Milwaukee.
              Check back soon or browse our full directory.
            </p>
            <Link
              href="/#/directory"
              className="mt-8 inline-flex font-utility items-center bg-ember px-7 py-4 text-[11px] text-ember-foreground tracking-wider transition-all hover:bg-ink hover:text-ink-foreground"
            >
              Browse Directory
            </Link>
          </div>
        </section>
      )}

      {/* ── RELATED SEARCH STRINGS (Internal Linking - critical for SEO) ── */}
      {relatedSearchTerms.length > 0 && (
        <section className="bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-ember" />
              <p className="font-utility text-[10px] text-ember tracking-widest">
                Related Searches
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08] mb-10">
              More {searchTerm.searchQuery} in Milwaukee
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedSearchTerms.map((st) => (
                <Link
                  key={st.slug}
                  href={`/s/${st.slug}`}
                  className="group border border-border bg-background px-4 py-4 text-center transition-colors hover:bg-ink hover:text-ink-foreground hover:border-ink"
                >
                  <span className="text-sm font-medium group-hover:text-ink-foreground">
                    {st.searchQuery}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY PAGE LINK ── */}
      {seoCategory && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-6 bg-ember" />
              <p className="font-utility text-[10px] text-ember tracking-widest">
                Browse by Category
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08] mb-10">
              Explore All {seoCategory.title}
            </h2>
            <Link
              href={`/mke/${seoCategory.slug}`}
              className="font-utility inline-flex items-center bg-ember px-7 py-4 text-[11px] text-ember-foreground tracking-wider transition-all hover:bg-ink hover:text-ink-foreground"
            >
              View All {seoCategory.title}
            </Link>
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ── */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-foreground leading-[1.05]">
            Ready to plan your Milwaukee event?
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink-foreground/50 max-w-xl mx-auto">
            Whether you&apos;re a vendor looking to grow or a host planning the perfect
            celebration, Best Time connects you with Milwaukee&apos;s best.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#/directory"
              className="font-utility inline-flex items-center bg-ember px-8 py-4 text-[11px] text-ember-foreground tracking-wider transition-all hover:bg-background hover:text-foreground"
            >
              List Your Business
            </Link>
            <Link
              href="/#/booking"
              className="font-utility inline-flex items-center border border-white/20 px-8 py-4 text-[11px] text-ink-foreground/70 tracking-wider transition-all hover:border-ember hover:text-ember"
            >
              Book an Event
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-ink text-ink-foreground mt-auto">
        <div className="h-[2px] bg-ember/70" />
        <div className="mx-auto max-w-[1400px] px-4 pt-8 pb-10 md:px-6 md:pt-10 md:pb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold">Best</span>
              <span className="font-display text-2xl italic font-light text-ember">Time</span>
            </div>
            <nav className="flex flex-wrap gap-6 font-utility text-[9px] text-ink-foreground/50 tracking-wider">
              <Link href="/" className="hover:text-ember transition-colors">
                Home
              </Link>
              <Link href="/#/directory" className="hover:text-ember transition-colors">
                Directory
              </Link>
              <Link href="/#/booking" className="hover:text-ember transition-colors">
                Book an Event
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-ink-foreground/12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="font-utility text-[9px] text-ink-foreground/50 tracking-wider">
              &copy; {new Date().getFullYear()} Best Time DJ Services &middot; Milwaukee, WI
            </p>
            <p className="font-utility text-[9px] text-ink-foreground/40 tracking-wider">
              Milwaukee&apos;s curated network for DJs, venues, photographers, and planners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </AppLayoutShell>

}
