# Transitions, Smooth Transforms, Scale & Custom Keyframe Animations

Delightful micro-interactions and smooth state changes separate amateur websites from polished, professional web applications. Tailwind CSS provides hardware-accelerated **transitions**, **2D/3D transforms**, and built-in **CSS animations** without writing cumbersome keyframes.

---

## 1. CSS Transitions: Duration, Timing & Properties

To animate a state change (such as hover background color), add the `transition` class along with duration and easing:

```html
<!-- Smooth Hover Card -->
<div class="bg-white hover:bg-slate-50 p-6 rounded-xl border transition-colors duration-300 ease-in-out">
  Hover over me for a smooth color fade!
</div>
```

| Property | Tailwind Class | Description |
| :--- | :--- | :--- |
| **Property** | `transition-all` | Transitions all animatable CSS properties |
| | `transition-colors` | Transitions color, background-color, border-color |
| | `transition-transform`| Hardware-accelerated transforms (scale, rotate, translate) |
| | `transition-opacity`  | Smooth fade-in and fade-out |
| **Duration** | `duration-150` / `duration-300` / `duration-500` | 150ms, 300ms, 500ms animation duration |
| **Easing**   | `ease-linear` / `ease-in` / `ease-out` / `ease-in-out` | Timing bezier curve |

---

## 2. Transforms: Scale, Rotate & Translate

Tailwind enables hardware-accelerated transforms directly through class names:

```html
<!-- Scale & Lift Card on Hover -->
<div class="transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white p-6">
  <h3 class="font-bold">Next.js 15 Masterclass</h3>
</div>

<!-- Rotate Icon on Click -->
<button class="flex items-center gap-2 group">
  <span>Toggle Details</span>
  <svg class="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-width="2" d="M19 9l-7 7-7-7"/>
  </svg>
</button>
```

---

## 3. Built-in Keyframe Animations

Tailwind includes 4 production-ready animations out of the box:

```html
<!-- 1. Ping: Notification radar pulse -->
<span class="animate-ping h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>

<!-- 2. Pulse: Skeleton loading state -->
<div class="animate-pulse flex space-x-4">
  <div class="rounded-full bg-slate-200 h-10 w-10"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="h-2 bg-slate-200 rounded"></div>
    <div class="h-2 bg-slate-200 rounded w-5/6"></div>
  </div>
</div>

<!-- 3. Spin: Loading spinner -->
<svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
</svg>

<!-- 4. Bounce: Attention grabber arrow -->
<svg class="animate-bounce w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
</svg>
```

---

# Multiple Choice Questions

### 1. Which Tailwind utility class is commonly used to create shimmering skeleton loading screens?
A. `animate-spin`
B. `animate-pulse`
C. `animate-ping`
D. `animate-bounce`
**Answer:** B
**Explanation:** `animate-pulse` fades an element's opacity in and out gently, the universal design pattern for skeleton placeholders while data loads.
---

### 2. What is the benefit of using `transition-transform` instead of `transition-all` when animating element scale or position?
A. `transition-transform` avoids animating layout properties like margin or width, allowing the GPU compositor to render animations smoothly at 60 FPS without layout recalculation.
B. `transition-transform` only works on Mac computers.
C. `transition-all` is deprecated in CSS3.
D. `transition-transform` automatically centers elements.
**Answer:** A
**Explanation:** Animating `transform` (translate, scale, rotate) avoids triggering browser layout recalculation and paint cycles, enabling hardware-accelerated 60 FPS animations.
---

### 3. Which class combination lifts an element 8px upward when hovered?
A. `hover:up-8`
B. `hover:-translate-y-2`
C. `hover:lift-8`
D. `hover:top-[-8px]`
**Answer:** B
**Explanation:** `-translate-y-2` shifts the element upward along the Y-axis by 0.5rem (8px).
---

### 4. How long does an animation run when styled with `duration-300`?
A. 3 seconds
B. 300 milliseconds (0.3 seconds)
C. 30 frames
D. 300 minutes
**Answer:** B
**Explanation:** In Tailwind CSS, duration numbers represent milliseconds (`duration-300` = 300ms).
---

### 5. What does the `animate-spin` utility class do?
A. Flips an image horizontally.
B. Rotates an element 360 degrees in an infinite linear loop, standard for loading spinners.
C. Shakes an input field on validation failure.
D. Expands an element to full screen.
**Answer:** B
**Explanation:** `animate-spin` applies `animation: spin 1s linear infinite;`, creating continuous rotation.
---