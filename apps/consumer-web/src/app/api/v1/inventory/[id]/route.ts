/**
 * GET    /api/v1/inventory/[id]    — single item with vendor + media + pricing
 * PATCH  /api/v1/inventory/[id]    — update item (owner only; BR-I-004)
 * DELETE /api/v1/inventory/[id]    — soft delete → ARCHIVED (BR-I-003: active reservations block)
 *
 * BR-I-003: An item with active (PENDING/CONFIRMED) reservations cannot be
 *           deleted; it must be paused first or the reservations cancelled.
 * BR-I-004: Only the vendor that owns the item (or an admin) may update it.
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
import { getAuthContext, requireAuthContext } from "@/lib/api/auth"
import { updateInventorySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ id: string }>
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await getAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx?.userId, getClientIp(request), "inventoryGet")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryGet)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()
    const { data: item, error } = await admin
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .maybeSingle()
    if (error || !item) throw new NotFoundError("Inventory item not found")

    // Visibility gate: non-published items only visible to the owning vendor
    if (item.status !== "PUBLISHED") {
      if (!ctx || !ctx.vendorMemberships.some((m) => m.vendor_id === item.vendor_id)) {
        throw new NotFoundError("Inventory item not found")
      }
    }

    // Fetch vendor + media + ticket tiers in parallel
    const [vendorRes, mediaRes, tiersRes, locationRes] = await Promise.all([
      admin
        .from("vendor_accounts")
        .select("id, name, slug, description, phone, email, website_url, status")
        .eq("id", item.vendor_id)
        .maybeSingle(),
      admin
        .from("media_assets")
        .select("id, url, alt_text, media_type, sort_order, is_primary")
        .eq("item_id", id)
        .order("sort_order", { ascending: true }),
      admin
        .from("ticket_tiers")
        .select("id, name, description, price_cents, quantity_total, quantity_reserved, sort_order")
        .eq("item_id", id)
        .order("sort_order", { ascending: true }),
      item.location_id
        ? admin
            .from("locations")
            .select("id, name, slug, country_code, region, latitude, longitude, timezone")
            .eq("id", item.location_id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])

    return ok(
      {
        ...item,
        vendor: vendorRes.data ?? null,
        media: mediaRes.data ?? [],
        ticket_tiers: tiersRes.data ?? [],
        location: locationRes.data ?? null,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── PATCH ───────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryUpdate")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryUpdate)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")
    const parsed = updateInventorySchema.parse(body)

    const admin = createAdminClient()

    // ─── Load + ownership check (BR-I-004) ────────────────────────────────────
    const { data: item } = await admin
      .from("inventory_items")
      .select("id, vendor_id, status")
      .eq("id", id)
      .maybeSingle()
    if (!item) throw new NotFoundError("Inventory item not found")
    if (!ctx.vendorMemberships.some((m) => m.vendor_id === item.vendor_id)) {
      throw new ForbiddenError("You do not have access to this inventory item")
    }

    // ARCHIVED items cannot be edited (must be restored first)
    if (item.status === "ARCHIVED") {
      throw new ConflictError(
        "ITEM_ARCHIVED",
        "Archived items cannot be edited. Restore the item first.",
      )
    }

    const { data: updated, error } = await admin
      .from("inventory_items")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single()

    if (error || !updated) {
      throw new BadRequestError("INVENTORY_UPDATE_FAILED", error?.message ?? "Unknown error")
    }

    await admin.from("domain_events").insert({
      event_type: "inventory.updated",
      entity_type: "inventory_item",
      entity_id: id,
      payload: { fields: Object.keys(parsed), vendor_id: item.vendor_id },
    })

    return ok(updated)
  } catch (err) {
    return handleError(err)
  }
}

// ─── DELETE (soft delete → ARCHIVED) ─────────────────────────────────────────

export async function DELETE(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryDelete")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryDelete)
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

    // ─── BR-I-003: block if active reservations exist ────────────────────────
    const { count } = await admin
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("item_id", id)
      .in("status", ["PENDING", "CONFIRMED"])

    if ((count ?? 0) > 0) {
      throw new ConflictError(
        "ACTIVE_RESERVATIONS",
        `Cannot delete: ${count} active reservation(s) exist for this item. Pause or cancel them first.`,
        { active_count: count },
      )
    }

    const { error } = await admin
      .from("inventory_items")
      .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      throw new BadRequestError("INVENTORY_DELETE_FAILED", error.message)
    }

    await admin.from("domain_events").insert({
      event_type: "inventory.archived",
      entity_type: "inventory_item",
      entity_id: id,
      payload: { vendor_id: item.vendor_id, previous_status: item.status },
    })

    return ok({ id, status: "ARCHIVED" })
  } catch (err) {
    return handleError(err)
  }
}
