---
id: window-functions-introduction
slug: window-functions-introduction
course: sql-for-intermediate
chapter: Window Functions Fundamentals
topic: "Window Functions Introduction vs GROUP BY"
difficulty: Intermediate
readingTime: 12
order: 35
keywords: ["window functions","over clause","group by vs window functions","mysql 8.0 analytics","sql windowing"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Window Functions Introduction vs GROUP BY
Prior to modern SQL standards, aggregating data inevitably meant collapsing multiple rows into a single summary row using `GROUP BY`. If you wanted to view an individual employee's salary *alongside* their department's average salary, you had to write awkward self-joins or correlated subqueries.

**Window Functions** (introduced in MySQL 8.0) completely revolutionize SQL analytics. A window function performs a calculation across a set of table rows that are related to the current row, **without collapsing the individual rows**!

---

### The Fundamental Contrast: GROUP BY vs Window Functions

| Characteristic | `GROUP BY` Aggregation | Window Function (`OVER()`) |
| :--- | :--- | :--- |
| **Row Count** | Collapses rows (returns 1 row per group) | **Preserves all individual rows** (returns N rows) |
| **Output Detail** | Individual row details are discarded | Individual row details are retained alongside calculations |
| **Syntax** | `SELECT dept, AVG(salary) ... GROUP BY dept` | `SELECT name, salary, AVG(salary) OVER(PARTITION BY dept)` |
| **Primary Use Case**| High-level summary reports | Running totals, rankings, moving averages, row-by-row comparisons |

---

### Visualizing the Difference

Suppose we have an `employees` table:

| emp_id | name | department | salary |
| :--- | :--- | :--- | :--- |
| 1 | Alice | IT | 90000 |
| 2 | Bob | IT | 80000 |
| 3 | Carol | HR | 60000 |
| 4 | Dave | HR | 65000 |

#### Query with GROUP BY:
```sql
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department;
```
*Result (Rows are collapsed from 4 to 2):*
- IT: 85000
- HR: 62500

#### Query with Window Function:
```sql
SELECT 
    emp_id,
    name,
    department,
    salary,
    AVG(salary) OVER(PARTITION BY department) AS dept_avg_sal
FROM employees;
```
*Result (All 4 rows preserved!):*
| emp_id | name | department | salary | dept_avg_sal |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Alice | IT | 90000 | 85000 |
| 2 | Bob | IT | 80000 | 85000 |
| 3 | Carol | HR | 60000 | 62500 |
| 4 | Dave | HR | 65000 | 62500 |

Alice can immediately compare her $90,000 salary against her department's $85,000 average directly on row 1!

---

### Basic Anatomy of a Window Function

Every window function call consists of:
1. **The Function:** Can be an aggregate function (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`) or a dedicated window function (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD`, `LAG`).
2. **The `OVER()` Clause:** Indicates that the function operates as a window function rather than a standard aggregate.

```sql
SELECT 
    order_id,
    order_date,
    amount,
    -- Running total across the entire company
    SUM(amount) OVER() AS grand_total,
    -- Percentage of grand total contributed by this individual order
    ROUND((amount / SUM(amount) OVER()) * 100, 2) AS pct_of_total
FROM orders;
```

---

### Execution Order in SQL

Window functions execute very late in the SQL processing pipeline:
1. `FROM` and `JOIN`
2. `WHERE`
3. `GROUP BY` and `HAVING`
4. **Window Functions (`OVER`)**
5. `SELECT` expressions
6. `DISTINCT`
7. `ORDER BY`
8. `LIMIT`

> **Crucial Rule:** Because window functions execute after the `WHERE` clause, you **cannot** put a window function directly in a `WHERE` filter (e.g., `WHERE ROW_NUMBER() OVER(...) <= 5` will fail). To filter on window function results, wrap the query in a CTE or derived table!

---

# Multiple Choice Questions

### 1. What is the primary difference between GROUP BY and Window Functions?
A. GROUP BY preserves all rows, while window functions collapse them into a single row
B. GROUP BY collapses rows into summary groups, while window functions retain individual row identities
C. GROUP BY only works on numbers, while window functions only work on strings
D. Window functions require dropping foreign key constraints
**Answer:** B
**Explanation:** GROUP BY aggregates multiple records into a single group row; window functions perform calculations across a defined window while keeping every row distinct in the output.
---

### 2. Which SQL clause designates that a function is executing as a window function?
A. WINDOW BY()
B. OVER()
C. ACROSS()
D. WITHIN()
**Answer:** B
**Explanation:** The OVER() clause signals to the SQL engine that the preceding function operates as a window function.
---

### 3. Can you put a window function directly inside a WHERE clause (e.g., WHERE RANK() OVER(...) = 1)?
A. Yes, always
B. No, because window functions evaluate after the WHERE clause
C. Yes, but only in MySQL 5.7
D. Only if the column has an index
**Answer:** B
**Explanation:** The WHERE clause is evaluated before window calculations take place; referencing window functions in WHERE causes a syntax error.
---

### 4. How do you filter records based on the result of a window function?
A. Use a HAVING clause without GROUP BY
B. Wrap the window query inside a CTE or derived subquery and filter in the outer WHERE clause
C. Use the IGNORE NULLS clause
D. Add the CASCADE keyword to the SELECT statement
**Answer:** B
**Explanation:** Encapsulating the window query in a CTE or derived table allows the outer query's WHERE clause to filter on the calculated window column.
---

### 5. What does an empty OVER() clause (e.g., SUM(salary) OVER()) accomplish?
A. Throws an immediate syntax error
B. Computes the aggregate over all rows in the entire result set
C. Clears the buffer pool cache
D. Groups records by primary key
**Answer:** B
**Explanation:** An empty OVER() clause treats the entire result set as a single window, computing a grand aggregate (such as total company payroll) across every row.
---
