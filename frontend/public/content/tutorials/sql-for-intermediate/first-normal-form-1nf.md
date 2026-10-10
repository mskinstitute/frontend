---
id: first-normal-form-1nf
slug: first-normal-form-1nf
course: sql-for-intermediate
chapter: Database Normalization & Schema Design
topic: "First Normal Form (1NF): Atomic Values & Repeating Groups"
difficulty: Intermediate
readingTime: 12
order: 23
keywords: ["1nf","first normal form","atomicity","repeating groups","normalization rules","atomic columns"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# First Normal Form (1NF): Atomic Values & Repeating Groups
**Database Normalization** is a systematic theoretical technique developed by Dr. Edgar F. Codd to evaluate and refine relational table structures. Normalization organizes database schemas into progressive levels called **Normal Forms** (1NF, 2NF, 3NF, BCNF). 

The journey to an enterprise-grade schema begins with the **First Normal Form (1NF)**.

---

## 1. The Rules of First Normal Form (1NF)

A relational table is in **First Normal Form (1NF)** if and only if it satisfies three strict criteria:

1. **Atomic Values:** Every column must contain atomic (indivisible), single values. No cell can contain lists, sets, arrays, or comma-separated values!
2. **No Repeating Groups (Positional Columns):** A table cannot use multiple numbered columns to store the same attribute (e.g., `phone_1`, `phone_2`, `phone_3`).
3. **Unique Rows & Primary Key:** Each row must be uniquely identifiable via an explicit Primary Key.

---

## 2. Violation 1: Non-Atomic Comma-Separated Values

```
   VIOLATING TABLE (Not in 1NF):
   +------------+--------------+---------------------------------------+
   | student_id | student_name | phone_numbers                         |  <-- NON-ATOMIC!
   +------------+--------------+---------------------------------------+
   |        101 | Aarav        | 9820011111, 9820022222, 9820033333   |
   |        102 | Diya         | 9820044444                            |
   +------------+--------------+---------------------------------------+
```

### Why this is a Disaster:
- How do you query: *"Find the student with phone number 9820022222"*? You are forced to use slow, unindexed pattern matching (`LIKE '%9820022222%'`).
- How do you delete just the second phone number? You must write complex string manipulation code in your application layer!
- How do you enforce a `UNIQUE` constraint on phone numbers? **You can't!**

---

## 3. Violation 2: Repeating Groups (Column Proliferation)

Some developers attempt to fix comma-separated values by adding numbered columns:

```
   STILL VIOLATING 1NF (Repeating Groups):
   +------------+--------------+------------+------------+------------+
   | student_id | student_name | phone_1    | phone_2    | phone_3    |  <-- REPEATING GROUPS!
   +------------+--------------+------------+------------+------------+
   |        101 | Aarav        | 9820011111 | 9820022222 | 9820033333 |
   |        102 | Diya         | 9820044444 | NULL       | NULL       |
   +------------+--------------+------------+------------+------------+
```

### Why Repeating Groups Are Bad:
- Wastes disk space with endless `NULL` columns for users with only 1 phone number.
- What happens when a user has **4 phone numbers**? You must execute an expensive `ALTER TABLE` migration to add `phone_4`!
- Searching for a phone number requires searching across all 3 columns:
  `WHERE phone_1 = 'x' OR phone_2 = 'x' OR phone_3 = 'x'`.

---

## 4. The 1NF Solution: Decomposition into a Child Table

To bring the schema into 1NF, separate the repeating attribute into its own dedicated child table where **each value occupies its own row**:

```sql
-- Table 1: Core Entity
CREATE TABLE students (
    student_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL
);

-- Table 2: Normalized Child Table (1NF Compliant!)
CREATE TABLE student_phones (
    phone_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    student_id INT UNSIGNED NOT NULL,
    phone_type ENUM('Mobile', 'Home', 'Work') NOT NULL DEFAULT 'Mobile',
    phone_number VARCHAR(20) NOT NULL,
    
    CONSTRAINT uq_phone UNIQUE (phone_number),
    CONSTRAINT fk_phone_student FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
);
```

---

## 5. Best Practices & Common Pitfalls

- **Names and Addresses Atomicity:** Be careful with compound fields! If your business needs to sort by last name, storing `full_name = 'Aarav Sharma'` violates practical atomicity. Split names into `first_name` and `last_name`. Similarly, split addresses into `street`, `city`, `state`, and `postal_code`.
- **The Modern Exception (Native JSON):** While 1NF prohibits unstructured comma-separated strings, modern MySQL 8.0 natively supports `JSON` columns for semi-structured data that does not require relational foreign keys.

---

# Multiple Choice Questions

### 1. What is the fundamental requirement regarding column values in First Normal Form (1NF)?
A. All values must be encrypted
B. Every column must contain atomic (single, indivisible) values
C. All columns must be numeric
D. Columns must have foreign keys
**Answer:** B
**Explanation:** First Normal Form (1NF) mandates atomicity, meaning each column cell must hold only a single value, prohibiting multi-valued lists or arrays.
---

### 2. Why does a table containing columns `skill_1`, `skill_2`, and `skill_3` violate First Normal Form?
A. Because skills must be stored in uppercase
B. It contains repeating groups of similar data across multiple columns
C. It requires too much memory
D. MySQL prohibits numbers in column names
**Answer:** B
**Explanation:** Designing multiple numbered columns to hold repetitions of the same attribute constitutes a "repeating group", which violates 1NF.
---

### 3. How should a multi-valued attribute (such as multiple email addresses per user) be structured to achieve 1NF?
A. Store them as comma-separated values in a single VARCHAR column
B. Move the attribute to a separate child table linked by a foreign key, with one row per email address
C. Store them in the primary key
D. Create 100 separate email columns
**Answer:** B
**Explanation:** In 1NF, multi-valued attributes are separated into a dedicated child table where each individual value occupies its own record linked back via a foreign key.
---

### 4. What requirement does 1NF impose on row identification?
A. Rows must be sorted alphabetically
B. Each row must be uniquely identifiable, typically enforced via a Primary Key
C. Tables must contain at least 1,000 rows
D. Rows must be stored in RAM
**Answer:** B
**Explanation:** 1NF requires that a relation contain unique rows with no duplicate tuples, universally implemented by defining a Primary Key.
---

### 5. Why is storing `"Mumbai, Maharashtra, 400001"` in a single `address` column considered a practical violation of atomicity?
A. Because commas cause MySQL syntax errors
B. Because it combines city, state, and postal code, preventing efficient sorting, filtering, and indexing on individual address components
C. Because addresses cannot exceed 10 characters
D. It prevents database backups
**Answer:** B
**Explanation:** Compound attributes prevent efficient querying (e.g., finding all users in 'Maharashtra'); decomposing into discrete atomic columns restores query efficiency.
---
