/**
 * Part XI §11.3.1 — POST /api/v1/auth/register
 * Creates user_profiles record after Supabase Auth signup.
 * Auth: Supabase anon JWT. Rate: 10/hour/IP. P95 < 500ms.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, USER_ALREADY_EXISTS, RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AuthRegisterInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.auth, auth);
  if (rateLimited) return rateLimited;

  if (!auth.userId) return UNAUTHORIZED();

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = AuthRegisterInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { display_name, timezone, locale } = parsed.data;

  try {
    // Check if profile already exists (BR-U-001)
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", auth.userId)
      .maybeSingle();
    if (existing) return USER_ALREADY_EXISTS();

    // Fetch email from auth context (JWT) — in production this comes from Supabase auth.users
    // For now, use the email claim if present, else placeholder
    const email = (auth as { email?: string }).email ?? `${auth.userId}@planviry.local`;

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: auth.userId,
        email,
        display_name,
        locale: locale ?? "en-US",
        notification_prefs: {},
      })
      .select("id, display_name, created_at")
      .single();

    if (error) {
      if (error.code === "23505") return USER_ALREADY_EXISTS();
      console.error("[auth/register] DB error:", error);
      return INTERNAL_ERROR();
    }

    return ok({ user_id: data.id, display_name: data.display_name, created_at: data.created_at }, 201);
  } catch (err) {
    console.error("[auth/register] error:", err);
    return INTERNAL_ERROR();
  }
}
