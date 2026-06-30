import type { Metadata } from 'next'
import { getExperienceBySlug, EXPERIENCES } from '@/data/experiences'

// Dynamic metadata for each experience page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const experience = getExperienceBySlug(slug)

  if (!experience) {
    return { title: 'Not Found | Planviry' }
  }

  return {
    title: experience.metaTitle,
    description: experience.metaDescription,
    keywords: experience.keywords,
    openGraph: {
      title: experience.metaTitle,
      description: experience.metaDescription,
      type: 'website',
      siteName: 'Planviry',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: experience.metaTitle,
      description: experience.metaDescription,
    },
  }
}

// Pre-render all experience pages at build time
export async function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({
    slug: exp.slug,
  }))
}

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
