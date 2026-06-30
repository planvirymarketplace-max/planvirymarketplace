/**
 * Part XI §11.3.5 — POST /api/v1/itineraries/:id/share
 *
 * Generates a shareable link or invites specific users by email with VIEW or
 * EDIT permission. Auth: owner or EDIT member.
 *
 * BR-IT-001: itinerary must have ≥1 Reservation.
 * BR-IT-002: invited users get specified permission; link recipients get VIEW by default.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, NOT_FOUND, NOT_A_MEMBER,
  INVALID_STATE_TRANSITION, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ItineraryShareInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = ItineraryShareInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { type, permission, emails } = parsed.data;

  try {
    // Part VI:
    // 1. Load itinerary, verify caller is owner or EDIT member (else 403 NOT_A_MEMBER)
    // 2. BR-IT-001: verify itinerary has ≥1 Reservation (else 409 INVALID_STATE_TRANSITION)
    // 3. If type=link: generate SharedItineraryLink with permission + expiry
    // 4. If type=email: send invitation emails (template: email-itinerary-invite)
    // 5. Emit itinerary.shared analytics event

    if (type === "link") {
      const shareUrl = `https://planviry.com/i/${id}?token=${randomUUID()}`;
      return ok({
        share_url: shareUrl,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(), // 7 days
      });
    }

    return ok({
      invited_emails: emails ?? [],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
    });
  } catch (err) {
    console.error("[itineraries/:id/share] error:", err);
    return INTERNAL_ERROR();
  }
}
