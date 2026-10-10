---
id: old-and-new-pseudo-records
slug: old-and-new-pseudo-records
course: sql-for-advanced
chapter: Database Triggers
topic: "Utilizing OLD and NEW Pseudo-Records"
difficulty: Advanced
readingTime: 14
order: 23
keywords: ["old and new","pseudo records","trigger variables","before update","column validation"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Utilizing OLD and NEW Pseudo-Records
Inside the body of a trigger, MySQL provides two virtual pseudo-records: **`OLD`** and **`NEW`**. These records represent the state of the row before and after the triggering DML modification.

Understanding the availability of `OLD` and `NEW` across different DML events is crucial for data auditing and integrity enforcement.

---

### Availability Matrix: OLD vs NEW

| Event | `OLD` Available? | `NEW` Available? | Modifiable via `SET`? |
| :--- | :--- | :--- | :--- |
| **`INSERT`** | **No** (Row didn't exist prior) | **Yes** (Represents new incoming row) | **Yes** (in `BEFORE INSERT`) |
| **`UPDATE`** | **Yes** (Represents values before edit) | **Yes** (Represents edited values) | **Yes** (in `BEFORE UPDATE`) |
| **`DELETE`** | **Yes** (Represents values being removed)| **No** (Row is deleted; no new state) | **No** (`OLD` is strictly read-only) |

---

### Modifying Column Values with `SET NEW.col`

In **`BEFORE`** triggers, you can overwrite the values that will be written to disk:

```sql
DELIMITER //

CREATE TRIGGER trg_enforce_minimum_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    -- Prevent salaries below company minimum wage ($30,000)
    IF NEW.salary < 30000.00 THEN
        SET NEW.salary = 30000.00;
    END IF;
END //

DELIMITER ;
```

> **Rule:** You can only assign values to `NEW` columns in **`BEFORE`** triggers. In `AFTER` triggers, the row has already been committed to storage, so `NEW` becomes read-only!

---

### Enforcing Strict Business Rules (BEFORE UPDATE)

Suppose management mandates that no employee's salary can ever be decreased, and single raises cannot exceed 20%:

```sql
DELIMITER //

CREATE TRIGGER trg_validate_salary_changes
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    -- 1. Check if salary is being decreased
    IF NEW.salary < OLD.salary THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Salary reduction policy violation: Salaries cannot be decreased!';
    END IF;

    -- 2. Check if raise exceeds 20%
    IF NEW.salary > (OLD.salary * 1.20) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Salary raise cap exceeded: Maximum allowable raise is 20%!';
    END IF;
END //

DELIMITER ;
```

---

### Capturing State Changes in History Tables

By comparing `OLD.col` with `NEW.col`, you can determine precisely which columns were modified during an `UPDATE`:

```sql
IF OLD.status != NEW.status THEN
    INSERT INTO status_history (order_id, old_status, new_status, changed_at)
    VALUES (NEW.order_id, OLD.status, NEW.status, NOW());
END IF;
```

---

# Multiple Choice Questions

### 1. Which pseudo-record is available during an INSERT trigger?
A. OLD only
B. NEW only
C. Both OLD and NEW
D. Neither
**Answer:** B
**Explanation:** For INSERT operations, only NEW exists representing the row being inserted; OLD does not exist because there was no prior row.
---

### 2. Can you modify a column value using SET NEW.column = value in an AFTER INSERT trigger?
A. Yes, always
B. No, NEW is read-only in AFTER triggers because the row has already been written to the table
C. Yes, if autocommit is disabled
D. Only on primary key columns
**Answer:** B
**Explanation:** Modifications via SET NEW.col are only permitted in BEFORE triggers; in AFTER triggers the record is already committed to the table.
---

### 3. Which pseudo-record represents the row being deleted in a DELETE trigger?
A. NEW
B. OLD
C. DELETED
D. PREV
**Answer:** B
**Explanation:** In a DELETE trigger, OLD represents the data of the row being removed.
---

### 4. How can a trigger detect if a customer's email address specifically changed during an UPDATE?
A. IF OLD.email != NEW.email THEN
B. IF EMAIL_CHANGED() THEN
C. IF NEW.email IS NULL THEN
D. IF UPDATE(email) THEN
**Answer:** A
**Explanation:** Comparing OLD.email with NEW.email directly checks if the before-and-after values differ.
---

### 5. What happens if a BEFORE UPDATE trigger executes a SIGNAL SQLSTATE statement?
A. The update proceeds anyway, but a warning is issued
B. The update is aborted, the statement fails, and an exception is returned to the client
C. The database shuts down
D. The old row is deleted
**Answer:** B
**Explanation:** Raising a SIGNAL inside a BEFORE trigger halts execution, canceling the update and rolling back the statement.
---
