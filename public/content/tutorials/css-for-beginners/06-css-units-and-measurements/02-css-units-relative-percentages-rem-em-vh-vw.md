---
id: css-units-relative-percentages-rem-em-vh-vw
slug: css-units-relative-percentages-rem-em-vh-vw
course: css-for-beginners
chapter: 6
topic: 6.2
title: "Relative Units: Percentages (%), REM, EM, VH, and VW"
description: Master the 5 game-changing relative units in CSS - %, rem, em, vh, and vw with rubber band, school rulebook, and cinema screen analogies for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 10
order: 18
keywords:
  - css relative units
  - rem vs em
  - vh vw viewport
  - percentages css
  - responsive units
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Relative Units: Percentages (%), REM, EM, VH, and VW

In the previous lesson, you saw that absolute units (like `px`) are rigid and fixed. But the internet is accessed on thousands of different devices: from a small 360px smartphone in your pocket to a 1080px laptop, and even a 4K living room smart TV! 📱💻📺

How can a single website look incredible on all of them?

The answer is **Relative Units**! Unlike a rigid wooden ruler, relative units stretch and contract like a flexible rubber band based on the size of their parent element or the user's screen.

In this lesson, you will master the 5 core relative units:
1. **Percentages (`%`)**
2. **`rem` (Root EM)**
3. **`em` (Element EM)**
4. **`vw` (Viewport Width)**
5. **`vh` (Viewport Height)**

---

# The Everyday Mental Models 🧠

```text
+-------------------------------------------------------------------------+
|                  THE 5 RELATIVE UNITS AT A GLANCE                       |
+-------------------------------------------------------------------------+
| 1. % (Percentage)   --> POCKET MONEY SHARING                            |
|                         Relative to the size of the PARENT container.   |
|                         (If parent is 800px, 50% = 400px).              |
|                                                                         |
| 2. rem (Root EM)    --> THE SCHOOL PRINCIPAL'S MASTER RULEBOOK          |
|                         Relative to the ROOT <html> font size (16px).   |
|                         (1rem = 16px, 2rem = 32px everywhere on page).  |
|                                                                         |
| 3. em (Element EM)  --> THE CLASSROOM TEACHER'S LOCAL RULE              |
|                         Relative to its CURRENT element or parent font. |
|                                                                         |
| 4. vw (Viewport W)  --> CINEMA SCREEN WIDTH                             |
|                         1vw = 1% of the total browser window width.     |
|                                                                         |
| 5. vh (Viewport H)  --> CINEMA SCREEN HEIGHT                            |
|                         1vh = 1% of the total browser window height.    |
|                         (100vh = EXACTLY 1 full screen!).               |
+-------------------------------------------------------------------------+
```

---

# 1. Percentages (`%`)

Percentages are always calculated relative to the **parent element's** dimensions.

### Example: Multi-Column Layout
```html
<div class="parent-box">
  <div class="sidebar">Sidebar (30%)</div>
  <div class="main-area">Main Area (70%)</div>
</div>
```

```css
.parent-box {
  width: 1000px;
}

.sidebar {
  width: 30%; /* 30% of 1000px = 300px */
}

.main-area {
  width: 70%; /* 70% of 1000px = 700px */
}
```

If the parent box shrinks to `600px` on a smaller screen, the sidebar automatically shrinks to `180px` (`30% of 600`) and the main area shrinks to `420px`. No broken code!

---

# 2. `rem` (Root EM — The Modern Standard ⭐)

The letters **rem** stand for **Root EM**.  
It is relative exclusively to the **root element** of your webpage (`<html>`).

By default, all web browsers set root font size to **`16px`**:

```text
  1rem   =   1  x  16px   =   16px
  1.5rem = 1.5  x  16px   =   24px
  2rem   =   2  x  16px   =   32px
  0.5rem = 0.5  x  16px   =    8px
```

### Why Developers Love `rem` for Fonts and Padding:
```css
/* Clean, predictable, accessible */
h1 {
  font-size: 2.5rem; /* 40px */
  margin-bottom: 1rem; /* 16px */
}

.card {
  padding: 1.5rem; /* 24px */
  border-radius: 0.5rem; /* 8px */
}
```
If a visually impaired student increases their phone's base text size from 16px to 20px, **every single heading, paragraph, and padding on your website automatically scales up proportionally**!

---

# 3. `em` (The Local Element Unit)

While `rem` always looks at the root `<html>`, **`em`** looks at the **font size of its immediate parent or the element itself**!

- On `font-size`: `1em` equals the font size of the parent element.
- On `padding` or `margin`: `1em` equals the font size of the **element itself**!

### Where `em` is Useful: Auto-Scaling Buttons
```css
.btn {
  font-size: 16px;
  padding: 0.5em 1em; /* Top/bottom = 8px, Left/right = 16px */
}

.btn-large {
  font-size: 24px;
  padding: 0.5em 1em; /* Top/bottom = 12px, Left/right = 24px */
}
```
Notice how the button padding automatically scales up when the font size gets bigger!

### ⚠️ The Danger of Nested `em` (The Snowball Effect):
If you nest elements inside each other using `em`, the sizes multiply:
- Parent: `font-size: 1.2em`
  - Child: `font-size: 1.2em` (becomes `1.44em`)
    - Grandchild: `font-size: 1.2em` (becomes `1.728em`!)
This compound multiplication can create giant runaway text! That is why **`rem` is preferred over `em` for general typography**.

---

# 4. Viewport Units: `vw` and `vh`

The **Viewport** is the visible rectangular window of your browser (excluding browser address bars and bookmarks).

```text
┌────────────────────────────────────────┐
│  BROWSER VIEWPORT                      │
│                                        │
│  ◄────────────── 100vw ──────────────► │
│  ▲                                     │
│  │                                     │
│  │ 100vh                               │
│  │                                     │
│  ▼                                     │
└────────────────────────────────────────┘
```

- **`1vw` = 1% of the viewport width** (If screen width is 1200px, `1vw = 12px`).
- **`1vh` = 1% of the viewport height** (If screen height is 800px, `1vh = 8px`).

### The #1 Use Case for `vh`: Full-Screen Hero Sections ⭐
Have you ever seen a website where the welcome section fills the user's screen completely?

```css
.hero-full-screen {
  min-height: 100vh; /* Exactly 100% of the screen height! */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f172a;
  color: white;
}
```
Whether viewed on an iPhone, a tablet, or an ultrawide desktop monitor, `100vh` fills the exact visible vertical window!

---

# Cheat Sheet: Absolute vs Relative Units

| Unit | Relative To | Best Used For |
|---|---|---|
| **`px`** | Physical screen pixel dots | Borders (`1px solid`), small shadows, avatar circles |
| **`%`** | Parent container's dimension | Column widths (`50%`), images (`width: 100%`) |
| **`rem`** | Root `<html>` font-size (16px) | **Fonts, paddings, margins** (Accessible & predictable) |
| **`em`** | Element's own font-size | Buttons that scale padding with text |
| **`vw`** | Total browser window width | Responsive full-width ribbons, fluid text |
| **`vh`** | Total browser window height | Full-screen hero banners (`min-height: 100vh`) |

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| Using `em` for all font sizes across nested lists. | Use `rem` for body text and headings. | Deeply nested `em` creates an unintended snowball multiplication effect. |
| Setting `height: 100%` expecting full screen. | Use `min-height: 100vh;`. | `height: 100%` only works if every ancestor (including `body` and `html`) has an explicit height declared. |
| Forgetting that `1rem = 16px` by default. | Use simple math: `2rem = 32px`, `1.5rem = 24px`. | Remembering the 16px base makes mental conversion effortless. |

---

# Quick Revision Summary

- ✅ **Relative units** adapt dynamically to parent elements or screen dimensions.
- ✅ **Percentages (`%`)** scale relative to the parent container's width.
- ✅ **`rem`** scales relative to the root `<html>` font size (default `16px`).
- ✅ **`em`** scales relative to the element's local font-size.
- ✅ **`100vw`** equals the entire browser screen width; **`100vh`** equals the entire screen height.
- ✅ Modern web best practice: Use **`rem` for typography and spacing**, and **`%`/`vw`/`vh` for layouts**.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. What does the "r" in the CSS unit `rem` stand for?
A. Relative
B. Ratio
C. Root
D. Responsive
**Answer:** C

---

### 2. If the browser's default root font size is 16px, what is the computed size of `margin-bottom: 2rem;`?
A. 18px
B. 24px
C. 32px
D. 64px
**Answer:** C

---

### 3. Which relative unit is ideal for creating a hero banner that fills 100% of the user's visible vertical screen?
A. `100%`
B. `100px`
C. `100vw`
D. `100vh`
**Answer:** D

---

### 4. Why is `rem` generally preferred over `em` for styling headings and paragraphs?
A. `rem` renders faster in JavaScript
B. `rem` avoids the compound multiplication (snowball) issue that happens with nested `em` elements
C. `em` is deprecated in HTML5
D. `rem` works only on computers
**Answer:** B

---

### 5. If a parent container has a width of 800px, what is the actual rendered width of a child with `width: 75%;`?
A. 750px
B. 600px
C. 550px
D. 700px
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `relative-units.html`.
2. Build a full-screen landing page layout using `vh`, `rem`, and `%`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Relative Units Showcase</title>
     <style>
       * {
         box-sizing: border-box;
         margin: 0;
         padding: 0;
       }

       body {
         font-family: Arial, sans-serif;
         background-color: #f8fafc;
       }

       /* 1. Full-Screen Hero using vh */
       .hero {
         min-height: 100vh;           /* 100% of screen height */
         background-color: #0f172a;
         color: white;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         text-align: center;
         padding: 2rem;               /* 32px */
       }

       .hero h1 {
         font-size: 3rem;             /* 48px */
         margin-bottom: 1rem;         /* 16px */
         color: #38bdf8;
       }

       .hero p {
         font-size: 1.25rem;          /* 20px */
         max-width: 600px;
         margin-bottom: 2rem;         /* 32px */
         color: #94a3b8;
       }

       /* 2. Responsive Content Container using % */
       .content-section {
         width: 90%;                  /* 90% of screen */
         max-width: 960px;
         margin: 3rem auto;           /* 48px top/bottom, centered */
         background-color: white;
         padding: 2rem;               /* 32px */
         border-radius: 0.75rem;      /* 12px */
         box-shadow: 0 4px 10px rgba(0,0,0,0.05);
       }
     </style>
   </head>
   <body>
     <section class="hero">
       <h1>MSK Institute</h1>
       <p>Empowering students from Class 8th to 12th with modern coding and web design skills.</p>
     </section>

     <section class="content-section">
       <h2>Why Relative Units Matter</h2>
       <p>Notice how effortlessly the hero banner fills the entire screen on both mobile and laptop displays!</p>
     </section>
   </body>
   </html>
   ```
3. Open the file in your browser and resize the window height and width. Notice how the hero section stays anchored to the exact screen height! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Responsive Units & The calc() Function** (CSS Units and Measurements).

👉 **[Continue to Next Lesson: Responsive Units & The calc() Function →](/tutorials/css-for-beginners/responsive-units-and-calc-function)**
