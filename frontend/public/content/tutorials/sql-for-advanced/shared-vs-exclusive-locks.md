---
id: shared-vs-exclusive-locks
slug: shared-vs-exclusive-locks
course: sql-for-advanced
chapter: Database Locking & Deadlock Resolution
topic: "Shared Locks (FOR SHARE) vs Exclusive Locks (FOR UPDATE)"
difficulty: Advanced
readingTime: 14
order: 26
keywords: ["shared locks","exclusive locks","for share","for update","locking reads","pessimistic locking"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Shared Locks (FOR SHARE) vs Exclusive Locks (FOR UPDATE)
By default, MySQL InnoDB executes **consistent non-locking reads** using **Multi-Version Concurrency Control (MVCC)**. A plain `SELECT` never locks rows and never waits for locks.

However, in concurrent transactional workflows (such as inventory deduction, payment capture, or seat reservations), relying on un-locked reads causes **Race Conditions**. To coordinate concurrent writes, you must use **Locking Reads**: **Shared Locks (`FOR SHARE`)** and **Exclusive Locks (`FOR UPDATE`)**.

---

### The Lock Compatibility Matrix

InnoDB provides two fundamental locking primitives at the row level:

1. **Shared Lock (S Lock - `FOR SHARE`):**
   - Permits other transactions to **read** the locked row.
   - **Blocks** other transactions from modifying or acquiring exclusive locks on the row.
   - Multiple transactions can hold Shared locks on the same row concurrently.

2. **Exclusive Lock (X Lock - `FOR UPDATE`):**
   - Acquired automatically by `UPDATE` and `DELETE` statements.
   - Acquired manually via `SELECT ... FOR UPDATE`.
   - **Blocks ALL other transactions** from acquiring either Shared or Exclusive locks on the row!
   - Only **one** transaction can hold an Exclusive lock on a row at any time.

| Requested Lock  Existing Lock | Shared Lock (S) | Exclusive Lock (X) |
| :--- | :--- | :--- |
| **Shared Lock (S)** | **Compatible (Granted)** | **Conflict (Blocked / Waits)** |
| **Exclusive Lock (X)** | **Conflict (Blocked / Waits)** | **Conflict (Blocked / Waits)** |

---

### Practical Walkthrough: Preventing Ticket Overbooking with FOR UPDATE

Suppose two customers attempt to book the last available concert seat simultaneously:

```sql
-- Transaction 1 (Customer A):
START TRANSACTION;

-- Select AND lock the specific seat row exclusively!
SELECT seat_id, is_booked, price 
FROM concert_seats 
WHERE seat_id = 42 
FOR UPDATE;

-- Transaction 1 checks: is_booked is 0 (Available!)
-- At the exact same microsecond, Transaction 2 (Customer B) runs:
-- SELECT ... WHERE seat_id = 42 FOR UPDATE;
-- RESULT: Transaction 2 is FORCED TO WAIT until Transaction 1 finishes!

-- Transaction 1 books the seat:
UPDATE concert_seats SET is_booked = 1, booked_by = 'Customer A' WHERE seat_id = 42;

-- Transaction 1 commits and releases the exclusive lock:
COMMIT;

-- NOW Transaction 2 wakes up, reads the seat, sees is_booked = 1, and aborts booking!
```

---

### Non-Blocking Variations in MySQL 8.0: NOWAIT & SKIP LOCKED

Prior to MySQL 8.0, if a row was locked, a concurrent `FOR UPDATE` query blocked until `innodb_lock_wait_timeout` (default 50 seconds) expired.

MySQL 8.0 introduces high-throughput concurrency clauses:

#### 1. `NOWAIT`: Fail Fast Without Waiting
```sql
SELECT * FROM concert_seats WHERE seat_id = 42 FOR UPDATE NOWAIT;
```
If locked, MySQL throws `ERROR 3572 (HY000): Statement aborted because lock(s) could not be acquired immediately and NOWAIT is set`.

#### 2. `SKIP LOCKED`: High-Throughput Job Queues
```sql
-- Fetch and lock 5 pending emails that are not already being processed by other worker nodes!
SELECT * FROM email_queue 
WHERE status = 'PENDING' 
LIMIT 5 
FOR UPDATE SKIP LOCKED;
```
Any rows currently locked by background worker 1 are skipped, allowing worker 2 to process remaining rows instantly with **zero lock contention**!

---

# Multiple Choice Questions

### 1. What type of lock is acquired when executing SELECT ... FOR UPDATE?
A. Shared Lock (S)
B. Exclusive Lock (X)
C. Table-level read lock
D. Metadata schema lock
**Answer:** B
**Explanation:** SELECT ... FOR UPDATE acquires an Exclusive (X) row lock, blocking all other transactions from acquiring S or X locks on the selected records.
---

### 2. Can multiple concurrent transactions hold a Shared Lock (FOR SHARE) on the exact same row simultaneously?
A. No, only one transaction can lock a row
B. Yes, Shared locks are compatible with other Shared locks
C. Only if autocommit is off
D. Only on primary key columns
**Answer:** B
**Explanation:** Shared locks are compatible; multiple readers can hold shared locks simultaneously, but writers requesting exclusive locks are blocked.
---

### 3. What does the MySQL 8.0 NOWAIT clause do when appended to FOR UPDATE?
A. Automatically commits the query immediately
B. Causes the query to fail immediately with an error if requested rows are already locked, rather than waiting
C. Bypasses foreign key checks
D. Converts the lock to a table lock
**Answer:** B
**Explanation:** NOWAIT instructs MySQL not to wait in the lock queue; if any target row is locked, it fails instantly.
---

### 4. How does SKIP LOCKED revolutionize distributed background task worker queues?
A. It deletes completed tasks automatically
B. It bypasses rows currently locked by other concurrent worker nodes, preventing workers from blocking each other
C. It allows workers to run without database connections
D. It accelerates network transmission
**Answer:** B
**Explanation:** SKIP LOCKED skips locked candidate rows, enabling multiple queue workers to claim distinct available rows simultaneously without blocking.
---

### 5. What system variable configures how long an InnoDB transaction will wait for a row lock before timing out?
A. lock_timeout_ms
B. innodb_lock_wait_timeout
C. max_execution_time
D. wait_timeout
**Answer:** B
**Explanation:** innodb_lock_wait_timeout (default: 50 seconds) defines the threshold an InnoDB transaction waits on a lock before returning a timeout error.
---
