---
id: flex-grow-flex-shrink-flex-basis
slug: flex-grow-flex-shrink-flex-basis
course: css-for-intermediate
chapter: 4
topic: 4.3
title: "The Flex Sizing Equation: Flex-Grow, Flex-Shrink, and Flex-Basis Demystified"
description: Master the mathematical engine of Flexbox sizing. Demystify flex-basis, flex-grow, and flex-shrink, and learn how the flex shorthand creates bulletproof responsive cards and sidebars.
difficulty: Intermediate
readingTime: 13
order: 12
keywords:
  - flex-grow
  - flex-shrink
  - flex-basis
  - flex shorthand
  - flexbox sizing
  - responsive layout
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# The Flex Sizing Equation: Flex-Grow, Flex-Shrink, and Flex-Basis Demystified

Imagine three school friends sharing a wooden classroom bench.
* **`flex-basis` (The Starting Size):** Before any bell rings, each student naturally occupies about 200 pixels of bench space.
* **`flex-grow` (Sharing Extra Room):** If the third student is absent today, there is a big empty gap of spare space left on the bench. How do the remaining two students expand? If one student is greedy and takes twice as much extra room (`flex-grow: 2`), while the other takes normal room (`flex-grow: 1`), the extra space is divided in a 2:1 ratio.
* **`flex-shrink` (The Squeeze Factor):** Now imagine a fourth student suddenly squeezes onto the already crowded bench! Who yields space? A student with `flex-shrink: 0` refuses to budge an inch, forcing the other students to compress and squeeze tighter!

```
+-------------------------------------------------------------------------+
|                  THE 3 PILLARS OF FLEXBOX SIZING                        |
|                                                                         |
|  1. flex-basis:  "Here is my ideal starting size before distributing    |
|                  extra space or applying pressure."                     |
|                                                                         |
|  2. flex-grow:   "If there is EXTRA empty space in the container,       |
|                  how many slices of the leftover pie do I get?"         |
|                                                                         |
|  3. flex-shrink: "If the container is TOO SMALL, how willing am I       |
|                  to sacrifice my size so items don't overflow?"         |
+-------------------------------------------------------------------------+
```

Many developers struggle with unpredictable card widths because they rely purely on `width` instead of mastering the **Flex Sizing Equation**. In this tutorial, you will understand how the browser calculates these dimensions and how to use the `flex` shorthand like a senior engineer.

---

## 1. `flex-basis`: The Initial Size Benchmark

`flex-basis` defines the initial size of a flex item before any space distribution takes place.

```css
.card {
  flex-basis: 250px; /* In row: width is 250px; In column: height is 250px */
}
```

### `flex-basis` vs `width`
* If both `width` and `flex-basis` are declared, **`flex-basis` overrides `width`** along the main axis.
* If `flex-basis: auto;` is used, the browser looks at the item's `width` property. If no `width` is set, it sizes based on the inner content.

---

## 2. `flex-grow`: Distributing Positive Free Space

When the total width of all flex items is **less** than the width of the container, there is leftover empty space (positive free space).

By default, `flex-grow: 0;`, meaning items refuse to expand, leaving that empty gap visible at the end of the container.

```
Container Width: 900px
Item A (basis: 200px) + Item B (basis: 200px) + Item C (basis: 200px) = 600px
Remaining Free Space = 900px - 600px = 300px

Scenario 1: All items have `flex-grow: 0` (Default)
[ Item A: 200px ][ Item B: 200px ][ Item C: 200px ] [ Empty Space: 300px ]

Scenario 2: All items have `flex-grow: 1`
Free space (300px) divided by (1 + 1 + 1 = 3 slices) = 100px per slice!
[ Item A: 200px + 100px ][ Item B: 200px + 100px ][ Item C: 200px + 100px ]
Every item ends up at exactly 300px width!

Scenario 3: Item A (grow: 2), Item B (grow: 1), Item C (grow: 0)
Total slices = 2 + 1 + 0 = 3 slices (100px each)
- Item A gets 2 slices (+200px) -> Final width: 400px
- Item B gets 1 slice  (+100px) -> Final width: 300px
- Item C gets 0 slices (+0px)   -> Final width: 200px
```

```css
.sidebar {
  flex-basis: 250px;
  flex-grow: 0; /* Keeps its exact 250px basis */
}

.main-content {
  flex-basis: 0;
  flex-grow: 1; /* Absorbs ALL leftover screen space */
}
```

---

## 3. `flex-shrink`: Handling Negative Space (The Squeeze)

What happens when the viewport narrows (such as on a mobile phone) and the items don't have enough room to fit side by side?

By default, all flex items have **`flex-shrink: 1;`**. This means every item will gracefully shrink proportionally to prevent the container from breaking or overflowing.

### The Hero Value: `flex-shrink: 0;`
Have you ever seen an avatar icon or circular profile picture get squished into an ugly flat oval when a card narrows? That happens because `flex-shrink: 1` compressed the image!

```css
/* Fix squished icons forever */
.avatar-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0; /* "Never squeeze me, no matter how small the screen gets!" */
}
```

```
+-------------------------------------------------------------+
| Without flex-shrink: 0      | With flex-shrink: 0           |
| (Image squashed into oval)  | (Image remains a true circle) |
|                             |                               |
| ( 0 )  A very long student  | (  O  )  A very long student  |
|        name and notice text |          name and notice text |
|        squeezes the avatar  |          wraps cleanly!       |
+-------------------------------------------------------------+
```

---

## 4. The Industry Standard: The `flex` Shorthand

Writing `flex-grow`, `flex-shrink`, and `flex-basis` on separate lines is verbose and error-prone. The CSS specification strongly recommends using the **`flex` shorthand**:

```css
/* Syntax: flex: <flex-grow> <flex-shrink> <flex-basis>; */
.item {
  flex: 1 1 0%;
}
```

### Common Shorthand Presets You Will Encounter in Production:

| Shorthand | Expands To | Meaning & Best Use Case |
| :--- | :--- | :--- |
| `flex: 1;` | `1 1 0%` | Item grows and shrinks equally, starting from 0. Perfect for equal-width grid cards! |
| `flex: auto;` | `1 1 auto` | Item sizes to its content first, then grows and shrinks equally. |
| `flex: initial;` | `0 1 auto` | Default behavior: does not grow, shrinks if needed, sizes to content. |
| `flex: none;` | `0 0 auto` | Completely rigid item. Does not grow, never shrinks (like an avatar or fixed sidebar). |
| `flex: 0 0 280px;` | `0 0 280px` | Fixed 280px sidebar that never grows or shrinks. |

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Leaving avatar icons at default `flex-shrink: 1` | Always add `flex-shrink: 0;` to fixed-size icons and badges | Prevents circular icons from turning into warped ovals on small screens. |
| Using `width: 33.33%` inside a flex container | Use `flex: 1;` | `flex: 1` distributes space dynamically without rounding errors or decimal percentages. |
| Confusing `flex: 1` with `flex: auto` | `flex: 1` uses `basis: 0` (strict equal width); `flex: auto` uses `basis: auto` (content-biased width) | With `flex: auto`, a card with 3 paragraphs will be wider than a card with 1 line. |
| Setting separate `flex-grow`, `flex-shrink`, and `flex-basis` | Use the combined `flex: 1 0 200px;` shorthand | Standardized shorthand avoids subtle browser default discrepancy bugs. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`flex-basis`**: The element's starting dimension before expansion or compression occurs.
* **`flex-grow`**: Proportion of leftover empty space the item will claim (`0` = none, `1` = equal share, `2` = double share).
* **`flex-shrink`**: Rate at which an item compresses when space is constricted (`0` = never shrink, `1` = shrink proportionally).
* **`flex: 1`**: The most common flex shorthand. Sets `flex: 1 1 0%`, forcing all siblings to have perfectly equal widths regardless of inner content length.
* **`flex-shrink: 0`**: The golden fix for preserving icon shapes and fixed sidebar column widths.

---

# Multiple Choice Questions

### 1. What does the shorthand `flex: 1;` expand to in CSS?
A. `flex: 1 0 auto;`
B. `flex: 1 1 0%;`
C. `flex: 1 1 auto;`
D. `flex: 0 0 100%;`
**Answer:** B
**Explanation:** According to the W3C Flexbox specification, flex: 1 expands to flex-grow: 1, flex-shrink: 1, and flex-basis: 0%.

---

### 2. If an avatar image inside a flex row is being squished into a narrow oval on small screens, which property fixes it?
A. `flex-grow: 1;`
B. `flex-shrink: 0;`
C. `justify-content: stretch;`
D. `overflow: hidden;`
**Answer:** B
**Explanation:** Setting flex-shrink: 0 prevents the item from shrinking below its declared width and height, preserving circular dimensions.

---

### 3. What is the default value of `flex-grow` on a flex item?
A. `1`
B. `0`
C. `auto`
D. `inherit`
**Answer:** B
**Explanation:** The default value is 0, meaning items do not expand to fill remaining free space unless explicitly instructed.

---

### 4. When both `width: 300px;` and `flex-basis: 200px;` are declared on a flex item in a horizontal row, which value wins?
A. `width: 300px;`
B. `flex-basis: 200px;`
C. The browser averages them to 250px
D. It causes a syntax error
**Answer:** B
**Explanation:** On the main axis of a flex container, flex-basis takes precedence over the standard width property.

---

### 5. Which flex configuration creates a completely rigid element that neither grows nor shrinks from its 260px size?
A. `flex: 1 1 260px;`
B. `flex: 0 0 260px;`
C. `flex: 260px 1 1;`
D. `flex: auto 260px;`
**Answer:** B
**Explanation:** flex: 0 0 260px sets grow to 0 (no expansion), shrink to 0 (no compression), and basis to 260px, making the element completely rigid.

---

## 7. Hands-on Practice Challenge: School Library Dashboard Layout

Create a real-world School Digital Library catalog layout:
1. A **fixed sidebar** for Book Categories (`flex: 0 0 240px`) that never shrinks or squishes.
2. An **expandable main content area** (`flex: 1`) displaying library book cards.
3. Book cards with circular category badges that use `flex-shrink: 0` so they stay perfectly round!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>School Library Dashboard - Flex Sizing</title>
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
      padding: 30px 20px;
    }

    .dashboard-wrapper {
      max-width: 950px;
      margin: 0 auto;
      background-color: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #334155;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .top-bar {
      background-color: #0f172a;
      padding: 16px 24px;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .top-bar h1 {
      font-size: 1.25rem;
      color: #38bdf8;
    }

    /* THE FLEX SIZING ARENA */
    .dashboard-body {
      display: flex; /* Flex Container */
      min-height: 400px;
    }

    /* 1. Rigid Sidebar: Never grows, never shrinks */
    .library-sidebar {
      flex: 0 0 240px; /* grow: 0, shrink: 0, basis: 240px */
      background-color: #1e293b;
      border-right: 1px solid #334155;
      padding: 20px;
    }

    .sidebar-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .category-list {
      list-style: none;
    }

    .category-list li {
      padding: 10px 12px;
      margin-bottom: 6px;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #cbd5e1;
      cursor: pointer;
    }

    .category-list li.active {
      background-color: #2563eb;
      color: #ffffff;
      font-weight: 600;
    }

    /* 2. Dynamic Main Content: Absorbs all remaining width! */
    .library-catalog {
      flex: 1; /* grow: 1, shrink: 1, basis: 0% */
      padding: 24px;
      background-color: #0f172a;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Book Entry Card */
    .book-card {
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* 3. Protected Circle Badge: Zero shrink prevents distortion! */
    .book-badge {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0; /* Crucial: never compresses into an oval! */
    }

    .book-details {
      flex: 1; /* Text takes up available room */
    }

    .book-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .book-meta {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .btn-borrow {
      flex-shrink: 0; /* Button preserves its size */
      background-color: #3b82f6;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-borrow:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>

  <div class="dashboard-wrapper">
    <div class="top-bar">
      <h1>Kendriya Vidyalaya Central Digital Library</h1>
      <span>Session 2026-27</span>
    </div>

    <div class="dashboard-body">
      <!-- 1. Fixed Non-Shrinking Sidebar -->
      <aside class="library-sidebar">
        <div class="sidebar-title">Book Categories</div>
        <ul class="category-list">
          <li class="active">Science & Technology</li>
          <li>Mathematics & Logic</li>
          <li>Indian History</li>
          <li>English Literature</li>
        </ul>
      </aside>

      <!-- 2. Flex: 1 Expandable Catalog -->
      <main class="library-catalog">
        <div class="book-card">
          <div class="book-badge">SCI</div>
          <div class="book-details">
            <div class="book-title">Concepts of Physics - Vol 1</div>
            <div class="book-meta">Author: Dr. H.C. Verma &bull; Available: 14 Copies</div>
          </div>
          <button class="btn-borrow">Issue Book</button>
        </div>

        <div class="book-card">
          <div class="book-badge">ROB</div>
          <div class="book-details">
            <div class="book-title">Robotics & Arduino Programming for Beginners</div>
            <div class="book-meta">Author: Prof. K. Sundaram &bull; Available: 8 Copies</div>
          </div>
          <button class="btn-borrow">Issue Book</button>
        </div>
      </main>
    </div>
  </div>

</body>
</html>
```
