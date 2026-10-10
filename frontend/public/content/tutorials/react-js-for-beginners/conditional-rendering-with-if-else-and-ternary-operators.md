# Conditional Rendering with If-Else and Ternary Operators

## 1. What is Conditional Rendering?
In real-world web applications, user interfaces frequently need to display different components or markup depending on specific conditions:
- Showing a "Login" button for guests vs a "Profile" dropdown for authenticated users
- Showing a spinner while data is loading vs the actual data when loaded
- Showing an error banner when a form submission fails
- Showing an empty state when a shopping cart has 0 items

In React, **conditional rendering** works the exact same way conditions work in JavaScript: using standard JavaScript control flow structures such as `if/else` statements, ternary operators (`? :`), and logical operators.

## 2. Method 1: Early Return with `if/else`
When a condition dictates that a completely different view should be rendered, using standard `if` statements with early returns is clean and readable:

```jsx
import React from 'react';

export default function UserDashboard({ user, isLoading, error }) {
  // 1. Loading state early return
  if (isLoading) {
    return <div className="spinner">Loading your dashboard...</div>;
  }

  // 2. Error state early return
  if (error) {
    return <div className="error-alert">Error: {error.message}</div>;
  }

  // 3. Unauthenticated state early return
  if (!user) {
    return (
      <div className="guest-view">
        <h2>Please Sign In</h2>
        <button>Login to Continue</button>
      </div>
    );
  }

  // 4. Primary view (all checks passed)
  return (
    <div className="dashboard-view">
      <h2>Welcome back, {user.name}!</h2>
      <p>Enrolled Courses: {user.enrolledCount}</p>
    </div>
  );
}
```
*Note: Make sure any React Hooks (like `useState` or `useEffect`) are declared **before** any early returns to obey the Rules of Hooks!*

## 3. Method 2: The Ternary Operator (`condition ? trueVal : falseVal`)
Because `if` statements are statements (not expressions), they cannot be used directly inside JSX markup. When you want to conditionally render one of two elements *inline*, the **ternary operator** is the tool of choice:

```jsx
import React, { useState } from 'react';

export default function MembershipCard({ isProMember }) {
  return (
    <div className="card">
      <h3>MSK Learning Portal</h3>
      
      {/* Inline ternary conditional rendering */}
      {isProMember ? (
        <div className="pro-badge">
          <span className="star">★</span>
          <span>Pro Subscriber: Unlimited Lab Access</span>
        </div>
      ) : (
        <div className="free-tier">
          <span>Standard Member: 3 Free Lessons Remaining</span>
          <button className="upgrade-btn">Upgrade to Pro</button>
        </div>
      )}
    </div>
  );
}
```

## 4. Conditional Attribute and Class Assignment
Ternary operators are also invaluable for conditionally applying classes, styles, and attribute values:

```jsx
<button
  className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
  disabled={isLoading}
  aria-expanded={isOpen ? 'true' : 'false'}
>
  {isLoading ? 'Saving...' : 'Save Changes'}
</button>
```

---

## Practice Quiz

### Q1: Why can't you place an `if` statement directly inside JSX curly braces `{}`?
- A) React syntax forbids logic
- B) `if` is a statement that does not evaluate to a value, and JSX curly braces only accept JavaScript expressions
- C) Modern browsers only allow `if` statements inside `.html` files
- D) JSX converts `if` statements into CSS rules
**Answer:** B
**Explanation:** Inside JSX curly braces, only expressions (code that resolves to a value) can be evaluated. Statements like `if/else` do not evaluate to values; ternary operators or logical expressions must be used instead.

### Q2: What is the primary advantage of using early `return` statements for conditional rendering?
- A) It prevents the component from loading CSS
- B) It keeps complex fallback states (such as loading spinners and error alerts) separate and clean, preventing deeply nested markup
- C) It forces the browser to refresh
- D) It automatically caches data in SQLite
**Answer:** B
**Explanation:** Early returns allow components to handle edge cases (loading, errors, empty states) up front with clean exits, keeping the main happy-path JSX readable and unnested.

### Q3: What rule must be respected when combining React Hooks with early returns?
- A) Hooks can only be placed inside the early return block
- B) All Hooks must be invoked at the very top of the component, before any conditional early returns
- C) Hooks cannot be used in components with `if` statements
- D) Only one hook can be called per component
**Answer:** B
**Explanation:** React requires hooks to be called in the exact same order on every render. Hooks must never be placed after conditional returns or inside conditional branches.

### Q4: Which operator is used for inline conditional rendering when you want to choose between two alternate elements?
- A) The Ternary Operator (`condition ? <ComponentA /> : <ComponentB />`)
- B) The typeof operator
- C) The Bitwise XOR operator
- D) The Delete operator
**Answer:** A
**Explanation:** The ternary operator `condition ? exprIfTrue : exprIfFalse` is an expression, allowing it to render one of two alternative JSX branches inline.

### Q5: What is rendered if a ternary condition evaluates to `condition ? null : <Button />` and the condition is `true`?
- A) The string "null"
- B) Nothing (empty DOM)
- C) A blank `<div>`
- D) A browser alert
**Answer:** B
**Explanation:** Returning `null` in React renders nothing, leaving no element in the browser's DOM.
