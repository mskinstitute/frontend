---
id: dictionaries-introduction
slug: dictionaries-introduction
course: python-for-beginners
chapter: 11
topic: 11.1
title: Python Dictionaries Introduction
description: Discover Python dictionaries, the fundamental key-value mapping type. Master hash table internals, unique key constraints, insertion ordering, and syntax.
difficulty: Beginner
readingTime: 13
order: 49
keywords:
  - python dictionaries
  - key value pairs
  - dict hash table
  - hashable keys
  - dictionary insertion order
  - python mapping type
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python Dictionaries: Key-Value Mappings, Hash-Table Architecture & Insertion Ordering

In sequences like lists and tuples, every item is identified strictly by an arbitrary numeric position (`0, 1, 2...`). But in real-world software, identifying data by index is fragile and unintuitive. When looking up an employee's salary, an Aadhaar user's profile, or a server configuration parameter, you want to query by meaningful semantic labels: `"salary"`, `"aadhaar_number"`, or `"database_host"`.

In Python, the **dictionary** (`dict`) is the primary built-in **mapping type**. A dictionary stores data as associative **key-value pairs** enclosed in curly braces `{key: value}`. Under the hood, Python dictionaries are powered by optimized hash tables that deliver lightning-fast $O(1)$ constant-time lookups while guaranteeing insertion-order preservation (since Python 3.7).

---

## Real-World Analogy: The Kirana Khata Register & The Oxford English Dictionary

```
+-------------------------------------------------------------------------+
|                  DICTIONARY REAL-WORLD ANALOGY                          |
+-------------------------------------------------------------------------+

  1. THE KIRANA KHATA BAHI (Ledger of Accounts):
     - A local provision store owner in Kanpur maintains a Khata ledger.
     - Each customer has a unique account label (The KEY): "Gupta Ji",
       "Sharma Niwas", "Dr. Murthy".
     - Flipping to "Gupta Ji" reveals their running balance and credit
       items (The VALUE).
     - Keys must be unique! Two different families cannot share the exact
       same Khata account label.

  2. THE OXFORD ENGLISH DICTIONARY:
     - You search for the term "Algorithm" (KEY).
     - You immediately find its meaning, pronunciation, and etymology (VALUE).
     - You don't have to read all words starting with 'A' to find "Algorithm".

  3. AADHAAR BIOMETRIC DATABASE:
     - Key:   "9876-5432-1098" (Immutable, strictly unique Aadhaar number)
     - Value: {"name": "Priya Sharma", "dob": "1994-08-15", "city": "Jaipur"}
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Compact Hash Table Representation in CPython

Since Python 3.6+ (officially standardized in 3.7), Python employs a space-efficient, **compact hash table architecture** that preserves element insertion order while maintaining $O(1)$ access speed.

```
===========================================================================
             COMPACT DICTIONARY HASH TABLE (CPYTHON 3.7+)
===========================================================================

  user = {"name": "Aarav", "role": "Admin", "score": 98}

  1. DENSE ENTRIES ARRAY (Preserves exact insertion order):
     Index   | Hash Code   | Key Pointer  | Value Pointer
     --------+-------------+--------------+----------------
     [0]     | 0x7F1890A1  | -> "name"    | -> "Aarav"
     [1]     | 0x3E0124B9  | -> "role"    | -> "Admin"
     [2]     | 0x99201FC4  | -> "score"   | -> 98

  2. SPARSE HASH INDEX ARRAY (Fast O(1) jump table):
     [ -1,  0,  -1,  2,  -1,  1,  -1,  -1 ]
            ^        ^        ^
            |        |        +-- hash("role") % 8 points to Entry [1]
            |        +----------- hash("score") % 8 points to Entry [2]
            +-------------------- hash("name") % 8 points to Entry [0]
```

---

## 1. Creating Python Dictionaries

Python offers several intuitive syntaxes to define dictionaries:

```python
# ==========================================================
# Example 1: Dictionary Initialization Syntax
# ==========================================================

# 1. Standard curly brace literal with key-value pairs
student_profile = {
    "roll_no": 1048,
    "full_name": "Aarav Sharma",
    "course": "Python for Beginners",
    "is_enrolled": True,
    "gpa": 9.25
}
print(f"Student Profile: {student_profile}")

# 2. Using the dict() constructor with keyword arguments (Keys become strings)
server_config = dict(host="127.0.0.1", port=8000, debug_mode=True)
print(f"Server Config:    {server_config}")

# 3. Converting a list of key-value tuples into a dict
currency_pairs = dict([("INR", "Indian Rupee"), ("USD", "US Dollar"), ("EUR", "Euro")])
print(f"Currency Dict:    {currency_pairs}")

# 4. Creating an empty dictionary
empty_dict_lit = {}
empty_dict_ctor = dict()
print(f"Empty Dict Types: {type(empty_dict_lit).__name__}, {type(empty_dict_ctor).__name__}")
```

```text
Output:
Student Profile: {'roll_no': 1048, 'full_name': 'Aarav Sharma', 'course': 'Python for Beginners', 'is_enrolled': True, 'gpa': 9.25}
Server Config:    {'host': '127.0.0.1', 'port': 8000, 'debug_mode': True}
Currency Dict:    {'INR': 'Indian Rupee', 'USD': 'US Dollar', 'EUR': 'Euro'}
Empty Dict Types: dict, dict
```

---

## 2. Key Restrictions: Keys Must Be Hashable & Unique

While **values** can be of any data type whatsoever (numbers, strings, lists, or even other dictionaries), **keys** must satisfy two strict rules:

1. **Keys must be unique:** Defining duplicate keys overwrites the previous entry with the latest value.
2. **Keys must be hashable:** Keys must be immutable types (`str`, `int`, `float`, `tuple`, `frozenset`). Mutable objects like `list` or `dict` cannot be keys!

```python
# ==========================================================
# Example 2: Key Constraints & The Duplicate Overwrite Rule
# ==========================================================

# 1. Duplicate Keys Overwrite the Preceding Value:
inventory = {
    "apples": 50,
    "bananas": 120,
    "apples": 75  # Overwrites earlier 50!
}
print(f"Inventory after duplicate key: {inventory} (Apples updated to 75!)")

# 2. Hashable Tuple Key (Valid)
location_cache = {
    (28.6139, 77.2090): "New Delhi Capital Marker",
    (19.0760, 72.8777): "Mumbai Financial Hub"
}
print(f"Tuple Key Coordinates: {location_cache[(28.6139, 77.2090)]}")

# 3. Unhashable List Key (Raises TypeError!)
try:
    bad_dict = { ["delhi", "mumbai"]: "Transit Route" }
except TypeError as err:
    print(f"Key Hashability Crash: {err}")
```

```text
Output:
Inventory after duplicate key: {'apples': 75, 'bananas': 120} (Apples updated to 75!)
Tuple Key Coordinates: New Delhi Capital Marker
Key Hashability Crash: unhashable type: 'list'
```

---

## 3. Ordered Behavior: Python 3.7+ Insertion Guarantee

Prior to Python 3.7, dictionaries were unordered hash collections where iteration order was unpredictable. In modern Python, dictionaries **strictly preserve insertion order**:

```python
# ==========================================================
# Example 3: Insertion Order Preservation
# ==========================================================

steps = {}
steps["Step 1"] = "Boil water in saucepan"
steps["Step 2"] = "Add crushed ginger and tea leaves"
steps["Step 3"] = "Pour fresh milk and simmer"
steps["Step 4"] = "Filter into kulhad cup and serve hot"

print("Chai Preparation Recipe (Guaranteed Order):")
for step_num, instruction in steps.items():
    print(f"  {step_num} -> {instruction}")
```

```text
Output:
Chai Preparation Recipe (Guaranteed Order):
  Step 1 -> Boil water in saucepan
  Step 2 -> Add crushed ginger and tea leaves
  Step 3 -> Pour fresh milk and simmer
  Step 4 -> Filter into kulhad cup and serve hot
```

---

## Do's and Don'ts: Python Dictionaries

| Scenario | ❌ Anti-Pattern | ✅ Pythonic Idiom |
| :--- | :--- | :--- |
| **Empty Dict** | `d = dict()` | `d = {}` (Faster literal) |
| **Mutable Key** | Using a list as key `{ [1, 2]: "val" }` | Using a tuple as key `{ (1, 2): "val" }` |
| **Check Key Presence** | `if k in d.keys():` (Redundant method call) | `if k in d:` (Direct $O(1)$ dict lookup) |
| **Duplicate Keys** | Relying on duplicate keys to store history | Store lists as values: `{ "apples": [50, 75] }` |
| **Lookups** | Looping through dictionary to find a key | Direct index `d[key]` or safe `d.get(key)` |

---

## Quick Revision Summary Cheat Sheet

```
+---------------------------------------------------------------------------+
|                     PYTHON DICTIONARY CHEAT SHEET                         |
+---------------------------------------------------------------------------+
|  Property            | Behavior / Constraint                              |
|----------------------+----------------------------------------------------|
|  Syntax              | {key1: val1, key2: val2}                           |
|  Empty Definition    | {} or dict()                                       |
|  Key Requirements    | Must be strictly unique and hashable (immutable)   |
|  Value Requirements  | Completely unconstrained (Any Python object)       |
|  Ordering            | Strictly preserves insertion order (Python 3.7+)   |
|  Lookup Complexity   | O(1) average constant time (Hash table buckets)   |
|  Duplicate Keys      | Later key silently overwrites previous value       |
|  Membership Test     | 'key' in dict tests if key exists                  |
+---------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Using Square Brackets for Keys That Might Not Exist
Accessing `dict[key]` directly raises a `KeyError` if the key is missing. Use `.get()` instead:
```python
user = {"name": "Pooja"}

# ❌ Raises KeyError: 'email'
# print(user["email"])

# ✅ Safe with default fallback
print(user.get("email", "Not provided"))  # "Not provided"
```

### 2. Using Mutable Objects as Dictionary Keys
Keys must be hashable and immutable. Lists cannot be used as keys, but tuples can:
```python
# ❌ TypeError: unhashable type: 'list'
# d = {[1, 2]: "coords"}

# ✅ CORRECT (Use tuple)
d = {(1, 2): "coords"}
```

---

## Practice Quiz

### 1. What data structure powers Python dictionaries under the hood?
A. Binary Search Tree
B. Compact Hash Table with sparse indices and dense entries
C. Linked List of tuples
D. Heap Queue

**Answer:** B

---

### 2. What happens when a dictionary literal is declared with duplicate keys: `d = {"x": 10, "x": 20}`?
A. Python raises a `KeyError`
B. Both values are preserved in a list `{"x": [10, 20]}`
C. The second value `20` silently overwrites `10`, leaving `{"x": 20}`
D. Python raises a `SyntaxError`

**Answer:** C

---

### 3. Which of the following types CANNOT be used as a dictionary key?
A. `str` (`"username"`)
B. `int` (`104`)
C. `tuple` (`(1, 2)`)
D. `list` (`[1, 2]`)

**Answer:** D

---

### 4. Since which version of Python is dictionary insertion ordering officially guaranteed by the language specification?
A. Python 2.7
B. Python 3.0
C. Python 3.7
D. Python 3.12

**Answer:** C

---

### 5. What is the output of `len({"A": 1, "B": 2, "A": 3})`?
A. 3
B. 2
C. 1
D. `ValueError`

**Answer:** B

---

## Hands-On Practice Challenge: Customer Khata Ledger Manager

Design a grocery store credit ledger program for a Kirana merchant in Lucknow. Store customer names as keys and their current outstanding credit balances in INR as values. Implement features to register new customer balances, look up a customer's balance by name using direct key access, handle coordinate-based store branch caches using tuple keys, and print a formatted summary ledger.

### Starter Script & Complete Solution

```python
# ==========================================================
# Challenge: Kirana Store Customer Credit Ledger
# ==========================================================

# 1. Initialize customer credit accounts
customer_khata = {
    "Ramesh Verma": 1450.0,
    "Pooja Sharma": 850.50,
    "Dr. S. K. Gupta": 3200.0,
    "Mohd. Farhan": 420.0
}

print("=== SHARMA KIRANA STORE CREDIT KHATA ===")
print(f"Total Active Accounts: {len(customer_khata)}")

# 2. Store branch geocoding cache using immutable tuple keys
branch_directory = {
    (26.8467, 80.9462): "Hazratganj Main Branch",
    (26.8656, 80.9833): "Gomti Nagar Express Outlet"
}

# 3. Direct Key Lookups
search_customer = "Pooja Sharma"
if search_customer in customer_khata:
    balance = customer_khata[search_customer]
    print(f"\n[FOUND] {search_customer}: Outstanding Balance Rs {balance:.2f}")
else:
    print(f"\n[NOT FOUND] Customer '{search_customer}' has no active khata.")

# 4. Adding a new customer and handling duplicate key updates
customer_khata["Ananya Roy"] = 990.0        # New customer
customer_khata["Mohd. Farhan"] = 650.0      # Customer made additional credit purchase

# 5. Print Formatted Ledger Summary
print("\n--- DAILY KHATA LEDGER AUDIT ---")
print(f"{'Customer Name':<20} | {'Credit Due (INR)':>16}")
print("-" * 40)

total_outstanding = 0.0
for customer, due_amount in customer_khata.items():
    print(f"{customer:<20} | Rs {due_amount:>13.2f}")
    total_outstanding += due_amount

print("-" * 40)
print(f"{'TOTAL OUTSTANDING':<20} | Rs {total_outstanding:>13.2f}")
```

```text
Output:
=== SHARMA KIRANA STORE CREDIT KHATA ===
Total Active Accounts: 4

[FOUND] Pooja Sharma: Outstanding Balance Rs 850.50

--- DAILY KHATA LEDGER AUDIT ---
Customer Name        | Credit Due (INR)
----------------------------------------
Ramesh Verma         | Rs       1450.00
Pooja Sharma         | Rs        850.50
Dr. S. K. Gupta      | Rs       3200.00
Mohd. Farhan         | Rs        650.00
Ananya Roy           | Rs        990.00
----------------------------------------
TOTAL OUTSTANDING    | Rs       7140.50
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Accessing & Updating Items** (11: Dictionaries).

👉 **[Continue to Next Lesson: Accessing & Updating Items →](/tutorials/python-for-beginners/accessing-updating-items)**
