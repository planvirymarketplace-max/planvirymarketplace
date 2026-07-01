import { permanentRedirect } from 'next/navigation'

/**
 * P4-4: /v/[slug] → /[slug] (permanent redirect)
 *
 * Collapses the duplicate vendor-profile path into the canonical /[slug]
 * vertical/state surface. The vendor profile lives at /vendor/[slug] (the
 * /vendors/[slug] → /vendor/[slug] redirect below preserves the dedicated
 * profile surface for cases where the slug is unambiguously a vendor slug).
 *
 * Note: `permanentRedirect` issues HTTP 308 (the modern permanent redirect
 * that preserves method+body). Search engines treat 308 and 301 identically.
 */
export default async function VSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/${slug}`)
}
