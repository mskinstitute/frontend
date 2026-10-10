# Programmatic Navigation and useSearchParams

## 1. What is Programmatic Navigation?
Declarative navigation using `<Link>` and `<NavLink>` works when a user clicks a visible hyperlink. However, real-world applications frequently require navigation in response to **code execution**:
- Redirecting a user to their dashboard immediately after a successful login.
- Navigating to an order confirmation screen after completing a checkout payment.
- Redirecting an unauthorized user back to the sign-in page.

In React Router v6+, programmatic navigation is executed using the **`useNavigate`** hook.

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = await authenticateUser();

    if (token) {
      // Programmatically navigate to dashboard route
      navigate('/dashboard');

      // Or replace history entry (user cannot click browser "Back" into login screen)
      // navigate('/dashboard', { replace: true });
    }
  };

  return <form onSubmit={handleLogin}><button type="submit">Log In</button></form>;
}
```

### Delta Navigation (Back & Forward)
`useNavigate` also allows navigating through browser history:
```jsx
navigate(-1); // Equivalent to clicking browser "Back" button
navigate(1);  // Equivalent to clicking browser "Forward" button
```

## 2. Managing Query Strings with `useSearchParams`
URL Query Strings (search parameters) are the key-value pairs appended after a `?` in the URL:
```
/courses?category=frontend&sort=rating&page=2
```
Query strings are ideal for shareable UI states: filters, search terms, pagination, and sorting.

React Router provides **`useSearchParams`**, which functions similarly to React's `useState`, returning:
1. `searchParams`: A modern `URLSearchParams` object to read current query parameters.
2. `setSearchParams`: An updater function to modify URL parameters programmatically.

```jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchableCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read query parameters (defaults provided if missing)
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popular';

  // 2. Update query parameters in URL
  const handleCategoryChange = (newCategory) => {
    setSearchParams({
      category: newCategory,
      sort: sort // Preserve other query parameters
    });
  };

  return (
    <div className="catalog-filters">
      <h3>Active Category: {category}</h3>

      <div className="btn-group">
        <button onClick={() => handleCategoryChange('frontend')}>Frontend</button>
        <button onClick={() => handleCategoryChange('backend')}>Backend</button>
        <button onClick={() => handleCategoryChange('data')}>Data Science</button>
      </div>
    </div>
  );
}
```

## 3. Why Query Params Beat Component State for Search
If an e-commerce catalog stores filters in local `useState`, when a student finds a great set of courses and copies the URL to send to a friend, **the filters are lost** because the URL only says `/courses`.

When filters are stored in `searchParams`:
- The URL becomes `/courses?category=frontend&sort=rating`.
- Users can bookmark the page, refresh the browser, or share the link with colleagues, and the exact same filtered state will load immediately!

---

## Practice Quiz

### Q1: What hook in React Router v6 is used for programmatic navigation?
- A) `useHistory`
- B) `useNavigate`
- C) `useRedirect`
- D) `useRouting`
**Answer:** B
**Explanation:** React Router v6 introduced `useNavigate()`, which returns a navigate function to execute imperative transitions (replacing the legacy `useHistory`).

### Q2: How do you simulate clicking the browser's native "Back" button using `useNavigate`?
- A) `navigate('back')`
- B) `navigate(-1)`
- C) `navigate.previous()`
- D) `history.pop()`
**Answer:** B
**Explanation:** Passing a negative integer like `-1` to `navigate(-1)` navigates backward by one entry in the browser's session history stack.

### Q3: What option should be passed to `navigate('/dashboard', { replace: true })` and why?
- A) It deletes the user's cookies
- B) It replaces the current history entry instead of pushing a new one, preventing the user from navigating back to the previous screen (ideal after logins)
- C) It reloads the browser tab
- D) It opens the link in a new private window
**Answer:** B
**Explanation:** `{ replace: true }` replaces the active entry in the history stack, preventing users from clicking "Back" into sensitive or transient views like login or payment pages.

### Q4: What hook is used to read and update URL query strings (e.g. `?category=react&page=1`) in React Router?
- A) `useQueryString`
- B) `useSearchParams`
- C) `useURL`
- D) `useParams`
**Answer:** B
**Explanation:** `useSearchParams` provides an interface to read and write URL query strings, mirroring the familiar `[state, setState]` pattern.

### Q5: Why is storing search and filter criteria in URL search parameters preferable to storing them in local component `useState`?
- A) URL parameters load faster than RAM
- B) Storing criteria in the URL makes the filtered view bookmarkable and shareable between users
- C) URL parameters cannot be modified by hackers
- D) `useState` is forbidden in catalog components
**Answer:** B
**Explanation:** Serializing filter, sort, and pagination state into URL query parameters ensures deep-linking capability: users can bookmark, refresh, or share the exact view with others.
