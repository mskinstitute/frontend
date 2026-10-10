---
id: sliding-window-frames-rows-range
slug: sliding-window-frames-rows-range
course: sql-for-advanced
chapter: Advanced Window Functions & Frame Specifications
topic: "Sliding Window Frames: ROWS & RANGE"
difficulty: Advanced
readingTime: 14
order: 1
keywords: ["window frames","rows between","range between","sliding windows","unbounded preceding","current row"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Sliding Window Frames: ROWS & RANGE
In intermediate SQL, window functions calculate aggregates across whole partitions. In advanced analytical engineering, you often need to restrict calculations to a moving subset of rows relative to the current row—such as a 7-day rolling average or a trailing 3-order moving sum.

This dynamic sliding subset is called the **Window Frame**, configured using the **`ROWS`** or **`RANGE`** sub-clauses inside `OVER()`.

---

### Frame Specification Syntax

```sql
{ ROWS | RANGE } BETWEEN frame_start AND frame_end
```

#### Frame Boundary Keywords:
- **`UNBOUNDED PRECEDING`:** Start from the very first row in the partition.
- **`n PRECEDING`:** Start `n` rows (or values) before the current row.
- **`CURRENT ROW`:** The current row being evaluated.
- **`n FOLLOWING`:** End `n` rows (or values) after the current row.
- **`UNBOUNDED FOLLOWING`:** Extend to the very last row in the partition.

---

### ROWS vs RANGE: The Critical Difference

| Dimension | `ROWS` | `RANGE` |
| :--- | :--- | :--- |
| **Unit of Measurement** | Physical row count | Logical value offsets |
| **Tie Handling** | Distinguishes identical values row-by-row | Treats rows with identical `ORDER BY` values as a single peer group |
| **Performance** | Faster (counts physical offsets) | Slower (evaluates value ranges) |

> **Default Frame Warning:** If you specify `ORDER BY` inside `OVER()` without declaring a frame, MySQL uses:
> `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`
> This default means that tied values are included together in the running calculation!

---

### Practical Example: Trailing 3-Day Moving Average

```sql
SELECT 
    sale_date,
    daily_revenue,
    -- Compute average of: 2 preceding rows + current row (3 physical rows)
    AVG(daily_revenue) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_3day_avg,
    
    -- Centered window: 1 day before, current day, 1 day after
    AVG(daily_revenue) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
    ) AS centered_3day_avg
FROM daily_sales;
```

---

### Logical Value Offsets with RANGE in MySQL 8.0

In MySQL 8.0+, `RANGE` supports numeric and temporal offsets:

```sql
-- Trailing 7 calendar days moving sum (regardless of missing calendar dates!)
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (
        ORDER BY order_date
        RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW
    ) AS trailing_7days_revenue
FROM orders;
```

---

# Multiple Choice Questions

### 1. What is the fundamental difference between ROWS and RANGE in window frame specifications?
A. ROWS only works on numeric data, while RANGE only works on dates
B. ROWS defines the frame by physical row count, while RANGE defines it by logical value offsets
C. RANGE is deprecated in MySQL 8.0
D. ROWS can only look forward, never backward
**Answer:** B
**Explanation:** ROWS counts physical offset positions relative to the current row, whereas RANGE calculates logical value intervals based on the ORDER BY expression.
---

### 2. What is the default window frame when ORDER BY is provided in an OVER() clause without an explicit frame clause?
A. ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
B. RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
C. ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
D. RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
**Answer:** B
**Explanation:** The SQL standard default with ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, causing tied values to be evaluated together.
---

### 3. Which frame specification defines a 3-row sliding window including the previous row, current row, and next row?
A. ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
B. RANGE BETWEEN 3 PRECEDING AND CURRENT ROW
C. ROWS 3 PRECEDING
D. SLIDE 3 ROWS
**Answer:** A
**Explanation:** ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING captures exactly one physical row prior, the current row, and one physical row subsequent.
---

### 4. How can you calculate a 14-day rolling revenue window when some dates have zero sales and are missing from the table?
A. ROWS BETWEEN 14 PRECEDING AND CURRENT ROW
B. RANGE BETWEEN INTERVAL 14 DAY PRECEDING AND CURRENT ROW
C. GROUP BY DAY(date)
D. UNBOUNDED FOLLOWING
**Answer:** B
**Explanation:** RANGE with temporal INTERVAL calculates the calendar date range accurately regardless of missing rows, whereas ROWS would improperly count 14 recorded transactions.
---

### 5. What does UNBOUNDED FOLLOWING designate as a frame boundary?
A. The beginning of the table
B. The end of the current partition
C. The next transaction ID
D. The current row
**Answer:** B
**Explanation:** UNBOUNDED FOLLOWING sets the upper boundary to the very last row of the partition.
---
