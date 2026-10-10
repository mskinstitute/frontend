---
id: if-elif-else
slug: if-elif-else
course: python-for-beginners
chapter: 12
topic: 12.1
title: Conditional Statements (if, elif, else)
description: Master decision-making control flow in Python using if, elif, and else statements. Understand indentation blocks, short-circuit evaluation, and truthiness branching.
difficulty: Beginner
readingTime: 13
order: 56
keywords:
  - python if elif else
  - conditional statements
  - control flow python
  - python indentation blocks
  - decision making python
  - short circuit branch
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Conditional Statements in Python: `if`, `elif`, `else` & Indentation Architecture

Programs do not simply run in a straight linear sequence from line 1 to line 100. Real-world applications make decisions: if an ATM withdrawal amount exceeds the account balance, reject the transaction; if a user enters valid credentials, grant dashboard access; otherwise, prompt for multi-factor authentication.

In Python, decision-making is implemented through **conditional statements**: `if`, `elif` (short for *else if*), and `else`. Instead of using curly braces `{}` or keywords like `then`/`endif`, Python uses **indentation (4 spaces)** to define code blocks, producing clean and human-readable branching logic.

---

## Real-World Analogy: The Railway Track Shunting Junction & Traffic Signal

```
+-------------------------------------------------------------------------+
|                  CONTROL FLOW REAL-WORLD ANALOGY                        |
+-------------------------------------------------------------------------+

  1. THE RAILWAY SHUNTING SWITCH (Mughalsarai / DDU Junction):
     - An express train approaches a multi-track railway junction.
     - Track switch lever checks condition:
       * If Platform 1 is clear? -> Divert train to Platform 1.
       * Elif Platform 2 is clear? -> Divert train to Platform 2.
       * Else -> Divert train to holding siding loop.
     - Crucial Rule: The train can only take ONE track! Once Platform 1
       lever engages, all other levers are ignored.

  2. THE TRAFFIC SIGNAL CONTROLLER:
     - Traffic light color checks:
       * If light is "RED"    -> Apply emergency brakes.
       * Elif light is "AMBER" -> Decelerate and prepare to stop.
       * Else (GREEN)         -> Accelerate safely through junction.
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Control Flow Decision Diamonds

```
===========================================================================
             IF-ELIF-ELSE CONDITIONAL CONTROL FLOWCHART
===========================================================================

                          [ Program Start ]
                                  |
                                  v
                       /---------------------\
                      <  Condition 1: (if)    >
                       \---------------------/
                              /        \
                    True     /          \  False
                            v            v
                    [ Block 1 Code ]   /---------------------\
                            |         <  Condition 2: (elif)  >
                            |          \---------------------/
                            |                 /        \
                            |       True     /          \  False
                            |               v            v
                            |       [ Block 2 Code ]   [ Else Block ]
                            |               |                |
                            +---------------+----------------+
                                            |
                                            v
                                   [ Continue Program ]
```

---

## 1. The Basic `if` Statement & Python Indentation

In Python, an `if` statement evaluates an expression. If the expression evaluates to `True`, the indented block underneath executes:

```python
# ==========================================================
# Example 1: Basic if Statement & Indentation
# ==========================================================

battery_level = 15

print(f"Current Battery: {battery_level}%")

# The condition: battery_level < 20 evaluates to True
if battery_level < 20:
    print("  [ALERT] Low battery warning!")
    print("  [ACTION] Enabling Ultra Battery Saver mode.")

# Unindented code runs unconditionally:
print("System monitoring active.")
```

```text
Output:
Current Battery: 15%
  [ALERT] Low battery warning!
  [ACTION] Enabling Ultra Battery Saver mode.
System monitoring active.
```

---

## 2. Dual-Branch Decision Making: `if-else`

When an action must be taken both when the condition is met and when it fails, pair `if` with `else`:

```python
# ==========================================================
# Example 2: Dual Branching with if-else
# ==========================================================

bank_balance = 4500.0
withdrawal_amount = 5000.0

if bank_balance >= withdrawal_amount:
    bank_balance -= withdrawal_amount
    print(f"Withdrawal of Rs {withdrawal_amount:,.2f} successful! Remaining: Rs {bank_balance:,.2f}")
else:
    deficit = withdrawal_amount - bank_balance
    print(f"Transaction Declined! Insufficient funds (Short by Rs {deficit:,.2f}).")
```

```text
Output:
Transaction Declined! Insufficient funds (Short by Rs 500.00).
```

---

## 3. Multi-Way Branching: The `if-elif-else` Ladder

When classifying data across multiple thresholds, use `elif`. Python tests conditions from top to bottom and executes **only the first branch whose condition evaluates to `True`** (short-circuit branching):

```python
# ==========================================================
# Example 3: Academic Percentage Grading Ladder
# ==========================================================

score = 82.5

if score >= 90:
    grade = "O (Outstanding)"
elif score >= 80:
    grade = "A+ (Excellent)"
elif score >= 70:
    grade = "B+ (Good)"
elif score >= 60:
    grade = "C (Pass)"
elif score >= 35:
    grade = "D (Marginal Pass)"
else:
    grade = "F (Fail)"

print(f"Score: {score}% | Conferred Grade: {grade}")
```

```text
Output:
Score: 82.5% | Conferred Grade: A+ (Excellent)
```

---

## 4. Truthiness in Conditional Branches

Python does not require explicit comparison operators (`== True`). Any object can be evaluated directly for its inherent **truthiness**:

```python
# ==========================================================
# Example 4: Direct Truthiness Evaluation
# ==========================================================

# Empty strings, lists, sets, dicts, 0, and None are FALSY
shopping_cart = []
username = "rahul_verma"

if shopping_cart:
    print(f"Checkout available with {len(shopping_cart)} items.")
else:
    print("Your shopping cart is empty! Add items to proceed.")

if username:
    print(f"Welcome back, {username}!")
```

```text
Output:
Your shopping cart is empty! Add items to proceed.
Welcome back, rahul_verma!
```

---

## Do's and Don'ts: Conditional Logic

| Scenario | ❌ Anti-Pattern | ✅ Pythonic Idiom |
| :--- | :--- | :--- |
| **Boolean Comparison** | `if is_admin == True:` | `if is_admin:` |
| **Empty Check** | `if len(items) > 0:` | `if items:` |
| **Check for None** | `if result == None:` | `if result is None:` |
| **Order in elif** | Broad conditions before specific conditions | Specific conditions before broad conditions |
| **Mixed Indentation** | Mixing Tab characters with spaces | Strictly use 4 spaces per indentation level |

---

## Quick Revision Summary Cheat Sheet

```
+---------------------------------------------------------------------------+
|                     PYTHON IF-ELIF-ELSE CHEAT SHEET                       |
+---------------------------------------------------------------------------+
|  Statement           | Meaning / Behavior                                 |
|----------------------+----------------------------------------------------|
|  if condition:       | Executes indented block if condition is True       |
|  elif condition:     | Evaluated ONLY if preceding if/elif were False     |
|  else:               | Fallback block if ALL preceding tests were False   |
|  Indentation Rule    | Standard 4 spaces; defines code block boundaries   |
|  First-Match Wins    | Once any branch executes, remaining elifs skipped  |
|  Falsy Values        | False, None, 0, 0.0, "", [], (), {}, set()         |
+---------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Inconsistent Indentation
Python requires consistent indentation (recommended: 4 spaces). Mixing tabs and spaces raises an `IndentationError`:
```python
# ❌ Inconsistent indentation
if True:
    print("Line 1 with spaces")
	print("Line 2 with tab")  # IndentationError!
```

### 2. Forgetting the Trailing Colon (`:`)
Every `if`, `elif`, and `else` statement must end with a colon:
```python
# ❌ SyntaxError: expected ':'
# if age >= 18

# ✅ CORRECT
if age >= 18:
    print("Eligible to vote")
```

---

## Practice Quiz

### 1. What determines code block boundaries in Python conditional statements?
A. Curly braces `{}`
B. Semicolons `;`
C. Consistent indentation (typically 4 spaces)
D. `then` and `endif` keywords

**Answer:** C

---

### 2. What is the output of the following code?
```python
x = 15
if x > 20:
    print("Apple")
elif x > 10:
    print("Banana")
elif x > 5:
    print("Cherry")
else:
    print("Date")
```
A. Banana and Cherry
B. Banana
C. Cherry
D. Date

**Answer:** B

---

### 3. Which of the following expressions is considered Truthy in Python?
A. `[]` (empty list)
B. `0` (integer zero)
C. `"0"` (string containing digit zero)
D. `None`

**Answer:** C

---

### 4. What happens if none of the conditions in an `if-elif` chain are met and there is NO `else` clause?
A. Python raises a `RuntimeError`
B. Python throws a `SyntaxError`
C. Nothing inside the conditional executes; program continues past it
D. Python executes the first `elif` block by default

**Answer:** C

---

### 5. What is the most Pythonic way to test if a variable `items` is not empty?
A. `if len(items) != 0:`
B. `if items == True:`
C. `if items:`
D. `if bool(items) == True:`

**Answer:** C

---

## Hands-On Practice Challenge: Indian Railways Ticket Fare & Concession Calculator

Design an automated ticket fare calculation engine for an Indian Railways journey. The base fare from New Delhi to Varanasi in 3AC is Rs 1,150. Implement age and status concession logic: children under 5 travel free (100% discount), senior citizens aged 60+ receive a 40% senior concession, bonafide students with valid ID receive a 25% discount, and passengers with medical disability concessions receive 50% off. Apply the highest single eligible concession.

### Starter Script & Complete Solution

```python
# ==========================================================
# Challenge: IRCTC Ticket Fare & Concession Calculator
# ==========================================================

BASE_FARE_INR = 1150.0

def calculate_train_fare(passenger_name: str, age: int, is_student: bool, has_disability: bool) -> dict:
    discount_pct = 0
    category = "General Adult"
    
    # Evaluate concessions in strict hierarchical order:
    if age < 5:
        discount_pct = 100
        category = "Infant (Free Travel)"
    elif has_disability:
        discount_pct = 50
        category = "Divyangjan Medical Concession (50%)"
    elif age >= 60:
        discount_pct = 40
        category = "Senior Citizen Concession (40%)"
    elif is_student:
        discount_pct = 25
        category = "Student Educational Concession (25%)"
    else:
        discount_pct = 0
        category = "Standard Full Fare"
        
    discount_amount = (BASE_FARE_INR * discount_pct) / 100
    final_fare = BASE_FARE_INR - discount_amount
    
    return {
        "passenger": passenger_name,
        "age": age,
        "category": category,
        "base_fare": BASE_FARE_INR,
        "discount_applied": discount_amount,
        "final_fare": final_fare
    }

# Test Multiple Passenger Profiles
passengers = [
    ("Master Aarav (Child)", 3, False, False),
    ("Col. V. K. Sharma (Retd.)", 68, False, False),
    ("Riya Sen (University Student)", 21, True, False),
    ("Deepak Verma (Wheelchair Access)", 34, False, True),
    ("Sanjay Gupta (Business Traveler)", 42, False, False)
]

print("=== IRCTC TICKET RESERVATION & FARE ENGINE ===")
print(f"Base Ticket Fare (NDLS -> BSB 3AC): Rs {BASE_FARE_INR:.2f}\n")

for name, age, student, disability in passengers:
    ticket = calculate_train_fare(name, age, student, disability)
    print(f"Passenger: {ticket['passenger']:<35} (Age: {ticket['age']})")
    print(f"  Category:     {ticket['category']}")
    print(f"  Discount:     Rs {ticket['discount_applied']:>6.2f}")
    print(f"  Final Amount: Rs {ticket['final_fare']:>6.2f}\n")
```

```text
Output:
=== IRCTC TICKET RESERVATION & FARE ENGINE ===
Base Ticket Fare (NDLS -> BSB 3AC): Rs 1150.00

Passenger: Master Aarav (Child)                (Age: 3)
  Category:     Infant (Free Travel)
  Discount:     Rs 1150.00
  Final Amount: Rs   0.00

Passenger: Col. V. K. Sharma (Retd.)           (Age: 68)
  Category:     Senior Citizen Concession (40%)
  Discount:     Rs 460.00
  Final Amount: Rs 690.00

Passenger: Riya Sen (University Student)       (Age: 21)
  Category:     Student Educational Concession (25%)
  Discount:     Rs 287.50
  Final Amount: Rs 862.50

Passenger: Deepak Verma (Wheelchair Access)    (Age: 34)
  Category:     Divyangjan Medical Concession (50%)
  Discount:     Rs 575.00
  Final Amount: Rs 575.00

Passenger: Sanjay Gupta (Business Traveler)    (Age: 42)
  Category:     Standard Full Fare
  Discount:     Rs   0.00
  Final Amount: Rs 1150.00
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Nested Conditions** (12: Conditional Statements).

👉 **[Continue to Next Lesson: Nested Conditions →](/tutorials/python-for-beginners/nested-conditions)**
