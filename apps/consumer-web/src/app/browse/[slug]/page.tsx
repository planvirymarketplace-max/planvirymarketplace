import { permanentRedirect } from 'next/navigation'

/**
 * P4-4: /browse/[slug] → /[slug] (permanent redirect)
 *
 * Collapses the duplicate browse path into the canonical /[slug] vertical/state
 * surface.
 *
 * Note: `permanentRedirect` issues HTTP 308 (the modern permanent redirect
 * that preserves method+body). Search engines treat 308 and 301 identically.
 */
export default async function BrowseSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/${slug}`)
}
