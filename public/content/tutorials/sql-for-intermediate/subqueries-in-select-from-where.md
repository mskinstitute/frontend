---
id: subqueries-in-select-from-where
slug: subqueries-in-select-from-where
course: sql-for-intermediate
chapter: Subqueries & Nested Queries
topic: "Subqueries in SELECT, FROM (Derived Tables), & WHERE Clauses"
difficulty: Intermediate
readingTime: 12
order: 15
keywords: ["derived tables","subqueries in select","subqueries in from","scalar subquery","inline view","table alias required"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Subqueries in SELECT, FROM (Derived Tables), & WHERE Clauses
Subqueries are not restricted to the `WHERE` clause. Depending on your business requirements, subqueries can be placed in the **`SELECT`** clause (to compute inline scalar calculations), the **`FROM`** clause (to create temporary in-memory **Derived Tables**), or the **`HAVING`** clause.

---

## 1. Subqueries in the `SELECT` Clause (Scalar Expressions)

A subquery placed in the `SELECT` clause must be a **Scalar Subquery** (returning strictly one column and one row per outer record):

```sql
-- Display each employee alongside the company average salary and deviation:
SELECT 
    full_name,
    salary,
    (SELECT ROUND(AVG(salary), 2) FROM employees) AS company_avg_salary,
    ROUND(salary - (SELECT AVG(salary) FROM employees), 2) AS diff_from_average
FROM employees;
```

### Real-World Use Case: Inline Counts
```sql
-- List categories with an inline count of their products:
SELECT 
    category_name,
    (SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id) AS total_products
FROM categories c;
```

---

## 2. Subqueries in the `FROM` Clause (Derived Tables)

When a subquery appears in the `FROM` clause, it acts as a temporary, virtual table during query execution. In SQL terminology, this is called a **Derived Table** (or **Inline View**).

> [!CRITICAL]
> **The Golden Rule of Derived Tables in MySQL:**
> Every derived table in a `FROM` clause **MUST HAVE ITS OWN TABLE ALIAS**! Omitting the alias will trigger **`Error 1248: Every derived table must have its own alias`**.

```sql
-- Correct Syntax: Note the mandatory alias 'AS dept_stats' at the end!
SELECT 
    dept_stats.department_id,
    dept_stats.avg_sal
FROM (
    SELECT department_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department_id
) AS dept_stats
WHERE dept_stats.avg_sal > 60000.00;
```

---

## 3. Advanced Example: Two-Stage Aggregations

SQL does not allow nesting aggregate functions directly (e.g., `AVG(COUNT(*))` is illegal!). To calculate the *"Average number of orders placed per customer"*, you must use a **Derived Table**:

```sql
-- Stage 1: Inner query counts orders per customer.
-- Stage 2: Outer query calculates the average of those counts!
SELECT 
    ROUND(AVG(customer_order_summary.order_count), 2) AS avg_orders_per_customer,
    MAX(customer_order_summary.order_count) AS max_orders_by_single_customer
FROM (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
) AS customer_order_summary;
```

---

## 4. Subqueries in the `HAVING` Clause

You can use subqueries inside `HAVING` to filter groups dynamically:

```sql
-- Find departments whose total payroll exceeds the Marketing department's payroll:
SELECT department_id, SUM(salary) AS total_payroll
FROM employees
GROUP BY department_id
HAVING SUM(salary) > (
    SELECT SUM(salary) 
    FROM employees 
    WHERE department_id = (SELECT department_id FROM departments WHERE dept_name = 'Marketing')
);
```

---

## 5. Best Practices & Common Pitfalls

- **Performance of Subqueries in SELECT:** If a scalar subquery in the `SELECT` clause is correlated with the outer table, it will re-execute for **every single row** in the outer query (10,000 outer rows = 10,000 subquery executions!). Prefer joining an aggregated derived table instead.
- **Derived Table Materialization:** MySQL 8.0 optimizes derived tables by either *merging* them into the outer query or *materializing* them into a temporary memory table with automatic internal index lookup generation.

---

# Multiple Choice Questions

### 1. What error occurs in MySQL if you execute a subquery in the `FROM` clause without assigning an alias?
A. Error 1064: Syntax error
B. Error 1248: Every derived table must have its own alias
C. Table not found
D. Out of memory
**Answer:** B
**Explanation:** MySQL strictly requires that every derived table specified in the `FROM` clause have an explicit table alias assigned (e.g., `FROM (...) AS my_alias`).
---

### 2. How can a developer calculate the average of an aggregate (e.g., the average order count per customer) in standard SQL?
A. By writing `SELECT AVG(COUNT(*)) FROM orders;`
B. By computing the counts in a derived table in the FROM clause and calculating AVG() in the outer query
C. By using two GROUP BY clauses in one query
D. It is impossible in SQL
**Answer:** B
**Explanation:** SQL prohibits nesting aggregate functions directly; two-stage aggregations require an inner query in the `FROM` clause calculating counts, wrapped by an outer `AVG()` query.
---

### 3. What constraint is strictly enforced on subqueries placed in the `SELECT` column list?
A. They must return text
B. They must be scalar subqueries (returning at most 1 column and 1 row per outer record)
C. They must use the MyISAM engine
D. They cannot access outer table columns
**Answer:** B
**Explanation:** A subquery inside the `SELECT` projection list evaluates to an individual cell value, requiring it to return strictly a single scalar value.
---

### 4. What is another common name for a subquery placed in the `FROM` clause?
A. Inline View or Derived Table
B. Stored Procedure
C. Clustered Cursor
D. Correlated Sequence
**Answer:** A
**Explanation:** A subquery in the `FROM` clause acts as a temporary in-memory table, universally termed a "Derived Table" or "Inline View".
---

### 5. Why can scalar subqueries in the `SELECT` clause degrade performance on large tables?
A. They turn off indexes
B. If correlated, they re-execute once for every single row returned by the outer query (N+1 query problem)
C. They create permanent disk tables
D. They consume all available network ports
**Answer:** B
**Explanation:** Correlated scalar subqueries in the SELECT projection execute row-by-row for every candidate row in the outer query, leading to significant CPU overhead.
---
