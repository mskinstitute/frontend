# Component Reusability and Polymorphic Components

## 1. The Challenge of Flexible UI Primitives
In professional design systems (such as Radix UI, Headless UI, or custom enterprise component libraries), UI primitives like buttons, cards, and typography must adapt to diverse semantic roles without duplicating code.

Consider a `<Button>` component. In standard scenarios, it should render an HTML `<button>` element. However:
- When linking to an external website, it semantically needs to render an `<a>` tag.
- When used with React Router, it should render a client-side `<Link>` component.
- In custom dashboard toolbars, it might render as a `<div>` with ARIA roles.

If you create separate `<Button>`, `<LinkButton>`, and `<RouteButton>` components, you fracture style maintenance, prop contracts, and accessibility attributes.

The solution is the **Polymorphic Component Pattern** (commonly implemented via the **`as` prop**).

```
<Button>                    ──> Renders <button className="btn">
<Button as="a" href="...">  ──> Renders <a href="..." className="btn">
<Button as={Link} to="..."> ──> Renders <Link to="..." className="btn">
```

## 2. Implementing a Polymorphic Component in JavaScript/React
In React, JSX tag names that start with an uppercase letter are evaluated dynamically as variables. By accepting an `as` prop and aliasing it to a capitalized variable name (`Component`), we can dynamically determine the rendered tag:

```jsx
import React from 'react';

export default function Text({
  as: Component = 'p', // Default to paragraph if omitted
  variant = 'body',    // 'heading' | 'subheading' | 'body' | 'caption'
  children,
  className = '',
  ...restProps
}) {
  const variantClasses = {
    heading: 'text-3xl font-extrabold text-slate-900 tracking-tight',
    subheading: 'text-xl font-bold text-slate-800',
    body: 'text-base text-slate-600 leading-relaxed',
    caption: 'text-xs text-slate-400 uppercase tracking-wider'
  };

  return (
    <Component
      className={`${variantClasses[variant] || variantClasses.body} ${className}`}
      {...restProps}
    >
      {children}
    </Component>
  );
}
```

### Flexible Consumer Usage:
```jsx
// Renders <h1> with heading styles
<Text as="h1" variant="heading">MSK Course Directory</Text>

// Renders <span> with caption styles
<Text as="span" variant="caption">Module 4 of 12</Text>

// Renders default <p> with body styles
<Text>Master modern full-stack development patterns.</Text>
```

## 3. Building Polymorphic Action Buttons
Here is an enterprise polymorphic button supporting native buttons, external anchors, and custom framework routers:

```jsx
import React from 'react';

export default function ActionButton({
  as: Element = 'button',
  variant = 'primary',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  // If rendering a native button without explicit type, default to 'button'
  const defaultType = Element === 'button' ? { type: 'button' } : {};

  return (
    <Element
      className={`${baseStyles} ${variants[variant]}`}
      {...defaultType}
      {...props}
    >
      {children}
    </Element>
  );
}
```

---

## Practice Quiz

### Q1: What is a "polymorphic component" in React?
- A) A component that converts JSX into WebGL 3D graphics
- B) A single component that can dynamically render as different underlying HTML tags or React components using an `as` prop
- C) A component that inherits from multiple ES6 classes
- D) A component that changes colors on mouse hover
**Answer:** B
**Explanation:** A polymorphic component accepts an `as` prop to dynamically vary its underlying rendered DOM element or component while preserving consistent styling and behavior.

### Q2: Why is the prop destructured as `as: Component = 'div'`?
- A) Because lowercase tag variables are ignored by the JavaScript engine
- B) In JSX, dynamic components must start with an uppercase letter to be differentiated from native HTML tags
- C) To make the prop private to the file
- D) Because `as` is a reserved SQL keyword
**Answer:** B
**Explanation:** JSX differentiates custom components from built-in HTML tags by checking if the identifier starts with an uppercase letter; aliasing `as` to `Component` satisfies this syntax rule.

### Q3: What semantic accessibility risk is avoided by using polymorphic components?
- A) Rendering a `<div>` with click handlers instead of an accessible native `<button>` or `<a>` link
- B) Loading too many CSS fonts
- C) Using the color red in dark mode
- D) Running the Vite server on port 3000
**Answer:** A
**Explanation:** Polymorphic components allow interactive UI elements to render native semantic tags (like `<button>` or `<a>`) with built-in keyboard navigation and screen-reader support.

### Q4: If `<ActionButton as="a" href="https://mskinstitute.com">Enroll</ActionButton>` is rendered, what HTML tag will appear in the DOM?
- A) `<button>`
- B) `<a>`
- C) `<div>`
- D) `<span>`
**Answer:** B
**Explanation:** Passing `as="a"` causes the component to dynamically render an anchor `<a>` element containing the passed `href` attribute.

### Q5: What happens if the `as` prop is omitted when using `<Text>Hello</Text>` with `as: Component = 'p'`?
- A) A fatal runtime crash occurs
- B) It falls back to the default parameter and renders a `<p>` paragraph element
- C) It renders nothing (null)
- D) It renders an `<iframe>`
**Answer:** B
**Explanation:** Default parameter destructuring ensures that if `as` is undefined, `Component` defaults to the `'p'` tag.
