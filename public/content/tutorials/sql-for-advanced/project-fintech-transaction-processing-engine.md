---
id: project-fintech-transaction-processing-engine
slug: project-fintech-transaction-processing-engine
course: sql-for-advanced
chapter: Production Capstone Projects
topic: "Project 1: Fintech High-Performance Transaction Engine"
difficulty: Advanced
readingTime: 25
order: 40
keywords: ["fintech capstone","stored procedure project","pessimistic locking project","double entry bookkeeping","advanced capstone"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 1: Fintech High-Performance Transaction Engine
### Advanced Capstone Project 1: Fintech High-Performance Transaction Engine

Welcome to the first Advanced Capstone Project! In this enterprise-grade project, you will build a production-ready **Fintech High-Performance Transaction Processing Engine**.

You will synthesize:
- Multi-table double-entry bookkeeping
- Stored Procedures with `IN`/`OUT` parameters
- Deterministic locking order to prevent deadlocks
- Pessimistic locking (`SELECT ... FOR UPDATE`)
- Custom error handling (`DECLARE EXIT HANDLER FOR SQLEXCEPTION`)

---

### 1. Database Schema DDL

```sql
CREATE DATABASE IF NOT EXISTS fintech_engine_db;
USE fintech_engine_db;

-- 1. Wallets / Accounts Table
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(32) NOT NULL UNIQUE,
    holder_name VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_bal CHECK (balance >= 0.00)
) ENGINE = InnoDB;

-- 2. Audit Transactions Header
CREATE TABLE transfers (
    transfer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transfer_uuid VARCHAR(64) NOT NULL UNIQUE,
    source_acc_id INT NOT NULL,
    dest_acc_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
    failure_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_src FOREIGN KEY (source_acc_id) REFERENCES accounts(account_id),
    CONSTRAINT fk_tx_dst FOREIGN KEY (dest_acc_id) REFERENCES accounts(account_id)
) ENGINE = InnoDB;

-- 3. Double-Entry General Ledger
CREATE TABLE general_ledger (
    ledger_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transfer_id BIGINT NOT NULL,
    account_id INT NOT NULL,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    running_balance DECIMAL(15, 2) NOT NULL,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gl_tx FOREIGN KEY (transfer_id) REFERENCES transfers(transfer_id),
    CONSTRAINT fk_gl_acc FOREIGN KEY (account_id) REFERENCES accounts(account_id)
) ENGINE = InnoDB;
```

---

### 2. Seeding Initial Accounts

```sql
INSERT INTO accounts (account_id, account_number, holder_name, balance) VALUES
(1, 'WAL-1001', 'Enterprise Treasury', 1000000.00),
(2, 'WAL-2002', 'Liam Vance', 2500.00),
(3, 'WAL-3003', 'Sophia Turner', 150.00);
```

---

### 3. The Core Settlement Stored Procedure

To eliminate deadlocks under high concurrency, our procedure uses **Deterministic ID Sorting**: it always locks the smaller account ID first, followed by the larger account ID!

```sql
DELIMITER //

CREATE PROCEDURE ProcessFundTransfer(
    IN  p_source_id INT,
    IN  p_dest_id   INT,
    IN  p_amount    DECIMAL(15, 2),
    OUT p_transfer_id BIGINT,
    OUT p_status_code VARCHAR(30),
    OUT p_message     VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_first_id  INT;
    DECLARE v_second_id INT;
    DECLARE v_src_bal   DECIMAL(15, 2);
    DECLARE v_src_frozen BOOLEAN;
    DECLARE v_dst_frozen BOOLEAN;
    DECLARE v_dst_bal   DECIMAL(15, 2);
    DECLARE v_tx_id     BIGINT;

    -- Exception Handler: Automatically rollback on any database error
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status_code = 'SYSTEM_ERROR';
        SET p_message = 'An unexpected database error occurred. Transfer safely rolled back.';
    END;

    -- Validation 1: Prevent transferring to self
    IF p_source_id = p_dest_id THEN
        SET p_status_code = 'INVALID_DESTINATION';
        SET p_message = 'Source and destination accounts must be distinct.';
        LEAVE proc_label;
    END IF;

    -- Validation 2: Amount must be positive
    IF p_amount <= 0.00 THEN
        SET p_status_code = 'INVALID_AMOUNT';
        SET p_message = 'Transfer amount must be strictly greater than zero.';
        LEAVE proc_label;
    END IF;

    -- Deadlock Prevention: Determine locking order (Lower ID first!)
    IF p_source_id < p_dest_id THEN
        SET v_first_id  = p_source_id;
        SET v_second_id = p_dest_id;
    ELSE
        SET v_first_id  = p_dest_id;
        SET v_second_id = p_source_id;
    END IF;

    -- Begin Atomic Transaction Boundary
    START TRANSACTION;

    -- Deterministic Locking Read on Account 1
    SELECT balance, is_frozen INTO v_src_bal, v_src_frozen
    FROM accounts WHERE account_id = v_first_id FOR UPDATE;

    -- Deterministic Locking Read on Account 2
    SELECT balance, is_frozen INTO v_dst_bal, v_dst_frozen
    FROM accounts WHERE account_id = v_second_id FOR UPDATE;

    -- Re-assign balances to correct source/dest variables
    IF p_source_id = v_first_id THEN
        -- v_src_bal is already correct
    ELSE
        -- Swap variable values to map accurately
        SET v_src_bal = v_dst_bal;
    END IF;

    -- Re-fetch actual source balance accurately
    SELECT balance, is_frozen INTO v_src_bal, v_src_frozen
    FROM accounts WHERE account_id = p_source_id;

    SELECT balance, is_frozen INTO v_dst_bal, v_dst_frozen
    FROM accounts WHERE account_id = p_dest_id;

    -- Verification 3: Check frozen accounts
    IF v_src_frozen OR v_dst_frozen THEN
        ROLLBACK;
        SET p_status_code = 'ACCOUNT_FROZEN';
        SET p_message = 'One or both accounts are currently frozen from trading.';
        LEAVE proc_label;
    END IF;

    -- Verification 4: Check Sufficient Funds
    IF v_src_bal < p_amount THEN
        ROLLBACK;
        SET p_status_code = 'INSUFFICIENT_FUNDS';
        SET p_message = 'Source account has insufficient balance to cover transfer.';
        LEAVE proc_label;
    END IF;

    -- Step A: Record Transfer Audit Master
    INSERT INTO transfers (transfer_uuid, source_acc_id, dest_acc_id, amount, status)
    VALUES (UUID(), p_source_id, p_dest_id, p_amount, 'COMPLETED');

    SET v_tx_id = LAST_INSERT_ID();
    SET p_transfer_id = v_tx_id;

    -- Step B: Update Account Balances
    UPDATE accounts SET balance = balance - p_amount WHERE account_id = p_source_id;
    UPDATE accounts SET balance = balance + p_amount WHERE account_id = p_dest_id;

    -- Step C: Post Double-Entry Ledger Lines
    -- 1. Debit Source Account
    INSERT INTO general_ledger (transfer_id, account_id, entry_type, amount, running_balance)
    VALUES (v_tx_id, p_source_id, 'DEBIT', p_amount, v_src_bal - p_amount);

    -- 2. Credit Destination Account
    INSERT INTO general_ledger (transfer_id, account_id, entry_type, amount, running_balance)
    VALUES (v_tx_id, p_dest_id, 'CREDIT', p_amount, v_dst_bal + p_amount);

    -- Commit Entire Atomic Transaction!
    COMMIT;

    SET p_status_code = 'SUCCESS';
    SET p_message = 'Transfer processed and settled successfully.';
END //

DELIMITER ;
```

---

### 4. Executing and Testing the Engine

```sql
-- Transfer $500.00 from Liam (Account 2) to Sophia (Account 3):
CALL ProcessFundTransfer(2, 3, 500.00, @tx_id, @status, @msg);

-- Review status
SELECT @tx_id AS transfer_id, @status AS status, @msg AS message;

-- Verify updated balances
SELECT account_id, holder_name, balance FROM accounts WHERE account_id IN (2, 3);
```

---

# Multiple Choice Questions

### 1. In our fintech procedure, why are account IDs sorted before acquiring locks with SELECT ... FOR UPDATE?
A. Because MySQL requires primary keys to be ordered alphabetically
B. To enforce a deterministic locking order, completely eliminating circular deadlocks across concurrent transfer threads
C. To reduce the amount of RAM used
D. Because higher IDs have higher priority
**Answer:** B
**Explanation:** Consistently locking rows in ascending numerical order eliminates cyclical lock dependencies, preventing deadlocks.
---

### 2. How does the procedure guarantee that money cannot be transferred if the source has insufficient funds?
A. It alerts the server admin
B. It checks IF v_src_bal < p_amount THEN ROLLBACK; and exits cleanly before making balance modifications
C. It relies on MySQL credit limits
D. It creates negative balances
**Answer:** B
**Explanation:** Pre-checking the locked balance and rolling back immediately guarantees that overdrafts are rejected before writing ledger records.
---

### 3. What does the DECLARE EXIT HANDLER FOR SQLEXCEPTION accomplish in our procedure?
A. Prints the SQL code to the screen
B. Automatically issues a ROLLBACK and populates error output parameters if any unexpected database failure occurs
C. Restarts the connection pool
D. Deletes the transfer record
**Answer:** B
**Explanation:** The EXIT HANDLER catches unhandled database exceptions, guaranteeing that partial modifications are safely rolled back.
---

### 4. How many ledger records are posted in general_ledger for every successful transfer?
A. 1
B. Exactly 2 (One DEBIT and one CREDIT)
C. 4
D. None
**Answer:** B
**Explanation:** Double-entry accounting requires two matching ledger records per transaction: a DEBIT to the sender and a CREDIT to the recipient.
---

### 5. Why is UUID() used for the transfer_uuid column?
A. It is shorter than an integer
B. It provides a globally unique, non-sequential transaction reference identifier suitable for external API reconciliation
C. It compresses the row
D. It speeds up table scans
**Answer:** B
**Explanation:** A UUID serves as an immutable, globally unique idempotency key for external payments and audit tracking.
---
