---
id: project-library-management-system
slug: project-library-management-system
course: sql-for-beginners
chapter: Practical Capstone Projects
topic: "Project 3: Library Book Lending & Member Tracking System"
difficulty: Beginner
readingTime: 15
order: 56
keywords: ["library management project","book lending schema","fine calculation","capstone project 3","datediff project"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 3: Library Book Lending & Member Tracking System
For our final Level 1 capstone project, we will design and deploy a complete **Library Book Lending & Member Management System**. A modern library system tracks members, physical book copies, loans, return deadlines, and overdue penalty calculations.

This project reinforces date arithmetic (`DATEDIFF`, `DATE_ADD`), multi-table relational schema design, conditional logic (`CASE`), and audit tracking.

---

## 1. Relational Schema Architecture

```
   +--------------------+          +--------------------+
   |      members       |          |       books        |
   +--------------------+          +--------------------+
   | member_id (PK)     |          | book_id (PK)       |
   | full_name          |          | title              |
   | membership_date    |          | isbn (UQ)          |
   +--------------------+          | total_copies       |
            |                      | available_copies   |
            | 1                    +--------------------+
            |                                | 1
            | N                              | N
   +----------------------------------------------------+
   |                     loan_records                   |
   +----------------------------------------------------+
   | loan_id (PK)                                       |
   | member_id (FK -> members)                          |
   | book_id (FK -> books)                              |
   | borrowed_date                                      |
   | due_date                                           |
   | returned_date (NULL if currently on loan)          |
   +----------------------------------------------------+
```

---

## 2. Step 1: DDL Table Creation

```sql
CREATE DATABASE IF NOT EXISTS msk_library_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE msk_library_system;

-- Table 1: Library Members
CREATE TABLE IF NOT EXISTS members (
    member_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    membership_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;

-- Table 2: Book Catalog
CREATE TABLE IF NOT EXISTS books (
    book_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(17) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    total_copies INT UNSIGNED NOT NULL DEFAULT 1,
    available_copies INT UNSIGNED NOT NULL DEFAULT 1,
    
    CONSTRAINT chk_available_copies CHECK (available_copies <= total_copies)
) ENGINE = InnoDB;

-- Table 3: Lending / Loan Transactions
CREATE TABLE IF NOT EXISTS loan_records (
    loan_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    member_id INT UNSIGNED NOT NULL,
    book_id INT UNSIGNED NOT NULL,
    borrowed_date DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_date DATE NULL DEFAULT NULL,
    
    CONSTRAINT fk_loan_member FOREIGN KEY (member_id) REFERENCES members(member_id),
    CONSTRAINT fk_loan_book FOREIGN KEY (book_id) REFERENCES books(book_id)
) ENGINE = InnoDB;
```

---

## 3. Step 2: Sample Data Population

```sql
-- Insert Members:
INSERT INTO members (full_name, email, phone, membership_date) VALUES
    ('Vikram Malhotra', 'vikram.m@example.com', '9820011223', '2025-01-10'),
    ('Ananya Sen', 'ananya.s@example.com', '9820022334', '2025-03-01'),
    ('Kavita Krishnan', 'kavita.k@example.com', '9820033445', '2025-06-15');

-- Insert Books:
INSERT INTO books (isbn, title, author, genre, total_copies, available_copies) VALUES
    ('978-0132350884', 'Clean Code', 'Robert C. Martin', 'Software Engineering', 5, 4),
    ('978-0201633610', 'Design Patterns', 'Erich Gamma et al.', 'Software Engineering', 3, 2),
    ('978-0596517748', 'JavaScript: The Good Parts', 'Douglas Crockford', 'Web Development', 4, 4),
    ('978-0131103627', 'The C Programming Language', 'Brian Kernighan, Dennis Ritchie', 'Computer Science', 2, 1);

-- Insert Loan Transactions (Today is assumed to be 2026-03-15):
INSERT INTO loan_records (member_id, book_id, borrowed_date, due_date, returned_date) VALUES
    (1, 1, '2026-02-01', '2026-02-15', '2026-02-14'), -- Returned on time!
    (2, 2, '2026-02-10', '2026-02-24', NULL),         -- OVERDUE! (Due Feb 24, not returned)
    (3, 4, '2026-03-05', '2026-03-19', NULL);         -- Currently Active on loan (Not overdue)
```

---

## 4. Step 3: Real-World Administrative Queries

```sql
-- Query 1: Overdue Book Detection & Fine Calculation
-- Assume a late penalty of ₹10 per day overdue:
SELECT 
    loan_id,
    member_id,
    book_id,
    borrowed_date,
    due_date,
    DATEDIFF('2026-03-15', due_date) AS days_overdue,
    DATEDIFF('2026-03-15', due_date) * 10.00 AS fine_amount_inr
FROM loan_records
WHERE returned_date IS NULL 
  AND due_date < '2026-03-15';

-- Query 2: Borrowing Popularity by Genre
SELECT 
    b.genre,
    COUNT(l.loan_id) AS times_borrowed
FROM books b
JOIN loan_records l ON b.book_id = l.book_id
GROUP BY b.genre
ORDER BY times_borrowed DESC;

-- Query 3: Processing a Book Return
-- Member returns book 2 on '2026-03-15':
UPDATE loan_records 
SET returned_date = '2026-03-15'
WHERE loan_id = 2;

-- Increment available copies back in the catalog:
UPDATE books 
SET available_copies = available_copies + 1 
WHERE book_id = 2;
```

---

## 5. Grand Summary of Level 1 Achievement

Congratulations! You have completed **Level 1: SQL & MySQL for Beginners**. You have mastered:
- Relational database fundamentals and MySQL architecture.
- Full DDL database and table lifecycles (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`).
- Integrity constraints (Primary Keys, Foreign Keys, Unique, Not Null, Check).
- DML manipulation (`INSERT`, `UPDATE`, `DELETE`, Upsert).
- DQL querying, sorting, pagination, scalar functions, grouping, and aggregations.
- You are now ready to tackle **Level 2: SQL & MySQL for Intermediate**!

---

# Multiple Choice Questions

### 1. In Query 1, how are overdue book loans identified?
A. WHERE returned_date IS NOT NULL
B. WHERE returned_date IS NULL AND due_date < CURRENT_DATE()
C. WHERE loan_id > 10
D. WHERE due_date > borrowed_date
**Answer:** B
**Explanation:** An active loan has `returned_date IS NULL`. If the current date is past the `due_date`, the book is overdue.
---

### 2. What does `DATEDIFF(date1, date2) * 10.00` calculate in Query 1?
A. The number of pages read
B. The overdue fine accumulated at ₹10 per day late
C. The member's annual subscription fee
D. The retail price of the book
**Answer:** B
**Explanation:** `DATEDIFF()` computes the number of days elapsed beyond the due date, which multiplied by 10 yields the late fine in rupees.
---

### 3. What constraint on the `books` table guarantees that `available_copies` can never exceed `total_copies`?
A. FOREIGN KEY
B. CHECK (available_copies <= total_copies)
C. UNIQUE
D. AUTO_INCREMENT
**Answer:** B
**Explanation:** The `CHECK` constraint actively enforces that available physical inventory cannot exceed the total registered book stock.
---

### 4. When a member returns a borrowed book, what two database actions must occur?
A. The table is truncated and rebuilt
B. The loan record's returned_date is updated, and the book's available_copies count is incremented by 1
C. The member is deleted from the database
D. The book's ISBN is changed
**Answer:** B
**Explanation:** Completing a return updates the transaction record with the return date and restores the book's available copy count in the catalog.
---

### 5. Why is `returned_date` initialized as `NULL` when a new loan is recorded?
A. Because NULL represents an active, uncompleted loan where the return event has not yet occurred
B. Because MySQL cannot store dates before the year 2026
C. To save disk space
D. Because loans are illegal
**Answer:** A
**Explanation:** `NULL` denotes the absence of data, indicating that the book has been checked out but not yet returned.
---
