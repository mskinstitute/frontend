# requestAnimationFrame & Smooth Animations in Modern JavaScript

Creating fluid visual animations in web applications requires synchronizing JavaScript execution with the display hardware's vertical synchronization (**V-Sync**). Using `setInterval` or `setTimeout` for animations causes frame drops, stuttering, and wasted CPU cycles. **`requestAnimationFrame()`** is the browser's native API for high-performance visual animations.

---

## 1. Why `setTimeout` & `setInterval` Fail at Animations

Most computer and mobile displays refresh at **60Hz** (once every **16.67ms**) or **120Hz** (once every **8.33ms**).

```
Display V-Sync (Every 16.67ms):
  │               │               │               │
  ▼               ▼               ▼               ▼

setTimeout(fn, 16) (Misaligned with Display Refresh!):
      ●                ●                ●               ●
  (Result: Frames are dropped or drawn twice, causing noticeable stutter / jank!)
```

### Flaws of Timer-Based Animations:
1. **Misaligned with Hardware V-Sync:** Timers fire independently of screen refresh cycles.
2. **Continues in Background Tabs:** `setInterval` keeps running even when the user switches tabs, draining laptop battery and mobile CPU!
3. **Timer Throttling:** Browsers throttle `setTimeout` to 1,000ms in inactive tabs.

---

## 2. The `requestAnimationFrame` Mechanics

`window.requestAnimationFrame(callback)`:
1. Fires **immediately before the browser's next screen repaint**, perfectly in sync with V-Sync.
2. **Automatically pauses** when the browser tab is minimized or inactive, conserving battery.
3. Automatically passes a high-resolution DOMHighResTimeStamp (`performance.now()`) to the callback.

```javascript
let startTime = null;
const box = document.querySelector('#animated-box');
const DURATION = 1500; // 1.5 seconds

function animate(currentTime) {
  if (!startTime) startTime = currentTime;
  const elapsed = currentTime - startTime;

  // Calculate normalized progress (0.0 to 1.0)
  const progress = Math.min(elapsed / DURATION, 1);

  // Easing function (Ease-out cubic)
  const easeOut = 1 - Math.pow(1 - progress, 3);

  // Translate element using GPU transform
  const x = easeOut * 400; // Move 400px
  box.style.transform = `translate3d(${x}px, 0, 0)`;

  // Continue loop until complete
  if (progress < 1) {
    requestAnimationFrame(animate); // Schedule next frame
  } else {
    console.log('Animation completed at 60/120 FPS!');
  }
}

// Start animation loop
requestAnimationFrame(animate);
```

---

## 3. Canceling Animations: `cancelAnimationFrame()`

To stop an in-flight animation loop (e.g. on user click, modal close, or component unmount):

```javascript
let animationId = null;

function startLoop() {
  animationId = requestAnimationFrame(gameLoop);
}

function stopLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
```

---

## 4. Physics Animation Loop Pattern (Delta Time)

To ensure game physics and animations run at the **exact same speed on 60Hz, 120Hz, and 144Hz monitors**, always calculate **Delta Time ($\Delta t$)**:

```javascript
let lastFrameTime = performance.now();
let playerX = 0;
const SPEED = 200; // 200 pixels per second

function gameLoop(now) {
  const dt = (now - lastFrameTime) / 1000; // Delta time in seconds
  lastFrameTime = now;

  // Position updates based on real elapsed time, NOT frame rate!
  playerX += SPEED * dt;
  playerElement.style.transform = `translate3d(${playerX}px, 0, 0)`;

  requestAnimationFrame(gameLoop);
}
```

---

## Practice Quiz

### Q1: What is the primary advantage of requestAnimationFrame over setTimeout(fn, 16)?
- A) It runs in Node.js
- B) It synchronizes execution directly with the display hardware V-Sync refresh cycle and pauses when the tab is hidden
- C) It converts CSS to WebAssembly
- D) It uses less memory than an empty array
**Answer:** B
**Explanation:** `requestAnimationFrame` aligns callbacks with the monitor's refresh cycle and automatically suspends execution when the tab is inactive, eliminating frame stutter and saving power.

### Q2: What parameter is automatically provided by the browser to the requestAnimationFrame callback function?
- A) An Event object
- B) A high-precision timestamp (DOMHighResTimeStamp) representing the current time in milliseconds
- C) The window innerWidth
- D) An ArrayBuffer
**Answer:** B
**Explanation:** The browser passes a high-resolution timestamp (equivalent to `performance.now()`) measuring fractional milliseconds since document creation.

### Q3: How do you cancel an animation loop initiated by requestAnimationFrame?
- A) clearInterval(id)
- B) cancelAnimationFrame(id)
- C) clearTimeout(id)
- D) stopAnimation()
**Answer:** B
**Explanation:** `cancelAnimationFrame(requestId)` cancels the scheduled animation frame request identified by the return handle.

### Q4: Why is "Delta Time" (elapsed time between frames) used in professional animation and gaming loops?
- A) To compress image assets
- B) To ensure movement speed is consistent across displays with different refresh rates (e.g. 60Hz vs 120Hz vs 144Hz)
- C) To prevent CORS errors
- D) To bypass strict mode
**Answer:** B
**Explanation:** Multiplying velocities by delta time ($\Delta t$) guarantees that objects traverse identical distances per second regardless of whether the user has a 60Hz or 144Hz display.

### Q5: What happens to requestAnimationFrame loops when the user switches to a different browser tab?
- A) The loop speeds up
- B) The browser automatically pauses callbacks, dropping CPU and battery consumption to near zero
- C) It throws a RangeError
- D) The tab crashes
**Answer:** B
**Explanation:** Browsers throttle or completely pause `requestAnimationFrame` for inactive tabs, preventing unnecessary CPU and GPU usage.
