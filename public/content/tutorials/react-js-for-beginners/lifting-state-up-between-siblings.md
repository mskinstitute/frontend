# Lifting State Up Between Siblings

## 1. The Sibling Communication Problem
In React's unidirectional data flow, data flows strictly top-down from parent to child. Sibling components cannot directly communicate with one another or pass state horizontally.

Consider a common scenario:
- Component A: An `AccordionHeader` or a `SearchInput`
- Component B: An `AccordionContent` or a `SearchResultsList`

```
         Parent Container
        ┌───────┴───────┐
        ▼               ▼
Component A       Component B
(Cannot send data directly across to sibling!)
```
If Component A holds state in its own local `useState`, Component B has no way of reading that state or reacting to its changes.

## 2. The Solution: Lifting State Up
To share state between two or more sibling components:
1. **Identify the closest common parent** component in the tree.
2. **Move the state up** into that common parent.
3. **Pass the state down** to the consuming child as a read-only prop.
4. **Pass an event handler callback down** to the modifying child so it can request state changes in the parent.

```
                  Common Parent
        [holds state + updater function]
               │                │
(passes state) │                │ (passes state & callback)
               ▼                ▼
          Component A      Component B
```

## 3. Step-by-Step Code Walkthrough

### Step 1: Create the Child Components
Child 1 (`SearchInput`) receives the current search term and a callback:
```jsx
export function SearchInput({ query, onQueryChange }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Filter courses..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </div>
  );
}
```

Child 2 (`SearchResults`) receives the filtered list:
```jsx
export function SearchResults({ results }) {
  if (results.length === 0) {
    return <p className="empty-msg">No matching courses found.</p>;
  }

  return (
    <ul className="results-list">
      {results.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}
```

### Step 2: Lift State to the Common Parent
The parent component (`CourseDirectory`) owns the `query` state and coordinates data flow:
```jsx
import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

const ALL_COURSES = [
  { id: 1, title: 'React.js for Beginners' },
  { id: 2, title: 'JavaScript Mastery' },
  { id: 3, title: 'Django Backend Architecture' }
];

export default function CourseDirectory() {
  // State lifted to common parent
  const [query, setQuery] = useState('');

  // Derived state: calculate filtered results during render
  const filteredCourses = ALL_COURSES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="directory-container">
      <h2>MSK Course Search</h2>
      
      {/* Passes state and updater callback to Child 1 */}
      <SearchInput query={query} onQueryChange={setQuery} />
      
      {/* Passes derived data to Child 2 */}
      <SearchResults results={filteredCourses} />
    </div>
  );
}
```

## 4. Single Source of Truth
Lifting state up establishes a **single source of truth**. Instead of trying to keep local copies of data synchronized across multiple sibling components, one component acts as the authority. This architectural discipline prevents out-of-sync UI states and simplifies debugging.

---

## Practice Quiz

### Q1: Why can't two sibling components in React share state directly with each other?
- A) Modern JavaScript prevents functions from running simultaneously
- B) React enforces a strict unidirectional, top-down data flow where components can only pass props to direct children
- C) Sibling components are always executed on different CPU threads
- D) React automatically converts sibling components into static HTML
**Answer:** B
**Explanation:** React adheres to a unidirectional data flow. Props only pass downwards from parents to children; siblings cannot directly transmit data or events horizontally across the tree.

### Q2: What is the recommended technique when two sibling components need access to the same state?
- A) Duplicate the state in both components and sync them with `setInterval`
- B) Lift the state up to their closest common parent component
- C) Store the state in a global `window.__SHARED_DATA__` variable
- D) Merge both sibling components into a single massive 2,000-line file
**Answer:** B
**Explanation:** "Lifting state up" involves relocating the state to the nearest common ancestor, which then passes data down to both siblings via props.

### Q3: How does a child component trigger a state update in its parent component?
- A) By directly mutating `this.parent.state`
- B) By calling an event handler callback function passed to it as a prop by the parent
- C) By emitting an HTTP POST request to the local server
- D) By reloading the browser window
**Answer:** B
**Explanation:** In React's top-down flow, parents pass callback functions (e.g. `onSelect`, `onChange`) down to children. When user events occur, the child invokes the callback to notify the parent.

### Q4: What is the concept of a "Single Source of Truth" in React state architecture?
- A) Storing all application code in a single file
- B) Having one authoritative location responsible for holding and modifying any specific piece of state
- C) Only querying one database table in the backend
- D) Using only one `useState` call per entire application
**Answer:** B
**Explanation:** A Single Source of Truth means that for any piece of state, exactly one component owns it and dictates its value, eliminating sync bugs across components.

### Q5: What is "derived state" in the context of lifting state up?
- A) State imported from an external npm package
- B) Values computed on the fly during render from existing state or props without needing separate state variables
- C) State that has been encrypted for security
- D) State that only exists in production builds
**Answer:** B
**Explanation:** Derived state refers to values calculated synchronously during render (such as filtering an array based on a search term) instead of storing redundant duplicate state in `useState`.
