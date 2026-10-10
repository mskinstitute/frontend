---
id: python-slicing-indexing
slug: slicing-indexing
course: python-for-beginners
chapter: 5
topic: 5.2
title: Slicing & Indexing
description: Master Python's zero-based forward indexing, negative reverse indexing, the [start:stop:step] slicing formula, boundary tolerance, and string reversal techniques.
difficulty: Beginner
readingTime: 14
order: 18
keywords:
  - python string indexing
  - string slicing
  - negative indexing
  - start stop step
  - reverse string
  - indexerror vs slice tolerance
  - palindrome check
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Python String Slicing & Indexing: The Complete Guide

In Python, every character within a string occupies an exact, addressable position called an **index**. Because strings are ordered sequences, Python provides an elegant and concise syntax to retrieve individual characters (**indexing**) or carve out continuous sub-segments (**slicing**).

Whether you are parsing file extensions from paths, extracting username handles from email addresses, or reversing sequences for cryptographic algorithms, string indexing and slicing are indispensable daily tools.

---

## Real-World Analogy: School Assembly Roll Call & Ribbon Cutting

```
+-------------------------------------------------------------------------+
|                  STRING INDEXING & SLICING REAL-WORLD ANALOGY           |
+-------------------------------------------------------------------------+

  1. FORWARD ZERO-BASED INDEXING (Distance from the start):
     - Think of a morning school assembly line.
     - The first student standing at the very front is 0 steps away from
       the start line -> Index 0.
     - The next student is 1 step away -> Index 1.

  2. REVERSE NEGATIVE INDEXING (Counting from the rear):
     - The physical education teacher standing at the very back of the line:
       The student at the very tail end is -1 (one step from the back).
     - The second-to-last student is -2.

  3. SLICING [start : stop] (Cutting a Ribbon):
     - Imagine a ribbon marked with centimeter lines.
     - If you make a cut at Mark 2 and another cut at Mark 5, you get
       centimeters 2, 3, and 4.
     - The end mark (stop) is EXCLUSIVE! You stop before cutting through 5.
+-------------------------------------------------------------------------+
```

---

## Visual Architecture: The Dual-Index Coordinate Grid

Understanding both positive and negative index positions across a string like `"PYTHON"`:

```
===========================================================================
             THE DUAL-INDEX MEMORY MAP FOR "PYTHON"
===========================================================================

  Positive Indices (Left to Right):
  ---------------------------------
        0       1       2       3       4       5
    +-------+-------+-------+-------+-------+-------+
    |   P   |   Y   |   T   |   H   |   O   |   N   |
    +-------+-------+-------+-------+-------+-------+
       -6      -5      -4      -3      -2      -1
  ---------------------------------
  Negative Indices (Right to Left):

  Between-the-Characters Slicing Coordinates:
    |   P   |   Y   |   T   |   H   |   O   |   N   |
    0       1       2       3       4       5       6
    ^               ^
    |-- "PY" [0:2] -|

    Slice "PYTHON"[1:4] captures characters between cut 1 and cut 4:
    Index 1 ('Y'), Index 2 ('T'), Index 3 ('H') -> "YTH"
```

---

## 1. Single Character Access (Forward & Negative Indexing)

To extract an individual character, place the index inside square brackets `[index]`:

```python
# ==========================================================
# Example 1: Forward and Negative Indexing
# ==========================================================

platform = "Antigravity"

# Positive Indexing (0 to len - 1)
print("First character [0]  :", platform[0])       # 'A'
print("Second character [1] :", platform[1])       # 'n'
print("Fifth character [4]  :", platform[4])       # 'i'

# Negative Indexing (-1 to -len)
print("Last character [-1]  :", platform[-1])      # 'y'
print("Second last [-2]     :", platform[-2])      # 't'
print("Third last [-3]      :", platform[-3])      # 'i'

# Attempting an out-of-range direct index triggers IndexError!
try:
    bad_char = platform[99]
except IndexError as err:
    print("INDEX ERROR CAUGHT   :", err)
```

### Output:
```text
First character [0]  : A
Second character [1] : n
Fifth character [4]  : i
Last character [-1]  : y
Second last [-2]     : t
Third last [-3]      : i
INDEX ERROR CAUGHT   : string index out of range
```

---

## 2. Basic Slicing: The `[start:stop]` Formula

Slicing extracts a substring using the pattern:
$$\text{string}[\text{start} : \text{stop}]$$
- **`start` (Inclusive):** The index where the slice begins (defaults to `0` if omitted).
- **`stop` (Exclusive):** The index where the slice ends—**not included** in the result! (defaults to end of string if omitted).

```python
# ==========================================================
# Example 2: Basic Substring Slicing
# ==========================================================

course_code = "PYTHON101_CORE"

# 1. Standard slice: from index 0 up to 6 (exclusive)
lang = course_code[0:6]
print("Slice [0:6]  :", lang)         # 'PYTHON'

# 2. Omitting start: begins at index 0 automatically
prefix = course_code[:6]
print("Slice [:6]   :", prefix)       # 'PYTHON'

# 3. Omitting stop: slices to the very end
suffix = course_code[10:]
print("Slice [10:]  :", suffix)       # 'CORE'

# 4. Middle extraction
num_part = course_code[6:9]
print("Slice [6:9]  :", num_part)     # '101'

# 5. Negative indices inside slices
# Extract from start up to the last 5 characters
without_suffix = course_code[:-5]
print("Slice [:-5]  :", without_suffix) # 'PYTHON101'
```

### Output:
```text
Slice [0:6]  : PYTHON
Slice [:6]   : PYTHON
Slice [10:]  : CORE
Slice [6:9]  : 101
Slice [:-5]  : PYTHON101
```

---

## 3. Advanced Slicing: The Step / Stride Parameter `[start:stop:step]`

You can provide a third parameter:
$$\text{string}[\text{start} : \text{stop} : \text{step}]$$
- **`step` (Stride):** Specifies the interval between characters (defaults to `+1`).
- A negative step (`-1`) instructs Python to traverse the string in reverse!

```python
# ==========================================================
# Example 3: Slicing with Step & String Reversal
# ==========================================================

alphabet = "ABCDEFGHIJ"

# 1. Skip every second character (step=2)
every_second = alphabet[::2]
print("Step 2 [::2] :", every_second)   # A, C, E, G, I

# 2. Start at index 1 and take every third character
stepped_sub = alphabet[1:8:3]
print("Step 3 [1:8:3]:", stepped_sub)  # Index 1('B'), 4('E'), 7('H')

# 3. Idiomatic Python String Reversal [::-1]
reversed_alpha = alphabet[::-1]
print("Reversed [::-1]:", reversed_alpha)

# 4. Palindrome Verification using [::-1]
word_1 = "RACECAR"
word_2 = "MALAYALAM"
word_3 = "KOLKATA"

print(f"Is '{word_1}' a palindrome?:", word_1 == word_1[::-1])
print(f"Is '{word_2}' a palindrome?:", word_2 == word_2[::-1])
print(f"Is '{word_3}' a palindrome?:", word_3 == word_3[::-1])
```

### Output:
```text
Step 2 [::2] : ACEGI
Step 3 [1:8:3]: BEH
Reversed [::-1]: JIHGFEDCBA
Is 'RACECAR' a palindrome?: True
Is 'MALAYALAM' a palindrome?: True
Is 'KOLKATA' a palindrome?: False
```

---

## 4. Crucial Concept: Direct Indexing vs Slicing Tolerance

One of Python's most friendly features is that **slicing never raises an `IndexError`**, even if your indices extend far beyond the actual string boundaries!

```python
# ==========================================================
# Example 4: Slicing Out-of-Bounds Gracefulness
# ==========================================================

city = "Mumbai"  # Length: 6

# Direct indexing crashes:
# print(city[20])  # Raises IndexError!

# Slicing tolerates excessive boundaries gracefully:
safe_slice = city[2:500]
print("city[2:500]   ->", safe_slice)   # 'mbai' (captures up to the end!)

# Slice completely out of bounds returns empty string without error:
empty_slice = city[100:200]
print("city[100:200] ->", repr(empty_slice)) # ''
```

### Output:
```text
city[2:500]   -> mbai
city[100:200] -> ''
```

---

## Do's and Don'ts: Indexing & Slicing

| Task | Anti-Pattern (Don't) | Best Practice (Do) | Why |
| :--- | :--- | :--- | :--- |
| **Last Character** | `s[len(s) - 1]` | `s[-1]` | Negative indexing is clean, concise, and Pythonic. |
| **Reverse String** | Building a manual `for` loop | `s[::-1]` | `[::-1]` executes in optimized C bytecode in microseconds. |
| **Slice to End** | `s[3:len(s)]` | `s[3:]` | Omitting `stop` automatically runs to the very end. |
| **Safe Extraction** | Writing `if len(s) > 10` guards for slices | Direct slice `s[:10]` | Slicing is naturally boundary-tolerant and never raises `IndexError`. |

---

## Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                    SLICING & INDEXING CHEAT SHEET                       |
+-------------------------------------------------------------------------+
  - First Char:       s[0]
  - Last Char:        s[-1]
  - Basic Slice:      s[start:stop] (stop index is EXCLUSIVE!)
  - Omit Start:       s[:n] (from index 0 up to n-1)
  - Omit Stop:        s[n:] (from index n to the very end)
  - Step Interval:    s[::2] (every 2nd character)
  - Reverse String:   s[::-1]
  - Error Safety:     s[999] -> IndexError, but s[:999] -> NO error!
+-------------------------------------------------------------------------+
```

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Attempting to Mutate a String in Place
Python strings are immutable. You cannot assign directly to a character index:
```python
text = "Python"
# ❌ INCORRECT (TypeError: 'str' object does not support item assignment)
text[0] = "J"

# ✅ CORRECT (Create a new string using slicing or concatenation)
text = "J" + text[1:]
print(text)  # "Jython"
```

### 2. Off-By-One Errors in Slicing
In Python slicing `text[start:stop]`, the `stop` index is **exclusive** (not included in the slice):
```python
word = "Coding"
# Slicing word[0:3] gives indices 0, 1, 2 ('Cod'), NOT index 3!
print(word[0:3])  # 'Cod'
```

---

## Practice Quiz

### 1. What does evaluating the expression `"BANGALORE"[1:5]` return?
A. `'BANGA'`
B. `'ANGA'`
C. `'ANGA L'`
D. `'BAN'`

**Answer:** B

---

### 2. What happens when you execute `text = "Python"; print(text[20:50])`?
A. Python throws an `IndexError: string index out of range`
B. Python throws a `ValueError`
C. It executes successfully and returns an empty string `""`
D. Python fills the missing space with spaces

**Answer:** C

---

### 3. What is the most Pythonic and efficient technique to reverse a string variable `title`?
A. `title.reverse()`
B. `reversed(title).join()`
C. `title[::-1]`
D. `title[-1:0]`

**Answer:** C

---

### 4. Given `s = "DELHI"`, what character is returned by `s[-2]`?
A. `'D'`
B. `'L'`
C. `'H'`
D. `'I'`

**Answer:** C

---

### 5. What will be displayed after evaluating `"ABCDEFGH"[::3]`?
A. `'ADG'`
B. `'ACEG'`
C. `'ABC'`
D. `'CFH'`

**Answer:** A

---

# Hands-On Practice Challenge: Financial Account & Email Parser

Write a complete Python script that accepts sensitive user strings (such as debit card numbers, phone numbers, and official email addresses) and uses string indexing and slicing to mask card credentials and parse corporate email domains.

```python
# ==========================================================
# Challenge 18: Sensitive Data Masking & Email Domain Slicer
# MSK Institute of Technology
# ==========================================================

def mask_payment_card(card_number: str) -> str:
    """Masks a 16-digit debit card showing only first 4 and last 4 digits."""
    clean_card = card_number.replace(" ", "").replace("-", "")
    if len(clean_card) != 16:
        return "INVALID_CARD_LENGTH"
        
    # Use slicing to isolate first 4 digits and last 4 digits
    first_four = clean_card[:4]
    last_four = clean_card[-4:]
    masked = f"{first_four}-XXXX-XXXX-{last_four}"
    return masked

def parse_corporate_email(email_address: str) -> dict:
    """Parses username, domain name, and top-level domain from email using slicing."""
    clean_email = email_address.strip()
    
    # Locate delimiter index
    at_index = clean_email.find("@")
    if at_index == -1:
        return {"status": "ERROR", "message": "Missing @ symbol"}

    # Extract username and full domain using slice
    username = clean_email[:at_index]
    domain_full = clean_email[at_index + 1:]
    
    # Split domain into organization and extension
    dot_index = domain_full.rfind(".")
    org_name = domain_full[:dot_index]
    tld_extension = domain_full[dot_index + 1:]

    return {
        "status": "SUCCESS",
        "username": username,
        "organization": org_name,
        "extension": tld_extension,
        "full_domain": domain_full
    }

# ----------------------------------------------------------
# Demonstration & Telemetry
# ----------------------------------------------------------
print("=" * 60)
print("      DATA PRIVACY & EMAIL PARSER WORKBENCH")
print("=" * 60)

raw_cards = [
    "4532 8901 2345 9812",
    "6011-4455-8822-1199"
]

print("--- DEBIT CARD MASKING TELEMETRY ---")
for card in raw_cards:
    print(f"Raw Input : {card}")
    print(f"Masked    : {mask_payment_card(card)}\n")

test_emails = [
    "admissions@mskinstitute.in",
    "rahul.verma@delhiuniversity.ac.in",
    "contact@isro.gov.in"
]

print("--- CORPORATE EMAIL DOMAIN SLICING ---")
for mail in test_emails:
    parsed = parse_corporate_email(mail)
    print(f"Email        : {mail}")
    print(f"  > Username : {parsed['username']}")
    print(f"  > Org Name : {parsed['organization'].upper()}")
    print(f"  > TLD Ext  : {parsed['extension']}")
    print("-" * 60)
```

### Expected Program Output:
```text
============================================================
      DATA PRIVACY & EMAIL PARSER WORKBENCH
============================================================
--- DEBIT CARD MASKING TELEMETRY ---
Raw Input : 4532 8901 2345 9812
Masked    : 4532-XXXX-XXXX-9812

Raw Input : 6011-4455-8822-1199
Masked    : 6011-XXXX-XXXX-1199

--- CORPORATE EMAIL DOMAIN SLICING ---
Email        : admissions@mskinstitute.in
  > Username : admissions
  > Org Name : MSKINSTITUTE
  > TLD Ext  : in
------------------------------------------------------------
Email        : rahul.verma@delhiuniversity.ac.in
  > Username : rahul.verma
  > Org Name : DELHIUNIVERSITY.AC
  > TLD Ext  : in
------------------------------------------------------------
Email        : contact@isro.gov.in
  > Username : contact
  > Org Name : ISRO.GOV
  > TLD Ext  : in
------------------------------------------------------------
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Modifying Strings** (5: Strings).

👉 **[Continue to Next Lesson: Modifying Strings →](/tutorials/python-for-beginners/modifying-strings)**
