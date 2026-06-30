import { redirect } from 'next/navigation'
import { resolveSeoCategory, getAllSeoSlugsIncludingAlt } from '@/lib/seo-categories'

// ─── Static generation (needed so the redirect pages are built) ───────────────
export function generateStaticParams(): { slug: string }[] {
  return getAllSeoSlugsIncludingAlt().map((slug) => ({ slug }))
}

// ─── Redirect to root /[slug] route ──────────────────────────────────────────
export default async function MkeCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const seoCategory = resolveSeoCategory(slug)

  // Redirect to the canonical root-level slug
  if (seoCategory) {
    redirect(`/${seoCategory.slug}`)
  }

  // If the slug doesn't resolve, still try redirecting
  redirect(`/${slug}`)
}
