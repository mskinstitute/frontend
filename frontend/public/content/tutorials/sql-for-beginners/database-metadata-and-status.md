---
id: database-metadata-and-status
slug: database-metadata-and-status
course: sql-for-beginners
chapter: Database Administration Basics (MySQL DDL)
topic: "Database Metadata & Server Status: Administrative Introspection"
difficulty: Beginner
readingTime: 12
order: 12
keywords: ["database metadata","server status","show status","show variables","uptime","max_connections"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Database Metadata & Server Status: Administrative Introspection
A senior database professional does not treat a database like a black box. You must be capable of peering inside the MySQL server engine to inspect running threads, memory allocation, server variables, query execution rates, and disk space usage. This administrative introspection is accomplished via **Server Variables**, **Status Metrics**, and the **`information_schema`**.

---

## 1. System Variables: Inspecting & Modifying Settings

MySQL's operational behavior is governed by hundreds of **System Variables**. These can be **Global** (affecting the entire server) or **Session-level** (affecting only the currently connected client).

```sql
-- View all system variables:
SHOW VARIABLES;

-- Search for specific variables using pattern matching:
SHOW VARIABLES LIKE '%max_connections%';
SHOW VARIABLES LIKE '%innodb_buffer_pool_size%';
SHOW VARIABLES LIKE '%port%';
```

### Modifying Variables Dynamically
You can modify many system variables on the fly without restarting the server:

```sql
-- Change session variable (affects only active connection):
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- Change global variable (affects all future connections):
SET GLOBAL max_connections = 500;
```

---

## 2. Server Status: Monitoring Live Health & Metrics

While *variables* represent configuration settings, **Status Counters** represent real-time operational telemetry (how many queries have run, how many connections failed, buffer pool hit rates):

```sql
-- View all live status counters:
SHOW STATUS;

-- Check how many seconds the MySQL server has been running continuously:
SHOW STATUS LIKE 'Uptime';

-- Check total number of client connections attempted:
SHOW STATUS LIKE 'Connections';

-- Check total number of SELECT queries executed since startup:
SHOW STATUS LIKE 'Com_select';

-- Check currently active open client threads:
SHOW STATUS LIKE 'Threads_connected';
```

---

## 3. Viewing Active Client Queries (`SHOW PROCESSLIST`)

When a website slows down or a lock blocks other queries, DBAs inspect active client connections using **`SHOW PROCESSLIST`**:

```sql
SHOW FULL PROCESSLIST;
```

### Sample Processlist Output:
```text
+----+------+-----------+-------------------+---------+------+-------+-----------------------+
| Id | User | Host      | db                | Command | Time | State | Info                  |
+----+------+-----------+-------------------+---------+------+-------+-----------------------+
|  8 | root | localhost | ecommerce_db      | Query   |    0 | init  | SHOW FULL PROCESSLIST |
| 14 | app  | 10.0.1.5  | ecommerce_db      | Sleep   |   45 |       | NULL                  |
| 15 | app  | 10.0.1.6  | ecommerce_db      | Query   |   12 | Locked| UPDATE inventory ...  |
+----+------+-----------+-------------------+---------+------+-------+-----------------------+
```

- **Id:** Connection thread ID.
- **Time:** Elapsed duration in seconds that the query has been running.
- **State:** What the thread is currently doing (e.g., `Sending data`, `Locked`, `Sorting result`).
- **Killing a Rogue Query:** If a runaway query is consuming 100% CPU, terminate it immediately by running: `KILL 15;`

---

## 4. Querying Metadata from `information_schema.TABLES`

To determine how much physical disk space your tables and databases are consuming:

```sql
-- Check data and index size for each database in Megabytes (MB):
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid `KILL` on Long-Running UPDATEs/DELETEs:** Killing an `UPDATE` or `DELETE` requires InnoDB to execute an **undo rollback**, which can take longer than the original query!
- **Persistent Global Settings:** Modifying a global variable with `SET GLOBAL` only lasts until the server reboots! To make changes permanent across restarts, update your server's configuration file (`my.cnf` on Linux or `my.ini` on Windows) or use `SET PERSIST variable_name = value;` in MySQL 8.0+.

---

# Multiple Choice Questions

### 1. Which SQL statement displays real-time performance and operational counters for the MySQL server?
A. SHOW METRICS;
B. SHOW STATUS;
C. DISPLAY HEALTH;
D. SELECT * FROM performance_counters;
**Answer:** B
**Explanation:** `SHOW STATUS;` provides cumulative operational counters showing server uptime, total queries executed, and connected threads.
---

### 2. How can you inspect all currently running queries and active client threads in MySQL?
A. SHOW THREADS;
B. SHOW FULL PROCESSLIST;
C. VIEW RUNNING QUERIES;
D. LIST SESSIONS;
**Answer:** B
**Explanation:** `SHOW FULL PROCESSLIST;` lists all connected clients, their originating IP addresses, state, execution durations, and currently executing SQL queries.
---

### 3. Which command terminates a runaway or frozen connection thread with ID 42 in MySQL?
A. STOP 42;
B. TERMINATE 42;
C. KILL 42;
D. DROP THREAD 42;
**Answer:** C
**Explanation:** The `KILL <thread_id>;` statement signals the server to abort the specified connection or running query.
---

### 4. What is the difference between `SHOW VARIABLES` and `SHOW STATUS` in MySQL?
A. SHOW VARIABLES shows configuration settings; SHOW STATUS shows runtime telemetry and counters
B. SHOW VARIABLES is for users; SHOW STATUS is for tables
C. They are identical commands
D. SHOW STATUS only works in SQLite
**Answer:** A
**Explanation:** System variables represent server configuration settings (e.g., port, buffer pool size), whereas status variables represent live operational metrics (e.g., uptime, queries run).
---

### 5. In MySQL 8.0+, which command modifies a global variable and persists it across server restarts without editing my.cnf manually?
A. SET PERMANENT variable_name = value;
B. SET PERSIST variable_name = value;
C. SAVE GLOBAL variable_name = value;
D. WRITE CONFIG variable_name = value;
**Answer:** B
**Explanation:** `SET PERSIST` updates the global variable in running memory and writes it to `mysqld-auto.cnf` so it persists automatically after server restarts.
---
