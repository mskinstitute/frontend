# Protected Routes and Role-Based Access Guards

## 1. Client-Side Security & Access Control
In enterprise portals (learning management systems, corporate intranets, financial dashboards), certain views must be restricted based on user authentication and permissions:
- Guest users should only access `/login`, `/register`, and public catalog pages.
- Authenticated students can access `/dashboard` and enrolled courses.
- Only users with the `admin` role can access `/admin/console` and `/admin/billing`.

While true security must always be enforced on the backend server (validating JWT tokens on API calls), **client-side route guards** are essential to provide a seamless user experience, preventing unauthorized users from accessing restricted layouts.

```
Route Request: /admin/analytics
         │
         ▼
[Protected Route Guard]
 ├─ Not Authenticated? ──► Redirect to /login with state: { from: location }
 ├─ Wrong Role (Student)? ──► Redirect to /unauthorized (HTTP 403 screen)
 └─ Authorized (Admin)?   ──► Render <Outlet /> (Access Granted!)
```

## 2. Implementing an Authentication Guard (`<ProtectedRoute>`)
In React Router v6, route guards are implemented as **wrapper layout components that render an `<Outlet />` if authorized, or `<Navigate />` if denied**:

```jsx
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Show spinner while verifying stored session
  if (loading) {
    return <div className="loading-screen">Authenticating session...</div>;
  }

  // 2. Unauthenticated: Redirect to login, preserving intended destination!
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Control (RBAC) check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized: Render matching child route!
  return <Outlet />;
}
```

## 3. Configuring Protected Routes in the Route Tree
Using layout wrapping, protecting an entire section of your application requires nesting child routes beneath the guard:

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import StudentDashboard from './pages/StudentDashboard';
import AdminConsole from './pages/AdminConsole';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated Routes (Students & Admins) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Route>

      {/* Restricted Admin Routes (Admins Only!) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route path="/admin" element={<AdminConsole />} />
        <Route path="/admin/billing" element={<AdminBilling />} />
      </Route>
    </Routes>
  );
}
```

## 4. Returning Users to Their Intended Destination After Login
Notice line 16: `<Navigate to="/login" state={{ from: location }} replace />`.

When an unauthorized user attempts to visit `/admin/billing`, the guard stores the attempted URL in navigation state. 

Inside the `LoginPage` component:
```jsx
const location = useLocation();
const navigate = useNavigate();

// After successful login:
const destination = location.state?.from?.pathname || '/dashboard';
navigate(destination, { replace: true });
```
The user is seamlessly redirected right back to the page they were originally trying to access!

---

## Practice Quiz

### Q1: What is the primary role of a client-side Protected Route in React Router?
- A) To encrypt database tables
- B) To inspect authentication and role permissions before rendering protected child routes, redirecting unauthorized users to login or 403 screens
- C) To disable browser developer tools
- D) To turn on dark mode
**Answer:** B
**Explanation:** Protected route guards inspect user authentication status and permission roles, rendering child content for authorized users while redirecting unauthorized attempts.

### Q2: What component does React Router v6 use to redirect users declaratively?
- A) `<Redirect to="...">` (v5 deprecated)
- B) `<Navigate to="..." replace />`
- C) `<Jump to="...">`
- D) `<GoTo to="...">`
**Answer:** B
**Explanation:** In React Router v6, `<Navigate to="/login" replace />` is the declarative component used for redirection.

### Q3: Why is `state={{ from: location }}` passed when redirecting an unauthenticated user to `/login`?
- A) To track user passwords
- B) To remember the exact URL the user originally tried to visit so they can be redirected back there after logging in
- C) To make tests pass
- D) To prevent CORS errors
**Answer:** B
**Explanation:** Capturing the origin location in route state allows the login handler to redirect users back to their intended target URL post-authentication.

### Q4: If an authorized user passes the permission check in `<ProtectedRoute>`, what does the guard render?
- A) A blank `<div>`
- B) `<Outlet />`
- C) A full page reload
- D) An alert box
**Answer:** B
**Explanation:** Rendering `<Outlet />` tells React Router to mount the matching child route component inside the protected wrapper.

### Q5: Can client-side route guards replace backend API authorization?
- A) Yes, client-side guards provide complete security
- B) No, client-side guards only provide user experience; backend APIs must independently authenticate and authorize every request using secure tokens (JWTs)
- C) Only when using HTTPS
- D) Only on desktop browsers
**Answer:** B
**Explanation:** Client-side routing code can be manipulated in browser developer tools. All sensitive operations and data access must be validated on the backend.
