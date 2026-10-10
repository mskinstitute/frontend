---
id: python-explicit-casting
slug: explicit-casting
course: python-for-beginners
chapter: 7
topic: 7.2
title: Explicit Casting (int(), float(), str())
description: Master Python explicit type casting using constructor functions (int, float, str, bool), convert number bases, transform collections, and implement safe error-guarded parsing.
difficulty: Beginner
readingTime: 14
order: 30
keywords:
  - python explicit casting
  - constructor functions
  - int float str bool
  - list tuple set dict casting
  - base conversion int base
  - defensive casting valueerror
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python Explicit Type Casting: Constructor Functions & Base Conversion

While implicit casting happens automatically for numeric widening, the vast majority of type conversions in real-world software must be executed **explicitly** by the programmer. 

Whenever user data arrives from standard input (`input()`), file systems, network sockets, or REST APIs, it is delivered as raw text (`str`). To calculate prices, manipulate sequences, or eliminate duplicates, you must explicitly invoke Python's built-in **type constructor functions**: `int()`, `float()`, `str()`, `bool()`, `list()`, `tuple()`, `set()`, and `dict()`.

---

## Real-World Analogy: Melting Gold Jewelry & Sorting Unique Tokens

```
+-------------------------------------------------------------------------+
|                  EXPLICIT CASTING REAL-WORLD ANALOGY                    |
+-------------------------------------------------------------------------+

  1. THE GOLDSMITH'S MOLD (Casting Between Shapes):
     - You take old gold ornaments to a jeweler in Mumbai's Zaveri Bazaar.
     - You instruct the artisan: "Melt these necklaces and cast them into
       5-gram circular bullion coins!"
     - The physical matter is transformed by pouring it into a specific mold:
       bullion_coins = list(gold_necklaces)

  2. BASE CONVERSION (Deciphering Secret Ciphers):
     - A computer hardware telemetry log reports memory addresses in
       Hexadecimal: "0x1A4" or Binary: "10110".
     - By passing the base parameter to int(string, base), you explicitly
       instruct Python which numeric dialect to translate!

  3. DEFENSIVE SAFETY GUARDS:
     - If an applicant enters their age as "Twenty Five" into a terminal prompt,
       the int() mold shatters with a ValueError!
     - A master developer always wraps explicit casting inside try/except.
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: The Python Explicit Constructor Suite

```
===========================================================================
             THE EXPLICIT TYPE CASTING CONSTRUCTOR ECOSYSTEM
===========================================================================

       Source Data                     Constructor Function      Target Object
  -------------------------------------------------------------------------
  String of digits:  "450"       --->  int("450")          --->  450 (int)
  Hexadecimal text:  "FF"        --->  int("FF", 16)       --->  255 (int)
  Float with decimals: 9.99      --->  int(9.99)           --->  9 (Truncated)
  Integer:           108         --->  float(108)          --->  108.0 (float)
  Any Python object: 5400.5      --->  str(5400.5)         --->  "5400.5" (str)
  Non-empty string:  "Admin"     --->  bool("Admin")       --->  True (bool)

  List with dupes:   [1, 2, 2]   --->  set([1, 2, 2])      --->  {1, 2} (Unique)
  Key-Value tuples:  [('a', 1)]  --->  dict([('a', 1)])     --->  {'a': 1}
```

---

## 1. Explicit Numeric & String Casting: `int()`, `float()`, `str()`

```python
# ==========================================================
# Example 1: Core Scalar Constructors
# ==========================================================

# 1. Parsing user strings into numbers
raw_roll_input = "104"
roll_number = int(raw_roll_input)
print(f"Next Roll Number: {roll_number + 1}")

raw_cgpa_input = "8.92"
student_cgpa = float(raw_cgpa_input)
print(f"CGPA scaled to 100: {student_cgpa * 10:.2f}%")

# 2. Float to Integer Truncation (Notice it truncates towards zero, not rounds!)
price_with_paise = 499.95
price_rupees_only = int(price_with_paise)
print(f"Original: {price_with_paise} -> Truncated int: {price_rupees_only}")

# 3. Converting numbers & objects into strings for logging
server_status_code = 200
response_payload = {"status": "SUCCESS", "records": 42}

log_message = "Server returned code " + str(server_status_code) + " with payload " + str(response_payload)
print(log_message)
```

### Output:
```text
Next Roll Number: 105
CGPA scaled to 100: 89.20%
Original: 499.95 -> Truncated int: 499
Server returned code 200 with payload {'status': 'SUCCESS', 'records': 42}
```

---

## 2. Advanced Base Conversions with `int(string, base)`

The `int()` constructor takes an optional second argument `base` (ranging from 2 to 36), enabling direct conversion from any number base into a decimal integer:

```python
# ==========================================================
# Example 2: Parsing Different Number Bases
# ==========================================================

# 1. Binary (Base 2): '0' and '1'
binary_str = "1101"  # (1*8) + (1*4) + (0*2) + (1*1) = 13
decimal_from_bin = int(binary_str, 2)
print(f"Binary '{binary_str}' to Decimal: {decimal_from_bin}")

# 2. Octal (Base 8): Digits 0 to 7
octal_str = "755"    # Linux file permission
decimal_from_oct = int(octal_str, 8)
print(f"Octal '{octal_str}' to Decimal : {decimal_from_oct}")

# 3. Hexadecimal (Base 16): Digits 0-9 and A-F
hex_color = "FFA500" # Orange HTML color
decimal_from_hex = int(hex_color, 16)
print(f"Hex '{hex_color}' to Decimal   : {decimal_from_hex}")
```

### Output:
```text
Binary '1101' to Decimal: 13
Octal '755' to Decimal : 493
Hex 'FFA500' to Decimal   : 16753920
```

---

## 3. Explicit Collection Casting: `list()`, `tuple()`, `set()`, `dict()`

Transforming between collections is one of Python's most powerful data manipulation techniques:

```python
# ==========================================================
# Example 3: Collection Transformations
# ==========================================================

# 1. String to List of Characters
word = "Python"
char_list = list(word)
print("String to List of chars :", char_list)

# 2. Deduplicating a list using set()
raw_metro_stops = ["Rajiv Chowk", "Hauz Khas", "Kashmere Gate", "Rajiv Chowk"]
unique_stops = set(raw_metro_stops)
print("Deduplicated Unique Set :", unique_stops)

# 3. Converting back from Set to List
clean_stops_list = list(unique_stops)
print("Cleaned Unique List     :", clean_stops_list)

# 4. Converting Pair Tuples to a Dictionary
key_value_pairs = [("IN", "India"), ("US", "United States"), ("JP", "Japan")]
country_dict = dict(key_value_pairs)
print("Dictionary from Tuples  :", country_dict)
```

### Output:
```text
String to List of chars : ['P', 'y', 't', 'h', 'o', 'n']
Deduplicated Unique Set : {'Rajiv Chowk', 'Hauz Khas', 'Kashmere Gate'}
Cleaned Unique List     : ['Rajiv Chowk', 'Hauz Khas', 'Kashmere Gate']
Dictionary from Tuples  : {'IN': 'India', 'US': 'United States', 'JP': 'Japan'}
```

---

## 4. Defensive Explicit Casting with `try...except`

When parsing data from external inputs, you must never assume the string is well-formed. A robust production program always wraps explicit casts in a `try...except ValueError` block:

```python
# ==========================================================
# Example 4: Defensive Parsing Function
# ==========================================================

def parse_user_age(raw_age_text: str) -> int | None:
    try:
        clean_text = raw_age_text.strip()
        parsed_age = int(clean_text)
        if parsed_age < 0 or parsed_age > 120:
            print(f"VALIDATION ERROR: Age {parsed_age} is outside human bounds.")
            return None
        return parsed_age
    except ValueError:
        print(f"PARSING CRASH PREVENTED: Cannot cast '{raw_age_text}' to integer!")
        return None

# Test runs
print("Valid Parse   :", parse_user_age("  25  "))
print("Invalid Text  :", parse_user_age("Twenty Five"))
print("Invalid Float :", parse_user_age("25.5"))  # Needs float() first!
```

### Output:
```text
Valid Parse   : 25
PARSING CRASH PREVENTED: Cannot cast 'Twenty Five' to integer!
Invalid Text  : None
PARSING CRASH PREVENTED: Cannot cast '25.5' to integer!
Invalid Float : None
```

---

## Do's and Don'ts: Explicit Casting

| Scenario | Anti-Pattern (Don't) | Best Practice (Do) | Why |
| :--- | :--- | :--- | :--- |
| **Float String to Int** | `int("45.5")` directly | `int(float("45.5"))` | `int()` raises `ValueError` on decimal strings. |
| **Un-sanitized Input** | `age = int(input())` | Wrapped in `try...except ValueError` | Prevents malicious or accidental input from crashing your server. |
| **Deduplicating Lists** | Manual `for` loop with `if not in` | `list(set(my_list))` | `set()` deduplicates in $O(N)$ linear time using fast hashing. |
| **String Conversion** | Manual string stitching | `str(obj)` or f-string `f"{obj}"` | Calls `__str__()` uniformly on any object. |

---

## Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                    EXPLICIT CASTING CHEAT SHEET                         |
+-------------------------------------------------------------------------+
  - int(x):          Truncates floats towards 0; parses digit strings
  - int(str, base):  Parses base 2 (binary), base 8 (octal), base 16 (hex)
  - float(x):        Parses numeric strings and converts ints to decimals
  - str(x):          Converts any Python object to its readable string form
  - bool(x):         Falsy check (0, '', [], None -> False; all else True)
  - list() / set():  Transforms iterables; set() eliminates duplicates
  - dict(pairs):     Converts list of (key, value) 2-tuples into a dictionary
  - Exception Guard: Always protect casts with try...except ValueError!
+-------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Casting Non-Numeric Strings to `int`
Passing alphabetic or floating-point text directly to `int()` raises a `ValueError`:
```python
# ❌ INCORRECT (Raises ValueError: invalid literal for int() with base 10: '45.8')
# num = int("45.8")

# ✅ CORRECT (Parse as float first, then cast to int)
num = int(float("45.8"))
print(num)  # 45
```

---

## Practice Quiz

### 1. What will be returned by evaluating `int("1010", 2)` in Python?
A. `"1010"`
B. `10`
C. `1010`
D. `ValueError`

**Answer:** B

---

### 2. What happens when you execute `int("59.99")` directly?
A. It returns `59`
B. It returns `60`
C. It raises a `ValueError: invalid literal for int() with base 10: '59.99'`
D. It returns `59.99`

**Answer:** C

---

### 3. How do you convert a list containing duplicate elements into a unique collection of items?
A. `list.unique()`
B. `set(my_list)`
C. `my_list.dedupe()`
D. `tuple(my_list)`

**Answer:** B

---

### 4. What is the value of `int(-8.85)` in Python?
A. `-9`
B. `-8`
C. `-8.0`
D. `TypeError`

**Answer:** B

---

### 5. What is the result of calling `dict([("a", 1), ("b", 2)])`?
A. `[("a", 1), ("b", 2)]`
B. `{'a': 1, 'b': 2}`
C. `{'a', 'b', 1, 2}`
D. `TypeError`

**Answer:** B

---

# Hands-On Practice Challenge: Telemetry Sensor Data Parser

Write a complete, defensive Python script that parses raw text telemetry packets sent from an environmental IoT weather station. The script must parse decimal sensor values, binary error status flags, hexadecimal device addresses, and sanitize invalid corrupted packets.

```python
# ==========================================================
# Challenge 30: IoT Weather Telemetry Packet Parser
# MSK Institute of Technology
# ==========================================================

# Raw sensor telemetry packets received from remote weather stations
# Format: "DEVICE_HEX | TEMP_STR | HUMIDITY_STR | STATUS_BIN"
RAW_SENSOR_PACKETS = [
    "0x1F | 32.4 | 65 | 0001",
    "0x2A | 28.9 | 80 | 0000",
    "0x0B | CORRUPTED | 45 | 0010",
    "0x3C | 41.5 | 92 | 0100"
]

def parse_telemetry_stream(packets: list[str]) -> None:
    print("=" * 65)
    print("      ISRO METEOROLOGICAL TELEMETRY PACKET PROCESSOR")
    print("=" * 65)
    print(f"{'DEVICE ID':<12} | {'TEMP (°C)':^10} | {'HUMIDITY':^10} | {'SYS STATUS':>15}")
    print("-" * 65)

    valid_readings = 0
    total_temp = 0.0

    for packet in packets:
        fields = [f.strip() for f in packet.split("|")]
        if len(fields) != 4:
            continue

        raw_dev, raw_temp, raw_humidity, raw_status = fields

        # Defensive explicit casting
        try:
            # 1. Parse Hexadecimal device ID (Base 16)
            device_id = int(raw_dev, 16)

            # 2. Parse Float Temperature
            temperature = float(raw_temp)

            # 3. Parse Integer Humidity
            humidity = int(raw_humidity)

            # 4. Parse Binary Status Mask (Base 2)
            status_code = int(raw_status, 2)
            status_desc = "NORMAL" if status_code == 0 else f"ALERT (Flag {status_code})"

            print(f"Device #{device_id:<5} | {temperature:^10.1f} | {humidity:^8}% | {status_desc:>15}")

            total_temp += temperature
            valid_readings += 1

        except ValueError as err:
            print(f"CORRUPTED PACKET DROPPED -> [{packet}] (Reason: {err})")

    print("=" * 65)
    if valid_readings > 0:
        avg_temp = total_temp / valid_readings
        print(f"Valid Packets Processed: {valid_readings} / {len(packets)}")
        print(f"Mean Regional Temp     : {avg_temp:.2f} °C\n")


# ----------------------------------------------------------
# Run Telemetry Pipeline
# ----------------------------------------------------------
parse_telemetry_stream(RAW_SENSOR_PACKETS)
```

### Expected Program Output:
```text
=================================================================
      ISRO METEOROLOGICAL TELEMETRY PACKET PROCESSOR
=================================================================
DEVICE ID    |  TEMP (°C) |  HUMIDITY  |      SYS STATUS
-----------------------------------------------------------------
Device #31    |    32.4    |   65%    |   ALERT (Flag 1)
Device #42    |    28.9    |   80%    |          NORMAL
CORRUPTED PACKET DROPPED -> [0x0B | CORRUPTED | 45 | 0010] (Reason: could not convert string to float: 'CORRUPTED')
Device #60    |    41.5    |   92%    |   ALERT (Flag 4)
=================================================================
Valid Packets Processed: 3 / 4
Mean Regional Temp     : 34.27 °C
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Common Pitfalls** (7: Casting).

👉 **[Continue to Next Lesson: Common Pitfalls →](/tutorials/python-for-beginners/common-pitfalls)**
