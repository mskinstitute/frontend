---
id: keyframes-deep-dive-animation-choreography
slug: keyframes-deep-dive-animation-choreography
course: css-for-advanced
chapter: Mastering Animations
topic: "@keyframes Deep Dive: Complex Choreography and Multi-Stage Timelines"
difficulty: Advanced
readingTime: 14
order: 7
keywords: ["css keyframes", "animation choreography", "animation-fill-mode", "animation-play-state", "multi-stop keyframes", "advanced css animation"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# @keyframes Deep Dive: Complex Choreography and Multi-Stage Timelines

Think of an Indian school's Annual Day cultural performance. A classical dance routine or theatrical play is not just an abrupt switch from "start" to "end." Instead, the choreographer plans exact milestones across the musical soundtrack:
- At `0%`: The curtains rise; performers stand motionless in position.
- At `25%`: Dancers glide across to stage left.
- At `50%`: The tempo peaks; acrobatic turns take center stage.
- At `75%`: Dancers regroup in a central pyramid formation.
- At `100%`: The final grand salute as the audience applauds.

In CSS, the `@keyframes` rule is your master director's script. In this chapter, we will master **multi-stop milestone timelines, chaining multiple animation tracks simultaneously, mastering `animation-fill-mode`, and controlling playback states** directly through CSS.

---

## 1. Multi-Stage Timeline Architecture

While beginner CSS tutorials often rely on simple `from` (`0%`) and `to` (`100%`) transitions, professional motion design requires non-linear, multi-milestone timelines:

```
+-------------------------------------------------------------------------+
|                  THE MULTI-STAGE @KEYFRAMES TIMELINE                    |
+-------------------------------------------------------------------------+

  0%           25%                 50%                 75%           100%
  [REST] ----> [LIFT & TILT] ----> [SCALE EXPAND] ---> [ROTATE] ---> [RESTORE]
    |                |                   |               |              |
    v                v                   v               v              v
  scale(1)     translateY(-20px)    scale(1.15)      rotate(5deg)    scale(1)
               rotate(-4deg)        box-shadow glow                  translateY(0)
```

```css
@keyframes hero-entrance {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  40% {
    opacity: 1;
    transform: translateY(-8px) scale(1.02); /* Slight overshoot */
  }
  70% {
    transform: translateY(3px) scale(0.99);  /* Settling bounce */
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);       /* Rest position */
  }
}
```

By adding a gentle overshoot at `40%` and a tiny settle at `70%`, animations feel organic, lively, and physical rather than mechanical.

---

## 2. Decoded: The Crucial `animation-fill-mode`

One of the most frequent beginner complaints is:
> *"My element animated into place, but as soon as the animation finished, it snapped violently back to its ugly starting position!"*

This behavior is dictated by `animation-fill-mode`:

| Value | Before Animation Starts (During Delay) | After Animation Completes |
| :--- | :--- | :--- |
| `none` (Default) | Element retains default CSS styles | Element snaps back immediately to default CSS styles |
| `forwards` | Element retains default CSS styles | **Element permanently freezes at the final keyframe (`100%`)!** |
| `backwards` | **Element immediately applies the `0%` keyframe styles during delay** | Element snaps back to default CSS styles |
| `both` | **Applies `0%` styles during delay** | **Freezes at `100%` styles after completion** |

```css
/* Golden Standard for Entrance Animations: */
.animated-card {
  animation: hero-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  /*
    1. 'both' ensures that during the 0.3s delay, opacity is 0 (from 0% keyframe).
    2. After 0.8s finishes, the card stays locked at 100% styles without snapping!
  */
}
```

---

## 3. Simultaneous Multi-Track Animations

An element is not limited to a single animation. You can compose complex behaviors by chaining **multiple comma-separated animations** on the same selector, each running on its own independent timeline, duration, and easing function:

```css
/* An animated floating student notification badge */
.notification-badge {
  /* Track 1: Gentle continuous floating up and down (3s) */
  /* Track 2: Rhythmic pulsating glow (1.5s) */
  animation: 
    gentle-float 3s ease-in-out infinite alternate,
    pulse-glow 1.5s ease-in-out infinite alternate;
}

@keyframes gentle-float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

@keyframes pulse-glow {
  0% { box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2); }
  100% { box-shadow: 0 12px 28px rgba(59, 130, 246, 0.55); }
}
```

---

## 4. Interactive Control: `animation-play-state`

Did you know you can pause and resume running CSS animations without resetting their timer? The `animation-play-state` property accepts `running` or `paused`.

This is ideal for school news tickers, rotating banners, or carousel sliders where students hover to pause the movement:

```css
.school-news-ticker {
  display: flex;
  white-space: nowrap;
  animation: marquee-scroll 20s linear infinite;
}

/* Pause the scrolling text immediately when a student hovers or focuses! */
.school-news-ticker:hover,
.school-news-ticker:focus-within {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## 5. Direction Cycling: `alternate` and `alternate-reverse`

By default, an infinite animation abruptly jumps from `100%` back to `0%` every cycle. Setting `animation-direction: alternate;` creates smooth, unbroken pendulums:

```
+-------------------------------------------------------------------------+
|                  NORMAL VS ALTERNATE ANIMATION CYCLES                   |
+-------------------------------------------------------------------------+

  normal:
  [0% --------> 100%] JUMP [0% --------> 100%] JUMP [0% --------> 100%]
  (Jarring reset!)

  alternate:
  [0% --------> 100%] <-------- [0% --------> 100%] <-------- [0%]
  (Graceful, continuous, frictionless looping!)
```

```css
.pendulum-swing {
  animation: swing 2s ease-in-out infinite alternate;
}

@keyframes swing {
  0% { transform: rotate(-25deg); }
  100% { transform: rotate(25deg); }
}
```

---

## 6. CSS Variables Inside Keyframes

In modern CSS, you can inject CSS custom properties directly inside `@keyframes`. This allows you to write a **single reusable keyframe definition** that behaves differently across various components:

```css
@keyframes dynamic-slide {
  0% {
    transform: translateY(var(--slide-distance, 30px));
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card 1 slides 20px */
.card-short {
  --slide-distance: 20px;
  animation: dynamic-slide 0.6s ease forwards;
}

/* Card 2 slides 60px */
.card-long {
  --slide-distance: 60px;
  animation: dynamic-slide 0.6s ease forwards;
}
```

---

## 7. Do's and Don'ts

| Practice | Bad Approach | Good Approach | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Animation Snap-back** | Leaving `animation-fill-mode` omitted on one-shot entrance animations | Setting `animation-fill-mode: forwards;` or `both;` | Prevents the element from flashing back to hidden/shifted state upon completion. |
| **Hover Pausing** | Removing the animation class on hover (which resets the timer to 0) | Setting `animation-play-state: paused;` | Freezes the animation gracefully in place; un-freezes seamlessly upon mouse leave. |
| **Smooth Looping** | Leaving infinite linear loops to snap abruptly | Using `animation-direction: alternate;` with `ease-in-out` | Creates continuous, organic visual rhythms without jarring jump-cuts. |
| **Keyframe Duplication** | Copying 10 identical `@keyframes` with slight pixel variations | Using CSS custom properties (`var(--distance)`) inside one master `@keyframes` | Drastically reduces stylesheet weight and improves maintainability. |

---

## 8. Quick Revision Summary Cheat Sheet

- **Multi-stop Timelines**: Use intermediate percentages (`25%`, `50%`, `75%`) with small overshoots for realistic physical weight.
- **`animation-fill-mode: both`**: Applies the `0%` styles during delay AND freezes the element at `100%` styles upon completion.
- **Multi-track Chaining**: Chain multiple independent animations separated by commas (`animation: float 3s infinite, glow 1.5s infinite;`).
- **`animation-play-state`**: Toggle between `running` and `paused` for user interaction controls.
- **Dynamic Keyframes**: Feed CSS custom properties (`var(--custom)`) into `@keyframes` for customizable motion paths.

---

# Multiple Choice Questions

### 1. Which `animation-fill-mode` ensures an element retains its final `100%` keyframe styles after the animation finishes playing?
A. `none`
B. `backwards`
C. `forwards`
D. `paused`
**Answer:** C
**Explanation:** `animation-fill-mode: forwards` instructs the browser to persist the computed styles from the final keyframe after the animation finishes.

---

### 2. What is the effect of setting `animation-fill-mode: both;` when an animation also has an `animation-delay: 1s;`?
A. The animation is canceled
B. The element applies the `0%` keyframe styles immediately during the 1-second delay, and freezes at `100%` styles after completion
C. The element blinks twice before starting
D. The delay is multiplied by 2
**Answer:** B
**Explanation:** `both` combines `backwards` (applying `0%` styles during the delay period) and `forwards` (retaining `100%` styles after the animation ends).

---

### 3. How can you pause an ongoing marquee or carousel CSS animation when a student hovers their mouse over it?
A. `animation: none;`
B. `animation-play-state: paused;`
C. `animation-duration: 0s;`
D. `animation-direction: stop;`
**Answer:** B
**Explanation:** `animation-play-state: paused` halts the animation at its current frame. When hover ends, setting it back to `running` resumes playback seamlessly.

---

### 4. What does `animation-direction: alternate;` do during an infinite animation?
A. It changes the background color randomly
B. It alternates between playing forward (`0% -> 100%`) on odd iterations and backwards (`100% -> 0%`) on even iterations
C. It plays the animation twice as fast
D. It skips every second keyframe
**Answer:** B
**Explanation:** `alternate` causes the animation to reverse direction upon reaching the end, creating a smooth pendulum-like loop without abrupt restarts.

---

### 5. How do you apply two independent animations (e.g., `spin` and `pulse`) to the same HTML element?
A. Wrap the element in a second container
B. Separate the two animation declarations with a comma: `animation: spin 4s linear infinite, pulse 1.5s ease alternate;`
C. Write two separate `style` tags
D. CSS prohibits applying multiple animations to a single element
**Answer:** B
**Explanation:** CSS animations support comma-separated lists of animations, allowing multiple independent timeline tracks to run concurrently on the same element.

---

# Hands-on Practice Challenge

Build an interactive school announcement ticker with multi-stage pulsating glow and pause-on-hover capability.

### Requirements:
1. Create a notification pill card with an alert icon and headline.
2. Build a multi-stage `@keyframes pulse-alert` timeline that scales the card slightly at `50%` and emits an expanding emerald glow shadow.
3. Chain a secondary floating animation (`animation: float-pill 3s ease-in-out infinite alternate`).
4. Set `animation-play-state: paused;` on `:hover` so students can pause the floating effect while reading.

### Complete Solution:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keyframe Choreography Lab</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #090d16;
      padding: 24px;
      color: #ffffff;
    }

    /* 1. THE CHOREOGRAPHED NOTIFICATION CARD */
    .announcement-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      background: #1e293b;
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 18px 28px;
      border-radius: 50px;
      cursor: pointer;
      
      /* CHAINED DUAL-TRACK ANIMATION: Floating + Pulsing */
      animation: 
        float-card 3s ease-in-out infinite alternate,
        pulse-emerald 2s ease-in-out infinite;
    }

    /* PAUSE PLAYBACK ON HOVER */
    .announcement-card:hover {
      animation-play-state: paused;
      border-color: #10b981;
    }

    /* Track 1: Multi-stage Pulsating Glow Timeline */
    @keyframes pulse-emerald {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 0 25px 6px rgba(16, 185, 129, 0.25);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    /* Track 2: Gentle Vertical Floating Timeline */
    @keyframes float-card {
      0% {
        translate: 0 0;
      }
      100% {
        translate: 0 -14px;
      }
    }

    .pulse-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .text-content {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 1rem;
      font-weight: 800;
      color: #f8fafc;
    }

    .subtitle {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .hover-note {
      margin-top: 30px;
      font-size: 0.85rem;
      color: #64748b;
    }
  </style>
</head>
<body>

  <div class="announcement-card">
    <div class="pulse-dot"></div>
    <div class="text-content">
      <span class="title">CBSE Term-2 Exam Hall Tickets Released</span>
      <span class="subtitle">Click or hover to freeze animation and download PDF</span>
    </div>
  </div>

  <p class="hover-note">Notice how hovering pauses both the float and pulse animations seamlessly!</p>

</body>
</html>
```
