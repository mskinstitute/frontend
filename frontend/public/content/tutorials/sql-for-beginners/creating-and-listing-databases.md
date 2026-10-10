---
id: creating-and-listing-databases
slug: creating-and-listing-databases
course: sql-for-beginners
chapter: Database Administration Basics (MySQL DDL)
topic: "Creating & Listing Databases: MySQL DDL Administration"
difficulty: Beginner
readingTime: 12
order: 9
keywords: ["create database","show databases","ddl","data definition language","database naming conventions","information_schema"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Creating & Listing Databases: MySQL DDL Administration
In MySQL, a **Database** (synonymous with a **Schema**) is the highest-level logical container that houses your tables, views, stored procedures, and triggers. Before creating any tables or storing customer records, you must master the fundamental **Data Definition Language (DDL)** commands for creating and inspecting databases.

---

## 1. Listing Existing Databases (`SHOW DATABASES`)

To view all databases currently present on your MySQL server instance:

```sql
SHOW DATABASES;
```

### Understanding System Databases in MySQL
When you execute `SHOW DATABASES;` on a fresh MySQL instance, you will notice several default system databases:
- **`information_schema`:** A virtual metadata database providing read-only tables describing table structures, column types, and server privileges.
- **`mysql`:** The internal administrative core storing user accounts, password hashes, and global access permissions.
- **`performance_schema`:** An engine that monitors low-level server performance metrics, mutex latencies, and thread execution timings.
- **`sys`:** A set of user-friendly administrative views built on top of `performance_schema` for DBAs.

> [!CAUTION]
> Never manually delete or directly modify tables in the `mysql` or `information_schema` system databases!

---

## 2. Creating Databases (`CREATE DATABASE`)

The basic syntax to create a new database is:

```sql
CREATE DATABASE database_name;
```

### Production-Grade Database Creation
In production environments, you should always include character set specifications and safety checks:

```sql
-- Production Best Practice:
CREATE DATABASE IF NOT EXISTS ecommerce_platform
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### Key Syntax Elements:
1. **`IF NOT EXISTS`:** Prevents an error from halting your script if the database already exists.
2. **`CHARACTER SET utf8mb4`:** Guarantees full 4-byte UTF-8 encoding (mandatory for supporting all international scripts, Hindi/Devanagari, mathematical symbols, and modern emojis).
3. **`COLLATE utf8mb4_unicode_ci`:** Defines the alphabetical sorting and comparison rules (case-insensitive Unicode standard).

---

## 3. Database Naming Conventions

When naming databases, adhere strictly to industry standards:
- **Use Snake Case:** Always use lowercase letters separated by underscores (`my_company_db` rather than `MyCompanyDb`).
- **Operating System Case Sensitivity:** On Linux, MySQL database names correspond directly to directory names on the filesystem, making them **case-sensitive**! On Windows, they are case-insensitive. Using strictly lowercase prevents cross-platform migration headaches.
- **Avoid Reserved Keywords:** Never name a database using SQL reserved words like `select`, `table`, or `database`. If necessary, wrap names in backticks (``` `database` ```).

---

## 4. Querying Database Metadata from `information_schema`

Instead of just running `SHOW DATABASES;`, you can query the database list with standard SQL filters:

```sql
-- Query all user databases excluding system schemas:
SELECT schema_name, default_character_set_name, default_collation_name
FROM information_schema.schemata
WHERE schema_name NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys');
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid the Default Character Set (latin1):** Older MySQL tutorials default to `latin1` or `utf8` (which in MySQL was limited to 3-byte characters). Always explicitly specify `utf8mb4`.
- **Idempotent Migration Scripts:** Always guard database creation statements with `IF NOT EXISTS` in CI/CD migration scripts.

---

# Multiple Choice Questions

### 1. Which SQL statement lists all databases available on the current MySQL server?
A. LIST ALL DATABASES;
B. SHOW DATABASES;
C. GET SCHEMAS;
D. DISPLAY DATABASES;
**Answer:** B
**Explanation:** `SHOW DATABASES;` is the standard administrative command used to view all databases available to the connected user.
---

### 2. Why is `utf8mb4` preferred over older `utf8` (utf8mb3) encoding in MySQL?
A. utf8mb4 is 50% faster
B. utf8mb4 supports full 4-byte Unicode characters, including all international scripts and emojis
C. utf8mb4 only supports numbers
D. utf8mb4 eliminates the need for primary keys
**Answer:** B
**Explanation:** MySQL's historic `utf8` encoding only supported up to 3-byte characters, failing on 4-byte Unicode symbols such as emojis and rare characters. `utf8mb4` provides full Unicode compliance.
---

### 3. Which system database contains read-only metadata views detailing tables, columns, and constraints across all databases?
A. information_schema
B. mysql_temp
C. dev_schema
D. performance_data
**Answer:** A
**Explanation:** The `information_schema` database contains views detailing schema definitions, columns, data types, indexes, and privileges across the server.
---

### 4. Why should database names always be written in lowercase characters with underscores (snake_case)?
A. MySQL CLI does not recognize uppercase letters
B. On Linux systems, database names correspond to underlying directory names and are case-sensitive
C. Uppercase names consume double the memory
D. Lowercase names are required by ANSI SQL-92
**Answer:** B
**Explanation:** On Linux hosts, MySQL creates a directory corresponding to each database. Because Linux filesystems are case-sensitive, inconsistent casing causes cross-platform migration errors.
---

### 5. What is the function of the `COLLATE` clause when creating a database?
A. It compresses table files on disk
B. It defines the character sorting and comparison rules (e.g., case-insensitive comparisons)
C. It sets the maximum number of tables allowed
D. It specifies the database backup frequency
**Answer:** B
**Explanation:** A collation defines how character strings are compared and sorted, including rules for case-sensitivity (such as `_ci` for case-insensitive) and accent-sensitivity.
---
