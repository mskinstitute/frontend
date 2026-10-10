---
id: grid-template-columns-and-rows
slug: grid-template-columns-and-rows
course: css-for-intermediate
chapter: 6
topic: 6.2
title: "Grid Template Columns & Rows: Explicit Tracks and Sizing Syntax"
description: Master grid track definition in CSS Grid. Learn how to craft custom columns and rows with grid-template-columns, grid-template-rows, mixing pixels with auto, and handling implicit grid overflow.
difficulty: Intermediate
readingTime: 12
order: 17
keywords:
  - grid-template-columns
  - grid-template-rows
  - explicit grid
  - implicit grid
  - grid-auto-rows
  - track sizing
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# Grid Template Columns & Rows: Explicit Tracks and Sizing Syntax

When you open a school accounts ledger or laboratory register, you don't make every column the exact same width with your ruler.
* The first column for **Serial Number (S.No)** is narrow—just 50 pixels wide.
* The second column for **Experiment Title** needs plenty of room to expand (`auto`).
* The third column for **Teacher Signature** needs a tidy, fixed 150-pixel stamp box.

```
+-------------------------------------------------------------------------+
|                  CUSTOM TRACK SIZING IN A SCHOOL LEDGER                 |
|                                                                         |
|  Col 1: 60px          Col 2: auto (Stretches)         Col 3: 140px      |
|  +--------------+----------------------------------+-----------------+  |
|  | S.No         | Experiment Title                 | Teacher Sign    |  |
|  |--------------+----------------------------------+-----------------|  |
|  | 01           | Verification of Ohm's Law        | [ Verified ]    |  |
|  |--------------+----------------------------------+-----------------|  |
|  | 02           | Refraction through Glass Prism   | [ Verified ]    |  |
|  +--------------+----------------------------------+-----------------+  |
+-------------------------------------------------------------------------+
```

In CSS Grid, the two master properties that carve out your layout blueprint are **`grid-template-columns`** and **`grid-template-rows`**. In this tutorial, you will master track sizing syntax, mixing fixed and fluid units, and understanding the difference between the **Explicit Grid** and the **Implicit Grid**.

---

## 1. Defining Columns with `grid-template-columns`

The `grid-template-columns` property defines the number of columns and their individual widths along the horizontal axis. Each space-separated value creates a new column track:

```css
/* Creates 3 columns of different fixed pixel sizes */
.ledger-grid {
  display: grid;
  grid-template-columns: 60px 400px 140px;
}
```

```css
/* Creates 2 columns using percentages */
.split-screen {
  display: grid;
  grid-template-columns: 70% 30%;
}
```

---

## 2. Defining Rows with `grid-template-rows`

Just as `grid-template-columns` carves vertical slices, `grid-template-rows` sets the heights of horizontal row tracks:

```css
.app-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr 50px; /* Header: 70px, Main: 1fr, Footer: 50px */
  min-height: 100vh;
}
```

---

## 3. Mixing Units: Pixels, Percentages, and `auto`

One of the great advantages of CSS Grid over legacy table layouts is the ability to mix totally different units without breaking the layout:

```css
.profile-banner {
  display: grid;
  /* Col 1: Fixed 80px avatar | Col 2: Stretches to fill room | Col 3: Fits button size */
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  align-items: center;
}
```

### What Does the `auto` Keyword Mean?
* A track with `auto` sizes itself around the natural intrinsic size of its content.
* If extra space remains in the grid container, `auto` tracks will also expand to absorb that leftover space.

---

## 4. The Explicit Grid vs The Implicit Grid

What happens if you define a blueprint for 2 rows, but your HTML has 10 cards? Where do the extra 8 cards go?

```
========================================================================
EXPLICIT vs IMPLICIT GRID
========================================================================

Line 1 +------------------------+------------------------+
       | Card 1                 | Card 2                 | <-- EXPLICIT ROW 1
Line 2 +------------------------+------------------------+     (Defined in CSS)
       | Card 3                 | Card 4                 | <-- EXPLICIT ROW 2
Line 3 +========================+========================+     (Defined in CSS)
       | Card 5                 | Card 6                 | <-- IMPLICIT ROW 3
Line 4 + - - - - - - - - - - - -+ - - - - - - - - - - - -+     (Created by browser!)
       | Card 7                 | Card 8                 | <-- IMPLICIT ROW 4
Line 5 + - - - - - - - - - - - -+ - - - - - - - - - - - -+     (Created by browser!)
```

* **Explicit Grid:** The rows and columns you explicitly declared in your CSS using `grid-template-columns` and `grid-template-rows`.
* **Implicit Grid:** Extra tracks that the browser creates automatically to hold surplus HTML items that overflow your explicit blueprint.

### Controlling the Implicit Grid: `grid-auto-rows`
By default, the browser gives implicit rows an `auto` height (sized to fit whatever content is inside). You can take control of implicit row heights using **`grid-auto-rows`**:

```css
.card-feed {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Explicitly 2 columns */
  
  /* Every extra row created for new items will be exactly 220px tall! */
  grid-auto-rows: 220px;
  gap: 16px;
}
```

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Hardcoding fixed heights on every single row track | Use `auto` or `minmax()` | Fixed pixel row heights cause text to overflow when content grows on mobile. |
| Forgetting commas are NOT allowed between track sizes | Write space-separated values: `100px 1fr 200px` | Putting commas (`100px, 1fr, 200px`) is invalid CSS syntax and breaks the grid! |
| Defining 20 explicit rows for an unknown database list | Define columns explicitly and use `grid-auto-rows: min-content` | Lets the database generate as many dynamic rows as needed cleanly. |
| Using percentages (`33.33% 33.33% 33.33%`) with gaps | Use Fractional Units (`1fr 1fr 1fr`) | Percentage widths + `gap` causes horizontal overflow because `100% + gap > 100%`! |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`grid-template-columns`**: Declares explicit column tracks (space-separated, NO commas!).
* **`grid-template-rows`**: Declares explicit row tracks and their heights.
* **`auto` track sizing**: Expands or shrinks according to the content inside that cell.
* **Explicit Grid**: Tracks explicitly written into `grid-template-*` declarations.
* **Implicit Grid**: Tracks automatically created by the browser when items overflow the explicit dimensions.
* **`grid-auto-rows`**: Sets the default height for all implicit rows created dynamically.

---

# Multiple Choice Questions

### 1. Which CSS syntax correctly defines three columns of 100px, 300px, and 150px width?
A. `grid-template-columns: 100px, 300px, 150px;`
B. `grid-template-columns: 100px 300px 150px;`
C. `grid-columns: 100px; 300px; 150px;`
D. `columns: 3 (100px, 300px, 150px);`
**Answer:** B
**Explanation:** Track sizes in CSS Grid must be space-separated without commas. Commas make the declaration invalid.

---

### 2. What happens when an HTML page contains 8 grid items, but the CSS only defines a 2-column by 2-row explicit grid?
A. The browser throws a fatal rendering error
B. The surplus 4 items are automatically placed into newly created implicit rows
C. The extra 4 items are deleted from the DOM
D. All 8 items are crammed into the first cell
**Answer:** B
**Explanation:** The browser automatically constructs the implicit grid, creating additional rows or columns to house items that exceed the explicit template.

---

### 3. Which CSS property sets the default height of rows automatically created in the implicit grid?
A. `grid-template-rows`
B. `grid-auto-rows`
C. `grid-implicit-height`
D. `row-auto-size`
**Answer:** B
**Explanation:** grid-auto-rows specifies the track size for any implicit row tracks generated by the browser.

---

### 4. Why is using `grid-template-columns: 50% 50%;` with `gap: 20px;` an anti-pattern?
A. Modern browsers do not support percentages in grid
B. The total width becomes 50% + 50% + 20px = 100% + 20px, causing unwanted horizontal overflow scrollbars
C. The gap is ignored when percentages are used
D. It disables text rendering inside the cells
**Answer:** B
**Explanation:** Percentage track sizes do not account for grid gaps automatically. 100% total column width plus gap exceeds container bounds, causing overflow.

---

### 5. In the rule `grid-template-columns: 80px auto 120px;`, what does the `auto` track size do?
A. It locks the column to exactly 0px
B. It sizes dynamically around its content and expands to claim available spare space
C. It duplicates the 80px track
D. It centers the whole website
**Answer:** B
**Explanation:** An auto track adapts to its inner content and absorbs available positive space along the grid axis.

---

## 7. Hands-on Practice Challenge: School Term Report Card Ledger

Construct a structured School Student Grade Sheet using custom track sizing:
1. Define a 4-column explicit grid using `grid-template-columns: 70px 1fr 120px 140px;` (Roll No, Student Name, Exam Score, Letter Grade).
2. Set explicit header row styling with `grid-template-rows: 50px;`.
3. Use `grid-auto-rows: 48px;` to ensure every subsequent student row has identical, uniform height automatically!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Grade Sheet - CSS Grid Tracks</title>
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
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .report-card-wrapper {
      max-width: 800px;
      width: 100%;
      background-color: #1e293b;
      border-radius: 16px;
      border: 1px solid #334155;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .report-title {
      font-size: 1.4rem;
      color: #38bdf8;
      margin-bottom: 6px;
    }

    .report-subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    /* THE CSS GRID TRACK BLUEPRINT */
    .grade-grid {
      display: grid;
      /* Col 1: Fixed 70px | Col 2: Flexible 1fr | Col 3: 110px | Col 4: 120px */
      grid-template-columns: 70px 1fr 110px 120px;
      /* Explicit Header Row: 44px */
      grid-template-rows: 44px;
      /* Implicit Data Rows: Uniform 48px */
      grid-auto-rows: 48px;
      gap: 2px; /* Subtle line separation */
      background-color: #334155; /* Forms grid lines via gap! */
      border: 1px solid #334155;
      border-radius: 8px;
      overflow: hidden;
    }

    /* Grid Cells */
    .grid-cell {
      background-color: #1e293b;
      padding: 0 16px;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }

    /* Header Cells */
    .cell-header {
      background-color: #0f172a;
      color: #94a3b8;
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .grade-pill {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      background-color: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }
  </style>
</head>
<body>

  <div class="report-card-wrapper">
    <h2 class="report-title">Half-Yearly Physics Examination</h2>
    <p class="report-subtitle">Class 11-B &bull; Academic Session 2026-27</p>

    <div class="grade-grid">
      <!-- EXPLICIT HEADER ROW -->
      <div class="grid-cell cell-header">Roll</div>
      <div class="grid-cell cell-header">Student Name</div>
      <div class="grid-cell cell-header">Marks (100)</div>
      <div class="grid-cell cell-header">Grade</div>

      <!-- IMPLICIT DATA ROW 1 -->
      <div class="grid-cell" style="color: #94a3b8; font-weight: 600;">#01</div>
      <div class="grid-cell" style="font-weight: 600;">Aditya Sen</div>
      <div class="grid-cell">94 / 100</div>
      <div class="grid-cell"><span class="grade-pill">A+ Outstanding</span></div>

      <!-- IMPLICIT DATA ROW 2 -->
      <div class="grid-cell" style="color: #94a3b8; font-weight: 600;">#02</div>
      <div class="grid-cell" style="font-weight: 600;">Bhavna Nair</div>
      <div class="grid-cell">88 / 100</div>
      <div class="grid-cell"><span class="grade-pill">A Excellent</span></div>

      <!-- IMPLICIT DATA ROW 3 -->
      <div class="grid-cell" style="color: #94a3b8; font-weight: 600;">#03</div>
      <div class="grid-cell" style="font-weight: 600;">Chetan Joshi</div>
      <div class="grid-cell">91 / 100</div>
      <div class="grid-cell"><span class="grade-pill">A+ Outstanding</span></div>
    </div>
  </div>

</body>
</html>
```
