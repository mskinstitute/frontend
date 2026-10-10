---
id: slow-query-log-and-server-configuration
slug: slow-query-log-and-server-configuration
course: sql-for-advanced
chapter: Database Administration & Maintenance
topic: "Configuring my.cnf, Server Variables & Slow Query Log"
difficulty: Advanced
readingTime: 14
order: 39
keywords: ["my.cnf","server configuration","mysql tuning","max_connections","innodb buffer pool tuning"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Configuring my.cnf, Server Variables & Slow Query Log
Default MySQL configurations are intentionally conservative to allow the server to boot on low-resource virtual machines. Deploying production databases with default settings leaves hardware capabilities heavily under-utilized.

Database administrators configure production parameters via the configuration file (**`my.cnf`** on Linux / **`my.ini`** on Windows) and dynamic server variables.

---

### Configuration File Locations

- **Linux / Unix:** `/etc/mysql/my.cnf`, `/etc/my.cnf`
- **Windows:** `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`

Settings placed under the **`[mysqld]`** section apply directly to the MySQL server daemon.

---

### Enterprise Production my.cnf Template

```ini
[mysqld]
# --- Network & Connections ---
port                            = 3306
bind-address                    = 0.0.0.0
max_connections                 = 500
max_connect_errors              = 10000
wait_timeout                    = 600
interactive_timeout             = 600

# --- Character Sets ---
character-set-server            = utf8mb4
collation-server                = utf8mb4_0900_ai_ci

# --- InnoDB Memory & Buffer Pool ---
# (Allocate 70-80% of total RAM on a dedicated DB server)
innodb_buffer_pool_size         = 12G
innodb_buffer_pool_instances     = 8
innodb_log_buffer_size          = 64M

# --- InnoDB Disk I/O & Redo Log ---
innodb_log_file_size            = 2G
innodb_flush_log_at_trx_commit  = 1
innodb_flush_method             = O_DIRECT
innodb_io_capacity              = 2000
innodb_io_capacity_max          = 4000

# --- Slow Query Logging ---
slow_query_log                  = 1
slow_query_log_file             = /var/log/mysql/mysql-slow.log
long_query_time                 = 1.0
log_queries_not_using_indexes   = 1
```

---

### Dynamic vs Static Variables: SET PERSIST (MySQL 8.0)

In older MySQL versions:
- Running `SET GLOBAL variable = value;` modified memory, but changes were lost upon server restart unless manually copied into `my.cnf`.

MySQL 8.0 introduces **`SET PERSIST`**:
```sql
-- Modifies running memory AND writes changes permanently to /var/lib/mysql/mysqld-auto.cnf!
SET PERSIST max_connections = 600;

-- Persist variable without modifying currently running server:
SET PERSIST_ONLY innodb_buffer_pool_size = 16G;
```

---

### Critical Metric Inspection Queries

```sql
-- Inspect buffer pool read efficiency (Should be > 99%!)
SELECT 
    ROUND((1 - (innodb_buffer_pool_reads / innodb_buffer_pool_read_requests)) * 100, 2) AS buffer_pool_hit_rate
FROM 
    (SELECT VARIABLE_VALUE AS innodb_buffer_pool_reads FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads') r,
    (SELECT VARIABLE_VALUE AS innodb_buffer_pool_read_requests FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests') rr;
```

---

# Multiple Choice Questions

### 1. In which section of my.cnf should server configuration parameters be placed?
A. [client]
B. [mysqld]
C. [mysql]
D. [database]
**Answer:** B
**Explanation:** The [mysqld] section defines operational parameters for the MySQL server daemon process.
---

### 2. What is the major innovation of MySQL 8.0's SET PERSIST statement?
A. It prevents passwords from expiring
B. It updates runtime memory and permanently writes the setting to mysqld-auto.cnf so it survives restarts
C. It encrypts the buffer pool
D. It restarts the server immediately
**Answer:** B
**Explanation:** SET PERSIST applies the dynamic variable in memory and records it to disk in mysqld-auto.cnf for automated restoration upon reboot.
---

### 3. What does innodb_flush_method = O_DIRECT accomplish on Linux hosts?
A. Disables the redo log
B. Bypasses the operating system filesystem page cache for InnoDB data files, preventing double-buffering in RAM
C. Compresses database tables
D. Accelerates network connections
**Answer:** B
**Explanation:** O_DIRECT instructs InnoDB to bypass OS filesystem buffering, preventing RAM from being wasted caching data twice.
---

### 4. What does a Buffer Pool Hit Rate of 99.5% indicate?
A. 99.5% of queries failed
B. 99.5% of read page requests were served directly from high-speed RAM rather than reading from disk
C. The buffer pool is 99.5% full of corrupt pages
D. 99.5% of rows are indexed
**Answer:** B
**Explanation:** A high hit rate signifies that almost all requested pages are resident in memory, minimizing physical disk reads.
---

### 5. What is the danger of setting max_connections to an excessively high number (e.g., 50,000) on a low-RAM server?
A. It decreases network bandwidth
B. Each connection allocates per-thread memory buffers; excessive connections can trigger an Out-Of-Memory (OOM) OS kernel kill
C. It corrupts primary keys
D. It disables logging
**Answer:** B
**Explanation:** Each client thread consumes private memory (sort, join, read buffers); unconstrained connections can quickly cause the server to run out of RAM.
---
