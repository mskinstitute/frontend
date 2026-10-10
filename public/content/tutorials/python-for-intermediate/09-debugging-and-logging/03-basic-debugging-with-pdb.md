---
id: python-intermediate-basic-debugging-with-pdb
slug: basic-debugging-with-pdb
course: python-for-intermediate
chapter: "9: Debugging and Logging"
topic: "9.3 Basic Debugging with pdb"
title: "Basic Debugging with pdb in Python"
description: "Master basic debugging with pdb in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 43
keywords:
  - python basic debugging with pdb
  - python intermediate
  - python basic debugging with pdb
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Basic Debugging with pdb in Python

When complex logical bugs appear, inserting dozens of temporary `print()` statements is slow and inefficient. Python provides a powerful interactive command-line debugging tool: the **`pdb` (Python Debugger)** module. With `pdb`, you can pause execution at any point, inspect variables in memory, step through code line by line, and analyze call stacks in real time.

---

## 1. Setting Breakpoints: `breakpoint()`

Since Python 3.7, the standard way to pause execution and enter the debugger is by calling the built-in **`breakpoint()`** function:

```python
def calculate_discount(price: float, discount_percent: float) -> float:
    discount_amount = price * (discount_percent / 100)
    
    # Execution pauses here and drops into the interactive pdb prompt!
    breakpoint()
    
    final_price = price - discount_amount
    return final_price

result = calculate_discount(1500.0, 15)
print("Final:", result)
```

*(In Python 3.6 and earlier, developers wrote `import pdb; pdb.set_trace()`)*.

When Python executes `breakpoint()`, execution pauses in your terminal and renders the interactive debugger prompt:
```text
> /workspace/app.py(6)calculate_discount()
-> final_price = price - discount_amount
(Pdb) 
```

---

## 2. Essential `pdb` Navigation Commands

Once inside the `(Pdb)` prompt, you control the Python runtime using single-letter commands:

| Command | Full Name | Description |
| :---: | :--- | :--- |
| **`n`** | Next | Executes the current line and advances to the next line in the current function (does *not* step into function calls). |
| **`s`** | Step | Steps into the function being invoked on the current line. |
| **`c`** | Continue | Resumes normal execution until the next breakpoint is hit or program ends. |
| **`p <expr>`** | Print | Evaluates and prints the value of a variable or Python expression (e.g. `p discount_amount`). |
| **`pp <expr>`** | Pretty Print | Nicely formats large dictionaries or lists using the `pprint` module. |
| **`l`** | List | Displays 11 lines of source code centered around the current execution line. |
| **`w`** | Where | Prints a stack trace, showing the call path leading to the current frame. |
| **`b <line>`** | Breakpoint | Sets a new breakpoint at a specific line number (e.g. `b 24`). |
| **`q`** | Quit | Aborts the debugger and terminates the Python process immediately. |

---

## 3. Interactive Debugging Session Walkthrough

Consider a function with a subtle logical bug where discounts on high-value orders calculate incorrectly:

```python
def process_cart(items):
    subtotal = sum(i["price"] for i in items)
    if subtotal > 1000:
        rate = 0.15
    else:
        rate = 0.05
        
    breakpoint()  # Drop into debugger to inspect calculation
    discount = subtotal * rate
    return subtotal - discount
```

### Navigating the Interactive Prompt:
```text
(Pdb) l
  3         subtotal = sum(i["price"] for i in items)
  4         if subtotal > 1000:
  5             rate = 0.15
  6         else:
  7             rate = 0.05
  8  ->     breakpoint()
  9         discount = subtotal * rate
 10         return subtotal - discount

(Pdb) p subtotal
1250.0

(Pdb) p rate
0.15

(Pdb) n
> /workspace/app.py(9)process_cart()
-> discount = subtotal * rate

(Pdb) n
> /workspace/app.py(10)process_cart()
-> return subtotal - discount

(Pdb) p discount
187.5

(Pdb) c
```

---

## 4. Starting `pdb` from the Command Line

You don't need to modify your source code to use `pdb`. You can launch any Python script directly inside the debugger from your terminal:

```bash
python -m pdb script_to_debug.py
```

Execution will pause at the very first line of the file, allowing you to set breakpoints dynamically using `b <lineno>` and step through execution from the beginning.

---

## 5. Disabling Breakpoints Globally

When running tests or running in production environments, you can disable all `breakpoint()` calls across your entire application without modifying code by setting the environment variable:

```bash
# On Linux/macOS
export PYTHONBREAKPOINT=0

# On Windows PowerShell
$env:PYTHONBREAKPOINT="0"
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Leaving `breakpoint()` in Production Code
Forgetting to remove `breakpoint()` or `import pdb; pdb.set_trace()` will freeze background production servers waiting for user terminal input!

### 2. Confusing `n` (Next) and `s` (Step)
- `n` (Next): Executes the current line and advances to the next line in the current function (steps over function calls).
- `s` (Step): Steps into the function called on the current line.

---

---

## 💻 Try It Yourself: Interactive PDB Inspection Practice

### Scenario
Run a small script that sets a programmatic breakpoint using `breakpoint()`. Inspect variables `x`, `y`, and their accumulated product.

### Complete Solution
```python
def calculate_compound(principal, rate, years):
    total = principal
    for year in range(1, years + 1):
        interest = total * (rate / 100)
        total += interest
        # In interactive terminal: breakpoint()
        # Allows inspecting year, interest, and total with 'p year', 'c'
    return total

result = calculate_compound(10000, 10, 3)
print(f"Final Amount after 3 years: ₹{result:,.2f}")
```

### Expected Output
```text
Final Amount after 3 years: ₹13,310.00
```

---

## Practice Quiz

### 1. Which built-in function introduced in Python 3.7 drops execution directly into the interactive debugger?
A. `debug()`
B. `breakpoint()`
C. `inspect()`
D. `pause()`
**Answer:** B
**Explanation:** Python 3.7 introduced the built-in `breakpoint()` function, which delegates to `sys.breakpointhook()` (by default calling `pdb.set_trace()`).
---

### 2. In `pdb`, what is the difference between the `n` (next) and `s` (step) commands?
A. `n` advances by 10 lines, while `s` advances by 1 line
B. `n` executes the current line and moves to the next line in the current function, while `s` steps inside any function call on that line
C. `s` skips the line entirely
D. There is no difference
**Answer:** B
**Explanation:** `n` (next) steps over function calls in the current frame, whereas `s` (step) steps into the body of the called function.
---

### 3. Which `pdb` command prints the current value of a variable?
A. `v <name>`
B. `p <name>`
C. `show <name>`
D. `echo <name>`
**Answer:** B
**Explanation:** The `p <expr>` (print) command evaluates and displays the expression or variable in the current frame.
---

### 4. How can you resume normal program execution until the next breakpoint is hit or the program finishes?
A. Command `r`
B. Command `c`
C. Command `run`
D. Command `go`
**Answer:** B
**Explanation:** The `c` (continue) command tells `pdb` to resume continuous execution until another breakpoint is hit or the program exits.
---

### 5. How can you disable all `breakpoint()` calls across a Python environment without deleting code?
A. Set environment variable `PYTHONBREAKPOINT=0`
B. Delete the `pdb.py` file from Python installation
C. Pass `--no-break` flag to Python
D. Wrap all functions in `try/except`
**Answer:** A
**Explanation:** Setting `PYTHONBREAKPOINT=0` disables the built-in `breakpoint()` hook globally.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Assertions** (9: Debugging and Logging).

👉 **[Continue to Next Lesson: Assertions →](/tutorials/python-for-intermediate/assertions)**
