---
id: python-assignment-operators
slug: assignment-operators
course: python-for-beginners
chapter: 6
topic: 6.2
title: Assignment Operators
description: Master Python simple and compound assignment operators (+=, -=, *=, /=), understand in-place list mutation mechanics, and leverage the Python 3.8+ walrus operator (:=).
difficulty: Beginner
readingTime: 13
order: 24
keywords:
  - python assignment operators
  - compound assignment
  - augmented assignment
  - walrus operator
  - assignment expressions
  - in place mutation
  - assignment operators
  - variable assignment
  - python shortcuts
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---


# 📝 Assignment Operators in Python

Assignment operators are used to **store a value in a variable**.

The most basic assignment operator in Python is:

```python
=
```

For example:

```python
age = 20
```

This means:

> Store the value `20` in the variable `age`.

You can then use the variable:

```python
print(age)
```

Output:

```text
20
```

> 💡 **Easy way to remember:**  
> `=` means **"put this value into this variable."**

---

## 🧠 How Assignment Works

Look at this example:

```python
name = "Rahul"
```

You can think of it like this:

```text
"Rahul"
   ↓
 name
```

The value `"Rahul"` is stored in `name`.

Another example:

```python
marks = 85
```

```text
85
 ↓
marks
```

Now `marks` contains the value `85`.

---













---

# ➕ Compound Assignment Operators

Python also provides **shortcuts** for updating a variable.

For example, suppose:

```python
score = 10
```

Now you want to add `5`.

You could write:

```python
score = score + 5
```

This works perfectly.

But Python gives us a shorter way:

```python
score += 5
```

Both statements do the same thing.

```text
score = score + 5

score += 5
```

> 💡 **Compound assignment operators** make repeated updates shorter and easier to write.

---

# 📋 Common Assignment Operators

Here are the assignment operators you will commonly see in Python:

| Operator | Meaning | Example | Same As |
|---|---|---|---|
| `=` | Assign | `x = 10` | — |
| `+=` | Add and assign | `x += 5` | `x = x + 5` |
| `-=` | Subtract and assign | `x -= 5` | `x = x - 5` |
| `*=` | Multiply and assign | `x *= 5` | `x = x * 5` |
| `/=` | Divide and assign | `x /= 5` | `x = x / 5` |
| `//=` | Floor divide and assign | `x //= 5` | `x = x // 5` |
| `%=` | Modulus and assign | `x %= 5` | `x = x % 5` |
| `**=` | Power and assign | `x **= 2` | `x = x ** 2` |

Let's understand them one by one.

---

# 1. `=` — Basic Assignment

The `=` operator assigns a value to a variable.

```python
x = 10
```

Now:

```text
x → 10
```

Another example:

```python
city = "Shikohabad"
```

Now `city` contains:

```text
Shikohabad
```

> ✅ **Remember:**  
> `=` is used to **assign or store a value**.

---

# 2. `+=` — Add and Assign

The `+=` operator adds a value to the current variable value.

### Example

```python
score = 10
score += 5

print(score)
```

Output:

```text
15
```

It is the same as:

```python
score = score + 5
```

### Step by Step

Initially:

```text
score = 10
```

Then:

```text
score += 5
```

Python does:

```text
10 + 5 = 15
```

So now:

```text
score = 15
```

### Real-Life Example

Suppose you have ₹500 and receive another ₹200:

```python
balance = 500
balance += 200

print(balance)
```

Output:

```text
700
```

> ✅ **Remember:**  
> `+=` means **add to the current value**.

---

# 3. `-=` — Subtract and Assign

The `-=` operator subtracts a value from the current variable value.

### Example

```python
score = 20
score -= 5

print(score)
```

Output:

```text
15
```

It is the same as:

```python
score = score - 5
```

### Real-Life Example

Suppose your wallet contains ₹1,000 and you spend ₹250:

```python
money = 1000
money -= 250

print(money)
```

Output:

```text
750
```

> ✅ **Remember:**  
> `-=` means **subtract from the current value**.

---

# 4. `*=` — Multiply and Assign

The `*=` operator multiplies the current value and stores the new result.

### Example

```python
number = 5
number *= 3

print(number)
```

Output:

```text
15
```

It is the same as:

```python
number = number * 3
```

Another example:

```python
price = 100
price *= 2

print(price)
```

Output:

```text
200
```

> ✅ **Remember:**  
> `*=` means **multiply the current value**.

---

# 5. `/=` — Divide and Assign

The `/=` operator divides the current value and stores the result.

### Example

```python
number = 20
number /= 4

print(number)
```

Output:

```text
5.0
```

It is the same as:

```python
number = number / 4
```

> ✅ **Remember:**  
> `/=` means **divide the current value**.

---

# 6. `//=` — Floor Divide and Assign

The `//=` operator performs floor division and stores the result.

### Example

```python
number = 17
number //= 4

print(number)
```

Output:

```text
4
```

It is the same as:

```python
number = number // 4
```

> ✅ **Remember:**  
> `//=` means **perform floor division and store the result**.

---

# 7. `%=` — Modulus and Assign

The `%=` operator finds the remainder and stores it in the variable.

### Example

```python
number = 17
number %= 5

print(number)
```

Output:

```text
2
```

It is the same as:

```python
number = number % 5
```

Because:

```text
17 ÷ 5
Remainder = 2
```

> ✅ **Remember:**  
> `%=` means **find the remainder and store it**.

---

# 8. `**=` — Power and Assign

The `**=` operator calculates a power and stores the result.

### Example

```python
number = 2
number **= 3

print(number)
```

Output:

```text
8
```

It is the same as:

```python
number = number ** 3
```

Because:

```text
2 × 2 × 2 = 8
```

> ✅ **Remember:**  
> `**=` means **raise the current value to a power**.

---













---

# 🔄 Why Use Compound Assignment?

Compound assignment is useful when you want to **update the same variable again and again**.

For example:

```python
score = 0

score += 10
score += 20
score += 15

print(score)
```

Output:

```text
45
```

The variable keeps changing:

```text
Start → 0
+10   → 10
+20   → 30
+15   → 45
```

This makes compound assignment especially useful when a value needs to be updated.

---

# ⚠️ A Common Beginner Mistake

Do not confuse:

```python
=
```

with:

```python
==
```

For assignment, use:

```python
x = 10
```

The operator `==` is used for comparison and belongs to a different topic.

For this lesson, remember only:

> `=` → assign a value

---

# 🟣 The Walrus Operator (`:=`)

Python also has another special assignment operator:

```python
:=
```

It is called the **walrus operator**.

The walrus operator allows you to **assign a value and use that value in the same expression**.

### Simple Example

```python
if (age := 20) >= 18:
    print(age)
```

Here:

```python
age := 20
```

stores `20` in `age`.

At the same time, the value `20` is used in the condition.

So the program prints:

```text
20
```

---

## 🧠 Why is it called the "Walrus" Operator?

The symbol:

```text
:=
```

looks a little like the eyes and tusks of a walrus.

That's why Python developers commonly call it the **walrus operator**.

---




















---

# 🧩 Simple Walrus Example

Consider this example:

```python
name = "Rahul"

print(name)
```

Here, the assignment and use happen separately.

With the walrus operator, assignment can happen inside an expression.

For example:

```python
if (name := "Rahul"):
    print(name)
```

The value `"Rahul"` is assigned to `name`, and then `name` is used by the `print()` statement.

Output:

```text
Rahul
```

> 💡 **Beginner Tip:**  
> You do not need to use `:=` everywhere. Normal assignment with `=` is still the most common way to assign a value.

---

# 🔍 `=` vs `+=` vs `:=`

These operators have different purposes.

| Operator | Simple Meaning |
|---|---|
| `=` | Assign a value |
| `+=` | Add and update |
| `-=` | Subtract and update |
| `*=` | Multiply and update |
| `/=` | Divide and update |
| `//=` | Floor divide and update |
| `%=` | Find remainder and update |
| `**=` | Calculate power and update |
| `:=` | Assign and use the value in the same expression |

Think of them like this:

```text
=    → Store
+=   → Add + Store
-=   → Subtract + Store
*=   → Multiply + Store
/=   → Divide + Store
//=  → Floor Divide + Store
%=   → Remainder + Store
**=  → Power + Store
:=   → Assign + Use
```

---

# 🧪 Try It Yourself

Now practice each assignment operator.

---

## 🟢 Practice 1: Basic Assignment

```python
marks = 80
print(marks)
```

Expected output:

```text
80
```

---

## 🟢 Practice 2: Add and Assign

```python
score = 50
score += 20

print(score)
```

Expected output:

```text
70
```

---

## 🟢 Practice 3: Subtract and Assign

```python
money = 1000
money -= 300

print(money)
```

Expected output:

```text
700
```

---

## 🟡 Practice 4: Multiply and Assign

```python
number = 6
number *= 4

print(number)
```

Expected output:

```text
24
```

---

## 🟡 Practice 5: Divide and Assign

```python
number = 20
number /= 5

print(number)
```

Expected output:

```text
4.0
```

---

## 🟡 Practice 6: Modulus and Assign

```python
number = 17
number %= 5

print(number)
```

Expected output:

```text
2
```

---

## 🔵 Practice 7: Power and Assign

```python
number = 3
number **= 2

print(number)
```

Expected output:

```text
9
```

---

## 🔥 Challenge: Update a Score

Start with:

```python
score = 0
```

Perform these updates:

```text
+10
+20
-5
×2
```

Try to write the Python code using compound assignment operators.

### One possible solution

```python
score = 0

score += 10
score += 20
score -= 5
score *= 2

print(score)
```

Output:

```text
50
```

---

# 🧠 Quick Summary

Assignment operators are used to **store and update values**.

The most important operators are:

```text
=    → Assign
+=   → Add and assign
-=   → Subtract and assign
*=   → Multiply and assign
/=   → Divide and assign
//=  → Floor divide and assign
%=   → Modulus and assign
**=  → Power and assign
:=   → Assign and use in the same expression
```

> 🎯 **Key Idea:**  
> Assignment operators help you store values and update them without writing unnecessary code.

---

# 📝 Practice Quiz

## 1. Which operator is used for basic assignment?

A. `==`  
B. `=`  
C. `+=`  
D. `:=`
**Answer:** B. `=`

---

## 2. What does `+=` do?

A. Only adds two numbers  
B. Adds a value to a variable and stores the result  
C. Compares two values  
D. Divides a variable
**Answer:** B. Adds a value to a variable and stores the result

---

## 3. What is the result?

```python
x = 10
x += 5
print(x)
```

A. `5`  
B. `10`  
C. `15`  
D. `50`
**Answer:** C. `15`

---

## 4. What does `-=` do?

A. Subtracts and updates the variable  
B. Compares values  
C. Finds a remainder  
D. Creates a new variable
**Answer:** A. Subtracts and updates the variable

---

## 5. What is the result?

```python
x = 20
x //= 6
print(x)
```

A. `3`  
B. `3.33`  
C. `4`  
D. `2`
**Answer:** A. `3`

---

## 6. What does `%=` do?

A. Multiplies and stores  
B. Finds the remainder and stores it  
C. Divides and stores  
D. Calculates power
**Answer:** B. Finds the remainder and stores it

---

## 7. What does `**=` do?

A. Adds a number  
B. Finds a remainder  
C. Calculates a power and stores the result  
D. Performs comparison
**Answer:** C. Calculates a power and stores the result

---

## 8. What is the walrus operator?

A. `==`  
B. `=>`  
C. `:=`  
D. `::`
**Answer:** C. `:=`

---

## 9. What is special about `:=`?

A. It only performs addition  
B. It assigns a value and allows that value to be used in the same expression  
C. It compares two variables  
D. It deletes a variable
**Answer:** B. It assigns a value and allows that value to be used in the same expression

---










---

# 🚀 Practice Before Moving On

Before moving to the next topic, make sure you can explain these in your own words:

```text
=     → Store a value
+=    → Add and update
-=    → Subtract and update
*=    → Multiply and update
/=    → Divide and update
//=   → Floor divide and update
%=    → Remainder and update
**=   → Power and update
:=    → Assign and use in one expression
```

Try writing a few examples yourself. The more you practice these operators, the more natural they will become.