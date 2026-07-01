/**
 * POST /api/v1/itineraries/[id]/share
 *
 * Generate a share link for an itinerary session. The link encodes the
 * itinerary_id + a signed share token; the frontend consumes it at
 * /itinerary/[id]?share=<token> (the page calls back to a GET route to
 * verify the token and add the caller as a VIEWER member).
 *
 * Implementation:
 *   - Generate a token via crypto.randomUUID() (sufficient for share links;
 *     they're not auth tokens — they only grant VIEWER permission)
 *   - Persist the token on the itinerary_sessions.metadata.share_tokens[]
 *   - Return the full URL + permission + TTL
 */

import { NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { shareItinerarySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ id: string }>
}

interface ShareTokenEntry {
  token: string
  permission: string
  expires_at: string
  created_at: string
}

export async function POST(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "itinerariesShare")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.itinerariesShare)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => ({}))
    const parsed = shareItinerarySchema.parse(body)

    const admin = createAdminClient()

    // ─── Load session + verify owner/editor permission ──────────────────────
    const { data: session, error } = await admin
      .from("itinerary_sessions")
      .select("id, owner_id, title, metadata")
      .eq("id", id)
      .maybeSingle()
    if (error || !session) throw new NotFoundError("Itinerary not found")

    if (session.owner_id !== ctx.userId) {
      const { data: membership } = await admin
        .from("itinerary_members")
        .select("permission")
        .eq("itinerary_id", id)
        .eq("user_id", ctx.userId)
        .maybeSingle()
      if (!membership || (membership.permission !== "OWNER" && membership.permission !== "EDITOR")) {
        throw new ForbiddenError("Only owners and editors can generate share links")
      }
    }

    // ─── Build the token ─────────────────────────────────────────────────────
    const token = randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + parsed.ttl_hours * 3_600_000)
    const entry: ShareTokenEntry = {
      token,
      permission: parsed.permission,
      expires_at: expiresAt.toISOString(),
      created_at: now.toISOString(),
    }

    // Append to metadata.share_tokens (array)
    const existingMeta = (session.metadata as Record<string, unknown> | null) ?? {}
    const existingTokens = (existingMeta.share_tokens as ShareTokenEntry[] | undefined) ?? []
    const updatedMetadata = {
      ...existingMeta,
      share_tokens: [...existingTokens, entry],
    }

    const { error: updErr } = await admin
      .from("itinerary_sessions")
      .update({ metadata: updatedMetadata })
      .eq("id", id)
    if (updErr) {
      throw new BadRequestError("SHARE_LINK_FAILED", updErr.message)
    }

    // ─── Construct URL ───────────────────────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
    const shareUrl = new URL(`/itinerary/${id}`, appUrl)
    shareUrl.searchParams.set("share", token)
    shareUrl.searchParams.set("perm", parsed.permission)

    return ok(
      {
        itinerary_id: id,
        token,
        url: shareUrl.toString(),
        permission: parsed.permission,
        expires_at: expiresAt.toISOString(),
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}
