import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * PATCH /api/testimonials/[id]
 * DELETE /api/testimonials/[id]
 *
 * Update or delete a testimonial by ID. Uses admin client (service role)
 * so RLS is bypassed — these routes are admin-only.
 *
 * NOTE: The remote Supabase has no `testimonials` table. Per the migration
 * spec, testimonials are stored in the `reviews` table. Testimonial-specific
 * fields (reviewer_name, event_type, etc.) are not present on `reviews`;
 * only `rating`, `body`, and `moderation_status` are mapped.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Map testimonial fields onto the reviews table.
    // Only fields that exist on `reviews` are honored; the rest are ignored.
    const patch: Record<string, unknown> = {}
    if (body.rating !== undefined) patch.rating = body.rating
    if (body.content !== undefined) patch.body = body.content
    if (body.isPublished === true) patch.moderation_status = 'approved'
    if (body.isPublished === false) patch.moderation_status = 'pending'

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        {
          error:
            'No updatable fields. The reviews table only supports rating, content (body), and isPublished (moderation_status).',
        },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('reviews')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Testimonial not found' },
          { status: 404 }
        )
      }
      console.error('Failed to update testimonial:', error.message)
      return NextResponse.json(
        { error: 'Failed to update testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to update testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete testimonial:', error.message)
      return NextResponse.json(
        { error: 'Failed to delete testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Testimonial deleted' })
  } catch (error) {
    console.error('Failed to delete testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
