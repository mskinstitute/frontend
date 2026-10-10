---
id: cursors-in-stored-programs
slug: cursors-in-stored-programs
course: sql-for-advanced
chapter: Stored Functions & Cursors
topic: "Working with Cursors: Declare, Open, Fetch, Close"
difficulty: Advanced
readingTime: 14
order: 20
keywords: ["cursors","declare cursor","fetch cursor","not found handler","cursor lifecycle"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Working with Cursors: Declare, Open, Fetch, Close
SQL is inherently a set-based language. However, certain complex algorithms (such as iteratively calculating interest compounded across variable daily brackets or calling external webhooks per customer) require **row-by-row iteration**.

In MySQL stored programs, row-by-row iteration is accomplished using a **Cursor**.

---

### The 4-Stage Lifecycle of a Cursor

1. **`DECLARE`:** Declares the cursor and associates it with a specific `SELECT` query.
2. **`OPEN`:** Initializes the cursor and executes the query to materialize the result set.
3. **`FETCH`:** Retrieves the current row into local variables and advances the internal pointer to the next row.
4. **`CLOSE`:** Releases the cursor and frees its allocated memory.

---

### The Standard Pattern: Using a NOT FOUND Handler

Because a cursor does not know how many rows exist in advance, you must declare a **`CONTINUE HANDLER FOR NOT FOUND`** to signal when the cursor reaches the end of data:

```sql
DELIMITER //

CREATE PROCEDURE ProcessAnnualBonuses()
BEGIN
    -- 1. Declare loop control variables
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_emp_id INT;
    DECLARE v_salary DECIMAL(10, 2);
    DECLARE v_bonus DECIMAL(10, 2);

    -- 2. Declare Cursor (must come after variables!)
    DECLARE emp_cursor CURSOR FOR 
        SELECT emp_id, salary 
        FROM employees 
        WHERE is_active = 1;

    -- 3. Declare NOT FOUND Handler (must come after cursor!)
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 4. Open Cursor
    OPEN emp_cursor;

    -- 5. Loop through rows
    read_loop: LOOP
        -- Fetch next row
        FETCH emp_cursor INTO v_emp_id, v_salary;

        -- Exit loop if no more rows
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Business Logic per row:
        SET v_bonus = v_salary * 0.10;
        
        INSERT INTO bonus_payouts (emp_id, bonus_amount, payout_date)
        VALUES (v_emp_id, v_bonus, CURRENT_DATE());
    END LOOP;

    -- 6. Close Cursor
    CLOSE emp_cursor;
END //

DELIMITER ;
```

---

### Cursor Characteristics in MySQL

MySQL cursors possess three immutable characteristics:
1. **Asensitive:** The server may or may not make a copy of the result table.
2. **Read-Only:** You cannot update rows directly through the cursor pointer (no `UPDATE ... WHERE CURRENT OF`).
3. **Non-Scrollable:** A cursor can only move **forward**, one row at a time. It cannot move backward or jump to an arbitrary index.

---

### Performance Warning: When NOT to Use Cursors!

> **Best Practice:** Cursors are notoriously slow because they perform row-by-row iteration in memory, disabling MySQL's multi-threaded set-based query optimizations.
> 
> Always prefer **set-based SQL** whenever possible:
> ```sql
> -- FAST Set-Based Alternative (Runs 100x faster than a cursor!):
> INSERT INTO bonus_payouts (emp_id, bonus_amount, payout_date)
> SELECT emp_id, salary * 0.10, CURRENT_DATE()
> FROM employees
> WHERE is_active = 1;
> ```
> Reserve cursors exclusively for logic that cannot be expressed via standard SQL joins and aggregates.

---

# Multiple Choice Questions

### 1. What are the four mandatory lifecycle steps of a MySQL cursor in sequential order?
A. OPEN, DECLARE, CLOSE, FETCH
B. DECLARE, OPEN, FETCH, CLOSE
C. START, READ, WRITE, STOP
D. CREATE, RUN, GET, DROP
**Answer:** B
**Explanation:** The lifecycle of a cursor must follow: DECLARE cursor, OPEN cursor, FETCH rows, and CLOSE cursor.
---

### 2. How is the termination of a cursor loop typically handled in MySQL?
A. By checking WHILE cursor.hasNext()
B. By declaring a CONTINUE HANDLER FOR NOT FOUND that sets a boolean flag to true
C. By comparing row count against table size
D. By catching a NULL pointer exception
**Answer:** B
**Explanation:** A CONTINUE HANDLER FOR NOT FOUND trips when FETCH encounters the end of the result set, allowing the loop to be cleanly exited.
---

### 3. Which of the following is a fundamental characteristic of MySQL cursors?
A. Fully bidirectional scrollable
B. Non-scrollable (can only advance forward one row at a time)
C. Updatable in place via WHERE CURRENT OF
D. Executes asynchronously in the background
**Answer:** B
**Explanation:** MySQL cursors are strictly non-scrollable, meaning they can only advance forward sequentially.
---

### 4. In what order must elements be declared inside a BEGIN...END block containing cursors?
A. Handlers first, then Variables, then Cursors
B. Variables first, then Cursors, then Handlers
C. Cursors first, then Variables, then Handlers
D. Any random order
**Answer:** B
**Explanation:** MySQL mandates a strict declaration order: Local Variables must be declared first, followed by Cursors, followed by Handlers.
---

### 5. Why should set-based SQL (INSERT INTO ... SELECT) be preferred over cursors whenever possible?
A. Cursors do not support transactions
B. Set-based operations leverage batch processing and disk I/O optimizations, running orders of magnitude faster than iterative row-by-row cursors
C. Cursors corrupt auto-increment IDs
D. Cursors require root privileges
**Answer:** B
**Explanation:** Relational engines are heavily optimized for set-based vector operations; row-by-row cursors incur heavy per-row context switching overhead.
---
