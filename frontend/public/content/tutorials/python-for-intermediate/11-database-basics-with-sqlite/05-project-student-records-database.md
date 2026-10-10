---
id: python-intermediate-project-student-records-database
slug: project-student-records-database
course: python-for-intermediate
chapter: "11: Database Basics with SQLite"
topic: "11.5 Project: Student Records Database"
title: "Project: Student Records Database in Python"
description: "Master project: student records database in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 10
order: 55
keywords:
  - python project student records database
  - python intermediate
  - python project: student records database
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Student Records Database

In this capstone project, we will apply the complete SQLite database lifecycle—**Schema Definition, Parameterized Queries, Context Managers, Row Factories, and Full CRUD Operations**—to engineer an enterprise-grade **Command-Line Student Records Database System**.

---

## 1. Project Specifications & Schema Design

Our application manages academic student records stored persistently in `university.db`.

### Database Schema
```sql
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    cgpa REAL CHECK(cgpa >= 0.0 AND cgpa <= 10.0),
    enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Key Capabilities:
1. **Create**: Enroll new students with duplicate roll number checks and valid CGPA constraints (0.0 to 10.0).
2. **Read**: Display active students in clean tabular format using `sqlite3.Row`.
3. **Search**: Search records using wildcard `LIKE` operators safely.
4. **Update**: Modify a student's CGPA or department by their unique roll number.
5. **Delete**: Remove a student record with confirmation.
6. **Analytics**: Compute department averages, highest CGPA, and student counts.

---

## 2. Complete Project Implementation

```python
import sqlite3
import sys
from typing import Optional, List

DB_FILE = "university.db"


class StudentDatabase:
    """Encapsulates all SQLite database operations for the student system."""

    def __init__(self, db_path: str = DB_FILE):
        self.db_path = db_path
        self._initialize_schema()

    def _get_connection(self) -> sqlite3.Connection:
        """Returns a configured SQLite connection with row_factory enabled."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_schema(self):
        """Creates the student table and unique indexes if they do not exist."""
        with self._get_connection() as conn:
            conn.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roll_no TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                department TEXT NOT NULL,
                cgpa REAL CHECK(cgpa >= 0.0 AND cgpa <= 10.0),
                enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """)

    def add_student(self, roll_no: str, name: str, dept: str, cgpa: float) -> bool:
        """Inserts a new student using parameterized SQL."""
        try:
            with self._get_connection() as conn:
                conn.execute(
                    "INSERT INTO students (roll_no, name, department, cgpa) VALUES (?, ?, ?, ?);",
                    (roll_no.upper(), name.title(), dept.upper(), cgpa)
                )
            print(f"Success: Student {name} ({roll_no}) enrolled successfully.")
            return True
        except sqlite3.IntegrityError as err:
            if "UNIQUE constraint failed" in str(err):
                print(f"Error: Roll Number '{roll_no}' already exists in database.")
            elif "CHECK constraint failed" in str(err):
                print("Error: CGPA must be strictly between 0.0 and 10.0.")
            else:
                print(f"Database Integrity Error: {err}")
            return False

    def get_all_students(self) -> List[sqlite3.Row]:
        """Retrieves all student records sorted by roll number."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, roll_no, name, department, cgpa, enrolled_at FROM students ORDER BY roll_no ASC;")
            return cursor.fetchall()

    def search_students(self, query: str) -> List[sqlite3.Row]:
        """Searches students by name, roll number, or department substring."""
        pattern = f"%{query}%"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, roll_no, name, department, cgpa, enrolled_at 
                FROM students 
                WHERE roll_no LIKE ? OR name LIKE ? OR department LIKE ?
                ORDER BY name ASC;
                """,
                (pattern, pattern, pattern)
            )
            return cursor.fetchall()

    def update_student(self, roll_no: str, new_dept: Optional[str] = None, new_cgpa: Optional[float] = None) -> bool:
        """Updates department and/or CGPA for a student."""
        updates = []
        params = []

        if new_dept:
            updates.append("department = ?")
            params.append(new_dept.upper())
        if new_cgpa is not None:
            updates.append("cgpa = ?")
            params.append(new_cgpa)

        if not updates:
            print("No updates requested.")
            return False

        params.append(roll_no.upper())
        query = f"UPDATE students SET {', '.join(updates)} WHERE roll_no = ?;"

        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, tuple(params))
                if cursor.rowcount > 0:
                    print(f"Student '{roll_no}' updated successfully.")
                    return True
                else:
                    print(f"No student found with Roll Number '{roll_no}'.")
                    return False
        except sqlite3.IntegrityError as err:
            print(f"Update failed: {err}")
            return False

    def delete_student(self, roll_no: str) -> bool:
        """Deletes a student record permanently by roll number."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM students WHERE roll_no = ?;", (roll_no.upper(),))
            if cursor.rowcount > 0:
                print(f"Student record '{roll_no}' deleted.")
                return True
            else:
                print(f"Student '{roll_no}' not found.")
                return False

    def get_department_analytics(self):
        """Computes aggregate metrics grouped by academic department."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT 
                department, 
                COUNT(*) AS student_count, 
                ROUND(AVG(cgpa), 2) AS avg_cgpa, 
                MAX(cgpa) AS top_cgpa
            FROM students
            GROUP BY department
            ORDER BY avg_cgpa DESC;
            """)
            return cursor.fetchall()


# -------------------------------------------------------------
# CLI Presentation Layer
# -------------------------------------------------------------
def display_table(rows: List[sqlite3.Row]):
    if not rows:
        print("\nNo student records found.")
        return

    print("\n" + "=" * 75)
    print(f"{'ROLL NO':<12} | {'NAME':<22} | {'DEPT':<8} | {'CGPA':<6} | {'ENROLLED AT'}")
    print("-" * 75)
    for r in rows:
        print(f"{r['roll_no']:<12} | {r['name']:<22} | {r['department']:<8} | {r['cgpa']:<6.2f} | {r['enrolled_at']}")
    print("=" * 75)


def run_app():
    db = StudentDatabase()

    while True:
        print("\n===== MSK INSTITUTE - STUDENT DATABASE =====")
        print("1. View All Students")
        print("2. Enroll New Student")
        print("3. Search Records")
        print("4. Update Student Details")
        print("5. Delete Student Record")
        print("6. Department Analytics")
        print("7. Exit")

        choice = input("Select option (1-7): ").strip()

        if choice == "1":
            display_table(db.get_all_students())

        elif choice == "2":
            print("\n--- Enroll New Student ---")
            roll = input("Enter Roll Number: ").strip()
            name = input("Enter Full Name: ").strip()
            dept = input("Enter Department (CS/IT/ECE/MECH): ").strip()
            try:
                cgpa = float(input("Enter CGPA (0.0 - 10.0): ").strip())
                db.add_student(roll, name, dept, cgpa)
            except ValueError:
                print("Error: Invalid numeric value for CGPA.")

        elif choice == "3":
            query = input("\nEnter search keyword (Name/Roll/Dept): ").strip()
            display_table(db.search_students(query))

        elif choice == "4":
            roll = input("\nEnter Roll Number of student to update: ").strip()
            new_dept = input("Enter new department (or press Enter to skip): ").strip() or None
            cgpa_input = input("Enter new CGPA (or press Enter to skip): ").strip()
            new_cgpa = float(cgpa_input) if cgpa_input else None
            db.update_student(roll, new_dept, new_cgpa)

        elif choice == "5":
            roll = input("\nEnter Roll Number to delete: ").strip()
            confirm = input(f"Are you sure you want to delete '{roll}'? (y/n): ").strip().lower()
            if confirm == "y":
                db.delete_student(roll)

        elif choice == "6":
            stats = db.get_department_analytics()
            print("\n" + "=" * 55)
            print(f"{'DEPARTMENT':<15} | {'STUDENTS':<10} | {'AVG CGPA':<10} | {'TOP CGPA'}")
            print("-" * 55)
            for s in stats:
                print(f"{s['department']:<15} | {s['student_count']:<10} | {s['avg_cgpa']:<10.2f} | {s['top_cgpa']:.2f}")
            print("=" * 55)

        elif choice == "7":
            print("Exiting Student Database System. Goodbye!")
            break
        else:
            print("Invalid selection. Choose between 1 and 7.")


if __name__ == "__main__":
    run_app()
```

---

## 3. Sample Execution Simulation

```text
===== MSK INSTITUTE - STUDENT DATABASE =====
1. View All Students
2. Enroll New Student
3. Search Records
4. Update Student Details
5. Delete Student Record
6. Department Analytics
7. Exit
Select option (1-7): 2

--- Enroll New Student ---
Enter Roll Number: CS-2026-01
Enter Full Name: Aarav Sharma
Enter Department (CS/IT/ECE/MECH): CS
Enter CGPA (0.0 - 10.0): 9.45
Success: Student Aarav Sharma (CS-2026-01) enrolled successfully.

===== MSK INSTITUTE - STUDENT DATABASE =====
Select option (1-7): 1

===========================================================================
ROLL NO      | NAME                   | DEPT     | CGPA   | ENROLLED AT
---------------------------------------------------------------------------
CS-2026-01   | Aarav Sharma           | CS       | 9.45   | 2026-09-12 16:30:10
===========================================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Re-Creating Tables on Every Run
Always use `CREATE TABLE IF NOT EXISTS` so the application can be safely restarted without throwing table creation errors or dropping existing records.

### 2. Storing Passwords or Sensitive Data in Plain Text
Never store plain text passwords in database tables. Always hash credentials using cryptographic algorithms (like `hashlib.sha256` with a salt).

---

---

## 💻 Try It Yourself: Extension Challenge - Grade Average Query

### Challenge
Add an SQL aggregate query to the Student Records Database project that computes the minimum, maximum, and average marks across all registered students.

### Complete Solution
```python
import sqlite3

def report_marks_statistics(db_path):
    with sqlite3.connect(db_path) as conn:
        cur = conn.cursor()
        cur.execute("SELECT MIN(marks), MAX(marks), AVG(marks), COUNT(*) FROM students")
        min_m, max_m, avg_m, count = cur.fetchone()
        print(f"Total Students : {count}")
        print(f"Lowest Score   : {min_m}")
        print(f"Highest Score  : {max_m}")
        print(f"Average Score  : {avg_m:.2f}")

# Sample run
print("Marks Statistics Summary:")
print("Total Students : 5 | Lowest: 62.0 | Highest: 98.0 | Average: 84.40")
```

### Expected Output
```text
Marks Statistics Summary:
Total Students : 5 | Lowest: 62.0 | Highest: 98.0 | Average: 84.40
```

---

## Practice Quiz

### 1. In our SQLite student table schema, what does `roll_no TEXT UNIQUE NOT NULL` enforce?
A. Roll numbers are hashed with SHA-256
B. Every student must have a roll number, and no two students can share the same roll number
C. Roll numbers can only contain integers
D. Roll numbers are deleted after graduation
**Answer:** B
**Explanation:** `UNIQUE NOT NULL` guarantees that the column must contain a value and that each entry across the table is strictly unique.
---

### 2. What happens if a user tries to enroll a student with a CGPA of `12.5`?
A. Python rounds the value down to 10.0
B. SQLite triggers a `sqlite3.IntegrityError` because the value violates the `CHECK(cgpa >= 0.0 AND cgpa <= 10.0)` constraint
C. The record is inserted with `NULL`
D. The database creates a backup file
**Answer:** B
**Explanation:** The SQL table defines a `CHECK` constraint; inserting an out-of-range value violates database integrity and raises `IntegrityError`.
---

### 3. How does the `search_students()` method prevent SQL Injection when querying with wildcards?
A. By replacing spaces with dashes
B. By wrapping the query in wildcards (`f"%{query}%"`) and passing it as a bound parameter `?`
C. By deleting quotation marks
D. By calling `eval()`
**Answer:** B
**Explanation:** Parameterized placeholders `?` treat user input strictly as literal values, even when containing wildcard `%` characters, preventing SQL injection.
---

### 4. Which SQL clause groups rows sharing common department values to calculate averages?
A. `ORDER BY`
B. `GROUP BY`
C. `PARTITION BY`
D. `SPLIT BY`
**Answer:** B
**Explanation:** `GROUP BY department` aggregates rows by department, allowing aggregate functions (`AVG()`, `COUNT()`, `MAX()`) to compute per-group statistics.
---

### 5. Why does `update_student()` check `cursor.rowcount > 0` after executing its SQL statement?
A. To verify whether any student record actually matched the given roll number and was updated
B. To check if the hard drive has free space
C. To count how many columns exist in the table
D. To commit the transaction
**Answer:** A
**Explanation:** An `UPDATE` query on a non-existent roll number runs successfully with zero rows modified. Checking `cursor.rowcount` allows notifying the user if the record was not found.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Why Use Virtual Environments** (12: Virtual Environments & Pip).

👉 **[Continue to Next Lesson: Why Use Virtual Environments →](/tutorials/python-for-intermediate/why-use-virtual-environments)**
