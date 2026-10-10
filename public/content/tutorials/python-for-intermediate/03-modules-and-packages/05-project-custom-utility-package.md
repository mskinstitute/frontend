---
id: python-project-custom-utility-package
slug: project-custom-utility-package
course: python-for-intermediate
chapter: "3: Modules and Packages"
topic: "3.5 Project: Custom Utility Package"
title: "Project: Custom Indian Business Utility Package (indialib)"
description: "Architect a production-grade multi-module Python package featuring Indian Lakhs/Crores currency formatting, PAN/Aadhaar validation, and an API facade."
difficulty: Intermediate
readingTime: 16
order: 15
keywords:
  - project
  - custom package
  - indialib
  - indian currency formatting
  - lakhs crores formatting
  - pan validation
  - package facade
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Custom Indian Business Utility Package (indialib)

Welcome to the Chapter 3 Capstone Project! Over the preceding lessons, you mastered module creation, search hierarchies, `__name__ == '__main__'`, package structures, and standard library tools.

Now, you will synthesize all these disciplines by engineering a reusable, production-ready Python package named **`indialib`**. This package solves everyday computational challenges for Indian digital enterprises:
1. **Indian Currency Formatter (`currency.py`):** Converts numbers to traditional South Asian comma-separated formats (Thousands, Lakhs, Crores: `₹12,34,567.89`).
2. **Identity & Tax Validator (`validators.py`):** Validates 10-character Indian PAN cards, 12-digit Aadhaar numbers, and 15-character GSTIN tax identifiers.
3. **Data Masking & Security (`security.py`):** Masks sensitive customer credentials for compliance (`XXXX-XXXX-5678`).
4. **Package Facade (`__init__.py`):** Curates clean public exports and governs access via `__all__`.

---

## Real-World Analogy: Building a Reusable Zoho/Tally Business SDK

Imagine building a shared internal toolkit for a financial technology startup in Bengaluru:

```
+-------------------------------------------------------------------------+
|                    INDIALIB BUSINESS SDK ARCHITECTURE                   |
+-------------------------------------------------------------------------+
|                                                                         |
|   Consumer Application (billing_service.py)                             |
|          │                                                              |
|          ▼                                                              |
|   Package Facade: indialib/__init__.py                                  |
|   ├── Exposes: format_inr, validate_pan, mask_aadhaar                    |
|   └── Enforces __all__ boundary & version stamping                      |
|          │                                                              |
|          ├──────────────────────┼──────────────────────┐                |
|          ▼                      ▼                      ▼                |
|   [ currency.py ]        [ validators.py ]      [ security.py ]         |
|   Lakhs/Crores Engine    PAN & GSTIN Regex      Aadhaar Data Masker     |
|                                                                         |
+-------------------------------------------------------------------------+
```

Any engineering team within your company can install or import `indialib` and immediately format financial ledgers or sanitize customer KYC inputs with zero code duplication.

---

## Indian Numbering System Formatting Rule

Unlike the Western numbering system (groups of 3 digits: `1,000,000`), the Indian numbering system groups the last 3 digits together, and every subsequent group by **2 digits**:

```
Number:       1 2 3 4 5 6 7 8
Western:      12,345,678  (12 Million, 345 Thousand, 678)
Indian:       1,23,45,678 (1 Crore, 23 Lakh, 45 Thousand, 678)
```

---

## Complete Production-Grade Implementation

Here is the modular, fully runnable codebase for the `indialib` package:

```python
"""
MSK Python Capstone: Custom Indian Enterprise Utility Package (indialib)
Author: MSK Institute
"""
import re
import secrets

# =============================================================
# SUBMODULE 1: indialib/currency.py
# =============================================================
def format_inr(amount: float, symbol: str = "₹") -> str:
    """
    Formats a floating-point number into Indian numbering format with Lakhs and Crores.
    Example: 1234567.5 -> '₹12,34,567.50'
    """
    amount = round(amount, 2)
    parts = f"{amount:.2f}".split(".")
    integer_part = parts[0]
    decimal_part = parts[1]

    # If number is less than 1,000, no special grouping needed
    if len(integer_part) <= 3:
        return f"{symbol}{integer_part}.{decimal_part}"

    # Extract last 3 digits
    last_three = integer_part[-3:]
    remaining = integer_part[:-3]

    # Group remaining digits in pairs of 2 from right to left
    pairs = []
    while len(remaining) > 2:
        pairs.insert(0, remaining[-2:])
        remaining = remaining[:-2]
    if remaining:
        pairs.insert(0, remaining)

    formatted_int = ",".join(pairs) + "," + last_three
    return f"{symbol}{formatted_int}.{decimal_part}"


# =============================================================
# SUBMODULE 2: indialib/validators.py
# =============================================================
def validate_pan(pan_number: str) -> bool:
    """
    Validates Indian Permanent Account Number (PAN).
    Rule: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F).
    """
    pattern = r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    return bool(re.match(pattern, pan_number.strip().upper()))

def validate_aadhaar(aadhaar_number: str) -> bool:
    """
    Validates 12-digit Indian Aadhaar number format.
    Does not start with 0 or 1.
    """
    cleaned = aadhaar_number.replace(" ", "").replace("-", "").strip()
    pattern = r"^[2-9]{1}[0-9]{11}$"
    return bool(re.match(pattern, cleaned))

def validate_gstin(gstin: str) -> bool:
    """
    Validates 15-character Indian GSTIN format.
    Format: 2 state digits + 10 PAN chars + 1 entity code + 1 'Z' + 1 check digit.
    """
    pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
    return bool(re.match(pattern, gstin.strip().upper()))


# =============================================================
# SUBMODULE 3: indialib/security.py
# =============================================================
def mask_aadhaar(aadhaar_number: str) -> str:
    """
    Masks the first 8 digits of an Aadhaar number for RBI/UIDAI compliance.
    Example: '987654321098' -> 'XXXX-XXXX-1098'
    """
    cleaned = aadhaar_number.replace(" ", "").replace("-", "").strip()
    if len(cleaned) != 12 or not cleaned.isdigit():
        return "[INVALID AADHAAR]"
    return f"XXXX-XXXX-{cleaned[-4:]}"

def generate_reference_id(prefix="MSK") -> str:
    """Generates a cryptographically random transaction audit reference ID."""
    random_hex = secrets.token_hex(4).upper()
    return f"{prefix}-{random_hex}"


# =============================================================
# PACKAGE FACADE: indialib/__init__.py
# =============================================================
__version__ = "1.2.0"
__author__ = "MSK Institute"

# Export curated public symbols
__all__ = [
    "format_inr",
    "validate_pan",
    "validate_aadhaar",
    "validate_gstin",
    "mask_aadhaar",
    "generate_reference_id"
]


# =============================================================
# CLIENT APPLICATION DEMONSTRATION & VERIFICATION
# =============================================================
if __name__ == "__main__":
    print(f"=== Running indialib Business SDK Verification (v{__version__}) ===\n")

    # 1. Test Indian Currency Formatter
    test_amounts = [450.0, 1500.0, 95000.0, 1234567.89, 50000000.0]
    print("--- Indian Currency Formatting (Lakhs & Crores) ---")
    for amt in test_amounts:
        print(f"  Raw: {amt:>12,.2f}  ➔  Formatted: {format_inr(amt)}")

    # 2. Test Identity Validators
    print("\n--- Identity & Tax Format Validation ---")
    pan_samples = ["ABCDE1234F", "abcde1234f", "12345ABCDE", "TOOLONG12345F"]
    for pan in pan_samples:
        status = "VALID ✅" if validate_pan(pan) else "INVALID ❌"
        print(f"  PAN '{pan:<14}': {status}")

    gst_samples = ["27AAPFU0939F1ZV", "07AAAAA0000A1Z5", "INVALID_GST_SAMPLE"]
    for gst in gst_samples:
        status = "VALID ✅" if validate_gstin(gst) else "INVALID ❌"
        print(f"  GST '{gst:<16}': {status}")

    # 3. Test Security Masking
    print("\n--- Compliance Aadhaar Data Masking ---")
    raw_aadhaar = "9876 5432 1098"
    print(f"  Raw Aadhaar   : {raw_aadhaar}")
    print(f"  Masked Output : {mask_aadhaar(raw_aadhaar)}")
    print(f"  Audit Ref ID  : {generate_reference_id('KYC')}")
```

---

## Expected Output

```text
=== Running indialib Business SDK Verification (v1.2.0) ===

--- Indian Currency Formatting (Lakhs & Crores) ---
  Raw:       450.00  ➔  Formatted: ₹450.00
  Raw:     1,500.00  ➔  Formatted: ₹1,500.00
  Raw:    95,000.00  ➔  Formatted: ₹95,000.00
  Raw: 1,234,567.89  ➔  Formatted: ₹12,34,567.89
  Raw: 50,000,000.00  ➔  Formatted: ₹5,00,00,000.00

--- Identity & Tax Format Validation ---
  PAN 'ABCDE1234F    ': VALID ✅
  PAN 'abcde1234f    ': VALID ✅
  PAN '12345ABCDE    ': INVALID ❌
  PAN 'TOOLONG12345F ': INVALID ❌
  GST '27AAPFU0939F1ZV ': VALID ✅
  GST '07AAAAA0000A1Z5 ': VALID ✅
  GST 'INVALID_GST_SAMPLE': INVALID ❌

--- Compliance Aadhaar Data Masking ---
  Raw Aadhaar   : 9876 5432 1098
  Masked Output : XXXX-XXXX-1098
  Audit Ref ID  : KYC-3B8A9F1C
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad Implementation | Gold-Standard Implementation |
| :--- | :--- | :--- |
| **Number Formatting** | Using Western thousands commas for Indian rupees | Custom grouping for thousands, lakhs, and crores |
| **Security Masking** | Storing plain raw Aadhaar numbers | Store masked Aadhaar `XXXX-XXXX-1234` for UIDAI compliance |
| **Random IDs** | Using `random.randint()` for financial references | Use `secrets.token_hex()` for tamper-proof reference tokens |
| **Package Exports** | Leaving `__all__` empty in `__init__.py` | Explicitly define `__all__` to govern public API surface |
| **Input Sanitization** | Assuming user won't pass spaces in PAN or Aadhaar | Clean whitespace and normalize case with `.strip().upper()` |

---

## Quick Revision Summary Cheat Sheet

- **Lakhs & Crores Rule:** Rightmost 3 digits group first, then all subsequent numbers group in pairs of 2.
- **PAN Format:** `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` (exactly 10 uppercase characters).
- **Aadhaar Masking:** Keep only the last 4 digits visible for regulatory compliance.
- **Package Architecture:** Submodules handle distinct logic (`currency.py`, `validators.py`); `__init__.py` aggregates them into an intuitive facade.
- **Version Tracking:** Always define `__version__ = "X.Y.Z"` at the package root for dependency tracking.

---

---

# Practice Challenge

### Scenario: Indian Bank IFSC Code Validator & Normalizer

Add an IFSC (Indian Financial System Code) validator to the `indialib` package:
1. Create a function `validate_ifsc(ifsc_code)`:
   - Must consist of exactly 11 characters.
   - The first 4 characters must be uppercase letters (Bank Code).
   - The 5th character must be strictly the number `0` (reserved for future use).
   - The last 6 characters can be letters or numbers (Branch Code).
   - Standard regex: `^[A-Z]{4}0[A-Z0-9]{6}$`.
2. Create a function `normalize_mobile(mobile_str)`:
   - Strips spaces, hyphens, and leading `+91` or `0`.
   - Returns a clean 10-digit mobile number if valid, or `None` if invalid.

### Starter Code
```python
import re

def validate_ifsc(ifsc_code):
    pass

def normalize_mobile(mobile_str):
    pass
```

### Complete Solution
```python
import re

def validate_ifsc(ifsc_code: str) -> bool:
    """
    Validates Indian Financial System Code (IFSC).
    11 characters: 4 letters + '0' + 6 alphanumeric branch characters.
    """
    clean_code = ifsc_code.strip().upper()
    pattern = r"^[A-Z]{4}0[A-Z0-9]{6}$"
    return bool(re.match(pattern, clean_code))

def normalize_mobile(mobile_str: str) -> str:
    """
    Normalizes varied Indian mobile inputs (+91 98765-43210, 09876543210)
    into a canonical 10-digit number.
    """
    # Remove whitespace, dashes, plus signs
    cleaned = re.sub(r"[\s\-\+]", "", mobile_str.strip())
    
    # Strip leading 91 or 0
    if cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    elif cleaned.startswith("0") and len(cleaned) == 11:
        cleaned = cleaned[1:]

    # Must be exactly 10 digits starting with 6, 7, 8, or 9
    if len(cleaned) == 10 and cleaned.isdigit() and cleaned[0] in "6789":
        return cleaned
    return None

# Test the enhancements
sample_ifscs = ["SBIN0001010", "HDFC0000452", "PUNB0123456", "INVALID123", "SBIN1001010"]
print("=== IFSC Code Validation ===")
for ifsc in sample_ifscs:
    print(f"  IFSC '{ifsc:<12}': {'VALID ✅' if validate_ifsc(ifsc) else 'INVALID ❌'}")

sample_phones = ["+91 98765-43210", "09811223344", "9444556677", "1234567890", "+91 8877665544"]
print("\n=== Indian Mobile Normalization ===")
for phone in sample_phones:
    res = normalize_mobile(phone)
    print(f"  Raw: {phone:<18} ➔ Normalized: {res if res else '[INVALID]'}")
```

### Expected Output
```text
=== IFSC Code Validation ===
  IFSC 'SBIN0001010 ': VALID ✅
  IFSC 'HDFC0000452 ': VALID ✅
  IFSC 'PUNB0123456 ': VALID ✅
  IFSC 'INVALID123  ': INVALID ❌
  IFSC 'SBIN1001010 ': INVALID ❌

=== Indian Mobile Normalization ===
  Raw: +91 98765-43210    ➔ Normalized: 9876543210
  Raw: 09811223344        ➔ Normalized: 9811223344
  Raw: 9444556677         ➔ Normalized: 9444556677
  Raw: 1234567890         ➔ Normalized: [INVALID]
  Raw: +91 8877665544     ➔ Normalized: 8877665544
```

---

## Practice Quiz

### 1. In the Indian numbering system, how is the number 1234567.89 correctly formatted?
A. `₹1,234,567.89`
B. `₹12,34,567.89`
C. `₹123,456,7.89`
D. `₹1.234.567,89`
**Answer:** B
**Explanation:** Under the Indian numbering system, the last three digits are grouped together (567), and all preceding digits are grouped in pairs of two (12 and 34), producing `₹12,34,567.89` (12 Lakhs, 34 Thousand, 567).

---

### 2. What is the standard structure of a valid 10-character Indian PAN number?
A. 4 letters, 5 numbers, 1 letter
B. 5 uppercase letters, 4 digits, 1 uppercase letter
C. 10 numeric digits
D. 3 letters, 6 numbers, 1 letter
**Answer:** B
**Explanation:** An Indian PAN card consists of 5 alphabetic characters, followed by 4 numeric characters, ending with 1 alphabetic character (e.g. `ABCDE1234F`).

---

### 3. Why is data masking (e.g. XXXX-XXXX-1098) applied to Aadhaar numbers in software systems?
A. To make the database file size smaller
B. To comply with Indian data protection laws and UIDAI regulations that prohibit storing or displaying unmasked Aadhaar numbers
C. Because Python cannot print 12-digit integers
D. To convert Aadhaar numbers into cryptocurrency
**Answer:** B
**Explanation:** Indian privacy regulations mandate that public-facing and non-banking storage systems must mask the first 8 digits of Aadhaar numbers to prevent identity theft.

---

### 4. What is the role of secrets.token_hex(4).upper() in generating transaction references?
A. It calculates the square root of the transaction amount
B. It generates a cryptographically random, unpredictable 8-character hexadecimal string suitable for transaction audit trails
C. It sorts the database
D. It connects to the bank's WiFi network
**Answer:** B
**Explanation:** `secrets.token_hex(4)` produces 4 random bytes represented as an 8-character hexadecimal string using the OS's secure random number generator, making it unpredictable and unique.

---

### 5. Why should a package's __init__.py explicitly define an __all__ list?
A. To prevent Python from compiling bytecode
B. To define the exact public interface of the package and protect internal helper functions from being exposed during wildcard imports
C. Because Python refuses to run without __all__
D. To make the package compatible only with Windows
**Answer:** B
**Explanation:** `__all__` establishes an explicit boundary between public APIs and private internal implementation details, preventing accidental exposure when users run `from indialib import *`.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Working with Context Managers (with statement)** (4: File Handling Advanced).

👉 **[Continue to Next Lesson: Working with Context Managers (with statement) →](/tutorials/python-for-intermediate/working-with-context-managers-with-statement)**
