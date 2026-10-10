# Time Intelligence Functions in DAX: YTD, MTD, QTD & YoY Growth

Time Intelligence calculations are among the most frequent requirements in business reporting. Executives need to compare current sales against prior months, calculate fiscal year-to-date figures, and analyze Year-over-Year (YoY) percentage growth.

---

## 1. The Date Table Prerequisite (Golden Rule)

> **CRITICAL RULE:** For DAX Time Intelligence functions (`TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`) to work accurately, your model **MUST** contain a dedicated **Calendar / Date Table** that fulfills these four strict criteria:
> 1. It must contain a column of data type `Date` with continuous dates (no missing days).
> 2. It must span full years covering all transaction dates in your fact tables.
> 3. It must be marked as an official Date Table (`Mark as Date Table` in Power BI Desktop).
> 4. It must connect to your Fact table via a 1-to-Many ($1 : *$) relationship.

### Generating a Calendar Table in DAX

```dax
Dim_Date = 
VAR MinYear = YEAR(MIN(Fact_Sales[OrderDate]))
VAR MaxYear = YEAR(MAX(Fact_Sales[OrderDate]))
RETURN
ADDCOLUMNS(
    CALENDAR(DATE(MinYear, 1, 1), DATE(MaxYear, 12, 31)),
    "Year", YEAR([Date]),
    "MonthNumber", MONTH([Date]),
    "MonthName", FORMAT([Date], "MMMM"),
    "YearMonth", FORMAT([Date], "YYYY-MM"),
    "Quarter", "Q" & FORMAT([Date], "Q"),
    "DayOfWeek", FORMAT([Date], "dddd")
)
```

---

## 2. Cumulative Period Functions: YTD, QTD, MTD

Cumulative functions aggregate values from the beginning of a period up to the current date in context:

### Syntax & Implementations

```dax
-- 1. Year-To-Date (YTD) Sales
Sales YTD = 
TOTALYTD(
    [Total Sales], 
    Dim_Date[Date]
)

-- 2. Quarter-To-Date (QTD) Sales
Sales QTD = 
TOTALQTD(
    [Total Sales], 
    Dim_Date[Date]
)

-- 3. Month-To-Date (MTD) Sales
Sales MTD = 
TOTALMTD(
    [Total Sales], 
    Dim_Date[Date]
)
```

---

## 3. Prior Period Comparisons & Year-over-Year (YoY)

Comparing metrics against historical benchmarks is straightforward using `SAMEPERIODLASTYEAR` and `DATEADD`.

```dax
-- Prior Year Sales (Same Period Last Year)
Sales Prior Year = 
CALCULATE(
    [Total Sales], 
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

-- Year-over-Year (YoY) Sales Variance Amount
Sales YoY Variance = 
[Total Sales] - [Sales Prior Year]

-- Year-over-Year (YoY) Growth Percentage
Sales YoY Growth % = 
DIVIDE(
    [Sales YoY Variance], 
    [Sales Prior Year], 
    0
)
```

```
Period Comparison Matrix:
Month       Total Sales    Sales Prior Year    Sales YoY Variance    YoY Growth %
2025-Jan    $100,000       $80,000             +$20,000              +25.0%
2025-Feb    $120,000       $110,000            +$10,000              +9.1%
2025-Mar    $140,000       $150,000            -$10,000              -6.7%
```

---

## 4. Custom Shifts with DATEADD

While `SAMEPERIODLASTYEAR` shifts dates back by exactly 1 year, `DATEADD` offers full flexibility:

```dax
-- Prior Month Sales
Sales Prior Month = 
CALCULATE(
    [Total Sales], 
    DATEADD(Dim_Date[Date], -1, MONTH)
)

-- Prior Quarter Sales
Sales Prior Quarter = 
CALCULATE(
    [Total Sales], 
    DATEADD(Dim_Date[Date], -1, QUARTER)
)
```

---

# Multiple Choice Questions

### 1. Which mandatory requirement must be satisfied for DAX Time Intelligence functions to calculate correctly?
A. The fact table must contain zero duplicate order dates
B. The model must have a dedicated Date table with contiguous, unbroken dates covering full years, marked as Date Table
C. The report must be viewed only on a monthly cadence
D. All date formats must be converted to Unix epoch timestamps
**Answer:** B
**Explanation:** Time intelligence functions require a continuous sequence of dates without gaps. If any dates are missing from the date dimension, functions like `SAMEPERIODLASTYEAR` and `TOTALYTD` will yield inaccurate or blank results.

---

### 2. If a company's fiscal year starts on April 1st instead of January 1st, how do you adjust `TOTALYTD`?
A. Subtract 3 months from the final result using basic subtraction
B. Pass the fiscal year end date parameter: `TOTALYTD([Total Sales], Dim_Date[Date], "03/31")`
C. `TOTALYTD` only supports calendar years; custom code is impossible
D. Create 12 separate calculated columns in the fact table
**Answer:** B
**Explanation:** `TOTALYTD` accepts an optional third parameter specifying the year-end date (e.g., `"03/31"` for a fiscal year ending March 31st), allowing seamless fiscal calendar support.

---

### 3. What is the difference between `SAMEPERIODLASTYEAR(DateCol)` and `DATEADD(DateCol, -1, YEAR)`?
A. `SAMEPERIODLASTYEAR` only works for leap years
B. `SAMEPERIODLASTYEAR` is internally an exact equivalent shorthand for `DATEADD(DateCol, -1, YEAR)`
C. `DATEADD` only accepts days, not years
D. `SAMEPERIODLASTYEAR` permanently alters the model data
**Answer:** B
**Explanation:** `SAMEPERIODLASTYEAR(Dates)` is a syntactic helper function in DAX that translates directly to `DATEADD(Dates, -1, YEAR)`.

---

### 4. What does the DAX measure `[Total Sales] - CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Date[Date]))` compute?
A. Year-to-date cumulative revenue
B. Year-over-Year (YoY) dollar variance
C. 3-month rolling average
D. Prior month gross profit
**Answer:** B
**Explanation:** Subtracting prior year sales from current sales calculates the absolute monetary difference (YoY Variance) between the two time periods.

---

### 5. Why should you use `DIVIDE([YoY Variance], [Sales Prior Year], 0)` rather than the standard `/` division operator?
A. The `/` operator is deprecated in modern DAX
B. If prior year sales were zero or blank, `/` would produce an unsightly `#ERROR`, whereas `DIVIDE` safely returns `0`
C. `DIVIDE` automatically converts fractions into percentage strings
D. `DIVIDE` bypasses the active filter context
**Answer:** B
**Explanation:** Standard division by zero generates calculation errors in reports. `DIVIDE` intercepts zero denominators and returns the safe fallback value (or `BLANK()`).

---
