---
id: transaction-control-commit-rollback
slug: transaction-control-commit-rollback
course: sql-for-intermediate
chapter: Transactions & Concurrency Control
topic: "Transaction Control: START TRANSACTION, COMMIT, ROLLBACK"
difficulty: Intermediate
readingTime: 13
order: 40
keywords: ["start transaction","commit","rollback","autocommit","transaction control language","tcl"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Transaction Control: START TRANSACTION, COMMIT, ROLLBACK
By default, MySQL operates in **autocommit mode**. In autocommit mode, every individual SQL statement (`INSERT`, `UPDATE`, `DELETE`) is treated as an independent transaction that is committed immediately upon execution.

To bundle multiple SQL statements into a single atomic unit, you must use **Transaction Control Language (TCL)** commands: **`START TRANSACTION`**, **`COMMIT`**, and **`ROLLBACK`**.

---

### Understanding the AUTOCOMMIT Variable

In MySQL, the `autocommit` session variable dictates transaction boundaries:

```sql
-- Check current autocommit status (1 = ON, 0 = OFF)
SELECT @@autocommit;

-- Disable autocommit for current session
SET autocommit = 0;

-- Re-enable autocommit
SET autocommit = 1;
```

When `autocommit = 1` (default), issuing `START TRANSACTION` temporarily disables autocommit until you explicitly issue `COMMIT` or `ROLLBACK`.

---

### Transaction Lifecycle Syntax

```sql
START TRANSACTION;
-- OR: BEGIN;

-- Statement 1: Debit funds
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;

-- Statement 2: Credit funds
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- If both succeed, make changes permanent:
COMMIT;

-- If an error occurs, undo all statements:
-- ROLLBACK;
```

---

### Practical Walkthrough: Safe E-Commerce Checkout

Consider a checkout workflow that must deduct product stock and record the purchase order atomically:

```sql
-- 1. Begin atomic transaction
START TRANSACTION;

-- 2. Deduct inventory
UPDATE inventory 
SET stock_count = stock_count - 2 
WHERE product_id = 501 AND stock_count >= 2;

-- 3. Create the order header
INSERT INTO orders (customer_id, order_status, total_amount)
VALUES (42, 'PAID', 199.98);

-- 4. Retrieve auto-generated order ID
SET @new_order_id = LAST_INSERT_ID();

-- 5. Insert order item details
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (@new_order_id, 501, 2, 99.99);

-- 6. Commit all three updates together!
COMMIT;
```

If any step fails (e.g., out-of-stock check fails or invalid customer ID), executing `ROLLBACK;` cleanly resets the inventory and prevents partial orders from being recorded.

---

### Implicit Commits: DDL Statements You Must Avoid Inside Transactions!

A critical architectural pitfall in MySQL is that **Data Definition Language (DDL)** statements trigger an **implicit commit**!

If you issue any of the following statements inside an open transaction, MySQL **automatically commits** all preceding statements immediately:
- `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`
- `CREATE INDEX`, `DROP INDEX`
- `TRUNCATE TABLE`
- `CREATE DATABASE`, `DROP DATABASE`
- `LOCK TABLES`, `UNLOCK TABLES`

> **Rule:** Never execute DDL statements inside an active transaction expecting to be able to roll them back!

---

# Multiple Choice Questions

### 1. What does the COMMIT statement do?
A. Temporarily saves rows in the buffer cache
B. Permanently applies all modifications made during the transaction to disk
C. Clears table data and resets auto-increment keys
D. Closes the MySQL server connection
**Answer:** B
**Explanation:** COMMIT makes all updates made within the current transaction permanent and visible to all other database sessions.
---

### 2. What happens to uncommitted changes if ROLLBACK is executed?
A. They are saved into a temporary archive table
B. All modifications made since START TRANSACTION are canceled and reverted
C. The changes are scheduled for execution tomorrow
D. Only the last INSERT is reversed
**Answer:** B
**Explanation:** ROLLBACK cancels all modifications executed within the active transaction, restoring the database to the state prior to START TRANSACTION.
---

### 3. In MySQL's default state, what is the value of @@autocommit?
A. 0 (OFF)
B. 1 (ON)
C. -1 (DISABLED)
D. NULL
**Answer:** B
**Explanation:** By default, MySQL sets autocommit = 1, meaning every single individual statement is automatically committed unless an explicit START TRANSACTION is initiated.
---

### 4. Which of the following statements triggers an implicit COMMIT in MySQL, preventing subsequent rollbacks?
A. SELECT * FROM customers;
B. ALTER TABLE orders ADD COLUMN notes TEXT;
C. UPDATE products SET price = 10;
D. INSERT INTO log_table VALUES ('test');
**Answer:** B
**Explanation:** DDL commands (such as ALTER TABLE, CREATE TABLE, TRUNCATE) trigger an immediate implicit commit in MySQL.
---

### 5. What is the synonym for START TRANSACTION in MySQL?
A. INITIATE
B. BEGIN
C. OPEN
D. RUN
**Answer:** B
**Explanation:** The command BEGIN (or BEGIN WORK) is fully supported as an alias for START TRANSACTION in MySQL.
---
