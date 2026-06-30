/**
 * Part XI §11.3.5 — GET /api/v1/itineraries/:id
 * Full itinerary with reservations, members, and conflict warnings (computed at read time).
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { UNAUTHORIZED, NOT_FOUND, NOT_A_MEMBER, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
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
    // Load itinerary
    const { data: itin, error } = await supabase
      .from("itinerary_sessions")
      .select("id, title, status, owner_id, created_at, metadata")
      .eq("id", id)
      .maybeSingle();
    if (error) { console.error("[itineraries/:id GET]", error); return INTERNAL_ERROR(); }
    if (!itin) return NOT_FOUND("Itinerary");

    // Check membership: owner OR in itinerary_members
    const isOwner = itin.owner_id === auth.userId;
    let isMember = isOwner;
    if (!isOwner) {
      const { data: m } = await supabase
        .from("itinerary_members")
        .select("permission")
        .eq("itinerary_id", id)
        .eq("user_id", auth.userId)
        .maybeSingle();
      isMember = !!m;
    }
    if (!isMember) return NOT_A_MEMBER();

    // Load members
    const { data: members } = await supabase
      .from("itinerary_members")
      .select("user_id, permission, user_profiles!inner(display_name)")
      .eq("itinerary_id", id);

    // Load reservations for this itinerary
    const { data: reservations } = await supabase
      .from("reservations")
      .select(`
        id, status, starts_at, ends_at, total_price_cents,
        inventory_items!inner(id, title, category, vendor_accounts!inner(id, name))
      `)
      .eq("itinerary_session_id", id)
      .order("starts_at", { ascending: true });

    // Compute conflicts at read time (TIME_OVERLAP)
    const conflicts: Array<{ type: string; reservation_ids: string[]; message: string }> = [];
    const resList = reservations ?? [];
    for (let i = 0; i < resList.length; i++) {
      for (let j = i + 1; j < resList.length; j++) {
        const a = resList[i] as { id: string; starts_at: string; ends_at: string };
        const b = resList[j] as { id: string; starts_at: string; ends_at: string };
        if (a.starts_at && a.ends_at && b.starts_at && b.ends_at) {
          const overlap = new Date(a.starts_at) < new Date(b.ends_at) && new Date(b.starts_at) < new Date(a.ends_at);
          if (overlap) {
            conflicts.push({ type: "TIME_OVERLAP", reservation_ids: [a.id, b.id], message: "Two reservations overlap in time." });
          }
        }
      }
    }

    const totalCost = resList.reduce((s: number, r: { total_price_cents: number }) => s + (r.total_price_cents ?? 0), 0);

    return ok({
      id: itin.id,
      title: itin.title,
      status: itin.status,
      owner: { user_id: itin.owner_id },
      members: (members ?? []).map((m: Record<string, unknown>) => ({
        user_id: m.user_id,
        display_name: Array.isArray(m.user_profiles) ? m.user_profiles[0]?.display_name : m.user_profiles?.display_name,
        permission: m.permission,
      })),
      reservations: resList.map((r: Record<string, unknown>) => {
        const inv = Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items;
        const vendor = Array.isArray(inv?.vendor_accounts) ? inv?.vendor_accounts[0] : inv?.vendor_accounts;
        return { ...r, inventory_item: inv, vendor };
      }),
      conflicts,
      total_cost_cents: totalCost,
      created_at: itin.created_at,
    });
  } catch (err) {
    console.error("[itineraries/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}
