---
id: one-to-many-relationships
slug: one-to-many-relationships
course: sql-for-intermediate
chapter: Multi-Table Relationships & Relational Design
topic: "One-to-Many (1:N) Relationships: The Backbone of Relational Modeling"
difficulty: Intermediate
readingTime: 12
order: 2
keywords: ["one to many","1:n relationship","foreign key placement","parent child tables","referential actions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# One-to-Many (1:N) Relationships: The Backbone of Relational Modeling
The **One-to-Many (1:N)** relationship is the single most ubiquitous structural pattern in relational database design. A department employs many workers, a customer places many orders, a blog author writes many posts, and a class has many students. In every case, a single record in the **Parent Table** correlates to zero, one, or hundreds of records in the **Child Table**.

---

## 1. The Cardinal Rule of 1:N Relationships

> [!CRITICAL]
> **Where does the Foreign Key go?**
> The Foreign Key **ALWAYS** resides on the **"Many" (Child) side** of the relationship, pointing back to the Primary Key of the **"One" (Parent) side**!

```
   ONE SIDE (Parent): departments
   +---------+--------------------+
   | dept_id | dept_name          |  <-- dept_id is PRIMARY KEY
   +---------+--------------------+
   |       1 | Engineering        |
   |       2 | Sales              |
   +---------+--------------------+
              ^
              | 1 : N Relationship
              |
   MANY SIDE (Child): employees (FK: dept_id)
   +--------+----------------+---------+
   | emp_id | emp_name       | dept_id |  <-- Foreign Key points to parent!
   +--------+----------------+---------+
   |    101 | Aarav Sharma   |       1 |  <-- Belongs to Engineering
   |    102 | Diya Patel     |       1 |  <-- Belongs to Engineering
   |    103 | Rohan Verma    |       1 |  <-- Belongs to Engineering
   |    104 | Kabir Mehta    |       2 |  <-- Belongs to Sales
   +--------+----------------+---------+
```

---

## 2. DDL Implementation with Referential Actions

Let us build a complete e-commerce relationship: **Customers (1) -> Orders (N)**:

```sql
-- Parent Table: Customers (The "One" side)
CREATE TABLE customers (
    customer_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- Child Table: Orders (The "Many" side)
CREATE TABLE orders (
    order_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL, -- The Foreign Key
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
    
    -- Establishing Foreign Key Constraint:
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT -- Do not allow deleting a customer who has orders!
        ON UPDATE CASCADE  -- If customer_id changes, update orders automatically!
) ENGINE = InnoDB;
```

---

## 3. Querying 1:N Relationships

### Joining Parent and Child:
```sql
SELECT 
    c.customer_name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

### Aggregating across the 1:N Boundary:
```sql
-- How many orders has each customer placed, and what is their lifetime spend?
SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS total_orders_placed,
    IFNULL(SUM(o.total_amount), 0.00) AS total_lifetime_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY total_lifetime_spent DESC;
```

---

## 4. Identifying Orphaned Child Rows

In poorly maintained legacy databases where foreign keys were omitted, child tables frequently contain **orphaned records** (child rows pointing to non-existent parent IDs). You can detect them using a `LEFT JOIN`:

```sql
-- Find orders whose customer has vanished from the customers table:
SELECT o.order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

---

## 5. Best Practices & Common Pitfalls

- **Always Index the Foreign Key:** While MySQL automatically indexes foreign keys in child tables, ensure composite indexes align with your query filters (e.g., `INDEX idx_cust_date (customer_id, order_date)`).
- **Careful with RESTRICT vs CASCADE:** While `ON DELETE CASCADE` is convenient, in accounting and billing, deleting a customer must **never** delete historical financial transactions. Always use `ON DELETE RESTRICT` for financial records.

---

# Multiple Choice Questions

### 1. In a One-to-Many (1:N) relationship between `authors` and `books`, which table must contain the Foreign Key column?
A. The authors table
B. The books table (the "Many" side)
C. A third junction table
D. Neither table
**Answer:** B
**Explanation:** In a 1:N relationship, the foreign key always resides on the "Many" side (books), storing the primary key of the "One" side (author).
---

### 2. What referential action prevents an administrator from deleting a customer if that customer has existing order records?
A. ON DELETE CASCADE
B. ON DELETE SET NULL
C. ON DELETE RESTRICT
D. ON DELETE IGNORE
**Answer:** C
**Explanation:** `ON DELETE RESTRICT` (or `NO ACTION`) actively halts and rejects the deletion of a parent record as long as associated child records exist.
---

### 3. What is an "orphaned" row in a child table?
A. A row that contains encrypted text
B. A child record whose foreign key references a parent ID that no longer exists in the parent table
C. A row with a null primary key
D. A row that was created more than 10 years ago
**Answer:** B
**Explanation:** An orphaned row is a child record pointing to a non-existent parent, caused by missing foreign key constraints or uncoordinated manual deletions.
---

### 4. Which query pattern detects orphaned records in a child table `orders` that has no matching `customers` parent?
A. orders JOIN customers ON orders.id = customers.id
B. orders LEFT JOIN customers ON orders.customer_id = customers.customer_id WHERE customers.customer_id IS NULL
C. orders CROSS JOIN customers
D. SELECT * FROM orders WHERE customer_id = 0
**Answer:** B
**Explanation:** A `LEFT JOIN` paired with `WHERE parent.id IS NULL` isolates child records that failed to match any parent record.
---

### 5. Why should aggregate queries joining a 1:N relationship (e.g. Customers to Orders) use `LEFT JOIN` instead of `INNER JOIN` when generating customer reports?
A. LEFT JOIN runs 10x faster
B. To ensure customers who have placed zero orders are still included in the report with a count of 0
C. INNER JOIN deletes unmatched customers
D. LEFT JOIN eliminates duplicates automatically
**Answer:** B
**Explanation:** An `INNER JOIN` would silently omit customers with zero orders; a `LEFT JOIN` retains them so `COUNT(order_id)` reports 0.
---
