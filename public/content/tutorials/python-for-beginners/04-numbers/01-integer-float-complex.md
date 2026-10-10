---
id: python-integer-float-complex
slug: integer-float-complex
course: python-for-beginners
chapter: 4
topic: 4.1
title: Integer, Float, Complex
description: Master Python's three core numeric types—arbitrary-precision integers, IEEE-754 floating-point numbers, and electrical engineering complex numbers.
difficulty: Beginner
readingTime: 14
order: 14
keywords:
  - python numbers
  - integer arbitrary precision
  - float ieee 754
  - complex numbers j
  - floating point quirk
  - math isclose
 lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# 🔢 Python Numbers: Integers, Floats, and Complex Numbers

Numbers are used everywhere in programming.

You may use numbers to:

* Count students
* Store prices
* Calculate percentages
* Measure temperature
* Calculate distance
* Work with scientific values
* Build electrical engineering applications

Python provides three important built-in numeric types:

| Type      | Name           | Example  | Common Use                              |
| --------- | -------------- | -------- | --------------------------------------- |
| `int`     | Integer        | `25`     | Whole numbers                           |
| `float`   | Floating-point | `25.5`   | Decimal values                          |
| `complex` | Complex number | `3 + 4j` | Scientific and engineering calculations |

Let's understand each one step by step.

---

# 1. Integer (`int`)

An **integer** is a whole number without a decimal part.

Examples:

```python
age = 21
students = 50
temperature = -5
score = 100
```

All of these values are integers.

```python
print(type(21))
print(type(-5))
print(type(100))
```

Output:

```text
<class 'int'>
<class 'int'>
<class 'int'>
```

## Positive and Negative Integers

Integers can be positive, negative, or zero.

```python
positive_number = 100
negative_number = -50
zero = 0

print(positive_number)
print(negative_number)
print(zero)
```

---

# 💡 Real-Life Example

Imagine counting physical objects.

If you have 10 books:

```python
books = 10
```

You can have:

```text
10 books
20 books
100 books
```

But normally, you don't say:

```text
10.5 physical books
```

That's why counting objects commonly uses integers.

---

# 🚀 Python Integers Can Be Very Large

One useful feature of Python is that integers can grow much larger than the typical fixed-size integers used in many other programming languages.

For example:

```python
number = 2 ** 100

print(number)
```

Output:

```text
1267650600228229401496703205376
```

Python can handle this large integer without the usual fixed 32-bit integer limit.

You can also check how many digits it has:

```python
print(len(str(number)))
```

Output:

```text
31
```

### Remember

> Python integers can grow to very large sizes, limited mainly by the memory available to your computer.

---

# 🔢 Underscores in Large Numbers

Large numbers can be difficult to read.

Compare:

```python
salary = 1500000
```

with:

```python
salary = 1_500_000
```

Both represent exactly the same number.

```python
print(1_500_000)
print(1500000)
```

Output:

```text
1500000
1500000
```

Python simply ignores the underscores when reading numeric literals.

### Recommended

For large numbers, use underscores:

```python
population = 1_400_000_000
```

This is easier to read than:

```python
population = 1400000000
```

---

# 🔢 Binary, Octal, and Hexadecimal Integers

Python also allows integers to be written in different number systems.

### Binary

Prefix: `0b`

```python
binary_number = 0b1010
print(binary_number)
```

Output:

```text
10
```

### Octal

Prefix: `0o`

```python
octal_number = 0o77
print(octal_number)
```

Output:

```text
63
```

### Hexadecimal

Prefix: `0x`

```python
hex_number = 0xFF
print(hex_number)
```

Output:

```text
255
```

These are especially useful when working with computers, networking, colors, and low-level programming.

---

# 2. Float (`float`)

A **float** is a number that can contain a decimal part.

Examples:

```python
price = 99.99
temperature = 36.5
height = 5.8
percentage = 92.75
```

Check the type:

```python
print(type(99.99))
```

Output:

```text
<class 'float'>
```

---

# 💡 Real-Life Example

Suppose you are measuring the weight of gold:

```python
gold_weight = 10.345
```

The value contains a decimal part, so a `float` is useful.

Other examples:

```python
distance = 12.75
petrol_price = 96.72
body_temperature = 98.6
```

---

# Scientific Notation

Python also supports scientific notation using `e` or `E`.

For example:

```python
distance = 1.496e8
```

This means:

```text
1.496 × 10⁸
```

So:

```python
print(distance)
```

Output:

```text
149600000.0
```

You can also represent very small numbers:

```python
mass = 9.109e-31

print(mass)
```

Output:

```text
9.109e-31
```

Scientific notation is useful for very large or very small numbers.

---

# ⚠️ An Important Float Issue

You may notice something surprising in Python:

```python
print(0.1 + 0.2)
```

Output:

```text
0.30000000000000004
```

You may expect:

```text
0.3
```

Why does this happen?

Computers store floating-point numbers using binary representation.

Some decimal values, such as `0.1` and `0.2`, cannot be represented exactly in binary floating-point format.

So Python stores a very close approximation.

This is **not a Python bug**.

It is a normal limitation of binary floating-point arithmetic.

---

# Comparing Floating-Point Numbers

Because of this behavior, avoid relying on exact equality when comparing calculated floating-point values.

For example:

```python
total = 0.1 + 0.2

print(total == 0.3)
```

Output:

```text
False
```

Instead, Python provides `math.isclose()` for checking whether two numbers are sufficiently close.

```python
import math

total = 0.1 + 0.2

print(math.isclose(total, 0.3))
```

Output:

```text
True
```

### Why?

`math.isclose()` allows a small difference caused by floating-point representation.

---

# `round()` vs `math.isclose()`

These two functions solve different problems.

### `round()`

Use `round()` when you want to control the displayed or stored rounded value:

```python
value = 0.1 + 0.2

print(round(value, 2))
```

Output:

```text
0.3
```

### `math.isclose()`

Use `math.isclose()` when you want to compare two calculated values:

```python
import math

print(math.isclose(0.1 + 0.2, 0.3))
```

Output:

```text
True
```

### Remember

> `round()` is useful for rounding.
> `math.isclose()` is useful for comparing floating-point results.

---

# 💰 What About Money?

For many simple examples, `float` is fine.

However, financial applications may need exact decimal arithmetic.

For example:

* Banking
* Invoicing
* Accounting
* Tax calculations
* Currency calculations

Python provides the `decimal.Decimal` type for such situations.

Example:

```python
from decimal import Decimal

price = Decimal("0.10")
tax = Decimal("0.20")

total = price + tax

print(total)
```

Output:

```text
0.30
```

### Beginner Rule

For now:

* Use `int` for whole numbers.
* Use `float` for normal decimal calculations.
* Learn `Decimal` later when you work with precise financial calculations.

---

# 3. Complex Numbers (`complex`)

A **complex number** contains two parts:

1. Real part
2. Imaginary part

In mathematics, complex numbers are commonly written as:

```text
a + bi
```

Python uses **`j`** instead of `i`.

For example:

```python
z = 3 + 4j
```

Here:

```text
Real part      = 3
Imaginary part = 4
```

---

# Why Does Python Use `j`?

Python uses `j` or `J` to represent the imaginary part.

Correct:

```python
z = 3 + 4j
```

Also correct:

```python
z = 3 + 4J
```

Incorrect:

```python
z = 3 + 4i
```

Python does not use `i` as the imaginary-number suffix.

---

# Creating Complex Numbers

You can create a complex number directly:

```python
z1 = 3 + 4j

print(z1)
```

Output:

```text
(3+4j)
```

You can also use the `complex()` function:

```python
z2 = complex(2, -1)

print(z2)
```

Output:

```text
(2-1j)
```

---

# Accessing the Real and Imaginary Parts

Python provides `.real` and `.imag`.

```python
z = 3 + 4j

print(z.real)
print(z.imag)
```

Output:

```text
3.0
4.0
```

Notice that these values are returned as floats.

---

# Complex Number Arithmetic

Python supports normal arithmetic with complex numbers.

```python
z1 = 3 + 4j
z2 = 2 - 1j

print(z1 + z2)
print(z1 - z2)
print(z1 * z2)
```

Output:

```text
5+3j
1+5j
10+5j
```

---

# Complex Number Conjugate

The **conjugate** changes the sign of the imaginary part.

For example:

```text
3 + 4j
```

becomes:

```text
3 - 4j
```

Python:

```python
z = 3 + 4j

print(z.conjugate())
```

Output:

```text
(3-4j)
```

---

# Magnitude of a Complex Number

The magnitude of:

```text
3 + 4j
```

is:

```text
√(3² + 4²)
```

which equals:

```text
5
```

Python can calculate it using `abs()`:

```python
z = 3 + 4j

print(abs(z))
```

Output:

```text
5.0
```

This is similar to finding the length of the hypotenuse of a right triangle.

---

# ⚡ Real-World Use of Complex Numbers

Complex numbers are commonly used in areas such as:

* Electrical engineering
* Signal processing
* Physics
* Control systems
* Mathematics
* Electronics

For example, electrical engineers can represent impedance as:

```text
Z = R + jX
```

where:

* `R` = resistance
* `X` = reactance
* `j` = imaginary unit

Python's built-in `complex` type makes these calculations easier.

---

# 📊 Choosing the Correct Number Type

| Situation                    | Recommended Type | Example            |
| ---------------------------- | ---------------- | ------------------ |
| Number of students           | `int`            | `50`               |
| Age                          | `int`            | `21`               |
| Product quantity             | `int`            | `5`                |
| Temperature                  | `float`          | `36.5`             |
| Product price                | `float`          | `99.99`            |
| Scientific measurement       | `float`          | `1.5e8`            |
| Electrical impedance         | `complex`        | `40 + 5j`          |
| Precise currency calculation | `Decimal`        | `Decimal("99.99")` |

---

# 🧠 Quick Comparison

```text
int
 ↓
Whole numbers
Examples: 10, -5, 1000

float
 ↓
Decimal / fractional values
Examples: 3.14, 99.99, 1.5e8

complex
 ↓
Real + imaginary values
Examples: 3 + 4j
```

---

# 🛠️ Complete Example

Let's combine what we learned:

```python
import math

# Integer
students = 50

# Float
average_marks = 87.5

# Complex
impedance = 40 + 5j

print("Students:", students)
print("Average Marks:", average_marks)
print("Impedance:", impedance)

print("Real part:", impedance.real)
print("Imaginary part:", impedance.imag)
print("Magnitude:", abs(impedance))

print("Close to 40.31:", math.isclose(abs(impedance), 40.31, abs_tol=0.01))
```

Possible output:

```text
Students: 50
Average Marks: 87.5
Impedance: (40+5j)
Real part: 40.0
Imaginary part: 5.0
Magnitude: 40.311288741492746
Close to 40.31: True
```

---

# ✅ Do's and Don'ts

| Situation                      | Don't                   | Do                         |
| ------------------------------ | ----------------------- | -------------------------- |
| Large numbers                  | `15000000`              | `15_000_000`               |
| Float comparison               | `total == 0.3`          | `math.isclose(total, 0.3)` |
| Complex numbers                | `3 + 4i`                | `3 + 4j`                   |
| Imaginary value                | `5 + j`                 | `5 + 1j`                   |
| Precise financial calculations | Rely blindly on `float` | Consider `Decimal`         |

---

# 📌 Important Points to Remember

### Integer

```python
age = 25
```

* Whole number
* Can be positive, negative, or zero
* Python supports very large integers
* Underscores can improve readability

---

### Float

```python
price = 99.99
```

* Can contain decimal values
* Supports scientific notation
* Floating-point calculations may contain tiny rounding differences
* Use `math.isclose()` when appropriate for comparisons

---

### Complex

```python
z = 3 + 4j
```

* Contains real and imaginary parts
* Python uses `j`
* `.real` gets the real part
* `.imag` gets the imaginary part
* `.conjugate()` returns the conjugate
* `abs()` returns the magnitude

---

# 📝 Quick Revision Cheat Sheet

```text
PYTHON NUMBER TYPES
────────────────────────────────────

int
→ Whole numbers
→ 10, -20, 500
→ Very large integers are supported

float
→ Decimal numbers
→ 3.14, 99.99, 1.5e6
→ Floating-point calculations can have tiny rounding differences

complex
→ Real + imaginary
→ 3 + 4j
→ Python uses j, not i

Useful functions:
→ type()
→ round()
→ abs()
→ math.isclose()

Number prefixes:
→ 0b → Binary
→ 0o → Octal
→ 0x → Hexadecimal
```

---

## Practice Quiz

### 1. Which Python type is used for whole numbers?
A. `float`
B. `str`
C. `int`
D. `complex`
**Answer:** C

---
### 2. Which value is a float?
A. `100`
B. `-20`
C. `3.14`
D. `0xFF`
**Answer:** C
---

### 3. Which suffix does Python use for the imaginary part of a complex number?
A. `i`
B. `j`
C. `x`
D. `c`
**Answer:** B
```python
z = 3 + 4j
```

### 4. Why can `0.1 + 0.2` produce `0.30000000000000004`?
A. Python cannot perform addition correctly
B. Python converts numbers into strings
C. Some decimal values cannot be represented exactly in binary floating-point format
D. Python randomly changes decimal values
**Answer:** C

---

### 5. Which function is useful when comparing floating-point values with a small tolerance?
A. `math.isclose()`
B. `math.compare()`
C. `float.equal()`
D. `number.check()`
**Answer:** A

---

### 6. What is the result of this code?
```python
z = 3 + 4j
print(z.real)
```
A. `4.0`
B. `3.0`
C. `7.0`
D. `3 + 4j
**Answer:** B

---

# 💻 Hands-On Practice Challenge

## Challenge 14: Python Number Analyzer

Create a small program that demonstrates all three Python numeric types.

Your program should:

1. Create an integer representing the number of students.
2. Create a float representing the average marks.
3. Create a complex number representing a simple electrical impedance.
4. Print the type of each value.
5. Print the real and imaginary parts of the complex number.
6. Print the magnitude of the complex number.
7. Use `math.isclose()` to compare a calculated value.

### Starter Code

```python
import math

print("=" * 50)
print("       PYTHON NUMBER ANALYZER")
print("=" * 50)

# Integer
students = 50

# Float
average_marks = 87.5

# Complex number
impedance = 40 + 5j

print("Students:", students)
print("Average Marks:", average_marks)
print("Impedance:", impedance)

print("-" * 50)

print("Students type:", type(students))
print("Average marks type:", type(average_marks))
print("Impedance type:", type(impedance))

print("-" * 50)

print("Real part:", impedance.real)
print("Imaginary part:", impedance.imag)
print("Magnitude:", abs(impedance))

print("-" * 50)

expected_magnitude = 40.31

print(
    "Magnitude is close to expected value:",
    math.isclose(abs(impedance), expected_magnitude, abs_tol=0.01)
)

print("=" * 50)
```

### Your Task

After running the program, try changing:

```python
students = 50
```

to another integer.

Then change:

```python
average_marks = 87.5
```

to another decimal value.

Finally, experiment with:

```python
impedance = 40 + 5j
```

For example:

```python
impedance = 30 + 10j
```

Observe how the real part, imaginary part, and magnitude change.

---

# 🎯 Lesson Summary

In this lesson, you learned:

* What numbers are in Python
* How `int` represents whole numbers
* Python's support for very large integers
* How underscores improve readability of large numbers
* Binary, octal, and hexadecimal integer literals
* How `float` represents decimal values
* Scientific notation
* Why floating-point calculations can have tiny rounding differences
* How `math.isclose()` helps compare floating-point values
* When `Decimal` may be useful for financial calculations
* What complex numbers are
* Why Python uses `j`
* How to access `.real` and `.imag`
* How to calculate a complex number's magnitude
* How Python numbers can be used in electrical engineering
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Mathematical Operations** (4: Numbers).

👉 **[Continue to Next Lesson: Mathematical Operations →](/tutorials/python-for-beginners/mathematical-operations)**
