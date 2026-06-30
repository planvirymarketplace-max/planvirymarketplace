/**
 * Part XI §11.3.1 — GET /api/v1/auth/me  +  PATCH /api/v1/auth/me
 *
 * GET:    Returns authenticated user's profile, role, and vendor memberships.
 *         Auth: Authenticated JWT required. Rate: 120 req/min/user. P95 < 100ms.
 * PATCH:  Updates user profile fields. Auth: Authenticated JWT. Rate: 30 req/hour/user. P95 < 300ms.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, RATE_LIMITED, NOT_FOUND, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AuthMePatchInput } from "@/lib/api/schemas";
import { db } from "@/lib/db";

// ─── GET /api/v1/auth/me ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  try {
    const user = await db.user.findUnique({ where: { id: auth.userId } });
    if (!user) return NOT_FOUND("User profile");

    // Part VII: join vendor_memberships + notification_prefs from full schema.
    return ok({
      user_id: user.id,
      display_name: user.name ?? "",
      role: auth.role,
      email_verified: auth.emailVerified,
      vendor_memberships: [], // Part VII: populate from VendorStaff table
      notification_prefs: {}, // Part VII: populate from user_profiles
      created_at: user.createdAt.toISOString(),
    }, 200, {
      "Cache-Control": "private, max-age=60",
    });
  } catch (err) {
    console.error("[auth/me GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// ─── PATCH /api/v1/auth/me ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  // 30 req / hour / user
  const rateLimited = checkRateLimit(req, { limit: 30, windowMs: 3_600_000, scope: "user" }, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = AuthMePatchInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  try {
    const user = await db.user.findUnique({ where: { id: auth.userId } });
    if (!user) return NOT_FOUND("User profile");

    const updated = await db.user.update({
      where: { id: auth.userId },
      data: {
        ...(parsed.data.display_name !== undefined && { name: parsed.data.display_name }),
        // Part VII: timezone, locale, notification_prefs stored in user_profiles table
      },
    });

    // Side effect: emit user.profile_updated analytics event

    return ok({
      user_id: updated.id,
      display_name: updated.name ?? "",
      updated_fields: parsed.data,
    });
  } catch (err) {
    console.error("[auth/me PATCH] error:", err);
    return INTERNAL_ERROR();
  }
}
