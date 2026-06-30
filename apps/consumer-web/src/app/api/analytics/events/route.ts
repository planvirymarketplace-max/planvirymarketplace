import { NextRequest, NextResponse } from 'next/server';

import {
  trackPageView,
  trackSearch,
  trackVendorView,
  trackBookingEvent,
  trackCTAClick,
  pushEvent,
} from '@/lib/tinybird';

/**
 * POST /api/analytics/events
 *
 * Client-side proxy that forwards analytics events to Tinybird.
 * The `event` field determines which tracking function to invoke.
 *
 * Supported event types:
 *   - page_view    → trackPageView
 *   - search       → trackSearch
 *   - vendor_view  → trackVendorView
 *   - booking      → trackBookingEvent
 *   - cta_click    → trackCTAClick
 *
 * Any other event name is forwarded as a generic event to the
 * `generic_events` Tinybird datasource.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, ...data } = body;

    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "event" field' },
        { status: 400 },
      );
    }

    switch (event) {
      case 'page_view':
        await trackPageView({
          path: data.path ?? '',
          referrer: data.referrer,
          userAgent: data.userAgent,
          userId: data.userId,
        });
        break;

      case 'search':
        await trackSearch({
          query: data.query ?? '',
          filters: data.filters,
          resultsCount: data.resultsCount ?? 0,
          userId: data.userId,
        });
        break;

      case 'vendor_view':
        await trackVendorView({
          vendorSlug: data.vendorSlug ?? '',
          vendorId: data.vendorId ?? '',
          source: data.source ?? '',
          userId: data.userId,
        });
        break;

      case 'booking':
        await trackBookingEvent({
          vendorSlug: data.vendorSlug ?? '',
          vendorId: data.vendorId ?? '',
          eventType: data.eventType ?? '',
          value: data.value,
          userId: data.userId,
        });
        break;

      case 'cta_click':
        await trackCTAClick({
          ctaName: data.ctaName ?? '',
          ctaLocation: data.ctaLocation ?? '',
          destinationUrl: data.destinationUrl ?? '',
          userId: data.userId,
        });
        break;

      default:
        // Generic event - forward to Tinybird generic_events datasource
        await pushEvent('generic_events', { event, ...data });
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[/api/analytics/events] error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 },
    );
  }
}
