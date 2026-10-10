# ResizeObserver & IntersectionObserver APIs in Modern JavaScript

Historically, detecting when an element became visible on screen or changed dimensions required attaching expensive `scroll` and `resize` listeners to `window` with heavy debouncing. The modern standard Web APIs—**`IntersectionObserver`** and **`ResizeObserver`**—perform these calculations directly in the browser's native compositing pipeline with high efficiency.

---

## 1. IntersectionObserver: Visibility & Viewport Tracking

`IntersectionObserver` detects when a target element intersects with an ancestor element or the top-level document viewport.

```
       Browser Viewport (Window)
  ┌─────────────────────────────────┐
  │                                 │
  │   Target Element (Below Fold)   │
  │   [ 0% Visible: Ratio 0.0 ]     │
  └─────────────────────────────────┘
                  │ (User scrolls down)
  ┌───────────────▼─────────────────┐
  │   [ 50% Visible: Ratio 0.5 ]    │ ──► Callback triggers!
  └─────────────────────────────────┘
```

### High-Performance Lazy-Loading Images:

```javascript
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // If the image is within viewport threshold:
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Replace placeholder with real URL
      img.classList.add('loaded');
      observer.unobserve(img); // Cease observing once loaded!
    }
  });
}, {
  root: null,        // Defaults to browser viewport
  rootMargin: '200px', // Pre-fetch image 200px BEFORE it enters screen!
  threshold: 0.1      // Trigger when 10% visible
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

---

## 2. Infinite Scrolling with IntersectionObserver

Instead of calculating scroll height mathematics, place an empty "sentinel" `<div>` at the bottom of the feed:

```javascript
const sentinel = document.querySelector('#scroll-sentinel');

const infiniteScrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadNextPageOfData();
  }
});

infiniteScrollObserver.observe(sentinel);
```

---

## 3. ResizeObserver: Element-Level Responsive Queries

While CSS `@media` queries only evaluate the entire browser window width, modern component design requires styling widgets based on **their own container width** (Container Queries). `ResizeObserver` monitors an individual element's box model:

```javascript
const widget = document.querySelector('.analytics-widget');

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // Read precise content box dimensions
    const width = entry.contentRect.width;
    
    // Dynamically adjust layout classes based on element width!
    if (width < 400) {
      widget.classList.add('compact-view');
      widget.classList.remove('wide-view');
    } else {
      widget.classList.add('wide-view');
      widget.classList.remove('compact-view');
    }
  }
});

resizeObserver.observe(widget);
```

---

## 4. Comparison Matrix

| Feature | `IntersectionObserver` | `ResizeObserver` |
| :--- | :--- | :--- |
| **Monitors** | Relative visibility / viewport overlap | Element boundary / contentRect size changes |
| **Key Use Cases** | Lazy loading images, infinite scroll, ad viewability | Container queries, responsive charts, canvas redraws |
| **Performance** | Off-main-thread compositing engine | Batched before paint; prevents layout loops |

---

## Practice Quiz

### Q1: What is the primary performance benefit of IntersectionObserver over listening to window.addEventListener('scroll')?
- A) It runs in WebAssembly
- B) It evaluates element visibility asynchronously within the browser layout engine, avoiding continuous main-thread reflow calculations on every scroll pixel
- C) It compresses image files
- D) It stops network requests
**Answer:** B
**Explanation:** `IntersectionObserver` is calculated asynchronously by the browser's compositing thread, eliminating the layout thrashing caused by continuous scroll event listeners.

### Q2: In an IntersectionObserver options object, what does rootMargin: '200px' do?
- A) Adds 200px of CSS padding to the element
- B) Expands the bounding box of the viewport by 200px, triggering visibility callbacks before the element actually scrolls into view
- C) Sets a 200ms delay
- D) Throws a RangeError
**Answer:** B
**Explanation:** `rootMargin` expands or shrinks the intersection bounding box, allowing assets (like images) to preload slightly before entering the visible screen.

### Q3: What method should be called on an IntersectionObserver instance once a target image has successfully loaded?
- A) observer.disconnectAll()
- B) observer.unobserve(targetElement)
- C) targetElement.remove()
- D) observer.destroy()
**Answer:** B
**Explanation:** Calling `observer.unobserve(target)` stops watching that specific element, releasing resources once its task (e.g. lazy loading) is complete.

### Q4: Why is ResizeObserver preferred over window.addEventListener('resize') for responsive components?
- A) ResizeObserver monitors dimensions of individual element containers rather than the whole browser window
- B) Window resize listeners are deprecated
- C) ResizeObserver works only in Node.js
- D) It prevents CSS from loading
**Answer:** A
**Explanation:** `ResizeObserver` monitors changes to a specific element's box model, making it ideal for responsive components whose width depends on grid layouts rather than screen size alone.

### Q5: What threshold value ensures an IntersectionObserver callback fires when half of the element is visible?
- A) threshold: 0.5
- B) threshold: 50
- C) threshold: 'half'
- D) threshold: 1.0
**Answer:** A
**Explanation:** The `threshold` option accepts a value from `0.0` (any pixel visible) to `1.0` (100% of element visible). A value of `0.5` triggers when 50% is visible.
