/**
 * Part XI §11.3.1 — POST /api/v1/auth/register
 *
 * Creates user_profiles record after Supabase Auth signup; triggers welcome email.
 * Auth: Supabase anon JWT (new user token from signup)
 * Rate Limit: 10 requests / hour / IP
 * Performance Budget: P95 < 500ms
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, USER_ALREADY_EXISTS, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AuthRegisterInput } from "@/lib/api/schemas";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.auth, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = AuthRegisterInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { display_name, timezone, locale } = parsed.data;

  // BR-U-001: Email must be unique. The Supabase Auth user already exists at
  // this point (created client-side); this endpoint creates the platform profile.
  if (!auth.userId) {
    return INTERNAL_ERROR();
  }

  try {
    // Check if profile already exists for this auth.uid()
    const existing = await db.user.findUnique({ where: { id: auth.userId } });
    if (existing) {
      return USER_ALREADY_EXISTS();
    }

    // Create the platform user profile (stub: uses existing User model until
    // Part VI adds the full user_profiles table with timezone/locale fields).
    const user = await db.user.create({
      data: {
        id: auth.userId,
        email: `${auth.userId}@planviry.local`, // Part VII: pull from Supabase auth.users
        name: display_name,
      },
    });

    // Side effects (Part VII wires these):
    // - Queue welcome email (template: email-welcome) via @planviry/email-templates
    // - Emit user.registered analytics event via @planviry/analytics

    return ok(
      { user_id: user.id, display_name, created_at: user.createdAt.toISOString() },
      201,
    );
  } catch (err) {
    console.error("[auth/register] error:", err);
    return INTERNAL_ERROR();
  }
}
