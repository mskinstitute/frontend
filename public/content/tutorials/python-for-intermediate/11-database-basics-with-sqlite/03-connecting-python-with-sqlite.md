---
id: python-intermediate-connecting-python-with-sqlite
slug: connecting-python-with-sqlite
course: python-for-intermediate
chapter: "11: Database Basics with SQLite"
topic: "11.3 Connecting Python with SQLite"
title: "Connecting Python with SQLite in Python"
description: "Master connecting python with sqlite in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 53
keywords:
  - python connecting python with sqlite
  - python intermediate
  - python connecting python with sqlite
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Connecting Python with SQLite

Interacting with SQLite in Python requires understanding the relationship between the **Connection**, the **Cursor**, transactions, and parameter substitution. In this topic, we examine how to execute queries safely, access results as structured mappings, and defend against critical SQL injection attacks.

---

## 1. The Core Lifecycle: Connection & Cursor

A standard SQLite session follows four stages:
1. **Connect**: Open a connection object to the database file.
2. **Cursor**: Obtain a cursor to execute SQL commands and traverse result sets.
3. **Execute & Commit**: Run SQL statements and commit data mutations.
4. **Close**: Release locks and close resources.

```python
import sqlite3

# 1. Establish connection
conn = sqlite3.connect("inventory.db")

# 2. Instantiate cursor
cursor = conn.cursor()

# 3. Execute query
cursor.execute("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL);")

# 4. Commit and close
conn.commit()
conn.close()
```

---

## 2. The Context Manager Pattern: Automatic Commit & Rollback

Python's `sqlite3.Connection` can act as a context manager. When used in a `with conn:` block:
- If all statements finish without error, Python calls `conn.commit()` automatically.
- If an exception occurs, Python calls `conn.rollback()` automatically, preserving data integrity.

```python
import sqlite3

conn = sqlite3.connect("inventory.db")

try:
    with conn:  # Automatically manages transactions
        conn.execute("INSERT INTO products (name, price) VALUES ('Monitor', 14999.0);")
        conn.execute("INSERT INTO products (name, price) VALUES ('Keyboard', 2499.0);")
        # All changes committed automatically here!
except sqlite3.DatabaseError as err:
    print(f"Transaction rolled back due to error: {err}")
finally:
    conn.close()
```

---

## 3. The Number One Security Vulnerability: SQL Injection

> **CRITICAL SECURITY WARNING:**
> **NEVER** use Python f-strings, `%` formatting, or `+` string concatenation to build SQL statements with user input!

### The Vulnerable Pattern:
```python
# FATAL SECURITY VULNERABILITY (SQL INJECTION):
malicious_input = "admin' OR '1'='1"
query = f"SELECT * FROM users WHERE username = '{malicious_input}';"
# Results in: SELECT * FROM users WHERE username = 'admin' OR '1'='1'; (Bypasses authentication!)
```

### The Secure Pythonic Solution: Parameterized Queries
Always pass parameters as a tuple using the `?` placeholder (qmark style) or dictionary keys with `:name`:

```python
import sqlite3

conn = sqlite3.connect("inventory.db")
cursor = conn.cursor()

# 1. Qmark style (Tuple of values)
safe_name = "Mechanical Keyboard"
safe_price = 3200.0
cursor.execute(
    "INSERT INTO products (name, price) VALUES (?, ?);", 
    (safe_name, safe_price)
)

# 2. Named style (Dictionary of values)
cursor.execute(
    "SELECT * FROM products WHERE price <= :max_price AND name LIKE :term;",
    {"max_price": 5000.0, "term": "%Keyboard%"}
)
```

The database engine compiles the query structure *before* inserting parameter values, making SQL injection impossible.

---

## 4. Traversing Queries: `fetchone()`, `fetchall()`, & `fetchmany()`

```python
import sqlite3

conn = sqlite3.connect("inventory.db")
cursor = conn.cursor()

cursor.execute("SELECT id, name, price FROM products;")

# 1. fetchone(): Retrieves the next single row as a tuple (or None)
first_row = cursor.fetchone()
print("First row:", first_row)  # (1, 'Monitor', 14999.0)

# 2. fetchmany(size): Retrieves a batch of rows
batch = cursor.fetchmany(5)
print(f"Fetched {len(batch)} items.")

# 3. fetchall(): Retrieves all remaining rows in result set
remaining = cursor.fetchall()
print(f"Remaining {len(remaining)} items.")

conn.close()
```

---

## 5. Modern Row Factory: Accessing Columns by Name

By default, SQLite queries return raw tuples (`row[0]`, `row[1]`). Setting `conn.row_factory = sqlite3.Row` allows accessing columns by name like a dictionary while retaining indexability:

```python
import sqlite3

conn = sqlite3.connect("inventory.db")
# Enable name-based column lookups
conn.row_factory = sqlite3.Row

cursor = conn.cursor()
cursor.execute("SELECT id, name, price FROM products LIMIT 1;")
row = cursor.fetchone()

# Access by column name!
print(f"Product #{row['id']}: {row['name']} -> ₹{row['price']:,.2f}")
print(f"Keys available: {row.keys()}")

conn.close()
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting to Call `conn.commit()`
Modifications made via `INSERT`, `UPDATE`, or `DELETE` are staged in an uncommitted transaction. If you close the connection without calling `conn.commit()`, all your changes are silently rolled back!

### 2. Forgetting to Close Connections
Always close database connections using `conn.close()` or use context managers (`with sqlite3.connect(...) as conn:`) to ensure connection handles are released properly.

---

---

## 💻 Try It Yourself: Safe Database Context Manager

### Scenario
Connect to an SQLite database file `inventory.db` using Python's `with sqlite3.connect(...) as conn:` context manager, create a `products` table, and verify automatic transaction commit.

### Complete Solution
```python
import sqlite3

with sqlite3.connect("inventory.db") as conn:
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0
        )
    """)
    # Context manager automatically commits transaction upon exit!
    print("Products table verified and transaction committed.")
```

### Expected Output
```text
Products table verified and transaction committed.
```

---

## Practice Quiz

### 1. Why should you NEVER use Python f-strings or string concatenation to build SQL queries with user input?
A. F-strings execute too slowly in loops
B. It leaves the application vulnerable to critical SQL Injection attacks
C. SQLite cannot parse curly braces
D. Python limits SQL strings to 256 characters
**Answer:** B
**Explanation:** Concatenating raw user inputs into SQL strings allows attackers to manipulate SQL syntax and bypass security or steal data (SQL Injection).
---

### 2. What symbol is used as the standard parameter placeholder in Python's `sqlite3` module?
A. `%s`
B. `?`
C. `$`
D. `@`
**Answer:** B
**Explanation:** Python's SQLite driver uses `?` (qmark style) for positional parameterized queries.
---

### 3. What does setting `conn.row_factory = sqlite3.Row` accomplish?
A. It locks the database against read operations
B. It allows query result rows to be accessed by column name (like a dictionary) in addition to numeric index
C. It converts SQLite into MongoDB
D. It automatically generates primary keys
**Answer:** B
**Explanation:** `sqlite3.Row` provides case-insensitive name-based column access along with tuple indexing.
---

### 4. What happens when a `with connection:` context manager block encounters an unhandled exception?
A. The script restarts automatically
B. The transaction is automatically rolled back (`rollback()`), undoing partial changes
C. The changes are permanently committed anyway
D. The `.db` file is deleted
**Answer:** B
**Explanation:** Using `with connection:` automatically commits on successful completion and rolls back on unhandled exceptions.
---

### 5. What does `cursor.fetchone()` return if no more records remain in the query result set?
A. `()` (Empty tuple)
B. `None`
C. Raises `StopIteration`
D. `False`
**Answer:** B
**Explanation:** `cursor.fetchone()` returns the next row as a tuple, or `None` when the result set is exhausted.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **CRUD Operations** (11: Database Basics with SQLite).

👉 **[Continue to Next Lesson: CRUD Operations →](/tutorials/python-for-intermediate/crud-operations)**
