# Level of Detail (LOD) Expressions: FIXED, INCLUDE & EXCLUDE

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

![Tableau LOD Expressions](/images/tutorials/tableau-for-beginners/tableau-lod-expressions-visual.svg)

---

## 1. What are LOD Expressions?
In standard Tableau charts, computations are performed at the **Viz Level of Detail (VizLoD)** determined by the dimensions placed on the shelves.

**Level of Detail (LOD) Expressions** allow you to compute values at a **different level of granularity** than what is displayed on the chart!

---

## 2. The 3 LOD Keywords
1. **`{ FIXED [Dimension] : Expression }`**: Computes an aggregation at the exact specified dimension level, **ignoring all other dimensions** on the canvas.
2. **`{ INCLUDE [Dimension] : Expression }`**: Computes at a **finer / more granular** level than what is on the canvas.
3. **`{ EXCLUDE [Dimension] : Expression }`**: Computes at a **coarser / less granular** level, ignoring a specific dimension displayed on the canvas.

---

## 3. Classic FIXED LOD Example
```text
// Calculate each customer's very first order date (cohort analysis)
{ FIXED [Customer ID] : MIN([Order Date]) }

// Calculate total sales for the region, regardless of what state is filtered
{ FIXED [Region] : SUM([Sales]) }
```

---

# Multiple Choice Questions

### 1. Which LOD expression computes values at the specified dimension level, completely independent of whatever dimensions are placed on the visualization shelves?
A. `FIXED`
B. `INCLUDE`
C. `EXCLUDE`
D. `STATIC`
**Answer:** A
**Explanation:** `FIXED` locks calculation granularity strictly to the declared dimension list.
---

### 2. How are LOD expressions enclosed syntactically in Tableau?
A. Inside curly braces: `{ FIXED [Region] : SUM([Sales]) }`
B. Inside parentheses: `(FIXED [Region] : SUM([Sales]))`
C. Inside square brackets: `[FIXED [Region] : SUM([Sales])]`
D. Inside quotes
**Answer:** A
**Explanation:** All Level of Detail expressions are wrapped in curly brackets `{ ... }`.
---

### 3. Which LOD expression is evaluated BEFORE standard dimension filters in Tableau's Order of Operations?
A. `FIXED`
B. `INCLUDE`
C. `EXCLUDE`
D. Table Calculations
**Answer:** A
**Explanation:** `FIXED` expressions evaluate before regular dimension filters (unless the filter is promoted to a Context Filter).
---

### 4. What would `{ FIXED : SUM([Sales]) }` calculate?
A. The grand total of sales across the entire dataset, regardless of any dimensions on the chart
B. Zero
C. An error
D. Sales of the first row
**Answer:** A
**Explanation:** A `FIXED` expression with no dimension specified calculates a global table-wide scalar aggregation.
---

### 5. Why would an analyst use an `EXCLUDE` LOD expression?
A. To omit a dimension displayed on the canvas when calculating an overall subtotal or proportion
B. To delete a column
C. To ban certain users
D. To speed up Windows
**Answer:** A
**Explanation:** `EXCLUDE` subtracts dimensions from the VizLoD when computing the measure.
---
