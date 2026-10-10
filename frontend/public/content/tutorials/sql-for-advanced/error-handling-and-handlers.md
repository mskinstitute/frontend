---
id: error-handling-and-handlers
slug: error-handling-and-handlers
course: sql-for-advanced
chapter: Stored Procedures Masterclass
topic: "Error Handling & Handlers in Stored Programs"
difficulty: Advanced
readingTime: 14
order: 17
keywords: ["error handling","declare handler","sqlexception","rollback in procedure","resignal","mysql exceptions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Error Handling & Handlers in Stored Programs
In production applications, unhandled database errors (such as duplicate key violations, foreign key constraints, or connection drops) can cause procedures to crash mid-execution, leaving transactions dangling.

MySQL provides robust error handling through **`DECLARE ... HANDLER`** statements and the **`RESIGNAL`** command.

---

### Declaring Handlers Syntax

```sql
DECLARE { CONTINUE | EXIT } HANDLER 
FOR condition_value 
handler_statement;
```

#### Handler Action Types:
- **`CONTINUE`:** Executes the handler statement and **continues** procedure execution at the next statement.
- **`EXIT`:** Executes the handler statement and immediately **terminates** execution of the enclosing `BEGIN ... END` block.

#### Common Condition Values:
- **`SQLEXCEPTION`:** Catches any general SQL error (codes not starting with 00, 01, or 02).
- **`SQLWARNING`:** Catches warnings.
- **`NOT FOUND`:** Triggers when a cursor reaches the end of data or a `SELECT INTO` returns zero rows.
- **Specific MySQL Error Code:** e.g., `1062` (Duplicate Key Entry).

---

### Practical Example: Transactional Safe Insert with Rollback Handler

Consider a procedure that inserts a user and customer profile atomically. If duplicate email error 1062 occurs, it automatically rolls back and outputs an error message:

```sql
DELIMITER //

CREATE PROCEDURE RegisterUserAccount(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    OUT p_status_code VARCHAR(20),
    OUT p_error_message VARCHAR(255)
)
BEGIN
    -- Flag to track errors
    DECLARE error_occurred BOOLEAN DEFAULT FALSE;

    -- Declare EXIT handler for ANY general SQL exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback all uncommitted changes
        ROLLBACK;
        SET p_status_code = 'FAILED';
        SET p_error_message = 'A database error occurred during registration. Transaction rolled back.';
    END;

    -- Declare specific handler for Duplicate Key (1062)
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SET p_status_code = 'DUPLICATE_EMAIL';
        SET p_error_message = 'The specified email address is already registered.';
    END;

    -- Begin Transaction
    START TRANSACTION;

    INSERT INTO users (username, email) VALUES (p_username, p_email);
    INSERT INTO user_profiles (user_id, bio) VALUES (LAST_INSERT_ID(), 'Welcome!');

    -- If no exception occurred, commit!
    COMMIT;
    SET p_status_code = 'SUCCESS';
    SET p_error_message = 'Account registered successfully.';
END //

DELIMITER ;
```

---

### Throwing Custom Exceptions with SIGNAL

You can raise custom business errors using **`SIGNAL SQLSTATE`**:

```sql
DELIMITER //

CREATE PROCEDURE WithdrawMoney(
    IN p_acc_id INT,
    IN p_amount DECIMAL(10, 2)
)
BEGIN
    DECLARE current_bal DECIMAL(10, 2);

    SELECT balance INTO current_bal 
    FROM bank_accounts 
    WHERE account_id = p_acc_id;

    IF current_bal < p_amount THEN
        -- Raise custom application error (SQLSTATE '45000' is generic user error)
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient Funds: Withdrawal amount exceeds current balance!';
    END IF;

    UPDATE bank_accounts 
    SET balance = balance - p_amount 
    WHERE account_id = p_acc_id;
END //

DELIMITER ;
```

---

# Multiple Choice Questions

### 1. What is the difference between a CONTINUE handler and an EXIT handler in MySQL?
A. CONTINUE restarts the server; EXIT powers down MySQL
B. CONTINUE executes the handler and proceeds to the next statement; EXIT executes the handler and aborts the current block
C. CONTINUE only catches warnings; EXIT only catches fatal errors
D. CONTINUE is deprecated
**Answer:** B
**Explanation:** CONTINUE resumes execution at the following line after executing the handler action; EXIT immediately terminates the enclosing BEGIN...END block.
---

### 2. Which condition category captures all general database SQL runtime errors?
A. SQLWARNING
B. SQLEXCEPTION
C. NOT FOUND
D. SYSTEM_ERROR
**Answer:** B
**Explanation:** SQLEXCEPTION is the universal condition catch-all for any SQL error code.
---

### 3. What is the purpose of the SIGNAL statement?
A. Sends an email notification to the DBA
B. Explicitly raises an error condition or exception with a custom SQLSTATE and message
C. Flushes DNS tables
D. Reconnects to the master database
**Answer:** B
**Explanation:** SIGNAL SQLSTATE 'code' SET MESSAGE_TEXT = '...' allows developers to throw custom application exceptions.
---

### 4. Which standard SQLSTATE code is reserved for user-defined generic application exceptions?
A. 00000
B. 45000
C. 99999
D. 23000
**Answer:** B
**Explanation:** SQLSTATE '45000' is the ANSI SQL standard state reserved for unhandled user-defined exceptions.
---

### 5. What error condition is triggered when a cursor advances past the final row or a SELECT INTO finds zero matches?
A. SQLEXCEPTION
B. NOT FOUND
C. SQLWARNING
D. ZERO_MATCH
**Answer:** B
**Explanation:** NOT FOUND captures occurrences where a query returns zero rows or a cursor fetch operation reaches EOF.
---
