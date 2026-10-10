# Dynamic Context Slicing and Module Separation

## 1. The Monolithic Context Trap
In mid-to-large React applications, developers often start with a single `AppContext` or `GlobalContext`. Over time, this monolithic context accumulates:
- User profile data
- Theme preferences
- Shopping cart items
- Active navigation tabs
- Toast notifications
- Form drafts

Because of React Context's fundamental update model, **whenever ANY value in a Context Provider changes, EVERY component subscribed to that Context re-renders**, even if that component only cares about a completely unrelated property!

```
Monolithic Context Problem:
User types in Search Bar ──► GlobalContext updates!
                                    │
                                    ├──► [Navbar Re-renders]
                                    ├──► [ShoppingCart Re-renders] (Unnecessary!)
                                    ├──► [Footer Re-renders]       (Unnecessary!)
                                    └──► [UserProfile Re-renders]  (Unnecessary!)
```

## 2. The Solution: Domain-Driven Context Slicing
The enterprise architecture solution decomposes the monolithic context into **Domain-Driven Slices**:
- `AuthContext`: Manages credentials, tokens, and active user profile.
- `ThemeContext`: Manages dark/light modes and visual design tokens.
- `NotificationContext`: Manages transient alert banners and toasts.
- `CartContext`: Manages e-commerce cart items and checkout calculations.

Each domain slice lives in its own dedicated module, exposing its own typed Provider and custom hook.

```
Domain-Driven Slicing:
User types in Search Bar ──► SearchContext updates!
                                    │
                                    └──► [SearchDropdown Re-renders] (Only affected component!)
```

## 3. Dynamic Context Inversion (Colocation)
Not all Contexts need to be global at the application root (`src/main.jsx`).

The principle of **State Colocation** dictates:
> **Place Context Providers as low in the component tree as possible, directly above the components that actually consume them.**

For example, an `<EnrollmentWizard>` with 5 steps should have an `EnrollmentWizardContext.Provider` wrapping *only* the wizard component, not the entire application! When the wizard unmounts, its context state is cleaned up from memory automatically.

---

## Practice Quiz

### Q1: Why is putting all application state into a single `GlobalContext` an architectural anti-pattern?
- A) Context cannot hold more than 5 properties
- B) Any update to any property in the monolithic context forces every component subscribed to that context to re-render, causing severe performance degradation
- C) It makes the browser window close
- D) It violates the W3C HTML specification
**Answer:** B
**Explanation:** When a Context's provider value updates, all consuming components re-render. A monolithic context means updates to trivial fields trigger re-render cascades across the entire app.

### Q2: What is "Domain-Driven Context Slicing"?
- A) Dividing the hard drive into partitions
- B) Separating state into distinct, domain-specific contexts (e.g. `AuthContext`, `ThemeContext`, `CartContext`) so components only subscribe to the specific domain they need
- C) Using multiple CSS files
- D) A backend database optimization
**Answer:** B
**Explanation:** Slicing state by business domain ensures components only listen to data relevant to their function, preventing cross-cutting re-render cascades.

### Q3: What is the benefit of "State Colocation" when placing Context Providers?
- A) Placing providers directly above the specific subtree that uses them minimizes memory footprint and isolates updates to that feature area
- B) It ensures all data is saved to `localStorage`
- C) It speeds up the CPU clock
- D) It disables JavaScript strict mode
**Answer:** A
**Explanation:** Colocating providers close to their consumers ensures clean garbage collection upon unmount and prevents state from leaking into unrelated views.

### Q4: If Component A consumes `ThemeContext` and Component B consumes `AuthContext`, what happens when the theme toggles?
- A) Both Component A and Component B re-render
- B) Only Component A re-renders; Component B does not re-render because it is subscribed to a separate, untouched Context
- C) The browser reloads
- D) Component A is deleted
**Answer:** B
**Explanation:** Because `ThemeContext` and `AuthContext` are separate contexts, updating `ThemeContext` only triggers re-renders in its own subscribers.

### Q5: When should a Context Provider wrap the root of the application versus a localized subtree?
- A) Root providers are for truly ambient global data (like user auth or theme); localized providers are for multi-step wizards or complex feature modules
- B) All providers must always wrap the root
- C) Localized providers are forbidden in React
- D) Root providers only work in production
**Answer:** A
**Explanation:** True ambient constants belong at the root, while feature-specific coordination state should be scoped strictly to the feature subtree.
