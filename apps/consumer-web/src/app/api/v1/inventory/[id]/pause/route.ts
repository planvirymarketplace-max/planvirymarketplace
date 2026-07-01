/**
 * POST /api/v1/inventory/[id]/pause
 *
 * Transition an item from PUBLISHED → PAUSED.
 * Side effects:
 *   - emits inventory.paused domain event
 *   - active reservations are NOT cancelled (they remain valid); pause only
 *     stops new bookings.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
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

export async function POST(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryPause")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryTransition)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    const { data: item } = await admin
      .from("inventory_items")
      .select("id, vendor_id, status")
      .eq("id", id)
      .maybeSingle()
    if (!item) throw new NotFoundError("Inventory item not found")
    if (!ctx.vendorMemberships.some((m) => m.vendor_id === item.vendor_id)) {
      throw new ForbiddenError("You do not have access to this inventory item")
    }
    if (item.status !== "PUBLISHED") {
      throw new ConflictError(
        "INVALID_TRANSITION",
        `Cannot pause from ${item.status}. Only PUBLISHED items can be paused.`,
        { current_status: item.status, allowed_from: ["PUBLISHED"] },
      )
    }

    const { data: updated, error } = await admin
      .from("inventory_items")
      .update({ status: "PAUSED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single()

    if (error || !updated) {
      throw new BadRequestError("PAUSE_FAILED", error?.message ?? "Unknown error")
    }

    await admin.from("domain_events").insert({
      event_type: "inventory.paused",
      entity_type: "inventory_item",
      entity_id: id,
      payload: { vendor_id: item.vendor_id, previous_status: item.status },
    })

    return ok(updated, { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } })
  } catch (err) {
    return handleError(err)
  }
}
