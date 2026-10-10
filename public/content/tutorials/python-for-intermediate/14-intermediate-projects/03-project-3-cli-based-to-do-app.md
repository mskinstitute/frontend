---
id: python-intermediate-project-3-cli-based-to-do-app
slug: project-3-cli-based-to-do-app
course: python-for-intermediate
chapter: "14: Intermediate Projects"
topic: "14.3 Project 3: CLI-based To-do App"
title: "Project 3: CLI-based To-do App in Python"
description: "Master project 3: cli-based to-do app in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 9
order: 68
keywords:
  - python project 3 cli based to do app
  - python intermediate
  - python project 3: cli-based to-do app
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project 3: CLI-Based To-Do App in Python

In this project, we apply our cumulative understanding of **Object-Oriented Architecture, SQLite Database Management, Datetime Arithmetic, and Defensive Error Handling** to engineer a high-productivity **Command-Line Task & To-Do Management Engine**.

---

## 1. System Architecture & Capabilities

Our To-Do application manages task lifecycles stored in an embedded `tasks.db` SQLite database:

```text
+-----------------------------------------------------------------------------+
|                                tasks.db                                     |
|                                                                             |
|  id (PK) | title | priority (HIGH/MED/LOW) | status | due_date | created_at |
+-----------------------------------------------------------------------------+
```

### Key Capabilities:
1. **Full CRUD Lifecycle**: Add, list, search, update status, and delete tasks.
2. **Priority Hierarchy**: Prioritizes tasks by `HIGH`, `MEDIUM`, and `LOW`.
3. **Deadline Awareness**: Compares task deadlines against current system time via the `datetime` module to flag **OVERDUE** tasks with visual alert tags.
4. **Resilient CLI**: Parameterized SQL queries safeguard against SQL injection, while comprehensive error trapping handles invalid date formats.

---

## 2. Complete Project Implementation

```python
import sqlite3
from datetime import datetime, date
from typing import List, Optional

DB_NAME = "tasks.db"
PRIORITY_ORDER = {"HIGH": 1, "MEDIUM": 2, "LOW": 3}


class TaskManager:
    """Encapsulates task database operations and business logic."""

    def __init__(self, db_path: str = DB_NAME):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                priority TEXT NOT NULL CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')),
                status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
                due_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """)

    def add_task(self, title: str, priority: str, due_date: Optional[str] = None) -> bool:
        """Inserts a new task record."""
        priority = priority.upper()
        if priority not in PRIORITY_ORDER:
            priority = "MEDIUM"

        if due_date:
            try:
                datetime.strptime(due_date, "%Y-%m-%d")
            except ValueError:
                print("Error: Due date must follow YYYY-MM-DD format.")
                return False

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO tasks (title, priority, due_date) VALUES (?, ?, ?);",
                (title.strip(), priority, due_date)
            )
            print(f"Task #{cursor.lastrowid} ('{title}') added successfully.")
            return True

    def list_tasks(self, filter_status: Optional[str] = None) -> List[sqlite3.Row]:
        """Retrieves tasks sorted by priority weight and due date."""
        query = "SELECT id, title, priority, status, due_date FROM tasks"
        params = []

        if filter_status:
            query += " WHERE status = ?"
            params.append(filter_status.upper())

        query += """
            ORDER BY 
                CASE priority 
                    WHEN 'HIGH' THEN 1 
                    WHEN 'MEDIUM' THEN 2 
                    WHEN 'LOW' THEN 3 
                END, 
                due_date ASC;
        """

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            return cursor.fetchall()

    def mark_status(self, task_id: int, new_status: str) -> bool:
        """Updates the status of a specific task."""
        new_status = new_status.upper()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE tasks SET status = ? WHERE id = ?;", (new_status, task_id))
            if cursor.rowcount > 0:
                print(f"Task #{task_id} status updated to [{new_status}].")
                return True
            else:
                print(f"Error: Task #{task_id} not found.")
                return False

    def delete_task(self, task_id: int) -> bool:
        """Permanently removes a task."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?;", (task_id,))
            if cursor.rowcount > 0:
                print(f"Task #{task_id} deleted.")
                return True
            else:
                print(f"Error: Task #{task_id} not found.")
                return False


def display_tasks(tasks: List[sqlite3.Row]):
    """Renders task records in a structured terminal dashboard."""
    if not tasks:
        print("\nNo tasks found in this view.")
        return

    today_str = date.today().strftime("%Y-%m-%d")

    print("\n" + "=" * 75)
    print(f"{'ID':<4} | {'STATUS':<12} | {'PRIORITY':<8} | {'DUE DATE':<12} | {'TITLE'}")
    print("-" * 75)

    for t in tasks:
        status_tag = f"[{t['status']}]"
        due = t['due_date'] or "No Deadline"
        
        # Check overdue condition for uncompleted tasks
        overdue_badge = ""
        if t['status'] != "COMPLETED" and t['due_date'] and t['due_date'] < today_str:
            overdue_badge = " (! OVERDUE)"

        print(f"{t['id']:<4} | {status_tag:<12} | {t['priority']:<8} | {due + overdue_badge:<20} | {t['title']}")
    print("=" * 75)


def run_cli():
    manager = TaskManager()

    while True:
        print("\n===== TERMINAL TASK & TO-DO MANAGER =====")
        print("1. View All Active Tasks")
        print("2. Add New Task")
        print("3. Mark Task Status (Pending / In-Progress / Completed)")
        print("4. View Completed Archive")
        print("5. Delete Task")
        print("6. Exit")

        choice = input("Select an option (1-6): ").strip()

        if choice == "1":
            # Display pending and in-progress tasks
            active_tasks = [t for t in manager.list_tasks() if t["status"] != "COMPLETED"]
            display_tasks(active_tasks)

        elif choice == "2":
            title = input("\nEnter task description: ").strip()
            if not title:
                print("Error: Task description cannot be empty.")
                continue
            priority = input("Priority (HIGH / MEDIUM / LOW) [Default: MEDIUM]: ").strip()
            due = input("Due Date (YYYY-MM-DD) or press Enter to skip: ").strip() or None
            manager.add_task(title, priority or "MEDIUM", due)

        elif choice == "3":
            try:
                task_id = int(input("\nEnter Task ID: ").strip())
                print("Options: 1. PENDING  2. IN_PROGRESS  3. COMPLETED")
                status_choice = input("Select new status (1-3): ").strip()
                status_map = {"1": "PENDING", "2": "IN_PROGRESS", "3": "COMPLETED"}
                if status_choice in status_map:
                    manager.mark_status(task_id, status_map[status_choice])
                else:
                    print("Invalid status option.")
            except ValueError:
                print("Error: Invalid numeric ID.")

        elif choice == "4":
            completed_tasks = manager.list_tasks(filter_status="COMPLETED")
            display_tasks(completed_tasks)

        elif choice == "5":
            try:
                task_id = int(input("\nEnter Task ID to delete: ").strip())
                manager.delete_task(task_id)
            except ValueError:
                print("Error: Invalid ID.")

        elif choice == "6":
            print("Exiting Task Manager. Have a productive day!")
            break
        else:
            print("Invalid selection. Choose between 1 and 6.")


if __name__ == "__main__":
    run_cli()
```

---

## 3. Sample Execution Simulation

```text
===== TERMINAL TASK & TO-DO MANAGER =====
1. View All Active Tasks
2. Add New Task
3. Mark Task Status (Pending / In-Progress / Completed)
4. View Completed Archive
5. Delete Task
6. Exit
Select an option (1-6): 2

Enter task description: Prepare slide deck for board meeting
Priority (HIGH / MEDIUM / LOW) [Default: MEDIUM]: HIGH
Due Date (YYYY-MM-DD) or press Enter to skip: 2026-09-14
Task #1 ('Prepare slide deck for board meeting') added successfully.

===== TERMINAL TASK & TO-DO MANAGER =====
Select an option (1-6): 1

===========================================================================
ID   | STATUS       | PRIORITY | DUE DATE             | TITLE
---------------------------------------------------------------------------
1    | [PENDING]    | HIGH     | 2026-09-14           | Prepare slide deck for board meeting
===========================================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Off-by-One Task Numbering
Users expect 1-based indexing for task lists (Task #1, #2), while Python lists use 0-based indexing. Always convert cleanly with `idx = user_input - 1`.

### 2. Unhandled Empty Task Lists
Guard against operations on empty task lists by displaying a friendly message ("No tasks found!") instead of raising an `IndexError`.

---

---

## 💻 Try It Yourself: Extension Challenge - Priority Sorting

### Challenge
Extend the CLI To-Do App to support task priority levels (`HIGH`, `MEDIUM`, `LOW`) and display the active task list sorted by urgency.

### Complete Solution
```python
PRIORITY_ORDER = {"HIGH": 1, "MEDIUM": 2, "LOW": 3}

def display_sorted_tasks(tasks):
    sorted_tasks = sorted(tasks, key=lambda t: PRIORITY_ORDER.get(t["priority"].upper(), 99))
    print(f"{'#':<3} | {'PRIORITY':<8} | {'TASK'}")
    print("-" * 35)
    for idx, t in enumerate(sorted_tasks, 1):
        print(f"{idx:<3} | {t['priority']:<8} | {t['title']}")

tasks = [
    {"title": "Buy groceries", "priority": "LOW"},
    {"title": "Submit client report", "priority": "HIGH"},
    {"title": "Review pull request", "priority": "MEDIUM"}
]
display_sorted_tasks(tasks)
```

### Expected Output
```text
#   | PRIORITY | TASK
-----------------------------------
1   | HIGH     | Submit client report
2   | MEDIUM   | Review pull request
3   | LOW      | Buy groceries
```

---

## Practice Quiz

### 1. How does the SQLite table schema prevent arbitrary invalid values from being stored in the `status` column?
A. With an external Python cron job
B. Using a SQL `CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED'))` constraint
C. By making the column a Primary Key
D. Status cannot be constrained in SQLite
**Answer:** B
**Explanation:** The SQL `CHECK` constraint validates that inserted or updated strings match one of the enumerated allowable states.
---

### 2. How does the application detect that a task is OVERDUE?
A. By pinging an external atomic clock API
B. By comparing the task's `due_date` string against `date.today().strftime("%Y-%m-%d")` for incomplete tasks
C. By catching a `TimeoutError`
D. Tasks cannot be overdue in SQLite
**Answer:** B
**Explanation:** ISO formatted dates (`YYYY-MM-DD`) are lexicographically sortable; comparing `due_date < today_str` identifies dates in the past.
---

### 3. Which SQL clause allows custom hierarchical sorting (e.g. HIGH before MEDIUM before LOW)?
A. `ORDER BY priority DESC`
B. `ORDER BY CASE priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END`
C. `GROUP BY priority`
D. `PARTITION BY priority`
**Answer:** B
**Explanation:** A SQL `CASE` statement inside an `ORDER BY` clause assigns custom integer weights to categorical strings for custom sorting.
---

### 4. What does `cursor.lastrowid` return after executing `INSERT INTO tasks ...`?
A. The number of rows in the table
B. The newly generated auto-incrementing integer ID of the created task
C. A list of all task names
D. `None`
**Answer:** B
**Explanation:** `cursor.lastrowid` stores the generated primary key rowid of the most recently inserted record.
---

### 5. Why is parameterized SQL syntax (`VALUES (?, ?, ?)`) used when adding new tasks?
A. To prevent SQL Injection attacks from malicious task title strings
B. To compress task titles in memory
C. Parameterized queries run only on Saturdays
D. It is mandatory for Python functions
**Answer:** A
**Explanation:** Parameterized placeholders treat values strictly as literal data rather than executable SQL code, preventing SQL injection vulnerabilities.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Library Management System** (15: Capstone Project).

👉 **[Continue to Next Lesson: Library Management System →](/tutorials/python-for-intermediate/library-management-system)**
