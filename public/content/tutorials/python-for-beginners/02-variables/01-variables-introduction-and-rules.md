---
id: variables-introduction-and-rules
slug: variables-introduction-and-rules
course: python-for-beginners
chapter: Variables
topic: "Variables Introduction and Naming Rules: Identifiers and Reserved Keywords"
difficulty: Beginner
readingTime: 12
order: 6
keywords: ["python variables", "variable naming rules", "python keywords", "identifiers in python", "snake_case python", "keyword.kwlist"]
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---



# 🐍 Python Variables: Introduction and Naming Rules

In the previous lessons, we learned how to write Python code and follow Python's syntax rules.

Now we are ready to learn one of the most important concepts in programming:

> **Variables**

Variables allow us to **store information and use it later in our program**.

By the end of this lesson, you will understand:

* What a variable is
* How to create a variable
* What an identifier is
* Rules for naming variables
* Python's reserved keywords
* `snake_case` naming
* Constants and class naming conventions
* How to check whether a name is valid
* How to check Python keywords using the `keyword` module

---

# 1. What is a Variable?

A **variable** is a name that refers to a value in a Python program.

Think about your kitchen.

You may have containers with labels such as:

* 🧂 Salt
* 🌿 Cumin
* 🌶️ Chili
* 🟡 Turmeric

The label helps you identify what is inside each container.

Variables work in a similar way.

For example:

```python
student_name = "Amit"
age = 18
```

Here:

* `student_name` is the variable name.
* `"Amit"` is the value.
* `age` is another variable name.
* `18` is its value.

You can think of it like this:

```text
student_name  →  "Amit"
age           →  18
```

### 💡 Beginner Tip

Don't worry about the complicated details of computer memory yet.

For now, remember:

> **A variable gives a meaningful name to a value so that we can use that value later.**

---

# 2. Creating a Variable

Python does **not** require a separate variable declaration.

You can create a variable simply by assigning a value to a name.

```python
student = "Amit"
age = 18
```

Python understands that:

```text
student → "Amit"
age     → 18
```

You can then use the variables:

```python
print(student)
print(age)
```

Output:

```text
Amit
18
```

---

## Variables Can Store Different Types of Data

A variable can refer to different kinds of values.

```python
name = "Sumit"
age = 25
height = 5.8
is_student = True
```

These values represent different data types:

| Variable     | Value     | Type    |
| ------------ | --------- | ------- |
| `name`       | `"Sumit"` | String  |
| `age`        | `25`      | Integer |
| `height`     | `5.8`     | Float   |
| `is_student` | `True`    | Boolean |

Python determines the type from the value.

You don't have to write the type when creating the variable.

---

# 3. Variables Can Change Their Values

A variable can be assigned a new value.

```python
age = 18

print(age)

age = 19

print(age)
```

Output:

```text
18
19
```

The variable `age` now refers to the new value `19`.

A variable can also refer to a value of a different type:

```python
data = 100

data = "Hello"
```

This is possible in Python because Python is **dynamically typed**.

### 🎯 Remember

You don't need to declare:

```python
int age
```

Instead, simply write:

```python
age = 18
```

---

# 4. What is an Identifier?

An **identifier** is a name used to identify something in Python code.

For example:

```python
student_name = "Amit"
```

`student_name` is an identifier.

Identifiers can be used for things such as:

* Variables
* Functions
* Classes
* Other named objects in Python

So:

> **Variable = a name referring to a value**
> **Identifier = a valid name used in Python code**

For beginners, you can think of a variable name as one common type of identifier.

---

# 5. Rules for Python Variable Names

Python has specific rules for naming variables.

Let's learn them one by one.

---

## Rule 1: Start with a Letter or Underscore

A variable name can start with:

* A letter: `A-Z` or `a-z`
* An underscore: `_`

Examples:

```python
name = "Amit"
student_name = "Amit"
_name = "Amit"
```

All three are valid.

---

## Rule 2: A Variable Cannot Start with a Number

This is invalid:

```python
2name = "Amit"
```

Python does not allow a variable name to begin with a digit.

But numbers can appear **after the first character**:

```python
name2 = "Amit"
student2026 = "Amit"
batch_2026 = "Python"
```

These are valid.

### 💡 Easy Rule

```text
❌ 2student
✅ student2
```

---

## Rule 3: Only Letters, Numbers, and Underscores

Python variable names can contain:

* Letters
* Numbers
* Underscores

Examples:

```python
student_name = "Amit"
student2026 = "Amit"
batch_2026 = "Python"
```

Special characters are not allowed.

For example:

```python
user@email = "test"
price$ = 500
discount% = 10
```

These are invalid variable names.

---

## Rule 4: Spaces Are Not Allowed

This is invalid:

```python
student name = "Amit"
```

Python interprets the space as separating different parts of the statement.

Use an underscore instead:

```python
student_name = "Amit"
```

### ❌ Wrong

```text
student name
```

### ✅ Correct

```text
student_name
```

---

## Rule 5: Hyphens Are Not Allowed

This is invalid:

```python
student-name = "Amit"
```

Why?

Because Python uses `-` as the subtraction operator.

For example:

```python
10 - 5
```

So Python does not treat `student-name` as one variable name.

Use an underscore:

```python
student_name = "Amit"
```

---

# 6. Python is Case-Sensitive

Python treats uppercase and lowercase letters as different.

For example:

```python
student = "Amit"
Student = "Rahul"
STUDENT = "Sumit"
```

These are three different names.

```text
student
Student
STUDENT
```

are not the same identifier.

### ⚠️ Important

For beginners, it is better to avoid creating multiple variables that differ only by capitalization.

Instead of:

```python
name = "Amit"
Name = "Rahul"
NAME = "Sumit"
```

prefer clear and different names.

---

# 7. Valid and Invalid Variable Names

Let's look at some examples.

### ✅ Valid Names

```python
myname = "Sumit"

my_name = "Sumit"

_my_name = "Sumit"

myName = "Sumit"

MYNAME = "Sumit"

myname2 = "Sumit"
```

All of these follow Python's basic naming rules.

However, **valid does not always mean recommended**.

For regular variables, Python programmers usually prefer `snake_case`.

For example:

```python
my_name = "Sumit"
```

is generally clearer than:

```python
myName = "Sumit"
```

---

### ❌ Invalid Names

```python
2myname = "Sumit"

my-name = "Sumit"

my name = "Sumit"

@my_name = "Sumit"

&my_name = "Sumit"
```

Why are they invalid?

| Name       | Problem              |
| ---------- | -------------------- |
| `2myname`  | Starts with a number |
| `my-name`  | Contains `-`         |
| `my name`  | Contains a space     |
| `@my_name` | Contains `@`         |
| `&my_name` | Contains `&`         |

---

# 8. Python Reserved Keywords

Python has some special words that already have a meaning in the language.

These words are called **keywords**.

For example:

```python
if
else
for
while
class
def
return
import
```

These words are part of Python's syntax.

Therefore, you cannot use them as normal variable names.

For example:

```python
class = "Python"
```

This is invalid.

Similarly:

```python
for = 10
```

is invalid.

Python will report a syntax error.

---

# 9. Python Keywords

Python's keyword list can be checked directly from Python.

Run:

```python
import keyword

print(keyword.kwlist)
```

This displays the keywords supported by your installed Python version.

You can also count them:

```python
import keyword

print("Total keywords:", len(keyword.kwlist))
```

### 💡 Important

Don't memorize every keyword immediately.

As you learn Python, you will naturally become familiar with the most commonly used ones.

Some important keywords include:

```text
True
False
None

if
elif
else

for
while
break
continue

def
return
class

try
except
finally

import
from
as

and
or
not
in
is
```

The exact keyword list can vary between Python versions, so checking `keyword.kwlist` is more reliable than memorizing a fixed number.

---

# 10. Checking Whether a Name is a Keyword

Python provides the `keyword` module for this purpose.

```python
import keyword

print(keyword.iskeyword("class"))
```

Output:

```text
True
```

Because `class` is a Python keyword.

Now try:

```python
print(keyword.iskeyword("student"))
```

Output:

```text
False
```

Because `student` is not a Python keyword.

### 🎯 Remember

```python
keyword.iskeyword("word")
```

returns:

* `True` → the word is a keyword
* `False` → the word is not a keyword

---

# 11. PEP 8 Naming Conventions

Python has official style recommendations called **PEP 8**.

PEP 8 helps developers write code that is easier to read and maintain.

Naming conventions are different from syntax rules.

For example:

```python
studentName = "Amit"
```

is a valid Python identifier.

But for a normal variable, PEP 8 recommends:

```python
student_name = "Amit"
```

This style is called **snake_case**.

---

## 11.1 Variables and Functions → snake_case

Use lowercase letters with underscores between words.

```python
student_name = "Amit"

student_count = 50

total_marks = 450

calculate_average = 85
```

### ❌ Less preferred

```python
studentName = "Amit"
```

### ✅ Recommended

```python
student_name = "Amit"
```

---

# 12. Constants → UPPER_CASE

Constants are values that are intended to remain unchanged.

Python commonly uses uppercase names with underscores for constants.

```python
MAX_ATTEMPTS = 3

PI = 3.14159

DATABASE_PORT = 5432
```

This is a **naming convention**, not a rule that prevents the value from changing.

For example:

```python
MAX_ATTEMPTS = 3
MAX_ATTEMPTS = 5
```

Python does not automatically stop you.

The uppercase name simply communicates:

> "This value is intended to be treated as a constant."

---

# 13. Classes → PascalCase

Class names commonly use **PascalCase**.

Each word starts with a capital letter.

Example:

```python
class StudentRecord:
    pass
```

Another example:

```python
class BankAccount:
    pass
```

Notice:

```text
student_name   → snake_case
MAX_ATTEMPTS   → UPPER_CASE
StudentRecord  → PascalCase
```

---

# 14. Valid vs Invalid Names

| Identifier      | Valid? | Explanation                                 |
| --------------- | ------ | ------------------------------------------- |
| `student_marks` | ✅ Yes  | Valid and follows `snake_case`              |
| `_internal_id`  | ✅ Yes  | Can start with `_`                          |
| `batch2026`     | ✅ Yes  | Digits can appear after the first character |
| `2026batch`     | ❌ No   | Cannot start with a number                  |
| `user-name`     | ❌ No   | `-` is not allowed in identifiers           |
| `total marks`   | ❌ No   | Spaces are not allowed                      |
| `class`         | ❌ No   | `class` is a keyword                        |
| `scholar#id`    | ❌ No   | `#` starts a comment                        |

---

# 15. A Useful Python Check: `isidentifier()`

Python strings have a useful method called:

```python
.isidentifier()
```

It checks whether a string follows Python's identifier naming rules.

Example:

```python
name = "student_name"

print(name.isidentifier())
```

Output:

```text
True
```

Now:

```python
name = "2student"

print(name.isidentifier())
```

Output:

```text
False
```

### ⚠️ Important

`isidentifier()` checks whether the name has valid identifier syntax.

It does **not** tell you whether the name is a Python keyword.

For example:

```python
print("class".isidentifier())
```

Output:

```text
True
```

But:

```python
class
```

is still not allowed as a variable name because it is a keyword.

So for a complete check, you can use both:

```python
import keyword

name = "student_name"

valid = name.isidentifier() and not keyword.iskeyword(name)

print(valid)
```

Output:

```text
True
```

---

# 16. Good Variable Naming Practices

A technically valid name is not always a good name.

Compare:

```python
x = 450
```

with:

```python
total_marks = 450
```

The second one immediately tells us what `450` represents.

## Prefer descriptive names

### ❌ Not very clear

```python
x = 32
y = 450
z = 85
```

### ✅ Clearer

```python
student_count = 32
total_marks = 450
average_marks = 85
```

### 🎯 Remember

A good variable name should help another person understand your code without needing to guess.

---

# 17. Do's and Don'ts

| Practice         | ✅ Do                     | ❌ Don't              |
| ---------------- | ------------------------ | -------------------- |
| Clarity          | `daily_temperature = 32` | `t = 32`             |
| Style            | `student_count`          | `studentCount`       |
| Spaces           | `total_marks`            | `total marks`        |
| Hyphens          | `user_name`              | `user-name`          |
| Keywords         | `class_name`             | `class`              |
| Meaningful names | `total_price`            | `x123`               |
| Length           | `student_count`          | Extremely long names |

### 💡 Beginner Tip

Don't make every variable name extremely short.

But also don't create unnecessarily long names.

Good:

```python
total_price
student_count
average_marks
```

Usually not helpful:

```python
the_total_price_of_all_the_products_in_the_shopping_cart
```

---

# 18. Complete Example

Let's put the concepts together.

```python
student_name = "Amit"
student_age = 18
total_marks = 450

print("Student Name:", student_name)
print("Age:", student_age)
print("Total Marks:", total_marks)
```

Output:

```text
Student Name: Amit
Age: 18
Total Marks: 450
```

This example uses:

* Descriptive variable names
* `snake_case`
* Strings
* Integers
* `print()`

---

# 🧠 Quick Summary

Let's review everything we learned.

### Variables

A variable is a name that refers to a value.

```python
age = 18
```

### Identifier

An identifier is a valid name used in Python code.

### Variable Naming Rules

A variable name:

* Can start with a letter or `_`
* Cannot start with a number
* Can contain letters, numbers, and `_`
* Cannot contain spaces
* Cannot contain characters such as `@`, `$`, `%`, `#`
* Cannot be a Python keyword
* Is case-sensitive

### Naming Conventions

| Purpose   | Recommended Style | Example             |
| --------- | ----------------- | ------------------- |
| Variables | `snake_case`      | `student_name`      |
| Functions | `snake_case`      | `calculate_total()` |
| Constants | `UPPER_CASE`      | `MAX_ATTEMPTS`      |
| Classes   | `PascalCase`      | `StudentRecord`     |

### Keyword Check

```python
import keyword

keyword.iskeyword("class")
```

### Identifier Check

```python
"student_name".isidentifier()
```

---

## Practice Quiz

### 1. Which is a valid Python variable name?
A. `2nd_semester_marks`
B. `total-score`
C. `student_roll_number`
D. `class`
**Answer:** C

---

### 2. What happens when you write this?
```python
for = 10
```
A. `TypeError`
B. `SyntaxError`
C. `IndexError`
D. No error
**Answer:** B

---

### 3. Which naming style is recommended for normal Python variables?
A. `camelCase`
B. `snake_case`
C. `kebab-case`
D. `PascalCase`
**Answer:** B

---

### 4. What does Python do with these names?
```python
school
School
SCHOOL
```
A. Treats them as the same name
B. Treats them as different names
C. Produces a warning
D. Automatically combines them
**Answer:** B

---

### 5. How can you check whether a word is a Python keyword?
A.
```python
keyword.iskeyword("word")
```
B.
```python
sys.is_reserved("word")
```
C.
```python
python.check("word")
```
D.
```python
check_keyword("word")
```
**Answer:** A

---

# 💻 Hands-On Practice Challenge

## Challenge 6: Variable Name Inspector

Create a file named:

```text
variable_naming_lab.py
```

Then write:

```python
import keyword

print("=" * 55)
print("PYTHON VARIABLE NAME INSPECTOR")
print("=" * 55)

candidate_names = [
    "student_name",
    "batch_2026",
    "_internal_token",
    "2nd_rank",
    "user-email",
    "total score",
    "class",
    "True",
    "total_marks"
]

print(f"{'Name':<20} | {'Keyword':<10} | {'Status'}")
print("-" * 55)

for name in candidate_names:

    is_keyword = keyword.iskeyword(name)
    is_valid = name.isidentifier() and not is_keyword

    if is_valid:
        status = "VALID"
    elif is_keyword:
        status = "KEYWORD"
    else:
        status = "INVALID"

    print(f"{name:<20} | {str(is_keyword):<10} | {status}")

print("=" * 55)
```

### What does this program teach?

This small program checks three things:

1. Is the name a valid identifier?
2. Is the name a Python keyword?
3. What is the final status of the name?

For example:

```text
student_name       → VALID
batch_2026         → VALID
2nd_rank           → INVALID
user-email         → INVALID
class              → KEYWORD
```

---

# 🎯 Your Practice Task

Modify the program and add these names:

```text
student_age
student-age
student age
2026_batch
_batch
total_marks
return
myName
```

Before running the program, **predict which names will be valid**.

Then run the program and compare your answers.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Creating a Variable** (2: Variables).

👉 **[Continue to Next Lesson: Creating a Variable →](/tutorials/python-for-beginners/creating-a-variable)**
