---
id: "java-adv-t5.2"
title: "Executing Queries: Statement vs PreparedStatement (SQL Injection Prevention)"
slug: "statement-vs-preparedstatement-sql-injection-prevention"
course: "Java for Advanced"
chapter: "5: Database Persistence with JDBC"
topic: "Executing Queries: Statement vs PreparedStatement (SQL Injection Prevention)"
difficulty: "Advanced"
readingTime: 16
order: 22
keywords: ["preparedstatement","sql injection","statement vs preparedstatement","query precompilation","security"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🛡️ Executing Queries: Statement vs PreparedStatement (SQL Injection Prevention)

## Introduction
When executing SQL statements in JDBC, Java provides two primary interfaces: `Statement` and `PreparedStatement`. In production enterprise applications, **`PreparedStatement` is universally mandated** because it eliminates catastrophic SQL Injection attacks and delivers superior query performance.

---

## 🚨 The Vulnerability: Raw `Statement` and SQL Injection

Consider a login validation query built with string concatenation:

```java
// ❌ CRITICAL SECURITY VULNERABILITY!
String rawSql = "SELECT * FROM users WHERE username = '" + userInputUser + 
                "' AND password = '" + userInputPass + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(rawSql);
```

If an attacker inputs:
```text
Username: admin' OR '1'='1
Password: anything
```

The query evaluated by the SQL engine becomes:
```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
```
The condition `'1'='1'` evaluates to true, granting unauthorized administrative bypass to your entire platform!

---

## 🛡️ The Defense: `PreparedStatement` with Parameter Placeholders (`?`)

With `PreparedStatement`, the database pre-compiles the query template before values are supplied. User input is treated strictly as literal data, never as executable SQL commands:

```java
String safeSql = "SELECT * FROM users WHERE username = ? AND password = ?";

try (PreparedStatement pstmt = connection.prepareStatement(safeSql)) {
    // Bind parameters by 1-based index:
    pstmt.setString(1, userInputUser);
    pstmt.setString(2, userInputPass);

    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            System.out.println("Authenticated as: " + rs.getString("full_name"));
        } else {
            System.out.println("Invalid credentials.");
        }
    }
}
```

---

## 📊 Summary Comparison

| Feature | `Statement` | `PreparedStatement` |
| :--- | :--- | :--- |
| **SQL Injection Defense** | Vulnerable (manual escaping needed) | **100% Immune** (driver parameterization) |
| **Query Plan Caching** | Re-parsed and re-compiled every time | **Pre-compiled once**, re-executed fast |
| **Batch Updates** | Inefficient | Highly optimized with batch binding |
| **Binary Data (BLOBs)** | Difficult to handle | Seamless via `setBinaryStream()` |
