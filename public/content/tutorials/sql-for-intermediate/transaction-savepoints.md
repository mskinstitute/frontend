---
id: transaction-savepoints
slug: transaction-savepoints
course: sql-for-intermediate
chapter: Transactions & Concurrency Control
topic: "Using SAVEPOINT & ROLLBACK TO SAVEPOINT"
difficulty: Intermediate
readingTime: 12
order: 41
keywords: ["savepoint","rollback to savepoint","release savepoint","nested transactions","partial rollback"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Using SAVEPOINT & ROLLBACK TO SAVEPOINT
In standard transactional workflows, a `ROLLBACK` cancels the *entire* transaction from the very beginning. However, in complex multi-step enterprise business processes, you may want to rollback **only a specific sub-operation** while retaining earlier successful steps.

MySQL achieves this partial rollback capability through **Savepoints**.

---

### What is a Savepoint?

A **Savepoint** is a named marker set inside an active transaction. It acts as a checkpoint to which the transaction can be partially rewound without discarding earlier work.

MySQL does not support true nested transactions; if you issue a second `START TRANSACTION`, MySQL implicitly commits the first one. Savepoints provide the exact nested rollback behavior developers need without starting a new transaction.

---

### Savepoint Syntax

```sql
-- Set a named savepoint
SAVEPOINT savepoint_name;

-- Rollback partial work to the marker (transaction remains open!)
ROLLBACK TO [SAVEPOINT] savepoint_name;

-- Delete a savepoint (does NOT rollback or commit)
RELEASE SAVEPOINT savepoint_name;
```

---

### Practical Walkthrough: Hotel & Flight Booking Package

Suppose a travel platform processes a vacation package booking:
1. Book Hotel Room (Mandatory)
2. Attempt to Book Flight (Optional addon)
3. If flight booking fails, rollback the flight attempt, but **keep** the hotel reservation and commit!

```sql
START TRANSACTION;

-- Step 1: Reserve Hotel Room
INSERT INTO hotel_bookings (customer_id, hotel_id, room_number, price)
VALUES (101, 88, 'Suite-4B', 450.00);

-- Establish a checkpoint!
SAVEPOINT after_hotel_booking;

-- Step 2: Attempt flight reservation
INSERT INTO flight_bookings (customer_id, flight_id, seat_number, price)
VALUES (101, 999, '12A', 320.00);

-- Suppose flight seat 12A fails due to an overbooking conflict!
-- Rewind to checkpoint:
ROLLBACK TO SAVEPOINT after_hotel_booking;

-- Step 3: Transaction is still alive!
-- Update notes on customer account
INSERT INTO booking_logs (customer_id, note)
VALUES (101, 'Hotel reserved successfully. Flight unavailable.');

-- Final step: Commit hotel and log, with flight cleanly excluded!
COMMIT;
```

---

### Key Operational Rules for Savepoints

1. **Transaction Remains Active:** Executing `ROLLBACK TO SAVEPOINT name;` does **NOT** end or commit the transaction. Locks remain held and subsequent SQL statements can still be executed before the final `COMMIT`.
2. **Cascading Removal of Downstream Savepoints:** If you set Savepoint A, then Savepoint B, and then execute `ROLLBACK TO SAVEPOINT A`, Savepoint B is destroyed.
3. **`RELEASE SAVEPOINT` vs `ROLLBACK TO`:**
   - `ROLLBACK TO SAVEPOINT sp1` rolls back changes made after `sp1`.
   - `RELEASE SAVEPOINT sp1` merely frees the savepoint marker from memory without modifying any data.
4. **Final Closure:** You must still issue an eventual `COMMIT` or full `ROLLBACK` to terminate the overall transaction.

---

# Multiple Choice Questions

### 1. What does the SAVEPOINT statement create?
A. A permanent disk backup of the database
B. A named checkpoint marker within an active transaction
C. An auto-increment sequence
D. A clustered index on the active table
**Answer:** B
**Explanation:** A SAVEPOINT establishes a named intermediate marker within an ongoing transaction, enabling partial rollbacks.
---

### 2. Does executing ROLLBACK TO SAVEPOINT my_pt; end or close the transaction?
A. Yes, it commits immediately
B. Yes, it terminates the transaction completely
C. No, the transaction remains open and active
D. It depends on the operating system
**Answer:** C
**Explanation:** Rolling back to a savepoint only reverts changes made after that marker; the transaction remains open until an explicit COMMIT or ROLLBACK is issued.
---

### 3. What does RELEASE SAVEPOINT sp_name do?
A. Rolls back changes to that point
B. Commits changes up to that point
C. Removes the named savepoint marker without reverting or committing data
D. Restarts MySQL server
**Answer:** C
**Explanation:** RELEASE SAVEPOINT removes the specified savepoint from the transaction's active list, freeing internal memory resources.
---

### 4. What happens if you issue START TRANSACTION while already inside an uncommitted transaction in MySQL?
A. An error is raised and the server halts
B. MySQL creates a nested child transaction
C. MySQL implicitly commits the first transaction before starting the new one
D. All changes are automatically rolled back
**Answer:** C
**Explanation:** MySQL does not support true nested transactions; issuing START TRANSACTION triggers an implicit commit of any existing active transaction.
---

### 5. If savepoints SP1, SP2, and SP3 are created sequentially, what happens to SP2 and SP3 after executing ROLLBACK TO SAVEPOINT SP1;?
A. They remain valid and callable
B. They are automatically deleted/discarded
C. They are merged into SP1
D. They are written to the audit log
**Answer:** B
**Explanation:** Rolling back to an earlier savepoint automatically destroys all subsequent savepoints created after that marker.
---
