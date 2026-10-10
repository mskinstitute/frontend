# Form Handling with useActionState, useFormStatus & Zod Validation

Building professional forms in Next.js 15 requires combining React 19's **`useActionState`** (for managing action state and error responses), **`useFormStatus`** (for loading and pending states), and **Zod** (for type-safe schema validation).

---

## 1. The React 19 / Next.js 15 Form Stack

- **`useActionState`:** Hook that wraps a Server Action to track return values, validation errors, and pending state across submissions.
- **`useFormStatus`:** Hook that provides the pending status of a parent `<form>`, allowing buttons to display spinners during submission.
- **Zod Validation:** Validates form fields on the server before database mutation.

---

## 2. Server Action with Zod Validation

```typescript
// app/actions/auth-actions.ts
'use server';

import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export type ActionState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function signupUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors
    };
  }

  // Database registration logic...
  return { message: 'Account successfully registered!' };
}
```

---

## 3. The Client Form Component with `useActionState`

```tsx
// components/SignupForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signupUser, type ActionState } from '@/app/actions/auth-actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-slate-400"
    >
      {pending ? 'Submitting...' : 'Sign Up'}
    </button>
  );
}

export default function SignupForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useActionState(signupUser, initialState);

  return (
    <form action={formAction} className="max-w-md mx-auto space-y-4">
      {state.message && <p className="text-green-600 font-medium">{state.message}</p>}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" className="w-full border p-2 rounded" />
        {state.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input name="password" type="password" className="w-full border p-2 rounded" />
        {state.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{state.errors.password[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
```

---

# Multiple Choice Questions

### 1. Which React 19 hook replaces the experimental `useFormState` in Next.js 15 for managing server action return states and errors?
A. `useActionState`
B. `useFormEngine`
C. `useMutationState`
D. `useServerResponse`
**Answer:** A
**Explanation:** In React 19 and Next.js 15, `useActionState` is the standardized hook for tracking action state, errors, and execution status.
---

### 2. Where must the `useFormStatus` hook be called to accurately detect if a form submission is pending?
A. Outside the root HTML tag.
B. Inside a component that is rendered as a child of the `<form>` element.
C. Inside `next.config.js`.
D. Inside a Server Component only.
**Answer:** B
**Explanation:** `useFormStatus` relies on React Context supplied by the parent `<form>`; it must be called within a child component rendered inside the `<form>` tag.
---

### 3. What method on a Zod schema validates data without throwing exceptions, returning an object with `{ success: true, data }` or `{ success: false, error }`?
A. `schema.parse()`
B. `schema.safeParse()`
C. `schema.check()`
D. `schema.tryParse()`
**Answer:** B
**Explanation:** `safeParse()` avoids try/catch blocks by returning an object with a boolean `success` flag and either the parsed `data` or validation `error`.
---

### 4. What is the first argument passed to a Server Action when wired through `useActionState`?
A. The `FormData` object
B. The previous state (`prevState`) returned by the action
C. The client IP address
D. The Express request object
**Answer:** B
**Explanation:** The function signature for actions used with `useActionState` is `(prevState, formData) => nextState`.
---

### 5. Why is server-side validation with Zod necessary even if the client form includes HTML5 `required` and `type="email"` attributes?
A. HTML5 attributes do not work on smartphones.
B. Client-side HTML validation can be easily bypassed by disabling JavaScript or submitting via cURL/Postman; server validation is the only secure guarantee of data integrity.
C. Server validation makes database queries free.
D. Zod is required to run React.
**Answer:** B
**Explanation:** Client-side validations are for user experience; server-side validation is required for security to protect against bypassed or malicious payloads.
---
