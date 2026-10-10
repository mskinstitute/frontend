---
id: limiting-results-limit
slug: limiting-results-limit
course: sql-for-beginners
chapter: Sorting, Limiting & Pagination
topic: "Restricting Rows with LIMIT: Top-N Analysis and Performance"
difficulty: Beginner
readingTime: 12
order: 41
keywords: ["limit clause","top n queries","restricting rows","query optimization","fetch first"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Restricting Rows with LIMIT: Top-N Analysis and Performance
A database table might store 50 million customer records. However, a dashboard or mobile app only needs to display the **Top 5 Best-Selling Products**, the **Latest 10 Blog Posts**, or a preview of the **First 100 Transactions**. The **`LIMIT`** clause restricts the maximum number of rows returned by a query, saving network bandwidth, server memory, and client rendering time.

---

## 1. Syntax of the `LIMIT` Clause

The `LIMIT` clause is placed at the very end of a `SELECT` statement:

```sql
SELECT column_list
FROM table_name
[WHERE condition]
[ORDER BY sort_column]
LIMIT count;
```

### Example: Top 5 Highest-Paid Employees
```sql
SELECT employee_id, full_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;
```

---

## 2. Why LIMIT Must Almost Always Pair with ORDER BY

> [!CRITICAL]
> **Without `ORDER BY`, `LIMIT` is non-deterministic!**

If you run:
```sql
SELECT * FROM products LIMIT 5;
```
Which 5 products will you get? You will get whichever 5 records the database storage engine happened to read first from disk or index cache. If a background thread reorganizes table pages, a second execution could return 5 completely different rows!

**Always pair `LIMIT` with an explicit `ORDER BY` to ensure reproducible results.**

---

## 3. Query Execution Optimization with `LIMIT`

How does the MySQL query execution engine handle `LIMIT`?
1. **With an Index:** If sorting by an indexed column with `LIMIT 5`, MySQL traverses the B-Tree index, fetches the first 5 pointers, and **stops scanning immediately** (Early Termination). It does **not** read the remaining 10 million rows!
2. **Without an Index (Filesort Optimization):** Even without an index, MySQL optimizes `ORDER BY col LIMIT N` using a **bounded priority queue**. Instead of sorting all 10 million rows in memory, it maintains a small in-memory heap of size `N`, discarding non-qualifying rows on the fly!

---

## 4. Top-N Reporting Examples

```sql
-- Top 3 Most Recent Orders:
SELECT order_id, customer_id, order_date, total_amount
FROM orders
ORDER BY order_date DESC, order_id DESC
LIMIT 3;

-- Lowest Stock Item (Immediate Reorder Alert):
SELECT product_id, product_name, stock_quantity
FROM products
WHERE is_discontinued = FALSE
ORDER BY stock_quantity ASC
LIMIT 1;
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid Testing with Large Queries:** When writing complex multi-table joins or debugging queries in MySQL Workbench or CLI, always append `LIMIT 10` until your logic is verified. This prevents accidental multi-minute table scans.
- **ANSI SQL Standard Alternative (`FETCH FIRST`):** In modern SQL standards and PostgreSQL/Oracle, the equivalent of `LIMIT 5` is written as `FETCH FIRST 5 ROWS ONLY`. MySQL supports the cleaner, widely adopted `LIMIT` syntax.

---

# Multiple Choice Questions

### 1. Where in a SQL query must the `LIMIT` clause be positioned?
A. Immediately after SELECT
B. Inside the WHERE clause
C. At the very end of the statement (after ORDER BY)
D. Before the FROM clause
**Answer:** C
**Explanation:** In MySQL syntax, the `LIMIT` clause appears at the very end of the `SELECT` statement following any `ORDER BY` clause.
---

### 2. What is the risk of using `LIMIT 5` without specifying an `ORDER BY` clause?
A. MySQL throws a syntax error
B. The returned 5 rows are non-deterministic and can vary between executions
C. The query locks the entire table
D. The first 5 rows are deleted
**Answer:** B
**Explanation:** Without an `ORDER BY` clause, relational tables have no guaranteed order; `LIMIT` will return an arbitrary set of records depending on physical disk arrangement.
---

### 3. Which query correctly retrieves the single most expensive product in the catalog?
A. SELECT * FROM products ORDER BY price ASC LIMIT 1;
B. SELECT * FROM products ORDER BY price DESC LIMIT 1;
C. SELECT TOP 1 * FROM products;
D. SELECT MAX(price) FROM products LIMIT 1;
**Answer:** B
**Explanation:** `ORDER BY price DESC LIMIT 1` sorts products from highest price to lowest and restricts the result set to the first record.
---

### 4. How does the MySQL query engine optimize `ORDER BY indexed_column LIMIT 10`?
A. It scans the entire table and discards all but 10 rows
B. It reads only the first 10 entries from the B-Tree index and terminates execution immediately
C. It compresses the remaining rows
D. It generates a temporary table on disk
**Answer:** B
**Explanation:** When sorting by an index, MySQL performs early termination after retrieving the requested count of index entries, avoiding reading the rest of the table.
---

### 5. In standard ANSI SQL, what clause is functionally equivalent to MySQL's `LIMIT n`?
A. TOP n
B. FETCH FIRST n ROWS ONLY
C. MAXROWS n
D. TAKE n
**Answer:** B
**Explanation:** The SQL:2008 standard introduced `FETCH FIRST n ROWS ONLY` as the vendor-neutral syntax for row limitation.
---
