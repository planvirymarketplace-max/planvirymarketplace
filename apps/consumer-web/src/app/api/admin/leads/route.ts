import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'
import { createClient } from '@/lib/supabase-marketplace/server'

/**
 * GET /api/admin/leads
 *
 * Query params:
 *   status    — filter by invite_status (new, queued, invited, opened, claimed, rejected, bounced, unsubscribed)
 *   state     — filter by state
 *   city      — filter by city
 *   category  — filter by category_primary
 *   q         — search business_name
 *   page      — page number (default 1)
 *   limit     — page size (default 50, max 200)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const category = searchParams.get('category')
    const q = searchParams.get('q')?.trim()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
    const offset = (page - 1) * limit

    const admin = createAdminClient()

    let query = admin
      .from('leads')
      .select('*', { count: 'exact' })
      .order('quality_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('invite_status', status)
    if (state) query = query.eq('state', state.toUpperCase())
    if (city) query = query.ilike('city', city)
    if (category) query = query.ilike('category_primary', category)
    if (q) {
      query = query.or(`business_name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`)
    }

    const { data: leads, count, error } = await query

    if (error) {
      console.error('Error fetching leads:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: stats } = await admin.from('admin_lead_stats').select('*').single()

    const [statesRes, categoriesRes] = await Promise.all([
      admin.from('leads').select('state').not('state', 'is', null).order('state'),
      admin.from('leads').select('category_primary').not('category_primary', 'is', null).order('category_primary'),
    ])

    const states = [...new Set(statesRes.data?.map((r: any) => r.state) || [])]
    const categories = [...new Set(categoriesRes.data?.map((r: any) => r.category_primary) || [])]

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      stats: stats || {},
      filters: { states, categories },
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

/**
 * POST /api/admin/leads
 *
 * Send invites: { action: 'invite', leadIds: [...], method: 'email', notes: '...' }
 * Import leads: { leads: [{ business_name, city, ... }] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ── Invite action ─────────────────────────────────────────────
    if (body.action === 'invite') {
      const { leadIds, method = 'email', notes } = body
      if (!Array.isArray(leadIds) || leadIds.length === 0) {
        return NextResponse.json({ error: 'leadIds array required' }, { status: 400 })
      }

      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      const admin = createAdminClient()

      // Get current invite_count for each lead, then increment
      const { data: current } = await admin
        .from('leads')
        .select('id, invite_count')
        .in('id', leadIds)

      const updates = (current || []).map((lead: any) => ({
        id: lead.id,
        invite_status: 'invited',
        invite_sent_at: new Date().toISOString(),
        invite_method: method,
        invite_notes: notes || null,
        invited_by: user.id,
        invite_count: (lead.invite_count || 0) + 1,
        last_invite_at: new Date().toISOString(),
      }))

      let invited = 0
      for (const u of updates) {
        const { error } = await admin.from('leads').update(u).eq('id', u.id)
        if (!error) invited++
      }

      return NextResponse.json({ invited, leadIds })
    }

    // ── Import leads ──────────────────────────────────────────────
    if (Array.isArray(body.leads)) {
      const admin = createAdminClient()
      const { data, error } = await admin
        .from('leads')
        .upsert(body.leads, { onConflict: 'overture_id' })
        .select('id')

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ imported: data?.length || 0 })
    }

    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  } catch (error) {
    console.error('Error in leads POST:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/leads
 * Body: { leadId, updates: { invite_status, invite_notes, ... } }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, updates } = body

    if (!leadId || !updates) {
      return NextResponse.json({ error: 'leadId and updates required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead: data })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
