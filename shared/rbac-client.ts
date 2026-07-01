/**
 * Peppermint adaptation — RBAC permission model (pure, client-safe subset).
 *
 * This module is split out from `shared/rbac.ts` so that browser bundles can
 * import the pure functions (hasPermission, calculateTicketPriority, …)
 * without pulling in `@planviry/db`, which requires a service-role key and
 * MUST NOT be shipped to the client.
 *
 * Spec ref: Part XLII §42.3 — RBAC / permissions model: Winning Reference: Peppermint
 */

// Permission types (adapted from Peppermint's Permission union type)
export type PlanviryPermission =
  // Inventory permissions
  | 'inventory::create' | 'inventory::read' | 'inventory::update' | 'inventory::delete' | 'inventory::publish'
  // Reservation permissions
  | 'reservation::read' | 'reservation::cancel' | 'reservation::refund' | 'reservation::complete'
  // Vendor permissions
  | 'vendor::create' | 'vendor::read' | 'vendor::update' | 'vendor::claim' | 'vendor::manage_staff'
  // Event permissions
  | 'event::create' | 'event::update' | 'event::checkin' | 'event::duplicate'
  // Ticket permissions
  | 'ticket::purchase' | 'ticket::verify' | 'ticket::manage_tiers'
  // User permissions
  | 'user::read' | 'user::update' | 'user::delete' | 'user::manage'
  // Moderation
  | 'moderation::read' | 'moderation::act' | 'moderation::appeal'
  // Reports
  | 'report::read' | 'report::export'
  // Settings
  | 'settings::manage' | 'webhook::manage'
  // Admin
  | 'admin::panel' | 'admin::impersonate';

// Role → permission mapping
export const ROLE_PERMISSIONS: Record<string, PlanviryPermission[]> = {
  CONSUMER: [
    'inventory::read', 'reservation::read', 'ticket::purchase',
    'vendor::read', 'event::create', 'user::read', 'user::update',
    'moderation::appeal',
  ],
  VENDOR_OWNER: [
    'inventory::create', 'inventory::read', 'inventory::update', 'inventory::delete', 'inventory::publish',
    'reservation::read', 'reservation::cancel', 'reservation::refund', 'reservation::complete',
    'vendor::read', 'vendor::update', 'vendor::manage_staff',
    'event::create', 'event::update', 'event::checkin', 'event::duplicate',
    'ticket::manage_tiers', 'ticket::verify',
    'user::read', 'report::read', 'report::export',
    'webhook::manage',
  ],
  VENDOR_MANAGER: [
    'inventory::read', 'inventory::update',
    'reservation::read', 'reservation::cancel',
    'vendor::read',
    'event::update', 'event::checkin',
    'ticket::verify', 'ticket::manage_tiers',
    'report::read',
  ],
  VENDOR_STAFF: [
    'inventory::read', 'reservation::read',
    'event::checkin', 'ticket::verify',
  ],
  MODERATOR: [
    'inventory::read', 'reservation::read', 'vendor::read',
    'moderation::read', 'moderation::act',
    'report::read',
    'user::read',
  ],
  ADMIN: [
    // Admin has all permissions
    'inventory::create', 'inventory::read', 'inventory::update', 'inventory::delete', 'inventory::publish',
    'reservation::read', 'reservation::cancel', 'reservation::refund', 'reservation::complete',
    'vendor::create', 'vendor::read', 'vendor::update', 'vendor::claim', 'vendor::manage_staff',
    'event::create', 'event::update', 'event::checkin', 'event::duplicate',
    'ticket::purchase', 'ticket::verify', 'ticket::manage_tiers',
    'user::read', 'user::update', 'user::delete', 'user::manage',
    'moderation::read', 'moderation::act', 'moderation::appeal',
    'report::read', 'report::export',
    'settings::manage', 'webhook::manage',
    'admin::panel', 'admin::impersonate',
  ],
};

/**
 * Check if a user has a permission.
 * Adapted from Peppermint's hasPermission().
 */
export function hasPermission(
  role: string,
  requiredPermission: PlanviryPermission,
): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(requiredPermission);
}

/**
 * Check if user has ALL of the required permissions.
 */
export function hasAllPermissions(
  role: string,
  requiredPermissions: PlanviryPermission[],
): boolean {
  return requiredPermissions.every(p => hasPermission(role, p));
}

/**
 * Check if user has ANY of the required permissions.
 */
export function hasAnyPermission(
  role: string,
  requiredPermissions: PlanviryPermission[],
): boolean {
  return requiredPermissions.some(p => hasPermission(role, p));
}

/**
 * Get all permissions for a role.
 */
export function getPermissionsForRole(role: string): PlanviryPermission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check if roles system is active (Peppermint config.roles_active pattern).
 */
export function isRoleActive(role: string, activeRoles: string[] | null): boolean {
  if (activeRoles === null) return true // null = all roles active
  return activeRoles.includes(role)
}

/**
 * Resolve permission inheritance chain.
 * If role A inherits from role B, A gets all of B's permissions.
 */
export function resolveInheritedPermissions(
  role: string,
  inheritanceMap: Record<string, string[]>,
): PlanviryPermission[] {
  const visited = new Set<string>()
  const permissions = new Set<PlanviryPermission>()

  function resolve(r: string) {
    if (visited.has(r)) return
    visited.add(r)
    const perms = ROLE_PERMISSIONS[r] ?? []
    perms.forEach(p => permissions.add(p))
    const parents = inheritanceMap[r] ?? []
    parents.forEach(parent => resolve(parent))
  }

  resolve(role)
  return Array.from(permissions)
}

/**
 * Check team-scoped permission.
 * User must have the permission AND be a member of the specified team.
 */
export function hasTeamPermission(
  role: string,
  permission: PlanviryPermission,
  teamId: string,
  userTeams: string[],
): boolean {
  if (!userTeams.includes(teamId)) return false
  return hasPermission(role, permission)
}

/**
 * Create a custom role with specific permissions.
 * (Peppermint dynamic role creation pattern)
 */
export function createCustomRole(
  roleName: string,
  permissions: PlanviryPermission[],
  inheritsFrom: string[] = [],
): { name: string; permissions: PlanviryPermission[]; inheritsFrom: string[] } {
  return { name: roleName, permissions, inheritsFrom }
}

export type TicketCategory = 'RESERVATION' | 'BILLING' | 'TECHNICAL' | 'FEEDBACK' | 'OTHER';
export type TicketPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

/**
 * Service ticket triage priority calculation (Peppermint pattern).
 * Assigns priority score based on urgency + age + category.
 */
export function calculateTicketPriority(
  createdAt: Date,
  category: TicketCategory,
  isUrgent: boolean = false,
): { priority: TicketPriority; score: number } {
  const ageHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
  let score = 0

  if (isUrgent) score += 100
  if (category === 'RESERVATION' || category === 'BILLING') score += 50
  if (category === 'TECHNICAL') score += 30
  if (ageHours > 24) score += 40
  if (ageHours > 48) score += 20
  if (ageHours > 72) score += 20

  if (score >= 100) return { priority: 'URGENT', score }
  if (score >= 50) return { priority: 'HIGH', score }
  if (score >= 20) return { priority: 'NORMAL', score }
  return { priority: 'LOW', score }
}
