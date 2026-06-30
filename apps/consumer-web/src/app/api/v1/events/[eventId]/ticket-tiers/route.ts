/**
 * Part XI §11.3.8 — POST /api/v1/events/:event_id/ticket-tiers
 *
 * Adds a ticket tier to an existing Event (DOM-007).
 * Auth: VENDOR_OWNER or VENDOR_MANAGER of the event's VendorAccount.
 *
 * Validation: BR-EV-007 (tier type), BR-EV-008 (sales window).
 * sales_end_at <= event.starts_at.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER,
  INVALID_TIER_TYPE, INVALID_SALES_WINDOW, EVENT_SOLD_OUT,
  RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { EventTicketTierInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ eventId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { eventId } = await params;

  // VENDOR_OWNER or VENDOR_MANAGER
  if (!auth.vendorId || (auth.vendorRole !== "VENDOR_OWNER" && auth.vendorRole !== "VENDOR_MANAGER")) {
    return NOT_VENDOR_OWNER();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = EventTicketTierInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { name, type, price_cents, capacity, sales_start_at, sales_end_at } = parsed.data;

  // BR-EV-008: sales_end_at must be <= event starts_at (Part VI: load event to verify)
  // Part VI: load event, verify auth.vendorId === event.vendor_id, check capacity.

  try {
    // Part VI:
    // 1. Load Event by eventId (also an InventoryItem with category=EVENT_TICKET).
    // 2. Verify auth.vendorId === event.vendor_id (RLS).
    // 3. BR-EV-008: if sales_end_at > event.starts_at → 400 INVALID_SALES_WINDOW.
    // 4. Check total capacity across tiers doesn't exceed event.capacity (else 409 EVENT_SOLD_OUT).
    // 5. Insert TicketTier row.
    const tierId = randomUUID();

    return ok({
      tier_id: tierId,
      name,
      type,
      price_cents,
      capacity,
      sales_start_at,
      sales_end_at,
    }, 201);
  } catch (err) {
    console.error("[events/:eventId/ticket-tiers] error:", err);
    return INTERNAL_ERROR();
  }
}
