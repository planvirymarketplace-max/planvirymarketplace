/**
 * Part XI §11.3.4 — POST /api/v1/cart/items
 *
 * Adds an InventoryItem to the cart. Does NOT hold inventory (holding at checkout).
 * Auth: optional. BR-I-005: PAUSED items cannot be added. BR-C-001: cross-category
 * and cross-vendor items allowed. P95 < 250ms.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, ITEM_NOT_FOUND, ITEM_UNAVAILABLE,
  RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { CartAddItemInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = CartAddItemInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { inventory_item_id, quantity, params: itemParams } = parsed.data;

  try {
    // Part VI:
    // 1. Load InventoryItem by inventory_item_id (must be PUBLISHED, not PAUSED)
    //    - 404 ITEM_NOT_FOUND if not found
    //    - 409 ITEM_UNAVAILABLE if PAUSED (BR-I-005)
    // 2. Soft availability check (hard lock at checkout)
    // 3. Insert CartLineItem (cart_id from user/session, inventory_item_id, quantity, params)
    // 4. Return full cart state

    // Until Part VI: return stub cart with the added item.
    const cartLineId = randomUUID();
    return ok({
      cart_line_id: cartLineId,
      cart: {
        cart_id: "00000000-0000-0000-0000-000000000000",
        items: [{
          cart_line_id: cartLineId,
          inventory_item_id,
          title: "Item (Part VI schema pending)",
          category: "VENDOR_SERVICE",
          quantity,
          price_cents: 0,
          params: itemParams ?? {},
          item_status: "AVAILABLE",
        }],
        subtotal_cents: 0,
        expires_at: new Date(Date.now() + 60 * 60_000).toISOString(),
      },
    }, 201);
  } catch (err) {
    console.error("[cart/items POST] error:", err);
    return INTERNAL_ERROR();
  }
}
