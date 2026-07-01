/**
 * GET /api/v1/reservations/[id]
 *
 * Single reservation with payment + itinerary context. RLS gates the user
 * to their own reservations; vendor staff can also see reservations against
 * their vendor (handled here via an explicit vendor_staff check on the
 * admin client fallback).
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, NotFoundError, ForbiddenError } from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "reservationsGet")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.reservationsGet)
    if (!rl.allowed) return tooMany()

    // RLS will scope this to the current user automatically.
    const { data: reservation, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error || !reservation) {
      // Vendor fallback: vendor staff may view reservations against their vendor.
      const admin = createAdminClient()
      const { data: adminRes } = await admin
        .from("reservations")
        .select("*")
        .eq("id", id)
        .maybeSingle()
      if (!adminRes) throw new NotFoundError("Reservation not found")
      const isVendorStaff = ctx.vendorMemberships.some(
        (m) => m.vendor_id === adminRes.vendor_id,
      )
      if (!isVendorStaff) throw new ForbiddenError("You do not have access to this reservation")
      return ok(
        await enrich(adminRes, ctx.userId),
        { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
      )
    }

    return ok(
      await enrich(reservation, ctx.userId),
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── Enrichment helpers ─────────────────────────────────────────────────────

async function enrich(reservation: Record<string, unknown>, _userId: string) {
  const admin = createAdminClient()
  const itemId = reservation.item_id as string | null
  const vendorId = reservation.vendor_id as string | null
  const itineraryId = reservation.itinerary_session_id as string | null
  const reservationId = reservation.id as string

  const [itemRes, vendorRes, itineraryRes, lineItemsRes, paymentRes] = await Promise.all([
    itemId
      ? admin
          .from("inventory_items")
          .select("id, title, slug, category, location_id")
          .eq("id", itemId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    vendorId
      ? admin
          .from("vendor_accounts")
          .select("id, name, slug, phone, email")
          .eq("id", vendorId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    itineraryId
      ? admin
          .from("itinerary_sessions")
          .select("id, title, status, occasion_type")
          .eq("id", itineraryId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    admin
      .from("reservation_line_items")
      .select("id, order_id, ticket_tier_id, quantity, unit_price_cents, total_price_cents")
      .eq("reservation_id", reservationId),
    // Pull the parent order if any line item links one
    admin
      .from("reservation_line_items")
      .select("order_id")
      .eq("reservation_id", reservationId)
      .limit(1),
  ])

  let order: Record<string, unknown> | null = null
  const firstOrderId = paymentRes.data?.[0]?.order_id as string | undefined
  if (firstOrderId) {
    const { data: orderRow } = await admin
      .from("orders")
      .select(
        "id, status, subtotal_cents, tax_cents, discount_cents, total_cents, currency, stripe_session_id, stripe_payment_intent_id, placed_at",
      )
      .eq("id", firstOrderId)
      .maybeSingle()
    order = orderRow
  }

  return {
    ...reservation,
    item: itemRes.data ?? null,
    vendor: vendorRes.data ?? null,
    itinerary: itineraryRes.data ?? null,
    line_items: lineItemsRes.data ?? [],
    order,
  }
}
