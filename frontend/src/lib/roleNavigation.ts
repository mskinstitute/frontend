/**
 * Role Navigation Utilities
 * Maps authenticated user roles to their respective Next-Gen Dashboard paths.
 */

export type UserRole =
  | 'admin'
  | 'superadmin'
  | 'super_admin'
  | 'branch'
  | 'franchise'
  | 'branch_manager'
  | 'center_manager'
  | 'staff'
  | 'instructor'
  | 'teacher'
  | 'affiliate'
  | 'partner'
  | 'student'
  | string;

export function getRoleDashboardUrl(role?: string): string {
  const normalized = role?.toLowerCase()?.trim() || '';
  if (normalized === 'admin' || normalized === 'superadmin' || normalized === 'super_admin') {
    return '/admin';
  }
  if (
    normalized === 'branch' ||
    normalized === 'franchise' ||
    normalized === 'branch_manager' ||
    normalized === 'center_manager'
  ) {
    return '/dashboard/branch';
  }
  if (normalized === 'staff' || normalized === 'instructor' || normalized === 'teacher') {
    return '/dashboard/staff';
  }
  if (normalized === 'affiliate' || normalized === 'partner') {
    return '/dashboard/affiliate';
  }
  return '/dashboard/student';
}

export function getRoleDisplayName(role?: string): string {
  const normalized = role?.toLowerCase()?.trim() || '';
  if (normalized === 'admin' || normalized === 'superadmin' || normalized === 'super_admin') {
    return 'Super Administrator';
  }
  if (
    normalized === 'branch' ||
    normalized === 'franchise' ||
    normalized === 'branch_manager' ||
    normalized === 'center_manager'
  ) {
    return 'Franchise & Branch Manager';
  }
  if (normalized === 'staff' || normalized === 'instructor' || normalized === 'teacher') {
    return 'Faculty & Staff';
  }
  if (normalized === 'affiliate' || normalized === 'partner') {
    return 'Affiliate Partner';
  }
  return 'Student / Learner';
}

/**
 * Checks whether an authenticated user's role has permission to access a specific dashboard.
 * - Admin/superadmin has supervisor access across all dashboards.
 * - Students, staff, branches, and affiliates can strictly access only their authorized portal.
 */
export function hasRolePermission(userRole: string | undefined | null, requiredDashboardRole: string): boolean {
  if (!userRole) return false;
  const normalizedUserRole = userRole.toLowerCase().trim();
  const normalizedTargetRole = requiredDashboardRole.toLowerCase().trim();

  // Super administrators have access across portals
  if (
    normalizedUserRole === 'admin' ||
    normalizedUserRole === 'superadmin' ||
    normalizedUserRole === 'super_admin'
  ) {
    return true;
  }

  if (normalizedTargetRole === 'student') {
    return normalizedUserRole === 'student';
  }

  if (normalizedTargetRole === 'branch') {
    return (
      normalizedUserRole === 'branch' ||
      normalizedUserRole === 'franchise' ||
      normalizedUserRole === 'branch_manager' ||
      normalizedUserRole === 'center_manager'
    );
  }

  if (normalizedTargetRole === 'staff') {
    return (
      normalizedUserRole === 'staff' ||
      normalizedUserRole === 'instructor' ||
      normalizedUserRole === 'teacher'
    );
  }

  if (normalizedTargetRole === 'affiliate') {
    return normalizedUserRole === 'affiliate' || normalizedUserRole === 'partner';
  }

  if (normalizedTargetRole === 'admin') {
    return (
      normalizedUserRole === 'admin' ||
      normalizedUserRole === 'superadmin' ||
      normalizedUserRole === 'super_admin'
    );
  }

  return false;
}
