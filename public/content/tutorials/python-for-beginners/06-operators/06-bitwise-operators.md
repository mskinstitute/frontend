---
id: python-bitwise-operators
slug: bitwise-operators
course: python-for-beginners
chapter: 6
topic: 6.6
title: Bitwise Operators
description: Master Python's 6 bitwise operators (&, |, ^, ~, <<, >>), understand two's complement binary representation, build practical permission bitmasks, and execute ultra-fast bit shifts.
difficulty: Beginner
readingTime: 14
order: 28
keywords:
  - python bitwise operators
  - binary logic
  - bitwise and or xor not
  - bit shifting
  - bitmasking permissions
  - twos complement
  - bin function
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python Bitwise Operators: Binary Logic, Bitmasks, & Bit Shifting

At the silicon hardware layer, every computer processes information as streams of binary digits (**bits**)—zeros and ones. While most high-level programming operates on whole numbers, strings, or objects, **bitwise operators** give you the power to manipulate integers at the raw individual bit level.

Bitwise operations are fundamental in systems programming, network packet parsing, hardware IoT interfacing, game development, cryptography, and ultra-high-speed flag/permission systems.

Python provides six native bitwise operators:
1. **`&` (Bitwise AND):** Yields 1 if both bits are 1.
2. **`|` (Bitwise OR):** Yields 1 if either bit is 1.
3. **`^` (Bitwise XOR):** Yields 1 if the bits are different (exclusive OR).
4. **`~` (Bitwise NOT / Inversion):** Flips all bits (returns two's complement: `~x = -x - 1`).
5. **`<<` (Left Shift):** Shifts bits to the left (multiplies by $2^n$).
6. **`>>` (Right Shift):** Shifts bits to the right (divides by $2^n$).

---

## Real-World Analogy: 8-Switch Indian Modular Board & Security Badges

```
+-------------------------------------------------------------------------+
|                  BITWISE OPERATIONS REAL-WORLD ANALOGY                  |
+-------------------------------------------------------------------------+

  Imagine an 8-switch modular electrical panel in a Mumbai apartment:

  Switch Position :   7     6     5     4     3     2     1     0
  Appliance       : Geyser Fridge Micro Oven  TV    AC   Light Fan
  Binary Value    :   0     1     0     0     1     1     0     1
  (Decimal: 77)

  Each bit represents a physical ON (1) or OFF (0) electrical state.

  1. BITWISE AND (&) -> Status Query:
     - "Is the AC (Bit 2) currently running?"
     - Mask with 00000100 (4). If (77 & 4) != 0, the AC is ON!

  2. BITWISE OR (|) -> Turning On Appliances:
     - Turn ON the Geyser (Bit 7) without disturbing any other switch:
       panel = panel | 128 (Sets bit 7 to 1).

  3. BITWISE XOR (^) -> The Two-Way Staircase Switch:
     - Toggles the state: If ON, turns OFF; if OFF, turns ON!
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: Binary Bitwise Logic & Shifting

```
===========================================================================
             THE CORE BITWISE TRUTH MATRIX (OPERANDS a & b)
===========================================================================

   Bit a     Bit b     a & b (AND)    a | b (OR)     a ^ b (XOR)
  ---------------------------------------------------------------
     0         0            0              0              0
     0         1            0              1              1
     1         0            0              1              1
     1         1            1              1              0

===========================================================================
                 BIT SHIFTING SILICON REGISTER FLOW
===========================================================================

  Let x = 5 (Binary: 0000 0101)

  Left Shift: x << 2  (Shifts 2 places left, fills right with zeros)
  [0 0 0 0 0 1 0 1] << 2  ==>  [0 0 0 1 0 1 0 0] = 20 (5 * 2^2)

  Right Shift: 20 >> 2 (Shifts 2 places right, discards rightmost bits)
  [0 0 0 1 0 1 0 0] >> 2  ==>  [0 0 0 0 0 1 0 1] = 5  (20 // 2^2)
```

---

## 1. Inspecting Bits with `bin()` & Format Specifiers

To inspect the binary representation of an integer in Python, use the built-in **`bin()`** function or format specifiers like `f"{n:08b}"`:

```python
# ==========================================================
# Example 1: Visualizing Binary Representations
# ==========================================================

a = 12  # Binary: 0000 1100
b = 10  # Binary: 0000 1010

print("a in Decimal :", a, "| Binary:", bin(a), f"| 8-bit: {a:08b}")
print("b in Decimal :", b, "| Binary:", bin(b), f"| 8-bit: {b:08b}")
```

### Output:
```text
a in Decimal : 12 | Binary: 0b1100 | 8-bit: 00001100
b in Decimal : 10 | Binary: 0b1010 | 8-bit: 00001010
```

---

## 2. Bitwise AND (`&`), OR (`|`), & XOR (`^`) in Action

```python
# ==========================================================
# Example 2: Bitwise Logic Computations
# ==========================================================

a = 12  # 0000 1100
b = 10  # 0000 1010

# 1. Bitwise AND (&): Only matching 1s survive
# 0000 1100 & 0000 1010 -> 0000 1000 (Decimal 8)
res_and = a & b
print(f"a & b = {res_and:<2} | Binary: {res_and:08b}")

# 2. Bitwise OR (|): Sets bit if either is 1
# 0000 1100 | 0000 1010 -> 0000 1110 (Decimal 14)
res_or = a | b
print(f"a | b = {res_or:<2} | Binary: {res_or:08b}")

# 3. Bitwise XOR (^): Sets bit only when bits differ
# 0000 1100 ^ 0000 1010 -> 0000 0110 (Decimal 6)
res_xor = a ^ b
print(f"a ^ b = {res_xor:<2} | Binary: {res_xor:08b}")
```

### Output:
```text
a & b = 8  | Binary: 00001000
a | b = 14 | Binary: 00001110
a ^ b = 6  | Binary: 00000110
```

---

## 3. The Bitwise NOT (`~`) & Two's Complement Formula

In Python, numbers are stored with infinite arbitrary precision using **two's complement notation**. The bitwise NOT operator `~` inverts every bit, which mathematically adheres to the universal formula:
$$\sim x = -(x + 1)$$

```python
# ==========================================================
# Example 3: Bitwise Inversion (~x)
# ==========================================================

val = 5
inverted = ~val

print(f"Original Value : {val}")
print(f"Inverted (~5)  : {inverted} (Formula: -(5 + 1) = -6)")

# Negatives invert back to positive:
print("Inverted (~ -10):", ~(-10))  # -(-10 + 1) = 9
```

### Output:
```text
Original Value : 5
Inverted (~5)  : -6 (Formula: -(5 + 1) = -6)
Inverted (~ -10): 9
```

---

## 4. Ultra-Fast Bit Shifting (`<<` and `>>`)

Shifting bits in hardware registers is drastically faster than standard multiplication and division algorithms:
- **`x << n`:** Shifts bits left by $n$ positions, equivalent to:
  $$\text{result} = x \times 2^n$$
- **`x >> n`:** Shifts bits right by $n$ positions, equivalent to:
  $$\text{result} = x // 2^n$$

```python
# ==========================================================
# Example 4: Left and Right Bit Shifts
# ==========================================================

num = 7  # Binary: 0000 0111

# Left shift by 1 (Multiply by 2): 7 * 2 = 14
print("7 << 1 =", num << 1, f"| Binary: {num << 1:08b}")

# Left shift by 3 (Multiply by 2^3 = 8): 7 * 8 = 56
print("7 << 3 =", num << 3, f"| Binary: {num << 3:08b}")

# Right shift by 1 (Divide by 2): 56 // 2 = 28
val_56 = 56
print("56 >> 1 =", val_56 >> 1, f"| Binary: {val_56 >> 1:08b}")

# Right shift by 3 (Divide by 8): 56 // 8 = 7
print("56 >> 3 =", val_56 >> 3, f"| Binary: {val_56 >> 3:08b}")
```

### Output:
```text
7 << 1 = 14 | Binary: 00001110
7 << 3 = 56 | Binary: 00111000
56 >> 1 = 28 | Binary: 00011100
56 >> 3 = 7 | Binary: 00000111
```

---

## 5. Practical Bitmasking: Linux File Permissions (Read, Write, Execute)

In operating systems and databases, permissions are packed into a single integer byte using powers of 2:
- **`EXECUTE = 1`** (`0b001`)
- **`WRITE   = 2`** (`0b010`)
- **`READ    = 4`** (`0b100`)

```python
# ==========================================================
# Example 5: Linux-Style RBAC Permission Flags
# ==========================================================

PERMISSION_EXECUTE = 1  # 001
PERMISSION_WRITE   = 2  # 010
PERMISSION_READ    = 4  # 100

# 1. Grant Read and Write permissions using Bitwise OR (|)
user_permissions = PERMISSION_READ | PERMISSION_WRITE
print(f"User Permission Byte: {user_permissions:03b} (Decimal: {user_permissions})")

# 2. Check if user has WRITE permission using Bitwise AND (&)
has_write = (user_permissions & PERMISSION_WRITE) != 0
has_exec  = (user_permissions & PERMISSION_EXECUTE) != 0

print("Has Write Permission?   :", has_write)  # True
print("Has Execute Permission? :", has_exec)   # False

# 3. Revoke Write permission using Bitwise AND with NOT (& ~)
user_permissions &= ~PERMISSION_WRITE
print(f"After Revoking Write    : {user_permissions:03b} (Has Write: {(user_permissions & PERMISSION_WRITE) != 0})")
```

### Output:
```text
User Permission Byte: 110 (Decimal: 6)
Has Write Permission?   : True
Has Execute Permission? : False
After Revoking Write    : 100 (Has Write: False)
```

---

## Do's and Don'ts: Bitwise Operations

| Scenario | Anti-Pattern (Don't) | Best Practice (Do) | Why |
| :--- | :--- | :--- | :--- |
| **Parity Check** | `if n % 2 == 0:` | `if (n & 1) == 0:` | `& 1` inspects the lowest bit directly at silicon level. |
| **Logic vs Bitwise** | Using `&` instead of `and` | Use `and` for booleans, `&` for bits | `&` does not short-circuit and causes subtle boolean bugs. |
| **Multiply by Powers of 2**| `n * 8` | `n << 3` in low-level graphics/crypto | Bit shifting is the fastest multiplication operation. |
| **Operator Precedence** | `if n & 1 == 0:` | `if (n & 1) == 0:` | `==` has higher precedence than `&`! Parentheses are mandatory. |

---

## Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                      BITWISE OPERATORS CHEAT SHEET                      |
+-------------------------------------------------------------------------+
  - & (AND):        1 only if both bits are 1 (Used for masking/querying)
  - | (OR):         1 if either bit is 1 (Used for setting flags)
  - ^ (XOR):        1 if bits differ (Used for toggling flags / encryption)
  - ~ (NOT):        Inverts all bits (~x = -x - 1)
  - << (Left Shift):Multiplies by 2^n (e.g. 5 << 1 = 10)
  - >> (Right Shift):Divides by 2^n (e.g. 20 >> 2 = 5)
  - Precedence Trap:Always wrap in parens when comparing: (x & 1) == 0
+-------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Confusing Assignment (`=`) with Equality (`==`)
A single equals sign `=` assigns a value. Two equals signs `==` checks for equality:
```python
score = 100  # Assignment

# In conditions:
# ❌ INCORRECT (SyntaxError in Python 3)
# if score = 100:

# ✅ CORRECT
if score == 100:
    print("Perfect score!")
```

### 2. Chained Boolean Logic with `and` / `or`
Beginners often write `if x == 1 or 2:`, which always evaluates to True because non-zero integers are truthy!
```python
# ❌ INCORRECT (Always True because 2 is truthy!)
# if x == 1 or 2:

# ✅ CORRECT
# if x == 1 or x == 2:
# Or even cleaner:
# if x in (1, 2):
```

---

## Practice Quiz

### 1. What is the value of the bitwise expression `6 & 3` in Python?
A. `9`
B. `2`
C. `7`
D. `5`

**Answer:** B

---

### 2. What does evaluating `~7` return in Python?
A. `-7`
B. `-8`
C. `8`
D. `0`

**Answer:** B

---

### 3. What is the result of shifting the number 8 right by two positions (`8 >> 2`)?
A. `16`
B. `2`
C. `32`
D. `4`

**Answer:** B

---

### 4. Which bitwise operator evaluates to 1 if and only if the two corresponding bits are different?
A. Bitwise AND (`&`)
B. Bitwise OR (`|`)
C. Bitwise XOR (`^`)
D. Bitwise NOT (`~`)

**Answer:** C

---

### 5. Why is writing `if num & 1 == 0:` a dangerous bug if not parenthesized as `if (num & 1) == 0:`?
A. Bitwise `&` is not allowed in `if` statements
B. The comparison operator `==` has higher precedence than bitwise `&`, causing Python to evaluate `1 == 0` first
C. It causes an `OverflowError`
D. The compiler rejects the number 1

**Answer:** B

---

# Hands-On Practice Challenge: IoT Smart Home Device Security Gate

Write a complete, runnable Python script that manages an Internet of Things (IoT) home automation hub. Each connected appliance (Camera, Door Lock, Fire Alarm, Thermostat) is represented by a single bit within a 1-byte telemetry register. Use bitwise operators to inspect device statuses, arm security locks, and toggle alarm states.

```python
# ==========================================================
# Challenge 28: IoT Smart Home Bitmask Security Hub
# MSK Institute of Technology
# ==========================================================

# 1. Define Bit Position Masks for Smart Appliances
DEVICE_LIGHTS      = 1 << 0  # Bit 0: 0000 0001 (Decimal 1)
DEVICE_AC          = 1 << 1  # Bit 1: 0000 0010 (Decimal 2)
DEVICE_CAMERA      = 1 << 2  # Bit 2: 0000 0100 (Decimal 4)
DEVICE_DOOR_LOCK   = 1 << 3  # Bit 3: 0000 1000 (Decimal 8)
DEVICE_FIRE_ALARM  = 1 << 4  # Bit 4: 0001 0000 (Decimal 16)

def print_iot_telemetry(system_byte: int) -> None:
    print(f"Active Hub State Byte : {system_byte:08b} (Decimal: {system_byte})")
    print(f"  > Main Door Locked  : {'LOCKED (SECURE)' if (system_byte & DEVICE_DOOR_LOCK) else 'UNLOCKED'}")
    print(f"  > Security Camera   : {'ACTIVE (RECORDING)' if (system_byte & DEVICE_CAMERA) else 'OFFLINE'}")
    print(f"  > Air Conditioner   : {'RUNNING' if (system_byte & DEVICE_AC) else 'STANDBY'}")
    print(f"  > Living Room Lights: {'ON' if (system_byte & DEVICE_LIGHTS) else 'OFF'}")
    print(f"  > Fire Alarm System : {'ARMED' if (system_byte & DEVICE_FIRE_ALARM) else 'DISABLED'}")
    print("-" * 60)

# ----------------------------------------------------------
# Simulation Lifecycle
# ----------------------------------------------------------
print("=" * 60)
print("       BHARAT IOT SMART HOME AUTOMATION CONTROLLER")
print("=" * 60)

# 1. Initial State: Only Lights and Fire Alarm are active
hub_state = DEVICE_LIGHTS | DEVICE_FIRE_ALARM
print("INITIAL STATE:")
print_iot_telemetry(hub_state)

# 2. Night Security Mode: Turn ON Camera and Lock Doors (|)
print("ACTION: Activating Night Security Protocol (Camera + Lock)...")
hub_state |= (DEVICE_CAMERA | DEVICE_DOOR_LOCK)
print_iot_telemetry(hub_state)

# 3. Morning Departure: Turn OFF Lights and AC (& ~)
print("ACTION: Leaving for office (Turning OFF Lights & AC)...")
hub_state &= ~(DEVICE_LIGHTS | DEVICE_AC)
print_iot_telemetry(hub_state)

# 4. Emergency Fire Drill: Toggle Alarm State (^)
print("ACTION: Toggling Fire Alarm State via XOR (^)...")
hub_state ^= DEVICE_FIRE_ALARM
print_iot_telemetry(hub_state)

# Fast Parity Check using Silicon Bitwise AND
print(f"Is active byte ({hub_state}) an even configuration? {(hub_state & 1) == 0}")
print("=" * 60)
```

### Expected Program Output:
```text
============================================================
       BHARAT IOT SMART HOME AUTOMATION CONTROLLER
============================================================
INITIAL STATE:
Active Hub State Byte : 00010001 (Decimal: 17)
  > Main Door Locked  : UNLOCKED
  > Security Camera   : OFFLINE
  > Air Conditioner   : STANDBY
  > Living Room Lights: ON
  > Fire Alarm System : ARMED
------------------------------------------------------------
ACTION: Activating Night Security Protocol (Camera + Lock)...
Active Hub State Byte : 00011101 (Decimal: 29)
  > Main Door Locked  : LOCKED (SECURE)
  > Security Camera   : ACTIVE (RECORDING)
  > Air Conditioner   : STANDBY
  > Living Room Lights: ON
  > Fire Alarm System : ARMED
------------------------------------------------------------
ACTION: Leaving for office (Turning OFF Lights & AC)...
Active Hub State Byte : 00011100 (Decimal: 28)
  > Main Door Locked  : LOCKED (SECURE)
  > Security Camera   : ACTIVE (RECORDING)
  > Air Conditioner   : STANDBY
  > Living Room Lights: OFF
  > Fire Alarm System : ARMED
------------------------------------------------------------
ACTION: Toggling Fire Alarm State via XOR (^)...
Active Hub State Byte : 00001100 (Decimal: 12)
  > Main Door Locked  : LOCKED (SECURE)
  > Security Camera   : ACTIVE (RECORDING)
  > Air Conditioner   : STANDBY
  > Living Room Lights: OFF
  > Fire Alarm System : DISABLED
------------------------------------------------------------
Is active byte (12) an even configuration? True
============================================================
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Implicit Casting** (7: Casting).

👉 **[Continue to Next Lesson: Implicit Casting →](/tutorials/python-for-beginners/implicit-casting)**
