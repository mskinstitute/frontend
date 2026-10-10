---
id: aggregate-functions-count-sum-avg
slug: aggregate-functions-count-sum-avg
course: sql-for-beginners
chapter: Aggregate Functions & Grouping
topic: "Aggregate Functions: COUNT, SUM, AVG, MIN, and MAX"
difficulty: Beginner
readingTime: 12
order: 47
keywords: ["aggregate functions","count","sum","avg","min","max","null handling in aggregates"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Aggregate Functions: COUNT, SUM, AVG, MIN, and MAX
Up to this point, our queries have operated on individual rows (scalar operations). However, business intelligence and executive reporting require summarizing data across thousands or millions of rows: calculating total quarterly sales, finding the maximum salary, or determining average product ratings. These calculations are performed using **Aggregate Functions**.

---

## 1. The Big 5 Aggregate Functions

| Function | Purpose | Input Types | Treats NULL as... |
| :--- | :--- | :--- | :--- |
| **`COUNT()`** | Counts the number of rows or non-null values. | Any | `COUNT(*)` counts all rows; `COUNT(col)` ignores NULL. |
| **`SUM()`** | Calculates the total sum of values. | Numeric | **Ignored** (Skipped). |
| **`AVG()`** | Calculates the arithmetic mean. | Numeric | **Ignored** (Skipped). |
| **`MIN()`** | Finds the minimum value. | Numeric, Date, String | **Ignored** (Skipped). |
| **`MAX()`** | Finds the maximum value. | Numeric, Date, String | **Ignored** (Skipped). |

---

## 2. Practical Aggregation Examples

```sql
SELECT 
    COUNT(*) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS average_order_value,
    MIN(total_amount) AS smallest_order,
    MAX(total_amount) AS largest_order,
    MIN(order_date) AS earliest_order,
    MAX(order_date) AS most_recent_order
FROM orders;
```

---

## 3. The `COUNT(*)` vs `COUNT(column)` Distinction

One of the most critical concepts in SQL is the difference between `COUNT(*)` and `COUNT(col)`:

```
   Table: employees (5 rows total)
   +----+----------+------------+
   | id | name     | commission |
   +----+----------+------------+
   |  1 | Aarav    | 500.00     |
   |  2 | Priya    | NULL       |
   |  3 | Rohan    | 1200.00    |
   |  4 | Diya     | NULL       |
   |  5 | Kabir    | 800.00     |
   +----+----------+------------+

   SELECT COUNT(*) FROM employees;           --> Returns 5 (Counts total rows)
   SELECT COUNT(commission) FROM employees;  --> Returns 3 (Counts ONLY non-null values!)
```

---

## 4. How `AVG()` Handles NULL Values

Because aggregate functions skip `NULL` rows, `AVG()` computes the mean divided **only by the count of non-null rows**:

```sql
-- In the table above, commission has values: 500, 1200, 800 (and 2 NULLs).
SELECT AVG(commission) FROM employees;
-- Calculation: (500 + 1200 + 800) / 3 = 833.33!
-- The 2 employees with NULL are completely excluded from the denominator!
```

If your business requirement mandates treating missing commissions as **₹0.00**:
```sql
-- True average across all 5 employees:
SELECT AVG(IFNULL(commission, 0.00)) FROM employees;
-- Calculation: (500 + 0 + 1200 + 0 + 800) / 5 = 500.00!
```

---

## 5. Aggregating Unique Values with `DISTINCT`

You can combine `DISTINCT` inside an aggregate function:

```sql
-- Count how many unique customers have placed orders:
SELECT COUNT(DISTINCT customer_id) AS active_customer_count FROM orders;
```

---

## 6. Best Practices & Common Pitfalls

- **Mixing Scalar and Aggregate Columns Without GROUP BY:** In strict SQL mode (`ONLY_FULL_GROUP_BY`), running `SELECT department, AVG(salary) FROM employees;` triggers an error! You cannot ask for a single average salary alongside multiple department names without a `GROUP BY` clause.
- **`MIN` and `MAX` on Dates and Strings:** `MIN()` and `MAX()` work seamlessly on dates (finding oldest/newest) and alphabetical strings (`'Aarav'` to `'Zoya'`).

---

# Multiple Choice Questions

### 1. What does `COUNT(*)` count in a relational database table?
A. Only rows where all columns are non-null
B. Total rows in the table or filtered subset, including rows containing NULLs
C. Only the primary key column
D. Only unique rows
**Answer:** B
**Explanation:** `COUNT(*)` tallies the total number of physical rows returned, regardless of whether individual columns contain NULL values.
---

### 2. What is the behavior of `SUM()` and `AVG()` when they encounter `NULL` values in a numeric column?
A. They convert the entire result to NULL
B. They silently ignore and skip NULL values during the calculation
C. They treat NULL as 0 automatically
D. They throw an arithmetic error
**Answer:** B
**Explanation:** SQL aggregate functions (except COUNT(*)) automatically skip NULL values and compute totals or averages exclusively from non-null entries.
---

### 3. If a table has 10 rows and 4 rows have `rating = NULL`, what does `SELECT COUNT(rating) FROM table;` return?
A. 10
B. 6
C. 4
D. 0
**Answer:** B
**Explanation:** `COUNT(column_name)` counts only non-null occurrences (10 - 4 = 6).
---

### 4. Which query counts the total number of distinct cities represented in a `customers` table?
A. SELECT COUNT(city) DISTINCT FROM customers;
B. SELECT COUNT(DISTINCT city) FROM customers;
C. SELECT DISTINCT(COUNT(city)) FROM customers;
D. SELECT UNIQUE(city) FROM customers;
**Answer:** B
**Explanation:** Placing `DISTINCT` inside the parentheses (`COUNT(DISTINCT column)`) instructs the function to deduplicate values before counting.
---

### 5. What does `MIN(order_date)` return when executed against an orders table?
A. The most recent order date
B. The earliest (oldest) order date
C. The order with the minimum total price
D. An error, because MIN only works on integers
**Answer:** B
**Explanation:** When applied to date columns, `MIN()` returns the earliest chronological date, while `MAX()` returns the most recent date.
---
