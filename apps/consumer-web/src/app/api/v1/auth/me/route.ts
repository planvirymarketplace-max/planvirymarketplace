/**
 * Part XI §11.3.1 — GET /api/v1/auth/me  +  PATCH /api/v1/auth/me
 * GET:   Returns user profile, role, vendor memberships. P95 < 100ms.
 * PATCH: Updates profile fields. Rate: 30/hour/user. P95 < 300ms.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, RATE_LIMITED, NOT_FOUND, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AuthMePatchInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

// GET /api/v1/auth/me
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  try {
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("id, display_name, email, locale, notification_prefs, created_at")
      .eq("id", auth.userId)
      .maybeSingle();
    if (error) { console.error("[auth/me GET]", error); return INTERNAL_ERROR(); }
    if (!profile) return NOT_FOUND("User profile");

    // Fetch vendor memberships via vendor_staff join
    const { data: memberships } = await supabase
      .from("vendor_staff")
      .select("vendor_id, role, status, vendor_accounts!inner(name)")
      .eq("user_id", auth.userId)
      .eq("status", "ACTIVE");

    return ok({
      user_id: profile.id,
      display_name: profile.display_name ?? "",
      role: auth.role,
      email_verified: auth.emailVerified,
      email: profile.email,
      vendor_memberships: (memberships ?? []).map((m: { vendor_id: string; role: string; vendor_accounts: { name: string } | { name: string }[] }) => ({
        vendor_id: m.vendor_id,
        vendor_name: Array.isArray(m.vendor_accounts) ? m.vendor_accounts[0]?.name : m.vendor_accounts?.name,
        role: m.role,
      })),
      notification_prefs: profile.notification_prefs ?? {},
      created_at: profile.created_at,
    }, 200, { "Cache-Control": "private, max-age=60" });
  } catch (err) {
    console.error("[auth/me GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// PATCH /api/v1/auth/me
export async function PATCH(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, { limit: 30, windowMs: 3_600_000, scope: "user" }, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = AuthMePatchInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  try {
    const update: Record<string, unknown> = {};
    if (parsed.data.display_name !== undefined) update.display_name = parsed.data.display_name;
    if (parsed.data.timezone !== undefined) update.timezone = parsed.data.timezone;
    if (parsed.data.locale !== undefined) update.locale = parsed.data.locale;
    if (parsed.data.notification_prefs !== undefined) update.notification_prefs = parsed.data.notification_prefs;

    const { data, error } = await supabase
      .from("user_profiles")
      .update(update)
      .eq("id", auth.userId)
      .select("id, display_name, locale, notification_prefs")
      .single();

    if (error) { console.error("[auth/me PATCH]", error); return INTERNAL_ERROR(); }
    if (!data) return NOT_FOUND("User profile");

    return ok({ user_id: data.id, display_name: data.display_name, updated_fields: parsed.data });
  } catch (err) {
    console.error("[auth/me PATCH] error:", err);
    return INTERNAL_ERROR();
  }
}
