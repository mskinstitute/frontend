---
id: grid-gap-fractional-units-fr-repeat
slug: grid-gap-fractional-units-fr-repeat
course: css-for-intermediate
chapter: 6
topic: 6.3
title: "Grid Gap, Fractional Units (fr), and the repeat() Function"
description: Master modern CSS Grid productivity features. Demystify the revolutionary fractional unit (fr), clean gutter spacing with gap, and shorthand column creation with repeat().
difficulty: Intermediate
readingTime: 11
order: 18
keywords:
  - fractional unit
  - fr unit
  - repeat function
  - grid gap
  - column gap
  - responsive grid
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# Grid Gap, Fractional Units (fr), and the repeat() Function

Imagine bringing a large box of Kaju Katli (sweets) to school on your birthday. You have 3 friends with you. You don't pull out a geometric ruler to measure each piece in millimeters! Instead, you divide the sweets into **equal shares**: *"One share for you, one share for you, one share for you, and one share for me."*

If one friend stayed back to help you decorate the classroom board, you might decide: *"He gets 2 shares, and the rest of us get 1 share each!"*

```
+-------------------------------------------------------------------------+
|                  THE FRACTIONAL UNIT (fr) PIE SLICE                     |
|                                                                         |
|  Container Width: 1000px  |  Formula: Total Shares = 1fr + 2fr + 1fr = 4|
|                                                                         |
|  [ Col 1: 1fr ]   [       Col 2: 2fr       ]   [ Col 3: 1fr ]           |
|     (250px)       |         (500px)        |      (250px)               |
|  <--- 1 Share --->|<------- 2 Shares ------>|<--- 1 Share --->|         |
+-------------------------------------------------------------------------+
```

Before CSS Grid, developers were trapped doing painful percentage math: `width: 33.333333%` which broke into ugly decimal rounding errors whenever a 10px margin was added. 

The **Fractional Unit (`fr`)**, paired with **`gap`** and the **`repeat()`** function, solved this problem permanently. In this tutorial, you will master this trio of modern CSS Grid superpowers.

---

## 1. The Fractional Unit (`fr`): Smart Free Space Slicing

The `fr` unit represents a **fraction of the available free space** in the grid container.

Unlike pixels (which are rigid) or percentages (which don't account for gaps), the browser's Grid math engine calculates `fr` in 3 foolproof steps:
1. It measures the total container width.
2. It subtracts any fixed pixel tracks (like a 250px sidebar) and all `gap` distances.
3. It divides whatever space is left over among the `fr` units according to their ratio!

```css
.sweet-box {
  display: grid;
  /* 4 perfectly equal columns that automatically absorb container width */
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
```

```css
/* Unequal distribution: Middle column gets double the width */
.featured-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
```

---

## 2. The `repeat()` Function: Writing Dry CSS

Writing `1fr 1fr 1fr 1fr 1fr 1fr` for a 6-column calendar or photo gallery is tedious, repetitive, and hard to read.

The **`repeat()`** function lets you declare identical tracks in a clean, compressed shorthand:

```css
/* Syntax: repeat(count, track-size) */

/* Instead of: 1fr 1fr 1fr 1fr 1fr 1fr */
.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 equal columns for Monday-Sunday! */
}

/* Instead of: 200px 200px 200px 200px */
.photo-wall {
  display: grid;
  grid-template-columns: repeat(4, 200px);
}
```

### Repeating Patterns
You can also repeat multi-track patterns:

```css
/* Creates a 4-column pattern: 100px then 1fr, repeated twice -> 100px 1fr 100px 1fr */
.alternating-grid {
  display: grid;
  grid-template-columns: repeat(2, 100px 1fr);
}
```

---

## 3. The `gap` Property: Flawless Gutter Spacing

Before modern CSS, putting spacing between columns required adding `margin-right` on all cards and using `.card:last-child { margin-right: 0; }` hacks.

With CSS Grid, the **`gap`** property applies spacing **strictly between tracks**, never on the outer container edges!

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  
  /* Shorthand: gap: <row-gap> <column-gap>; */
  gap: 24px 16px; /* 24px between rows, 16px between columns */
}
```

* **`row-gap: 24px;`**: Space between horizontal rows.
* **`column-gap: 16px;`**: Space between vertical columns.
* **`gap: 20px;`**: Applies equal 20px spacing to both rows and columns.

---

## 4. Mixing `fr` with Fixed Pixels

One of the most practical production layouts is a fixed sidebar next to a fluid dashboard content area:

```css
.school-erp {
  display: grid;
  /* Sidebar is always exactly 260px, Main content claims ALL leftover room! */
  grid-template-columns: 260px 1fr;
  gap: 24px;
}
```

No matter if the screen is resized to 1200px or 1920px wide, the sidebar stays exactly 260px, while the `1fr` main area stretches smoothly without a single pixel of horizontal overflow!

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Using `width: 25%` with `grid-template-columns` and `gap` | Use `repeat(4, 1fr)` | `4 * 25% + 3 gaps` exceeds 100% and triggers overflow scrollbars. |
| Writing `repeat(1fr, 4)` | Write `repeat(4, 1fr)` | The first parameter is always the repeat count (number of times). |
| Writing `grid-gap` in new codebases | Use standard `gap`, `row-gap`, and `column-gap` | The old `grid-gap` prefix is legacy; `gap` is the modern cross-specification standard. |
| Forgetting that `1fr` has an implicit `min-width: auto` | Use `minmax(0, 1fr)` if long strings or code blocks force track expansion | Prevents wide code snippets from blowing out column widths. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`fr` Unit**: Represents one proportional slice of available positive space after fixed units and gaps are subtracted.
* **Ratio Sizing**: `1fr 3fr` gives column 2 three times as much leftover room as column 1.
* **`repeat(count, size)`**: Duplicates track definitions efficiently (e.g. `repeat(12, 1fr)` for a 12-column design system).
* **`gap: 20px`**: Adds 20px gutter space between rows and columns without adding unwanted margins on the outside edges.
* **No Overflow**: `fr` + `gap` never overflows the container, completely replacing messy percentage hacks.

---

# Multiple Choice Questions

### 1. In a container of 1000px width with no gaps, what is the computed width of the second column in `grid-template-columns: 1fr 3fr;`?
A. 250px
B. 500px
C. 750px
D. 1000px
**Answer:** C
**Explanation:** Total shares = 1fr + 3fr = 4fr. Each 1fr = 1000px / 4 = 250px. The second column has 3fr, so 3 * 250px = 750px.

---

### 2. What is the shorthand equivalent of writing `grid-template-columns: 1fr 1fr 1fr 1fr;`?
A. `grid-template-columns: repeat(4, 1fr);`
B. `grid-template-columns: 4 * 1fr;`
C. `grid-template-columns: repeat(1fr, 4);`
D. `grid-template-columns: quad(1fr);`
**Answer:** A
**Explanation:** The repeat() function takes the repetition count first, followed by the track size: repeat(4, 1fr).

---

### 3. How does the browser calculate the width of `fr` units when a fixed pixel track and a `gap` are present?
A. It ignores the gap and fixed track completely
B. It subtracts the fixed track and gap distances from the container width first, then distributes the remaining space among the fr units
C. It converts pixels to percentages automatically
D. It causes a CSS compilation error
**Answer:** B
**Explanation:** The fractional unit is calculated strictly from the available positive free space remaining after all non-flexible sizes and gaps are subtracted.

---

### 4. Which property sets a 30px gap between grid rows and a 15px gap between grid columns?
A. `gap: 30px 15px;`
B. `gap: 15px 30px;`
C. `margin: 30px 15px;`
D. `padding: 30px 15px;`
**Answer:** A
**Explanation:** The gap shorthand follows the standard vertical-first order: gap: <row-gap> <column-gap>; hence gap: 30px 15px;.

---

### 5. Why is `repeat(3, 1fr)` superior to `repeat(3, 33.333%)` when using `gap: 20px`?
A. Percentages do not render on Android devices
B. Percentages do not subtract gap distances, resulting in container overflow (`3 * 33.333% + 40px > 100%`)
C. repeat() does not accept percentage units
D. fr units load 10x faster from the server
**Answer:** B
**Explanation:** The fr unit accounts for gutter gaps before distributing space, ensuring the grid always stays within 100% container bounds.

---

## 7. Hands-on Practice Challenge: School Annual Fest Photo Wall

Construct an interactive School Annual Day Photo Wall gallery:
1. Use `display: grid;` with `grid-template-columns: repeat(4, 1fr);` for a clean 4-column desktop album layout.
2. Use `gap: 20px;` for uniform gutter separation between frames.
3. Inside `@media (max-width: 768px)`, switch to `repeat(2, 1fr)` for mobile responsiveness.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Annual Fest Gallery - fr & repeat()</title>
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
      padding: 40px 20px;
    }

    .gallery-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .gallery-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .gallery-header h1 {
      font-size: 2.2rem;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .gallery-header p {
      color: #94a3b8;
      font-size: 1.05rem;
    }

    /* 1. THE REPEAT() & FR POWER GRID */
    .photo-grid {
      display: grid;
      /* 4 Equal Fractional Columns on Desktop */
      grid-template-columns: repeat(4, 1fr);
      gap: 20px; /* Uniform 20px row and column gutters */
    }

    /* Photo Frame Card */
    .photo-card {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      transition: transform 0.25s ease, border-color 0.25s ease;
    }

    .photo-card:hover {
      transform: translateY(-6px);
      border-color: #38bdf8;
    }

    .photo-visual {
      height: 160px;
      background: linear-gradient(135deg, #1e293b, #334155);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2.5rem;
    }

    .photo-info {
      padding: 16px;
    }

    .photo-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .photo-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
    }

    /* 2. RESPONSIVE BREAKPOINT: 2 COLUMNS ON TABLETS & MOBILES */
    @media (max-width: 768px) {
      .photo-grid {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on mobile */
        gap: 14px;
      }
    }
  </style>
</head>
<body>

  <div class="gallery-container">
    <div class="gallery-header">
      <h1>School Tarang Cultural Fest 2026</h1>
      <p>Moments of passion, performance, and teamwork captured across campus.</p>
    </div>

    <!-- The 4-Column fr & repeat() Grid -->
    <div class="photo-grid">
      
      <div class="photo-card">
        <div class="photo-visual" style="background: linear-gradient(135deg, #7c3aed, #4f46e5);">🎭</div>
        <div class="photo-info">
          <div class="photo-tag">Drama Club</div>
          <div class="photo-title">Shakespeare in Delhi Play</div>
        </div>
      </div>

      <div class="photo-card">
        <div class="photo-visual" style="background: linear-gradient(135deg, #d97706, #b45309);">🎺</div>
        <div class="photo-info">
          <div class="photo-tag">Music Society</div>
          <div class="photo-title">Inter-House Orchestra</div>
        </div>
      </div>

      <div class="photo-card">
        <div class="photo-visual" style="background: linear-gradient(135deg, #059669, #047857);">🎨</div>
        <div class="photo-info">
          <div class="photo-tag">Fine Arts</div>
          <div class="photo-title">Annual Pottery Exhibition</div>
        </div>
      </div>

      <div class="photo-card">
        <div class="photo-visual" style="background: linear-gradient(135deg, #dc2626, #991b1b);">💃</div>
        <div class="photo-info">
          <div class="photo-tag">Classical Dance</div>
          <div class="photo-title">Kathak Ensemble Recital</div>
        </div>
      </div>

    </div>
  </div>

</body>
</html>
```
