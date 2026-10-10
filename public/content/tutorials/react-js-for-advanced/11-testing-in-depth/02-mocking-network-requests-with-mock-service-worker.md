# Mocking Network Requests with Mock Service Worker (MSW)

Enterprise React applications rely heavily on network APIs. Testing network-dependent components by mocking `fetch` or `axios` directly (`vi.mock('axios')`) leads to brittle tests that couple test assertions to internal implementation libraries. **Mock Service Worker (MSW)** is the industry standard for network mocking: it intercepts network requests at the network layer using Service Workers (in the browser) and NodeJS network interceptors (in Vitest/Jest).

---

## 1. Why MSW Outperforms Naive Mocks

```
Traditional Mocking (Brittle):
Component ──► axios.get() [Mocked via vi.spyOn] ──► Fake Data
- Breaks if you migrate from Axios to Fetch or TanStack Query!

MSW Network Mocking (Robust):
Component ──► axios/fetch ──► HTTP Request ──► [MSW Interceptor catches request] ──► Mock HTTP Response
- Tests against real HTTP requests, status codes, headers, and payloads!
```

---

## 2. Defining Request Handlers in MSW v2

In MSW v2, handlers use the `http` namespace:

```ts
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from "msw";

export const handlers = [
  // Mock GET /api/v1/user/profile
  http.get("https://api.enterprise.com/v1/user/profile", async () => {
    await delay(50); // Simulate network latency
    return HttpResponse.json({
      id: "usr_9981",
      name: "DevOps Engineer",
      email: "engineer@enterprise.io",
      role: "admin",
    });
  }),

  // Mock POST /api/v1/organizations
  http.post("https://api.enterprise.com/v1/organizations", async ({ request }) => {
    const payload = (await request.json()) as { name: string };

    if (!payload.name) {
      return new HttpResponse(
        JSON.stringify({ error: "Organization name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return HttpResponse.json(
      { id: "org_123", name: payload.name, createdAt: new Date().toISOString() },
      { status: 201 }
    );
  }),
];
```

---

## 3. Configuring MSW in Vitest / Node Test Environment

```ts
// src/mocks/nodeServer.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

Configure your test setup file (`vitest.setup.ts`) to manage the mock server lifecycle:

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/nodeServer";

// Start mock server before running test suite
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset runtime request handlers between tests to prevent test pollution
afterEach(() => server.resetHandlers());

// Clean up and shutdown server when tests finish
afterAll(() => server.close());
```

---

## 4. Testing Error States and Server Overrides

MSW allows individual tests to override handlers on the fly to simulate server outages, 500 errors, or rate limits:

```tsx
// components/UserProfileCard.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/nodeServer";
import { renderWithProviders } from "../test/test-utils";
import { UserProfileCard } from "./UserProfileCard";

describe("UserProfileCard", () => {
  it("displays user profile information when fetch succeeds", async () => {
    renderWithProviders(<UserProfileCard />);

    // Initially displays loading state
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();

    // MSW returns default 200 handler
    expect(await screen.findByText("DevOps Engineer")).toBeInTheDocument();
    expect(screen.getByText("engineer@enterprise.io")).toBeInTheDocument();
  });

  it("handles 500 server outage gracefully with retry button", async () => {
    // Override handler for this specific test
    server.use(
      http.get("https://api.enterprise.com/v1/user/profile", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<UserProfileCard />);

    // Assert error state is rendered
    expect(await screen.findByText(/failed to load profile/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
```

---

## Practice Quiz

### Q1: What makes Mock Service Worker (MSW) superior to vi.mock('axios')?
- A) MSW intercepts requests at the network layer, allowing the application to use real fetch or Axios without tying tests to specific client libraries
- B) MSW writes backend SQL queries
- C) MSW eliminates the need for unit tests
- D) MSW only works with GraphQL
**Answer:** A
**Explanation:** MSW catches requests at the standard HTTP transport level, meaning tests continue to pass even if you swap Axios for Fetch or change internal API abstractions.

### Q2: In MSW v2, how do you construct a mock JSON response with a 201 Created status?
- A) res(ctx.status(201), ctx.json({ ok: true }))
- B) HttpResponse.json({ ok: true }, { status: 201 })
- C) return { status: 201, body: { ok: true } }
- D) res.send(201)
**Answer:** B
**Explanation:** In MSW v2, responses use the Web standard Fetch API abstraction via HttpResponse.json(data, { status: 201 }).

### Q3: Why is server.resetHandlers() called in afterEach?
- A) To delete all cookies from the hard drive
- B) To remove any one-off handler overrides introduced during specific tests, preventing test pollution across test cases
- C) To close the database connection
- D) To reinstall node_modules
**Answer:** B
**Explanation:** Calling resetHandlers() in afterEach resets the server to its initial handler definitions, ensuring custom test overrides (like 500 error simulations) do not leak into other tests.

### Q4: What does onUnhandledRequest: "error" enforce in MSW setup?
- A) It causes the test suite to throw an error if any outgoing network request is not explicitly caught by an MSW handler, catching unexpected network calls
- B) It sends errors to Sentry
- C) It disables internet access completely
- D) It converts 404 responses to 200
**Answer:** A
**Explanation:** Configuring onUnhandledRequest to "error" ensures no test accidentally reaches out to live production endpoints and alerts developers to missing mock handlers.

### Q5: Can MSW intercept requests in both NodeJS unit tests and real browser development environments?
- A) No, MSW only works inside Docker
- B) Yes, MSW uses setupServer in NodeJS test environments and setupWorker with Service Workers in the browser
- C) No, it only works on Windows
- D) It only works with Safari
**Answer:** B
**Explanation:** MSW is isomorphic: in Node.js (Vitest/Jest) it intercepts network traffic via Node interceptors, while in browser development it uses Service Workers.
