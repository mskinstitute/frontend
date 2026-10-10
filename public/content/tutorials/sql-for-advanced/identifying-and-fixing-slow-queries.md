---
id: identifying-and-fixing-slow-queries
slug: identifying-and-fixing-slow-queries
course: sql-for-advanced
chapter: Query Optimization & Performance Tuning
topic: "Identifying & Fixing Slow Queries & Filesort"
difficulty: Advanced
readingTime: 14
order: 12
keywords: ["slow queries","slow query log","mysqldumpslow","fixing filesort","sort_buffer_size"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Identifying & Fixing Slow Queries & Filesort
In a production database servicing millions of requests, even a few unoptimized queries can monopolize CPU, saturate disk I/O, and cause cascading lock contention.

A systematic query tuning lifecycle consists of three phases:
1. **Detection:** Capturing slow queries using the **Slow Query Log**.
2. **Analysis:** Diagnosing the root cause using `EXPLAIN` and status counters.
3. **Remediation:** Eliminating full table scans, filesorts, and temporary tables.

---

### Step 1: Enabling and Configuring the Slow Query Log

```sql
-- Enable the slow query log dynamically
SET GLOBAL slow_query_log = 'ON';

-- Set execution time threshold in seconds (e.g., 1.0 second or 0.5s for 500ms)
SET GLOBAL long_query_time = 0.5;

-- Log queries that do not use any indexes regardless of duration
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- Check log file destination
SHOW VARIABLES LIKE 'slow_query_log_file';
```

---

### Step 2: Summarizing Slow Queries with mysqldumpslow

Production slow logs grow into gigabytes. Use the **`mysqldumpslow`** command-line utility to aggregate and sort query patterns by execution frequency and duration:

```bash
# Top 10 slowest queries sorted by average execution time
mysqldumpslow -s at -t 10 /var/lib/mysql/mysql-slow.log

# Top 10 queries sorted by total count of occurrences
mysqldumpslow -s c -t 10 /var/lib/mysql/mysql-slow.log
```

---

### Step 3: Eliminating "Using filesort"

When a query contains `ORDER BY`, MySQL attempts to retrieve rows already sorted from an index. If no suitable index exists, it falls back to **filesort** in memory (governed by `sort_buffer_size`).

#### How to Fix Filesort:
Align the composite index columns with both the `WHERE` filter and the `ORDER BY` clause!

```sql
-- Problem Query (Shows "Using filesort"):
SELECT id, customer_id, order_date, total_amount 
FROM orders 
WHERE customer_id = 101 
ORDER BY order_date DESC;

-- Solution: Create composite index covering filter AND sort order!
CREATE INDEX idx_cust_orderdate ON orders (customer_id, order_date DESC);
```
With this index, MySQL navigates directly to `customer_id = 101` and reads rows in pre-sorted `order_date` order. Filesort is completely eliminated!

---

### Step 4: Eliminating "Using temporary" on GROUP BY

```sql
-- Problem: Grouping and sorting on different non-indexed columns causes temporary tables
SELECT country, COUNT(*) 
FROM users 
GROUP BY country;

-- Solution: Add index on group column
CREATE INDEX idx_user_country ON users (country);
```

---

# Multiple Choice Questions

### 1. Which MySQL system variable sets the execution time threshold for logging slow queries?
A. slow_query_timeout
B. long_query_time
C. max_execution_time
D. query_cache_limit
**Answer:** B
**Explanation:** long_query_time defines the threshold in seconds (e.g., 1.0 or 0.5) beyond which queries are recorded into the slow log.
---

### 2. Which CLI tool aggregates and summarizes MySQL slow query log files by frequency and average duration?
A. mysqlcheck
B. mysqldumpslow
C. mysqladmin
D. innodb_dump
**Answer:** B
**Explanation:** mysqldumpslow parses and groups similar slow log statements, sorting them by average execution time or frequency.
---

### 3. How do you eliminate "Using filesort" for a query filtering WHERE status = 'A' ORDER BY created_at DESC?
A. Increase innodb_buffer_pool_size
B. Create a composite index on (status, created_at)
C. Delete older rows
D. Convert the table to MyISAM
**Answer:** B
**Explanation:** A composite index on (status, created_at) allows MySQL to filter by status and traverse pre-sorted index leaves directly, eliminating filesort.
---

### 4. What does setting log_queries_not_using_indexes = 'ON' accomplish?
A. Rejects all queries that lack indexes
B. Records any query that performs a full table scan to the slow query log regardless of execution time
C. Automatically creates missing indexes
D. Raises a fatal exception
**Answer:** B
**Explanation:** This setting logs queries that do not utilize indexes even if they complete faster than long_query_time.
---

### 5. What buffer in MySQL is utilized to perform in-memory sorting when an index cannot satisfy ORDER BY?
A. join_buffer_size
B. sort_buffer_size
C. key_buffer_size
D. read_rnd_buffer_size
**Answer:** B
**Explanation:** sort_buffer_size configures the memory buffer allocated per session for executing filesort operations.
---
