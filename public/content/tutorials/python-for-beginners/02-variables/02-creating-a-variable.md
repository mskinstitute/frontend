---
id: creating-a-variable
slug: creating-a-variable
course: python-for-beginners
chapter: Variables
topic: "Creating a Variable: Dynamic Typing and Memory Reference Mechanics"
difficulty: Beginner
readingTime: 12
order: 7
keywords: ["creating a variable python", "dynamic typing python", "python memory model", "id function python", "variable assignment", "garbage collection python"]
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# 🐍 Creating a Variable: Assignment, Dynamic Typing and References

In the previous lesson, we learned **what variables are and how to name them correctly**.

Now let's understand something very important:

> **What actually happens when we create a variable?**

Consider this simple code:

```python
name = "Amit"
```

It looks very simple.

But Python is doing something important:

```text
name  →  "Amit"
```

The name `name` is associated with the value `"Amit"`.

Python variables are better understood as **names that refer to objects** rather than fixed boxes that permanently contain one type of data.

In this lesson, we will learn:

* How variable assignment works
* What the `=` operator does
* How multiple variables can refer to the same object
* What `id()` does
* What dynamic typing means
* What rebinding means
* What happens when an object is no longer needed
* The difference between `=` and `==`
* How to avoid common beginner mistakes

---

# 1. Creating a Variable with `=`

In Python, you create a variable when you assign a value to a name.

The basic syntax is:

```python
variable_name = value
```

For example:

```python
city = "New Delhi"
temperature = 34.5
is_sunny = True
```

Here:

```text
city          → "New Delhi"
temperature   → 34.5
is_sunny      → True
```

Python creates or uses the appropriate object and associates the given name with it.

### 💡 Beginner Tip

The `=` symbol in Python means:

> **Assign this value to this name.**

It does **not** mean "is equal to" in the mathematical sense.

---

# 2. Understanding Assignment

Let's look at a simple example:

```python
age = 18
```

You can think of it as:

```text
age → 18
```

Now if we write:

```python
age = 20
```

the name `age` is associated with the new value:

```text
age → 20
```

The old value is no longer associated with the name `age`.

This process is called **rebinding**.

---

# 3. Assignment vs Equality

One of the most common beginner mistakes is confusing:

```python
=
```

and:

```python
==
```

They have different purposes.

| Operator | Meaning    | Example     |
| -------- | ---------- | ----------- |
| `=`      | Assignment | `age = 18`  |
| `==`     | Comparison | `age == 18` |

### Assignment

```python
age = 18
```

This assigns `18` to `age`.

### Comparison

```python
age == 18
```

This asks:

> "Is the value of `age` equal to 18?"

The result is either `True` or `False`.

For example:

```python
age = 18

print(age == 18)
```

Output:

```text
True
```

### 🎯 Remember

```text
=   → Put a value into a name
==  → Compare two values
```

---

# 4. Variables Can Refer to Different Types of Data

Python variables can refer to different types of objects.

For example:

```python
name = "Amit"
age = 18
height = 5.8
is_student = True
```

Python automatically understands the type of each value.

```python
print(type(name))
print(type(age))
print(type(height))
print(type(is_student))
```

Output:

```text
<class 'str'>
<class 'int'>
<class 'float'>
<class 'bool'>
```

You don't need to specify the type when creating these variables.

---

# 5. What is Dynamic Typing?

Python is a **dynamically typed language**.

This means that a variable name does not have to be permanently restricted to one data type.

For example:

```python
data = 42

print(data)
```

Output:

```text
42
```

Later, we can assign a string:

```python
data = "Forty-Two"

print(data)
```

Output:

```text
Forty-Two
```

We can even assign a list:

```python
data = [10, 20, 30]

print(data)
```

Output:

```text
[10, 20, 30]
```

The same name `data` has been associated with different types of objects at different times.

---

# 6. A Simple Way to Understand Dynamic Typing

Imagine a name tag:

```text
data
```

Initially:

```text
data ─────→ 42
```

Then:

```python
data = "Hello"
```

Now:

```text
data ─────→ "Hello"
```

Later:

```python
data = [10, 20, 30]
```

Now:

```text
data ─────→ [10, 20, 30]
```

The name `data` stays the same, but what it refers to changes.

### 🎯 Remember

> **Python names can be rebound to objects of different types.**

---

# 7. Important Concept: Objects Have Types

A useful way to understand Python is:

> **Objects have types, and names refer to objects.**

For example:

```python
age = 18
```

The value `18` is an integer object.

Python knows that the object is of type `int`.

You can check it:

```python
print(type(age))
```

Output:

```text
<class 'int'>
```

Now:

```python
age = "eighteen"
```

The name `age` now refers to a string object.

```python
print(type(age))
```

Output:

```text
<class 'str'>
```

### 💡 Beginner Tip

You don't need to memorize the internal memory model yet.

Just remember:

```text
name → object
```

and:

```text
object → has a type
```

---

# 8. Multiple Variables Can Refer to the Same Object

Consider:

```python
score_a = 100
score_b = score_a
```

What happens?

First:

```text
score_a → 100
```

Then:

```python
score_b = score_a
```

Now both names refer to the same object in this example:

```text
score_a ──┐
          ├──→ 100
score_b ──┘
```

We can check object identity using `is`.

```python
print(score_a is score_b)
```

Output:

```text
True
```

---

# 9. What Does `is` Mean?

The `is` operator checks whether two names refer to the **same object**.

Example:

```python
score_a = 100
score_b = score_a

print(score_a is score_b)
```

Output:

```text
True
```

This means both names refer to the same object.

### ⚠️ Important

Don't use `is` when you simply want to compare values.

For value comparison, use:

```python
==
```

For example:

```python
a = 100
b = 100

print(a == b)
```

This asks whether the values are equal.

Use `is` when you specifically want to test object identity.

---

# 10. The `id()` Function

Python provides a built-in function called:

```python
id()
```

It returns an integer representing the **identity of an object** during its lifetime.

Example:

```python
score = 100

print(id(score))
```

You may see a large number such as:

```text
140000000000000
```

The exact number can be different on different runs and different Python implementations.

You can compare identities:

```python
score_a = 100
score_b = score_a

print(id(score_a))
print(id(score_b))
```

In this example, both names refer to the same object, so their identities are the same.

You can also write:

```python
print(score_a is score_b)
```

which is easier to understand when learning object identity.

### 🎯 Remember

```text
id(object) → returns the object's identity
```

It is better to think of `id()` as an **object identity number**, rather than assuming it is always a direct physical RAM address.

---

# 11. Rebinding a Variable

Let's look at an important example:

```python
score_a = 500
score_b = score_a
```

At this point:

```text
score_a ──┐
          ├──→ 500
score_b ──┘
```

Now we change `score_b`:

```python
score_b = 750
```

The result is:

```text
score_a ──→ 500

score_b ──→ 750
```

The assignment changed what `score_b` refers to.

It did **not** change the value associated with `score_a`.

Let's verify:

```python
score_a = 500
score_b = score_a

score_b = 750

print(score_a)
print(score_b)
```

Output:

```text
500
750
```

### 🎯 Remember

> Assigning a new value to one variable does not automatically change another variable that previously referred to the same object.

---

# 12. What Happens to the Old Object?

Consider:

```python
data = 42
```

Now:

```text
data → 42
```

Then:

```python
data = "Hello"
```

Now:

```text
data → "Hello"
```

If no other references are using the old object, Python can eventually reclaim the memory associated with it.

Python automatically manages memory.

This means you usually do **not** have to manually free memory for ordinary Python objects.

---

# 13. Automatic Memory Management

Python uses automatic memory management.

One important mechanism in the standard Python implementation is **reference counting**.

Very simply:

```text
data → 42
```

means there is a reference from the name `data` to the object.

After:

```python
data = "Hello"
```

the name `data` now refers to the string object.

If nothing else refers to the old object, Python can reclaim it.

Python also has a **garbage collector** that helps deal with certain groups of objects that reference each other.

### 💡 Beginner Tip

You don't need to manually delete normal Python objects from memory.

For now, remember:

> **Python automatically manages memory for you.**

---

# 14. What is Garbage Collection?

Garbage collection is Python's automatic process for finding certain objects that are no longer needed and reclaiming their memory.

A simplified example:

```text
Before:

data ─────→ 42
```

After:

```python
data = "Hello"
```

Now:

```text
data ─────→ "Hello"

42 → no longer referenced by data
```

If the old object has no remaining references and is eligible for cleanup, Python can reclaim its memory.

### ⚠️ Important

Don't think of garbage collection as:

> "Every object is immediately deleted as soon as its reference count becomes zero."

Python's memory management is more nuanced, and the exact cleanup behavior depends on the implementation.

For beginner-level programming, the important idea is:

> **Python automatically manages unused objects and memory.**

---

# 15. Reading a Variable Before Creating It

A variable should be assigned before you try to use it.

This causes an error:

```python
print(score)
```

if `score` has never been defined.

Python will produce an error similar to:

```text
NameError: name 'score' is not defined
```

Correct:

```python
score = 100

print(score)
```

Output:

```text
100
```

### 🎯 Remember

Create or assign the variable first:

```text
1. Create/assign
2. Use
```

---

# 16. Good Practices When Creating Variables

## ✅ 1. Use Meaningful Names

Prefer:

```python
total_cart_price = 1500
```

instead of:

```python
x = 1500
```

A meaningful name makes your code easier to understand.

---

## ✅ 2. Use `=` for Assignment

Correct:

```python
age = 18
```

Don't confuse it with:

```python
age == 18
```

which performs a comparison.

---

## ✅ 3. Assign Before Using

Correct:

```python
score = 95
print(score)
```

Incorrect:

```python
print(score)
score = 95
```

---

## ✅ 4. Keep Meaning Consistent

Although Python allows this:

```python
data = 100
data = "Hello"
data = [1, 2, 3]
```

you should avoid unnecessary changes of meaning in real programs.

For example, if:

```python
student_age = 18
```

it is clearer to continue using `student_age` for an age rather than later turning it into unrelated data.

---

# 17. Common Beginner Mistakes

### Mistake 1: Using `==` for assignment

❌ Wrong:

```python
age == 18
```

✅ Correct:

```python
age = 18
```

---

### Mistake 2: Using a variable before assigning it

❌ Wrong:

```python
print(name)
name = "Amit"
```

✅ Correct:

```python
name = "Amit"
print(name)
```

---

### Mistake 3: Assuming variables have permanent types

Python allows:

```python
data = 10
data = "Hello"
```

The name can be rebound to an object of another type.

---

### Mistake 4: Using `is` for normal value comparison

Usually use:

```python
a == b
```

when asking whether two values are equal.

Use:

```python
a is b
```

when checking whether they are the same object.

---

# 🧠 Quick Revision Summary

```text
Creating a variable:
    name = value

Assignment:
    =

Value comparison:
    ==

Object identity:
    is

Object identity number:
    id(object)

Type checking:
    type(object)

Dynamic typing:
    A name can be rebound to objects of different types.

Memory management:
    Python automatically manages object memory.
```

A simple mental model:

```text
Python Name
     |
     ↓
   Object
     |
     ↓
   Value + Type
```

For example:

```python
age = 18
```

Think:

```text
age
 ↓
18
 ↓
int
```

---

## Practice Quiz

### 1. How do you normally create a variable in Python?
A. `create age = 18`
B. `variable age = 18`
C. `age = 18`
D. `new age = 18`
**Answer:** C

---

### 2. What does the `=` operator do?
A. Compares two values
B. Assigns a value to a name
C. Checks object identity
D. Deletes a variable
**Answer:** B

---

### 3. What will this code print?
```python
data = 10
data = "Python"
print(data)
```
A. `10`
B. `Python`
C. `10 Python`
D. Error
**Answer:** B

---

### 4. Which operator is normally used to compare values?
A. `=`
B. `is`
C. `==`
D. `=>`
**Answer:** C

---

### 5. What does `id()` return?
A. The variable's data type
B. The object's identity as an integer
C. The variable name
D. The value's size in bytes
**Answer:** B

---

# 💻 Hands-On Practice Challenge

## Challenge 7: Variable Assignment & Dynamic Typing Lab

Create a file:

```text
variable_assignment_lab.py
```

Then write:

```python
print("=" * 55)
print("PYTHON VARIABLE ASSIGNMENT LAB")
print("=" * 55)

# 1. Creating a variable
score = 500

print("\n--- 1. Creating a Variable ---")
print("Score:", score)
print("Type:", type(score).__name__)
print("ID:", id(score))

# 2. Creating another reference
backup_score = score

print("\n--- 2. Two Names, Same Object ---")
print("Score:", score)
print("Backup Score:", backup_score)
print("Same object:", score is backup_score)

# 3. Rebinding the second name
backup_score = 750

print("\n--- 3. After Rebinding ---")
print("Score:", score)
print("Backup Score:", backup_score)
print("Same object:", score is backup_score)

# 4. Dynamic typing
data = 100

print("\n--- 4. Dynamic Typing ---")
print(data, type(data).__name__)

data = "Python"

print(data, type(data).__name__)

data = [10, 20, 30]

print(data, type(data).__name__)

print("\n" + "=" * 55)
print("Practice Complete!")
print("=" * 55)
```

### What should you observe?

First:

```text
score → 500
backup_score → 500
```

Both names refer to the same object in this example.

After:

```python
backup_score = 750
```

you should see:

```text
score        → 500
backup_score → 750
```

Finally, observe how `data` is rebound to:

```text
100
↓
"Python"
↓
[10, 20, 30]
```

The type changes because the name is being associated with different objects.

---

# 🎯 Extra Practice

Try these examples yourself:

### Practice 1

```python
name = "Sumit"
print(name)
```

### Practice 2

```python
age = 20
age = 21
print(age)
```

### Practice 3

```python
a = 100
b = a

print(a == b)
print(a is b)
```

### Practice 4

```python
value = 10
print(type(value))

value = "Ten"
print(type(value))
```

Before running each program, **predict the output first**.

This is one of the best ways to improve your programming skills.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Output Variables & Printing Techniques** (2: Variables).

👉 **[Continue to Next Lesson: Output Variables & Printing Techniques →](/tutorials/python-for-beginners/output-variables-printing-techniques)**
