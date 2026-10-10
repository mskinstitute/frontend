# React Hook Form Basics and Schema Validation

## 1. The Overhead of Controlled Form State
In standard controlled React forms, every keystroke updates state, triggering a component re-render. While imperceptible in small 3-field forms, a complex corporate application with 40+ inputs, dynamic validation rules, and nested arrays can experience noticeable input latency.

**React Hook Form (RHF)** revolutionized form architecture in React:
- **Uncontrolled Under the Hood:** It leverages uncontrolled inputs via refs, updating React state only when necessary.
- **Near-Zero Re-renders:** Typing in an input does *not* re-render the surrounding form or sibling inputs.
- **Tiny Bundle Size:** Extremely lightweight with zero external dependencies.
- **Declarative Schema Integration:** Seamlessly integrates with schema validation libraries like **Zod** or **Yup**.

```
Controlled React Forms:
[Keystroke] ──> [Re-render Parent] ──> [Re-render All 30 Form Inputs]

React Hook Form:
[Keystroke] ──> [Native DOM updates] ──> [Targeted isolate render only on error]
```

## 2. Installing and Basic Usage
```bash
npm install react-hook-form
```

The core primitive of React Hook Form is the `useForm` hook:
```jsx
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SimpleHookForm() {
  // Destructure RHF utilities
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = (data) => {
    console.log('Validated Form Payload:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-form">
      <h2>Student Login</h2>

      {/* Register input with built-in validation rules */}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      {/* Password input */}
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Verifying...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## 3. What Does `register()` Actually Do?
When you write `{...register('email')}`, the function returns an object containing four standard properties that RHF spreads onto your input:
1. `name: 'email'`
2. `ref: (el) => ...` (internal ref callback to read DOM value without state)
3. `onChange: (e) => ...`
4. `onBlur: (e) => ...`

## 4. Schema-Based Validation with Zod
In enterprise architectures, writing inline regex rules inside JSX is discouraged. Instead, teams define a centralized **Zod Schema** shared between frontend and backend:

```bash
npm install zod @hookform/resolvers
```

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema once
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid corporate email address'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old')
});

export default function ZodValidatedForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema) // Connect schema!
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="number" {...register('age')} placeholder="Age" />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}
```

---

## Practice Quiz

### Q1: What primary performance advantage does React Hook Form provide over traditional controlled forms?
- A) It compiles code into C++
- B) It uses uncontrolled components via refs to minimize component re-renders while typing
- C) It eliminates the need for CSS
- D) It only works on Linux
**Answer:** B
**Explanation:** React Hook Form embraces uncontrolled inputs under the hood, updating UI without triggering re-renders of the entire form on every single keystroke.

### Q2: What does `{...register('fieldName')}` return and apply to an `<input>` element?
- A) An array of numbers
- B) An object containing `name`, `ref`, `onChange`, and `onBlur` properties
- C) A CSS stylesheet
- D) An SQL connection string
**Answer:** B
**Explanation:** The `register` function returns the essential DOM properties (`name`, `ref`, `onChange`, `onBlur`) needed for RHF to subscribe to and validate the element.

### Q3: How is a custom schema validation library like Zod connected to React Hook Form?
- A) Via the `resolver` option in `useForm({ resolver: zodResolver(schema) })`
- B) Inside `index.html`
- C) By adding a `<Zod>` component tag
- D) Through a WebSocket
**Answer:** A
**Explanation:** The official `@hookform/resolvers` package provides adapters like `zodResolver` to connect schema definitions directly into `useForm`.

### Q4: In React Hook Form, where are field validation error messages accessed?
- A) `window.errors`
- B) `formState.errors` returned by `useForm()`
- C) Inside the `package.json` file
- D) On the server console
**Answer:** B
**Explanation:** `errors` is nested inside the `formState` object returned by `useForm()`, mapping each registered field name to its validation error details.

### Q5: What does RHF's `handleSubmit` function do before invoking your custom submit handler?
- A) It restarts the Vite server
- B) It automatically calls `e.preventDefault()`, runs all validation rules, and only invokes your callback if all validations pass
- C) It reloads the browser window
- D) It deletes all input fields
**Answer:** B
**Explanation:** `handleSubmit` intercepts the native submit event, prevents page refresh, executes validation schemas, and delivers the clean parsed data to your submit callback.
