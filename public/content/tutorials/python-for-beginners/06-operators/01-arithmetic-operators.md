---
id: python-arithmetic-operators
slug: arithmetic-operators
course: python-for-beginners
chapter: 6
topic: 6.1
title: Arithmetic Operators
description: Master Python's arithmetic operators, understand operator overloading across numbers, strings, and lists, and handle floating-point modulus and unary operations.
difficulty: Beginner
readingTime: 13
order: 23
keywords:
  - arithmetic operators
  - python arithmetic operators
  - operator overloading
  - unary operators
  - string repetition
  - list concatenation
  - float modulo
  - addition
  - subtraction
  - multiplication
  - division
  - modulus
  - exponentiation
  - floor division
  - operator precedence
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---


# ➕ Arithmetic Operators in Python

Arithmetic operators are used to perform **mathematical calculations** in Python.

You already use these calculations in everyday life:

- Adding numbers
- Subtracting numbers
- Multiplying numbers
- Dividing numbers
- Finding the remainder

Python can do all of these calculations for you.

For example:

```python
10 + 5
```

The result is:

```text
15
```

> 💡 **Simple idea:**  
> Arithmetic operators are symbols that tell Python **which mathematical calculation to perform**.

---

## 🧮 Arithmetic Operators in Python

Python provides several arithmetic operators:

| Operator | Name | Example | Result |
|---|---|---:|---:|
| `+` | Addition | `10 + 5` | `15` |
| `-` | Subtraction | `10 - 5` | `5` |
| `*` | Multiplication | `10 * 5` | `50` |
| `/` | Division | `10 / 5` | `2.0` |
| `%` | Modulus | `10 % 3` | `1` |
| `**` | Exponentiation | `2 ** 3` | `8` |
| `//` | Floor Division | `10 // 3` | `3` |

Don't worry if some of these look new.

We will understand each one with simple examples.

---

# 1. ➕ Addition Operator (`+`)

The `+` operator is used to **add two numbers**.

### Example

```python
print(10 + 5)
```

Output:

```text
15
```

Another example:

```python
print(25 + 15)
```

Output:

```text
40
```

### Real-Life Example

Suppose you have:

```text
₹500
+
₹200
```

Python can calculate:

```python
print(500 + 200)
```

Output:

```text
700
```

> ✅ **Remember:**  
> `+` means **add**.

---

# 2. ➖ Subtraction Operator (`-`)

The `-` operator is used to **subtract one number from another**.

### Example

```python
print(10 - 5)
```

Output:

```text
5
```

Another example:

```python
print(100 - 35)
```

Output:

```text
65
```

### Real-Life Example

Suppose you have ₹1,000 and spend ₹250.

```python
print(1000 - 250)
```

Output:

```text
750
```

> ✅ **Remember:**  
> `-` means **subtract**.

---

# 3. ✖️ Multiplication Operator (`*`)

The `*` operator is used to **multiply numbers**.

In Python, multiplication uses an asterisk `*`.

### Example

```python
print(10 * 5)
```

Output:

```text
50
```

Another example:

```python
print(12 * 4)
```

Output:

```text
48
```

### Real-Life Example

Suppose one notebook costs ₹50 and you buy 4 notebooks.

```python
print(50 * 4)
```

Output:

```text
200
```

> ✅ **Remember:**  
> `*` means **multiply**.

---

# 4. ➗ Division Operator (`/`)

The `/` operator is used to **divide one number by another**.

### Example

```python
print(10 / 2)
```

Output:

```text
5.0
```

Notice that Python gives:

```text
5.0
```

instead of:

```text
5
```

The `/` operator produces a **division result in decimal form**.

Another example:

```python
print(20 / 4)
```

Output:

```text
5.0
```

### Example with a non-even division

```python
print(10 / 3)
```

Output will be approximately:

```text
3.3333333333333335
```

> ✅ **Remember:**  
> `/` means **division**.

---

# 5. 🔢 Modulus Operator (`%`)

The `%` operator is called the **modulus operator**.

It gives us the **remainder** after division.

This is one of the most useful arithmetic operators.

### Example

```python
print(10 % 3)
```

Let's understand it:

```text
10 ÷ 3

3 × 3 = 9
Remainder = 1
```

So:

```text
10 % 3 = 1
```

Output:

```text
1
```

### Another Example

```python
print(20 % 5)
```

Output:

```text
0
```

Why?

Because 20 can be divided by 5 exactly.

```text
20 ÷ 5 = 4
Remainder = 0
```

### Simple Trick to Remember

Think:

> `%` asks: **"What is left after division?"**

For example:

```python
print(17 % 5)
```

Output:

```text
2
```

Because:

```text
17 ÷ 5

5 × 3 = 15
Remainder = 2
```

> ✅ **Remember:**  
> `%` gives the **remainder**.

---

# 6. 🔢 Exponentiation Operator (`**`)

The `**` operator is used to calculate **powers**.

For example:

```python
print(2 ** 3)
```

This means:

```text
2 × 2 × 2
```

So the result is:

```text
8
```

Another example:

```python
print(5 ** 2)
```

This means:

```text
5 × 5
```

Output:

```text
25
```

### Easy Way to Understand

```text
2 ** 2 = 4
2 ** 3 = 8
2 ** 4 = 16
```

> ✅ **Remember:**  
> `**` means **power** or **exponentiation**.

---

# 7. 🔽 Floor Division Operator (`//`)

The `//` operator performs division and returns the **whole-number part of the result by rounding down**.

### Example

```python
print(10 // 3)
```

Normal division:

```text
10 / 3 = 3.333...
```

Floor division:

```text
10 // 3 = 3
```

So:

```python
print(10 // 3)
```

Output:

```text
3
```

Another example:

```python
print(20 // 6)
```

Output:

```text
3
```

Because:

```text
20 / 6 = 3.333...
```

and floor division gives:

```text
3
```

> 💡 **Easy way to remember:**  
> `/` gives the normal division result.  
> `//` gives the result rounded **down** to the nearest whole number.

---

# 📋 Quick Comparison

Here is an easy way to remember all arithmetic operators:

| Operator | What it does | Example | Result |
|---|---|---:|---:|
| `+` | Adds numbers | `8 + 2` | `10` |
| `-` | Subtracts numbers | `8 - 2` | `6` |
| `*` | Multiplies numbers | `8 * 2` | `16` |
| `/` | Divides numbers | `8 / 2` | `4.0` |
| `%` | Gives remainder | `8 % 3` | `2` |
| `**` | Calculates power | `2 ** 3` | `8` |
| `//` | Floor division | `8 // 3` | `2` |

---

# 🧠 Arithmetic Calculations Together

Python can use more than one arithmetic operator in a single calculation.

For example:

```python
print(10 + 5 * 2)
```

The result is:

```text
20
```

Why is the answer `20` and not `30`?

Because Python follows a specific **order of operations**.

---

# 📐 Order of Operations

When multiple arithmetic operators are used together, Python follows a mathematical order.

A simple rule to remember is:

```text
1. Parentheses
2. Powers
3. Multiplication, Division, Floor Division, Modulus
4. Addition and Subtraction
```

![Order of Operations](/content/tutorials/python-for-beginners/images/05_Python_Order_of_Operations.png)



You can remember the basic idea as:

> **Brackets → Power → Multiply/Divide → Add/Subtract**

---

## Example 1

```python
print(10 + 5 * 2)
```

Python first performs:

```text
5 * 2 = 10
```

Then:

```text
10 + 10 = 20
```

So the output is:

```text
20
```

---

## Example 2

```python
print((10 + 5) * 2)
```

This time, the parentheses are calculated first:

```text
10 + 5 = 15
```

Then:

```text
15 * 2 = 30
```

Output:

```text
30
```

Notice how parentheses changed the result.

> 💡 **Beginner Tip:**  
> When you want Python to perform a calculation first, use **parentheses `()`**.

---


# 🧪 Let's Practice

Now it's your turn.

Try to predict the output before running each program.

---

## 🟢 Practice 1: Addition

```python
print(25 + 15)
```

**Expected Output:**

```text
40
```

---

## 🟢 Practice 2: Subtraction

```python
print(100 - 35)
```

**Expected Output:**

```text
65
```

---

## 🟡 Practice 3: Multiplication

```python
print(12 * 5)
```

**Expected Output:**

```text
60
```

---

## 🟡 Practice 4: Division

```python
print(25 / 5)
```

**Expected Output:**

```text
5.0
```

---

## 🟡 Practice 5: Modulus

```python
print(17 % 4)
```

**Expected Output:**

```text
1
```

---

## 🔵 Practice 6: Power

```python
print(3 ** 3)
```

**Expected Output:**

```text
27
```

---

## 🔵 Practice 7: Floor Division

```python
print(17 // 4)
```

**Expected Output:**

```text
4
```

---

## 🔥 Challenge: Mixed Calculation

Try to calculate the answer before running the code:

```python
print(20 + 5 * 2)
```

Think carefully about the order of operations.

**Answer:**

```text
30
```

---

# 🛠️ Mini Activity

Try these calculations yourself.

```python
print(50 + 25)
print(100 - 45)
print(12 * 8)
print(100 / 4)
print(19 % 5)
print(2 ** 5)
print(19 // 5)
```

### Your Task

Before running the code, write down what you think the output of each line will be.

Then run the program and check your answers.

> 🎯 **Learning Tip:** Predicting the answer before running the code is a great way to improve your programming understanding.

---

# ⚠️ Common Beginner Mistakes

## 1. Using `x` instead of `*`

In normal mathematics, multiplication is sometimes written using `×`.

In Python, multiplication uses:

```python
*
```

Correct:

```python
print(5 * 4)
```

Not:

```python
print(5 x 4)
```

---

## 2. Confusing `/` and `//`

Remember:

```python
10 / 3
```

gives approximately:

```text
3.333...
```

while:

```python
10 // 3
```

gives:

```text
3
```

---

## 3. Confusing `%` with Percentage

In Python, `%` is the **modulus operator**.

It gives the remainder after division.

For example:

```python
print(15 % 4)
```

Output:

```text
3
```

---

## 4. Forgetting Operator Priority

Look at:

```python
print(10 + 2 * 5)
```

Python performs multiplication first:

```text
2 * 5 = 10
10 + 10 = 20
```

So the result is:

```text
20
```

Use parentheses when you want a different order:

```python
print((10 + 2) * 5)
```

Output:

```text
60
```

---

# 📝 Quick Summary

Arithmetic operators help Python perform mathematical calculations.

The main arithmetic operators are:

- `+` → Addition
- `-` → Subtraction
- `*` → Multiplication
- `/` → Division
- `%` → Remainder
- `**` → Power
- `//` → Floor Division

Python can also combine multiple operators in one calculation.

When calculations are combined, Python follows an order of operations.

> 🎯 **Key Idea:**  
> Arithmetic operators are the basic tools Python uses to perform mathematical calculations.

---

# 🧠 Practice Quiz

## 1. Which operator is used for addition?
A. `*`  
B. `+`  
C. `/`  
D. `%`
**Answer:** B. `+`

---

## 2. Which operator is used for multiplication?
A. `x`  
B. `+`  
C. `*`  
D. `//`
**Answer:** C. `*`

---

## 3. What is the result of this expression?

```python
10 - 4
```

A. `6`  
B. `14`  
C. `40`  
D. `4`
**Answer:** A. `6`

---

## 4. What does `%` return?

A. Quotient  
B. Power  
C. Remainder  
D. Average
**Answer:** C. Remainder

---

## 5. What is the result of:

```python
10 % 3
```

A. `3`  
B. `1`  
C. `0`  
D. `10`
**Answer:** B. `1`

---

## 6. What does `**` do?

A. Division  
B. Addition  
C. Calculates power  
D. Gives remainder
**Answer:** C. Calculates power

---

## 7. What is the result of:

```python
10 // 3
```

A. `3.33`  
B. `4`  
C. `3`  
D. `1`
**Answer:** C. `3`

---

## 8. What is the output?

```python
print(10 + 5 * 2)
```

A. `30`  
B. `20`  
C. `25`  
D. `15`
**Answer:** B. `20`

---

## 🚀 What's Next?

You now know how Python performs basic mathematical calculations using arithmetic operators.

Practice these operators by writing your own calculations and predicting the output before running the code.



