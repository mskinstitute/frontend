# Custom Elements Lifecycle (connectedCallback & More)

Custom Elements are the core pillar of the W3C Web Components standard, enabling developers to define fully autonomous, reusable HTML tags with encapsulated behavior and state. Understanding the **Custom Elements Lifecycle** is essential for building framework-agnostic component libraries.

---

## 1. Defining a Custom Element

Custom elements extend `HTMLElement` and are registered with the browser's `customElements` registry:

```javascript
class UserAvatar extends HTMLElement {
  constructor() {
    super(); // Mandatory call to super()!
    console.log('1. Constructor: Element instantiated.');
  }
}

// Custom element names MUST contain a hyphen (-) to avoid collisions with HTML tags!
customElements.define('user-avatar', UserAvatar);
```

```html
<!-- Now valid HTML! -->
<user-avatar></user-avatar>
```

---

## 2. The 4 Lifecycle Callbacks

```
┌─────────────────────────────────────────────────────────────┐
│                 CUSTOM ELEMENT LIFECYCLE                    │
├──────────────────────────────┬──────────────────────────────┤
│ connectedCallback()          │ Element inserted into DOM    │
│                              │ (Setup listeners, fetch data)│
├──────────────────────────────┼──────────────────────────────┤
│ disconnectedCallback()       │ Element removed from DOM     │
│                              │ (Cleanup timers, listeners)  │
├──────────────────────────────┼──────────────────────────────┤
│ attributeChangedCallback()   │ Observed attribute updated   │
├──────────────────────────────┼──────────────────────────────┤
│ adoptedCallback()            │ Element moved to new document│
└──────────────────────────────┴──────────────────────────────┘
```

---

## 3. Observing Attribute Changes

To listen to attribute modifications via `attributeChangedCallback()`, you must declare a static getter named `observedAttributes`:

```javascript
class NotificationBadge extends HTMLElement {
  static get observedAttributes() {
    return ['count', 'theme']; // List attributes to monitor
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  // Triggered whenever 'count' or 'theme' is added, updated, or removed
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`Attribute "${name}" changed from "${oldValue}" to "${newValue}"`);
      this.render();
    }
  }

  disconnectedCallback() {
    console.log('Badge destroyed. Performing cleanup.');
  }

  render() {
    const count = this.getAttribute('count') || '0';
    const theme = this.getAttribute('theme') || 'primary';

    this.shadowRoot.innerHTML = `
      <style>
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 0.75rem;
          color: white;
        }
        .primary { background: #3b82f6; }
        .danger { background: #ef4444; }
      </style>
      <span class="badge ${theme}">${count}</span>
    `;
  }
}

customElements.define('notification-badge', NotificationBadge);
```

### Live Mutation in Action:
```javascript
const badge = document.querySelector('notification-badge');
badge.setAttribute('count', '5'); // attributeChangedCallback fires -> auto re-renders!
badge.setAttribute('theme', 'danger');
```

---

## 4. Autonomous vs. Customized Built-in Elements

1. **Autonomous Custom Element:** Extends `HTMLElement`. Used as `<my-tag>`.
2. **Customized Built-in Element:** Extends a specific tag (e.g. `HTMLButtonElement`). Used with the `is` attribute:
   ```javascript
   class ConfirmButton extends HTMLButtonElement { ... }
   customElements.define('confirm-button', ConfirmButton, { extends: 'button' });
   ```
   ```html
   <button is="confirm-button">Delete Account</button>
   ```

---

## Practice Quiz

### Q1: What naming convention is strictly required for Custom Element tag names?
- A) Must start with uppercase (e.g. <UserCard>)
- B) Must contain at least one hyphen (e.g. <user-card>) to prevent collisions with future native HTML tags
- C) Must end with .component
- D) Must be prefixed with x:
**Answer:** B
**Explanation:** The W3C specification mandates that custom tag names must contain a hyphen (dash) to distinguish them from native HTML elements.

### Q2: Which lifecycle callback fires when a Custom Element is attached to the active DOM?
- A) onMount()
- B) connectedCallback()
- C) componentDidMount()
- D) initCallback()
**Answer:** B
**Explanation:** `connectedCallback()` is invoked by the browser every time the custom element is inserted into the document DOM.

### Q3: What must be defined on the class for attributeChangedCallback() to receive notifications when an attribute changes?
- A) A static get observedAttributes() getter returning an array of attribute name strings
- B) An HTML event listener
- C) A MutationObserver
- D) A Proxy handler
**Answer:** A
**Explanation:** The browser only triggers `attributeChangedCallback` for attributes explicitly listed in the class's `static get observedAttributes` array.

### Q4: Which lifecycle hook should be used to clear intervals and remove window event listeners?
- A) unmountCallback()
- B) disconnectedCallback()
- C) destroyCallback()
- D) finalizeCallback()
**Answer:** B
**Explanation:** `disconnectedCallback()` fires whenever the element is removed from the DOM, making it the proper place for resource teardown.

### Q5: What base class must an autonomous Custom Element inherit from?
- A) Object
- B) HTMLElement
- C) DOMElement
- D) Component
**Answer:** B
**Explanation:** Autonomous custom elements must extend `HTMLElement` (or a subclass thereof) and invoke `super()` in the constructor.
