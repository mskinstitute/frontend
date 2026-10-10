---
id: ranking-functions-row-number-rank
slug: ranking-functions-row-number-rank
course: sql-for-intermediate
chapter: Window Functions Fundamentals
topic: "Ranking Functions: ROW_NUMBER, RANK, DENSE_RANK"
difficulty: Intermediate
readingTime: 13
order: 37
keywords: ["row_number","rank","dense_rank","ranking functions","top n per group"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Ranking Functions: ROW_NUMBER, RANK, DENSE_RANK
Ranking data is one of the most frequent tasks in business analytics: identifying the top 3 best-selling products per category, finding the 10 highest-earning salespeople per region, or assigning sequential numbers to user actions.

SQL provides three primary ranking functions: **`ROW_NUMBER()`**, **`RANK()`**, and **`DENSE_RANK()`**. While all three assign integers based on a specified ordering, they handle **ties (identical values)** in distinctly different ways.

---

### The Three Ranking Functions Explained

1. **`ROW_NUMBER()`:** Assigns a strict sequential integer (1, 2, 3, 4...) to each row within a partition. It **never produces ties** and **never skips numbers**. If two rows have identical values, their ordering is arbitrary unless broken by secondary sort columns.
2. **`RANK()`:** Assigns identical rank numbers to rows with identical values (ties). However, it **skips subsequent rank numbers** to maintain position parity (e.g., 1, 2, 2, 4).
3. **`DENSE_RANK()`:** Assigns identical rank numbers to rows with identical values, but **never skips numbers** in the sequence (e.g., 1, 2, 2, 3).

---

### Side-by-Side Visual Comparison

Suppose we rank 5 students by score in descending order:

| Student | Score | `ROW_NUMBER()` | `RANK()` | `DENSE_RANK()` |
| :--- | :--- | :--- | :--- | :--- |
| Diana | 100 | **1** | **1** | **1** |
| Bruce | 90 | **2** | **2** | **2** |
| Clark | 90 | **3** | **2** (Tie!) | **2** (Tie!) |
| Arthur | 80 | **4** | **4** (Skipped 3!) | **3** (No skip!) |
| Barry | 70 | **5** | **5** | **4** |

Notice:
- `ROW_NUMBER` arbitrarily gave Bruce 2 and Clark 3.
- `RANK` gave Bruce and Clark 2, then skipped to 4 for Arthur.
- `DENSE_RANK` gave Bruce and Clark 2, then assigned Arthur 3 seamlessly.

---

### The Classic "Top N Per Category" Problem

A frequent interview question and production problem is: *"Find the top 2 highest-paid employees in every department."*

Because window functions cannot be placed directly in a `WHERE` clause, we use a Common Table Expression (CTE):

```sql
WITH RankedStaff AS (
    SELECT 
        emp_id,
        first_name,
        last_name,
        department,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS salary_rank
    FROM employees
)
SELECT 
    department,
    salary_rank,
    first_name,
    last_name,
    salary
FROM RankedStaff
WHERE salary_rank <= 2
ORDER BY department, salary_rank;
```

---

### Additional Ranking Functions: PERCENT_RANK & NTILE

MySQL 8.0 also includes:
- **`NTILE(n)`:** Distributes rows evenly into `n` roughly equal buckets (e.g., `NTILE(4)` divides customer spend into quartiles).
- **`PERCENT_RANK()`:** Calculates relative rank as a percentage between 0.0 and 1.0 using the formula `(rank - 1) / (total_rows - 1)`.

```sql
-- Divide customers into spending quartiles (Top 25%, Upper-Mid, Lower-Mid, Bottom 25%)
SELECT 
    customer_id,
    lifetime_spend,
    NTILE(4) OVER (ORDER BY lifetime_spend DESC) AS spend_quartile
FROM customer_aggregates;
```

---

# Multiple Choice Questions

### 1. If two rows tie for second place, what sequence will RANK() produce for the first four rows?
A. 1, 2, 3, 4
B. 1, 2, 2, 4
C. 1, 2, 2, 3
D. 1, 1, 2, 3
**Answer:** B
**Explanation:** RANK() assigns ties identical numbers and skips subsequent numbers corresponding to the number of duplicates (producing 1, 2, 2, 4).
---

### 2. Which ranking function guarantees no gaps in the numbering sequence even when ties occur?
A. ROW_NUMBER()
B. RANK()
C. DENSE_RANK()
D. NTILE()
**Answer:** C
**Explanation:** DENSE_RANK() awards tied rows the same rank without skipping any subsequent integers (1, 2, 2, 3).
---

### 3. What does ROW_NUMBER() do when two rows have identical sorting values?
A. Throws an ambiguous tie exception
B. Assigns both rows the same integer
C. Assigns distinct sequential numbers (e.g., 2 and 3) non-deterministically unless tie-breakers are provided
D. Sets the value to NULL
**Answer:** C
**Explanation:** ROW_NUMBER() strictly assigns unique integers (1, 2, 3...). In the case of ties, the assignment is arbitrary unless additional deterministic columns are added to ORDER BY.
---

### 4. How do you retrieve the top 3 highest revenue products per category?
A. By putting WHERE ROW_NUMBER() OVER(...) <= 3 in the main query
B. By calculating the rank in a CTE or derived table and filtering WHERE rank <= 3 in the outer query
C. By using LIMIT 3 inside the OVER() clause
D. By creating a foreign key on category
**Answer:** B
**Explanation:** Because window functions cannot appear directly in WHERE, calculating the rank inside a CTE and filtering in the outer query is the standard, canonical pattern.
---

### 5. What does NTILE(4) accomplish on an ordered dataset?
A. Multiplies the score by 4
B. Filters for rows divisible by 4
C. Divides the rows into 4 roughly equal quartiles
D. Selects only the first 4 rows
**Answer:** C
**Explanation:** NTILE(n) partitions an ordered set of rows into n roughly equal buckets, such as quartiles (NTILE(4)) or deciles (NTILE(10)).
---
