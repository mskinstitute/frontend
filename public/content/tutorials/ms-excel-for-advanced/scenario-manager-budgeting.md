# Scenario Manager for Multi-Model Budgeting

Financial planning and executive forecasting require evaluating multiple potential futures: What if sales explode? What if a recession hits? What if raw material tariffs jump 15%? **Scenario Manager** allows you to define, store, and switch between multiple sets of input assumptions—such as **Best Case**, **Worst Case**, and **Expected Case**—and compile them into a unified Executive Summary report.

---

## 1. What is Scenario Manager?

Instead of creating three duplicate copies of a budget workbook, Scenario Manager stores alternative values for specific "changing cells" inside a single model:

```
Scenario Comparison Structure:
+-------------------+---------------+---------------+---------------+
| Assumption Input  | Worst Case    | Base Case     | Best Case     |
+-------------------+---------------+---------------+---------------+
| Units Sold        | 8,000         | 15,000        | 25,000        |
| Unit Sales Price  | $40           | $50           | $55           |
| Cost of Goods     | $28           | $22           | $18           |
+-------------------+---------------+---------------+---------------+
| Net Profit Result | $96,000       | $420,000      | $925,000      |
+-------------------+---------------+---------------+---------------+
```

![What-If Analysis Scenario Manager](/images/tutorials/ms-excel/executive-sales-dashboard.svg)

---

## 2. Step-by-Step: Creating Scenarios

### Step 1: Name Your Input Cells (Crucial Best Practice!)
Before opening Scenario Manager, give descriptive names to your input cells using the **Name Box**:
* Cell B2 -> **UnitsSold**
* Cell B3 -> **UnitPrice**
* Cell B4 -> **UnitCost**
*(If you don't name your cells, your final executive summary will display cryptic coordinates like B2, B3, B4 instead of readable labels!)*

### Step 2: Build the Scenarios
1. Go to **Data > Forecast group > What-If Analysis > Scenario Manager...**.
2. Click **Add**:
   * **Scenario name:** Type **Base Case**.
   * **Changing cells:** Highlight '$B$2:$B$4'. Click **OK**.
   * Enter the Base Case values and click **Add**.
3. Create **Best Case**:
   * Scenario name: **Best Case**.
   * Enter optimistic values: Units = 25000, Price = 55, Cost = 18. Click **Add**.
4. Create **Worst Case**:
   * Scenario name: **Worst Case**.
   * Enter pessimistic values: Units = 8000, Price = 40, Cost = 28. Click **OK**.

---

## 3. Generating the Scenario Summary Report

Once all scenarios are recorded:
1. In the Scenario Manager dialog box, click **Summary...**.
2. Choose report type: **Scenario summary** (or *Scenario PivotTable report*).
3. In **Result cells**, select your final bottom-line formula cell (e.g., '$B$8' for Net Profit).
4. Click **OK**.

*Excel immediately generates a brand-new, beautifully formatted summary worksheet displaying all three scenarios side-by-side with their resulting net profits!*

---

# Multiple Choice Questions

### 1. Where is Scenario Manager located in Microsoft Excel?
A. Home tab > Cells group
B. Data tab > Forecast group > What-If Analysis > Scenario Manager...
C. Insert tab > Tables
D. View tab > Macros
**Answer:** B
**Explanation:** Scenario Manager is located on the Data tab under What-If Analysis in the Forecast command group.

---

### 2. Why is naming your changing cells (e.g., 'UnitPrice' instead of 'B3') highly recommended before building scenarios?
A. Unnamed cells cause Excel to crash
B. The generated Scenario Summary report displays readable names instead of ambiguous cell addresses like B2, B3, B4
C. It protects the cells with a password
D. Named cells calculate twice as fast
**Answer:** B
**Explanation:** The Scenario Summary report displays cell names in its leftmost column; naming cells ensures the report reads cleanly without cryptic coordinates.

---

### 3. What does clicking the 'Show' button in Scenario Manager do?
A. Opens the print preview
B. Injects the selected scenario's values directly into the active worksheet model
C. Converts all numbers into charts
D. Deletes the scenario
**Answer:** B
**Explanation:** Clicking 'Show' applies the stored variable values of that scenario directly to the active worksheet to view the recalculation live.

---

### 4. How many changing cells can a single scenario accommodate in Excel?
A. Only 1
B. Up to 32 changing cells
C. Exactly 5
D. Unlimited
**Answer:** B
**Explanation:** Excel Scenario Manager allows up to 32 changing cells per individual scenario.

---

### 5. What output does the 'Summary...' button produce in Scenario Manager?
A. A text message sent to email
B. A brand-new summary worksheet comparing all defined scenarios and their final result cells side-by-side
C. A PowerPoint presentation
D. An error report
**Answer:** B
**Explanation:** The 'Summary...' command creates a dedicated formatted comparison table summarizing input assumptions and bottom-line results across all scenarios.

---
