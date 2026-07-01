/**
 * POST /api/v1/inventory/[id]/unpublish
 *
 * Transition an item from PUBLISHED/ACTIVE/PAUSED → DRAFT (hides it from the
 * marketplace without losing the row). Side effects:
 *   - emits inventory.updated domain event with action=unpublish
 *
 * BR-I-004: only the owning VendorAccount may update an InventoryItem.
 *
 * NOTE: This endpoint was originally created by the P0-2 agent (vendor
 * dashboard wiring). It was accidentally removed during P0-1's cleanup of
 * "unexpected" files and is restored here so the Unpublish button on
 * `/vendor/listings/page.tsx` continues to work.
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

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryUnpublish")
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

    // Idempotent: already draft → short-circuit.
    if (item.status === "DRAFT") {
      return ok({ id, status: "DRAFT", already_draft: true })
    }

    const nowIso = new Date().toISOString()
    const { data: updated, error } = await admin
      .from("inventory_items")
      .update({
        status: "DRAFT",
        updated_at: nowIso,
      })
      .eq("id", id)
      .select("*")
      .single()

    if (error || !updated) {
      throw new BadRequestError("UNPUBLISH_FAILED", error?.message ?? "Unknown error")
    }

    await admin.from("domain_events").insert({
      event_type: "inventory.updated",
      entity_type: "inventory_item",
      entity_id: id,
      payload: {
        vendor_id: item.vendor_id,
        title: item.title,
        action: "unpublish",
        previous_status: item.status,
      },
    })

    return ok(updated, { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } })
  } catch (err) {
    return handleError(err)
  }
}
