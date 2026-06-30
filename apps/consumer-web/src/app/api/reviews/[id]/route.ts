import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * DELETE /api/reviews/[id] — Delete a review by ID (admin-only)
 *
 * Maps from Prisma `db.vendorReview.findUnique` + `db.vendorReview.delete`.
 * The Supabase table is `reviews`.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      )
    }

    const { id } = await params
    const supabase = createAdminClient()

    const { data: review, error: findError } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (findError) {
      console.error('Error finding review:', findError.message)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting review:', deleteError.message)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
