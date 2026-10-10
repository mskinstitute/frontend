---
id: third-normal-form-3nf
slug: third-normal-form-3nf
course: sql-for-intermediate
chapter: Database Normalization & Schema Design
topic: "Third Normal Form (3NF) & Transitive Dependencies"
difficulty: Intermediate
readingTime: 12
order: 25
keywords: ["3nf","third normal form","transitive dependency","non-key dependencies","boyce codd"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Third Normal Form (3NF) & Transitive Dependencies
A table in Second Normal Form (2NF) has eliminated partial dependencies. However, data redundancy and update anomalies can still persist if non-key columns depend on *other non-key columns*. The **Third Normal Form (3NF)** eliminates these **Transitive Dependencies**.

As the famous computer science proverb states:
> *"Every non-key attribute must depend on the key, the whole key, and nothing but the key, so help me Codd."*

---

## 1. What is a Transitive Dependency?

A **Transitive Dependency** occurs when attribute A determines attribute B, and attribute B determines attribute C:
```
   A --------> B --------> C
   (Primary Key)   (Non-Key Col)   (Non-Key Col)
```
Because `A -> B` and `B -> C`, attribute **C is transitively dependent on A through B**. Non-key column C does not depend directly on the primary key!

---

## 2. The Rules of Third Normal Form (3NF)

A table is in **Third Normal Form (3NF)** if and only if:
1. It is already in **Second Normal Form (2NF)**.
2. It contains **NO Transitive Dependencies**: No non-key column can depend on another non-key column!

---

## 3. The 3NF Violation: Transitive Column Chaining

Consider an employee table with a single primary key (`emp_id`):

```
   TABLE: employees_flawed (In 2NF, but VIOLATES 3NF!)
   PRIMARY KEY: emp_id
   
   +--------+---------------+---------+--------------------+---------------------+
   | emp_id | full_name     | dept_id | dept_name          | dept_building       |
   +--------+---------------+---------+--------------------+---------------------+
   |    101 | Aarav Sharma  |       1 | Engineering        | Tech Tower 4        |
   |    102 | Diya Patel    |       1 | Engineering        | Tech Tower 4        |
   |    103 | Rohan Verma   |       2 | Human Resources    | Corporate Block A   |
   +--------+---------------+---------+--------------------+---------------------+
```

### Analyzing the Dependencies:
1. `emp_id -> dept_id`: Valid! Knowing an employee determines their department ID.
2. `dept_id -> dept_name, dept_building`: Valid! Knowing a department ID determines its name and building.
3. Therefore: `emp_id -> dept_name` is a **Transitive Dependency**!
   - Neither `dept_name` nor `dept_building` are candidate keys. They depend directly on `dept_id`, which is a non-key column in this table!

### Anomalies Caused by this 3NF Violation:
- **Update Anomaly:** If Engineering moves to *Tower 9*, you must update every single employee row in Engineering!
- **Insertion Anomaly:** You cannot create a new department unless you hire at least one employee to hold the row!
- **Deletion Anomaly:** Deleting the only HR employee wipes out the existence of the HR department and its building address!

---

## 4. The 3NF Solution: Decomposing into Master & Detail Tables

To satisfy 3NF, remove the transitively dependent attributes and place them in their own independent master table:

```sql
-- Table 1: Departments (Independent Master Entity)
CREATE TABLE departments (
    dept_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    dept_building VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

-- Table 2: Employees (Now in strict 3NF!)
CREATE TABLE employees (
    emp_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    dept_id INT UNSIGNED NOT NULL, -- Foreign Key
    
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
) ENGINE = InnoDB;
```

Now:
- Engineering's building is stored in **exactly one row** in `departments`.
- Updating it requires **one row update**.
- Departments can exist with zero employees.

---

## 5. Best Practices & Common Pitfalls

- **Calculated / Derived Columns:** Storing calculated columns (e.g., `unit_price`, `quantity`, and `total_price = unit_price * quantity`) technically violates 3NF because `total_price` depends on other non-key columns! Calculate totals dynamically in queries, or use MySQL 8.0 **Generated Columns** (`GENERATED ALWAYS AS (unit_price * quantity) STORED`).

---

# Multiple Choice Questions

### 1. What does Third Normal Form (3NF) eliminate from database tables?
A. Primary Keys
B. Transitive Dependencies (non-key columns depending on other non-key columns)
C. Foreign Keys
D. Comma-separated strings
**Answer:** B
**Explanation:** 3NF eliminates transitive functional dependencies, ensuring every non-key column depends directly and exclusively on candidate keys.
---

### 2. In an orders table with `order_id (PK)`, `customer_id`, and `customer_city`, why does `customer_city` violate 3NF?
A. Because cities cannot be stored in MySQL
B. Because customer_city depends on customer_id (a non-key column), creating a transitive dependency: order_id -> customer_id -> customer_city
C. Because city names must be numbers
D. Because order_id must be a string
**Answer:** B
**Explanation:** The customer's city depends on the customer, not on the order itself. Storing it in `orders` creates a transitive dependency that should be normalized into a `customers` table.
---

### 3. Which normal form is colloquially summarized as: "Every attribute must depend on the key, the whole key, and nothing but the key"?
A. 1NF
B. 2NF
C. 3NF
D. 5NF
**Answer:** C
**Explanation:** This phrase encapsulates: "the key" (1NF unique identifier), "the whole key" (2NF no partial dependencies), and "nothing but the key" (3NF no transitive dependencies).
---

### 4. Why does storing a `total_cost` column alongside `quantity` and `unit_price` technically violate 3NF?
A. Because multiplication is illegal in SQL
B. Because total_cost is functionally determined by other non-key attributes (quantity * unit_price) rather than directly by the primary key
C. Because floats lose precision
D. Because it breaks foreign keys
**Answer:** B
**Explanation:** Storing calculated values introduces transitive dependency on the source columns; deriving values in queries or generated columns preserves 3NF.
---

### 5. What is the primary benefit achieved by eliminating transitive dependencies?
A. Queries execute without a CPU
B. Elimination of update, insertion, and deletion anomalies when modifying secondary entity attributes
C. Automatic database backups
D. Shorter table names
**Answer:** B
**Explanation:** Eliminating transitive dependencies isolates entity attributes into dedicated tables, preventing anomalies when secondary entity data changes.
---
