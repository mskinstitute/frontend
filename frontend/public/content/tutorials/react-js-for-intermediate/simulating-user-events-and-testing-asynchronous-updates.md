# Simulating User Events and Testing Asynchronous Updates

## 1. The Challenge of Asynchronous UI in Tests
Real applications don't update instantly. When testing components that:
- Fetch data from REST APIs
- Use debounced inputs (`useDebounce`)
- Render delayed notifications via `setTimeout`

A synchronous test checking `screen.getByText(...)` immediately after an action will fail because the data hasn't arrived in the DOM yet!

```
Test Execution Timeline:
0ms:  Render <StudentDirectory /> (Starts fetch('/api/students'))
1ms:  Test executes screen.getByText('Ananya') ──► THROWS ERROR: Element not found!
50ms: fetch() resolves and component updates (Too late! Test already failed!)
```

## 2. Using `findBy` for Asynchronous DOM Elements
To test components with asynchronous data, swap `getBy...` for **`findBy...`**. 

`findBy` returns a Promise that polls the DOM repeatedly (using `waitFor` under the hood) until the element appears or a timeout occurs:

```jsx
// src/components/__tests__/AsyncDirectory.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StudentDirectory from '../StudentDirectory';

describe('StudentDirectory Asynchronous Testing', () => {
  beforeEach(() => {
    // Mock global window.fetch before each test
    global.fetch = vi.fn();
  });

  it('displays loading state, then renders fetched students', async () => {
    // Mock successful fetch resolution
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Ananya Roy', track: 'Full-Stack' },
        { id: 2, name: 'Kavita Sharma', track: 'Data Science' }
      ]
    });

    render(<StudentDirectory />);

    // 1. Assert synchronous loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 2. Await asynchronous appearance using findByRole
    const student1 = await screen.findByText('Ananya Roy');
    const student2 = await screen.findByText('Kavita Sharma');

    expect(student1).toBeInTheDocument();
    expect(student2).toBeInTheDocument();

    // 3. Verify loading indicator has disappeared
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('renders error alert when API network call fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<StudentDirectory />);

    // Await error message to appear in DOM
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent(/failed to load/i);
  });
});
```

## 3. Waiting for Assertions with `waitFor`
When you need to wait for a complex condition (e.g. verifying that a mock function was called after a debounce delay), use **`waitFor()`**:

```jsx
import { waitFor } from '@testing-library/react';

it('calls search API after debounce period', async () => {
  const user = userEvent.setup();
  render(<LiveSearchInput onSearch={mockSearch} />);

  const input = screen.getByPlaceholderText(/search/i);
  await user.type(input, 'React');

  // waitFor repeatedly evaluates callback until it passes or times out
  await waitFor(() => {
    expect(mockSearch).toHaveBeenCalledWith('React');
  }, { timeout: 1500 });
});
```

---

## Practice Quiz

### Q1: What is the primary difference between `getByText` and `findByText` in React Testing Library?
- A) `getByText` only finds buttons
- B) `getByText` checks the DOM synchronously and throws immediately if missing; `findByText` returns a Promise that polls until the element appears
- C) `findByText` only runs on the server
- D) `getByText` is deprecated
**Answer:** B
**Explanation:** `findBy...` queries are asynchronous and wait for elements to appear in the DOM, making them essential for testing API fetches and async effects.

### Q2: What utility is used to poll until an arbitrary expectation passes (such as checking if a mock was called)?
- A) `waitFor(() => { ... })`
- B) `sleep(1000)`
- C) `pauseTest()`
- D) `while(true)`
**Answer:** A
**Explanation:** `waitFor` repeatedly runs an assertion callback until it stops throwing errors or hits the timeout threshold.

### Q3: Why should you avoid using arbitrary sleep timers (e.g. `await new Promise(r => setTimeout(r, 1000))`) in unit tests?
- A) They slow down test suites unnecessarily and cause flaky tests if machines run slower than the arbitrary sleep duration
- B) Browsers prohibit timeouts in testing
- C) Vitest turns off setTimeout
- D) Timers delete mock functions
**Answer:** A
**Explanation:** Fixed sleeps create sluggish test suites and random failures on slower CI runners. Declarative utilities like `findBy` and `waitFor` resolve as soon as the DOM updates.

### Q4: How do you mock a successful API response using Vitest's `vi.fn()` on `global.fetch`?
- A) `fetch.mockResolvedValueOnce({ ok: true, json: async () => payload })`
- B) `fetch.return(payload)`
- C) `fetch.staticData(payload)`
- D) `fetch.fake(payload)`
**Answer:** A
**Explanation:** `mockResolvedValueOnce` configures the mock to resolve with a simulated Response object containing `ok: true` and an asynchronous `json()` parser.

### Q5: How do you assert that a loading spinner has been removed from the DOM once data loads?
- A) `expect(screen.getByText(/loading/i)).toBeNull()` (throws error before assertion)
- B) `expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()`
- C) `screen.delete(/loading/i)`
- D) `expect(/loading/i).toBe(false)`
**Answer:** B
**Explanation:** Using `queryBy...` returns `null` when the element is absent, allowing `.not.toBeInTheDocument()` to cleanly confirm its removal.
