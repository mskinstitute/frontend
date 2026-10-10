# Basic Functions (SUM, AVERAGE, COUNT)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Basic Aggregation Functions in DAX
Standard aggregation functions summarize numerical columns down to a single scalar value:

```dax
// Sum of a column
Total Sales = SUM(Sales[Revenue])

// Average of a column
Average Transaction Value = AVERAGE(Sales[Revenue])

// Count of non-blank rows
Total Transactions = COUNT(Sales[Transaction_ID])

// Count of unique customers
Unique Customers = DISTINCTCOUNT(Sales[Customer_ID])
```

---

## 2. The 'X' Iterator Functions (SUMX, AVERAGEX)
Standard `SUM()` can only take a single column as input. If you need to multiply two columns row-by-row and then sum the result, use the **iterator function `SUMX()`**:

```dax
// Iterates row-by-row through Sales table, multiplies Qty * Price, then sums the total!
Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[Unit_Price])
```

---

# Multiple Choice Questions

### 1. Which DAX function counts the number of distinct, unique values in a column?
A. `DISTINCTCOUNT()`
B. `COUNTUNIQUE()`
C. `UNIQUESUM()`
D. `DEDUP_COUNT()`
**Answer:** A
**Explanation:** `DISTINCTCOUNT(Table[Column])` tallies unique values, ignoring duplicate occurrences.
---

### 2. What is the difference between `SUM()` and `SUMX()` in DAX?
A. `SUM()` accepts only a single column; `SUMX()` is an iterator that evaluates a row-by-row expression across a table before summing
B. `SUMX()` only works on dates
C. `SUM()` is deprecated
D. `SUMX()` multiplies by 10
**Answer:** A
**Explanation:** Iterator functions ending in 'X' (like SUMX, AVERAGEX) evaluate an expression across table rows using an active row context.
---

### 3. Which function counts rows in a table including rows that contain blanks?
A. `COUNTROWS()`
B. `COUNT()`
C. `COUNTBLANK()`
D. `BLANKCOUNT()`
**Answer:** A
**Explanation:** `COUNTROWS(Table)` returns the exact total row count of a table or filtered table expression.
---

### 4. What does `DIVIDE(Sales[Profit], Sales[Revenue], 0)` accomplish that a simple forward slash `Profit / Revenue` does not?
A. Safely handles division by zero, returning 0 (or an alternate result) instead of returning an unsightly 'Infinity' error
B. Rounds to 2 decimal places
C. Doubles the calculation speed
D. Multiplies by 100
**Answer:** A
**Explanation:** The `DIVIDE()` function safely intercepts division-by-zero scenarios, preventing calculation crashes.
---

### 5. In DAX, which function returns the maximum value found in a column?
A. `MAX()`
B. `HIGHEST()`
C. `PEAK()`
D. `TOP()`
**Answer:** A
**Explanation:** `MAX(Table[Column])` returns the largest value in a column.
---
