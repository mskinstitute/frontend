---
id: python-math-module-math-random
slug: math-module-math-random
course: python-for-beginners
chapter: 4
topic: 4.3
title: Math Module (math, random)
description: Master Python's standard math and random modules for scientific computing, trigonometric analysis, pseudo-random generation, shuffling, and cryptographic safety with secrets.
difficulty: Beginner
readingTime: 14
order: 16
keywords:
  - python math module
  - python random module
  - math sqrt ceil floor
  - random randint choice shuffle
  - random seed
  - secrets module otp
  lastUpdated: 2026-09-30
  author: MSk Team
  version: 1.1.0
---

# 🧮 Python `math` and `random` Modules

Python already provides basic arithmetic operators:

```python
+   -   *   /   //   %   **
```

But sometimes we need more advanced operations such as:

* Square roots
* Trigonometry
* Rounding
* Factorials
* GCD and LCM
* Random numbers
* Random selections
* Shuffling
* Simulations

Python provides useful **standard library modules** for these tasks.

The two important modules in this lesson are:

```python
math
random
```

And for security-sensitive random values, we will also learn:

```python
secrets
```

---

# 🧠 What Is a Module?

A **module** is a Python file that contains useful code such as functions, classes, and constants that we can use in our program.

For example:

```python
import math
```

After importing it, we can use:

```python
math.sqrt(25)
```

You don't need to install `math` using `pip`.

It is included with Python.

---

# 🔬 `math` vs `random`

| Module    | Main Purpose                     | Example                     |
| --------- | -------------------------------- | --------------------------- |
| `math`    | Mathematical calculations        | `math.sqrt(25)`             |
| `random`  | Pseudo-random values             | `random.randint(1, 10)`     |
| `secrets` | Security-sensitive random values | Secure OTP/token generation |

### Simple way to remember

```text
math
 ↓
Calculate

random
 ↓
Simulate chance

secrets
 ↓
Generate security-sensitive random values
```

---

# 1. The `math` Module

Let's start by importing it:

```python
import math
```

Now we can access many mathematical functions.

---

# π, e, and τ

The `math` module provides some important mathematical constants.

```python
import math

print(math.pi)
print(math.e)
print(math.tau)
```

Output:

```text
3.141592653589793
2.718281828459045
6.283185307179586
```

### What are they?

```text
math.pi
→ π
→ approximately 3.14159

math.e
→ Euler's number
→ approximately 2.71828

math.tau
→ 2π
→ approximately 6.28318
```

For example:

```python
radius = 5

area = math.pi * radius ** 2

print(area)
```

Output:

```text
78.53981633974483
```

---

# 2. Square Root with `math.sqrt()`

The `sqrt()` function calculates the square root.

```python
import math

result = math.sqrt(144)

print(result)
```

Output:

```text
12.0
```

Because:

```text
12 × 12 = 144
```

Another example:

```python
print(math.sqrt(25))
print(math.sqrt(81))
```

Output:

```text
5.0
9.0
```

---

# 📐 `math.hypot()`

`math.hypot()` can calculate the length of the hypotenuse of a right triangle.

For example:

```python
import math

distance = math.hypot(3, 4)

print(distance)
```

Output:

```text
5.0
```

This is based on:

```text
√(3² + 4²)
= √25
= 5
```

This function is useful for distance calculations.

---

# 3. Rounding with `ceil()`, `floor()`, and `trunc()`

Python provides several ways to handle decimal values.

### `math.ceil()`

`ceil()` rounds **up** toward positive infinity.

```python
import math

print(math.ceil(4.2))
print(math.ceil(4.9))
```

Output:

```text
5
5
```

---

### `math.floor()`

`floor()` rounds **down** toward negative infinity.

```python
print(math.floor(4.2))
print(math.floor(4.9))
```

Output:

```text
4
4
```

Negative numbers are important:

```python
print(math.floor(-4.2))
```

Output:

```text
-5
```

---

### `math.trunc()`

`trunc()` removes the decimal part by moving toward zero.

```python
print(math.trunc(4.9))
print(math.trunc(-4.9))
```

Output:

```text
4
-4
```

---

# 📊 `ceil()` vs `floor()` vs `trunc()`

|  Value | `ceil()` | `floor()` | `trunc()` |
| -----: | -------: | --------: | --------: |
|  `4.2` |      `5` |       `4` |       `4` |
|  `4.9` |      `5` |       `4` |       `4` |
| `-4.2` |     `-4` |      `-5` |      `-4` |
| `-4.9` |     `-4` |      `-5` |      `-4` |

### Easy memory trick

```text
ceil
↑
go up

floor
↓
go down

trunc
✂
remove decimal part toward zero
```

---

# 4. Factorial with `math.factorial()`

A factorial multiplies a positive integer by all positive integers below it.

For example:

```text
5! = 5 × 4 × 3 × 2 × 1
   = 120
```

Python:

```python
import math

print(math.factorial(5))
```

Output:

```text
120
```

Another example:

```python
print(math.factorial(6))
```

Output:

```text
720
```

---

# 5. GCD and LCM

## GCD

GCD means **Greatest Common Divisor**.

For example:

```python
import math

print(math.gcd(48, 18))
```

Output:

```text
6
```

The largest number that divides both 48 and 18 is 6.

---

## LCM

LCM means **Least Common Multiple**.

```python
print(math.lcm(12, 15))
```

Output:

```text
60
```

So:

```text
GCD → Greatest Common Divisor
LCM → Least Common Multiple
```

These functions are useful in mathematical and scheduling problems.

---

# 📐 6. Trigonometry

The `math` module provides:

```python
math.sin()
math.cos()
math.tan()
```

These functions expect the angle in **radians**, not degrees.

This is important.

---

# Degrees vs Radians

Humans commonly use degrees:

```text
45°
90°
180°
```

Python's trigonometric functions use radians.

For example:

```python
import math

angle_degrees = 45

angle_radians = math.radians(angle_degrees)

print(angle_radians)
```

Output:

```text
0.7853981633974483
```

---

# Calculating Sine and Cosine

```python
import math

angle = math.radians(45)

sine = math.sin(angle)
cosine = math.cos(angle)

print(sine)
print(cosine)
```

Output:

```text
0.7071067811865475
0.7071067811865476
```

For easier reading:

```python
print(f"sin(45°) = {sine:.4f}")
print(f"cos(45°) = {cosine:.4f}")
```

Output:

```text
sin(45°) = 0.7071
cos(45°) = 0.7071
```

---

# 🔄 Convert Radians Back to Degrees

Use:

```python
math.degrees()
```

Example:

```python
import math

radians = math.pi

degrees = math.degrees(radians)

print(degrees)
```

Output:

```text
180.0
```

### Remember

```text
Degrees → Radians
math.radians()

Radians → Degrees
math.degrees()
```

---

# 🎲 7. The `random` Module

Now let's learn about randomness.

Import the module:

```python
import random
```

The `random` module can be used for:

* Games
* Simulations
* Random selections
* Testing
* Sampling
* Shuffling

For example:

```python
import random

number = random.random()

print(number)
```

You will get a different value such as:

```text
0.6394267984578837
```

The value is:

```text
0.0 <= number < 1.0
```

---

# 🎯 `random.randint()`

`randint(a, b)` generates a random integer between `a` and `b`.

**Both endpoints are included.**

```python
import random

dice = random.randint(1, 6)

print(dice)
```

Possible results:

```text
1
2
3
4
5
6
```

This is useful for simulating a dice roll.

---

# 🔢 `random.randrange()`

`randrange()` works similarly to Python's `range()`.

For example:

```python
import random

number = random.randrange(10, 30, 2)

print(number)
```

Possible values include:

```text
10
12
14
16
...
28
```

Notice that `30` is not included.

---

# 🍎 `random.choice()`

`choice()` randomly selects one item from a sequence.

```python
import random

fruits = [
    "Mango",
    "Apple",
    "Banana",
    "Guava"
]

fruit = random.choice(fruits)

print(fruit)
```

Possible output:

```text
Mango
```

or:

```text
Apple
```

or another fruit from the list.

---

# 🎟️ `random.sample()`

`sample()` selects multiple **unique items** without replacement.

```python
import random

students = [
    "Aman",
    "Riya",
    "Rahul",
    "Neha",
    "Priya"
]

winners = random.sample(students, k=2)

print(winners)
```

Possible output:

```text
['Rahul', 'Priya']
```

The same student will not appear twice in that sample.

This can be useful for:

* Raffles
* Random teams
* Prize selection
* Data sampling

---

# 🔀 `random.shuffle()`

`shuffle()` randomly rearranges the items in a list.

```python
import random

cards = [
    "Card A",
    "Card B",
    "Card C",
    "Card D"
]

random.shuffle(cards)

print(cards)
```

Possible output:

```text
['Card C', 'Card A', 'Card D', 'Card B']
```

The original list is changed.

### Important

`random.shuffle()` returns `None`.

So don't write:

```python
cards = random.shuffle(cards)
```

Instead:

```python
random.shuffle(cards)
```

Then use:

```python
print(cards)
```

---

# 🔁 8. `random.seed()`

The numbers generated by `random` are **pseudo-random**.

That means they look random, but the sequence is generated by an algorithm.

Sometimes we want the same sequence again.

This is useful for:

* Testing
* Debugging
* Classroom demonstrations
* Reproducible experiments

We can use `random.seed()`.

```python
import random

random.seed(42)

print(random.randint(1, 100))
print(random.randint(1, 100))
print(random.randint(1, 100))
```

If you run the same program again with the same seed, the sequence will repeat.

---

# 🧪 Example: Reproducible Random Numbers

```python
import random

random.seed(42)

first_run = [
    random.randint(1, 100)
    for _ in range(4)
]

random.seed(42)

second_run = [
    random.randint(1, 100)
    for _ in range(4)
]

print("First Run :", first_run)
print("Second Run:", second_run)

print("Same sequence:", first_run == second_run)
```

Output:

```text
First Run : [82, 15, 4, 95]
Second Run: [82, 15, 4, 95]
Same sequence: True
```

### Remember

> `seed()` is useful when you want repeatable random results.

---

# 🔐 9. `random` vs `secrets`

This is a very important concept.

The `random` module is useful for:

* Games
* Simulations
* Testing
* Random selections

But it should **not** be used for security-sensitive values such as:

* Password reset tokens
* Authentication tokens
* Security codes
* Session tokens
* Sensitive OTP generation

For these tasks, Python provides:

```python
secrets
```

The `secrets` module is designed for generating random values for security-sensitive applications.

---

# 🔑 Secure Random Values with `secrets`

Example:

```python
import secrets

number = secrets.randbelow(10)

print(number)
```

This generates a secure random number from:

```text
0 to 9
```

---

# 📱 Secure 6-Digit Code

For demonstration purposes, you can generate a secure six-digit code like this:

```python
import secrets

otp = "".join(
    str(secrets.randbelow(10))
    for _ in range(6)
)

print(otp)
```

Possible output:

```text
849201
```

The result will normally be different each time.

### Important

In a real banking or authentication system, OTP delivery, expiration, rate limiting, verification, and storage must also be handled securely. Generating the number is only one part of a secure OTP system.

---

# 🔐 Secure Password Example

The `secrets` module can also choose characters securely.

```python
import secrets
import string

characters = string.ascii_letters + string.digits + "!@#$%^&*"

password = "".join(
    secrets.choice(characters)
    for _ in range(12)
)

print(password)
```

Possible output:

```text
9k#V7$qX@2mP
```

---

# 📊 `random` vs `secrets`

| Requirement                     | Use       |
| ------------------------------- | --------- |
| Dice game                       | `random`  |
| Game simulation                 | `random`  |
| Random test data                | `random`  |
| Shuffle cards                   | `random`  |
| Scientific simulation           | `random`  |
| Security token                  | `secrets` |
| Password reset token            | `secrets` |
| Authentication token            | `secrets` |
| Security-sensitive random value | `secrets` |

### Easy Rule

```text
Need normal randomness?
        ↓
     random

Need security randomness?
        ↓
     secrets
```

---

# ⚠️ Common Beginner Mistakes

## Mistake 1: Using degrees directly with `sin()`

Don't:

```python
math.sin(90)
```

if you mean 90 degrees.

Use:

```python
math.sin(math.radians(90))
```

---

## Mistake 2: Expecting `shuffle()` to return a list

Don't:

```python
shuffled = random.shuffle(my_list)
```

Use:

```python
random.shuffle(my_list)
```

`shuffle()` changes the list directly and returns `None`.

---

## Mistake 3: Using `random` for security

Don't use:

```python
random.randint(100000, 999999)
```

for security-sensitive authentication codes.

Use a security-focused approach such as:

```python
secrets.randbelow()
```

---

# ✅ Do's and Don'ts

| Situation          | Don't                                          | Do                            |
| ------------------ | ---------------------------------------------- | ----------------------------- |
| Square root        | Write your own unnecessarily                   | `math.sqrt()`                 |
| Trigonometry       | Pass degrees directly                          | Convert with `math.radians()` |
| Random game number | `secrets` unnecessarily                        | `random.randint()`            |
| Security token     | `random`                                       | `secrets`                     |
| Shuffle list       | `result = random.shuffle(list)`                | `random.shuffle(list)`        |
| Repeatable testing | Expect random sequence to repeat automatically | Use `random.seed()`           |

---

# 📌 Quick Revision Cheat Sheet

```text
PYTHON MATH MODULE
────────────────────────────────

import math

math.pi
→ π

math.sqrt(x)
→ Square root

math.hypot(x, y)
→ Hypotenuse / distance

math.ceil(x)
→ Round up

math.floor(x)
→ Round down

math.trunc(x)
→ Remove decimal toward zero

math.factorial(x)
→ Factorial

math.gcd(a, b)
→ Greatest Common Divisor

math.lcm(a, b)
→ Least Common Multiple

math.radians(x)
→ Degrees → Radians

math.degrees(x)
→ Radians → Degrees

math.sin()
math.cos()
math.tan()
→ Trigonometry
```

```text
PYTHON RANDOM MODULE
────────────────────────────────

import random

random.random()
→ Random float from 0.0 up to 1.0

random.randint(a, b)
→ Random integer including a and b

random.randrange(start, stop, step)
→ Random value from a range

random.choice(sequence)
→ Pick one item

random.sample(sequence, k)
→ Pick unique items

random.shuffle(list)
→ Shuffle list in-place

random.seed(value)
→ Repeatable random sequence
```

```text
SECURITY
────────────────────────────────

import secrets

secrets.randbelow()
secrets.choice()

→ Use for security-sensitive random values
```

---

## Practice Quiz

### 1. Which module provides `sqrt()`?
A. `random`
B. `math`
C. `number`
D. `calc`
**Answer:** B

---

### 2. What is the result of `math.floor(-4.2)`?
A. `-4`
B. `-5`
C. `4`
D. `-4.2`
**Answer:** B

---

### 3. What does `random.randint(1, 10)` generate?
A. Only values from 1 to 9
B. Values from 1 to 10, including both endpoints
C. Only values from 2 to 9
D. Decimal values from 1.0 to 10.0
**Answer:** B

---

### 4. Which module should be used for security-sensitive random tokens?
A. `random`
B. `math`
C. `secrets`
D. `token`
**Answer:** C

---

### 5. What does `random.shuffle()` do?
A. Creates a new shuffled list
B. Sorts the list
C. Randomly rearranges the list in-place
D. Converts the list into a tuple
**Answer:** C

---

### 6. Why do we use `math.radians()` before `math.sin()` when working with degrees?
A. `sin()` only accepts strings
B. `sin()` expects radians
C. `radians()` makes the number random
D. `sin()` only works with integers
**Answer:** B

---

# 💻 Hands-On Practice Challenge

## Challenge 16: Cricket Super Over Simulator

Now let's combine `math` and `random` in a fun simulation.

We will create a simple **6-ball cricket simulation**.

The program will:

* Generate random ball outcomes
* Track runs
* Track wickets
* Use `random.choices()`
* Use `math.hypot()` for a simple distance calculation

### Starter Code

```python
import random
import math

print("=" * 55)
print("       CRICKET SUPER OVER SIMULATOR")
print("=" * 55)

BALL_OUTCOMES = [
    0,
    1,
    2,
    3,
    4,
    6,
    "WICKET"
]

OUTCOME_WEIGHTS = [
    0.20,
    0.30,
    0.15,
    0.05,
    0.15,
    0.10,
    0.05
]


def play_super_over(team_name):

    runs = 0
    wickets = 0

    print(f"\n{team_name} Batting")
    print("-" * 55)

    for ball in range(1, 7):

        outcome = random.choices(
            BALL_OUTCOMES,
            weights=OUTCOME_WEIGHTS,
            k=1
        )[0]

        if outcome == "WICKET":
            wickets += 1
            print(
                f"Ball {ball}: WICKET | "
                f"Score: {runs}/{wickets}"
            )
        else:
            runs += outcome

            print(
                f"Ball {ball}: "
                f"{outcome} run(s) | "
                f"Score: {runs}/{wickets}"
            )

    print(
        f"Final Score: "
        f"{runs}/{wickets}"
    )

    return runs


# Simulate two teams

team_a_score = play_super_over("Team A")

team_b_score = play_super_over("Team B")


# Display result

print("\n" + "=" * 55)
print("             MATCH RESULT")
print("=" * 55)

if team_a_score > team_b_score:
    print("Team A scored more runs.")

elif team_b_score > team_a_score:
    print("Team B scored more runs.")

else:
    print("Match tied!")


# Simple distance calculation

x = 55
y = 48

distance = math.hypot(x, y)

print(
    f"\nCalculated distance: "
    f"{distance:.2f} meters"
)

print("=" * 55)
```

---

# 🧪 Challenge Tasks

After running the program, try these changes.

### Task 1 — Change the number of balls

Currently:

```python
for ball in range(1, 7):
```

Try:

```python
for ball in range(1, 13):
```

Observe what happens.

---

### Task 2 — Add a new outcome

Add another possible outcome:

```python
5
```

Then update the weights.

---

### Task 3 — Make the simulation repeatable

Add:

```python
random.seed(42)
```

near the beginning of the program.

Run the program multiple times.

Observe whether the same sequence is produced.

---

### Task 4 — Change the distance

Try:

```python
x = 60
y = 40
```

Then observe the new result from:

```python
math.hypot(x, y)
```

---

# 🎯 Lesson Summary

In this lesson, you learned:

* What Python modules are
* How to import a module
* How to use the `math` module
* `math.pi`, `math.e`, and `math.tau`
* `math.sqrt()`
* `math.hypot()`
* `math.ceil()`
* `math.floor()`
* `math.trunc()`
* `math.factorial()`
* `math.gcd()`
* `math.lcm()`
* Trigonometric functions
* Degrees and radians
* `random.random()`
* `random.randint()`
* `random.randrange()`
* `random.choice()`
* `random.sample()`
* `random.shuffle()`
* `random.seed()`
* Why `random` should not be used for security-sensitive randomness
* How `secrets` is used for security-sensitive random values
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **String Introduction** (5: Strings).

👉 **[Continue to Next Lesson: String Introduction →](/tutorials/python-for-beginners/string-introduction)**
