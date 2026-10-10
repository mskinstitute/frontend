---
id: python-data-types-overview
slug: data-types-overview
course: python-for-beginners
chapter: 3
topic: 3.1
title: Data Types Overview
description: Master Python built-in data types, categorize scalar primitives vs compound collections, and understand the crucial distinction between mutable and immutable objects.
difficulty: Beginner
readingTime: 14
order: 11
keywords:
  - python data types
  - primitives vs collections
  - mutable vs immutable
  - int float str bool
  - list tuple set dict
  - none type
  - python collections
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# Python Data Types Overview

## What is a Data Type?

A **data type** tells Python what kind of value we are working with.

For example:

```python
age = 25
name = "Sumit"
price = 99.99
is_student = True
```

These variables contain different kinds of data:

```text
25       → integer
"Sumit"  → text
99.99    → decimal number
True     → Boolean value
```

Python needs to know the type of a value because different types support different operations.

For example:

```python
10 + 20
```

makes sense because these are numbers.

But:

```python
"Hello" + "World"
```

also works because both values are strings.

Python is **dynamically typed**, which means you normally do not have to declare the data type before creating a variable.

For example, you can simply write:

```python
age = 25
```

Python understands that `25` is an integer.

---

# A Simple Real-World Analogy

Think about organizing items in a kitchen.

You might have:

```text
Single items
├── Number → 10
├── Decimal → 3.14
├── Text → "Salt"
└── True/False → True

Collections
├── List → [1, 2, 3]
├── Tuple → (1, 2, 3)
├── Set → {1, 2, 3}
└── Dictionary → {"name": "Sumit"}
```

Different containers are useful for different purposes.

Python data types work in a similar way.

---

# Main Python Data Types

For beginners, these are the most important built-in types to learn:

| Data Type  | Example             | Used For                         |
| ---------- | ------------------- | -------------------------------- |
| `int`      | `25`                | Whole numbers                    |
| `float`    | `99.99`             | Decimal numbers                  |
| `complex`  | `3 + 2j`            | Complex numbers                  |
| `bool`     | `True`              | True/False values                |
| `str`      | `"Hello"`           | Text                             |
| `NoneType` | `None`              | No value / absence of value      |
| `list`     | `[1, 2, 3]`         | Ordered, changeable collection   |
| `tuple`    | `(1, 2, 3)`         | Ordered, unchangeable collection |
| `set`      | `{1, 2, 3}`         | Unique values                    |
| `dict`     | `{"name": "Sumit"}` | Key-value data                   |

You don't need to memorize everything immediately.

We will learn each type step by step.

---

# 1. `int` — Integer

An `int` stores **whole numbers**.

Examples:

```python
age = 25
students = 100
temperature = -5
```

You can perform mathematical operations with integers:

```python
a = 10
b = 5

print(a + b)
print(a - b)
print(a * b)
print(a / b)
```

### Output

```text
15
5
50
2.0
```

Notice that `/` produces a decimal value in Python.

---

# 2. `float` — Decimal Numbers

A `float` stores numbers that contain a decimal part.

Examples:

```python
price = 99.99
temperature = 36.6
percentage = 85.5
```

Example:

```python
price = 499.50
quantity = 2

total = price * quantity

print(total)
```

### Output

```text
999.0
```

Use `float` when you need decimal values.

---

# 3. `str` — Text

A `str` stores text.

Strings are written inside quotes.

```python
name = "Sumit"
city = "Haridwar"
course = "Python for Beginners"
```

You can combine strings:

```python
first_name = "Sumit"
last_name = "Kumar"

full_name = first_name + " " + last_name

print(full_name)
```

### Output

```text
Sumit Kumar
```

Strings can contain:

* Letters
* Numbers
* Spaces
* Symbols
* Special characters

Example:

```python
message = "Python 3 is easy to learn!"
```

---

# 4. `bool` — True or False

A Boolean value represents one of two possibilities:

```python
True
False
```

Example:

```python
is_logged_in = True
has_paid = False
```

Boolean values are commonly used when making decisions.

For example:

```python
age = 20

is_adult = age >= 18

print(is_adult)
```

### Output

```text
True
```

We will use Boolean values extensively when we learn `if` statements.

---

# 5. `None` — No Value

`None` represents the **absence of a value**.

Example:

```python
middle_name = None
```

This can mean:

> "There is currently no middle name."

Another example:

```python
result = None
```

This can mean:

> "We don't have a result yet."

### Important

`None` is different from:

```python
0
```

and:

```python
""
```

They mean different things.

```text
0   → a number whose value is zero
""  → an empty string
None → no value / value is not available
```

---

# 6. `list` — Ordered and Changeable Collection

A list stores multiple values in one variable.

Example:

```python
fruits = ["Apple", "Banana", "Mango"]
```

A list:

* Keeps items in order
* Can contain duplicate values
* Can be changed

Example:

```python
fruits = ["Apple", "Banana", "Mango"]

fruits.append("Orange")

print(fruits)
```

### Output

```text
['Apple', 'Banana', 'Mango', 'Orange']
```

Because a list can be changed, it is called **mutable**.

---

# 7. `tuple` — Ordered and Unchangeable Collection

A tuple also stores multiple values.

Example:

```python
coordinates = (28.61, 77.20)
```

A tuple:

* Keeps items in order
* Can contain duplicate values
* Cannot be changed after creation

For example:

```python
coordinates = (28.61, 77.20)
```

You cannot do:

```python
coordinates[0] = 30.00
```

Python will raise a `TypeError`.

A tuple is called **immutable** because its contents cannot be changed in-place.

### Simple idea

```text
list  → can change
tuple → cannot change
```

---

# 8. `set` — Unique Values

A set stores unique values.

Example:

```python
subjects = {"Python", "SQL", "Excel", "Python"}

print(subjects)
```

The duplicate `"Python"` is removed.

The result contains only unique values.

```text
{'Python', 'SQL', 'Excel'}
```

A set is useful when you care about **uniqueness**.

For example:

```python
skills = {"Python", "SQL", "Python", "Excel"}

print(skills)
```

You don't need to manually remove duplicates.

### Important

Sets do not provide normal list-style indexing.

For example, this is not how you should access set elements:

```python
skills[0]
```

A set is mainly used for unique values and set operations.

---

# 9. `dict` — Key-Value Pairs

A dictionary stores information using:

```text
key → value
```

Example:

```python
student = {
    "name": "Sumit",
    "age": 25,
    "city": "Haridwar"
}
```

Here:

```text
"name" → "Sumit"
"age"  → 25
"city" → "Haridwar"
```

You can access a value using its key:

```python
print(student["name"])
```

### Output

```text
Sumit
```

Dictionaries are extremely useful for storing structured information.

---

# Quick Comparison of Collections

| Type    | Ordered | Changeable | Duplicates          |
| ------- | ------- | ---------- | ------------------- |
| `list`  | Yes     | Yes        | Yes                 |
| `tuple` | Yes     | No         | Yes                 |
| `set`   | No      | Yes        | No                  |
| `dict`  | Yes*    | Yes        | Keys must be unique |

* Dictionaries preserve insertion order in modern Python versions.

### Easy way to remember

```text
LIST
→ Ordered + Changeable

TUPLE
→ Ordered + Not Changeable

SET
→ Unique Values

DICT
→ Key → Value
```

---

# 10. What is Mutability?

**Mutability** means whether an object can be changed after it has been created.

### Mutable

A mutable object can be changed.

Examples:

```text
list
dict
set
bytearray
```

Example:

```python
shopping_cart = ["Laptop", "Mouse"]

shopping_cart.append("Keyboard")

print(shopping_cart)
```

The same list has been modified.

---

# 11. What is Immutability?

An immutable object cannot be changed after it has been created.

Common immutable types include:

```text
int
float
complex
bool
str
tuple
frozenset
```

Example:

```python
name = "Sumit"
```

Strings cannot be modified in-place.

Instead, when you create a new string value, Python uses a new string object.

For beginners, remember:

```text
Mutable
→ Can be changed

Immutable
→ Cannot be changed
```

---

# Mutable vs Immutable — Simple Example

### Mutable List

```python
cart = ["Laptop", "Mouse"]

cart.append("Keyboard")

print(cart)
```

Output:

```text
['Laptop', 'Mouse', 'Keyboard']
```

The list changed.

### Immutable String

```python
name = "Sumit"

name = name + " Kumar"

print(name)
```

Output:

```text
Sumit Kumar
```

Here, Python creates the new string value rather than changing the original string in-place.

---

# 12. How to Check a Data Type

Python provides the `type()` function.

Example:

```python
age = 25
name = "Sumit"
price = 99.99
is_student = True

print(type(age))
print(type(name))
print(type(price))
print(type(is_student))
```

### Output

```text
<class 'int'>
<class 'str'>
<class 'float'>
<class 'bool'>
```

This is one of the most useful tools for beginners.

Whenever you're unsure about a value's type, try:

```python
type(value)
```

---

# 13. Using `type()` with Multiple Values

Let's inspect several values:

```python
student_count = 145
temperature = 36.6
student_name = "Arjun"
is_enrolled = True
scholarship = None

print(type(student_count))
print(type(temperature))
print(type(student_name))
print(type(is_enrolled))
print(type(scholarship))
```

### Output

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

Notice:

```python
type(None)
```

returns:

```text
<class 'NoneType'>
```

---

# 14. Using `isinstance()`

Another useful function is `isinstance()`.

It checks whether a value belongs to a particular type.

Example:

```python
age = 25

print(isinstance(age, int))
```

Output:

```text
True
```

Another example:

```python
name = "Sumit"

print(isinstance(name, int))
```

Output:

```text
False
```

### Simple difference

```text
type()
→ Tells you the type

isinstance()
→ Checks whether a value is an instance of a type
```

---

# 15. A Special Feature of `bool`

Python's `bool` type is related to `int`.

For example:

```python
print(True == 1)
print(False == 0)
```

Output:

```text
True
True
```

Also:

```python
print(isinstance(True, int))
```

Output:

```text
True
```

This happens because `bool` is a subclass of `int` in Python.

You may occasionally see Boolean values behaving like `1` and `0` in calculations:

```python
print(True + True)
print(False + 10)
```

Output:

```text
2
10
```

### Beginner Tip

You don't need to use this behavior in normal programs.

For now, simply remember:

> `True` and `False` are Boolean values used for logical decisions.

---

# 16. Choosing the Right Data Type

Different situations require different types.

### Student names

Use `str`:

```python
student_name = "Rahul"
```

### Student age

Use `int`:

```python
age = 21
```

### Course price

Use `float`:

```python
course_price = 4999.99
```

### Student enrollment status

Use `bool`:

```python
is_enrolled = True
```

### List of courses

Use `list`:

```python
courses = ["Python", "SQL", "Excel"]
```

### Fixed coordinates

Use `tuple`:

```python
coordinates = (29.95, 78.16)
```

### Unique skills

Use `set`:

```python
skills = {"Python", "SQL", "Excel"}
```

### Student profile

Use `dict`:

```python
student = {
    "name": "Rahul",
    "age": 21,
    "course": "Python"
}
```

---

# 17. Common Beginner Mistakes

## Mistake 1: Confusing `list` and `tuple`

```python
items = [1, 2, 3]
```

List → changeable.

```python
items = (1, 2, 3)
```

Tuple → not changeable.

---

## Mistake 2: Thinking a set keeps duplicates

```python
numbers = {1, 2, 2, 3}
```

The duplicate `2` is removed.

---

## Mistake 3: Using `None` like zero

```python
score = None
```

does not mean:

```text
score = 0
```

It means there is currently no value.

---

## Mistake 4: Forgetting quotes around text

Correct:

```python
name = "Sumit"
```

Incorrect:

```python
name = Sumit
```

Without quotes, Python treats `Sumit` as a variable name.

---

## Mistake 5: Expecting strings to change in-place

Strings are immutable.

```python
name = "Sumit"
```

To create a different value:

```python
name = name + " Kumar"
```

---

# Do's and Don'ts

| Situation             | Don't                           | Do               | Reason                                  |
| --------------------- | ------------------------------- | ---------------- | --------------------------------------- |
| Text                  | `name = Sumit`                  | `name = "Sumit"` | Text needs quotes                       |
| Changeable collection | Tuple                           | List             | Lists can be modified                   |
| Fixed collection      | List                            | Tuple            | Tuples cannot be changed                |
| Unique values         | List + manual duplicate removal | Set              | Set keeps unique values                 |
| Structured data       | Many separate variables         | Dictionary       | Key-value structure is easier to manage |
| No value              | `0` or `""`                     | `None`           | Clearly represents absence of a value   |
| Check type            | Guess                           | `type(value)`    | Python tells you the type               |

---

# Quick Revision Summary

```text
PYTHON DATA TYPES CHEAT SHEET

NUMBERS
int      → 10, 25, -5
float    → 10.5, 99.99
complex  → 3 + 2j

TEXT
str      → "Hello Python"

LOGICAL
bool     → True / False

NO VALUE
None     → represents absence of a value

COLLECTIONS
list     → [1, 2, 3]
           Ordered, Mutable, Duplicates allowed

tuple    → (1, 2, 3)
           Ordered, Immutable, Duplicates allowed

set      → {1, 2, 3}
           Unique values

dict     → {"name": "Sumit"}
           Key → Value

CHECK TYPE
type(value)

CHECK TYPE COMPATIBILITY
isinstance(value, type)
```

---

## Practice Quiz

### 1. Which data type is mutable?
A. `str`
B. `tuple`
C. `list`
D. `int`
**Answer:** C

---

### 2. What is the data type of `None`?
A. `null`
B. `NoneType`
C. `empty`
D. `void`
**Answer:** B

---

### 3. Which data type is used to store text?
A. `int`
B. `float`
C. `str`
D. `bool`
**Answer:** C

---

### 4. Which collection automatically keeps only unique values?
A. `list`
B. `tuple`
C. `set`
D. `dict`
**Answer:** C

---

### 5. Which data type is best for storing key-value information?
A. `list`
B. `dict`
C. `float`
D. `bool`
**Answer:** B

---

### 6. Which function can be used to check the type of a value?
A. `check()`
B. `datatype()`
C. `type()`
D. `typeof()`
**Answer:** C

---

### 7. Which statement about a tuple is correct?
A. A tuple can always be modified using `.append()`
B. A tuple is mutable
C. A tuple is ordered and immutable
D. A tuple automatically removes duplicates
**Answer:** C

---

# Hands-On Practice Challenge

## Challenge 11: Student Profile

Create a Python program that stores information about a student using different data types.

Use:

* `int` for student ID
* `str` for name
* `float` for CGPA
* `bool` for scholarship status
* `None` for remarks when there are no remarks
* `tuple` for completed semesters
* `list` for current courses
* `set` for unique skills
* `dict` for the complete student profile

### Example Solution

```python
student = {
    "student_id": 9042,
    "name": "Divya Mehra",
    "cgpa": 9.42,
    "is_scholarship_holder": True,
    "remarks": None,
    "completed_semesters": (1, 2, 3, 4),
    "current_courses": ["Python", "SQL", "Excel"],
    "skills": {"Python", "SQL", "Python"}
}

print("Student Name:", student["name"])
print("Student ID:", student["student_id"])
print("CGPA:", student["cgpa"])
print("Scholarship:", student["is_scholarship_holder"])
print("Remarks:", student["remarks"])

print("Courses:", student["current_courses"])
print("Skills:", student["skills"])
print("Completed Semesters:", student["completed_semesters"])
```

### Now Try This

Add a new course:

```python
student["current_courses"].append("Power BI")
```

Then print the courses again.

Next, try changing a semester:

```python
student["completed_semesters"][0] = 5
```

You will get a `TypeError` because tuples are immutable.

This small exercise helps you understand the difference between:

```text
list  → mutable
tuple → immutable
```

---

# What You Learned

In this lesson, you learned:

* What a data type is
* Why Python is dynamically typed
* `int` for whole numbers
* `float` for decimal numbers
* `str` for text
* `bool` for True/False
* `None` for absence of a value
* `list` for ordered, changeable collections
* `tuple` for ordered, unchangeable collections
* `set` for unique values
* `dict` for key-value data
* Mutable vs immutable objects
* How to use `type()`
* How to use `isinstance()`
* Why choosing the correct data type matters
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Type Conversion (Casting & type())** (3: Data Types).

👉 **[Continue to Next Lesson: Type Conversion (Casting & type()) →](/tutorials/python-for-beginners/type-conversion-casting-type)**
