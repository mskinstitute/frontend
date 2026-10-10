---
id: table-maintenance-analyze-optimize
slug: table-maintenance-analyze-optimize
course: sql-for-advanced
chapter: Database Administration & Maintenance
topic: "Database Maintenance: CHECK, ANALYZE & OPTIMIZE TABLE"
difficulty: Advanced
readingTime: 13
order: 38
keywords: ["optimize table","analyze table","check table","table fragmentation","innodb defragmentation"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Database Maintenance: CHECK, ANALYZE & OPTIMIZE TABLE
Over time, heavy transactional activity—especially frequent `UPDATE` statements on variable-length text/JSON and frequent `DELETE` operations—leaves tables and indexes **fragmented**.

Fragmented tables waste disk storage, bloat the buffer pool with empty space, and slow down full scans. MySQL provides three essential maintenance commands: **`CHECK TABLE`**, **`ANALYZE TABLE`**, and **`OPTIMIZE TABLE`**.

---

### 1. CHECK TABLE: Integrity Verification

`CHECK TABLE` validates table integrity, verifying that index keys match row data and internal page structures are uncorrupted:

```sql
CHECK TABLE orders, order_items FAST;
CHECK TABLE customers EXTENDED;
```
If corruption is discovered, InnoDB crash recovery or restore from backup is typically required.

---

### 2. ANALYZE TABLE: Refreshing Optimizer Statistics

The MySQL Query Optimizer relies on **index cardinality statistics** (estimates of unique values in each column) to choose between index lookups and table scans.

If a table undergoes massive data shifts (e.g., after loading 5 million new rows), statistics can become stale, causing the optimizer to make poor index choices:

```sql
-- Update index distribution statistics without locking the table!
ANALYZE TABLE orders;
```
*Note:* `ANALYZE TABLE` runs near-instantaneously by sampling a subset of index pages (governed by `innodb_stats_persistent_sample_pages`).

---

### 3. OPTIMIZE TABLE: Reclaiming Space & Defragmenting

When rows are deleted in InnoDB, the disk space is **not returned to the operating system**. Instead, InnoDB marks those 16 KB page slots as "free" for future inserts.

`OPTIMIZE TABLE` rebuilds the table and indexes from scratch into a fresh contiguous `.ibd` tablespace file:

```sql
OPTIMIZE TABLE orders;
```

#### Behind the Scenes:
In InnoDB, `OPTIMIZE TABLE` maps directly to:
```sql
ALTER TABLE orders FORCE, ENGINE = InnoDB;
```
- Reclaims unused storage back to the OS file system.
- Defragments B+Tree index pages, packing leaf rows densely.
- Reconstructs index statistics.

---

### Online DDL during OPTIMIZE TABLE

In modern MySQL 8.0 with InnoDB, `OPTIMIZE TABLE` utilizes **Online DDL**:
- The table remains available for concurrent `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements throughout the rebuild!
- Modifications occurring during the rebuild are captured in an internal temporary log and merged at the end.

---

# Multiple Choice Questions

### 1. What happens to physical disk space on the host file system when you execute a large DELETE FROM table; in InnoDB?
A. Disk space is immediately returned to the operating system
B. Disk space is NOT returned to the OS; the space is held internally by InnoDB as free page slots for future inserts
C. The file size shrinks by 50%
D. The tablespace is automatically deleted
**Answer:** B
**Explanation:** InnoDB does not shrink the .ibd file on DELETE; empty space is marked for reuse within the tablespace until rebuilt.
---

### 2. Which statement defragments an InnoDB table and reclaims unused disk space back to the operating system?
A. REBUILD TABLE
B. SHRINK TABLE
C. OPTIMIZE TABLE
D. CLEAN TABLE
**Answer:** C
**Explanation:** OPTIMIZE TABLE rebuilds the table and indexes contiguously, returning unused physical storage blocks back to the OS.
---

### 3. What is the primary purpose of ANALYZE TABLE?
A. Removes duplicate rows
B. Recalculates index cardinality statistics so the query optimizer makes accurate execution plan choices
C. Verifies user passwords
D. Exports tables to Excel
**Answer:** B
**Explanation:** ANALYZE TABLE refreshes the optimizer's key distribution statistics, ensuring optimal query execution plans.
---

### 4. What underlying statement does InnoDB actually execute when you issue OPTIMIZE TABLE my_table;?
A. TRUNCATE TABLE my_table;
B. ALTER TABLE my_table FORCE, ENGINE = InnoDB;
C. DROP TABLE my_table;
D. VACUUM FULL;
**Answer:** B
**Explanation:** For InnoDB tables, OPTIMIZE TABLE is mapped internally to ALTER TABLE ... FORCE, ENGINE=InnoDB, rebuilding the table online.
---

### 5. Can users query and modify a table while OPTIMIZE TABLE is running in modern MySQL 8.0?
A. No, the entire table is locked exclusively
B. Yes, MySQL 8.0 supports Online DDL for table rebuilds, permitting concurrent reads and writes
C. Only root can query
D. Only read queries are allowed
**Answer:** B
**Explanation:** InnoDB utilizes Online DDL for table rebuilds, logging concurrent modifications and applying them with minimal lock impact.
---
