# End-to-End Testing with Playwright in React

While unit and integration tests run inside an artificial Node.js DOM simulator (`jsdom`), **End-to-End (E2E) testing** runs your compiled React application inside real headless or headed browser engines (Chromium, Firefox, WebKit). **Microsoft Playwright** is the industry standard for E2E testing, offering automatic waiting, cross-browser execution, mobile emulation, and network mocking.

---

## 1. Playwright Architecture and Advantages

- **Real Browser Engines:** Tests execute against real Chromium, WebKit (Safari), and Firefox engines.
- **Auto-Waiting:** Playwright automatically waits for elements to become visible, enabled, and stable before clicking, eliminating flaky `sleep()` or `setTimeout()` statements.
- **Trace Viewer & Video Recording:** Records video, screenshots, and DOM snapshots on failure for effortless debugging.
- **Isolated Browser Contexts:** Each test runs in a sandboxed browser context, equivalent to a clean incognito window.

---

## 2. Playwright Configuration (`playwright.config.ts`)

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // Automatically start dev server before running test suite
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  ],
});
```

---

## 3. Writing an E2E Authentication & Dashboard Test

```ts
// e2e/auth-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Enterprise Authentication Flow", () => {
  test("authenticates user and loads analytics dashboard", async ({ page }) => {
    // 1. Navigate to login view
    await page.goto("/login");

    // Assert page title
    await expect(page).toHaveTitle(/Enterprise Portal/i);

    // 2. Locate form elements using locator accessibility methods
    const emailInput = page.getByLabel("Corporate Email");
    const passwordInput = page.getByLabel("Password");
    const submitBtn = page.getByRole("button", { name: /sign in/i });

    // 3. Fill and submit credentials
    await emailInput.fill("lead.architect@enterprise.com");
    await passwordInput.fill("SecureSecret123!");
    await submitBtn.click();

    // 4. Assert URL redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // 5. Assert user greeting and stats card rendered
    const greeting = page.getByRole("heading", { name: /welcome back/i });
    await expect(greeting).toBeVisible();

    const revenueCard = page.getByTestId("kpi-revenue");
    await expect(revenueCard).toContainText("$1,240,500");
  });

  test("displays validation error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Corporate Email").fill("invalid@user.com");
    await page.getByLabel("Password").fill("WrongPassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Assert error alert pops up
    const errorAlert = page.getByRole("alert");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(/invalid email or password/i);
  });
});
```

---

## 4. Mocking API Routes in Playwright

Playwright allows mocking network requests at the browser socket level without modifying React source code:

```ts
test("displays offline maintenance banner when API returns 503", async ({ page }) => {
  // Intercept route before navigating
  await page.route("**/api/v1/health", (route) => {
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ status: "Service Under Maintenance" }),
    });
  });

  await page.goto("/dashboard");
  await expect(page.getByText(/scheduled maintenance in progress/i)).toBeVisible();
});
```

---

## Practice Quiz

### Q1: What is the primary difference between running tests in JSDOM (React Testing Library) vs Playwright?
- A) Playwright only supports Windows 95
- B) JSDOM is an in-memory Node.js JavaScript approximation of a browser, whereas Playwright drives real browser engines (Chromium, Firefox, WebKit)
- C) JSDOM is an end-to-end framework
- D) Playwright cannot test React applications
**Answer:** B
**Explanation:** JSDOM is a Node.js simulation lacking real CSS layout engines, visual rendering, and engine-specific quirks. Playwright executes tests against genuine browser binaries.

### Q2: How does Playwright eliminate flaky test timeouts?
- A) By adding arbitrary 5-second sleeps before every action
- B) Playwright built-in auto-waiting automatically waits for target elements to be visible, stable, receive events, and not covered before performing actions
- C) By ignoring failed tests
- D) By disabling JavaScript in the test browser
**Answer:** B
**Explanation:** Playwright performs actionability checks (visibility, stability, enablement, hit-testing) before executing actions, removing the need for manual sleep timeouts.

### Q3: What is the purpose of the webServer configuration block in playwright.config.ts?
- A) To purchase cloud hosting automatically
- B) To automatically launch your local development server (e.g. npm run dev) before running the tests and shut it down afterward
- C) To install Apache HTTP Server
- D) To convert JSX to HTML
**Answer:** B
**Explanation:** The webServer property ensures your React app is running locally at the specified port before starting the E2E suite, streamlining CI/CD execution.

### Q4: How does page.route() work in Playwright?
- A) It configures React Router paths
- B) It intercepts outgoing browser network requests at the socket level, allowing tests to mock responses, abort requests, or inject headers
- C) It translates URLs into IP addresses
- D) It navigates between pages
**Answer:** B
**Explanation:** page.route() allows developers to intercept network traffic initiated by the browser, enabling deterministic testing of edge cases like 500 errors or slow networks.

### Q5: What artifact does Playwright generate on failure that provides step-by-step interactive debugging with DOM inspection?
- A) A text log file
- B) The Playwright Trace Viewer zip file containing video, network requests, console logs, and DOM snapshots for each action
- C) A Windows executable
- D) A git commit
**Answer:** B
**Explanation:** The Playwright Trace Viewer records the exact state of the browser, network traffic, console output, and DOM snapshots at every step, allowing interactive visual debugging.
