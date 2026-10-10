# Role-Based Access Control (RBAC) and Permission Matrices

In complex enterprise portals, basic boolean authentication (`isAuthenticated`) is insufficient. Different user tiers (e.g. *SuperAdmin*, *BillingManager*, *DevOpsEngineer*, *ReadOnlyAuditor*) must access different views, action buttons, and sensitive mutation endpoints. Implementing a declarative **Permission Matrix** with fine-grained capability checks decouples authorization logic from UI presentation.

---

## 1. Roles vs Permissions (Capabilities)

A common architectural anti-pattern is checking hardcoded role strings directly inside UI components:

```tsx
// ❌ Anti-pattern: Fragile role checks scattered in components
if (user.role === "admin" || user.role === "billing_manager") {
  return <RefundButton />;
}
```

If the organization introduces a new role (*FinancialSupervisor*), engineers must locate and update hundreds of scattered `if` statements across the codebase.

### The Clean Solution: Decouple Roles into Permissions
- **Roles:** Assigned to users (e.g., `"admin"`, `"editor"`).
- **Permissions:** Atomic capabilities (e.g., `"invoice:refund"`, `"cluster:deploy"`).
- **Permission Matrix:** Maps roles to sets of granted permissions.

```
User (Alice) ──► Role: BillingManager ──► Permission Matrix ──► ['invoice:read', 'invoice:refund']
```

---

## 2. Defining the Permission Matrix in TypeScript

```ts
// auth/permissions.ts
export type AppRole = "superadmin" | "admin" | "editor" | "viewer";

export type Permission =
  | "user:create"
  | "user:delete"
  | "billing:view"
  | "billing:charge"
  | "analytics:export"
  | "settings:update";

// Exhaustive permission mapping per role
export const PERMISSION_MATRIX: Record<AppRole, ReadonlySet<Permission>> = {
  superadmin: new Set([
    "user:create",
    "user:delete",
    "billing:view",
    "billing:charge",
    "analytics:export",
    "settings:update",
  ]),
  admin: new Set([
    "user:create",
    "billing:view",
    "analytics:export",
    "settings:update",
  ]),
  editor: new Set([
    "analytics:export",
  ]),
  viewer: new Set([]),
};

export function hasPermission(role: AppRole, requiredPermission: Permission): boolean {
  return PERMISSION_MATRIX[role]?.has(requiredPermission) ?? false;
}
```

---

## 3. Declarative `<Can>` Authorization Component

Create a reusable `<Can>` wrapper to conditionally render UI controls based on permissions:

```tsx
import React, { ReactNode } from "react";
import { Permission, hasPermission, AppRole } from "./permissions";
import { useAuth } from "./AuthContext";

interface CanProps {
  perform: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ perform, fallback = null, children }: CanProps) {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role as AppRole, perform)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

---

## 4. Usage in Enterprise Views

```tsx
import React from "react";
import { Can } from "./Can";

export function UserManagementRow({ user }: { user: { id: string; name: string } }) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800 text-white">
      <span>{user.name}</span>

      <div className="flex gap-2">
        {/* Only rendered if current active user possesses 'settings:update' capability */}
        <Can perform="settings:update">
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold">
            Edit Permissions
          </button>
        </Can>

        {/* Destructive actions guarded with strict 'user:delete' capability */}
        <Can
          perform="user:delete"
          fallback={
            <span className="text-xs text-slate-600 italic">Delete disabled</span>
          }
        >
          <button className="px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded text-xs font-semibold">
            Delete User
          </button>
        </Can>
      </div>
    </div>
  );
}
```

---

## 5. Defense in Depth: Server-Side Verification

Client-side UI gating improves user experience by hiding inactive buttons, but **never acts as true security**. A malicious user can open DevTools and trigger API endpoints directly. Every backend REST or GraphQL endpoint must independently validate the user's role and permission matrix before mutating data.

---

## Practice Quiz

### Q1: Why is checking atomic permissions (e.g. Can perform="billing:refund") superior to checking raw role names (user.role === "admin")?
- A) JavaScript runs faster with string permissions
- B) It decouples capabilities from roles, allowing roles to be reorganized or added in a centralized matrix without refactoring hundreds of UI components
- C) Roles are deprecated in modern web standards
- D) It bypasses backend authorization
**Answer:** B
**Explanation:** Checking atomic capabilities isolates business logic to a single permission matrix file. Adding new roles or altering permissions requires editing only the matrix rather than modifying every UI component.

### Q2: What is the primary purpose of the fallback prop on the <Can> component?
- A) To specify the user's fallback email
- B) To render alternative UI (such as a disabled button, explanatory badge, or lock icon) when permission is denied
- C) To reboot the server
- D) To refresh the authentication cookie
**Answer:** B
**Explanation:** The fallback prop enables graceful degradation, displaying a disabled state, tooltip explanation, or alternative widget when the user lacks required permissions.

### Q3: Why is JavaScript Set used instead of Array in PERMISSION_MATRIX[role]?
- A) Set operations (has) execute in O(1) constant time, offering instant lookup performance compared to O(N) array scans
- B) Array is not supported in TypeScript
- C) Set converts permissions into numbers
- D) Array leaks memory in React
**Answer:** A
**Explanation:** Set.has() provides O(1) constant time lookups, ensuring permission checks throughout massive component trees execute with negligible overhead.

### Q4: What is the "Defense in Depth" rule regarding frontend RBAC?
- A) Frontend checks are sufficient for security
- B) Frontend authorization only optimizes user experience; every backend API endpoint must independently enforce authorization checks
- C) All database queries must run in the browser
- D) Frontend code must be encrypted with PGP
**Answer:** B
**Explanation:** Frontend gating is cosmetic. Since users control client execution, the backend server must rigorously validate authorization on every incoming request.

### Q5: How should a route guard handle a user who is authenticated but lacks permission for that specific route?
- A) Redirect them to the login page
- B) Redirect to a 403 Forbidden / Access Denied page or dashboard with a clear unauthorized warning
- C) Delete their session cookie
- D) Crash the application
**Answer:** B
**Explanation:** Because the user is already authenticated, redirecting to login is confusing. A 403 Forbidden error page properly informs them that their credentials are valid but their role lacks authorization.
