/**
 * Part XI §11.3.4 — POST /api/v1/cart/checkout
 *
 * CRITICAL: BR-C-004 — If any Cart item fails inventory lock, the entire
 * checkout aborts. No partial checkouts. All inventory locks inside a single
 * serializable database transaction.
 *
 * Auth: Authenticated JWT required (BR-C-005: must upgrade from anon).
 * Rate: 20 req/hour/user. P95 < 2000ms (serializable txn + Stripe API).
 *
 * Transaction Boundary:
 *   1. Lock all InventoryItems (SELECT FOR UPDATE)
 *   2. Check availability
 *   3. Create Reservations (PENDING)
 *   4. Decrement quantity_reserved
 *   5. Set expires_at = NOW() + TTL
 *   If any step fails → full rollback.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, EMAIL_NOT_VERIFIED, EMPTY_CART,
  ITEM_UNAVAILABLE, INVENTORY_LOCK_FAILED, CART_EXPIRED,
  RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { CartCheckoutInput } from "@/lib/api/schemas";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  // BR-C-005: email must be verified before checkout
  if (!auth.emailVerified) return EMAIL_NOT_VERIFIED();

  // 20 req / hour / user
  const rateLimited = checkRateLimit(req, RATE_LIMITS.checkout, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = CartCheckoutInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  try {
    // Part V/VI checkout flow:
    //
    // BEGIN SERIALIZABLE TRANSACTION:
    //   1. Load cart with all line items (if empty → 400 EMPTY_CART)
    //   2. SELECT FOR UPDATE on every inventory_item_id in cart
    //      (if any lock fails → 409 INVENTORY_LOCK_FAILED, full rollback)
    //   3. For each item: check availability (capacity/quantity, date range overlap)
    //      (if any fails → 409 ITEM_UNAVAILABLE with item list, full rollback)
    //   4. Create Reservation rows (status=PENDING, expires_at=NOW()+15min)
    //   5. Decrement quantity_reserved on each InventoryItem
    //   6. Clear cart (mark as COMPLETED)
    // COMMIT
    //
    // Post-commit:
    //   - Create Stripe PaymentIntent with total_price_cents
    //   - Return client_secret for frontend payment confirmation
    //   - Emit checkout.started + cart.checkout_started (Realtime) events
    //   - Start TTL clock (workers/ttl-sweep or functions/booking-ttl)

    return error(
      501,
      "SCHEMA_PENDING",
      "Checkout transaction pending Part V (FSM) + Part VI (schema) + Stripe integration. API contract validated.",
      null,
    );
  } catch (err) {
    console.error("[cart/checkout] error:", err);
    return INTERNAL_ERROR();
  }
}
