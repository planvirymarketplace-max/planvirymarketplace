/**
 * Part XI §11.3.3 — GET /api/v1/reservations/:id
 * Full detail: payment status, cancellation policy snapshot, itinerary context.
 * Auth: required (RLS: consumer sees own, vendor sees bookings on own inventory).
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { UNAUTHORIZED, NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        id, status, starts_at, ends_at, total_price_cents, confirmed_at,
        created_at, expired_at, cancelled_reason, itinerary_session_id,
        inventory_items!inner(id, title, category, vendor_id, vendor_accounts!inner(id, name)),
        payments(id, status, stripe_payment_intent_id, amount_cents)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) { console.error("[reservations/:id GET]", error); return INTERNAL_ERROR(); }
    if (!data) return NOT_FOUND("Reservation");

    // RLS: consumer owns it OR vendor owns the inventory
    const inv = Array.isArray(data.inventory_items) ? data.inventory_items[0] : data.inventory_items;
    const vendor = Array.isArray(inv?.vendor_accounts) ? inv?.vendor_accounts[0] : inv?.vendor_accounts;
    const isOwner = data.user_id === auth.userId;
    const isVendorOwner = vendor?.id === auth.vendorId;
    if (!isOwner && !isVendorOwner && auth.role !== "ADMIN" && auth.role !== "MODERATOR") {
      return NOT_FOUND("Reservation");
    }

    return ok({
      ...data,
      inventory_item: inv,
      vendor,
      payment: Array.isArray(data.payments) ? data.payments[0] : data.payments,
    });
  } catch (err) {
    console.error("[reservations/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}
