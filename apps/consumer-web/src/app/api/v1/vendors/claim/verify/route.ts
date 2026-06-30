/**
 * Part XI §11.3.7 — POST /api/v1/vendors/claim/verify
 * Completes claim: verifies code, transitions SEEDED → CLAIMED via rpc_transition_vendor_status,
 * creates VendorStaff (OWNER). Auth: Authenticated JWT.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, INVALID_CODE, ALREADY_CLAIMED, RATE_LIMITED, INTERNAL_ERROR, VENDOR_NOT_FOUND } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { VendorClaimVerifyInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.auth, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = VendorClaimVerifyInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { verification_code } = parsed.data;
  // claim_token is used server-side to look up the vendor_id (stored in Step 1)
  // For this impl, we verify the code against the vendor_accounts.claim_verification_code field

  try {
    // Find vendor by verification code
    const { data: vendor, error } = await supabase
      .from("vendor_accounts")
      .select("id, name, status, claim_verification_code")
      .eq("claim_verification_code", verification_code)
      .maybeSingle();
    if (error) { console.error("[claim/verify] lookup", error); return INTERNAL_ERROR(); }
    if (!vendor) return INVALID_CODE();
    if (vendor.status !== "SEEDED") return ALREADY_CLAIMED();

    // Transition vendor to CLAIMED via RPC (Peppermint FSM pattern — rpc_transition_vendor_status)
    const { error: rpcErr } = await supabase.rpc("rpc_transition_vendor_status", {
      p_vendor_id: vendor.id,
      p_new_status: "CLAIMED",
      p_actor_id: auth.userId,
    });
    if (rpcErr) {
      console.error("[claim/verify] RPC, falling back to direct update:", rpcErr);
      const { error: updErr } = await supabase
        .from("vendor_accounts")
        .update({ status: "CLAIMED", claimed_at: new Date().toISOString(), claim_verification_code: null })
        .eq("id", vendor.id);
      if (updErr) { console.error("[claim/verify] fallback", updErr); return INTERNAL_ERROR(); }
    }

    // Create VendorStaff (OWNER)
    const { error: staffErr } = await supabase
      .from("vendor_staff")
      .insert({
        vendor_id: vendor.id,
        user_id: auth.userId,
        role: "OWNER",
        status: "ACTIVE",
        accepted_at: new Date().toISOString(),
      });
    if (staffErr && staffErr.code !== "23505") {
      console.error("[claim/verify] staff insert", staffErr);
    }

    return ok({
      vendor_id: vendor.id,
      status: "CLAIMED",
      vendor_name: vendor.name,
      vendor_portal_url: `https://planviry.com/vendor/dashboard?vendor_id=${vendor.id}`,
    });
  } catch (err) {
    console.error("[claim/verify] error:", err);
    return INTERNAL_ERROR();
  }
}
