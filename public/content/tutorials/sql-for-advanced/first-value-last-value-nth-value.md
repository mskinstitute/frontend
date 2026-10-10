---
id: first-value-last-value-nth-value
slug: first-value-last-value-nth-value
course: sql-for-advanced
chapter: Advanced Window Functions & Frame Specifications
topic: "Value Boundary Functions: FIRST_VALUE, LAST_VALUE, NTH_VALUE"
difficulty: Advanced
readingTime: 13
order: 3
keywords: ["first_value","last_value","nth_value","window boundary functions","sql analytics"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Value Boundary Functions: FIRST_VALUE, LAST_VALUE, NTH_VALUE
When analyzing sequential data, business users frequently want to compare current values against the extremes or specific milestones of a group:
- What was the **initial opening price** of a stock compared to each trade during the day?
- What was the **most recent purchase amount** recorded before this transaction?
- Who was the **second highest** scoring student in each department?

MySQL 8.0 provides three specialized value boundary functions: **`FIRST_VALUE()`**, **`LAST_VALUE()`**, and **`NTH_VALUE()`**.

---

### FIRST_VALUE() Mechanics

`FIRST_VALUE(expr)` returns the value of `expr` from the first row of the window frame:

```sql
SELECT 
    emp_id,
    department,
    first_name,
    salary,
    -- Compare every employee's salary to the top earner in their department
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) AS top_dept_salary,
    ROUND(salary - FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ), 2) AS diff_from_top
FROM employees;
```

---

### The LAST_VALUE() Gotcha: The Default Frame Trap!

Many developers encounter an unexpected bug when using `LAST_VALUE()`:
```sql
-- WRONG! Seems to return current row's value rather than the group's last value!
SELECT 
    department,
    salary,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary ASC
    ) AS bad_last_value
FROM employees;
```

#### Why does this happen?
Remember the default window frame with `ORDER BY`:
`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
Under this default, the "last row" in the frame is **the current row**!

#### The Fix:
To make `LAST_VALUE()` evaluate the entire partition, expand the frame:
```sql
-- CORRECT! Explicit frame spanning the entire partition
SELECT 
    department,
    salary,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary ASC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS highest_dept_salary
FROM employees;
```

---

### NTH_VALUE() Mechanics

`NTH_VALUE(expr, N)` retrieves the value from the `N`-th row in the ordered window frame. If `N` exceeds the number of rows evaluated in the frame, it returns `NULL`.

```sql
-- Find the runner-up (2nd highest) salary in each department
SELECT 
    emp_id,
    department,
    first_name,
    salary,
    NTH_VALUE(salary, 2) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS second_highest_salary
FROM employees;
```

---

# Multiple Choice Questions

### 1. What does FIRST_VALUE(salary) return?
A. The average salary of the table
B. The salary from the very first row in the window frame
C. The primary key salary
D. The smallest salary only
**Answer:** B
**Explanation:** FIRST_VALUE returns the evaluated expression from the first row of the defined window frame.
---

### 2. Why does LAST_VALUE(salary) OVER (ORDER BY salary) often mistakenly return the current row's value?
A. Because LAST_VALUE is broken in MySQL 8.0
B. Because the default frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
C. Because MySQL sorts in reverse by default
D. Because the column is not unique
**Answer:** B
**Explanation:** Because the default frame ends at CURRENT ROW, the last value evaluated in that frame is the current row itself.
---

### 3. How do you fix LAST_VALUE() so it evaluates to the very end of the partition?
A. Add ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
B. Remove ORDER BY
C. Add GROUP BY
D. Wrap it in a subquery
**Answer:** A
**Explanation:** Explicitly defining the upper boundary as UNBOUNDED FOLLOWING ensures the frame includes every row to the end of the partition.
---

### 4. What does NTH_VALUE(score, 3) return if the partition contains only 2 rows?
A. 0
B. Throws an index-out-of-bounds error
C. NULL
D. Returns the 2nd row value
**Answer:** C
**Explanation:** If the specified N exceeds the available rows in the frame, NTH_VALUE returns NULL.
---

### 5. In NTH_VALUE(col, N), what must N be?
A. A negative integer
B. A positive integer greater than 0
C. A column name
D. A subquery
**Answer:** B
**Explanation:** The N argument in NTH_VALUE must be a positive integer (1, 2, 3...).
---
