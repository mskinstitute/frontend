---
id: nested-dictionaries
slug: nested-dictionaries
course: python-for-beginners
chapter: 11
topic: 11.6
title: Nested Dictionaries & Deep Hierarchies
description: Master Python nested dictionaries for complex JSON-like data architectures. Learn multi-level key lookups, safe chained navigation, deep mutation, and flattening.
difficulty: Beginner
readingTime: 14
order: 54
keywords:
  - python nested dictionaries
  - json in python
  - deep key lookup
  - chained get method
  - nested dictionary iteration
  - flatten nested dictionary
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Nested Dictionaries in Python: Multi-Tier Trees, Deep Lookups & JSON Modeling

In production backend engineering, data rarely exists as flat key-value pairs. User profiles contain contact addresses, e-commerce orders hold arrays of line items with nested seller details, and cloud APIs exchange deeply nested **JSON payloads**.

In Python, a **nested dictionary** is simply a dictionary where one or more values are themselves dictionaries. Combining nested dictionaries allows you to represent complex tree structures, relational models, and document databases natively.

---

## Real-World Analogy: The Indian Postal PIN Code Hierarchy & Company Office Building

```
+-------------------------------------------------------------------------+
|               NESTED DICTIONARIES REAL-WORLD ANALOGY                    |
+-------------------------------------------------------------------------+

  1. THE INDIA POST PIN CODE HIERARCHY:
     - 6-digit postal codes drill down through geographic tiers:
       India -> Northern Region (1) -> Delhi Sub-Region (11) -> Post Office.
     - In Python:
       postal_directory["North"]["Delhi"]["Central_GPO"]["postmaster"]
     - Each key drill-down takes you one floor deeper into the tree!

  2. MULTI-STORY CORPORATE HEADQUARTERS:
     - Building -> Floor 4 -> Department "Fintech" -> Employee "Sunita".
     - To call Sunita: headquarters["Floor_4"]["Fintech"]["Sunita"]["ext"]
     - Modifying Sunita's extension doesn't disrupt Floor 2 or Floor 3!

  3. SAFE CHAINED GET (The Cautious Security Guard):
     - If you ask for Floor 10 in a 4-story building:
       headquarters.get("Floor_10", {}).get("Desk_5")
     - The guard doesn't panic; returning an empty dict {} lets the next
       door check fail gracefully without crashing the building!
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Nested Dictionary Tree Hierarchy

```
===========================================================================
             NESTED DICTIONARY TREE HIERARCHY IN MEMORY
===========================================================================

  company = {
      "departments": {
          "engineering": {
              "lead": "Aarav Sharma",
              "team_size": 12
          }
      }
  }

  Root Dict [ID: 1000]
    |
    +-- "departments" ----> Intermediate Dict [ID: 2000]
                              |
                              +-- "engineering" ----> Leaf Dict [ID: 3000]
                                                        |
                                                        +-- "lead": "Aarav Sharma"
                                                        +-- "team_size": 12

  Query: company["departments"]["engineering"]["lead"]
  Traverses: ID 1000 -> ID 2000 -> ID 3000 -> Extracts "Aarav Sharma"
```

---

## 1. Creating and Accessing Nested Dictionaries

You can drill down into nested dictionaries by chaining square brackets `[key1][key2][key3]`:

```python
# ==========================================================
# Example 1: Multi-Tier Customer Account Representation
# ==========================================================

bank_customer = {
    "account_id": "SBI-908124",
    "personal": {
        "full_name": "Priya Sen",
        "city": "Kolkata",
        "kyc_verified": True
    },
    "balances": {
        "savings_inr": 145200.50,
        "fixed_deposits": [50000.0, 100000.0]
    }
}

# 1. Accessing deeply nested fields
customer_name = bank_customer["personal"]["full_name"]
savings_balance = bank_customer["balances"]["savings_inr"]
first_fd = bank_customer["balances"]["fixed_deposits"][0]

print(f"Customer Name:   {customer_name}")
print(f"Savings Balance: Rs {savings_balance:,.2f}")
print(f"First FD Value:  Rs {first_fd:,.2f}")

# 2. In-Place Deep Modification
bank_customer["balances"]["savings_inr"] += 5000.0
bank_customer["personal"]["city"] = "Salt Lake, Kolkata"

print(f"\nUpdated Savings: Rs {bank_customer['balances']['savings_inr']:,.2f}")
print(f"Updated Address: {bank_customer['personal']['city']}")
```

```text
Output:
Customer Name:   Priya Sen
Savings Balance: Rs 145,200.50
First FD Value:  Rs 50,000.00

Updated Savings: Rs 150,200.50
Updated Address: Salt Lake, Kolkata
```

---

## 2. Defensive Deep Lookups: Chained `.get()` & Safe Access

Direct bracket chaining (`d["a"]["b"]["c"]`) raises a fatal `KeyError` if any intermediate branch key is absent. Use chained `.get()` calls with empty fallback dictionaries:

```python
# ==========================================================
# Example 2: Defensive Chained Retrieval
# ==========================================================

user_metadata = {
    "profile": {
        "username": "coder_delhi"
        # Notice "address" key is completely missing!
    }
}

# 1. Unsafe lookup crashes:
try:
    pincode = user_metadata["profile"]["address"]["pincode"]
except KeyError as err:
    print(f"Direct chained lookup crashed: KeyError {err}")

# 2. Resilient Chained .get() Pattern:
# If "address" is missing, fallback to empty dict {} so next .get() doesn't crash!
pincode = user_metadata.get("profile", {}).get("address", {}).get("pincode", "PIN_UNKNOWN")
print(f"Defensive Pincode Lookup: {pincode}")
```

```text
Output:
Direct chained lookup crashed: KeyError 'address'
Defensive Pincode Lookup: PIN_UNKNOWN
```

---

## 3. Iterating Across Nested Dictionaries

To inspect or process multi-tier structures:

```python
# ==========================================================
# Example 3: Iterating Over Nested Structures
# ==========================================================

college_faculties = {
    "Computer Science": {
        "HOD": "Dr. V. K. Murthy",
        "Faculty Count": 18,
        "Lab": "Turing Complex"
    },
    "Mechanical Engineering": {
        "HOD": "Dr. Rajeshwar Singh",
        "Faculty Count": 14,
        "Lab": "Thermodynamics Workshop"
    }
}

print("=== UNIVERSITY FACULTY AUDIT ===")
for department, details in college_faculties.items():
    print(f"\nDepartment: {department}")
    for attribute, value in details.items():
        print(f"  * {attribute:<15}: {value}")
```

```text
Output:
=== UNIVERSITY FACULTY AUDIT ===

Department: Computer Science
  * HOD            : Dr. V. K. Murthy
  * Faculty Count  : 18
  * Lab            : Turing Complex

Department: Mechanical Engineering
  * HOD            : Dr. Rajeshwar Singh
  * Faculty Count  : 14
  * Lab            : Thermodynamics Workshop
```

---

## 4. Flattening Nested Dictionaries

To flatten a multi-tier dictionary into a single-level dictionary with compound keys (e.g. for database export or CSV conversion):

```python
# ==========================================================
# Example 4: Recursive Flattening
# ==========================================================

def flatten_dict(d: dict, parent_key: str = '', sep: str = '_') -> dict:
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

nested_sample = {
    "server": {
        "network": {
            "ip": "10.0.0.1",
            "port": 443
        },
        "status": "ONLINE"
    }
}

flat_result = flatten_dict(nested_sample)
print(f"Flattened Dictionary:")
for k, v in flat_result.items():
    print(f"  {k:<22} -> {v}")
```

```text
Output:
Flattened Dictionary:
  server_network_ip      -> 10.0.0.1
  server_network_port    -> 443
  server_status          -> ONLINE
```

---

## Do's and Don'ts: Nested Dictionaries

| Scenario | ❌ Anti-Pattern | ✅ Pythonic Idiom |
| :--- | :--- | :--- |
| **Deep Lookup** | `d[k1][k2][k3]` on untrusted API data | `d.get(k1, {}).get(k2, {}).get(k3, default)` |
| **Deep Cloning** | `clone = nested_d.copy()` | `import copy; clone = copy.deepcopy(nested_d)` |
| **Add New Sub-Category** | Assigning `d[k1][k2] = val` when `k1` doesn't exist | `d.setdefault(k1, {})[k2] = val` |
| **Looping Keys & Values**| `for k in d: for k2 in d[k]:` | `for k, sub_dict in d.items(): for sub_k, v in sub_dict.items():` |

---

## Quick Revision Summary Cheat Sheet

```
+---------------------------------------------------------------------------+
|                     NESTED DICTIONARY CHEAT SHEET                         |
+---------------------------------------------------------------------------+
|  Pattern                 | Explanation / Syntax                           |
|--------------------------+------------------------------------------------|
|  2D Coordinate Access    | dict[outer_key][inner_key]                     |
|  Deep Mutation           | dict[outer_key][inner_key] = new_val           |
|  Safe Chained Fallback   | d.get("k1", {}).get("k2", {}).get("k3", def)   |
|  Deep In-Place Init      | d.setdefault("k1", {})["k2"] = val             |
|  Full Recursive Copy     | copy.deepcopy(nested_dict)                     |
|  Iteration               | for outer_k, inner_dict in d.items():          |
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

### 1. What will `data["user"]["address"]["city"]` raise if the `"address"` key is missing?
A. `AttributeError`
B. `KeyError: 'address'`
C. `IndexError`
D. Returns `None`

**Answer:** B

---

### 2. How can you safely retrieve a deeply nested value `city` from `user` without raising a `KeyError` if any intermediate parent is missing?
A. `user.fetch("address.city")`
B. `user.get("address", {}).get("city", "Default City")`
C. `user["address"]?.["city"]`
D. `user.search("city")`

**Answer:** B

---

### 3. What does `d.setdefault("config", {})["timeout"] = 30` accomplish?
A. It raises a `SyntaxError`
B. If `"config"` does not exist, it initializes it as an empty dictionary `{}` and then assigns `{"timeout": 30}` inside it
C. It deletes the `"config"` key
D. It resets all values in `d` to 30

**Answer:** B

---

### 4. What is the output of the following code?
```python
tree = {"a": {"b": 10}}
tree["a"]["c"] = 20
print(len(tree["a"]))
```
A. 1
B. 2
C. 3
D. `KeyError`

**Answer:** B

---

### 5. Why is `copy.deepcopy()` necessary when duplicating nested dictionaries?
A. Regular `.copy()` only clones the top-level keys; inner dictionaries remain shared references that mutate simultaneously
B. Python will not run without it
C. Nested dictionaries cannot be printed without deepcopy
D. Deepcopy converts dictionaries into tuples

**Answer:** A

---

## Hands-On Practice Challenge: Hospital In-Patient Medical Record System

Build a healthcare patient management system for an Indian hospital. Each patient record is stored as a nested dictionary: `{"patient_id": {"vitals": {"bp": ..., "spo2": ...}, "prescriptions": [...], "assigned_doctor": ...}}`. Write functions to admit a new patient, record updated vitals, safely check oxygen saturation (`spo2`) with defensive fallback, prescribe an additional medicine, and print a formatted patient chart.

### Starter Script & Complete Solution

```python
# ==========================================================
# Challenge: Hospital Patient Record System
# ==========================================================

hospital_ward = {
    "PT-8001": {
        "name": "Ramesh Chandra",
        "age": 58,
        "vitals": {
            "blood_pressure": "130/85",
            "heart_rate_bpm": 76,
            "spo2_percent": 97
        },
        "assigned_doctor": "Dr. Anjali Deshmukh (Cardiology)",
        "medications": ["Amlodipine 5mg", "Aspirin 75mg"]
    }
}

print("=== MAX HEALTHCARE IN-PATIENT SYSTEM ===")

# 1. Admit a new patient using setdefault
def admit_patient(patient_id: str, name: str, age: int, doctor: str) -> None:
    record = hospital_ward.setdefault(patient_id, {})
    record["name"] = name
    record["age"] = age
    record["assigned_doctor"] = doctor
    record["vitals"] = {"blood_pressure": "120/80", "heart_rate_bpm": 72, "spo2_percent": 99}
    record["medications"] = []
    print(f"[ADMITTED] Patient {name} registered with ID: {patient_id}")

admit_patient("PT-8002", "Pooja Hegde", 34, "Dr. Sunil Kumar (General Medicine)")

# 2. Update patient vitals in-place
hospital_ward["PT-8001"]["vitals"]["spo2_percent"] = 95
hospital_ward["PT-8001"]["medications"].append("Atorvastatin 10mg")

# 3. Defensive Vitals Lookup using chained get()
def check_patient_spo2(patient_id: str) -> None:
    spo2 = (
        hospital_ward.get(patient_id, {})
        .get("vitals", {})
        .get("spo2_percent", "NO_DATA")
    )
    print(f"Patient [{patient_id}] SpO2: {spo2}%")

check_patient_spo2("PT-8001")
check_patient_spo2("PT-9999")  # Missing patient ID

# 4. Print Ward Status Report
print("\n=== CURRENT WARD INVENTORY ===")
for pid, info in hospital_ward.items():
    print(f"\nID: {pid} | Name: {info['name']} (Age: {info['age']})")
    print(f"  Doctor:      {info['assigned_doctor']}")
    print(f"  Vitals:      BP {info['vitals']['blood_pressure']}, SpO2 {info['vitals']['spo2_percent']}%, HR {info['vitals']['heart_rate_bpm']} bpm")
    print(f"  Medications: {', '.join(info['medications']) if info['medications'] else 'None'}")
```

```text
Output:
=== MAX HEALTHCARE IN-PATIENT SYSTEM ===
[ADMITTED] Patient Pooja Hegde registered with ID: PT-8002
Patient [PT-8001] SpO2: 95%
Patient [PT-9999] SpO2: NO_DATA%

=== CURRENT WARD INVENTORY ===

ID: PT-8001 | Name: Ramesh Chandra (Age: 58)
  Doctor:      Dr. Anjali Deshmukh (Cardiology)
  Vitals:      BP 130/85, SpO2 95%, HR 76 bpm
  Medications: Amlodipine 5mg, Aspirin 75mg, Atorvastatin 10mg

ID: PT-8002 | Name: Pooja Hegde (Age: 34)
  Doctor:      Dr. Sunil Kumar (General Medicine)
  Vitals:      BP 120/80, SpO2 99%, HR 72 bpm
  Medications: None
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Project: Student Records** (11: Dictionaries).

👉 **[Continue to Next Lesson: Project: Student Records →](/tutorials/python-for-beginners/project-student-records)**
