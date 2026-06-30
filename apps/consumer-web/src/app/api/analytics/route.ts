import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/analytics?vendorId=xxx
 *
 * Return recent analytics events for a vendor.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'vendorId query parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify vendor exists
    const { data: vendor } = await supabase
      .from('vendor_profiles')
      .select('id, business_name')
      .eq('id', vendorId)
      .single()

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const { data: recentEvents } = await supabase
      .from('vendor_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(30)

    const eventCounts: Record<string, number> = {}
    ;(recentEvents || []).forEach((e: any) => {
      const eventType = e.event_type || e.event
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1
    })

    return NextResponse.json({
      vendorId,
      totalEvents: (recentEvents || []).length,
      eventCounts,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/analytics
 *
 * Log an analytics event for a vendor.
 * Uses admin client so public users can log events without auth.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, event, eventType, referrer, userAgent, sessionId, customerId } = body

    if (!vendorId || (!event && !eventType)) {
      return NextResponse.json(
        { error: 'vendorId and event (or eventType) are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: analytic, error } = await supabase
      .from('vendor_analytics')
      .insert({
        vendor_id: vendorId,
        event_type: eventType || event,
        referrer: referrer || null,
        user_agent: userAgent || null,
        session_id: sessionId || null,
        customer_id: customerId || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error (vendor_analytics):', error)
      return NextResponse.json(
        { error: 'Failed to create analytic' },
        { status: 500 }
      )
    }

    return NextResponse.json({ analytic })
  } catch (error) {
    console.error('Error creating analytic:', error)
    return NextResponse.json(
      { error: 'Failed to create analytic' },
      { status: 500 }
    )
  }
}
