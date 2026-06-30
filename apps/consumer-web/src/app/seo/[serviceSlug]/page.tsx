import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import Link from 'next/link';
import { SEO_SERVICE_PATTERNS, getSeoPattern, SEO_CATEGORIES } from '@/data/seo-pages';
import { seoCategoryToCanonical, buildCategoryUrl, getCategoryLabel } from '@/lib/routes';
import { SeoServiceClient } from '@/components/seo/SeoServiceClient';

// ---------------------------------------------------------------------------
// /seo/[serviceSlug] - Service-only page (no location selected)
// Shows the service category with sidebar+horizontal vendor card layout
// matching the SeoDirectoryClient design used for location pages
// ---------------------------------------------------------------------------

export const revalidate = 3600;

interface ServicePageProps {
  params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const pattern = getSeoPattern(serviceSlug);

  if (!pattern) {
    return { title: 'Not Found - Planviry' };
  }

  const serviceLabel = pattern.name.replace(/\s+(In|Near|By)$/, '').trim();

  return {
    title: `${serviceLabel} - Find ${serviceLabel} Near You | Planviry`,
    description: `Find the best ${serviceLabel.toLowerCase()} across the United States. Browse verified providers, compare ratings, prices, and availability on Planviry.`,
  };
}

export default async function ServiceOnlyPage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const pattern = getSeoPattern(serviceSlug);

  if (!pattern) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <Link href="/" className="text-teal-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  // Map SEO category to canonical category for the directory link
  const canonicalCat = seoCategoryToCanonical(pattern.category);

  // Related patterns (same category, different slugs)
  const relatedPatterns = SEO_SERVICE_PATTERNS.filter(
    p => p.category === pattern.category && p.slug !== pattern.slug
  ).slice(0, 8);

  // Fetch a few national vendors for preview
  let previewVendors: any[] = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendors?vertical=${encodeURIComponent(canonicalCat)}&limit=24`,
      { next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      previewVendors = data.vendors ?? []
    }
  } catch {
    // fallback to empty
  }

  return <AppLayoutShell>
    <SeoServiceClient
      pattern={pattern}
      canonicalVertical={canonicalCat}
      relatedPatterns={relatedPatterns}
      initialVendors={previewVendors}
    />
  </AppLayoutShell>

}
