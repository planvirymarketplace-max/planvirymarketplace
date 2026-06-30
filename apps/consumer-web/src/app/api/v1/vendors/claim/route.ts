/**
 * Part XI §11.3.7 — POST /api/v1/vendors/claim
 * Initiates claim flow for seeded VendorAccount. BR-V-003: identity verification required.
 * Auth: Authenticated JWT. Rate: 10/hour/IP.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, ALREADY_CLAIMED, INVALID_CONTACT, VENDOR_NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorClaimInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomBytes, randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.auth, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = VendorClaimInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { vendor_id, verification_method, contact_value } = parsed.data;

  // BR-V-003: validate contact format
  if (verification_method === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_value)) return INVALID_CONTACT();
  } else {
    if (!/^\+?[\d\s\-\(\)]{7,}$/.test(contact_value)) return INVALID_CONTACT();
  }

  try {
    const { data: vendor, error } = await supabase
      .from("vendor_accounts")
      .select("id, name, status, claim_verification_code")
      .eq("id", vendor_id)
      .maybeSingle();
    if (error) { console.error("[claim] load vendor", error); return INTERNAL_ERROR(); }
    if (!vendor) return VENDOR_NOT_FOUND();
    if (vendor.status !== "SEEDED") return ALREADY_CLAIMED();

    // Generate 6-digit verification code + claim token
    const code = randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
    const claimToken = randomUUID();

    // Store code on vendor account (Part VII: send via email/SMS)
    const { error: updErr } = await supabase
      .from("vendor_accounts")
      .update({ claim_verification_code: code })
      .eq("id", vendor_id);
    if (updErr) { console.error("[claim] store code", updErr); return INTERNAL_ERROR(); }

    // TODO Part XXVI: send verification code via email/SMS (notification-send edge function)

    return ok({ claim_token: claimToken, message: "Verification code sent" });
  } catch (err) {
    console.error("[claim] error:", err);
    return INTERNAL_ERROR();
  }
}
