# Data Transformation & Cleaning with Power Query

Raw data is rarely analysis-ready. It arrives with missing headers, mixed data types, unwanted columns, and messy pivoted layouts. In the **Power Query Editor**, you can reshape and sanitize data with intuitive point-and-click tools.

---

## 1. Essential Everyday Transformations

In the Power Query Editor Ribbon:

* **Use First Row as Headers:** Promotes row 1 into official column headers (found under the **Home** tab).
* **Remove Columns:** Highlight unnecessary columns and click **Remove Columns** (or right-click > *Remove Other Columns* to protect against unexpected new columns).
* **Change Data Types:** Click the icon in the column header (e.g., 'ABC' for text, '123' for integer, '$' for currency, calendar for date) to enforce strict schema types.
* **Replace Values:** Right-click a column > **Replace Values...** to replace "N/A" or "NULL" with '0' or blank.
* **Split Column:** Split by delimiter (comma, space, custom character) or by number of characters.

![Data Transformation in Power Query](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. The Game Changer: Unpivot Columns

One of Power Query’s most celebrated superpowers is **Unpivoting**. Standard business reports often present data in a "wide" format (e.g., Months spread across columns: Jan, Feb, Mar... Dec):

```
The Problem (Wide Format - Terrible for Pivot Tables):
+------------+---------+---------+---------+
| Product    | Jan     | Feb     | Mar     |
+------------+---------+---------+---------+
| Laptops    | 100     | 120     | 140     |
+------------+---------+---------+---------+

The Solution (Unpivoted Normalized Format - Perfect for Analysis):
+------------+---------+---------+
| Product    | Month   | Sales   |
+------------+---------+---------+
| Laptops    | Jan     | 100     |
| Laptops    | Feb     | 120     |
| Laptops    | Mar     | 140     |
+------------+---------+---------+
```

### How to Unpivot in 2 Clicks:
1. Highlight the non-date columns (e.g., 'Product' and 'Region').
2. Go to the **Transform** tab.
3. Click the dropdown arrow on **Unpivot Columns** > choose **Unpivot Other Columns**.
4. Excel normalizes the wide monthly headers into two tidy columns: **Attribute** (Month) and **Value** (Sales)!

---

## 3. Adding Custom and Conditional Columns

* **Conditional Column (Add Column Tab):** Works like a visual IF-THEN-ELSE builder:
  * *If [Sales] is greater than 100,000, then "High", Else "Standard"*.
* **Custom Column:** Write expressions using the M language:
  ```m
  [UnitPrice] * [Quantity] * (1 - [Discount])
  ```
* **Column From Examples:** Type what you want the output to look like, and Power Query's pattern engine infers the transformation automatically!

---

# Multiple Choice Questions

### 1. What does the 'Unpivot Other Columns' command accomplish in Power Query?
A. It deletes all columns
B. It converts wide multi-column layouts into normalized tall rows, pairing attribute names with their values
C. It sorts data alphabetically
D. It creates a pie chart
**Answer:** B
**Explanation:** Unpivot transforms wide matrix presentations into tall, normalized tabular data suitable for Pivot Tables and database modeling.

---

### 2. How can you promote raw data row 1 to become official column headers in Power Query?
A. Press Ctrl + H
B. Home tab > 'Use First Row as Headers'
C. Rename each column manually
D. Cut and paste
**Answer:** B
**Explanation:** 'Use First Row as Headers' promotes the top row of records into column headers in a single step.

---

### 3. What does clicking 'Remove Other Columns' do compared to 'Remove Columns'?
A. Deletes all data in the table
B. Keeps only the currently highlighted columns and permanently removes everything else, making queries resilient to new unexpected columns
C. Removes only blank rows
D. Clears formatting
**Answer:** B
**Explanation:** 'Remove Other Columns' retains only the chosen columns, ensuring that future schema shifts or extra columns in source files do not disrupt the pipeline.

---

### 4. Which tab in the Power Query Editor allows you to generate new columns using visual IF-THEN rules?
A. Home tab
B. View tab
C. Add Column tab (Conditional Column)
D. Help tab
**Answer:** C
**Explanation:** The 'Conditional Column' tool is located on the Add Column tab and provides a visual interface for constructing IF-THEN logic.

---

### 5. If you make a mistake while cleaning data in Power Query, how do you undo it?
A. Press Ctrl + Z
B. Click the red 'X' next to that step in the 'Applied Steps' list in the Query Settings pane
C. Close Windows
D. Re-import the database
**Answer:** B
**Explanation:** In Power Query, pressing the red 'X' beside any step in the Applied Steps list deletes that transformation and restores the prior state.

---
