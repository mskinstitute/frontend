# Shadow DOM & Web Components Basics

A long-standing challenge in web development is CSS encapsulation: a global style rule like `p { color: red }` or `button { padding: 10px }` easily leaks into third-party widgets, breaking layouts. **Web Components** and the **Shadow DOM** solve this by providing native, browser-level component encapsulation for markup and styles.

---

## 1. The 3 Pillars of Web Components

1. **Custom Elements:** APIs to define new HTML tags (e.g. `<user-card>`, `<video-player>`).
2. **Shadow DOM:** An encapsulated DOM subtree isolated from the main document's styles and scripts.
3. **HTML Templates (`<template>` & `<slot>`):** Reusable markup fragments rendered dynamically.

---

## 2. Light DOM vs. Shadow DOM

```
  Light DOM (Regular Page DOM)
  ├── <h1>Global Heading</h1> (Styled by global.css)
  └── <user-badge> ───────────┐
                              ▼
                        Shadow Root (#shadow-root)
                        ├── <style>h1 { color: blue; }</style>  <── SCOPED!
                        └── <h1>Component Heading</h1>          <── Isolated!
```

- **Light DOM:** The standard DOM tree. Global CSS and scripts apply freely.
- **Shadow Root:** The boundary attached to an element. Styles inside **cannot leak out**, and global styles **cannot penetrate in**!

---

## 3. Creating a Shadow Root: `attachShadow()`

You attach a shadow root to any standard or custom element using `attachShadow({ mode: 'open' | 'closed' })`:

```html
<div id="host-element"></div>

<script>
  const host = document.querySelector('#host-element');
  
  // Attach open shadow root
  const shadow = host.attachShadow({ mode: 'open' });

  // Add encapsulated styles and markup
  shadow.innerHTML = `
    <style>
      /* These styles affect ONLY elements inside this Shadow DOM! */
      h2 {
        color: #4f46e5;
        font-family: sans-serif;
        border-bottom: 2px solid #4f46e5;
      }
      p { color: #64748b; }
    </style>
    <h2>Encapsulated Widget</h2>
    <p>Global CSS styles cannot override this text!</p>
  `;
</script>
```

---

## 4. `open` vs. `closed` Mode

- **`mode: 'open'` (Recommended):** Accessible from JavaScript via `element.shadowRoot`. Enables testing and developer inspection.
- **`mode: 'closed'`:** `element.shadowRoot` returns `null`. Rarely used because it offers no true security and hinders testing.

---

## 5. Composition with `<slot>`

The `<slot>` element acts as a placeholder for content projected from the parent Light DOM into the Shadow DOM:

```html
<fancy-card>
  <!-- Light DOM Content -->
  <span slot="title">Enterprise Security</span>
  <p slot="body">Native isolation powered by W3C standards.</p>
</fancy-card>
```

```html
<!-- Inside fancy-card Shadow DOM Template -->
<div class="card">
  <div class="card-header"><slot name="title"></slot></div>
  <div class="card-body"><slot name="body"></slot></div>
</div>
```

---

## Practice Quiz

### Q1: What problem does the Shadow DOM primarily solve in web development?
- A) Slow network latency
- B) CSS style bleeding and DOM encapsulation by isolating component styles and markup from the main document
- C) Database synchronization
- D) SSL certificate validation
**Answer:** B
**Explanation:** The Shadow DOM provides true style and DOM encapsulation, preventing internal component styles from leaking out and external page styles from interfering inside.

### Q2: What method is used to create and attach a Shadow DOM to an element?
- A) element.createShadow()
- B) element.attachShadow({ mode: 'open' })
- C) document.createShadowRoot()
- D) element.setShadowRoot()
**Answer:** B
**Explanation:** `element.attachShadow({ mode: 'open' | 'closed' })` creates a shadow root and attaches it to the specified host element.

### Q3: What is the difference between mode: 'open' and mode: 'closed' when attaching a shadow root?
- A) 'open' allows external scripts to access element.shadowRoot, while 'closed' returns null
- B) 'open' is free; 'closed' requires a license
- C) 'open' disables CSS
- D) 'closed' renders in black and white
**Answer:** A
**Explanation:** In `'open'` mode, the shadow root is accessible via `host.shadowRoot`, whereas `'closed'` mode hides the reference from JavaScript.

### Q4: What HTML element serves as an insertion point for projecting Light DOM content into a Shadow DOM component?
- A) <inject>
- B) <slot>
- C) <portal>
- D) <target>
**Answer:** B
**Explanation:** The `<slot>` element acts as a projection placeholder where consumer-provided Light DOM markup is rendered within the Shadow DOM layout.

### Q5: Can global page styles like body { font-family: Arial; } penetrate and style elements inside an open Shadow DOM?
- A) Yes, all CSS properties penetrate
- B) Inheritable properties (like font-family or color) inherit through the shadow boundary unless overridden internally, but specific selectors do not penetrate
- C) No styles can ever enter under any circumstances
- D) Only Tailwind CSS can penetrate
**Answer:** B
**Explanation:** Inheritable CSS properties (like `color`, `font-family`) pass through the shadow boundary from parent containers, but external CSS class selectors (`.my-class`) cannot target shadow elements directly.
