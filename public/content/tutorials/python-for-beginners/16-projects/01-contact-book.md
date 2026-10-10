---
id: python-contact-book
slug: contact-book
course: python-for-beginners
chapter: 16
topic: 16.1
title: "Capstone Project: CLI Contact Book with File Persistence"
description: "Build a modular, menu-driven CLI Contact Book application in Python featuring CRUD operations, phone/email validation, and permanent file persistence."
difficulty: Beginner
readingTime: 16
order: 82
keywords:
  - contact book
  - project
  - crud
  - file persistence
  - cli application
  - input validation
  - data structures
lastUpdated: 2026-09-30
author: MSK Institute
version: 1.1.0
---

# Capstone Project: CLI Contact Book with File Persistence

Welcome to your first end-to-end Python capstone project! Up to this point, you have mastered variables, strings, data structures (lists, tuples, sets, dictionaries), conditionals, loops, functions, and file handling.

In this project, you will integrate all these concepts into a production-grade **Command-Line Contact Book Application** featuring full **CRUD** (Create, Read, Update, Delete) operations, Indian mobile number validation, and deterministic disk persistence using the context manager.

---

## Real-World Analogy: The Classic Indian Household Telephone Diary

In Indian homes before smartphones, every family kept a spiral-bound telephone diary beside the landline phone:

```
+-------------------------------------------------------------------------+
|                  INDIAN HOUSEHOLD TELEPHONE DIARY ARCHITECTURE          |
+-------------------------------------------------------------------------+
|                                                                         |
|   [ CLI Menu Interface ]                                                |
|          │                                                              |
|          ▼                                                              |
|   [ Input Validation Layer ] ──> Validates 10-digit Indian Mobile & Email|
|          │                                                              |
|          ▼                                                              |
|   [ In-Memory Hash Map (Dict) ] ──> Fast O(1) Search, Add, Update, Delete|
|          │                                                              |
|   Save   │  ▲ Load at Startup                                           |
|          ▼  │                                                           |
|   [ Storage Engine: contacts.txt via 'with open()' Context Manager ]    |
|                                                                         |
+-------------------------------------------------------------------------+
```

1. **Bootup:** When you open the diary, all prior numbers are already inked in (`contacts.txt` read into RAM).
2. **Adding a contact:** You verify the phone number is valid before writing it down (input validation).
3. **Searching:** You flip directly to the matching letter or name (instant dictionary lookup).
4. **Shutdown:** Every time you write an entry, it remains safely preserved on paper even if the power goes out (disk persistence).

---

## Project Specification & Architecture

Our Contact Book requires the following specifications:
- **Data Model:** An in-memory dictionary where normalized contact names serve as keys:
  ```python
  contacts = {
      "rahul sharma": {
          "name": "Rahul Sharma",
          "phone": "9876543210",
          "email": "rahul.sharma@example.com",
          "category": "Work"
      }
  }
  ```
- **File Persistence:** Contacts are serialized to a pipe-delimited text file (`contacts_db.txt`) using the format:
  `Name|Phone|Email|Category\n`
- **Validation Rules:**
  - Phone number must consist of exactly 10 numeric digits.
  - Email must contain `@` and a period `.` after `@`.
  - Duplicate contact names trigger an overwrite confirmation.
- **Menu System:** An infinite `while True` loop with interactive options 1 to 6.

---

## Step-by-Step Implementation

### Step 1: Input Validation Helper Functions

```python
def validate_phone(phone: str) -> bool:
    """Validates that a phone number contains exactly 10 digits."""
    cleaned = phone.strip()
    return len(cleaned) == 10 and cleaned.isdigit()

def validate_email(email: str) -> bool:
    """Basic validation for email format."""
    cleaned = email.strip()
    if "@" in cleaned and "." in cleaned:
        at_index = cleaned.find("@")
        dot_index = cleaned.rfind(".")
        return at_index > 0 and dot_index > at_index + 1 and dot_index < len(cleaned) - 1
    return False
```

---

### Step 2: Storage Engine with Context Manager

```python
import os

STORAGE_FILE = "contacts_db.txt"

def load_contacts() -> dict:
    """Loads saved contacts from disk into an in-memory dictionary."""
    contacts = {}
    if not os.path.exists(STORAGE_FILE):
        return contacts

    with open(STORAGE_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|")
            if len(parts) == 4:
                name, phone, email, category = parts
                contacts[name.lower()] = {
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "category": category
                }
    return contacts

def save_contacts(contacts: dict) -> None:
    """Persists the dictionary state to disk safely using with open()."""
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        for contact in contacts.values():
            f.write(f"{contact['name']}|{contact['phone']}|{contact['email']}|{contact['category']}\n")
```

---

### Step 3: Complete Production-Grade Contact Book Script

Here is the complete, modular, runnable code for the entire Contact Book system:

```python
"""
MSK Python Capstone: CLI Contact Book with File Persistence
Author: MSK Institute
"""
import os

STORAGE_FILE = "contacts_db.txt"

def validate_phone(phone: str) -> bool:
    cleaned = phone.strip()
    return len(cleaned) == 10 and cleaned.isdigit()

def validate_email(email: str) -> bool:
    cleaned = email.strip()
    if "@" in cleaned and "." in cleaned:
        at_index = cleaned.find("@")
        dot_index = cleaned.rfind(".")
        return at_index > 0 and dot_index > at_index + 1 and dot_index < len(cleaned) - 1
    return False

def load_contacts() -> dict:
    contacts = {}
    if not os.path.exists(STORAGE_FILE):
        return contacts
    with open(STORAGE_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                parts = line.split("|")
                if len(parts) == 4:
                    name, phone, email, cat = parts
                    contacts[name.lower()] = {
                        "name": name,
                        "phone": phone,
                        "email": email,
                        "category": cat
                    }
    return contacts

def save_contacts(contacts: dict) -> None:
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        for c in contacts.values():
            f.write(f"{c['name']}|{c['phone']}|{c['email']}|{c['category']}\n")

def add_contact(contacts: dict, name: str, phone: str, email: str, category: str = "General") -> bool:
    key = name.strip().lower()
    if not name.strip():
        print("[ERROR] Contact name cannot be empty.")
        return False
    if not validate_phone(phone):
        print("[ERROR] Phone number must be exactly 10 digits.")
        return False
    if not validate_email(email):
        print("[ERROR] Invalid email address format.")
        return False

    contacts[key] = {
        "name": name.strip(),
        "phone": phone.strip(),
        "email": email.strip(),
        "category": category.strip()
    }
    save_contacts(contacts)
    print(f"[SUCCESS] Contact '{name.strip()}' saved successfully.")
    return True

def search_contacts(contacts: dict, query: str) -> list:
    query_clean = query.strip().lower()
    results = []
    for key, data in contacts.items():
        if query_clean in key or query_clean in data["phone"]:
            results.append(data)
    return results

def delete_contact(contacts: dict, name: str) -> bool:
    key = name.strip().lower()
    if key in contacts:
        del contacts[key]
        save_contacts(contacts)
        print(f"[SUCCESS] Contact '{name}' deleted successfully.")
        return True
    print(f"[ERROR] No contact found matching '{name}'.")
    return False

def display_all(contacts: dict) -> None:
    if not contacts:
        print("\n[INFO] Contact book is currently empty.\n")
        return
    
    print("\n" + "="*75)
    print(f"{'NAME':<20} | {'PHONE':<12} | {'EMAIL':<25} | {'CATEGORY':<10}")
    print("="*75)
    for c in contacts.values():
        print(f"{c['name']:<20} | {c['phone']:<12} | {c['email']:<25} | {c['category']:<10}")
    print("="*75 + "\n")

# --- Demonstration and Automated Verification ---
if __name__ == "__main__":
    # Clean up old database for testing
    if os.path.exists(STORAGE_FILE):
        os.remove(STORAGE_FILE)

    app_contacts = load_contacts()
    
    print("=== Populating Initial Contacts ===")
    add_contact(app_contacts, "Amitabh Sharma", "9876543210", "amitabh@example.com", "Work")
    add_contact(app_contacts, "Pooja Hegde", "9123456780", "pooja.h@example.com", "Friends")
    add_contact(app_contacts, "Suresh Kumar", "9988776655", "suresh.k@example.com", "Family")
    
    print("\n=== Displaying All Stored Contacts ===")
    display_all(app_contacts)
    
    print("=== Searching for 'sharma' ===")
    matches = search_contacts(app_contacts, "sharma")
    for m in matches:
        print(f"Found: {m['name']} ({m['phone']}) - {m['email']}")
        
    print("\n=== Deleting 'Pooja Hegde' ===")
    delete_contact(app_contacts, "Pooja Hegde")
    
    print("\n=== Loading Fresh from Disk to Prove Persistence ===")
    reloaded_contacts = load_contacts()
    display_all(reloaded_contacts)
```

---

## Expected Output

```text
=== Populating Initial Contacts ===
[SUCCESS] Contact 'Amitabh Sharma' saved successfully.
[SUCCESS] Contact 'Pooja Hegde' saved successfully.
[SUCCESS] Contact 'Suresh Kumar' saved successfully.

=== Displaying All Stored Contacts ===
===========================================================================
NAME                 | PHONE        | EMAIL                     | CATEGORY  
===========================================================================
Amitabh Sharma       | 9876543210   | amitabh@example.com       | Work      
Pooja Hegde          | 9123456780   | pooja.h@example.com       | Friends   
Suresh Kumar         | 9988776655   | suresh.k@example.com      | Family    
===========================================================================

=== Searching for 'sharma' ===
Found: Amitabh Sharma (9876543210) - amitabh@example.com

=== Deleting 'Pooja Hegde' ===
[SUCCESS] Contact 'Pooja Hegde' deleted successfully.

=== Loading Fresh from Disk to Prove Persistence ===
===========================================================================
NAME                 | PHONE        | EMAIL                     | CATEGORY  
===========================================================================
Amitabh Sharma       | 9876543210   | amitabh@example.com       | Work      
Suresh Kumar         | 9988776655   | suresh.k@example.com      | Family    
===========================================================================
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad Implementation | Gold-Standard Implementation |
| :--- | :--- | :--- |
| **Lookup Keys** | Using case-sensitive keys (`"Rahul"` vs `"rahul"`) | Normalize keys with `.strip().lower()` |
| **Input Validation** | Trusting user input blindly without checks | Validate 10-digit format and email structure before saving |
| **Persistence** | Keeping contacts purely in RAM (lost on crash) | Persist every mutation to disk using `with open()` |
| **Data Format** | Unstructured arbitrary string writes | Consistent structured delimiter (`\|` or CSV/JSON) |
| **Search** | Exact match only | Substring search across both name and phone fields |
| **Deletion** | Crashing with `KeyError` if name is missing | Verify key existence with `if key in contacts:` |

---

## Quick Revision Summary Cheat Sheet

- **CRUD Architecture:**
  - **Create:** `contacts[normalized_key] = {...}`
  - **Read:** `display_all()` and `search_contacts()`
  - **Update:** Overwrite dictionary entry with new fields and sync to disk.
  - **Delete:** `del contacts[key]` with prior key existence check.
- **Normalization:** Always use `name.strip().lower()` for dictionary keys so queries like `"AMIT"`, `"amit"`, and `" Amit "` match seamlessly.
- **File I/O Sync:** Call `save_contacts()` immediately after any mutating operation (`add`, `update`, `delete`).
- **Validation:** Enforce validation rules before mutating data state to maintain clean, uncorrupted databases.

---

---

## ⚠️ Production Development Best Practices & Common Traps

1. **Always Validate User Input:** Never trust raw user inputs. Wrap numeric casts with `try...except ValueError` to prevent sudden crashes.
2. **Defensive File Loading:** Always check whether a storage file exists or catch `FileNotFoundError` when initializing terminal databases.
3. **Modular Function Design:** Keep functions focused on a single responsibility (e.g. `load_data()`, `save_data()`, `display_menu()`, `add_record()`).

---

## Practice Quiz

### 1. Why is it best practice to normalize contact names with .strip().lower() when storing them as dictionary keys?
A. Because Python dictionaries only permit lowercase letters as keys
B. To allow case-insensitive and whitespace-resilient lookups regardless of how the user types the name
C. To compress the memory size of strings by 50 percent
D. To encrypt the contact details for cybersecurity
**Answer:** B

---

### 2. Which method safely removes a contact key from a dictionary without raising a KeyError if the contact does not exist?
A. `contacts.remove(key)`
B. `contacts.pop(key, None)`
C. `contacts.delete(key)`
D. `del contacts[key]` without checking
**Answer:** B

---

### 3. In the Contact Book persistence layer, what happens if the storage file does not yet exist on startup?
A. The entire operating system crashes
B. Checking `os.path.exists()` allows returning an empty dictionary gracefully without crashing
C. Python prompts the user to download an external database
D. Python freezes indefinitely
**Answer:** B

---

### 4. What is the time complexity of searching for a contact by exact name when using a Python dictionary?
A. $O(n^2)$
B. $O(n)$
C. $O(1)$ average time complexity
D. $O(\log n)$
**Answer:** C

---

### 5. Why should save_contacts() be called immediately after adding or deleting a contact?
A. To prevent computer monitor flickering
B. To ensure data persistence on disk so changes are not lost if the program terminates unexpectedly
C. Because Python limits in-memory dictionaries to 3 items
D. To empty the RAM of the operating system
**Answer:** B

---

# Practice Challenge

### Scenario: Contact Book with VIP Favorite Flag & CSV Export

Enhance the Contact Book with two features:
1. **VIP Favorite Flag:** Add an `is_favorite` boolean field to each contact (defaulting to `False`).
2. **Toggle VIP Status:** Create a function `toggle_favorite(contacts, name)` that flips the boolean status and saves to disk.
3. **Filter Favorites:** Implement a function `get_favorites(contacts)` that returns only VIP contacts.
4. **CSV Export:** Implement `export_to_csv(contacts, filename)` that writes the contacts with a standard CSV header: `Name,Phone,Email,Category,Favorite`.

### Starter Code
```python
# Starting dictionary
contacts = {
    "arun sharma": {
        "name": "Arun Sharma",
        "phone": "9876543210",
        "email": "arun@example.com",
        "category": "Work",
        "is_favorite": False
    },
    "kavita rani": {
        "name": "Kavita Rani",
        "phone": "9811223344",
        "email": "kavita@example.com",
        "category": "Family",
        "is_favorite": True
    }
}

# TODO: Implement toggle_favorite, get_favorites, and export_to_csv
```

### Complete Solution
```python
contacts = {
    "arun sharma": {
        "name": "Arun Sharma",
        "phone": "9876543210",
        "email": "arun@example.com",
        "category": "Work",
        "is_favorite": False
    },
    "kavita rani": {
        "name": "Kavita Rani",
        "phone": "9811223344",
        "email": "kavita@example.com",
        "category": "Family",
        "is_favorite": True
    }
}

def toggle_favorite(book: dict, name: str) -> bool:
    key = name.strip().lower()
    if key in book:
        book[key]["is_favorite"] = not book[key]["is_favorite"]
        status = "Starred VIP" if book[key]["is_favorite"] else "Standard"
        print(f"[STATUS] {book[key]['name']} is now: {status}")
        return True
    print(f"[ERROR] Contact '{name}' not found.")
    return False

def get_favorites(book: dict) -> list:
    return [c for c in book.values() if c.get("is_favorite", False)]

def export_to_csv(book: dict, filename: str) -> None:
    with open(filename, "w", encoding="utf-8") as f:
        f.write("Name,Phone,Email,Category,Favorite\n")
        for c in book.values():
            f.write(f"{c['name']},{c['phone']},{c['email']},{c['category']},{c['is_favorite']}\n")
    print(f"[SUCCESS] Exported {len(book)} contacts to '{filename}'.")

# Test the enhancements
toggle_favorite(contacts, "Arun Sharma")
vip_list = get_favorites(contacts)
print("\n--- VIP Favorites List ---")
for vip in vip_list:
    print(f"⭐ {vip['name']} ({vip['phone']}) - {vip['category']}")

export_to_csv(contacts, "vip_contacts.csv")

# Verify exported CSV
print("\n--- Exported CSV Contents ---")
with open("vip_contacts.csv", "r", encoding="utf-8") as f:
    print(f.read().strip())
```

### Expected Output
```text
[STATUS] Arun Sharma is now: Starred VIP

--- VIP Favorites List ---
⭐ Arun Sharma (9876543210) - Work
⭐ Kavita Rani (9811223344) - Family
[SUCCESS] Exported 2 contacts to 'vip_contacts.csv'.

--- Exported CSV Contents ---
Name,Phone,Email,Category,Favorite
Arun Sharma,9876543210,arun@example.com,Work,True
Kavita Rani,9811223344,kavita@example.com,Family,True
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Quiz Application** (16: Projects).

👉 **[Continue to Next Lesson: Quiz Application →](/tutorials/python-for-beginners/quiz-application)**
