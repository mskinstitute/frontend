---
id: indexing-json-generated-columns
slug: indexing-json-generated-columns
course: sql-for-advanced
chapter: Advanced MySQL Features & JSON Operations
topic: "Indexing JSON via Virtual Generated Columns"
difficulty: Advanced
readingTime: 14
order: 32
keywords: ["indexing json","virtual generated columns","stored generated columns","functional indexes","json performance"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Indexing JSON via Virtual Generated Columns
Because JSON documents contain flexible, arbitrary schema structures, MySQL **cannot directly create a standard B+Tree index on an entire JSON column**.

If a query filters with `WHERE attributes->>'$.brand' = 'Alienware'`, MySQL must perform a **Full Table Scan** (`type: ALL`), inspecting and parsing the JSON of every row.

To index JSON attributes with high-performance B+Tree lookups, MySQL provides **Virtual Generated Columns** (and Multi-Valued Indexes).

---

### Step 1: Understanding Generated Columns

A **Generated Column** is a column whose value is calculated automatically from an expression:
- **`VIRTUAL` (Default):** Column values are calculated on-the-fly when read. They **consume zero disk space**.
- **`STORED`:** Column values are calculated and written to disk when rows are inserted or updated.

> **The Architectural Miracle:** Even though a `VIRTUAL` generated column consumes zero table disk space, **MySQL allows you to create a standard B+Tree index on it**! The index physically stores the extracted keys, enabling $O(log N)$ point lookups!

---

### Step 2: Creating a Virtual Generated Column & Index

```sql
-- 1. Add virtual column extracting 'brand' from JSON
ALTER TABLE product_catalogs
ADD COLUMN brand VARCHAR(50) 
GENERATED ALWAYS AS (attributes->>'$.brand') VIRTUAL;

-- 2. Add high-speed B+Tree index on the virtual column!
CREATE INDEX idx_products_brand ON product_catalogs (brand);
```

---

### Step 3: Automatic Query Optimizer Rewrite

Now, when an application queries the table using either the generated column OR the original JSON path syntax:

```sql
-- Query using virtual column:
EXPLAIN SELECT name, price FROM product_catalogs WHERE brand = 'Alienware';

-- Query using raw JSON path expression:
EXPLAIN SELECT name, price FROM product_catalogs WHERE attributes->>'$.brand' = 'Alienware';
```

#### `EXPLAIN` Result:
- `type: ref`
- `key: idx_products_brand`
- `rows: 1`

The MySQL query optimizer automatically recognizes that `attributes->>'$.brand'` matches the virtual column expression and transparently redirects execution to the B+Tree index!

---

### Multi-Valued Indexes for JSON Arrays (MySQL 8.0.17+)

If your JSON document contains an array (e.g., `tags: ["gaming", "vr", "portable"]`), how do you index individual elements?

MySQL 8.0.17+ introduces **Multi-Valued Indexes**:
```sql
-- Create an index directly over an array of strings
CREATE INDEX idx_json_tags 
ON product_catalogs ((CAST(attributes->'$.tags' AS CHAR(30) ARRAY)));

-- Query using MEMBER OF() syntax
SELECT name FROM product_catalogs 
WHERE 'gaming' MEMBER OF(attributes->'$.tags');
```
This query performs an index seek against `idx_json_tags` with zero table scans!

---

# Multiple Choice Questions

### 1. Why can't MySQL create a standard B+Tree index directly on a raw JSON column?
A. MySQL does not support B+Trees
B. JSON documents are flexible, variable-length hierarchical objects without fixed scalar definitions
C. JSON is deprecated
D. Indexes can only hold numbers
**Answer:** B
**Explanation:** B+Trees require deterministic scalar values; indexing unstructured JSON requires extracting specific scalar attributes first.
---

### 2. How much disk storage space does a VIRTUAL generated column consume in table data pages?
A. The same as a VARCHAR(255)
B. Exactly 0 bytes (it is computed dynamically on read)
C. 16 KB per row
D. 4 bytes
**Answer:** B
**Explanation:** VIRTUAL columns do not store data on disk in table rows; their values are generated dynamically when queried.
---

### 3. Can a B+Tree index be created on a VIRTUAL generated column?
A. No, only STORED columns can be indexed
B. Yes, MySQL supports creating secondary B+Tree indexes on VIRTUAL generated columns
C. Only in PostgreSQL
D. Only on primary keys
**Answer:** B
**Explanation:** MySQL allows indexing VIRTUAL columns; the index B+Tree stores the materialized values for rapid seeking while the table data remains compact.
---

### 4. What does the MySQL optimizer do when a query filters using raw JSON syntax matching a virtual indexed column?
A. It throws an ambiguous query error
B. It automatically rewrites the query to utilize the virtual column's B+Tree index
C. It forces a full table scan
D. It deletes the index
**Answer:** B
**Explanation:** The optimizer automatically maps JSON path expressions to corresponding virtual column indexes.
---

### 5. Which MySQL 8.0.17+ feature enables direct indexing of JSON array elements?
A. Full-Text Indexes
B. Multi-Valued Indexes
C. Hash Indexes
D. R-Tree Indexes
**Answer:** B
**Explanation:** Multi-Valued Indexes index JSON arrays so predicates like MEMBER OF() execute using index lookups.
---
