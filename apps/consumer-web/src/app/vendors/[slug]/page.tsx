import { permanentRedirect } from 'next/navigation'

/**
 * P4-4: /vendors/[slug] → /vendor/[slug] (permanent redirect)
 *
 * Collapses the plural /vendors/[slug] path into the canonical /vendor/[slug]
 * profile surface (vendor profile lives at /vendor/[slug] via seo-server.ts).
 *
 * Note: `permanentRedirect` issues HTTP 308 (the modern permanent redirect
 * that preserves method+body). Search engines treat 308 and 301 identically.
 */
export default async function VendorsSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/vendor/${slug}`)
}
