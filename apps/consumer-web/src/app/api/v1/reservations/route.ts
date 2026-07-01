/**
 * GET /api/v1/reservations
 *
 * List the current user's reservations. RLS on the user-scoped server client
 * gates reads to `reservations.user_id = auth.uid()` so we don't need an
 * extra WHERE clause.
 *
 * Query params:
 *   status?              — filter by single status
 *   itinerary_session_id? — filter by itinerary
 *   limit, offset        — pagination (defaults 25 / 0)
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, BadRequestError } from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { reservationListQuerySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "reservationsList")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.reservationsList)
    if (!rl.allowed) return tooMany()

    const { searchParams } = new URL(request.url)
    const parsed = reservationListQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    )

    let query = supabase
      .from("reservations")
      .select(
        "id, item_id, vendor_id, itinerary_session_id, status, quantity, unit_price_cents, total_price_cents, currency, starts_at, ends_at, confirmed_at, cancelled_at, completed_at, expired_at, ttl_expires_at, created_at",
        { count: "exact" },
      )
      .eq("user_id", ctx.userId)

    if (parsed.status) query = query.eq("status", parsed.status)
    if (parsed.itinerary_session_id) {
      query = query.eq("itinerary_session_id", parsed.itinerary_session_id)
    }

    query = query
      .order("created_at", { ascending: false })
      .range(parsed.offset, parsed.offset + parsed.limit - 1)

    const { data, count, error } = await query
    if (error) throw new BadRequestError("RESERVATION_LIST_FAILED", error.message)

    return ok(
      { reservations: data ?? [] },
      {
        limit: parsed.limit,
        offset: parsed.offset,
        total: count ?? 0,
        rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
      },
    )
  } catch (err) {
    return handleError(err)
  }
}
