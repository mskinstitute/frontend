---
id: syntax-code-structure
slug: syntax-code-structure
course: python-for-beginners
chapter: Introduction and Setup
topic: "Python Syntax and Code Structure: Indentation, Statements, and Blocks"
difficulty: Beginner
readingTime: 12
order: 4
keywords: ["python syntax", "python indentation", "code structure python", "case sensitivity python", "line continuation python", "pep 8 indentation"]
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# 🐍 Python Syntax and Code Structure

In the previous lessons, we prepared our Python environment.

Now we are ready to understand **how Python code is written**.

Just like a language has grammar and rules, Python also has rules for writing code.

These rules are called **syntax**.

In this lesson, we will learn:

* What Python syntax means
* What a statement is
* What indentation means
* How Python creates blocks of code
* Why the colon `:` is important
* Why Python is case-sensitive
* How to write long statements across multiple lines
* Some common syntax mistakes

Don't worry if these terms are new.

We will understand them with simple examples.

---

# 🧠 What is Syntax?

**Syntax means the rules for writing code correctly.**

Think about a normal sentence.

For example:

```text
I am learning Python.
```

This sentence follows the basic rules of a language.

But if we write:

```text
Python learning am I.
```

the words are still there, but the sentence structure is confusing.

Programming languages work in a similar way.

Python expects code to follow its syntax rules.

For example:

```python
print("Hello")
```

is valid Python.

But:

```python
print("Hello"
```

is incomplete because the closing `)` is missing.

Python will report an error.

> 💡 **Remember:**
> **Syntax = Rules for writing Python code correctly.**

---

# 📝 What is a Statement?

A **statement** is an instruction written in Python.

For example:

```python
name = "Amit"
```

This is one Python statement.

Another example:

```python
print(name)
```

This is another statement.

So:

```python
name = "Amit"
print(name)
```

contains two statements.

You can think of a statement as:

> **One instruction given to Python.**

---

# 📦 What is a Code Block?

Sometimes one instruction is not enough.

We may want several instructions to belong together.

For example:

```python
if marks >= 40:
print("Pass")
print("Congratulations")
```

Here, these two lines:

```python
print("Pass")
print("Congratulations")
```

belong to the `if` statement.

Together, they form a **code block**.

Python uses **indentation** to understand this relationship.

---

# 📏 What is Indentation?

Indentation means adding spaces at the beginning of a line.

Look at this:

```python
if marks >= 40:
print("Pass")
print("Congratulations")
```

The two `print()` statements are moved slightly to the right.

That space is called **indentation**.

Python uses indentation to understand which lines belong to a block.

---

# ⭐ Python's Important Rule

When Python starts a new block, the lines inside that block must be indented consistently.

For example:

```python
if marks >= 40:
print("Pass")
print("Congratulations")
```

Both statements belong to the `if` block.

But:

```python
if marks >= 40:
print("Pass")
```

is incorrect because the `print()` statement is not indented.

Python will produce an indentation-related error.

---

# 🔑 The Colon `:`

You will often see a colon at the end of Python statements that begin a new block.

For example:

```python
if marks >= 40:
print("Pass")
```

Notice the colon:

```text
if marks >= 40:
                ↑
            colon
```

The colon tells Python:

> **"A new block of code is coming next."**

You will see this pattern with:

```python
if
elif
else
for
while
def
class
```

For example:

```python
if age >= 18:
print("You can vote")
```

Later, you will learn each of these concepts in detail.

For now, remember:

```text
Block-starting statement
        ↓
    Colon :
        ↓
Indented code
```

---

# 📏 How Many Spaces Should We Use?

Python's recommended style is:

**4 spaces per indentation level.**

For example:

```python
if age >= 18:
print("Adult")
```

Here, the `print()` statement is indented by one level.

If there is another block inside it:

```python
if age >= 18:
if has_id:
    print("Entry allowed")
```

Now we have two indentation levels.

Visually:

```text
if age >= 18:
└── if has_id:
        └── print("Entry allowed")
```

You don't need to manually count spaces every time.

VS Code can automatically help you with indentation.

---

# ⚠️ Why Consistent Indentation Matters

Look at this example:

```python
if marks >= 40:
print("Pass")
    print("Congratulations")
```

The indentation of the second `print()` does not match the first one.

Python may report an indentation error.

A better version is:

```python
if marks >= 40:
print("Pass")
print("Congratulations")
```

> 💡 **Beginner Tip:**
> In VS Code, pressing the **Tab key** can help you move code to the correct indentation level. Your editor can also be configured to use spaces for indentation.

---

# 🧱 Nested Blocks

A block can contain another block.

This is called **nesting**.

For example:

```python
marks = 85
attendance = 90

if marks >= 40:
print("Passed")

if attendance >= 75:
    print("Attendance is good")
```

Look carefully at the indentation:

```text
if marks >= 40:
print("Passed")

if attendance >= 75:
    print("Attendance is good")
```

There are two levels:

```text
Level 0
if marks >= 40:

Level 1
print("Passed")

if attendance >= 75:

    Level 2
    print("Attendance is good")
```

This is one reason indentation is so important in Python.

---

# 🔤 Python is Case-Sensitive

Python treats uppercase and lowercase letters as different.

For example:

```python
name = "Rohan"
Name = "Aarav"
```

These are two different variable names.

Python sees:

```text
name
Name
```

as different names.

The same applies to Python keywords.

For example:

```python
if
```

is correct.

But:

```python
If
```

is not the same thing.

Similarly:

```python
True
```

is correct, while:

```python
true
```

is not the Python boolean value `True`.

> 💡 **Easy rule:**
> **Python cares about uppercase and lowercase letters.**

---

# 🔠 Example of Case Sensitivity

Try this:

```python
student = "Rohan"
Student = "Aarav"

print(student)
print(Student)
```

Output:

```text
Rohan
Aarav
```

Python treats `student` and `Student` as different names.

### Good Practice

Although Python allows names such as:

```python
student
Student
STUDENT
```

it is better to use clear and consistent naming.

For example:

```python
student_name = "Rohan"
```

This is easier to understand.

---

# 📄 One Statement Per Line

Usually, we write one Python statement on one line.

For example:

```python
name = "Rohan"
age = 20
print(name)
print(age)
```

This makes the code easier to read.

You may sometimes see multiple statements on one line using semicolons:

```python
name = "Rohan"; age = 20
```

Python allows this in some situations, but beginners should generally avoid it.

Prefer:

```python
name = "Rohan"
age = 20
```

> 🎯 **Good Python code should be easy to read.**

---

# 📏 Writing Long Lines of Code

Sometimes an expression can become very long.

For example:

```python
total = 100 + 200 + 300 + 400 + 500
```

A long expression can be split across multiple lines.

The recommended approach is to use parentheses.

```python
total = (
100
+ 200
+ 300
+ 400
+ 500
)

print(total)
```

Python understands that the expression is continuing because it is inside parentheses.

---

# ✅ Why Use Parentheses?

Parentheses make long expressions easier to read.

For example:

```python
total = (
admission_fee
+ tuition_fee
+ examination_fee
+ library_fee
)
```

This is easier to read than putting everything on one very long line.

> 💡 **Beginner Tip:**
> When you need to split a long expression, **parentheses are usually cleaner than using a backslash `\`**.

---

# 🔙 What About the Backslash `\`?

Python also allows explicit line continuation using `\`.

For example:

```python
total = 100 + 200 + 300 + \
    400 + 500
```

This can work, but it is usually better to use parentheses when possible.

Prefer:

```python
total = (
100
+ 200
+ 300
+ 400
+ 500
)
```

This is generally easier to read and maintain.

---

# 📚 Python Syntax: Quick Rules

Here are some important rules to remember.

| Rule                                 | Example                                   |
| ------------------------------------ | ----------------------------------------- |
| Use indentation for code blocks      | `if age >= 18:` followed by indented code |
| Use `:` before a new block           | `if`, `for`, `while`, `def`, etc.         |
| Use consistent indentation           | Usually 4 spaces                          |
| Python is case-sensitive             | `name` ≠ `Name`                           |
| Keep code readable                   | Prefer one statement per line             |
| Use parentheses for long expressions | `total = ( ... )`                         |
| Save your code before running it     | `Ctrl + S`                                |

---

# ❌ Common Beginner Mistakes

## Mistake 1: Forgetting the Colon

Incorrect:

```python
if age >= 18
print("Adult")
```

Correct:

```python
if age >= 18:
print("Adult")
```

---

## Mistake 2: Forgetting Indentation

Incorrect:

```python
if age >= 18:
print("Adult")
```

Correct:

```python
if age >= 18:
print("Adult")
```

---

## Mistake 3: Wrong Indentation

Incorrect:

```python
if age >= 18:
print("Adult")
    print("Allowed")
```

Correct:

```python
if age >= 18:
print("Adult")
print("Allowed")
```

---

## Mistake 4: Wrong Capitalization

Incorrect:

```python
If age >= 18:
print("Adult")
```

Correct:

```python
if age >= 18:
print("Adult")
```

---

## Mistake 5: Confusing `True` and `true`

Python uses:

```python
True
False
```

not:

```python
true
false
```

Remember that Python is case-sensitive.

---

# 🧠 Easy Way to Remember Python Structure

Whenever you see code like this:

```python
if condition:
instruction_1
instruction_2
```

think:

```text
Condition
↓
Colon :
↓
Indentation
↓
Code Block
```

This pattern will appear again and again throughout your Python journey.

---

# 🎯 Quick Summary

In this lesson, you learned:

* **Syntax** means the rules for writing Python code.
* A **statement** is an instruction written in Python.
* A **code block** is a group of related statements.
* Python uses **indentation** to define code blocks.
* A colon `:` is used before many new code blocks.
* Python's recommended indentation style is **4 spaces**.
* Python is **case-sensitive**.
* `name` and `Name` are different.
* Parentheses can make long expressions easier to write across multiple lines.
* Consistent and readable code is important.

### ⭐ Most Important Pattern

Remember this:

```python
if condition:
do_something()
```

The three important parts are:

```text
if condition
    ↓
:
    ↓
indented code
```

Once you understand this pattern, many later Python concepts will become easier.

---

## Practice Quiz

### 1. What does Python use to define the structure of code blocks?
A. Only curly braces `{}`
B. Indentation
C. Only semicolons `;`
D. Quotation marks
**Answer:** B Indentation
**Explanation:** Python uses indentation to show which statements belong to a code block.

---

### 2. What symbol usually appears at the end of a statement that starts a new block?
A. `;`
B. `#`
C. `:`
D. `->`
**Answer:** C `:`
**Explanation:** Statements such as `if`, `for`, `while`, and `def` use a colon before their indented block.

---

### 3. What indentation style does PEP 8 recommend?
A. 1 space
B. 2 spaces
C. 4 spaces
D. 10 spaces
**Answer:** C 4 spaces
**Explanation:** PEP 8 recommends using four spaces for each indentation level.

---

### 4. Are `name` and `Name` the same variable in Python?
A. Yes
B. No
C. Only on Windows
D. Only in VS Code
**Answer:** B No
**Explanation:** Python is case-sensitive, so uppercase and lowercase letters are treated differently.

---

### 5. Which code is correctly indented?
A.
```python
if age >= 18:
print("Adult")
```
B.

```python
if age >= 18:
print("Adult")
```
C.
```python
if age >= 18
print("Adult")
```
D.
```python
If age >= 18:
print("Adult")
```
**Answer:** B

---

### 6. Which is generally the cleaner way to split a long expression across multiple lines?
A. Use parentheses
B. Add random spaces
C. Add semicolons
D. Delete part of the expression
**Answer:** A Use parentheses
**Explanation:** Parentheses allow Python to continue an expression across multiple lines and usually make the code easier to read.

---

### 7. Which statement is correct about Python?
A. Python ignores uppercase and lowercase letters.
B. `True` and `true` mean exactly the same thing.
C. Python is case-sensitive.
D. Variable names must always be uppercase.
**Answer:** C Python is case-sensitive.
**Explanation:** Python treats uppercase and lowercase letters as different.

---

# 🧪 Hands-On Practice Challenge

Create a file named:

```text
syntax_lab.py
```

Now type the following program:

```python
# ==========================================
# Python Syntax Practice
# ==========================================

student_name = "Kavita"
Student_Name = "Rohan"

print("--- Case Sensitivity ---")
print(student_name)
print(Student_Name)


marks = 88
attendance = 92

print("\n--- Indentation & Blocks ---")

if marks >= 40:
print("Academic Status: Passed")

if attendance >= 75:
    print("Attendance Status: Good")
    print("Student is eligible")
else:
    print("Attendance is below 75%")

else:
print("Academic Status: Needs Improvement")


print("\n--- Multi-line Expression ---")

total_marks = (
85
+ 92
+ 88
+ 95
+ 90
)

average = total_marks / 5

print("Total Marks:", total_marks)
print("Average:", average)
```

Save the file and run:

```bash
python syntax_lab.py
```

### Expected Output

```text
--- Case Sensitivity ---
Kavita
Rohan

--- Indentation & Blocks ---
Academic Status: Passed
Attendance Status: Good
Student is eligible

--- Multi-line Expression ---
Total Marks: 450
Average: 90.0
```

---

# 🔎 Understand the Practice Program

You don't need to understand every line yet.

The important things to observe are:

### 1. Case Sensitivity

```python
student_name
Student_Name
```

Python treats them as different names.

### 2. Indentation

```python
if marks >= 40:
print("Academic Status: Passed")
```

The `print()` statement belongs to the `if` block because it is indented.

### 3. Nested Indentation

```python
if marks >= 40:
...
if attendance >= 75:
    print("Student is eligible")
```

The second `if` is inside the first `if`.

### 4. Multi-line Expression

```python
total_marks = (
85
+ 92
+ 88
)
```

Parentheses allow the expression to continue across multiple lines.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Comments & Best Practices** (1: Introduction and Setup).

👉 **[Continue to Next Lesson: Comments & Best Practices →](/tutorials/python-for-beginners/comments-best-practices)**
