---
id: comments-best-practices
slug: comments-best-practices
course: python-for-beginners
chapter: Introduction and Setup
topic: "Comments and Best Practices: Single-line, Multi-line, Docstrings, and PEP 8"
difficulty: Beginner
readingTime: 12
order: 5
keywords: ["python comments", "single line comments python", "python docstrings", "pep 8 comments", "multiline comments python", "__doc__ attribute", "python code readability", "python best practices"]
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# 💬 Python Comments and Best Practices

Imagine you are reading a notebook written by someone else.

The notebook contains many calculations, but there are no notes explaining **why** a calculation was done.

It may be difficult to understand.

Programming can be the same.

Code tells the computer **what to do**, while comments and documentation can help humans understand the code.

In this lesson, we will learn:

* What comments are
* How to write single-line comments
* How to write comments next to code
* What docstrings are
* The difference between comments and docstrings
* How to write useful comments
* Some simple Python coding best practices

---

# 🧠 What is a Comment?

A **comment** is a note written inside your code for humans.

Python does not execute a normal `#` comment as a Python instruction.

For example:

```python id="r7c4c7"
# This program displays a welcome message

print("Welcome to Python!")
```

The first line is a comment.

Python ignores it when executing the program.

The second line is actual Python code.

---

# 🔹 Single-Line Comments

A single-line comment starts with:

```text id="e1p1h6"
#
```

Everything after `#` on that line is treated as a comment.

For example:

```python id="v7bl9a"
# Store the student's name
student_name = "Rohan"

# Display the name
print(student_name)
```

Comments make the code easier for another person to understand.

---

# 💡 Why Do We Use Comments?

Comments can be useful for several reasons.

### 1. Explain a difficult part of the code

```python id="qpgj5w"
# Convert the temperature from Celsius to Fahrenheit
fahrenheit = (celsius * 9 / 5) + 32
```

### 2. Leave a note for another developer

```python id="8zn3xa"
# This function is also used by the reporting module
```

### 3. Temporarily prevent a line from running

For example:

```python id="r3zq7f"
print("First message")
# print("Second message")
print("Third message")
```

Output:

```text id="2b6l2k"
First message
Third message
```

The commented-out line is not executed.

> ⚠️ **Good Practice:**
> Don't leave large amounts of old code commented out forever. Once you know you don't need the code, remove it. Version-control tools such as Git can preserve previous versions.

---

# ✏️ Inline Comments

A comment can also be written on the same line as code.

For example:

```python id="qprf1c"
age = 20  # Student's age
```

Here:

```text id="d1p6jz"
age = 20
```

is the Python code, and:

```text id="5c4tq1"
# Student's age
```

is the comment.

According to common PEP 8 style, an inline comment is normally separated from the code by at least **two spaces**.

Good:

```python id="e4a2nv"
age = 20  # Student's age
```

Less readable:

```python id="nq4b1z"
age = 20#Student's age
```

---

# 🎯 What Should a Good Comment Explain?

A good comment should provide useful information.

For example:

```python id="rq9nys"
# Convert the price to INR before calculating the final bill
price_inr = price * exchange_rate
```

This gives the reader useful context.

But this comment is not very useful:

```python id="0vh0x3"
age = age + 1  # Add 1 to age
```

The code already clearly tells us what is happening.

### Better rule:

> **Use comments when they add useful information that is not obvious from the code itself.**

---

# 📝 Comments vs. Code

Good code should be understandable by itself as much as possible.

Compare:

```python id="7m0e8p"
x = 10
y = 20
z = x + y
```

with:

```python id="4f0f4q"
first_student_marks = 10
second_student_marks = 20
total_marks = first_student_marks + second_student_marks
```

The second example is easier to understand even without comments.

This is called **readable or self-explanatory code**.

> 💡 **Best practice:**
> Use clear variable and function names first. Use comments when additional explanation is needed.

---

# 📚 What is a Docstring?

A **docstring** is documentation written inside a function, class, or module.

It is usually written using triple quotes:

```python id="s7pyd4"
"""
This is a docstring.
"""
```

For example:

```python id="v1mg47"
def greet_student():
    """Display a welcome message for the student."""
    print("Welcome to Python!")
```

The text:

```text id="0f7jpr"
Display a welcome message for the student.
```

is the function's **docstring**.

---

# 🔍 Why Are Docstrings Useful?

Docstrings explain what a function, class, or module is designed to do.

For example:

```python id="r8ib5p"
def calculate_total(price, tax):
    """Calculate the final price including tax."""
    return price + tax
```

Someone reading this function can quickly understand its purpose.

Docstrings are especially useful when your program becomes larger.

---

# 🔎 Reading a Docstring

Python allows us to access a function's documentation using:

```text id="p3m7xk"
.__doc__
```

For example:

```python id="4tw7az"
def greet_student():
    """Display a welcome message."""
    print("Welcome!")


print(greet_student.__doc__)
```

Output:

```text id="9h4twu"
Display a welcome message.
```

You can also use:

```python id="xx9f84"
help(greet_student)
```

Python will display information about the function.

> 💡 **Remember:**
> A docstring is not just an ordinary comment. It is documentation associated with the function, class, or module.

---

# 🆚 Comment vs. Docstring

This difference is important.

| Feature                          | Comment                  | Docstring                               |
| -------------------------------- | ------------------------ | --------------------------------------- |
| Starts with                      | `#`                      | Usually `"""..."""`                     |
| Main purpose                     | Add notes for developers | Document functions, classes, or modules |
| Can be viewed through `__doc__`? | No                       | Yes                                     |
| Used as documentation?           | Sometimes                | Yes                                     |
| Example                          | `# Calculate total`      | `"""Calculate the total price."""`      |

### Simple rule

```text id="vix3qv"
# Comment
→ Quick note for humans

"""Docstring"""
→ Documentation for Python code
```

---

# 📖 Where Should We Use Docstrings?

Docstrings are commonly used with:

* Functions
* Classes
* Modules

For example:

```python id="zqzqpd"
def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width
```

Later in the course, when we learn functions and classes in more detail, you will use docstrings more often.

---

# 📄 What About Multi-Line Comments?

Python does **not** have a special `/* ... */` comment syntax like some other programming languages.

If you want a comment to span multiple lines, simply use `#` on each line:

```python id="8kkr8h"
# This program calculates
# the total marks of a student
# and displays the result.
```

This is a real comment.

---

# ⚠️ Are Triple Quotes Multi-Line Comments?

You may sometimes see this:

```python id="8j73sc"
"""
This looks like a multi-line comment.
But technically, it is a string literal.
"""
```

It is important to understand that triple quotes create a **string**, not a special comment syntax.

Triple-quoted strings are especially useful for **docstrings**.

For example:

```python id="u7m2hj"
def calculate_total():
    """
    Calculate and return the total amount.
    """
    return 100
```

Here, the triple-quoted text is a proper docstring.

> 🎯 **Beginner Rule:**
> Use `#` for comments.
> Use `"""..."""` for docstrings.

---

# 🧹 Keep Your Code Clean

Good programmers don't try to explain every single line with a comment.

Instead, they aim to write code that is already easy to understand.

For example, this is clear:

```python id="u9h8kc"
student_age = 20
```

You don't need:

```python id="j8v1ri"
student_age = 20  # Store student age in student_age variable
```

The variable name already explains the purpose.

But a comment can be useful when the reason is not obvious:

```python id="5ct4n4"
# Use 18 instead of 21 because this application follows the local eligibility rule.
minimum_age = 18
```

The comment explains **why**, not simply **what**.

---

# ✨ Simple Commenting Rules

Follow these basic rules:

### Rule 1 — Keep comments useful

Write comments that provide useful context.

### Rule 2 — Keep comments short

Avoid writing a full paragraph when one sentence is enough.

### Rule 3 — Keep comments updated

If the code changes, update the related comment.

Bad:

```python id="kjb7m8"
# Calculate discount for customers above 50
discount = 20
```

If the code later changes to apply the discount to everyone, the old comment becomes misleading.

### Rule 4 — Use clear names

Prefer:

```python id="4h17sg"
total_price = 500
```

over:

```python id="9df7s1"
x = 500
```

Clear names reduce the need for unnecessary comments.

### Rule 5 — Use docstrings for reusable functions

For example:

```python id="4m5f1y"
def calculate_total(price, tax):
    """Return the final price including tax."""
    return price + tax
```

---

# 📐 PEP 8 and Comments

**PEP 8** is Python's style guide.

It contains recommendations for writing clean and readable Python code.

For comments, some useful guidelines include:

* Keep comments clear and relevant.
* Keep comments up to date.
* Use inline comments carefully.
* Leave appropriate spacing around inline comments.
* Write code that is readable without unnecessary comments.

You can think of PEP 8 as:

> **A set of recommended habits for writing clean Python code.**

You don't need to memorize the entire PEP 8 document.

We will gradually follow its useful recommendations throughout this course.

---

# 📋 Comments: Do's and Don'ts

| Do                           | Don't                                           |
| ---------------------------- | ----------------------------------------------- |
| Write useful comments        | Explain every obvious line                      |
| Keep comments short          | Write unnecessary paragraphs                    |
| Update old comments          | Leave misleading comments                       |
| Use clear variable names     | Use meaningless names everywhere                |
| Use docstrings for functions | Use comments instead of proper documentation    |
| Use `#` for normal comments  | Treat triple quotes as a special comment syntax |

---

# 🧠 Quick Example

Let's look at a small program:

```python id="k3v0ec"
# Store the student's marks
marks = 85

def calculate_grade(score):
    """Return the grade based on the student's score."""

    if score >= 80:
        return "A"
    elif score >= 60:
        return "B"
    else:
        return "C"


grade = calculate_grade(marks)

print("Grade:", grade)
```

Notice the different types of explanations:

### Normal comment

```python id="zq8d3r"
# Store the student's marks
```

### Docstring

```python id="c8yn9h"
"""Return the grade based on the student's score."""
```

The comment gives a quick note.

The docstring documents what the function does.

---

# 🎯 Quick Summary

In this lesson, you learned:

* A **comment** is a note for humans reading the code.
* Python comments start with `#`.
* Comments are not executed as Python instructions.
* Inline comments can be written after code.
* Good comments should add useful information.
* Clear variable names can reduce unnecessary comments.
* A **docstring** documents a function, class, or module.
* Docstrings are commonly written using triple quotes.
* Docstrings can be accessed using `.__doc__`.
* `help()` can also display documentation.
* Python does not have a special `/* ... */` multiline comment syntax.
* Use `#` for normal comments.
* Use docstrings for documentation.
* PEP 8 provides recommendations for writing clean Python code.

### ⭐ Remember

```text id="2r6h6s"
# Comment
↓
Quick note for humans

"""Docstring"""
↓
Documentation for Python code
```

---

## Practice Quiz

### 1. Which symbol starts a normal Python comment?
A. `//`
B. `/*`
C. `#`
D. `--`
**Answer:** C `#`
**Explanation:** Everything after `#` on that line is treated as a comment.

---

### 2. Which is a correct Python comment?
A.
```python
// This is a comment
```
B.
```python
# This is a comment
```
C.
```python
<!-- This is a comment -->
```
D.
```python
-- This is a comment
```
**Answer:** B `# This is a comment`

---

### 3. What is the main purpose of a docstring?
A. To change the Python version
B. To document a function, class, or module
C. To install packages
D. To create a virtual environment
**Answer:** B To document a function, class, or module
**Explanation:** Docstrings provide documentation that can be accessed through Python's documentation tools.

---

### 4. Which code correctly defines a function with a docstring?
A.
```python
def greet():
# Welcome message
    print("Hello")
```
B.
```python
def greet():
    """Display a welcome message."""
    print("Hello")
```
C.
```python
def greet()
    "Display a welcome message."
```
D.
```python
function greet:
    print("Hello")
```
**Answer:** B

---

### 5. How can you access a function's docstring?
A. `function.comment`
B. `function.doc`
C. `function.__doc__`
D. `function.help`
**Answer:** C `function.__doc__`
**Explanation:** Python stores a function's docstring in its `__doc__` attribute.

---

### 6. Which comment is more useful?
A.
```python
x = x + 1  # Add 1 to x
```
B.
```python
# Retry the request because the server may temporarily reject the first attempt
```
**Answer:** B

---

### 7. Which statement is correct?
A. Python has a special `/* ... */` multiline comment syntax.
B. Triple quotes are always comments.
C. `#` is used for normal comments, while triple-quoted strings are commonly used for docstrings.
D. Comments must always be written in uppercase.
**Answer:** C

---

# 🧪 Hands-On Practice Challenge
Create a file named:
```text id="f3n4qr"
comments_lab.py
```
Then write:
```python id="7rj8c2"
# Store the student's marks
marks = 85

def calculate_grade(score):
    """Return a grade based on the student's score."""
    if score >= 80:
        return "A"
    elif score >= 60:
        return "B"
    else:
        return "C"
grade = calculate_grade(marks)
print("Student Marks:", marks)
print("Student Grade:", grade)

# Display the function documentation
print("\nFunction Documentation:")
print(calculate_grade.__doc__)
```

Run the program:
```bash id="6x2s1y"
python comments_lab.py
```
### Expected Output
```text id="c2op8x"
Student Marks: 85
Student Grade: A
Function Documentation:
Return a grade based on the student's score.
```
---

# 🔎 Practice Task

Now make three small changes.

### Task 1

Add a comment above the `marks` variable explaining what it stores.

### Task 2

Change the function's docstring to:

```python id="8c9k5q"
"""Calculate and return the student's grade."""
```

### Task 3

Add another function:

```python id="w9g3f2"
def welcome_student(name):
    """Display a welcome message."""
    print("Welcome,", name)
```

Then run:

```python id="z0s8fh"
welcome_student("Rohan")
```

Expected output:

```text id="1z3p4c"
Welcome, Rohan
```

🎉 You have now practiced both **comments and docstrings**.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Variables Introduction and Rules** (2: Variables).

👉 **[Continue to Next Lesson: Variables Introduction and Rules →](/tutorials/python-for-beginners/variables-introduction-and-rules)**
