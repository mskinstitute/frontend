---
id: optimistic-vs-pessimistic-locking
slug: optimistic-vs-pessimistic-locking
course: sql-for-advanced
chapter: Database Locking & Deadlock Resolution
topic: "Optimistic vs Pessimistic Concurrency Architecture"
difficulty: Advanced
readingTime: 14
order: 29
keywords: ["optimistic locking","pessimistic locking","version column","concurrency control","lost update problem"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Optimistic vs Pessimistic Concurrency Architecture
When designing high-throughput web applications, software architects must decide how to handle concurrent modifications to the same record. The two primary paradigms are **Pessimistic Locking** and **Optimistic Locking**.

Choosing between them directly dictates database scalability, latency, and throughput.

---

### 1. Pessimistic Locking: "Assume Conflicts Will Happen"

Pessimistic locking relies on the database's physical locking engine (`SELECT ... FOR UPDATE`).
- When a user reads a record to edit it, the row is **exclusively locked immediately**.
- Any other user attempting to read or update that row is forced to wait until the first user completes their transaction.

```sql
-- Pessimistic Lock Workflow:
START TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 5 FOR UPDATE;
-- (Row is locked on the database server!)
UPDATE accounts SET balance = balance - 100 WHERE account_id = 5;
COMMIT; -- (Lock is released!)
```

#### Pros & Cons:
- **Pros:** Guaranteed consistency. Zero chance of conflicts or lost updates.
- **Cons:** Poor scalability. Locks held during slow network requests or user interactions starve the database connection pool and cause deadlocks.

---

### 2. Optimistic Locking: "Assume Conflicts Are Rare"

Optimistic locking does **NOT use database row locks** during reads!
- The application reads the record freely along with a **`version`** integer (or timestamp).
- When writing changes back, the application verifies that the `version` has not changed:

```sql
-- Schema requires a version integer:
-- CREATE TABLE documents (id INT PK, title VARCHAR(100), version INT DEFAULT 1);

-- Step 1: Read without locking!
SELECT id, title, version FROM documents WHERE id = 101;
-- Returns: {id: 101, title: 'Draft', version: 4}

-- Step 2: Update conditionally checking the version!
UPDATE documents 
SET title = 'Revised Draft', version = version + 1 
WHERE id = 101 AND version = 4;
```

#### Evaluating the Result:
- If `Rows Affected == 1`: The update succeeded! No one else modified the row in the meantime.
- If `Rows Affected == 0`: Another user updated the row first! The current update is aborted, and the application notifies the user of a conflict or automatically re-fetches and retries.

---

### Architectural Comparison

| Dimension | Pessimistic Locking | Optimistic Locking |
| :--- | :--- | :--- |
| **Locking Mechanism** | DB Row Locks (`FOR UPDATE`) | Application-level Version column |
| **Database Contention** | High (Transactions hold locks) | Zero lock contention during read/think time |
| **Deadlock Probability**| High | **Zero** |
| **Scalability** | Lower (Constrained by lock timeouts) | **Massive (High concurrency)** |
| **Best Used When** | High conflict probability (e.g., booking the last seat, banking debit) | Low conflict probability (e.g., editing CMS articles, user profiles, inventory edits) |

---

# Multiple Choice Questions

### 1. What mechanism does Optimistic Locking rely on to detect concurrent modification conflicts?
A. Exclusive table locks
B. A version number or timestamp column checked during the UPDATE WHERE clause
C. The MySQL slow query log
D. Operating system file locks
**Answer:** B
**Explanation:** Optimistic locking checks if the row's version matches the value read initially; if a conflict occurred, zero rows are affected.
---

### 2. What does Rows Affected: 0 indicate during an Optimistic Locking update?
A. The database was dropped
B. Another transaction modified the row and incremented its version first, causing the current update condition to fail
C. The query ran in read-only mode
D. The index was invalid
**Answer:** B
**Explanation:** If another transaction already committed an update, the version column in the database will have incremented, causing WHERE version = original_version to match zero rows.
---

### 3. Which scenario is best suited for Pessimistic Locking?
A. An article blog post edited once a month
B. A flash-sale ticketing platform selling the final 5 VIP concert tickets with heavy concurrent buyer competition
C. Updating user email addresses in a customer portal
D. Logging page view impressions
**Answer:** B
**Explanation:** High-contention scenarios where conflicts are guaranteed require pessimistic locking (FOR UPDATE) to prevent race conditions.
---

### 4. Why does Optimistic Locking provide superior scalability in distributed web applications?
A. It converts MySQL into a NoSQL engine
B. It holds zero database row locks during read or user think time, freeing connection pools
C. It bypasses the InnoDB redo log
D. It caches all tables in memory
**Answer:** B
**Explanation:** By avoiding long-lived database locks while users view or edit data, optimistic locking eliminates lock contention and maximizes throughput.
---

### 5. What statement implements Pessimistic Locking in SQL?
A. SELECT ... FOR SHARE
B. SELECT ... FOR UPDATE
C. SELECT ... WITH VERSION
D. UPDATE ... OPTIMISTIC
**Answer:** B
**Explanation:** SELECT ... FOR UPDATE is the standard SQL statement for acquiring exclusive pessimistic row locks.
---
