# Pivot Table Fields (Rows, Columns, Values, Filters)

The true agility of Pivot Tables lies in the **Four Quadrants** of the **PivotTable Fields** task pane. By dragging, reordering, and nesting fields across these zones, you can restructure massive reports in seconds without modifying the underlying data.

---

## 1. The Four Pivot Table Quadrants Explained

```
+-----------------------------------------------------------------------------------+
| 1. FILTERS (Top-Left)                                                            |
| Acts as a global report-level filter. Lets users filter the entire Pivot Table by |
| a higher-level category (e.g., Year = 2026 or Country = "India").                 |
+-----------------------------------------------------------------------------------+
| 2. COLUMNS (Top-Right)                                                           |
| Arranges the unique values of the selected field horizontally across column      |
| headers (e.g., Months: Jan, Feb, Mar, or Product Categories).                    |
+-----------------------------------------------------------------------------------+
| 3. ROWS (Bottom-Left)                                                             |
| Arranges unique values vertically down the left side of the table (e.g., Sales Rep|
| names, Departments, Customer IDs).                                               |
+-----------------------------------------------------------------------------------+
| 4. VALUES (Bottom-Right)                                                          |
| Contains the numeric fields to calculate and aggregate (e.g., Sum of Revenue,    |
| Average Unit Price, Count of Orders).                                            |
+-----------------------------------------------------------------------------------+
```

![Pivot Table Fields and Quadrants](/images/tutorials/ms-excel/pivot-tables-and-fields.svg)

---

## 2. Multi-Level Hierarchical Grouping

You are not limited to one field per quadrant. Dragging multiple fields into the **Rows** or **Columns** areas establishes visual reporting hierarchies:

### Example: Nested Row Hierarchy
1. Drag **Department** into Rows.
2. Drag **Sub-Category** into Rows directly beneath Department.
3. Drag **Employee Name** into Rows below Sub-Category.

*Result:* Excel creates expandable and collapsible tree levels (with `+` and `-` buttons) allowing managers to drill down from high-level departmental spending down to individual employee expenses.

---

## 3. Customizing Value Field Settings

By default, numeric fields placed into the Values quadrant default to **Sum of [Field]**. To modify how the data is aggregated or displayed:

1. Click the field inside the **Values** box.
2. Select **Value Field Settings...** from the popup menu.
3. In the dialog box, you have two key tabs:
   * **Summarize Values By:** Switch aggregation from **Sum** to **Count**, **Average**, **Max**, **Min**, or **Product**.
   * **Show Values As:** Express values as comparative metrics rather than raw dollars:
     * **% of Grand Total:** Calculates each category's percentage contribution to overall business revenue.
     * **% of Column Total / % of Row Total:** Segment contributions.
     * **Running Total In:** Cumulative year-to-date tracking.
     * **Difference From:** Variance against previous period or benchmark.
4. Click **Number Format** in the bottom-left corner to apply Currency, Accounting, or Decimal formatting directly across all Pivot Table cells simultaneously!

---

# Multiple Choice Questions

### 1. Which Pivot Table quadrant controls the global, top-level filtering for the entire report?
A. Rows
B. Columns
C. Filters
D. Values
**Answer:** C
**Explanation:** Placing a field in the Filters area creates a global dropdown filter above the Pivot Table that filters all displayed data.

---

### 2. What happens when you place two fields (e.g., Region and Salesperson) into the 'Rows' area?
A. The second field replaces the first
B. Excel builds a hierarchical grouped drill-down structure with expand/collapse buttons
C. Excel returns an error
D. The table turns into a chart
**Answer:** B
**Explanation:** Adding multiple fields to the Rows area creates a nested hierarchy where sub-items are indented and grouped under parent categories.

---

### 3. Where do you change a Pivot Table calculation from 'Sum of Sales' to 'Average of Sales'?
A. Home tab > Number group
B. Value Field Settings > Summarize Values By tab
C. Page Layout tab
D. File > Options
**Answer:** B
**Explanation:** Clicking the field in the Values quadrant and choosing 'Value Field Settings...' allows you to change the aggregation method from Sum to Average, Count, Max, Min, etc.

---

### 4. Which option under the 'Show Values As' tab allows you to see what percentage each product contributes to overall company revenue?
A. Running Total In
B. % of Grand Total
C. Difference From
D. Index
**Answer:** B
**Explanation:** '% of Grand Total' recalculates raw numerical values into percentages that add up to 100% across the table grand total.

---

### 5. Why should you format numbers using the 'Number Format' button inside Value Field Settings rather than standard Home tab formatting?
A. Home tab formatting crashes Pivot Tables
B. Formatting through Value Field Settings persists permanently even when the table is pivoted, restructured, or refreshed
C. It reduces file size by 50%
D. It is mandatory for formulas to calculate
**Answer:** B
**Explanation:** Applying number formats within Value Field Settings locks the format to that data field so that rearranging or refreshing the Pivot Table preserves the currency and decimal styling.

---
