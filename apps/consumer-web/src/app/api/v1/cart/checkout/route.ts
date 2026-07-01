/**
 * POST /api/v1/cart/checkout
 *
 * Thin wrapper around the existing (and more complete) `/api/checkout` route.
 * The v1 surface should still expose `/api/v1/cart/checkout` so mobile +
 * external clients have a stable, versioned URL. Internally we mirror the
 * same logic — read the user's ACTIVE cart, transform line items into the
 * `cart_items` shape `/api/checkout` expects, and call its handler in-process.
 *
 * If the request body supplies `cart_items` directly, those are used instead
 * of reading from the cart (matching `/api/checkout` semantics).
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { checkoutSchema } from "@/lib/api/schemas"
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

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "cartCheckout")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.cartCheckout)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => ({}))
    const parsed = checkoutSchema.parse(body)

    const admin = createAdminClient()

    // ─── Build cart_items from the user's ACTIVE cart if not supplied ────────
    let cartItems = parsed.cart_items
    if (!cartItems || cartItems.length === 0) {
      const { data: cart } = await admin
        .from("carts")
        .select("id")
        .eq("user_id", ctx.userId)
        .eq("status", "ACTIVE")
        .maybeSingle()
      if (!cart) {
        throw new BadRequestError("NO_ACTIVE_CART", "User has no active cart")
      }
      const { data: lines } = await admin
        .from("cart_line_items")
        .select("item_id, quantity, unit_price_cents")
        .eq("cart_id", cart.id)
      if (!lines || lines.length === 0) {
        throw new BadRequestError("EMPTY_CART", "Cart has no items")
      }
      cartItems = lines.map((l) => ({
        item_id: l.item_id,
        quantity: l.quantity,
        unit_price_cents: l.unit_price_cents ?? undefined,
      }))
    }

    // ─── Resolve vendor_id for each item (used for Stripe Connect metadata) ──
    const itemIds = cartItems.map((i) => i.item_id)
    const { data: items } = await admin
      .from("inventory_items")
      .select("id, vendor_id, base_price_cents, currency, status, title, category, metadata")
      .in("id", itemIds)

    const itemMap = new Map((items ?? []).map((i) => [i.id, i]))

    // ─── Validate all items still PUBLISHED ─────────────────────────────────
    const unavailable = cartItems.filter((ci) => {
      const inv = itemMap.get(ci.item_id)
      return !inv || inv.status !== "PUBLISHED"
    })
    if (unavailable.length > 0) {
      throw new BadRequestError(
        "ITEM_UNAVAILABLE",
        "One or more items in your cart are no longer available",
        { unavailable_items: unavailable.map((u) => u.item_id) },
      )
    }

    // ─── Construct payload for /api/checkout ────────────────────────────────
    // The /api/checkout handler expects CartItem[] from `@/lib/cart-context`
    // with shape { type, listing_id|vendor_id|experience_slot_id, name, amount, quantity }.
    // We translate our v1 cart_items into that shape here.
    //
    // FIX-5: use the shared pricing adapter to derive the per-unit price
    // (quantity=1) so the model is honoured even before /api/checkout applies
    // its own per-item pricing. The downstream /api/checkout route re-fetches
    // inventory_items + metadata.pricing_model and applies the full multiplier
    // (nights / guests / seats / slots / hours) — here we just resolve the
    // authoritative base price.
    const checkoutPayload = {
      cart_items: cartItems.map((ci) => {
        const inv = itemMap.get(ci.item_id)!
        const metadata = (inv.metadata ?? {}) as { pricing_model?: PricingModel }
        const category = (inv.category as string | null) ?? undefined
        const pricingModel = metadata.pricing_model ?? pricingModelForCategory(category ?? "")
        const priceResult = calculatePrice(
          admin,
          {
            base_price_cents: (inv.base_price_cents ?? 0) as number,
            pricing_model: pricingModel,
            category,
          },
          { quantity: 1 },
        )
        return {
          type: "inventory",
          listing_id: ci.item_id,
          vendor_id: inv.vendor_id,
          name: inv.title,
          amount: priceResult.total_cents / 100,
          quantity: ci.quantity,
        }
      }),
      trip_id: parsed.itinerary_session_id,
      promo_code: parsed.promo_code,
      idempotency_key: parsed.idempotency_key ?? `v1-${ctx.userId}-${Date.now()}`,
      question_answers: [],
    }

    // ─── In-process fetch to /api/checkout ──────────────────────────────────
    // We use a relative URL so Caddy routes correctly. The internal endpoint
    // reads the auth cookies via the same Supabase server client, so the
    // session is preserved.
    const baseUrl = request.nextUrl.origin
    const checkoutUrl = new URL("/api/checkout", baseUrl)
    const checkoutRes = await fetch(checkoutUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(checkoutPayload),
    })

    const checkoutBody = await checkoutRes.json().catch(() => null)
    if (!checkoutRes.ok || !checkoutBody) {
      throw new BadRequestError(
        "CHECKOUT_FAILED",
        `Upstream /api/checkout returned ${checkoutRes.status}`,
        checkoutBody,
      )
    }

    // ─── Clear the user's ACTIVE cart after a successful checkout ───────────
    await admin
      .from("carts")
      .update({ status: "CONVERTED" })
      .eq("user_id", ctx.userId)
      .eq("status", "ACTIVE")

    return ok(checkoutBody, {
      rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
    })
  } catch (err) {
    return handleError(err)
  }
}
