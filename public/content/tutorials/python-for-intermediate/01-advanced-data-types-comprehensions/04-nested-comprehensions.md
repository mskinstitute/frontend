---
id: python-nested-comprehensions
slug: nested-comprehensions
course: python-for-intermediate
chapter: "1: Advanced Data Types & Comprehensions"
topic: "1.4 Nested Comprehensions"
title: "Nested Comprehensions in Python"
description: "Master multi-dimensional nested comprehensions for grid generation, matrix transposition, hierarchical dictionary restructuring, and readability management."
difficulty: Intermediate
readingTime: 14
order: 4
keywords:
  - nested comprehensions
  - 2d matrix
  - matrix transpose
  - nested list comprehension
  - nested dictionary
  - multi dimensional data
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Nested Comprehensions in Python

When engineering applications that handle tabular records, image pixel arrays, geographical coordinates, or hierarchical JSON datasets, you constantly work with nested data structures.

A **Nested Comprehension** is a comprehension contained inside another comprehension. It allows you to generate multi-dimensional grids, transpose matrices, and transform deeply nested dictionaries in declarative, high-speed Python.

---

## Real-World Analogy: Indian Railways Multi-Tier Coach Seating Chart

Imagine the reservation chart for an Indian Railways 3-Tier AC coach (`B1`):

```
+-------------------------------------------------------------------------+
|                  RAILWAY COACH BERTH MATRIX GENERATOR                   |
+-------------------------------------------------------------------------+
|                                                                         |
|  Outer Comprehension: [ Coach Compartments 1 to 8 ]                     |
|                               │                                         |
|                               ▼                                         |
|  Inner Comprehension:  [ Berths inside Compartment: Lower, Middle, Upper]|
|                               │                                         |
|                               ▼                                         |
|  Resulting 2D Structure:                                                |
|  [                                                                      |
|    ["Bay 1 - Lower", "Bay 1 - Middle", "Bay 1 - Upper"],                |
|    ["Bay 2 - Lower", "Bay 2 - Middle", "Bay 2 - Upper"],                |
|    ...                                                                  |
|  ]                                                                      |
+-------------------------------------------------------------------------+
```

- **Flattening:** If the ticket collector wants a single flat scroll of all 72 passengers regardless of compartment, you use a multi-loop flattening comprehension.
- **Nested Preservation:** If the display board on the platform needs to show bays row-by-row, you nest an inner comprehension inside an outer comprehension.

---

## Critical Distinction: Flattening vs Preserving Structure

Developers often confuse two completely different syntax patterns:

```
+------------------------------------+------------------------------------+
|  1. Flattening Comprehension       |  2. True Nested Comprehension      |
|     (Results in 1D flat list)      |     (Results in 2D nested list)    |
+------------------------------------+------------------------------------+
|  [val for row in grid for val in r]|  [[val for val in row] for row in g|
|                                    |                                    |
|  Output: [1, 2, 3, 4]              |  Output: [[1, 2], [3, 4]]          |
+------------------------------------+------------------------------------+
```

### The Ordering Rule:
1. **In Flattening (`[x for sublist in list for x in sublist]`):**
   The loops read left-to-right exactly like nested `for` statements: outer first, inner second.
2. **In True Nested Comprehensions (`[[expr for inner] for outer]`):**
   The outer comprehension runs the outer loop, and its expression is an entire enclosed inner comprehension.

---

## Comprehensive Code Examples

### 1. Generating a 2D Seating Grid

```python
# Generate a 4x3 seating grid for an executive conference hall in New Delhi
# Rows: A, B, C, D | Seats: 1, 2, 3
rows = ["Row-A", "Row-B", "Row-C", "Row-D"]
seat_numbers = [1, 2, 3]

# Outer loop iterates over rows; inner loop creates the seat list for that row
seating_grid = [
    [f"{r}-Seat{s}" for s in seat_numbers]
    for r in rows
]

print("Conference Hall Seating Grid:")
for row in seating_grid:
    print(" ", row)
```

**Expected Output:**
```text
Conference Hall Seating Grid:
  ['Row-A-Seat1', 'Row-A-Seat2', 'Row-A-Seat3']
  ['Row-B-Seat1', 'Row-B-Seat2', 'Row-B-Seat3']
  ['Row-C-Seat1', 'Row-C-Seat2', 'Row-C-Seat3']
  ['Row-D-Seat1', 'Row-D-Seat2', 'Row-D-Seat3']
```

---

### 2. Matrix Transposition (Swapping Rows and Columns)

Transposing a matrix swaps rows into columns ($M_{ij} \to M_{ji}$). This is a fundamental operation in numerical computing and data analysis.

```python
# 3x4 Matrix: 3 students across 4 subjects
# Rows: Students | Columns: [Math, Physics, Chem, CS]
score_matrix = [
    [85, 90, 78, 92],  # Student 1
    [72, 68, 80, 75],  # Student 2
    [95, 92, 88, 98]   # Student 3
]

num_subjects = len(score_matrix[0])  # 4

# Transpose: Outer loop iterates across subject columns (0 to 3)
# Inner loop collects scores from each student for that subject
subject_grouped = [
    [student_row[col_idx] for student_row in score_matrix]
    for col_idx in range(num_subjects)
]

print("Original (By Student):")
for r in score_matrix:
    print(" ", r)

print("\nTransposed (By Subject):")
subject_names = ["Math", "Physics", "Chemistry", "Computer Science"]
for subj, scores in zip(subject_names, subject_grouped):
    print(f"  {subj:<18}: {scores}")
```

**Expected Output:**
```text
Original (By Student):
  [85, 90, 78, 92]
  [72, 68, 80, 75]
  [95, 92, 88, 98]

Transposed (By Subject):
  Math              : [85, 72, 95]
  Physics           : [90, 68, 92]
  Chemistry         : [78, 80, 88]
  Computer Science  : [92, 75, 98]
```

---

### 3. Nested Dictionary Comprehensions

Hierarchical corporate structures often store departments, employees, and salaries. Nested dictionary comprehensions transform multi-tier mappings effortlessly:

```python
# Departmental Employee Salaries (in INR Lakhs per annum)
company_payroll = {
    "Engineering": {
        "Amit": 18.5,
        "Priya": 24.0,
        "Rohan": 12.0
    },
    "Marketing": {
        "Kavita": 14.0,
        "Suresh": 9.5
    },
    "Human Resources": {
        "Neha": 11.0,
        "Vikram": 16.5
    }
}

# Apply a 10% appraisal bonus to employees earning below 15 LPA across all departments
appraised_payroll = {
    dept: {
        emp: round(sal * 1.10, 2) if sal < 15.0 else sal
        for emp, sal in employees.items()
    }
    for dept, employees in company_payroll.items()
}

print("Appraised Payroll Structure:")
for dept, emps in appraised_payroll.items():
    print(f"  [{dept}]")
    for emp, sal in emps.items():
        original = company_payroll[dept][emp]
        note = " (+10% Bonus!)" if sal > original else ""
        print(f"    {emp:<10}: ₹{sal:.2f} LPA{note}")
```

**Expected Output:**
```text
Appraised Payroll Structure:
  [Engineering]
    Amit      : ₹18.50 LPA
    Priya     : ₹24.00 LPA
    Rohan     : ₹13.20 LPA (+10% Bonus!)
  [Marketing]
    Kavita    : ₹15.40 LPA (+10% Bonus!)
    Suresh    : ₹10.45 LPA (+10% Bonus!)
  [Human Resources]
    Neha      : ₹12.10 LPA (+10% Bonus!)
    Vikram    : ₹16.50 LPA
```

---

### 4. Selective Multi-Condition Filtering in Nested Lists

```python
# Coordinate grid with obstacle avoidance
# Filter grid to find all coordinate points (x, y) where x + y is even and x != y
grid_points = [
    (x, y)
    for x in range(1, 4)
    for y in range(1, 4)
    if (x + y) % 2 == 0
    if x != y
]

print("Valid Waypoint Coordinates:", grid_points)
```

**Expected Output:**
```text
Valid Waypoint Coordinates: [(1, 3), (3, 1)]
```

---

## The Readability Rule: When NOT to Nest Comprehensions

While Python allows arbitrary nesting, deeply nested comprehensions quickly become unreadable write-only code (often termed "comprehension pyramids").

> [!CAUTION]
> **The Two-Line Rule (PEP 8 Best Practice):**
> If a nested comprehension spans more than 2 levels of loops or requires more than 3 lines of complex indentation, refactor it into standard helper functions with explicit `for` loops. Readability always counts more than terseness.

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Unreadable Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Grid Generation** | `[[x for x in r] for r in [[y for y in z] for z in w]]` (3+ levels) | Max 2 levels; refactor deeper levels into generator functions |
| **Transposition** | Manual indexed nested loops with temporary arrays | `[[row[i] for row in matrix] for i in range(cols)]` |
| **Flattening Syntax** | Putting inner loop before outer loop (causes SyntaxError) | Order `for` loops left-to-right matching standard nested loop order |
| **Formatting** | Writing nested comprehensions on one giant 150-char line | Format across multiple indented lines for visual hierarchy |

---

## Quick Revision Summary Cheat Sheet

- **2D Grid Generation:** `[[f(x, y) for y in col_iter] for x in row_iter]`
- **1D Flattening:** `[item for sublist in matrix for item in sublist]`
- **Transposition:** `[[row[i] for row in matrix] for i in range(len(matrix[0]))]`
- **Nested Dicts:** `{outer_k: {inner_k: expr for inner_k, v in inner_d.items()} for outer_k, inner_d in d.items()}`
- **Evaluation Order:** Outer comprehension controls outer dimensions; inner comprehension creates each row or nested value.

---

---

# Practice Challenge

### Scenario: Indian Railway Berth Allocation Matrix

In Indian Railways Sleeper coaches, each compartment bay contains 6 berths numbered across 3 tiers:
- Lower Berth (LB): Seat numbers where `n % 3 == 1`
- Middle Berth (MB): Seat numbers where `n % 3 == 2`
- Upper Berth (UB): Seat numbers where `n % 3 == 0`

Given 3 consecutive bays with seat numbers 1 to 18:
1. Divide seats into 3 bays of 6 seats each using a nested comprehension:
   - Bay 1: Seats 1 to 6
   - Bay 2: Seats 7 to 12
   - Bay 3: Seats 13 to 18
2. For each seat number, attach its berth abbreviation (`"LB"`, `"MB"`, or `"UB"`).
3. Print the final 2D coach layout showing each bay row-by-row.

### Starter Code
```python
# Total 3 bays, 6 berths per bay
total_bays = 3
berths_per_bay = 6

# TODO: Construct 2D layout using nested comprehension
```

### Complete Solution
```python
total_bays = 3
berths_per_bay = 6

def get_berth_type(seat_no):
    rem = seat_no % 3
    if rem == 1:
        return "LB"
    elif rem == 2:
        return "MB"
    else:
        return "UB"

# Nested comprehension: Outer loop builds bays; inner loop builds labeled berths for that bay
coach_bays = [
    [
        f"Seat {seat_no:02d} ({get_berth_type(seat_no)})"
        for seat_no in range(bay_idx * berths_per_bay + 1, (bay_idx + 1) * berths_per_bay + 1)
    ]
    for bay_idx in range(total_bays)
]

print("=== IRCTC Sleeper Coach Berth Layout ===")
for bay_num, bay_seats in enumerate(coach_bays, start=1):
    print(f"\n[BAY {bay_num}]")
    for seat in bay_seats:
        print(f"  {seat}")
```

### Expected Output
```text
=== IRCTC Sleeper Coach Berth Layout ===

[BAY 1]
  Seat 01 (LB)
  Seat 02 (MB)
  Seat 03 (UB)
  Seat 04 (LB)
  Seat 05 (MB)
  Seat 06 (UB)

[BAY 2]
  Seat 07 (LB)
  Seat 08 (MB)
  Seat 09 (UB)
  Seat 10 (LB)
  Seat 11 (MB)
  Seat 12 (UB)

[BAY 3]
  Seat 13 (LB)
  Seat 14 (MB)
  Seat 15 (UB)
  Seat 16 (LB)
  Seat 17 (MB)
  Seat 18 (UB)
```

---

## Practice Quiz

### 1. What is the difference between [x for row in matrix for x in row] and [[x for x in row] for row in matrix]?
A. The first produces a 1D flattened list, whereas the second produces a 2D nested list
B. The first produces a dictionary, whereas the second produces a tuple
C. The first is invalid syntax that causes a SyntaxError
D. Both produce identical 2D lists
**Answer:** A
**Explanation:** The first expression flattens the matrix into a single 1D list by chaining two `for` clauses. The second expression nests an inner list comprehension `[x for x in row]` inside an outer list comprehension, preserving the 2D row-by-row structure.

---

### 2. What will the following expression evaluate to?
```python
matrix = [[1, 2], [3, 4]]
transposed = [[row[i] for row in matrix] for i in range(2)]
print(transposed)
```
A. `[[1, 2], [3, 4]]`
B. `[[1, 3], [2, 4]]`
C. `[1, 2, 3, 4]`
D. `[[4, 3], [2, 1]]`
**Answer:** B
**Explanation:** For `i = 0`, it gathers column 0 from each row: `[1, 3]`. For `i = 1`, it gathers column 1 from each row: `[2, 4]`. The resulting transposed matrix is `[[1, 3], [2, 4]]`.

---

### 3. Given matrix = [[10, 20], [30, 40], [50, 60]], what is the order of execution for [val for row in matrix for val in row]?
A. The inner loop `for val in row` executes before the matrix is accessed
B. The outer loop `for row in matrix` iterates first, and for each row, the inner loop `for val in row` executes
C. Python evaluates elements randomly in parallel
D. Elements are evaluated from highest value to lowest value
**Answer:** B
**Explanation:** Multi-loop comprehensions strictly follow left-to-right evaluation order, mirroring the exact structure of standard nested `for` statements.

---

### 4. What is the primary software engineering concern with deeply nested comprehensions (3 or more levels)?
A. CPython refuses to compile more than 2 loops
B. Code readability deteriorates rapidly, violating Python's core design philosophy (PEP 20: "Readability counts")
C. They consume 100 times more GPU power
D. They automatically convert integers into strings
**Answer:** B
**Explanation:** While Python syntactically allows deeply nested comprehensions, code comprehension and maintainability suffer drastically. Industry standard guidelines recommend breaking 3+ level comprehensions into clear functions or traditional loops.

---

### 5. What does the following nested dictionary comprehension output?
```python
grades = {
    "Batch-A": {"Aman": 85, "Pooja": 92},
    "Batch-B": {"Rohan": 65, "Kavita": 45}
}
passed = {
    b: {name: sc for name, sc in students.items() if sc >= 50}
    for b, students in grades.items()
}
print(len(passed["Batch-B"]))
```
A. 2
B. 1
C. 0
D. KeyError
**Answer:** B
**Explanation:** In `"Batch-B"`, Rohan scored 65 (passed) and Kavita scored 45 (filtered out because `sc < 50`). Only Rohan remains in `passed["Batch-B"]`, so its length is 1.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project: Data Filtering with Comprehensions** (1: Advanced Data Types & Comprehensions).

👉 **[Continue to Next Lesson: Project: Data Filtering with Comprehensions →](/tutorials/python-for-intermediate/project-data-filtering-with-comprehensions)**
