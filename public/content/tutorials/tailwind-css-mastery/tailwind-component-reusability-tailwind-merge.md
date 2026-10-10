# Component Extraction, @apply Directives & Tailwind Merge (clsx)

When writing Tailwind CSS in enterprise React or Next.js applications, two major architectural challenges arise:
1. **Preventing Duplication:** Avoiding copying 15 classes across dozens of buttons or inputs.
2. **Dynamic Class Conflicts:** Merging default component classes with custom user-supplied classes without CSS specificity collisions.

---

## 1. The React Component Pattern (Preferred)

In modern component-driven development, the best way to reuse Tailwind styles is **React component abstraction**, NOT custom CSS classes:

```tsx
// Button.tsx - Reusable Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

---

## 2. Solving Class Conflicts with `clsx` & `tailwind-merge` (`cn` helper)

When passing a custom `className="px-8"` to a component with default `px-5`, simple string concatenation yields:
`class="px-5 px-8"`.  
In standard CSS, the winner depends on stylesheet definition order, **NOT class order in the HTML**!

To resolve this reliably, the industry standard is the **`cn()` utility** (pairing `clsx` with `tailwind-merge`):

```bash
npm install clsx tailwind-merge
```

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Usage: px-8 cleanly overrides px-5 without conflict!
<button className={cn("px-5 py-2 bg-blue-600", className)}>
  Click Me
</button>
```

---

## 3. The `@apply` Directive: When to Use (and When to Avoid)

Tailwind allows bundling utilities into traditional CSS classes using `@apply`:

```css
/* src/index.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors;
  }
}
```

> **Best Practice Warning:** Overusing `@apply` recreates all the problems of traditional semantic CSS (naming fatigue, bundle bloat). In React/Vue/Svelte projects, prefer component props over `@apply`.

---

# Multiple Choice Questions

### 1. Why is simple string concatenation (e.g. `${defaultClass} ${customClass}`) dangerous when overriding Tailwind styles in React components?
A. It throws a JavaScript syntax error.
B. When two conflicting classes like `px-4` and `px-8` coexist in the class attribute, the CSS cascade rule depends on stylesheet order rather than the order written in the attribute.
C. It deletes all HTML attributes.
D. It only works in development mode.
**Answer:** B
**Explanation:** In CSS, if two classes of identical specificity target the same property (`padding-left`), the rule defined later in the compiled stylesheet wins regardless of HTML string order.
---

### 2. What is the role of `tailwind-merge` in the popular `cn()` utility helper?
A. It compiles TypeScript to JavaScript.
B. It intelligently detects conflicting Tailwind utility classes and reliably overrides earlier classes with the latest passed variant.
C. It minifies HTML markup.
D. It validates form input fields.
**Answer:** B
**Explanation:** `tailwind-merge` parses class tokens, identifies collisions (e.g., `bg-red-500` vs `bg-blue-600`), and preserves only the overriding class.
---

### 3. What does the `@layer components { ... }` directive do in Tailwind CSS?
A. It tells Tailwind to compile those styles into the components bucket, ensuring utilities can still override them with higher priority in the cascade.
B. It installs a component from npm.
C. It creates a React functional component.
D. It connects to MongoDB.
**Answer:** A
**Explanation:** Styles wrapped in `@layer components` are injected into Tailwind's component layer, ensuring utility classes in the utilities layer take precedence.
---

### 4. Which library is combined with `tailwind-merge` to allow conditional class evaluation like `isActive && "bg-blue-500"`?
A. Lodash
B. `clsx` (or `classnames`)
C. Axios
D. Moment.js
**Answer:** B
**Explanation:** `clsx` provides clean conditional class syntax, which is then passed into `twMerge` for deduplication.
---

### 5. Why do leading frontend engineering teams avoid overusing `@apply` in modern component-driven frameworks like React and Next.js?
A. `@apply` causes React to fail to hydrate.
B. `@apply` re-introduces CSS naming fatigue and defeats the benefits of utility-first colocation; component props provide a cleaner abstraction.
C. `@apply` is only supported in Internet Explorer.
D. `@apply` triples the size of JavaScript bundles.
**Answer:** B
**Explanation:** In modern component frameworks, components (e.g., `<Button variant="primary" />`) are the primary vehicle for reusability, rendering global CSS class abstraction redundant.
---