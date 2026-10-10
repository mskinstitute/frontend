---
id: nested-loops
slug: nested-loops
course: python-for-beginners
chapter: 13
topic: 13.3
title: "Nested Loops in Python: Multi-Dimensional Iteration & Pattern Architecture"
description: "Master nested loops in Python for 2D matrices, grid coordinates, and geometric pattern printing. Understand iteration mechanics, time complexity, and performance considerations."
difficulty: Beginner
readingTime: 12
order: 63
keywords:
  - python nested loops
  - 2d matrix iteration python
  - pattern printing python
  - outer loop inner loop
  - time complexity nested loops
  - grid coordinates python
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Nested Loops in Python: Multi-Dimensional Iteration & Coordinate Systems

In programming, data often spans more than a single dimension. Spreadsheets have rows and columns, digital images consist of pixel grids $(x, y)$, game boards (like chess or tic-tac-toe) have coordinate squares, and cinema halls have numbered seats across designated rows.

To process multi-dimensional data structures, Python utilizes **nested loops**—where one loop resides inside the body of another. In a nested loop construct, the **inner loop completes its entire cycle** of iterations for **every single iteration** of the outer loop.

---

## Real-World Analogy: The PVR Cinema Hall & Analog Clock Hands

```
+-------------------------------------------------------------------------------+
|                     NESTED LOOP REAL-WORLD ANALOGIES                          |
+-------------------------------------------------------------------------------+

  1. PVR MULTIPLEX / CINEMA SEAT ALLOCATION:
     - An usher sweeps through an auditorium to check tickets:
       Rows: ["Row A", "Row B", "Row C"]
       Seats per Row: [Seat 1, Seat 2, Seat 3, Seat 4]
     - FOR each row IN Rows:               <-- OUTER LOOP
       * Announce "Inspecting Row..."
       * FOR each seat IN Seats:           <-- INNER LOOP
         - Check barcode for Seat!
     - The usher inspects every seat (1 to 4) before advancing to the next row.

  2. THE MECHANICAL WALL CLOCK:
     - Outer Loop: Hour Hand (advances 1 step every hour: 1 to 12).
     - Inner Loop: Minute Hand (must complete 60 full revolutions per hour).
     - Total minute ticks per 12-hour cycle = 12 * 60 = 720 ticks.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: 2D Matrix Coordinate Traversal

```
================================================================================
                    2D GRID NESTED ITERATION MATRIX
================================================================================

  Outer Loop: i in range(3)  (Rows 0, 1, 2)
  Inner Loop: j in range(4)  (Columns 0, 1, 2, 3)

       Column 0        Column 1        Column 2        Column 3
    +---------------+---------------+---------------+---------------+
Row | Cell (0, 0)   | Cell (0, 1)   | Cell (0, 2)   | Cell (0, 3)   |  <- i = 0
 0  +---------------+---------------+---------------+---------------+
Row | Cell (1, 0)   | Cell (1, 1)   | Cell (1, 2)   | Cell (1, 3)   |  <- i = 1
 1  +---------------+---------------+---------------+---------------+
Row | Cell (2, 0)   | Cell (2, 1)   | Cell (2, 2)   | Cell (2, 3)   |  <- i = 2
 2  +---------------+---------------+---------------+---------------+

  Total Execution Count = Outer Iterations (3) * Inner Iterations (4) = 12
================================================================================
```

---

## 1. Syntax & Core Mechanics

A nested loop can combine `for` and `while` loops in any combination. The most common structure is a nested `for` loop:

```python
for outer_var in outer_iterable:
    # Outer loop setup
    for inner_var in inner_iterable:
        # Inner loop body executes completely
        statement(outer_var, inner_var)
    # Executed after inner loop finishes
```

### Iteration Math Rule:
If the outer loop runs $M$ times and the inner loop runs $N$ times, the statement inside the inner loop will execute a total of:
$$\text{Total Iterations} = M \times N$$

```python
# ==========================================================
# Example 1: Basic Nested Loop Counter
# ==========================================================

for row in range(1, 4):         # Outer: 3 times (1, 2, 3)
    print(f"--- Starting Row {row} ---")
    for seat in range(1, 4):    # Inner: 3 times (1, 2, 3)
        print(f"  Inspecting Row {row}, Seat {seat}")
```

**Output:**
```text
--- Starting Row 1 ---
  Inspecting Row 1, Seat 1
  Inspecting Row 1, Seat 2
  Inspecting Row 1, Seat 3
--- Starting Row 2 ---
  Inspecting Row 2, Seat 1
  Inspecting Row 2, Seat 2
  Inspecting Row 2, Seat 3
--- Starting Row 3 ---
  Inspecting Row 3, Seat 1
  Inspecting Row 3, Seat 2
  Inspecting Row 3, Seat 3
```

---

## 2. Iterating Over 2D Lists (Matrices)

In Python, a 2D matrix is represented as a list of lists. Nested loops provide the canonical mechanism to traverse every row and cell:

```python
# ==========================================================
# Example 2: 2D Matrix Traversal & Row Sums
# ==========================================================

quarterly_sales_inr_lakhs = [
    [45, 52, 60],   # North Region (Q1, Q2, Q3)
    [38, 41, 49],   # South Region (Q1, Q2, Q3)
    [65, 70, 78]    # West Region  (Q1, Q2, Q3)
]

regions = ["North India", "South India", "West India"]

print("=== REGIONAL QUARTERLY REVENUE AUDIT ===")
for r_idx, row in enumerate(quarterly_sales_inr_lakhs):
    region_name = regions[r_idx]
    row_sum = 0
    print(f"{region_name:<12}: ", end="")
    
    for val in row:
        row_sum += val
        print(f"Rs {val}L", end="  ")
        
    print(f"-> Total: Rs {row_sum}L")
```

**Output:**
```text
=== REGIONAL QUARTERLY REVENUE AUDIT ===
North India : Rs 45L  Rs 52L  Rs 60L  -> Total: Rs 157L
South India : Rs 38L  Rs 41L  Rs 49L  -> Total: Rs 128L
West India  : Rs 65L  Rs 70L  Rs 78L  -> Total: Rs 213L
```

---

## 3. Geometric Pattern Generation

Pattern printing exercises are a classical computer science technique to master coordinate geometry and nested index relationships:

### Pattern A: Right-Angled Triangle
In a right-angled triangle, the number of columns printed depends directly on the current row number:

```python
# ==========================================================
# Example 3: Right-Angled Number Triangle
# ==========================================================

TOTAL_ROWS = 5

for i in range(1, TOTAL_ROWS + 1):
    for j in range(1, i + 1):
        print(j, end=" ")
    print()  # Newline after inner loop completes
```

**Output:**
```text
1 
1 2 
1 2 3 
1 2 3 4 
1 2 3 4 5 
```

### Pattern B: Centered Pyramid (Spaces + Symbols)
A pyramid requires two inner loops per row: one to print leading spaces, and another to print the stars:

```python
# ==========================================================
# Example 4: Centered Diwali Diya / Star Pyramid
# ==========================================================

HEIGHT = 4

for i in range(1, HEIGHT + 1):
    # Inner Loop 1: Leading spaces
    for s in range(HEIGHT - i):
        print(" ", end="")
    # Inner Loop 2: Asterisks (2*i - 1)
    for star in range(2 * i - 1):
        print("*", end="")
    print()
```

**Output:**
```text
   *
  ***
 *****
*******
```

---

## 4. Algorithmic Complexity: The Cost of Nesting

Every level of nesting multiplies the time complexity of your program:

```
+----------------+---------------------+-------------------------------+
| NESTING DEPTH  | BIG-O COMPLEXITY    | ITERATIONS FOR N = 1,000      |
+----------------+---------------------+-------------------------------+
| 1 Loop         | O(N) Linear         | 1,000 steps (~Instant)        |
| 2 Nested Loops | O(N^2) Quadratic    | 1,000,000 steps (~0.05 sec)   |
| 3 Nested Loops | O(N^3) Cubic        | 1,000,000,000 steps (~10 sec) |
| 4 Nested Loops | O(N^4) Quartic      | 1,000,000,000,000 (~Hours!)   |
+----------------+---------------------+-------------------------------+
```

> [!WARNING]
> **Performance Bottleneck:** Avoid nesting 3 or more loops in production code on large datasets. If you find yourself writing triple-nested loops, look for dictionary lookups ($O(1)$) or set operations ($O(1)$) to reduce complexity.

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use distinctive variable names for each loop level (e.g. `row, col` or `student, mark`). | **DON'T** re-use the same variable name in outer and inner loops (`for i in ...: for i in ...:` overwrites `i`). |
| **DO** use `print()` with `end=""` to construct 2D grid outputs horizontally. | **DON'T** place expensive operations (like file reads or API calls) inside deep inner loops. |
| **DO** keep nesting depth to at most 2 levels whenever possible. | **DON'T** write 4-level nested loops that result in $O(N^4)$ performance degradation. |

---

## Quick Revision Summary

- A **nested loop** is a loop located inside the body of another loop.
- The **inner loop** executes to completion on *every single cycle* of the **outer loop**.
- Total operations equal $\text{Outer Count} \times \text{Inner Count}$.
- Nested loops are the primary mechanism for traversing 2D matrices, tables, spreadsheets, and rendering coordinate grids.
- A `break` statement inside an inner loop breaks **only** out of that immediate inner loop, not the outer loop.
- Avoid deep nesting ($\ge 3$ levels) to prevent catastrophic $O(N^3)$ computational slowdowns.

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

### 1. How many total times will the `print("Tick")` statement execute in the following code?
```python
for x in range(3):
    for y in range(4):
        print("Tick")
```
A. 7 times
B. 12 times
C. 4 times
D. 3 times

**Answer:** B

---

### 2. What is the output of the following nested loop?
```python
for i in range(1, 3):
    for j in range(1, 3):
        print(f"{i}{j}", end=" ")
```
A. 11 12 21 22
B. 11 22
C. 12 12
D. 1 2 1 2

**Answer:** A

---

### 3. What happens if a `break` statement is encountered inside an inner nested loop?
A. Both the inner and outer loops terminate immediately
B. Only the inner loop terminates; the outer loop proceeds to its next iteration
C. Python restarts the outer loop from index 0
D. A `RuntimeError` is raised

**Answer:** B

---

### 4. What will happen if you accidentally use the same loop variable `i` for both outer and inner loops like `for i in range(3): for i in range(2):`?
A. Python raises a `SyntaxError: duplicate loop target`
B. The inner loop rebinds `i`, clobbering the outer loop variable and causing confusing or unexpected loop bounds
C. Python automatically renames the inner variable to `i_inner`
D. The inner loop is automatically skipped

**Answer:** B

---

### 5. What is the standard time complexity of traversing an $M \times N$ 2D matrix using nested loops?
A. $O(1)$
B. $O(M + N)$
C. $O(M \times N)$
D. $O(M^N)$

**Answer:** C

---

# Practice Challenge: PVR Cinema Hall Seat Reservation & Grid Visualizer

Build an interactive seat layout and reservation engine for a PVR Cinemas auditorium. 

The cinema hall consists of 4 rows (`"Row A"`, `"Row B"`, `"Row C"`, `"Row D"`), each containing 6 seats (numbered 1 through 6).

### Requirements:
1. Represent the auditorium seating map as a 2D matrix (list of lists) initialized with `"O"` (Open/Available).
2. Given a list of already reserved seats (e.g. `[("A", 2), ("A", 3), ("C", 4), ("D", 1)]`), use nested loops to update those seats to `"[X]"` (Booked) and available seats to `"[O]"`.
3. Print an auditorium screen diagram and seat layout grid with row headers.
4. Calculate and display overall occupancy metrics (Total Seats, Booked Count, Available Count, and Occupancy Percentage).

### Complete Solution

```python
# ==========================================================
# Challenge: PVR Cinema Hall Seat Matrix Engine
# ==========================================================

def render_cinema_hall(reserved_seats: list) -> dict:
    rows = ["A", "B", "C", "D"]
    total_cols = 6
    
    # Initialize 4x6 2D matrix with "O" (Available)
    hall_matrix = []
    for r in range(len(rows)):
        row_cells = []
        for c in range(1, total_cols + 1):
            row_cells.append("[O]")
        hall_matrix.append(row_cells)
        
    # Mark reserved seats as "[X]"
    for row_letter, col_num in reserved_seats:
        r_idx = rows.index(row_letter)
        c_idx = col_num - 1
        hall_matrix[r_idx][c_idx] = "[X]"
        
    # Render ASCII Cinema Screen Layout
    print("+" + "=" * 48 + "+")
    print(f"| {'[ SCREEN THIS WAY - PVR GOLD CLASS ]':^46} |")
    print("+" + "=" * 48 + "+\n")
    
    # Print column headers
    print("       ", end="")
    for col in range(1, total_cols + 1):
        print(f"Seat {col} ", end="")
    print("\n" + "    " + "-" * 42)
    
    booked_count = 0
    available_count = 0
    
    # Nested loops to render each row and cell
    for r_idx, row_label in enumerate(rows):
        print(f"Row {row_label} | ", end="")
        for c_idx in range(total_cols):
            cell_status = hall_matrix[r_idx][c_idx]
            if cell_status == "[X]":
                booked_count += 1
            else:
                available_count += 1
            print(f" {cell_status}  ", end="")
        print()
        
    print("    " + "-" * 42)
    
    total_capacity = booked_count + available_count
    occupancy_pct = (booked_count / total_capacity) * 100.0
    
    return {
        "capacity": total_capacity,
        "booked": booked_count,
        "available": available_count,
        "occupancy_pct": occupancy_pct
    }

# Test Dataset: Confirmed Bookings
reservations = [
    ("A", 2), ("A", 3),
    ("B", 1), ("B", 6),
    ("C", 3), ("C", 4),
    ("D", 5), ("D", 6)
]

metrics = render_cinema_hall(reservations)

print(f"\nTotal Capacity: {metrics['capacity']} Seats")
print(f"Booked Seats:   {metrics['booked']} [X]")
print(f"Available Open: {metrics['available']} [O]")
print(f"Occupancy Rate: {metrics['occupancy_pct']:.1f}%")
```

```text
Output:
+================================================+
|     [ SCREEN THIS WAY - PVR GOLD CLASS ]       |
+================================================+

       Seat 1 Seat 2 Seat 3 Seat 4 Seat 5 Seat 6 
    ------------------------------------------
Row A |  [O]    [X]    [X]    [O]    [O]    [O]  
Row B |  [X]    [O]    [O]    [O]    [O]    [X]  
Row C |  [O]    [O]    [X]    [X]    [O]    [O]  
Row D |  [O]    [O]    [O]    [O]    [X]    [X]  
    ------------------------------------------

Total Capacity: 24 Seats
Booked Seats:   8 [X]
Available Open: 16 [O]
Occupancy Rate: 33.3%
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Break, Continue, Pass** (13: Loops).

👉 **[Continue to Next Lesson: Break, Continue, Pass →](/tutorials/python-for-beginners/break-continue-pass)**
