---
id: copying-dictionaries
slug: copying-dictionaries
course: python-for-beginners
chapter: 11
topic: 11.4
title: Copying Dictionaries & Deep Copying
description: Master dictionary replication in Python. Understand reference aliasing traps, shallow copies with copy() and dict(), and deep copying nested hierarchies.
difficulty: Beginner
readingTime: 13
order: 52
keywords:
  - copying dictionaries python
  - dict shallow copy vs deepcopy
  - dictionary aliasing bug
  - copy deepcopy python
  - nested dictionary cloning
  - dict copy method
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Copying Dictionaries in Python: The Aliasing Bug, Shallow Copies & Deep Duplication

In Python, variables do not hold physical collections—they hold **memory pointers** referencing objects located on the heap. Consequently, writing `backup = original` does **not** make a copy of the dictionary; it merely creates a second pointer pointing to the exact same dictionary in memory!

To safely duplicate dictionary data without risking catastrophic side-effects, you must choose between a **shallow copy** (`d.copy()` or `dict(d)`) and a **deep copy** (`copy.deepcopy(d)`).

---

## Real-World Analogy: The Carbon Paper Receipt vs The Certified True Copy

```
+-------------------------------------------------------------------------+
|                  DICTIONARY COPYING REAL-WORLD ANALOGY                  |
+-------------------------------------------------------------------------+

  1. THE CARBON PAPER TRAP (Variable Aliasing: b = a):
     - In an old government billing office, a clerk puts carbon paper
       between two invoice sheets.
     - When you scribble on the top sheet (b["tax"] = 500), the pencil
       pressure marks through to the bottom sheet (a["tax"] becomes 500)!
     - They share the exact same physical impression.

  2. THE PHOTOCOPY (Shallow Copy: b = a.copy()):
     - You walk to a Xerox shop and make a fresh photocopy of an application.
     - Changing a phone number on the photocopy does not alter the original page.
     - BUT if the page contains a pasted envelope with loose rupee notes inside,
       the photocopy merely points to that same physical envelope!

  3. RECREATING THE ENTIRE VAULT (Deep Copy: copy.deepcopy(a)):
     - You construct an exact replica of the document, the envelopes, the notes,
       and every nested folder inside.
     - 100% independent. No change in the clone can ever touch the original!
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Aliasing vs Shallow Copy vs Deep Copy

```
===========================================================================
             DICTIONARY CLONING MEMORY COMPARISON
===========================================================================

  Original: user = {"name": "Aarav", "scores": [85, 90]}

  1. ALIASING: alias = user
     alias -------------------+
                              |---> [ Dict Object ID: 1000 ]
     user  -------------------+       "name": -> "Aarav"
                                      "scores": -> [85, 90] (ID: 2000)

  2. SHALLOW COPY: shallow = user.copy()
     user    ---------------------> [ Dict Object ID: 1000 ]
                                      "name": -> "Aarav"
                                      "scores" -----+
                                                    |---> [ List ID: 2000 ]
     shallow ---------------------> [ Dict Object ID: 3000 ]  (Shared Inner List!)
                                      "name": -> "Aarav"
                                      "scores" -----+

  3. DEEP COPY: deep = copy.deepcopy(user)
     deep    ---------------------> [ Dict Object ID: 4000 ]
                                      "name": -> "Aarav"
                                      "scores" ---------> [ List ID: 5000 ] (Independent!)
```

---

## 1. The Catastrophic Bug: Variable Aliasing (`b = a`)

Assigning a dictionary to a new variable creates an alias, binding both variable names to the exact same object in memory:

```python
# ==========================================================
# Example 1: The Aliasing Trap
# ==========================================================

original_config = {"debug": True, "timeout": 30}
shared_config = original_config  # BUG: Aliasing!

# Mutate through shared_config
shared_config["timeout"] = 60

print(f"shared_config:   {shared_config}")
print(f"original_config: {original_config} (MUTATED ACCIDENTALLY!)")
print(f"Are they the exact same object? {shared_config is original_config}")
```

```text
Output:
shared_config:   {'debug': True, 'timeout': 60}
original_config: {'debug': True, 'timeout': 60} (MUTATED ACCIDENTALLY!)
Are they the exact same object? True
```

---

## 2. Shallow Copying: `copy()` and `dict()`

A shallow copy duplicates the outer dictionary container, but references to nested objects (lists, nested dictionaries) are copied by pointer:

```python
# ==========================================================
# Example 2: Shallow Copy Behavior
# ==========================================================

student = {
    "name": "Bhavya Patel",
    "grade": "10th",
    "subjects": ["Math", "Science"]  # Nested mutable list!
}

# Create shallow copy via .copy() or dict()
shallow_student = student.copy()

# 1. Modifying top-level primitive values is SAFE:
shallow_student["name"] = "Bhavya P."
print(f"Original Name: {student['name']} (Protected!)")
print(f"Shallow Name:  {shallow_student['name']}")

# 2. Modifying nested mutable objects CORRUPTS both!
shallow_student["subjects"].append("English")
print(f"\nOriginal Subjects: {student['subjects']} (CORRUPTED!)")
print(f"Shallow Subjects:  {shallow_student['subjects']}")
print(f"Are nested lists identical? {student['subjects'] is shallow_student['subjects']}")
```

```text
Output:
Original Name: Bhavya Patel (Protected!)
Shallow Name:  Bhavya P.

Original Subjects: ['Math', 'Science', 'English'] (CORRUPTED!)
Shallow Subjects:  ['Math', 'Science', 'English']
Are nested lists identical? True
```

---

## 3. Deep Copying: `copy.deepcopy()`

To independently clone a dictionary containing nested lists, sets, or child dictionaries, use `copy.deepcopy()`:

```python
# ==========================================================
# Example 3: Deep Copying with copy.deepcopy()
# ==========================================================

import copy

master_profile = {
    "emp_id": "EMP-402",
    "details": {
        "city": "Bengaluru",
        "skills": ["Python", "Docker"]
    }
}

# Create a true deep copy
isolated_profile = copy.deepcopy(master_profile)

# Mutate deep nested structures
isolated_profile["details"]["city"] = "Hyderabad"
isolated_profile["details"]["skills"].append("Kubernetes")

print("--- MASTER PROFILE (ORIGINAL) ---")
print(f"City:   {master_profile['details']['city']}")
print(f"Skills: {master_profile['details']['skills']} (100% Untouched!)")

print("\n--- ISOLATED PROFILE (CLONE) ---")
print(f"City:   {isolated_profile['details']['city']}")
print(f"Skills: {isolated_profile['details']['skills']}")
```

```text
Output:
--- MASTER PROFILE (ORIGINAL) ---
City:   Bengaluru
Skills: ['Python', 'Docker'] (100% Untouched!)

--- ISOLATED PROFILE (CLONE) ---
City:   Hyderabad
Skills: ['Python', 'Docker', 'Kubernetes']
```

---

## Do's and Don'ts: Copying Dictionaries

| Scenario | ❌ Anti-Pattern | ✅ Pythonic Idiom |
| :--- | :--- | :--- |
| **Backup Before Mutation** | `backup = my_dict` (Aliasing bug) | `backup = my_dict.copy()` |
| **Flat Dictionary Copy** | `import copy; copy.deepcopy(flat_d)` (Overkill) | `flat_d.copy()` (Faster & lighter) |
| **Nested Dictionary Copy**| `nested_d.copy()` (Leaves children shared) | `copy.deepcopy(nested_d)` |
| **Clear Original Only** | `backup = d.copy(); d.clear()` | Completely safe! `d` clears, `backup` retains data |

---

## Quick Revision Summary Cheat Sheet

```
+---------------------------------------------------------------------------+
|                     DICTIONARY CLONING CHEAT SHEET                        |
+---------------------------------------------------------------------------+
|  Mechanism           | Syntax                  | Top-Level | Nested Items |
|----------------------+-------------------------+-----------+--------------|
|  Aliasing            | b = a                   | Shared    | Shared       |
|  Shallow Copy        | b = a.copy() or dict(a) | Cloned    | Shared       |
|  Deep Copy           | b = copy.deepcopy(a)    | Cloned    | Cloned       |
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

### 1. What happens when you execute `dict2 = dict1` in Python?
A. A brand-new dictionary with the same keys and values is created
B. `dict2` becomes a pointer referencing the exact same dictionary object as `dict1`
C. `dict1` is converted into an immutable tuple
D. A shallow copy is automatically performed

**Answer:** B

---

### 2. Which method creates a shallow copy of a dictionary `d`?
A. `d.clone()`
B. `d.copy()`
C. `d.duplicate()`
D. `d.shallow()`

**Answer:** B

---

### 3. Consider `d1 = {"a": 1, "b": [10, 20]}` and `d2 = d1.copy()`. What happens if you run `d2["b"].append(30)`?
A. `30` is appended to `d2["b"]` only
B. Python raises a `TypeError`
C. `30` is appended to both `d1["b"]` and `d2["b"]` because the inner list reference was shared
D. `d1["b"]` is cleared

**Answer:** C

---

### 4. Which standard library module contains `deepcopy()`?
A. `sys`
B. `collections`
C. `copy`
D. `itertools`

**Answer:** C

---

### 5. When should you choose `copy.deepcopy()` over `dict.copy()`?
A. Whenever the dictionary contains only strings and numbers
B. Whenever the dictionary contains nested mutable objects (such as lists or other dictionaries) that must be independently isolated
C. Whenever you want the code to run faster
D. Never; deepcopy is deprecated

**Answer:** B

---

## Hands-On Practice Challenge: Production Server Deployment Config Snapshotter

Build a deployment safety module for an enterprise cloud platform. Before rolling out an experimental update to server configurations (which include network addresses and nested firewall rules lists), generate an isolated deep copy backup. Simulate an experimental configuration crash, verify that the master backup remained 100% uncorrupted, and rollback to the safe backup state.

### Starter Script & Complete Solution

```python
# ==========================================================
# Challenge: Cloud Production Configuration Snapshotter
# ==========================================================

import copy

# Master production server environment configuration:
production_config = {
    "environment": "PROD_MUMBAI_ZONE_1",
    "version": "v1.4.0",
    "security": {
        "ssl_mode": "STRICT",
        "whitelisted_ips": ["10.0.1.5", "10.0.1.6", "172.16.0.1"]
    }
}

print("=== LIVE PRODUCTION CONFIGURATION ===")
print(f"Env:       {production_config['environment']}")
print(f"Whitelisted IPs: {production_config['security']['whitelisted_ips']}")

# 1. Create a bulletproof Deep Snapshot before experimental patch
config_snapshot_backup = copy.deepcopy(production_config)

# 2. Simulate experimental deployment update
experimental_candidate = production_config
experimental_candidate["version"] = "v1.5.0-BETA"
experimental_candidate["security"]["whitelisted_ips"].append("0.0.0.0/0")  # Dangerous open IP!

print("\n=== EXPERIMENTAL CANARY DEPLOYMENT ===")
print(f"Updated Version: {experimental_candidate['version']}")
print(f"Updated IPs:     {experimental_candidate['security']['whitelisted_ips']}")

# 3. Security Audit Failure Triggered -> Initiate Rollback
print("\n[SECURITY AUDIT FAILURE] Detected hazardous '0.0.0.0/0' wildcard in production!")
print("[ROLLBACK INITIATED] Restoring from deep copy snapshot...")

# Rollback from snapshot backup
production_config = copy.deepcopy(config_snapshot_backup)

print("\n=== RESTORED SAFE PRODUCTION CONFIGURATION ===")
print(f"Restored Version: {production_config['version']}")
print(f"Safe Clean IPs:   {production_config['security']['whitelisted_ips']}")
print(f"Is hazardous IP purged? {'0.0.0.0/0' not in production_config['security']['whitelisted_ips']}")
```

```text
Output:
=== LIVE PRODUCTION CONFIGURATION ===
Env:       PROD_MUMBAI_ZONE_1
Whitelisted IPs: ['10.0.1.5', '10.0.1.6', '172.16.0.1']

=== EXPERIMENTAL CANARY DEPLOYMENT ===
Updated Version: v1.5.0-BETA
Updated IPs:     ['10.0.1.5', '10.0.1.6', '172.16.0.1', '0.0.0.0/0']

[SECURITY AUDIT FAILURE] Detected hazardous '0.0.0.0/0' wildcard in production!
[ROLLBACK INITIATED] Restoring from deep copy snapshot...

=== RESTORED SAFE PRODUCTION CONFIGURATION ===
Restored Version: v1.4.0
Safe Clean IPs:   ['10.0.1.5', '10.0.1.6', '172.16.0.1']
Is hazardous IP purged? True
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Dictionary Methods** (11: Dictionaries).

👉 **[Continue to Next Lesson: Dictionary Methods →](/tutorials/python-for-beginners/dictionary-methods)**
