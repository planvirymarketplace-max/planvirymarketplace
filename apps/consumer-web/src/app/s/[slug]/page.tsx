import { permanentRedirect } from 'next/navigation'

/**
 * P4-4: /s/[slug] → /[slug] (permanent redirect)
 *
 * Collapses the duplicate SEO search-string path into the canonical /[slug]
 * vertical/state surface.
 *
 * Note: `permanentRedirect` issues HTTP 308 (the modern permanent redirect
 * that preserves method+body). Search engines treat 308 and 301 identically.
 */
export default async function SSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/${slug}`)
}
