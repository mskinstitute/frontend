---
id: importing-sql-scripts
slug: importing-sql-scripts
course: sql-for-beginners
chapter: Database Backup, Export & Import
topic: "Restoring Databases & Running SQL Dump Scripts"
difficulty: Beginner
readingTime: 12
order: 52
keywords: ["restoring databases","import sql script","source command","shell redirection","database restoration"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Restoring Databases & Running SQL Dump Scripts
Taking regular backups is only half the battle; knowing how to restore them under pressure during an outage or when setting up a fresh development environment is what separates junior coders from professional database engineers. In this tutorial, you will learn the standard techniques for importing and restoring SQL scripts.

---

## 1. Method 1: Restoring via Operating System Shell Redirection

The fastest and most common way to import a `.sql` dump file is using shell input redirection (**`<`**):

```bash
# Step 1: Create the target database if it does not already exist:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db;"

# Step 2: Stream the SQL dump file into the database:
mysql -u root -p ecommerce_db < ecommerce_backup.sql
```

### Restoring a Gzipped Backup:
If your backup is compressed (`.gz`), you can decompress and pipe it directly into MySQL without extracting the full file to disk first:

```bash
# Linux / macOS / Git Bash:
gunzip < ecommerce_backup.sql.gz | mysql -u root -p ecommerce_db
```

---

## 2. Method 2: Importing Inside MySQL CLI with `SOURCE`

If you are already logged into the interactive `mysql>` prompt, use the built-in **`SOURCE`** command (or shorthand **`\.`**):

```sql
-- Step 1: Select the database you want to populate
USE ecommerce_db;

-- Step 2: Execute the external script file:
SOURCE C:/Users/Public/Documents/ecommerce_backup.sql;

-- Or on Linux/macOS:
SOURCE /var/backups/ecommerce_backup.sql;
```

> [!NOTE]
> On Windows, always use forward slashes (`/`) or escaped backslashes (`\\`) in file paths inside the `SOURCE` command! Writing `C:\Users` can trigger escape character interpretation errors.

---

## 3. Method 3: Visual Import in MySQL Workbench

For visual database management:
1. Open MySQL Workbench and connect to your server.
2. In the menu, go to **Server -> Data Import**.
3. Select **"Import from Self-Contained File"** and browse to your `.sql` file.
4. Under **"Default Target Schema"**, select your destination database (or click **"New..."**).
5. Click the **"Start Import"** button in the lower right corner and monitor progress.

---

## 4. Speeding Up Massive Data Imports

When importing huge database dumps (gigabytes of data), standard execution can be slow because every inserted row checks foreign keys and recalculates secondary indexes. You can speed up imports by wrapping the session:

```sql
-- Speed up restoration of massive dumps:
SET FOREIGN_KEY_CHECKS = 0; -- Disable referential integrity checks during load
SET UNIQUE_CHECKS = 0;      -- Disable unique index checks during load
SET AUTOCOMMIT = 0;         -- Disable auto-commit per line

-- Import your script here --

COMMIT;
SET UNIQUE_CHECKS = 1;      -- Re-enable unique checks
SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key checks
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid the "No Database Selected" Error:** If your `.sql` file does not contain an explicit `USE db_name;` statement at the top, running `mysql -u root -p < file.sql` will abort with **Error 1046: No database selected**. Always specify the database name on the command line!
- **Check `max_allowed_packet` on Large Inserts:** If the backup contains giant batch insert statements, ensure the target server's `max_allowed_packet` is set large enough to receive the payload.

---

# Multiple Choice Questions

### 1. Which command-line syntax imports a file named `backup.sql` into a database named `school_db`?
A. mysql -u root -p school_db > backup.sql
B. mysql -u root -p school_db < backup.sql
C. import-mysql school_db backup.sql
D. mysqldump -u root -p school_db backup.sql
**Answer:** B
**Explanation:** The shell input redirection operator (`<`) pipes the contents of `backup.sql` into the `mysql` client targeting `school_db`.
---

### 2. Which command executed inside the interactive `mysql>` prompt executes an external SQL script file?
A. LOAD SCRIPT
B. SOURCE
C. RUN
D. INCLUDE
**Answer:** B
**Explanation:** The `SOURCE <file_path>;` command reads and executes SQL statements from an external file directly within the active MySQL session.
---

### 3. Why should Windows file paths use forward slashes (e.g. `C:/data/backup.sql`) inside the `SOURCE` command?
A. Windows does not support backslashes
B. Backslashes are interpreted as escape characters in SQL string literals unless escaped
C. Forward slashes are encrypted
D. Forward slashes are faster
**Answer:** B
**Explanation:** In SQL strings, a single backslash is an escape character; using forward slashes prevents accidental escape sequences like `\t` (tab) or `\n` (newline).
---

### 4. What is the cause of "Error 1046: No database selected" when importing a script?
A. The password was incorrect
B. The script attempted to execute table commands without specifying a target database via USE or CLI arguments
C. The MySQL server is stopped
D. The hard disk is full
**Answer:** B
**Explanation:** If the script lacks a `USE database;` statement and no default database was specified on the command line, MySQL does not know where to create the tables.
---

### 5. Why do DBAs temporarily disable `FOREIGN_KEY_CHECKS` during large database restorations?
A. To prevent tables from being encrypted
B. To allow child tables to be restored before parent tables without triggering foreign key constraint violations
C. To bypass user authentication
D. Because foreign keys are illegal in SQL dumps
**Answer:** B
**Explanation:** Disabling foreign key checks prevents dependency errors when child tables are populated before parent tables during bulk restoration, speeding up import times significantly.
---
