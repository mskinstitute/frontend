---
id: css-animations-keyframes-and-performance
slug: css-animations-keyframes-and-performance
course: css-for-intermediate
chapter: 9
topic: 9.2
title: "CSS Keyframe Animations: Syntax, Infinite Loops, and Performance"
description: Master CSS keyframe animations. Learn the @keyframes syntax, multi-stage waypoints (0% to 100%), infinite loops, animation-fill-mode, and respecting prefers-reduced-motion for accessibility.
difficulty: Intermediate
readingTime: 13
order: 26
keywords:
  - css animations
  - keyframes
  - infinite animation
  - animation-fill-mode
  - prefers-reduced-motion
  - loading spinner
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# CSS Keyframe Animations: Syntax, Infinite Loops, and Performance

During boring lectures in school, have you ever drawn a stick figure cricket batsman in the bottom corner of your textbook?
* On page 1 (**`0%`**): The batsman raises his bat.
* On page 15 (**`30%`**): The bowler releases the ball.
* On page 30 (**`60%`**): The bat strikes the ball with a loud crack!
* On page 50 (**`100%`**): The ball flies over the boundary ropes for a massive six!

When you hold the textbook edges and flip the pages rapidly with your thumb, the individual still drawings magically blend into a continuous, moving cartoon movie!

```
+-------------------------------------------------------------------------+
|                  THE FLIPBOOK OF CSS KEYFRAME ANIMATION                 |
|                                                                         |
|  Transition vs Animation:                                               |
|  * Transition: Needs a trigger (like hover) to morph from A to B.       |
|  * Animation:  Starts automatically, visits 10 different waypoints,    |
|                and can loop infinitely forever!                         |
|                                                                         |
|  @keyframes swingBat {                                                  |
|     0%   { transform: rotate(0deg); }                                  |
|    50%   { transform: rotate(-45deg); } <--- Intermediate Waypoints!   |
|   100%   { transform: rotate(90deg); }                                 |
|  }                                                                      |
+-------------------------------------------------------------------------+
```

While transitions are great for simple two-state hover shifts, **CSS Animations with `@keyframes`** give you director-level control over complex, multi-stage, continuous choreographies. In this tutorial, you will master keyframe syntax, infinite loops, and vital accessibility best practices.

---

## 1. Defining the Script: The `@keyframes` Rule

Before an element can animate, you must write the animation script using the `@keyframes` at-rule, followed by an animation name:

```css
/* Using from / to (2 stages) */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Using Percentages (Multi-stage choreography) */
@keyframes pulseGlow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 14px rgba(37, 99, 235, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}
```

---

## 2. Attaching the Animation to an Element

Once your keyframe script is defined, attach it to your target HTML element using the animation properties:

```css
.pulse-badge {
  /* 1. Which keyframe script to run? */
  animation-name: pulseGlow;
  
  /* 2. How long does one full loop take? */
  animation-duration: 2s;
  
  /* 3. Speed acceleration curve */
  animation-timing-function: ease-in-out;
  
  /* 4. How many times should it repeat? */
  animation-iteration-count: infinite; /* or a number like 3 */
  
  /* 5. Direction of playback */
  animation-direction: normal; /* or alternate, reverse */
}
```

### The Professional Animation Shorthand
In production, we write all parameters in one clean declaration:

```css
/* Syntax: animation: name duration timing-function delay iteration-count direction fill-mode; */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

---

## 3. The Enigma of `animation-fill-mode`

Have you ever created an entrance animation where an element slides into view, but as soon as the animation ends, it **snaps back to its original position** or disappears?

That happens because of **`animation-fill-mode`**!

```
Timeline: [ Before Animation ] ===> [ Playing Animation ] ===> [ After Animation ]
none:     Original CSS               Keyframes                 Snaps back to Original!
forwards: Original CSS               Keyframes                 FREEZES at 100% frame!
backwards:Applies 0% during delay   Keyframes                 Snaps back to Original!
both:     Applies 0% during delay   Keyframes                 FREEZES at 100% frame!
```

```css
/* Element stays permanently in its final animated position! */
.slide-in-card {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0); /* FREEZES HERE thanks to forwards! */
  }
}
```

> **The Golden Rule:** If you want an entrance animation to stay on screen when finished, always specify **`forwards`**!

---

## 4. Web Accessibility: `prefers-reduced-motion`

Not all users enjoy spinning logos or bouncing cards. For people with vestibular motion disorders, spinning animations can cause dizziness, nausea, and headaches.

Modern operating systems (Windows, macOS, iOS, Android) have a setting called **"Reduce Motion"**. You must always respect this setting in professional web design:

```css
/* Accessible Motion Guard */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This single 8-line snippet ensures that users who requested reduced motion get instant, calm transitions without motion sickness!

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Forgetting `animation-fill-mode: forwards` on entrance animations | Add `forwards` to entrance keyframes | Prevents elements from abruptly popping back to invisible or displaced states. |
| Animating `width`, `height`, or `margin` in continuous loops | Strictly animate `transform` and `opacity` | Non-GPU properties trigger heavy continuous layout recalculations that drain phone batteries. |
| Making crucial content rely on an infinite animation to be readable | Use subtle ambient indicators (like live status pulses) | Constant vigorous movement distracts users from reading core content. |
| Ignoring the `prefers-reduced-motion` accessibility standard | Provide static fallbacks for motion-sensitive users | Ensures WCAG 2.1 AA accessibility compliance for enterprise websites. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`@keyframes name { ... }`**: Defines the animation blueprint using percentages (`0%`, `50%`, `100%`).
* **`animation-iteration-count: infinite`**: Keeps the animation cycling forever without stopping (great for spinners and tickers).
* **`animation-direction: alternate`**: Bounces the animation back and forth (0% $\to$ 100% $\to$ 0%).
* **`animation-fill-mode: forwards`**: Locks the element into its final keyframe state after the animation finishes.
* **`prefers-reduced-motion`**: Accessible media query to mute or neutralize animations for users with motion sensitivity.

---

# Multiple Choice Questions

### 1. Which CSS property value forces an element to stay frozen in its final keyframe state after the animation finishes?
A. `animation-iteration-count: stop`
B. `animation-fill-mode: forwards`
C. `animation-play-state: frozen`
D. `animation-direction: static`
**Answer:** B
**Explanation:** animation-fill-mode: forwards ensures that the element retains the calculated style values from the last keyframe encountered during execution.

---

### 2. What is the fundamental difference between CSS Transitions and CSS Animations?
A. Transitions only work in Firefox, while animations work everywhere
B. Transitions require a state trigger (like :hover) to interpolate between two states, while Animations run automatically across multiple intermediate waypoints
C. Transitions can loop infinitely, but Animations cannot
D. There is no difference; they are exact aliases
**Answer:** B
**Explanation:** Transitions interpolate between two states when triggered, whereas Animations can execute automatically, chain multi-step keyframe sequences, and loop continuously.

---

### 3. Which value of `animation-iteration-count` makes an animation loop continuously without ever stopping?
A. `loop`
B. `infinite`
C. `continuous`
D. `forever`
**Answer:** B
**Explanation:** The keyword infinite instructs the browser to repeat the animation sequence endlessly.

---

### 4. Which media query allows developers to disable or tone down vigorous animations for users with vestibular balance disorders?
A. `@media (screen: static)`
B. `@media (prefers-reduced-motion: reduce)`
C. `@media (accessibility: high)`
D. `@media (no-animation)`
**Answer:** B
**Explanation:** prefers-reduced-motion detects if the user has enabled the "Reduce Motion" accessibility preference in their operating system.

---

### 5. In a keyframe rule, which two properties can be animated continuously with 60fps GPU acceleration?
A. `width` and `left`
B. `transform` and `opacity`
C. `border-width` and `margin`
D. `font-size` and `padding`
**Answer:** B
**Explanation:** transform and opacity are handled directly by the GPU compositing thread, avoiding expensive layout reflows and repaints.

---

## 7. Hands-on Practice Challenge: Live Admission Ticker & Radar Pulse

Build an animated School Admission Status component:
1. A glowing green **Live Radar Pulse** badge that ripples outwards continuously using `transform: scale()` and `opacity` with `animation-iteration-count: infinite`.
2. A continuous, rotating **Loading Spinner** for real-time seat availability updates.
3. Full accessibility support using `@media (prefers-reduced-motion: reduce)`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Live Admission Status - CSS Keyframes</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #020617;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }

    .status-card {
      width: 100%;
      max-width: 420px;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
    }

    /* 1. THE RADAR PULSE BADGE */
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #22c55e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .pulse-dot-wrapper {
      position: relative;
      width: 12px;
      height: 12px;
    }

    .pulse-dot-center {
      position: absolute;
      inset: 2px;
      background-color: #22c55e;
      border-radius: 50%;
    }

    /* Expanding Ripple Ring */
    .pulse-dot-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background-color: rgba(34, 197, 94, 0.6);
      animation: radarRipple 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    }

    @keyframes radarRipple {
      0% {
        transform: scale(0.9);
        opacity: 0.9;
      }
      100% {
        transform: scale(2.8);
        opacity: 0;
      }
    }

    /* 2. THE ROTATING SPINNER */
    .status-box {
      background-color: #1e293b;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid #334155;
    }

    .loading-spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(56, 189, 248, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      flex-shrink: 0;
      animation: spinForever 1s linear infinite;
    }

    @keyframes spinForever {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .status-text h4 {
      font-size: 0.95rem;
      color: #ffffff;
      margin-bottom: 2px;
    }

    .status-text p {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    /* 3. ACCESSIBILITY OVERRIDE */
    @media (prefers-reduced-motion: reduce) {
      .pulse-dot-ring,
      .loading-spinner {
        animation: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="status-card">
    <div class="header-row">
      <h3 class="card-title">Admission Desk Live Feed</h3>
      <div class="live-indicator">
        <div class="pulse-dot-wrapper">
          <div class="pulse-dot-ring"></div>
          <div class="pulse-dot-center"></div>
        </div>
        Live
      </div>
    </div>

    <div class="status-box">
      <div class="loading-spinner"></div>
      <div class="status-text">
        <h4>Synchronizing Seat Allocations</h4>
        <p>Class 11 Science Stream &bull; 8 seats remaining</p>
      </div>
    </div>
  </div>

</body>
</html>
```
