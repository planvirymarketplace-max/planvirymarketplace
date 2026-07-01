/**
 * DELETE /api/v1/cart/items/[cartLineId]
 *
 * Remove a single cart line item. The RLS policy on cart_line_items ensures
 * the line belongs to a cart owned by the current user.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, NotFoundError, ForbiddenError } from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ cartLineId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteCtx) {
  try {
    const { cartLineId } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "cartRemove")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.cartRemove)
    if (!rl.allowed) return tooMany()

    // ─── Verify the line item belongs to one of the user's carts ─────────────
    const admin = createAdminClient()
    const { data: line, error } = await admin
      .from("cart_line_items")
      .select("id, cart_id")
      .eq("id", cartLineId)
      .maybeSingle()
    if (error || !line) throw new NotFoundError("Cart line item not found")

    const { data: cart } = await admin
      .from("carts")
      .select("id, user_id")
      .eq("id", line.cart_id)
      .maybeSingle()
    if (!cart || cart.user_id !== ctx.userId) {
      throw new ForbiddenError("You do not have access to this cart line item")
    }

    const { error: delErr } = await admin
      .from("cart_line_items")
      .delete()
      .eq("id", cartLineId)
    if (delErr) {
      throw new NotFoundError("Failed to remove cart line item")
    }

    return ok({ id: cartLineId, removed: true })
  } catch (err) {
    return handleError(err)
  }
}
