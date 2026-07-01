/**
 * POST /api/v1/itineraries
 *
 * Create a new itinerary_session owned by the current user. Optionally:
 *   - attach an existing reservation_id (must be owned by caller)
 *   - seed members (OWNER added implicitly; additional members queued via email)
 *
 * Returns the created session with the owner member row.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, created, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
  NotFoundError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { createItinerarySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "itinerariesCreate")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.itinerariesCreate)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")
    const parsed = createItinerarySchema.parse(body)

    const admin = createAdminClient()

    // ─── Validate optional reservation belongs to caller ─────────────────────
    if (parsed.reservation_id) {
      const { data: res } = await admin
        .from("reservations")
        .select("id, user_id")
        .eq("id", parsed.reservation_id)
        .maybeSingle()
      if (!res) throw new NotFoundError("Reservation not found")
      if (res.user_id !== ctx.userId) {
        throw new NotFoundError("Reservation not found")
      }
    }

    // ─── Create the itinerary session ────────────────────────────────────────
    const { data: session, error: sErr } = await admin
      .from("itinerary_sessions")
      .insert({
        owner_id: ctx.userId,
        title: parsed.title,
        status: "ACTIVE",
        occasion_type: parsed.occasion_type ?? null,
      })
      .select("*")
      .single()
    if (sErr || !session) {
      throw new BadRequestError("ITINERARY_CREATE_FAILED", sErr?.message ?? "Unknown error")
    }

    // ─── Add owner as a member with OWNER permission ────────────────────────
    await admin.from("itinerary_members").insert({
      itinerary_id: session.id,
      user_id: ctx.userId,
      permission: "OWNER",
    })

    // ─── Attach the reservation to the itinerary (if supplied) ──────────────
    if (parsed.reservation_id) {
      await admin
        .from("reservations")
        .update({ itinerary_session_id: session.id })
        .eq("id", parsed.reservation_id)
    }

    // ─── Seed additional members (those with a user_id; email invites queued) ─
    if (parsed.members && parsed.members.length > 0) {
      const memberRows = parsed.members
        .filter((m) => m.user_id)
        .map((m) => ({
          itinerary_id: session.id,
          user_id: m.user_id!,
          permission: m.permission,
        }))
      if (memberRows.length > 0) {
        await admin.from("itinerary_members").insert(memberRows)
      }
    }

    // ─── Domain event ────────────────────────────────────────────────────────
    await admin.from("domain_events").insert({
      event_type: "itinerary.created",
      entity_type: "itinerary_session",
      entity_id: session.id,
      payload: { owner_id: ctx.userId, title: session.title },
    })

    return created(session, {
      rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
    })
  } catch (err) {
    return handleError(err)
  }
}

// ─── GET (list user's itineraries) ───────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "itinerariesList")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.itinerariesGet)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    const { data, count, error } = await admin
      .from("itinerary_sessions")
      .select(
        "id, owner_id, title, status, occasion_type, created_at",
        { count: "exact" },
      )
      .eq("owner_id", ctx.userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw new BadRequestError("ITINERARY_LIST_FAILED", error.message)

    return ok(
      { itineraries: data ?? [] },
      {
        total: count ?? 0,
        limit: 50,
        offset: 0,
        rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
      },
    )
  } catch (err) {
    return handleError(err)
  }
}
