# Tables and Matrices in Power BI

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Table Visual vs Matrix Visual
- **Table Visual:** A flat, two-dimensional grid of rows and columns (similar to a standard Excel table).
- **Matrix Visual:** The Power BI equivalent of an **Excel PivotTable**. Supports row hierarchies, column hierarchies, drill-down buttons ($+$ and $-$), stepped layouts, and conditional formatting.

---

## 2. Conditional Formatting in Matrices
Transform numbers into visual heatmaps:
- **Background Color:** Shades cells from light to dark based on value magnitude.
- **Data Bars:** Embeds mini horizontal bars directly inside numerical cells.
- **Icons:** Displays red/yellow/green KPI indicators based on performance thresholds.

---

# Multiple Choice Questions

### 1. What is the key functional difference between a Table visual and a Matrix visual in Power BI?
A. A Matrix supports row and column hierarchies with collapsible drill-down levels (like an Excel PivotTable), whereas a Table is flat
B. Tables cannot display numbers
C. Matrices only work on dates
D. Tables cost money
**Answer:** A
**Explanation:** The Matrix visual provides multidimensional grouping, subtotals, and stepped hierarchy expansion.
---

### 2. Which conditional formatting feature embeds miniature horizontal bars inside table cells?
A. Data Bars
B. Mini charts
C. Micro plots
D. Cell lines
**Answer:** A
**Explanation:** Data Bars visualize relative numbers directly inside table cells without needing a separate chart.
---

### 3. How do you enable stepped layout formatting in a Matrix visual?
A. In the Format pane under `Row headers > Options`, toggle 'Stepped layout' on
B. Write a custom DAX measure
C. Use Power Query
D. Refresh the report
**Answer:** A
**Explanation:** Stepped layout indents nested sub-levels within a single visual column.
---

### 4. Can a Matrix visual display subtotals for individual hierarchy levels?
A. Yes, subtotals can be independently toggled for row levels and column levels in the Format pane
B. No, only grand totals are possible
C. Only if exported to Excel
D. Only for currency fields
**Answer:** A
**Explanation:** Subtotals can be customized for specific row and column dimensions.
---

### 5. How can you sort a Matrix visual by a specific measure (e.g. Total Revenue descending)?
A. Click the column header once to sort ascending, twice to sort descending
B. Re-order rows in Power Query
C. Change the source file
D. Delete the table
**Answer:** A
**Explanation:** Clicking column headers triggers interactive sorting.
---
