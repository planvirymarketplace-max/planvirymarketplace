/**
 * Peppermint adaptation — RBAC permission model.
 * Role-based access control with permission inheritance from roles.
 * Adapted from Peppermint apps/api/src/lib/roles.ts + permissions.ts.
 *
 * Spec ref: Part XLII §42.3 — RBAC / permissions model: Winning Reference: Peppermint
 *
 * NOTE: Pure helpers (no DB access) live in `./rbac-client.ts` so they can be
 * imported from browser bundles without dragging in `@planviry/db`. This file
 * re-exports them and adds the DB-touching functions (fanOutNotification,
 * requirePermission) that need a Supabase client.
 */

import { supabase } from "@planviry/db";

// Re-export all pure helpers + types from the client-safe module.
export {
  ROLE_PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
  isRoleActive,
  resolveInheritedPermissions,
  hasTeamPermission,
  createCustomRole,
  calculateTicketPriority,
  type PlanviryPermission,
  type TicketCategory,
  type TicketPriority,
} from "./rbac-client";

/**
 * Middleware helper: require a permission for a route.
 * Returns the user's role if authorized, or null if not.
 */
export async function requirePermission(
  auth: { userId: string | null; role: string; vendorId: string | null; vendorRole: string | null },
  permission: PlanviryPermission,
): Promise<boolean> {
  // Admin has all permissions (Peppermint pattern)
  if (auth.role === 'ADMIN') return true;

  // Check platform role
  if (hasPermission(auth.role, permission)) return true;

  // Check vendor role (for vendor-scoped permissions)
  if (auth.vendorRole && hasPermission(auth.vendorRole, permission)) return true;

  return false;
}

/**
 * Notification fan-out (Peppermint pattern).
 * Creates notification rows for all users who should be notified of an event.
 */
export async function fanOutNotification(
  eventType: string,
  entity_type: string,
  entity_id: string,
  recipientUserIds: string[],
  subject: string,
  body: string,
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM',
  channels: Array<'IN_APP' | 'EMAIL' | 'PUSH'> = ['IN_APP', 'EMAIL'],
): Promise<number> {
  const rows = recipientUserIds.flatMap(userId =>
    channels.map(channel => ({
      user_id: userId,
      notification_type: eventType,
      channel,
      priority,
      subject,
      body,
      data_payload: { entity_type, entity_id },
      status: 'QUEUED',
      rate_limit_category: priority === 'CRITICAL' ? 'CRITICAL' : 'NON_CRITICAL',
    })),
  );

  if (rows.length === 0) return 0;

  const { data, error } = await supabase
    .from('notifications')
    .insert(rows)
    .select('id');

  if (error) {
    console.error('[fanOutNotification] insert failed:', error.message);
    return 0;
  }

  return data?.length ?? 0;
}

// ─── Peppermint extension: dynamic roles, inheritance, team-scoped, toggling ─
//
// Pure helpers for these features live in `./rbac-client.ts` and are
// re-exported above. The functions in this file (`requirePermission`,
// `fanOutNotification`) are the only ones that need a Supabase client.
