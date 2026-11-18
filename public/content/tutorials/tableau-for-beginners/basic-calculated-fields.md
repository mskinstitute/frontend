---
id: basic-calculated-fields
slug: basic-calculated-fields
course: tableau-for-beginners
chapter: "4: Calculations, Parameters & LOD Expressions"
topic: "4.1 Basic Calculated Fields (String, Number & Date Math)"
title: "Basic Calculated Fields (String, Number & Date Math)"
description: "Learn Basic Calculated Fields (String, Number & Date Math) in Tableau with practical examples, analyst workflows, and interactive practice quizzes at MSK I."
difficulty: Beginner
readingTime: 6
order: 1
keywords:
  - basic calculated fields string number date math
  - tableau tutorial
  - basic calculated fields
  - data analysis course
  - MSK Institute
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

---

## 1. What is a Calculated Field?
A **Calculated Field** allows you to create new data fields from existing data in your data source using formulas, logic, and math.

---

## 2. Common Calculation Types

### 1. Arithmetic Calculations:
```text
// Profit Ratio
[Profit] / [Sales]

// Net Margin After Tax
([Sales] - [Cost]) * 0.82
```

### 2. Logical Statements (IF-THEN-ELSE & CASE):
```text
IF [Profit Ratio] > 0.20 THEN "High Margin"
ELSEIF [Profit Ratio] > 0.05 THEN "Moderate"
ELSE "Low / Loss Making"
END
```

### 3. String & Date Functions:
```text
// Extract uppercase customer initials
UPPER(LEFT([Customer Name], 1))

// Calculate age of account in days
DATEDIFF('day', [Order Date], [Ship Date])
```

---

## Practice Quiz
### 1. What keyword must always terminate an `IF...THEN...ELSE` logical block in Tableau calculations?
A. `END`
B. `FINISH`
C. `DONE`
D. `STOP`
**Answer:** A
**Explanation:** Tableau syntax strictly requires all `IF` and `CASE` blocks to conclude with the `END` keyword.
---

### 2. Which function calculates the number of days between an Order Date and a Ship Date?
A. `DATEDIFF('day', [Order Date], [Ship Date])`
B. `DAYS_BETWEEN()`
C. `SUBTRACT_DATES()`
D. `DATE_GAP()`
**Answer:** A
**Explanation:** `DATEDIFF(date_part, start_date, end_date)` computes the interval between two dates.
---

### 3. What does the `ZN()` function do in Tableau?
A. Returns the expression if not null, otherwise returns Zero (Zero Null)
B. Calculates Zen score
C. Deletes numbers
D. Rounds to nearest integer
**Answer:** A
**Explanation:** `ZN(expression)` converts null values into 0, preventing null-propagation errors in math formulas.
---

### 4. How are field names referenced inside a Tableau calculation editor?
A. Inside square brackets: `[Field Name]`
B. Inside quotes: `"Field Name"`
C. With dollar sign: `$Field_Name`
D. With curly braces: `{Field Name}`
**Answer:** A
**Explanation:** Tableau references field names using square brackets (e.g. `[Sales]`).
---

### 5. What does the calculation `SUM([Profit]) / SUM([Sales])` compute compared to `[Profit] / [Sales]`?
A. `SUM([Profit])/SUM([Sales])` aggregates totals before dividing (correct weighted margin); `[Profit]/[Sales]` divides row-by-row
B. There is zero mathematical difference
C. The first one crashes
D. The second one runs faster
**Answer:** A
**Explanation:** Non-aggregated ratios divide row-by-row and sum up the percentages (mathematically incorrect); aggregated ratios compute true overall margin.
---
