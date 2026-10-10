# Authentication with NextAuth / Auth.js & JWT Session Management

Securing user identity across Server Components, Client Components, and API Route Handlers is essential for modern applications. **Auth.js** (formerly **NextAuth.js**) is the complete, open-source authentication solution for Next.js, supporting OAuth social logins (Google, GitHub), Credentials login, database adapters, and stateless JWT sessions.

---

## 1. Setting Up Auth.js in Next.js 15

Install the core package:
```bash
npm install next-auth@beta
```

Create the centralized configuration file:

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) return null;

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: { strategy: 'jwt' }
});
```

---

## 2. Exposing Route Handlers

Wire up the authentication endpoints in the App Router:

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

---

## 3. Protecting Server Components & Pages

In Server Components, reading the active user session is a clean, synchronous one-liner with zero client-side waterfall:

```tsx
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth(); // Inspect session directly on the server!

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome back, {session.user.name}!</h1>
      <p>Role: {(session.user as any).role}</p>
    </div>
  );
}
```

---

# Multiple Choice Questions

### 1. How do you access the active authenticated user session inside an async React Server Component using Auth.js?
A. `const session = await auth();`
B. `useSession()`
C. `window.sessionStorage.getItem('user')`
D. `document.cookie.auth`
**Answer:** A
**Explanation:** Calling the server-side `auth()` function exported from your NextAuth configuration yields the session securely within Server Components.
---

### 2. Which session strategy stores user session state securely inside an encrypted HTTP-Only cookie without requiring a database query on every request?
A. `session: { strategy: 'jwt' }`
B. `session: { strategy: 'database' }`
C. `session: { strategy: 'localStorage' }`
D. `session: { strategy: 'none' }`
**Answer:** A
**Explanation:** The JWT strategy encodes the user claims into an encrypted token stored in an HTTP-only cookie, enabling stateless authentication without database lookups.
---

### 3. Which callback in Auth.js is used to inject custom claims (such as a user's role or organization ID) into the client session object?
A. `callbacks: { session, jwt }`
B. `callbacks: { render }`
C. `callbacks: { onRequest }`
D. `callbacks: { verify }`
**Answer:** A
**Explanation:** The `jwt` callback populates the token, and the `session` callback forwards those properties into the `session.user` object returned to the application.
---

### 4. What is the role of `app/api/auth/[...nextauth]/route.ts`?
A. To style the login buttons.
B. To serve as the catch-all API Route Handler that processes OAuth redirects, callbacks, sign-in, and sign-out endpoints for Auth.js.
C. To delete expired passwords from MongoDB.
D. To encrypt the client's monitor.
**Answer:** B
**Explanation:** NextAuth uses a catch-all route handler to manage all authentication flow endpoints (e.g. `/api/auth/callback/google`, `/api/auth/signout`).
---

### 5. Why is `useSession()` restricted strictly to Client Components marked with `'use client'`?
A. Because it relies on React Context (`SessionProvider`) and browser state that only exist during client-side hydration.
B. Because Server Components cannot read cookies.
C. Because Google Chrome blocks Server Components.
D. It is not restricted; it can be used anywhere.
**Answer:** A
**Explanation:** `useSession` is a React hook that reads from a client-side React Context provider, requiring the `'use client'` environment.
---
