---
id: python-identity-membership-operators
slug: identity-membership-operators
course: python-for-beginners
chapter: 6
topic: 6.5
title: Identity & Membership Operators
description: Master the vital distinction between value equality (==) and object identity (is), understand CPython's small integer caching, and use in and not in across collections.
difficulty: Beginner
readingTime: 14
order: 27
keywords:
  - python identity operators
  - python membership operators
  - is vs ==
  - is not
  - in not in
  - object identity
  - small integer caching
  - singleton none
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python Identity & Membership Operators: is vs == & in Collections

In Python programming, confusing **value equality (`==`)** with **object identity (`is`)** is one of the most common and dangerous sources of subtle bugs. 

Python provides two specialized operator families to handle reference comparison and containment verification:
1. **Identity Operators (`is`, `is not`):** Test whether two variables point to the **exact same object at the exact same physical memory address**.
2. **Membership Operators (`in`, `not in`):** Test whether a specific element exists inside a collection, sequence, or container (strings, lists, tuples, sets, dictionaries).

---

## Real-World Analogy: Identical Twins vs Two Nicknames for One Person

```
+-------------------------------------------------------------------------+
|                  IDENTITY (is) vs EQUALITY (==) ANALOGY                 |
+-------------------------------------------------------------------------+

  1. VALUE EQUALITY (==) -> Identical Twin Brothers:
     - Ramesh and Suresh are identical twins wearing matching outfits.
     - They have the same height, weight, and clothes.
     - If you compare their appearance: ramesh == suresh -> TRUE!
     - But they are two distinct living human beings!
     - They have separate Aadhaar numbers and live in separate bodies:
       ramesh is suresh -> FALSE!

  2. OBJECT IDENTITY (is) -> Two Nicknames for One Legend:
     - Amitabh Bachchan and "Big B".
     - These are two different names pointing to the EXACT same person!
     - amitabh is big_b -> TRUE! (id(amitabh) == id(big_b))

  3. MEMBERSHIP (in / not in) -> Train Reservation Chart:
     - You arrive at Hazrat Nizamuddin Station to board the Rajdhani Express.
     - You scan the reservation chart pasted on the train door:
       "Is 'Aarav Sharma' in passenger_list?" -> True or False!
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Heap Memory Reference Diagram

```
===========================================================================
             MEMORY ARCHITECTURE: EQUALITY vs IDENTITY
===========================================================================

  Code:
  a = [1, 2, 3]
  b = [1, 2, 3]
  c = a

  Memory Heap:
  ------------
  Variable Name                 Physical Memory Object
  +-------------+               +---------------------------------------+
  |      a      | ------------> | Address: 0x00A100 -> List: [1, 2, 3]  |
  +-------------+      +------> +---------------------------------------+
                       |
  +-------------+      |
  |      c      | -----+ (Points to same address as 'a')
  +-------------+
  
  +-------------+               +---------------------------------------+
  |      b      | ------------> | Address: 0x00B200 -> List: [1, 2, 3]  |
  +-------------+               +---------------------------------------+

  Comparisons:
  - a == b  --> TRUE  (Both objects have identical contents: [1, 2, 3])
  - a is b  --> FALSE (Different memory addresses: 0x00A100 != 0x00B200)
  - a is c  --> TRUE  (Identical memory address: 0x00A100 == 0x00A100)
```

---

## 1. Identity Operators: `is` and `is not`

The `is` operator evaluates to `True` if and only if `id(x) == id(y)`. The `is not` operator evaluates to `True` if they point to different memory addresses:

```python
# ==========================================================
# Example 1: Identity vs Value Equality with Lists
# ==========================================================

delhi_office_servers = ["srv-01", "srv-02", "srv-03"]
mumbai_office_servers = ["srv-01", "srv-02", "srv-03"]
primary_cluster = delhi_office_servers  # Aliased reference!

# 1. Content Equality (==)
print("Are server inventories equal in content (==)? :", delhi_office_servers == mumbai_office_servers)

# 2. Memory Identity (is)
print("Are Delhi and Mumbai pointing to same object (is)?:", delhi_office_servers is mumbai_office_servers)
print("Are Delhi and Primary Cluster the same object (is)?:", delhi_office_servers is primary_cluster)

# 3. Verifying with id()
print("\nMemory ID Delhi   :", hex(id(delhi_office_servers)))
print("Memory ID Mumbai  :", hex(id(mumbai_office_servers)))
print("Memory ID Primary :", hex(id(primary_cluster)))
```

### Output:
```text
Are server inventories equal in content (==)? : True
Are Delhi and Mumbai pointing to same object (is)?: False
Are Delhi and Primary Cluster the same object (is)?: True

Memory ID Delhi   : 0x1fec2a0
Memory ID Mumbai  : 0x1fec350
Memory ID Primary : 0x1fec2a0
```

---

## 2. The Singleton Rule: Always Check `None` with `is`

In Python, `None` is a **singleton**—there is only ever one physical instance of `None` in the entire CPython process. According to the official **PEP 8 style guide**, you must **always compare with `None` using `is` or `is not`**, never with `==`:

```python
# ==========================================================
# Example 2: Comparing with None
# ==========================================================

database_connection = None

# PEP 8 BEST PRACTICE:
if database_connection is None:
    print("Database connection is not yet initialized.")

# Checking for valid presence:
user_token = "auth_token_94821"
if user_token is not None:
    print("User authenticated successfully.")

# WHY '== None' IS DANGEROUS:
# Custom classes can override __eq__ to return True for None even if valid!
# 'is None' checks physical memory address and cannot be hijacked.
```

### Output:
```text
Database connection is not yet initialized.
User authenticated successfully.
```

---

## 3. The CPython Small Integer Caching Quirk: Why NEVER Use `is` for Numbers!

A legendary trap in Python is that CPython pre-allocates an internal cache of all integers between **`-5` and `256`** at startup:

```python
# ==========================================================
# Example 3: The CPython Integer Cache Trap
# ==========================================================

# Small Integers (Between -5 and 256): Shared singleton memory!
x = 250
y = 250
print("250 is 250 :", x is y)  # True (CPython uses cached shared object!)

# Large Integers (Outside -5 to 256): Separate memory allocations!
p = 1000
q = 1000
print("1000 is 1000:", p is q)  # False (Different objects!)
print("1000 == 1000:", p == q)  # True (Same numerical value!)
```

### Output:
```text
250 is 250 : True
1000 is 1000: False
1000 == 1000: True
```

> **Crucial Warning:** NEVER use `is` to check whether numbers or strings are equal! Always use `==` for values. Reserve `is` strictly for singletons like `None`, `True`, and `False`.

---

## 4. Membership Operators: `in` and `not in`

The `in` operator tests whether an item is found within a collection. The `not in` operator tests whether an item is absent:

```python
# ==========================================================
# Example 4: Membership Across Different Data Structures
# ==========================================================

# 1. Strings: Substring search
notice = "Admissions for B.Tech CSE close on Friday."
print("Is 'B.Tech' in notice?          :", "B.Tech" in notice)
print("Is 'MBA' not in notice?         :", "MBA" not in notice)

# 2. Lists & Tuples: Linear element search
eligible_states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu"]
print("Is 'Punjab' in eligible states? :", "Punjab" in eligible_states)

# 3. Sets: High-speed O(1) hashed lookup
registered_user_ids = {101, 102, 103, 104, 105}
print("Is User 103 registered?         :", 103 in registered_user_ids)

# 4. Dictionaries: 'in' checks KEYS by default!
student_grades = {"Aarav": "A+", "Pooja": "A", "Rohan": "B"}
print("Is 'Aarav' in grades?           :", "Aarav" in student_grades)     # Checks keys -> True
print("Is 'A+' in grades?              :", "A+" in student_grades)        # False!
print("Is 'A+' in grades.values()?     :", "A+" in student_grades.values()) # True!
```

### Output:
```text
Is 'B.Tech' in notice?          : True
Is 'MBA' not in notice?         : True
Is 'Punjab' in eligible states? : False
Is User 103 registered?         : True
Is 'Aarav' in grades?           : True
Is 'A+' in grades?              : False
Is 'A+' in grades.values()?     : True
```

---

## Comparison: `==` vs `is`

| Feature | `==` (Value Equality) | `is` (Object Identity) |
| :--- | :--- | :--- |
| **What It Checks** | Checks if contents and values match | Checks if memory addresses (`id()`) match |
| **Underlying Method** | Calls `__eq__()` on the left object | Compares raw memory pointers in C |
| **Use For Numbers** | **Yes** (`count == 10`) | **Never!** (Breaks past 256) |
| **Use For Strings** | **Yes** (`role == "ADMIN"`) | **Never!** (Subject to string interning) |
| **Use For Singletons**| Avoid (`x == None` is unpythonic) | **Always!** (`x is None`, `x is not None`) |

---

## Do's and Don'ts: Identity & Membership

| Scenario | Anti-Pattern (Don't) | Best Practice (Do) | Why |
| :--- | :--- | :--- | :--- |
| **Checking None** | `if status == None:` | `if status is None:` | PEP 8 standard; immune to `__eq__` tampering. |
| **Comparing Numbers**| `if score is 100:` | `if score == 100:` | `is` fails unexpectedly outside the small integer cache. |
| **Dict Key Check** | `if key in dict.keys():` | `if key in dict:` | Checking `dict` directly performs $O(1)$ key lookup without creating views. |
| **Negated Membership**| `if not item in items:` | `if item not in items:` | `not in` is idiomatic, clean, and reads like plain English. |

---

## Quick Revision Summary

```
+-------------------------------------------------------------------------+
|              IDENTITY & MEMBERSHIP OPERATORS CHEAT SHEET                |
+-------------------------------------------------------------------------+
  - == (Equal):      Compares contents/values: [1, 2] == [1, 2] is True
  - is (Identity):   Compares memory addresses: [1, 2] is [1, 2] is False!
  - Singletons:      Always write 'if x is None:' or 'if x is not None:'
  - Small Int Cache: CPython caches -5 to 256; NEVER use 'is' on numbers!
  - in (Membership): Tests containment in str, list, tuple, set, dict
  - not in:          Tests absence: 'admin' not in blacklisted_users
  - Dict 'in':       Checks keys by default! Use dict.values() for values
+-------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Confusing Assignment (`=`) with Equality (`==`)
A single equals sign `=` assigns a value. Two equals signs `==` checks for equality:
```python
score = 100  # Assignment

# In conditions:
# ❌ INCORRECT (SyntaxError in Python 3)
# if score = 100:

# ✅ CORRECT
if score == 100:
    print("Perfect score!")
```

### 2. Chained Boolean Logic with `and` / `or`
Beginners often write `if x == 1 or 2:`, which always evaluates to True because non-zero integers are truthy!
```python
# ❌ INCORRECT (Always True because 2 is truthy!)
# if x == 1 or 2:

# ✅ CORRECT
# if x == 1 or x == 2:
# Or even cleaner:
# if x in (1, 2):
```

---

## Practice Quiz

### 1. What will be the output of evaluating `[1, 2] == [1, 2]` vs `[1, 2] is [1, 2]`?
A. `True` and `True`
B. `True` and `False`
C. `False` and `True`
D. `False` and `False`

**Answer:** B

---

### 2. According to PEP 8, what is the correct and idiomatic way to test if a variable `result` is `None`?
A. `if result == None:`
B. `if result is None:`
C. `if result.equals(None):`
D. `if None in result:`

**Answer:** B

---

### 3. What does evaluating `'admin' in {'admin': True, 'guest': False}` test by default?
A. Whether `'admin'` is a value in the dictionary
B. Whether `'admin'` is a key in the dictionary
C. Both keys and values
D. Raises a `TypeError`

**Answer:** B

---

### 4. Why might the expression `x = 1000; y = 1000; x is y` evaluate to `False`, while `x = 10; y = 10; x is y` evaluates to `True`?
A. Python has a bug with numbers containing zeros
B. CPython pre-allocates and caches small integers from -5 to 256 as shared objects, but allocates new objects for larger numbers
C. Numbers above 500 automatically convert to floats
D. `is` can only compare single-digit numbers

**Answer:** B

---

### 5. Which of the following is the most readable and Pythonic way to check that `tag` is NOT inside `allowed_tags`?
A. `if not (tag in allowed_tags):`
B. `if tag not in allowed_tags:`
C. `if (tag in allowed_tags) == False:`
D. `if tag in allowed_tags is False:`

**Answer:** B

---

# Hands-On Practice Challenge: Cloud Access Control & RBAC Token Validator

Write a complete, runnable Python script that models a Role-Based Access Control (RBAC) security gateway for a cloud infrastructure portal. Use `is` and `is not` to validate database connection singletons, and use `in` and `not in` to verify IP allowlists and user permission privileges.

```python
# ==========================================================
# Challenge 27: Cloud RBAC Access Gateway & Identity Auditor
# MSK Institute of Technology
# ==========================================================

# 1. Security Configuration
ALLOWED_IP_SUBNET = {"192.168.1.10", "192.168.1.15", "10.0.0.50"}
SUPERUSER_ROLES = ("ROOT_ADMIN", "DEVOPS_LEAD", "SECURITY_AUDITOR")
ACTIVE_REVOCATION_LIST = ["TOKEN_REVOKED_88", "TOKEN_STOLEN_42"]

def authorize_cloud_action(client_ip: str, auth_token: str | None, role: str, db_connection) -> None:
    print("=" * 60)
    print("       MSK CLOUD DEFENSE: API ACCESS CONTROL GATEWAY")
    print("=" * 60)

    # Step 1: Singleton Verification with 'is'
    if db_connection is None:
        print("GATEWAY HALTED: Database session is offline (db_connection is None).")
        print("=" * 60 + "\n")
        return

    # Step 2: Token Null Check with 'is not'
    if auth_token is None:
        print("ACCESS DENIED: Missing Authorization Bearer Token.")
        print("=" * 60 + "\n")
        return

    # Step 3: Membership Verification with 'not in'
    if auth_token in ACTIVE_REVOCATION_LIST:
        print(f"SECURITY BREACH: Token '{auth_token}' is flagged on REVOCATION LIST!")
        print("=" * 60 + "\n")
        return

    # Step 4: IP Allowlist Check with 'in' (O(1) Set Lookup)
    is_ip_allowed = client_ip in ALLOWED_IP_SUBNET
    if not is_ip_allowed:
        print(f"ACCESS DENIED: IP Address {client_ip} not found in firewall allowlist.")
        print("=" * 60 + "\n")
        return

    # Step 5: Role Authorization with 'in' (Tuple Membership)
    has_admin_privileges = role.upper() in SUPERUSER_ROLES

    # Output Final Clearance
    print(f"Client IP Address : {client_ip} [FIREWALL ALLOWED]")
    print(f"Authorization Role: {role.upper()}")
    print(f"Admin Privileges  : {'GRANTED (Full Cloud Access)' if has_admin_privileges else 'STANDARD USER'}")
    print("-" * 60)
    print("GATEWAY STATUS    : [CLEARED 200 OK] Connection established successfully.")
    print("=" * 60 + "\n")


# ----------------------------------------------------------
# Demonstration Cases
# ----------------------------------------------------------
# Simulated active DB connection object
ACTIVE_DB_SESSION = object()

# Case 1: Authorized DevOps Lead
authorize_cloud_action(
    client_ip="192.168.1.10",
    auth_token="SECURE_BEARER_9981",
    role="DEVOPS_LEAD",
    db_connection=ACTIVE_DB_SESSION
)

# Case 2: Revoked Token Attempt
authorize_cloud_action(
    client_ip="192.168.1.15",
    auth_token="TOKEN_REVOKED_88",
    role="ROOT_ADMIN",
    db_connection=ACTIVE_DB_SESSION
)

# Case 3: Offline Database Session
authorize_cloud_action(
    client_ip="10.0.0.50",
    auth_token="SECURE_BEARER_1122",
    role="DEVELOPER",
    db_connection=None
)
```

### Expected Program Output:
```text
============================================================
       MSK CLOUD DEFENSE: API ACCESS CONTROL GATEWAY
============================================================
Client IP Address : 192.168.1.10 [FIREWALL ALLOWED]
Authorization Role: DEVOPS_LEAD
Admin Privileges  : GRANTED (Full Cloud Access)
------------------------------------------------------------
GATEWAY STATUS    : [CLEARED 200 OK] Connection established successfully.
============================================================

============================================================
       MSK CLOUD DEFENSE: API ACCESS CONTROL GATEWAY
============================================================
SECURITY BREACH: Token 'TOKEN_REVOKED_88' is flagged on REVOCATION LIST!
============================================================

============================================================
       MSK CLOUD DEFENSE: API ACCESS CONTROL GATEWAY
============================================================
GATEWAY HALTED: Database session is offline (db_connection is None).
============================================================
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Bitwise Operators** (6: Operators).

👉 **[Continue to Next Lesson: Bitwise Operators →](/tutorials/python-for-beginners/bitwise-operators)**
