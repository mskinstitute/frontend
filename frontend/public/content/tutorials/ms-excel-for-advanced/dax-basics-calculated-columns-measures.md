# DAX Basics (Calculated Columns, Measures, SUMX, CALCULATE)

**DAX (Data Analysis Expressions)** is the formula language of Power Pivot and Microsoft Power BI. While DAX resembles standard Excel formulas, it operates on a fundamentally different paradigm based on **tables, columns, row context, and filter context**.

---

## 1. Calculated Columns vs. DAX Measures

```
+-----------------------------------+-----------------------------------+
| Calculated Column                 | Explicit DAX Measure              |
+-----------------------------------+-----------------------------------+
| Evaluated row-by-row during data  | Evaluated on the fly inside the   |
| load / refresh.                   | Pivot Table based on filters.     |
| Consumes valuable RAM memory.     | Consumes zero RAM when idle.      |
| Visible in the table grid.        | Lives in the Calculation Area.    |
| Example: =[Price] * [Quantity]    | Example: =SUM(Sales[Revenue])     |
+-----------------------------------+-----------------------------------+
```

> **Best Practice Rule:** Whenever possible, use **Measures** instead of Calculated Columns. Measures keep your file sizes tiny and respond dynamically to user slicers and filters!

![DAX Measures and Calculations](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Essential Aggregations: SUM vs. SUMX (Iterators)

* **Standard Aggregator (SUM):** Adds up a single physical column:
  ```dax
  Total Sales := SUM(FactSales[Revenue])
  ```
* **Iterator Function (SUMX):** What if your table has 'Quantity' and 'UnitPrice', but no 'Revenue' column? In standard Excel, you’d create a new column. In DAX, **SUMX** calculates row-by-row in memory and sums the results without wasting RAM:
  ```dax
  Total Revenue := SUMX(FactSales, FactSales[Quantity] * FactSales[UnitPrice])
  ```
  *(Iterates through FactSales, multiplies Quantity by Price for each row, and sums the total!)*

---

## 3. The King of DAX: The CALCULATE Function

**CALCULATE** is the single most powerful function in business intelligence. It evaluates an expression while **modifying or overriding the current filter context**:

```dax
Syntax:
CALCULATE(Expression, Filter1, [Filter2], ...)
```

### Scenario A: Calculating Sales for a Specific Category
```dax
Tech Sales := CALCULATE([Total Sales], DimProducts[Category] = "Technology")
```
*Even if a user slices the table by "Furniture", this measure evaluates strictly for "Technology"!*

### Scenario B: Percentage of All Sales (Overriding Filters with ALL)
To calculate an employee's contribution to total nationwide sales, you must divide their sales by the grand total, ignoring employee filters:
```dax
All Sales := CALCULATE([Total Sales], ALL(FactSales))

Sales Contribution % := DIVIDE([Total Sales], [All Sales], 0)
```
*(The ALL() function strips away all filters, providing the true denominator grand total! The DIVIDE() function handles division by zero gracefully).*

---

# Multiple Choice Questions

### 1. What is the key performance advantage of creating an Explicit DAX Measure over a Calculated Column?
A. Measures run only in Python
B. Measures calculate dynamically in memory only when requested by a Pivot Table, consuming negligible storage and RAM
C. Measures can only handle text
D. Calculated columns are deleted on save
**Answer:** B
**Explanation:** Calculated columns store static results in every row of the table, consuming RAM; Measures evaluate dynamically upon query aggregation without consuming physical storage.

---

### 2. Which DAX function iterates through a table row-by-row, executes an expression, and sums the grand total in memory?
A. SUM
B. SUMX
C. TOTALSUM
D. AGGREGATE
**Answer:** B
**Explanation:** SUMX is an iterator function (evaluating row context) that executes a row-by-row expression across a table and returns the aggregated sum.

---

### 3. What does the CALCULATE function do in DAX?
A. Performs simple addition
B. Evaluates an expression while overriding or modifying the active filter context
C. Prints the worksheet
D. Closes the Power Pivot window
**Answer:** B
**Explanation:** CALCULATE is the only DAX function capable of altering, adding, or overriding filter context during expression evaluation.

---

### 4. What does the DAX expression '=CALCULATE([Total Sales], ALL(DimProducts))' return?
A. Sales of only the top product
B. Total sales across all products, removing any product-level filters applied in the report
C. Zero
D. An error message
**Answer:** B
**Explanation:** Wrapping ALL(DimProducts) inside CALCULATE instructs the calculation engine to ignore all active product filters, returning total unfiltered sales.

---

### 5. Why is the '=DIVIDE(Numerator, Denominator, [AlternateResult])' function preferred over the standard '/' forward slash operator in DAX?
A. DIVIDE is required by the Windows operating system
B. DIVIDE automatically traps and handles division by zero errors without breaking Pivot Tables
C. The slash operator is deprecated
D. DIVIDE converts numbers to Roman numerals
**Answer:** B
**Explanation:** The DIVIDE function safely intercepts division by zero or null values, returning an optional alternate result (such as 0 or blank) instead of ugly #DIV/0! errors.

---
