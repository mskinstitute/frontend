# Capstone Project: Use DAX Measures in Reports

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Core KPI Measure Suite
A professional Sales Dashboard requires a cohesive suite of measures:

```dax
// 1. Total Revenue
Total Revenue = SUM(Sales[Revenue])

// 2. Total Cost
Total Cost = SUM(Sales[Cost])

// 3. Gross Profit
Gross Profit = [Total Revenue] - [Total Cost]

// 4. Profit Margin %
Profit Margin % = DIVIDE([Gross Profit], [Total Revenue], 0)

// 5. Year-over-Year (YoY) Sales Growth
Sales SPLY = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(Calendar[Date]))
YoY Sales Growth % = DIVIDE([Total Revenue] - [Sales SPLY], [Sales SPLY], 0)
```

---

# Multiple Choice Questions

### 1. Which DAX time-intelligence function calculates a measure evaluated against the exact same period in the previous year?
A. `SAMEPERIODLASTYEAR()`
B. `LAST_YEAR()`
C. `PREV_YEAR_VAL()`
D. `YEAR_MINUS_ONE()`
**Answer:** A
**Explanation:** `SAMEPERIODLASTYEAR(DatesColumn)` shifts the date filter context back by exactly one year for YoY comparisons.
---

### 2. What is 'Measure Branching' in DAX?
A. Building higher-level complex measures on top of fundamental base measures (e.g. using `[Total Revenue]` inside `[Profit Margin %]`)
B. Creating tree diagrams
C. Renaming tables
D. Splitting queries
**Answer:** A
**Explanation:** Measure branching promotes reusability, modularity, and easy maintenance across analytical calculations.
---

### 3. What prerequisite is strictly required for DAX Time Intelligence functions (like `TOTALYTD` or `SAMEPERIODLASTYEAR`) to compute accurately?
A. A dedicated, continuous Date/Calendar table marked as a Date Table with no missing dates
B. A fast internet connection
C. An Excel file
D. A 64-bit monitor
**Answer:** A
**Explanation:** Time intelligence functions require a contiguous Date table marked as Date Table in the model.
---

### 4. What function calculates cumulative Year-to-Date revenue in DAX?
A. `TOTALYTD([Total Revenue], Calendar[Date])`
B. `SUM_YTD()`
C. `CUMULATIVE()`
D. `YEAR_SUM()`
**Answer:** A
**Explanation:** `TOTALYTD()` evaluates an expression cumulatively from the start of the fiscal or calendar year.
---

### 5. Why should you always format percentage measures explicitly as Percentage with 1 or 2 decimals in the Measure Tools ribbon?
A. So visual charts and cards automatically format output as `14.5%` instead of raw decimals like `0.145234`
B. It rounds numbers to zero
C. It speeds up DAX
D. It prevents divide by zero
**Answer:** A
**Explanation:** Setting the format string ensures consistent presentation across all canvas visuals.
---
