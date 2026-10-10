---
id: single-and-multi-row-subqueries
slug: single-and-multi-row-subqueries
course: sql-for-intermediate
chapter: Subqueries & Nested Queries
topic: "Single-Row & Multi-Row Subqueries: IN, ANY, and ALL Operators"
difficulty: Intermediate
readingTime: 12
order: 14
keywords: ["subqueries","single row subquery","multi row subquery","any operator","all operator","nested queries"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Single-Row & Multi-Row Subqueries: IN, ANY, and ALL Operators
A **Subquery** (also called an **Inner Query** or **Nested Query**) is a `SELECT` query embedded inside another SQL statement. Subqueries allow you to compute dynamic intermediate values on the fly without running multiple separate queries from your application code.

Depending on the cardinality of results returned by the inner query, subqueries are classified into **Single-Row Subqueries** and **Multi-Row Subqueries**.

---

## 1. Single-Row Subqueries

A **Single-Row Subquery** returns at most one column and one row (a single scalar value). Because it produces a single value, it can be used with standard scalar comparison operators (`=`, `>`, `<`, `>=`, `<=`, `<>`):

```sql
-- Find all employees who earn strictly MORE than the company-wide average salary:
SELECT employee_id, full_name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees -- Inner query produces a single number!
)
ORDER BY salary DESC;
```

### Execution Flow:
1. The inner query (`SELECT AVG(salary) FROM employees`) executes **once**, returning, for example, `62000.00`.
2. The outer query substitutes this value: `WHERE salary > 62000.00`.

> [!CAUTION]
> If a subquery used with a scalar operator like `=` returns **more than one row**, MySQL halts with error: **`Error 1242: Subquery returns more than 1 row`**!

---

## 2. Multi-Row Subqueries: `IN`, `ANY`, and `ALL`

When an inner query can return multiple rows, scalar operators (`=`, `>`) cannot be used directly. You must use multi-row operators: **`IN`**, **`ANY`**, or **`ALL`**.

---

## 3. The `IN` Operator with Subqueries

```sql
-- Find all customers who placed an order in March 2026:
SELECT customer_id, customer_name, email
FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id 
    FROM orders 
    WHERE order_date BETWEEN '2026-03-01' AND '2026-03-31'
);
```

---

## 4. The `ANY` (or `SOME`) Operator

The **`ANY`** operator compares a scalar value to **each** value returned by the subquery and evaluates to `TRUE` if **at least one** comparison succeeds:

- **`> ANY (subquery)`**: Greater than the **minimum** value of the subquery.
- **`< ANY (subquery)`**: Less than the **maximum** value of the subquery.
- **`= ANY (subquery)`**: Exactly identical to **`IN`**!

```sql
-- Find employees who earn more than AT LEAST ONE engineer in department 1:
SELECT full_name, salary, department_id
FROM employees
WHERE salary > ANY (
    SELECT salary FROM employees WHERE department_id = 1
) AND department_id <> 1;
```

---

## 5. The `ALL` Operator

The **`ALL`** operator compares a scalar value to **all** values returned by the subquery and evaluates to `TRUE` only if **every single** comparison succeeds:

- **`> ALL (subquery)`**: Greater than the **maximum** value of the subquery.
- **`< ALL (subquery)`**: Less than the **minimum** value of the subquery.
- **`<> ALL (subquery)`**: Exactly identical to **`NOT IN`**!

```sql
-- Find employees whose salary is strictly greater than ALL salaries in department 2:
SELECT full_name, salary
FROM employees
WHERE salary > ALL (
    SELECT salary FROM employees WHERE department_id = 2
);
```

---

## 6. Best Practices & Common Pitfalls

- **Avoid Deeply Nested Subqueries:** While SQL supports nesting subqueries 5+ levels deep, deeply nested queries become impossible to read and debug. Use **Common Table Expressions (CTEs)** or **JOINs** instead.
- **Semi-Join Optimization:** In modern MySQL 8.0, the optimizer frequently rewrites `WHERE id IN (SELECT id ...)` subqueries into internal **Semi-Joins**, executing them with the same speed as an `INNER JOIN`.

---

# Multiple Choice Questions

### 1. What error occurs if a subquery evaluated against a scalar equality operator (`WHERE salary = (...)`) returns 3 rows?
A. Error 1064 (Syntax error)
B. Error 1242 (Subquery returns more than 1 row)
C. It averages the 3 values automatically
D. It picks the first row randomly
**Answer:** B
**Explanation:** Scalar comparison operators like `=` expect exactly one single scalar value; returning multiple rows triggers Error 1242.
---

### 2. What is `= ANY (subquery)` completely identical to in SQL?
A. = ALL
B. IN
C. NOT IN
D. EXISTS
**Answer:** B
**Explanation:** `= ANY` tests whether the left-hand value matches any element in the subquery result set, which is the exact definition of `IN`.
---

### 3. If a subquery returns values `[40000, 60000, 80000]`, what does the condition `WHERE salary > ALL (subquery)` require?
A. Salary must be greater than 40000
B. Salary must be greater than 60000
C. Salary must be strictly greater than 80000 (the maximum value)
D. Salary must be equal to 80000
**Answer:** C
**Explanation:** `> ALL` requires that the value exceed every element in the set, which means it must be strictly greater than the maximum value (80,000).
---

### 4. What does `> ANY (subquery)` evaluate to when the subquery returns `[10, 25, 50]`?
A. Greater than 50
B. Greater than 10 (the minimum value in the set)
C. Exactly equal to 25
D. Less than 10
**Answer:** B
**Explanation:** `> ANY` is satisfied if the value is greater than at least one element, meaning it only needs to exceed the minimum element (10).
---

### 5. How does the MySQL query optimizer optimize independent non-correlated subqueries?
A. It executes the inner query once, caches the result set, and probes it against the outer query
B. It re-runs the inner query for every row in the outer query
C. It deletes the inner query
D. It turns the query into a CSV
**Answer:** A
**Explanation:** Non-correlated subqueries do not depend on outer row values; MySQL evaluates them once, caching or materializing the result for outer query evaluation.
---
