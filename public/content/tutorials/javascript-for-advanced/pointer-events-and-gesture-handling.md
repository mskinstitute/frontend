# Pointer Events & Gesture Handling in Modern JavaScript

Historically, web applications had to maintain separate codebases for mouse events (`mousedown`, `mousemove`), touch events (`touchstart`, `touchmove`), and pen inputs. The **Pointer Events API** unifies all pointing hardware into a single modern standard, providing device-agnostic coordinates, contact geometry, pressure, and pointer capture.

---

## 1. Unified Event Mapping

| Pointer Event | Equivalent Mouse Event | Equivalent Touch Event |
| :--- | :--- | :--- |
| `pointerdown` | `mousedown` | `touchstart` |
| `pointermove` | `mousemove` | `touchmove` |
| `pointerup` | `mouseup` | `touchend` |
| `pointercancel` | N/A | `touchcancel` |
| `pointerenter` | `mouseenter` | N/A |
| `pointerleave` | `mouseleave` | N/A |

```
  Hardware Inputs:
  ├── Mouse Cursor  ────┐
  ├── Touch Finger  ────┼──► Unified Pointer Events (pointerdown, pointermove)
  └── Digital Pen   ────┘
```

---

## 2. Unique PointerEvent Hardware Properties

Every `PointerEvent` contains rich hardware metadata:

```javascript
canvas.addEventListener('pointermove', (e) => {
  console.log('Pointer ID:', e.pointerId);       // Unique ID per active finger/pen
  console.log('Pointer Type:', e.pointerType);   // 'mouse', 'touch', or 'pen'
  console.log('Is Primary:', e.isPrimary);       // true for first touch point
  console.log('Pressure:', e.pressure);          // 0.0 to 1.0 (Stylus pressure)
  console.log('Contact Size:', e.width, e.height); // Touch surface contact area in px
  console.log('Tilt X / Y:', e.tiltX, e.tiltY);  // Stylus tilt angles (-90 to +90 deg)
});
```

---

## 3. Pointer Capture (`setPointerCapture`)

A frequent bug in drag-and-drop or slider controls occurs when the user drags their cursor too fast: the mouse moves outside the element, and subsequent `mousemove` and `mouseup` events are lost!

**Pointer Capture** redirects all subsequent pointer events to that element, **even if the cursor moves completely outside its boundary or off-screen**:

```javascript
const sliderKnob = document.querySelector('#slider-knob');

sliderKnob.addEventListener('pointerdown', (event) => {
  // Retain pointer events even if mouse flies outside the knob element!
  sliderKnob.setPointerCapture(event.pointerId);
  sliderKnob.classList.add('dragging');
});

sliderKnob.addEventListener('pointermove', (event) => {
  if (sliderKnob.hasPointerCapture(event.pointerId)) {
    // Update slider position smoothly
    updateSliderPosition(event.clientX);
  }
});

sliderKnob.addEventListener('pointerup', (event) => {
  // Release capture when user lifts finger or mouse button
  sliderKnob.releasePointerCapture(event.pointerId);
  sliderKnob.classList.remove('dragging');
});
```

---

## 4. Multi-Touch Pinch & Drag Handling

Because each active finger receives a unique `pointerId`, handling multi-touch gestures is straightforward:

```javascript
const activeTouches = new Map();

canvas.addEventListener('pointerdown', (e) => {
  activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
});

canvas.addEventListener('pointermove', (e) => {
  if (!activeTouches.has(e.pointerId)) return;
  activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

  // If two fingers are on screen, calculate pinch distance:
  if (activeTouches.size === 2) {
    const [p1, p2] = Array.from(activeTouches.values());
    const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    handlePinchZoom(distance);
  }
});

function removeTouch(e) { activeTouches.delete(e.pointerId); }
canvas.addEventListener('pointerup', removeTouch);
canvas.addEventListener('pointercancel', removeTouch);
```

---

## Practice Quiz

### Q1: What is the primary architectural advantage of the Pointer Events API?
- A) It compiles JavaScript into WebAssembly
- B) It provides a unified API handling mouse, touch screens, and digital pens simultaneously
- C) It eliminates the need for CSS
- D) It bypasses CORS restrictions
**Answer:** B
**Explanation:** Pointer Events unify multiple pointing hardware types under a single event model, avoiding separate handlers for mouse, touch, and stylus pen.

### Q2: What problem does element.setPointerCapture(pointerId) solve in drag-and-drop implementations?
- A) It prevents the page from reloading
- B) It guarantees that the element continues receiving pointermove and pointerup events even if the pointer moves outside the element's visual bounds
- C) It captures webcam video
- D) It locks the computer screen
**Answer:** B
**Explanation:** Pointer capture ensures all future events for that pointer ID are targeted at the capturing element, preventing lost mouseup events during rapid dragging.

### Q3: Which property distinguishes between input hardware types ('mouse', 'touch', 'pen')?
- A) event.device
- B) event.pointerType
- C) event.hardware
- D) event.inputKind
**Answer:** B
**Explanation:** `event.pointerType` returns a string identifying the hardware device: `'mouse'`, `'touch'`, or `'pen'`.

### Q4: What does event.pressure return for a standard mouse click vs. a pressure-sensitive digital stylus?
- A) 0 for mouse; always 1.0 for stylus
- B) 0.5 for mouse when pressed; a dynamic float from 0.0 to 1.0 for a pressure-sensitive stylus
- C) Mouse events do not have pressure
- D) Pressure is measured in kilograms
**Answer:** B
**Explanation:** For devices without pressure support (like mice), `pressure` is typically `0.5` when active and `0` when inactive; pressure-sensitive pens return analog values between `0.0` and `1.0`.

### Q5: How do you identify whether a touch point is the primary touch in a multi-finger gesture?
- A) event.isFirst
- B) event.isPrimary (evaluates to true for the first pointer in a multi-touch interaction)
- C) event.pointerId === 1
- D) event.main === true
**Answer:** B
**Explanation:** `event.isPrimary` is a boolean indicating whether the current pointer represents the primary pointer in a multi-touch sequence.
