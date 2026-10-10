# Event Listeners in Modern JavaScript

User interaction in web applications is powered by the JavaScript event system. Event listeners observe events dispatched by the browser (clicks, keypresses, network states, form submissions) and execute designated callback functions in response.

---

## 1. The addEventListener Architecture

The standard method for attaching handlers is `EventTarget.prototype.addEventListener()`:

```
┌──────────────┐         Event (e.g. 'click')         ┌────────────────────┐
│   DOM Node   │ ───────────────────────────────────► │  Listener Callback │
│ (Button/Form)│ ◄─────────────────────────────────── │   (event) => { }   │
└──────────────┘                                      └────────────────────┘
```

```javascript
const saveBtn = document.querySelector('#btn-save');

function handleSave(event) {
  console.log('Button clicked at coordinates:', event.clientX, event.clientY);
}

saveBtn.addEventListener('click', handleSave);
```

### Why avoid inline HTML handlers?

```html
<!-- AVOID: Breaks Content Security Policy (CSP), mixes markup with logic -->
<button onclick="handleSave()">Save</button>
```

`addEventListener()` allows multiple listeners for the same event type, supports passive options, and maintains a strict separation of presentation and logic.

---

## 2. The Event Object: type, target, and currentTarget

Whenever an event triggers, the browser automatically passes an `Event` object to the callback:

```javascript
button.addEventListener('click', (e) => {
  console.log('Event Type:', e.type);              // 'click'
  console.log('Origin Element (target):', e.target); // Deepest element that was clicked
  console.log('Bound Element (currentTarget):', e.currentTarget); // Element hosting this listener
  console.log('Timestamp:', e.timeStamp);
});
```

### target vs. currentTarget
- `event.target`: The exact element that initiated the event (e.g., an `<i>` icon inside a `<button>`).
- `event.currentTarget`: The element to which the event listener is currently attached (the `<button>`).

---

## 3. Removing Event Listeners with removeEventListener()

To remove an event listener, you must supply the **identical function reference**. Anonymous inline arrow functions cannot be removed!

```javascript
function onWindowResize() {
  console.log('Current window width:', window.innerWidth);
}

// Attach listener
window.addEventListener('resize', onWindowResize);

// Detach listener later (e.g., when component unmounts)
window.removeEventListener('resize', onWindowResize);

// CAUTION: This CANNOT be removed!
window.addEventListener('resize', () => console.log('Resized'));
// window.removeEventListener('resize', () => console.log('Resized')); // FAILS: Different memory reference!
```

---

## 4. Advanced Event Options: once, passive, and capture

`addEventListener` accepts a third argument—either a boolean (for capture) or an options object:

```javascript
button.addEventListener('click', () => {
  console.log('This will only run once!');
}, { once: true }); // Automatically detaches after firing once

// Performance optimization for scroll/touch events
window.addEventListener('scroll', handleScroll, {
  passive: true // Informs browser that preventDefault() will NEVER be called, preventing UI lag
});
```

---

## 5. AbortController: Modern Event Cleanup

ES2022 introduced signal-based event cancellation using `AbortController`. This allows you to remove dozens of event listeners simultaneously with a single command:

```javascript
const controller = new AbortController();
const { signal } = controller;

const btn1 = document.querySelector('#b1');
const btn2 = document.querySelector('#b2');

btn1.addEventListener('click', () => console.log('Btn 1 clicked'), { signal });
btn2.addEventListener('click', () => console.log('Btn 2 clicked'), { signal });

// Later, cancel ALL listeners attached with this signal
controller.abort();
```

---

## Practice Quiz

### Q1: Why can an anonymous arrow function listener NOT be removed via removeEventListener()?
- A) Arrow functions do not support DOM events
- B) removeEventListener() requires an exact reference to the function stored in memory
- C) Anonymous functions run in a background thread
- D) Arrow functions are immutable in JavaScript
**Answer:** B
**Explanation:** `removeEventListener` requires passing the exact same function reference. An inline anonymous function creates a brand-new function reference in memory.

### Q2: What is the difference between event.target and event.currentTarget?
- A) target is the window, while currentTarget is the document
- B) target is the element where the event originated; currentTarget is the element handling the event listener
- C) target is only for mouse events, currentTarget is for keyboard events
- D) They are strictly identical in all scenarios
**Answer:** B
**Explanation:** `event.target` is the deepest element that triggered the event, while `event.currentTarget` is the element to which the event handler was attached.

### Q3: What listener option ensures that an event handler fires only a single time and then auto-detaches?
- A) { repeat: false }
- B) { single: true }
- C) { once: true }
- D) { autoRemove: true }
**Answer:** C
**Explanation:** Passing `{ once: true }` in the options object automatically invokes `removeEventListener` after the first trigger.

### Q4: What does setting { passive: true } achieve on touch and scroll event listeners?
- A) It stops the event from bubbling
- B) It prevents CPU throttling on mobile devices
- C) It indicates the handler will not call preventDefault(), allowing smooth scrolling without frame drops
- D) It encrypts event data for security
**Answer:** C
**Explanation:** Modern browsers can optimize scrolling and gesture performance when `{ passive: true }` is supplied because the browser knows it won't be blocked by `preventDefault()`.

### Q5: Which modern JavaScript API allows removing multiple event listeners across various elements using a single signal?
- A) EventBus
- B) AbortController
- C) ListenerManager
- D) ProcessManager
**Answer:** B
**Explanation:** An `AbortController` signal can be passed in `{ signal }` to any number of listeners, and invoking `controller.abort()` unregisters all of them at once.
