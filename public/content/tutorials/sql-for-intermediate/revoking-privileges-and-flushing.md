---
id: revoking-privileges-and-flushing
slug: revoking-privileges-and-flushing
course: sql-for-intermediate
chapter: MySQL User Management & Security
topic: "Revoking Privileges & FLUSH PRIVILEGES"
difficulty: Intermediate
readingTime: 11
order: 45
keywords: ["revoke privileges","flush privileges","mysql grants","least privilege","mysql security"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Revoking Privileges & FLUSH PRIVILEGES
Granting permissions is only half of access control; maintaining a secure infrastructure requires periodically stripping unnecessary permissions or revoking access when team roles change.

MySQL provides the **`REVOKE`** statement to remove permissions and the **`FLUSH PRIVILEGES`** statement to reload internal grant tables.

---

### The REVOKE Statement Syntax

```sql
REVOKE privilege_name [, ...] 
ON database_name.table_name 
FROM 'username'@'hostname';
```

> **Exact Match Rule:** The `ON` scope specified in the `REVOKE` statement must match the exact scope level at which the privilege was originally granted. If granted at `ecommerce.*`, you cannot revoke it at `*.*`!

---

### Practical Examples of Revoking Privileges

#### Example 1: Stripping DELETE Privileges
Prevent an application user from deleting records directly:
```sql
REVOKE DELETE 
ON ecommerce.* 
FROM 'webapp'@'localhost';
```

#### Example 2: Revoking All Privileges Simultaneously
To completely remove all privileges from an account without dropping the user identity:
```sql
-- Revoke all table-level and db-level rights
REVOKE ALL PRIVILEGES, GRANT OPTION 
FROM 'intern'@'%';
```

---

### Demystifying FLUSH PRIVILEGES: When Is It Actually Needed?

There is widespread confusion among developers regarding when to run `FLUSH PRIVILEGES;`.

#### What FLUSH PRIVILEGES Does:
It instructs the MySQL server to re-read the grant tables (`mysql.user`, `mysql.db`, `mysql.tables_priv`, etc.) from disk into memory.

#### When You DO NOT Need It:
When you modify accounts using standard Account Management statements:
- `CREATE USER`
- `ALTER USER`
- `DROP USER`
- `GRANT`
- `REVOKE`

MySQL **automatically updates in-memory privilege caches immediately** when executing these statements! Running `FLUSH PRIVILEGES` after `GRANT` or `REVOKE` is redundant.

#### When You DO Need It:
You **must** execute `FLUSH PRIVILEGES` if and only if you manually modify the underlying system tables using raw DML:
```sql
-- Manual table edit (Not recommended!):
UPDATE mysql.user SET max_connections = 50 WHERE user = 'app';

-- Must flush because MySQL was bypassed:
FLUSH PRIVILEGES;
```

---

### Auditing Privileges via Information Schema

To audit and review permissions across your cluster programmatically:

```sql
-- Check database-level permissions
SELECT * FROM information_schema.schema_privileges;

-- Check table-level permissions
SELECT * FROM information_schema.table_privileges;

-- Check column-level permissions
SELECT * FROM information_schema.column_privileges;
```

---

# Multiple Choice Questions

### 1. Which SQL statement removes previously assigned permissions from a MySQL user?
A. REMOVE
B. REVOKE
C. DENY
D. UNGRANT
**Answer:** B
**Explanation:** The REVOKE statement removes specified privileges from user accounts.
---

### 2. Is FLUSH PRIVILEGES required immediately after executing a standard GRANT or REVOKE statement?
A. Yes, always
B. No, because MySQL automatically updates its in-memory privilege structures during GRANT and REVOKE
C. Yes, but only when running on Linux
D. Yes, otherwise changes take effect only after 24 hours
**Answer:** B
**Explanation:** Standard account management statements (GRANT, REVOKE, CREATE USER) automatically refresh internal privilege caches in real time.
---

### 3. When is executing FLUSH PRIVILEGES genuinely necessary?
A. After dropping a database
B. When privileges or user accounts are modified via direct raw DML (INSERT/UPDATE) on mysql.user tables
C. Before restarting the MySQL server
D. After creating a table index
**Answer:** B
**Explanation:** FLUSH PRIVILEGES forces the server to reload grant tables from disk into memory when raw manual edits bypass standard DDL statements.
---

### 4. What happens if you try to execute REVOKE SELECT ON *.* from a user who was granted SELECT ON sales.*?
A. The grant on sales.* is automatically revoked
B. The command fails or does not affect the sales.* privilege because the scope level does not match
C. The entire user account is deleted
D. MySQL server crashes
**Answer:** B
**Explanation:** Privileges must be revoked at the exact same hierarchical scope level (global, database, table) at which they were originally granted.
---

### 5. Which statement strips all privileges and grant delegation from a user?
A. DROP PRIVILEGES FROM 'user'@'%';
B. REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'user'@'%';
C. RESET PRIVILEGES FOR 'user'@'%';
D. DELETE FROM mysql.user;
**Answer:** B
**Explanation:** REVOKE ALL PRIVILEGES, GRANT OPTION removes all active operational privileges and delegation rights from the specified user.
---
