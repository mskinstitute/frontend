---
id: python-intermediate-crud-operations
slug: crud-operations
course: python-for-intermediate
chapter: "11: Database Basics with SQLite"
topic: "11.4 CRUD Operations"
title: "CRUD Operations in Python"
description: "Master crud operations in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 54
keywords:
  - python crud operations
  - python intermediate
  - python crud operations
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# CRUD Operations in Python with SQLite

**CRUD** stands for **Create, Read, Update, and Delete**—the four foundational data manipulation operations powering nearly every software application and REST API. In this guide, we explore how to perform each operation efficiently using Python's `sqlite3` module.

---

## 1. Setting Up Our Sample Schema

Let's work with an e-commerce `products` table:

```python
import sqlite3

def get_connection():
    conn = sqlite3.connect("store.db")
    conn.row_factory = sqlite3.Row
    return conn

with get_connection() as conn:
    conn.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0
    );
    """)
```

---

## 2. CREATE: Single and Bulk Inserts

### Single Insert (`cursor.lastrowid`)

When inserting a single record, `cursor.lastrowid` retrieves the auto-generated primary key:

```python
with get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);",
        ("Wireless Ergonomic Mouse", "Electronics", 2999.0, 45)
    )
    product_id = cursor.lastrowid
    print(f"Product created with ID: {product_id}")
```

### High-Performance Bulk Inserts with `executemany()`

Avoid looping over single `execute()` statements for thousands of records. Calling **`cursor.executemany()`** executes the batch within a single optimized transaction:

```python
inventory_batch = [
    ("USB-C Fast Charger 65W", "Electronics", 1499.0, 100),
    ("Mechanical Gaming Keyboard", "Electronics", 4999.0, 25),
    ("Noise-Cancelling Headphones", "Audio", 8999.0, 15),
    ("Laptop Stand Aluminum", "Accessories", 1299.0, 60),
]

with get_connection() as conn:
    cursor = conn.cursor()
    cursor.executemany(
        "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);",
        inventory_batch
    )
    print(f"Batch inserted: {cursor.rowcount} rows added.")
```

---

## 3. READ: Querying, Filtering, and Aggregation

### Parameterized Filtering and Sorting

```python
def find_products(category: str, max_price: float):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, name, price, stock 
            FROM products 
            WHERE category = ? AND price <= ? 
            ORDER BY price ASC;
            """,
            (category, max_price)
        )
        return cursor.fetchall()

matching_items = find_products("Electronics", 3000.0)
for item in matching_items:
    print(f" - #{item['id']} {item['name']}: ₹{item['price']:,.2f} (In stock: {item['stock']})")
```

### SQL Aggregations

```python
with get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            COUNT(*) AS total_items, 
            AVG(price) AS average_price,
            MAX(price) AS highest_price
        FROM products;
    """)
    stats = cursor.fetchone()
    print(f"Total Catalog Size : {stats['total_items']}")
    print(f"Average Price      : ₹{stats['average_price']:,.2f}")
    print(f"Most Expensive     : ₹{stats['highest_price']:,.2f}")
```

---

## 4. UPDATE: Modifying Existing Records

> **Golden Rule of Database Updates:**
> Always include a specific `WHERE` clause! Omitting `WHERE` updates **every single row** in the entire table!

Check `cursor.rowcount` to verify how many rows were modified:

```python
def update_product_price(product_id: int, new_price: float) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE products SET price = ? WHERE id = ?;",
            (new_price, product_id)
        )
        # Verify if an actual row was modified
        if cursor.rowcount == 0:
            print(f"Warning: No product found with ID {product_id}.")
            return False
        else:
            print(f"Product #{product_id} price updated to ₹{new_price:,.2f}.")
            return True

update_product_price(1, 2499.0)
```

---

## 5. DELETE: Removing Records (Hard vs. Soft Deletes)

### Hard Delete (Permanent Removal)

```python
def delete_product(product_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = ?;", (product_id,))
        if cursor.rowcount > 0:
            print(f"Product #{product_id} permanently deleted.")
        else:
            print(f"Product #{product_id} not found.")

delete_product(4)
```

### Soft Delete Pattern (Industry Best Practice)

Instead of permanently wiping records from disk, enterprise applications add an `is_active` or `deleted_at` column:

```sql
-- Soft Delete: Flag record as inactive rather than deleting bytes
UPDATE products SET is_active = 0 WHERE id = 10;

-- Query only active items:
SELECT * FROM products WHERE is_active = 1;
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. SQL Injection via String Interpolation
Never format user input into SQL queries using f-strings or `%s`. Always use parameterized queries with `?` placeholders:
```python
# ❌ DANGEROUS SQL INJECTION VULNERABILITY
cursor.execute(f"SELECT * FROM users WHERE name = '{user_input}'")

# ✅ SECURE PARAMETERIZED QUERY
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
```

### 2. `UPDATE` or `DELETE` Without a `WHERE` Clause
Executing an `UPDATE` or `DELETE` statement without a `WHERE` clause modifies or deletes EVERY row in the entire table!

---

---

## 💻 Try It Yourself: Complete CRUD Lifecycle Script

### Scenario
Write an end-to-end Python script that inserts a record into an SQLite table, reads it back, updates its price, and finally deletes the record using parameterized queries.

### Complete Solution
```python
import sqlite3

with sqlite3.connect(":memory:") as conn:
    cur = conn.cursor()
    cur.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, price REAL)")
    
    # 1. CREATE
    cur.execute("INSERT INTO books (title, price) VALUES (?, ?)", ("Python Mastery", 599.0))
    book_id = cur.lastrowid
    print(f"Created Book ID: {book_id}")
    
    # 2. READ
    cur.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    print("Read Record:", cur.fetchone())
    
    # 3. UPDATE
    cur.execute("UPDATE books SET price = ? WHERE id = ?", (499.0, book_id))
    print("Updated price to ₹499.00.")
    
    # 4. DELETE
    cur.execute("DELETE FROM books WHERE id = ?", (book_id,))
    print(f"Deleted Book ID: {book_id}. Remaining records: {cur.execute('SELECT COUNT(*) FROM books').fetchone()[0]}")
```

### Expected Output
```text
Created Book ID: 1
Read Record: (1, 'Python Mastery', 599.0)
Updated price to ₹499.00.
Deleted Book ID: 1. Remaining records: 0
```

---

## Practice Quiz

### 1. Which method on a cursor should you use to insert a list of 500 records in a single batch?
A. `cursor.execute()` in a loop
B. `cursor.executemany()`
C. `cursor.insert_batch()`
D. `cursor.bulk_write()`
**Answer:** B
**Explanation:** `cursor.executemany()` executes a parameterized SQL command against all parameter sequences in a single optimized pass.
---

### 2. How can you retrieve the auto-generated primary key of the most recently inserted row?
A. `cursor.get_id()`
B. `cursor.lastrowid`
C. `cursor.fetchone()[0]`
D. `connection.primary_key`
**Answer:** B
**Explanation:** `cursor.lastrowid` contains the rowid or auto-incremented primary key of the last inserted record.
---

### 3. What cursor attribute indicates the number of rows affected by an `UPDATE` or `DELETE` statement?
A. `cursor.modified`
B. `cursor.rowcount`
C. `cursor.affected_rows`
D. `cursor.total_changes`
**Answer:** B
**Explanation:** `cursor.rowcount` reflects the number of records altered by the most recent executing statement.
---

### 4. What critical mistake happens if an `UPDATE` statement is executed without a `WHERE` clause?
A. A `SyntaxError` is raised
B. The first row in the table is updated
C. Every single row in the entire table is updated with the new value
D. Nothing happens
**Answer:** C
**Explanation:** SQL applies statements globally unless constrained by a `WHERE` filter; omitting `WHERE` modifies all records in the table.
---

### 5. What is the primary difference between a "Hard Delete" and a "Soft Delete"?
A. Hard deletes require passwords
B. Hard deletes permanently remove rows from the table, while soft deletes flag records as inactive via a status column
C. Soft deletes only work in memory
D. Hard deletes only run on Linux
**Answer:** B
**Explanation:** Hard deletion removes records completely from disk, whereas soft deletion updates a flag (e.g. `is_active = 0`), preserving historical audit trails.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project: Student Records Database** (11: Database Basics with SQLite).

👉 **[Continue to Next Lesson: Project: Student Records Database →](/tutorials/python-for-intermediate/project-student-records-database)**
