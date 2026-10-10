---
id: foreign-key-referential-integrity
slug: foreign-key-referential-integrity
course: sql-for-beginners
chapter: Data Integrity & Table Constraints
topic: "Foreign Keys & Referential Integrity: Linking Tables Robustly"
difficulty: Beginner
readingTime: 12
order: 23
keywords: ["foreign key","referential integrity","cascade","on delete cascade","on update cascade","set null","restrict"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Foreign Keys & Referential Integrity: Linking Tables Robustly
Relational databases derive their real power from the ability to link records across multiple tables safely. A **Foreign Key** is an integrity constraint that establishes a direct parent-child relationship between two tables, ensuring that child records cannot reference non-existent parent records (**Referential Integrity**).

---

## 1. Understanding Parent and Child Tables

```
   PARENT TABLE: departments
   +---------+-------------------+
   | dept_id | dept_name         |  <-- dept_id is PRIMARY KEY
   +---------+-------------------+
   |       1 | Engineering       |
   |       2 | Human Resources   |
   +---------+-------------------+
              ^
              | Enforced by Foreign Key Constraint!
              |
   CHILD TABLE: employees
   +--------+-------------+---------+
   | emp_id | emp_name    | dept_id |  <-- dept_id is FOREIGN KEY
   +--------+-------------+---------+
   |    101 | Aarav       |       1 |  <-- Valid (References Engineering)
   |    102 | Diya        |       2 |  <-- Valid (References HR)
   |    103 | Rohan       |      99 |  <-- REJECTED! Error: Cannot add or update child row!
   +--------+-------------+---------+
```

---

## 2. Defining Foreign Key Constraints in SQL

```sql
-- Parent Table:
CREATE TABLE departments (
    dept_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

-- Child Table with Explicit Foreign Key:
CREATE TABLE employees (
    emp_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    emp_name VARCHAR(100) NOT NULL,
    dept_id INT UNSIGNED, -- Must match parent data type and unsignedness!
    
    CONSTRAINT fk_employees_departments
        FOREIGN KEY (dept_id) 
        REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;
```

---

## 3. Referential Action Rules: What Happens on Delete/Update?

When a parent row is deleted or updated in `departments`, what should happen to the corresponding child rows in `employees`? You define this behavior using **Referential Actions**:

| Action | What Happens to Child Rows when Parent is Deleted/Updated? | Typical Use Case |
| :--- | :--- | :--- |
| **`RESTRICT` / `NO ACTION`** | **Blocks** the delete/update of the parent if any child rows reference it. (Default behavior). | Preventing accidental deletion of departments that still contain active employees. |
| **`CASCADE`** | **Automatically deletes or updates** all child rows when the parent row is deleted or updated! | Deleting an `order` automatically cascades to delete all its `order_items`. |
| **`SET NULL`** | Sets the child column's value to **`NULL`** when the parent is deleted. (Child column must be nullable). | If a manager is deleted, set `manager_id = NULL` on their former reports. |
| **`SET DEFAULT`** | Sets the child column to its defined default value (rarely used in MySQL). | System fallbacks. |

```sql
-- Example: Cascading Delete for Orders and Items
CREATE TABLE orders (
    order_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_date DATE NOT NULL
);

CREATE TABLE order_items (
    item_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE -- If order 50 is deleted, all items for order 50 vanish automatically!
);
```

---

## 4. Prerequisites for Foreign Keys in MySQL

For a foreign key constraint to be successfully created:
1. Both tables **must** use the **`InnoDB`** storage engine (MyISAM ignores foreign keys!).
2. The referenced column in the parent table **must be indexed** (typically the Primary Key).
3. The data types, sign (`UNSIGNED`), and byte lengths of the foreign key and parent key **must match exactly**!

---

## 5. Best Practices & Common Pitfalls

- **Avoid Unintended Mass Deletions with CASCADE:** Be extremely cautious with `ON DELETE CASCADE`. Deleting a single customer could silently wipe out 10 years of orders, invoices, and payments if cascaded blindly!
- **Index Foreign Key Columns:** MySQL automatically creates an index on foreign key columns in child tables, ensuring that join queries and cascade checks execute rapidly.

---

# Multiple Choice Questions

### 1. What database concept guarantees that a foreign key value in a child table must point to an existing record in the parent table?
A. Domain Independence
B. Referential Integrity
C. Atomicity
D. Entity Cardinality
**Answer:** B
**Explanation:** Referential integrity ensures that relationships between tables remain consistent, preventing orphaned child records.
---

### 2. Which referential action automatically deletes all child rows when the referenced parent row is deleted?
A. ON DELETE RESTRICT
B. ON DELETE SET NULL
C. ON DELETE CASCADE
D. ON DELETE NO ACTION
**Answer:** C
**Explanation:** `ON DELETE CASCADE` instructs the database engine to automatically delete all dependent child records whenever the corresponding parent record is removed.
---

### 3. What is the default behavior if an administrator attempts to delete a parent department record while employees still reference it under `ON DELETE RESTRICT`?
A. The employees are deleted automatically
B. The query fails and throws a foreign key constraint violation error
C. The employees' department is set to 0
D. The department is archived to a CSV file
**Answer:** B
**Explanation:** `RESTRICT` prohibits the deletion of a parent record as long as any child rows reference its primary key.
---

### 4. Which storage engine must be used in MySQL for Foreign Key constraints to be actively enforced?
A. MyISAM
B. Memory
C. InnoDB
D. CSV
**Answer:** C
**Explanation:** InnoDB is the only standard MySQL storage engine that actively enforces foreign key constraints and referential actions.
---

### 5. What will happen if you attempt to create a foreign key on an `INT UNSIGNED` column pointing to a parent key defined as `INT SIGNED`?
A. MySQL automatically converts both to BIGINT
B. MySQL rejects table creation with a foreign key mismatch error
C. MySQL ignores the sign difference
D. The table creates but disables indexes
**Answer:** B
**Explanation:** Foreign key and parent key column data types must match exactly, including integer signedness (`UNSIGNED`).
---
