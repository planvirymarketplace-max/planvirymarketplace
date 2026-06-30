/**
 * Part XI §11.3.5 — POST /api/v1/itineraries/:id/share
 * Generate share link or invite by email. BR-IT-001: ≥1 reservation required.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_FOUND, NOT_A_MEMBER, INVALID_STATE_TRANSITION, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ItineraryShareInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;
  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = ItineraryShareInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { type, permission, emails } = parsed.data;

  try {
    // Verify caller is owner or EDIT member
    const { data: itin } = await supabase
      .from("itinerary_sessions")
      .select("id, owner_id, status")
      .eq("id", id)
      .maybeSingle();
    if (!itin) return NOT_FOUND("Itinerary");

    const isOwner = itin.owner_id === auth.userId;
    if (!isOwner) {
      const { data: m } = await supabase
        .from("itinerary_members")
        .select("permission")
        .eq("itinerary_id", id)
        .eq("user_id", auth.userId)
        .maybeSingle();
      if (!m || m.permission !== "EDIT") return NOT_A_MEMBER();
    }

    // BR-IT-001: ≥1 reservation required to share
    const { count } = await supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("itinerary_session_id", id);
    if ((count ?? 0) === 0) return INVALID_STATE_TRANSITION("Itinerary must have at least one reservation before sharing.");

    if (type === "link") {
      const shareToken = randomUUID();
      const shareUrl = `https://planviry.com/i/${id}?token=${shareToken}`;
      await supabase
        .from("itinerary_sessions")
        .update({ status: "SHARED" })
        .eq("id", id);
      return ok({ share_url: shareUrl, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString() });
    }

    // type === "email": invite users by email
    for (const email of emails ?? []) {
      const { data: user } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (user) {
        await supabase
          .from("itinerary_members")
          .insert({ itinerary_id: id, user_id: user.id, permission });
      }
    }

    return ok({ invited_emails: emails ?? [] });
  } catch (err) {
    console.error("[itineraries/:id/share] error:", err);
    return INTERNAL_ERROR();
  }
}
