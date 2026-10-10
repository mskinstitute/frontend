# CSS Stylesheets and Global Class Names

## 1. Traditional CSS in Modern React
The simplest way to style React components is writing standard CSS in external `.css` files and importing them directly into your JavaScript files.

When you import a stylesheet via Vite or Webpack:
```jsx
import './App.css';
```
The bundler extracts the CSS, injects it into a `<style>` tag in development, and bundles it into an optimized, minified `.css` file in production.

## 2. Using Global Class Names
Once imported, you apply styles using the `className` attribute:

```css
/* src/styles/cards.css */
.course-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.course-card .card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}
```

```jsx
// src/components/CourseCard.jsx
import React from 'react';
import './cards.css';

export default function CourseCard({ title, children }) {
  return (
    <div className="course-card">
      <h3 className="card-title">{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}
```

## 3. The Major Danger: Global Scope Collisions
While importing plain CSS files into components feels modular, **standard imported CSS files are completely global!**

Importing `import './cards.css'` inside `CourseCard.jsx` does **not** restrict the `.card-title` class to `CourseCard`. If another developer creates `UserProfile.jsx` and imports `profile.css` with a `.card-title` class, **both rules conflict globally** across the entire application:

```
Component A imports: .card-title { color: blue; }
Component B imports: .card-title { color: red; font-size: 20px; }
Result: Cascading conflict! Whichever CSS rule loads last overrides the other!
```

## 4. Best Practices for Plain CSS in React
If using traditional CSS stylesheets without CSS Modules or Tailwind:
- **Follow BEM (Block-Element-Modifier):** Use strict naming prefixes like `.msk-course-card`, `.msk-course-card__title`, `.msk-course-card--highlighted` to prevent global name clashes.
- **Global Design Tokens in `index.css`:** Place CSS variables (`:root { --primary-color: #0284c7; }`), base resets, and typography in `index.css`.
- **Prefer CSS Modules or Tailwind CSS for Enterprise Apps:** Use modern scoped tools to eliminate global namespace collisions entirely.

---

## Practice Quiz

### Q1: How do you import an external CSS file into a React component when using Vite?
- A) `<link rel="stylesheet" href="./styles.css" />`
- B) `import './styles.css';`
- C) `requireStyles('./styles.css')`
- D) `CSS.load('./styles.css')`
**Answer:** B
**Explanation:** In modern bundlers like Vite, stylesheets are imported directly into JavaScript modules using standard ES import syntax: `import './styles.css';`.

### Q2: Why can importing plain CSS files across many components lead to bugs in large applications?
- A) Browsers can only load one CSS file per domain
- B) Standard CSS imports are global in scope; identically named class names across different files will collide and override each other
- C) CSS files disable React state
- D) Vite cannot bundle CSS files
**Answer:** B
**Explanation:** Plain CSS imports are not locally scoped by default. All classes enter the global CSS namespace, making name collisions likely as projects scale.

### Q3: What CSS methodology uses Block, Element, and Modifier naming to prevent namespace collisions?
- A) MVC
- B) BEM
- C) REST
- D) ACID
**Answer:** B
**Explanation:** BEM (Block, Element, Modifier) provides a disciplined class naming convention (e.g., `card__header--active`) to avoid unintended styling overrides in global CSS.

### Q4: Where are global resets and CSS root variables typically imported in a Vite React project?
- A) In `src/main.jsx` (importing `index.css`)
- B) In every single component file
- C) Inside the database
- D) In `package.json`
**Answer:** A
**Explanation:** Top-level global stylesheets (like `index.css` containing resets and design tokens) are imported once at the root entry point, `src/main.jsx`.

### Q5: Does standard external CSS support pseudo-classes like `:hover` and media queries?
- A) No, only inline styles support them
- B) Yes, standard external CSS files provide full access to pseudo-classes, pseudo-elements, animations, and media queries
- C) Only in Firefox
- D) Only when using TypeScript
**Answer:** B
**Explanation:** External stylesheets support the entire CSS specification, including animations, media queries, `:hover`, and `::before` pseudo-elements.
