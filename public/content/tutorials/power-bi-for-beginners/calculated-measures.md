# Calculated Measures & Filter Context

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is a Calculated Measure?
A **Calculated Measure** is a dynamic DAX calculation that does not store values in tables. Instead, it computes values **on demand** in response to the active **Filter Context** created by visual elements, slicers, row headers, and column headers.

---

## 2. The Concept of Filter Context
Consider this visual: A table showing `Total Sales` by `City`.
- For the row showing "Delhi", the filter context is `City = "Delhi"`.
- The measure `SUM(Sales[Revenue])` automatically evaluates only for rows where `City == "Delhi"`.
- For the "Mumbai" row, the filter context shifts to `City = "Mumbai"`.

---

## 3. The Crown Jewel of DAX: `CALCULATE()`
**`CALCULATE()`** is the most important function in all of Power BI. It is the **only** function that can modify, override, or clear the active Filter Context:

```dax
// Overrides active city filter to calculate Delhi Sales anywhere!
Delhi Sales = CALCULATE(
    [Total Sales],
    Customers[City] == "Delhi"
)

// Clears all filters to calculate Grand Total (% of Total)
All Region Sales = CALCULATE(
    [Total Sales],
    ALL(Customers[Region])
)

Percent of Total = DIVIDE([Total Sales], [All Region Sales], 0)
```

---

# Multiple Choice Questions

### 1. Which function is considered the most powerful and fundamental in DAX because it can modify the active filter context?
A. `CALCULATE()`
B. `SUM()`
C. `FILTER()`
D. `LOOKUP()`
**Answer:** A
**Explanation:** `CALCULATE(Expression, Filter1, Filter2...)` evaluates an expression in a modified filter context.
---

### 2. What does the `ALL()` function do when used inside `CALCULATE([Total Sales], ALL(Product[Category]))`?
A. Clears/removes any active filters on the Product Category column, returning the grand total across all categories
B. Selects all products
C. Deletes the categories
D. Shows all rows in red
**Answer:** A
**Explanation:** `ALL()` ignores any slicers or visual row filters on the specified column, making it essential for calculating '% of Total'.
---

### 3. What is 'Filter Context' in Power BI?
A. The set of all active filters applied to the data model at the moment a visual cell is evaluated (coming from slicers, row headers, and report filters)
B. The background color of the canvas
C. The user's login username
D. An error message
**Answer:** A
**Explanation:** Filter context defines the subset of rows that are active and visible during measure computation.
---

### 4. What is the recommended best practice for organizing DAX measures in a complex Power BI report?
A. Create an empty dedicated measure table (e.g. `_All Measures`) to keep all business KPIs organized in one central location
B. Scatter them randomly across data tables
C. Save them in Notepad
D. Never use measures
**Answer:** A
**Explanation:** Storing measures in a dedicated table (often prefixed with `_` to sort at the top) keeps enterprise models clean and structured.
---

### 5. What does the `USERELATIONSHIP()` function do inside `CALCULATE()`?
A. Activates an inactive relationship for the duration of that specific calculation (e.g. calculating sales by Ship Date instead of Order Date)
B. Creates user logins
C. Sends emails to team members
D. Merges tables permanently
**Answer:** A
**Explanation:** `USERELATIONSHIP(FK, PK)` temporarily activates an inactive relationship during measure evaluation.
---
