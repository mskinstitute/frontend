---
id: python-comparison-operators
slug: comparison-operators
course: python-for-beginners
chapter: 6
topic: 6.3
title: Comparison Operators
description: Master Python's 6 relational comparison operators (==, !=, <, >, <=, >=), understand lexicographical string sorting, and leverage mathematical chained comparisons.
difficulty: Beginner
readingTime: 13
order: 25
keywords:
  - python comparison operators
  - relational operators
  - equality vs assignment
  - chained comparisons
  - lexicographical order
  - short circuit evaluation
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python Comparison Operators: Relational Checks & Elegant Chained Comparisons

In computer programming, **comparison operators** (also known as **relational operators**) test relationships between two operands. Every comparison in Python evaluates to a strict boolean result: either **`True`** or **`False`**.

These operators are the primary decision-makers in conditional logic (`if`, `elif`, `else`) and loop guards (`while`). Unlike languages like C, C++, or JavaScript, Python natively supports **mathematical chained comparisons** (e.g., `18 <= age < 60`), allowing you to write clean, algebraic range checks without messy logical `and` operators.

---

## Real-World Analogy: Lok Sabha Voting & The C/JS Comparison Trap

```
+-------------------------------------------------------------------------+
|                  COMPARISON OPERATORS REAL-WORLD ANALOGY                |
+-------------------------------------------------------------------------+

  1. ASSIGNMENT (=) vs EQUALITY (==):
     - Single Equals (=): Placing a voter ID inside your wallet (Action!).
       voter_id = "ABC1234567"
     - Double Equals (==): A polling booth officer scanning your ID:
       "Is the scanned voter ID equal to the electoral roll name?" (Question!)
       voter_id == registered_name -> True or False

  2. THE NOTORIOUS C / JAVASCRIPT TRAP vs PYTHON:
     - Check if age is between 18 and 60:
       Let age = 85 (Senior citizen, NOT in range!)
     - In JavaScript / C++: 18 <= age <= 60
       Step 1: (18 <= 85) evaluates to true (1).
       Step 2: 1 <= 60 evaluates to TRUE! (BUG! 85 is declared in range!)
     - In Python: 18 <= age <= 60
       Python translates this to: (18 <= age) and (age <= 60).
       Evaluates to FALSE! Exactly matches human mathematical intuition!
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Chained Comparison Evaluation Pipeline

```
===========================================================================
             HOW PYTHON EVALUATES CHAINED COMPARISONS
===========================================================================

  Expression: 10 < x <= 50

            +-------------------+
            |    Is 10 < x ?    |
            +---------+---------+
                      |
            +---------+---------+
            |                   |
         [FALSE]              [TRUE]
            |                   |
            v                   v
     Short-circuits     +-------------------+
     Returns FALSE!     |    Is x <= 50 ?   |
                        +---------+---------+
                                  |
                        +---------+---------+
                        |                   |
                     [FALSE]              [TRUE]
                        |                   |
                        v                   v
                  Returns FALSE       Returns TRUE
```

---

## 1. The 6 Built-in Comparison Operators

Python provides six standard relational operators:

```python
# ==========================================================
# Example 1: The 6 Comparison Operators
# ==========================================================

passing_marks = 40
student_marks = 78

# 1. Equal to (==)
print("Equal (==)                :", student_marks == 100)     # False

# 2. Not equal to (!=)
print("Not Equal (!=)            :", student_marks != passing_marks) # True

# 3. Greater than (>)
print("Greater than (>)          :", student_marks > 50)       # True

# 4. Less than (<)
print("Less than (<)             :", student_marks < passing_marks) # False

# 5. Greater than or equal to (>=)
print("Greater or Equal (>=)     :", student_marks >= passing_marks) # True

# 6. Less than or equal to (<=)
print("Less or Equal (<=)        :", student_marks <= 100)     # True
```

### Output:
```text
Equal (==)                : False
Not Equal (!=)            : True
Greater than (>)          : True
Less than (<)             : False
Greater or Equal (>=)     : True
Less or Equal (<=)        : True
```

---

## 2. Mathematical Chained Comparisons

Python allows you to chain multiple comparisons in a single line, exactly as in textbook mathematics:

```python
# ==========================================================
# Example 2: Elegant Chained Comparisons
# ==========================================================

# 1. Age eligibility range for competitive civil services
applicant_age = 28
is_eligible = 21 <= applicant_age <= 32
print(f"Age {applicant_age} in UPSC eligibility window (21-32): {is_eligible}")

# 2. Temperature comfort zone
ambient_temp = 24.5
is_comfortable = 20.0 <= ambient_temp <= 26.0
print(f"Temperature {ambient_temp}°C is comfortable: {is_comfortable}")

# 3. Multi-variable equality chaining
# Check if all three sides of a triangle are equal (Equilateral)
side_a, side_b, side_c = 15, 15, 15
is_equilateral = side_a == side_b == side_c
print(f"Triangle ({side_a}, {side_b}, {side_c}) is equilateral: {is_equilateral}")

# 4. Short-circuiting in chained comparisons
# In `a < b < c`, if `a < b` is False, `b < c` is NEVER evaluated!
x = 5
is_valid = 10 < x < (100 / 0)  # ZeroDivisionError is avoided because 10 < 5 is False!
print("Short-circuit avoided division by zero:", is_valid)
```

### Output:
```text
Age 28 in UPSC eligibility window (21-32): True
Temperature 24.5°C is comfortable: True
Triangle (15, 15, 15) is equilateral: True
Short-circuit avoided division by zero: False
```

---

## 3. String Lexicographical (Alphabetical) Comparisons

When comparing strings, Python evaluates character by character based on their **Unicode (ASCII) numerical code points**:
- Uppercase letters (`'A'` = 65) come **before** lowercase letters (`'a'` = 97).
- Therefore, `'Z'` < `'a'` is `True`!

```python
# ==========================================================
# Example 3: String Lexicographical Comparison
# ==========================================================

city_1 = "Agra"
city_2 = "Bengaluru"

# Alphabetical sorting check
print("Is Agra before Bengaluru?     :", city_1 < city_2)  # True

# The Uppercase vs Lowercase ASCII Trap:
# 'Z' (code 90) is numerically LESS than 'a' (code 97)
print("Is 'Zebra' < 'apple'?         :", "Zebra" < "apple") # True!

# To perform true case-insensitive alphabetical comparison:
word_a = "Zebra"
word_b = "apple"
print("Case-insensitive comparison   :", word_a.casefold() < word_b.casefold()) # False!
```

### Output:
```text
Is Agra before Bengaluru?     : True
Is 'Zebra' < 'apple'?         : True
Case-insensitive comparison   : False
```

---

## Comparison Operators Reference Table

| Operator | Meaning | Example | Result | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `==` | Equal | `5 == 5.0` | `True` | Numeric promotion converts int to float |
| `!=` | Not Equal | `10 != 20` | `True` | Inverted equality |
| `>` | Greater Than | `15 > 10` | `True` | Strict inequality |
| `<` | Less Than | `5 < 2` | `False` | Strict inequality |
| `>=` | Greater Than or Equal | `10 >= 10` | `True` | Non-strict inequality |
| `<=` | Less Than or Equal | `9 <= 10` | `True` | Non-strict inequality |

---

## Do's and Don'ts: Comparison Operators

| Scenario | Anti-Pattern (Don't) | Best Practice (Do) | Why |
| :--- | :--- | :--- | :--- |
| **Range Checks** | `if age >= 18 and age <= 60:` | `if 18 <= age <= 60:` | Chained comparison is cleaner, faster, and algebraic. |
| **Equality Check** | `if status = "ACTIVE":` | `if status == "ACTIVE":` | Single `=` is assignment and raises a `SyntaxError` inside `if`. |
| **Boolean Check** | `if is_verified == True:` | `if is_verified:` | Redundant equality check is unpythonic; booleans are evaluated directly. |
| **Float Equality** | `if float_val == 0.3:` | `if math.isclose(float_val, 0.3):` | Floating-point binary representation errors cause exact `==` checks to fail. |

---

## Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                    COMPARISON OPERATORS CHEAT SHEET                     |
+-------------------------------------------------------------------------+
  - Operators:         ==, !=, >, <, >=, <=
  - Output:            Always returns boolean True or False
  - Chaining:          18 <= age <= 60 translates to (18 <= age and age <= 60)
  - Short-Circuit:     In chained checks, evaluation stops at first False
  - String Sorting:    Compared by Unicode code points ('A' < 'a' is True)
  - Boolean Idiom:     Use 'if is_valid:' instead of 'if is_valid == True:'
+-------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Confusing Assignment (`=`) with Equality (`==`)
A single equals sign `=` assigns a value. Two equals signs `==` checks for equality:
```python
score = 100  # Assignment

# In conditions:
# ❌ INCORRECT (SyntaxError in Python 3)
# if score = 100:

# ✅ CORRECT
if score == 100:
    print("Perfect score!")
```

### 2. Chained Boolean Logic with `and` / `or`
Beginners often write `if x == 1 or 2:`, which always evaluates to True because non-zero integers are truthy!
```python
# ❌ INCORRECT (Always True because 2 is truthy!)
# if x == 1 or 2:

# ✅ CORRECT
# if x == 1 or x == 2:
# Or even cleaner:
# if x in (1, 2):
```

---

## Practice Quiz

### 1. What does the expression `10 <= 25 <= 50` evaluate to in Python?
A. `False`
B. `True`
C. `TypeError`
D. `SyntaxError`

**Answer:** B

---

### 2. Which operator should be used to test whether two values are strictly NOT equal?
A. `<>`
B. `!=`
C. `!==`
D. `not ==`

**Answer:** B

---

### 3. Why does the expression `"Zebra" < "apple"` evaluate to `True` in Python?
A. Python calculates length, and "Zebra" has fewer characters
B. Python compares characters by Unicode code points, where uppercase letters ('Z' = 90) have lower numerical values than lowercase letters ('a' = 97)
C. It is a bug in the interpreter
D. "Zebra" is alphabetically before "apple" in Dutch

**Answer:** B

---

### 4. What will happen if you mistakenly write `if x = 10:` in a Python conditional?
A. Python assigns 10 to x and evaluates the condition as True
B. Python raises a `SyntaxError: invalid syntax. Maybe you meant '==' or ':='?`
C. Python ignores the statement
D. Python crashes with a memory leak

**Answer:** B

---

### 5. What will be the output of evaluating `5 == 5.0` in Python?
A. `False` because the data types are different (int vs float)
B. `True` because Python promotes the integer to a float before checking numeric equality
C. `TypeError`
D. `None`

**Answer:** B

---

# Hands-On Practice Challenge: Indian Income Tax Slab Validator

Write a complete, runnable Python script that determines an employee's income tax bracket under the New Tax Regime (FY 2024-26) using Python's mathematical chained comparisons (`0 <= income <= 3_00_000`, etc.).

```python
# ==========================================================
# Challenge 25: Income Tax Slab & Bracket Evaluator
# MSK Institute of Technology
# ==========================================================

def evaluate_tax_bracket(annual_income_inr: float) -> None:
    print("=" * 60)
    print("      INCOME TAX DEPARTMENT: NEW TAX REGIME AUDITOR")
    print("=" * 60)
    print(f"Annual Gross Income: INR {annual_income_inr:>12,.2f}")
    print("-" * 60)

    # 1. Validate Input using comparison operators
    if annual_income_inr < 0:
        print("ERROR: Annual income cannot be negative.")
        print("=" * 60 + "\n")
        return

    # 2. Determine Tax Slab using Mathematical Chained Comparisons
    if 0 <= annual_income_inr <= 3_00_000:
        tax_rate_pct = 0.0
        slab_desc = "Nil (Up to INR 3 Lakhs)"
    elif 3_00_000 < annual_income_inr <= 7_00_000:
        tax_rate_pct = 5.0
        slab_desc = "5% (INR 3 Lakhs to 7 Lakhs)"
    elif 7_00_000 < annual_income_inr <= 10_00_000:
        tax_rate_pct = 10.0
        slab_desc = "10% (INR 7 Lakhs to 10 Lakhs)"
    elif 10_00_000 < annual_income_inr <= 12_00_000:
        tax_rate_pct = 15.0
        slab_desc = "15% (INR 10 Lakhs to 12 Lakhs)"
    elif 12_00_000 < annual_income_inr <= 15_00_000:
        tax_rate_pct = 20.0
        slab_desc = "20% (INR 12 Lakhs to 15 Lakhs)"
    else:
        tax_rate_pct = 30.0
        slab_desc = "30% (Above INR 15 Lakhs)"

    # Section 87A Rebate: Total tax rebate if income <= 7,00,000 under New Regime
    has_87a_rebate = annual_income_inr <= 7_00_000

    # 3. Print Comprehensive Assessment
    print(f"Tax Slab Category   : {slab_desc}")
    print(f"Marginal Tax Rate   : {tax_rate_pct:.1f}%")
    print(f"Sec 87A Full Rebate : {'ELIGIBLE (ZERO TAX PAYABLE)' if has_87a_rebate else 'NOT ELIGIBLE'}")
    print("=" * 60 + "\n")


# ----------------------------------------------------------
# Test Cases
# ----------------------------------------------------------
evaluate_tax_bracket(2_50_000.00)   # Exempt
evaluate_tax_bracket(6_50_000.00)   # 5% with Section 87A rebate
evaluate_tax_bracket(11_50_000.00)  # 15% slab
evaluate_tax_bracket(22_00_000.00)  # 30% top bracket
```

### Expected Program Output:
```text
============================================================
      INCOME TAX DEPARTMENT: NEW TAX REGIME AUDITOR
============================================================
Annual Gross Income: INR   250,000.00
------------------------------------------------------------
Tax Slab Category   : Nil (Up to INR 3 Lakhs)
Marginal Tax Rate   : 0.0%
Sec 87A Full Rebate : ELIGIBLE (ZERO TAX PAYABLE)
============================================================

============================================================
      INCOME TAX DEPARTMENT: NEW TAX REGIME AUDITOR
============================================================
Annual Gross Income: INR   650,000.00
------------------------------------------------------------
Tax Slab Category   : 5% (INR 3 Lakhs to 7 Lakhs)
Marginal Tax Rate   : 5.0%
Sec 87A Full Rebate : ELIGIBLE (ZERO TAX PAYABLE)
============================================================

============================================================
      INCOME TAX DEPARTMENT: NEW TAX REGIME AUDITOR
============================================================
Annual Gross Income: INR 1,150,000.00
------------------------------------------------------------
Tax Slab Category   : 15% (INR 10 Lakhs to 12 Lakhs)
Marginal Tax Rate   : 15.0%
Sec 87A Full Rebate : NOT ELIGIBLE
============================================================

============================================================
      INCOME TAX DEPARTMENT: NEW TAX REGIME AUDITOR
============================================================
Annual Gross Income: INR 2,200,000.00
------------------------------------------------------------
Tax Slab Category   : 30% (Above INR 15 Lakhs)
Marginal Tax Rate   : 30.0%
Sec 87A Full Rebate : NOT ELIGIBLE
============================================================
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Logical Operators** (6: Operators).

👉 **[Continue to Next Lesson: Logical Operators →](/tutorials/python-for-beginners/logical-operators)**
