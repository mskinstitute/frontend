---
id: for-loop
slug: for-loop
course: python-for-beginners
chapter: 13
topic: 13.2
title: "For Loops in Python: Sequence Iteration & The range() Function"
description: "Master sequence iteration with Python for loops. Explore the mechanics of for-in, deep dive into range(start, stop, step), string iteration, and enumerate()."
difficulty: Beginner
readingTime: 12
order: 62
keywords:
  - python for loop
  - sequence iteration python
  - python range function
  - enumerate python
  - string iteration python
  - for in loop python
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# For Loops in Python: Sequence Iteration & The `range()` Function

In many traditional programming languages like C or Java, a `for` loop is built around manual index arithmetic: initializing an integer `i = 0`, checking a boundary `i < n`, and incrementing `i++`. 

In Python, the **`for` loop** is vastly more elegant. It is fundamentally a **collection iterator** (commonly known as a *for-each* loop). It iterates directly over the items of any sequence or iterable—such as lists, tuples, strings, dictionaries, or ranges—automatically handling start, step, and termination without requiring manual index manipulation.

---

## Real-World Analogy: The Mumbai Dabbawala Delivery Crate & Post Office Sorter

```
+-------------------------------------------------------------------------------+
|                       FOR LOOP REAL-WORLD ANALOGIES                           |
+-------------------------------------------------------------------------------+

  1. THE MUMBAI DABBAWALA SORTING CRATE:
     - At Churchgate station, a Dabbawala stands before a wooden delivery crate:
       crate = ["Tiffin #101 (Nariman Pt)", "Tiffin #102 (Fort)", "Tiffin #103 (Colaba)"]
     - FOR each tiffin IN crate:
       * Read destination alphanumeric marking.
       * Load onto designated bicycle carrier.
     - The Dabbawala doesn't need to manually count "Index 0, Index 1, Index 2";
       they naturally take each tiffin box until the crate is completely empty.

  2. ISRO ROCKET LAUNCH COUNTDOWN:
     - Sriharikota Launch Control:
     - FOR second IN range(10, 0, -1):
       * Announce remaining seconds: "T-minus 10... T-minus 9... T-minus 1..."
     - Main engine ignition commands ignite at 0!
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: The Iterator Conveyor Belt

```
================================================================================
                    FOR-IN SEQUENCE ITERATION PIPELINE
================================================================================

  Iterable Sequence: ["Python", "JavaScript", "Rust"]
                           |
                           v
   +----------------------------------------------------------------+
   |   [ "Python" ]   --->   [ "JavaScript" ]   --->   [ "Rust" ]   |
   +----------------------------------------------------------------+
             |                       |                     |
             | Iteration 1           | Iteration 2         | Iteration 3
             v                       v                     v
      item = "Python"         item = "JavaScript"    item = "Rust"
             |                       |                     |
             v                       v                     v
     [ Execute Body ]         [ Execute Body ]      [ Execute Body ]
     print("Code in...")      print("Code in...")   print("Code in...")
                                                           |
                                                           v
                                                  [ Sequence Exhausted ]
                                                  [ Continue Program ]
================================================================================
```

---

## 1. Syntax of the `for...in` Statement

The standard syntax is:

```python
for <target_variable> in <iterable>:
    # Executed once for each element in the iterable
    <statement_block>
```

Python automatically extracts each successive element from the iterable, assigns it to `<target_variable>`, executes the indented block, and gracefully terminates once the sequence is exhausted.

---

## 2. Deep Dive: The `range()` Function

When you need to execute code a specific number of times or generate arithmetic sequences of numbers, Python provides the built-in `range()` function. 

A `range` object is memory-efficient because it generates numbers on-demand (lazy evaluation) rather than allocating a full list in memory.

### Three Forms of `range()`:

```
1. range(stop)                --> 0 up to (stop - 1)
2. range(start, stop)         --> start up to (stop - 1)
3. range(start, stop, step)   --> start up to (stop - 1), incrementing by step
```

```python
# ==========================================================
# Example 1: The Three Variants of range()
# ==========================================================

print("1. range(5) -> 0 to 4:")
for i in range(5):
    print(i, end=" ")
print("\n")

print("2. range(10, 15) -> 10 to 14:")
for i in range(10, 15):
    print(i, end=" ")
print("\n")

print("3. range(100, 500, 100) -> Stepping by 100:")
for i in range(100, 500, 100):
    print(i, end=" ")
print("\n")

print("4. range(5, 0, -1) -> Negative step countdown:")
for i in range(5, 0, -1):
    print(i, end=" ")
print("\n")
```

**Output:**
```text
1. range(5) -> 0 to 4:
0 1 2 3 4 

2. range(10, 15) -> 10 to 14:
10 11 12 13 14 

3. range(100, 500, 100) -> Stepping by 100:
100 200 300 400 

4. range(5, 0, -1) -> Negative step countdown:
5 4 3 2 1 
```

> [!IMPORTANT]
> **Half-Open Interval Rule:** Just like Python string and list slicing, `range(start, stop)` is **inclusive of start** but **exclusive of stop**. Hence, `range(1, 5)` yields `1, 2, 3, 4` (stops before 5).

---

## 3. Iterating Across Common Data Types

### Iterating Over Strings:
Strings are iterable sequences of characters:

```python
# Iterating over string characters
brand = "ISRO"
for char in brand:
    print(f"Telemetry Satellite Node: {char}")
```

### Iterating Over Lists and Tuples:
```python
fruits = ["Alphonso Mango", "Nagpur Orange", "Kashmiri Apple"]
for fruit in fruits:
    print(f"Premium Harvest: {fruit}")
```

### Iterating with `enumerate()` (Index + Value):
When you require both the numerical index and the item value, avoid the anti-pattern `for i in range(len(items)):`. Instead, use the idiomatic Python built-in **`enumerate()`**:

```python
# ==========================================================
# Example 2: Clean Indexing with enumerate()
# ==========================================================

train_stops = ["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Varanasi (BSB)"]

print("=== VANDE BHARAT EXPRESS ROUTE SCHEDULE ===")
# start=1 makes the counter start at 1 instead of 0
for stop_number, station in enumerate(train_stops, start=1):
    print(f"Stop #{stop_number}: {station}")
```

**Output:**
```text
=== VANDE BHARAT EXPRESS ROUTE SCHEDULE ===
Stop #{stop_number}: New Delhi (NDLS)
Stop #2: Kanpur Central (CNB)
Stop #3: Prayagraj (PRYJ)
Stop #4: Varanasi (BSB)
```

---

## 4. Practical Implementation: Retail Inventory Valuation

```python
# ==========================================================
# Example 3: Supermarket Inventory Audit
# ==========================================================

inventory = [
    {"sku": "SKU-01", "item": "Basmati Rice 5kg", "unit_price": 450.0, "stock": 40},
    {"sku": "SKU-02", "item": "Mustard Oil 1L",    "unit_price": 175.0, "stock": 85},
    {"sku": "SKU-03", "item": "Toor Dal 1kg",      "unit_price": 160.0, "stock": 120},
    {"sku": "SKU-04", "item": "Tata Tea Gold 500g","unit_price": 280.0, "stock": 50}
]

total_valuation = 0.0

print(f"{'SKU':<8} {'Item Description':<20} {'Price (Rs)':<12} {'Stock':<8} {'Total Value'}")
print("-" * 62)

for product in inventory:
    subtotal = product["unit_price"] * product["stock"]
    total_valuation += subtotal
    print(f"{product['sku']:<8} {product['item']:<20} Rs {product['unit_price']:>7.2f}  {product['stock']:<8} Rs {subtotal:>9.2f}")

print("-" * 62)
print(f"Total Warehouse Inventory Asset Valuation: Rs {total_valuation:,.2f}")
```

**Output:**
```text
SKU      Item Description     Price (Rs)   Stock    Total Value
--------------------------------------------------------------
SKU-01   Basmati Rice 5kg     Rs  450.00  40       Rs  18000.00
SKU-02   Mustard Oil 1L       Rs  175.00  85       Rs  14875.00
SKU-03   Toor Dal 1kg         Rs  160.00  120      Rs  19200.00
SKU-04   Tata Tea Gold 500g   Rs  280.00  50       Rs  14000.00
--------------------------------------------------------------
Total Warehouse Inventory Asset Valuation: Rs 66,075.00
```

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** iterate directly over elements: `for item in items:`. | **DON'T** use C-style indexing: `for i in range(len(items)): item = items[i]` unless indices are explicitly needed for mutation. |
| **DO** use `enumerate(iterable, start=1)` when indices are needed alongside elements. | **DON'T** maintain a manual counter `i = 0; i += 1` inside a `for` loop. |
| **DO** use `range(start, stop, step)` for arithmetic progressions and countdowns. | **DON'T** instantiate huge lists like `list(range(10000000))` in memory when iterating; `range` itself is already lazy. |
| **DO** use meaningful singular/plural variable names: `for student in students:`. | **DON'T** use single ambiguous letters like `for x in data:` for complex data structures. |

---

## Quick Revision Summary

- Python's `for` loop iterates directly over elements of any iterable sequence (*for-each* semantics).
- The `range(start, stop, step)` built-in creates a lazy arithmetic sequence generator:
  - `start` defaults to `0`.
  - `stop` is **exclusive**.
  - `step` defaults to `+1` (can be negative for countdowns).
- `range` objects do not store all numbers in memory; they calculate items on-the-fly in $O(1)$ memory.
- Use `enumerate(sequence)` to retrieve `(index, item)` pairs simultaneously in an idiomatic and clean manner.

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

### 1. What sequence of numbers is generated by `range(2, 10, 3)`?
A. 2, 5, 8, 11
B. 2, 5, 8
C. 2, 4, 6, 8, 10
D. 3, 6, 9

**Answer:** B

---

### 2. What is the output of the following Python loop?
```python
total = 0
for num in range(1, 5):
    total += num
print(total)
```
A. 15
B. 10
C. 5
D. 4

**Answer:** B

---

### 3. Which built-in function should you pair with a `for` loop when you need both the element and its zero-based index?
A. `zip()`
B. `index()`
C. `enumerate()`
D. `counter()`

**Answer:** C

---

### 4. What will be displayed by the following reverse loop?
```python
for count in range(3, 0, -1):
    print(count, end=" ")
```
A. 3 2 1 0
B. 3 2 1
C. 0 1 2 3
D. 2 1 0

**Answer:** B

---

### 5. Why is iterating with `for item in my_list:` considered more Pythonic than `for i in range(len(my_list)): item = my_list[i]`?
A. `range(len())` is deprecated and removed in Python 3.12
B. Direct iteration is cleaner, less error-prone (no off-by-one errors), and works identically across non-indexable iterables like generators and sets
C. Direct iteration compiles into C++ machine code
D. Direct iteration automatically sorts the items in ascending order

**Answer:** B

---

# Practice Challenge: UPI Merchant Batch Payment & MDR Settlement Engine

Build an automated batch settlement engine for an Indian UPI payments aggregator (Razorpay / Paytm Payment Gateway). 

The system receives a batch of daily retail UPI transactions. Each transaction record includes the merchant ID, payer VPA, transaction amount in INR, and payment mode (`"UPI_QR"`, `"UPI_CREDIT_CARD"`, or `"UPI_P2M"`).

### Requirements:
1. Iterate over the transactions using `for` and `enumerate(transactions, start=1)`.
2. Compute the **Merchant Discount Rate (MDR)** fee deduction:
   - For `"UPI_CREDIT_CARD"`: 1.8% of transaction amount.
   - For `"UPI_P2M"` and `"UPI_QR"`: 0.0% if amount <= Rs 2,000, else 0.5%.
3. Compute the net payout to the merchant (`amount - mdr_fee`).
4. Maintain a running tally of gross transaction value, total MDR fees collected, and net payout.
5. Print an itemized batch audit settlement report.

### Complete Solution

```python
# ==========================================================
# Challenge: UPI Merchant Batch Settlement Engine
# ==========================================================

transactions_batch = [
    {"tx_id": "TXN-7801", "merchant": "M/S Gupta Sweets", "amount": 450.0,  "mode": "UPI_QR"},
    {"tx_id": "TXN-7802", "merchant": "Vijay Electronics", "amount": 28500.0,"mode": "UPI_CREDIT_CARD"},
    {"tx_id": "TXN-7803", "merchant": "Apollo Pharmacy",  "amount": 1850.0, "mode": "UPI_P2M"},
    {"tx_id": "TXN-7804", "merchant": "Sharma Book Depot", "amount": 3400.0, "mode": "UPI_QR"},
    {"tx_id": "TXN-7805", "merchant": "Titan Eyeplus",     "amount": 5600.0, "mode": "UPI_CREDIT_CARD"}
]

total_gross_volume = 0.0
total_mdr_collected = 0.0
total_net_disbursed = 0.0

print("=== NATIONAL PAYMENTS SETTLEMENT REPORT (NPCI / UPI) ===")
print(f"{'#':<3} {'Txn ID':<10} {'Merchant Name':<22} {'Mode':<16} {'Gross (Rs)':<12} {'MDR (Rs)':<10} {'Net Payout'}")
print("=" * 86)

for batch_idx, txn in enumerate(transactions_batch, start=1):
    amt = txn["amount"]
    mode = txn["mode"]
    
    # MDR calculation logic
    if mode == "UPI_CREDIT_CARD":
        mdr_pct = 1.8
    else:
        # Standard UPI debit / QR: 0% up to Rs 2000, 0.5% above
        mdr_pct = 0.0 if amt <= 2000.0 else 0.5
        
    mdr_fee = (amt * mdr_pct) / 100.0
    net_payout = amt - mdr_fee
    
    # Running tallies
    total_gross_volume += amt
    total_mdr_collected += mdr_fee
    total_net_disbursed += net_payout
    
    print(f"{batch_idx:<3} {txn['tx_id']:<10} {txn['merchant']:<22} {mode:<16} Rs {amt:>8.2f}  Rs {mdr_fee:>6.2f}  Rs {net_payout:>9.2f}")

print("=" * 86)
print(f"Batch Summary: {len(transactions_batch)} Transactions Settled")
print(f"Total Gross Transaction Value (GTV): Rs {total_gross_volume:>10.2f}")
print(f"Total Merchant Discount Rate Fees:    Rs {total_mdr_collected:>10.2f}")
print(f"Total Net Merchant Fund Disbursal:    Rs {total_net_disbursed:>10.2f}")
```

```text
Output:
=== NATIONAL PAYMENTS SETTLEMENT REPORT (NPCI / UPI) ===
#   Txn ID     Merchant Name          Mode             Gross (Rs)   MDR (Rs)   Net Payout
======================================================================================
1   TXN-7801   M/S Gupta Sweets       UPI_QR           Rs   450.00  Rs   0.00  Rs    450.00
2   TXN-7802   Vijay Electronics      UPI_CREDIT_CARD  Rs 28500.00  Rs 513.00  Rs  27987.00
3   TXN-7803   Apollo Pharmacy        UPI_P2M          Rs  1850.00  Rs   0.00  Rs   1850.00
4   TXN-7804   Sharma Book Depot      UPI_QR           Rs  3400.00  Rs  17.00  Rs   3383.00
5   TXN-7805   Titan Eyeplus          UPI_CREDIT_CARD  Rs  5600.00  Rs 100.80  Rs   5499.20
======================================================================================
Batch Summary: 5 Transactions Settled
Total Gross Transaction Value (GTV): Rs   39800.00
Total Merchant Discount Rate Fees:    Rs     630.80
Total Net Merchant Fund Disbursal:    Rs   39169.20
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Nested Loops** (13: Loops).

👉 **[Continue to Next Lesson: Nested Loops →](/tutorials/python-for-beginners/nested-loops)**
