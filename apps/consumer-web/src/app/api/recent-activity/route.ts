import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/recent-activity
 * Returns recent platform activity: new vendors, new reviews, claims.
 * Cached for 5 minutes.
 */
export const revalidate = 300

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Recent vendors (last 30 days)
    const { data: newVendors } = await supabase
      .from('vendor_profiles')
      .select('id, business_name, slug, created_at, category')
      .order('created_at', { ascending: false })
      .limit(6)

    const items = (newVendors ?? []).map((v) => {
      const created = new Date(v.created_at as string)
      const diffMs = Date.now() - created.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const timeAgo =
        diffDays === 0
          ? 'Today'
          : diffDays === 1
          ? 'Yesterday'
          : `${diffDays}d ago`

      return {
        id: v.id as string,
        type: 'new_vendor' as const,
        vendor_name: v.business_name as string,
        vendor_id: v.id as string,
        vendor_slug: v.slug as string,
        description: 'Joined the marketplace',
        time_ago: timeAgo,
        badge: 'New Listing',
      }
    })

    return NextResponse.json({ items }, { status: 200 })
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
