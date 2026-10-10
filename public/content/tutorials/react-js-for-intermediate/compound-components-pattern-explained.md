# Compound Components Pattern Explained

## 1. What Are Compound Components?
In native HTML, certain elements work together as a synchronized family to provide an intuitive, declarative interface. The classic example is `<select>` and `<option>`:

```html
<select name="course">
  <option value="react">React Mastery</option>
  <option value="django">Django Architecture</option>
</select>
```
Notice how:
- The `<select>` manages the selected state and keyboard navigation.
- The `<option>` tags configure individual items.
- You don't have to pass an awkward configuration object like `<select options={[{label: 'React', value: 'react'}]} />`.
- You can freely rearrange the options, insert dividing `<hr />` elements, or add custom styling between options without breaking functionality.

In React, the **Compound Components Pattern** replicates this declarative, flexible relationship for custom UI primitives (such as Tabs, Accordions, Dropdown Menus, and Radio Groups).

## 2. Implementing Compound Components with React Context
To build compound components, a parent component creates a **React Context** to share state and updater functions with its child components implicitly.

Let's build a compound **Tabs** component:

```jsx
import React, { useState, createContext, useContext } from 'react';

// 1. Create Context for Tab State
const TabsContext = createContext(null);

// 2. Parent Compound Component
export function Tabs({ defaultActiveTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Child Component: Tab Button List
export function TabList({ children }) {
  return <div className="tab-buttons-row" role="tablist">{children}</div>;
}

// 4. Child Component: Individual Tab Trigger
export function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab-btn ${isActive ? 'tab-btn-active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

// 5. Child Component: Tab Content Panel
export function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;

  return (
    <div role="tabpanel" className="tab-content-panel">
      {children}
    </div>
  );
}

// 6. Optional: Attach children as static properties for clean namespace syntax
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

## 3. Beautiful, Declarative Consumer Experience
Consumers of compound components enjoy an elegant, self-describing API:

```jsx
export default function CourseCurriculum() {
  return (
    <Tabs defaultActiveTab="frontend">
      <Tabs.List>
        <Tabs.Tab id="frontend">Frontend Track</Tabs.Tab>
        <Tabs.Tab id="backend">Backend Track</Tabs.Tab>
        <Tabs.Tab id="data">Data Science</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="frontend">
        <h3>HTML5, Tailwind CSS, Modern React & Vite</h3>
        <p>Comprehensive client-side engineering mastery.</p>
      </Tabs.Panel>

      <Tabs.Panel id="backend">
        <h3>Python, Django REST Framework, PostgreSQL</h3>
        <p>Scalable backend architectures and microservices.</p>
      </Tabs.Panel>

      <Tabs.Panel id="data">
        <h3>Pandas, NumPy, Power BI, Statistics</h3>
        <p>End-to-end data pipelines and business intelligence.</p>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## 4. Key Architectural Benefits
- **Implicit State Sharing:** The consumer never has to manually wire `activeTab` or `onClick` to each individual button; the context handles it automatically.
- **Extreme Layout Flexibility:** The consumer can reorder tabs, nest tabs inside custom grid wrappers, or insert header graphics between elements without breaking state sync.
- **Inversion of Control:** The consumer dictates the visual hierarchy and layout, while the compound components manage interaction logic and accessibility.

---

## Practice Quiz

### Q1: What is the primary inspiration behind the Compound Components pattern in React?
- A) Machine learning classification trees
- B) Cohesive HTML elements like `<select>` and `<option>` that work together to share state implicitly
- C) CSS Grid masonry layouts
- D) Docker multi-stage container builds
**Answer:** B
**Explanation:** Just as `<select>` and `<option>` cooperate seamlessly without exposing raw state variables, compound components encapsulate internal state while exposing a flexible declarative JSX structure.

### Q2: What React feature is typically used under the hood to share state between compound parent and child components?
- A) Global window variables
- B) React Context (`createContext` and `useContext`)
- C) Web Workers
- D) Redux Saga
**Answer:** B
**Explanation:** React Context allows the parent compound container to share state and updater functions with child sub-components regardless of how deeply nested they are in markup.

### Q3: Why do libraries assign sub-components as properties on the parent (e.g. `Tabs.Tab = Tab`)?
- A) It is required for the browser to parse JSX
- B) It groups related sub-components under a single unified namespace, eliminating multiple separate imports
- C) It improves Vite compilation speed by 50%
- D) It encrypts the sub-component
**Answer:** B
**Explanation:** Namespace syntax (e.g. `<Tabs.List>`, `<Tabs.Tab>`) provides a clean, organized API where consumers only need to import the primary `Tabs` identifier.

### Q4: How does the Compound Components pattern improve upon rigid "prop-heavy" components like `<Tabs items={dataArray} />`?
- A) It generates faster SQL queries
- B) It allows consumers complete freedom over markup, layout order, and custom styling without requiring dozens of custom config props
- C) It eliminates the need for CSS classes
- D) It forces all tabs to be text only
**Answer:** B
**Explanation:** Compound components invert control of the rendering layout to the developer, allowing custom markup, headers, and styles to be placed freely between child elements.

### Q5: What is rendered by `<Tabs.Panel id="backend">` if the active tab is `"frontend"`?
- A) A disabled button
- B) Nothing (`null`), unmounting the panel from the DOM
- C) A blank `<div>`
- D) A browser warning modal
**Answer:** B
**Explanation:** The panel compares its `id` against the context's `activeTab`. If they do not match, it returns `null` to keep inactive panel DOM nodes unmounted.
