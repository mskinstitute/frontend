---
id: one-to-one-relationships
slug: one-to-one-relationships
course: sql-for-intermediate
chapter: Multi-Table Relationships & Relational Design
topic: "One-to-One (1:1) Relationships & Foreign Key Placement"
difficulty: Intermediate
readingTime: 12
order: 1
keywords: ["one to one relationship","foreign key unique","table splitting","vertical partitioning","relational design"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# One-to-One (1:1) Relationships & Foreign Key Placement
In relational database engineering, relationships define how records in one table correlate with records in another. A **One-to-One (1:1)** relationship means that a single record in Table A is associated with at most one record in Table B, and vice versa. 

While beginners often ask: *"Why not just put all columns in a single table?"*, experienced database architects know that 1:1 relationships are critical for security isolation, performance optimization, and vertical partitioning.

---

## 1. Architectural Justifications for 1:1 Tables

Why split data into two tables linked in a 1:1 relationship?

1. **Security & Sensitive Data Isolation:** You can store public user profiles in `users` (readable by all services) and isolate sensitive fields (tax ID, KYC documents, banking details) in `user_tax_details` with strict table-level access permissions.
2. **Performance & Vertical Partitioning:** In MySQL `InnoDB`, reading narrow tables is significantly faster. Storing frequently read columns (username, email) in one table and rarely read wide columns (PDF resumes, JSON metadata) in a child table keeps your main table's pages compact in the Buffer Pool.
3. **Sparse Columns:** If only 2% of users have enterprise billing profiles, keeping those 15 billing columns in the main table would leave 98% of rows filled with empty `NULL` values.

---

## 2. Implementing a 1:1 Relationship in MySQL

A 1:1 relationship is enforced by placing a **Foreign Key** in the dependent table and applying a **`UNIQUE` constraint** on that foreign key column!

```
   PARENT TABLE: users
   +---------+-------------------+---------------------+
   | user_id | username          | email               |  <-- user_id is PRIMARY KEY
   +---------+-------------------+---------------------+
   |       1 | aarav_s           | aarav@example.com   |
   |       2 | diya_p            | diya@example.com    |
   +---------+-------------------+---------------------+
              ^
              | 1 : 1 (Enforced by UNIQUE Foreign Key!)
              |
   CHILD TABLE: user_passports
   +-------------+---------+-----------------+--------------+
   | passport_id | user_id | passport_number | expiry_date  |
   +-------------+---------+-----------------+--------------+
   |         101 |       1 | Z1234567        | 2032-05-10   |
   |         102 |       2 | J9876543        | 2030-11-20   |
   +-------------+---------+-----------------+--------------+
```

### DDL Implementation:
```sql
-- Parent Table: General User Identity
CREATE TABLE users (
    user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Child Table: Passport / Identity Card
CREATE TABLE user_passports (
    passport_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    issuing_country CHAR(2) NOT NULL DEFAULT 'IN',
    expiry_date DATE NOT NULL,
    
    -- Crucial: UNIQUE constraint turns a 1:N foreign key into a 1:1 relationship!
    CONSTRAINT uq_user_passport UNIQUE (user_id),
    
    CONSTRAINT fk_passport_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;
```

---

## 3. Alternative: Shared Primary Key Architecture

Instead of generating a separate surrogate key (`passport_id`), the child table can use the **exact same Primary Key** as the parent table, doubling as both Primary Key and Foreign Key:

```sql
CREATE TABLE user_preferences (
    user_id INT UNSIGNED PRIMARY KEY, -- Serves as PK AND FK!
    theme ENUM('Light', 'Dark', 'System') NOT NULL DEFAULT 'System',
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT fk_pref_user 
        FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE
) ENGINE = InnoDB;
```

---

## 4. Querying 1:1 Relationships with Joins

```sql
-- Retrieve complete user profile with passport info:
SELECT 
    u.user_id,
    u.username,
    u.email,
    p.passport_number,
    p.expiry_date
FROM users u
LEFT JOIN user_passports p ON u.user_id = p.user_id;
```

---

## 5. Best Practices & Common Pitfalls

- **Do Not Forget the UNIQUE Constraint:** If you add a foreign key without a `UNIQUE` constraint, the database engine will allow multiple child rows per parent, inadvertently creating a One-to-Many (1:N) relationship!
- **Cascading Deletions:** Always declare `ON DELETE CASCADE` on 1:1 auxiliary detail tables so that deleting a user automatically cleans up their associated preferences and passport records.

---

# Multiple Choice Questions

### 1. What database constraint must be added to a Foreign Key column to enforce a strict One-to-One (1:1) relationship?
A. NOT NULL only
B. UNIQUE
C. CHECK
D. DEFAULT
**Answer:** B
**Explanation:** Applying a `UNIQUE` constraint on a foreign key column guarantees that no parent row can be referenced by more than one child record, ensuring a 1:1 cardinality.
---

### 2. What is a primary architectural justification for splitting customer data into a 1:1 relationship rather than storing everything in one table?
A. MySQL prohibits tables with more than 5 columns
B. Isolating sensitive or rarely accessed attributes (vertical partitioning) to improve security and buffer pool memory efficiency
C. 1:1 relationships eliminate the need for primary keys
D. Foreign keys are faster than reading single tables
**Answer:** B
**Explanation:** Vertical partitioning isolates sensitive columns for tighter security access control and keeps frequently accessed core rows compact in RAM cache.
---

### 3. In a Shared Primary Key 1:1 architecture, what role does the child table's primary key play?
A. It only generates random numbers
B. It functions simultaneously as both the table's Primary Key and as the Foreign Key pointing to the parent
C. It acts as an auto-incrementing surrogate key
D. It disables indexes
**Answer:** B
**Explanation:** In shared primary key designs, the child's primary key is identical to the parent's primary key and is declared as a foreign key referencing the parent.
---

### 4. Which referential action should generally be attached to a 1:1 dependent profile table when the parent user is deleted?
A. ON DELETE RESTRICT
B. ON DELETE CASCADE
C. ON DELETE NO ACTION
D. ON DELETE RESTART
**Answer:** B
**Explanation:** Because 1:1 auxiliary records have no reason to exist without their parent entity, `ON DELETE CASCADE` ensures clean garbage collection of dependent rows.
---

### 5. What type of SQL join should be used to retrieve all users along with their 1:1 passport details, even if some users have not yet submitted a passport?
A. INNER JOIN
B. LEFT JOIN
C. CROSS JOIN
D. FULL OUTER JOIN
**Answer:** B
**Explanation:** A `LEFT JOIN` retains all records from the left table (`users`) regardless of whether a matching record exists in the right table (`user_passports`).
---
