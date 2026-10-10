---
id: composite-indexes-leftmost-prefix
slug: composite-indexes-leftmost-prefix
course: sql-for-advanced
chapter: Indexing Architecture & Deep Internals
topic: "Composite Multi-Column Indexes & Leftmost Prefix Rule"
difficulty: Advanced
readingTime: 13
order: 7
keywords: ["composite index","leftmost prefix rule","compound index","multi-column index","index ordering"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Composite Multi-Column Indexes & Leftmost Prefix Rule
In production databases, queries rarely filter on a single column. Real-world applications filter by status and date, or user ID and order state. Creating multiple single-column indexes is inefficient because MySQL typically uses only **one index per table scan**.

A **Composite Index** (multi-column index) indexes multiple columns in a single B+Tree. However, to leverage it effectively, you must understand the **Leftmost Prefix Rule**.

---

### Creating a Composite Index

```sql
CREATE INDEX idx_status_date_cust 
ON orders (status, order_date, customer_id);
```

In this 3-column composite index:
- Rows are sorted first by `status`.
- Within the same `status`, rows are sorted by `order_date`.
- Within the same `status` and `order_date`, rows are sorted by `customer_id`.

---

### The Leftmost Prefix Rule

A composite index can only be utilized by the query optimizer if the query filters include the **leftmost column** of the index definition, in unbroken sequence:

| Query WHERE Clause | Can Use `idx_status_date_cust`? | Reason |
| :--- | :--- | :--- |
| `WHERE status = 'PAID'` | **YES** | Matches leftmost prefix (`status`) |
| `WHERE status = 'PAID' AND order_date = '2026-08-01'` | **YES** | Matches 2 leftmost columns in sequence |
| `WHERE status = 'PAID' AND customer_id = 42` | **PARTIAL** | Uses index for `status` only; filters `customer_id` in memory |
| `WHERE order_date = '2026-08-01'` | **NO! (Full Scan)** | Missing leftmost column (`status`)! |
| `WHERE customer_id = 42` | **NO! (Full Scan)** | Missing leftmost column (`status`)! |

> **Analogy:** Think of a phone directory sorted by `(LastName, FirstName)`. You can easily look up everyone named "Smith", or "Smith, John". But you cannot use the book to find everyone whose first name is "John" without scanning every page!

---

### Column Ordering Strategy: Equality First, Ranges Last!

When designing composite indexes, the order of columns inside the index definition is paramount:

1. **Rule 1 (High Cardinality / Equality First):** Place columns filtered by exact equality (`=`) before columns filtered by ranges (`>`, `<`, `BETWEEN`).
2. **Rule 2 (Range Truncates Prefix):** As soon as a range comparison occurs on an indexed column, MySQL **cannot use subsequent columns** in the composite index for searching!

#### Example:
```sql
-- Query:
SELECT * FROM orders 
WHERE status = 'COMPLETED' 
  AND order_date >= '2026-01-01' 
  AND customer_id = 50;

-- Optimal Index Order:
-- Put equality columns first, then the range column!
CREATE INDEX idx_optimal ON orders (status, customer_id, order_date);
```
If you had indexed `(status, order_date, customer_id)`, the range filter on `order_date` would prevent the index from narrowing down `customer_id`!

---

# Multiple Choice Questions

### 1. What does the Leftmost Prefix Rule dictate for composite indexes?
A. Indexes must only be defined on columns on the left side of the table
B. The query must filter on the first (leftmost) column of the composite index for the index to be utilized
C. Primary keys must always appear on the left
D. Strings must start with lowercase letters
**Answer:** B
**Explanation:** A composite index B+Tree is sorted hierarchically starting from the leftmost column; omitting it prevents the optimizer from navigating the tree.
---

### 2. For an index on (A, B, C), which WHERE clause CANNOT utilize the index?
A. WHERE A = 1
B. WHERE A = 1 AND B = 2
C. WHERE B = 2 AND C = 3
D. WHERE A = 1 AND B = 2 AND C = 3
**Answer:** C
**Explanation:** The clause WHERE B = 2 AND C = 3 omits column A (the leftmost column), rendering the index unusable for index range lookup.
---

### 3. If an index is defined on (status, order_date, amount), what happens when a query executes: WHERE status = 'ACTIVE' AND order_date > '2026-01-01' AND amount > 100?
A. All three columns are used fully for index lookups
B. Only status and order_date are used for index filtering; amount cannot be filtered via index lookup because of the range on order_date
C. The query throws a syntax error
D. The index is ignored completely
**Answer:** B
**Explanation:** A range condition on an index column prevents subsequent columns in the composite index from being used for B+Tree range narrowing.
---

### 4. What is the recommended best practice for column order in a composite index?
A. Range columns first, then equality columns
B. Equality columns first, followed by range filter columns
C. Sort alphabetically by column name
D. Shortest column name first
**Answer:** B
**Explanation:** Placing equality columns first allows all of them to be utilized before a range operator halts further composite index traversal.
---

### 5. Does the physical order of columns in the WHERE clause (e.g., WHERE B = 2 AND A = 1) matter for an index on (A, B)?
A. Yes, it must strictly match the index order
B. No, the MySQL query optimizer automatically re-orders commutative AND conditions to match the index
C. Yes, otherwise it causes a filesort
D. Only in subqueries
**Answer:** B
**Explanation:** The MySQL optimizer re-orders AND conditions automatically, so WHERE B = 2 AND A = 1 utilizes the index on (A, B) perfectly.
---
