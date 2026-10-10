---
id: "blog-sql-interview-queries-2026"
slug: "top-30-sql-queries-interview-questions-with-answers"
title: "Top 30 SQL Queries Asked in Data Analyst & Backend Developer Interviews with Solutions"
excerpt: "Master the most frequently asked SQL coding questions in technical interviews: 2nd highest salary, duplicate detection, window functions, self joins, and running totals."
coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop"
category: "Database & SQL"
featured: true
author: "Er. Sumit Kumar"
authorRole: "Founder & Lead Technical Mentor"
authorAvatar: "/assets/img/instructors/sumit-kumar.webp"
publishedAt: "2026-09-25"
readTime: "9 min read"
tags:
  - "SQL"
  - "Database"
  - "Data Analyst"
  - "Backend Developer"
  - "Interview Questions"
  - "MySQL"
relatedCourses:
  - "data-analysis-mastery-combo-course--12-months"
  - "python-backend-development-mastery-combo--8-months"
---

Whether you are applying for a **Data Analyst, Business Intelligence Engineer, or Backend Software Developer** role at companies like Amazon, Swiggy, TCS, or modern tech startups, **SQL live coding rounds** are the primary barrier between you and the offer letter.

Recruiters don't just test basic `SELECT * FROM table;` queries. They want to see if you can handle **NULL values, tie-breaking logic, self joins, Common Table Expressions (CTEs), and modern window functions**.

Here is an essential collection of the top SQL queries most frequently tested in technical rounds, complete with tested syntax and logic explanations compiled by **Er. Sumit Kumar** at MSK Institute.

---

## 1. How to Find the Nth (or 2nd) Highest Salary in an Employee Table?

This is unanimously the single most asked SQL interview problem in India!

### Method A: Using `DENSE_RANK()` (Recommended Industry Standard)
`DENSE_RANK()` handles duplicates and ties seamlessly without skipping ranks:

```sql
WITH RankedSalaries AS (
    SELECT 
        emp_id, 
        emp_name, 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos
    FROM employees
)
SELECT emp_name, salary 
FROM RankedSalaries 
WHERE rank_pos = 2; -- Change to N for Nth highest!
```

### Method B: Subquery with `MAX()`
```sql
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### Method C: Using `LIMIT` & `OFFSET` (MySQL / PostgreSQL)
```sql
SELECT salary 
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1; -- Skip top 1, pick 2nd
```

> **Interview Caution:** Always ask the interviewer: *"How should we handle ties if multiple employees earn the exact same salary?"* Answering with `DENSE_RANK()` demonstrates senior engineering maturity!

---

## 2. How to Find and Delete Duplicate Records from a Table?

Given a table with accidental duplicate rows, how do you keep only one unique copy?

### Finding Duplicates:
```sql
SELECT email, COUNT(*) AS duplicate_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Deleting Duplicates using CTE and `ROW_NUMBER()`:
```sql
WITH NumberedRows AS (
    SELECT 
        id, 
        email,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY id ASC) as row_num
    FROM users
)
DELETE FROM users
WHERE id IN (
    SELECT id FROM NumberedRows WHERE row_num > 1
);
```

---

## 3. Difference Between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()`

Consider three employees with salaries: 100k, 100k, 80k. Look at how each window function assigns ranks:

| Salary | `ROW_NUMBER()` | `RANK()` | `DENSE_RANK()` |
| :--- | :--- | :--- | :--- |
| **100k** | 1 | 1 | 1 |
| **100k** | 2 | 1 | 1 |
| **80k** | 3 | **3 (Skips 2!)** | **2 (Never skips!)** |

- **`ROW_NUMBER()`:** Assigns a strictly unique incremental integer to every row regardless of duplicate values.
- **`RANK()`:** Gives identical rank to ties, but skips the next rank numbers.
- **`DENSE_RANK()`:** Gives identical rank to ties, and continues sequentially without skipping numbers.

---

## 4. How to Calculate a Running Total (Cumulative Sum) in SQL?

A favorite in financial and e-commerce analytics interviews:

```sql
SELECT 
    order_date,
    daily_amount,
    SUM(daily_amount) OVER (
        ORDER BY order_date ASC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM daily_sales;
```

---

## 5. Self-Join: Find Employees Who Earn More Than Their Managers

Given an `employees` table with `emp_id`, `emp_name`, `salary`, and `manager_id`:

```sql
SELECT 
    e.emp_name AS Employee,
    e.salary AS EmpSalary,
    m.emp_name AS Manager,
    m.salary AS ManagerSalary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;
```

---

## 6. How to Find Records Present in Table A but NOT in Table B?

Example: Find customers who registered on your platform but never placed an order.

### Method A: Using `LEFT JOIN` (High Performance)
```sql
SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

### Method B: Using `NOT EXISTS`
```sql
SELECT c.customer_id, c.name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

---

## 7. How to Calculate Year-over-Year (YoY) Sales Growth Using `LAG()`?

```sql
WITH AnnualSales AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) AS sales_year,
        SUM(revenue) AS total_revenue
    FROM sales
    GROUP BY EXTRACT(YEAR FROM order_date)
)
SELECT 
    sales_year,
    total_revenue,
    LAG(total_revenue, 1) OVER (ORDER BY sales_year) AS prev_year_revenue,
    ROUND(
        (total_revenue - LAG(total_revenue, 1) OVER (ORDER BY sales_year)) * 100.0 / 
        LAG(total_revenue, 1) OVER (ORDER BY sales_year), 2
    ) AS yoy_growth_pct
FROM AnnualSales;
```

---

## 8. What is the Difference Between `WHERE` and `HAVING`?

- **`WHERE`:** Filters individual rows **before** any grouping or aggregation takes place. It cannot evaluate aggregate functions like `SUM()` or `COUNT()`.
- **`HAVING`:** Filters grouped summary rows **after** the `GROUP BY` clause has aggregated the data.

```sql
-- Valid SQL showing both in action:
SELECT department_id, AVG(salary) AS avg_sal
FROM employees
WHERE status = 'Active'         -- Filters raw rows first
GROUP BY department_id
HAVING AVG(salary) > 50000;      -- Filters aggregated groups
```

---

## 9. Summary & 3 Best Practices for SQL Interviews

1. **Always State Your Assumptions:** Before writing queries, confirm whether column values can be `NULL` or contain duplicate keys.
2. **Format Queries with Clean Uppercase Keywords:** Writing clauses on new indented lines makes your solution look professional and readable.
3. **Practice on Live Datasets:** Don't just read queries passively. Test and modify complex joins inside our live [MSK Code Playground](/playground) or join our **[Data Analysis Combo Cohort](/courses/data-analysis-mastery-combo-course--12-months)** to master 100+ business SQL queries under direct mentor feedback!
