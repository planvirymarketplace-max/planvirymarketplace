/**
 * Part XI §11.2.4 — Authentication.
 *
 * Bearer token in Authorization header: Authorization: Bearer <supabase_access_token>
 * Public endpoints accept requests without a token but operate under the anon RLS role.
 *
 * Part VII §7.2 — JWT Lifecycle (full implementation in Part VII).
 * This scaffold validates JWT structure + extracts claims; full Supabase Auth
 * verification is wired in Part VII.
 */

import type { NextRequest } from "next/server";

export interface AuthContext {
  userId: string | null;
  role: string;
  vendorId: string | null;
  vendorRole: string | null;
  emailVerified: boolean;
  isAuthenticated: boolean;
}

const ANON: AuthContext = {
  userId: null,
  role: "anon",
  vendorId: null,
  vendorRole: null,
  emailVerified: false,
  isAuthenticated: false,
};

/**
 * Extract auth context from the Authorization header.
 *
 * Part XI §11.2.4 — Bearer token. In production this calls Supabase Auth's
 * getUser(token) to validate the JWT server-side. In the scaffold, it parses
 * the JWT payload (without signature verification — Part VII adds verification).
 */
export function getAuthContext(req: NextRequest): AuthContext {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return ANON;

  const token = authHeader.slice(7).trim();
  if (!token) return ANON;

  try {
    // Decode JWT payload (base64url). Signature verification is Part VII.
    const payload = decodeJwtPayload(token);
    return {
      userId: payload.sub ?? null,
      role: payload.role ?? "authenticated",
      vendorId: payload.vendor_id ?? null,
      vendorRole: payload.vendor_role ?? null,
      emailVerified: payload.email_verified ?? false,
      isAuthenticated: true,
    };
  } catch {
    return ANON;
  }
}

/** Require authentication — returns null if OK, or an error Response if not. */
export function requireAuth(auth: AuthContext): null | { error: ReturnType<typeof import("./errors").UNAUTHORIZED> } {
  if (!auth.isAuthenticated) {
    return { error: import("./errors").then((m) => m.UNAUTHORIZED()) };
  }
  return null;
}

/** Require a specific vendor role. */
export function requireVendorRole(
  auth: AuthContext,
  vendorId: string,
  roles: string[],
): null | { error: ReturnType<typeof import("./errors").NOT_VENDOR_OWNER> } {
  if (!auth.isAuthenticated) {
    return { error: import("./errors").then((m) => m.UNAUTHORIZED()) };
  }
  if (auth.vendorId !== vendorId || !roles.includes(auth.vendorRole ?? "")) {
    return { error: import("./errors").then((m) => m.NOT_VENDOR_OWNER()) };
  }
  return null;
}

// ─── JWT decode (no signature verification — Part VII adds Supabase verify) ──

interface JwtPayload {
  sub?: string;
  role?: string;
  vendor_id?: string;
  vendor_role?: string;
  email_verified?: boolean;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const payloadJson = Buffer.from(payloadB64, "base64").toString("utf-8");
  const payload = JSON.parse(payloadJson) as JwtPayload;
  // Check expiry (allow 5s clock skew).
  if (payload.exp && Date.now() / 1000 > payload.exp + 5) {
    throw new Error("JWT expired");
  }
  return payload;
}
