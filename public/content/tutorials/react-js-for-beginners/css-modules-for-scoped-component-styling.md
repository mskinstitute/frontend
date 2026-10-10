# CSS Modules for Scoped Component Styling

## 1. The Need for Scoped CSS
As applications grow to hundreds of components, global CSS namespace collisions become inevitable. You want the flexibility of writing pure, clean CSS with full support for pseudo-classes, media queries, and animations—**without the fear that your classes will accidentally leak or clash with other components**.

**CSS Modules** solve this problem elegantly. A CSS Module is a CSS file where all class names and animation names are **scoped locally to the component by default**.

Vite supports CSS Modules out of the box with **zero configuration required!**

## 2. Naming Convention: `[name].module.css`
To inform Vite and your bundler that a stylesheet is a CSS Module, simply name the file with the **`.module.css`** extension:

```
src/components/
├── Badge.jsx
└── Badge.module.css   # Identified by Vite as a CSS Module
```

## 3. How CSS Modules Work
In your CSS Module, write standard, clean CSS classes:

```css
/* src/components/Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.success {
  background-color: #dcfce7;
  color: #15803d;
}

.warning {
  background-color: #fef9c3;
  color: #a16207;
}
```

In your React component, import the styles as an **object**:

```jsx
// src/components/Badge.jsx
import React from 'react';
import styles from './Badge.module.css'; // Imports object mapping class names

export default function Badge({ type = 'success', children }) {
  // Access scoped classes via styles object properties
  return (
    <span className={`${styles.badge} ${styles[type]}`}>
      {children}
    </span>
  );
}
```

## 4. Under the Hood: Class Name Hashing
When Vite processes `Badge.module.css`, it automatically transforms every class name into a unique, hashed string:

```
Source Class:   .badge
Rendered HTML:  <span class="_badge_1s8fg_1 _success_1s8fg_15">
```
Because the compiled class names include unique hashes derived from the file path and component name, **it is mathematically impossible for `.badge` in `Badge.module.css` to collide with `.badge` in `UserCard.module.css`!**

---

## Practice Quiz

### Q1: What file naming convention is required for Vite to automatically treat a stylesheet as a CSS Module?
- A) `filename.css.scoped`
- B) `filename.module.css`
- C) `filename.component.css`
- D) `filename.react.css`
**Answer:** B
**Explanation:** The `.module.css` naming suffix indicates to bundlers like Vite and Webpack that the file should be compiled as a scoped CSS Module.

### Q2: How are CSS classes referenced in JSX when using CSS Modules?
- A) As standard strings: `<div className="badge">`
- B) As properties on the imported styles object: `<div className={styles.badge}>`
- C) Using HTML `<style>` tags
- D) Using global ID selectors
**Answer:** B
**Explanation:** CSS Modules export an object mapping your original class names to their compiled unique hashes, accessed via `styles.className`.

### Q3: How do CSS Modules prevent class name conflicts between different components?
- A) By deleting competing stylesheets
- B) By automatically compiling class names into unique, content-hashed strings (e.g. `_badge_8h2k1_1`)
- C) By wrapping every component in an `<iframe>`
- D) By disabling CSS inheritance
**Answer:** B
**Explanation:** CSS Modules append unique hashes to each class name at build time, ensuring that identical class names in different files never collide.

### Q4: Can you use pseudo-classes like `:hover` and media queries inside CSS Modules?
- A) No, CSS Modules only support color properties
- B) Yes, CSS Modules support the full standard CSS specification including `:hover`, animations, and media queries
- C) Only with an additional plugin
- D) Only on desktop browsers
**Answer:** B
**Explanation:** CSS Modules are regular CSS files with automated scoped renaming, providing 100% support for the entire CSS language.

### Q5: How do you access a CSS Module class that contains a hyphen (e.g., `.badge-primary`) in JSX?
- A) `styles.badge-primary` (causes a JS syntax subtraction error)
- B) Bracket notation: `styles['badge-primary']`
- C) `styles(badge-primary)`
- D) `styles->badge_primary`
**Answer:** B
**Explanation:** In JavaScript, object properties with hyphens cannot be accessed with dot notation; bracket notation `styles['badge-primary']` must be used.
