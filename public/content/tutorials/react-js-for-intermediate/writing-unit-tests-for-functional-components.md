# Writing Unit Tests for Functional Components

## 1. Anatomy of a Component Unit Test
A standard unit test in React follows the **AAA Pattern**:
1. **Arrange:** Render the component using `render(<MyComponent />)` and prepare props or mocks.
2. **Act:** Simulate user interactions (typing, clicking, toggling) using `@testing-library/user-event`.
3. **Assert:** Verify that the expected DOM elements, text, or callbacks responded correctly.

```
[Arrange: render(<Counter />)] ──► [Act: user.click(button)] ──► [Assert: expect(text).toHaveTextContent('1')]
```

## 2. Complete Example: Testing a Course Card Component
Let's write a comprehensive test suite for an interactive course card:

```jsx
// src/components/CourseCard.jsx
import React from 'react';

export default function CourseCard({ course, onEnroll }) {
  return (
    <div className="course-card">
      <h3 data-testid="course-title">{course.title}</h3>
      <p>{course.description}</p>
      <span className="price">${course.price}</span>
      
      <button
        type="button"
        disabled={course.isSoldOut}
        onClick={() => onEnroll(course.id)}
      >
        {course.isSoldOut ? 'Sold Out' : 'Enroll Now'}
      </button>
    </div>
  );
}
```

### The Vitest Test File:
```jsx
// src/components/__tests__/CourseCard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseCard from '../CourseCard';

describe('CourseCard Component', () => {
  const mockCourse = {
    id: 'c-101',
    title: 'React.js Mastery',
    description: 'Master modern frontend web engineering.',
    price: 99,
    isSoldOut: false
  };

  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} onEnroll={vi.fn()} />);

    // Assert title and price are in the document
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('React.js Mastery');
    expect(screen.getByText(/Master modern frontend/i)).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('invokes onEnroll callback with course ID when Enroll button is clicked', async () => {
    // vi.fn() creates a mock spy function in Vitest
    const handleEnroll = vi.fn();
    const user = userEvent.setup();

    render(<CourseCard course={mockCourse} onEnroll={handleEnroll} />);

    const enrollButton = screen.getByRole('button', { name: /enroll now/i });
    await user.click(enrollButton);

    // Verify spy function was called exactly once with 'c-101'
    expect(handleEnroll).toHaveBeenCalledTimes(1);
    expect(handleEnroll).toHaveBeenCalledWith('c-101');
  });

  it('disables the button when the course is sold out', () => {
    const soldOutCourse = { ...mockCourse, isSoldOut: true };
    render(<CourseCard course={soldOutCourse} onEnroll={vi.fn()} />);

    const button = screen.getByRole('button', { name: /sold out/i });
    expect(button).toBeDisabled();
  });
});
```

## 3. Why `userEvent` Over `fireEvent`
Notice line 27: `const user = userEvent.setup(); await user.click(button);`.

- **`fireEvent.click()`:** Dispatches a synthetic DOM event instantly without simulating hover, focus, or active state sequences.
- **`userEvent.click()`:** Faithfully simulates what a real human does: moves cursor, fires mouseover, hovers, focuses the element, clicks, and fires blur upon leaving.

**Always prefer `@testing-library/user-event` for interaction testing!**

---

## Practice Quiz

### Q1: What is the recommended tool for simulating user clicks and keystrokes in React Testing Library?
- A) `fireEvent`
- B) `@testing-library/user-event`
- C) `document.click()`
- D) `selenium-driver`
**Answer:** B
**Explanation:** `userEvent` simulates realistic user interaction sequences (including hover, focus, blur, and keyboard events) far more faithfully than basic `fireEvent`.

### Q2: What Vitest function creates a mock spy function to verify if a callback prop was invoked?
- A) `vi.fn()`
- B) `vi.spy()`
- C) `vi.mockFunction()`
- D) `vi.callback()`
**Answer:** A
**Explanation:** `vi.fn()` creates an inspectable mock function in Vitest, allowing assertions like `expect(mockFn).toHaveBeenCalledWith(...)`.

### Q3: What matcher from `@testing-library/jest-dom` asserts that a button has its HTML `disabled` attribute active?
- A) `expect(button).toBeLocked()`
- B) `expect(button).toBeDisabled()`
- C) `expect(button).toHaveStatus('off')`
- D) `expect(button).not.toBeClickable()`
**Answer:** B
**Explanation:** `toBeDisabled()` is a specialized jest-dom matcher verifying that the target interactive control has the `disabled` property.

### Q4: Why must calls to `userEvent` methods (like `await user.click(...)` or `await user.type(...)`) be awaited?
- A) To satisfy browser security rules
- B) `userEvent` operations are asynchronous and simulate realistic delays and event dispatches that return Promises
- C) To make tests run 10x slower
- D) Because Vitest only runs asynchronously
**Answer:** B
**Explanation:** `userEvent` methods return Promises that simulate genuine user interaction timing, requiring `await` to ensure actions complete before running assertions.

### Q5: In the AAA testing pattern, what does the "Act" phase represent?
- A) Setting up mock data
- B) Performing user interactions or triggering state changes (e.g. clicking a button or typing text)
- C) Writing assertions
- D) Closing the terminal
**Answer:** B
**Explanation:** The "Act" step executes the specific behavior under test (such as clicking a button or submitting a form) before the "Assert" step validates the result.
