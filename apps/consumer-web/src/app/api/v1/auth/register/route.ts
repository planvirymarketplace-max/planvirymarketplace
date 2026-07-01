/**
 * POST /api/v1/auth/register
 *
 * Creates a Supabase Auth user via the admin API, then writes the matching
 * `user_profiles` row. We use the admin client for the profile insert because
 * the just-created user has no session yet (so RLS would block the insert).
 *
 * Flow:
 *   1. Validate body (email/password/display_name?/locale?/phone?)
 *   2. Rate-limit by IP (5/min — prevents credential stuffing)
 *   3. supabaseAdmin.auth.admin.createUser() with email_confirm=false
 *   4. Insert user_profiles row (id = auth user id)
 *   5. Emit `user.registered` domain event
 *   6. Return envelope with user id + email
 */

import { NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, BadRequestError, ConflictError } from "@/lib/api/errors"
import { registerSchema } from "@/lib/api/schemas"
import { buildRateLimitKey, checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/api/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")

    const parsed = registerSchema.parse(body)

    // ─── Rate limit (per-IP; user has no session yet) ────────────────────────
    const rlKey = buildRateLimitKey(null, getClientIp(request), "register")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.authRegister)
    if (!rl.allowed) {
      return tooMany("Too many registration attempts. Please try again shortly.")
    }

    const supabase = createAdminClient()

    // ─── Create the auth user ────────────────────────────────────────────────
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: parsed.email,
      password: parsed.password,
      email_confirm: false,
      user_metadata: {
        display_name: parsed.display_name ?? null,
        locale: parsed.locale ?? null,
        phone: parsed.phone ?? null,
      },
    })

    if (authErr) {
      if (authErr.message.toLowerCase().includes("already")) {
        throw new ConflictError("EMAIL_TAKEN", "An account with this email already exists")
      }
      throw new BadRequestError("SIGNUP_FAILED", authErr.message)
    }
    if (!authData.user) {
      throw new BadRequestError("SIGNUP_FAILED", "Supabase returned no user")
    }

    const userId = authData.user.id

    // ─── Insert user_profiles row (admin client — bypasses RLS) ──────────────
    const { error: profileErr } = await supabase.from("user_profiles").insert({
      id: userId,
      email: parsed.email,
      display_name: parsed.display_name ?? null,
      locale: parsed.locale ?? "en",
      phone: parsed.phone ?? null,
      notification_prefs: { email: true, push: true, sms: false },
    })

    if (profileErr) {
      // Best-effort cleanup: delete the orphaned auth user
      await supabase.auth.admin.deleteUser(userId)
      throw new BadRequestError("PROFILE_CREATE_FAILED", profileErr.message)
    }

    // ─── Emit domain event ──────────────────────────────────────────────────
    await supabase.from("domain_events").insert({
      event_type: "user.registered",
      entity_type: "user",
      entity_id: userId,
      payload: { email: parsed.email, display_name: parsed.display_name ?? null },
    })

    return ok(
      {
        id: userId,
        email: parsed.email,
        display_name: parsed.display_name ?? null,
        email_confirmed: false,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}
