---
id: python-intermediate-project-csv-contact-manager
slug: project-csv-contact-manager
course: python-for-intermediate
chapter: "4: File Handling Advanced"
topic: "4.5 Project: CSV Contact Manager"
title: "Project: CSV Contact Manager in Python"
description: "Master project: csv contact manager in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 20
keywords:
  - python project csv contact manager
  - python intermediate
  - python project: csv contact manager
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: CSV Contact Manager

In this hands-on project, we will apply the advanced file handling techniques covered in this chapter—including `csv.DictReader`, `csv.DictWriter`, context managers, and robust error handling—to build a persistent Command-Line **CSV Contact Manager**.

---

## 1. Project Specifications & Requirements

The application will manage contact records and save them to `contacts.csv`. Key capabilities:
1. **Data Persistence**: Automatically reads from and writes to a structured CSV file.
2. **Auto-Initialization**: Gracefully initializes the CSV file with headers if it does not yet exist.
3. **Core CRUD Operations**:
   - **Create**: Add new contacts with validation.
   - **Read**: Display all contacts in a formatted table.
   - **Search**: Case-insensitive search by name or category.
   - **Delete**: Remove a contact by name and rewrite the updated dataset.
4. **Safety**: Handles missing files, invalid inputs, and file permissions without crashing.

---

## 2. Complete Application Code

```python
import csv
import os

CSV_FILE = "contacts.csv"
FIELDNAMES = ["name", "phone", "email", "category"]


def initialize_storage():
    """Ensures the CSV file exists with the proper column headers."""
    if not os.path.exists(CSV_FILE):
        try:
            with open(CSV_FILE, mode="w", encoding="utf-8", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
                writer.writeheader()
        except OSError as err:
            print(f"Error initializing contact database: {err}")


def load_contacts():
    """Loads and returns all contacts as a list of dictionaries."""
    contacts = []
    try:
        with open(CSV_FILE, mode="r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                contacts.append(row)
    except FileNotFoundError:
        initialize_storage()
    except OSError as err:
        print(f"Error reading {CSV_FILE}: {err}")
    return contacts


def save_contacts(contacts):
    """Overwrites the CSV file with the provided list of contact dictionaries."""
    try:
        with open(CSV_FILE, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(contacts)
        return True
    except OSError as err:
        print(f"Failed to save contacts: {err}")
        return False


def add_contact():
    """Prompts for contact details and appends to CSV."""
    print("\n--- Add New Contact ---")
    name = input("Enter Full Name: ").strip()
    phone = input("Enter Phone Number: ").strip()
    email = input("Enter Email Address: ").strip()
    category = input("Enter Category (Family/Work/Friend): ").strip().capitalize()

    if not name or not phone:
        print("Error: Name and Phone number are required fields!")
        return

    contacts = load_contacts()
    
    # Check for duplicate names
    if any(c["name"].lower() == name.lower() for c in contacts):
        print(f"A contact named '{name}' already exists.")
        return

    new_contact = {
        "name": name,
        "phone": phone,
        "email": email or "N/A",
        "category": category or "General"
    }

    contacts.append(new_contact)
    if save_contacts(contacts):
        print(f"Contact '{name}' added successfully!")


def view_contacts():
    """Displays all contacts in a formatted table."""
    contacts = load_contacts()
    if not contacts:
        print("\nNo contacts found. Add one first!")
        return

    print("\n" + "=" * 65)
    print(f"{'NAME':<20} | {'PHONE':<15} | {'CATEGORY':<10} | {'EMAIL'}")
    print("-" * 65)
    for c in contacts:
        print(f"{c['name']:<20} | {c['phone']:<15} | {c['category']:<10} | {c['email']}")
    print("=" * 65)


def search_contact():
    """Searches contacts by name or category substring."""
    query = input("\nEnter search term (name or category): ").strip().lower()
    contacts = load_contacts()
    
    results = [
        c for c in contacts 
        if query in c["name"].lower() or query in c["category"].lower()
    ]

    if not results:
        print(f"No contacts matching '{query}'.")
        return

    print(f"\nFound {len(results)} match(es):")
    for c in results:
        print(f" - {c['name']} ({c['category']}): {c['phone']} | {c['email']}")


def delete_contact():
    """Deletes a contact by exact name."""
    name_to_delete = input("\nEnter exact name of contact to delete: ").strip().lower()
    contacts = load_contacts()
    
    initial_count = len(contacts)
    updated_contacts = [c for c in contacts if c["name"].lower() != name_to_delete]

    if len(updated_contacts) == initial_count:
        print(f"No contact found with name '{name_to_delete}'.")
    else:
        if save_contacts(updated_contacts):
            print("Contact deleted successfully.")


def main_menu():
    """Main user interaction loop."""
    initialize_storage()
    
    while True:
        print("\n===== CONTACT MANAGER (CSV) =====")
        print("1. View All Contacts")
        print("2. Add New Contact")
        print("3. Search Contact")
        print("4. Delete Contact")
        print("5. Exit")

        choice = input("Select an option (1-5): ").strip()

        if choice == "1":
            view_contacts()
        elif choice == "2":
            add_contact()
        elif choice == "3":
            search_contact()
        elif choice == "4":
            delete_contact()
        elif choice == "5":
            print("Exiting Contact Manager. Goodbye!")
            break
        else:
            print("Invalid choice. Please choose between 1 and 5.")


if __name__ == "__main__":
    main_menu()
```

---

## 3. Sample Execution Output

```text
===== CONTACT MANAGER (CSV) =====
1. View All Contacts
2. Add New Contact
3. Search Contact
4. Delete Contact
5. Exit
Select an option (1-5): 2

--- Add New Contact ---
Enter Full Name: Anita Desai
Enter Phone Number: +91-9876543210
Enter Email Address: anita@example.com
Enter Category (Family/Work/Friend): Work
Contact 'Anita Desai' added successfully!

===== CONTACT MANAGER (CSV) =====
1. View All Contacts
2. Add New Contact
3. Search Contact
4. Delete Contact
5. Exit
Select an option (1-5): 1

=================================================================
NAME                 | PHONE           | CATEGORY   | EMAIL
-----------------------------------------------------------------
Anita Desai          | +91-9876543210  | Work       | anita@example.com
=================================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Corrupting Data During Mid-Write Crashes
Writing directly to the target CSV file risks truncating existing data if the script crashes mid-write. In mission-critical systems, write to a temporary file first and atomically replace the destination with `os.replace()`.

### 2. Case-Sensitive Search Mismatches
Always normalize search strings and contact names using `.lower().strip()` before comparison to ensure reliable search results.

---

---

## 💻 Try It Yourself: Extension Challenge - Contact Export

### Challenge
Extend the Contact Manager to add a search filter method that finds contacts by company domain name (e.g., finding all contacts with an email ending in `@msk.in`).

### Solution
```python
def find_contacts_by_domain(contacts, domain):
    target = f"@{domain.lower().lstrip('@')}"
    return [c for c in contacts if c.get("email", "").lower().endswith(target)]

# Sample test
test_contacts = [
    {"name": "Aarav", "email": "aarav@msk.in"},
    {"name": "Priya", "email": "priya@google.com"},
    {"name": "Rohan", "email": "rohan@msk.in"}
]

matched = find_contacts_by_domain(test_contacts, "msk.in")
print(f"Found {len(matched)} matching contacts:")
for c in matched:
    print(f"- {c['name']} ({c['email']})")
```

### Expected Output
```text
Found 2 matching contacts:
- Aarav (aarav@msk.in)
- Rohan (rohan@msk.in)
```

---

## Practice Quiz

### 1. In our Contact Manager, what happens if `contacts.csv` does not exist when the program boots?
A. The script crashes immediately with a `FileNotFoundError`
B. `initialize_storage()` creates the file and writes the header row using `csv.DictWriter`
C. Python waits for user input before attempting any file access
D. An in-memory SQLite database is used instead
**Answer:** B
**Explanation:** `initialize_storage()` checks if the file exists; if not, it opens the file with mode `'w'` and calls `writer.writeheader()` to establish the schema.
---

### 2. How does the `delete_contact()` function remove a record from the CSV file?
A. By seeking directly to the byte offset in the CSV file and issuing `f.truncate()`
B. By loading records into memory, filtering out the deleted entry, and rewriting the entire file
C. By writing an empty dictionary at the row index
D. The `csv` module does not support deleting records
**Answer:** B
**Explanation:** In standard sequential text/CSV files, deleting a record requires filtering the in-memory list of records and rewriting the updated collection with `save_contacts()`.
---

### 3. Why is `newline=''` supplied to `open()` during both load and save operations?
A. To convert single quotes to double quotes automatically
B. To ensure consistent line termination across Windows, Linux, and macOS without extra blank lines
C. To prevent Unicode characters from being parsed
D. To disable buffering for faster disk writes
**Answer:** B
**Explanation:** The `newline=''` argument ensures Python's file object delegates all newline translation to the CSV reader/writer, preventing unwanted blank lines on Windows platforms.
---

### 4. Which method of `csv.DictWriter` writes all dictionary rows in a single step?
A. `writer.dump_all()`
B. `writer.write_batch()`
C. `writer.writerows()`
D. `writer.save()`
**Answer:** C
**Explanation:** `writer.writerows(iterable_of_dicts)` accepts an iterable of row dictionaries and writes them all into the CSV file.
---

### 5. Why is `csv.DictReader` preferred over index-based `csv.reader` for storing entities with multiple attributes like contacts?
A. `DictReader` is written in C and runs 10x faster
B. Attributes can be accessed safely by column name (e.g. `c['phone']`), making the code resilient to column reordering
C. `DictReader` encrypts user passwords automatically
D. `DictReader` handles binary image files
**Answer:** B
**Explanation:** `DictReader` accesses values by header names instead of fixed integer indices, preventing bugs when columns are added, removed, or reordered in the CSV file.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Creating Classes & Objects (Review)** (5: Object-Oriented Programming (Intermediate)).

👉 **[Continue to Next Lesson: Creating Classes & Objects (Review) →](/tutorials/python-for-intermediate/creating-classes-objects-review)**
