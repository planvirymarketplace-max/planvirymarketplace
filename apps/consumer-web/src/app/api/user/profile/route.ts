import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-marketplace/server'

/**
 * GET   /api/user/profile?userId=xxx
 * PATCH /api/user/profile  { userId, name, phone }
 *
 * Reads and updates the public.users profile row for a user.
 * Uses cookie-based client (RLS-protected).
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, avatar_url, role, status, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url,
        emailVerified: null, // Not exposed in public.users; available via auth.users
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH: Update user name, phone
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, phone } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (typeof name === 'string') updateData.full_name = name
    if (typeof phone === 'string') updateData.phone = phone

    if (Object.keys(updateData).length === 1) {
      // Only updated_at — nothing user-supplied
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, full_name, phone, role')
      .single()

    if (error || !user) {
      console.error('Error updating user profile:', error?.message)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
