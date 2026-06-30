/**
 * Part XI §11.3.7 — POST /api/v1/vendors/claim/verify
 *
 * Completes claim flow by verifying the code; creates VendorAccount ownership.
 * Auth: Authenticated JWT.
 *
 * Side effects: FSM SEEDED → CLAIMED; VendorStaff row (user → OWNER);
 * vendor.claimed event; onboarding email sent.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, INVALID_CODE, CLAIM_TOKEN_EXPIRED,
  ALREADY_CLAIMED, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorClaimVerifyInput } from "@/lib/api/schemas";

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

  const parsed = VendorClaimVerifyInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { claim_token, verification_code } = parsed.data;

  try {
    // Part VI:
    // 1. Look up claim_token → vendor_id mapping (10 min TTL).
    //    If expired or not found → 400 CLAIM_TOKEN_EXPIRED.
    // 2. Verify verification_code matches. If wrong → 400 INVALID_CODE.
    // 3. Check vendor is still in SEEDED status. If not → 409 ALREADY_CLAIMED.
    // 4. FSM: VendorAccount.status SEEDED → CLAIMED.
    // 5. Create VendorStaff row: (user_id, vendor_id, role=OWNER).
    // 6. Emit vendor.claimed event.
    // 7. Send onboarding email (template: email-vendor-onboarding).
    return error(501, "SCHEMA_PENDING", "VendorAccount claim verify pending Part VI.", null);
  } catch (err) {
    console.error("[vendors/claim/verify] error:", err);
    return INTERNAL_ERROR();
  }
}
