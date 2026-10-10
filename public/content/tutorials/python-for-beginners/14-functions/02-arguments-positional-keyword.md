---
id: arguments-positional-keyword
slug: arguments-positional-keyword
course: python-for-beginners
chapter: 14
topic: 14.2
title: "Function Arguments in Python: Positional & Keyword Mechanics"
description: "Master passing arguments to Python functions. Explore positional ordering, keyword naming (key=value), rules for mixing arguments, and the SyntaxError: positional argument follows keyword argument."
difficulty: Beginner
readingTime: 12
order: 71
keywords:
  - positional arguments python
  - keyword arguments python
  - parameters vs arguments
  - positional argument follows keyword argument
  - keyword only arguments python
  - function argument binding
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Function Arguments in Python: Positional & Keyword Mechanics

When invoking functions, passing data into them reliably is essential. To master function calls, you must first understand the distinction between two related terms:
- **Parameter:** The placeholder variable defined in the function's header (`def calculate_emi(principal, tenure):`).
- **Argument:** The concrete value passed into the function when invoking it (`calculate_emi(500000, 5)`).

Python provides two distinct ways to bind arguments to parameters: **Positional Arguments** (matched by sequential order) and **Keyword Arguments** (matched by parameter name).

---

## Real-World Analogy: Physical Assembly Line vs. Courier Parcel Labels

```
+-------------------------------------------------------------------------------+
|                    ARGUMENT BINDING REAL-WORLD ANALOGIES                      |
+-------------------------------------------------------------------------------+

  1. THE FACTORY CONVEYOR BELT (Positional Arguments):
     - An assembly worker receives three slots: [Engine, Wheels, Chassis].
     - The parts arrive on a physical conveyor belt in strict sequence:
       Part 1 ALWAYS goes to Engine, Part 2 to Wheels, Part 3 to Chassis.
     - If the delivery order gets swapped, the machine assembles a backwards car!
     - Position and order dictate meaning.

  2. SPEED POST LABELED PARCELS (Keyword Arguments):
     - A courier delivery truck carries three labeled boxes:
       `recipient="Vikram"`, `pincode=110001`, `fragile=True`
     - The postal delivery driver can pull boxes out in ANY arbitrary order:
       the box marked `pincode=110001` will ALWAYS go to the pincode slot,
       because the explicit label guarantees unambiguous routing.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: Positional vs. Keyword Binding

```
================================================================================
                    ARGUMENT BINDING RESOLUTION
================================================================================

  Function Definition:
  def issue_ticket(passenger_name, source, destination, coach):
                          ^           ^          ^        ^
                          |           |          |        |
  CASE A: Positional Call (Order Dictates Mapping)        |
  issue_ticket(  "Aarav",   "NDLS",    "BSB",    "B3"  )
                   |           |          |        |
                   v           v          v        v
            passenger_name   source  destination coach

  CASE B: Keyword Call (Name Dictates Mapping - Order Irrelevant)
  issue_ticket(destination="BSB", coach="B3", passenger_name="Aarav", source="NDLS")
                   |                |                 |                   |
                   +-- destination  +-- coach         +-- passenger_name  +-- source
================================================================================
```

---

## 1. Positional Arguments (Order-Dependent)

Positional arguments are the default in most programming languages. Arguments are mapped one-to-one with parameters based strictly on their physical position from left to right:

```python
# ==========================================================
# Example 1: Positional Argument Mapping
# ==========================================================

def reserve_train_berth(passenger_name: str, train_no: int, berth_type: str):
    print(f"Confirmed: {passenger_name} -> Train #{train_no} | Berth: {berth_type}")

# Valid positional call:
reserve_train_berth("Rohan Verma", 12424, "Side Lower")

# DANGEROUS BUG: Swapping positions corrupts business logic!
reserve_train_berth(12424, "Side Lower", "Rohan Verma")
```

**Output:**
```text
Confirmed: Rohan Verma -> Train #12424 | Berth: Side Lower
Confirmed: 12424 -> Train #Side Lower | Berth: Rohan Verma
```

Notice how swapping the arguments in the second call corrupted the output without raising a syntax error!

---

## 2. Keyword Arguments (Named Parameter Binding)

Keyword arguments pass values in the format `parameter_name = value`. Because each value is explicitly labeled, the order in which they appear in the function call **does not matter**:

```python
# ==========================================================
# Example 2: Keyword Arguments (Order Independence)
# ==========================================================

def calculate_home_loan_emi(principal: float, annual_rate: float, tenure_years: int):
    monthly_rate = (annual_rate / 12) / 100
    months = tenure_years * 12
    emi = (principal * monthly_rate * ((1 + monthly_rate) ** months)) / (((1 + monthly_rate) ** months) - 1)
    return emi

# Called with explicit keyword labels in arbitrary order:
emi_1 = calculate_home_loan_emi(principal=5000000.0, annual_rate=8.5, tenure_years=20)
emi_2 = calculate_home_loan_emi(tenure_years=20, principal=5000000.0, annual_rate=8.5)

print(f"EMI 1: Rs {emi_1:,.2f}")
print(f"EMI 2: Rs {emi_2:,.2f} (Identical result despite scrambled order)")
```

**Output:**
```text
EMI 1: Rs 43,391.16
EMI 2: Rs 43,391.16 (Identical result despite scrambled order)
```

---

## 3. Mixing Positional and Keyword Arguments: The Cardinal Rule

Python allows mixing positional and keyword arguments in the same function call. However, you must adhere strictly to **The Cardinal Rule**:

> [!IMPORTANT]
> **THE CARDINAL RULE:** **Positional arguments MUST ALWAYS precede keyword arguments!** 
> As soon as you provide a single keyword argument, *all subsequent arguments in that call must also be keyword arguments*.

```python
def configure_user_profile(user_id, username, email, is_admin):
    print(f"ID: {user_id}, Name: {username}, Email: {email}, Admin: {is_admin}")

# VALID: Positional first, followed by keywords:
configure_user_profile(101, "aditya_s", email="aditya@msk.in", is_admin=True)

# INVALID: Positional argument AFTER a keyword argument!
# configure_user_profile(user_id=101, "aditya_s", email="aditya@msk.in", False)
# SYNTAX ERROR: positional argument follows keyword argument
```

### Preventing Duplicate Binding:
You cannot assign a value to the same parameter more than once:
```python
# INVALID: user_id received 101 positionally, and 999 via keyword!
# configure_user_profile(101, "aditya_s", user_id=999, email="a@b.com", is_admin=False)
# TYPE ERROR: configure_user_profile() got multiple values for argument 'user_id'
```

---

## 4. Enforcing Keyword-Only Arguments with `*`

Python allows function authors to enforce that certain critical arguments **must always be passed as keywords**. This is done by placing an asterisk `*` in the parameter list:

```python
# ==========================================================
# Example 3: Keyword-Only Security Constraints
# ==========================================================

# Parameters after '*' MUST be passed by keyword!
def transfer_bank_funds(sender_acc: str, receiver_acc: str, amount_inr: float, *, require_otp: bool, is_neft: bool):
    print(f"Transferring Rs {amount_inr:,.2f} from {sender_acc} -> {receiver_acc}")
    print(f"  Security Flags: OTP Required={require_otp}, Mode={'NEFT' if is_neft else 'RTGS'}")

# VALID: Parameters after '*' are explicitly named
transfer_bank_funds("SBI-1001", "HDFC-2002", 75000.0, require_otp=True, is_neft=True)

# INVALID: Calling with positional arguments after '*'
# transfer_bank_funds("SBI-1001", "HDFC-2002", 75000.0, True, True)
# TYPE ERROR: takes 3 positional arguments but 5 were given
```

Keyword-only parameters prevent accidental bugs when functions accept boolean flags.

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use positional arguments for natural primary inputs (e.g. `math.sin(x)`). | **DON'T** place positional arguments after keyword arguments (`SyntaxError`). |
| **DO** use keyword arguments for configuration options, optional flags, and boolean toggles. | **DON'T** supply multiple values for the same parameter both positionally and via keyword (`TypeError`). |
| **DO** use the `*` delimiter to enforce keyword-only arguments for safety-critical settings. | **DON'T** rely on positional arguments when a function accepts 5+ parameters; use keyword arguments for readability. |

---

## Quick Revision Summary

- **Positional arguments** are bound to parameters strictly by order (from left to right).
- **Keyword arguments** are explicitly labeled with `name=value` and can be supplied in any order.
- In mixed calls, **positional arguments must always come first**; once a keyword argument is used, all remaining arguments must also be keywords.
- Attempting to pass a positional argument after a keyword argument causes an immediate **`SyntaxError`**.
- Placing an asterisk `*` in a parameter list marks all subsequent parameters as **keyword-only**.

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Forgetting the `return` Statement
If a function computes a value but doesn't return it, Python returns `None` by default:
```python
def add(a, b):
    result = a + b
    # Missing: return result

total = add(5, 10)
print(total)  # None (not 15!)
```

### 2. Modifying Global Variables Without the `global` Keyword
Reading a global variable is permitted, but assigning to it creates a local variable unless explicitly declared:
```python
counter = 0

def increment():
    global counter  # Required to modify global scope
    counter += 1

increment()
print(counter)  # 1
```

---

## Practice Quiz

### 1. What will happen if you run the following code?
```python
def greet(name, msg):
    print(f"{msg}, {name}!")

greet(name="Karan", "Good Morning")
```
A. Output: `Good Morning, Karan!`
B. SyntaxError: positional argument follows keyword argument
C. TypeError: greet() takes 2 arguments but got 1
D. Output: `None, Karan!`

**Answer:** B

---

### 2. What is the output of the following function call?
```python
def describe_pet(animal_type, pet_name):
    print(f"I have a {animal_type} named {pet_name}.")

describe_pet(pet_name="Sheru", animal_type="Dog")
```
A. I have a Sheru named Dog.
B. I have a Dog named Sheru.
C. TypeError: unexpected keyword order
D. I have a animal_type named pet_name.

**Answer:** B

---

### 3. What error is raised by the following call?
```python
def display_info(user_id, role):
    pass

display_info(101, "Admin", user_id=202)
```
A. SyntaxError: invalid syntax
B. TypeError: got multiple values for argument 'user_id'
C. ValueError: duplicate key
D. NameError: user_id redefined

**Answer:** B

---

### 4. How can you define a function such that a parameter `debug_mode` can ONLY be passed as a keyword argument?
A. `def log(msg, @debug_mode):`
B. `def log(msg, *, debug_mode):`
C. `def log(msg, kw_only(debug_mode)):`
D. `def log(msg, kwargs: debug_mode):`

**Answer:** B

---

### 5. What is the key difference between a parameter and an argument?
A. Parameters are used in loops; arguments are used in conditionals
B. Parameters are variables defined in the function signature; arguments are the real values passed in during invocation
C. Parameters must be strings; arguments must be numbers
D. There is no difference; they are exact technical synonyms

**Answer:** B

---

# Practice Challenge: Swiggy / Zomato Food Delivery Dispatch Engine

Build an automated order dispatch and delivery fee calculator for an Indian food delivery platform (Swiggy / Zomato).

Create a modular dispatch function:
`dispatch_food_order(customer_name, restaurant_name, distance_km, *, is_prime_member=False, applied_coupon="NONE", tip_inr=0.0)`

### Requirements:
1. `customer_name`, `restaurant_name`, and `distance_km` are **positional** arguments.
2. `is_prime_member`, `applied_coupon`, and `tip_inr` must be **keyword-only** arguments enforced by `*`.
3. **Delivery Fee Calculation:**
   - Base delivery fee: Rs 30 for the first 3 km.
   - For distance beyond 3 km: Rs 12 per additional km.
   - If `is_prime_member == True`: 100% discount on delivery fee (Free Delivery).
4. **Discount Coupon:**
   - `"SWIGGYIT"`: Rs 50 off the final bill.
   - `"ZOMATO50"`: 20% off the final bill (up to a max of Rs 100).
5. Print a formatted order dispatch slip and invoice breakdown.

### Complete Solution

```python
# ==========================================================
# Challenge: Food Delivery Dispatch Engine
# ==========================================================

def dispatch_food_order(
    customer_name: str,
    restaurant_name: str,
    distance_km: float,
    cart_total_inr: float,
    *,
    is_prime_member: bool = False,
    applied_coupon: str = "NONE",
    tip_inr: float = 0.0
) -> dict:
    """Dispatches food delivery order using positional and keyword-only arguments."""
    
    # 1. Delivery Fee Calculation
    if is_prime_member:
        delivery_fee = 0.0
    else:
        if distance_km <= 3.0:
            delivery_fee = 30.0
        else:
            delivery_fee = 30.0 + (distance_km - 3.0) * 12.0
            
    # 2. Coupon Discount Calculation
    discount = 0.0
    if applied_coupon == "SWIGGYIT":
        discount = 50.0
    elif applied_coupon == "ZOMATO50":
        discount = min(cart_total_inr * 0.20, 100.0)
        
    final_payable = (cart_total_inr - discount) + delivery_fee + tip_inr
    
    # Render Dispatch Slip
    print("+" + "=" * 54 + "+")
    print(f"| {'SWIGGY / ZOMATO ORDER DISPATCH SLIP':^52} |")
    print("+" + "=" * 54 + "+")
    print(f"  Customer:   {customer_name:<20} Prime: {'YES' if is_prime_member else 'NO'}")
    print(f"  Restaurant: {restaurant_name}")
    print(f"  Distance:   {distance_km:.1f} km")
    print("-" * 54)
    print(f"  Food Cart Total:     Rs {cart_total_inr:>8.2f}")
    print(f"  Coupon ({applied_coupon}):      -Rs {discount:>8.2f}")
    print(f"  Delivery Logistics:  Rs {delivery_fee:>8.2f}")
    print(f"  Rider Courtesy Tip:  Rs {tip_inr:>8.2f}")
    print("-" * 54)
    print(f"  FINAL AMOUNT TO PAY: Rs {final_payable:>8.2f}")
    print("+" + "=" * 54 + "+\n")
    
    return {
        "customer": customer_name,
        "final_payable": final_payable,
        "delivery_fee": delivery_fee
    }

# Test Invocations:

# Order 1: Standard customer, distance 6.5 km, tip given
dispatch_food_order(
    "Arjun Kapoor", "Haldiram's Chandni Chowk", 6.5, 480.0,
    is_prime_member=False, applied_coupon="SWIGGYIT", tip_inr=30.0
)

# Order 2: Prime Super Member, free delivery, Zomato discount
dispatch_food_order(
    "Priya Nair", "Saravana Bhavan Connaught", 4.2, 650.0,
    is_prime_member=True, applied_coupon="ZOMATO50", tip_inr=50.0
)
```

```text
Output:
+======================================================+
|         SWIGGY / ZOMATO ORDER DISPATCH SLIP          |
+======================================================+
  Customer:   Arjun Kapoor         Prime: NO
  Restaurant: Haldiram's Chandni Chowk
  Distance:   6.5 km
------------------------------------------------------
  Food Cart Total:     Rs   480.00
  Coupon (SWIGGYIT):      -Rs    50.00
  Delivery Logistics:  Rs    72.00
  Rider Courtesy Tip:  Rs    30.00
------------------------------------------------------
  FINAL AMOUNT TO PAY: Rs   532.00
+======================================================+

+======================================================+
|         SWIGGY / ZOMATO ORDER DISPATCH SLIP          |
+======================================================+
  Customer:   Priya Nair           Prime: YES
  Restaurant: Saravana Bhavan Connaught
  Distance:   4.2 km
------------------------------------------------------
  Food Cart Total:     Rs   650.00
  Coupon (ZOMATO50):      -Rs   100.00
  Delivery Logistics:  Rs     0.00
  Rider Courtesy Tip:  Rs    50.00
------------------------------------------------------
  FINAL AMOUNT TO PAY: Rs   600.00
+======================================================+
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Arguments: Default, *args, **kwargs** (14: Functions).

👉 **[Continue to Next Lesson: Arguments: Default, *args, **kwargs →](/tutorials/python-for-beginners/arguments-default-args-kwargs)**
