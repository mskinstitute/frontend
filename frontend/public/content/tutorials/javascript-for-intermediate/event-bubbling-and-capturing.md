# Event Bubbling & Capturing in Modern JavaScript

DOM events do not simply trigger in isolation on a single element. When an action occurs, the event travels through a structured three-phase lifecycle known as the **DOM Event Flow**: the Capturing Phase, the Target Phase, and the Bubbling Phase.

---

## 1. The 3 Phases of Event Propagation

```
               PHASE 1: CAPTURING (Downwards)
               Window ───────────────┐
                 │                   │
               Document              │
                 │                   │
               <html>                │
                 │                   │
               <body>                │
                 │                   │
               <div id="wrapper">    │
                 │                   ▼
                 │            PHASE 2: TARGET
                 │            <button id="btn">Click Me</button>
                 │                   ▲
                 │                   │
               PHASE 3: BUBBLING (Upwards)
```

1. **Capturing Phase (Trickling):** The event starts at `window` and travels down through `document`, `html`, `body`, and parent containers until it reaches the target.
2. **Target Phase:** The event reaches the originating element (`event.target`).
3. **Bubbling Phase:** The event travels back upwards from the target through all ancestors until reaching `window`.

> **Default Behavior:** By default, `addEventListener()` registers listeners for the **Bubbling Phase** unless explicitly specified otherwise.

---

## 2. Capturing in Practice

To listen during the Capturing Phase, pass `{ capture: true }` or simply `true` as the third parameter:

```javascript
const wrapper = document.querySelector('#wrapper');
const button = document.querySelector('#btn');

wrapper.addEventListener('click', () => {
  console.log('1. Wrapper clicked (Capturing phase)');
}, { capture: true });

button.addEventListener('click', () => {
  console.log('2. Button clicked (Target/Bubbling phase)');
});

wrapper.addEventListener('click', () => {
  console.log('3. Wrapper clicked (Bubbling phase)');
});
```

*When the button is clicked, output order is:*
1. `1. Wrapper clicked (Capturing phase)`
2. `2. Button clicked (Target/Bubbling phase)`
3. `3. Wrapper clicked (Bubbling phase)`

---

## 3. Stopping Propagation: stopPropagation() & stopImmediatePropagation()

### event.stopPropagation()
Prevents the event from travelling any further up (in bubbling) or down (in capturing) the DOM tree:

```javascript
const nestedModal = document.querySelector('.modal-content');

nestedModal.addEventListener('click', (e) => {
  // Prevent click on modal content from closing the backdrop overlay
  e.stopPropagation();
  console.log('Clicked inside modal content');
});
```

### event.stopImmediatePropagation()
Not only halts bubbling to parent nodes, but also prevents **other listeners on the very same element** from firing:

```javascript
button.addEventListener('click', (e) => {
  console.log('Primary handler');
  e.stopImmediatePropagation();
});

button.addEventListener('click', () => {
  console.log('Secondary handler'); // NEVER EXECUTED!
});
```

---

## 4. Event Delegation: The Power of Bubbling

Because events bubble up through parent nodes, you do not need to attach separate listeners to hundreds of child elements. Instead, attach a **single listener to the parent element**.

```
  Container (Single Event Listener Here)
    ├── [Button 1]  (Click bubbles up)
    ├── [Button 2]  (Click bubbles up)
    └── [Button N]  (Click bubbles up)
```

### High-Performance Example: Dynamic List Deletion

```javascript
const userList = document.querySelector('#user-list');

// Single listener handles all existing AND future delete buttons!
userList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn-delete');
  
  // If the click did not occur inside or on a delete button, ignore
  if (!deleteBtn || !userList.contains(deleteBtn)) return;

  const listItem = deleteBtn.closest('li');
  const userId = listItem.dataset.userId;

  console.log(`Deleting user: ${userId}`);
  listItem.remove();
});
```

### Benefits of Event Delegation:
1. **Low Memory Footprint:** 1 listener instead of 1,000 listeners.
2. **Dynamic Elements:** Automatically works for items added asynchronously later via API calls.
3. **No Memory Leaks:** Removing items does not leave orphaned listeners.

---

## Practice Quiz

### Q1: In standard DOM event flow, in what order do the three phases execute?
- A) Bubbling -> Target -> Capturing
- B) Target -> Capturing -> Bubbling
- C) Capturing -> Target -> Bubbling
- D) Bubbling -> Capturing -> Target
**Answer:** C
**Explanation:** Events first trickle down in the Capturing phase, reach the Target phase, and bubble back up in the Bubbling phase.

### Q2: What is the main architectural benefit of Event Delegation?
- A) It encrypts network payloads
- B) It prevents users from inspecting elements
- C) It attaches a single listener to a common parent to handle events on dynamic child elements efficiently
- D) It stops garbage collection
**Answer:** C
**Explanation:** Event delegation takes advantage of event bubbling by putting a single handler on an ancestor, reducing memory usage and cleanly managing dynamic child elements.

### Q3: What is the effect of calling event.stopPropagation()?
- A) It prevents the default browser behavior (e.g., following a link)
- B) It halts the event from propagating further up or down the DOM hierarchy
- C) It reloads the current page
- D) It removes the element from the DOM
**Answer:** B
**Explanation:** `stopPropagation()` prevents the event from continuing along its capture or bubbling path to ancestor or descendant elements.

### Q4: How do you configure an event listener to fire during the Capturing phase instead of the Bubbling phase?
- A) { phase: 'capture' }
- B) { capture: true }
- C) { bubble: false }
- D) { direction: 'down' }
**Answer:** B
**Explanation:** Passing `{ capture: true }` or `true` as the third parameter to `addEventListener()` registers the listener for the capturing phase.

### Q5: How does stopImmediatePropagation() differ from stopPropagation()?
- A) It cancels CSS transitions
- B) It also stops other listeners attached to the exact same element from executing
- C) It only works on Internet Explorer
- D) It automatically submits enclosing forms
**Answer:** B
**Explanation:** `stopImmediatePropagation()` not only halts bubbling up the DOM tree, but also immediately suppresses all subsequent listeners registered on the current element for that event.
