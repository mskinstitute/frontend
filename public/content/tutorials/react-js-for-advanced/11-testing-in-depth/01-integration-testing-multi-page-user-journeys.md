# Integration Testing Multi-Page User Journeys

While unit tests verify isolated functions or components in a vacuum, **integration tests** verify how multiple components, routers, state providers, and mocked API responses collaborate across realistic user journeys. Using React Testing Library (RTL) and Vitest, you can test multi-step workflows like user login, product checkout, and multi-tab forms with high confidence.

---

## 1. Guiding Philosophy: Test User Behavior, Not Implementation

> *"The more your tests resemble the way your software is used, the more confidence they can give you."* — Kent C. Dodds

- **Avoid:** Testing internal component state (`wrapper.state()`), testing internal hook variables, querying CSS class selectors.
- **Prefer:** Interacting via accessible queries (`getByRole`, `getByLabelText`, `getByText`), clicking buttons via `@testing-library/user-event`, asserting visible changes.

---

## 2. Setting Up an Enterprise Test Harness

Because enterprise components rely on Context providers (Router, Auth, Theme, QueryClient), build a reusable test harness `renderWithProviders`:

```tsx
// test/test-utils.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../auth/AuthContext";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { initialRoute = "/", ...renderOptions }: ExtendedRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

---

## 3. Multi-Step Checkout Journey Integration Test

Let's test an end-to-end user journey:
1. User enters address in Shipping Form.
2. User clicks "Continue to Payment".
3. User selects Credit Card and clicks "Place Order".
4. User sees order confirmation screen.

```tsx
// pages/CheckoutJourney.test.tsx
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/test-utils";
import { CheckoutFlowApp } from "./CheckoutFlowApp";

describe("Multi-Page Checkout Journey", () => {
  it("allows customer to fill address, select billing, and view receipt", async () => {
    const user = userEvent.setup();

    // 1. Render app with initial route set to checkout
    renderWithProviders(<CheckoutFlowApp />, { initialRoute: "/checkout/shipping" });

    // 2. Verify Step 1 elements exist
    expect(screen.getByRole("heading", { name: /shipping address/i })).toBeInTheDocument();

    // 3. Fill Shipping Address form
    const streetInput = screen.getByLabelText(/street address/i);
    const cityInput = screen.getByLabelText(/city/i);
    const continueBtn = screen.getByRole("button", { name: /continue to payment/i });

    await user.type(streetInput, "742 Evergreen Terrace");
    await user.type(cityInput, "Springfield");
    await user.click(continueBtn);

    // 4. Assert navigation to Step 2 (Payment)
    expect(await screen.findByRole("heading", { name: /payment method/i })).toBeInTheDocument();

    // 5. Select Credit Card radio option
    const creditCardRadio = screen.getByRole("radio", { name: /credit card/i });
    await user.click(creditCardRadio);

    // 6. Submit Order
    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(placeOrderBtn);

    // 7. Assert Confirmation Screen is displayed with order ID
    expect(await screen.findByText(/thank you for your order/i)).toBeInTheDocument();
    expect(screen.getByText(/order confirmation #/i)).toBeInTheDocument();
  });
});
```

---

## 4. Query Priority Guidelines

When selecting elements in React Testing Library, follow this accessibility-first priority order:

1. **`getByRole`** (e.g. `getByRole('button', { name: /submit/i })`) - Mirrors how screen readers access the DOM.
2. **`getByLabelText`** - Best for form inputs with linked `<label>` tags.
3. **`getByPlaceholderText`** - Fallback if no label exists.
4. **`getByText`** - Best for non-interactive text elements (paragraphs, headings).
5. **`getByTestId`** - Last resort when no accessible role or label is feasible.

---

## Practice Quiz

### Q1: What is the primary benefit of testing user journeys with React Testing Library over testing component state directly?
- A) Tests execute in C++
- B) Tests reflect actual user interactions and remain resilient when internal implementation details or refactorings change
- C) Tests do not require a testing framework
- D) It automatically deploys code to production
**Answer:** B
**Explanation:** React Testing Library prioritizes testing accessible DOM interactions rather than private component state, ensuring tests don't break during refactors if behavior remains identical.

### Q2: Why is MemoryRouter preferred over BrowserRouter in integration test harnesses?
- A) MemoryRouter does not require a real browser URL bar and allows programmatic initialization with any URL path (initialEntries)
- B) BrowserRouter is banned in Vitest
- C) MemoryRouter is faster by 1,000,000x
- D) MemoryRouter converts routes into CSS
**Answer:** A
**Explanation:** MemoryRouter manages history in an in-memory array, allowing tests to inject specific initial routes and simulate navigation without relying on a browser window's address bar.

### Q3: Why should @testing-library/user-event be preferred over fireEvent for simulating clicks and keystrokes?
- A) fireEvent has been deleted from npm
- B) user-event simulates full browser interaction lifecycles (focus, keydown, keypress, input, change, keyup) rather than dispatching synthetic raw events
- C) user-event only works on Windows
- D) fireEvent requires Node.js v12
**Answer:** B
**Explanation:** user-event models realistic browser event sequences (focusing elements, key down/up events, hover transitions), surfacing bugs that synthetic fireEvent dispatches miss.

### Q4: When should you use screen.findByRole instead of screen.getByRole?
- A) When querying elements that are already present synchronously in the DOM
- B) When waiting for an element that appears asynchronously after a Promise, timer, or network response resolves
- C) Only when querying tables
- D) When querying hidden inputs
**Answer:** B
**Explanation:** findBy* queries return a Promise that retries until the element appears in the DOM (up to a timeout), making them essential for testing asynchronous state updates.

### Q5: What is the lowest priority query in React Testing Library's accessibility hierarchy?
- A) getByRole
- B) getByLabelText
- C) getByTestId
- D) getByText
**Answer:** C
**Explanation:** getByTestId relies on artificial data-testid attributes invisible to users and screen readers, making it a fallback reserved for elements lacking accessible roles or text.
