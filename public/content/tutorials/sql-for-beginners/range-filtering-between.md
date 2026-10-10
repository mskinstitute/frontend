---
id: range-filtering-between
slug: range-filtering-between
course: sql-for-beginners
chapter: Advanced Filtering & Searching
topic: "Range Filtering with BETWEEN: Inclusive Numeric and Date Ranges"
difficulty: Beginner
readingTime: 12
order: 35
keywords: ["between operator","range filtering","not between","inclusive range","date ranges"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Range Filtering with BETWEEN: Inclusive Numeric and Date Ranges
A frequent query pattern is filtering values that fall within a specified range: finding products priced between ₹500 and ₹2,000, filtering transactions that occurred between two dates, or identifying students scoring between 75% and 90%. In SQL, this is expressed cleanly using the **`BETWEEN`** operator.

---

## 1. Syntax of the `BETWEEN` Operator

```sql
SELECT column_1, column_2
FROM table_name
WHERE column_name BETWEEN lower_boundary AND upper_boundary;
```

### The Cardinal Rule: `BETWEEN` is Strictly Inclusive!
In standard SQL and MySQL, the `BETWEEN` operator is **always inclusive**:
```sql
WHERE price BETWEEN 100 AND 500
-- Is mathematically and logically 100% equivalent to:
WHERE price >= 100 AND price <= 500
```
Both boundary endpoints (`100` and `500`) are included in the results!

---

## 2. Using `BETWEEN` with Numbers and Dates

```sql
-- Numeric Range: Find employees with salaries between ₹40,000 and ₹80,000
SELECT employee_id, full_name, salary
FROM employees
WHERE salary BETWEEN 40000.00 AND 80000.00;

-- Date Range: Find all orders placed in Q1 2026 (Jan 1 to Mar 31)
SELECT order_id, customer_id, order_date, total_amount
FROM orders
WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31';
```

---

## 3. The `DATETIME` Trap with `BETWEEN`!

When filtering columns of type **`DATETIME`** or **`TIMESTAMP`**, using `BETWEEN` can cause subtle data omission bugs:

```sql
-- Suppose an order was placed on '2026-03-31 15:30:00'.
SELECT * FROM orders
WHERE order_timestamp BETWEEN '2026-01-01' AND '2026-03-31';
```

### Why did the order placed on March 31 vanish?
Because the literal `'2026-03-31'` is implicitly converted by MySQL to **`'2026-03-31 00:00:00'`** (midnight at the very beginning of the day)! Any order placed after midnight on March 31 is greater than the upper boundary and gets excluded!

### The Production Best Practice for Date Ranges:
Always use half-open intervals with `>=` and `<`:

```sql
SELECT * FROM orders
WHERE order_timestamp >= '2026-01-01 00:00:00'
  AND order_timestamp < '2026-04-01 00:00:00'; -- Clean, safe, and includes all of March 31!
```

---

## 4. Inverting Ranges with `NOT BETWEEN`

To retrieve rows that fall **outside** a given range:

```sql
-- Find items that are NOT in the mid-range price tier:
SELECT product_id, product_name, price
FROM products
WHERE price NOT BETWEEN 1000.00 AND 5000.00;
-- Equivalent to: WHERE price < 1000.00 OR price > 5000.00
```

---

## 5. Best Practices & Common Pitfalls

- **Lower Boundary Must Come First:** Writing `WHERE price BETWEEN 500 AND 100` will return **0 rows**! In SQL, `BETWEEN val1 AND val2` is defined as `col >= val1 AND col <= val2`. If `val1 > val2`, the condition is mathematically impossible to satisfy.
- **Alphabetical Ranges with Strings:** You can use `BETWEEN` on text strings (e.g., `WHERE last_name BETWEEN 'A' AND 'D'`), but be careful: a name like `'Dhoni'` is alphabetically greater than `'D'` and will be excluded!

---

# Multiple Choice Questions

### 1. Is the `BETWEEN` operator in SQL inclusive or exclusive of its boundary values?
A. Strictly exclusive (endpoints are omitted)
B. Strictly inclusive (both lower and upper endpoints are included)
C. Inclusive of lower boundary, exclusive of upper boundary
D. It depends on whether numbers or text are queried
**Answer:** B
**Explanation:** `BETWEEN lower AND upper` is fully inclusive, matching the condition `col >= lower AND col <= upper`.
---

### 2. What will the query `SELECT * FROM products WHERE price BETWEEN 1000 AND 500;` return?
A. All products priced between 500 and 1000
B. Exactly 0 rows
C. An error stating invalid range
D. Only products priced at 500
**Answer:** B
**Explanation:** In SQL, the lower boundary must always be specified first. Because no number can be simultaneously `>= 1000` and `<= 500`, the query yields zero results without throwing an error.
---

### 3. Why can querying a `DATETIME` column with `BETWEEN '2026-01-01' AND '2026-01-31'` fail to return records placed in the afternoon of January 31?
A. MySQL only supports 12-hour time
B. The date literal '2026-01-31' defaults to '2026-01-31 00:00:00' (midnight), excluding any timestamps later that day
C. The query optimizer disables time on the 31st
D. January only has 30 days in SQL
**Answer:** B
**Explanation:** Without an explicit time component, date strings default to `00:00:00`, cutting off any timestamps occurring after the start of that final calendar day.
---

### 4. What is `WHERE score NOT BETWEEN 50 AND 100` logically equivalent to?
A. WHERE score < 50 AND score > 100
B. WHERE score < 50 OR score > 100
C. WHERE score = 50 OR score = 100
D. WHERE score <= 50 AND score >= 100
**Answer:** B
**Explanation:** The logical inverse of falling within the closed range `[50, 100]` is being strictly below the minimum (`< 50`) or strictly above the maximum (`> 100`).
---

### 5. Can `BETWEEN` be used to filter character strings alphabetically in MySQL?
A. No, BETWEEN only works with numeric types
B. Yes, string ranges are evaluated based on the active collation's alphabetical sorting order
C. Only if strings are less than 5 characters
D. Only with ASCII encoding
**Answer:** B
**Explanation:** `BETWEEN` works on strings by comparing their collation order (e.g., `WHERE name BETWEEN 'A' AND 'M'`).
---
