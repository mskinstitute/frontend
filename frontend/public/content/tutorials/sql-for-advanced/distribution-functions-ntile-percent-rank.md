---
id: distribution-functions-ntile-percent-rank
slug: distribution-functions-ntile-percent-rank
course: sql-for-advanced
chapter: Advanced Window Functions & Frame Specifications
topic: "Statistical Distribution Functions: NTILE, CUME_DIST, PERCENT_RANK"
difficulty: Advanced
readingTime: 13
order: 4
keywords: ["cume_dist","percent_rank","ntile","statistical functions","percentiles"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Statistical Distribution Functions: NTILE, CUME_DIST, PERCENT_RANK
Modern enterprise analytics frequently requires statistical distribution modeling:
- Segmenting customers into spending deciles or quartiles.
- Calculating what percentage of employees earn less than or equal to a given salary.
- Generating relative percentile ranks for credit risk scoring.

MySQL 8.0 provides three powerful statistical distribution window functions: **`NTILE()`**, **`CUME_DIST()`**, and **`PERCENT_RANK()`**.

---

### 1. NTILE(n): Equal Bucket Distribution

`NTILE(n)` divides an ordered partition into `n` roughly equal buckets and assigns the bucket number (from 1 to `n`) to each row:

```sql
-- Segment customers into 4 spending quartiles
SELECT 
    customer_id,
    annual_spend,
    NTILE(4) OVER (ORDER BY annual_spend DESC) AS spend_quartile
FROM customer_totals;
```
- Bucket 1: Top 25% (VIPs)
- Bucket 2: Upper Mid 25%
- Bucket 3: Lower Mid 25%
- Bucket 4: Bottom 25%

*Rule:* If the row count is not evenly divisible by `n`, earlier buckets receive the extra rows. (e.g., 10 rows into 4 buckets gives bucket sizes: 3, 3, 2, 2).

---

### 2. CUME_DIST(): Cumulative Distribution

`CUME_DIST()` calculates the cumulative distribution of a value within a partition. It represents the proportion of rows with values **less than or equal to** the current row's value:

$$	ext{CUME_DIST} = rac{	ext{Number of rows with value} le 	ext{current value}}{	ext{Total rows in partition}}$$

```sql
SELECT 
    student_name,
    exam_score,
    ROUND(CUME_DIST() OVER (ORDER BY exam_score ASC), 4) AS cume_dist
FROM exam_results;
```

#### Output Values:
A `CUME_DIST` of `0.80` indicates that 80% of students scored less than or equal to this student's score. The value ranges from `> 0.0` to `1.0`.

---

### 3. PERCENT_RANK(): Relative Percentile Rank

`PERCENT_RANK()` computes the relative rank of a row within a partition as a fraction between 0.0 and 1.0 using the formula:

$$	ext{PERCENT_RANK} = rac{	ext{Rank} - 1}{	ext{Total Rows} - 1}$$

- The highest-ranked (or first) row always has `PERCENT_RANK = 0.0`.
- The lowest-ranked (or last) row always has `PERCENT_RANK = 1.0`.

```sql
SELECT 
    employee_name,
    salary,
    ROUND(PERCENT_RANK() OVER (ORDER BY salary ASC), 4) AS salary_percentile
FROM employees;
```

---

### Summary Comparison Table

| Function | Output Range | Key Characteristic | Common Use Case |
| :--- | :--- | :--- | :--- |
| **`NTILE(n)`** | 1 to `n` (Integers) | Divides rows into equal discrete groups | Quartiles, deciles, tiering |
| **`CUME_DIST()`** | `> 0.0` to `1.0` (Float) | Fraction of rows $le$ current row | Cumulative probability, percentiles |
| **`PERCENT_RANK()`**| `0.0` to `1.0` (Float) | Relative rank score based on `(rank - 1)/(N - 1)` | Standardized scoring, benchmarks |

---

# Multiple Choice Questions

### 1. How does NTILE(4) distribute 10 rows across its buckets?
A. 2 in each bucket and 2 discarded
B. 3 in bucket 1, 3 in bucket 2, 2 in bucket 3, 2 in bucket 4
C. 4 in bucket 1, 4 in bucket 2, 2 in bucket 3, 0 in bucket 4
D. 2.5 rows per bucket
**Answer:** B
**Explanation:** When row counts are not evenly divisible, NTILE places extra rows into the earliest buckets (producing buckets of 3, 3, 2, and 2).
---

### 2. What is the mathematical range of CUME_DIST()?
A. 0.0 to 100.0
B. Greater than 0.0 and up to 1.0
C. -1.0 to +1.0
D. 1 to N
**Answer:** B
**Explanation:** CUME_DIST always returns a floating-point value strictly greater than 0.0 and up to 1.0 (the last row always equals 1.0).
---

### 3. What is the value of PERCENT_RANK() for the very first row in an ordered partition?
A. 1.0
B. 0.0
C. NULL
D. 0.5
**Answer:** B
**Explanation:** According to the formula (rank - 1) / (N - 1), for the first row (rank = 1), (1 - 1) / (N - 1) = 0.0.
---

### 4. If an employee has a CUME_DIST() of 0.75 on salary, what does this indicate?
A. The employee earns 75% above minimum wage
B. 75% of employees earn less than or equal to this employee's salary
C. The employee's tax bracket is 75%
D. The salary is in quartile 1
**Answer:** B
**Explanation:** CUME_DIST represents the proportion of partition rows whose values are less than or equal to the current row.
---

### 5. Which function is ideal for categorizing customers into top 10% (deciles) for loyalty marketing campaigns?
A. NTILE(10)
B. FIRST_VALUE(10)
C. LEAD(10)
D. ROUND(10)
**Answer:** A
**Explanation:** NTILE(10) segments the customer dataset into 10 equal decile groups.
---
