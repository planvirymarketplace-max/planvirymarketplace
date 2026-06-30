import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET  /api/testimonials
 * POST /api/testimonials
 *
 * The remote Supabase has no `testimonials` table. Per the migration spec,
 * testimonials are stored in the `reviews` table. Testimonial-specific
 * fields (reviewer_name, event_type, etc.) are not present on `reviews`;
 * we map the available fields and return null for the rest, preserving
 * the original camelCase response shape.
 */

/** Map a snake_case reviews row to the original camelCase testimonial shape. */
function transformReviewToTestimonial(r: Record<string, unknown>) {
  return {
    id: r.id,
    reviewerName: null, // reviews table has reviewer_id (UUID), not a name string
    reviewerTitle: null,
    eventType: null,
    eventDate: null,
    rating: r.rating,
    content: r.body,
    avatarUrl: null,
    isFeatured: false,
    isPublished: r.moderation_status === 'approved',
    source: 'direct',
    createdAt: r.created_at,
    updatedAt: null,
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, rating, body, moderation_status, created_at')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch testimonials:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      )
    }

    return NextResponse.json((reviews ?? []).map(transformReviewToTestimonial))
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewerName, eventType, rating, content } = body

    // Validate required fields (kept the original validation contract)
    if (
      !reviewerName ||
      typeof reviewerName !== 'string' ||
      reviewerName.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'reviewerName is required' },
        { status: 400 }
      )
    }
    if (
      !eventType ||
      typeof eventType !== 'string' ||
      eventType.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      )
    }
    if (
      !content ||
      typeof content !== 'string' ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Insert into reviews table. reviewerName/eventType are accepted by the
    // API for backward compat but cannot be persisted (no equivalent columns
    // on `reviews`).
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        rating,
        body: content.trim(),
        moderation_status: 'pending',
        // reviewer_id / vendor_id are nullable; left null since this is a
        // generic site testimonial with no vendor context.
      })
      .select('id, rating, body, moderation_status, created_at')
      .single()

    if (error) {
      console.error('Failed to create testimonial:', error.message)
      return NextResponse.json(
        { error: 'Failed to create testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      transformReviewToTestimonial(data as Record<string, unknown>),
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
