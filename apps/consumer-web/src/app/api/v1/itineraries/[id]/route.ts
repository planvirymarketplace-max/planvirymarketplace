/**
 * GET /api/v1/itineraries/[id]
 *
 * Returns the itinerary session, all attached reservations (with conflict
 * detection between them), and the member roster.
 *
 * Conflict detection (lightweight): two reservations conflict if their
 * [starts_at, ends_at) ranges overlap. We mark each reservation with
 * `conflicts_with: string[]` listing the IDs it overlaps.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  NotFoundError,
  ForbiddenError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ id: string }>
}

interface Reservation {
  id: string
  starts_at: string | null
  ends_at: string | null
  [k: string]: unknown
}

export async function GET(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "itinerariesGet")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.itinerariesGet)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    const { data: session, error } = await admin
      .from("itinerary_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle()
    if (error || !session) throw new NotFoundError("Itinerary not found")

    // ─── Visibility: owner or member ────────────────────────────────────────
    const { data: membership } = await admin
      .from("itinerary_members")
      .select("user_id, permission")
      .eq("itinerary_id", id)
      .eq("user_id", ctx.userId)
      .maybeSingle()
    if (!membership && session.owner_id !== ctx.userId) {
      throw new ForbiddenError("You do not have access to this itinerary")
    }

    // ─── Load reservations + members in parallel ─────────────────────────────
    const [reservationsRes, membersRes] = await Promise.all([
      admin
        .from("reservations")
        .select(
          "id, item_id, vendor_id, status, quantity, unit_price_cents, total_price_cents, currency, starts_at, ends_at, confirmed_at, cancelled_at",
        )
        .eq("itinerary_session_id", id)
        .order("starts_at", { ascending: true, nullsFirst: false }),
      admin
        .from("itinerary_members")
        .select("id, user_id, permission, created_at")
        .eq("itinerary_id", id)
        .order("created_at", { ascending: true }),
    ])

    const reservations = (reservationsRes.data ?? []) as Reservation[]
    const members = membersRes.data ?? []

    // ─── Conflict detection ──────────────────────────────────────────────────
    const enrichedReservations = reservations.map((r) => ({
      ...r,
      conflicts_with: findConflicts(r, reservations),
    }))

    const conflictCount = enrichedReservations.filter(
      (r) => r.conflicts_with.length > 0,
    ).length

    return ok(
      {
        ...session,
        permission: membership?.permission ?? "OWNER",
        reservations: enrichedReservations,
        members,
        conflict_count: conflictCount,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findConflicts(r: Reservation, all: Reservation[]): string[] {
  if (!r.starts_at || !r.ends_at) return []
  const start = new Date(r.starts_at).getTime()
  const end = new Date(r.ends_at).getTime()
  return all
    .filter(
      (o) =>
        o.id !== r.id &&
        o.starts_at &&
        o.ends_at &&
        rangesOverlap(
          start,
          end,
          new Date(o.starts_at).getTime(),
          new Date(o.ends_at).getTime(),
        ),
    )
    .map((o) => o.id)
}

function rangesOverlap(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && s2 < e1
}
