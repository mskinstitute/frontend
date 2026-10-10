---
id: python-dictionary-comprehensions
slug: dictionary-comprehensions
course: python-for-intermediate
chapter: "1: Advanced Data Types & Comprehensions"
topic: "1.3 Dictionary Comprehensions"
title: "Dictionary Comprehensions in Python"
description: "Master dictionary comprehensions for high-speed key-value transformations, dictionary inversion, paired zip mappings, and conditional key-value projection."
difficulty: Intermediate
readingTime: 14
order: 3
keywords:
  - dictionary comprehension
  - key value mapping
  - dictionary inversion
  - zip mapping
  - hash table
  - data transformation
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Dictionary Comprehensions in Python

Dictionaries are Python's most ubiquitous mapping data structure, providing fast $O(1)$ average-time key lookups. In data transformation pipelines, you frequently need to re-index data, filter by thresholds, swap keys and values, or compute derived metrics from raw key-value pairs.

A **Dictionary Comprehension** provides a compact, expressive syntax to construct, filter, and transform dictionaries from any iterable.

---

## Real-World Analogy: E-Commerce Currency Converter & Catalog Inverter

Imagine an Indian merchant listing imported electronics on an e-commerce platform:

```
+-------------------------------------------------------------------------+
|                  E-COMMERCE CATALOG CONVERTER ENGINE                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  Raw USD Catalog: {"SKU-A": 100, "SKU-B": 250, "SKU-C": 40}            |
|                                   │                                     |
|                                   ▼                                     |
|          [ Dict Comprehension Engine: Apply Forex Rate (₹85) ]          |
|          [                 + Add 18% GST                     ]          |
|                                   │                                     |
|                                   ▼                                     |
|  Indian Rupee Store: {"SKU-A": 10030, "SKU-B": 25075, "SKU-C": 4012}   |
|                                                                         |
+-------------------------------------------------------------------------+
```

Rather than creating an empty dictionary, writing a manual `for` loop, and performing repeated key assignments, a single dictionary comprehension transforms the catalog in one line at C-level speed.

---

## Technical Syntax Architecture

A dictionary comprehension uses curly braces `{}` enclosing a **colon-separated** key-value pair before the `for` clause:

```
{ <Key Expression> : <Value Expression>   for <item> in <iterable>   if <Filter Predicate> }
        ▲                    ▲                                               ▲
        │                    │                                               │
  New Dict Key         New Dict Value                               Optional Filter
```

### Essential Syntax Patterns:
1. **Iterating over an existing dictionary:**
   `{k: v * 2 for k, v in my_dict.items()}`
2. **Pairing two lists with `zip()`:**
   `{name: score for name, score in zip(names, scores)}`
3. **Filtering by key or value:**
   `{k: v for k, v in data.items() if v >= 100}`
4. **Conditional values (Ternary):**
   `{k: ("PASS" if v >= 40 else "FAIL") for k, v in marks.items()}`

---

## Comprehensive Code Examples

### 1. Key-Value Transformation & Currency Calculation

```python
# Raw prices in USD for tech hardware
inventory_usd = {
    "Laptop": 850.0,
    "Wireless Mouse": 25.0,
    "Mechanical Keyboard": 75.0,
    "4K Monitor": 320.0,
    "USB-C Hub": 18.0
}

USD_TO_INR = 83.50
GST_RATE = 1.18

# Transform: uppercase keys, convert price to INR with GST included
catalog_inr = {
    item.upper(): round(price * USD_TO_INR * GST_RATE, 2)
    for item, price in inventory_usd.items()
}

print("Original USD Inventory:")
for k, v in inventory_usd.items():
    print(f"  {k}: ${v}")

print("\nIndian Store Catalog (INR with 18% GST):")
for k, v in catalog_inr.items():
    print(f"  {k}: ₹{v:,.2f}")
```

**Expected Output:**
```text
Original USD Inventory:
  Laptop: $850.0
  Wireless Mouse: $25.0
  Mechanical Keyboard: $75.0
  4K Monitor: $320.0
  USB-C Hub: $18.0

Indian Store Catalog (INR with 18% GST):
  LAPTOP: ₹83,758.85
  WIRELESS MOUSE: ₹2,463.25
  MECHANICAL KEYBOARD: ₹7,389.75
  4K MONITOR: ₹31,529.60
  USB-C HUB: ₹1,773.54
```

---

### 2. Pairing Parallel Lists with `zip()`

When data arrives in parallel sequences (e.g. database column arrays), pair them directly using `zip()` inside a dictionary comprehension:

```python
roll_numbers = ["MSK-101", "MSK-102", "MSK-103", "MSK-104", "MSK-105"]
student_names = ["Aarav Sharma", "Sneha Roy", "Kabir Khan", "Meera Iyer", "Vikram Rathore"]

# Create an O(1) lookup index mapping Roll Number -> Student Name
student_directory = {roll: name for roll, name in zip(roll_numbers, student_names)}

print("Generated Directory:", student_directory)
print("Lookup for MSK-103  :", student_directory.get("MSK-103"))
```

**Expected Output:**
```text
Generated Directory: {'MSK-101': 'Aarav Sharma', 'MSK-102': 'Sneha Roy', 'MSK-103': 'Kabir Khan', 'MSK-104': 'Meera Iyer', 'MSK-105': 'Vikram Rathore'}
Lookup for MSK-103  : Kabir Khan
```

---

### 3. Swapping Keys and Values (Dictionary Inversion)

Swapping keys and values enables reverse lookups (e.g. looking up a user name from an email address or user ID):

```python
# Original mapping: User -> Unique Assigned Token
user_tokens = {
    "arjun": 9811,
    "divya": 4520,
    "rahul": 3198,
    "kavita": 7721
}

# Invert dictionary: Token -> User
token_to_user = {token: user for user, token in user_tokens.items()}

print("Original Mapping (User -> Token) :", user_tokens)
print("Inverted Mapping (Token -> User) :", token_to_user)

# Instant O(1) reverse lookup
query_token = 4520
print(f"Token {query_token} belongs to        : {token_to_user.get(query_token)}")
```

**Expected Output:**
```text
Original Mapping (User -> Token) : {'arjun': 9811, 'divya': 4520, 'rahul': 3198, 'kavita': 7721}
Inverted Mapping (Token -> User) : {9811: 'arjun', 4520: 'divya', 3198: 'rahul', 7721: 'kavita'}
Token 4520 belongs to        : divya
```

> [!WARNING]
> **Duplicate Values During Inversion:**
> If multiple keys in the original dictionary share the same value (e.g., `{"A": 1, "B": 1}`), inverting it causes the second key to overwrite the first (`{1: "B"}`). Ensure values are unique before inverting, or group them into lists.

---

### 4. Conditional Values with Ternary Expressions

```python
# Academic evaluation: assigning pass/fail status and distinction
subject_scores = {
    "Mathematics": 92,
    "Physics": 78,
    "Chemistry": 35,
    "Computer Science": 96,
    "English": 58
}

# Categorize performance: 'Distinction' (>= 90), 'Pass' (>= 40), or 'Fail' (< 40)
academic_status = {
    subject: "Distinction" if mark >= 90 else ("Pass" if mark >= 40 else "Fail")
    for subject, mark in subject_scores.items()
}

print("Marks Breakdown:")
for subj, status in academic_status.items():
    print(f"  {subj:<18}: {subject_scores[subj]:>3} marks ({status})")
```

**Expected Output:**
```text
Marks Breakdown:
  Mathematics       :  92 marks (Distinction)
  Physics           :  78 marks (Pass)
  Chemistry         :  35 marks (Fail)
  Computer Science  :  96 marks (Distinction)
  English           :  58 marks (Pass)
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Anti-Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Dictionary Iteration** | `{k: dict[k] for k in dict.keys()}` | `{k: v for k, v in dict.items()}` |
| **Pairing Sequences** | Index looping: `{keys[i]: vals[i] for i in range(len(keys))}` | Use `zip()`: `{k: v for k, v in zip(keys, vals)}` |
| **Filtering** | Creating dict then deleting with `del d[k]` | Filter directly during comprehension with `if` |
| **Key Collision** | Inverting non-unique values blindly | Check uniqueness or aggregate collisions into lists |
| **Readability** | Nesting 3 levels of dict comprehensions | If comprehension spans > 3 lines, break into helper functions |

---

## Quick Revision Summary Cheat Sheet

- **Basic Syntax:** `{key_expr: value_expr for item in iterable if condition}`
- **`.items()` Method:** Always unpack key and value simultaneously: `for k, v in my_dict.items()`.
- **Parallel Sequences:** Pair lists together with `{k: v for k, v in zip(keys, values)}`.
- **Inversion:** `{v: k for k, v in d.items()}` (last-write-wins for duplicate values).
- **Ternary Value Syntax:** `{k: (val_true if cond else val_false) for k in iter}`.
- **Hashability:** Dictionary keys must be immutable and hashable (`str`, `int`, `tuple`).

---

---

# Practice Challenge

### Scenario: Indian Retail Store GST Tax Classifier & Threshold Filter

A wholesale distributor in Surat sells fabric rolls. You are provided with a dictionary of item codes and their base wholesale prices in INR:
```python
inventory = {
    "COTTON-01": 450.0,
    "SILK-99": 2800.0,
    "POLY-12": 180.0,
    "LINEN-44": 1400.0,
    "KHADI-07": 320.0,
    "VELVET-88": 3500.0
}
```

Write a Python script that uses dictionary comprehensions to:
1. Filter out budget items below ₹300.
2. Apply tiered GST rates:
   - Items with base price $\ge$ ₹1,500 are considered luxury fabrics $\to$ apply **18% GST** (`price * 1.18`).
   - Items with base price $<$ ₹1,500 get standard **5% GST** (`price * 1.05`).
3. Return a new dictionary where:
   - Key: The item code.
   - Value: A formatted string `₹<Final Price> (<GST Slabs Rate>)`.

### Starter Code
```python
inventory = {
    "COTTON-01": 450.0,
    "SILK-99": 2800.0,
    "POLY-12": 180.0,
    "LINEN-44": 1400.0,
    "KHADI-07": 320.0,
    "VELVET-88": 3500.0
}

# TODO: Write dictionary comprehension with filtering and tiered GST calculation
```

### Complete Solution
```python
inventory = {
    "COTTON-01": 450.0,
    "SILK-99": 2800.0,
    "POLY-12": 180.0,
    "LINEN-44": 1400.0,
    "KHADI-07": 320.0,
    "VELVET-88": 3500.0
}

# Dictionary comprehension: filter >= 300, apply tiered GST with ternary expression
taxed_catalog = {
    code: (
        f"₹{price * 1.18:.2f} (18% Luxury GST)" 
        if price >= 1500.0 
        else f"₹{price * 1.05:.2f} (5% Standard GST)"
    )
    for code, price in inventory.items()
    if price >= 300.0
}

print("--- Surat Wholesale Taxed Fabric Catalog ---")
for item_code, details in taxed_catalog.items():
    print(f"{item_code:<12}: {details}")
```

### Expected Output
```text
--- Surat Wholesale Taxed Fabric Catalog ---
COTTON-01   : ₹472.50 (5% Standard GST)
SILK-99     : ₹3304.00 (18% Luxury GST)
LINEN-44    : ₹1470.00 (5% Standard GST)
KHADI-07    : ₹336.00 (5% Standard GST)
VELVET-88   : ₹4130.00 (18% Luxury GST)
```

---

## Practice Quiz

### 1. What method must be invoked on a dictionary to unpack both key and value inside a comprehension?
A. `d.values()`
B. `d.keys()`
C. `d.items()`
D. `d.entries()`
**Answer:** C
**Explanation:** Calling `d.items()` returns an iterable of `(key, value)` tuples, enabling simultaneous unpacking: `for k, v in d.items()`. Calling just `for k in d:` only yields keys.

---

### 2. What is the output of the following dictionary comprehension?
```python
fruits = ["apple", "fig", "banana"]
result = {f: len(f) for f in fruits if len(f) > 3}
print(result)
```
A. `{'apple': 5, 'banana': 6}`
B. `{'fig': 3}`
C. `{'apple': 5, 'fig': 3, 'banana': 6}`
D. `[5, 6]`
**Answer:** A
**Explanation:** The `if len(f) > 3` condition discards `"fig"` (length 3). The remaining items are `"apple"` (length 5) and `"banana"` (length 6), forming `{'apple': 5, 'banana': 6}`.

---

### 3. What happens if you invert a dictionary {v: k for k, v in d.items()} when multiple keys have the same value?
A. Python raises a DuplicateValueError
B. All keys are collected into a set automatically
C. The later key encountered during iteration overwrites the earlier key for that value
D. The dictionary is deleted
**Answer:** C
**Explanation:** Dictionary keys must be unique. When duplicate values become keys, subsequent assignments overwrite prior assignments, resulting in only the last key associated with that value surviving.

---

### 4. Which of the following correctly pairs two lists into a dictionary?
A. `{k, v for k, v in list1 + list2}`
B. `{k: v for k, v in zip(list1, list2)}`
C. `dict(list1 + list2)`
D. `{k: v for k in list1 for v in list2}`
**Answer:** B
**Explanation:** The `zip(list1, list2)` function pairs corresponding elements from both sequences as tuples `(k, v)`, which can then be cleanly unpacked into a dictionary comprehension `{k: v for k, v in zip(list1, list2)}`.

---

### 5. What is the output of {x: x**2 for x in (1, 2, 3) if x % 2 != 0}?
A. `{1: 1, 2: 4, 3: 9}`
B. `{1: 1, 3: 9}`
C. `{2: 4}`
D. `[1, 9]`
**Answer:** B
**Explanation:** The condition `x % 2 != 0` filters for odd numbers. From `(1, 2, 3)`, 1 and 3 are odd. Squaring them yields `{1: 1, 3: 9}`.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Nested Comprehensions** (1: Advanced Data Types & Comprehensions).

👉 **[Continue to Next Lesson: Nested Comprehensions →](/tutorials/python-for-intermediate/nested-comprehensions)**
