/**
 * GET  /api/v1/auth/me      — current user profile + vendor memberships
 * PATCH /api/v1/auth/me     — update display_name / locale / phone / avatar_url / notification_prefs
 *
 * Uses the cookie-scoped server client so RLS gates reads to the current user.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, BadRequestError, NotFoundError } from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { updateProfileSchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "authMe")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.authMe)
    if (!rl.allowed) return tooMany()

    if (!ctx.profile) {
      // Auth user exists but profile row is missing — auto-create a stub.
      const admin = createAdminClient()
      const { data: stub, error } = await admin
        .from("user_profiles")
        .insert({
          id: ctx.userId,
          email: ctx.user.email,
          display_name: null,
          locale: "en",
          notification_prefs: { email: true, push: true, sms: false },
        })
        .select(
          "id, email, display_name, locale, phone, avatar_url, notification_prefs",
        )
        .single()
      if (error || !stub) {
        throw new NotFoundError("User profile not found and could not be created")
      }
      ctx.profile = stub
    }

    return ok(
      {
        id: ctx.userId,
        email: ctx.user.email,
        phone: ctx.user.phone,
        profile: ctx.profile,
        vendor_memberships: ctx.vendorMemberships,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── PATCH ───────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "authPatch")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.authPatch)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")
    const parsed = updateProfileSchema.parse(body)

    // Use the user-scoped client — RLS will allow updating own row.
    const { data: updated, error } = await supabase
      .from("user_profiles")
      .update(parsed)
      .eq("id", ctx.userId)
      .select(
        "id, email, display_name, locale, phone, avatar_url, notification_prefs",
      )
      .single()

    if (error || !updated) {
      // RLS may have blocked the update (e.g. profile row missing). Fall back to
      // admin client so the call still succeeds for the legitimate owner.
      const admin = createAdminClient()
      const { data: adminUpdated, error: adminErr } = await admin
        .from("user_profiles")
        .update(parsed)
        .eq("id", ctx.userId)
        .select(
          "id, email, display_name, locale, phone, avatar_url, notification_prefs",
        )
        .single()
      if (adminErr || !adminUpdated) {
        throw new BadRequestError(
          "PROFILE_UPDATE_FAILED",
          adminErr?.message ?? error?.message ?? "Unknown error",
        )
      }
      return ok({ profile: adminUpdated })
    }

    return ok({ profile: updated })
  } catch (err) {
    return handleError(err)
  }
}
