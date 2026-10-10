---
id: python-closures
slug: closures
course: python-for-intermediate
chapter: "2: Functions Deep Dive"
topic: "2.3 Closures"
title: "Python Closures: Mechanics, Scope Retention, and Function Factories"
description: "Master Python closures, cell objects in __closure__, lexical scoping, the nonlocal keyword, and lightweight state encapsulation without classes."
difficulty: Intermediate
readingTime: 14
order: 8
keywords:
  - closures
  - lexical scope
  - nonlocal keyword
  - cell objects
  - function factories
  - first class functions
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Python Closures: Mechanics, Scope Retention, and Function Factories

In Python, functions are **first-class citizens**—they can be assigned to variables, passed as arguments to other functions, and returned from functions as values.

When an inner function retains access to variables from its enclosing outer function even **after the outer function has finished executing and returned**, that inner function is called a **Closure**. Closures are the foundation of Python decorators, callback handlers, and lightweight stateful programming.

---

## Real-World Analogy: The Bank Fixed Deposit (FD) Certificate

Imagine locking in a Fixed Deposit (FD) at the State Bank of India:

```
+-------------------------------------------------------------------------+
|                  BANK FIXED DEPOSIT (FD) CLOSURE ANALOGY                |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. Outer Function: open_fd_account(interest_rate=7.5)                  |
|     ──> Allocates locked parameters inside the banking branch           |
|     ──> Issues a signed digital Certificate (returns calculate_interest)|
|     ──> Branch closes & Banker goes home (outer function terminates!)   |
|                                                                         |
|  2. Closure Retention:                                                  |
|     ──> The Certificate keeps the 7.5% rate sealed inside its secret    |
|         pocket (stored in __closure__ cell memory)!                     |
|                                                                         |
|  3. Invoking the Certificate Years Later:                               |
|     ──> certificate(years=5, principal=100000)                          |
|     ──> Accurately computes return using the remembered 7.5% rate!     |
|                                                                         |
+-------------------------------------------------------------------------+
```

Even though `open_fd_account` has long exited and its local stack frame has been destroyed, the returned `calculate_interest` function remembers `interest_rate` indefinitely.

---

## The Three Strict Criteria of a Python Closure

For a function to qualify as a true closure, it must satisfy three criteria:

1. **Nested Function:** There must be an inner function defined inside an outer function.
2. **Free Variable Reference:** The inner function must refer to at least one variable defined in the enclosing scope (called a **free variable**).
3. **Returned from Enclosing Scope:** The outer function must return the inner function object itself (without calling it).

```
+------------------------------------+------------------------------------+
|  Ordinary Nested Function          |  True Python Closure               |
+------------------------------------+------------------------------------+
|  def outer():                      |  def make_multiplier(factor):      |
|      def inner():                  |      def multiplier(x):            |
|          print("Hello")            |          return x * factor # Free! |
|      inner()  # Called immediately |      return multiplier # Returned! |
|  # No state retained               |  # Retains 'factor' in memory!     |
+------------------------------------+------------------------------------+
```

---

## Under the Hood: `__closure__` and Cell Objects

Where does Python store remembered variables once the outer function's stack frame dies? In a tuple of **cell objects** attached directly to the inner function:

```python
def make_multiplier(factor):
    def multiplier(number):
        return number * factor
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print("double(10):", double(10))
print("triple(10):", triple(10))

# Inspecting the internal closure memory
print("Closure cells in double:", double.__closure__)
print("Value inside cell       :", double.__closure__[0].cell_contents)  # 2!
```

---

## Mutating Enclosing State: The `nonlocal` Keyword

By default, inner functions can **read** enclosing variables. However, if you attempt to reassign an enclosing variable (`count = count + 1`), Python treats `count` as a new local variable, raising `UnboundLocalError`.

To modify an enclosing variable, declare it with `nonlocal`:

```
+------------------------------------+------------------------------------+
|  Buggy Attempt (UnboundLocalError) |  Correct Idiom with 'nonlocal'     |
+------------------------------------+------------------------------------+
|  def make_counter():               |  def make_counter():               |
|      count = 0                     |      count = 0                     |
|      def counter():                |      def counter():                |
|          count += 1  # Crash!      |          nonlocal count # Fixed!   |
|          return count              |          count += 1                |
|      return counter                |          return count              |
|                                    |      return counter                |
+------------------------------------+------------------------------------+
```

---

## Comprehensive Code Examples

### 1. Function Factories (Creating Customized Logic on the Fly)

Closures allow you to create specialized function variations without repeating logic:

```python
def create_tax_calculator(state_name, gst_rate):
    """Factory function generating customized tax calculators per Indian state."""
    def calculate_tax(base_amount):
        tax = base_amount * (gst_rate / 100.0)
        total = base_amount + tax
        return {
            "state": state_name,
            "base": base_amount,
            "gst_rate": f"{gst_rate}%",
            "tax_amount": round(tax, 2),
            "final_payable": round(total, 2)
        }
    return calculate_tax

# Instantiate customized functions
calc_maharashtra = create_tax_calculator("Maharashtra", 18.0)
calc_special_sez = create_tax_calculator("Gujarat SEZ", 5.0)

print(calc_maharashtra(10000.0))
print(calc_special_sez(10000.0))
```

**Expected Output:**
```text
{'state': 'Maharashtra', 'base': 10000.0, 'gst_rate': '18.0%', 'tax_amount': 1800.0, 'final_payable': 11800.0}
{'state': 'Gujarat SEZ', 'base': 10000.0, 'gst_rate': '5.0%', 'tax_amount': 500.0, 'final_payable': 10500.0}
```

---

### 2. State-Preserving Cumulative Moving Average

Instead of creating a full class with `self.history`, a closure encapsulates running state cleanly:

```python
def create_moving_average():
    """Encapsulates running sum and count without global variables or classes."""
    total = 0.0
    count = 0

    def add_reading(new_value):
        nonlocal total, count
        total += new_value
        count += 1
        current_avg = total / count
        return round(current_avg, 2)

    return add_reading

# Daily temperature tracker for Pune weather station
pune_temp_avg = create_moving_average()

print("Day 1 (28.0 C) -> Running Avg:", pune_temp_avg(28.0))
print("Day 2 (32.0 C) -> Running Avg:", pune_temp_avg(32.0))
print("Day 3 (30.0 C) -> Running Avg:", pune_temp_avg(30.0))
print("Day 4 (34.0 C) -> Running Avg:", pune_temp_avg(34.0))
```

**Expected Output:**
```text
Day 1 (28.0 C) -> Running Avg: 28.0
Day 2 (32.0 C) -> Running Avg: 30.0
Day 3 (30.0 C) -> Running Avg: 30.0
Day 4 (34.0 C) -> Running Avg: 31.0
```

---

### 3. API Rate Limiting Counter

```python
def create_rate_limiter(max_requests=3):
    """Enforces a maximum number of API invocations before blocking."""
    calls_made = 0

    def execute_request(user_token):
        nonlocal calls_made
        if calls_made >= max_requests:
            return f"[BLOCKED] Rate limit exceeded for {user_token}! Max {max_requests} requests allowed."
        
        calls_made += 1
        return f"[SUCCESS] Request {calls_made}/{max_requests} processed for {user_token}."

    return execute_request

client_limiter = create_rate_limiter(max_requests=3)

print(client_limiter("USER_99"))
print(client_limiter("USER_99"))
print(client_limiter("USER_99"))
print(client_limiter("USER_99"))  # Should be blocked!
```

**Expected Output:**
```text
[SUCCESS] Request 1/3 processed for USER_99.
[SUCCESS] Request 2/3 processed for USER_99.
[SUCCESS] Request 3/3 processed for USER_99.
[BLOCKED] Rate limit exceeded for USER_99! Max 3 requests allowed.
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Error-Prone Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **State Mutation** | Omitting `nonlocal` when reassigning enclosing state | Explicitly declare `nonlocal var_name` |
| **Global Pollution**| Using `global` variables for tracking call counts | Encapsulate private state using a closure |
| **Overengineering**| Creating boilerplate 20-line classes for 1 simple method | Use a 5-line closure function factory |
| **Too Complex** | Nesting 4 levels of closures with 10 nonlocal variables | If state grows beyond 2-3 variables, use an OOP `class` |
| **Closure Check** | Guessing if a function is a closure | Inspect `fn.__closure__` (`None` if not a closure) |

---

## Quick Revision Summary Cheat Sheet

- **Definition:** A nested function that remembers variables from its enclosing lexical scope even after the outer function has returned.
- **Criteria:** Nested function + references enclosing variable + returned as object.
- **Storage:** Free variables are persisted in `fn.__closure__` as `cell` objects (`cell_contents`).
- **`nonlocal` Keyword:** Required whenever reassigning (`=`, `+=`) an enclosing variable inside the inner function.
- **Use Cases:** Function factories, state encapsulation without classes, and building decorators.

---

---

# Practice Challenge

### Scenario: Indian Chai Stall Running Token & Revenue Tracker

A roadside chai stall owner in Lucknow wants a software counter that tracks both:
1. Total cups of chai served today.
2. Total revenue collected in INR (each cup costs ₹15).

Write a closure function `create_chai_counter(price_per_cup=15)` that:
- Maintains private internal state for `total_cups` and `total_revenue`.
- Returns an inner function `order_chai(cups=1)`.
- Each time `order_chai` is called, it increments `total_cups`, adds to `total_revenue`, and returns a summary formatted string:
  `"Served X cups (+₹Y). Today's Total: Z cups | ₹Total Revenue"`.

### Starter Code
```python
def create_chai_counter(price_per_cup=15):
    # TODO: Implement closure with nonlocal state
    pass
```

### Complete Solution
```python
def create_chai_counter(price_per_cup=15):
    total_cups = 0
    total_revenue = 0

    def order_chai(cups=1):
        nonlocal total_cups, total_revenue
        total_cups += cups
        cost = cups * price_per_cup
        total_revenue += cost
        return f"Served {cups} cup(s) (+₹{cost}). Total: {total_cups} cups | ₹{total_revenue:,.2f}"

    return order_chai

# Morning shift stall tracker
lucknow_chai_stall = create_chai_counter(price_per_cup=15)

print("=== Lucknow Chai Stall Morning Orders ===")
print(lucknow_chai_stall(2))  # Order 2 cups
print(lucknow_chai_stall(1))  # Order 1 cup
print(lucknow_chai_stall(4))  # Order 4 cups for office staff
print(lucknow_chai_stall(3))  # Order 3 cups
```

### Expected Output
```text
=== Lucknow Chai Stall Morning Orders ===
Served 2 cup(s) (+₹30). Total: 2 cups | ₹30.00
Served 1 cup(s) (+₹15). Total: 3 cups | ₹45.00
Served 4 cup(s) (+₹60). Total: 7 cups | ₹105.00
Served 3 cup(s) (+₹45). Total: 10 cups | ₹150.00
```

---

## Practice Quiz

### 1. What does the __closure__ attribute of a Python function contain?
A. The source code text of the function
B. A tuple of cell objects containing the free variables captured from the enclosing lexical scope
C. A list of all global variables in the file
D. The return value of the function
**Answer:** B
**Explanation:** When a function is a closure, Python attaches a tuple of `cell` objects to its `__closure__` attribute. Each cell contains `cell_contents` holding a reference to an enclosed free variable. If the function is not a closure, `__closure__` is `None`.

---

### 2. What occurs if an inner function attempts count += 1 without declaring nonlocal count?
A. It successfully increments the enclosing variable
B. It raises an UnboundLocalError: local variable 'count' referenced before assignment
C. It creates a global variable named count
D. It deletes count from memory
**Answer:** B
**Explanation:** Python treats any variable assigned within a function as local by default. Without `nonlocal count`, Python considers `count` a local variable, and attempting to read it during `count += 1` before it has been assigned locally triggers an `UnboundLocalError`.

---

### 3. What is the output of the following code snippet?
```python
def outer(x):
    def inner(y):
        return x + y
    return inner

add_five = outer(5)
print(add_five(10))
```
A. 5
B. 10
C. 15
D. TypeError
**Answer:** C
**Explanation:** `outer(5)` returns `inner` with `x = 5` preserved in its closure. Invoking `add_five(10)` calculates `5 + 10 = 15`.

---

### 4. Which of the following is NOT a required condition for a Python closure?
A. The function must be defined inside another function
B. The inner function must refer to an enclosing variable
C. The outer function must define at least one class
D. The outer function must return the inner function
**Answer:** C
**Explanation:** Closures do not involve classes. They are purely functional constructs requiring a nested function, a reference to an enclosing non-global variable, and the outer function returning the inner function.

---

### 5. Why are closures often preferred over classes for simple stateful tasks like multipliers or counters?
A. Closures run 50 times faster on modern CPUs
B. Closures are lightweight, require zero boilerplate `__init__` or `self` syntax, and provide strict data encapsulation
C. Closures do not consume any RAM
D. Python classes are being deprecated
**Answer:** B
**Explanation:** For lightweight operations (like a customized multiplier or callback token), closures provide private state retention without the syntactic boilerplate of class definitions, constructors, and instance method invocations.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Decorators Basics** (2: Functions Deep Dive).

👉 **[Continue to Next Lesson: Decorators Basics →](/tutorials/python-for-intermediate/decorators-basics)**
