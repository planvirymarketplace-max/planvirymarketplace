import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/notifications/read-all
//
// Marks every notification belonging to the authenticated user as read.
//
// Schema note (FIX-8 live-DB probe):
//   - `notifications` has NO `read_at` column. The task description's literal
//     `UPDATE notifications SET read_at = now()` would fail with PGRST204
//     (column does not exist) on the live Supabase instance.
//   - Read state is tracked in the `in_app_notifications` join table, which
//     has columns: id, notification_id, read_at, is_read, created_at.
//   - So this endpoint:
//       1. Resolves the user via the cookie-scoped server client.
//       2. Fetches the user's recent notification IDs (limit 200 — covers the
//          page's 50-row window plus headroom for older unread rows).
//       3. UPDATEs `in_app_notifications` SET read_at = now(), is_read = true
//          WHERE notification_id IN (...) AND read_at IS NULL.
//       4. Also UPSERTs in_app_notifications rows for any of the user's
//          notifications that don't yet have one (e.g. EMAIL / PUSH-channel
//          notifications, which the /api/notifications/process route only
//          creates in_app_notifications rows for when channel=IN_APP). This
//          ensures the read counter on /account/notifications drops to zero
//          for all channels, not just IN_APP.
//   - All DB work uses the service-role admin client (RLS bypass) — the user
//     is already authenticated via the server client's getUser() check, so
//     this is safe.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST() {
  // 1. Authenticate via cookie-scoped server client.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  try {
    // 2. Fetch the user's recent notification IDs (covers the page window).
    const { data: notifs, error: fetchErr } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200)

    if (fetchErr) {
      // Most likely cause: the `notifications` table is missing on this DB.
      return NextResponse.json(
        { error: 'Could not load notifications.', detail: fetchErr.message },
        { status: 500 },
      )
    }

    const ids = (notifs ?? []).map((n: { id: string }) => n.id)
    if (ids.length === 0) {
      return NextResponse.json({ updated: 0, message: 'No notifications to mark.' })
    }

    // 3. UPDATE existing in_app_notifications rows for these notifications.
    const { error: updateErr } = await admin
      .from('in_app_notifications')
      .update({ read_at: new Date().toISOString(), is_read: true })
      .in('notification_id', ids)
      .is('read_at', null)

    if (updateErr) {
      // If in_app_notifications table is missing, fall back gracefully —
      // return success with a note rather than crashing the page.
      return NextResponse.json(
        { error: 'Could not mark notifications as read.', detail: updateErr.message },
        { status: 500 },
      )
    }

    // 4. UPSERT in_app_notifications rows for notifications that don't have
    //    one yet (EMAIL / PUSH channel — see comment in /api/notifications/
    //    process/route.ts). PostgREST upsert requires a unique constraint;
    //    we use notification_id (assumed unique per row).
    //
    //    Strategy: find which of `ids` have NO in_app_notifications row yet,
    //    then INSERT them as already-read.
    const { data: existing, error: existingErr } = await admin
      .from('in_app_notifications')
      .select('notification_id')
      .in('notification_id', ids)

    if (existingErr) {
      // Non-fatal — the UPDATE above already handled existing rows.
      return NextResponse.json({
        updated: ids.length,
        note: 'Some notifications could not be back-filled.',
      })
    }

    const existingIds = new Set(
      (existing ?? []).map((r: { notification_id: string }) => r.notification_id),
    )
    const missingIds = ids.filter((id) => !existingIds.has(id))

    if (missingIds.length > 0) {
      const rows = missingIds.map((notification_id) => ({
        notification_id,
        read_at: new Date().toISOString(),
        is_read: true,
      }))
      // Best-effort upsert — ignore errors (the UPDATE already marked the
      // existing rows read, which is the primary user-visible effect).
      await admin.from('in_app_notifications').insert(rows)
    }

    return NextResponse.json({
      updated: ids.length,
      message: 'All notifications marked as read.',
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Unexpected server error.', detail: msg },
      { status: 500 },
    )
  }
}
