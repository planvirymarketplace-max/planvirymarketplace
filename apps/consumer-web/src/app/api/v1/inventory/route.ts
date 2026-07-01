/**
 * GET  /api/v1/inventory   — paginated PUBLISHED inventory list
 * POST /api/v1/inventory   — create a DRAFT inventory_item (vendor only)
 *
 * BR-GLOBAL-001: location_id is required for every inventory item. The list
 * endpoint enforces this via a `location_id` query param — public shoppers
 * must always be browsing within a location gate.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, created, tooMany } from "@/lib/api/envelope"
import { handleError, BadRequestError, ForbiddenError, ValidationError } from "@/lib/api/errors"
import { requireAuthContext, requireVendorContext } from "@/lib/api/auth"
import { createInventorySchema, inventoryListQuerySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = inventoryListQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    )

    // BR-GLOBAL-001: location gate. Allow anonymous browsing, but only within
    // a location context. Vendor_id bypass is for vendor preview of own items.
    if (!parsed.location_id && !parsed.vendor_id) {
      throw new ValidationError(
        "location_id is required (BR-GLOBAL-001). Pass vendor_id to view a vendor's own items.",
      )
    }

    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase).catch(() => null)

    const rlKey = buildRateLimitKey(ctx?.userId, getClientIp(request), "inventoryList")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryList)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()

    let query = admin
      .from("inventory_items")
      .select(
        "id, vendor_id, location_id, title, slug, description, category, status, base_price_cents, currency, max_quantity_per_booking, cancellation_policy, quality_score, published_at, created_at",
        { count: "exact" },
      )
      .eq("status", "PUBLISHED")

    if (parsed.location_id) query = query.eq("location_id", parsed.location_id)
    if (parsed.vendor_id) {
      // Vendor preview path: allow non-published items too if the caller is
      // staff of that vendor.
      if (ctx && ctx.vendorMemberships.some((m) => m.vendor_id === parsed.vendor_id)) {
        query = query.in("status", ["PUBLISHED", "PAUSED", "DRAFT"])
      } else {
        query = query.eq("status", "PUBLISHED")
      }
      query = query.eq("vendor_id", parsed.vendor_id)
    }
    if (parsed.category) query = query.eq("category", parsed.category)
    if (parsed.q) {
      query = query.or(`title.ilike.%${parsed.q}%,description.ilike.%${parsed.q}%`)
    }
    if (parsed.min_price_cents !== undefined)
      (query as unknown as { gte: (c: string, v: number) => unknown }).gte(
        "base_price_cents",
        parsed.min_price_cents,
      )
    if (parsed.max_price_cents !== undefined)
      (query as unknown as { lte: (c: string, v: number) => unknown }).lte(
        "base_price_cents",
        parsed.max_price_cents,
      )

    switch (parsed.sort) {
      case "newest":
        query = query.order("published_at", { ascending: false, nullsFirst: false })
        break
      case "price_asc":
        query = query.order("base_price_cents", { ascending: true, nullsFirst: true })
        break
      case "price_desc":
        query = query.order("base_price_cents", { ascending: false, nullsFirst: true })
        break
      case "quality":
        query = query.order("quality_score", { ascending: false, nullsFirst: true })
        break
    }

    query = query.range(parsed.offset, parsed.offset + parsed.limit - 1)

    const { data, count } = await query

    return ok(
      { items: data ?? [] },
      {
        limit: parsed.limit,
        offset: parsed.offset,
        total: count ?? 0,
        rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
      },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)
    if (!ctx.isVendor) throw new ForbiddenError("Only vendor staff may create inventory items")

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "inventoryCreate")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.inventoryCreate)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")
    const parsed = createInventorySchema.parse(body)

    // Vendor context — verify the user is staff of the supplied vendor_id.
    const vendorCtx = await requireVendorContext(supabase, parsed.vendor_id)

    const admin = createAdminClient()

    // ─── Verify location exists ───────────────────────────────────────────────
    const { data: loc } = await admin
      .from("locations")
      .select("id")
      .eq("id", parsed.location_id)
      .maybeSingle()
    if (!loc) throw new BadRequestError("INVALID_LOCATION", "location_id does not exist")

    // ─── Generate slug if not supplied ────────────────────────────────────────
    const slug = parsed.slug ?? slugify(parsed.title)

    // ─── Insert inventory_items row (DRAFT) ───────────────────────────────────
    const { data: item, error: itemErr } = await admin
      .from("inventory_items")
      .insert({
        vendor_id: vendorCtx.vendorId,
        location_id: parsed.location_id,
        title: parsed.title,
        slug,
        description: parsed.description ?? null,
        category: parsed.category ?? null,
        status: "DRAFT",
        base_price_cents: parsed.base_price_cents ?? 0,
        currency: parsed.currency ?? "USD",
        max_quantity_per_booking: parsed.max_quantity_per_booking ?? 1,
        cancellation_policy: parsed.cancellation_policy ?? "FLEXIBLE",
        quality_score: 0,
        metadata: parsed.metadata ?? {},
      })
      .select("*")
      .single()

    if (itemErr || !item) {
      throw new BadRequestError("INVENTORY_CREATE_FAILED", itemErr?.message ?? "Unknown error")
    }

    // ─── Optional inline media ────────────────────────────────────────────────
    if (parsed.media && parsed.media.length > 0) {
      const mediaRows = parsed.media.map((m, i) => ({
        item_id: item.id,
        url: m.url,
        alt_text: m.alt_text ?? null,
        media_type: m.media_type ?? "IMAGE",
        is_primary: m.is_primary ?? i === 0,
        sort_order: m.sort_order ?? i,
      }))
      await admin.from("media_assets").insert(mediaRows)
    }

    // ─── Optional inline ticket tiers ────────────────────────────────────────
    if (parsed.ticket_tiers && parsed.ticket_tiers.length > 0) {
      const tierRows = parsed.ticket_tiers.map((t, i) => ({
        item_id: item.id,
        name: t.name,
        description: t.description ?? null,
        price_cents: t.price_cents,
        quantity_total: t.quantity_total,
        quantity_reserved: 0,
        sort_order: t.sort_order ?? i,
      }))
      await admin.from("ticket_tiers").insert(tierRows)
    }

    // ─── Domain event ────────────────────────────────────────────────────────
    await admin.from("domain_events").insert({
      event_type: "inventory.created",
      entity_type: "inventory_item",
      entity_id: item.id,
      payload: { vendor_id: vendorCtx.vendorId, title: item.title, status: "DRAFT" },
    })

    return created(item, { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } })
  } catch (err) {
    return handleError(err)
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}
