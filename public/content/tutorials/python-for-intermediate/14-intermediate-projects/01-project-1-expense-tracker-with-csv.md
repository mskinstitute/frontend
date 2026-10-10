---
id: python-intermediate-project-1-expense-tracker-with-csv
slug: project-1-expense-tracker-with-csv
course: python-for-intermediate
chapter: "14: Intermediate Projects"
topic: "14.1 Project 1: Expense Tracker with CSV"
title: "Project 1: Expense Tracker with CSV in Python"
description: "Master project 1: expense tracker with csv in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 66
keywords:
  - python project 1 expense tracker with csv
  - python intermediate
  - python project 1: expense tracker with csv
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project 1: Expense Tracker with CSV in Python

In this intermediate project, we synthesize multiple concepts covered across the curriculum—**File Handling with CSV, Context Managers, Dictionary Comprehensions, Exception Handling, and the `datetime` module**—to construct a production-ready **Command-Line Personal Finance & Expense Tracker**.

---

## 1. Project Requirements & Architecture

The application provides persistent financial tracking stored in `expenses.csv`:

1. **Storage Layer**: Uses `csv.DictReader` and `csv.DictWriter` with explicit `newline=''` and `utf-8` encoding.
2. **Data Model**:
   - `id`: Unique sequential transaction identifier.
   - `date`: ISO timestamp formatted as `YYYY-MM-DD`.
   - `category`: Classification (Food, Utilities, Rent, Entertainment, Travel, Health).
   - `amount`: Floating-point expenditure.
   - `description`: Notes explaining the transaction.
3. **Analytics Engine**:
   - Computes monthly burn rate and category aggregations using dictionary comprehensions.
   - Identifies budget trends and highest expenditure items.
4. **Resilient CLI**: Validates currency formats, prevents empty inputs, and handles missing files cleanly.

---

## 2. Complete Project Implementation

```python
import csv
import os
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Any

CSV_FILE = "expenses.csv"
FIELDNAMES = ["id", "date", "category", "amount", "description"]
VALID_CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Health", "Shopping", "Others"]


def initialize_storage():
    """Initializes the CSV storage file with headers if absent."""
    if not os.path.exists(CSV_FILE):
        try:
            with open(CSV_FILE, mode="w", encoding="utf-8", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
                writer.writeheader()
        except OSError as err:
            print(f"Failed to initialize database: {err}")


def load_expenses() -> List[Dict[str, Any]]:
    """Loads and returns all expenses from CSV with typed numeric conversion."""
    expenses = []
    if not os.path.exists(CSV_FILE):
        initialize_storage()
        return expenses

    try:
        with open(CSV_FILE, mode="r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    row["id"] = int(row["id"])
                    row["amount"] = float(row["amount"])
                    expenses.append(row)
                except (ValueError, KeyError):
                    continue
    except OSError as err:
        print(f"Error loading expense file: {err}")
    return expenses


def save_expenses(expenses: List[Dict[str, Any]]) -> bool:
    """Overwrites the CSV with the updated expenses list."""
    try:
        with open(CSV_FILE, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(expenses)
        return True
    except OSError as err:
        print(f"Error saving to CSV: {err}")
        return False


def add_expense():
    """Prompts user to record a new expenditure with validation."""
    print("\n--- Record New Expense ---")
    
    # 1. Date input
    date_input = input("Enter date (YYYY-MM-DD) or press Enter for Today: ").strip()
    if not date_input:
        expense_date = datetime.now().strftime("%Y-%m-%d")
    else:
        try:
            datetime.strptime(date_input, "%Y-%m-%d")
            expense_date = date_input
        except ValueError:
            print("Error: Invalid date format. Use YYYY-MM-DD.")
            return

    # 2. Category selection
    print(f"Available Categories: {', '.join(VALID_CATEGORIES)}")
    category = input("Enter Category: ").strip().capitalize()
    if category not in VALID_CATEGORIES:
        category = "Others"

    # 3. Amount validation
    try:
        amount = float(input("Enter Amount (₹): ").strip())
        if amount <= 0:
            print("Error: Expense amount must be positive.")
            return
    except ValueError:
        print("Error: Amount must be a valid numeric value.")
        return

    description = input("Enter Short Description: ").strip() or "General expense"

    expenses = load_expenses()
    next_id = max([e["id"] for e in expenses], default=0) + 1

    new_record = {
        "id": next_id,
        "date": expense_date,
        "category": category,
        "amount": amount,
        "description": description
    }

    expenses.append(new_record)
    if save_expenses(expenses):
        print(f"Success: Expense #{next_id} (₹{amount:,.2f}) recorded successfully!")


def view_all_expenses():
    """Displays all logged transactions in tabular format."""
    expenses = load_expenses()
    if not expenses:
        print("\nNo expense records found. Start logging today!")
        return

    print("\n" + "=" * 70)
    print(f"{'ID':<5} | {'DATE':<12} | {'CATEGORY':<14} | {'AMOUNT':<12} | {'DESCRIPTION'}")
    print("-" * 70)
    for e in expenses:
        print(f"{e['id']:<5} | {e['date']:<12} | {e['category']:<14} | ₹{e['amount']:<11.2f} | {e['description']}")
    print("=" * 70)
    total_spent = sum(e["amount"] for e in expenses)
    print(f"Total Cumulative Expenditure: ₹{total_spent:,.2f}")


def view_category_breakdown():
    """Calculates category-wise spend and percentage distribution."""
    expenses = load_expenses()
    if not expenses:
        print("\nNo expenses found to analyze.")
        return

    category_totals = defaultdict(float)
    for e in expenses:
        category_totals[e["category"]] += e["amount"]

    grand_total = sum(category_totals.values())

    print("\n" + "=" * 55)
    print("           CATEGORY-WISE SPENDING BREAKDOWN")
    print("=" * 55)
    print(f"{'CATEGORY':<18} | {'TOTAL SPENT':<15} | {'SHARE (%)'}")
    print("-" * 55)

    for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        share = (total / grand_total) * 100
        print(f"{cat:<18} | ₹{total:<14.2f} | {share:.1f}%")
    print("=" * 55)
    print(f"Grand Total: ₹{grand_total:,.2f}\n")


def delete_expense():
    """Deletes an expense record by its ID."""
    try:
        target_id = int(input("\nEnter Expense ID to delete: ").strip())
    except ValueError:
        print("Error: Invalid ID.")
        return

    expenses = load_expenses()
    filtered = [e for e in expenses if e["id"] != target_id]

    if len(filtered) == len(expenses):
        print(f"Error: Expense #{target_id} not found.")
    else:
        if save_expenses(filtered):
            print(f"Expense #{target_id} deleted successfully.")


def main():
    initialize_storage()
    while True:
        print("\n===== PERSONAL EXPENSE TRACKER =====")
        print("1. View All Expenses")
        print("2. Add New Expense")
        print("3. Category Spending Breakdown")
        print("4. Delete Expense Record")
        print("5. Exit")

        choice = input("Select an option (1-5): ").strip()

        if choice == "1":
            view_all_expenses()
        elif choice == "2":
            add_expense()
        elif choice == "3":
            view_category_breakdown()
        elif choice == "4":
            delete_expense()
        elif choice == "5":
            print("Exiting Expense Tracker. Stay financially mindful!")
            break
        else:
            print("Invalid option. Choose between 1 and 5.")


if __name__ == "__main__":
    main()
```

---

## 3. Sample Execution Simulation

```text
===== PERSONAL EXPENSE TRACKER =====
1. View All Expenses
2. Add New Expense
3. Category Spending Breakdown
4. Delete Expense Record
5. Exit
Select an option (1-5): 2

--- Record New Expense ---
Enter date (YYYY-MM-DD) or press Enter for Today: 
Available Categories: Food, Transport, Utilities, Entertainment, Health, Shopping, Others
Enter Category: Food
Enter Amount (₹): 450.00
Enter Short Description: Team Lunch
Success: Expense #1 (₹450.00) recorded successfully!

===== PERSONAL EXPENSE TRACKER =====
Select an option (1-5): 3

=======================================================
           CATEGORY-WISE SPENDING BREAKDOWN
=======================================================
CATEGORY           | TOTAL SPENT     | SHARE (%)
-------------------------------------------------------
Food               | ₹450.00         | 100.0%
=======================================================
Grand Total: ₹450.00
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Crashing on Missing CSV File
On the first run, the CSV file will not exist yet. Check `os.path.exists()` before attempting to read, or initialize the file with header columns if missing.

### 2. Invalid Date and Currency Input
Validate numeric inputs using `try-except float(amount)` to ensure users cannot crash the application by typing letters into expense fields.

---

---

## 💻 Try It Yourself: Extension Challenge - Monthly Expense Summary

### Challenge
Add a summary function that groups all recorded expenses by category (e.g. Food, Travel, Utilities) and prints the subtotal and percentage of total expenditure for each category.

### Complete Solution
```python
from collections import defaultdict

def print_category_breakdown(expenses):
    totals = defaultdict(float)
    grand_total = 0.0
    for exp in expenses:
        cat = exp["category"]
        amt = float(exp["amount"])
        totals[cat] += amt
        grand_total += amt
        
    print(f"
--- Category Breakdown (Total: ₹{grand_total:,.2f}) ---")
    for cat, amt in sorted(totals.items(), key=lambda x: x[1], reverse=True):
        pct = (amt / grand_total) * 100 if grand_total > 0 else 0
        print(f"- {cat:<15}: ₹{amt:>9,.2f} ({pct:5.1f}%)")

sample_expenses = [
    {"category": "Food", "amount": 450},
    {"category": "Travel", "amount": 200},
    {"category": "Food", "amount": 350},
    {"category": "Utilities", "amount": 1200}
]
print_category_breakdown(sample_expenses)
```

### Expected Output
```text
--- Category Breakdown (Total: ₹2,200.00) ---
- Utilities      : ₹ 1,200.00 ( 54.5%)
- Food           : ₹   800.00 ( 36.4%)
- Travel         : ₹   200.00 (  9.1%)
```

---

## Practice Quiz

### 1. In this project, what ensures that sequential IDs never collide when generating a new expense?
A. Generating a random integer
B. Calculating `max([e['id'] for e in expenses], default=0) + 1`
C. Asking the user to pick an ID
D. Reading system clock milliseconds
**Answer:** B
**Explanation:** Finding the maximum existing ID and adding 1 guarantees unique, monotonic incrementing IDs.
---

### 2. How does the program validate user date input strings?
A. By regular expression matching
B. By calling `datetime.strptime(date_input, "%Y-%m-%d")` inside a `try-except ValueError` block
C. By comparing lengths
D. Dates cannot be validated in Python
**Answer:** B
**Explanation:** `datetime.strptime()` attempts to parse the string according to the calendar format, raising `ValueError` if illegal.
---

### 3. Which data structure from the `collections` module simplifies accumulating category totals without initialization checks?
A. `collections.OrderedDict`
B. `collections.defaultdict(float)`
C. `collections.deque`
D. `collections.namedtuple`
**Answer:** B
**Explanation:** `defaultdict(float)` initializes missing category keys to `0.0`, allowing direct accumulation (`category_totals[cat] += amount`).
---

### 4. What happens if `expenses.csv` does not exist when the user launches the application?
A. The application raises an unhandled `FileNotFoundError`
B. `initialize_storage()` creates the file and writes the column headers using `csv.DictWriter`
C. Python prompts the user to insert a USB drive
D. The script halts with an exit code 1
**Answer:** B
**Explanation:** `initialize_storage()` checks for the file's presence and initializes it with headers if absent.
---

### 5. Why must `amount` be converted using `float(row['amount'])` after reading from CSV?
A. CSV format stores all values strictly as strings in text mode
B. To round numbers to the nearest integer
C. Float conversion is required by Python's static type checker
D. To prevent buffer overflows
**Answer:** A
**Explanation:** Flat CSV files store plain text; numeric columns must be explicitly parsed from strings to floats for arithmetic.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project 2: API-based Dictionary App** (14: Intermediate Projects).

👉 **[Continue to Next Lesson: Project 2: API-based Dictionary App →](/tutorials/python-for-intermediate/project-2-api-based-dictionary-app)**
