# Sorting, Filtering and Summarizing Pivot Data

Once you have constructed a Pivot Table, the next step is transforming it into an executive-ready report. Excel provides powerful tools to sort data dynamically, filter using Label and Value filters, and customize numeric calculations to uncover high-impact insights.

---

## 1. Sorting Pivot Table Data

By default, Pivot Tables sort row labels alphabetically (A to Z). In financial and operational reports, you almost always want to sort by **magnitude** (e.g., highest revenue to lowest):

* **Quick Right-Click Sort:** Right-click any cell in the numeric Values column, choose **Sort**, and click **Sort Largest to Smallest**. The entire list of items re-orders according to their numeric performance.
* **More Sort Options Dialog:** Click the filter drop-down arrow on the Row Labels header, choose **More Sort Options...**, and select:
  * Ascending (A to Z) by [Field Name]
  * Descending (Z to A) by [Sum of Revenue]

![Pivot Table Summaries and Sorting](/images/tutorials/ms-excel/pivot-tables-and-fields.svg)

---

## 2. Advanced Pivot Filtering

Beyond basic checkbox filters, Pivot Tables offer two advanced filtering engines:

### A. Label Filters (Filtering by Text/Names)
Click the Row Label dropdown > **Label Filters**:
* **Equals / Does Not Equal:** Filter specific categories.
* **Begins With / Ends With:** Locate SKUs or departments matching specific prefixes.
* **Contains:** Search for words like "Special" or "Premium" in product names.

### B. Value Filters (Filtering by Aggregated Numbers)
Click the Row Label dropdown > **Value Filters**:
* **Greater Than / Less Than:** Show only sales reps whose total revenue exceeds $100,000.
* **Top 10...:** Keep only the Top 5 or Top 10 performers. You can also filter by percentage (e.g., top 20% of contributors) or sum.

---

## 3. Customizing Subtotals and Grand Totals

Under the contextual **Design** tab on the Ribbon (available when clicking inside the Pivot Table):

* **Subtotals:**
  * *Do Not Show Subtotals:* Eliminates clutter in flat reports.
  * *Show all Subtotals at Bottom / Top of Group:* Positions category subtotals.
* **Grand Totals:**
  * *Off for Rows and Columns:* Removes totals when displaying percentages or ratios.
  * *On for Rows and Columns:* Full enterprise summary.
* **Report Layout:**
  * *Compact Form (Default):* Minimizes column width.
  * *Outline Form:* Places nested fields in separate adjacent columns.
  * *Tabular Form:* Traditional grid layout, ideal for copying into other models or databases (with *Repeat All Item Labels* option).

---

# Multiple Choice Questions

### 1. How can you instantly sort a Pivot Table so the salesperson with the highest total revenue appears at the top?
A. Select all cells and press Ctrl + S
B. Right-click any number in the Revenue column, choose Sort > Sort Largest to Smallest
C. Re-order the rows manually in the source table
D. Create a pie chart
**Answer:** B
**Explanation:** Right-clicking any value in the target column and choosing Sort > Sort Largest to Smallest dynamically orders the row items by their aggregated value.

---

### 2. Which filter type in a Pivot Table allows you to display only departments whose total expenditure is greater than $500,000?
A. Label Filter
B. Value Filter
C. Font Filter
D. Wildcard Filter
**Answer:** B
**Explanation:** Value Filters evaluate the aggregated metric in the Values area (such as total expenditure) against numeric conditions like 'Greater Than'.

---

### 3. Which Report Layout format places each nested row field in its own separate column, making it ideal for copying into other databases?
A. Compact Form
B. Tabular Form
C. Minimalist Form
D. Outline Form
**Answer:** B
**Explanation:** Tabular Form presents the Pivot Table in a traditional rectangular grid where each row field occupies its own distinct column.

---

### 4. Where on the Ribbon do you customize Subtotals, Grand Totals, and Report Layout for an active Pivot Table?
A. Home tab > Styles group
B. PivotTable Design tab
C. Data tab > Queries & Connections
D. Review tab > Changes
**Answer:** B
**Explanation:** The contextual PivotTable Design ribbon tab contains command groups for Subtotals, Grand Totals, Report Layout, and PivotTable Styles.

---

### 5. What does the 'Top 10...' Value Filter allow you to do?
A. Only display the first 10 rows in the raw source data
B. Dynamically isolate the top or bottom N items, percent, or sum based on a chosen value metric
C. Color the top 10 cells yellow
D. Restrict access to top 10 executives
**Answer:** B
**Explanation:** The 'Top 10...' dialog box enables dynamic filtering to display the top or bottom N items, percentages, or cumulative sums according to any value field.

---
