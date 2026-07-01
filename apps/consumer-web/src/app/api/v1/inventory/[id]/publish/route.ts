/**
 * POST /api/v1/inventory/[id]/publish
 *
 * Transition an item from DRAFT/PAUSED → PUBLISHED.
 * Side effects:
 *   - sets published_at = NOW()
 *   - emits inventory.published domain event
 *
 * BR-I-004: only the owning VendorAccount may update an InventoryItem.
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

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryPublish")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryTransition)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    const { data: item } = await admin
      .from("inventory_items")
      .select("id, vendor_id, status, title")
      .eq("id", id)
      .maybeSingle()
    if (!item) throw new NotFoundError("Inventory item not found")
    if (!ctx.vendorMemberships.some((m) => m.vendor_id === item.vendor_id)) {
      throw new ForbiddenError("You do not have access to this inventory item")
    }

    // Idempotent: already published → short-circuit.
    if (item.status === "PUBLISHED" || item.status === "ACTIVE") {
      return ok({ id, status: item.status, already_published: true })
    }

    const nowIso = new Date().toISOString()
    const { data: updated, error } = await admin
      .from("inventory_items")
      .update({
        status: "PUBLISHED",
        published_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", id)
      .select("*")
      .single()

    if (error || !updated) {
      throw new BadRequestError("PUBLISH_FAILED", error?.message ?? "Unknown error")
    }

    await admin.from("domain_events").insert({
      event_type: "inventory.published",
      entity_type: "inventory_item",
      entity_id: id,
      payload: {
        vendor_id: item.vendor_id,
        title: item.title,
        previous_status: item.status,
      },
    })

    return ok(updated, { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } })
  } catch (err) {
    return handleError(err)
  }
}
