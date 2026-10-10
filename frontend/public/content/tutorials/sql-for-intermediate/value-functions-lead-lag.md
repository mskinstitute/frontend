---
id: value-functions-lead-lag
slug: value-functions-lead-lag
course: sql-for-intermediate
chapter: Window Functions Fundamentals
topic: "Positional Value Functions: LEAD and LAG"
difficulty: Intermediate
readingTime: 12
order: 38
keywords: ["lead function","lag function","positional window functions","month over month growth","first_value"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Positional Value Functions: LEAD and LAG
In relational databases, rows are theoretically unordered sets. However, real-world business intelligence often depends on **inter-row comparisons**:
- What were our sales this month compared to **last month** (Month-over-Month growth)?
- How much time elapsed between a user's **current login** and their **previous login**?
- What was the price change between consecutive stock ticks?

Before window functions, answering these questions required costly self-joins with complex offset conditions. The **`LAG()`** and **`LEAD()`** positional value functions allow you to peer backward or forward across rows with zero self-joins.

---

### Mechanics of LAG() and LEAD()

- **`LAG(expr [, offset [, default]])`:** Accesses data from a preceding row at a specified physical offset prior to the current row within the partition.
- **`LEAD(expr [, offset [, default]])`:** Accesses data from a succeeding row at a specified physical offset after the current row within the partition.

Both functions accept three arguments:
1. `expr`: The column or expression to retrieve.
2. `offset` (Optional, Default: 1): The number of rows back (for `LAG`) or forward (for `LEAD`) to inspect.
3. `default` (Optional, Default: `NULL`): The fallback value if the offset reaches outside the partition boundary.

---

### Step-by-Step Example: Month-Over-Month (MoM) Growth

Suppose we have monthly revenue data:

```sql
CREATE TABLE monthly_revenue (
    month_id INT PRIMARY KEY,
    revenue DECIMAL(10, 2)
);

INSERT INTO monthly_revenue VALUES
(1, 10000.00),
(2, 12000.00),
(3, 11500.00),
(4, 15000.00);
```

Calculating prior month revenue, net difference, and percentage growth:

```sql
SELECT 
    month_id,
    revenue,
    -- Fetch the revenue from the immediately preceding month
    LAG(revenue, 1, 0.00) OVER (ORDER BY month_id) AS prior_month_revenue,
    
    -- Absolute difference
    revenue - LAG(revenue, 1, revenue) OVER (ORDER BY month_id) AS mom_dollar_change,
    
    -- Percentage change
    ROUND(
        ((revenue - LAG(revenue, 1, NULL) OVER (ORDER BY month_id)) / 
        LAG(revenue, 1, NULL) OVER (ORDER BY month_id)) * 100, 
        2
    ) AS mom_growth_pct
FROM monthly_revenue;
```

#### Query Results:
| month_id | revenue | prior_month_revenue | mom_dollar_change | mom_growth_pct |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 10000.00 | 0.00 | 0.00 | NULL |
| 2 | 12000.00 | 10000.00 | +2000.00 | +20.00% |
| 3 | 11500.00 | 12000.00 | -500.00 | -4.17% |
| 4 | 15000.00 | 11500.00 | +3500.00 | +30.43% |

---

### Looking Ahead with LEAD()

`LEAD()` functions identically to `LAG()`, but looks forward:

```sql
-- Find next appointment date for medical patients
SELECT 
    patient_id,
    appointment_date,
    LEAD(appointment_date, 1) OVER (
        PARTITION BY patient_id 
        ORDER BY appointment_date
    ) AS next_scheduled_appointment
FROM patient_appointments;
```

---

### Additional Positional Functions: FIRST_VALUE & LAST_VALUE

MySQL 8.0 also provides:
- **`FIRST_VALUE(expr)`:** Returns the value from the first row of the window frame.
- **`LAST_VALUE(expr)`:** Returns the value from the last row of the window frame (requires careful frame specification like `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING`).

```sql
-- Compare employee salary against the lowest salary in their department
SELECT 
    emp_id,
    department,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary ASC
    ) AS lowest_dept_salary
FROM employees;
```

---

# Multiple Choice Questions

### 1. What does the LAG() window function accomplish?
A. Delays query execution by a set number of seconds
B. Accesses a column value from a previous row in the ordered partition
C. Returns the slowest executing query in performance_schema
D. Deletes the preceding row
**Answer:** B
**Explanation:** LAG() accesses data from a preceding row at a specified physical offset within the current partition.
---

### 2. What value does LAG(salary, 1) return for the very first row in a partition if no default value is specified?
A. 0
B. An empty string
C. NULL
D. Throws an out-of-bounds error
**Answer:** C
**Explanation:** If an offset accesses beyond the partition boundaries, LAG and LEAD return NULL unless an explicit third default argument is provided.
---

### 3. Which function looks forward to fetch a value from a subsequent row in the partition?
A. PRIOR()
B. NEXT()
C. LEAD()
D. ADVANCE()
**Answer:** C
**Explanation:** LEAD() retrieves values from succeeding (future) rows in the specified ordering.
---

### 4. What is the second argument in LAG(amount, 2, 0)?
A. The partition key
B. The offset indicating how many rows back to look (2 rows)
C. The fallback default value
D. The rounding precision
**Answer:** B
**Explanation:** In LAG(col, offset, default), the second argument defines the offset distance (in this case, 2 rows back).
---

### 5. Why are LAG and LEAD superior to traditional self-joins for trend analysis?
A. Self-joins are deprecated in MySQL 8.0
B. LAG and LEAD avoid exponential cartesian product costs, scanning data in a single clean pass
C. They automatically convert results to JSON format
D. They allow querying dropped databases
**Answer:** B
**Explanation:** Calculating prior values using self-joins requires multi-table scans and complex index lookups; LAG and LEAD compute values sequentially in a single execution pass.
---
