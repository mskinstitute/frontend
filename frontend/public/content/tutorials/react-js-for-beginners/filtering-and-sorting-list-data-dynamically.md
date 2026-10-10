# Filtering and Sorting List Data Dynamically

## 1. Declarative Data Transformations
In traditional jQuery or imperative JavaScript, filtering or sorting a list required manually querying DOM nodes, reading text content, sorting element arrays, and re-appending them to the parent container.

In React, **UI is a projection of state**. To filter or sort a list:
1. Maintain your raw data in state (or receive it as props).
2. Maintain your user filter/sort criteria in state (e.g., search term, sort order, category).
3. Compute the filtered and sorted list on the fly during render using standard JavaScript methods (`filter()` and `sort()`).
4. Map the resulting array directly to JSX.

```
[Raw Data] ──> [.filter()] ──> [.sort()] ──> [.map()] ──> [Virtual DOM]
```

## 2. Deriving Filtered and Sorted Lists (No Duplicate State!)
A classic beginner mistake is storing both the raw data and the filtered data in two separate state variables:
```jsx
// ❌ Redundant Duplicate State: Causes sync bugs!
const [allCourses, setAllCourses] = useState([...]);
const [filteredCourses, setFilteredCourses] = useState([...]);
```
If you modify `allCourses`, `filteredCourses` becomes stale unless manually synchronized.

**Best Practice:** Store only the filter criteria in state, and **derive** the filtered data synchronously during render:

```jsx
import React, { useState } from 'react';

const COURSE_DATA = [
  { id: '1', title: 'React Fundamentals', category: 'Frontend', rating: 4.8 },
  { id: '2', title: 'Advanced Django Architecture', category: 'Backend', rating: 4.9 },
  { id: '3', title: 'Python for Data Analysis', category: 'Data', rating: 4.7 },
  { id: '4', title: 'Tailwind CSS Mastery', category: 'Frontend', rating: 4.6 }
];

export default function CourseExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'title'

  // Step 1: Filter raw data based on search term and category
  const filtered = COURSE_DATA.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Step 2: Sort the filtered data (Notice: [...filtered] avoids mutating the array!)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating; // Descending rating
    }
    return a.title.localeCompare(b.title); // Alphabetical title
  });

  return (
    <div className="explorer-container">
      {/* Controls Bar */}
      <div className="controls-row">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Data">Data</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rating">Highest Rated</option>
          <option value="title">Alphabetical</option>
        </select>
      </div>

      {/* Render Results */}
      <ul className="course-list">
        {sorted.length === 0 ? (
          <li className="empty-msg">No matching courses found.</li>
        ) : (
          sorted.map((course) => (
            <li key={course.id} className="course-item">
              <strong>{course.title}</strong>
              <span className="badge">{course.category}</span>
              <span className="rating">★ {course.rating}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
```

## 3. The `[...array].sort()` Immutability Trap
Notice line 29: `[...filtered].sort(...)`.

In JavaScript, **`Array.prototype.sort()` mutates the original array in place!** If you write `filtered.sort()`, you directly mutate the array. By copying the array first using the spread operator `[...filtered]`, you ensure your sorting operations remain completely non-mutating and pure.

---

## Practice Quiz

### Q1: Why should you avoid storing both `rawList` and `filteredList` in separate `useState` hooks?
- A) React only allows one `useState` hook per component
- B) Storing derived data in state introduces redundant state that easily gets out of sync when raw data updates
- C) The browser will block duplicate state variables
- D) `useState` can only store strings, not arrays
**Answer:** B
**Explanation:** Calculating derived data on the fly during render eliminates state synchronization bugs. If the underlying data or filter criteria change, the computed list updates automatically.

### Q2: Why is `[...filtered].sort()` used instead of calling `filtered.sort()` directly?
- A) The spread operator converts the array into an object
- B) In JavaScript, `sort()` mutates the original array in place; copying it first maintains immutability
- C) React throws an error if `sort()` is called on an array
- D) `[...filtered]` speeds up the sort by 50%
**Answer:** B
**Explanation:** `Array.prototype.sort()` modifies the array directly in memory. Creating a shallow copy with `[...filtered]` protects original data from unintended mutations.

### Q3: How do you handle an empty result set when filtering a list in React JSX?
- A) By throwing an unhandled exception
- B) By conditionally checking if `sorted.length === 0` and rendering an empty state message (e.g. `<p>No matches</p>`)
- C) React automatically displays a default alert popup
- D) By disabling all buttons on the page
**Answer:** B
**Explanation:** Checking `array.length === 0` using ternary or conditional operators allows you to render a user-friendly empty state whenever filters match zero results.

### Q4: Which JavaScript method is best suited for comparing two strings alphabetically in a sort function?
- A) `a.localeCompare(b)`
- B) `a == b`
- C) `a.indexOf(b)`
- D) `a.includes(b)`
**Answer:** A
**Explanation:** `stringA.localeCompare(stringB)` provides accurate, localized alphabetical comparison for sorting strings in JavaScript.

### Q5: If a list filter is purely based on user search input, where should the search input value reside?
- A) In an external global variable
- B) In a local React state variable managed via `useState` and updated via `onChange`
- C) In a cookie
- D) In the HTML `<head>` tag
**Answer:** B
**Explanation:** Storing the search query in a React `useState` variable ensures that every change triggers a re-render, recalculating the derived filtered list instantly.
