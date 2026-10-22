---
id: "java-adv-t5.4"
title: "Transaction Management: setAutoCommit(false), commit(), and rollback()"
slug: "jdbc-transaction-management-commit-rollback"
course: "Java for Advanced"
chapter: "5: Database Persistence with JDBC"
topic: "Transaction Management: setAutoCommit(false), commit(), and rollback()"
difficulty: "Advanced"
readingTime: 16
order: 24
keywords: ["transactions","autocommit","commit","rollback","acid compliance","savepoint"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 💳 Transaction Management: setAutoCommit(false), commit(), and rollback()

## Introduction
By default, JDBC operates in **auto-commit mode**, meaning every individual SQL statement is treated as an independent transaction and committed to disk immediately. 

In enterprise operations involving multi-step modifications (such as financial bank transfers where money is deducted from Account A and credited to Account B), auto-commit is disastrous: if a failure occurs halfway through, the system is left in a corrupted state.

---

## 🏛️ The ACID Guarantee in JDBC
- **Atomicity**: All operations succeed together or all are rolled back.
- **Consistency**: The database transitions from one valid state to another.
- **Isolation**: Concurrent transactions do not interfere with each other.
- **Durability**: Committed transactions persist permanently across crashes.

---

## 💻 Transactional Balance Transfer Example

```java
package com.mskinstitute.banking;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BankingService {

    public static void transferFunds(Connection conn, int senderId, int receiverId, double amount) 
            throws SQLException {
        
        String withdrawSql = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?";
        String depositSql  = "UPDATE accounts SET balance = balance + ? WHERE id = ?";

        // STEP 1: Disable Auto-Commit to begin manual transaction boundary
        conn.setAutoCommit(false);

        try (PreparedStatement withdrawStmt = conn.prepareStatement(withdrawSql);
             PreparedStatement depositStmt  = conn.prepareStatement(depositSql)) {

            // Step 2: Debit sender account
            withdrawStmt.setDouble(1, amount);
            withdrawStmt.setInt(2, senderId);
            withdrawStmt.setDouble(3, amount);
            int rowsDebited = withdrawStmt.executeUpdate();

            if (rowsDebited == 0) {
                throw new SQLException("Insufficient funds or sender account not found!");
            }

            // Step 3: Credit receiver account
            depositStmt.setDouble(1, amount);
            depositStmt.setInt(2, receiverId);
            int rowsCredited = depositStmt.executeUpdate();

            if (rowsCredited == 0) {
                throw new SQLException("Receiver account not found!");
            }

            // STEP 4: Both operations succeeded - Commit permanently!
            conn.commit();
            System.out.println("✅ Transaction successful: ₹" + amount + " transferred.");

        } catch (Exception ex) {
            // STEP 5: Failure occurred! Rollback entire transaction to pristine state
            System.err.println("❌ Error detected, rolling back changes: " + ex.getMessage());
            conn.rollback();
            throw ex;
        } finally {
            // STEP 6: Always restore default auto-commit mode
            conn.setAutoCommit(true);
        }
    }
}
```
