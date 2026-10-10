# Passive Event Listeners & Touch Optimization in Modern JavaScript

Smooth scrolling and touch responsiveness are critical for mobile web applications. A major cause of mobile scroll stutter (jank) is the browser's requirement to check whether an event listener calls `event.preventDefault()`. **Passive Event Listeners** eliminate this bottleneck, boosting scroll performance to 60 FPS.

---

## 1. The Scroll Delay Problem Explained

When a user places their finger on a mobile screen and swipes:
1. The browser dispatches a `touchstart` or `touchmove` event.
2. The browser **does not know** if your JavaScript will call `event.preventDefault()` (which halts scrolling).
3. Therefore, the browser **must pause the main scrolling thread** and wait for your JavaScript listener to finish executing!
4. Even a 50ms JavaScript delay produces noticeable scroll stutter and delays page motion.

```
Without Passive Option:
  Finger Swipes ──► Main Thread Pauses ──► JS executes ──► Scroll Begins (Delayed!)

With { passive: true }:
  Finger Swipes ──► Scroll Begins Instantly! (Compositor Thread)
                    └── (JavaScript executes concurrently in background!)
```

---

## 2. Enabling Passive Event Listeners

Pass `{ passive: true }` in the options object of `addEventListener`:

```javascript
// Instructs browser: "I promise I will NEVER call event.preventDefault()!"
window.addEventListener('touchmove', handleTouchMove, { passive: true });
window.addEventListener('wheel', handleMouseWheel, { passive: true });
```

### What Happens if you Call preventDefault() in a Passive Listener?
The browser completely ignores the call and logs a console warning:
```javascript
window.addEventListener('touchstart', (e) => {
  e.preventDefault(); 
  // Ignored! Warning: Unable to preventDefault inside passive event listener invocation!
}, { passive: true });
```

---

## 3. Eliminating the 300ms Mobile Tap Delay

On older mobile browsers, a 300ms delay occurred between a user tapping the screen and the `click` event firing (as the browser waited to see if the tap was a double-tap to zoom).

### Modern Solutions:
1. **Viewport Meta Tag (Standard):**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```
   Modern browsers recognize `width=device-width` and automatically eliminate the 300ms tap delay!
2. **CSS `touch-action` Property:**
   ```css
   /* Disable double-tap-to-zoom on buttons to guarantee instantaneous clicks */
   button, a {
     touch-action: manipulation;
   }
   ```

---

## 4. Feature Detecting Passive Listeners

In legacy environments or custom libraries, feature-detect passive listener support:

```javascript
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
      return true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

// Safe attachment:
window.addEventListener('scroll', onScroll, supportsPassive ? { passive: true } : false);
```

---

## Practice Quiz

### Q1: Why do passive event listeners significantly improve mobile scroll performance?
- A) They run on a separate CPU core
- B) They signal to the browser that preventDefault() will never be called, allowing the browser to scroll instantly on the compositor thread without waiting for JS execution
- C) They automatically throttle scroll events to 10 FPS
- D) They compress CSS stylesheets
**Answer:** B
**Explanation:** By declaring `{ passive: true }`, the browser knows scrolling will not be cancelled, allowing it to start scrolling immediately without waiting for main-thread JS execution.

### Q2: What happens if code calls event.preventDefault() inside a passive event listener?
- A) The browser tab reboots
- B) The call is ignored and a warning is logged to the console
- C) It throws a fatal TypeError
- D) The page reloads
**Answer:** B
**Explanation:** The browser suppresses `event.preventDefault()` inside passive handlers, logging a console warning that preventDefault cannot be invoked in a passive context.

### Q3: On which events is { passive: true } most beneficial for performance?
- A) click and dblclick
- B) touchstart, touchmove, and wheel
- C) keydown and keyup
- D) submit and reset
**Answer:** B
**Explanation:** `touchstart`, `touchmove`, and `wheel` are high-frequency scrolling and gesture events where blocking the main thread directly causes scroll stutter.

### Q4: What CSS rule eliminates the 300ms tap delay on buttons by disabling double-tap zooming?
- A) touch-action: manipulation;
- B) pointer-events: none;
- C) cursor: pointer;
- D) user-select: none;
**Answer:** A
**Explanation:** `touch-action: manipulation` restricts gesture actions to panning and pinch-zooming, disabling the double-tap zoom delay on interactive elements.

### Q5: Do modern browsers treat touchstart and touchmove on window/document as passive by default?
- A) No, default is always false
- B) Yes, Chrome and modern browsers default touchstart/touchmove on document and window to passive: true for performance
- C) Only in desktop browsers
- D) Only in Firefox
**Answer:** B
**Explanation:** To prevent mobile scrolling jank across the web, modern versions of Chrome, Safari, and Edge automatically default `touchstart` and `touchmove` on `window` and `document` to passive.
