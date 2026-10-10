# Defining Routes, Route Layouts, and Outlets

## 1. Nested Routing and Shared Layouts
Real-world web applications share consistent structural layouts across multiple pages:
- A shared top navigation bar and global footer.
- A dashboard sidebar with sub-navigation links.
- Consistent breadcrumb trails.

Instead of duplicating the `<Navbar />` and `<Sidebar />` inside every individual page component, modern routing employs **Nested Routes** and **Shared Layouts**.

```
                   Application Layout (Navbar & Footer)
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
     Home Route                              Dashboard Layout (Sidebar)
     (/)                                              │
                                           ┌──────────┴──────────┐
                                           ▼                     ▼
                                     Analytics Page         Settings Page
                                  (/dashboard/analytics)  (/dashboard/settings)
```

## 2. The `<Outlet>` Component
In React Router, **`<Outlet>`** acts as a placeholder or dynamic portal inside a parent layout component. 

When a child route matches the active URL, React Router renders that child component directly inside the parent layout's `<Outlet />`:

```jsx
// src/layouts/RootLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="site-wrapper">
      {/* Shared Header across all pages */}
      <header className="global-header">
        <h1 className="logo">MSK Institute</h1>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>

      {/* Dynamic Slot: Child routes render here! */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* Shared Footer across all pages */}
      <footer className="global-footer">
        <p>© 2026 MSK Institute of Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
```

## 3. Nesting Routes in the Route Configuration
In your route definitions, nest child `<Route>` elements inside parent layout `<Route>` tags:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent Root Layout */}
        <Route path="/" element={<RootLayout />}>
          {/* Index Route: renders when URL matches exact parent path "/" */}
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />

          {/* Nested Sub-Layout: /dashboard */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<AnalyticsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 4. Index Routes and 404 Catch-Alls
- **Index Routes (`<Route index element={<Home />} />`):** An index route renders in the parent layout's `<Outlet />` when the user is at the exact parent URL path (`/` or `/dashboard`), without appending extra route segments.
- **Catch-All 404 Routes (`<Route path="*" element={<NotFound />} />`):** The asterisk wildcard `*` matches any URL that failed to match any defined route, displaying a user-friendly 404 page.

---

## Practice Quiz

### Q1: What is the primary role of the `<Outlet>` component in React Router?
- A) To output logs to the browser console
- B) To act as a placeholder slot inside a parent layout component where matching child route components are rendered
- C) To connect to an external electrical outlet
- D) To refresh the page every 30 seconds
**Answer:** B
**Explanation:** `<Outlet>` is the designated placeholder inside parent layout components where child route components are rendered when their paths match the active URL.

### Q2: How do you define a 404 "Page Not Found" route in React Router v6?
- A) `<Route path="404" element={<NotFound />} />`
- B) `<Route path="*" element={<NotFound />} />`
- C) `<Route error={true} element={<NotFound />} />`
- D) `<Route default element={<NotFound />} />`
**Answer:** B
**Explanation:** The asterisk `*` serves as a catch-all wildcard in route paths, matching any URL that did not hit an earlier defined route.

### Q3: What is an "Index Route" (`<Route index element={<Home />} />`)?
- A) A route that lists all database indexes
- B) The default child route rendered into the parent's `<Outlet />` when the URL exactly matches the parent's path
- C) A route that only admins can access
- D) A route that cannot contain images
**Answer:** B
**Explanation:** An index route provides the default content for a parent layout when no specific sub-path is present in the URL.

### Q4: What is the primary architectural benefit of nested routing with shared layouts?
- A) It prevents persistent elements (like headers and sidebars) from unmounting and remounting during navigation, maintaining UI state and scroll positions
- B) It compiles code into Python
- C) It eliminates the need for backend servers
- D) It enables offline storage
**Answer:** A
**Explanation:** Nested layouts allow persistent UI shells (navbars, sidebars) to remain continuously mounted while only the inner page content swaps inside the `<Outlet />`.

### Q5: If a child route path is defined as `path="analytics"` inside a parent with `path="dashboard"`, what full URL matches it?
- A) `/analytics`
- B) `/dashboard/analytics`
- C) `/dashboard-analytics`
- D) `/root/dashboard`
**Answer:** B
**Explanation:** Relative paths inside nested routes automatically prepend the parent route's path, creating `/dashboard/analytics`.
