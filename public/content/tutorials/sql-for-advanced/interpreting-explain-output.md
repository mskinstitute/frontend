---
id: interpreting-explain-output
slug: interpreting-explain-output
course: sql-for-advanced
chapter: Query Optimization & Performance Tuning
topic: "Interpreting EXPLAIN Output (type, key, rows, Extra)"
difficulty: Advanced
readingTime: 14
order: 11
keywords: ["explain output","join type","type column","all scan","filesort","using temporary"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Interpreting EXPLAIN Output (type, key, rows, Extra)
Reading traditional tabular `EXPLAIN` output is an essential skill for database engineers. The output table contains 12 columns, but four columns tell 90% of the optimization story: **`type`**, **`key`**, **`rows`**, and **`Extra`**.

---

### 1. The `type` Column: The Access Method (Best to Worst)

The `type` column describes how MySQL joins or scans table rows. Your primary objective in query optimization is moving from red/slow access types toward green/fast access types:

| `type` Value | Rating | Meaning |
| :--- | :--- | :--- |
| **`system` / `const`**| **Best** | Table has 1 row, or matched on Primary Key / Unique index equality. |
| **`eq_ref`** | **Best Join**| One row read from this table for each combination from preceding table (PK/Unique join). |
| **`ref`** | **Great** | Non-unique index lookup (multiple rows match the key). |
| **`range`** | **Good** | Index range scan using `BETWEEN`, `>`, `<`, `IN()`. |
| **`index`** | **Slow** | Full Index Scan (scans entire B+Tree from start to finish). |
| **`ALL`** | **Worst** | **Full Table Scan!** Reads every data block on disk. Critical bottleneck! |

---

### 2. The `key` and `possible_keys` Columns

- **`possible_keys`:** The list of indexes MySQL could potentially choose to resolve the query.
- **`key`:** The **actual index** chosen by the cost-based optimizer.
- If `key` is `NULL`, MySQL found no usable index and performed a Full Table Scan (`type: ALL`).

---

### 3. The `rows` and `filtered` Columns

- **`rows`:** The estimated number of rows MySQL expects to inspect.
- **`filtered`:** The estimated percentage of inspected rows that will satisfy remaining table conditions (100% is ideal; 5% indicates 95% of inspected rows are discarded!).

$$	ext{Rows Passed to Next Stage} = 	ext{rows} 	imes rac{	ext{filtered}}{100}$$

---

### 4. The `Extra` Column: Flags of Honor & Red Flags

The `Extra` column contains critical optimization flags:

#### Positive Flags (Optimized):
- **`Using index`:** Covering index! Data retrieved entirely from index B+Tree without touching table rows.
- **`Using index condition`:** Index Condition Pushdown is active.

#### Negative Flags (Performance Killers!):
- **`Using filesort`:** MySQL cannot use index ordering and must perform an extra sorting pass in memory/disk.
- **`Using temporary`:** MySQL must create an internal temporary table on disk or memory to hold intermediate results (frequent with messy `GROUP BY` and `DISTINCT`).
- **`Using where`:** Rows are filtered after being read from storage, rather than using an index range directly.

---

# Multiple Choice Questions

### 1. Which value in EXPLAIN's type column indicates the worst possible access method (a Full Table Scan)?
A. ref
B. ALL
C. range
D. const
**Answer:** B
**Explanation:** A type of ALL indicates a Full Table Scan where MySQL must inspect every single block of the physical table on disk.
---

### 2. In join operations, what is the most optimal access type when joining on a Primary Key or unique non-null column?
A. eq_ref
B. index_merge
C. ALL
D. range
**Answer:** A
**Explanation:** eq_ref is the most efficient join type, occurring when one row is retrieved per parent row using a unique or primary key.
---

### 3. What does Using filesort in the Extra column mean?
A. MySQL successfully read the table from a flat file
B. MySQL could not use an index to satisfy the ORDER BY and had to perform an explicit sorting pass
C. The query results were saved to disk
D. The index was corrupted
**Answer:** B
**Explanation:** Using filesort indicates that sorting could not be satisfied by an index, forcing MySQL to execute a sort pass.
---

### 4. What does it mean if possible_keys lists two indexes, but key is NULL?
A. MySQL crashed
B. The query optimizer decided that a full table scan was cheaper than using either index
C. The table has zero rows
D. The user lacks SELECT permissions
**Answer:** B
**Explanation:** If the optimizer calculates that reading through the secondary index and performing bookmark lookups costs more than scanning the table directly, it chooses a table scan (key: NULL).
---

### 5. What does Using temporary in the Extra column signal?
A. The table is a TEMPORARY table
B. MySQL created an intermediate internal temporary table to process operations like GROUP BY or DISTINCT
C. The database is in maintenance mode
D. The buffer pool is full
**Answer:** B
**Explanation:** Using temporary indicates that MySQL had to allocate an internal temporary table to resolve grouping or sorting, which can hurt performance at scale.
---
