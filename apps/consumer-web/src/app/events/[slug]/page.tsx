'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { EventPage, HospitalityPage, CommunityPage } from '@/components/pages/EventPages'

// Map URL path slugs → data slugs where they differ
const URL_TO_DATA_SLUG: Record<string, string> = {
  'anniversaries':    'anniversaries-vow-renewals',
  'nightclubs-bars':  'nightclubs',
  'raves-warehouse':  'raves-warehouse-events',
  'cruise-ships':     'cruise-ships-waterfront',
  'fitness-events':   'fitness-athletic-events',
  'corporate':        'galas-fundraisers',
  'festivals':        'music-festivals',
  'birthdays':        'birthday-parties',
}

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { slug } = params

  if (slug === 'hospitality') return <AppLayoutShell><HospitalityPage navigate={navigate} /></AppLayoutShell>
  if (slug === 'community')   return <CommunityPage navigate={navigate} />

  const dataSlug = URL_TO_DATA_SLUG[slug] ?? slug
  return <EventPage slug={dataSlug} navigate={navigate} />
}
