import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/admin/users?page=1&limit=20&role=planner
 *
 * Lists marketplace users. The original Prisma schema joined auth
 * metadata with profile fields (`email`, `name`, `phone`, `role`,
 * `avatarUrl`, `emailVerified`, `_count { bookings, reviews,
 * savedVendors, claimRequests }`, `vendorProfile`).
 *
 * In Supabase these live across two sources:
 *   - `public.users` holds the profile (email, full_name, phone,
 *     avatar_url, role, status, created_at, updated_at)
 *   - `auth.users` (via auth.admin.listUsers) holds email confirmation
 *
 * We page through `public.users` (which has the role field used by the
 * role filter) and enrich with auth-side `email_confirmed_at` and
 * per-user count aggregates.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const role = searchParams.get('role')

    const supabase = createAdminClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Base query: paginated public.users
    let query = supabase
      .from('users')
      .select('id, email, full_name, phone, avatar_url, role, status, created_at, updated_at', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (role && role !== 'all') {
      query = query.eq('role', role)
    }

    const { data: users, count, error } = await query

    if (error) {
      console.error('Error fetching admin users:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    const userRows = users ?? []
    const userIds = userRows.map((u) => u.id)

    // Batch-fetch auth-side email confirmation timestamps
    let emailVerifiedMap = new Map<string, string | null>()
    try {
      const { data: authList } = await supabase.auth.admin.listUsers({
        page,
        perPage: limit,
      })
      for (const au of authList?.users ?? []) {
        emailVerifiedMap.set(au.id, au.email_confirmed_at ?? null)
      }
    } catch (authErr) {
      console.error('auth.admin.listUsers failed:', authErr)
    }

    // Batch-fetch per-user counts (bookings as planner, reviews, claim_requests)
    const [bookingsResult, reviewsResult, claimsResult, vendorsResult] =
      await Promise.all([
        supabase
          .from('bookings')
          .select('planner_id')
          .in('planner_id', userIds),
        supabase
          .from('reviews')
          .select('reviewer_id')
          .in('reviewer_id', userIds),
        supabase
          .from('claim_requests')
          .select('user_id')
          .in('user_id', userIds),
        supabase
          .from('vendors')
          .select('id, user_id')
          .in('user_id', userIds),
      ])

    const bookingCount = new Map<string, number>()
    for (const b of bookingsResult.data ?? []) {
      const pid = (b as Record<string, unknown>).planner_id as string | null
      if (pid) bookingCount.set(pid, (bookingCount.get(pid) ?? 0) + 1)
    }
    const reviewCount = new Map<string, number>()
    for (const r of reviewsResult.data ?? []) {
      const rid = (r as Record<string, unknown>).reviewer_id as string | null
      if (rid) reviewCount.set(rid, (reviewCount.get(rid) ?? 0) + 1)
    }
    const claimCount = new Map<string, number>()
    for (const c of claimsResult.data ?? []) {
      const uid = (c as Record<string, unknown>).user_id as string | null
      if (uid) claimCount.set(uid, (claimCount.get(uid) ?? 0) + 1)
    }
    const vendorByUser = new Map<string, { id: string }>()
    for (const v of vendorsResult.data ?? []) {
      const row = v as Record<string, unknown>
      const uid = row.user_id as string | null
      if (uid) vendorByUser.set(uid, { id: row.id as string })
    }

    // savedVendors count is proxied through saved_searches (filters->>vendor_id IS NOT NULL)
    const savedVendorsCount = new Map<string, number>()
    if (userIds.length > 0) {
      const { data: savedRows } = await supabase
        .from('saved_searches')
        .select('user_id')
        .in('user_id', userIds)
        .not('filters', 'is', null)
      for (const s of savedRows ?? []) {
        const uid = (s as Record<string, unknown>).user_id as string | null
        if (uid) savedVendorsCount.set(uid, (savedVendorsCount.get(uid) ?? 0) + 1)
      }
    }

    const transformedUsers = userRows.map((u) => {
      const row = u as Record<string, unknown>
      const id = row.id as string
      const vendorProfile = vendorByUser.get(id)
      return {
        id,
        email: row.email,
        name: row.full_name,
        phone: row.phone,
        role: row.role,
        avatarUrl: row.avatar_url,
        emailVerified: emailVerifiedMap.get(id) ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        _count: {
          bookings: bookingCount.get(id) ?? 0,
          reviews: reviewCount.get(id) ?? 0,
          savedVendors: savedVendorsCount.get(id) ?? 0,
          claimRequests: claimCount.get(id) ?? 0,
        },
        vendorProfile: vendorProfile
          ? { id: vendorProfile.id, vendorId: vendorProfile.id, plan: 'free' }
          : null,
      }
    })

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
