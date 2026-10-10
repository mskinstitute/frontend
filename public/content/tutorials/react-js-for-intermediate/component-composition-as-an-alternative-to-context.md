# Component Composition as an Alternative to Context

## 1. When Context Is an Overkill
When developers first learn about the prop-drilling problem, their immediate impulse is often to reach for the Context API for everything. However, wrapping components in multiple Context Providers introduces architectural overhead, complicates component testing, and risks unnecessary render cascades.

Before reaching for Context, the React core team recommends an alternative, simpler architectural solution: **Component Composition**.

By taking advantage of `children` and passing fully-formed JSX elements down through props, you can often **eliminate prop drilling entirely without creating a single Context!**

```
Prop Drilling Approach:
<Page user={user} onLogout={handleLogout}>
  └─ <Dashboard user={user} onLogout={handleLogout}>
       └─ <Sidebar user={user} onLogout={handleLogout}>
            └─ <UserBadge user={user} onLogout={handleLogout} />

Composition Alternative:
<Page>
  <Dashboard>
    <Sidebar>
      <UserBadge user={user} onLogout={handleLogout} />
```

## 2. Inversion of Control with `children`
In the composition pattern, the top-level parent creates the `<UserBadge>` component directly and passes it as a child. 

The intermediate components (`<Page>`, `<Dashboard>`, `<Sidebar>`) do not need to know what a "user" is; they simply render `children` inside their layout shells:

```jsx
// Layout components are pure containers!
function Page({ children }) {
  return <div className="page-shell">{children}</div>;
}

function Dashboard({ children }) {
  return <div className="dashboard-grid">{children}</div>;
}

function Sidebar({ children }) {
  return <aside className="sidebar-pane">{children}</aside>;
}

// Root container connects data directly to the consumer!
export default function App() {
  const [user, setUser] = useState({ name: 'Rohit', role: 'Architect' });

  return (
    <Page>
      <Dashboard>
        <Sidebar>
          {/* UserBadge is instantiated directly where 'user' state lives! */}
          <UserBadge user={user} onLogout={() => setUser(null)} />
        </Sidebar>
        <MainContent />
      </Dashboard>
    </Page>
  );
}
```

## 3. Comparing Context vs Composition

| Feature | Component Composition | React Context API |
| :--- | :--- | :--- |
| **Complexity** | Lowest (Standard props & children) | Medium (Providers, Hooks, modules) |
| **Component Coupling** | Zero coupling; containers remain pure | Consumers are coupled to Context object |
| **Best For** | 2–4 levels of nesting, layout shells | Truly global ambient data (Auth, Theme) |
| **Testing** | Trivial (no mocking providers required) | Requires wrapping tests in `<Provider>` |

---

## Practice Quiz

### Q1: What is the primary recommendation of the React core team before creating a new Context to solve prop drilling?
- A) Convert the application to Angular
- B) Consider Component Composition (passing components via `children` or named props)
- C) Store everything in global window variables
- D) Re-render the page using jQuery
**Answer:** B
**Explanation:** React documentation explicitly advises evaluating Component Composition first, as it frequently eliminates intermediate prop drilling without adding context overhead.

### Q2: How does component composition decouple intermediate layout components?
- A) It deletes the intermediate components from the file system
- B) Intermediate components act as generic layout shells rendering `{children}` and remain completely unaware of the specific data or components nested inside them
- C) It converts props to cookies
- D) It prevents them from using CSS
**Answer:** B
**Explanation:** By rendering `{children}`, intermediate containers don't need props for their grandchildren, keeping them clean, generic, and reusable.

### Q3: When is React Context truly preferable over component composition?
- A) When passing a prop down 1 level
- B) When data is genuinely ambient and needed across dozens of disparate, non-hierarchical components (like themes, auth, or language)
- C) When rendering images
- D) Only on mobile devices
**Answer:** B
**Explanation:** Context excels when data must be accessed across broad, independent sections of the application tree where composition would be awkward.

### Q4: In `<Dashboard><Sidebar><UserMenu user={user} /></Sidebar></Dashboard>`, where does `user` get passed into `<UserMenu>`?
- A) Through `Sidebar`'s props
- B) Directly at the top-level declaration where `user` state resides
- C) Through an SQL query
- D) Through the browser address bar
**Answer:** B
**Explanation:** In composition, the child is declared and given its props at the top level where the state is in scope, bypassing intermediate components completely.

### Q5: What makes components that rely on composition easier to test than components coupled to Context?
- A) They are written in C++
- B) They are pure presentation shells that can be tested directly without needing to wrap test suites in mock Context Providers
- C) They run 10x faster
- D) They do not require assertions
**Answer:** B
**Explanation:** Pure presentation components that receive props or children can be rendered in tests directly without creating and configuring provider mock wrappers.
