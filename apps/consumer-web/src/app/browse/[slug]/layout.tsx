import type { Metadata } from 'next'
import { EXPERIENCES, getExperienceBySlug } from '@/data/experiences'

// Dynamic metadata for each category page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getExperienceBySlug(slug)

  if (!page) {
    return { title: 'Not Found | Planviry' }
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
      siteName: 'Planviry',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  }
}

// Pre-render all pages at build time
export async function generateStaticParams() {
  return EXPERIENCES.map((entry) => ({
    slug: entry.slug,
  }))
}

export default function BrowseSlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
