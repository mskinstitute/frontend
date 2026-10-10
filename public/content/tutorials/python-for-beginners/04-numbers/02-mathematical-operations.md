---
id: python-mathematical-operations
slug: mathematical-operations
course: python-for-beginners
chapter: 4
topic: 4.2
title: Mathematical Operations
description: Master Python's 7 arithmetic operators, understand the critical difference between true division and floor division, navigate negative modulo quirks, and master PEMDAS precedence.
difficulty: Beginner
readingTime: 13
order: 15
keywords:
  - python math operations
  - arithmetic operators
  - floor division
  - modulo operator
  - pemdas bodmas
  - divmod
  - operator precedence
l lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# 🧮 Python Mathematical Operations

Python can be used as a powerful calculator.

You can use Python to:

* Add numbers
* Subtract numbers
* Multiply numbers
* Divide numbers
* Find remainders
* Calculate powers
* Solve formulas
* Work with percentages
* Calculate loan EMIs
* Build scientific and engineering programs

Python provides **seven basic arithmetic operators**:

| Operator | Name           | Example   | Result |
| -------- | -------------- | --------- | -----: |
| `+`      | Addition       | `10 + 5`  |   `15` |
| `-`      | Subtraction    | `10 - 5`  |    `5` |
| `*`      | Multiplication | `10 * 5`  |   `50` |
| `/`      | True Division  | `10 / 5`  |  `2.0` |
| `//`     | Floor Division | `10 // 3` |    `3` |
| `%`      | Modulo         | `10 % 3`  |    `1` |
| `**`     | Exponentiation | `2 ** 3`  |    `8` |

Let's understand each operator step by step.

---

# 🍬 Real-Life Example: Sharing 23 Laddus

Imagine you have **23 laddus** and want to distribute them equally into **4 boxes**.

There are three useful operations here:

### 1. True Division `/`

```python
23 / 4
```

Result:

```text
5.75
```

This tells us the exact mathematical result.

---

### 2. Floor Division `//`

```python
23 // 4
```

Result:

```text
5
```

This tells us how many **complete groups** of 4 can be made.

---

### 3. Modulo `%`

```python
23 % 4
```

Result:

```text
3
```

This tells us that **3 laddus remain** after making four groups of 5.

So:

```text
23 = (4 × 5) + 3
```

### Remember

```text
/   → Exact division result
//  → Whole-number quotient after flooring
%   → Remainder
```

---

# 1. Addition (`+`)

The `+` operator adds two or more numbers.

```python
a = 17
b = 5

result = a + b

print(result)
```

Output:

```text
22
```

Another example:

```python
price = 500
delivery = 50

total = price + delivery

print(total)
```

Output:

```text
550
```

---

# 2. Subtraction (`-`)

The `-` operator subtracts one number from another.

```python
a = 17
b = 5

result = a - b

print(result)
```

Output:

```text
12
```

Real-life example:

```python
wallet = 1000
spent = 350

remaining = wallet - spent

print(remaining)
```

Output:

```text
650
```

---

# 3. Multiplication (`*`)

The `*` operator multiplies numbers.

```python
price = 250
quantity = 4

total = price * quantity

print(total)
```

Output:

```text
1000
```

This is useful for:

* Shopping calculations
* Salary calculations
* Area calculations
* Quantity × price
* Mathematical formulas

---

# 4. True Division (`/`)

The `/` operator performs normal division.

```python
result = 17 / 5

print(result)
```

Output:

```text
3.4
```

An important Python rule:

> The `/` operator returns a `float`.

Even when the division is exact:

```python
result = 8 / 4

print(result)
print(type(result))
```

Output:

```text
2.0
<class 'float'>
```

Notice that the result is `2.0`, not `2`.

---

# 5. Floor Division (`//`)

The `//` operator performs **floor division**.

Example:

```python
result = 17 // 5

print(result)
```

Output:

```text
3
```

Why?

Because:

```text
17 / 5 = 3.4
```

Floor division moves down to the next whole-number value:

```text
3.4 → 3
```

---

# ⚠️ Important: Negative Numbers

Floor division can be surprising with negative numbers.

For example:

```python
print(-7 // 2)
```

Output:

```text
-4
```

Why not `-3`?

Because floor division moves toward **negative infinity**.

```text
-7 / 2 = -3.5

Floor of -3.5 = -4
```

Compare:

```python
print(7 // 2)
print(-7 // 2)
```

Output:

```text
3
-4
```

### Remember

`//` does **not** simply remove the decimal part.

It performs **floor division**.

---

# 6. Modulo (`%`)

The `%` operator gives the **remainder** after division.

Example:

```python
print(17 % 5)
```

Output:

```text
2
```

Because:

```text
17 = (5 × 3) + 2
```

So:

```text
17 // 5 = 3
17 % 5  = 2
```

---

# 💡 Modulo for Even and Odd Numbers

Modulo is commonly used to check whether a number is even or odd.

### Even number

If a number divided by 2 has remainder `0`, it is even.

```python
number = 20

print(number % 2 == 0)
```

Output:

```text
True
```

### Odd number

```python
number = 21

print(number % 2 == 0)
```

Output:

```text
False
```

We can write a simple checker:

```python
number = 21

if number % 2 == 0:
    print("Even")
else:
    print("Odd")
```

Output:

```text
Odd
```

---

# 🔄 Modulo for Repeating Cycles

Modulo is also useful when something repeats in a cycle.

For example, imagine 4 slides in a presentation:

```text
Slide 0
Slide 1
Slide 2
Slide 3
```

After Slide 3, we want to return to Slide 0.

We can use:

```python
TOTAL_SLIDES = 4

for click in range(7):
    slide = click % TOTAL_SLIDES
    print(slide)
```

Output:

```text
0
1
2
3
0
1
2
```

This idea is useful for:

* Carousels
* Games
* Circular queues
* Repeating schedules
* Clock-like systems

---

# 7. Exponentiation (`**`)

The `**` operator is used for powers.

For example:

```python
result = 2 ** 3

print(result)
```

Output:

```text
8
```

Because:

```text
2 × 2 × 2 = 8
```

More examples:

```python
print(5 ** 2)
print(10 ** 3)
print(2 ** 10)
```

Output:

```text
25
1000
1024
```

### Easy Rule

```text
2 ** 3
↑     ↑
base  power
```

---

# 📊 All Seven Operators Together

Let's see all seven operators in one program.

```python
a = 17
b = 5

print("Addition        :", a + b)
print("Subtraction     :", a - b)
print("Multiplication  :", a * b)
print("True Division   :", a / b)
print("Floor Division  :", a // b)
print("Modulo          :", a % b)
print("Exponentiation  :", 2 ** 8)
```

Output:

```text
Addition        : 22
Subtraction     : 12
Multiplication  : 85
True Division   : 3.4
Floor Division  : 3
Modulo          : 2
Exponentiation  : 256
```

---

# 8. `divmod()` — Get Quotient and Remainder Together

Sometimes you need both:

* Quotient
* Remainder

Instead of writing:

```python
quotient = 29 // 6
remainder = 29 % 6
```

you can use:

```python
quotient, remainder = divmod(29, 6)

print(quotient)
print(remainder)
```

Output:

```text
4
5
```

So:

```python
divmod(29, 6)
```

returns:

```text
(4, 5)
```

You can think of it as:

```text
divmod(number, divisor)
       ↓
(quotient, remainder)
```

---

# ⏱️ Practical Example: Convert Minutes into Hours

Suppose a video is 285 minutes long.

```python
total_minutes = 285

hours, minutes = divmod(total_minutes, 60)

print(hours)
print(minutes)
```

Output:

```text
4
45
```

So the video duration is:

```text
4 hours 45 minutes
```

---

# 🎬 Practical Example: Convert Seconds into HH:MM:SS

```python
total_seconds = 7385

hours, remaining_seconds = divmod(total_seconds, 3600)

minutes, seconds = divmod(remaining_seconds, 60)

print(f"{hours:02d}:{minutes:02d}:{seconds:02d}")
```

Output:

```text
02:03:05
```

This means:

```text
2 hours
3 minutes
5 seconds
```

---

# 🧠 Operator Precedence

What happens when we use many operators in one expression?

For example:

```python
result = 10 + 5 * 2
```

Will Python calculate:

```text
(10 + 5) × 2 = 30
```

or:

```text
10 + (5 × 2) = 20
```

The answer is:

```text
20
```

Python follows **operator precedence**.

This is similar to the **PEMDAS/BODMAS** rule you may have learned in mathematics.

---

# 📋 Basic Precedence Order

For the operators covered in this lesson:

| Priority | Operation                 | Example             |
| -------: | ------------------------- | ------------------- |
|        1 | Parentheses               | `(2 + 3)`           |
|        2 | Exponentiation            | `2 ** 3`            |
|        3 | Multiplication / Division | `*`, `/`, `//`, `%` |
|        4 | Addition / Subtraction    | `+`, `-`            |

So Python generally evaluates:

```text
Parentheses
      ↓
Powers
      ↓
Multiply / Divide
      ↓
Add / Subtract
```

---

# Example: PEMDAS/BODMAS

Consider:

```python
result = 10 + 5 * 2 ** 2
```

Python evaluates it in this order:

### Step 1 — Power

```text
2 ** 2 = 4
```

### Step 2 — Multiplication

```text
5 × 4 = 20
```

### Step 3 — Addition

```text
10 + 20 = 30
```

Therefore:

```python
print(result)
```

Output:

```text
30
```

---

# Parentheses Can Make Code Clearer

Instead of relying completely on precedence:

```python
result = 10 + 5 * 2 ** 2
```

you can make the intended order clearer:

```python
result = 10 + (5 * (2 ** 2))
```

Both produce:

```text
30
```

### Best Practice

Use parentheses when they make a formula easier to understand.

---

# ⚡ A Special Case: Chained Powers

Exponentiation works from **right to left**.

For example:

```python
result = 2 ** 3 ** 2
```

Python interprets it as:

```python
2 ** (3 ** 2)
```

First:

```text
3 ** 2 = 9
```

Then:

```text
2 ** 9 = 512
```

So:

```python
print(2 ** 3 ** 2)
```

Output:

```text
512
```

But:

```python
print((2 ** 3) ** 2)
```

gives:

```text
64
```

because:

```text
2 ** 3 = 8
8 ** 2 = 64
```

### Beginner Tip

If a formula contains multiple powers, use parentheses to make your intention obvious.

---

# 🧮 Practical Formula Example

Let's calculate:

```text
(4 + 6) × 3² ÷ 5
```

Python:

```python
calculation = (4 + 6) * 3 ** 2 / 5

print(calculation)
```

Output:

```text
18.0
```

Python automatically follows the correct order.

---

# 🛠️ Practical Example: Simple Shopping Calculator

```python
price = 500
quantity = 3
discount = 100

subtotal = price * quantity
final_price = subtotal - discount

print("Subtotal:", subtotal)
print("Final Price:", final_price)
```

Output:

```text
Subtotal: 1500
Final Price: 1400
```

Here we used:

```text
* → multiplication
- → subtraction
```

---

# ⚠️ Division by Zero

You cannot divide a number by zero.

For example:

```python
result = 10 / 0
```

Python raises:

```text
ZeroDivisionError
```

The same applies to:

```python
10 // 0
```

and:

```python
10 % 0
```

### Remember

> Always make sure the divisor is not zero before performing a division operation.

---

# ✅ Do's and Don'ts

| Situation            | Avoid                                          | Prefer                                      |
| -------------------- | ---------------------------------------------- | ------------------------------------------- |
| Clear formulas       | Very long unclear expressions                  | Use parentheses                             |
| Quotient + remainder | Calculate both separately when both are needed | `divmod()`                                  |
| Even/odd checking    | Convert number to string                       | `number % 2`                                |
| Powers               | Unnecessary conversion to float                | `**`                                        |
| Division             | Assume `/` returns `int`                       | Remember `/` returns `float`                |
| Negative division    | Assume `//` simply removes decimals            | Remember it floors toward negative infinity |

---

# 📌 Quick Revision Cheat Sheet

```text
PYTHON ARITHMETIC OPERATORS
────────────────────────────────────

+    Addition
-    Subtraction
*    Multiplication
/    True Division
//   Floor Division
%    Modulo / Remainder
**   Exponentiation

Examples:

10 + 5     → 15
10 - 5     → 5
10 * 5     → 50
10 / 5     → 2.0
10 // 3    → 3
10 % 3     → 1
2 ** 3     → 8

divmod():
divmod(29, 6) → (4, 5)

Operator order:
Parentheses
     ↓
Exponent
     ↓
Multiply / Divide
     ↓
Add / Subtract
```

---

## Practice Quiz

### 1. What is the result of `8 / 4` in Python?
A. `2`
B. `2.0`
C. `4`
D. `0`
**Answer:** B

---

### 2. What is the result of `-9 // 2`?
A. `-4`
B. `-5`
C. `-4.5`
D. `4`
**Answer:** B

---

### 3. What is the result of `17 % 5`?
A. `2`
B. `3`
C. `5`
D. `0`
**Answer:** A
```text
17 = (5 × 3) + 2
```
So the remainder is `2`.

---

### 4. What does `divmod(29, 6)` return?
A. `(4.83, 5)`
B. `(4, 5)`
C. `(5, 4)`
D. `4
**Answer:** B
```text
(quotient, remainder)
```
For `29 ÷ 6`:
```text
quotient = 4
remainder = 5
```

### 5. What is the result of `10 + 5 * 2 ** 2`?
A. `60`
B. `100`
C. `30`
D. `400`
**Answer:** C
```text
2 ** 2 = 4
5 * 4 = 20
10 + 20 = 30
```

### 6. What is the result of `2 ** 3 ** 2`?
A. `64`
B. `256`
C. `512`
D. `36`
**Answer:** C
```text
2 ** (3 ** 2)
= 2 ** 9
= 512
---

# 💻 Hands-On Practice Challenge

## Challenge 15: Home Loan EMI Calculator

Now let's use Python's mathematical operators in a real-world calculation.

We will create a simple **Home Loan EMI Calculator**.

The standard EMI formula is:

```text
EMI = P × r × (1 + r)ⁿ
     ─────────────────────
       (1 + r)ⁿ - 1
```

Where:

* `P` = Loan amount
* `r` = Monthly interest rate
* `n` = Number of monthly payments

This challenge gives you practice with:

* `+`
* `-`
* `*`
* `/`
* `**`
* `divmod()`

### Starter Code

```python
def calculate_emi(principal, annual_rate, tenure_months):

    # Convert annual interest rate into monthly decimal rate
    monthly_rate = (annual_rate / 12) / 100

    # Calculate the growth factor
    growth_factor = (1 + monthly_rate) ** tenure_months

    # Calculate EMI
    emi = (
        principal
        * monthly_rate
        * growth_factor
        / (growth_factor - 1)
    )

    # Calculate total repayment
    total_payment = emi * tenure_months

    # Calculate total interest
    total_interest = total_payment - principal

    # Convert months into years and remaining months
    years, months = divmod(tenure_months, 12)

    print("=" * 50)
    print("       HOME LOAN EMI CALCULATOR")
    print("=" * 50)

    print(f"Loan Amount      : ₹{principal:,.2f}")
    print(f"Interest Rate    : {annual_rate:.2f}%")
    print(f"Tenure           : {years} Years {months} Months")
    print("-" * 50)
    print(f"Monthly EMI      : ₹{emi:,.2f}")
    print(f"Total Payment    : ₹{total_payment:,.2f}")
    print(f"Total Interest   : ₹{total_interest:,.2f}")

    print("=" * 50)


# Test the calculator
calculate_emi(
    principal=45_00_000,
    annual_rate=8.75,
    tenure_months=240
)
```

### What This Program Demonstrates

```text
annual_rate / 12
        ↓
      Division

principal * monthly_rate
        ↓
    Multiplication

(1 + monthly_rate) ** tenure_months
        ↓
    Exponentiation

growth_factor - 1
        ↓
    Subtraction

divmod(tenure_months, 12)
        ↓
Years + remaining months
```

### Practice Tasks

After running the program, try changing the values:

**Test 1**

```python
calculate_emi(
    principal=20_00_000,
    annual_rate=8.5,
    tenure_months=120
)
```

**Test 2**

```python
calculate_emi(
    principal=10_00_000,
    annual_rate=9.5,
    tenure_months=60
)
```

Then observe how changing:

* Loan amount
* Interest rate
* Loan tenure

changes the monthly EMI and total interest.

---

# 🎯 Lesson Summary

In this lesson, you learned:

* The seven basic arithmetic operators in Python
* Addition using `+`
* Subtraction using `-`
* Multiplication using `*`
* True division using `/`
* Floor division using `//`
* Modulo using `%`
* Exponentiation using `**`
* The difference between `/` and `//`
* Why negative floor division can produce surprising results
* How `%` can check even and odd numbers
* How modulo can create repeating cycles
* How `divmod()` returns quotient and remainder
* How Python follows operator precedence
* How PEMDAS/BODMAS applies to Python expressions
* Why chained exponentiation works from right to left
* How arithmetic operators can be used in practical formulas
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Math Module (math, random)** (4: Numbers).

👉 **[Continue to Next Lesson: Math Module (math, random) →](/tutorials/python-for-beginners/math-module-math-random)**
