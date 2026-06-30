/**
 * Part XI §11.3.8 — POST /api/v1/events/:event_id/ticket-tiers
 * Add ticket tier to Event (Hi.Events pattern). BR-EV-008: sales_end_at <= event starts_at.
 * Auth: VENDOR_OWNER/MANAGER. Rate: 60/hour/vendor.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER, INVALID_SALES_WINDOW, EVENT_SOLD_OUT, RATE_LIMITED, INTERNAL_ERROR, NOT_FOUND } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { EventTicketTierInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ eventId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const { eventId } = await params;
  if (!auth.vendorId || (auth.vendorRole !== "VENDOR_OWNER" && auth.vendorRole !== "VENDOR_MANAGER")) {
    return NOT_VENDOR_OWNER();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = EventTicketTierInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { name, type, price_cents, capacity, sales_start_at, sales_end_at, min_per_order, max_per_order, is_hidden } = parsed.data;

  try {
    // Load event (it's an inventory_item with category=EVENT_TICKET)
    const { data: event } = await supabase
      .from("inventory_items")
      .select("id, vendor_id, category, metadata")
      .eq("id", eventId)
      .maybeSingle();
    if (!event) return NOT_FOUND("Event");
    if (event.vendor_id !== auth.vendorId) return NOT_VENDOR_OWNER();

    // BR-EV-008: sales_end_at <= event starts_at
    const eventMeta = (event.metadata as Record<string, unknown>) ?? {};
    const eventStart = eventMeta.starts_at as string | undefined;
    if (sales_end_at && eventStart && new Date(sales_end_at) > new Date(eventStart)) {
      return INVALID_SALES_WINDOW();
    }

    const { data, error } = await supabase
      .from("ticket_tiers")
      .insert({
        event_id: eventId,
        name,
        tier_type: type,
        price_cents,
        capacity,
        sales_start_at: sales_start_at ?? null,
        sales_end_at: sales_end_at ?? null,
        min_per_order: min_per_order ?? 1,
        max_per_order: max_per_order ?? 10,
        is_hidden: is_hidden ?? false,
      })
      .select("*")
      .single();
    if (error) { console.error("[ticket-tiers POST]", error); return INTERNAL_ERROR(); }

    return ok(data, 201);
  } catch (err) {
    console.error("[ticket-tiers POST] error:", err);
    return INTERNAL_ERROR();
  }
}
