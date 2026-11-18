---
id: treemaps-and-heatmaps
slug: treemaps-and-heatmaps
course: tableau-for-beginners
chapter: "3: Core Visualizations & Chart Types"
topic: "3.3 Treemaps, Heatmaps & Highlight Tables"
title: "Treemaps, Heatmaps & Highlight Tables"
description: "Learn Treemaps, Heatmaps & Highlight Tables in Tableau with practical examples, analyst workflows, and interactive practice quizzes at MSK Institute."
difficulty: Beginner
readingTime: 6
order: 3
keywords:
  - treemaps heatmaps highlight tables
  - tableau tutorial
  - treemaps and heatmaps
  - data analysis course
  - MSK Institute
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

---

## 1. What is a Treemap?
A **Treemap** displays hierarchical, nested data as a set of nested rectangles.
- **Rectangle Size:** Represents a quantitative volume measure (e.g. Sales Volume).
- **Rectangle Color:** Represents a performance rate measure (e.g. Profit Margin %).

---

## 2. What is a Highlight Table (Heatmap)?
A **Highlight Table** is a numerical matrix where cell background colors are shaded based on values:
- Shows high-performing and underperforming intersections instantly.
- Created by dragging a continuous Measure onto the **Color** shelf while Mark type is set to **Square**.

---

## Practice Quiz
### 1. What two dimensions of data are simultaneously encoded in a standard Tableau Treemap?
A. Rectangle Area (Size) and Rectangle Color (Hue gradient)
B. Border width and font style
C. X-position and Y-position
D. Sound and animation
**Answer:** A
**Explanation:** Treemaps encode one metric as area/size and another metric as color gradient.
---

### 2. When is a Treemap significantly more effective than a Pie Chart?
A. When displaying part-to-whole relationships across dozens of categories with hierarchical nesting
B. When comparing 2 values
C. When showing chronological time
D. Never
**Answer:** A
**Explanation:** Treemaps efficiently utilize rectangular 2D space to display nested categories without slice clutter.
---

### 3. How do you create a Highlight Table (Heatmap) in Tableau?
A. Build a text table, drop a Measure on 'Color', and change Mark type to 'Square'
B. Draw shapes with a pencil
C. Use a pie chart
D. Write an SQL join
**Answer:** A
**Explanation:** Changing the mark type to 'Square' and dropping a measure on Color fills table cells with gradient heat shading.
---

### 4. Which built-in diverging color palette is standard in Tableau for visualizing positive vs negative profit?
A. Orange-Blue Diverging (or Red-Green Diverging)
B. Pastel 10
C. Greyscale
D. Yellow monochrome
**Answer:** A
**Explanation:** Orange-Blue and Red-Green diverging palettes clearly contrast negative vs positive performance.
---

### 5. In a Treemap, where does Tableau position the largest rectangular categories?
A. In the top-left quadrant of the visual
B. In the center
C. At the bottom-right
D. Randomly scattered
**Answer:** A
**Explanation:** Tableau's treemap layout algorithm arranges largest rectangles starting from top-left, cascading down to smallest at bottom-right.
---
