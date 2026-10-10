---
id: python-type-conversion-casting-type
slug: type-conversion-casting-type
course: python-for-beginners
chapter: 3
topic: 3.2
title: Type Conversion (Casting & type())
description: Master implicit type coercion vs explicit type casting in Python, handle string-to-number parsing traps, and learn truthy and falsy boolean evaluation rules.
difficulty: Beginner
readingTime: 13
order: 12
keywords:
  - python type conversion
  - type casting
  - implicit coercion
  - explicit casting
  - int float str bool
  - truthy and falsy
  - valueerror
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# Type Conversion in Python

## What is Type Conversion?

**Type conversion** means changing a value from one data type to another.

For example:

```python
age = "25"
```

Here, `age` is a string.

If we want to perform calculations with it, we can convert it into an integer:

```python
age = int("25")
```

Now `age` contains an integer:

```python
25
```

Python provides several built-in functions for conversion:

```text
int()    → convert to integer
float()  → convert to decimal number
str()    → convert to string
bool()   → convert to Boolean
```

---

# Why Do We Need Type Conversion?

Suppose a user enters their age:

```python
age = input("Enter your age: ")
```

Even if the user enters:

```text
25
```

Python stores the input as:

```python
"25"
```

It is a **string**, not an integer.

We can verify this:

```python
age = input("Enter your age: ")

print(type(age))
```

If the user enters `25`, the output is:

```text
<class 'str'>
```

If we want to perform mathematical operations, we need to convert it:

```python
age = int(input("Enter your age: "))

print(age + 1)
```

If the user enters:

```text
25
```

the output is:

```text
26
```

### Remember

> `input()` always returns the user's input as a `str`.

---

# Two Types of Conversion

Python conversions can generally be understood in two ways:

### 1. Implicit Conversion

Python performs the conversion automatically in certain situations.

```python
10 + 2.5
```

Python produces:

```text
12.5
```

### 2. Explicit Conversion

You tell Python to convert the value.

```python
int("25")
```

The result is:

```text
25
```

### Simple difference

```text
Implicit
→ Python does it automatically

Explicit
→ You tell Python to do it
```

---

# 1. Implicit Type Conversion

Python can automatically convert between some numeric types during an operation.

For example:

```python
quantity = 5
price = 14.75

total = quantity * price

print(total)
print(type(total))
```

### Output

```text
73.75
<class 'float'>
```

Here:

```text
quantity → int
price    → float
total    → float
```

Python handles the numeric conversion automatically.

---

# Another Example

```python
a = 10
b = 2.5

result = a + b

print(result)
print(type(result))
```

Output:

```text
12.5
<class 'float'>
```

The result is a `float`.

### Important

You do not need to manually write:

```python
float(a)
```

for this simple numeric operation.

Python handles the conversion for you.

---

# 2. Division and `float`

There is another important rule.

In Python 3, `/` performs **true division** and returns a `float`.

Example:

```python
a = 10
b = 2

result = a / b

print(result)
print(type(result))
```

Output:

```text
5.0
<class 'float'>
```

Even though both numbers are integers, the result is a float.

Compare:

```python
10 / 2
```

with:

```python
10 // 2
```

Results:

```text
10 / 2  → 5.0
10 // 2 → 5
```

We will study `//` in more detail when we learn Python operators.

---

# 3. Explicit Type Conversion

Explicit conversion means that **you manually tell Python which type you want**.

The most common functions are:

```text
int()
float()
str()
bool()
```

Let's learn each one.

---

# 4. Converting String to Integer — `int()`

Suppose we have:

```python
age = "25"
```

Currently:

```text
"25" → str
```

Convert it using:

```python
age = int("25")
```

Now:

```text
25 → int
```

Example:

```python
age = int("25")

print(age)
print(type(age))
```

Output:

```text
25
<class 'int'>
```

---

# 5. Converting String to Float — `float()`

Suppose:

```python
price = "499.99"
```

This is a string.

Convert it:

```python
price = float("499.99")
```

Now it becomes:

```text
499.99 → float
```

Example:

```python
price = float("499.99")

print(price)
print(type(price))
```

Output:

```text
499.99
<class 'float'>
```

---

# 6. Converting Integer to Float

You can convert an integer into a float:

```python
score = 90

score = float(score)

print(score)
print(type(score))
```

Output:

```text
90.0
<class 'float'>
```

So:

```text
90 → 90.0
```

---

# 7. Converting Float to Integer

You can also convert a float to an integer:

```python
price = 99.99

price = int(price)

print(price)
```

Output:

```text
99
```

### Important

`int()` does **not round** the number.

It removes the decimal portion.

For example:

```python
print(int(9.87))
print(int(4.99))
print(int(-4.99))
```

Output:

```text
9
4
-4
```

So `int()` truncates toward zero.

### Remember

```text
int(9.99) → 9
```

not:

```text
10
```

---

# 8. Converting a Number to String

Use `str()` when you want a string representation of a value.

Example:

```python
age = 25

message = "My age is " + str(age)

print(message)
```

Output:

```text
My age is 25
```

Without `str()`:

```python
message = "My age is " + age
```

Python raises a `TypeError` because you cannot directly concatenate a string and an integer using `+`.

### Modern Alternative: f-strings

Usually, an f-string is even cleaner:

```python
age = 25

print(f"My age is {age}")
```

Output:

```text
My age is 25
```

---

# 9. Converting Values to Boolean — `bool()`

The `bool()` function converts a value to either:

```text
True
```

or:

```text
False
```

Examples:

```python
print(bool(1))
print(bool(0))
```

Output:

```text
True
False
```

For strings:

```python
print(bool("Hello"))
print(bool(""))
```

Output:

```text
True
False
```

The basic idea is:

```text
Has a value/content → usually True
Empty or zero → usually False
```

We call these **truthy** and **falsy** values.

---

# 10. Truthy and Falsy Values

Python allows almost any object to be tested in an `if` condition.

For example:

```python
name = "Sumit"

if name:
    print("Name is available")
```

Output:

```text
Name is available
```

Why?

Because `"Sumit"` is a non-empty string, so it is **truthy**.

---

# Common Falsy Values

The following values are commonly important to remember as falsy:

```python
False
None
0
0.0
""
[]
()
{}
set()
```

For example:

```python
print(bool(False))
print(bool(None))
print(bool(0))
print(bool(0.0))
print(bool(""))
print(bool([]))
```

Output:

```text
False
False
False
False
False
False
```

### Easy Rule

```text
Empty → usually False
Zero → False
None → False
Non-empty → usually True
```

---

# 11. A Very Important String Example

Look at this:

```python
print(bool("False"))
```

The result is:

```text
True
```

Why?

Because `"False"` is a **non-empty string**.

Python does not read the text `"False"` and automatically turn it into the Boolean value `False`.

Compare:

```python
bool(False)
```

with:

```python
bool("False")
```

Results:

```text
bool(False)   → False
bool("False") → True
```

The second one is a string containing characters.

---

# 12. More Truthy Examples

These are all truthy:

```python
bool("0")
bool("False")
bool(" ")
bool([0])
bool([False])
bool(100)
bool(-10)
```

Why?

Because:

* `"0"` is a non-empty string
* `"False"` is a non-empty string
* `" "` contains a space
* `[0]` contains one item
* `[False]` contains one item
* `100` is not zero
* `-10` is not zero

### Compare

```python
bool("")
```

Output:

```text
False
```

But:

```python
bool(" ")
```

Output:

```text
True
```

Even a single space makes the string non-empty.

---

# 13. The Float String Trap

One common beginner mistake is:

```python
price = "499.99"

price = int(price)
```

This raises:

```text
ValueError
```

Why?

Because `"499.99"` is not a valid integer string.

Python can directly convert:

```python
int("499")
```

but not:

```python
int("499.99")
```

### Correct Approach

If the string contains a decimal number:

```python
price = "499.99"

price = float(price)
price = int(price)

print(price)
```

Output:

```text
499
```

So the conversion happens in two steps:

```text
"499.99"
    ↓
  float()
    ↓
  499.99
    ↓
   int()
    ↓
   499
```

---

# 14. What is `ValueError`?

A `ValueError` occurs when Python receives a value of the correct general type but the value itself is not suitable for the requested operation.

For example:

```python
number = int("hello")
```

Python cannot turn `"hello"` into an integer.

So it raises:

```text
ValueError
```

Another example:

```python
number = float("abc")
```

This also causes a `ValueError`.

### Valid conversions

```python
int("100")
float("99.99")
```

### Invalid conversions

```python
int("hello")
float("hello")
int("50.5")
```

---

# 15. Converting User Input

This is one of the most important practical uses of type conversion.

Suppose we ask the user for quantity:

```python
quantity = input("Enter quantity: ")
```

If the user enters:

```text
5
```

Python receives:

```python
"5"
```

To calculate with it:

```python
quantity = int(input("Enter quantity: "))

total = quantity * 100

print("Total:", total)
```

If the user enters:

```text
5
```

the output is:

```text
Total: 500
```

---

# 16. User Input with Decimal Values

For prices, use `float()` when appropriate:

```python
price = float(input("Enter price: "))

quantity = int(input("Enter quantity: "))

total = price * quantity

print("Total:", total)
```

Example input:

```text
Enter price: 249.50
Enter quantity: 2
```

Output:

```text
Total: 499.0
```

This pattern is extremely common in real Python programs.

---

# 17. Using Truthiness in Conditions

Instead of writing:

```python
name = ""

if len(name) > 0:
    print("Name entered")
```

you can write:

```python
if name:
    print("Name entered")
```

If `name` is empty:

```python
name = ""
```

the condition is false.

If it contains text:

```python
name = "Sumit"
```

the condition is true.

This makes Python code shorter and easier to read.

---

# 18. Checking an Empty List

Suppose:

```python
cart = []
```

Instead of:

```python
if len(cart) == 0:
    print("Cart is empty")
```

you can write:

```python
if not cart:
    print("Cart is empty")
```

This is a common Python style.

If the cart contains items:

```python
cart = ["Laptop"]
```

then:

```python
if cart:
    print("Cart contains items")
```

Output:

```text
Cart contains items
```

---

# Type Conversion Cheat Sheet

```text
STRING → INTEGER

int("25")
→ 25


STRING → FLOAT

float("25.50")
→ 25.5


INTEGER → FLOAT

float(25)
→ 25.0


FLOAT → INTEGER

int(25.99)
→ 25


INTEGER → STRING

str(25)
→ "25"


VALUE → BOOLEAN

bool(1)
→ True

bool(0)
→ False


EMPTY VALUES

bool("")
bool([])
bool(())
bool({})
bool(set())
bool(None)

→ False
```

---

# Implicit vs Explicit Conversion

| Type     | Example        | Who performs conversion? |
| -------- | -------------- | ------------------------ |
| Implicit | `5 + 2.5`      | Python                   |
| Explicit | `int("25")`    | Programmer               |
| Explicit | `float("9.5")` | Programmer               |
| Explicit | `str(100)`     | Programmer               |
| Explicit | `bool(0)`      | Programmer               |

### Remember

> **Implicit = Python does it automatically.**

> **Explicit = You ask Python to do it.**

---

# Do's and Don'ts

| Situation            | Don't                                  | Do                                      |
| -------------------- | -------------------------------------- | --------------------------------------- |
| User enters quantity | `qty = input()` and calculate directly | `qty = int(input())`                    |
| Decimal input        | `int("75.50")`                         | `float("75.50")`                        |
| Float to int         | Expect rounding                        | Remember `int()` truncates              |
| Number + text        | `"Age: " + age`                        | `"Age: " + str(age)` or an f-string     |
| Empty list check     | `len(items) == 0` everywhere           | `if not items:`                         |
| Boolean string       | Assume `"False"` means `False`         | Remember any non-empty string is truthy |
| Invalid conversion   | Ignore possible `ValueError`           | Validate or handle the error            |

---

# Quick Revision Summary

```text
PYTHON TYPE CONVERSION CHEAT SHEET

Implicit Conversion
→ Python automatically handles certain numeric conversions.

Example:
5 + 2.5 → 7.5

Explicit Conversion
→ Programmer performs the conversion.

int()
→ Integer

float()
→ Decimal number

str()
→ String

bool()
→ True / False

Important:
int(3.99) → 3

int("25") → 25

float("25.50") → 25.5

str(100) → "100"

bool("") → False

bool("Hello") → True

bool("False") → True

input()
→ Always returns a string.

Invalid conversion
→ Can raise ValueError.
```

---

## Practice Quiz

### 1. What does `int(4.85)` return?
A. `5`
B. `4`
C. `4.85`
D. `ValueError`
**Answer:** B

---

### 2. What happens when you execute `int("35.75")`?
A. Returns `35`
B. Returns `36`
C. Raises `ValueError`
D. Returns `35.75`
**Answer:** C

---

### 3. What does `input()` return?
A. `int`
B. `float`
C. `str`
D. `bool`
**Answer:** C

---

### 4. Which expression evaluates to `False`?
A. `bool("0")`
B. `bool([0])`
C. `bool(" ")`
D. `bool([])`
**Answer:** D

---

### 5. What is the result of `100 / 20` in Python 3?
A. `5`
B. `5.0`
C. `"5"`
D. `False`
**Answer:** B

---

### 6. Why does `bool("False")` return `True`?
A. Python changes `"False"` into `True`
B. `"False"` is a non-empty string
C. Strings cannot contain Boolean values
D. `bool()` only works with numbers
**Answer:** B

---

# Hands-On Practice Challenge

## Challenge 12: Smart POS Receipt Calculator

Create a small billing program that receives product information as strings and converts the values into the correct data types.

### Starter Code

```python
# Raw input values
raw_item_name = "  Wireless Mechanical Keyboard  "
raw_unit_price = "2499.50"
raw_quantity = "2"
raw_discount_code = "DIWALI50"
raw_notes = ""

# Clean and convert the values
item_name = raw_item_name.strip()
unit_price = float(raw_unit_price)
quantity = int(raw_quantity)

# Calculate subtotal
subtotal = unit_price * quantity

print("=" * 50)
print("          RETAIL POS BILL")
print("=" * 50)

print(f"Product : {item_name}")
print(f"Price   : INR {unit_price:.2f}")
print(f"Quantity: {quantity}")
print(f"Subtotal: INR {subtotal:.2f}")

# Check whether a discount code was provided
if raw_discount_code:
    discount = subtotal * 0.10
    print(f"Discount: INR {discount:.2f}")
else:
    discount = 0

final_amount = subtotal - discount

# Check whether notes were provided
if raw_notes.strip():
    print(f"Notes: {raw_notes}")
else:
    print("Notes: No special instructions")

print("-" * 50)
print(f"FINAL AMOUNT: INR {final_amount:.2f}")
print("=" * 50)
```

### Expected Output

```text
==================================================
          RETAIL POS BILL
==================================================
Product : Wireless Mechanical Keyboard
Price   : INR 2499.50
Quantity: 2
Subtotal: INR 4999.00
Discount: INR 499.90
Notes: No special instructions
--------------------------------------------------
FINAL AMOUNT: INR 4499.10
==================================================
```

### What This Challenge Demonstrates

```text
strip()
→ removes extra spaces

float()
→ converts price string to float

int()
→ converts quantity string to integer

if raw_discount_code:
→ checks whether the string is non-empty

if raw_notes.strip():
→ checks whether useful text was entered

int × float
→ produces a float result
```

---

# What You Learned

In this lesson, you learned:

* What type conversion means
* Implicit vs explicit conversion
* How `int()` works
* How `float()` works
* How `str()` works
* How `bool()` works
* Why `input()` returns a string
* How to convert user input
* Why `int("35.75")` raises `ValueError`
* How float-to-int conversion truncates
* What truthy and falsy values are
* Why `bool("False")` is `True`
* How to use truthiness in `if` statements
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Checking Data Types (isinstance)** (3: Data Types).

👉 **[Continue to Next Lesson: Checking Data Types (isinstance) →](/tutorials/python-for-beginners/checking-data-types-isinstance)**
