/**
 * Part XI §11.3.7 — POST /api/v1/vendors/:vendor_id/staff
 * Invite user to join VendorAccount as staff. BR-V-002: one role per user per vendor.
 * Auth: VENDOR_OWNER. Rate: 60/hour/vendor.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER, ALREADY_A_MEMBER, USER_NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorStaffInviteInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ vendorId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const { vendorId } = await params;
  if (auth.vendorId !== vendorId || auth.vendorRole !== "VENDOR_OWNER") return NOT_VENDOR_OWNER();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = VendorStaffInviteInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { email, role } = parsed.data;

  try {
    // Find user by email
    const { data: user } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!user) return USER_NOT_FOUND();

    // BR-V-002: check not already a member
    const { data: existing } = await supabase
      .from("vendor_staff")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) return ALREADY_A_MEMBER();

    const invitationId = randomUUID();
    const { data, error } = await supabase
      .from("vendor_staff")
      .insert({
        vendor_id: vendorId,
        user_id: user.id,
        role,
        status: "PENDING",
        invitation_id: invitationId,
        invited_at: new Date().toISOString(),
      })
      .select("id, role, status")
      .single();
    if (error) { console.error("[staff POST]", error); return INTERNAL_ERROR(); }

    // TODO Part XXVI: send staff invitation email

    return ok({ invitation_id: invitationId, email, role, status: "PENDING" }, 201);
  } catch (err) {
    console.error("[staff POST] error:", err);
    return INTERNAL_ERROR();
  }
}
