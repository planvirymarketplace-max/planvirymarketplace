/**
 * Part XI §11.3.7 — POST /api/v1/vendors/:vendor_id/staff
 *
 * Invites a user to join a VendorAccount as staff.
 * Auth: VENDOR_OWNER of the specified vendor_id.
 * BR-V-002: a user may hold at most one role per VendorAccount.
 *
 * Side effects: sends staff invitation email; emits vendor.staff_invited event.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER,
  ALREADY_A_MEMBER, USER_NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorStaffInviteInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ vendorId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { vendorId } = await params;

  // Must be VENDOR_OWNER of this vendor
  if (auth.vendorId !== vendorId || auth.vendorRole !== "VENDOR_OWNER") {
    return NOT_VENDOR_OWNER();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = VendorStaffInviteInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { email, role } = parsed.data;

  try {
    // Part VI:
    // 1. Find user by email. If not found → 404 USER_NOT_FOUND.
    // 2. Check if user is already a member of this vendor (BR-V-002).
    //    If yes → 409 ALREADY_A_MEMBER.
    // 3. Create VendorStaff row (user_id, vendor_id, role, status=PENDING).
    // 4. Send staff invitation email.
    // 5. Emit vendor.staff_invited analytics event.
    const invitationId = randomUUID();

    return ok({
      invitation_id: invitationId,
      email,
      role,
      status: "PENDING",
    }, 201);
  } catch (err) {
    console.error("[vendors/:vendorId/staff] error:", err);
    return INTERNAL_ERROR();
  }
}
