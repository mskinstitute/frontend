---
id: non-recursive-ctes-with-clause
slug: non-recursive-ctes-with-clause
course: sql-for-intermediate
chapter: Common Table Expressions (CTEs)
topic: "Non-Recursive CTEs with WITH Clause"
difficulty: Intermediate
readingTime: 12
order: 31
keywords: ["ctes","common table expressions","with clause","mysql 8.0 ctes","non-recursive cte"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Non-Recursive CTEs with WITH Clause
A **Common Table Expression (CTE)** is a temporary, named result set defined within the execution scope of a single SQL statement (`SELECT`, `INSERT`, `UPDATE`, or `DELETE`). Introduced in MySQL 8.0, CTEs use the **`WITH`** keyword and dramatically enhance query readability, modularity, and maintainability compared to nested derived tables (subqueries).

---

### The Problem with Nested Derived Subqueries

Consider a query that calculates department salary metrics and joins those metrics back to employee details:

```sql
-- Nested derived table approach: Hard to read and maintain
SELECT e.first_name, e.salary, dept_stats.avg_sal
FROM employees e
JOIN (
    SELECT department_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department_id
) AS dept_stats ON e.department_id = dept_stats.department_id
WHERE e.salary > dept_stats.avg_sal;
```

When subqueries are nested 3 or 4 layers deep, code readability plummets. CTEs eliminate this nesting by declaring intermediate result sets at the top of the statement.

---

### Non-Recursive CTE Syntax

```sql
WITH cte_name [(column_alias1, column_alias2, ...)] AS (
    -- Inner query definition
    SELECT column1, column2, ...
    FROM source_table
    WHERE condition
)
-- Main query consuming the CTE
SELECT *
FROM cte_name
WHERE filter_condition;
```

---

### Refactoring with a Clean CTE

Here is the exact same employee salary comparison rewritten with a CTE:

```sql
WITH DeptSalaryMetrics AS (
    SELECT 
        department_id,
        AVG(salary) AS avg_sal,
        MAX(salary) AS max_sal,
        MIN(salary) AS min_sal
    FROM employees
    GROUP BY department_id
)
SELECT 
    e.emp_id,
    e.first_name,
    e.salary,
    ROUND(d.avg_sal, 2) AS dept_avg_salary,
    ROUND(e.salary - d.avg_sal, 2) AS diff_from_avg
FROM employees e
JOIN DeptSalaryMetrics d ON e.department_id = d.department_id
WHERE e.salary > d.avg_sal
ORDER BY diff_from_avg DESC;
```

Notice how logical the flow becomes:
1. Define the named CTE: `DeptSalaryMetrics`.
2. Reference `DeptSalaryMetrics` in the main `SELECT` query just like a standard table or view.

---

### Column Aliasing in CTE Headers

You can define explicit column aliases directly in the CTE header:

```sql
WITH RegionalRevenue(region, total_sales, order_count) AS (
    SELECT 
        customer_region,
        SUM(order_amount),
        COUNT(order_id)
    FROM orders
    GROUP BY customer_region
)
SELECT region, total_sales, order_count
FROM RegionalRevenue
WHERE total_sales > 100000;
```

---

### CTE Lifecycle & Scope

- **Single Query Scope:** A CTE exists **only** during the execution of the statement that defines it. As soon as the query returns results, the CTE is discarded from memory.
- **DML Compatibility:** CTEs can be used preceding `INSERT INTO ... SELECT`, `UPDATE ... JOIN CTE`, and `DELETE ... USING CTE` statements in MySQL 8.0+.
- **Optimization:** MySQL 8.0's optimizer determines whether to merge the CTE inline or materialize it into an in-memory temporary table for optimal execution speed.

---

# Multiple Choice Questions

### 1. Which SQL keyword introduces a Common Table Expression?
A. LET
B. WITH
C. AS
D. DEFINE
**Answer:** B
**Explanation:** CTEs are introduced at the beginning of a SQL statement using the WITH clause.
---

### 2. In which MySQL version were Common Table Expressions (CTEs) officially introduced?
A. MySQL 5.5
B. MySQL 5.7
C. MySQL 8.0
D. MySQL 4.1
**Answer:** C
**Explanation:** MySQL introduced native support for both recursive and non-recursive CTEs in version 8.0.
---

### 3. What is the lifespan of a Common Table Expression?
A. It persists until the database server is rebooted
B. It persists across the entire database user session until disconnected
C. It exists solely during the execution of the single SQL statement that defines it
D. It creates a permanent table in the active schema
**Answer:** C
**Explanation:** CTEs are strictly temporary; their lifespan is confined entirely to the execution of the single statement containing the WITH clause.
---

### 4. What is a major readability advantage of CTEs over nested derived subqueries?
A. CTEs enforce strict capitalization of keywords
B. CTEs define intermediate datasets at the top of the query, eliminating messy nested parenthetical blocks
C. CTEs automatically translate queries into PL/SQL stored procedures
D. CTEs delete duplicate rows without needing DISTINCT
**Answer:** B
**Explanation:** CTEs replace deep, indented nested subqueries with linear, top-down named blocks that resemble modular programming variables.
---

### 5. Can a CTE be referenced in an INSERT or UPDATE statement?
A. No, CTEs are strictly limited to SELECT statements
B. Yes, a CTE can precede an INSERT, UPDATE, or DELETE statement in MySQL 8.0+
C. Only if the database is running in replication slave mode
D. Only when modifying temporary tables
**Answer:** B
**Explanation:** In MySQL 8.0+, CTEs can be defined in WITH blocks immediately preceding INSERT INTO ... SELECT, UPDATE, and DELETE statements.
---
