---
id: grouping-data-with-group-by
slug: grouping-data-with-group-by
course: sql-for-beginners
chapter: Aggregate Functions & Grouping
topic: "Grouping Data with GROUP BY: Multi-Dimensional Aggregation"
difficulty: Beginner
readingTime: 12
order: 48
keywords: ["group by","aggregation","grouping rows","only_full_group_by","multi-column group by"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Grouping Data with GROUP BY: Multi-Dimensional Aggregation
Calculating the average salary across an entire company is helpful, but management usually needs more granular breakdowns: *"What is the average salary in each department?"*, *"How much revenue did each product category generate this month?"*, or *"How many orders did each customer place?"*. The **`GROUP BY`** clause collapses rows sharing identical values into summary rows, enabling multi-dimensional aggregations.

---

## 1. Syntax of the `GROUP BY` Clause

```sql
SELECT grouping_column, AGGREGATE_FUNCTION(target_column)
FROM table_name
[WHERE filter_condition]
GROUP BY grouping_column
[ORDER BY sort_column];
```

### Step-by-Step Example:
```sql
SELECT 
    department,
    COUNT(*) AS employee_count,
    AVG(salary) AS average_salary,
    MAX(salary) AS highest_salary
FROM employees
GROUP BY department
ORDER BY average_salary DESC;
```

### How MySQL Processes `GROUP BY`:
1. **`WHERE`**: Filters individual rows first.
2. **`GROUP BY`**: Gathers remaining rows into buckets based on distinct `department` values.
3. **Aggregate Functions**: Computes `COUNT`, `AVG`, and `MAX` for each departmental bucket independently.
4. **`SELECT`**: Projects the results.
5. **`ORDER BY`**: Sorts the aggregated buckets.

---

## 2. Multi-Column Grouping

You can group by multiple columns simultaneously to create hierarchical breakdowns:

```sql
-- Sales revenue broken down by Country AND City:
SELECT 
    country,
    city,
    COUNT(order_id) AS total_orders,
    SUM(order_total) AS total_revenue
FROM orders
GROUP BY country, city
ORDER BY country ASC, total_revenue DESC;
```

---

## 3. The `ONLY_FULL_GROUP_BY` Standard in MySQL 8.0

In MySQL 5.7+, the **`ONLY_FULL_GROUP_BY`** SQL mode is enabled by default. This enforces strict standard SQL compliance:

> [!CRITICAL]
> **The Golden Rule of GROUP BY:**
> Any column listed in the `SELECT` clause that is **NOT** wrapped inside an aggregate function **MUST** appear in the `GROUP BY` clause!

### Example of an Invalid Query:
```sql
-- ILLEGAL under ONLY_FULL_GROUP_BY:
SELECT department, full_name, AVG(salary) 
FROM employees 
GROUP BY department;
```

### Why does this fail?
Because a single department (e.g., *Engineering*) might have 50 employees with 50 different names! Which name should the database pick for the single summary row? In standard SQL, this ambiguity is rejected with error **1055**.

---

## 4. Grouping by Expressions

You can group by date expressions or calculated columns:

```sql
-- Group sales by Month:
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS sales_month,
    SUM(total_amount) AS monthly_revenue
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY sales_month ASC;
```

---

## 5. Best Practices & Common Pitfalls

- **Do Not Group by Unindexed High-Cardinality Columns:** Grouping by columns containing millions of distinct values (like UUIDs or timestamps) forces MySQL to build massive temporary hash tables in memory or on disk.
- **Index Your GROUP BY Columns:** An index covering the grouped column allows the storage engine to read groups in pre-aggregated order without filesort.

---

# Multiple Choice Questions

### 1. What does the `GROUP BY` clause do in a SQL query?
A. It sorts rows alphabetically
B. It collapses rows with identical values in specified columns into summary rows for aggregate calculations
C. It deletes duplicate rows permanently
D. It creates a new database
**Answer:** B
**Explanation:** `GROUP BY` partitions rows into buckets sharing the same group key so aggregate functions can compute summaries per group.
---

### 2. Under MySQL's default `ONLY_FULL_GROUP_BY` SQL mode, which columns can appear in the `SELECT` list?
A. Only columns that are numeric
B. Only columns that appear in the GROUP BY clause or are enclosed within aggregate functions
C. Any column in the table
D. Only the primary key
**Answer:** B
**Explanation:** Strict SQL standards dictate that every non-aggregated column in the SELECT list must be explicitly declared in the GROUP BY clause to prevent non-deterministic values.
---

### 3. What will happen if you execute `SELECT department, employee_name, MAX(salary) FROM staff GROUP BY department;` in MySQL 8.0?
A. It returns the employee with the highest salary
B. It fails with error 1055 because employee_name is neither in GROUP BY nor in an aggregate function
C. It picks a random employee name
D. It drops the department column
**Answer:** B
**Explanation:** Because `employee_name` is indeterminate across the group, MySQL rejects the query under `ONLY_FULL_GROUP_BY`.
---

### 4. Can you group records by multiple columns simultaneously in MySQL?
A. No, GROUP BY only accepts a single column
B. Yes, by separating column names with commas (e.g., GROUP BY region, city)
C. Only if both columns are integers
D. Only with temporary tables
**Answer:** B
**Explanation:** Grouping by multiple columns creates sub-groups for each unique combination of values across those columns.
---

### 5. In what logical order does the query engine evaluate `WHERE` vs `GROUP BY`?
A. GROUP BY evaluates first, then WHERE filters the groups
B. WHERE evaluates first to filter individual rows, then remaining rows are grouped by GROUP BY
C. Both evaluate simultaneously
D. It depends on whether LIMIT is present
**Answer:** B
**Explanation:** The `WHERE` clause filters raw table rows before the `GROUP BY` clause gathers the remaining rows into aggregate groups.
---
