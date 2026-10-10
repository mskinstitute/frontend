---
id: css-multi-column-layouts
slug: css-multi-column-layouts
course: css-for-advanced
chapter: CSS Shapes and Advanced Layouts
topic: "CSS Multi-Column Layouts: Newspaper Columns, Gaps, and Column Rules"
difficulty: Advanced
readingTime: 14
order: 11
keywords: ["css columns", "multi-column layout", "column-count", "column-width", "column-rule", "column-span", "newspaper layout css"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# CSS Multi-Column Layouts: Newspaper Columns, Gaps, and Column Rules

Pick up a morning copy of an Indian daily newspaper like *The Times of India* or *The Hindu*, or inspect a printed CBSE board examination question paper. You will notice that text is never printed as a single line running all the way across an entire broadsheet page. If it did, your eyes would get exhausted trying to track 150 words on a single horizontal line!

Instead, articles flow into **narrow vertical columns**. When text reaches the bottom of Column 1, it automatically spills over to the top of Column 2, and continues seamlessly into Column 3. 

While CSS Flexbox and Grid are ideal for positioning distinct component boxes, **CSS Multi-Column Layout** is the only native web specification designed specifically for flowing continuous prose and editorial text.

---

## 1. How Multi-Column Flow Works

In a multi-column container, the browser handles text flow dynamically:

```
+-------------------------------------------------------------------------+
|                  THE CSS MULTI-COLUMN FLOW ARCHITECTURE                 |
+-------------------------------------------------------------------------+

  [HEADLINE: column-span: all (Spans across all columns!)]
  =========================================================================

  COLUMN 1            | COLUMN 2            | COLUMN 3
  The annual science  | models explaining   | winners received
  exhibition at Delhi | solar satellite     | certificates from
  Public School was   | propulsion and bio- | the state education
  inaugurated with    | enzymatic cleaning. | minister yesterday.
  great fanfare. Over |                     |
  500 student teams   | Several distinguished| "Our students showed
  presented working   | mentors attended    | extraordinary depth,"
  prototypes and 3D   | the event...        | remarked the head...
                      |                     |
          [column-rule: 1px solid divider line between columns]
```

---

## 2. Core Properties: `column-count` vs `column-width`

You can define columns in two ways:

### 1. `column-count`: Fixed Number of Columns
Forces the container into a specific number of columns:

```css
.editorial-body {
  column-count: 3; /* Always 3 columns */
}
```
*Disadvantage:* On a narrow mobile phone screen, 3 columns will become unreadable, 30-pixel-wide vertical slivers!

### 2. `column-width`: Optimal Responsive Column Width
Sets the **ideal minimum width** for each column:

```css
.editorial-body {
  column-width: 260px; /* Each column should be at least 260px wide */
}
```
*The Magic:* If the screen is `900px` wide, the browser automatically creates 3 columns. If the screen shrinks to `600px`, it drops to 2 columns. On a `360px` phone, it drops to 1 column **without needing a single media query**!

### 3. The `columns` Shorthand:
You can combine both count and width into the `columns` shorthand:

```css
.editorial-body {
  /* Syntax: columns: <column-width> <column-count>; */
  columns: 280px 3; /* Maximum 3 columns, but never narrower than 280px */
}
```

---

## 3. Formatting Spacing and Dividers: `column-gap` and `column-rule`

To prevent text from colliding into neighboring columns, use `column-gap`. To draw classic editorial vertical divider lines, use `column-rule`:

```css
.newspaper-article {
  columns: 280px 3;
  
  /* Space between columns */
  column-gap: 36px;
  
  /* Vertical dividing line: width style color */
  column-rule: 1px solid #cbd5e1;
}
```

> **Note:** `column-rule` does not take up any space of its own! It is drawn directly in the middle of the `column-gap`.

---

## 4. Breaking Across Columns: `column-span: all`

What if you want a prominent sub-heading, an inspiring quote, or an infographic banner to interrupt the columns and stretch across the full width of the page?

Declare `column-span: all;`:

```css
.newspaper-article h2.lead-banner {
  /* Spans across all active columns in the container */
  column-span: all;
  margin: 30px 0 20px;
  text-align: center;
  border-top: 2px solid #0f172a;
  border-bottom: 2px solid #0f172a;
  padding: 12px 0;
}
```

```
+-------------------------------------------------------------------------+
|                  EFFECT OF column-span: all                             |
+-------------------------------------------------------------------------+

  [Column 1 Text...]   |  [Column 2 Text...]   |  [Column 3 Text...]
  ---------------------+-----------------------+---------------------
  [FULL-WIDTH SUBHEAD: column-span: all (Breaks across everything!)]
  ---------------------+-----------------------+---------------------
  [Column 1 continues] |  [Column 2 continues] |  [Column 3 continues]
```

---

## 5. Preventing Broken Cards: `break-inside: avoid`

A common issue in multi-column layouts is that the browser can slice a paragraph, warning box, or photo right down the middle across two separate columns:

```
BAD (Card gets cut in half across columns!):
  COLUMN 1                  COLUMN 2
  +--------------------+    | (continued) Notes:
  | Exam Tip Card:     |    | Revise Chapter 4 & 5
  | Study physics formulas  +--------------------+
```

To guarantee that callout boxes, exam notes, or images stay intact as a single solid unit, apply **`break-inside: avoid;`**:

```css
.exam-tip-box {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  
  /* CRITICAL: Never split this box across two different columns! */
  break-inside: avoid;
  page-break-inside: avoid; /* Legacy browser fallback */
}
```

---

## 6. Multi-Column vs Grid vs Flexbox: When to Use Which?

| Layout System | Primary Purpose | How Content Flows | Real-World Metaphor |
| :--- | :--- | :--- | :--- |
| **Multi-Column** | Flowing continuous editorial prose | Continuous flow from bottom of column 1 to top of column 2 | Newspaper or book pages |
| **CSS Grid** | Structural 2D page architecture | Placed into distinct grid rows & columns | Construction scaffolding / Chessboard |
| **Flexbox** | 1D alignment of components | Distributed along single row or column | People lining up in an assembly line |

---

## 7. Do's and Don'ts

| Practice | Bad Approach | Good Approach | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Mobile Columns** | Hardcoding `column-count: 3;` on mobile viewports | Using `column-width: 260px;` or `columns: 280px 3;` | Prevents cramped, unreadable vertical columns on mobile phones. |
| **Unbroken Callouts** | Letting note boxes get sliced across column breaks | Setting `break-inside: avoid;` on callout boxes | Prevents broken visual boxes and awkward reading interruptions. |
| **Column Dividers** | Adding manual right borders (`border-right`) on elements | Using `column-rule: 1px solid #cbd5e1;` | `column-rule` automatically appears between columns and omits outer margins. |
| **Column Height** | Fixing a rigid `height: 200px;` on long articles | Letting height remain `auto` | Fixed heights cause column content to overflow horizontally past screen bounds. |

---

## 8. Quick Revision Summary Cheat Sheet

- **`column-count: N`**: Forces exactly $N$ columns.
- **`column-width: <length>`**: Responsive minimum column width; adds or removes columns automatically.
- **`columns: 260px 3`**: Recommended shorthand combining minimum width and maximum count.
- **`column-gap`**: Horizontal clearance between columns.
- **`column-rule`**: Border-like line drawn in the gap between columns.
- **`column-span: all`**: Breaks an element out of columns to span the entire container width.
- **`break-inside: avoid`**: Prevents child cards or figures from splitting across column boundaries.

---

# Multiple Choice Questions

### 1. Which CSS Multi-column property creates responsive columns that automatically adjust their count based on screen width without requiring media queries?
A. `column-count: 4;`
B. `column-width: 280px;`
C. `column-gap: 50px;`
D. `column-fill: auto;`
**Answer:** B
**Explanation:** `column-width` defines the ideal minimum width for each column. The browser fits as many columns of at least that width as the container allows, adding or dropping columns responsively.

---

### 2. How can an editorial sub-heading break out of the multi-column flow to span across all columns horizontally?
A. `display: block;`
B. `column-span: all;`
C. `grid-column: 1 / -1;`
D. `float: none;`
**Answer:** B
**Explanation:** `column-span: all` breaks the element out of column flow, spanning the full width of the multi-column container while subsequent text resumes below it.

---

### 3. Which property prevents a warning callout box or image from being sliced in half across two columns?
A. `column-break: never;`
B. `break-inside: avoid;`
C. `overflow: hidden;`
D. `column-fill: balance;`
**Answer:** B
**Explanation:** `break-inside: avoid` instructs the rendering engine to never introduce a column or page break inside the designated element, keeping it whole in a single column.

---

### 4. Where does the `column-rule` property render visually?
A. Around the outer perimeter border of the container
B. Underneath all headings
C. Centered directly inside the `column-gap` between adjacent columns
D. Only on the right side of the container
**Answer:** C
**Explanation:** `column-rule` acts as a vertical separator drawn inside the gap between columns without taking up any layout width.

---

### 5. Why should you avoid setting a rigid fixed `height` (e.g., `height: 300px;`) on a multi-column article container?
A. It causes the text to turn red
B. When content exceeds the fixed height, the browser creates extra columns horizontally that can spill off the screen, causing unexpected horizontal scrolling
C. It disables `column-gap`
D. It deletes the font styles
**Answer:** B
**Explanation:** In multi-column containers with fixed heights, text that overflows the vertical space generates new columns to the right, causing horizontal overflow.

---

# Hands-on Practice Challenge

Build an authentic Indian school journal newspaper page featuring a full-width masthead headline, a 3-column responsive layout with column rules, and an unbroken callout quote.

### Requirements:
1. Wrap the article text in a container with `columns: 260px 3;`, `column-gap: 32px;`, and `column-rule: 1px solid #e2e8f0;`.
2. Add a prominent headline spanning all columns using `column-span: all;`.
3. Include an "Exam Advisory Note" callout box styled with `break-inside: avoid;`.

### Complete Solution:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>School Journal Multi-Column Page</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
    }

    body {
      min-height: 100vh;
      background: #f1f5f9;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }

    .broadsheet {
      width: 100%;
      max-width: 980px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 48px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
    }

    /* 1. NEWSPAPER MULTI-COLUMN CONTAINER */
    .article-columns {
      columns: 260px 3;
      column-gap: 36px;
      column-rule: 1px solid #e2e8f0;
      text-align: justify;
      line-height: 1.7;
      color: #334155;
    }

    /* 2. FULL-SPANNING MASTHEAD HEADLINE */
    .lead-headline {
      column-span: all;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 900;
      color: #0f172a;
      text-align: center;
      line-height: 1.2;
      margin-bottom: 24px;
      border-top: 3px double #0f172a;
      border-bottom: 3px double #0f172a;
      padding: 16px 0;
      letter-spacing: -0.5px;
    }

    .article-columns p {
      margin-bottom: 16px;
      font-size: 0.95rem;
    }

    .dropcap::first-letter {
      font-size: 3.2rem;
      float: left;
      line-height: 0.8;
      margin-right: 8px;
      font-weight: bold;
      color: #1e3a8a;
    }

    /* 3. UNBROKEN CALLOUT BOX (break-inside: avoid) */
    .callout-box {
      break-inside: avoid;
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 16px 18px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .callout-box h4 {
      color: #0284c7;
      font-size: 0.9rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .callout-box p {
      font-size: 0.85rem;
      margin-bottom: 0;
      color: #475569;
      line-height: 1.5;
    }
  </style>
</head>
<body>

  <main class="broadsheet">
    <div class="article-columns">
      <h1 class="lead-headline">Kendriya Vidyalaya Inaugurates State-of-the-Art Astronomy Observatory</h1>

      <p class="dropcap">
        Equipped with an advanced 14-inch motorized Schmidt-Cassegrain telescope and high-resolution CCD spectrographs, the new rooftop astronomical facility represents a milestone for regional high school science education. Over eight hundred students across senior batches will now conduct nocturnal observation logs.
      </p>

      <p>
        The initiative was sanctioned under the National STEM Grant to encourage practical celestial mechanics. Prior to this, students relied purely on theoretical textbook diagrams to compute planetary orbits and lunar eclipse cycles.
      </p>

      <!-- Unbroken callout box -->
      <div class="callout-box">
        <h4>Observatory Note</h4>
        <p>Public star-gazing sessions for parents and alumni will be held every Friday from 7:30 PM onwards, weather permitting.</p>
      </div>

      <p>
        "When a child peers through an optical eyepiece and witnesses Saturn's icy rings with their own eyes, astronomy transforms from an abstract examination topic into a lifelong passion," remarked Vice Principal Dr. Sunita Kulkarni during the opening ceremony.
      </p>

      <p>
        Student astronomy club volunteers have already compiled baseline photometric readings of Jupiter's Galilean satellites. In coming months, the facility plans to coordinate live telescope data-sharing with regional university physics departments.
      </p>
    </div>
  </main>

</body>
</html>
```
