---
id: python-set-comprehensions
slug: set-comprehensions
course: python-for-intermediate
chapter: "1: Advanced Data Types & Comprehensions"
topic: "1.2 Set Comprehensions"
title: "Set Comprehensions in Python"
description: "Master set comprehensions for lightning-fast hash-based deduplication, mathematical set operations, case normalization, and unhashable type handling."
difficulty: Intermediate
readingTime: 12
order: 2
keywords:
  - set comprehension
  - deduplication
  - hash set
  - set operations
  - hashable
  - data cleaning
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Set Comprehensions in Python

In data processing pipelines, real-world datasets are rarely pristine. Telemetry logs, user registration databases, and transaction streams frequently contain thousands of redundant duplicate records, inconsistent whitespace, and mixed character casing.

A **Set Comprehension** provides an elegant, high-speed syntax to filter, transform, and automatically **deduplicate** elements into a mathematical hash set in a single pass.

---

## Real-World Analogy: Temple Prasadam Token Deduplicator

Imagine the automated biometric queue counter at the Tirupati or Siddhivinayak temple:

```
+-------------------------------------------------------------------------+
|                  BIOMETRIC PRASADAM TOKEN DEDUPLICATOR                  |
+-------------------------------------------------------------------------+
|                                                                         |
|  Raw Crowd Queue: [Token 101, Token 102, Token 101, Token 105, Token 102]|
|                                   │                                     |
|                                   ▼                                     |
|                [ Optical Biometric Hash-Table Scanner ]                 |
|                                   │                                     |
|                                   ▼                                     |
|                  Already in Hash Table? ──(Yes)──> Discard Duplicate    |
|                                   │ (No)                                |
|                                   ▼                                     |
|           Unique Prasadam Set: {Token 101, Token 102, Token 105}        |
|                                                                         |
+-------------------------------------------------------------------------+
```

Regardless of how many times Token 101 or Token 102 appears in the raw stream, the set comprehension records it exactly once. The resulting collection is uniquely indexed, unordered, and enables $O(1)$ constant-time membership lookups (`item in my_set`).

---

## Technical Syntax Anatomy

A set comprehension uses curly braces `{}` with a single expression before the `for` keyword:

```
{ <Transformation Expression>   for <item> in <iterable>   if <Filter Predicate> }
```

### Distinguishing Comprehension Types by Braces

| Type | Delimiters | Syntax Example | Resulting Type |
| :--- | :--- | :--- | :--- |
| **List Comprehension** | `[...]` | `[x for x in nums]` | `list` (ordered, allows duplicates) |
| **Set Comprehension** | `{...}` | `{x for x in nums}` | `set` (unordered, unique elements) |
| **Dictionary Comprehension** | `{...}` | `{k: v for k, v in pairs}` | `dict` (key-value mapping) |
| **Generator Expression** | `(...)` | `(x for x in nums)` | `generator` (lazy iterator) |

---

## Hash Table Mechanics & The Hashability Rule

Behind the scenes, Python sets are implemented as open-addressed hash tables (`PySetObject`). 
For any element to reside in a set, Python must be able to compute its hash via `hash(item)`.

> [!IMPORTANT]
> **The Hashability Rule:**
> Only **immutable** objects (integers, floats, strings, booleans, and tuples containing immutable elements) can be elements of a set comprehension. Attempting to place mutable objects like `list` or `dict` into a set comprehension raises `TypeError: unhashable type: 'list'`.

---

## Comprehensive Code Examples

### 1. Cleaning & Deduplicating Raw Log Streams

In real-world web engineering, access logs repeat IP addresses continuously. Set comprehensions clean and deduplicate them in one line:

```python
raw_access_logs = [
    "192.168.1.10 - GET /home",
    "10.0.0.5 - POST /login",
    "192.168.1.10 - GET /dashboard",
    "172.16.0.42 - GET /api/user",
    "10.0.0.5 - GET /profile",
    "192.168.1.10 - POST /logout"
]

# Extract unique client IP addresses
unique_ips = {log.split()[0] for log in raw_access_logs}

print("Raw log entry count :", len(raw_access_logs))
print("Unique client IPs   :", unique_ips)
print("Unique client count :", len(unique_ips))
```

**Expected Output:**
```text
Raw log entry count : 6
Unique client IPs   : {'192.168.1.10', '10.0.0.5', '172.16.0.42'}
Unique client count : 3
```

---

### 2. Normalizing Case and Whitespace

Duplicate items often sneak into databases due to capitalization discrepancies (e.g. `"delhi"`, `"Delhi"`, `"DELHI "`):

```python
raw_cities = [
    "  Mumbai ", "delhi", "BENGALURU", "mumbai", "Delhi ", 
    "kolkata", "Bengaluru", "MUMBAI", "CHENNAI"
]

# Clean whitespace and enforce title-case capitalization
clean_cities = {city.strip().title() for city in raw_cities}

print("Original raw inputs :", len(raw_cities))
print("Cleaned Unique Cities:", sorted(clean_cities))
```

**Expected Output:**
```text
Original raw inputs : 9
Cleaned Unique Cities: ['Bengaluru', 'Chennai', 'Delhi', 'Kolkata', 'Mumbai']
```

---

### 3. Filtering and Transforming Numerical Datasets

```python
# Extract unique word lengths from a Hindi-English poem snippet
passage = "Python is powerful concise readable and elegant Python is dynamic and expressive"

# Set comprehension: collect word lengths for words longer than 3 characters
unique_lengths = {len(word) for word in passage.split() if len(word) > 3}

print("Unique word lengths > 3:", sorted(unique_lengths))

# Verify lengths present
length_breakdown = {w: len(w) for w in set(passage.split()) if len(w) in unique_lengths}
print("Sample word mappings   :", length_breakdown)
```

**Expected Output:**
```text
Unique word lengths > 3: [6, 7, 8, 9, 10]
Sample word mappings   : {'powerful': 8, 'dynamic': 7, 'elegant': 7, 'Python': 6, 'concise': 7, 'readable': 8, 'expressive': 10}
```

---

### 4. Working with Composite Tuples (Bypassing Unhashable Types)

If you need to deduplicate multi-attribute records, you cannot store sub-lists or dictionaries. Store **tuples** instead:

```python
# Raw booking records: [Passenger, TrainNo, CoachClass]
bookings = [
    ["Vikram", "12001", "1A"],
    ["Ananya", "12951", "2A"],
    ["Vikram", "12001", "1A"],  # Exact duplicate booking
    ["Rohan", "12001", "3A"],
    ["Ananya", "12951", "2A"]   # Exact duplicate booking
]

# Convert inner lists to tuples so they become hashable
unique_passenger_bookings = {tuple(entry) for entry in bookings}

print("Total raw bookings :", len(bookings))
print("Unique bookings    :", len(unique_passenger_bookings))
for b in unique_passenger_bookings:
    print(f"  Passenger: {b[0]} | Train: {b[1]} | Coach: {b[2]}")
```

**Expected Output:**
```text
Total raw bookings : 5
Unique bookings    : 3
  Passenger: Vikram | Train: 12001 | Coach: 1A
  Passenger: Rohan | Train: 12001 | Coach: 3A
  Passenger: Ananya | Train: 12951 | Coach: 2A
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Anti-Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Syntax** | `set([x for x in data])` (creates list first!) | `{x for x in data}` (direct set comprehension) |
| **Mutability** | `{ [item['id'], item['city']] for item in data }` | `{ (item['id'], item['city']) for item in data }` |
| **Ordering** | Relying on set comprehension preserving index order | Use lists if order matters; sets are inherently unordered |
| **Deduplication** | Manual `if x not in seen: seen.append(x)` ($O(n^2)$) | `{x for x in data}` ($O(n)$ hash-based) |
| **String Cleaning** | Inserting raw unstripped strings into sets | Strip and normalize casing before inserting |

---

## Quick Revision Summary Cheat Sheet

- **Syntax:** `{expression for item in iterable if condition}`
- **Uniqueness:** All duplicate values are discarded automatically during insertion.
- **Hashability:** Only immutable objects (`int`, `str`, `float`, `tuple`) can be set elements.
- **Performance:** Hash insertions and membership checks run in $O(1)$ average time complexity.
- **Direct vs Indirect:** Always write `{expr for x in seq}` instead of `set([expr for x in seq])` to avoid creating an intermediate list in memory.

---

---

# Practice Challenge

### Scenario: Indian GST State Code Extraction & Deduplication

In India, every GSTIN (Goods and Services Tax Identification Number) is a 15-character alphanumeric string where the first **2 digits** represent the State Code (e.g. `"27"` for Maharashtra, `"07"` for Delhi, `"29"` for Karnataka).

Given a noisy list of transactions containing duplicate and malformed GSTINs:
1. Write a set comprehension that extracts only valid state codes.
2. A valid state code must:
   - Come from a GSTIN string that is at least 15 characters long.
   - The first 2 characters must be strictly numeric digits (`gstin[:2].isdigit()`).
3. Map the extracted codes against a state lookup dictionary to display unique active state names.

### Starter Code
```python
raw_gst_ledger = [
    "27AAPFU0939F1ZV",  # Maharashtra
    "07AAAAA0000A1Z5",  # Delhi
    "27AAPFU0939F1ZV",  # Maharashtra (Duplicate)
    "INVALID_GST",      # Malformed
    "29ABCDE1234F2Z5",  # Karnataka
    "07AAAAA0000A1Z5",  # Delhi (Duplicate)
    "99XYZ",            # Too short
    "27BCDFG5678H1Z2"   # Maharashtra (Different taxpayer, same state)
]

STATE_MAP = {
    "07": "Delhi",
    "27": "Maharashtra",
    "29": "Karnataka"
}

# TODO: Extract unique state codes using a set comprehension and print unique states
```

### Complete Solution
```python
raw_gst_ledger = [
    "27AAPFU0939F1ZV",  # Maharashtra
    "07AAAAA0000A1Z5",  # Delhi
    "27AAPFU0939F1ZV",  # Maharashtra (Duplicate)
    "INVALID_GST",      # Malformed
    "29ABCDE1234F2Z5",  # Karnataka
    "07AAAAA0000A1Z5",  # Delhi (Duplicate)
    "99XYZ",            # Too short
    "27BCDFG5678H1Z2"   # Maharashtra (Different taxpayer, same state)
]

STATE_MAP = {
    "07": "Delhi",
    "27": "Maharashtra",
    "29": "Karnataka"
}

# Set comprehension: clean, validate, and extract 2-digit state code
unique_state_codes = {
    gstin[:2]
    for gstin in raw_gst_ledger
    if len(gstin) >= 15
    if gstin[:2].isdigit()
}

print("Extracted Unique State Codes:", sorted(unique_state_codes))

# Lookup active tax jurisdictions
active_states = {STATE_MAP.get(code, "Unknown State") for code in unique_state_codes}
print("Active Tax Jurisdictions    :", sorted(active_states))
```

### Expected Output
```text
Extracted Unique State Codes: ['07', '27', '29']
Active Tax Jurisdictions    : ['Delhi', 'Karnataka', 'Maharashtra']
```

---

## Practice Quiz

### 1. What differentiates a set comprehension from a dictionary comprehension syntactically?
A. Set comprehensions use square brackets while dictionary comprehensions use parentheses
B. Dictionary comprehensions use key-value pairs separated by a colon `{k: v for ...}`, whereas set comprehensions use single values `{val for ...}`
C. Set comprehensions can only process numbers
D. Dictionary comprehensions cannot use `if` filters
**Answer:** B
**Explanation:** Both constructs utilize curly braces `{}`, but a dictionary comprehension produces key-value mappings using `<key>: <value>`, whereas a set comprehension specifies single values without colons.

---

### 2. What will be the output of the following set comprehension?
```python
text = "BABBAC"
result = {char for char in text}
print(len(result))
```
A. 6
B. 3
C. 1
D. TypeError
**Answer:** B
**Explanation:** The characters in `"BABBAC"` are 'B', 'A', 'B', 'B', 'A', 'C'. A set comprehension automatically removes duplicate characters, leaving only `{'A', 'B', 'C'}`. Its length is 3.

---

### 3. What occurs if you execute {[x, x * 2] for x in [1, 2, 3]}?
A. A set containing 3 sublists is created
B. `TypeError: unhashable type: 'list'`
C. The lists are automatically converted to strings
D. It returns `[1, 2, 2, 4, 3, 6]`
**Answer:** B
**Explanation:** Elements of a set must be hashable and immutable. Because a `list` is a mutable data type, Python cannot compute its hash, raising a `TypeError`. Converting the inner collection to a tuple `(x, x * 2)` resolves the issue.

---

### 4. Why is {x for x in data} preferred over set([x for x in data])?
A. `set([...])` raises a runtime warning in modern Python
B. `{x for x in data}` avoids allocating an intermediate list in RAM, streaming elements directly into the set hash table
C. `{x for x in data}` automatically sorts the elements in ascending order
D. `set([...])` only works with integer data types
**Answer:** B
**Explanation:** Writing `set([x for x in data])` first builds a complete list in memory and then passes it to the `set()` constructor. The direct set comprehension `{x for x in data}` builds the set directly without the temporary list allocation.

---

### 5. What is the value of result in the following snippet?
```python
numbers = [12, 15, 18, 21, 24, 25, 27]
result = {n % 3 for n in numbers}
print(sorted(result))
```
A. `[0, 1, 2]`
B. `[0, 1]`
C. `[0, 15, 18]`
D. `[12, 15, 18, 21, 24, 25, 27]`
**Answer:** B
**Explanation:** Let us calculate `n % 3` for each number: 12 $\to$ 0, 15 $\to$ 0, 18 $\to$ 0, 21 $\to$ 0, 24 $\to$ 0, 25 $\to$ 1, 27 $\to$ 0. The unique modulo remainders collected in the set are `{0, 1}`. Sorting yields `[0, 1]`.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Dictionary Comprehensions** (1: Advanced Data Types & Comprehensions).

👉 **[Continue to Next Lesson: Dictionary Comprehensions →](/tutorials/python-for-intermediate/dictionary-comprehensions)**
