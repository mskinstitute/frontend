---
id: python-checking-data-types-isinstance
slug: checking-data-types-isinstance
course: python-for-beginners
chapter: 3
topic: 3.3
title: Checking Data Types (isinstance)
description: Master Python type inspection using isinstance(), understand why type() equality breaks polymorphism, test against multiple types with tuples, and implement defensive parameter guards.
difficulty: Beginner
readingTime: 13
order: 13
keywords:
  - isinstance
- python type checking
- type vs isinstance
- inheritance
- multiple type checking
- defensive programming
- input validation
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# Checking Data Types with `isinstance()`

## Why Do We Need to Check Data Types?

Sometimes a Python program receives data without knowing exactly what type it will be.

For example:

```python id="9ydm6r"
price = input("Enter price: ")
```

The user might enter:

```text id="0jjj8c"
499
```

But Python receives:

```python id="u7zq0x"
"499"
```

which is a string.

Before performing an operation, it can be useful to check what type of value we have.

Python provides two commonly used tools:

```python id="49gl1g"
type()
```

and:

```python id="b0s48q"
isinstance()
```

---

# 1. Using `type()`

The `type()` function tells us the type of an object.

Example:

```python id="4k6jvp"
age = 25
name = "Sumit"
price = 99.99

print(type(age))
print(type(name))
print(type(price))
```

Output:

```text id="7f8fgr"
<class 'int'>
<class 'str'>
<class 'float'>
```

You can also compare the result of `type()`:

```python id="cn6jci"
age = 25

print(type(age) is int)
```

Output:

```text id="s1fj9t"
True
```

This checks whether the object's **exact type** is `int`.

---

# 2. Using `isinstance()`

`isinstance()` checks whether a value belongs to a particular type.

Syntax:

```python id="a8p3d6"
isinstance(value, type)
```

Example:

```python id="zglqfr"
age = 25

print(isinstance(age, int))
```

Output:

```text id="9eqf3s"
True
```

Another example:

```python id="u8rj6g"
name = "Sumit"

print(isinstance(name, str))
```

Output:

```text id="s2mb9v"
True
```

If the type doesn't match:

```python id="3gtm5q"
name = "Sumit"

print(isinstance(name, int))
```

Output:

```text id="7bhq9d"
False
```

---

# 3. `type()` vs `isinstance()`

For beginners, the difference can be remembered like this:

```text id="9h1j7p"
type()
→ "What is the exact type of this object?"

isinstance()
→ "Is this object an instance of this type?"
```

Example:

```python id="q1y2xe"
value = 100

print(type(value) is int)
print(isinstance(value, int))
```

Both produce:

```text id="g5y7nw"
True
True
```

For normal type checking, `isinstance()` is usually more flexible.

---

# 4. Why is `isinstance()` More Flexible?

Python supports **inheritance**.

Inheritance means that one class can be based on another class.

You don't need to know how to create classes yet. Just remember that an object can sometimes belong to a more specialized type while still being related to another type.

A simple example is Python's Boolean type:

```python id="h1qk8x"
True
False
```

`bool` is a subclass of `int`.

Therefore:

```python id="f0n4de"
print(isinstance(True, int))
```

returns:

```text id="j4z0tw"
True
```

But:

```python id="xxb2z6"
print(type(True) is int)
```

returns:

```text id="0p2d9a"
False
```

Why?

Because the exact type of `True` is `bool`, not `int`.

So:

```text id="8p4k3v"
type(True) is int
→ False

isinstance(True, int)
→ True
```

---

# 5. Basic `isinstance()` Examples

Let's check several values.

```python id="19vwwz"
age = 24
name = "Rohan"
skills = ["Python", "SQL"]
is_registered = True

print("Age is int:", isinstance(age, int))
print("Name is str:", isinstance(name, str))
print("Skills is list:", isinstance(skills, list))
print("Registered is bool:", isinstance(is_registered, bool))
```

Output:

```text id="h2a1gk"
Age is int: True
Name is str: True
Skills is list: True
Registered is bool: True
```

This is useful when your program needs to verify incoming data.

---

# 6. Checking Multiple Types

Sometimes a value can be one of several acceptable types.

For example, a price might be:

```python id="jq0vxl"
500
```

or:

```python id="k0k4fk"
500.50
```

We can check both types using a tuple:

```python id="4ys2dw"
price = 500.50

print(isinstance(price, (int, float)))
```

Output:

```text id="4glp2b"
True
```

The tuple:

```python id="q31y2h"
(int, float)
```

means:

> "Accept either `int` or `float`."

---

# 7. More Multiple-Type Examples

```python id="8rj6bv"
value = 25

print(isinstance(value, (int, float)))
```

Output:

```text id="2f0h0e"
True
```

For a string:

```python id="wmz4tx"
value = "25"

print(isinstance(value, (int, float)))
```

Output:

```text id="1v0t5z"
False
```

So the tuple is useful when a function accepts multiple possible types.

---

# 8. Why Not Use a List?

This is correct:

```python id="x8m7b4"
isinstance(value, (int, float))
```

This is incorrect:

```python id="c3q2z1"
isinstance(value, [int, float])
```

The second argument of `isinstance()` must be:

* A type
* A tuple of types
* Or, in modern Python, a supported union type

A list is not valid here.

---

# 9. Checking Multiple Types with Python 3.10+

Python 3.10 introduced another syntax for expressing type alternatives.

You can write:

```python id="xq3y3b"
value = 25.5

print(isinstance(value, int | float))
```

Output:

```text id="x2l5gq"
True
```

You may also see:

```python id="4lmx3s"
isinstance(value, (int, float))
```

Both can express the idea of accepting an integer or a float.

### Beginner recommendation

For now, learn this form first:

```python id="5i5m2z"
isinstance(value, (int, float))
```

It is simple and widely understood.

---

# 10. The Boolean Special Case

Remember:

```python id="x1h7g4"
bool
```

is a subclass of:

```text id="n5o1pa"
int
```

Therefore:

```python id="6l1v9r"
print(isinstance(True, int))
print(isinstance(False, int))
```

Output:

```text id="1q2n9a"
True
True
```

This can sometimes cause unexpected results.

Suppose you want to accept only actual integers and **not Boolean values**.

You can write:

```python id="c4q7r0"
def is_strict_integer(value):
    return isinstance(value, int) and not isinstance(value, bool)
```

Test it:

```python id="j1l3ws"
print(is_strict_integer(42))
print(is_strict_integer(True))
print(is_strict_integer(0))
```

Output:

```text id="7h0z5n"
True
False
True
```

This is an advanced detail, but it is useful to know.

---

# 11. Creating a Simple Validation Function

Let's create a function that expects a number.

```python id="f6zq0d"
def double_number(value):

    if not isinstance(value, (int, float)):
        raise TypeError("Value must be a number.")

    return value * 2
```

Now we can use it:

```python id="0k4g3j"
print(double_number(10))
print(double_number(5.5))
```

Output:

```text id="1h7n0x"
20
11.0
```

But if someone passes a string:

```python id="z8x1wp"
double_number("10")
```

the function raises:

```text id="y3r8kx"
TypeError
```

This is called **input validation**.

---

# 12. What is Defensive Programming?

**Defensive programming** means writing code that checks unexpected or invalid input before using it.

Imagine this function:

```python id="kq7n0a"
def calculate_total(price, quantity):
    return price * quantity
```

What if someone passes:

```python id="j9f8y6"
price = "500"
quantity = 2
```

The result may not be what you expect.

A safer version can validate the input:

```python id="m5z6kd"
def calculate_total(price, quantity):

    if not isinstance(price, (int, float)):
        raise TypeError("Price must be a number.")

    if not isinstance(quantity, int):
        raise TypeError("Quantity must be an integer.")

    return price * quantity
```

Now the function clearly communicates what it expects.

---

# 13. Example: Simple Student Validation

```python id="z5q6kp"
def register_student(name, age):

    if not isinstance(name, str):
        raise TypeError("Name must be a string.")

    if not isinstance(age, int):
        raise TypeError("Age must be an integer.")

    print(f"Student {name} registered successfully.")


register_student("Rahul", 21)
```

Output:

```text id="2z6p8s"
Student Rahul registered successfully.
```

If we pass:

```python id="w9s2ma"
register_student(100, 21)
```

Python raises a `TypeError` because the name should be a string.

---

# 14. `isinstance()` with Strings

String checking is very common.

```python id="7x5jqp"
username = "sumit123"

if isinstance(username, str):
    print("Username is valid type.")
```

Output:

```text id="h4j3g7"
Username is valid type.
```

You can combine type checking with other conditions:

```python id="y6p1na"
username = "sumit123"

if isinstance(username, str) and username.strip():
    print("Username contains text.")
```

Here:

```text id="h4g3w2"
isinstance(username, str)
→ checks the type

username.strip()
→ checks whether useful text remains
```

---

# 15. `isinstance()` with Lists

You can also check collections.

```python id="u8y7cv"
courses = ["Python", "SQL", "Excel"]

if isinstance(courses, list):
    print("Courses are stored in a list.")
```

Output:

```text id="8p5h2s"
Courses are stored in a list.
```

You can also check a tuple:

```python id="t1j9qf"
coordinates = (29.95, 78.16)

print(isinstance(coordinates, tuple))
```

Output:

```text id="8z7j1x"
True
```

---

# 16. `type()` vs `isinstance()` — Comparison

| Feature                     | `isinstance()`       | `type()`                       |
| --------------------------- | -------------------- | ------------------------------ |
| Check an object's type      | Yes                  | Yes                            |
| Check exact type            | Not its main purpose | Yes                            |
| Understands inheritance     | Yes                  | No when using exact comparison |
| Check multiple types        | Yes, using tuple     | Requires extra logic           |
| Common for input validation | Yes                  | Sometimes                      |
| Beginner-friendly           | Yes                  | Yes                            |

### Example

```python id="y8v2nc"
value = True

print(type(value) is int)
print(isinstance(value, int))
```

Output:

```text id="0q5gcz"
False
True
```

---

# 17. When Should You Use `type()`?

`type()` is very useful when you simply want to **inspect** a value.

For example:

```python id="n8j3xb"
data = 100

print(type(data))
```

Output:

```text id="5n0w6k"
<class 'int'>
```

It is also useful when you intentionally need to check for an **exact type**.

Example:

```python id="v5j8x0"
if type(value) is int:
    print("This is exactly an int.")
```

However, for general type validation, `isinstance()` is usually the better choice.

---

# 18. A Practical Example

Let's create a simple calculator that accepts integers or floats.

```python id="w4y7qb"
def calculate_discount(price, discount_percent):

    if not isinstance(price, (int, float)):
        raise TypeError("Price must be a number.")

    if not isinstance(discount_percent, (int, float)):
        raise TypeError("Discount must be a number.")

    discount = price * discount_percent / 100

    return price - discount


final_price = calculate_discount(1000, 10)

print("Final Price:", final_price)
```

Output:

```text id="h7s5kq"
Final Price: 900.0
```

The function accepts:

```python id="h5c8q1"
calculate_discount(1000, 10)
```

and:

```python id="g2v9s4"
calculate_discount(1000.50, 15.5)
```

because both `int` and `float` are allowed.

---

# 19. Common Beginner Mistakes

## Mistake 1: Using `isinstance()` incorrectly

Wrong:

```python id="5a6p8d"
isinstance(25, [int, float])
```

Correct:

```python id="0m7x2v"
isinstance(25, (int, float))
```

---

## Mistake 2: Thinking `isinstance(True, int)` is False

It is actually:

```python id="e2q4y7"
isinstance(True, int)
```

Output:

```text id="3j7k1a"
True
```

because `bool` is a subclass of `int`.

---

## Mistake 3: Using type checking as a replacement for conversion

This:

```python id="n3z5q0"
age = "25"
```

does not become an integer just because you check:

```python id="4j9s6w"
isinstance(age, int)
```

The result is:

```text id="h7v2x9"
False
```

If you need an integer, convert it:

```python id="d5k3r8"
age = int(age)
```

---

## Mistake 4: Forgetting that validation and conversion are different

### Validation

```python id="q9x1cz"
isinstance(value, int)
```

asks:

> "Is this already an integer?"

### Conversion

```python id="x4w8na"
int(value)
```

asks:

> "Can Python convert this value into an integer?"

These are different operations.

---

# Do's and Don'ts

| Situation               | Don't                                   | Do                                       |
| ----------------------- | --------------------------------------- | ---------------------------------------- |
| Check general type      | Always use `type(x) == int`             | Prefer `isinstance(x, int)`              |
| Multiple types          | `isinstance(x, [int, float])`           | `isinstance(x, (int, float))`            |
| Need conversion         | Only check with `isinstance()`          | Use `int()`, `float()`, etc.             |
| Validate function input | Assume input is correct                 | Check important inputs                   |
| Exact type required     | Use flexible subclass check             | `type(x) is SomeType` can be appropriate |
| Boolean as integer      | Assume `isinstance(True, int)` is false | Remember `bool` is a subclass of `int`   |

---

# Quick Revision Summary

```text id="f9g3cz"
isinstance() CHEAT SHEET

Basic syntax:

isinstance(value, type)

Example:

isinstance(25, int)
→ True

isinstance("25", int)
→ False


Multiple types:

isinstance(value, (int, float))

→ Accepts either int or float


Python 3.10+:

isinstance(value, int | float)


Important:

isinstance(True, int)
→ True

because bool is a subclass of int.


type():

type(25)
→ <class 'int'>


Main idea:

type()
→ Inspect exact type

isinstance()
→ Check whether an object belongs to a type
   or an allowed type family
```

---

## Practice Quiz

### 1. What does `isinstance(25, int)` return?
A. `False`
B. `25`
C. `True`
D. `int`
**Answer:** C

---

### 2. How do you check whether `value` is either an `int` or a `float`?
A. `isinstance(value, int, float)`
B. `isinstance(value, (int, float))`
C. `isinstance(value, [int, float])`
D. `isinstance(value, int and float)`
**Answer:** B

---

### 3. What is the result of `isinstance(True, int)`?
A. `False`
B. `True`
C. `TypeError`
D. `None`
**Answer:** B

---

### 4. What happens with this code?
```python
isinstance(50, [int, float])
```
A. Returns `True`
B. Returns `False`
C. Raises `TypeError`
D. Converts `50` to a list
**Answer:** C

---

### 5. Which expression is `True`?
```python
data = "Python"
```
A. `isinstance(data, int)`
B. `isinstance(data, (int, float))`
C. `isinstance(data, (str, list))`
D. `type(data) is int`
**Answer:** C

---

# Hands-On Practice Challenge

## Challenge 13: Defensive Student Registration

Create a function that safely validates student information before registering the student.

Your function should accept:

```text
name
age
course
```

### Requirements

1. `name` must be a string.
2. `age` must be an integer.
3. `course` must be a string.
4. If the input type is incorrect, raise `TypeError`.
5. Print a success message when all values are valid.

### Starter Code

```python id="8h1z7m"
def register_student(name, age, course):

    if not isinstance(name, str):
        raise TypeError("Name must be a string.")

    if not isinstance(age, int) or isinstance(age, bool):
        raise TypeError("Age must be an integer.")

    if not isinstance(course, str):
        raise TypeError("Course must be a string.")

    print("Student registered successfully!")
    print("Name:", name)
    print("Age:", age)
    print("Course:", course)


register_student(
    "Rahul Sharma",
    21,
    "Python for Beginners"
)
```

### Expected Output

```text id="h5v9xz"
Student registered successfully!
Name: Rahul Sharma
Age: 21
Course: Python for Beginners
```

### Now Test an Invalid Input

Try:

```python id="j2x8kp"
register_student(
    "Rahul Sharma",
    "21",
    "Python for Beginners"
)
```

The function should reject the input because `"21"` is a string, not an integer.

---

# What You Learned

In this lesson, you learned:

* What `type()` does
* What `isinstance()` does
* The difference between `type()` and `isinstance()`
* Why `isinstance()` is useful for general type checking
* How to check multiple types
* How tuple-based type checking works
* Modern `int | float` syntax
* Why `isinstance(True, int)` is `True`
* How to perform defensive input validation
* The difference between validation and conversion
* How to raise a `TypeError` for invalid input
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Integer, Float, Complex** (4: Numbers).

👉 **[Continue to Next Lesson: Integer, Float, Complex →](/tutorials/python-for-beginners/integer-float-complex)**
