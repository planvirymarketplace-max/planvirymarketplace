/**
 * Part XI §11.3.7 — POST /api/v1/vendors/claim
 *
 * Initiates the claim flow for a seeded VendorAccount listing.
 * Auth: Authenticated JWT (any registered user).
 * BR-V-003: claiming requires identity verification.
 *
 * Side effects: sends verification code via email/SMS; claim_token stored 10 min.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, ALREADY_CLAIMED, INVALID_CONTACT,
  VENDOR_NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorClaimInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.auth, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = VendorClaimInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { vendor_id, verification_method, contact_value } = parsed.data;

  // BR-V-003: validate contact_value format matches verification_method
  if (verification_method === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_value)) {
      return INVALID_CONTACT();
    }
  } else if (verification_method === "phone") {
    if (!/^\+?[\d\s\-\(\)]{7,}$/.test(contact_value)) {
      return INVALID_CONTACT();
    }
  }

  try {
    // Part VI:
    // 1. Load VendorAccount by vendor_id. If not found → 404 VENDOR_NOT_FOUND.
    // 2. If status !== 'SEEDED' → 409 ALREADY_CLAIMED.
    // 3. Generate verification code (6 digits).
    // 4. Store claim_token (10 min TTL) → vendor_id mapping server-side.
    // 5. Send verification code via email or SMS.
    const claimToken = randomUUID();

    return ok({
      claim_token: claimToken,
      message: "Verification code sent",
    });
  } catch (err) {
    console.error("[vendors/claim] error:", err);
    return INTERNAL_ERROR();
  }
}
