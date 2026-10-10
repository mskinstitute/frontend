---
id: python-intermediate-library-management-system
slug: library-management-system
course: python-for-intermediate
chapter: "15: Capstone Project"
topic: "15.1 Library Management System"
title: "Library Management System in Python"
description: "Master library management system in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 11
order: 69
keywords:
  - python library management system
  - python intermediate
  - python library management system
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Capstone Project 1: Library Management System in Python

In this major capstone project, we integrate everything mastered across Python for Intermediate—**Object-Oriented Design, Encapsulation, Custom Exceptions, Relational SQLite Databases, Datetime Arithmetic, and Defensive Architecture**—to build a multi-table, enterprise-grade **Library Management & Circulation System**.

---

## 1. System Architecture & Relational Schema

The application models physical library circulation using three relational tables inside `library.db`:

```text
+---------------------+        +--------------------------+        +---------------------+
|        books        |        |     borrowed_records     |        |       members       |
+---------------------+        +--------------------------+        +---------------------+
| isbn (PK)           |<-------| book_isbn (FK)           |        | member_id (PK)      |
| title               |        | member_id (FK) ---------->|------->| name                |
| author              |        | borrow_date              |        | email               |
| total_copies        |        | return_date              |        | max_borrow_limit    |
| available_copies    |        | fine_paid                |        +---------------------+
+---------------------+        +--------------------------+
```

### Key Domain Rules:
1. **Inventory Tracking**: A book can only be issued if `available_copies > 0`.
2. **Member Limits**: Members cannot hold more active borrowed books than their `max_borrow_limit` (typically 3 books).
3. **Late Return Fines**: Borrowed periods exceed 14 days trigger an automated late fee of ₹10 per overdue day calculated via `datetime`.
4. **Relational Transactions**: Issuing or returning books executes across both `books` and `borrowed_records` atomically inside a SQLite transaction.

---

## 2. Complete Project Implementation

```python
import sqlite3
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

DB_NAME = "library.db"
BORROW_DURATION_DAYS = 14
DAILY_FINE_RATE = 10.0  # ₹10 per day overdue


# -------------------------------------------------------------
# 1. Custom Domain Exceptions
# -------------------------------------------------------------
class LibraryError(Exception):
    """Base exception for library domain errors."""
    pass

class BookUnavailableError(LibraryError):
    """Raised when no physical copies of a book remain."""
    pass

class MemberLimitExceededError(LibraryError):
    """Raised when a member has reached their maximum borrowing quota."""
    pass

class RecordNotFoundError(LibraryError):
    """Raised when an ISBN, member ID, or borrowing record does not exist."""
    pass


# -------------------------------------------------------------
# 2. Database Engine & Schema
# -------------------------------------------------------------
class LibraryDB:
    def __init__(self, db_path: str = DB_NAME):
        self.db_path = db_path
        self._initialize_schema()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_schema(self):
        with self.get_connection() as conn:
            conn.executescript("""
            CREATE TABLE IF NOT EXISTS books (
                isbn TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                total_copies INTEGER NOT NULL CHECK(total_copies > 0),
                available_copies INTEGER NOT NULL CHECK(available_copies >= 0)
            );

            CREATE TABLE IF NOT EXISTS members (
                member_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                max_borrow_limit INTEGER DEFAULT 3
            );

            CREATE TABLE IF NOT EXISTS borrowed_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_isbn TEXT NOT NULL,
                member_id TEXT NOT NULL,
                borrow_date TEXT NOT NULL,
                due_date TEXT NOT NULL,
                return_date TEXT,
                fine_amount REAL DEFAULT 0.0,
                FOREIGN KEY(book_isbn) REFERENCES books(isbn),
                FOREIGN KEY(member_id) REFERENCES members(member_id)
            );
            """)


# -------------------------------------------------------------
# 3. Core Business Logic Engine
# -------------------------------------------------------------
class LibraryManager:
    def __init__(self):
        self.db = LibraryDB()

    def add_book(self, isbn: str, title: str, author: str, copies: int):
        with self.db.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO books (isbn, title, author, total_copies, available_copies)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(isbn) DO UPDATE SET
                    total_copies = total_copies + excluded.total_copies,
                    available_copies = available_copies + excluded.available_copies;
                """,
                (isbn.strip().upper(), title.strip().title(), author.strip().title(), copies, copies)
            )
        print(f"Book '{title}' ({copies} copies) added to catalog.")

    def register_member(self, member_id: str, name: str, email: str):
        try:
            with self.db.get_connection() as conn:
                conn.execute(
                    "INSERT INTO members (member_id, name, email) VALUES (?, ?, ?);",
                    (member_id.strip().upper(), name.strip().title(), email.strip().lower())
                )
            print(f"Member '{name}' (ID: {member_id}) registered successfully.")
        except sqlite3.IntegrityError:
            print(f"Error: Member ID '{member_id}' or Email '{email}' already registered.")

    def issue_book(self, isbn: str, member_id: str):
        isbn = isbn.strip().upper()
        member_id = member_id.strip().upper()

        with self.db.get_connection() as conn:
            cursor = conn.cursor()

            # 1. Verify Member Exists & Check Quota
            cursor.execute("SELECT name, max_borrow_limit FROM members WHERE member_id = ?;", (member_id,))
            member = cursor.fetchone()
            if not member:
                raise RecordNotFoundError(f"Member with ID '{member_id}' does not exist.")

            cursor.execute(
                "SELECT COUNT(*) as active_count FROM borrowed_records WHERE member_id = ? AND return_date IS NULL;",
                (member_id,)
            )
            active_borrows = cursor.fetchone()["active_count"]
            if active_borrows >= member["max_borrow_limit"]:
                raise MemberLimitExceededError(
                    f"Member '{member['name']}' has reached the limit of {member['max_borrow_limit']} books."
                )

            # 2. Check Book Availability
            cursor.execute("SELECT title, available_copies FROM books WHERE isbn = ?;", (isbn,))
            book = cursor.fetchone()
            if not book:
                raise RecordNotFoundError(f"Book with ISBN '{isbn}' not found.")
            if book["available_copies"] <= 0:
                raise BookUnavailableError(f"All copies of '{book['title']}' are currently checked out.")

            # 3. Atomic Transaction: Decrement stock and insert record
            today = datetime.now()
            due = today + timedelta(days=BORROW_DURATION_DAYS)

            cursor.execute("UPDATE books SET available_copies = available_copies - 1 WHERE isbn = ?;", (isbn,))
            cursor.execute(
                """
                INSERT INTO borrowed_records (book_isbn, member_id, borrow_date, due_date)
                VALUES (?, ?, ?, ?);
                """,
                (isbn, member_id, today.strftime("%Y-%m-%d"), due.strftime("%Y-%m-%d"))
            )

        print(f"Successfully issued '{book['title']}' to {member['name']}. Due date: {due.strftime('%Y-%m-%d')}.")

    def return_book(self, isbn: str, member_id: str):
        isbn = isbn.strip().upper()
        member_id = member_id.strip().upper()

        with self.db.get_connection() as conn:
            cursor = conn.cursor()

            # Find active borrowing record
            cursor.execute(
                """
                SELECT id, due_date FROM borrowed_records 
                WHERE book_isbn = ? AND member_id = ? AND return_date IS NULL;
                """,
                (isbn, member_id)
            )
            record = cursor.fetchone()
            if not record:
                raise RecordNotFoundError("No active borrowing record found for this Book and Member combination.")

            # Calculate overdue fine
            today = datetime.now()
            due_date = datetime.strptime(record["due_date"], "%Y-%m-%d")
            fine = 0.0

            if today > due_date:
                overdue_days = (today - due_date).days
                fine = overdue_days * DAILY_FINE_RATE

            # Atomic return: Update record & increment available copies
            cursor.execute(
                """
                UPDATE borrowed_records 
                SET return_date = ?, fine_amount = ? 
                WHERE id = ?;
                """,
                (today.strftime("%Y-%m-%d"), fine, record["id"])
            )
            cursor.execute("UPDATE books SET available_copies = available_copies + 1 WHERE isbn = ?;", (isbn,))

        print(f"Book returned successfully!")
        if fine > 0:
            print(f" NOTICE: Book was overdue. Fine levied: ₹{fine:,.2f}")
        else:
            print(" Returned on time. Zero fine.")

    def display_catalog(self):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT isbn, title, author, total_copies, available_copies FROM books;")
            rows = cursor.fetchall()

        if not rows:
            print("\nLibrary catalog is currently empty.")
            return

        print("\n" + "=" * 75)
        print(f"{'ISBN':<14} | {'TITLE':<26} | {'AUTHOR':<18} | {'COPIES'}")
        print("-" * 75)
        for r in rows:
            print(f"{r['isbn']:<14} | {r['title']:<26} | {r['author']:<18} | {r['available_copies']}/{r['total_copies']}")
        print("=" * 75)


# -------------------------------------------------------------
# 4. Interactive Command-Line Interface
# -------------------------------------------------------------
def run_library_cli():
    lib = LibraryManager()

    while True:
        print("\n===== UNIVERSITY LIBRARY MANAGEMENT SYSTEM =====")
        print("1. View Book Catalog")
        print("2. Add Book to Inventory")
        print("3. Register New Member")
        print("4. Issue / Borrow Book")
        print("5. Return Book")
        print("6. Exit")

        choice = input("Select an option (1-6): ").strip()

        try:
            if choice == "1":
                lib.display_catalog()

            elif choice == "2":
                isbn = input("\nEnter ISBN: ").strip()
                title = input("Enter Book Title: ").strip()
                author = input("Enter Author: ").strip()
                copies = int(input("Enter Number of Copies: ").strip())
                lib.add_book(isbn, title, author, copies)

            elif choice == "3":
                mid = input("\nEnter Member ID (e.g. M101): ").strip()
                name = input("Enter Member Full Name: ").strip()
                email = input("Enter Member Email: ").strip()
                lib.register_member(mid, name, email)

            elif choice == "4":
                isbn = input("\nEnter Book ISBN to issue: ").strip()
                mid = input("Enter Member ID: ").strip()
                lib.issue_book(isbn, mid)

            elif choice == "5":
                isbn = input("\nEnter Book ISBN to return: ").strip()
                mid = input("Enter Member ID: ").strip()
                lib.return_book(isbn, mid)

            elif choice == "6":
                print("Exiting Library Management System. Goodbye!")
                break
            else:
                print("Invalid choice. Please select 1-6.")

        except LibraryError as err:
            print(f"\n[Library Policy Violation] {err}")
        except ValueError as err:
            print(f"\n[Input Format Error] Invalid numeric input: {err}")
        except Exception as err:
            print(f"\n[System Error] Unexpected exception: {err}")


if __name__ == "__main__":
    run_library_cli()
```

---

## 3. Sample Execution Simulation

```text
===== UNIVERSITY LIBRARY MANAGEMENT SYSTEM =====
1. View Book Catalog
2. Add Book to Inventory
3. Register New Member
4. Issue / Borrow Book
5. Return Book
6. Exit
Select an option (1-6): 2

Enter ISBN: 978-0132350884
Enter Book Title: Clean Code
Enter Author: Robert C. Martin
Enter Number of Copies: 3
Book 'Clean Code' (3 copies) added to catalog.

===== UNIVERSITY LIBRARY MANAGEMENT SYSTEM =====
Select an option (1-6): 1

===========================================================================
ISBN           | TITLE                      | AUTHOR             | COPIES
---------------------------------------------------------------------------
978-0132350884 | Clean Code                 | Robert C. Martin   | 3/3
===========================================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Inconsistent Book Inventory State
Ensure that issuing a book decrements the available count and marks the borrower's record within an atomic database transaction.

### 2. Duplicate ISBN Registration
Enforce `UNIQUE` constraints on book ISBNs in SQLite to prevent duplicate records from corrupting catalogue searches.

---

---

## 💻 Try It Yourself: Extension Challenge - Book Reservation Queue

### Challenge
Extend the Library Management System with a waiting list / reservation queue for books that are currently checked out by another borrower.

### Complete Solution
```python
from collections import deque

class ReservableBook:
    def __init__(self, title):
        self.title = title
        self.is_issued = False
        self.reservation_queue = deque()

    def reserve(self, borrower_name):
        if not self.is_issued:
            print(f"'{self.title}' is available right now! No reservation needed.")
            return
        self.reservation_queue.append(borrower_name)
        print(f"Reserved '{self.title}' for {borrower_name}. Position in queue: {len(self.reservation_queue)}")

    def return_book(self):
        self.is_issued = False
        if self.reservation_queue:
            next_user = self.reservation_queue.popleft()
            self.is_issued = True
            print(f"Book returned! Automatically issued to next waiting borrower: {next_user}")
        else:
            print("Book returned and placed back on catalogue shelf.")

book = ReservableBook("Fluent Python")
book.is_issued = True
book.reserve("Priya")
book.reserve("Rohan")
book.return_book()
```

### Expected Output
```text
Reserved 'Fluent Python' for Priya. Position in queue: 1
Reserved 'Fluent Python' for Rohan. Position in queue: 2
Book returned! Automatically issued to next waiting borrower: Priya
```

---

## Practice Quiz

### 1. In this project, what ensures that returning a book updates the borrow record AND increments available stock together?
A. Running separate Python threads
B. Executing both SQL operations within a single `with self.db.get_connection() as conn:` context transaction
C. Calling `time.sleep()` between statements
D. It happens automatically in memory
**Answer:** B
**Explanation:** The SQLite connection context manager groups both queries into an atomic transaction, committing them together or rolling back if either fails.
---

### 2. What exception is raised if an authorized member attempts to borrow a book when `available_copies == 0`?
A. `ZeroDivisionError`
B. `BookUnavailableError`
C. `IndexError`
D. `FileNotFoundError`
**Answer:** B
**Explanation:** The application defines and raises the custom `BookUnavailableError` when the catalog has zero copies currently in stock.
---

### 3. How are late return penalties calculated in the `return_book()` method?
A. Fixed flat fee of ₹500
B. By computing `(today - due_date).days * DAILY_FINE_RATE` using Python `datetime` objects
C. By inspecting the user's bank account
D. Fines cannot be calculated in Python
**Answer:** B
**Explanation:** Subtracting the `due_date` `datetime` object from `today` produces a `timedelta`, whose `.days` attribute is multiplied by the fine rate.
---

### 4. Which SQL clause allows the `add_book()` method to update existing copy counts if an ISBN already exists?
A. `ON CONFLICT(isbn) DO UPDATE SET ...`
B. `REPLACE OR IGNORE`
C. `WHERE DUPLICATE`
D. `TRY INSERT`
**Answer:** A
**Explanation:** The `ON CONFLICT(...) DO UPDATE` (upsert) clause updates existing records when primary key collision occurs instead of raising an error.
---

### 5. Why do custom exceptions like `BookUnavailableError` inherit from `LibraryError`?
A. To format error text in bold
B. To allow caller code to catch all library-related domain violations with a single `except LibraryError:` handler
C. It is required by CPython
D. To prevent the script from using CPU
**Answer:** B
**Explanation:** Exception hierarchies allow client code to catch high-level domain base classes (`LibraryError`) to intercept all module-specific errors uniformly.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Student Report Card Generator** (15: Capstone Project).

👉 **[Continue to Next Lesson: Student Report Card Generator →](/tutorials/python-for-intermediate/student-report-card-generator)**
