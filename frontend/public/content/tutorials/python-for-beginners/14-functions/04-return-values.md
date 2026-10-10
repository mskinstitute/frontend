---
id: return-values
slug: return-values
course: python-for-beginners
chapter: 14
topic: 14.4
title: "Function Return Values in Python: The return Statement, Multiple Values, & None"
description: "Master passing data out of Python functions with return. Understand return termination mechanics, returning multiple values via tuple packing, early exits, and the implicit None return."
difficulty: Beginner
readingTime: 12
order: 73
keywords:
  - python return statement
  - return multiple values python
  - python implicit none return
  - print vs return python
  - early return guard clauses
  - tuple return unpacking
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Function Return Values in Python: The `return` Statement, Multiple Returns, & `None`

Parameters allow you to send data *into* a function. The **`return` statement** is the mechanism that sends computation results *back out* to the caller. 

Executing `return` accomplishes two simultaneous actions:
1. **Value Egress:** It transfers an evaluated object back to the invocation site so it can be assigned to a variable, passed to another function, or used in an expression.
2. **Immediate Termination:** It halts the execution of the function instantly, destroying the current stack frame and returning control to the caller.

---

## Real-World Analogy: The ATM Cash Slot & Pathological Lab Report

```
+-------------------------------------------------------------------------------+
|                     RETURN VALUE REAL-WORLD ANALOGIES                         |
+-------------------------------------------------------------------------------+

  1. THE STATE BANK ATM CASH DISPENSER:
     - You insert your debit card and type PIN and amount: Rs 10,000.
     - The ATM processes the transaction internally.
     - Cash slot mechanical door opens and yields crisp rupee notes:
       `return [Note500, Note500, ...]`
     - If the ATM merely displayed "Success" on the screen without ejecting cash
       (like `print()` without `return`), you would leave empty-handed!
     - The physical cash handed to you is the **Return Value**.

  2. DR. LAL PATHLABS DIAGNOSTIC BLOOD TEST:
     - You submit a blood vial sample (argument).
     - The analyzer runs biochemical diagnostics.
     - The laboratory issues an official health report containing three metrics:
       `return hemoglobin, blood_sugar, platelet_count`
     - A single diagnostic procedure returns **multiple values** packaged together.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: `print()` vs. `return`

A pervasive beginner misconception is confusing `print()` with `return`:

```
================================================================================
                    PRINT() VS. RETURN STATEMENT
================================================================================

  CASE 1: PRINT() (SIDE EFFECT ONLY)
  def compute_tax(salary):
      print(salary * 0.10)        <-- Dumps text onto console screen
                                  <-- Implicitly returns None!

  result = compute_tax(50000)
  print(result)                   <-- Prints: None! You cannot do math with None!


  CASE 2: RETURN (DATA PRODUCTION)
  def compute_tax(salary):
      return salary * 0.10        <-- Hands actual float 5000.0 back to caller

  tax_val = compute_tax(50000)
  final_due = tax_val + 500       <-- Fully usable in subsequent expressions!
================================================================================
```

---

## 1. Syntax & Mechanics of `return`

The syntax of a return statement is:

```python
def function_name():
    # ... logic ...
    return <expression>
```

When Python reaches `return`, `<expression>` is evaluated and returned immediately. Any code written after an unconditional `return` is **unreachable dead code**:

```python
# ==========================================================
# Example 1: Immediate Termination & Dead Code
# ==========================================================

def calculate_square(n: int) -> int:
    return n * n
    # DEAD CODE WARNING: This line will NEVER execute!
    print("This line is completely unreachable.")

result = calculate_square(6)
print(f"Square of 6: {result}")
```

**Output:**
```text
Square of 6: 36
```

---

## 2. Returning Multiple Values via Automatic Tuple Packing

Many programming languages (such as Java or C) restrict functions to returning only a single value. Python allows returning **multiple values** separated by commas:

```python
# ==========================================================
# Example 2: Returning Multiple Values
# ==========================================================

def analyze_student_marks(marks_list: list):
    """Returns minimum, maximum, and average marks."""
    lowest = min(marks_list)
    highest = max(marks_list)
    average = sum(marks_list) / len(marks_list)
    
    # Comma-separated return automatically packs values into a tuple!
    return lowest, highest, average

scores = [88, 92, 74, 96, 81]

# 1. Unpacking the returned tuple into separate variables:
low, high, avg = analyze_student_marks(scores)

print(f"Lowest Score:  {low}")
print(f"Highest Score: {high}")
print(f"Batch Average: {avg:.2f}")

# 2. Capturing as a single tuple:
stats_tuple = analyze_student_marks(scores)
print(f"Raw Tuple:     {stats_tuple} (Type: {type(stats_tuple).__name__})")
```

**Output:**
```text
Lowest Score:  74
Highest Score: 96
Batch Average: 86.20
Raw Tuple:     (74, 96, 86.2) (Type: tuple)
```

Under the hood, Python packs comma-separated return items into an immutable `tuple`.

---

## 3. The Implicit `None` Return

Every Python function returns a value. If you do not include an explicit `return` statement, or write a bare `return` with no argument, Python **implicitly returns `None`**:

```python
# ==========================================================
# Example 3: Implicit vs. Explicit None
# ==========================================================

def log_event(event_message: str):
    print(f"[AUDIT LOG] {event_message}")
    # No return statement here!

res = log_event("User logged in from IP 49.207.54.18")
print(f"Return Value: {res} (Is None? {res is None})")
```

**Output:**
```text
[AUDIT LOG] User logged in from IP 49.207.54.18
Return Value: None (Is None? True)
```

---

## 4. Early Exits with Guard Clauses

The `return` statement is widely used as a **guard clause** to handle invalid inputs or boundary conditions upfront without nesting code inside deep `else` blocks:

```python
# ==========================================================
# Example 4: Early Return Guard Clauses
# ==========================================================

def verify_bank_kyc(user_record: dict) -> tuple:
    # Guard 1: Missing Record
    if not user_record:
        return False, "User record is empty or None."
        
    # Guard 2: Aadhaar verification
    if not user_record.get("aadhaar_verified", False):
        return False, "Aadhaar authentication pending."
        
    # Guard 3: Age eligibility
    if user_record.get("age", 0) < 18:
        return False, "Account holder must be at least 18 years old."
        
    # Happy Path
    return True, "KYC verified. Account unlocked."

# Test with invalid user:
is_ok, msg = verify_bank_kyc({"name": "Rahul", "aadhaar_verified": False, "age": 22})
print(f"Verification: {is_ok} | Advisory: {msg}")

# Test with valid user:
is_ok, msg = verify_bank_kyc({"name": "Priya", "aadhaar_verified": True, "age": 24})
print(f"Verification: {is_ok} | Advisory: {msg}")
```

**Output:**
```text
Verification: False | Advisory: Aadhaar authentication pending.
Verification: True | Advisory: KYC verified. Account unlocked.
```

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use `return` to send data back to the calling code for further processing. | **DON'T** confuse `print()` with `return`; `print()` outputs text to the console but returns `None`. |
| **DO** unpack returned tuples directly into descriptive variable names: `min_val, max_val = get_bounds()`. | **DON'T** return 6+ comma-separated values; return a `dict` or `dataclass` for readability. |
| **DO** use early `return` statements (guard clauses) to exit functions as soon as an error is detected. | **DON'T** write code beneath an unconditional `return` statement, as it will never execute (dead code). |

---

## Quick Revision Summary

- The **`return` statement** exits a function and hands a value back to the caller.
- Functions without an explicit `return` return **`None`** by default.
- Returning comma-separated expressions (`return a, b, c`) packages them into an immutable **tuple**.
- Callers can unpack multiple return values directly: `x, y, z = get_metrics()`.
- Use **early returns** to reject invalid inputs quickly and keep core logic flat and readable.
- `print()` displays text on the screen; `return` provides usable data to your program.

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

### 1. What is the return value of a Python function that does not contain a `return` statement?
A. `0`
B. `False`
C. `None`
D. An empty string `""`

**Answer:** C

---

### 2. What data type is returned by the statement `return 10, 20, 30`?
A. `list`
B. `tuple`
C. `dict`
D. `set`

**Answer:** B

---

### 3. What will be printed by the following code?
```python
def multiply(a, b):
    print(a * b)

result = multiply(4, 5)
print(result)
```
A. 20 \n None
B. 20 \n 20
C. 20
D. None \n None

**Answer:** A

---

### 4. What happens to lines of code placed inside a function directly below an unconditional `return` statement?
A. Python executes them during garbage collection
B. They are ignored and will never execute (dead code)
C. Python throws a `SyntaxError: unreachable code`
D. They execute in reverse order

**Answer:** B

---

### 5. How can a caller unpack multiple return values from a function `def get_user(): return "Aarav", 25, "Delhi"`?
A. `user = get_user()[all]`
B. `name, age, city = get_user()`
C. `name & age & city = get_user()`
D. `[name, age, city] -> get_user()`

**Answer:** B

---

# Practice Challenge: Corporate Salary Slip & Payroll Deduction Engine

Build an automated salary slip calculation engine for an Indian technology corporation (Infosys / TCS).

Create a function:
`calculate_salary_breakdown(employee_id, employee_name, basic_salary_inr, bonus_inr=0.0)`

### Requirements:
1. **Salary Components:**
   - **House Rent Allowance (HRA):** 40% of basic salary.
   - **Dearness Allowance (DA):** 20% of basic salary.
   - **Gross Salary:** $\text{Basic} + \text{HRA} + \text{DA} + \text{Bonus}$.
2. **Statutory Deductions:**
   - **Provident Fund (PF):** 12% of basic salary.
   - **Professional Tax (PT):** Flat Rs 200.00.
   - **Income Tax (TDS):** If Gross Salary $> 1,00,000$, deduct 10% of Gross; else 5%.
   - **Total Deductions:** $\text{PF} + \text{PT} + \text{TDS}$.
3. **Net Take-Home Salary:** $\text{Gross Salary} - \text{Total Deductions}$.
4. Return a structured dictionary containing all computed components (`gross_salary`, `total_deductions`, `net_salary`, and `itemized_deductions`).
5. Print a corporate salary payslip.

### Complete Solution

```python
# ==========================================================
# Challenge: Corporate Salary Slip & Payroll Engine
# ==========================================================

def calculate_salary_breakdown(
    employee_id: str,
    employee_name: str,
    basic_salary_inr: float,
    bonus_inr: float = 0.0
) -> dict:
    """Computes statutory payroll deductions and net take-home salary."""
    
    # 1. Earnings Components
    hra = basic_salary_inr * 0.40
    da = basic_salary_inr * 0.20
    gross_salary = basic_salary_inr + hra + da + bonus_inr
    
    # 2. Statutory Deductions
    pf_deduction = basic_salary_inr * 0.12
    professional_tax = 200.0
    
    # TDS slab based on gross earnings
    tds_rate = 0.10 if gross_salary > 100000.0 else 0.05
    tds_deduction = gross_salary * tds_rate
    
    total_deductions = pf_deduction + professional_tax + tds_deduction
    net_in_hand = gross_salary - total_deductions
    
    # Return structured payroll ledger
    return {
        "emp_id": employee_id,
        "name": employee_name,
        "basic": basic_salary_inr,
        "hra": hra,
        "da": da,
        "bonus": bonus_inr,
        "gross_salary": gross_salary,
        "pf": pf_deduction,
        "pt": professional_tax,
        "tds": tds_deduction,
        "total_deductions": total_deductions,
        "net_salary": net_in_hand
    }

def print_payslip(slip: dict) -> None:
    """Renders formatted ASCII corporate payslip."""
    print("+" + "=" * 58 + "+")
    print(f"| {'INFOSYS TECHNOLOGIES - MONTHLY SALARY PAYSLIP':^56} |")
    print("+" + "=" * 58 + "+")
    print(f"  Employee ID: {slip['emp_id']:<18} Name: {slip['name']}")
    print("-" * 58)
    print(f"  {'EARNINGS (INR)':<30} {'DEDUCTIONS (INR)':<26}")
    print("-" * 58)
    print(f"  Basic Salary:  Rs {slip['basic']:>9.2f}    Provident Fund: Rs {slip['pf']:>8.2f}")
    print(f"  HRA (40%):     Rs {slip['hra']:>9.2f}    Prof. Tax (PT): Rs {slip['pt']:>8.2f}")
    print(f"  DA (20%):      Rs {slip['da']:>9.2f}    Income Tax TDS: Rs {slip['tds']:>8.2f}")
    print(f"  Perf Bonus:    Rs {slip['bonus']:>9.2f}")
    print("-" * 58)
    print(f"  Gross Salary:  Rs {slip['gross_salary']:>9.2f}    Total Deduct:   Rs {slip['total_deductions']:>8.2f}")
    print("=" * 58)
    print(f"  NET IN-HAND TAKE HOME SALARY:   Rs {slip['net_salary']:>10.2f}")
    print("+" + "=" * 58 + "+\n")

# Process Payroll for Software Engineer
emp_record = calculate_salary_breakdown(
    employee_id="INFY-2026-88",
    employee_name="Divyanshu Saxena",
    basic_salary_inr=65000.0,
    bonus_inr=15000.0
)

print_payslip(emp_record)
```

```text
Output:
+==========================================================+
|      INFOSYS TECHNOLOGIES - MONTHLY SALARY PAYSLIP       |
+==========================================================+
  Employee ID: INFY-2026-88       Name: Divyanshu Saxena
----------------------------------------------------------
  EARNINGS (INR)                 DEDUCTIONS (INR)          
----------------------------------------------------------
  Basic Salary:  Rs  65000.00    Provident Fund: Rs  7800.00
  HRA (40%):     Rs  26000.00    Prof. Tax (PT): Rs   200.00
  DA (20%):      Rs  13000.00    Income Tax TDS: Rs 11900.00
  Perf Bonus:    Rs  15000.00
----------------------------------------------------------
  Gross Salary:  Rs 119000.00    Total Deduct:   Rs 19900.00
==========================================================
  NET IN-HAND TAKE HOME SALARY:   Rs   99100.00
+==========================================================+
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Lambda Functions** (14: Functions).

👉 **[Continue to Next Lesson: Lambda Functions →](/tutorials/python-for-beginners/lambda-functions)**
