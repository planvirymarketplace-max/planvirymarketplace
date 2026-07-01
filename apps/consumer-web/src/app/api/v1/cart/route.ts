/**
 * GET /api/v1/cart
 *
 * Returns the current user's ACTIVE cart with line items + enriched item
 * metadata. Lazily creates a cart if none exists.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, BadRequestError } from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
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

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "cartGet")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.cartGet)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    // ─── Find or create ACTIVE cart ───────────────────────────────────────────
    const { data: existing } = await admin
      .from("carts")
      .select("id, user_id, status, created_at")
      .eq("user_id", ctx.userId)
      .eq("status", "ACTIVE")
      .maybeSingle()

    let cart = existing
    if (!cart) {
      const { data: created, error } = await admin
        .from("carts")
        .insert({ user_id: ctx.userId, status: "ACTIVE" })
        .select("id, user_id, status, created_at")
        .single()
      if (error || !created) {
        throw new BadRequestError("CART_INIT_FAILED", error?.message ?? "Unknown error")
      }
      cart = created
    }

    // ─── Load line items + enrich with item metadata ─────────────────────────
    const { data: lines, error: linesErr } = await admin
      .from("cart_line_items")
      .select("id, cart_id, item_id, quantity, unit_price_cents, total_price_cents")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: false })
    if (linesErr) throw new BadRequestError("CART_LOAD_FAILED", linesErr.message)

    const itemIds = (lines ?? []).map((l) => l.item_id).filter(Boolean) as string[]
    const { data: items } = itemIds.length
      ? await admin
          .from("inventory_items")
          .select("id, title, slug, vendor_id, status, currency, max_quantity_per_booking")
          .in("id", itemIds)
      : Promise.resolve({ data: [] as unknown[] })

    const itemMap = new Map(
      (items ?? []).map((i) => [(i as { id: string }).id, i]),
    )

    const enrichedLines = (lines ?? []).map((l) => ({
      ...l,
      item: itemMap.get(l.item_id) ?? null,
    }))

    const subtotalCents = enrichedLines.reduce(
      (sum, l) => sum + (l.total_price_cents ?? 0),
      0,
    )

    return ok(
      {
        ...cart,
        line_items: enrichedLines,
        subtotal_cents: subtotalCents,
        item_count: enrichedLines.length,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}
