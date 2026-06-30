/**
 * Part XI §11.3.4 — GET /api/v1/cart  +  POST /api/v1/cart/items  +  DELETE /api/v1/cart/items/:cartLineId
 * GET:         Current cart state. Auth: optional. P95 < 150ms.
 * POST items:  Add item (no inventory hold). BR-I-005: PAUSED items rejected.
 * DELETE:      Remove line item. P95 < 150ms.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, RATE_LIMITED, INTERNAL_ERROR, ITEM_NOT_FOUND, ITEM_UNAVAILABLE } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { CartAddItemInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

// GET /api/v1/cart
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  try {
    let cart = null;
    if (auth.userId) {
      const { data } = await supabase
        .from("carts")
        .select("id, items:cart_line_items(*, inventory_items!inner(title, category, base_price_cents, status))")
        .eq("user_id", auth.userId)
        .maybeSingle();
      cart = data;
    }

    if (!cart) {
      return ok({
        cart_id: null,
        items: [],
        subtotal_cents: 0,
        expires_at: new Date(Date.now() + 60 * 60_000).toISOString(),
      });
    }

    const items = (cart.items ?? []).map((li: Record<string, unknown>) => {
      const inv = Array.isArray(li.inventory_items) ? li.inventory_items[0] : li.inventory_items;
      return {
        cart_line_id: li.id,
        item_id: li.item_id,
        title: inv?.title,
        category: inv?.category,
        quantity: li.quantity,
        price_cents: inv?.base_price_cents ?? 0,
        params: li.params,
        item_status: inv?.status === "PUBLISHED" ? "AVAILABLE" : "UNAVAILABLE",
      };
    });
    const subtotal = items.reduce((s: number, i: { price_cents: number; quantity: number }) => s + i.price_cents * i.quantity, 0);

    return ok({
      cart_id: cart.id,
      items,
      subtotal_cents: subtotal,
      expires_at: new Date(Date.now() + 60 * 60_000).toISOString(),
    });
  } catch (err) {
    console.error("[cart GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// POST /api/v1/cart/items
export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = CartAddItemInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { inventory_item_id, quantity, params: itemParams } = parsed.data;

  try {
    // Load item — BR-I-005: PAUSED items cannot be added
    const { data: item } = await supabase
      .from("inventory_items")
      .select("id, title, category, base_price_cents, status, max_quantity_per_booking")
      .eq("id", inventory_item_id)
      .maybeSingle();
    if (!item) return ITEM_NOT_FOUND();
    if (item.status !== "PUBLISHED") return ITEM_UNAVAILABLE();

    // Get or create cart for this user
    let cartId: string;
    if (auth.userId) {
      const { data: existingCart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", auth.userId)
        .maybeSingle();
      if (existingCart) {
        cartId = existingCart.id;
      } else {
        const { data: newCart, error: cartErr } = await supabase
          .from("carts")
          .insert({ user_id: auth.userId, status: "ACTIVE" })
          .select("id")
          .single();
        if (cartErr) { console.error("[cart POST] create cart", cartErr); return INTERNAL_ERROR(); }
        cartId = newCart.id;
      }
    } else {
      // Anonymous cart — use a session token (in production, from cookie)
      cartId = randomUUID();
    }

    const { data: lineItem, error } = await supabase
      .from("cart_line_items")
      .insert({
        cart_id: cartId,
        item_id: inventory_item_id,
        quantity,
        unit_price_cents: item.base_price_cents,
        total_price_cents: item.base_price_cents * quantity,
      })
      .select("id")
      .single();
    if (error) { console.error("[cart POST] insert line", error); return INTERNAL_ERROR(); }

    return ok({
      cart_line_id: lineItem.id,
      inventory_item_id,
      title: item.title,
      category: item.category,
      quantity,
      price_cents: item.base_price_cents,
      item_status: "AVAILABLE",
    }, 201);
  } catch (err) {
    console.error("[cart POST] error:", err);
    return INTERNAL_ERROR();
  }
}
