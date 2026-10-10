---
id: python-advanced-project-gui-based-to-do-app
slug: project-gui-based-to-do-app
course: python-for-advanced
chapter: "14: GUI Development with Tkinter"
topic: "14.4 Project: GUI-based To-Do App"
title: "Project: GUI-based To-Do App in Python"
description: "Master project: gui-based to-do app in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 10
order: 60
keywords:
  - python project gui based to do app
  - python advanced
  - python project: gui-based to-do app
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: GUI-Based Task Manager Application

Desktop utility applications require an intuitive user interface, robust data persistence, clean layout architecture, and keyboard-driven efficiency.

In this project, we will construct a production-ready **Desktop Task & To-Do Management Application** using **Tkinter/TTK** and a persistent **SQLite database**. It implements a Model-View architecture, multi-column `ttk.Treeview` tables with color-coded priority tags, modal confirmations, responsive grid layouts, and keyboard shortcut event bindings.

---

## 1. Application Architecture

The system uses a **Model-View Architecture**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         Desktop GUI View (Tkinter)                     │
 │                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ Task Input: [ Task Description ] [ Priority: HIGH ▼ ] [ Add Task ]│  │
 │  └──────────────────────────────────────────────────────────────────┘  │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ ttk.Treeview Table:                                              │  │
 │  │ ID │ Task Description          │ Priority │ Status    │ Date     │  │
 │  │ 1  │ Deploy Database Migration │ HIGH     │ PENDING   │ 2026-... │  │
 │  │ 2  │ Update Unit Test Suite    │ MEDIUM   │ COMPLETED │ 2026-... │  │
 │  └──────────────────────────────────────────────────────────────────┘  │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ Actions: [ Mark Completed ]  [ Delete Selected ]  [ Refresh ]    │  │
 │  └──────────────────────────────────────────────────────────────────┘  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ User Actions / Events
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      Data Access Model (SQLite3)                       │
 │  CREATE TABLE tasks (id, title, priority, status, created_at)          │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Production Implementation

```python
import datetime
import sqlite3
import tkinter as tk
from tkinter import messagebox, ttk
from typing import List, Optional, Tuple

# -------------------------------------------------------------
# 1. Model Layer: SQLite Persistence
# -------------------------------------------------------------
class TaskDatabase:
    """Manages persistent SQLite storage for task records."""

    def __init__(self, db_path: str = ":memory:") -> None:
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self._init_schema()

    def _init_schema(self) -> None:
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                priority TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        self.conn.commit()

    def add_task(self, title: str, priority: str) -> int:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        self.cursor.execute(
            "INSERT INTO tasks (title, priority, status, created_at) VALUES (?, ?, ?, ?)",
            (title, priority, "PENDING", now)
        )
        self.conn.commit()
        return self.cursor.lastrowid or 0

    def fetch_all(self) -> List[Tuple]:
        self.cursor.execute("SELECT id, title, priority, status, created_at FROM tasks ORDER BY id DESC")
        return self.cursor.fetchall()

    def mark_completed(self, task_id: int) -> None:
        self.cursor.execute("UPDATE tasks SET status = 'COMPLETED' WHERE id = ?", (task_id,))
        self.conn.commit()

    def delete_task(self, task_id: int) -> None:
        self.cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()

# -------------------------------------------------------------
# 2. View Layer: Tkinter / TTK GUI
# -------------------------------------------------------------
class TaskManagerApp(tk.Tk):
    """The main desktop application window and event coordinator."""

    def __init__(self, db: TaskDatabase) -> None:
        super().__init__()
        self.db = db

        # Configure Window Properties
        self.title("Enterprise Task & Sprint Manager")
        self.geometry("750x480")
        self.minsize(600, 350)

        # Configure Root Grid Resizing Weights
        self.columnconfigure(0, weight=1)
        self.rowconfigure(1, weight=1)

        self._build_input_panel()
        self._build_treeview_panel()
        self._build_action_panel()
        self._bind_keyboard_shortcuts()
        
        # Populate initial database records
        self.refresh_task_list()

    def _build_input_panel(self) -> None:
        """Top input panel for adding new tasks."""
        input_frame = ttk.LabelFrame(self, text=" Add New Task ", padding=10)
        input_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=5)
        input_frame.columnconfigure(1, weight=1)

        # Task title input
        ttk.Label(input_frame, text="Description:").grid(row=0, column=0, padx=5, sticky="w")
        self.title_var = tk.StringVar()
        self.title_entry = ttk.Entry(input_frame, textvariable=self.title_var)
        self.title_entry.grid(row=0, column=1, padx=5, sticky="ew")

        # Priority combobox
        ttk.Label(input_frame, text="Priority:").grid(row=0, column=2, padx=5, sticky="w")
        self.priority_var = tk.StringVar(value="MEDIUM")
        self.priority_combo = ttk.Combobox(
            input_frame,
            textvariable=self.priority_var,
            values=["HIGH", "MEDIUM", "LOW"],
            state="readonly",
            width=10
        )
        self.priority_combo.grid(row=0, column=3, padx=5)

        # Add button
        self.add_btn = ttk.Button(input_frame, text="Add Task", command=self.handle_add_task)
        self.add_btn.grid(row=0, column=4, padx=5)

    def _build_treeview_panel(self) -> None:
        """Center panel displaying tasks in a tabular Treeview."""
        tree_frame = ttk.Frame(self)
        tree_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=5)
        tree_frame.columnconfigure(0, weight=1)
        tree_frame.rowconfigure(0, weight=1)

        columns = ("id", "title", "priority", "status", "date")
        self.tree = ttk.Treeview(tree_frame, columns=columns, show="headings", selectmode="browse")

        # Define column headers
        self.tree.heading("id", text="ID")
        self.tree.heading("title", text="Task Description")
        self.tree.heading("priority", text="Priority")
        self.tree.heading("status", text="Status")
        self.tree.heading("date", text="Created At")

        # Define column geometry
        self.tree.column("id", width=45, anchor="center")
        self.tree.column("title", width=320, anchor="w")
        self.tree.column("priority", width=90, anchor="center")
        self.tree.column("status", width=100, anchor="center")
        self.tree.column("date", width=130, anchor="center")

        # Scrollbar attachment
        scrollbar = ttk.Scrollbar(tree_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.grid(row=0, column=0, sticky="nsew")
        scrollbar.grid(row=0, column=1, sticky="ns")

        # Visual Row Tags for Priorities
        self.tree.tag_configure("HIGH", foreground="#D32F2F")     # Red text for High
        self.tree.tag_configure("MEDIUM", foreground="#F57C00")   # Orange text for Medium
        self.tree.tag_configure("LOW", foreground="#388E3C")      # Green text for Low
        self.tree.tag_configure("COMPLETED", foreground="#757575")# Gray text for Done

    def _build_action_panel(self) -> None:
        """Bottom panel containing mutation actions."""
        action_frame = ttk.Frame(self, padding=5)
        action_frame.grid(row=2, column=0, sticky="ew", padx=10, pady=5)

        ttk.Button(action_frame, text="✓ Mark Completed", command=self.handle_mark_completed).pack(side="left", padx=5)
        ttk.Button(action_frame, text="✕ Delete Task", command=self.handle_delete_task).pack(side="left", padx=5)
        
        self.status_bar = ttk.Label(action_frame, text="Ready", font=("Helvetica", 9, "italic"))
        self.status_bar.pack(side="right", padx=5)

    def _bind_keyboard_shortcuts(self) -> None:
        """Binds standard desktop keyboard shortcuts."""
        self.bind("<Return>", lambda event: self.handle_add_task())
        self.bind("<Delete>", lambda event: self.handle_delete_task())

    # ---------------------------------------------------------
    # Event Handlers
    # ---------------------------------------------------------
    def handle_add_task(self) -> None:
        title = self.title_var.get().strip()
        priority = self.priority_var.get()

        if not title:
            messagebox.showwarning("Validation Error", "Task description cannot be blank.")
            return

        self.db.add_task(title, priority)
        self.title_var.set("")  # Reset input
        self.refresh_task_list()
        self.status_bar.configure(text=f"Task '{title}' added successfully.")

    def _get_selected_task_id(self) -> Optional[int]:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("Selection Required", "Please select a task from the list.")
            return None
        values = self.tree.item(selected[0], "values")
        return int(values[0])

    def handle_mark_completed(self) -> None:
        task_id = self._get_selected_task_id()
        if task_id is not None:
            self.db.mark_completed(task_id)
            self.refresh_task_list()
            self.status_bar.configure(text=f"Task #{task_id} marked as completed.")

    def handle_delete_task(self) -> None:
        task_id = self._get_selected_task_id()
        if task_id is not None:
            if messagebox.askyesno("Confirm Deletion", f"Are you sure you want to delete Task #{task_id}?"):
                self.db.delete_task(task_id)
                self.refresh_task_list()
                self.status_bar.configure(text=f"Task #{task_id} permanently deleted.")

    def refresh_task_list(self) -> None:
        """Reloads all tasks from SQLite into the Treeview."""
        # Clear existing rows
        for item in self.tree.get_children():
            self.tree.delete(item)

        rows = self.db.fetch_all()
        for row in rows:
            task_id, title, priority, status, date = row
            tag = "COMPLETED" if status == "COMPLETED" else priority
            self.tree.insert("", "end", values=(task_id, title, priority, status, date), tags=(tag,))

        total_pending = sum(1 for r in rows if r[3] == "PENDING")
        self.status_bar.configure(text=f"Active Tasks: {total_pending} pending / {len(rows)} total")
```

---

## 3. Verification & Execution

```python
def main():
    print("=====================================================")
    print("      INITIALIZING DESKTOP TASK MANAGER SUITE        ")
    print("=====================================================")

    # Initialize SQLite database (in-memory or file-backed)
    db = TaskDatabase(db_path=":memory:")
    
    # Pre-seed database with sample tasks
    db.add_task("Review pull requests for authentication", "HIGH")
    db.add_task("Update Sphinx documentation", "LOW")
    db.add_task("Execute Pytest regression suite", "MEDIUM")

    print("[SYSTEM] Pre-seeded SQLite database with 3 sprint tasks.")
    print("[SYSTEM] Instantiating Tkinter Desktop Interface...")

    # Launch GUI Application
    # app = TaskManagerApp(db)
    # app.mainloop()
    
    # Teardown
    db.close()
    print("[SYSTEM] Database connection closed cleanly.")
    print("=====================================================")

if __name__ == "__main__":
    main()
```

---

## 4. Key Architectural Patterns

1. **Model-View Separation**: The `TaskDatabase` class operates independently of Tkinter, allowing unit tests or alternative frontends (e.g. CLI or Web) to reuse the exact same persistence layer.
2. **Dynamic Treeview Tagging**: Using `tag_configure` applies conditional styling (red for High priority, gray for Completed tasks) directly to table rows based on runtime state.
3. **Keyboard Shortcuts**: Binding `<Return>` and `<Delete>` provides rapid, accessible desktop keyboard workflows.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Not Handling Window Close Protocol
If user data must be saved to disk on exit, bind the window close event: `root.protocol("WM_DELETE_WINDOW", on_close)` to prevent data loss.

### 2. Missing Input Validation on Add Task
Check for empty or whitespace-only inputs (`if not task_text.strip():`) to prevent adding blank entries to task lists.

---

---

## 💻 Try It Yourself: Extension Challenge - Double-Click Complete Toggle

### Challenge
Add event binding `<Double-Button-1>` to the Task Listbox so double-clicking any task item strikes it through and toggles its completion status.

### Complete Solution
```python
class TaskListManager:
    def __init__(self):
        self.tasks = [{"name": "Finish Chapter 14", "done": False}]

    def toggle_task(self, index):
        self.tasks[index]["done"] = not self.tasks[index]["done"]
        status = "COMPLETED ✓" if self.tasks[index]["done"] else "PENDING"
        print(f"Task #{index+1} toggled: {self.tasks[index]['name']} -> {status}")

manager = TaskListManager()
manager.toggle_task(0)
manager.toggle_task(0)
```

### Expected Output
```text
Task #1 toggled: Finish Chapter 14 -> COMPLETED ✓
Task #1 toggled: Finish Chapter 14 -> PENDING
```

---

## Practice Quiz

### 1.
How are rows in a `ttk.Treeview` visually styled with custom colors based on data attributes (such as priority or status)?
A. By changing Windows desktop system themes.
B. By configuring tags using `tree.tag_configure("TAG_NAME", foreground="color")` and assigning those tags during `tree.insert(..., tags=("TAG_NAME",))`.
C. By modifying the SQLite table schema.
D. Treeview rows cannot have colors.

**Answer:** B

**Explanation:** In `ttk.Treeview`, rows can be associated with tags during insertion, and visual properties like text color (`foreground`) or background are applied via `tree.tag_configure()`.

---

### 2.
How do you obtain the currently highlighted/selected item in a `ttk.Treeview` widget?
A. `tree.get_active()`
B. `tree.selection()`
C. `tree.current_row()`
D. `tree.clicked()`

**Answer:** B

**Explanation:** `tree.selection()` returns a tuple of item IDs representing currently selected rows in the Treeview.

---

### 3.
What dialog function from `tkinter.messagebox` displays a confirmation modal with "Yes" and "No" buttons and returns a boolean?
A. `messagebox.confirm()`
B. `messagebox.askyesno("Title", "Message")`
C. `messagebox.prompt()`
D. `messagebox.verify()`

**Answer:** B

**Explanation:** `messagebox.askyesno()` creates a modal confirmation dialog that returns `True` if the user clicks "Yes" and `False` if they click "No".

---

### 4.
Why is the Model-View architecture beneficial when building desktop applications with Tkinter?
A. It compiles the Python code into C++.
B. It decouples the UI layout and event listeners from the underlying database logic, making persistence testable and maintainable.
C. It allows Tkinter to run on iOS devices.
D. It prevents any errors from occurring.

**Answer:** B

**Explanation:** Separating database operations into a dedicated class (`TaskDatabase`) independent of UI widgets (`TaskManagerApp`) allows cleaner code, easier refactoring, and independent unit testing.

---

### 5.
Which method cleans out all existing rows from a `ttk.Treeview` before repopulating it with updated database records?
A. `tree.clear()`
B. Iterating over `tree.get_children()` and calling `tree.delete(item)`.
C. `tree.reset()`
D. `tree.destroy()`

**Answer:** B

**Explanation:** To clear a Treeview, you retrieve its current item IDs via `tree.get_children()` and delete each one using `tree.delete(item)`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project 1: Inventory Management System** (15: Final Capstone Projects).

👉 **[Continue to Next Lesson: Project 1: Inventory Management System →](/tutorials/python-for-advanced/project-1-inventory-management-system)**
