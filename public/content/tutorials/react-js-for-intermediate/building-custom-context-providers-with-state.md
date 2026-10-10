# Building Custom Context Providers with State

## 1. The Raw Context Architecture Problem
While defining `createContext` and placing `useState` directly inside `App.jsx` works for tiny demonstrations, in production it quickly pollutes your root component. If you have authentication state, theme state, shopping cart state, and notification state, your `App.jsx` becomes cluttered with dozens of handlers and providers.

The industry-standard architectural pattern encapsulates state, effects, and provider logic inside a **Custom Context Provider Component**, accompanied by a **Custom Hook**.

```
Production Context Module Architecture:
src/context/AuthContext.jsx
 ├─ AuthContext (Private internal context)
 ├─ AuthProvider (Encapsulates state, login/logout functions, useEffect)
 └─ useAuth() (Custom hook with validation guard for consumers)
```

## 2. Implementing a Custom Auth Provider
Here is a complete, production-grade implementation of an Authentication Context module:

```jsx
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create Context (private to this module)
const AuthContext = createContext(null);

// 2. Custom Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('msk_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Invalid token stored:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate backend API login
    const fakeUser = { id: 'usr-101', name: 'Aman Sharma', email, role: 'student' };
    setUser(fakeUser);
    localStorage.setItem('msk_user', JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('msk_user');
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Prevent rendering app until initial auth check completes */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Custom Consumer Hook with Defensive Guard
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  return context;
}
```

## 3. Why the Custom Hook Guard (`useAuth`) is Vital
Notice the defensive check in `useAuth()`:
```javascript
if (!context) {
  throw new Error('useAuth must be used within an <AuthProvider>');
}
```
If an engineer accidentally calls `useAuth()` inside a component that was never wrapped in `<AuthProvider>`, standard `useContext` would silently return `null`. The developer would later face confusing errors like `Cannot read property 'login' of null`. 

This defensive guard catches the bug immediately with a crystal-clear error message in development.

## 4. Clean Consumer Usage
In `src/main.jsx` or `App.jsx`, wrap the application once:
```jsx
import { AuthProvider } from './context/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

In any child component, consumption is a clean, intuitive one-liner:
```jsx
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <a href="/login">Sign In</a>;
  }

  return (
    <div className="user-profile">
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: What is the primary benefit of wrapping Context in a custom Provider component?
- A) It eliminates the need for JavaScript
- B) It encapsulates state, effects, and business functions inside a self-contained module, keeping root components clean
- C) It converts React into Angular
- D) It automatically deploys the app to AWS
**Answer:** B
**Explanation:** A custom provider component isolates related state, storage sync, and business methods (like `login`, `logout`) inside a single modular file.

### Q2: Why should you export a custom consumer hook (e.g. `useAuth()`) instead of exporting the raw `AuthContext`?
- A) To prevent hackers from stealing CSS
- B) It provides a clean, single-import API and includes a defensive guard that throws an error if called outside the Provider
- C) Raw contexts are deprecated in React 18
- D) Custom hooks run faster in Google Chrome
**Answer:** B
**Explanation:** Exporting a dedicated hook (`useAuth`) abstracts away `useContext` imports and guards against usage outside the Provider with informative error messages.

### Q3: What happens if `useAuth()` is invoked in a component that is NOT nested inside `<AuthProvider>` when the defensive guard is in place?
- A) The computer shuts down
- B) An explicit error is thrown: `'useAuth must be used within an <AuthProvider>'`
- C) The browser hangs in an infinite loop
- D) It renders an empty paragraph
**Answer:** B
**Explanation:** The defensive check `if (!context) throw new Error(...)` surfaces developer wiring errors instantly during development.

### Q4: In the `AuthProvider` example, why is `{!loading && children}` used?
- A) To prevent child components from rendering with null auth state before the initial `localStorage` token check completes
- B) To delay the application by 10 seconds
- C) Because children cannot be rendered inside providers
- D) To turn off StrictMode
**Answer:** A
**Explanation:** Holding off rendering children until initial auth checks finish prevents visual layout shifts or unauthorized redirects while verifying stored credentials.

### Q5: How many Context Providers can wrap an application simultaneously?
- A) Exactly one
- B) At most two
- C) As many as necessary (e.g. `<AuthProvider>`, `<ThemeProvider>`, `<CartProvider>`)
- D) Only class components can have providers
**Answer:** C
**Explanation:** You can compose and nest as many context providers as your architecture requires, each managing its own domain of state.
