---
id: managing-partitioned-tables
slug: managing-partitioned-tables
course: sql-for-advanced
chapter: Table Partitioning & Scaling
topic: "Creating & Managing Partitioned Tables"
difficulty: Advanced
readingTime: 13
order: 35
keywords: ["manage partitions","alter table partition","drop partition","exchange partition","reorganize partition"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Creating & Managing Partitioned Tables
Creating a partitioned table is only the beginning. As time progresses, old partitions must be retired, new date brackets must be provisioned, and data must be archived.

MySQL provides specialized **`ALTER TABLE`** commands for partition maintenance that run in seconds rather than hours.

---

### 1. Instant Data Purging with DROP PARTITION

In standard unpartitioned tables, deleting 50 million old rows via `DELETE FROM logs WHERE log_date < '2023-01-01';` is disastrous:
- Generates 50 million undo log entries
- Locks table rows for hours
- Squeezes disk I/O and leaves fragmented table space

With Range Partitioning, purging an entire year's data is an **instant DDL metadata drop**:

```sql
-- Instantly drops 50 million rows and frees disk space in 0.05 seconds!
ALTER TABLE orders_range DROP PARTITION p2023;
```

---

### 2. Adding New Partitions (ADD PARTITION)

```sql
-- Adding a partition to a table without MAXVALUE
ALTER TABLE orders_range 
ADD PARTITION (PARTITION p2026 VALUES LESS THAN (2027));
```

If your table has a `MAXVALUE` partition, `ADD PARTITION` fails. You must use **`REORGANIZE PARTITION`** to split the catch-all:

```sql
-- Split p_future into p2026 and a new p_future
ALTER TABLE orders_range REORGANIZE PARTITION p_future INTO (
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

---

### 3. Fast Data Archiving with EXCHANGE PARTITION

MySQL allows you to **swap an entire partition with a standalone table** with zero data copying:

```sql
-- 1. Create empty unpartitioned archive table matching schema
CREATE TABLE orders_archive LIKE orders_range;
ALTER TABLE orders_archive REMOVE PARTITIONING;

-- 2. Instantly swap partition p2024 into the standalone table!
ALTER TABLE orders_range 
EXCHANGE PARTITION p2024 WITH TABLE orders_archive;
```
Now, `orders_archive` holds all 2024 records as an independent table ready for export to S3 or cold storage, with zero downtime!

---

### 4. Inspecting Partition Metadata

```sql
SELECT 
    partition_name,
    table_rows,
    data_length / 1024 / 1024 AS data_mb,
    index_length / 1024 / 1024 AS index_mb
FROM information_schema.partitions
WHERE table_name = 'orders_range' AND table_schema = 'my_db';
```

---

# Multiple Choice Questions

### 1. Why is ALTER TABLE ... DROP PARTITION vastly superior to DELETE FROM table WHERE date < ...?
A. It bypasses disk writes
B. It instantly removes the physical partition file from disk in milliseconds without generating undo logs or row locks
C. It requires no permissions
D. It keeps data in the recycle bin
**Answer:** B
**Explanation:** DROP PARTITION is an instantaneous DDL operation that unlinks disk files directly, avoiding massive row-by-row undo logging.
---

### 2. What command splits an existing MAXVALUE partition to accommodate a new year bracket?
A. SPLIT PARTITION
B. REORGANIZE PARTITION
C. MODIFY PARTITION
D. EXPAND PARTITION
**Answer:** B
**Explanation:** REORGANIZE PARTITION splits or merges existing partitions into new definitions without losing stored data.
---

### 3. What does ALTER TABLE ... EXCHANGE PARTITION accomplish?
A. Deletes the partition permanently
B. Swaps the physical data of a partition with an identically-structured standalone unpartitioned table via metadata pointer exchange
C. Converts range partition to hash partition
D. Re-indexes the table
**Answer:** B
**Explanation:** EXCHANGE PARTITION swaps a partition's data with an unpartitioned table near-instantaneously without data copying.
---

### 4. In which system catalog table can you inspect row counts and disk sizes per partition?
A. mysql.partitions
B. information_schema.partitions
C. performance_schema.tables
D. sys.partition_stats
**Answer:** B
**Explanation:** information_schema.partitions provides granular storage metadata including table_rows and data_length for each partition.
---

### 5. What statement completely strips partitioning from a table while retaining all data in a single unified table?
A. DROP PARTITIONING
B. ALTER TABLE my_table REMOVE PARTITIONING;
C. UNPARTITION my_table;
D. MERGE ALL PARTITIONS;
**Answer:** B
**Explanation:** ALTER TABLE ... REMOVE PARTITIONING converts a partitioned table into a standard monolithic InnoDB table.
---
