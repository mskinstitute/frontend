---
id: database-anomalies-overview
slug: database-anomalies-overview
course: sql-for-intermediate
chapter: Database Normalization & Schema Design
topic: "Database Anomalies: Insertion, Update, and Deletion Flaws"
difficulty: Intermediate
readingTime: 12
order: 22
keywords: ["database anomalies","insertion anomaly","update anomaly","deletion anomaly","redundancy","normalization reasons"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Database Anomalies: Insertion, Update, and Deletion Flaws
Why do we bother splitting data across multiple tables linked by foreign keys instead of keeping everything in one giant, convenient table? The answer lies in **Data Anomalies**. 

When database schemas are poorly designed or left unnormalized, daily data operations cause severe data corruption, accidental data loss, and update inconsistencies known as **Insertion**, **Update**, and **Deletion Anomalies**.

---

## 1. The Flawed Monolithic Table (Unnormalized Design)

Consider an institute that stores student enrollments, courses, and instructor details in a single table:

```
   FLAWED TABLE: student_course_monolith
   +------------+--------------+-----------+----------------+-----------------+---------------+
   | student_id | student_name | course_id | course_title   | instructor_name | instructor_ph |
   +------------+--------------+-----------+----------------+-----------------+---------------+
   |        101 | Aarav        |       CS1 | Python Mastery | Dr. Ramesh      | 9820011111    |
   |        102 | Diya         |       CS1 | Python Mastery | Dr. Ramesh      | 9820011111    |
   |        103 | Rohan        |       CS1 | Python Mastery | Dr. Ramesh      | 9820011111    |
   |        104 | Ananya       |       WD2 | Web Designing  | Prof. Amit      | 9820022222    |
   +------------+--------------+-----------+----------------+-----------------+---------------+
```

Notice the rampant data redundancy: Dr. Ramesh's name, course title, and phone number are copy-pasted across every single student row!

---

## 2. Anomaly 1: The Insertion Anomaly

An **Insertion Anomaly** occurs when you **cannot record certain information** without also recording completely unrelated data.

### The Problem Scenario:
Suppose the institute launches a brand-new course: *"Cloud Computing & DevOps (CC3)"*, taught by *Dr. Sunita*. However, registration just opened and **no students have enrolled yet**.

**Question:** Can we insert this new course into `student_course_monolith`?
**Answer:** **NO!** 
Because `student_id` is part of the table's identity/primary key, and cannot be `NULL`. To record the course, we would be forced to invent a fake "dummy" student or leave the course unrecorded!

---

## 3. Anomaly 2: The Update (Modification) Anomaly

An **Update Anomaly** occurs when modifying a single real-world fact requires updating **multiple rows**, creating data inconsistency if any row is missed.

### The Problem Scenario:
Suppose Dr. Ramesh changes his mobile phone number to `9820099999`.
- Because his number is duplicated across 500 student enrollment records, an `UPDATE` statement must update all 500 rows.
- If the server loses connection halfway, or if a junior developer updates only 1 row:
  - Row 1 says Dr. Ramesh's phone is `9820099999`.
  - Rows 2 through 500 say his phone is `9820011111`!
- The database is now corrupted with conflicting facts!

---

## 4. Anomaly 3: The Deletion Anomaly

A **Deletion Anomaly** occurs when deleting certain records unintentionally **destroys completely unrelated valuable information**.

### The Problem Scenario:
Look at student `104 (Ananya)` in the table above: she is currently the **only student** enrolled in *"Web Designing (WD2)"*.
- Suppose Ananya cancels her admission, and we execute: `DELETE FROM student_course_monolith WHERE student_id = 104;`
- **The Catastrophe:** Deleting Ananya's row permanently erases all record that the *Web Designing* course ever existed, and wipes out Prof. Amit's contact information from the database entirely!

---

## 5. The Solution: Database Normalization

To eliminate these three anomalies, relational databases apply **Normalization**: decomposing the monolith into three dedicated, specialized tables linked by clean foreign keys:
1. `students` (Student attributes only).
2. `instructors` (Instructor attributes only).
3. `courses` (Course attributes referencing instructor).
4. `enrollments` (Junction table linking students to courses).

---

# Multiple Choice Questions

### 1. What is an Insertion Anomaly in relational database design?
A. An error caused by inserting strings into integer columns
B. The inability to record certain independent data because other unrelated attributes are not yet available
C. A hard disk write failure
D. Inserting duplicate primary keys
**Answer:** B
**Explanation:** An insertion anomaly occurs when a fact cannot be recorded without artificially manufacturing unrelated data (e.g., being unable to add a course because no student has enrolled yet).
---

### 2. What constitutes an Update Anomaly?
A. A query that takes longer than 10 seconds
B. Inconsistent, contradictory data resulting from modifying duplicated records in some rows while failing to update others
C. Updating a table while a backup runs
D. Modifying a column's data type
**Answer:** B
**Explanation:** An update anomaly occurs when data redundancy requires modifying multiple rows for a single fact, creating conflicting data if any update is incomplete.
---

### 3. What danger characterizes a Deletion Anomaly?
A. The operating system erases the database folder
B. Unintentionally losing vital, unrelated business facts as a side-effect of deleting a specific entity's record
C. Dropping an index
D. Exceeding the maximum transaction size
**Answer:** B
**Explanation:** A deletion anomaly causes the unintentional loss of secondary information (e.g., losing course details when deleting the last student enrolled in it).
---

### 4. What is the fundamental root cause of all three database anomalies?
A. Using the InnoDB storage engine
B. Excessive data redundancy caused by unnormalized table structures
C. Using UTF-8 encoding
D. Having too many primary keys
**Answer:** B
**Explanation:** Storing attributes of multiple distinct real-world entities inside a single unnormalized table creates redundant data, directly producing all three anomalies.
---

### 5. How are database anomalies systematically resolved in relational engineering?
A. By increasing server RAM
B. By decomposing monolithic tables into normalized tables connected via foreign keys
C. By storing everything in JSON documents
D. By disabling transaction rollbacks
**Answer:** B
**Explanation:** Normalization splits redundant multi-entity tables into normalized relations where every table represents a single entity, eliminating anomalies.
---
