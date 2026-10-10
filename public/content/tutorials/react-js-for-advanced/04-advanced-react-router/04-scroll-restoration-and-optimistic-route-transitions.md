# Scroll Restoration and Optimistic Route Transitions

## 1. The Scroll Position Bug in SPAs
In traditional server-rendered websites, when a user scrolls halfway down a long catalog page, clicks a link to view a product, and then clicks the browser "Back" button:
- The browser automatically restores the exact scroll position where they left off.

In a naive Single-Page Application:
- Clicking a link navigates to a new view, but **the viewport remains scrolled down at the previous position!**
- Clicking "Back" sends the user to the top of the catalog page, forcing them to search and scroll all over again!

This jarring UX flaw is solved in modern React Router via **Scroll Restoration**.

```
Naive SPA:
Scroll to item 50 ──► Click Detail ──► Viewport stays scrolled down! (BUG)

With <ScrollRestoration>:
Scroll to item 50 ──► Click Detail ──► Smoothly resets to top (0,0)
Click "Back" ──► Viewport restored PRECISELY to item 50! (Expected UX)
```

## 2. Implementing `<ScrollRestoration />`
In React Router v6 Data Routers (`createBrowserRouter`), you simply render **`<ScrollRestoration />`** inside your root layout component:

```jsx
// src/layouts/RootLayout.jsx
import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="content">
        <Outlet />
      </main>

      <Footer />

      {/* Automatically restores scroll position on navigation! */}
      <ScrollRestoration />
    </div>
  );
}
```

### Custom Scroll Keys (Tabs and Query Params)
By default, scroll positions are keyed by the URL pathname. If you have tabs that change query params (`?tab=reviews`) and want to preserve scroll independently:

```jsx
<ScrollRestoration
  getKey={(location, matches) => {
    // Return key string to match against
    return location.pathname + location.search;
  }}
/>
```

## 3. Optimistic Route Transitions with `useNavigation`
When users click a link that loads data via a loader, there may be a 150–300ms delay while data fetches across the network. 

Without visual feedback, the user wonders: *"Did my click register?"*

React Router provides the **`useNavigation()`** hook to inspect active in-flight transitions:

```jsx
import React from 'react';
import { useNavigation } from 'react-router-dom';

export default function GlobalProgressBar() {
  const navigation = useNavigation();

  // navigation.state: 'idle' | 'submitting' | 'loading'
  const isNavigating = navigation.state !== 'idle';

  if (!isNavigating) return null;

  return (
    <div className="top-progress-bar" role="progressbar">
      <div className="progress-indeterminate-pulse" />
    </div>
  );
}
```

## 4. Pending UI Styling with `useNavigation`
You can even dim the current screen while the next route is loading:

```jsx
export default function RootLayout() {
  const navigation = useNavigation();

  return (
    <div className={`app-shell ${navigation.state === 'loading' ? 'loading-opacity' : ''}`}>
      <GlobalProgressBar />
      <Outlet />
    </div>
  );
}
```

---

## Practice Quiz

### Q1: What component in React Router v6 automatically emulates the browser's native scroll behavior across SPA route transitions?
- A) `<ScrollManager />`
- B) `<ScrollRestoration />`
- C) `<ViewportReset />`
- D) `<WindowScroll />`
**Answer:** B
**Explanation:** `<ScrollRestoration />` coordinates with React Router's data router to automatically reset scroll on new navigations and restore exact scroll coordinates on "Back" and "Forward".

### Q2: Where should `<ScrollRestoration />` be rendered in an application?
- A) Inside every single `<button>` tag
- B) In the root layout component (e.g. `RootLayout.jsx`), alongside `<Outlet />`
- C) In `package.json`
- D) In the database
**Answer:** B
**Explanation:** Rendering `<ScrollRestoration />` once in the root layout shell ensures all nested routes inherit automatic scroll management.

### Q3: What hook allows components to detect when an asynchronous route loader or form submission is currently in-flight?
- A) `useNetwork()`
- B) `useNavigation()`
- C) `useStatus()`
- D) `usePending()`
**Answer:** B
**Explanation:** `useNavigation()` returns a navigation object whose `.state` property indicates whether the router is `'idle'`, `'loading'`, or `'submitting'`.

### Q4: How can you create a top-of-screen progress bar (similar to GitHub or YouTube) during route changes?
- A) By checking if `navigation.state === 'loading'` via `useNavigation()` and conditionally displaying the progress element
- B) By running a timer in `setInterval`
- C) By refreshing the browser tab
- D) Using CSS animations on the body
**Answer:** A
**Explanation:** Inspecting `navigation.state === 'loading'` allows you to display a top progress bar or spinner while route loaders fetch data.

### Q5: What does the `getKey` prop on `<ScrollRestoration>` allow developers to customize?
- A) The password for the page
- B) The cache identifier used to store scroll coordinates, allowing scroll position matching to include search queries or custom tab keys
- C) The color of the scrollbar
- D) The scroll speed in pixels per second
**Answer:** B
**Explanation:** `getKey` lets you control the uniqueness key for scroll position caching (e.g. matching `location.pathname + location.search`).
