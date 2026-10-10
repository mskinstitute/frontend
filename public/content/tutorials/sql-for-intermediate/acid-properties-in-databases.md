---
id: acid-properties-in-databases
slug: acid-properties-in-databases
course: sql-for-intermediate
chapter: Transactions & Concurrency Control
topic: "ACID Properties in Relational Databases"
difficulty: Intermediate
readingTime: 12
order: 39
keywords: ["acid properties","atomicity","consistency","isolation","durability","innodb transactions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# ACID Properties in Relational Databases
In relational database management systems, a **Transaction** is a logical unit of work that contains one or more SQL statements executed as a single, indivisible operation. The cornerstone of transactional reliability is the acronym **ACID**: **Atomicity**, **Consistency**, **Isolation**, and **Durability**.

Understanding ACID properties is vital for building resilient backend applications, preventing financial inaccuracies, and avoiding race conditions in concurrent multi-user environments.

---

### The Four Pillars of ACID

#### 1. Atomicity ("All or Nothing")
Every statement in a transaction must execute successfully to be saved. If any single statement fails or errors out mid-way, the entire transaction is rolled back, leaving the database in its original state as if nothing ever happened.

*Example:* In a bank transfer of $500 from Account A to Account B:
1. Debit $500 from Account A
2. Credit $500 to Account B
If step 2 crashes the server, step 1 is rolled back so money does not simply vanish into thin air.

#### 2. Consistency ("Valid State to Valid State")
A transaction can only transition the database from one valid state to another valid state. All schema constraints, primary keys, foreign keys, unique rules, check constraints, and cascade triggers must be satisfied at commit time.

#### 3. Isolation ("Invisible Intermediate States")
Concurrent transactions executed simultaneously by thousands of users must not interfere with or corrupt each other. The intermediate state of an in-progress transaction is hidden from other concurrent transactions until committed.

#### 4. Durability ("Permanent Once Committed")
Once a transaction is successfully committed, its changes are guaranteed to persist permanently—even if an immediate power outage, OS crash, or hardware failure occurs seconds later. In MySQL InnoDB, this is achieved through the **Write-Ahead Logging (WAL)** mechanism known as the **Redo Log** (`ib_logfile`).

---

### How MySQL InnoDB Implements ACID

| ACID Property | InnoDB Mechanism |
| :--- | :--- |
| **Atomicity** | **Undo Logs** (Rollback segments track inverse operations) |
| **Consistency** | Doublewrite Buffer, constraints enforcement, crash recovery |
| **Isolation** | Row-level locking and **MVCC** (Multi-Version Concurrency Control) |
| **Durability** | **Redo Log** (WAL - flushed to disk on commit via `innodb_flush_log_at_trx_commit`) |

---

### InnoDB vs MyISAM Regarding ACID

A crucial reason MySQL adopted **InnoDB** as its default storage engine (replacing MyISAM in MySQL 5.5) is ACID compliance:
- **MyISAM:** Lacks transactions. Updates execute immediately; if a statement crashes halfway through an `UPDATE` of 1000 rows, 500 rows remain updated and 500 un-updated with zero rollback capability.
- **InnoDB:** Fully ACID compliant with transactional crash recovery and row-level locking.

---

# Multiple Choice Questions

### 1. What does the "A" in ACID stand for?
A. Asynchronous
B. Atomicity
C. Authorization
D. Allocation
**Answer:** B
**Explanation:** Atomicity guarantees that all operations within a transaction succeed together or fail together as an indivisible unit.
---

### 2. Which InnoDB mechanism enables rolling back changes when an atomic transaction fails?
A. Redo Logs
B. Undo Logs
C. Query Cache
D. Slow Query Log
**Answer:** B
**Explanation:** Undo logs store the previous images of modified rows, allowing InnoDB to revert uncommitted modifications during a rollback.
---

### 3. What does the Durability property guarantee in a relational database?
A. Queries execute in less than 1 millisecond
B. Committed transactions will never be lost, surviving hardware crashes and power failures
C. User passwords cannot be decrypted
D. Duplicate rows are forbidden across all tables
**Answer:** B
**Explanation:** Durability guarantees that once a transaction commits, its state is permanently written to non-volatile storage and will survive system failures.
---

### 4. Which storage engine in MySQL provides full ACID compliance with transactional support?
A. MyISAM
B. MEMORY
C. InnoDB
D. CSV
**Answer:** C
**Explanation:** InnoDB is MySQL's default, fully ACID-compliant storage engine featuring MVCC, row-level locks, and write-ahead logging.
---

### 5. If two transactions execute simultaneously without observing each other's partial in-flight updates, which ACID property is at work?
A. Consistency
B. Isolation
C. Durability
D. Atomicity
**Answer:** B
**Explanation:** Isolation ensures that concurrent transactions operate independently without seeing each other's intermediate, uncommitted states.
---
