---
id: arguments-default-args-kwargs
slug: arguments-default-args-kwargs
course: python-for-beginners
chapter: 14
topic: 14.3
title: "Default Arguments, *args, and **kwargs in Python: Dynamic Parameter Handling"
description: "Master flexible function signatures in Python. Learn default parameters, the dangerous mutable default pitfall, arbitrary positional packing with *args, and keyword dictionary packing with **kwargs."
difficulty: Beginner
readingTime: 13
order: 72
keywords:
  - python default arguments
  - python *args
  - python **kwargs
  - mutable default argument python
  - variable length arguments
  - python parameter unpacking
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Default Arguments, `*args`, and `**kwargs` in Python: Dynamic Parameter Architecture

In basic programming, functions require an exact, rigid number of inputs. However, real-world systems need flexibility: the built-in `print()` function, for example, can accept 1, 5, or 50 arguments; mathematical functions need to sum arbitrary lists of numbers; and configuration parsers must accept varying metadata tags without hardcoding 20 separate parameters.

To enable dynamic and extensible interfaces, Python provides three mechanisms:
1. **Default Parameters:** Fallback values used when the caller omits an argument.
2. **`*args` (Arbitrary Positional Arguments):** Packs an unspecified number of positional values into a **tuple**.
3. **`**kwargs` (Arbitrary Keyword Arguments):** Packs an unspecified number of named parameters into a **dictionary**.

---

## Real-World Analogy: The Kirana Grocery Sack & Special Delivery Instructions

```
+-------------------------------------------------------------------------------+
|                      DYNAMIC ARGUMENT REAL-WORLD ANALOGIES                    |
+-------------------------------------------------------------------------------+

  1. DEFAULT PARAMETERS (Standard Milk Packet):
     - At a local Mother Dairy booth:
       `def order_milk(pouches=1, brand="Full Cream"):`
     - If you just ask "Bhaiya, give milk", the clerk hands you 1 pouch of
       Full Cream by default. If you need 4 pouches of Cow Milk, you override
       the default: `order_milk(4, "Cow Milk")`.

  2. *args (The Assorted Vegetable Sack):
     - At a Sabzi Mandi (vegetable market), you hand the vendor an empty burlap sack:
       vendor tosses in tomatoes, potatoes, ginger, green chilies, coriander.
     - The vendor doesn't know in advance how many vegetables you bought.
       All assorted loose items are bundled together into ONE unified sack (`tuple`).

  3. **kwargs (Delivery App Metadata Instructions):
     - When placing a Swiggy / Zepto order, there is an arbitrary instruction box:
       `drop_at="Doorstep"`, `call_guard=True`, `gate_pass_code=7890`
     - Every customer enters different keys and values.
       The delivery app captures all these key-value pairs into a single
       metadata sheet (`dictionary`).
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: The Argument Packing Pipeline

```
================================================================================
                    ARGUMENT PACKING & BINDING
================================================================================

  Invocation:
  calculate_invoice("INV-902", 450, 120, 890, discount_pct=10, payment="UPI")
                         |      \___________/  \____________________________/
                         |            |                       |
                         v            v                       v
  Function Signature:
  def calculate_invoice(inv_id,    *amounts,              **metadata):
                         |            |                       |
                         v            v                       v
  Bound Variables:
    inv_id   = "INV-902"     (Standard Positional String)
    amounts  = (450, 120, 890)              <-- PACKED AS A TUPLE!
    metadata = {"discount_pct": 10, "payment": "UPI"} <-- PACKED AS A DICTIONARY!
================================================================================
```

---

## 1. Default Parameters & Fallback Values

Default parameters allow functions to be invoked with fewer arguments than parameters defined in the signature:

```python
# ==========================================================
# Example 1: Default Parameters
# ==========================================================

def calculate_train_fare(distance_km: float, base_rate_per_km: float = 1.85, concession_discount: float = 0.0):
    fare = (distance_km * base_rate_per_km) - concession_discount
    return max(fare, 30.0)  # Minimum fare Rs 30

# 1. Using all defaults:
print("Standard Booking: Rs", calculate_train_fare(250.0))

# 2. Overriding base_rate_per_km for Superfast Tejas Express:
print("Tejas Express:    Rs", calculate_train_fare(250.0, base_rate_per_km=3.20))

# 3. Supplying concession via keyword argument:
print("Student Travel:   Rs", calculate_train_fare(250.0, concession_discount=150.0))
```

**Output:**
```text
Standard Booking: Rs 462.5
Tejas Express:    Rs 800.0
Student Travel:   Rs 312.5
```

---

## 2. The Dangerous Mutable Default Argument Pitfall

One of the most notorious traps in Python is using a **mutable object** (like a `list` or `dict`) as a default parameter value:

```python
# DANGEROUS BUG: Default list is shared across ALL invocations!
def register_voter(voter_name, voter_list=[]):
    voter_list.append(voter_name)
    return voter_list

print(register_voter("Amit"))    # Returns: ['Amit']
print(register_voter("Priya"))   # Returns: ['Amit', 'Priya'] <-- BUG! Priya inherited Amit's list!
```

### Why Does This Happen?
In Python, default arguments are evaluated **once at function definition time**, NOT each time the function is called. The exact same list object in memory is reused across every subsequent invocation!

### The Idiomatic Pythonic Fix: Default to `None`

```python
# ==========================================================
# The Correct Solution: Use None as Sentinel Default
# ==========================================================

def register_voter_safe(voter_name: str, voter_list: list = None) -> list:
    if voter_list is None:
        voter_list = []  # A FRESH new list is created on EVERY invocation!
    voter_list.append(voter_name)
    return voter_list

print(register_voter_safe("Amit"))    # Output: ['Amit']
print(register_voter_safe("Priya"))   # Output: ['Priya'] (Clean isolation!)
```

---

## 3. Variable Positional Arguments: `*args`

When a parameter is prefixed with a single asterisk `*` (conventionally named `*args`), Python collects all surplus positional arguments passed to the function into a **tuple**:

```python
# ==========================================================
# Example 2: Arbitrary Positional Summation with *args
# ==========================================================

def compute_total_gst_bill(bill_id: str, *line_item_prices: float) -> dict:
    """Computes total for an arbitrary number of scanned items."""
    print(f"Audit Invoice #{bill_id} -> Scanned {len(line_item_prices)} items.")
    subtotal = sum(line_item_prices)
    gst_tax = subtotal * 0.18
    grand_total = subtotal + gst_tax
    
    return {
        "invoice": bill_id,
        "item_count": len(line_item_prices),
        "items_tuple": line_item_prices,
        "subtotal": subtotal,
        "gst_18pct": gst_tax,
        "grand_total": grand_total
    }

# Call with 2 items:
inv1 = compute_total_gst_bill("INV-001", 450.0, 150.0)
print(f"  Grand Total: Rs {inv1['grand_total']:,.2f}\n")

# Call with 5 items:
inv2 = compute_total_gst_bill("INV-002", 1200.0, 45.0, 99.0, 310.0, 18.0)
print(f"  Grand Total: Rs {inv2['grand_total']:,.2f}")
```

**Output:**
```text
Audit Invoice #INV-001 -> Scanned 2 items.
  Grand Total: Rs 708.00

Audit Invoice #INV-002 -> Scanned 5 items.
  Grand Total: Rs 2,091.02
```

---

## 4. Variable Keyword Arguments: `**kwargs`

When a parameter is prefixed with a double asterisk `**` (conventionally named `**kwargs`), Python collects all surplus keyword arguments passed into the function into a **dictionary**:

```python
# ==========================================================
# Example 3: Dynamic Entity Profile Builder with **kwargs
# ==========================================================

def build_student_profile(roll_no: int, full_name: str, **attributes):
    print(f"=== STUDENT PROFILE: {full_name} (Roll #{roll_no}) ===")
    print(f"Raw kwargs Dictionary: {attributes}")
    
    for key, value in attributes.items():
        formatted_key = key.replace("_", " ").title()
        print(f"  {formatted_key:<16}: {value}")
    print("-" * 45)

# Invoke with diverse arbitrary attributes:
build_student_profile(101, "Aarav Sharma", department="Computer Science", semester=3, blood_group="O+")
build_student_profile(102, "Divya Roy", course="Data Science", is_hosteller=True, scholarship="Merit 50%")
```

**Output:**
```text
=== STUDENT PROFILE: Aarav Sharma (Roll #101) ===
Raw kwargs Dictionary: {'department': 'Computer Science', 'semester': 3, 'blood_group': 'O+'}
  Department      : Computer Science
  Semester        : 3
  Blood Group     : O+
---------------------------------------------
=== STUDENT PROFILE: Divya Roy (Roll #102) ===
Raw kwargs Dictionary: {'course': 'Data Science', 'is_hosteller': True, 'scholarship': 'Merit 50%'}
  Course          : Data Science
  Is Hosteller    : True
  Scholarship     : Merit 50%
---------------------------------------------
```

---

## 5. The Grand Unified Parameter Ordering Hierarchy

When combining all argument types in a single function signature, Python strictly enforces this **parameter order**:

```
================================================================================
                    OFFICIAL PARAMETER ORDERING HIERARCHY
================================================================================

  def function_name(
      1. standard_positional,       # Standard mandatory positional args
      2. default_positional=val,    # Positional args with default values
      3. *args,                     # Variable-length positional tuple
      4. keyword_only,              # Keyword-only parameters
      5. kw_only_default=val,       # Keyword-only with default values
      6. **kwargs                   # Variable-length keyword dictionary
  ):
================================================================================
```

---

## 6. Unpacking Arguments at the Call-Site (`*` and `**`)

Just as `*` and `**` pack arguments in function signatures, they can also **unpack** collections when invoking a function:

```python
# Unpacking a list into positional arguments:
coordinates = [12.9716, 77.5946]  # Bengaluru Latitude, Longitude
# def map_pin(lat, lon): ...
# map_pin(*coordinates)  --> Equivalent to map_pin(12.9716, 77.5946)

# Unpacking a dictionary into keyword arguments:
config = {"host": "localhost", "port": 5432, "timeout": 30}
# connect_db(**config)   --> Equivalent to connect_db(host="localhost", port=5432, timeout=30)
```

---

## 7. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use `None` as the default value for mutable arguments (lists, dicts, sets). | **DON'T** use empty lists `def func(x=[])` or dicts `def func(x={})` as default values! |
| **DO** place parameters with default values **after** mandatory positional parameters. | **DON'T** place mandatory positional parameters after default parameters (`SyntaxError: non-default argument follows default argument`). |
| **DO** use `*args` when building mathematical reducers or formatting wrappers. | **DON'T** overuse `**kwargs` as a substitute for explicitly documented function signatures. |

---

## Quick Revision Summary

- **Default arguments** allow callers to omit parameters, falling back to a pre-set value.
- **Never use mutable defaults** (`[]`, `{}`); always use `default=None` and initialize the container inside the function body.
- **`*args`** captures surplus positional arguments into an immutable **tuple**.
- **`**kwargs`** captures surplus keyword arguments into a mutable **dictionary**.
- Parameter order in function definitions must be: `positional -> default -> *args -> keyword-only -> **kwargs`.
- The prefix operators `*` and `**` can also be used at the call-site to unpack lists and dictionaries into function arguments.

---

## Practice Quiz

### 1. What data structure does Python use to pack arguments collected by `*args`?
A. List
B. Tuple
C. Dictionary
D. Set

**Answer:** B

---

### 2. What data structure does Python use to pack keyword arguments collected by `**kwargs`?
A. List
B. Tuple
C. Dictionary
D. Ordered Set

**Answer:** C

---

### 3. What will be printed by the following code?
```python
def append_number(num, num_list=[]):
    num_list.append(num)
    return num_list

append_number(1)
append_number(2)
print(append_number(3))
```
A. `[3]`
B. `[1, 2, 3]`
C. `[2, 3]`
D. `TypeError`

**Answer:** B

---

### 4. What is the correct order of parameters in a Python function definition?
A. `*args, positional, **kwargs, defaults`
B. `positional, defaults, *args, **kwargs`
C. `**kwargs, *args, defaults, positional`
D. `defaults, positional, *args, **kwargs`

**Answer:** B

---

### 5. If `payload = {"user": "Kavita", "role": "Admin"}`, how can you unpack this dictionary into keyword arguments when calling `setup_account(user, role)`?
A. `setup_account(*payload)`
B. `setup_account(**payload)`
C. `setup_account(&payload)`
D. `setup_account(payload...)`

**Answer:** B

---

# Practice Challenge: Multi-Vendor Marketplace Order Logger & Audit Dispatcher

Build a flexible order dispatcher for an Indian multi-vendor e-commerce marketplace (Tata Neu / ONDC Network). 

The dispatch function must handle dynamic inputs:
`create_marketplace_order(vendor_name, delivery_state="Maharashtra", *item_prices, **order_metadata)`

### Requirements:
1. `vendor_name`: Standard mandatory positional string.
2. `delivery_state`: Default string parameter defaulting to `"Maharashtra"`.
3. `*item_prices`: Arbitrary number of item prices packed into a tuple.
4. `**order_metadata`: Arbitrary keyword metadata (e.g. `customer="Riya"`, `coupon="ONDC100"`, `priority="HIGH"`, `pincode=400001`).
5. **Calculations:**
   - Compute total item price subtotal.
   - If `delivery_state == "Maharashtra"`, apply Intra-State GST (9% CGST + 9% SGST).
   - If `delivery_state != "Maharashtra"`, apply Inter-State GST (18% IGST).
6. Render an itemized dispatch summary detailing vendor, state, GST breakdown, final invoice amount, and all optional metadata attributes.

### Complete Solution

```python
# ==========================================================
# Challenge: Multi-Vendor Order Dispatcher
# ==========================================================

def create_marketplace_order(
    vendor_name: str,
    delivery_state: str = "Maharashtra",
    *item_prices: float,
    **order_metadata
) -> dict:
    """Dispatches a flexible order using default args, *args, and **kwargs."""
    
    subtotal = sum(item_prices)
    
    # GST Classification
    if delivery_state.lower() == "maharashtra":
        tax_type = "INTRA-STATE (CGST 9% + SGST 9%)"
        tax_rate = 0.18
    else:
        tax_type = "INTER-STATE (IGST 18%)"
        tax_rate = 0.18
        
    tax_amount = subtotal * tax_rate
    grand_total = subtotal + tax_amount
    
    # Render Audit Invoice
    print("+" + "=" * 60 + "+")
    print(f"| {'ONDC MULTI-VENDOR MARKETPLACE ORDER DISPATCH':^58} |")
    print("+" + "=" * 60 + "+")
    print(f"  Vendor:         {vendor_name}")
    print(f"  Delivery State: {delivery_state} -> {tax_type}")
    print(f"  Items Ordered:  {len(item_prices)} items: {item_prices}")
    print("-" * 60)
    print(f"  Items Subtotal: Rs {subtotal:>9.2f}")
    print(f"  Applicable Tax: Rs {tax_amount:>9.2f}")
    print(f"  TOTAL PAYABLE:  Rs {grand_total:>9.2f}")
    print("-" * 60)
    print("  Order Metadata Tags:")
    if order_metadata:
        for k, v in order_metadata.items():
            print(f"    * {k.replace('_', ' ').title():<18}: {v}")
    else:
        print("    * None provided")
    print("+" + "=" * 60 + "+\n")
    
    return {
        "vendor": vendor_name,
        "grand_total": grand_total,
        "metadata": order_metadata
    }

# Test Invocations:

# Order 1: Uses default state (Maharashtra), passes 3 items and rich metadata
create_marketplace_order(
    "FabIndia Official",
    "Maharashtra",
    1850.0, 750.0, 420.0,
    customer="Ananya Singhania",
    coupon_applied="FESTIVE10",
    gift_wrap=True
)

# Order 2: Inter-state order to Karnataka, passes 2 items
create_marketplace_order(
    "Titan Heritage Store",
    "Karnataka",
    6400.0, 1200.0,
    customer="Arjun Shetty",
    logistics_partner="BlueDart Express",
    delivery_pincode=560001
)
```

```text
Output:
+============================================================+
|        ONDC MULTI-VENDOR MARKETPLACE ORDER DISPATCH        |
+============================================================+
  Vendor:         FabIndia Official
  Delivery State: Maharashtra -> INTRA-STATE (CGST 9% + SGST 9%)
  Items Ordered:  3 items: (1850.0, 750.0, 420.0)
------------------------------------------------------------
  Items Subtotal: Rs   3020.00
  Applicable Tax: Rs    543.60
  TOTAL PAYABLE:  Rs   3563.60
------------------------------------------------------------
  Order Metadata Tags:
    * Customer          : Ananya Singhania
    * Coupon Applied    : FESTIVE10
    * Gift Wrap         : True
+============================================================+

+============================================================+
|        ONDC MULTI-VENDOR MARKETPLACE ORDER DISPATCH        |
+============================================================+
  Vendor:         Titan Heritage Store
  Delivery State: Karnataka -> INTER-STATE (IGST 18%)
  Items Ordered:  2 items: (6400.0, 1200.0)
------------------------------------------------------------
  Items Subtotal: Rs   7600.00
  Applicable Tax: Rs   1368.00
  TOTAL PAYABLE:  Rs   8968.00
------------------------------------------------------------
  Order Metadata Tags:
    * Customer          : Arjun Shetty
    * Logistics Partner : BlueDart Express
    * Delivery Pincode  : 560001
+============================================================+
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Return Values** (14: Functions).

👉 **[Continue to Next Lesson: Return Values →](/tutorials/python-for-beginners/return-values)**
