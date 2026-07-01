/**
 * Planviry — v1 API Auth Context
 *
 * Resolves the current Supabase user (from cookies), then eagerly loads the
 * matching `user_profiles` row and any `vendor_staff` memberships so route
 * handlers can branch on `ctx.isVendor` without re-querying.
 *
 * Use `getAuthContext(supabase)` when the route allows anonymous access
 * (returns `null` if not signed in).
 * Use `requireAuthContext(supabase)` for protected routes — throws
 * `AuthError` which `handleError()` converts into a 401 envelope.
 */

import type { SupabaseClient } from "@supabase/supabase-js"
import { AuthError } from "./errors"

export interface VendorMembership {
  vendor_id: string
  role: string
  status: string
}

export interface AuthContext {
  user: {
    id: string
    email: string | null
    phone: string | null
  }
  userId: string
  profile: {
    id: string
    email: string | null
    display_name: string | null
    locale: string | null
    phone: string | null
    avatar_url: string | null
    notification_prefs: Record<string, unknown> | null
  } | null
  vendorMemberships: VendorMembership[]
  isVendor: boolean
}

/**
 * Read the current user from the cookie-scoped Supabase client.
 * Returns `null` if there is no session (NOT an error — caller decides).
 */
export async function getAuthContext(
  supabase: SupabaseClient,
): Promise<AuthContext | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  // Profile + vendor memberships (admin client not needed — RLS will gate user_profiles
  // to the current user via the standard `auth.uid() = id` policy).
  const [profileResult, membershipsResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select(
        "id, email, display_name, locale, phone, avatar_url, notification_prefs",
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("vendor_staff")
      .select("vendor_id, role, status")
      .eq("user_id", user.id)
      .eq("status", "ACTIVE"),
  ])

  return {
    user: { id: user.id, email: user.email ?? null, phone: user.phone ?? null },
    userId: user.id,
    profile: profileResult.data ?? null,
    vendorMemberships: membershipsResult.data ?? [],
    isVendor: (membershipsResult.data?.length ?? 0) > 0,
  }
}

/**
 * Same as `getAuthContext`, but throws `AuthError` (→ 401 envelope) when there
 * is no session. Use in routes that require authentication.
 */
export async function requireAuthContext(
  supabase: SupabaseClient,
): Promise<AuthContext> {
  const ctx = await getAuthContext(supabase)
  if (!ctx) throw new AuthError("Authentication required")
  return ctx
}

/**
 * Resolve the active vendor_id for the current user.
 * If `vendorId` is provided, verify the user is staff of that vendor.
 * Otherwise pick the first active membership.
 * Throws `ForbiddenError` when the user has no vendor access.
 */
export async function requireVendorContext(
  supabase: SupabaseClient,
  vendorId?: string,
): Promise<{ vendorId: string; role: string } & AuthContext> {
  const ctx = await requireAuthContext(supabase)
  if (!ctx.isVendor) {
    throw new AuthError("You must be a vendor staff member to access this resource")
  }
  const membership = vendorId
    ? ctx.vendorMemberships.find((m) => m.vendor_id === vendorId)
    : ctx.vendorMemberships[0]
  if (!membership) {
    throw new AuthError("You do not have access to this vendor account", {
      requested_vendor_id: vendorId,
      available_vendor_ids: ctx.vendorMemberships.map((m) => m.vendor_id),
    })
  }
  return { ...ctx, vendorId: membership.vendor_id, role: membership.role }
}
