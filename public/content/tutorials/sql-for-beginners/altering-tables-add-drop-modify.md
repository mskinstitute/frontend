---
id: altering-tables-add-drop-modify
slug: altering-tables-add-drop-modify
course: sql-for-beginners
chapter: Table Creation & Management (DDL)
topic: "Modifying Tables with ALTER TABLE: Add, Drop, Modify, and Rename"
difficulty: Beginner
readingTime: 12
order: 19
keywords: ["alter table","add column","drop column","modify column","change column","rename table","online ddl"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Modifying Tables with ALTER TABLE: Add, Drop, Modify, and Rename
In real-world software engineering, application requirements evolve constantly. You will frequently need to add a new column to store user profile pictures, expand a character length from 50 to 100, rename a confusing column, or drop a deprecated field. All schema changes on existing tables are performed using **`ALTER TABLE`**.

---

## 1. Adding New Columns (`ADD COLUMN`)

To add a new column to an existing table:

```sql
-- Add column at the end of the table:
ALTER TABLE customers
ADD COLUMN middle_name VARCHAR(50);

-- Add column at the very beginning of the table:
ALTER TABLE customers
ADD COLUMN national_id VARCHAR(20) FIRST;

-- Add column immediately after a specific existing column:
ALTER TABLE customers
ADD COLUMN date_of_birth DATE AFTER last_name;
```

---

## 2. Removing Columns (`DROP COLUMN`)

To delete a column and all its stored data:

```sql
ALTER TABLE customers
DROP COLUMN middle_name;
```

> [!CAUTION]
> `DROP COLUMN` physically removes the data across every row in the table! This action is irreversible. Always verify that no running application code references the column before dropping it.

---

## 3. `MODIFY` vs `CHANGE`: Modifying Existing Columns

When changing column attributes, MySQL provides two distinct commands:

### `MODIFY COLUMN` (Change Data Type or Constraints, Keep Name)
Use `MODIFY` when you want to alter a column's data type, length, or nullability without changing its name:

```sql
-- Expand email column from VARCHAR(100) to VARCHAR(255):
ALTER TABLE customers
MODIFY COLUMN email VARCHAR(255) NOT NULL;
```

### `CHANGE COLUMN` (Rename Column AND Optionally Change Data Type)
Use `CHANGE` when you want to **rename** a column:

```sql
-- Syntax: ALTER TABLE tbl CHANGE old_name new_name data_type [constraints];
ALTER TABLE customers
CHANGE COLUMN phone_number contact_phone VARCHAR(25) NOT NULL;
```

> [!NOTE]
> In MySQL 8.0+, you can also use the cleaner syntax:
> `ALTER TABLE customers RENAME COLUMN phone_number TO contact_phone;`

---

## 4. Renaming Tables

You can rename a table using either `ALTER TABLE` or the standalone `RENAME TABLE` command:

```sql
-- Method 1: Using ALTER TABLE
ALTER TABLE customers RENAME TO client_accounts;

-- Method 2: Using RENAME TABLE (Supports atomic renaming of multiple tables!)
RENAME TABLE 
    old_orders TO orders_archive_2025,
    new_orders TO orders;
```

---

## 5. Adding & Dropping Constraints

```sql
-- Add a unique constraint to an existing table:
ALTER TABLE customers
ADD CONSTRAINT uq_customer_phone UNIQUE (contact_phone);

-- Drop a foreign key constraint:
ALTER TABLE orders
DROP FOREIGN KEY fk_orders_customer;

-- Drop an index:
ALTER TABLE customers
DROP INDEX uq_customer_phone;
```

---

## 6. Best Practices & Common Pitfalls

- **Online DDL & Table Locking:** On large tables (millions of rows), running `ALTER TABLE` can lock writes or rebuild the entire table on disk, causing application timeouts. Modern MySQL supports **Online DDL** (`ALGORITHM = INPLACE, LOCK = NONE`), allowing reads and writes to continue while modifications execute.
- **Shrinking Column Lengths:** Be cautious when reducing a column's width (e.g., from `VARCHAR(255)` to `VARCHAR(50)`). If any existing rows contain strings longer than 50 characters, MySQL in strict mode will abort with an error!

---

# Multiple Choice Questions

### 1. Which clause adds a new column immediately following an existing column named `last_name`?
A. INSERT AFTER last_name
B. AFTER last_name
C. BEHIND last_name
D. NEXT TO last_name
**Answer:** B
**Explanation:** In MySQL's `ALTER TABLE ... ADD COLUMN` syntax, the `AFTER <column_name>` clause specifies the precise position for the new column.
---

### 2. What is the key difference between `MODIFY COLUMN` and `CHANGE COLUMN` in MySQL?
A. MODIFY can only delete columns; CHANGE can only create columns
B. MODIFY alters data type/constraints while keeping the column name; CHANGE can rename the column as well as alter its definition
C. CHANGE is only supported in SQLite
D. MODIFY only works on primary keys
**Answer:** B
**Explanation:** `MODIFY COLUMN` changes a column's definition without altering its name. `CHANGE COLUMN` requires specifying both old and new names, allowing column renaming and redefinition simultaneously.
---

### 3. Which modern MySQL 8.0+ statement renames an existing column `phone` to `mobile_phone` cleanly?
A. UPDATE COLUMN phone SET NAME = 'mobile_phone';
B. ALTER TABLE users RENAME COLUMN phone TO mobile_phone;
C. RENAME users.phone AS mobile_phone;
D. MOVE COLUMN phone TO mobile_phone;
**Answer:** B
**Explanation:** MySQL 8.0 introduced the simplified `ALTER TABLE ... RENAME COLUMN old_name TO new_name;` statement.
---

### 4. What occurs if you attempt to alter a `VARCHAR(100)` column to `VARCHAR(20)` when existing rows contain 40-character strings in strict SQL mode?
A. The existing strings are automatically truncated without warning
B. MySQL aborts the operation and throws an error to prevent data loss
C. The table is converted to a temporary file
D. The rows are permanently deleted
**Answer:** B
**Explanation:** Under strict SQL mode (`STRICT_TRANS_TABLES`), any schema modification that would result in truncation or data loss is aborted with an error.
---

### 5. Why is the standalone `RENAME TABLE` statement favored when performing zero-downtime database deployments?
A. It restarts the server
B. It can rename multiple tables in a single atomic transaction
C. It compresses data by 90%
D. It bypasses user permission checks
**Answer:** B
**Explanation:** `RENAME TABLE old TO archive, staging TO production;` executes atomically within a single operation, enabling instantaneous zero-downtime table swaps.
---
