---
id: selecting-and-dropping-databases
slug: selecting-and-dropping-databases
course: sql-for-beginners
chapter: Database Administration Basics (MySQL DDL)
topic: "Selecting & Dropping Databases: USE & DROP DATABASE"
difficulty: Beginner
readingTime: 12
order: 10
keywords: ["use database","drop database","select database()","delete database","drop schema","database context"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Selecting & Dropping Databases: USE & DROP DATABASE
Once databases are created, you must know how to switch your session's working context using the **`USE`** statement, verify your active database context, and safely remove unneeded schemas using **`DROP DATABASE`**.

---

## 1. Setting the Active Database (`USE`)

In SQL, queries need to know which database your tables belong to. The `USE` statement sets the **current default database** for the active client connection session:

```sql
USE ecommerce_platform;
```

Once selected, any query you execute without a schema prefix automatically targets that database:
```sql
-- Target is ecommerce_platform.customers:
SELECT * FROM customers;
```

### Accessing Tables Across Multiple Databases
Even if your active session is set to `ecommerce_platform`, you can still query tables in another database without switching by using **dot notation** (`database_name.table_name`):

```sql
-- Query across databases simultaneously:
SELECT o.order_id, c.customer_name 
FROM ecommerce_platform.orders o
JOIN crm_system.customers c ON o.customer_id = c.customer_id;
```

---

## 2. Checking the Current Active Database

To verify which database is currently selected in your session, call the built-in function **`DATABASE()`**:

```sql
SELECT DATABASE();
```

If no database has been selected yet (e.g., right after logging into the CLI), `SELECT DATABASE();` returns **`NULL`**.

---

## 3. Permanently Removing a Database (`DROP DATABASE`)

When a project is decommissioned or test data needs cleanup, you remove the database using `DROP DATABASE`:

```sql
DROP DATABASE database_name;
```

### Production Safe Syntax:
```sql
-- Safe removal check:
DROP DATABASE IF EXISTS test_staging_db;
```

> [!WARNING]
> `DROP DATABASE` is **immediate, permanent, and irrevocable**! It physically deletes the database directory on disk, destroying all tables, indexes, data rows, views, and stored routines. It **cannot** be undone by a `ROLLBACK` statement!

---

## 4. Difference: `DROP DATABASE` vs `DROP SCHEMA`

In MySQL, the keywords **`DATABASE`** and **`SCHEMA`** are completely interchangeable synonyms:

```sql
-- These two statements perform the exact same operation in MySQL:
DROP DATABASE IF EXISTS temp_db;
DROP SCHEMA IF EXISTS temp_db;
```

---

## 5. Best Practices & Common Pitfalls

- **Triple-Check Before Dropping:** Always run `SELECT DATABASE();` or verify your active connection host before issuing `DROP DATABASE` to ensure you are not accidentally connected to production!
- **Drop Rights Restriction:** In corporate organizations, revoke the `DROP` privilege from normal development users. Only Senior DBAs should possess the permission to drop databases.
- **Always Keep Backups:** Never drop any non-trivial database without verifying that an up-to-date `mysqldump` backup exists.

---

# Multiple Choice Questions

### 1. Which SQL command sets the active default database for the current connection session?
A. CONNECT database_name;
B. USE database_name;
C. SELECT database_name;
D. ACTIVATE database_name;
**Answer:** B
**Explanation:** The `USE database_name;` statement designates the default schema for all subsequent unqualified table queries.
---

### 2. Which built-in function returns the name of the currently active database in your session?
A. CURRENT_SCHEMA
B. DATABASE()
C. ACTIVE_DB()
D. GET_DB()
**Answer:** B
**Explanation:** `SELECT DATABASE();` returns the string name of the active default database, or `NULL` if no database has been selected.
---

### 3. What happens to the underlying tables and data rows when `DROP DATABASE` is executed?
A. Tables are moved to a temporary recycle bin for 30 days
B. All tables, rows, indexes, and database files are permanently and irreversibly deleted from disk
C. Only tables are deleted; data rows remain cached in RAM
D. The database is put into read-only mode
**Answer:** B
**Explanation:** `DROP DATABASE` physically and irrevocably removes the database directory and all contained table files from the storage engine.
---

### 4. Can a `DROP DATABASE` operation be undone using a standard SQL `ROLLBACK` command?
A. Yes, within 5 minutes
B. Yes, if autocommit is disabled
C. No, DDL statements in MySQL trigger an implicit commit and cannot be rolled back
D. Yes, if using the InnoDB engine
**Answer:** C
**Explanation:** In MySQL, Data Definition Language (DDL) operations execute an implicit commit immediately before and after execution, making rollbacks impossible.
---

### 5. In MySQL syntax, how do the statements `DROP DATABASE db_name;` and `DROP SCHEMA db_name;` compare?
A. DROP SCHEMA only deletes views, while DROP DATABASE deletes tables
B. They are completely identical synonyms in MySQL
C. DROP SCHEMA requires root permissions, while DROP DATABASE does not
D. DROP SCHEMA is only supported in SQLite
**Answer:** B
**Explanation:** In MySQL, the terms `SCHEMA` and `DATABASE` are 100% interchangeable syntactic synonyms.
---
