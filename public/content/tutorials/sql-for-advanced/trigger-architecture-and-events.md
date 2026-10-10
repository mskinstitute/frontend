---
id: trigger-architecture-and-events
slug: trigger-architecture-and-events
course: sql-for-advanced
chapter: Database Triggers
topic: "Trigger Fundamentals & Event Hooks"
difficulty: Advanced
readingTime: 14
order: 22
keywords: ["triggers","create trigger","event hooks","before insert","after update","trigger timing"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Trigger Fundamentals & Event Hooks
A **Database Trigger** is a named database object associated with a specific table that activates automatically when a designated **Data Manipulation Language (DML)** event occurs on that table.

Triggers provide event-driven automation at the storage layer, ensuring data integrity, enforcing complex business constraints, and recording audit logs regardless of which application or microservice initiates the change.

---

### The Anatomy of a Trigger

Every trigger definition requires three architectural specifications:
1. **The Target Table:** The table to which the trigger is bound.
2. **The Event:** The DML operation that trips the trigger (`INSERT`, `UPDATE`, or `DELETE`).
3. **The Timing:** Whether the trigger fires **`BEFORE`** or **`AFTER`** the row modification is applied.

$$	ext{Total Combinations} = 2 	ext{ Timings} 	imes 3 	ext{ Events} = mathbf{6 	ext{ Standard Trigger Types}}$$

| Trigger Event Hook | Typical Architectural Purpose |
| :--- | :--- |
| **`BEFORE INSERT`** | Validate input data, sanitize strings, assign default generated values. |
| **`AFTER INSERT`** | Insert audit trail rows, update secondary counter/aggregation tables. |
| **`BEFORE UPDATE`**| Verify permissions, validate price change thresholds, record previous values. |
| **`AFTER UPDATE`** | Maintain history tables, notify downstream event queues. |
| **`BEFORE DELETE`**| Check if deletion violates business rules, prevent deleting active accounts. |
| **`AFTER DELETE`** | Clean up associated cache tables, archive deleted rows. |

---

### Trigger Definition Syntax

```sql
DELIMITER //

CREATE TRIGGER trigger_name
{ BEFORE | AFTER } { INSERT | UPDATE | DELETE }
ON table_name
FOR EACH ROW
BEGIN
    -- Procedural statements
END //

DELIMITER ;
```

> **Key Syntax Note:** `FOR EACH ROW` indicates that the trigger operates as a **Row-Level Trigger**: if an `UPDATE` statement modifies 100 rows, the trigger activates 100 times!

---

### Practical Example: Automatic Data Sanitization (BEFORE INSERT)

Suppose we want to ensure all customer emails are converted to lowercase and trimmed before being saved to the database:

```sql
DELIMITER //

CREATE TRIGGER trg_sanitize_customer_email
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    -- Clean and normalize email before writing to disk
    SET NEW.email = LOWER(TRIM(NEW.email));
END //

DELIMITER ;
```

Now, if an application executes:
`INSERT INTO customers (first_name, email) VALUES ('Liam', '  LIAM@EXAMPLE.COM ');`
The trigger intercepts the row and permanently stores: `liam@example.com`.

---

### Managing and Inspecting Triggers

```sql
-- View all triggers defined on the database
SHOW TRIGGERS;

-- View DDL definition of a specific trigger
SHOW CREATE TRIGGER trg_sanitize_customer_email;

-- Safely drop a trigger
DROP TRIGGER IF EXISTS trg_sanitize_customer_email;
```

---

# Multiple Choice Questions

### 1. What triggers the execution of a database trigger in MySQL?
A. A cron job schedule
B. A DML event (INSERT, UPDATE, or DELETE) occurring on the associated table
C. An explicit CALL trigger_name() command
D. A client network ping
**Answer:** B
**Explanation:** Triggers activate automatically in response to DML operations (INSERT, UPDATE, DELETE) on the table to which they are bound.
---

### 2. How many distinct timing/event trigger combinations can be defined on a single MySQL table?
A. 2
B. 4
C. 6
D. 12
**Answer:** C
**Explanation:** Combining 2 timings (BEFORE, AFTER) with 3 DML events (INSERT, UPDATE, DELETE) yields exactly 6 trigger variations.
---

### 3. What does FOR EACH ROW specify in a trigger declaration?
A. The table can only contain one row
B. The trigger fires once for every individual row affected by the triggering statement
C. The trigger executes only on row 1
D. The query is executed in parallel
**Answer:** B
**Explanation:** FOR EACH ROW establishes that the trigger operates as a row-level trigger, firing once per affected row.
---

### 4. Which trigger hook is ideal for transforming and sanitizing input values before they are committed to storage?
A. AFTER DELETE
B. BEFORE INSERT
C. AFTER INSERT
D. BEFORE SELECT
**Answer:** B
**Explanation:** BEFORE INSERT fires prior to writing the row to disk, allowing the routine to modify NEW column values directly.
---

### 5. Can a trigger be attached to a SELECT query?
A. Yes, using BEFORE SELECT
B. No, MySQL triggers only support DML write events (INSERT, UPDATE, DELETE)
C. Only in MySQL 8.0
D. Only if the query has a WHERE clause
**Answer:** B
**Explanation:** Triggers can only be defined for data modification events (INSERT, UPDATE, DELETE); there are no triggers for SELECT queries.
---
