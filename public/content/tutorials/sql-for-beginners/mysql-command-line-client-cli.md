---
id: mysql-command-line-client-cli
slug: mysql-command-line-client-cli
course: sql-for-beginners
chapter: MySQL Installation & Tooling Setup
topic: "MySQL Command-Line Client (CLI) Essentials"
difficulty: Beginner
readingTime: 12
order: 6
keywords: ["mysql cli","command line","terminal","mysql -u root -p","mysql prompt","delimiter"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# MySQL Command-Line Client (CLI) Essentials
While graphical tools like MySQL Workbench are convenient, true database professionals and backend engineers must master the **MySQL Command-Line Interface (CLI)**. Server deployments, Docker containers, remote cloud servers (AWS EC2, Google Cloud Compute), and CI/CD automated deployment pipelines interact with databases purely via terminal commands.

---

## 1. Connecting to MySQL via the CLI

To connect to a local or remote MySQL Server from your terminal:

```bash
# Connect to local server as 'root' with password prompt:
mysql -u root -p

# Connect to a specific host and port:
mysql -h 127.0.0.1 -P 3306 -u root -p

# Connect directly to a specific database:
mysql -u root -p my_database
```

When prompted, type your password. Note that on Unix/Linux systems, **no asterisks or characters are shown** while typing passwords for security. Press **Enter**.

Once successfully logged in, you will be greeted with the MySQL prompt:
```text
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.4.0 MySQL Community Server - GPL

mysql> 
```

---

## 2. Navigating the MySQL Terminal

Inside the `mysql>` prompt, every SQL statement must terminate with a semicolon (`;`) or `\G`.

```sql
-- View all existing databases:
SHOW DATABASES;

-- Switch to a database to begin working with it:
USE mysql;

-- View all tables in the active database:
SHOW TABLES;

-- Clear terminal screen (Ctrl+L or system clear):
system clear; -- On Linux/macOS
system cls;   -- On Windows
```

---

## 3. Semicolons & Multiline SQL Statements

If you press **Enter** without a semicolon, MySQL expects you to continue typing on the next line. Notice how the prompt changes:

```sql
mysql> SELECT user, host
    -> FROM mysql.user
    -> WHERE user = 'root';
```

- `mysql>`: Ready for a new command.
- `->`: Continuation of the current multiline statement.
- `'>`: Unclosed single quote waiting for closing quote.
- `">`: Unclosed double quote waiting for closing quote.
- ``>`: Unclosed backtick waiting for closing backtick.

If you make a typo and want to **cancel** the current multiline statement without executing it, type `\c` and press Enter:
```sql
mysql> SELECT * FROM wrongly_typed_table_name
    -> c
mysql> 
```

---

## 4. Vertical Output Formatting (`\G`)

When inspecting wide tables with 20+ columns, the standard horizontal table layout wraps around the terminal and becomes unreadable. In MySQL CLI, end your statement with **`\G`** (capital G) instead of a semicolon to format results **vertically**!

```sql
-- Standard horizontal output (can wrap and distort):
SELECT * FROM mysql.user LIMIT 1;

-- Vertical output (beautiful key-value list):
SELECT * FROM mysql.user LIMIT 1G
```

### Example Vertical Output:
```text
*************************** 1. row ***************************
                    Host: localhost
                    User: root
             Select_priv: Y
             Insert_priv: Y
             Update_priv: Y
```

---

## 5. Exiting the MySQL CLI

To exit the MySQL monitor and return to your operating system shell:
```sql
EXIT;
-- or
QUIT;
-- or press Ctrl+D (Unix) / Ctrl+C
```

---

# Multiple Choice Questions

### 1. Which flag in the command `mysql -u root -p` indicates that a password will be provided?
A. -P
B. -p
C. -pass
D. -pwd
**Answer:** B
**Explanation:** In the MySQL CLI command line, lowercase `-p` prompts for the user password, whereas uppercase `-P` is used to specify the port number.
---

### 2. How do you cancel an unfinished multiline command in the MySQL CLI without executing it?
A. Press ESC twice
B. Type \c and press Enter
C. Type CANCEL and press Enter
D. Close the terminal window
**Answer:** B
**Explanation:** Typing `\c` clears the current input buffer and returns you immediately to the standard `mysql>` prompt.
---

### 3. What does terminating a SQL query with `\G` instead of a semicolon accomplish in the MySQL CLI?
A. It runs the query in debug mode
B. It displays each row's columns vertically line-by-line rather than horizontally
C. It rolls back the transaction immediately
D. It saves the query to a log file
**Answer:** B
**Explanation:** Terminating with `\G` prints results vertically, presenting each column as a separate row—indispensable for inspecting wide records.
---

### 4. What does the prompt `'>` indicate in the MySQL CLI?
A. The server is disconnected
B. The command was executed successfully
C. The CLI is waiting for the user to close an opened single quote string literal
D. An error has occurred
**Answer:** C
**Explanation:** The prompt `'>` informs you that a string enclosed in single quotes was opened on a previous line and has not yet been closed.
---

### 5. Which SQL statement selects the active database you want to work with in the MySQL CLI?
A. OPEN database_name;
B. USE database_name;
C. SELECT database_name;
D. SWITCH database_name;
**Answer:** B
**Explanation:** The `USE database_name;` statement sets the default active database for subsequent SQL operations.
---
