---
id: project-banking-transaction-ledger
slug: project-banking-transaction-ledger
course: sql-for-intermediate
chapter: Intermediate Capstone Projects
topic: "Project 2: Banking Transaction & Ledger System with ACID Guarantees"
difficulty: Intermediate
readingTime: 20
order: 48
keywords: ["banking project","ledger system","acid transactions","double entry bookkeeping","stored transactions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 2: Banking Transaction & Ledger System with ACID Guarantees
### Capstone Project 2: Banking Transaction & Ledger System with ACID Guarantees

In financial software engineering, data integrity is paramount. Balances cannot be calculated arbitrarily, money cannot be created or destroyed, and system crashes must never result in half-finished transfers.

In this capstone, you will implement an enterprise **Double-Entry Banking Ledger System** utilizing strict ACID transactions, row-level locks (`FOR UPDATE`), and balance consistency validations.

---

### 1. Architectural Ledger Model

Our banking system follows the **Double-Entry Accounting Model**:
- `bank_accounts`: Account master records holding current balance and status.
- `transactions`: The audit master log representing an overarching transfer event.
- `ledger_entries`: The immutable double-entry records. Every transfer creates exactly two ledger rows:
  - One **Debit (DR)** entry decreasing the source account.
  - One **Credit (CR)** entry increasing the target account.

```
[bank_accounts] 1 ────< N [ledger_entries] N >──── 1 [transactions]
```

---

### 2. DDL Database Implementation

```sql
CREATE DATABASE IF NOT EXISTS core_banking_db;
USE core_banking_db;

-- 1. Accounts Master Table
CREATE TABLE bank_accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    account_holder VARCHAR(100) NOT NULL,
    account_type ENUM('CHECKING', 'SAVINGS', 'ESCROW') NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status ENUM('ACTIVE', 'FROZEN', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_balance CHECK (balance >= 0.00)
) ENGINE = InnoDB;

-- 2. Master Transactions Audit Header
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    reference_uuid VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 3. Double-Entry Ledger Lines
CREATE TABLE ledger_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    account_id INT NOT NULL,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0.00),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_tx 
        FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
    CONSTRAINT fk_ledger_acc 
        FOREIGN KEY (account_id) REFERENCES bank_accounts(account_id)
) ENGINE = InnoDB;
```

---

### 3. Seeding Customer Accounts

```sql
INSERT INTO bank_accounts (account_number, account_holder, account_type, balance, status) VALUES
('ACC-1001-USD', 'Alice Smith', 'CHECKING', 1500.00, 'ACTIVE'),
('ACC-1002-USD', 'Bob Jones', 'SAVINGS', 250.00, 'ACTIVE'),
('ACC-9999-USD', 'Escrow Vault', 'ESCROW', 100000.00, 'ACTIVE');
```

---

### 4. Executing an Atomic Fund Transfer ($300 from Alice to Bob)

To prevent race conditions where two simultaneous transfers overdraw Alice's account, we lock the rows using **`SELECT ... FOR UPDATE`**:

```sql
-- Step 1: Open atomic boundary
START TRANSACTION;

-- Step 2: Lock and inspect Alice's balance
SELECT balance, status 
FROM bank_accounts 
WHERE account_id = 1 
FOR UPDATE;

-- Step 3: Lock and inspect Bob's account
SELECT balance, status 
FROM bank_accounts 
WHERE account_id = 2 
FOR UPDATE;

-- Step 4: Record Transaction Header
INSERT INTO transactions (reference_uuid, description)
VALUES (UUID(), 'Interbank P2P transfer: Alice to Bob');

SET @tx_id = LAST_INSERT_ID();

-- Step 5: Post Double-Entry Ledger Records
-- Debit Alice ($300)
INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
VALUES (@tx_id, 1, 'DEBIT', 300.00);

-- Credit Bob ($300)
INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
VALUES (@tx_id, 2, 'CREDIT', 300.00);

-- Step 6: Update Cached Account Balances
UPDATE bank_accounts SET balance = balance - 300.00 WHERE account_id = 1;
UPDATE bank_accounts SET balance = balance + 300.00 WHERE account_id = 2;

-- Step 7: Commit entire atomic unit!
COMMIT;
```

---

### 5. Automated Ledger Audit Verification

A fundamental principle of double-entry banking is:
$$sum 	ext{Debits} - sum 	ext{Credits} = 0$$

Let's write a query to audit ledger integrity across the entire institution:

```sql
SELECT 
    t.transaction_id,
    t.description,
    SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END) AS total_debits,
    SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END) AS total_credits,
    ROUND(
        SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END) -
        SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 2
    ) AS imbalance
FROM transactions t
JOIN ledger_entries l ON t.transaction_id = l.transaction_id
GROUP BY t.transaction_id, t.description
HAVING imbalance != 0.00;
```
If this query returns zero rows, the ledger is in complete mathematical equilibrium!

---

# Multiple Choice Questions

### 1. What is the role of SELECT ... FOR UPDATE in financial transfers?
A. Converts numeric balances into encrypted strings
B. Locks the selected account rows with exclusive locks, preventing concurrent transactions from modifying them
C. Automatically executes a COMMIT
D. Bypasses foreign key constraints
**Answer:** B
**Explanation:** SELECT ... FOR UPDATE applies exclusive row locks, serializing access to account balances and preventing race conditions or overdrafts.
---

### 2. In double-entry bookkeeping, what must always be true for every transaction?
A. Total Debits must exactly equal Total Credits
B. Debits must be greater than Credits
C. Transactions cannot touch more than one account
D. Balances must be recalculated only at midnight
**Answer:** A
**Explanation:** The fundamental theorem of double-entry accounting dictates that total debited funds must equal total credited funds.
---

### 3. How does the CHECK (balance >= 0.00) constraint safeguard the database?
A. It prevents deposits over $1,000,000
B. It rejects any UPDATE or INSERT that would cause an account balance to drop into a negative number
C. It deletes fraudulent transactions automatically
D. It ensures accounts use USD currency
**Answer:** B
**Explanation:** The CHECK constraint enforces that balance values cannot become negative, aborting any transaction that would overdraw the account.
---

### 4. Why are ledger entries stored as append-only immutable records rather than constantly updating a single row?
A. To provide a permanent, unalterable audit trail of every financial movement
B. Because InnoDB does not support UPDATE statements on tables with foreign keys
C. To reduce hard drive space
D. Because append-only tables do not need primary keys
**Answer:** A
**Explanation:** Financial compliance requires an immutable audit trail; every balance modification must correspond to a verifiable ledger entry.
---

### 5. If Alice transfers $300 to Bob, what ledger entries are recorded?
A. One DEBIT of $300 for Alice and one CREDIT of $300 for Bob
B. Two CREDITS of $300
C. A single row of $0
D. One DEBIT of $600
**Answer:** A
**Explanation:** Alice's account experiences a $300 DEBIT (asset reduction), while Bob's account experiences a matching $300 CREDIT.
---
