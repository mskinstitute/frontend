# Polymorphic Component Typing with As and ComponentPropsWithoutRef

A **polymorphic component** is an advanced design system component that can dynamically change its underlying HTML element or React component via an `as` prop while retaining strict TypeScript type safety. For example, a `<Button as="a" href="/login">` renders an `<a>` tag and permits `href`, while `<Button as="button" type="submit">` forbids `href` and permits `type`.

---

## 1. The Challenge of Polymorphic Components

Without polymorphism, design system developers often duplicate code: creating `<Button>`, `<LinkButton>`, `<DivButton>`. 

Naive typing using `React.ElementType` fails because TypeScript cannot dynamically validate that an `href` prop is only legal when `as="a"`, or that `target` is illegal when `as="button"`.

---

## 2. Constructing the Polymorphic Type Helper

```tsx
import React, { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// 1. As prop definition
type AsProp<C extends ElementType> = {
  as?: C;
};

// 2. Props to omit from the underlying element to prevent conflicts
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// 3. Polymorphic component prop type combining custom props with element attributes
export type PolymorphicComponentProps<
  C extends ElementType,
  Props = {}
> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

---

## 3. Implementing a Polymorphic `<Button>` Component

```tsx
import React, { ElementType } from "react";
import { PolymorphicComponentProps } from "./types";

interface ButtonCustomProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

// Default element when 'as' is omitted is "button"
type ButtonProps<C extends ElementType = "button"> = PolymorphicComponentProps<
  C,
  ButtonCustomProps
>;

export function Button<C extends ElementType = "button">({
  as,
  variant = "solid",
  size = "md",
  children,
  className = "",
  ...restProps
}: ButtonProps<C>) {
  // Determine the dynamic component or tag
  const Component = as || "button";

  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition";
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variantStyles = {
    solid: "bg-cyan-600 hover:bg-cyan-500 text-white",
    outline: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10",
    ghost: "text-slate-300 hover:bg-slate-800",
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <Component className={combinedClass} {...restProps}>
      {children}
    </Component>
  );
}
```

---

## 4. Compile-Time Type Safety in Action

```tsx
// ✅ 1. Standard button: accepts type="submit", disabled
<Button variant="solid" type="submit">
  Submit Form
</Button>

// ✅ 2. Rendered as anchor: accepts href, target="_blank", rel
<Button as="a" href="https://example.com" target="_blank">
  Visit Documentation
</Button>

// ✅ 3. Rendered as React Router Link: accepts to="/dashboard"
import { Link } from "react-router-dom";
<Button as={Link} to="/dashboard">
  Go to Dashboard
</Button>

// ❌ 4. COMPILE ERROR: type="submit" is illegal on an anchor tag!
// <Button as="a" href="/profile" type="submit">Invalid</Button>
```

---

## 5. Adding `ref` Support with Polymorphic `forwardRef`

To forward refs safely across polymorphic elements:

```tsx
export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];
```

---

## Practice Quiz

### Q1: What is the defining capability of a polymorphic React component?
- A) It can run simultaneously on the client and server
- B) It allows callers to dynamically change the rendered HTML element or component via an as prop while preserving full TypeScript type safety
- C) It translates text into 10 different languages
- D) It bypasses React reconciler
**Answer:** B
**Explanation:** Polymorphic components allow consumers to render different DOM tags or components (e.g. button, a, Link) while TypeScript dynamically adapts the permitted props.

### Q2: Why is ComponentPropsWithoutRef<C> used instead of ComponentProps<C>?
- A) ComponentProps has been deleted from TypeScript
- B) ComponentPropsWithoutRef extracts all valid props of element C while omitting the ref prop, preventing typing conflicts when typing custom forwardRef signatures
- C) It increases build speeds by 10x
- D) It only works with HTML5 elements
**Answer:** B
**Explanation:** ComponentPropsWithoutRef strips the ref attribute from an element's type, making it clean to compose with custom prop types and forwardRef.

### Q3: In the polymorphic Button component, what happens if a developer passes href="https://google.com" without specifying as="a"?
- A) TypeScript throws a compile error because href is not a valid attribute on the default HTMLButtonElement
- B) The browser converts the button into an anchor tag at runtime
- C) The application crashes with a fatal exception
- D) Google Chrome reloads the page
**Answer:** A
**Explanation:** Because the default generic fallback is "button", TypeScript checks against HTMLButtonElement attributes. Since href does not exist on button elements, TypeScript flags a compile-time error.

### Q4: Why is Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> used in the polymorphic helper?
- A) To delete all styling classes
- B) To ensure custom component props override any conflicting native attribute names with the same key
- C) To make all props optional
- D) To prevent JavaScript minification
**Answer:** B
**Explanation:** Using Omit ensures that if a custom prop shares a name with a native HTML attribute, the custom component's prop definition takes precedence without union type collisions.

### Q5: Can a polymorphic component accept another React component (like React Router Link) into its as prop?
- A) No, only native HTML string tags like "div" and "span" are supported
- B) Yes, because React.ElementType accepts both HTML tag names and React component types
- C) Only if the component is written in JavaScript
- D) Only in Next.js
**Answer:** B
**Explanation:** React.ElementType includes string tags (like "a", "button") and React component constructors/functions (like React Router's Link).
