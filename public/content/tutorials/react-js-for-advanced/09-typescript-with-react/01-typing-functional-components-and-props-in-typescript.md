# Typing Functional Components and Props in TypeScript

TypeScript is the foundation of enterprise React development. Typing functional components and their props guarantees compile-time type safety, eliminates `undefined is not a function` runtime errors, and provides rich autocompletion across design systems.

---

## 1. Modern Component Typing: Direct Interface vs `React.FC`

In early TypeScript React, `React.FC` (or `React.FunctionComponent`) was common. However, modern enterprise codebases prefer **direct prop typing**:

### Why `React.FC` has Fallen Out of Favor
- In React 17 and earlier, `React.FC` implicitly injected `children: ReactNode` into every component, even if the component was a leaf node (like a self-closing badge or button).
- It complicates generics: `<T>(props: Props<T>)` is awkward to write with `React.FC`.
- Direct function typing is cleaner and mirrors standard TypeScript functions.

```tsx
// ✅ Modern Best Practice: Direct Props Typing
interface UserCardProps {
  userId: string;
  name: string;
  email: string;
  role?: "admin" | "editor" | "viewer"; // Optional union prop
  isActive: boolean;
  onSelect: (id: string) => void; // Typed callback function
}

export function UserCard({
  userId,
  name,
  email,
  role = "viewer", // Default prop value
  isActive,
  onSelect,
}: UserCardProps) {
  return (
    <div
      onClick={() => onSelect(userId)}
      className={`p-4 rounded-lg border cursor-pointer ${
        isActive ? "border-cyan-500 bg-cyan-950/20" : "border-slate-800 bg-slate-900"
      }`}
    >
      <h3 className="font-bold text-white">{name}</h3>
      <p className="text-xs text-slate-400">{email}</p>
      <span className="inline-block mt-2 px-2 py-0.5 text-xs font-mono uppercase bg-slate-800 text-cyan-400 rounded">
        {role}
      </span>
    </div>
  );
}
```

---

## 2. Typing `children` Explicitly

When a component accepts nested children, define `children` explicitly using `React.ReactNode`:

```tsx
import React, { ReactNode } from "react";

interface CardContainerProps {
  title: string;
  children: ReactNode; // Accepts JSX elements, strings, numbers, fragments, or null
  actionSlot?: ReactNode; // Optional slot for buttons or badges
}

export function CardContainer({ title, children, actionSlot }: CardContainerProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {actionSlot && <div>{actionSlot}</div>}
      </header>
      <main className="text-slate-300">{children}</main>
    </section>
  );
}
```

---

## 3. Extending Native HTML Attributes

When building design system primitives (like custom buttons or text fields), extend native HTML attributes so your components accept standard attributes (`id`, `aria-label`, `disabled`, `style`, `className`) automatically:

```tsx
import React, { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export function CustomButton({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...restProps // Forward all standard button attributes (type, onClick, aria-*, etc.)
}: CustomButtonProps) {
  const variantStyles = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...restProps}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
```

---

## Practice Quiz

### Q1: Why is direct props typing (function Button(props: ButtonProps)) preferred over React.FC in modern React?
- A) React.FC has been completely removed from React 18
- B) Direct typing avoids unwanted implicit children typing, simplifies TypeScript generics, and aligns with standard JavaScript functions
- C) React.FC cannot run on Node.js
- D) Direct typing compiles faster by 100x
**Answer:** B
**Explanation:** Direct typing is cleaner, does not enforce unwanted implicit children definitions on leaf components, and simplifies generic typing without extra wrapper syntax.

### Q2: What TypeScript type should you use to type children when accepting any valid renderable React content?
- A) string
- B) React.ReactNode
- C) HTMLElement
- D) any[]
**Answer:** B
**Explanation:** React.ReactNode is the most comprehensive type for children, encompassing JSX elements, strings, numbers, fragments, portals, boolean values, and null.

### Q3: How do you allow a custom button component to accept all standard native HTML <button> attributes like disabled, type, and onKeyDown?
- A) By typing props as any
- B) By extending ButtonHTMLAttributes<HTMLButtonElement> in your props interface
- C) By using document.querySelector
- D) By copying 500 attribute keys manually into your interface
**Answer:** B
**Explanation:** Extending ButtonHTMLAttributes<HTMLButtonElement> inherits all standard W3C button attributes, enabling type-safe prop forwarding.

### Q4: How should an optional callback prop onSelect that receives a string id be typed?
- A) onSelect?: string => void
- B) onSelect?: (id: string) => void
- C) onSelect: void
- D) onSelect: Function
**Answer:** B
**Explanation:** Optional props are marked with ?, and function signatures are typed as (arg: Type) => ReturnType.

### Q5: What is the benefit of defining union literal types (e.g. role?: "admin" | "editor" | "viewer") over plain string?
- A) It saves CSS bandwidth
- B) It prevents typos at compile-time and provides IntelliSense autocomplete suggestions in IDEs
- C) It converts strings into numbers
- D) It encrypts the user role
**Answer:** B
**Explanation:** String literal unions restrict values to a known set of options, preventing runtime typos (like "Admn") and giving developers autocomplete hints.
