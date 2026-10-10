# Custom Events & Event Dispatching in Modern JavaScript

While standard DOM events (`click`, `input`, `keydown`) handle direct user input, modular architectures require components to communicate domain-specific events—such as `cart:item-added`, `modal:closed`, or `user:authenticated`. The **`CustomEvent`** API allows you to create, dispatch, and intercept custom events across the DOM and Web Components.

---

## 1. Creating and Dispatching a CustomEvent

A `CustomEvent` takes an event type string and an optional initialization dictionary:

```javascript
// Step 1: Instantiate the Custom Event
const itemAddedEvent = new CustomEvent('cart:item-added', {
  detail: {
    productId: 'SKU-9921',
    name: 'Ergonomic Keyboard',
    price: 129.99,
    timestamp: Date.now()
  },
  bubbles: true,   // Allows event to bubble up through parent DOM ancestors
  composed: true,  // CRITICAL: Allows event to cross Shadow DOM boundaries!
  cancelable: true // Allows listeners to call event.preventDefault()
});

// Step 2: Dispatch from any DOM element or window
const cartButton = document.querySelector('#btn-add-to-cart');
cartButton.dispatchEvent(itemAddedEvent);
```

---

## 2. Listening to Custom Events & Accessing `detail`

Event payloads passed in `{ detail }` are available on `event.detail`:

```javascript
// Listener attached to ancestor or window
window.addEventListener('cart:item-added', (event) => {
  console.log('Item Added Event Intercepted!');
  console.log('Product Name:', event.detail.name);
  console.log('Price:', event.detail.price);

  // Update navigation badge
  updateNavCartBadge();
});
```

---

## 3. Crossing the Shadow DOM: `composed: true`

By default, events dispatched inside a **Shadow DOM** are trapped inside and **cannot bubble up into the main document**. Setting `composed: true` allows the event to penetrate through the shadow boundary into the outer Light DOM:

```
  Inside Shadow DOM:
    button.dispatchEvent(new CustomEvent('user-action', {
      bubbles: true,
      composed: true  <── Crosses #shadow-root!
    }))
           │
           ▼
  Main Document receives event: window.addEventListener('user-action')
```

---

## 4. Making Custom Events Cancelable

If you set `cancelable: true`, listeners can call `event.preventDefault()`. The caller of `dispatchEvent()` receives a boolean indicating whether the action was permitted:

```javascript
// Component dispatching event:
function requestDeleteFile(fileName) {
  const event = new CustomEvent('file:before-delete', {
    detail: { fileName },
    cancelable: true
  });

  // dispatchEvent returns FALSE if any listener called preventDefault()!
  const isAllowed = window.dispatchEvent(event);

  if (isAllowed) {
    console.log(`Proceeding with deletion of: ${fileName}`);
    deleteFile(fileName);
  } else {
    console.warn(`Deletion of ${fileName} was cancelled by an event listener.`);
  }
}

// Security guard listener canceling deletion:
window.addEventListener('file:before-delete', (e) => {
  if (e.detail.fileName.endsWith('.protected')) {
    e.preventDefault(); // Cancel deletion!
    alert('Cannot delete protected system files!');
  }
});
```

---

## Practice Quiz

### Q1: What property of a CustomEvent holds the arbitrary payload data passed to it?
- A) event.payload
- B) event.detail
- C) event.data
- D) event.body
**Answer:** B
**Explanation:** In standard DOM `CustomEvent` instances, custom payload data is passed in the `{ detail: ... }` dictionary and accessed via `event.detail`.

### Q2: What option must be set to true on a CustomEvent so it can bubble out of a Shadow DOM into the main Light DOM?
- A) shadow: true
- B) composed: true
- C) crossOrigin: true
- D) global: true
**Answer:** B
**Explanation:** Setting `composed: true` allows an event to cross the shadow root boundary into the surrounding Light DOM tree.

### Q3: What does element.dispatchEvent(event) return if a listener calls event.preventDefault() on a cancelable event?
- A) null
- B) false
- C) true
- D) undefined
**Answer:** B
**Explanation:** `dispatchEvent()` returns `false` if the event is cancelable and at least one event handler invoked `preventDefault()`; otherwise, it returns `true`.

### Q4: Can custom events bubble up through ancestor elements like standard click events?
- A) Yes, if { bubbles: true } is provided in the CustomEvent initialization object
- B) No, custom events can never bubble
- C) Only in Firefox
- D) Only if dispatched on document.body
**Answer:** A
**Explanation:** Custom events do not bubble by default; setting `bubbles: true` enables standard upward DOM propagation.

### Q5: What is the primary architectural benefit of using Custom Events for component communication?
- A) It speeds up network downloads
- B) It decouples components: the emitting component does not need to know which or how many components are listening
- C) It eliminates the need for CSS
- D) It prevents memory garbage collection
**Answer:** B
**Explanation:** Custom events promote loose coupling; an emitting component dispatches events without direct references to or dependencies on the consumers handling them.
