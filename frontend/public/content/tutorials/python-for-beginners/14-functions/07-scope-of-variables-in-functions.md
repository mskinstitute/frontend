---
id: scope-of-variables-in-functions
slug: scope-of-variables-in-functions
course: python-for-beginners
chapter: 14
topic: 14.7
title: "Variable Scope in Python: The LEGB Rule, global, and nonlocal Keywords"
description: "Master Python's LEGB variable lookup hierarchy (Local, Enclosing, Global, Built-in). Understand variable shadowing, scope isolation, and modifying variables with global and nonlocal."
difficulty: Beginner
readingTime: 13
order: 76
keywords:
  - python variable scope
  - legb rule python
  - global keyword python
  - nonlocal keyword python
  - variable shadowing python
  - unboundlocalerror python
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Variable Scope in Python: The LEGB Rule, `global`, and `nonlocal` Architecture

In programming, a variable is not permanently visible across every single line of a project. Where a variable is created determines **where it can be accessed, read, or modified**, and **when it will be destroyed from memory**. This visibility boundary is known as **variable scope**.

Scope protects code from accidental side-effects: a variable named `count` inside a helper function will never accidentally overwrite a `count` variable in another part of your application. To resolve names unambiguously, Python enforces a strict lookup hierarchy known as the **LEGB Rule**.

---

## Real-World Analogy: The Bedroom Locker, Family Home, & Village Well

```
+-------------------------------------------------------------------------------+
|                      VARIABLE SCOPE REAL-WORLD ANALOGY                        |
+-------------------------------------------------------------------------------+

  1. LOCAL SCOPE (Personal Bedroom Locker):
     - Your personal wristwatch kept in your bedroom drawer.
     - Only you inside that specific room can pick it up.
     - Once you leave and lock the room, nobody outside has access.

  2. ENCLOSING SCOPE (The Joint Family Living Room):
     - The family television in the shared hall.
     - Children inside their respective bedrooms can see and hear it,
     - but people outside the house on the street cannot.

  3. GLOBAL SCOPE (Apartment Building Notice Board):
     - The society notice board posted at the main entrance gate.
     - Every resident across all flats in the building can read it.

  4. BUILT-IN SCOPE (The Law of the Land / Constitution of India):
     - Universal legal standards (like driving on the left side of the road).
     - Applies universally to everyone everywhere across all states and cities.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: The LEGB Lookup Hierarchy

Whenever Python references a variable name, it searches through four concentric scopes in strict outward order:

```
================================================================================
                    THE LEGB LOOKUP RESOLUTION ORDER
================================================================================

        +-------------------------------------------------------+
        |  B - BUILT-IN SCOPE                                   |
        |  Python built-ins: print(), len(), range(), sum()      |
        |  +-------------------------------------------------+  |
        |  |  G - GLOBAL SCOPE                               |  |
        |  |  Top-level variables defined in the module file |  |
        |  |  +-------------------------------------------+  |  |
        |  |  |  E - ENCLOSING SCOPE                      |  |  |
        |  |  |  Outer function in nested closures        |  |  |
        |  |  |  +-------------------------------------+  |  |  |
        |  |  |  |  L - LOCAL SCOPE                    |  |  |  |
        |  |  |  |  Inside currently executing def     |  |  |  |
        |  |  |  +-------------------------------------+  |  |  |
        |  |  +-------------------------------------------+  |  |
        |  +-------------------------------------------------+  |
        +-------------------------------------------------------+

  Lookup Direction:  LOCAL  -->  ENCLOSING  -->  GLOBAL  -->  BUILT-IN
                    (Outward search stops at FIRST match found!)
================================================================================
```

---

## 1. Deconstructing the LEGB Scopes

### 1. Local (L):
Variables assigned inside a function body. Created when the function is called, destroyed when the function exits.

### 2. Enclosing (E):
Applies only to **nested functions**. Variables in the outer function's scope that are accessible by an inner function.

### 3. Global (G):
Variables declared at the top-level indentation of the script/module or explicitly flagged via the `global` keyword.

### 4. Built-in (B):
Pre-loaded Python names: `print`, `len`, `int`, `str`, `ValueError`, `True`, `False`.

```python
# ==========================================================
# Example 1: Demonstrating the LEGB Hierarchy
# ==========================================================

x = "GLOBAL x"  # Global Scope

def outer_function():
    x = "ENCLOSING x"  # Enclosing Scope for inner_function
    
    def inner_function():
        x = "LOCAL x"  # Local Scope
        print("Inner says:", x)
        
    inner_function()
    print("Outer says:", x)

outer_function()
print("Module says:", x)
```

**Output:**
```text
Inner says: LOCAL x
Outer says: ENCLOSING x
Module says: GLOBAL x
```

Notice how each function resolved its own `x` locally without clobbering the outer variables. This phenomenon is called **variable shadowing**.

---

## 2. Reading Global Variables vs. Modifying Them

Functions can **read** global variables freely:

```python
APP_NAME = "MSK Student Portal"  # Global variable

def show_header():
    # Reading global variable: fully allowed!
    print("Welcome to", APP_NAME)

show_header()
```

However, if you attempt to **assign/modify** a variable inside a function, Python treats it as a brand-new **local variable** by default:

```python
current_balance = 5000.0  # Global

def attempt_deposit():
    current_balance = 7000.0  # Creates a NEW local variable 'current_balance'!
    print("Inside local:", current_balance)

attempt_deposit()
print("Global remains unchanged:", current_balance)
```

**Output:**
```text
Inside local: 7000.0
Global remains unchanged: 5000.0
```

---

## 3. The `global` Keyword: Explicit Global Mutation

If you genuinely need to modify a top-level global variable from inside a function, you must declare it using the **`global`** keyword:

```python
# ==========================================================
# Example 2: The global Keyword
# ==========================================================

central_treasury_inr = 1000000.0  # Global reserve: Rs 10 Lakhs

def disburse_relief_grant(amount: float):
    global central_treasury_inr  # Declares intention to modify module global!
    central_treasury_inr -= amount
    print(f"Disbursed Rs {amount:,.2f}. Treasury balance: Rs {central_treasury_inr:,.2f}")

disburse_relief_grant(250000.0)
print(f"Final Global Reserve: Rs {central_treasury_inr:,.2f}")
```

**Output:**
```text
Disbursed Rs 250,000.00. Treasury balance: Rs 750,000.00
Final Global Reserve: Rs 750,000.00
```

> [!CAUTION]
> **Architectural Best Practice:** Use the `global` keyword sparingly. Overusing global variables creates "hidden dependencies" where functions mutate state unpredictably, making debugging extremely difficult. In professional software, prefer passing parameters and returning updated values!

---

## 4. The `nonlocal` Keyword: Nested Closures

When a function is nested inside another function, modifying the outer function's variable requires the **`nonlocal`** keyword (introduced in Python 3):

```python
# ==========================================================
# Example 3: Nested State Counter with nonlocal
# ==========================================================

def create_token_dispenser(start_token: int = 1):
    current_token = start_token  # Enclosing variable
    
    def dispense_next():
        nonlocal current_token   # Binds to the enclosing outer variable!
        issued = current_token
        current_token += 1
        return issued
        
    return dispense_next

# Create independent token generators for SBI Bank counters
counter_1 = create_token_dispenser(start_token=101)

print("Counter 1 Token:", counter_1())
print("Counter 1 Token:", counter_1())
print("Counter 1 Token:", counter_1())
```

**Output:**
```text
Counter 1 Token: 101
Counter 1 Token: 102
Counter 1 Token: 103
```

---

## 5. The Infamous `UnboundLocalError`

A classic Python bug occurs when you read and assign to a variable in the same function without declaring `global`:

```python
counter = 10

def increment():
    # BUG: Python sees 'counter = ...' below, so it tags 'counter' as LOCAL everywhere in this function!
    # But on this line, the local 'counter' hasn't been assigned yet!
    print(counter)
    counter = counter + 1

# Calling increment() triggers:
# UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value
```

**The Fix:** Add `global counter` at the top of the function if mutation of the global variable is truly intended.

---

## 6. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** pass variables into functions as arguments and return updated values. | **DON'T** rely on `global` variables to pass data between functions. |
| **DO** use uppercase names for true global constants: `TAX_RATE = 0.18`. | **DON'T** shadow Python built-in names like `list = [1, 2]` or `str = "abc"`. |
| **DO** use `nonlocal` when creating stateful closures or factory functions. | **DON'T** confuse `nonlocal` (enclosing function) with `global` (top-level module). |

---

## Quick Revision Summary

- Python resolves variable names using the **LEGB Rule**: **Local** $\rightarrow$ **Enclosing** $\rightarrow$ **Global** $\rightarrow$ **Built-in**.
- Variables created inside a function are in the **Local** scope and cannot be seen outside.
- Global variables can be **read** freely from anywhere in the module.
- To **modify** a global variable inside a function, declare `global variable_name`.
- To **modify** an enclosing function's variable in a nested function, declare `nonlocal variable_name`.
- Never name local variables after Python built-ins like `id`, `type`, `list`, or `max`.

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

### 1. In what exact order does Python search for a variable name when evaluating an expression?
A. Global, Local, Enclosing, Built-in
B. Local, Enclosing, Global, Built-in (LEGB)
C. Built-in, Global, Enclosing, Local
D. Local, Global, Enclosing, Built-in

**Answer:** B

---

### 2. What will be printed by the following code?
```python
x = 50

def change_val():
    x = 100

change_val()
print(x)
```
A. 100
B. 50
C. None
D. UnboundLocalError

**Answer:** B

---

### 3. Which keyword is required inside a nested inner function to modify a variable defined in the immediately surrounding outer function?
A. `global`
B. `outer`
C. `nonlocal`
D. `parent`

**Answer:** C

---

### 4. What causes the error `UnboundLocalError: cannot access local variable 'x' where it is not associated with a value`?
A. Variable `x` is defined as a string instead of an integer
B. A function references `x` before its local assignment line, causing Python to treat `x` as an uninitialized local variable
C. Variable `x` exceeds system memory
D. The variable is imported from an external C library

**Answer:** B

---

### 5. Why is shadowing built-in names like `list = [10, 20]` considered dangerous in Python?
A. It causes an immediate compiler crash
B. It overwrites the built-in `list` constructor, making subsequent calls like `list("abc")` raise a `TypeError`
C. It permanently deletes the `list` class from Python's standard library on disk
D. It consumes double memory

**Answer:** B

---

# Practice Challenge: State Bank Central Vault vs. Branch Petty Cash Engine

Build a cash vault synchronization engine for a regional bank network. 

The bank manages two financial levels:
1. **Global Module Scope:** `CENTRAL_RESERVE_INR = 50000000.0` (Rs 5 Crore in RBI Master Vault).
2. **Local Scope:** Branch petty cash registers in Mumbai, Delhi, and Bengaluru branches.

Write a state-managed branch manager using nested functions and the `nonlocal` keyword:
`create_bank_branch(branch_name, initial_vault_cash)`

### Requirements:
1. Outer function holds `branch_cash` in enclosing scope.
2. Inner function `process_branch_transaction(transaction_type, amount)`:
   - Uses `nonlocal` to modify `branch_cash`.
   - If transaction is `"DEPOSIT"`, increase `branch_cash`.
   - If transaction is `"WITHDRAWAL"`, ensure branch has sufficient funds, then deduct.
   - If withdrawal exceeds `branch_cash`, request an emergency cash infusion from `CENTRAL_RESERVE_INR` using the `global` keyword!
3. Print an itemized branch audit log.

### Complete Solution

```python
# ==========================================================
# Challenge: Central Reserve vs. Branch Cash Engine
# ==========================================================

# Global Central Reserve Vault (RBI Master Account)
CENTRAL_RESERVE_INR = 50000000.0  # Rs 5 Crore

def create_bank_branch(branch_name: str, initial_cash: float):
    """Factory function demonstrating enclosing scope and nonlocal state."""
    branch_cash = initial_cash  # Enclosing variable
    
    def process_transaction(tx_type: str, amount: float) -> dict:
        nonlocal branch_cash         # Enclosing scope mutation
        global CENTRAL_RESERVE_INR   # Global scope mutation
        
        print(f"[{branch_name}] Request: {tx_type} Rs {amount:,.2f}")
        
        if tx_type == "DEPOSIT":
            branch_cash += amount
            status = "SUCCESS"
            msg = f"Deposited Rs {amount:,.2f}. Branch Cash: Rs {branch_cash:,.2f}"
            
        elif tx_type == "WITHDRAWAL":
            if amount <= branch_cash:
                branch_cash -= amount
                status = "SUCCESS"
                msg = f"Withdrawn Rs {amount:,.2f}. Branch Cash: Rs {branch_cash:,.2f}"
            else:
                # Emergency: Branch vault shortfall! Request funds from Global Central Reserve
                shortfall = amount - branch_cash
                print(f"  --> [DEFICIT] Branch short by Rs {shortfall:,.2f}. Requesting RBI Central Vault infusion...")
                
                if shortfall <= CENTRAL_RESERVE_INR:
                    CENTRAL_RESERVE_INR -= shortfall
                    branch_cash += shortfall
                    branch_cash -= amount  # Disburse to customer
                    status = "EMERGENCY_INFUSION_SUCCESS"
                    msg = f"Rs {shortfall:,.2f} infused from Central Reserve. Customer disbursed. Branch Cash: Rs {branch_cash:,.2f}"
                else:
                    status = "SYSTEM_FAILURE"
                    msg = "Central Reserve liquidity depleted."
        else:
            status = "INVALID"
            msg = "Unknown transaction type."
            
        print(f"  --> Status: {status} | {msg}")
        return {
            "branch": branch_name,
            "branch_cash": branch_cash,
            "central_reserve": CENTRAL_RESERVE_INR
        }
        
    return process_transaction

# Test Branch Invocations
print("=== RESERVE BANK & REGIONAL VAULT LIQUIDITY ENGINE ===\n")
print(f"Initial Central RBI Reserve: Rs {CENTRAL_RESERVE_INR:,.2f}\n")

# Instantiate Mumbai Nariman Point Branch with Rs 5 Lakhs initial cash
mumbai_branch = create_bank_branch("SBI Nariman Point", initial_cash=500000.0)

# Transaction 1: Customer deposits Rs 2 Lakhs
mumbai_branch("DEPOSIT", 200000.0)

# Transaction 2: Normal withdrawal within branch limits
mumbai_branch("WITHDRAWAL", 300000.0)

# Transaction 3: Massive withdrawal (Rs 8 Lakhs) exceeding remaining branch cash (Rs 4 Lakhs)
mumbai_branch("WITHDRAWAL", 800000.0)

print(f"\nFinal Central RBI Reserve: Rs {CENTRAL_RESERVE_INR:,.2f}")
```

```text
Output:
=== RESERVE BANK & REGIONAL VAULT LIQUIDITY ENGINE ===

Initial Central RBI Reserve: Rs 50,000,000.00

[SBI Nariman Point] Request: DEPOSIT Rs 200,000.00
  --> Status: SUCCESS | Deposited Rs 200,000.00. Branch Cash: Rs 700,000.00
[SBI Nariman Point] Request: WITHDRAWAL Rs 300,000.00
  --> Status: SUCCESS | Withdrawn Rs 300,000.00. Branch Cash: Rs 400,000.00
[SBI Nariman Point] Request: WITHDRAWAL Rs 800,000.00
  --> [DEFICIT] Branch short by Rs 400,000.00. Requesting RBI Central Vault infusion...
  --> Status: EMERGENCY_INFUSION_SUCCESS | Rs 400,000.00 infused from Central Reserve. Customer disbursed. Branch Cash: Rs 0.00

Final Central RBI Reserve: Rs 49,600,000.00
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Project: Calculator** (14: Functions).

👉 **[Continue to Next Lesson: Project: Calculator →](/tutorials/python-for-beginners/project-calculator)**
