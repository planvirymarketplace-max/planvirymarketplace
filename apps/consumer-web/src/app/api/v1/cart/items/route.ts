/**
 * POST /api/v1/cart/items
 *
 * Add an item to the current user's ACTIVE cart. Lazily creates a cart if
 * none exists. Verifies the inventory item is PUBLISHED and respects
 * max_quantity_per_booking.
 *
 * Behaviour:
 *   - If the (cart_id, item_id) pair already exists, increment quantity.
 *   - Otherwise insert a new cart_line_item row.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
  NotFoundError,
  ConflictError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { addCartItemSchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"
import { calculatePrice, pricingModelForCategory, type PricingModel } from "@planviry/shared"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "cartAdd")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.cartAdd)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => null)
    if (!body) throw new BadRequestError("Request body must be JSON")
    const parsed = addCartItemSchema.parse(body)

    const admin = createAdminClient()

    // ─── Verify inventory item is PUBLISHED ───────────────────────────────────
    const { data: item } = await admin
      .from("inventory_items")
      .select("id, vendor_id, base_price_cents, currency, status, max_quantity_per_booking, category, metadata")
      .eq("id", parsed.item_id)
      .maybeSingle()
    if (!item) throw new NotFoundError("Inventory item not found")
    if (item.status !== "PUBLISHED") {
      throw new ConflictError(
        "ITEM_UNAVAILABLE",
        `Item is ${item.status}, cannot add to cart`,
        { current_status: item.status },
      )
    }

    const maxQty = (item.max_quantity_per_booking ?? 1) as number
    if (parsed.quantity > maxQty) {
      throw new BadRequestError(
        "QTY_EXCEEDED",
        `Quantity ${parsed.quantity} exceeds max_per_booking ${maxQty}`,
        { max_per_booking: maxQty },
      )
    }

    // ─── FIX-5: model-aware per-unit + total pricing via shared adapter ────
    // Previously: `parsed.unit_price_cents ?? item.base_price_cents ?? 0`.
    // Now: resolve the authoritative unit price through `calculatePrice` so
    // metadata.pricing_model is honoured. We compute the per-unit price with
    // quantity=1, then multiply by the requested quantity for the line total
    // (preserving the prior flat-multiply behaviour for FLAT items).
    const metadata = (item.metadata ?? {}) as { pricing_model?: PricingModel }
    const category = (item.category as string | null) ?? undefined
    const pricingModel = metadata.pricing_model ?? pricingModelForCategory(category ?? "")
    const unitPriceResult = calculatePrice(
      admin,
      {
        base_price_cents: parsed.unit_price_cents ?? ((item.base_price_cents as number) ?? 0),
        pricing_model: pricingModel,
        category,
      },
      { quantity: 1 },
    )
    const unitPriceCents = unitPriceResult.total_cents
    const totalPriceCents = unitPriceCents * parsed.quantity

    // ─── Find or create ACTIVE cart ───────────────────────────────────────────
    const { data: existingCart } = await admin
      .from("carts")
      .select("id")
      .eq("user_id", ctx.userId)
      .eq("status", "ACTIVE")
      .maybeSingle()

    let cartId: string
    if (existingCart) {
      cartId = existingCart.id
    } else {
      const { data: newCart, error: cErr } = await admin
        .from("carts")
        .insert({ user_id: ctx.userId, status: "ACTIVE" })
        .select("id")
        .single()
      if (cErr || !newCart) {
        throw new BadRequestError("CART_INIT_FAILED", cErr?.message ?? "Unknown error")
      }
      cartId = newCart.id
    }

    // ─── Increment or insert ──────────────────────────────────────────────────
    const { data: existingLine } = await admin
      .from("cart_line_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("item_id", parsed.item_id)
      .maybeSingle()

    if (existingLine) {
      const newQty = existingLine.quantity + parsed.quantity
      if (newQty > maxQty) {
        throw new BadRequestError(
          "QTY_EXCEEDED",
          `Total quantity ${newQty} would exceed max_per_booking ${maxQty}`,
          { max_per_booking: maxQty, current_in_cart: existingLine.quantity },
        )
      }
      const { data: updated, error: uErr } = await admin
        .from("cart_line_items")
        .update({
          quantity: newQty,
          unit_price_cents: unitPriceCents,
          total_price_cents: unitPriceCents * newQty,
        })
        .eq("id", existingLine.id)
        .select("id, cart_id, item_id, quantity, unit_price_cents, total_price_cents")
        .single()
      if (uErr || !updated) {
        throw new BadRequestError("CART_UPDATE_FAILED", uErr?.message ?? "Unknown error")
      }
      return ok({ line_item: updated, action: "incremented" })
    }

    const { data: inserted, error: iErr } = await admin
      .from("cart_line_items")
      .insert({
        cart_id: cartId,
        item_id: parsed.item_id,
        quantity: parsed.quantity,
        unit_price_cents: unitPriceCents,
        total_price_cents: totalPriceCents,
      })
      .select("id, cart_id, item_id, quantity, unit_price_cents, total_price_cents")
      .single()
    if (iErr || !inserted) {
      throw new BadRequestError("CART_INSERT_FAILED", iErr?.message ?? "Unknown error")
    }

    return ok({ line_item: inserted, action: "inserted" })
  } catch (err) {
    return handleError(err)
  }
}
