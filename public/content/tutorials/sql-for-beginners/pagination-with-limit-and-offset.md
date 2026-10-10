---
id: pagination-with-limit-and-offset
slug: pagination-with-limit-and-offset
course: sql-for-beginners
chapter: Sorting, Limiting & Pagination
topic: "Pagination with LIMIT & OFFSET: Building Scalable Page Feeds"
difficulty: Beginner
readingTime: 12
order: 42
keywords: ["pagination","limit offset","page numbering","offset performance","keyset pagination","cursor pagination"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Pagination with LIMIT & OFFSET: Building Scalable Page Feeds
Every modern web application, from e-commerce product catalogs to social media feeds and banking transaction histories, divides large datasets into bite-sized pages (e.g., 20 items per page). In SQL, basic page-based navigation is implemented using **`LIMIT`** paired with **`OFFSET`**.

---

## 1. Syntax of `LIMIT` with `OFFSET`

```sql
-- Explicit OFFSET keyword syntax (Recommended for clarity):
SELECT column_list
FROM table_name
ORDER BY sort_column
LIMIT page_size OFFSET offset_count;

-- Shorthand comma syntax (Supported by MySQL):
-- Note: LIMIT offset, count (OFFSET COMES FIRST HERE!)
SELECT column_list
FROM table_name
ORDER BY sort_column
LIMIT offset_count, page_size;
```

---

## 2. The Universal Pagination Formula

To calculate the `OFFSET` for any given **Page Number** (`P`) and **Page Size** (`S`):

```
   OFFSET = (Page_Number - 1) * Page_Size
```

### Practical Pagination Walkthrough (Page Size = 10 items):
```sql
-- Page 1: Items 1 to 10 (OFFSET = (1 - 1) * 10 = 0)
SELECT product_id, product_name, price 
FROM products 
ORDER BY product_id ASC 
LIMIT 10 OFFSET 0;

-- Page 2: Items 11 to 20 (OFFSET = (2 - 1) * 10 = 10)
SELECT product_id, product_name, price 
FROM products 
ORDER BY product_id ASC 
LIMIT 10 OFFSET 10;

-- Page 3: Items 21 to 30 (OFFSET = (3 - 1) * 10 = 20)
SELECT product_id, product_name, price 
FROM products 
ORDER BY product_id ASC 
LIMIT 10 OFFSET 20;
```

---

## 3. The Deep Offset Trap: Why High Offsets Crash Performance

While `LIMIT 10 OFFSET 0` executes in **0.001 seconds**, what happens when a user or web scraper requests Page 100,000?

```sql
-- Requesting Page 100,001:
SELECT * FROM orders ORDER BY order_id ASC LIMIT 10 OFFSET 1000000;
```

### How MySQL Actually Executes `OFFSET 1,000,000`:
1. MySQL does **not** jump directly to row 1,000,000.
2. It must read all **1,000,010 rows** from disk or index cache!
3. It **discards the first 1,000,000 rows** in memory!
4. It returns only the final 10 rows!
- **Result:** Massive disk I/O, heavy CPU overhead, and query latency exceeding 10+ seconds!

---

## 4. The Senior Solution: Keyset (Cursor-Based) Pagination

For high-volume production tables (infinite scrolling feeds, mobile APIs), DBAs replace `OFFSET` with **Keyset (Cursor-Based) Pagination**:

```sql
-- Instead of OFFSET, filter using the ID of the last item seen on the previous page:
-- Page 1:
SELECT order_id, total_amount FROM orders ORDER BY order_id ASC LIMIT 10;
-- (Suppose the last order_id on Page 1 was 1050)

-- Page 2 (Instantaneous O(1) Index Lookup!):
SELECT order_id, total_amount 
FROM orders 
WHERE order_id > 1050 
ORDER BY order_id ASC 
LIMIT 10;
```

### Why Keyset Pagination is 10,000x Faster:
Because `WHERE order_id > 1050` uses a direct B-Tree index seek, the database never reads or discards previous rows. Page 1,000,000 loads as quickly as Page 1!

---

## 5. Best Practices & Common Pitfalls

- **Deterministic Tie-Breaker:** When paginating by non-unique columns (like `created_at` or `price`), always include a unique tie-breaker (like the Primary Key):
  ```sql
  ORDER BY created_at DESC, order_id DESC
  ```
  Without a tie-breaker, rows sharing identical timestamps can swap places between page loads, causing items to appear twice or disappear!

---

# Multiple Choice Questions

### 1. What is the correct formula to calculate the `OFFSET` value for a given `page_number` (1-indexed) and `page_size`?
A. OFFSET = page_number * page_size
B. OFFSET = (page_number - 1) * page_size
C. OFFSET = page_number + page_size
D. OFFSET = page_size / page_number
**Answer:** B
**Explanation:** For Page 1, offset is (1-1)*size = 0; for Page 2, offset is (2-1)*size = size.
---

### 2. What is the difference between `LIMIT 20 OFFSET 40` and the shorthand `LIMIT 40, 20` in MySQL?
A. LIMIT 40, 20 sorts in descending order
B. They are completely identical in execution (in the shorthand comma syntax, offset comes first)
C. LIMIT 40, 20 only works in SQLite
D. Shorthand syntax deletes rows
**Answer:** B
**Explanation:** In MySQL's comma shorthand syntax `LIMIT offset, count`, `LIMIT 40, 20` means skip 40 rows and return 20, identical to `LIMIT 20 OFFSET 40`.
---

### 3. Why does standard `LIMIT 20 OFFSET 5000000` cause severe performance degradation on large tables?
A. MySQL shuts down when numbers exceed 1 million
B. The database must read and sort all 5,000,020 rows, discarding the first 5,000,000 in memory
C. Offsets require table locks
D. Indexes are disabled when OFFSET is used
**Answer:** B
**Explanation:** High offsets force the database engine to retrieve all preceding rows up to the offset count before discarding them, causing massive disk I/O.
---

### 4. What high-performance pagination technique uses `WHERE id > last_seen_id` instead of `OFFSET`?
A. Keyset / Cursor-Based Pagination
B. Offset Scanning
C. Randomized Paging
D. Static Table Partitioning
**Answer:** A
**Explanation:** Keyset (cursor-based) pagination uses indexed primary keys to seek directly to the next page in O(1) time without scanning preceding rows.
---

### 5. Why must a unique column like `id` be added to the `ORDER BY` clause when paginating by a non-unique column like `order_date`?
A. To make the query shorter
B. To guarantee deterministic pagination and prevent records with identical dates from shifting across page boundaries
C. Because MySQL requires at least two columns in ORDER BY
D. To convert dates to timestamps
**Answer:** B
**Explanation:** Including a unique primary key tie-breaker ensures deterministic sorting, preventing identical rows from appearing on multiple pages.
---
