---
id: transaction-isolation-levels
slug: transaction-isolation-levels
course: sql-for-intermediate
chapter: Transactions & Concurrency Control
topic: "Transaction Isolation Levels in MySQL"
difficulty: Intermediate
readingTime: 14
order: 42
keywords: ["isolation levels","dirty read","non-repeatable read","phantom read","repeatable read","serializable"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Transaction Isolation Levels in MySQL
When thousands of concurrent transactions interact with the same database tables simultaneously, anomalies can occur. The SQL standard defines **four Transaction Isolation Levels** that balance **data consistency** against **concurrency performance**.

Understanding these levels and the concurrency phenomena they prevent is essential for database architects.

---

### The Three Classic Concurrency Read Anomalies

1. **Dirty Read:** Transaction A modifies a row but has not committed yet. Transaction B reads this uncommitted row. If Transaction A rolls back, Transaction B acted on data that never officially existed!
2. **Non-Repeatable Read (Fuzzy Read):** Transaction A reads a row. Transaction B then updates or deletes that row and commits. Transaction A re-reads the same row and discovers different values.
3. **Phantom Read:** Transaction A queries a range of rows (e.g., `WHERE salary > 50000`). Transaction B inserts a new row matching that condition and commits. Transaction A re-runs the range query and discovers a new "phantom" row that wasn't there before.

---

### The Four SQL Standard Isolation Levels

| Isolation Level | Dirty Reads? | Non-Repeatable Reads? | Phantom Reads? | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **READ UNCOMMITTED** | Permitted | Permitted | Permitted | Maximum |
| **READ COMMITTED** | **Prevented** | Permitted | Permitted | High |
| **REPEATABLE READ** (MySQL Default) | **Prevented** | **Prevented** | **Prevented*** | Moderate |
| **SERIALIZABLE** | **Prevented** | **Prevented** | **Prevented** | Slowest |

**Note:* In MySQL InnoDB, `REPEATABLE READ` also prevents phantom reads in consistent non-locking reads via **MVCC (Multi-Version Concurrency Control)** and Next-Key Locking!

---

### Deep Dive into MySQL Defaults: REPEATABLE READ

In MySQL, **`REPEATABLE READ` is the default isolation level**.

Under `REPEATABLE READ`:
- When Transaction A issues its first `SELECT`, InnoDB creates a **Read View** (a snapshot of the database at that exact moment in time).
- Even if Transaction B modifies or inserts 10,000 rows and commits them, Transaction A continues seeing the exact snapshot established on its first query.
- Consistency is guaranteed throughout Transaction A's entire lifecycle without locking read rows!

---

### Inspecting and Setting Isolation Levels

```sql
-- Check current global and session isolation levels in MySQL 8.0
SELECT @@GLOBAL.transaction_isolation, @@SESSION.transaction_isolation;

-- Set isolation level for the next transaction in current session
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Set isolation level for all future transactions in current session
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Set global isolation level for all future client connections
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

---

### When to Change Isolation Levels?

- **Use READ COMMITTED:** Common in high-throughput OLTP web applications (e.g., social feeds or analytics trackers) where non-repeatable reads are harmless and reducing lock contention is paramount. Many frameworks (like Ruby on Rails or Django with PostgreSQL) default to Read Committed.
- **Use REPEATABLE READ:** Best for financial ledgers, billing calculations, and e-commerce inventory management where snapshot consistency across multiple queries is essential.
- **Use SERIALIZABLE:** Used in ultra-strict compliance operations. It forces all plain `SELECT` queries to execute as `SELECT ... FOR SHARE`, heavily locking rows and serializing transactions sequentially at the cost of high deadlock probability.

---

# Multiple Choice Questions

### 1. What is the default transaction isolation level in MySQL InnoDB?
A. READ UNCOMMITTED
B. READ COMMITTED
C. REPEATABLE READ
D. SERIALIZABLE
**Answer:** C
**Explanation:** MySQL InnoDB defaults to REPEATABLE READ, providing consistent snapshot isolation via MVCC.
---

### 2. What is a "Dirty Read"?
A. Reading corrupted data from bad disk blocks
B. A transaction reading uncommitted data modified by another in-progress transaction
C. Querying a table without an index
D. Reading data past the end-of-file marker
**Answer:** B
**Explanation:** A dirty read occurs when a transaction reads uncommitted changes from another transaction that might later be rolled back.
---

### 3. Which isolation level completely eliminates all read anomalies by converting standard SELECTs into locking reads?
A. READ UNCOMMITTED
B. READ COMMITTED
C. REPEATABLE READ
D. SERIALIZABLE
**Answer:** D
**Explanation:** SERIALIZABLE is the strictest isolation level; it serializes all concurrent operations, preventing dirty reads, non-repeatable reads, and phantom reads.
---

### 4. Which anomaly occurs when re-executing a range query returns newly inserted rows committed by another transaction?
A. Phantom Read
B. Dirty Read
C. Stale Index
D. Buffer Overflow
**Answer:** A
**Explanation:** A phantom read occurs when a query returns a set of rows matching a condition, and a concurrent transaction inserts new matching rows that appear in subsequent queries.
---

### 5. Which SQL command configures the isolation level for the current session?
A. SET ISOLATION TO READ COMMITTED;
B. SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
C. ALTER DATABASE SET ISOLATION = 2;
D. CONFIGURE ENGINE ISOLATION 'READ COMMITTED';
**Answer:** B
**Explanation:** In MySQL 8.0, the command SET SESSION TRANSACTION ISOLATION LEVEL <LEVEL>; sets the isolation policy for all subsequent transactions in the current connection.
---
