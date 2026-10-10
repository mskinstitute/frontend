---
id: detecting-and-resolving-deadlocks
slug: detecting-and-resolving-deadlocks
course: sql-for-advanced
chapter: Database Locking & Deadlock Resolution
topic: "Detecting & Mitigating Database Deadlocks"
difficulty: Advanced
readingTime: 14
order: 28
keywords: ["deadlocks","deadlock detection","show engine innodb status","innodb_deadlock_detect","resolving deadlocks"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Detecting & Mitigating Database Deadlocks
In multi-user concurrent databases, a **Deadlock** is a mutual dependency condition where two or more transactions cannot proceed because each holds a lock that the other transaction requires to continue.

```
Transaction 1: Holds Lock on Row A ───> Waiting for Lock on Row B (Held by Tx 2)
                                 ▲       │
                                 │       ▼
Transaction 2: Waiting for Lock on Row A <─── Holds Lock on Row B
```

Neither transaction can proceed; without automated intervention, both transactions would wait indefinitely.

---

### How InnoDB Detects and Resolves Deadlocks

InnoDB features an internal **Deadlock Detection Algorithm** (controlled by `innodb_deadlock_detect = ON`):
1. InnoDB maintains a **Wait-For Graph** of lock requests.
2. If a cycle is detected in the graph, a deadlock exists.
3. InnoDB automatically breaks the deadlock by choosing a **Victim Transaction** (the transaction with the smallest amount of updated/inserted/deleted rows) and **rolls it back**!
4. The surviving transaction proceeds to completion, while the victim transaction receives:
   `ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction`.

---

### Diagnosing Deadlocks with SHOW ENGINE INNODB STATUS

To inspect the exact SQL queries, locks, and transactions involved in the most recent deadlock:

```sql
SHOW ENGINE INNODB STATUS;
```

Look for the **`LATEST DETECTED DEADLOCK`** section in the output:
- **Transaction 1:** Shows the client IP, active SQL statement, and the lock held and requested.
- **Transaction 2:** Shows the conflicting lock request.
- **Decision:** Shows which transaction InnoDB rolled back.

To log all deadlocks permanently into the MySQL server error log:
```sql
SET GLOBAL innodb_print_all_deadlocks = ON;
```

---

### Best Practices to Prevent and Mitigate Deadlocks

#### 1. Access Tables and Rows in a Consistent Order!
The #1 cause of deadlocks is inverted access order:
- If Service A updates Account 1, then Account 2.
- And Service B updates Account 2, then Account 1.
- Simultaneous execution guarantees a deadlock!
> **Rule:** Always sort IDs in your application before locking:
> `IDs = [target_id, source_id].sort()`
> Both transactions will lock the lower ID first, serializing access and eliminating the cycle!

#### 2. Keep Transactions Short and Focused
- Do not perform external HTTP API calls, image processing, or heavy calculations inside open transactions.
- Acquire locks as late as possible immediately before committing.

#### 3. Ensure All Queries Use Precise Indexes
- As learned in Topic 27, unindexed queries lock entire tables and gaps, dramatically magnifying the probability of deadlocks.

#### 4. Application Retry Logic
In distributed systems, deadlocks are not necessarily software bugs; they are a natural consequence of high concurrency. Production applications must always implement **Automatic Transaction Retries**:

```python
# Resilient Application Retry Pattern (Python pseudo-code)
max_retries = 3
for attempt in range(max_retries):
    try:
        db.start_transaction()
        execute_business_transfers()
        db.commit()
        break
    except DatabaseError as e:
        db.rollback()
        if e.error_code == 1213 and attempt < max_retries - 1:
            time.sleep(0.05 * (2 ** attempt)) # Exponential backoff
            continue
        raise e
```

---

# Multiple Choice Questions

### 1. What is a database deadlock?
A. A hard drive corruption event
B. A cyclical dependency where two or more transactions hold locks needed by each other and neither can proceed
C. A query running longer than 60 seconds
D. A forgotten root password
**Answer:** B
**Explanation:** A deadlock occurs when two transactions each hold locks that the other requires, creating an unresolvable cyclical wait.
---

### 2. How does InnoDB automatically resolve an identified deadlock?
A. It terminates the entire MySQL server
B. It identifies the transaction with the fewest modified rows as a victim and rolls it back
C. It pauses all transactions until midnight
D. It drops foreign key constraints
**Answer:** B
**Explanation:** InnoDB breaks the cycle by rolling back the transaction with the lowest cost (smallest volume of modified rows).
---

### 3. Which command reveals the full forensic diagnostic report of the most recent deadlock?
A. SHOW PROCESSLIST;
B. SHOW ENGINE INNODB STATUS;
C. EXPLAIN EXTENDED;
D. SHOW TABLE STATUS;
**Answer:** B
**Explanation:** SHOW ENGINE INNODB STATUS contains the dedicated "LATEST DETECTED DEADLOCK" section detailing the queries and locks involved.
---

### 4. What is the single most effective coding practice for eliminating deadlocks across concurrent services?
A. Increasing sort_buffer_size
B. Ensuring all concurrent transactions lock records and tables in the exact same deterministic order
C. Disabling autocommit globally
D. Converting tables to MyISAM
**Answer:** B
**Explanation:** If all transactions acquire locks in identical sequential order (e.g., sorted by primary key), circular wait graphs cannot form.
---

### 5. Why should production backend applications wrap transactional database operations in retry loops?
A. Because MySQL drops random connections
B. Because error 1213 (Deadlock) is an expected high-concurrency event that succeeds when immediately retried
C. To prevent server reboots
D. Because autocommit is unreliable
**Answer:** B
**Explanation:** Transient deadlocks are normal in high-throughput transactional databases; retrying the transaction with exponential backoff usually succeeds immediately.
---
