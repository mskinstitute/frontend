---
id: python-creating-and-importing-modules
slug: creating-and-importing-modules
course: python-for-intermediate
chapter: "3: Modules and Packages"
topic: "3.1 Creating and Importing Modules"
title: "Creating and Importing Modules in Python"
description: "Master Python module creation, the sys.path search hierarchy, sys.modules import caching, circular import prevention, and namespace management."
difficulty: Intermediate
readingTime: 14
order: 11
keywords:
  - modules
  - import statement
  - sys.path
  - sys.modules
  - circular imports
  - namespace pollution
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Creating and Importing Modules in Python

As software projects expand beyond simple single-file scripts, keeping thousands of lines of code in one file becomes unmaintainable. Modular programming is the software engineering discipline of decomposing a large system into self-contained, decoupled, reusable units.

In Python, every `.py` file is inherently a **Module**. In this lesson, you will master how Python discovers modules via `sys.path`, how the interpreter caches imported modules in `sys.modules`, how to structure clean imports, and how to avoid the dangerous trap of circular dependencies.

---

## Real-World Analogy: The AIIMS Multi-Specialty Hospital

Imagine the All India Institute of Medical Sciences (AIIMS) in New Delhi:

```
+-------------------------------------------------------------------------+
|                  AIIMS HOSPITAL MODULAR WING ANALOGY                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  Monolithic Mess (Single File):                                         |
|  ──> Cardiology, Pharmacy, Pathology, and Surgery all stuffed into one  |
|      cramped room. Total chaos, overlapping equipment, zero isolation.  |
|                                                                         |
|  Modular Architecture (Python Modules):                                 |
|  ──> cardiology.py   : Specialized heart diagnostic algorithms          |
|  ──> pathology.py    : Blood report analyzers & test thresholds         |
|  ──> pharmacy.py     : Medicine inventory & dosage calculations         |
|                                                                         |
|  Central Reception (main.py):                                           |
|  ──> from pathology import run_blood_panel                              |
|  ──> Directly accesses needed tools without cluttering other departments|
|                                                                         |
+-------------------------------------------------------------------------+
```

Each medical wing focuses strictly on its own domain, exposing only necessary services to the rest of the hospital.

---

## How Python Finds Modules: The `sys.path` Search Hierarchy

When you write `import my_module`, Python does not scan your entire hard drive. Instead, it systematically searches directories in the exact sequence specified by `sys.path`:

```
+-------------------------------------------------------------------------+
|                       PYTHON'S sys.path SEARCH ORDER                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. Current Script Directory  ──> Folder containing the running .py file|
|               │                                                         |
|               ▼                                                         |
|  2. PYTHONPATH Envar          ──> Directories added to your environment |
|               │                                                         |
|               ▼                                                         |
|  3. Standard Library Paths    ──> Built-in modules (math, os, sys, json)|
|               │                                                         |
|               ▼                                                         |
|  4. Site-Packages Directory   ──> Third-party pip libraries             |
|                                                                         |
|  If not found anywhere ───────> ModuleNotFoundError: No module named... |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## The Import Cache: `sys.modules`

A critical architectural concept in Python: **A module's top-level code executes exactly ONCE upon the first import.**

Subsequent imports in other files do not re-execute the module. Instead, Python caches the compiled module object in the dictionary `sys.modules`. Future `import` statements simply look up the existing object in memory in $O(1)$ time.

---

## Import Syntax Patterns: The Good, the Better, and the Dangerous

| Syntax Pattern | Code Example | Namespace Impact | Recommendation |
| :--- | :--- | :--- | :--- |
| **Module Alias** | `import math as m` | Keeps namespace clean; accessed via `m.sqrt()` | **Gold Standard** for libraries (e.g. `import numpy as np`) |
| **Specific Import** | `from math import sqrt, pi` | Only `sqrt` and `pi` enter current namespace | **Gold Standard** for specific functions |
| **Full Module** | `import math` | `math.sqrt()` required; crystal clear origin | **Gold Standard** for clarity |
| **Wildcard Import** | `from math import *` | Dumps everything into namespace; hides origins | ❌ **Anti-Pattern (Forbidden in production)** |

---

## Comprehensive Code Examples

### 1. Creating a Reusable Indian Financial Mathematics Module

Imagine creating a module named `finance_utils.py`:

```python
# =============================================================
# FILE: finance_utils.py (Our Custom Module)
# =============================================================
"""
MSK Indian Financial Calculations Utility
Provides GST, EMI, and Fixed Deposit Return formulas.
"""

GST_STANDARD_RATE = 0.18

def calculate_gst(base_amount, slab_rate=GST_STANDARD_RATE):
    """Calculates tax and gross total for an invoice."""
    tax = round(base_amount * slab_rate, 2)
    gross = round(base_amount + tax, 2)
    return {"base": base_amount, "tax": tax, "gross": gross}

def calculate_sip_future_value(monthly_investment, annual_rate, years):
    """Calculates approximate maturity value for a Monthly Mutual Fund SIP."""
    months = years * 12
    monthly_rate = (annual_rate / 100.0) / 12.0
    # Future Value formula for SIP: P * [((1 + r)^n - 1) / r] * (1 + r)
    fv = monthly_investment * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
    return round(fv, 2)
```

Now, import and use this module inside your main application script:

```python
# =============================================================
# FILE: main_app.py
# =============================================================
# Selective import of specific functions
from finance_utils import calculate_gst, calculate_sip_future_value

print("=== 1. Business GST Invoice Calculation ===")
invoice = calculate_gst(45000.0)
print(f"Base: ₹{invoice['base']:,} | Tax (18%): ₹{invoice['tax']:,} | Total: ₹{invoice['gross']:,}")

print("\n=== 2. Wealth Growth SIP Calculator ===")
# SIP of ₹10,000/month at 12% annual return for 15 years
sip_corpus = calculate_sip_future_value(10000, 12.0, 15)
invested_capital = 10000 * 15 * 12
print(f"Total Invested : ₹{invested_capital:,}")
print(f"Maturity Value : ₹{sip_corpus:,.2f}")
print(f"Wealth Created : ₹{sip_corpus - invested_capital:,.2f}")
```

**Expected Output:**
```text
=== 1. Business GST Invoice Calculation ===
Base: ₹45,000.0 | Tax (18%): ₹8,100.0 | Total: ₹53,100.0

=== 2. Wealth Growth SIP Calculator ===
Total Invested : ₹1,800,000
Maturity Value : ₹5,045,760.00
Wealth Created : ₹3,245,760.00
```

---

### 2. Inspecting `sys.path` and `sys.modules`

```python
import sys

print(f"Number of loaded modules in memory: {len(sys.modules)}")

# Verify if our module is cached in sys.modules
import json
print("Is 'json' cached in sys.modules?", "json" in sys.modules)

# Inspect the top 3 directories in the search path
print("\nFirst 3 sys.path directories:")
for idx, search_dir in enumerate(sys.path[:3], start=1):
    print(f"  {idx}. {search_dir}")
```

**Expected Output:**
```text
Number of loaded modules in memory: 84
Is 'json' cached in sys.modules? True

First 3 sys.path directories:
  1. D:\Sumit\MSK-Institute-Website
  2. C:\Python312\python312.zip
  3. C:\Python312\DLLs
```

---

### 3. Circular Imports and How to Resolve Them

A **Circular Import** occurs when Module A imports Module B, and Module B imports Module A:

```
[module_a.py] ──imports──> [module_b.py]
      ▲                          │
      └─────────imports──────────┘
```

When Python encounters this, Module B tries to access an attribute in Module A before Module A has finished compiling, raising:
`ImportError: cannot import name 'xyz' from partially initialized module`

#### How to Solve Circular Imports:
1. **Refactor Shared Code (Recommended):** Extract shared variables or functions into a third module `common.py` or `models.py`.
2. **Move Import Inside Function (Deferred Import):** Import inside the function body where it is used, rather than at the top of the file.

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Dangerous Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Wildcard Imports** | `from math import *` (Pollutes namespace) | `import math` or `from math import sqrt` |
| **Module Naming** | Naming your file `email.py` or `math.py` (Shadows stdlib!) | Use distinct project names like `email_service.py` |
| **Import Ordering** | Scattering imports randomly across file | Standard library first, 3rd-party second, local last (PEP 8) |
| **Dynamic sys.path** | Appending random absolute hardcoded paths | Use relative imports or standard package installation |
| **Heavy Top-Level** | Running database connections at module top-level | Put initialization inside setup functions |

---

## Quick Revision Summary Cheat Sheet

- **Module Definition:** Any single `.py` file is a module; its filename (without `.py`) is the module name.
- **Search Order:** Script directory $\to$ `PYTHONPATH` $\to$ Standard Library $\to$ `site-packages`.
- **Cache Registry:** Modules are stored in `sys.modules` and executed once upon initial import.
- **PEP 8 Import Grouping:**
  1. Standard library imports (`import os, sys`)
  2. Related third-party imports (`import requests`)
  3. Local application/library imports (`from my_pkg import utils`)
- **Shadowing Danger:** Never name local files after standard library modules (`random.py`, `test.py`, `json.py`).

---

---

# Practice Challenge

### Scenario: Indian Retail Currency & Fuel Surcharge Converter Module

Build a modular utility that cleanly separates business calculations:
1. Create a simulated module file structure in code:
   - Function `convert_usd_to_inr(usd_amount, exchange_rate=83.50)`
   - Function `apply_fuel_surcharge(base_inr, surcharge_pct=3.5)`
   - Function `generate_shipping_invoice(item_name, usd_price)`
2. The `generate_shipping_invoice` function must import and use the mathematical converter functions to output a detailed settlement dictionary.
3. Validate that `sys.modules` successfully registers and caches the modules.

### Starter Code
```python
# Build a modular financial calculator
def convert_usd_to_inr(usd_amount, exchange_rate=83.50):
    pass

def apply_fuel_surcharge(base_inr, surcharge_pct=3.5):
    pass

def generate_shipping_invoice(item_name, usd_price):
    pass
```

### Complete Solution
```python
# Module functions
def convert_usd_to_inr(usd_amount, exchange_rate=83.50):
    """Converts USD base price to Indian Rupees."""
    return round(usd_amount * exchange_rate, 2)

def apply_fuel_surcharge(base_inr, surcharge_pct=3.5):
    """Calculates additional air cargo logistics fuel surcharge."""
    surcharge = round(base_inr * (surcharge_pct / 100.0), 2)
    return surcharge

def generate_shipping_invoice(item_name, usd_price):
    """Integrates currency conversion and logistics surcharges."""
    base_inr = convert_usd_to_inr(usd_price)
    surcharge = apply_fuel_surcharge(base_inr)
    total_payable = base_inr + surcharge

    return {
        "item": item_name,
        "usd_price": f"${usd_price:.2f}",
        "base_inr": f"₹{base_inr:,.2f}",
        "fuel_surcharge": f"₹{surcharge:,.2f}",
        "total_payable": f"₹{total_payable:,.2f}"
    }

# Execute client code
sample_shipment = generate_shipping_invoice("Industrial Servo Motor", 450.0)

print("=== Logistics Air Cargo Invoice Summary ===")
for k, v in sample_shipment.items():
    print(f"  {k:<16}: {v}")
```

### Expected Output
```text
=== Logistics Air Cargo Invoice Summary ===
  item            : Industrial Servo Motor
  usd_price       : $450.00
  base_inr        : ₹37,575.00
  fuel_surcharge  : ₹1,315.12
  total_payable   : ₹38,890.12
```

---

## Practice Quiz

### 1. What does the sys.modules dictionary in Python represent?
A. A list of all files on your computer
B. An in-memory cache mapping module names to previously loaded module objects, ensuring each module executes only once
C. A list of all syntax errors encountered
D. The system password table
**Answer:** B
**Explanation:** Python caches all imported modules in `sys.modules`. When an import statement executes, Python first checks `sys.modules`; if found, it reuses the existing module object without re-executing its code.

---

### 2. Why is from module import * considered an anti-pattern in professional Python development?
A. It causes Python to run in 32-bit mode
B. It pollutes the local namespace with unknown variables, obscures the origin of functions, and can silently overwrite existing names
C. It deletes the source file
D. It only imports integers
**Answer:** B
**Explanation:** Wildcard imports (`from module import *`) import all public symbols into the current namespace. This makes code difficult to debug, breaks automated linters, and risks accidental variable overwrites (name shadowing).

---

### 3. What happens if you name your local script math.py and run import math?
A. Python deletes the standard library
B. Python imports your local math.py instead of the built-in C math module because the current directory comes first in sys.path
C. The computer crashes
D. Python renames your file automatically
**Answer:** B
**Explanation:** Because the current script directory is the first entry in `sys.path`, local files take precedence over standard library modules. This is called **module shadowing** and causes `AttributeError: module 'math' has no attribute 'sqrt'`.

---

### 4. What is the root cause of ImportError: cannot import name ... from partially initialized module?
A. Hard drive is full
B. A circular import where two modules depend on each other at module-load time before either has finished initializing
C. Outdated pip version
D. Missing semicolons
**Answer:** B
**Explanation:** A circular import causes Python to load a module that has not yet finished executing its top-level definitions, resulting in a partially initialized module error.

---

### 5. According to PEP 8 standards, in what order should imports be grouped at the top of a Python file?
A. Local imports first, standard library last
B. Standard library imports $\to$ Third-party imports $\to$ Local project imports (separated by blank lines)
C. Alphabetical order regardless of origin
D. In the exact order the functions are called
**Answer:** B
**Explanation:** PEP 8 prescribes three distinct import sections separated by single blank lines: (1) Standard library, (2) Related third-party libraries, and (3) Local application-specific imports.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Using __name__ == '__main__'** (3: Modules and Packages).

👉 **[Continue to Next Lesson: Using __name__ == '__main__' →](/tutorials/python-for-intermediate/using-name-main)**
