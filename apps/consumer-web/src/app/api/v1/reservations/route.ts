/**
 * Part XI §11.3.3 — GET /api/v1/reservations  +  GET /api/v1/reservations/:id
 * GET list: Auth required. RLS scopes consumer (own) vs vendor (their inventory).
 * GET :id: Full detail with payment + itinerary context. P95 < 200ms.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ReservationListQuery } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

// GET /api/v1/reservations
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((v, k) => {
    const existing = params[k];
    params[k] = existing ? Array.isArray(existing) ? [...existing, v] : [existing, v] : v;
  });

  const parsed = ReservationListQuery.safeParse(params);
  if (!parsed.success) return zodErrors(parsed.error);
  const { status, from, to, page, per_page } = parsed.data;

  try {
    let query = supabase
      .from("reservations")
      .select(`
        id, status, starts_at, ends_at, total_price_cents, confirmed_at,
        created_at, expired_at,
        inventory_items!inner(id, title, category, vendor_id)
      `, { count: "exact" })
      .eq("user_id", auth.userId);

    if (status && status.length > 0) query = query.in("status", status);
    if (from) query = query.gte("starts_at", from);
    if (to) query = query.lte("ends_at", to);

    const offset = (page - 1) * per_page;
    query = query.order("created_at", { ascending: false }).range(offset, offset + per_page - 1);

    const { data, count, error } = await query;
    if (error) { console.error("[reservations GET]", error); return INTERNAL_ERROR(); }

    return ok({
      reservations: (data ?? []).map((r: Record<string, unknown>) => ({
        id: r.id,
        status: r.status,
        inventory_item: Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items,
        starts_at: r.starts_at,
        ends_at: r.ends_at,
        total_price_cents: r.total_price_cents,
        confirmed_at: r.confirmed_at,
      })),
      total: count ?? 0,
      page,
    });
  } catch (err) {
    console.error("[reservations GET] error:", err);
    return INTERNAL_ERROR();
  }
}
