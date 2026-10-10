---
id: union-and-union-all
slug: union-and-union-all
course: sql-for-intermediate
chapter: Set Operations in SQL
topic: "Combining Result Sets with UNION vs UNION ALL"
difficulty: Intermediate
readingTime: 12
order: 11
keywords: ["union","union all","set operations","combining queries","deduplication","union performance"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Combining Result Sets with UNION vs UNION ALL
While **SQL JOINs** combine columns horizontally from multiple tables based on a relational key, **SQL Set Operations** combine rows **vertically** from multiple queries into a single unified result set. The most fundamental set operator in SQL is **`UNION`**.

---

## 1. The Mathematical Difference: `UNION` vs `UNION ALL`

```
   Query A Results: { Delhi, Mumbai, Pune }
   Query B Results: { Mumbai, Bangalore, Pune }

   UNION (Deduplicated Mathematical Set):
   ===> { Bangalore, Delhi, Mumbai, Pune } (Duplicates removed via sorting/hashing!)

   UNION ALL (Simple Concatenation):
   ===> { Delhi, Mumbai, Pune, Mumbai, Bangalore, Pune } (Keeps all duplicates! FAST!)
```

| Feature | `UNION` | `UNION ALL` |
| :--- | :--- | :--- |
| **Duplicate Rows** | **Removed** (Performs automatic deduplication). | **Retained** (Keeps all duplicate occurrences). |
| **Performance** | **Slower** (Requires sorting or temporary hash table).| **Significantly Faster** (Simple row streaming). |
| **Memory Consumption** | Higher (Buffers all rows in RAM for deduplication).| Minimal (Streams rows directly to the client). |
| **Primary Use Case** | When unique distinct records are strictly required. | When datasets are known to be disjoint or duplicates are valid. |

---

## 2. Syntax & Structural Rules of UNION

```sql
SELECT column_1, column_2, ... FROM table_A
UNION [ALL]
SELECT column_1, column_2, ... FROM table_B;
```

### The 3 Golden Rules of Set Operations:
1. **Identical Column Count:** Both `SELECT` queries **must** have the exact same number of columns!
2. **Compatible Data Types:** Columns in corresponding positions must have compatible data types (e.g., string to string, date to date).
3. **Column Headers Determined by First Query:** The column aliases and titles displayed in the final output grid are taken **exclusively from the first `SELECT` query**!

---

## 3. Practical Production Examples

### Example 1: Unified Customer & Supplier Directory
Suppose your company has a `retail_customers` table and a `wholesale_suppliers` table:

```sql
-- Combine all contacts into a single unified mailing list:
SELECT 
    company_name AS contact_name,
    contact_email AS email,
    'Supplier' AS entity_type
FROM wholesale_suppliers

UNION ALL

SELECT 
    full_name AS contact_name,
    email,
    'Customer' AS entity_type
FROM retail_customers
ORDER BY contact_name ASC;
```

> [!NOTE]
> When applying an **`ORDER BY`** clause to a `UNION` query, place a single `ORDER BY` at the **very end** of the entire statement. It sorts the final unified result set!

---

## 4. Emulating Archival Data Aggregations

In enterprise databases, historical data is often partitioned into active and archive tables:

```sql
-- Calculate total sales across active and archived orders:
SELECT order_id, total_amount, 'Active' AS source FROM orders_2026
UNION ALL
SELECT order_id, total_amount, 'Archive' AS source FROM orders_2025
UNION ALL
SELECT order_id, total_amount, 'Archive' AS source FROM orders_2024;
```

---

## 5. Best Practices & Common Pitfalls

- **Default to UNION ALL Unless Deduplication is Explicitly Required:** 90% of junior developers write `UNION` by default when they actually mean `UNION ALL`. On large datasets (millions of rows), running `UNION` forces MySQL to create a giant temporary disk table to execute an expensive deduplication pass!
- **Data Type Alignment:** If Query 1 has `INT, VARCHAR` and Query 2 has `VARCHAR, INT`, MySQL will attempt implicit type conversion, which can cause subtle truncation errors or slow down execution. Always align column types manually.

---

# Multiple Choice Questions

### 1. What is the fundamental difference between `UNION` and `UNION ALL` in SQL?
A. UNION combines columns; UNION ALL combines tables
B. UNION automatically removes duplicate rows; UNION ALL preserves all rows including duplicates
C. UNION ALL is only supported in SQLite
D. UNION is 10x faster than UNION ALL
**Answer:** B
**Explanation:** `UNION` performs a deduplication pass to eliminate duplicate rows, whereas `UNION ALL` simply concatenates the two result sets without deduplication.
---

### 2. Which query operator should be preferred for maximum query performance when combining two datasets that are known to have zero overlapping rows?
A. UNION
B. UNION ALL
C. CROSS JOIN
D. INTERSECT
**Answer:** B
**Explanation:** `UNION ALL` bypasses the memory-intensive temporary table sorting and deduplication step, delivering significantly faster execution.
---

### 3. Which of the following is a mandatory structural rule when combining queries using `UNION`?
A. Both queries must select from the exact same table
B. Both queries must have the exact same number of columns in corresponding positions with compatible data types
C. Both queries must have a WHERE clause
D. Both queries must use the same primary key
**Answer:** B
**Explanation:** Set operations mandate that all participating `SELECT` statements project an identical number of columns with compatible data types in the same order.
---

### 4. Which `SELECT` query determines the column header labels in the final result set of a `UNION` operation?
A. The last SELECT query
B. The first SELECT query
C. The largest table
D. MySQL generates random headers
**Answer:** B
**Explanation:** In SQL set operations, column aliases and titles declared in the very first `SELECT` statement define the column names for the unified output.
---

### 5. Where must the `ORDER BY` clause be placed when sorting the combined output of a `UNION` query?
A. Inside each SELECT query before the UNION keyword
B. At the very end of the entire statement after the final SELECT query
C. Immediately after the UNION keyword
D. ORDER BY is not permitted with UNION
**Answer:** B
**Explanation:** A single `ORDER BY` clause placed at the conclusion of the statement sorts the complete unified result set produced by the union.
---
