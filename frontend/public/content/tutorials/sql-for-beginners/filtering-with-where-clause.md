---
id: filtering-with-where-clause
slug: filtering-with-where-clause
course: sql-for-beginners
chapter: Data Querying Basics (DQL)
topic: "Filtering Rows with WHERE: Predicates and Boolean Logic"
difficulty: Beginner
readingTime: 12
order: 32
keywords: ["where clause","filtering rows","predicates","sql conditions","boolean evaluation"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Filtering Rows with WHERE: Predicates and Boolean Logic
Without filtering, every query would dump an entire table containing millions of rows over the network. The **`WHERE`** clause specifies search conditions (predicates) that filter rows before they are returned to the client. Only rows for which the `WHERE` predicate evaluates to **`TRUE`** are included in the result set.

---

## 1. Syntax of the `WHERE` Clause

The `WHERE` clause appears immediately after the `FROM` clause:

```sql
SELECT column_1, column_2
FROM table_name
WHERE search_condition;
```

```sql
-- Retrieve all active employees in the Engineering department:
SELECT employee_id, full_name, salary
FROM employees
WHERE department = 'Engineering';
```

---

## 2. How the Database Executes `WHERE`

Understanding the logical execution order of a SQL query explains why query writing behaves the way it does:

```
   Logical Order of Operations:
   1. FROM       <-- Identify and load source table
   2. WHERE      <-- Filter rows based on condition (DISCARDS FALSE/UNKNOWN ROWS)
   3. SELECT     <-- Project specific requested columns & compute expressions
   4. ORDER BY   <-- Sort the remaining rows
   5. LIMIT      <-- Restrict row count
```

Because the **`WHERE`** clause executes in **Step 2**, it filters out unwanted rows *before* expressions are calculated or memory is allocated for sorting in Step 4.

---

## 3. Filtering on Text, Numbers, and Dates

```sql
-- Numeric Filtering: Find products costing more than ₹5,000
SELECT product_name, price 
FROM products 
WHERE price > 5000.00;

-- String Filtering: Find customer by exact email
-- (Case-insensitive by default under utf8mb4_0900_ai_ci collation)
SELECT * 
FROM customers 
WHERE email = 'aarav@example.com';

-- Date Filtering: Find orders placed on or after Jan 1, 2026
SELECT order_id, order_date, total_amount 
FROM orders 
WHERE order_date >= '2026-01-01';
```

---

## 4. SQL Three-Valued Logic in WHERE Clauses

SQL does not use simple binary logic (True / False); it uses **Three-Valued Logic**:
1. **`TRUE`**: The condition is met. Row is **included**.
2. **`FALSE`**: The condition is not met. Row is **discarded**.
3. **`UNKNOWN`**: The condition involves a `NULL`. Row is **discarded**!

```sql
-- If an employee has salary = NULL:
SELECT * FROM employees WHERE salary > 50000;
-- The expression (NULL > 50000) evaluates to UNKNOWN!
-- The row is NOT included in the result set.
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid Functions on Indexed Columns in WHERE:** Wrapping an indexed column inside a function prevents MySQL from using the index (**Non-Sargable Query**):
  ```sql
  -- SLOW (Full Table Scan): The index on order_date cannot be used!
  SELECT * FROM orders WHERE YEAR(order_date) = 2026;
  
  -- FAST (Index Range Scan): The index is fully utilized!
  SELECT * FROM orders WHERE order_date >= '2026-01-01' AND order_date <= '2026-12-31';
  ```
- **String Quoting:** Always enclose string and date literals in single quotes (`'Engineering'`, `'2026-01-01'`). Numbers do not use quotes (`5000`).

---

# Multiple Choice Questions

### 1. In the logical execution order of a SQL query, when is the `WHERE` clause evaluated?
A. After ORDER BY
B. Before the SELECT clause and immediately after the FROM clause
C. At the very end of execution
D. Concurrently with the LIMIT clause
**Answer:** B
**Explanation:** The `WHERE` clause evaluates immediately after `FROM`, filtering candidate rows before `SELECT` projects columns or `ORDER BY` sorts results.
---

### 2. How does the `WHERE` clause treat a row when its condition evaluates to `UNKNOWN` due to a `NULL` value?
A. The row is included in the output
B. The row is discarded from the result set
C. The query aborts with an error
D. The NULL is replaced with 0
**Answer:** B
**Explanation:** In SQL three-valued logic, a row is only returned if the predicate evaluates strictly to `TRUE`; rows evaluating to `FALSE` or `UNKNOWN` are discarded.
---

### 3. Why is `WHERE YEAR(created_at) = 2026` slower on a large indexed table than `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`?
A. MySQL does not have a YEAR function
B. Wrapping an indexed column in a function prevents index utilization, forcing an expensive full table scan
C. String dates are faster than integers
D. AND clauses are faster than equal signs
**Answer:** B
**Explanation:** Applying functions to indexed columns makes predicates non-sargable, preventing the query engine from performing efficient B-Tree index range scans.
---

### 4. Which character is the standard SQL literal delimiter for string and date values in a `WHERE` clause?
A. Double quotes ("...")
B. Single quotes ('...')
C. Backticks (`...`)
D. Curly braces ({...})
**Answer:** B
**Explanation:** Standard SQL and MySQL use single quotes (`'value'`) to enclose character string and date literals.
---

### 5. What will the query `SELECT * FROM products WHERE stock_quantity = 0;` return?
A. All products with stock greater than zero
B. Only products whose stock_quantity is exactly equal to 0
C. All products regardless of stock
D. Nothing, because 0 cannot be queried
**Answer:** B
**Explanation:** The equality operator (`=`) filters rows where the column's value matches the specified literal (0).
---
