---
id: multiple-assignments
slug: multiple-assignments
course: python-for-beginners
chapter: Variables
topic: "Multiple Variable Assignments and Tuple Unpacking Basics"
difficulty: Beginner
readingTime: 12
order: 9
keywords: ["multiple assignments python", "tuple unpacking python", "swapping variables python", "python starred unpacking", "chained assignment python", "simultaneous assignment"]
lastUpdated: 2026-09-30
author: MSk Team
version: 1.1.0
---

# 🐍 Multiple Variable Assignments and Tuple Unpacking

In the previous lessons, we learned how to create variables and display their values.

Normally, we assign variables one at a time:

```python id="x7k2pm"
name = "Amit"
age = 20
marks = 90
```

But Python gives us a convenient way to assign **multiple variables at the same time**.

For example:

```python id="m4v8cq"
name, age, marks = "Amit", 20, 90
```

Python can also help us:

* Assign multiple values at once
* Give the same value to multiple variables
* Swap two variables easily
* Unpack values from a list or tuple
* Collect remaining values using `*`

These techniques are called **multiple assignment and unpacking**.

---

# 1. Multiple Assignment

Let's start with a simple example.

Instead of writing:

```python id="r2q8nx"
x = 10
y = 20
z = 30
```

you can write:

```python id="k6m3vp"
x, y, z = 10, 20, 30
```

Both approaches create the same three variables:

```text id="p9v4ks"
x → 10
y → 20
z → 30
```

This is called **multiple assignment**.

---

# 2. Assigning Student Information

Multiple assignment is useful when you have related values.

For example:

```python id="c5n8wt"
name, roll_number, marks = "Karan", 105, 94.5

print(name)
print(roll_number)
print(marks)
```

Output:

```text id="z3x7mq"
Karan
105
94.5
```

You can also use an f-string:

```python id="a8r2vy"
print(f"Student: {name}")
print(f"Roll Number: {roll_number}")
print(f"Marks: {marks}")
```

Output:

```text id="u4m9pk"
Student: Karan
Roll Number: 105
Marks: 94.5
```

### 🎯 Remember

The values are assigned from **left to right**:

```text id="q7w3mx"
name       ← "Karan"
roll_number ← 105
marks      ← 94.5
```

---

# 3. The Number of Values Must Match

When using normal unpacking, the number of variables should match the number of values.

For example:

```python id="v2n6cq"
a, b, c = 10, 20, 30
```

This works because there are:

```text id="f4m8zp"
3 variables
3 values
```

But this does not work:

```python id="j5r9kw"
a, b = 10, 20, 30
```

There are:

```text id="s6x2vn"
2 variables
3 values
```

Python raises:

```text id="c8q4mz"
ValueError: too many values to unpack
```

The opposite also causes an error:

```python id="n3k7xp"
a, b, c = 10, 20
```

There are:

```text id="m5v8qr"
3 variables
2 values
```

Python raises a `ValueError` because there are not enough values.

### 💡 Easy Rule

For normal unpacking:

```text id="w4p9nc"
Variables = Values
```

---

# 4. Chained Assignment

Sometimes you want several variables to start with the same value.

For example:

```python id="x6q2mt"
maths = science = english = 100
```

Now:

```text id="f8r3vk"
maths   → 100
science → 100
english → 100
```

You can print them:

```python id="j2m7pc"
print(maths)
print(science)
print(english)
```

Output:

```text id="b5x9qw"
100
100
100
```

This is called **chained assignment**.

---

# 5. Chained Assignment with Immutable Values

Chained assignment is generally straightforward with immutable values such as numbers, strings, and booleans.

For example:

```python id="n8c4vy"
a = b = c = 0
```

This is perfectly fine.

Another example:

```python id="m3p7qx"
country1 = country2 = "India"
```

Both names refer to the same string value.

---

# 6. Be Careful with Lists

Lists are **mutable**, which means their contents can be changed.

Consider:

```python id="r6v2mk"
list_a = list_b = []
```

Now both names refer to the **same list object**.

If we change the list through `list_a`:

```python id="k9x4pw"
list_a.append("Apple")
```

then:

```python id="q5m8vc"
print(list_a)
print(list_b)
```

Output:

```text id="y7n3rx"
['Apple']
['Apple']
```

Why?

Because both variables refer to the same list.

```text id="p2v6km"
list_a ──┐
         ├──→ []
list_b ──┘
```

After adding `"Apple"`:

```text id="z8q4cw"
list_a ──┐
         ├──→ ['Apple']
list_b ──┘
```

### ✅ Create separate lists

If you want two independent lists:

```python id="h3w7np"
list_a = []
list_b = []
```

Now they are separate objects.

### ⚠️ Beginner Tip

You don't need to be afraid of chained assignment.

Just remember:

> **With mutable objects such as lists, chained assignment makes the variables refer to the same object.**

---

# 7. Swapping Two Variables

Suppose:

```python id="u5k8mq"
a = 10
b = 20
```

We want:

```text id="c2r7vx"
a → 20
b → 10
```

One common approach is to use a temporary variable:

```python id="m8q4zp"
temp = a
a = b
b = temp
```

This works.

But Python provides a much simpler way.

---

# 8. Python's Easy Swap

In Python, you can write:

```python id="n6v3kc"
a, b = b, a
```

That's it!

Before:

```text id="w7m2qx"
a → 10
b → 20
```

After:

```text id="j4p8vn"
a → 20
b → 10
```

Complete example:

```python id="c9x5rm"
a = 10
b = 20

print("Before:", a, b)

a, b = b, a

print("After:", a, b)
```

Output:

```text id="v3k7pq"
Before: 10 20
After: 20 10
```

### 🎯 Remember

> **`a, b = b, a` is a simple and common Python way to swap two values.**

---

# 9. How Does `a, b = b, a` Work?

You don't need to understand the internal details yet, but the basic idea is useful.

Python evaluates the right side first:

```python id="q8m4cx"
b, a
```

Suppose:

```text id="p5r7vk"
a = 10
b = 20
```

The right side gives:

```text id="x2n9mq"
20, 10
```

Python then assigns those values to:

```text id="d6v3wp"
a, b
```

So:

```text id="k8m4rz"
a → 20
b → 10
```

This is why the swap works without needing a temporary variable.

---

# 10. Unpacking

**Unpacking** means taking values from a sequence and assigning them to multiple variables.

For example:

```python id="f4q8mx"
colors = ["Red", "Green", "Blue"]

first, second, third = colors

print(first)
print(second)
print(third)
```

Output:

```text id="v7n2kc"
Red
Green
Blue
```

The list contains three values:

```text id="w5m9rp"
["Red", "Green", "Blue"]
```

Python assigns them to:

```text id="y3c6vx"
first  → "Red"
second → "Green"
third  → "Blue"
```

This is called **unpacking**.

---

# 11. Tuple Unpacking

A tuple is another Python collection.

For example:

```python id="n7p2km"
student = ("Amit", 20, 92)

name, age, marks = student

print(name)
print(age)
print(marks)
```

Output:

```text id="r4x8cq"
Amit
20
92
```

Although the lesson topic often calls this **tuple unpacking**, the same unpacking idea also works with lists and other iterable objects.

For example:

```python id="q9v5mn"
numbers = [10, 20, 30]

a, b, c = numbers
```

This also works.

### 🎯 Remember

Unpacking is not limited to tuples.

You can commonly unpack:

* Tuples
* Lists
* Other iterable objects

---

# 12. Unpacking with Different Data Types

The values don't have to be the same type.

For example:

```python id="k3m8vx"
student = ("Amit", 20, 92.5)

name, age, marks = student

print(name)
print(age)
print(marks)
```

Here:

```text id="z6q2rp"
name  → string
age   → integer
marks → float
```

Python simply assigns each value to the corresponding variable.

---

# 13. Extended Unpacking with `*`

Sometimes you don't know exactly how many values should go into the middle.

Python provides the `*` operator for this situation.

For example:

```python id="v8m4qc"
scores = [98, 92, 89, 84, 78, 65]

highest, *middle_scores, lowest = scores
```

Now:

```text id="k5r9nx"
highest       → 98
middle_scores → [92, 89, 84, 78]
lowest        → 65
```

Let's print them:

```python id="x2p7mv"
print("Highest:", highest)
print("Middle:", middle_scores)
print("Lowest:", lowest)
```

Output:

```text id="j8q4cw"
Highest: 98
Middle: [92, 89, 84, 78]
Lowest: 65
```

### 💡 What does `*` do?

The starred variable collects the **remaining values**.

```text id="m6v3rp"
first       → first value
*middle     → remaining middle values
last        → last value
```

---

# 14. Another Example of `*`

Consider:

```python id="n9c5xk"
numbers = [10, 20, 30, 40, 50]

first, *rest = numbers
```

Now:

```text id="p4m8vq"
first → 10
rest  → [20, 30, 40, 50]
```

You can also collect everything except the last value:

```python id="r7k2mw"
*start, last = numbers
```

Now:

```text id="c3x9pn"
start → [10, 20, 30, 40]
last  → 50
```

### ⚠️ Important

The starred variable receives a **list**.

For example:

```python id="v5q8mk"
first, *middle, last = [1, 2, 3, 4, 5]
```

gives:

```text id="s6r2xp"
first  → 1
middle → [2, 3, 4]
last   → 5
```

---

# 15. Multiple Assignment in Calculations

Multiple assignment can also be useful when updating related values.

For example:

```python id="k7m3vc"
x = 5
y = 10

x, y = y, x + y

print(x)
print(y)
```

Output:

```text id="z4q8np"
10
15
```

Why?

Python first evaluates the right side using the old values:

```text id="p2v6mx"
y     → 10
x + y → 15
```

Then assigns:

```text id="r9c5vk"
x → 10
y → 15
```

This technique is commonly used in algorithms such as generating Fibonacci numbers.

---

# 16. Fibonacci Example

The Fibonacci sequence begins:

```text id="h7m3qx"
0 1 1 2 3 5 8 13 ...
```

We can generate it using multiple assignment:

```python id="c5v8mr"
a, b = 0, 1

for _ in range(8):
    print(a, end=" ")
    a, b = b, a + b
```

Output:

```text id="n2x6pk"
0 1 1 2 3 5 8 13
```

The important line is:

```python id="v8q4mw"
a, b = b, a + b
```

Python calculates the complete right side first and then assigns the results.

---

# 17. Common Mistakes

## Mistake 1: Number of Values Doesn't Match

❌

```python id="y6p3kn"
a, b = 10, 20, 30
```

There are 2 variables but 3 values.

Python raises a `ValueError`.

---

## Mistake 2: Not Enough Values

❌

```python id="x8m5rq"
a, b, c = 10, 20
```

There are 3 variables but only 2 values.

Again, Python raises a `ValueError`.

---

## Mistake 3: Forgetting What `*` Does

```python id="m4q9vx"
first, *middle, last = [1, 2, 3, 4, 5]
```

`middle` is:

```text id="p6r2kc"
[2, 3, 4]
```

not:

```text id="j8x5vn"
2, 3, 4
```

The starred variable collects the values into a list.

---

## Mistake 4: Accidentally Sharing a List

Be careful with:

```python id="n7c4mx"
list_a = list_b = []
```

Both names refer to the same list.

If you need independent lists:

```python id="v2q8rp"
list_a = []
list_b = []
```

---

# 18. Do's and Don'ts

| Practice            | ✅ Do                              | ❌ Don't                                      |
| ------------------- | --------------------------------- | -------------------------------------------- |
| Multiple assignment | `x, y = 10, 20`                   | Write many unrelated assignments on one line |
| Swapping            | `a, b = b, a`                     | Use a temporary variable unnecessarily       |
| Unpacking           | `name, age = student`             | Ignore the number of values                  |
| Starred unpacking   | `first, *middle, last = data`     | Forget that `middle` becomes a list          |
| Lists               | Create separate lists when needed | Accidentally share a mutable list            |
| Readability         | Group related values              | Put many unrelated variables on one line     |

---

# 🧠 Quick Revision Summary

### Multiple assignment

```python id="b5x8qm"
x, y, z = 10, 20, 30
```

### Chained assignment

```python id="k3m7vp"
a = b = c = 0
```

### Swapping

```python id="q9r4mx"
a, b = b, a
```

### Basic unpacking

```python id="w6n2kc"
colors = ["Red", "Green", "Blue"]

first, second, third = colors
```

### Starred unpacking

```python id="m8v5qx"
first, *middle, last = [1, 2, 3, 4, 5]
```

Result:

```text id="p4c7rn"
first  → 1
middle → [2, 3, 4]
last   → 5
```

### Main rule

For normal unpacking:

```text id="x2q8mv"
Number of variables = Number of values
```

unless you use a starred variable to collect remaining values.

---

## Practice Quiz

### 1. Which code correctly swaps `x` and `y`?
A. `swap(x, y)`
B. `x, y = y, x`
C. `x = y; y = x`
D. `x.swap(y)`
**Answer:** B

---

### 2. What happens here?
```python id="v6m2qx"
a, b, c = [10, 20]
```
A. `c` becomes `None`
B. Python raises a `ValueError`
C. `c` becomes `0`
D. Python ignores the missing value
**Answer:** B

---

### 3. What is the value of `middle`?
```python id="r8x4pn"
first, *middle, last = [1, 2, 3, 4, 5]
```
A. `[2, 3, 4]`
B. `2`
C. `[2, 3]`
D. `(2, 3, 4)`
**Answer:** A

---

### 4. What happens here?
```python id="m5q9vk"
list_1 = list_2 = []
list_1.append("Apple")
```
A. Only `list_1` changes
B. Both lists contain `"Apple"`
C. Python raises a `TypeError`
D. Lists cannot be assigned this way
**Answer:** B

---

### 5. What is the output?
```python id="c7v2mx"
x, y = 5, 10
x, y = y, x + y
print(x, y)
```
A. `10 15`
B. `10 20`
C. `5 15`
D. `15 15`
**Answer:** A

---

# 💻 Hands-On Practice Challenge

## Challenge 9: Multiple Assignment & Unpacking Lab

Create a file named:

```text id="w8m3qx"
multiple_assignment_lab.py
```

Then write:

```python id="p4v7kn"
print("=" * 55)
print("MULTIPLE ASSIGNMENT & UNPACKING LAB")
print("=" * 55)

# 1. Multiple assignment
x, y, z = 100, 250, -45

print("\n--- 1. Multiple Assignment ---")
print(f"X = {x}, Y = {y}, Z = {z}")

# 2. Variable swapping
first_place = "Rohan"
second_place = "Priya"

print("\n--- 2. Variable Swapping ---")
print(f"Before: 1st = {first_place}, 2nd = {second_place}")

first_place, second_place = second_place, first_place

print(f"After : 1st = {first_place}, 2nd = {second_place}")

# 3. Basic unpacking
print("\n--- 3. List Unpacking ---")

subjects = ["Python", "SQL", "Excel"]

subject_1, subject_2, subject_3 = subjects

print("Subject 1:", subject_1)
print("Subject 2:", subject_2)
print("Subject 3:", subject_3)

# 4. Starred unpacking
print("\n--- 4. Starred Unpacking ---")

scores = [98, 92, 89, 84, 78, 65]

highest, *middle_scores, lowest = scores

print("Highest Score:", highest)
print("Middle Scores:", middle_scores)
print("Lowest Score:", lowest)

print("=" * 55)
```

### Expected Output

```text id="x9c4mv"
=======================================================
MULTIPLE ASSIGNMENT & UNPACKING LAB
=======================================================

--- 1. Multiple Assignment ---
X = 100, Y = 250, Z = -45

--- 2. Variable Swapping ---
Before: 1st = Rohan, 2nd = Priya
After : 1st = Priya, 2nd = Rohan

--- 3. List Unpacking ---
Subject 1: Python
Subject 2: SQL
Subject 3: Excel

--- 4. Starred Unpacking ---
Highest Score: 98
Middle Scores: [92, 89, 84, 78]
Lowest Score: 65
=======================================================
```

---

# 🎯 Extra Practice

Try these exercises yourself.

### Exercise 1 — Three Variables

Create:

```python id="f3v8mq"
name, age, city = "Sumit", 25, "Delhi"
```

Print all three values.

---

### Exercise 2 — Swap Two Values

Start with:

```python id="k7m2px"
a = 100
b = 200
```

Swap them using only:

```python id="c4q9vn"
a, b = ...
```

---

### Exercise 3 — Unpack a List

Given:

```python id="n8v5rx"
numbers = [10, 20, 30, 40]
```

Store the values in:

```text id="q2m7kc"
a
b
c
d
```

---

### Exercise 4 — Starred Unpacking

Given:

```python id="w6p3xm"
marks = [95, 90, 85, 80, 75]
```

Create:

```text id="m4q8vn"
highest
middle
lowest
```

where `middle` contains all values between the first and last.

---

### Exercise 5 — Predict Before Running

What will this print?

```python id="r7c2mx"
a = 5
b = 10

a, b = b, a + b

print(a, b)
```

**Don't run it immediately.**

First calculate the answer yourself, then run the program and check your prediction.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Constants (Python Convention)** (2: Variables).

👉 **[Continue to Next Lesson: Constants (Python Convention) →](/tutorials/python-for-beginners/constants-python-convention)**
