---
id: inspecting-tables
slug: inspecting-tables
course: sql-for-beginners
chapter: Table Creation & Management (DDL)
topic: "Inspecting Tables: DESCRIBE, EXPLAIN, and SHOW CREATE TABLE"
difficulty: Beginner
readingTime: 12
order: 18
keywords: ["describe table","desc","show create table","show columns","show tables","table introspection"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Inspecting Tables: DESCRIBE, EXPLAIN, and SHOW CREATE TABLE
When stepping into a new company or taking over an existing codebase, you rarely start with a clean slate. You must inspect existing database schemas, verify column data types, check nullability, examine default values, and review exact table definitions. MySQL provides three essential introspection commands: **`SHOW TABLES`**, **`DESCRIBE`**, and **`SHOW CREATE TABLE`**.

---

## 1. Listing Tables in the Active Database (`SHOW TABLES`)

To view all tables, views, and sequence objects in your active database:

```sql
SHOW TABLES;

-- Filter tables matching a specific prefix pattern:
SHOW TABLES LIKE 'user_%';
```

---

## 2. Inspecting Column Definitions with `DESCRIBE`

The **`DESCRIBE`** statement (shorthand: **`DESC`**) gives a structured overview of a table's columns:

```sql
DESCRIBE customers;
-- Or using shorthand:
DESC customers;
```

### Sample `DESCRIBE` Output:
```text
+----------------+------------------------------------------------+------+-----+-------------------+-----------------------------------------------+
| Field          | Type                                           | Null | Key | Default           | Extra                                         |
+----------------+------------------------------------------------+------+-----+-------------------+-----------------------------------------------+
| customer_id    | int unsigned                                   | NO   | PRI | NULL              | auto_increment                                |
| first_name     | varchar(50)                                    | NO   |     | NULL              |                                               |
| email          | varchar(255)                                   | NO   | UNI | NULL              |                                               |
| account_status | enum('Active','Suspended','Pending_Verificati')| NO   |     | Pending_Verificati|                                               |
| created_at     | timestamp                                      | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at     | timestamp                                      | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP  |
+----------------+------------------------------------------------+------+-----+-------------------+-----------------------------------------------+
```

### Understanding Key Indicators:
- **Field:** Column name.
- **Type:** Exact data type and length.
- **Null:** Indicates whether the column accepts `NULL` values (`YES` or `NO`).
- **Key:**
  - **`PRI`:** Primary Key.
  - **`UNI`:** Unique Key constraint.
  - **`MUL`:** Multiple (non-unique index, or the first column of a composite index).
- **Default:** Default fallback value if none is provided.
- **Extra:** Additional flags like `auto_increment` or `on update CURRENT_TIMESTAMP`.

---

## 3. Retrieving Exact DDL with `SHOW CREATE TABLE`

While `DESCRIBE` shows a tabular summary, it does not reveal foreign key constraint definitions, storage engine settings, character sets, or index names. To see the **exact SQL code** required to recreate the table from scratch:

```sql
SHOW CREATE TABLE customersG
```

### Sample Output:
```sql
*************************** 1. row ***************************
       Table: customers
Create Table: CREATE TABLE `customers` (
  `customer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `uq_customer_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

---

## 4. Querying Column Metadata via `information_schema.COLUMNS`

For automated tooling, ORMs, and reporting scripts, you can query column metadata using standard SQL:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'ecommerce_platform' 
  AND table_name = 'customers'
ORDER BY ordinal_position;
```

---

## 5. Best Practices & Common Pitfalls

- **Use `\G` with `SHOW CREATE TABLE`:** In the MySQL CLI, always end `SHOW CREATE TABLE` with `\G` instead of a semicolon. This prevents ugly text wrapping and prints the DDL cleanly!
- **Verify Key Multiplicity (`MUL`):** A `MUL` key in `DESC` output signifies that the column is indexed, but allows duplicate values. It is commonly found on foreign key columns.

---

# Multiple Choice Questions

### 1. Which shorthand command is identical to `DESCRIBE table_name;` in MySQL?
A. SHOW table_name;
B. DESC table_name;
C. EXAM table_name;
D. INFO table_name;
**Answer:** B
**Explanation:** `DESC` is the standard shorthand alias for the `DESCRIBE` statement in MySQL.
---

### 2. In the output of `DESCRIBE customers;`, what does the value `PRI` in the `Key` column signify?
A. The column has high priority for caching
B. The column is part of the table's Primary Key
C. The column is private and encrypted
D. The column was created prior to other columns
**Answer:** B
**Explanation:** `PRI` indicates that the column is the primary key or part of a composite primary key.
---

### 3. Which SQL statement reveals the exact DDL statement used to create a table, including all indexes, storage engines, and collations?
A. SHOW TABLE STRUCTURE table_name;
B. SHOW CREATE TABLE table_name;
C. DUMP DDL table_name;
D. GET TABLE CODE table_name;
**Answer:** B
**Explanation:** `SHOW CREATE TABLE` outputs the exact SQL DDL statement needed to recreate the table, complete with constraints and engine configurations.
---

### 4. What does the `MUL` indicator in the `Key` column of `DESCRIBE` output mean?
A. The column contains multiple data types
B. The column is indexed, but allows duplicate values (multiple occurrences permitted)
C. The column is multiplied by 10 on read
D. The column is a multi-lingual string
**Answer:** B
**Explanation:** `MUL` (Multiple) indicates that the column is the first column of a non-unique index that permits multiple identical values.
---

### 5. Which administrative view in `information_schema` contains exhaustive metadata for every column across all database tables?
A. information_schema.METADATA
B. information_schema.FIELDS
C. information_schema.COLUMNS
D. information_schema.TABLE_INFO
**Answer:** C
**Explanation:** The `information_schema.COLUMNS` table contains comprehensive metadata for every column in the database instance.
---
