# Modern React Testing Stack (Vitest & Testing Library)

## 1. The Modern React Testing Ecosystem
Testing ensures that refactoring, upgrading dependencies, and adding features do not break existing functionality.

In the past, Create React App paired with Jest was standard. In modern Vite-powered engineering:
- **Vitest:** A blazing-fast, Vite-native unit test runner. It uses the exact same plugins and configuration as Vite, running tests 5 to 10 times faster than Jest with full TypeScript and ESM support.
- **React Testing Library (RTL):** A testing utility based on a simple, profound philosophy:
  > **"The more your tests resemble the way your software is used, the more confidence they can give you."**

```
Old Testing Approach (Enzyme):
Test internal implementation details: `expect(wrapper.state('count')).toBe(1)` (Fragile!)

Modern RTL Approach:
Test from the user's perspective: `screen.getByRole('button', { name: /increment/i })` (Resilient!)
```

## 2. Setting Up Vitest and Testing Library
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

### `vite.config.js` Test Configuration:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
```

### `src/test/setup.js`:
```javascript
import '@testing-library/jest-dom'; // Adds custom DOM matchers like toBeInTheDocument()
```

## 3. The RTL Query Priority
React Testing Library intentionally guides you away from querying by CSS classes or internal implementation IDs. Instead, it encourages queries that mimic how real users (and assistive technologies) find elements:

| Priority | Query Method | Rationale |
| :--- | :--- | :--- |
| **1. Accessible to Everyone** | `getByRole('button', { name: /save/i })` | Queries semantic ARIA roles and labels |
| **2. Semantic Form Queries** | `getByLabelText('Email')` | Simulates user locating input by its label |
| **3. Placeholder / Text** | `getByPlaceholderText('Search...')` | Queries visible placeholder or screen text |
| **4. Display Text** | `getByText('Welcome back')` | Finds non-interactive text content |
| **5. Test ID (Last Resort)** | `getByTestId('custom-canvas')` | Reserved for non-semantic canvas or svg elements |

## 4. Difference Between `getBy`, `queryBy`, and `findBy`

| Prefix | Behavior When NOT Found | Primary Use Case |
| :--- | :--- | :--- |
| **`getBy...`** | **Throws an immediate error** | Expecting element to exist synchronously |
| **`queryBy...`** | Returns `null` (does NOT throw) | Asserting element does **NOT** exist (`expect(queryByText(...)).not.toBeInTheDocument()`) |
| **`findBy...`** | Returns a **Promise** (waits up to 1s) | Waiting for **asynchronous** data or animations |

---

## Practice Quiz

### Q1: What is the core philosophy of React Testing Library?
- A) Test internal component state and private class variables directly
- B) Test components from the user's perspective by interacting with visible DOM text and accessible roles
- C) Maximize code coverage by testing every line of CSS
- D) Mock all JavaScript functions
**Answer:** B
**Explanation:** RTL emphasizes user-centric testing: querying elements via accessible roles, labels, and text rather than fragile internal implementation details.

### Q2: Why is Vitest preferred over Jest in modern Vite projects?
- A) Vitest is an official Google product
- B) Vitest integrates natively with Vite's build pipeline, sharing plugins and configurations while executing significantly faster with native ESM support
- C) Vitest only runs on Windows
- D) Vitest eliminates the need for assertions
**Answer:** B
**Explanation:** Vitest leverages Vite's dev server architecture and transform pipeline, eliminating redundant configuration and running tests with superior speed.

### Q3: Which query should you use to assert that an element is NOT present in the DOM?
- A) `getByText('...')`
- B) `queryByText('...')` (e.g. `expect(screen.queryByText('...')).not.toBeInTheDocument()`)
- C) `findByText('...')`
- D) `document.getElementById()`
**Answer:** B
**Explanation:** `getBy...` throws an error if an element is missing. To assert absence, use `queryBy...` which safely returns `null`.

### Q4: Which query method must be used when an element will appear asynchronously after an API call?
- A) `getByRole`
- B) `findByRole` (using `await screen.findByRole(...)`)
- C) `selectByRole`
- D) `queryByRole`
**Answer:** B
**Explanation:** `findBy...` returns a Promise that retries until the element appears in the DOM (or times out), making it the proper tool for async UI updates.

### Q5: What is the recommended query method for locating a submit button according to RTL priority guidelines?
- A) `getByClassName('btn-submit')`
- B) `screen.getByRole('button', { name: /submit/i })`
- C) `getByTestId('submit-btn')`
- D) `document.querySelector('button')`
**Answer:** B
**Explanation:** `getByRole` with an accessible name represents how assistive technologies and users locate interactive controls, making tests robust against styling refactors.
