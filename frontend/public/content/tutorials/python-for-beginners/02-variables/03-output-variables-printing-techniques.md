---
id: output-variables-printing-techniques
slug: output-variables-printing-techniques
course: python-for-beginners
chapter: Variables
topic: "Output Variables and Printing Techniques: print(), sep, end, and Formatting"
difficulty: Beginner
readingTime: 12
order: 8
keywords: ["print function python", "sep and end python", "f-strings python", "formatting output python", "python print multiple variables", "string concatenation python"]
lastUpdated: 2026-09-30
author: MSk Team
version: 1.1.0
---


# 🖨️ Python Output and Printing Techniques

So far, we have learned how to create variables and store values in them.

But how do we **show those values to the user?**

Python provides a built-in function called:

```python id="v3x7sk"
print()
```

The `print()` function displays information in the program's output.

For example:

```python id="q1s2mw"
print("Hello, Python!")
```

Output:

```text id="7u6f9c"
Hello, Python!
```

In this lesson, we will learn how to use `print()` with:

* Variables
* Multiple values
* Strings and numbers
* `sep`
* `end`
* f-strings
* Number formatting
* Simple report-style output

---

# 1. Printing a Variable

The simplest way to display a variable is to pass it to `print()`.

```python id="qf7w8n"
name = "Amit"

print(name)
```

Output:

```text id="6l6k9w"
Amit
```

Another example:

```python id="1p5s9a"
age = 18

print(age)
```

Output:

```text id="w2f4hy"
18
```

You can print different types of values:

```python id="3d9z7m"
name = "Amit"
age = 18
height = 5.8
is_student = True

print(name)
print(age)
print(height)
print(is_student)
```

Output:

```text id="x4k1vb"
Amit
18
5.8
True
```

### 💡 Beginner Tip

`print()` can display strings, numbers, Boolean values, variables, and many other Python objects.

---

# 2. Printing Multiple Values

You can give `print()` multiple values separated by commas.

```python id="n7v5tq"
name = "Amit"
age = 18

print(name, age)
```

Output:

```text id="5t0f9c"
Amit 18
```

Python automatically places a space between the values.

For example:

```python id="4y3r7m"
x = "Python"
y = 12
z = "awesome"

print(x, y, z)
```

Output:

```text id="h5f8q2"
Python 12 awesome
```

### 🎯 Remember

When you use commas inside `print()`:

```python id="2v6m1x"
print(a, b, c)
```

Python prints the values with a space between them by default.

---

# 3. Printing Text and Numbers Together

One of the easiest ways to print different types of values is to use commas.

```python id="p7q4k2"
name = "Sumit"
age = 25

print("Name:", name)
print("Age:", age)
```

Output:

```text id="n3v5bc"
Name: Sumit
Age: 25
```

You can also put everything in one `print()`:

```python id="5g8m2w"
print("Name:", name, "Age:", age)
```

Output:

```text id="y4p8nx"
Name: Sumit Age: 25
```

This works even when the values have different data types.

---

# 4. Printing with the `+` Operator

You can also join strings using the `+` operator.

This is called **string concatenation**.

```python id="k8v3q1"
first_name = "Amit"
last_name = "Sharma"

print(first_name + " " + last_name)
```

Output:

```text id="r2n7cj"
Amit Sharma
```

The spaces are important.

Without them:

```python id="v8k3n2"
print(first_name + last_name)
```

Output:

```text id="y5m1px"
AmitSharma
```

So:

```python id="z6b9qw"
first_name + " " + last_name
```

means:

```text id="6v4r0p"
Amit + space + Sharma
```

---

# 5. A Common Error: String + Number

You cannot directly concatenate a string and a number using `+`.

For example:

```python id="3m6f8q"
age = 18

print("My age is " + age)
```

This produces a `TypeError`.

Why?

Because:

```text id="4d8j1s"
"My age is "
```

is a string, while:

```text id="q8c2mz"
18
```

is an integer.

Python does not automatically convert the integer into a string when using `+`.

You could convert it manually:

```python id="y6r4xp"
age = 18

print("My age is " + str(age))
```

Output:

```text id="p2v7hm"
My age is 18
```

But there is an easier and cleaner approach for formatted output:

> **f-strings**

We will learn them shortly.

---

# 6. Using Commas vs `+`

For beginners, these two approaches are worth comparing.

### Using commas

```python id="j3n8kf"
name = "Amit"
age = 18

print("Name:", name, "Age:", age)
```

This is simple and automatically handles different data types.

### Using `+`

```python id="h7p2cx"
name = "Amit"

print("Name: " + name)
```

This works because both sides are strings.

But with numbers:

```python id="k4v9mn"
age = 18

print("Age: " + age)
```

❌ This produces an error.

### 🎯 Beginner Recommendation

When you are just learning `print()`, using commas is often the easiest way to display multiple values.

Later, you'll learn f-strings, which are usually cleaner for formatted messages.

---

# 7. The `sep` Parameter

By default, Python separates multiple items in `print()` with a single space.

For example:

```python id="d5x8q2"
print("Python", "Java", "C++")
```

Output:

```text id="s9c1vw"
Python Java C++
```

The separator is controlled by:

```python id="5y7m2a"
sep
```

The default is:

```python id="8c4n6z"
sep=" "
```

---

## Changing the Separator

You can choose your own separator.

```python id="0m9t4r"
print("Python", "Java", "C++", sep=" | ")
```

Output:

```text id="8w3q5k"
Python | Java | C++
```

Another example:

```python id="h1x6vc"
day = 15
month = 8
year = 1947

print(day, month, year, sep="/")
```

Output:

```text id="n4y8ps"
15/8/1947
```

You can also create a time-like format:

```python id="3b7q1m"
print("10", "45", "30", sep=":")
```

Output:

```text id="g2v9xc"
10:45:30
```

### 🎯 Remember

`sep` controls what appears **between multiple values**.

```text id="4k8z2n"
print(A, B, C, sep="...")
       ↑   ↑
     separator
```

---

# 8. The `end` Parameter

Normally, `print()` moves the cursor to the next line after displaying something.

For example:

```python id="r5t1vm"
print("Hello")
print("Python")
```

Output:

```text id="f8m3xq"
Hello
Python
```

Why?

Because the default value of `end` is:

```python id="w7c2nb"
end="\n"
```

`\n` means **new line**.

---

# 9. Changing `end`

You can change what `print()` puts at the end.

For example:

```python id="q4h9ys"
print("Hello", end=" ")
print("Python")
```

Output:

```text id="t6n2vk"
Hello Python
```

The first `print()` does not move to a new line.

---

## Using `end` with a Message

```python id="m8c3xf"
print("Loading", end="... ")
print("Complete!")
```

Output:

```text id="a5v7rz"
Loading... Complete!
```

Another example:

```python id="j2p6wh"
print("Hello", end="")
print("World")
```

Output:

```text id="n9x4cb"
HelloWorld
```

### 🎯 Remember

* `sep` → controls the space **between items**
* `end` → controls what comes **after the print**

---

# 10. `sep` and `end` Together

You can use both parameters in the same `print()`.

```python id="v7k3mq"
print("Python", "is", "fun", sep=" | ", end="!")
```

Output:

```text id="b8c5nx"
Python | is | fun!
```

Here:

```text id="0p6r2s"
sep=" | "
```

controls the spaces between the values.

And:

```text id="8q4w6m"
end="!"
```

controls the ending.

---

# 11. Printing Items on the Same Line

The `end` parameter is useful in loops.

For example:

```python id="r8n3yv"
for number in range(1, 6):
    print(number, end=" ")
```

Output:

```text id="u5c9dk"
1 2 3 4 5
```

Without `end=" "`:

```python id="m6x2qw"
for number in range(1, 6):
    print(number)
```

Output:

```text id="j9v4bc"
1
2
3
4
5
```

This is one of the most useful examples of `end`.

---

# 12. String Formatting with f-Strings

When you need to create a sentence using variables, **f-strings** are one of the easiest options.

An f-string starts with the letter:

```python id="2m7c9x"
f
```

before the string.

Example:

```python id="v6q3ks"
name = "Rohan"
score = 95

print(f"Student: {name} scored {score} marks.")
```

Output:

```text id="a4y8pn"
Student: Rohan scored 95 marks.
```

The variables are placed inside `{}`.

---

# 13. Why Use f-Strings?

Compare these approaches.

### Using `+`

```python id="x7m2qk"
name = "Rohan"
score = 95

print("Student: " + name + " scored " + str(score) + " marks.")
```

This works, but it becomes difficult to read as the sentence gets longer.

### Using an f-string

```python id="p3v8nc"
print(f"Student: {name} scored {score} marks.")
```

Much easier to read.

### 🎯 Beginner Rule

When you want to put variables inside a sentence, prefer an f-string.

---

# 14. Basic Number Formatting with f-Strings

f-strings can also control how numbers are displayed.

Suppose:

```python id="k4r7xd"
price = 1250.756
```

If we write:

```python id="m9c2vw"
print(f"Price: ₹{price:.2f}")
```

Output:

```text id="n5x8qb"
Price: ₹1250.76
```

Here:

```text id="j7p3mw"
:.2f
```

means:

> Display the number with 2 digits after the decimal point.

---

# 15. Adding Commas to Large Numbers

For large numbers, commas can make the output easier to read.

```python id="c8v4yn"
price = 1250000.7584

print(f"Price: ₹{price:,.2f}")
```

Output:

```text id="k2q6sx"
Price: ₹1,250,000.76
```

Here:

```text id="4m7p1c"
,
```

adds thousands separators.

And:

```text id="8x5q3n"
.2f
```

keeps two decimal places.

---

# 16. Formatting Numbers with Leading Zeros

Suppose you have a roll number:

```python id="h4v8q2"
roll_number = 7
```

You may want to display it as:

```text id="g7p3nc"
0007
```

You can use:

```python id="b2m6xk"
print(f"Roll Number: {roll_number:04d}")
```

Output:

```text id="v9q5rs"
Roll Number: 0007
```

Here:

```text id="w6c3py"
04d
```

means:

> Display the integer using at least 4 digits, filling empty positions with zeros.

---

# 17. Common Formatting Examples

```python id="r3n7vm"
name = "Amit"
age = 20
percentage = 87.4567
price = 125000

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Percentage: {percentage:.2f}%")
print(f"Price: ₹{price:,.2f}")
```

Output:

```text id="k8v4sq"
Name: Amit
Age: 20
Percentage: 87.46%
Price: ₹125,000.00
```

This is much closer to the type of output used in real programs.

---

# 18. The Basic `print()` Structure

At a beginner level, you can remember this simplified structure:

```python id="m5q8cx"
print(value1, value2, value3, sep=" ", end="\n")
```

The important parts are:

| Part   | Purpose                   | Default |
| ------ | ------------------------- | ------- |
| Values | Things to print           | —       |
| `sep`  | Separates multiple values | `" "`   |
| `end`  | Added after printing      | `"\n"`  |

For now, you don't need to worry about advanced parameters such as `file` or `flush`.

### 💡 Optional Note

Python's full `print()` signature also includes `file` and `flush`. These are useful in more advanced programs, but they are not necessary for beginners.

---

# 19. Do's and Don'ts

| Practice                 | ✅ Do                 | ❌ Don't                                     |
| ------------------------ | -------------------- | ------------------------------------------- |
| Multiple values          | `print("Age:", age)` | Convert everything to strings unnecessarily |
| Sentences with variables | `f"Hello {name}"`    | Use many `+` operators                      |
| Separator                | `sep="-"`            | Manually add separators everywhere          |
| Same-line output         | `end=" "`            | Add many empty `print()` statements         |
| Decimal formatting       | `:.2f`               | Show unnecessary decimal digits             |
| Large numbers            | `:,.2f`              | Print difficult-to-read raw numbers         |

---

# 20. A Small Real-World Example

Imagine a student result program.

```python id="p8k4zn"
student_name = "Ananya"
maths = 95
science = 91

print(f"Student: {student_name}")
print(f"Mathematics: {maths}")
print(f"Science: {science}")
```

Output:

```text id="q5v7cm"
Student: Ananya
Mathematics: 95
Science: 91
```

We are already using the same concepts that are used in larger applications:

* Variables
* `print()`
* f-strings
* Number formatting

---

# 🧠 Quick Revision Summary

Remember these five ideas:

### 1. Print a value

```python id="k4m8xv"
print(name)
```

### 2. Print multiple values

```python id="q6n2pc"
print(name, age)
```

### 3. Change the separator

```python id="r9v5mw"
print(day, month, year, sep="/")
```

### 4. Change the ending

```python id="c3x7kb"
print("Hello", end=" ")
```

### 5. Use f-strings for formatted messages

```python id="t8m4qn"
print(f"Hello {name}, your score is {score}.")
```

### 🎯 Cheat Sheet

```text id="z5q2rv"
print(value)
        ↓
Display something

print(a, b)
        ↓
Multiple values

sep="..."
        ↓
What goes BETWEEN values

end="..."
        ↓
What comes AFTER the output

f"...{variable}..."
        ↓
Insert variables into text

:.2f
        ↓
Two decimal places

:,.2f
        ↓
Commas + two decimal places
```

---

## Practice Quiz

### 1. What are the default values of `sep` and `end`?

A. `sep=","` and `end=" "`
B. `sep=" "` and `end="\n"`
C. `sep=""` and `end=""`
D. `sep="\t"` and `end="\r"`

**Answer:** B

---

### 2. What is the output?

```python id="d8p4km"
print("Delhi", "Mumbai", "Kolkata", sep=" -> ")
```

A. `Delhi Mumbai Kolkata`
B. `Delhi -> Mumbai -> Kolkata`
C. `Delhi -> Mumbai -> Kolkata ->`
D. Error

**Answer:** B

---

### 3. What happens here?

```python id="w3k7cx"
print("Marks: " + 95)
```

A. `Marks: 95`
B. `TypeError`
C. `Marks: 95.0`
D. Python automatically converts `95` to a string

**Answer:** B

---

### 4. Which format specifier displays a floating-point number with two decimal places?

A. `:2d`
B. `:.2f`
C. `:%2`
D. `:round`

**Answer:** B

---

### 5. How can you print multiple loop values on the same line?

A. `print(item, end=" ")`
B. `print(item, line=False)`
C. `print(item, newline=0)`
D. `print(item, stay=True)`

**Answer:** A

---

# 💻 Hands-On Practice Challenge

## Challenge 8: Student Report Card Formatter

Create a file named:

```text id="x4m8pq"
report_card.py
```

Then write:

```python id="v7c2mk"
student_name = "Ananya Iyer"
roll_number = 42

maths = 95
science = 91
english = 89
computer = 98

tuition_fee = 45000.0

print("=" * 55)
print("           STUDENT REPORT CARD")
print("=" * 55)

# Date using sep
day = 15
month = 9
year = 2026

print("Exam Date:", end=" ")
print(day, month, year, sep="/")

# Basic f-string formatting
print(f"Roll Number: {roll_number:05d}")
print(f"Student Name: {student_name}")

print("-" * 55)

# Subject marks
print(f"{'Subject':<20} | {'Marks':>10}")
print("-" * 55)

print(f"{'Mathematics':<20} | {maths:>10}")
print(f"{'Science':<20} | {science:>10}")
print(f"{'English':<20} | {english:>10}")
print(f"{'Computer':<20} | {computer:>10}")

print("-" * 55)

total = maths + science + english + computer
average = total / 4

print(f"Total Marks: {total}/400")
print(f"Average: {average:.2f}%")
print(f"Tuition Fee: ₹{tuition_fee:,.2f}")

print("=" * 55)
```

### Expected Output

```text id="p5x8qn"
=======================================================
           STUDENT REPORT CARD
=======================================================
Exam Date: 15/9/2026
Roll Number: 00042
Student Name: Ananya Iyer
-------------------------------------------------------
Subject              |      Marks
-------------------------------------------------------
Mathematics          |         95
Science              |         91
English              |         89
Computer             |         98
-------------------------------------------------------
Total Marks: 373/400
Average: 93.25%
Tuition Fee: ₹45,000.00
=======================================================
```

### What did you practice?

This program combines:

* Variables
* `print()`
* Multiple values
* `sep`
* `end`
* f-strings
* Decimal formatting
* Comma formatting
* Leading zeros
* Basic alignment

---

# 🎯 Extra Practice

Try changing:

```python id="7k2m4p"
student_name = "Ananya Iyer"
```

to your own name.

Then change the marks:

```python id="8v5q1n"
maths = 95
science = 91
english = 89
computer = 98
```

Run the program again and observe how the output changes.

### Challenge

Try adding:

```python id="c6m9xr"
attendance = 92.5
```

Then print:

```text id="h2p7vk"
Attendance: 92.50%
```

using an f-string.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Multiple Assignments** (2: Variables).

👉 **[Continue to Next Lesson: Multiple Assignments →](/tutorials/python-for-beginners/multiple-assignments)**
