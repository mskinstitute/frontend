---
id: css-transitions-timing-functions-delays
slug: css-transitions-timing-functions-delays
course: css-for-intermediate
chapter: 9
topic: 9.1
title: "CSS Transitions: Timing Functions, Delays, and Smooth State Shifts"
description: Master CSS transitions for smooth UI state changes. Learn transition properties, timing functions (ease-in-out, cubic-bezier), transition delays, and how to use GPU-accelerated properties for 60fps performance.
difficulty: Intermediate
readingTime: 12
order: 25
keywords:
  - css transitions
  - timing functions
  - cubic-bezier
  - transition delay
  - gpu acceleration
  - smooth hover effects
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# CSS Transitions: Timing Functions, Delays, and Smooth State Shifts

When the Delhi Metro or Mumbai suburban train pulls out of a station, does it instantly snap from 0 km/h to 80 km/h in 1 millisecond? 
Of course not! If it did, every standing passenger would fly backward and tumble onto the floor. 

The train starts slowly (`ease-in`), accelerates smoothly across the track, and gently glides to a stop as it approaches the next platform (`ease-out`).

```
+-------------------------------------------------------------------------+
|                  THE METRO ACCELERATION ANALOGY                         |
|                                                                         |
|  Without CSS Transitions (Abrupt, Harsh, Broken):                       |
|  Normal State [ Blue Button ] ===(INSTANT 0.0s SNAP!)===> [ Red Button ]|
|  (Looks like a flickering bulb or glitching screen)                     |
|                                                                         |
|  With CSS Transitions (Silky, Natural, 60 FPS):                         |
|  Normal State [ Blue ] ---(Smooth 0.3s morphing)---> Hover State [ Red ]|
|  (Feels premium, tactile, and responsive to human touch)                |
+-------------------------------------------------------------------------+
```

In basic CSS, changing a property on `:hover` or `:focus` causes an abrupt instantaneous snap. In this tutorial, you will master **CSS Transitions** to breathe life, motion, and elegance into your user interfaces.

---

## 1. The 4 Anatomical Pillars of a Transition

To create a transition, CSS needs to know four specific parameters:

```css
.button {
  background-color: #2563eb;
  
  /* 1. Which property should smoothly morph? */
  transition-property: background-color, transform;
  
  /* 2. How long should the morph take? */
  transition-duration: 0.3s;
  
  /* 3. What acceleration curve should it follow? */
  transition-timing-function: ease-in-out;
  
  /* 4. How long should it wait before starting? */
  transition-delay: 0s;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}
```

### The Professional Shorthand:
In production web development, we combine all 4 properties into a single concise line:

```css
/* Syntax: transition: [property] [duration] [timing-function] [delay]; */
.button {
  transition: background-color 0.3s ease, transform 0.2s ease-out;
}
```

> **Crucial Rule:** Always declare the `transition` on the **base class** (`.button`), NOT on the `:hover` pseudo-class! Declaring it on the base ensures the element transitions smoothly both *when the mouse enters* AND *when the mouse leaves*. If declared only on `:hover`, the reverse animation snaps back abruptly!

---

## 2. Timing Functions: The Laws of Motion

The `transition-timing-function` governs how speed varies throughout the duration of the animation:

```
Speed
 ^
 |        .---.            ease-in-out (Smooth acceleration & deceleration)
 |       /     \
 |  ----+       +----      linear (Robotic constant speed, no acceleration)
 |
 |         .---------      ease-in (Starts slow, slams into the finish line)
 |
 |  ------.                ease-out (Explodes out of the gate, glides to a stop)
 +-------------------------> Time
```

| Timing Function | Real-World Motion | Best Use Case |
| :--- | :--- | :--- |
| **`ease`** *(default)* | Starts moderately, accelerates, slows down | General UI element morphs |
| **`linear`** | Unchanging mechanical conveyor belt speed | Color cycling, rotating loading spinners |
| **`ease-in`** | Heavy truck accelerating from a standstill | Elements exiting or sliding off the screen |
| **`ease-out`** | Passenger car braking to a gentle stop | Elements entering the screen or drawer menus |
| **`ease-in-out`** | High-speed express train between stations | Hover lifts, modal dialog reveals |
| **`cubic-bezier(x1, y1, x2, y2)`** | Custom mathematical physics curve | Bouncy elastic buttons, spring physics |

---

## 3. Animatable vs Non-Animatable Properties

Can you transition *everything* in CSS? **No!**
CSS can only transition properties that have intermediate numerical or chromatic values.

* **Animatable (Yes!):** `opacity` (0.0 to 1.0), `transform`, `color`, `background-color`, `border-radius`, `box-shadow`, `width`, `height`.
* **Non-Animatable (No!):** `display: none` to `display: block` (an element is either there or not; there is no 50% block), `font-family`, `visibility` (partially discreet).

> **Interview Favorite:** *"How do I smoothly animate a popup modal closing?"*  
> Never animate `display: none`! Animate `opacity: 0` and `transform: scale(0.95)`, paired with `pointer-events: none` to disable clicks when hidden!

---

## 4. Hardware Acceleration: The 60fps Golden Rule

Browsers render webpages using two different engines: the **CPU** (Main Layout Engine) and the **GPU** (Graphics Processor).

```
+------------------------------------+------------------------------------+
| BAD: CPU Layout Thrashing          | GOOD: GPU Hardware Accelerated     |
| (Triggers expensive recalculations)| (Composited directly on the GPU)   |
+------------------------------------+------------------------------------+
| `top: 20px`                        | `transform: translateY(20px)`      |
| `left: 50px`                       | `transform: translateX(50px)`      |
| `width: 300px`                     | `transform: scaleX(1.2)`           |
| `height: 200px`                    | `transform: scaleY(1.2)`           |
+------------------------------------+------------------------------------+
```

Whenever you want to move, scale, or fade an element on hover, **always use `transform` and `opacity`**. They run silky-smooth at 60 frames per second on mobile phones without battery drain or stuttering!

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Writing `transition: all 0.3s;` on every element | Specify exact properties: `transition: transform 0.2s, opacity 0.2s;` | `transition: all` degrades CPU performance by monitoring 100+ properties unnecessarily. |
| Declaring `transition` inside the `:hover` block | Declare `transition` on the base un-hovered selector | Prevents the animation from snapping back instantly when the cursor leaves. |
| Using long 2-second durations for simple buttons | Keep interactive UI transitions between `0.15s` and `0.3s` | Long transition durations make user interfaces feel laggy, unresponsive, and sluggish. |
| Animating `top`, `left`, or `margin` for hover lifts | Use `transform: translateY(-4px);` | `transform` uses GPU compositing, avoiding slow DOM reflow calculations. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **Shorthand Syntax**: `transition: property duration timing-function delay;`.
* **Base Placement**: Always place the transition rule on the parent base class, not the `:hover` pseudo-class.
* **Duration Rule**: Ideal micro-interactions last between `150ms` (0.15s) and `300ms` (0.3s). Anything above 500ms feels painfully slow.
* **`ease-out` for Entrances**: Decelerates naturally as elements land on screen.
* **GPU Performance**: Strictly prioritize `transform` (`translate`, `scale`, `rotate`) and `opacity` for butter-smooth 60fps animations.

---

# Multiple Choice Questions

### 1. Where should the `transition` property be declared to ensure a smooth animation both on hover entry and exit?
A. Inside the `:hover` pseudo-class rule
B. On the base un-hovered element rule
C. Inside the `@keyframes` block
D. On the HTML `<body>` tag
**Answer:** B
**Explanation:** Placing transition on the base selector applies the smooth interpolation both when entering the hover state and when reverting back to the normal state.

---

### 2. Which pair of CSS properties is hardware-accelerated by the GPU, ensuring smooth 60fps animations on mobile devices?
A. `width` and `height`
B. `top` and `left`
C. `transform` and `opacity`
D. `margin` and `padding`
**Answer:** C
**Explanation:** transform and opacity do not trigger browser layout reflow or repaint cycles; they are composited directly on the GPU for peak performance.

---

### 3. What is the recommended duration range for standard interactive UI hover effects (like buttons and cards)?
A. 1.5s to 3.0s
B. 0.15s to 0.3s (150ms - 300ms)
C. 5.0s to 10.0s
D. 0.001s
**Answer:** B
**Explanation:** Durations between 150ms and 300ms provide immediate, tactile feedback without frustrating users with perceptible lag.

---

### 4. Why does `transition: display 0.5s;` fail to smoothly fade an element in and out?
A. The display property only works in JavaScript
B. display is a discrete non-animatable property with no intermediate mathematical states between none and block
C. The duration is too short
D. It requires an -ms- prefix
**Answer:** B
**Explanation:** The browser cannot compute intermediate frames between display: none and display: block. Transitions require interpolatable numbers or colors.

---

### 5. Why is writing `transition: all 0.3s;` considered an anti-pattern in high-performance web development?
A. It throws a fatal CSS compiler error
B. It forces the browser engine to monitor and recalculate dozens of irrelevant properties, triggering unnecessary layout repaints
C. It only works on desktops
D. It deletes hover states
**Answer:** B
**Explanation:** transition: all forces the rendering engine to track every possible style property on that element, degrading scroll and animation performance.

---

## 7. Hands-on Practice Challenge: School Interactive Action Suite

Build a responsive, polished School Action Button and Interactive Card Suite:
1. An action button that lifts slightly (`transform: translateY(-2px)`) and intensifies its shadow on hover with GPU acceleration.
2. A subtle ripple glow border effect that transitions smoothly over `0.25s`.
3. A school admission notice card that reveals a hidden action footer on hover with smooth opacity and vertical translation!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>School Action Suite - CSS Transitions</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
      gap: 32px;
    }

    /* ========================================================= */
    /* 1. THE GPU-ACCELERATED BUTTON                             */
    /* ========================================================= */
    .btn-portal {
      background-color: #2563eb;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
      padding: 14px 28px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);

      /* Silky Smooth Transition declared on BASE class! */
      transition: transform 0.2s ease, 
                  background-color 0.2s ease, 
                  box-shadow 0.2s ease;
    }

    /* Hover State */
    .btn-portal:hover {
      background-color: #1d4ed8;
      transform: translateY(-3px); /* GPU Hover Lift */
      box-shadow: 0 10px 20px -3px rgba(37, 99, 235, 0.5);
    }

    /* Active (Click Down) State */
    .btn-portal:active {
      transform: translateY(-1px); /* Tactile press feedback */
      box-shadow: 0 4px 8px -2px rgba(37, 99, 235, 0.4);
    }

    /* ========================================================= */
    /* 2. THE INTERACTIVE CARD WITH REVEAL FOOTER                */
    /* ========================================================= */
    .notice-card {
      width: 100%;
      max-width: 400px;
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

      /* Card Hover Lift Transition */
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                  border-color 0.25s ease,
                  box-shadow 0.25s ease;
    }

    .notice-card:hover {
      transform: translateY(-5px);
      border-color: #38bdf8;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.6);
    }

    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #38bdf8;
      background-color: rgba(56, 189, 248, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }

    .notice-title {
      font-size: 1.25rem;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .notice-desc {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    /* Revealing Action Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #334155;
      padding-top: 12px;
      color: #64748b;
      font-size: 0.85rem;

      /* Smooth Opacity & Shift */
      transition: color 0.2s ease;
    }

    .notice-card:hover .card-footer {
      color: #38bdf8; /* Illuminates on card hover */
    }
  </style>
</head>
<body>

  <!-- Interactive Action Button -->
  <button class="btn-portal">Enter Student Examination Portal &rarr;</button>

  <!-- Interactive Notice Card -->
  <div class="notice-card">
    <span class="badge">Session 2026-27</span>
    <h3 class="notice-title">Science Olympiad Registrations</h3>
    <p class="notice-desc">All students of classes 9th to 12th interested in participating in the Indian National Science Olympiad must register their names with the physics department before Friday.</p>
    <div class="card-footer">
      <span>Deadline: 20th Oct</span>
      <strong>Apply Now &rarr;</strong>
    </div>
  </div>

</body>
</html>
```
