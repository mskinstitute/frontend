---
id: granting-privileges
slug: granting-privileges
course: sql-for-intermediate
chapter: MySQL User Management & Security
topic: "Granting Privileges (GRANT Statement)"
difficulty: Intermediate
readingTime: 13
order: 44
keywords: ["grant statement","mysql privileges","least privilege","grant select","with grant option"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Granting Privileges (GRANT Statement)
Creating a user account is only the first step. By default, a newly created MySQL user has zero privileges and cannot even view or query user databases.

The **`GRANT`** statement assigns specific operational permissions to user accounts at granular levels: **Global**, **Database**, **Table**, or **Column**.

---

### Privilege Levels in MySQL

MySQL's privilege hierarchy operates on four distinct scopes:

1. **Global Level (`*.*`):** Privileges apply to all databases on the MySQL server (e.g., `SUPER`, `RELOAD`, `SHUTDOWN`).
2. **Database Level (`db_name.*`):** Privileges apply to all tables within a specific database (e.g., `SELECT`, `INSERT`, `CREATE`, `DROP`).
3. **Table Level (`db_name.table_name`):** Privileges apply strictly to a single designated table.
4. **Column Level (`SELECT (col1, col2) ON db.table`):** Privileges apply strictly to specified columns within a table.

---

### The GRANT Statement Syntax

```sql
GRANT privilege_list 
ON database_name.table_name 
TO 'username'@'hostname'
[WITH GRANT OPTION];
```

---

### Practical Real-World GRANT Scenarios

#### Scenario 1: Read-Only Reporting Analyst
```sql
-- Grant read-only SELECT on all tables in ecommerce database
GRANT SELECT 
ON ecommerce.* 
TO 'bi_analyst'@'192.168.10.%';
```

#### Scenario 2: Web Application Backend
Backend application servers usually require CRUD operations on tables, but should never have permissions to drop tables or databases:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE 
ON ecommerce.* 
TO 'webapp'@'localhost';
```

#### Scenario 3: Column-Level Masking
Suppose an external contractor needs to update inventory prices, but should not see cost margins:
```sql
GRANT SELECT (product_id, sku, product_name, retail_price), 
      UPDATE (retail_price) 
ON ecommerce.products 
TO 'contractor'@'%';
```

#### Scenario 4: Senior DBA with Full Administrative Access
```sql
-- Grant all privileges across the entire database instance
GRANT ALL PRIVILEGES 
ON *.* 
TO 'dba_lead'@'localhost' 
WITH GRANT OPTION;
```

---

### The Meaning of WITH GRANT OPTION

Appending **`WITH GRANT OPTION`** allows the recipient user to grant their own assigned privileges to other users!

> **Warning:** Never assign `WITH GRANT OPTION` to regular application users. Reserve it exclusively for database administrators.

---

### Inspecting Assigned Privileges

To check the exact permissions granted to an account:

```sql
-- Show privileges for current session user
SHOW GRANTS;

-- Show privileges for a specific user account
SHOW GRANTS FOR 'webapp'@'localhost';
```

---

# Multiple Choice Questions

### 1. Which SQL command assigns permissions to a MySQL user account?
A. ASSIGN
B. PERMIT
C. GRANT
D. ALLOW
**Answer:** C
**Explanation:** The GRANT statement assigns privileges to specified user accounts on database objects.
---

### 2. What scope is targeted by GRANT SELECT ON sales.* TO 'user'@'localhost';?
A. All tables across all databases on the server
B. Only the sales table in the current schema
C. All tables and views within the sales database
D. Only columns named sales
**Answer:** C
**Explanation:** The syntax db_name.* grants privileges across all tables within the designated database.
---

### 3. What does the WITH GRANT OPTION clause allow a user to do?
A. Execute DDL statements without transactions
B. Grant their own assigned privileges to other database users
C. Reset the root administrative password
D. Access tables without entering a password
**Answer:** B
**Explanation:** WITH GRANT OPTION confers the ability to delegate and grant one's privileges to other accounts.
---

### 4. Which command reveals the exact privileges assigned to a user account?
A. DESCRIBE USER 'app'@'localhost';
B. SHOW GRANTS FOR 'app'@'localhost';
C. EXPLAIN PRIVILEGES 'app';
D. SELECT * FROM user_grants;
**Answer:** B
**Explanation:** SHOW GRANTS FOR 'user'@'host' outputs the active privilege grant statements for that account.
---

### 5. Why should production web applications NOT be granted DROP or ALTER permissions?
A. Web applications run slower when given administrative rights
B. To enforce the Principle of Least Privilege and protect against SQL injection destroying schemas
C. MySQL blocks web connections that hold DDL permissions
D. DROP statements cannot be indexed
**Answer:** B
**Explanation:** Following the Principle of Least Privilege prevents catastrophic data loss if an application vulnerability or SQL injection occurs.
---
