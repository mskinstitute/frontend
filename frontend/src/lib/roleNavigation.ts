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
