# Bar Charts, Stacked Bars & Side-by-Side Bars

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Building Bar Charts in Tableau
1. Drag `[Category]` (Blue Dimension) to **Columns**.
2. Drag `[Sales]` (Green Measure) to **Rows**.
3. Tableau instantly renders vertical bars using VizQL.

---

## 2. Interactive Sorting Options
- **One-Click Sort:** Hover over an axis and click the sort icon (Sort Ascending / Sort Descending).
- **Toolbar Buttons:** Quick sort buttons on the top application toolbar.
- **Manual Sorting:** Click and drag individual headers to rearrange orders.
- **Computed Sort:** Right-click the dimension on the shelf $	o$ **Sort** $	o$ Sort by Field (e.g. Sort Subcategory by `SUM(Profit)` descending).

---

# Multiple Choice Questions

### 1. How do you switch a vertical bar chart into a horizontal bar chart with one click in Tableau Desktop?
A. Click the 'Swap Rows and Columns' icon on the toolbar (Ctrl + W)
B. Delete and rebuild the chart
C. Rotate the monitor
D. Use a table calculation
**Answer:** A
**Explanation:** The 'Swap Rows and Columns' button (shortcut Ctrl + W) instantly transposes axes.
---

### 2. How do you create a stacked bar chart in Tableau?
A. Drag a secondary dimension (e.g. `[Region]`) onto the 'Color' shelf of the Marks card
B. Stack charts on top of each other manually
C. Use a formula
D. Enable 3D mode
**Answer:** A
**Explanation:** Adding a dimension to 'Color' partitions each bar into color-coded segments stacked vertically.
---

### 3. What is the difference between a Stacked Bar Chart and a Side-by-Side Bar Chart in Tableau?
A. Side-by-Side bars place subcategories as separate adjacent bars by adding the second dimension to the Columns shelf alongside the first
B. Side-by-side bars only work on dates
C. Stacked bars cannot show numbers
D. Side-by-side bars are deprecated
**Answer:** A
**Explanation:** Placing both dimensions on the Columns shelf groups bars side-by-side for direct height comparison.
---

### 4. What happens when you sort a dimension by a field that is not currently visible on the chart (e.g. sort Category bars by Profit)?
A. Tableau calculates the sorting order using the hidden measure while displaying the primary measure
B. An error is thrown
C. The chart turns red
D. Data is deleted
**Answer:** A
**Explanation:** The Sort dialog allows ordering categories by any valid measure in the data model.
---

### 5. How can you display the exact sales value at the end of every bar in Tableau?
A. Click the 'T' icon (Show Mark Labels) on the top toolbar or drop `SUM(Sales)` onto 'Label'
B. Write a Python script
C. Use the zoom tool
D. Hover only
**Answer:** A
**Explanation:** The 'Show Mark Labels' toolbar toggle immediately renders data labels on all marks.
---
