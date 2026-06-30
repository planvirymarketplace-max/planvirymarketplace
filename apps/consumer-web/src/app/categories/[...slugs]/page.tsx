import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolveTaxonomyPath, generateTaxonomyStaticParams } from '@/lib/taxonomy-resolver'
import { TaxonomyDirectoryClient } from '@/components/taxonomy/TaxonomyDirectoryClient'

// ─── ISR Configuration ──────────────────────────────────────────────────────
export const revalidate = 3600 // 1 hour
export const dynamicParams = true

// ─── Static Params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return generateTaxonomyStaticParams()
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string[] }>
}): Promise<Metadata> {
  const { slugs } = await params
  const page = resolveTaxonomyPath(slugs)
  if (!page) return {}

  const title = `${page.title} | Planviry`
  const description = page.description

  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/categories/${slugs.join('/')}` },
    openGraph: {
      title,
      description,
      url: `https://planviry.com/categories/${slugs.join('/')}`,
      siteName: 'Planviry',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slugs: string[] }>
}) {
  const { slugs } = await params
  if (!slugs || slugs.length === 0) return notFound()

  const page = resolveTaxonomyPath(slugs)
  if (!page) return notFound()

  return <AppLayoutShell>
    <>
      <TaxonomyDirectoryClient page={page} slugs={slugs} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: page.title,
            description: page.description,
            url: `https://planviry.com/categories/${slugs.join('/')}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Planviry',
              url: 'https://planviry.com',
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: page.breadcrumbs.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: b.label,
                ...(b.href ? { item: `https://planviry.com${b.href}` } : {}),
              })),
            },
          }),
        }}
      />
    </>
  </AppLayoutShell>

}
