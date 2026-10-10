---
id: defining-calling-functions
slug: defining-calling-functions
course: python-for-beginners
chapter: 14
topic: 14.1
title: "Defining and Calling Functions in Python: The def Keyword & The Call Stack"
description: "Master modular programming in Python with functions. Learn the def syntax, naming rules, docstrings, execution lifecycle, and call stack mechanics."
difficulty: Beginner
readingTime: 12
order: 70
keywords:
  - python defining functions
  - def keyword python
  - calling functions python
  - call stack python
  - docstrings python pep 257
  - modular programming python
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Defining and Calling Functions in Python: The `def` Keyword & Call Stack Architecture

As software projects grow from quick scripts to large-scale systems, writing hundreds of lines of linear, repetitive code becomes unmaintainable. Duplicated code introduces bugs: fixing an algorithm in one place requires tracking down every duplicate copy across your project.

To solve this, computer science relies on **modular programming** powered by **functions**. A function is a self-contained, reusable block of code designed to perform a specific task. In Python, functions embody the **DRY (Don't Repeat Yourself)** principle: you write logic once and execute it anywhere, as often as required.

---

## Real-World Analogy: The Mixer-Grinder & Speed Post Parcel Counter

```
+-------------------------------------------------------------------------------+
|                      FUNCTION REAL-WORLD ANALOGIES                            |
+-------------------------------------------------------------------------------+

  1. THE KITCHEN MIXER-GRINDER (Sujata / Preethi Mixer):
     - Definition (`def`): An engineer designs the appliance once at the factory
       (motor windings, stainless steel jar, safety locking lid, rotational speeds).
     - Storage: The mixer sits quietly on the kitchen countertop doing nothing.
     - Invocation (Calling): When you want mint chutney, you plug it in, add fresh
       coriander and green chilies, and press the pulse switch.
     - Outcome: Fresh chutney is produced! You can call upon the mixer 100 times
       a day without having to reinvent the motor.

  2. INDIA POST SPEED POST COUNTER:
     - The postal clerk executes a standardized procedure:
       `def send_speed_post(envelope, recipient_address, weight):`
     - Affix barcode label -> Weigh parcel -> Compute postage -> Issue receipt.
     - The procedure is invariant; only the specific parcels (arguments) change.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: The Python Call Stack Lifecycle

```
================================================================================
                    FUNCTION INVOCATION & CALL STACK
================================================================================

  Python File: main.py
  Line 1: def calculate_tax(amount): ...  <-- 1. Function DEFINED in heap
  Line 5: print("Program Start")          <-- 2. Module execution begins
  Line 6: tax = calculate_tax(50000)      <-- 3. FUNCTION CALLED!
                                                 Execution jumps to Line 1
                                                 Stack frame PUSHED!

   CALL STACK (Last-In, First-Out):
   +-------------------------------------+
   | Stack Frame: calculate_tax()        |  <-- Active Execution Context
   | Local Scope: amount = 50000         |      (Computes tax = 9000.0)
   +-------------------------------------+
   | Stack Frame: __main__ (Global)      |  <-- Suspended waiting for return
   +-------------------------------------+
                      |
                      | 4. Return Value: 9000.0
                      v
   Stack frame POPPED and destroyed! Memory freed!
   Control resumes at Line 7: print("Program Finished")
================================================================================
```

---

## 1. Syntax of Function Definition: The `def` Keyword

A Python function is declared using the `def` (short for *define*) keyword:

```python
def function_name(parameter_1, parameter_2):
    """
    Docstring: Brief description of function purpose,
    parameters, and return type (PEP 257 standard).
    """
    # Indented function body (4 spaces)
    executable_statements
```

### Python Function Naming Rules (PEP 8):
1. Use **`snake_case`**: lowercase words separated by underscores (e.g., `calculate_gst_invoice`, `verify_aadhaar`).
2. Must begin with a letter or an underscore `_`, never a digit.
3. Cannot be a reserved Python keyword (e.g. `def`, `class`, `for`, `while`).
4. Choose descriptive verbs representing the action: `send_alert()`, `format_report()`.

---

## 2. Calling (Invoking) a Function

Defining a function merely registers its instructions in Python's memory; **it does not execute them**. To execute the function, you must **call** (or invoke) it using parentheses `()`:

```python
# ==========================================================
# Example 1: Defining vs. Calling
# ==========================================================

# 1. Function Definition
def greet_student(student_name: str, batch: str) -> None:
    """Prints an official welcome greeting for an enrolled student."""
    print(f"Welcome, {student_name}! You are registered in {batch} at MSK Institute.")

# Note: Nothing is printed yet!

# 2. Function Invocations
greet_student("Aarav Sharma", "Full Stack Python Batch A")
greet_student("Pooja Verma", "Data Analytics Weekend Batch")
```

**Output:**
```text
Welcome, Aarav Sharma! You are registered in Full Stack Python Batch A at MSK Institute.
Welcome, Pooja Verma! You are registered in Data Analytics Weekend Batch at MSK Institute.
```

> [!CAUTION]
> **Common Beginner Bug:** Omitting the parentheses: writing `greet_student` without `()` references the *function object itself* rather than invoking it.
> ```python
> print(greet_student)   # Output: <function greet_student at 0x7f88a0> (NOT EXECUTED!)
> greet_student("Ram")   # Calls and executes the function!
> ```

---

## 3. Function Docstrings (PEP 257)

Professional Python code includes a **docstring** (documentation string) as the very first line inside the function body, enclosed in triple quotes `"""`:

```python
# ==========================================================
# Example 2: Docstring Inspection
# ==========================================================

def calculate_simple_interest(principal: float, rate_pct: float, time_years: float) -> float:
    """
    Computes simple interest for an Indian bank fixed deposit.
    
    Parameters:
        principal (float): Initial deposited amount in INR.
        rate_pct (float): Annual interest rate percentage.
        time_years (float): Duration of deposit in years.
        
    Returns:
        float: Accrued interest amount in INR.
    """
    return (principal * rate_pct * time_years) / 100.0

# Calling the function
interest = calculate_simple_interest(100000.0, 7.5, 3.0)
print(f"Accrued Fixed Deposit Interest: Rs {interest:,.2f}")

# Introspecting the docstring programmatically via .__doc__ or help()
print("\nDocstring Documentation:")
print(calculate_simple_interest.__doc__)
```

**Output:**
```text
Accrued Fixed Deposit Interest: Rs 22,500.00

Docstring Documentation:

    Computes simple interest for an Indian bank fixed deposit.
    
    Parameters:
        principal (float): Initial deposited amount in INR.
        rate_pct (float): Annual interest rate percentage.
        time_years (float): Duration of deposit in years.
        
    Returns:
        float: Accrued interest amount in INR.
    
```

---

## 4. Functions are First-Class Objects in Python

In Python, functions are **first-class citizens**: they can be assigned to variables, passed as arguments to other functions, and stored in data structures (like lists or dictionaries):

```python
# ==========================================================
# Example 3: Function as First-Class Object
# ==========================================================

def format_inr(val: float) -> str:
    return f"Rs {val:,.2f}"

# Assign function to another variable name
currency_styler = format_inr

# Call through the new variable alias
print(currency_styler(4850000.75))
```

**Output:**
```text
Rs 4,850,000.75
```

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** adhere to single-responsibility principle: each function should do **one thing well**. | **DON'T** write "God functions" that do 10 unrelated things (e.g. read file, compute tax, format HTML, send email). |
| **DO** use expressive snake_case function names (e.g. `verify_pan_card`). | **DON'T** name functions ambiguously like `do_it()`, `temp()`, or `func1()`. |
| **DO** include triple-quoted docstrings explaining parameters and expected outputs. | **DON'T** call a function before it is defined (Python reads top-to-bottom; calling before `def` raises `NameError`). |
| **DO** use parentheses `()` to invoke functions. | **DON'T** write `func` when you mean `func()`. |

---

## Quick Revision Summary

- Functions are defined using the **`def`** keyword followed by the function name, parentheses `()`, and a colon `:`.
- Code inside a function executes **only** when the function is explicitly invoked with parentheses: `name()`.
- Python function names should follow **PEP 8 `snake_case`** conventions.
- The **docstring** (`"""..."""`) placed on the first line inside the function documents its API contract and is accessible via `help(fn)` or `fn.__doc__`.
- Each time a function is called, Python pushes a new **stack frame** onto the Call Stack to manage local variables; when execution completes, the frame is popped and cleaned up.

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Forgetting the `return` Statement
If a function computes a value but doesn't return it, Python returns `None` by default:
```python
def add(a, b):
    result = a + b
    # Missing: return result

total = add(5, 10)
print(total)  # None (not 15!)
```

### 2. Modifying Global Variables Without the `global` Keyword
Reading a global variable is permitted, but assigning to it creates a local variable unless explicitly declared:
```python
counter = 0

def increment():
    global counter  # Required to modify global scope
    counter += 1

increment()
print(counter)  # 1
```

---

## Practice Quiz

### 1. Which keyword is used to declare a function in Python?
A. `function`
B. `fun`
C. `def`
D. `method`

**Answer:** C

---

### 2. What happens if you type a function's name without parentheses (e.g. `my_function` instead of `my_function()`)?
A. The function executes with default parameters
B. Python raises an `ExecutionError`
C. It evaluates to a reference to the function object itself without executing it
D. Python executes it in background daemon mode

**Answer:** C

---

### 3. What will happen if you attempt to call a function on line 2 that is defined on line 5 of the same script?
A. Python uses hoisting to resolve it like JavaScript
B. Python raises a `NameError: name 'my_func' is not defined`
C. Python skips the call and continues
D. Python issues an `IndentationWarning`

**Answer:** B

---

### 4. What is the official standard for documenting Python functions as specified in PEP 257?
A. C-style comments `/* ... */`
B. Triple-quoted docstrings `"""..."""` placed as the first statement inside the function body
C. Semicolons followed by text
D. Inline hashtags `# doc:`

**Answer:** B

---

### 5. What data structure does the Python runtime engine use internally to track function calls, active frames, and execution order?
A. Queue (FIFO)
B. Call Stack (LIFO)
C. Binary Search Tree
D. Circular Buffer

**Answer:** B

---

# Practice Challenge: Bank ATM Transaction Terminal Router

Build a modular banking transaction management terminal for the State Bank of India (SBI). 

Instead of writing monolithic code, break the ATM interface down into clean, modular, single-responsibility functions:

1. `display_welcome_banner(branch_name)`: Renders an ASCII welcome header.
2. `check_balance(account_number, current_balance)`: Displays formatted account balance in INR.
3. `process_withdrawal(account_number, current_balance, withdrawal_amount)`: Checks if funds are sufficient. If valid, deducts amount and prints receipt; otherwise displays deficit advisory.
4. `process_deposit(account_number, current_balance, deposit_amount)`: Credits amount and prints updated ledger.
5. Create a transaction coordinator function that calls these modular procedures sequentially.

### Complete Solution

```python
# ==========================================================
# Challenge: Modular Bank ATM Transaction Engine
# ==========================================================

def display_welcome_banner(branch_name: str) -> None:
    """Displays official SBI ATM terminal banner."""
    print("+" + "=" * 54 + "+")
    print(f"| {'STATE BANK OF INDIA - 24x7 ATM NETWORK':^52} |")
    print(f"| {branch_name:^52} |")
    print("+" + "=" * 54 + "+\n")


def check_balance(account_number: str, balance: float) -> None:
    """Prints current account balance statement."""
    masked_acc = "XXXX-XXXX-" + account_number[-4:]
    print(f"[ACCOUNT STATEMENT] Account: {masked_acc}")
    print(f"  Current Available Balance: Rs {balance:,.2f}\n")


def process_withdrawal(account_number: str, balance: float, amount: float) -> float:
    """
    Validates withdrawal amount against balance.
    Returns updated balance.
    """
    print(f"[WITHDRAWAL REQUEST] Amount: Rs {amount:,.2f}")
    if amount <= 0:
        print("  --> [REJECTED] Invalid withdrawal amount specified.\n")
        return balance
    elif amount > balance:
        print(f"  --> [REJECTED] Insufficient funds. Shortfall: Rs {(amount - balance):,.2f}\n")
        return balance
    else:
        new_balance = balance - amount
        print(f"  --> [SUCCESS] Rs {amount:,.2f} dispensed from cash drawer.")
        print(f"  --> Remaining Balance: Rs {new_balance:,.2f}\n")
        return new_balance


def process_deposit(account_number: str, balance: float, amount: float) -> float:
    """
    Validates and deposits funds into account.
    Returns updated balance.
    """
    print(f"[DEPOSIT TRANSACTION] Amount: Rs {amount:,.2f}")
    if amount <= 0:
        print("  --> [REJECTED] Deposit amount must be greater than zero.\n")
        return balance
    else:
        new_balance = balance + amount
        print(f"  --> [SUCCESS] Rs {amount:,.2f} accepted by automated cash acceptor.")
        print(f"  --> Updated Balance: Rs {new_balance:,.2f}\n")
        return new_balance


# ATM Execution Simulation
display_welcome_banner("Connaught Place Branch, New Delhi")

user_acc = "10489920194"
account_balance = 25000.0

# 1. Check Initial Balance
check_balance(user_acc, account_balance)

# 2. Attempt Overdraft Withdrawal
account_balance = process_withdrawal(user_acc, account_balance, 30000.0)

# 3. Successful Withdrawal
account_balance = process_withdrawal(user_acc, account_balance, 8000.0)

# 4. Deposit Funds
account_balance = process_deposit(user_acc, account_balance, 15000.0)

# 5. Final Balance Enquiry
check_balance(user_acc, account_balance)
```

```text
Output:
+======================================================+
|        STATE BANK OF INDIA - 24x7 ATM NETWORK        |
|          Connaught Place Branch, New Delhi           |
+======================================================+

[ACCOUNT STATEMENT] Account: XXXX-XXXX-0194
  Current Available Balance: Rs 25,000.00

[WITHDRAWAL REQUEST] Amount: Rs 30,000.00
  --> [REJECTED] Insufficient funds. Shortfall: Rs 5,000.00

[WITHDRAWAL REQUEST] Amount: Rs 8,000.00
  --> [SUCCESS] Rs 8,000.00 dispensed from cash drawer.
  --> Remaining Balance: Rs 17,000.00

[DEPOSIT TRANSACTION] Amount: Rs 15,000.00
  --> [SUCCESS] Rs 15,000.00 accepted by automated cash acceptor.
  --> Updated Balance: Rs 32,000.00

[ACCOUNT STATEMENT] Account: XXXX-XXXX-0194
  Current Available Balance: Rs 32,000.00
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Arguments: Positional, Keyword** (14: Functions).

👉 **[Continue to Next Lesson: Arguments: Positional, Keyword →](/tutorials/python-for-beginners/arguments-positional-keyword)**
