---
id: correlated-subqueries
slug: correlated-subqueries
course: sql-for-intermediate
chapter: Subqueries & Nested Queries
topic: "Correlated Subqueries & Row-by-Row Execution Mechanics"
difficulty: Intermediate
readingTime: 12
order: 16
keywords: ["correlated subquery","row by row execution","outer reference","subquery performance","nested queries"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Correlated Subqueries & Row-by-Row Execution Mechanics
In a standard (independent) subquery, the inner query executes **once**, produces an intermediate result, and passes that value to the outer query. In contrast, a **Correlated Subquery** depends directly on values from the current row being evaluated by the **outer query**.

Because the inner query references outer columns, it cannot be pre-computed. The database engine must evaluate the inner query **repeatedly for every single row** processed by the outer query!

---

## 1. Anatomy of a Correlated Subquery

Notice the outer table reference (`e.department_id`) inside the inner query:

```sql
-- Find employees who earn MORE than the average salary of THEIR OWN department:
SELECT 
    e.employee_id,
    e.full_name,
    e.salary,
    e.department_id
FROM employees e
WHERE e.salary > (
    SELECT AVG(sub.salary)
    FROM employees sub
    WHERE sub.department_id = e.department_id -- References outer query table 'e'!
);
```

### Execution Mechanics (Step-by-Step):
1. The outer query reads **Row 1** (e.g., *Aarav in Department 1 with salary ₹70,000*).
2. The inner query runs with `sub.department_id = 1`, computing Department 1's average salary (e.g., ₹60,000).
3. The outer query tests: Is ₹70,000 > ₹60,000? **TRUE**. Aarav is included.
4. The outer query reads **Row 2** (e.g., *Diya in Department 2 with salary ₹50,000*).
5. The inner query re-runs with `sub.department_id = 2`, computing Department 2's average salary (e.g., ₹55,000).
6. The outer query tests: Is ₹50,000 > ₹55,000? **FALSE**. Diya is omitted.
7. *This cycle repeats for all N rows in the table!*

---

## 2. Real-World Use Case: Top N Rows per Group

Finding the most recent order for every customer without using window functions:

```sql
SELECT o1.order_id, o1.customer_id, o1.order_date, o1.total_amount
FROM orders o1
WHERE o1.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.customer_id = o1.customer_id -- Correlated link!
);
```

---

## 3. The Performance Cost: O(N * M) Complexity

Because a correlated subquery executes row-by-row:
- If the outer query processes **100,000 rows**...
- The inner query will execute **100,000 individual times**!
- If the inner query table is not properly indexed, the database will grind to a halt.

---

## 4. Rewriting Correlated Subqueries as JOINs

Experienced database engineers frequently rewrite correlated subqueries as **`INNER JOIN`s on pre-aggregated derived tables** to achieve massive speedups:

```sql
-- REWRITTEN AS A JOIN (Runs up to 500x faster!):
SELECT 
    e.employee_id,
    e.full_name,
    e.salary,
    e.department_id
FROM employees e
INNER JOIN (
    -- Pre-aggregate department averages ONCE:
    SELECT department_id, AVG(salary) AS dept_avg
    FROM employees
    GROUP BY department_id
) d_avg ON e.department_id = d_avg.department_id
WHERE e.salary > d_avg.dept_avg;
```

### Why the JOIN is Faster:
The derived table calculates all departmental averages in a **single pass**; the outer query then performs a hash or index join, eliminating repeated subquery scans!

---

## 5. Best Practices & Common Pitfalls

- **Always Index the Correlating Column:** In `WHERE sub.department_id = e.department_id`, the column `sub.department_id` **must be indexed**. If it is unindexed, every row in the outer table triggers a full table scan in the inner table ($N 	imes M$ operations).
- **Consider Window Functions:** In modern MySQL 8.0+, many correlated subquery patterns (like ranking and department comparisons) are much more efficiently solved using **Window Functions** (`AVG(salary) OVER (PARTITION BY dept_id)`).

---

# Multiple Choice Questions

### 1. What defines a Correlated Subquery in SQL?
A. A subquery that joins tables from two different databases
B. A subquery that references one or more columns from the outer query, requiring evaluation for each candidate row
C. A subquery that runs in a background thread
D. A subquery containing a UNION
**Answer:** B
**Explanation:** A correlated subquery contains references to columns in the outer query, binding its execution to the row-by-row processing of the outer table.
---

### 2. How many times does the inner query of a correlated subquery execute relative to the outer query?
A. Exactly once
B. Once for every row processed by the outer query
C. Twice
D. Never
**Answer:** B
**Explanation:** Because the inner query's filter values change with each outer row, it must execute once for every row considered by the outer query.
---

### 3. Which optimization technique can replace a slow correlated subquery with a single-pass aggregation?
A. Converting the subquery into an INNER JOIN on an aggregated derived table
B. Changing the table storage engine to CSV
C. Wrapping the query in an INSERT statement
D. Removing all primary keys
**Answer:** A
**Explanation:** Pre-aggregating data in a derived table and joining it back to the base table computes summary metrics in a single pass, avoiding row-by-row re-execution.
---

### 4. Which index is most critical for ensuring acceptable performance of a correlated subquery?
A. An index on the outer table's primary key
B. An index on the inner table column referenced in the correlated join condition
C. A full-text index
D. A memory index
**Answer:** B
**Explanation:** An index on the inner table's correlating column ensures that each of the repeated inner lookups executes as a fast B-Tree seek rather than a full table scan.
---

### 5. What modern SQL feature introduced in MySQL 8.0 frequently eliminates the need for correlated subqueries for departmental average comparisons?
A. JSON columns
B. Window Functions (OVER and PARTITION BY)
C. Stored Triggers
D. MyISAM engine
**Answer:** B
**Explanation:** Analytical window functions compute partition-level aggregations alongside individual rows in a single pass without subqueries.
---
