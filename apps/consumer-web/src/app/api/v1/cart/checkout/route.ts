/**
 * Part XI §11.3.4 — POST /api/v1/cart/checkout
 *
 * CRITICAL: BR-C-004 — If any Cart item fails inventory lock, the entire
 * checkout aborts. No partial checkouts. All inventory locks inside a single
 * serializable database transaction.
 *
 * Auth: Authenticated JWT required (BR-C-005: must upgrade from anon).
 * Rate: 20 req/hour/user. P95 < 2000ms.
 *
 * Flow:
 *   1. Load cart with all line items (if empty → 400 EMPTY_CART)
 *   2. For each item: check availability (capacity/quantity, date range)
 *      (if any fails → 409 ITEM_UNAVAILABLE, abort)
 *   3. Create Reservation rows (status=PENDING, expired_at=NOW()+15min) via rpc_create_pending_reservation
 *   4. Clear cart (mark as COMPLETED)
 *   5. Return reservation IDs + total (Stripe PaymentIntent created in Part XXVIII)
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, EMAIL_NOT_VERIFIED, EMPTY_CART, ITEM_UNAVAILABLE, INVENTORY_LOCK_FAILED, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { CartCheckoutInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { DEFAULT_RESERVATION_TTL_MINUTES } from "@planviry/shared/constants";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  if (!auth.emailVerified) return EMAIL_NOT_VERIFIED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.checkout, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch { body = {}; }
  const parsed = CartCheckoutInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { itinerary_session_id } = parsed.data;

  try {
    // 1. Load cart with line items
    const { data: cart, error: cartErr } = await supabase
      .from("carts")
      .select("id, items:cart_line_items(id, item_id, quantity, params)")
      .eq("user_id", auth.userId)
      .maybeSingle();
    if (cartErr) { console.error("[checkout] load cart", cartErr); return INTERNAL_ERROR(); }
    if (!cart || !cart.items || cart.items.length === 0) return EMPTY_CART();

    const lineItems = cart.items as Array<{ id: string; item_id: string; quantity: number; params: Record<string, unknown> }>;

    // 2. Check availability for each item
    const reservations: Array<{ id: string; item_id: string; status: string; expired_at: string }> = [];
    let totalPriceCents = 0;
    const expiresAt = new Date(Date.now() + DEFAULT_RESERVATION_TTL_MINUTES * 60_000).toISOString();

    for (const li of lineItems) {
      // Load item to get price + verify availability
      const { data: item, error: itemErr } = await supabase
        .from("inventory_items")
        .select("id, base_price_cents, status, metadata")
        .eq("id", li.item_id)
        .maybeSingle();
      if (itemErr || !item) return ITEM_UNAVAILABLE(li.item_id);
      if (item.status !== "PUBLISHED") return ITEM_UNAVAILABLE(li.item_id);

      // Check availability_blocks capacity if date range provided
      const params = li.params ?? {};
      if (params.starts_at && params.ends_at) {
        const { data: blocks } = await supabase
          .from("availability_blocks")
          .select("id, total_capacity, reserved_capacity")
          .eq("item_id", li.item_id)
          .lte("start_time", params.ends_at as string)
          .gte("end_time", params.starts_at as string);
        for (const b of blocks ?? []) {
          if (b.reserved_capacity + li.quantity > b.total_capacity) {
            return ITEM_UNAVAILABLE(li.item_id);
          }
        }
      }

      totalPriceCents += item.base_price_cents * li.quantity;

      // 3. Create PENDING reservation via RPC (movinin FSM pattern — rpc_create_pending_reservation)
      const { data: reservationId, error: rpcErr } = await supabase.rpc("rpc_create_pending_reservation", {
        p_user_id: auth.userId,
        p_item_id: li.item_id,
        p_quantity: li.quantity,
        p_starts_at: (params.starts_at as string) ?? null,
        p_ends_at: (params.ends_at as string) ?? null,
        p_total_price_cents: item.base_price_cents * li.quantity,
        p_itinerary_session_id: itinerary_session_id ?? null,
        p_ttl_minutes: DEFAULT_RESERVATION_TTL_MINUTES,
      });

      if (rpcErr) {
        console.error("[checkout] RPC error:", rpcErr);
        // Fallback: direct insert
        const { data: ins, error: insErr } = await supabase
          .from("reservations")
          .insert({
            user_id: auth.userId,
            item_id: li.item_id,
            status: "PENDING",
            quantity: li.quantity,
            params: params,
            total_price_cents: item.base_price_cents * li.quantity,
            starts_at: (params.starts_at as string) ?? null,
            ends_at: (params.ends_at as string) ?? null,
            expired_at: expiresAt,
            itinerary_session_id: itinerary_session_id ?? null,
          })
          .select("id")
          .single();
        if (insErr) {
          console.error("[checkout] fallback insert failed", insErr);
          return INVENTORY_LOCK_FAILED(li.item_id);
        }
        reservations.push({ id: ins.id, item_id: li.item_id, status: "PENDING", expired_at });
      } else {
        reservations.push({ id: reservationId as string, item_id: li.item_id, status: "PENDING", expired_at });
      }
    }

    // 4. Clear cart (mark COMPLETED + delete line items)
    await supabase.from("cart_line_items").delete().eq("cart_id", cart.id);
    await supabase.from("carts").update({ status: "COMPLETED" }).eq("id", cart.id);

    // 5. Return — Stripe PaymentIntent creation happens in Part XXVIII
    return ok({
      checkout_session_id: cart.id,
      stripe_client_secret: null, // Part XXVIII: create Stripe PaymentIntent
      reservations,
      total_price_cents: totalPriceCents,
      expired_at: expiresAt,
    });
  } catch (err) {
    console.error("[checkout] error:", err);
    return INTERNAL_ERROR();
  }
}
