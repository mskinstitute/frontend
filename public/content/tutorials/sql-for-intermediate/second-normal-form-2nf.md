---
id: second-normal-form-2nf
slug: second-normal-form-2nf
course: sql-for-intermediate
chapter: Database Normalization & Schema Design
topic: "Second Normal Form (2NF) & Functional Dependencies"
difficulty: Intermediate
readingTime: 12
order: 24
keywords: ["2nf","second normal form","functional dependency","partial dependency","composite key normalization"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Second Normal Form (2NF) & Functional Dependencies
Once a table achieves First Normal Form (1NF), it must be evaluated for **Second Normal Form (2NF)**. Second Normal Form eliminates **Partial Functional Dependencies**, ensuring that every non-key column depends on the **entire** primary key, rather than just a portion of it.

---

## 1. What is a Functional Dependency?

In relational database theory, a **Functional Dependency** (`X -> Y`) means that the value of attribute **X** uniquely determines the value of attribute **Y**.
- If you know an employee's `employee_id` (X), you can uniquely determine their `email` (Y). We write: `employee_id -> email`.

---

## 2. The Rules of Second Normal Form (2NF)

A table is in **Second Normal Form (2NF)** if and only if:
1. It is already in **First Normal Form (1NF)**.
2. It contains **NO Partial Dependencies**: Every non-key column must depend on the **entire Primary Key**!

> [!IMPORTANT]
> **Key Architectural Insight:**
> If a table has a **single-column Primary Key** (e.g., `user_id INT PRIMARY KEY`), it is **AUTOMATICALLY in 2NF**! Partial dependencies can **ONLY** occur in tables that have a **Composite Primary Key** (a key composed of two or more columns).

---

## 3. The 2NF Violation: A Partial Dependency

Consider a junction table tracking student course enrollments where the Primary Key is the composite pair: **`(student_id, course_id)`**:

```
   TABLE: enrollments_flawed (In 1NF, but VIOLATES 2NF!)
   PRIMARY KEY: (student_id, course_id)
   
   +------------+-----------+----------------+----------------+-------+
   | student_id | course_id | course_name    | instructor_name| grade |
   +------------+-----------+----------------+----------------+-------+
   |        101 |       CS1 | Python Mastery | Dr. Ramesh     | A     |
   |        102 |       CS1 | Python Mastery | Dr. Ramesh     | B+    |
   |        101 |       WD2 | Web Designing  | Prof. Amit     | A-    |
   +------------+-----------+----------------+----------------+-------+
```

### Analyzing the Dependencies:
1. `grade`: Does `grade` depend on `student_id` alone? No (a student has multiple grades). Does it depend on `course_id` alone? No. It depends on **both** `(student_id, course_id)`. **This is a FULL functional dependency!**
2. `course_name` & `instructor_name`: Does `course_name` depend on `student_id`? **NO!** It depends **ONLY on `course_id`**!
   - Because `course_name` depends on only a *part* of the composite primary key (`course_id`), this is a **Partial Dependency**!

---

## 4. The 2NF Solution: Decomposing into Two Tables

To achieve 2NF, remove the partially dependent columns and place them into a separate table where `course_id` serves as the primary key:

```sql
-- Table 1: Courses (Eliminates partial dependency!)
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    instructor_name VARCHAR(100) NOT NULL
);

-- Table 2: Student Course Enrollments (Now in 2NF!)
CREATE TABLE student_enrollments (
    student_id INT UNSIGNED NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    grade CHAR(2) DEFAULT NULL,
    
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_se_course FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

---

## 5. Best Practices & Common Pitfalls

- **Surrogate Keys Do Not Automatically Fix Schema Flaws:** Some developers mistakenly believe that adding an auto-increment `id INT PRIMARY KEY` to a flawed composite table "fixes" 2NF. While it technically satisfies 2NF syntactically, the underlying semantic redundancy still exists! You must still decompose the tables.

---

# Multiple Choice Questions

### 1. What does Second Normal Form (2NF) specifically eliminate?
A. Comma-separated values
B. Partial Functional Dependencies
C. Foreign Keys
D. Duplicate rows
**Answer:** B
**Explanation:** 2NF requires that all non-key attributes depend fully on the complete primary key, eliminating partial dependencies.
---

### 2. Can a table with a single-column Primary Key violate Second Normal Form (assuming it is in 1NF)?
A. Yes, always
B. No, because partial dependencies can only exist when a primary key is composite (multi-column)
C. Only if the primary key is a string
D. Only in MySQL
**Answer:** B
**Explanation:** A partial dependency requires a subset of a candidate key; in a single-column primary key, no proper sub-parts exist, making partial dependency impossible.
---

### 3. In a table with composite primary key `(order_id, product_id)`, which column represents a partial dependency?
A. quantity (how many units of this product were ordered)
B. product_name (the title of the product)
C. discount_percentage (applied to this line item)
D. unit_price_charged
**Answer:** B
**Explanation:** `product_name` depends exclusively on `product_id` regardless of the `order_id`, making it partially dependent on the composite key.
---

### 4. What does the functional dependency notation `A -> B` mean?
A. A is greater than B
B. The value of attribute A uniquely determines the value of attribute B
C. A is a foreign key pointing to B
D. A and B are identical columns
**Answer:** B
**Explanation:** `A -> B` denotes that attribute B is functionally dependent on A, meaning each value of A maps to exactly one value of B.
---

### 5. How is a table violating 2NF brought into full 2NF compliance?
A. By converting all text columns to INT
B. By extracting partially dependent attributes into a separate table where their determinant acts as the primary key
C. By deleting rows containing NULLs
D. By adding a trigger
**Answer:** B
**Explanation:** 2NF is achieved by decomposing the table, moving partially dependent columns into their own table keyed by the sub-part of the composite key.
---
