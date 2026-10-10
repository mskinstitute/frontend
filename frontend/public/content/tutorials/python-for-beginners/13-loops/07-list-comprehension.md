---
id: list-comprehension
slug: list-comprehension
course: python-for-beginners
chapter: 13
topic: 13.7
title: "List Comprehension in Python: Declarative List Construction & Filtering"
description: "Master Python list comprehension syntax [expression for item in iterable if condition]. Compare performance against for-loops, explore inline conditionals, and flatten nested structures."
difficulty: Beginner
readingTime: 12
order: 67
keywords:
  - python list comprehension
  - declarative list construction
  - list comprehension syntax
  - filtering list comprehension
  - nested list comprehension
  - list append vs comprehension performance
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# List Comprehension in Python: Declarative List Construction & Filtering

In traditional imperative programming, creating a new list from an existing sequence requires four tedious steps: allocating an empty list, writing a `for` loop, applying an `if` filter, and repeatedly invoking the `.append()` method.

Python draws inspiration from mathematical **set-builder notation** (such as $\{x^2 \mid x \in \mathbb{N}, x \le 10\}$) to provide **list comprehensions**. A list comprehension is a concise, declarative, and high-performance syntax that constructs a new list in a single readable line of code.

---

## Real-World Analogy: The Chai Tapri Sieve & Mango Sorting Conveyor

```
+-------------------------------------------------------------------------------+
|                    LIST COMPREHENSION REAL-WORLD ANALOGIES                    |
+-------------------------------------------------------------------------------+

  1. THE STAINLESS STEEL TEA CHAI SIEVE:
     - Input stream: Raw kettle mixture [tea leaves, ginger, boiling chai, cardamom].
     - Filter condition: Only liquid passes through the mesh (leaves are rejected).
     - Transformation: Pour into pre-warmed clay kulhad cups.
     - Outcome: A clean, refined list of ready-to-serve kulhads generated
       in a continuous single flow.

  2. RATNAGIRI ALPHONSO MANGO PACKING CONVEYOR:
     - Belt carries 1,000 harvested mangoes.
     - Sorter filter: Weight >= 250 grams AND zero blemishes.
     - Transformation: Apply export-grade hologram label.
     - Outcome: Export carton filled without manual basket transfers.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: Anatomy of a List Comprehension

```
================================================================================
                    LIST COMPREHENSION SYNTACTIC DECONSTRUCTION
================================================================================

      [   expression_output    for   item   in   iterable    if   filter_test   ]
                 ^                     ^            ^                   ^
                 |                     |            |                   |
            4. EVALUATE           2. ASSIGN    1. ITERATE          3. FILTER
         Transform value      Current element   Source sequence     Keep item if
          for final list       to target var     (e.g., range)       True; drop if False

  EXECUTION ORDER UNDER THE HOOD:
  1. For each item in iterable:
  2. If filter_test is True:
  3. Evaluate expression_output
  4. Append result to internal C-level list buffer
================================================================================
```

---

## 1. Imperative Loop vs. Declarative Comprehension

Let us examine the transformation of an imperative multi-line loop into a modern list comprehension:

```python
# ==========================================================
# Traditional Imperative Approach (4 Lines)
# ==========================================================
even_squares = []
for n in range(1, 11):
    if n % 2 == 0:
        even_squares.append(n ** 2)

print("Imperative:", even_squares)

# ==========================================================
# Modern Declarative List Comprehension (1 Line)
# ==========================================================
comp_squares = [n ** 2 for n in range(1, 11) if n % 2 == 0]

print("Declarative:", comp_squares)
```

**Output:**
```text
Imperative:  [4, 16, 36, 64, 100]
Declarative: [4, 16, 36, 64, 100]
```

### Why is List Comprehension Faster?
In CPython, a standard `for` loop repeatedly looks up the `.append` attribute on the list object and makes a Python-level function call on every iteration. 

A list comprehension executes via a specialized C-level bytecode instruction (`LIST_APPEND`), bypassing method lookup overhead and allocating memory more efficiently.

---

## 2. The Two Faces of `if`: Filtering vs. Transforming

Beginners frequently confuse the position of the `if` keyword in list comprehensions. Its placement changes its entire purpose:

```
+-------------------------------------+---------------------------------------------------------------+
| SYNTACTIC PLACEMENT                 | ROLE & BEHAVIOR                                               |
+-------------------------------------+---------------------------------------------------------------+
| At the END:                         | FILTERING:                                                    |
| `[expr for x in seq if cond]`       | Decides WHICH elements are kept or dropped.                   |
|                                     | Does NOT take an `else`.                                      |
+-------------------------------------+---------------------------------------------------------------+
| At the BEGINNING:                   | TRANSFORMATION (Ternary Operator):                            |
| `[expr1 if cond else expr2 for ...]`| Keeps ALL elements, but assigns different values based on cond|
|                                     | REQUIRES a mandatory `else`.                                  |
+-------------------------------------+---------------------------------------------------------------+
```

```python
# ==========================================================
# Example 1: Filtering vs. Transforming
# ==========================================================

marks = [45, 82, 33, 91, 28, 76]

# 1. Filtering (at the end): Keep only passing marks (>= 40)
passing_marks = [m for m in marks if m >= 40]
print("Passing Marks:", passing_marks)

# 2. Transforming with Ternary (at the start): Label Pass or Fail
labels = ["PASS" if m >= 40 else "FAIL" for m in marks]
print("Marks Labels: ", labels)
```

**Output:**
```text
Passing Marks: [45, 82, 91, 76]
Marks Labels:  ['PASS', 'PASS', 'FAIL', 'PASS', 'FAIL', 'PASS']
```

---

## 3. String & Data Sanitation with Comprehensions

List comprehensions excel at data cleansing and sanitizing user inputs:

```python
# ==========================================================
# Example 2: Normalizing Customer Indian Mobile Numbers
# ==========================================================

raw_phone_numbers = [
    "+91 98200-12345",
    "098200 12345",
    "9820012345",
    "+91-9820099999",
    "invalid_entry"
]

# Extract only digits and keep standard 10-digit Indian numbers
clean_numbers = [
    "".join(char for char in phone if char.isdigit())[-10:]
    for phone in raw_phone_numbers
    if sum(1 for char in phone if char.isdigit()) >= 10
]

print("Clean 10-Digit Mobile Numbers:")
for p in clean_numbers:
    print(f"  +91-{p}")
```

**Output:**
```text
Clean 10-Digit Mobile Numbers:
  +91-9820012345
  +91-9820012345
  +91-9820012345
  +91-9820099999
```

---

## 4. Flattening 2D Matrices

List comprehensions can contain multiple `for` clauses to flatten multi-dimensional matrices into a flat 1D list:

```python
# ==========================================================
# Example 3: Flattening a 2D Matrix
# ==========================================================

matrix_2d = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]

# Flatten order matches nested for loop order:
# for row in matrix_2d:
#     for val in row:
flattened = [val for row in matrix_2d for val in row]

print("Original 3x3 Matrix:", matrix_2d)
print("Flattened 1D List:  ", flattened)
```

**Output:**
```text
Original 3x3 Matrix: [[10, 20, 30], [40, 50, 60], [70, 80, 90]]
Flattened 1D List:   [10, 20, 30, 40, 50, 60, 70, 80, 90]
```

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use list comprehensions for simple, readable mappings and filters. | **DON'T** write 3-line comprehension monstrosities with multiple nested loops; write a standard loop instead. |
| **DO** put the filter `if` at the end when rejecting unwanted items. | **DON'T** forget `else` when using inline ternary conditionals before the `for` keyword. |
| **DO** prioritize readability over brevity: if a colleague cannot parse it in 5 seconds, refactor. | **DON'T** perform side-effects (like calling `print()` or writing to files) inside a list comprehension. |

---

## Quick Revision Summary

- A **list comprehension** constructs a new list using the syntax: `[expression for item in iterable if condition]`.
- List comprehensions run noticeably faster than standard `.append()` loops due to C-level bytecode optimization (`LIST_APPEND`).
- An `if` condition placed **after** `for` filters elements out of the final list.
- An `if-else` ternary placed **before** `for` maps every element to one of two transformed values.
- Comprehensions can flatten 2D lists by chaining `for row in matrix for cell in row`.
- Avoid overly complex comprehensions that hurt code readability; clean readability is Python's primary objective.

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Creating Infinite While Loops
If you forget to update your loop counter inside a `while` loop, the condition remains True forever:
```python
# ❌ Infinite loop trap (Press Ctrl+C to kill if accidentally run)
# count = 1
# while count <= 5:
#     print(count)
#     # Missing: count += 1

# ✅ CORRECT
count = 1
while count <= 5:
    print(count)
    count += 1
```

### 2. Modifying a List While Iterating Over It
Removing or inserting items in a list while looping over it causes skipped elements:
```python
nums = [1, 2, 3, 4]
# ❌ INCORRECT (Skips items during iteration)
# for n in nums:
#     if n % 2 == 0:
#         nums.remove(n)

# ✅ CORRECT (Iterate over a copy or use a list comprehension)
nums = [n for n in nums if n % 2 != 0]
print(nums)  # [1, 3]
```

---

## Practice Quiz

### 1. What will be the output of `[x * 2 for x in range(4)]`?
A. `[2, 4, 6, 8]`
B. `[0, 2, 4, 6]`
C. `[0, 2, 4, 6, 8]`
D. `[1, 2, 3, 4]`

**Answer:** B

---

### 2. In which position must the `if` keyword be placed when using list comprehension strictly as a FILTER to discard elements?
A. Before the opening bracket `[`
B. Immediately after the expression at the beginning: `[if condition expression for ...]`
C. At the end of the comprehension: `[expression for item in iterable if condition]`
D. After the word `in`

**Answer:** C

---

### 3. What will be produced by the following comprehension?
```python
result = [x if x % 2 == 0 else "Odd" for x in range(3)]
```
A. `[0, 'Odd', 2]`
B. `[0, 2]`
C. `['Odd', 1, 'Odd']`
D. SyntaxError: invalid syntax

**Answer:** A

---

### 4. Why are list comprehensions generally faster in CPython than equivalent for loops using `.append()`?
A. They run on multiple CPU cores automatically
B. They bypass Python-level attribute lookup and call overhead by utilizing the specialized C-level `LIST_APPEND` opcode
C. They pre-allocate memory in GPU RAM
D. They execute in Cython

**Answer:** B

---

### 5. What is the output of this nested list comprehension?
```python
matrix = [[1, 2], [3, 4]]
flat = [num for row in matrix for num in row]
print(flat)
```
A. `[[1, 2], [3, 4]]`
B. `[1, 2, 3, 4]`
C. `[1, 3, 2, 4]`
D. `[[1, 3], [2, 4]]`

**Answer:** B

---

# Practice Challenge: Festive Season E-Commerce Pricing & GST Engine

Build an automated product catalog pricing transformer for an Indian festival shopping sale (Amazon Great Indian Festival / Flipkart Big Billion Days).

You are given a list of product records containing product names, categories, base prices in INR, and stock availability. 

Use clean **list comprehensions** to:
1. **In-Stock Filter:** Filter out all out-of-stock products (`in_stock == True`).
2. **Festival Discount Transformation:** Apply a 15% festival discount to `"Electronics"`, a 25% discount to `"Fashion"`, and a 10% discount to all other categories.
3. **GST Computation:** Add 18% GST to the discounted price.
4. Output a new list of formatted dictionary summaries showing Product Name, Original Price, Discounted Price, and Final Payable Price (including GST).

### Complete Solution

```python
# ==========================================================
# Challenge: Festive Season Pricing & GST Engine
# ==========================================================

catalog = [
    {"name": "Noise Smartwatch",    "category": "Electronics", "base_price": 2999.0, "in_stock": True},
    {"name": "FabIndia Kurta",       "category": "Fashion",     "base_price": 1800.0, "in_stock": True},
    {"name": "Sony WH-1000XM5",     "category": "Electronics", "base_price": 26990.0,"in_stock": False},
    {"name": "Prestige Pressure Pan","category": "Kitchen",     "base_price": 1450.0, "in_stock": True},
    {"name": "Puma Running Shoes",  "category": "Fashion",     "base_price": 3499.0, "in_stock": True},
    {"name": "Milton Water Bottle", "category": "Kitchen",     "base_price": 420.0,  "in_stock": False}
]

# Helper function to compute discounted price based on category
def get_discount_rate(category: str) -> float:
    return 15.0 if category == "Electronics" else 25.0 if category == "Fashion" else 10.0

# 1. Pure List Comprehension: Filter in-stock and transform pricing with 18% GST
GST_RATE = 0.18

sale_invoice_items = [
    {
        "product": item["name"],
        "category": item["category"],
        "original_price": item["base_price"],
        "discounted_price": round(item["base_price"] * (1 - get_discount_rate(item["category"]) / 100), 2),
        "final_payable_gst": round(
            (item["base_price"] * (1 - get_discount_rate(item["category"]) / 100)) * (1 + GST_RATE),
            2
        )
    }
    for item in catalog
    if item["in_stock"]  # Filter: only in-stock items
]

print("=== FESTIVAL SALE PRICING ENGINE (LIST COMPREHENSION) ===")
print(f"{'Product Name':<24} {'Category':<13} {'Base (Rs)':<11} {'Sale (Rs)':<11} {'Final + 18% GST'}")
print("=" * 72)

for p in sale_invoice_items:
    print(f"{p['product']:<24} {p['category']:<13} Rs {p['original_price']:>7.2f}  Rs {p['discounted_price']:>7.2f}  Rs {p['final_payable_gst']:>8.2f}")

print("=" * 72)
print(f"Total In-Stock Items Processed: {len(sale_invoice_items)} of {len(catalog)}")
```

```text
Output:
=== FESTIVAL SALE PRICING ENGINE (LIST COMPREHENSION) ===
Product Name             Category      Base (Rs)   Sale (Rs)   Final + 18% GST
========================================================================
Noise Smartwatch         Electronics   Rs 2999.00  Rs 2549.15  Rs  3007.99
FabIndia Kurta           Fashion       Rs 1800.00  Rs 1350.00  Rs  1593.00
Prestige Pressure Pan    Kitchen       Rs 1450.00  Rs 1305.00  Rs  1539.90
Puma Running Shoes       Fashion       Rs 3499.00  Rs 2624.25  Rs  3096.61
========================================================================
Total In-Stock Items Processed: 4 of 6
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Set Comprehension** (13: Loops).

👉 **[Continue to Next Lesson: Set Comprehension →](/tutorials/python-for-beginners/set-comprehension)**
