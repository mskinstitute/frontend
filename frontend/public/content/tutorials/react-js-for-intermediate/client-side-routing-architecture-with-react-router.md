# Client-Side Routing Architecture with React Router

## 1. What is Client-Side Routing?
In traditional server-rendered websites, navigation between URLs triggers a full HTTP round-trip: the browser requests a new page, receives a fresh HTML document, and completely tears down the existing page.

In a modern **Single-Page Application (SPA)**, client-side routing intercepts user navigation clicks. Instead of requesting a new HTML file from the server:
1. The router intercepts the URL change using the browser's native **HTML5 History API** (`window.history.pushState`).
2. The URL in the address bar updates immediately without reloading the page.
3. React dynamically unmounts the current view component and mounts the component corresponding to the new URL route.

```
Traditional Multi-Page Navigation:
Click Link ──> [HTTP Request] ──> [Server generates HTML] ──> [Full Page Flash & Reload]

Client-Side SPA Routing:
Click Link ──> [pushState updates URL] ──> [React Router matches path] ──> [Smooth Component Swap]
```

## 2. Introducing React Router (v6+)
**React Router** is the standard routing library for the React ecosystem. It allows developers to bind components to URL paths declaratively.

### Core Installation
```bash
npm install react-router-dom
```

## 3. Core Routing Primitives

| Component / Hook | Role & Responsibility |
| :--- | :--- |
| **`createBrowserRouter`** | Modern recommended router setup utilizing the DOM History API. |
| **`RouterProvider`** | Root component that provides routing context to the entire application. |
| **`<Routes>` & `<Route>`** | Declarative route mapping primitives used in JSX configurations. |
| **`<Link>`** | Client-side anchor replacement that updates the URL without page reloads. |
| **`<NavLink>`** | Enhanced `<Link>` that knows when it is active (applies active CSS classes). |
| **`<Outlet>`** | Placeholder slot inside parent layouts where child route components render. |

## 4. A Minimal Working Router Setup
```jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function Home() {
  return <h2>MSK Institute Home Page</h2>;
}

function Courses() {
  return <h2>All Available Engineering Tracks</h2>;
}

function About() {
  return <h2>About MSK Institute</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        {/* NavLink automatically receives 'active' class when path matches */}
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <main className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
```

## 5. Why You Must NEVER Use `<a href="...">` for Internal Links
Using standard `<a href="/courses">` tags in a React application causes the browser to execute a **full page reload**, destroying all in-memory React state, resetting Context stores, and defeating the entire purpose of a Single-Page Application!

**Always use `<Link to="...">` or `<NavLink to="...">` for internal routes.**

---

## Practice Quiz

### Q1: How does client-side routing change the URL without refreshing the entire browser page?
- A) By editing the computer's DNS records
- B) By utilizing the native browser HTML5 History API (`pushState` and `replaceState`)
- C) By converting the URL into a cookie
- D) By restarting the local server
**Answer:** B
**Explanation:** Client-side routers leverage the browser's HTML5 History API (`window.history.pushState`) to manipulate the address bar without triggering a native browser page reload.

### Q2: Why should you avoid using standard `<a href="/path">` tags for internal navigation in an SPA?
- A) Anchor tags are deprecated in HTML5
- B) Standard anchor tags trigger a full-page browser refresh, wiping out all in-memory React state
- C) Anchor tags cannot have CSS classes
- D) Anchor tags only work in Safari
**Answer:** B
**Explanation:** Standard `<a>` tags cause the browser to perform a traditional page fetch, discarding all loaded JavaScript bundles, state, and cached API data.

### Q3: What is the primary difference between `<Link>` and `<NavLink>` in React Router?
- A) `<Link>` only works for external websites
- B) `<NavLink>` automatically detects when the current URL matches its destination and applies active styling classes or styles
- C) `<NavLink>` is faster than `<Link>`
- D) `<Link>` is deprecated in React Router v6
**Answer:** B
**Explanation:** `<NavLink>` provides built-in awareness of the active route, making it ideal for navigation bars where the current tab requires highlighted styling.

### Q4: In React Router v6, which prop on `<Route>` specifies the React component to render?
- A) `component={<Home />}`
- B) `element={<Home />}`
- C) `render={() => <Home />}`
- D) `view={<Home />}`
**Answer:** B
**Explanation:** React Router v6 standardized on the `element={<Component />}` prop for declaring route components.

### Q5: What component must wrap all routes when using traditional declarative JSX routing?
- A) `<RouterContainer>`
- B) `<BrowserRouter>`
- C) `<StateProvider>`
- D) `<HistoryManager>`
**Answer:** B
**Explanation:** `<BrowserRouter>` initializes the routing context and connects the component tree to the browser's URL history.
