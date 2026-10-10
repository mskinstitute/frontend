---
id: justify-content-align-items-align-self
slug: justify-content-align-items-align-self
course: css-for-intermediate
chapter: 4
topic: 4.2
title: "Alignment Mastery: Justify-Content, Align-Items, and Align-Self Explained"
description: Master the alignment powers of Flexbox. Learn how justify-content controls the main axis, align-items rules the cross axis, and align-self lets individual child items break formation.
difficulty: Intermediate
readingTime: 12
order: 11
keywords:
  - justify-content
  - align-items
  - align-self
  - flexbox alignment
  - center div
  - space-between
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# Alignment Mastery: Justify-Content, Align-Items, and Align-Self Explained

Think about a school bus picking up students in the morning.
* When the first three students board, do they sit packed together at the very front near the driver (`flex-start`)?
* Do they walk to the back seats (`flex-end`)?
* Or do they spread out evenly so one sits near the front, one in the middle, and one at the back with maximum breathing space between them (`space-between`)?

Now look at how those students sit on their bench:
* Are their heads aligned to the ceiling, or are their feet resting on the floor?
* And what if three students are sitting upright, but one student bends down to pick up a fallen geometry box from the floor? That single student just applied `align-self: flex-end;`!

```
+-------------------------------------------------------------------------+
|                  THE CORE FLEXBOX ALIGNMENT TRIO                        |
|                                                                         |
|  1. justify-content (Parent Rule)                                       |
|     Aligns and distributes space along the MAIN AXIS.                   |
|                                                                         |
|  2. align-items (Parent Rule)                                           |
|     Aligns ALL children collectively across the CROSS AXIS.             |
|                                                                         |
|  3. align-self (Child Rule)                                             |
|     Overrides align-items for ONE specific individual item!             |
+-------------------------------------------------------------------------+
```

In this tutorial, you will master every alignment property, eliminate guesswork when centering elements, and understand exactly why and when each value is used.

---

## 1. `justify-content`: Governing the Main Axis

The `justify-content` property distributes spare unused space along the **Main Axis** (horizontal in `row`, vertical in `column`).

```
+-------------------------------------------------------------------------+
|  `flex-start` (Default): Items packed at the start                      |
|  [ Item 1 ][ Item 2 ][ Item 3 ]                                         |
+-------------------------------------------------------------------------+
|  `center`: Items clustered together in the exact middle                 |
|                   [ Item 1 ][ Item 2 ][ Item 3 ]                        |
+-------------------------------------------------------------------------+
|  `flex-end`: Items packed at the end                                    |
|                                         [ Item 1 ][ Item 2 ][ Item 3 ]  |
+-------------------------------------------------------------------------+
|  `space-between`: First item flush start, last item flush end           |
|  [ Item 1 ]                 [ Item 2 ]                 [ Item 3 ]       |
+-------------------------------------------------------------------------+
|  `space-around`: Equal space on sides (outer spaces are half size)      |
|     [ Item 1 ]             [ Item 2 ]             [ Item 3 ]            |
+-------------------------------------------------------------------------+
|  `space-evenly`: Truly identical spacing between every edge & item       |
|        [ Item 1 ]          [ Item 2 ]          [ Item 3 ]               |
+-------------------------------------------------------------------------+
```

### The Difference: `space-between` vs `space-around` vs `space-evenly`
* **`space-between`**: The first item touches the left wall, the last item touches the right wall. All extra space goes *between* items. This is the #1 choice for website navigation bars (Logo on far left, links on far right)!
* **`space-around`**: Each item gets an equal amount of padding around itself. Because two adjacent items combine their spaces, the space between two items is *double* the space at the edges.
* **`space-evenly`**: The browser divides the free space equally so that the distance from the wall to an item is 100% identical to the distance between items.

---

## 2. `align-items`: Governing the Cross Axis

While `justify-content` works on the Main Axis, `align-items` controls how items sit along the perpendicular **Cross Axis**.

```css
.container {
  display: flex;
  align-items: center; /* Cross-axis centering */
}
```

```
+-------------------------------------------------------------------------+
| `align-items: stretch` (Default)       | `align-items: flex-start`      |
| +------------------------------------+ | +----------------------------+ |
| | [ 1 ]  [ 2: Tall ]  [ 3 ]          | | | [ 1 ]  [ 2: Tall ]  [ 3 ]  | |
| | [ 1 ]  [ 2: Tall ]  [ 3 ]          | | |        [ 2: Tall ]         | |
| | [ 1 ]  [ 2: Tall ]  [ 3 ]          | | |                            | |
| +------------------------------------+ | +----------------------------+ |
+----------------------------------------+--------------------------------+
| `align-items: center`                  | `align-items: baseline`        |
| +------------------------------------+ | +----------------------------+ |
| |        [ 2: Tall ]                 | | |                              |
| | [ 1 ]  [ 2: Tall ]  [ 3 ]          | | | [ 1: Big ] [ 2: sm ] [ 3 ] | |
| |        [ 2: Tall ]                 | | | (Text baselines align!)    | |
| +------------------------------------+ | +----------------------------+ |
+-------------------------------------------------------------------------+
```

### Why `stretch` is the Default
By default, if child items do not have an explicit height, `align-items: stretch` makes every card in a row expand to match the height of the tallest card in that row! This solves the centuries-old web design headache of "equal height columns" automatically.

### What is `baseline`?
`align-items: baseline` aligns items so the bottom baseline of their inner text lines up on the same invisible notebook ruling, even if one item has a huge 32px font and another has a tiny 12px font.

---

## 3. The Holy Grail of Centering: Pure Dead Center

For nearly 20 years, perfectly centering an element horizontally and vertically in CSS was considered a difficult interview question. With Flexbox, it takes just three lines of code:

```css
.hero-center-box {
  display: flex;
  justify-content: center; /* Horizontal centering along main axis */
  align-items: center;     /* Vertical centering along cross axis */
  min-height: 100vh;
}
```

Whether the screen is an iPhone 12, an iPad, or a 4K monitor, your dialog card stays in the mathematical dead center of the screen!

---

## 4. `align-self`: The Individual Rulebreaker

What if you have five items neatly centered with `align-items: center`, but one specific item needs to stick to the top or stretch all the way to the bottom?

`align-self` is declared **directly on the child item**, overriding whatever `align-items` was set by the parent:

```css
/* Parent aligns all cards to center */
.team-row {
  display: flex;
  align-items: center;
  height: 300px;
}

/* Individual rebel card pins to the bottom */
.captain-card {
  align-self: flex-end; /* Overrides parent center! */
}

/* Another card stretches to full height */
.featured-card {
  align-self: stretch;
}
```

> **Remember:** There is no `justify-self` in Flexbox! Because items are packed and distributed along the main axis as a linked train, individual items cannot jump their horizontal track. To push an individual item along the main axis, use `margin-left: auto;` or `margin-right: auto;`.

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Trying to use `justify-self` on a flex item | Use `align-self` for cross axis, or `margin-left: auto;` for main axis | `justify-self` does not exist in the CSS Flexbox specification. |
| Forgetting container height when using `align-items: center` | Ensure parent container has a height or `min-height: 100vh;` | If the container has no height, it hugs its children and there is no room to vertically center! |
| Using `float: right` to push the last nav link to the far right | Use `margin-left: auto;` on that last flex item | `margin: auto` absorbs all remaining free space along the flex axis. |
| Hardcoding `margin: 0 auto;` inside a flex container | Let `justify-content: center` handle the centering | Flex containers handle internal distribution natively. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`justify-content` (Parent)**: Aligns along the Main Axis. Values: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.
* **`align-items` (Parent)**: Aligns all children along the Cross Axis. Values: `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline`.
* **`align-self` (Child)**: Lets a specific child element override the parent's `align-items`.
* **Navbar Shortcut**: `justify-content: space-between` places your logo on the left and navigation links on the right with zero manual margins.
* **Auto-Margins in Flexbox**: Giving a flex item `margin-left: auto` pushes it (and everything after it) all the way to the right edge.

---

# Multiple Choice Questions

### 1. Which CSS property distributes empty space between flex items along the Main Axis?
A. `align-items`
B. `justify-content`
C. `align-content`
D. `flex-direction`
**Answer:** B
**Explanation:** justify-content distributes spare space along the main axis. align-items operates along the perpendicular cross axis.

---

### 2. Which value of `justify-content` pushes the first item flush against the left boundary and the last item flush against the right boundary?
A. `space-around`
B. `space-evenly`
C. `space-between`
D. `center`
**Answer:** C
**Explanation:** space-between puts zero space at the outer ends, pushing the first and last items to the outer edges and distributing all remaining space in between.

---

### 3. What is the default value of `align-items` on a flex container?
A. `flex-start`
B. `center`
C. `stretch`
D. `baseline`
**Answer:** C
**Explanation:** stretch is the default value, causing all flex items without explicit cross-axis sizes to expand to the full height of the container.

---

### 4. Why does `justify-self: center;` fail to work on an individual child flex item?
A. The browser requires an -ms- vendor prefix
B. justify-self is not defined in the CSS Flexbox specification; items are distributed along the main axis as a collective sequence
C. It only works if the container is an inline element
D. It only works on images
**Answer:** B
**Explanation:** The CSS Flexbox specification does not include justify-self. To push a single flex item along the main axis, developers use margin auto properties.

---

### 5. If a parent flex container has `align-items: center;`, how can one specific child card stick to the bottom of the container?
A. Give that child `align-self: flex-end;`
B. Give that child `vertical-align: bottom;`
C. Give that child `float: bottom;`
D. Give that child `position: bottom;`
**Answer:** A
**Explanation:** align-self is an item-level property that allows an individual child to override the parent container's align-items rule.

---

## 7. Hands-on Practice Challenge: School Exam Hall Supervisor Desk

Build a realistic School Examination Hall seating layout:
1. An examination hall container with a defined height (`320px`) and `align-items: center`.
2. Three student desks arranged with `justify-content: space-between`.
3. An individual **Invigilator / Supervisor Desk** that uses `align-self: flex-start` to stay elevated at the teacher podium!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exam Hall Layout - Flex Alignment Lab</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .exam-hall {
      width: 100%;
      max-width: 750px;
      background-color: #ffffff;
      border-radius: 16px;
      border: 1px solid #cbd5e1;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }

    .hall-header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    .hall-header h2 {
      color: #0f172a;
      font-size: 1.3rem;
    }

    /* The Main Examination Arena (Flex Container) */
    .seating-arena {
      display: flex;
      justify-content: space-between; /* Main Axis: Spread across room */
      align-items: center;            /* Cross Axis: All students centered */
      height: 280px;
      background-color: #f8fafc;
      border: 2px dashed #94a3b8;
      border-radius: 12px;
      padding: 20px;
    }

    /* Standard Student Desks */
    .desk-card {
      width: 140px;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    }

    .roll-number {
      font-size: 0.8rem;
      font-weight: 700;
      color: #3b82f6;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .candidate-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    /* The Invigilator Desk: Breaks formation with align-self! */
    .supervisor-desk {
      align-self: flex-start; /* Overrides parent center! Sticks to podium */
      border: 2px solid #ef4444;
      background-color: #fff1f2;
    }

    .supervisor-desk .roll-number {
      color: #b91c1c;
    }

    .supervisor-desk .candidate-name {
      color: #991b1b;
    }
  </style>
</head>
<body>

  <div class="exam-hall">
    <div class="hall-header">
      <h2>CBSE Board Examination Hall No. 4</h2>
    </div>

    <div class="seating-arena">
      <!-- Supervisor elevated at flex-start -->
      <div class="desk-card supervisor-desk">
        <div class="roll-number">Supervisor</div>
        <div class="candidate-name">Mr. Verma</div>
      </div>

      <!-- Regular Students centered by parent align-items -->
      <div class="desk-card">
        <div class="roll-number">Desk 01</div>
        <div class="candidate-name">Rohan Roy</div>
      </div>

      <div class="desk-card">
        <div class="roll-number">Desk 02</div>
        <div class="candidate-name">Sanya Sen</div>
      </div>

      <div class="desk-card">
        <div class="roll-number">Desk 03</div>
        <div class="candidate-name">Dev Patel</div>
      </div>
    </div>
  </div>

</body>
</html>
```
