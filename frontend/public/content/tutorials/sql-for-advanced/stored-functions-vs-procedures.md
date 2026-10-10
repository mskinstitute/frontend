---
id: stored-functions-vs-procedures
slug: stored-functions-vs-procedures
course: sql-for-advanced
chapter: Stored Functions & Cursors
topic: "Stored Functions vs Stored Procedures Architecture"
difficulty: Advanced
readingTime: 13
order: 21
keywords: ["stored functions vs procedures","routines comparison","architectural decision","database programming"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Stored Functions vs Stored Procedures Architecture
Both Stored Procedures and Stored Functions allow developers to encapsulate database logic. However, they serve completely different architectural purposes in application system design.

Selecting the appropriate routine type impacts query composability, transaction boundaries, and system maintainability.

---

### Comprehensive Architectural Comparison

| Dimension | Stored Function | Stored Procedure |
| :--- | :--- | :--- |
| **Return Value** | **Must return exactly one scalar value** via `RETURNS` / `RETURN` | May return **zero, one, or multiple result sets**, or use `OUT` params |
| **Invocation** | Embedded inline in SQL (`SELECT fn(x)`, `WHERE fn(x) > 10`) | Invoked independently using `CALL proc()` |
| **Parameters** | Only `IN` parameters permitted | Supports `IN`, `OUT`, and `INOUT` parameters |
| **Transaction Management** | **Cannot manage transactions** (No `COMMIT` or `ROLLBACK`) | **Full transaction control** (`START TRANSACTION`, `COMMIT`, `ROLLBACK`) |
| **DML Statements** | Generally restricted to read-only calculations (cannot alter tables in queries) | Can execute arbitrary `INSERT`, `UPDATE`, `DELETE`, and DDL |
| **Composability** | High: Can be combined with other expressions in joins and projections | Low: Cannot be nested inside a `SELECT` expression |

---

### Architectural Decision Matrix

#### Choose a Stored Function When:
1. You are calculating a single derived value from inputs (e.g., converting currencies, formatting phone numbers, computing tax percentages).
2. The logic needs to be reused across multiple `SELECT` queries, views, or reports.
3. The calculation does not modify database state and requires no transactional rollbacks.

#### Choose a Stored Procedure When:
1. You are executing an atomic business workflow involving multiple table modifications (e.g., checkout order, user registration, monthly billing).
2. You need to return full tabular datasets to an external application (like an API endpoint).
3. You need transaction boundaries (`COMMIT` / `ROLLBACK`) and exception handlers.
4. You need to return multiple distinct scalar outputs via `OUT` parameters.

---

# Multiple Choice Questions

### 1. Can a Stored Function contain a COMMIT or ROLLBACK statement?
A. Yes, always
B. No, functions cannot manage transaction boundaries in MySQL
C. Only if marked DETERMINISTIC
D. Only if autocommit is 0
**Answer:** B
**Explanation:** Stored functions are designed for scalar computation and are prohibited from executing transaction control statements like COMMIT or ROLLBACK.
---

### 2. Which routine can be embedded directly inside a WHERE clause filter?
A. Stored Procedure
B. Stored Function
C. Database Trigger
D. Event Scheduler
**Answer:** B
**Explanation:** Stored functions return a scalar value and can be embedded directly inside WHERE clauses (e.g., WHERE CalculateDiscount(price) > 50).
---

### 3. Which parameter modes are supported by Stored Functions?
A. IN, OUT, and INOUT
B. Only IN parameters
C. Only OUT parameters
D. None
**Answer:** B
**Explanation:** Unlike procedures which accept IN, OUT, and INOUT, stored functions only accept IN parameters.
---

### 4. If a backend task must update 3 tables, manage a transaction, and return 2 tabular result sets, which construct is required?
A. Stored Function
B. Stored Procedure
C. View
D. Virtual Column
**Answer:** B
**Explanation:** Only Stored Procedures support full transaction management, multiple table DML updates, and returning multiple tabular result sets.
---

### 5. Can a Stored Procedure be called directly inside a SELECT column projection (e.g., SELECT id, CALL MyProc(id) FROM users)?
A. Yes
B. No, procedures cannot be called inline within a SELECT statement; they require the CALL command
C. Only in MySQL 8.0
D. Only if the procedure has no OUT parameters
**Answer:** B
**Explanation:** Procedures cannot be invoked within standard SQL expressions; they must be executed independently via CALL.
---
