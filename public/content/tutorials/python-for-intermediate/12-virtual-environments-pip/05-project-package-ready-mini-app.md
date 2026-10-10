---
id: python-intermediate-project-package-ready-mini-app
slug: project-package-ready-mini-app
course: python-for-intermediate
chapter: "12: Virtual Environments & Pip"
topic: "12.5 Project: Package-Ready Mini App"
title: "Project: Package-Ready Mini App in Python"
description: "Master project: package-ready mini app in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 60
keywords:
  - python project package ready mini app
  - python intermediate
  - python project: package-ready mini app
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Package-Ready Mini App

In this capstone project, we will apply the software packaging and environment concepts covered across this chapter—**Virtual Environments, Pip Management, Dependency Manifests, and PEP 621 Standard Packaging**—to structure, package, and install a professional, distributable **Command-Line Currency Converter Tool**.

---

## 1. Professional Project Directory Layout

A production-ready Python project follows a standardized folder hierarchy that separates application source code, tests, documentation, and configuration files:

```text
currency_converter_app/
 ├── .gitignore                  # Prevents committing .venv and caches
 ├── README.md                   # Project documentation and quickstart
 ├── requirements.txt            # Pinned runtime dependencies
 ├── requirements-dev.txt        # Development dependencies (pytest, black)
 ├── pyproject.toml              # Modern Python packaging configuration (PEP 621)
 ├── currency_converter/         # Core application package
 │    ├── __init__.py            # Package marker & version definition
 │    ├── api_client.py          # Network API interactions
 │    └── cli.py                 # Command-line interface & argument parser
 └── tests/                      # Automated test suite
      └── test_converter.py
```

---

## 2. Defining Dependencies: `requirements.txt` & `.gitignore`

### `.gitignore`
```text
.venv/
venv/
__pycache__/
*.pyc
*.egg-info/
dist/
build/
.pytest_cache/
```

### `requirements.txt`
```text
requests==2.31.0
```

### `requirements-dev.txt`
```text
-r requirements.txt
pytest==8.2.0
flake8==7.0.0
```

---

## 3. Application Source Code

### `currency_converter/__init__.py`
```python
"""Currency Converter Package."""
__version__ = "1.0.0"
```

### `currency_converter/api_client.py`
```python
import requests
from typing import Dict, Optional


class CurrencyAPI:
    """Fetches real-time exchange rates from public API."""
    
    BASE_URL = "https://api.frankfurter.app/latest"

    @classmethod
    def get_rate(cls, base: str, target: str) -> Optional[float]:
        params = {"from": base.upper(), "to": target.upper()}
        try:
            response = requests.get(cls.BASE_URL, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            return data["rates"][target.upper()]
        except (requests.RequestException, KeyError) as err:
            print(f"[API Error] Failed to fetch rate: {err}")
            return None
```

### `currency_converter/cli.py`
```python
import sys
from currency_converter.api_client import CurrencyAPI


def convert(amount: float, base: str, target: str):
    base = base.upper()
    target = target.upper()
    
    print(f"\nFetching live conversion rate from {base} to {target}...")
    rate = CurrencyAPI.get_rate(base, target)
    
    if rate is None:
        print("Conversion failed. Please verify currency codes (e.g. USD, EUR, INR, GBP).")
        return

    converted_amount = amount * rate
    print("=" * 45)
    print(f" {amount:,.2f} {base} = {converted_amount:,.2f} {target}")
    print(f" Exchange Rate: 1 {base} = {rate:.4f} {target}")
    print("=" * 45)


def main():
    if len(sys.argv) != 4:
        print("Usage: currency-convert <amount> <base_currency> <target_currency>")
        print("Example: currency-convert 100 USD INR")
        sys.exit(1)

    try:
        amount = float(sys.argv[1])
    except ValueError:
        print(f"Error: Invalid amount '{sys.argv[1]}'. Must be a numeric value.")
        sys.exit(1)

    base = sys.argv[2]
    target = sys.argv[3]

    convert(amount, base, target)


if __name__ == "__main__":
    main()
```

---

## 4. Modern Packaging Manifest: `pyproject.toml`

The `pyproject.toml` file is the unified standard configuration for Python packaging, replacing legacy `setup.py` scripts:

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "currency-converter-cli"
version = "1.0.0"
authors = [
  { name = "MSK Student Developer", email = "student@mskinstitute.com" },
]
description = "A clean CLI currency converter using real-time open exchange rates"
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "requests>=2.28.0",
]

# Defines command-line executable installed globally into the environment!
[project.scripts]
currency-convert = "currency_converter.cli:main"
```

---

## 5. Installing in Editable Mode (`pip install -e .`)

During development, install your package into your active virtual environment in **Editable Mode** (`-e`). This registers the package and its console scripts while linking directly to your source files, meaning edits to code take effect immediately without re-installing:

```bash
# 1. Activate your virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1

# 2. Install package locally in editable mode
python -m pip install -e .

# 3. The CLI command is now available as a terminal utility!
currency-convert 100 USD INR
```

### Output:
```text
Fetching live conversion rate from USD to INR...
=============================================
 100.00 USD = 8,365.20 INR
 Exchange Rate: 1 USD = 83.6520 INR
=============================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Hardcoding Absolute System Paths
Hardcoding paths like `C:\Users\Sumit\project\data.json` will break as soon as another developer clones your project. Use relative paths derived from `__file__`.

### 2. Missing `.gitignore` File
Always create a clean `.gitignore` including `__pycache__/`, `.venv/`, and `*.pyc` before publishing your project repository.

---

---

## 💻 Try It Yourself: Extension Challenge - Setup Script

### Challenge
Create a basic `setup.py` or `pyproject.toml` configuration that makes your package installable in editable mode using `pip install -e .`.

### Complete Solution
```python
# pyproject.toml
"""
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "msk_utility_tool"
version = "1.0.0"
authors = [{ name="MSK Institute" }]
description = "Production utility package"
dependencies = [
    "requests>=2.31.0",
]
"""
print("Created standard modern pyproject.toml for editable pip install.")
```

---

## Practice Quiz

### 1. What does the `-e` flag stand for in `pip install -e .`?
A. Encrypted
B. Editable (development mode)
C. External
D. Execution
**Answer:** B
**Explanation:** `-e` installs a project in editable mode, allowing code changes to take effect immediately without reinstalling the package.
---

### 2. Which modern configuration file has become the standardized replacement for `setup.py` under PEP 518/621?
A. `config.json`
B. `package.json`
C. `pyproject.toml`
D. `python.ini`
**Answer:** C
**Explanation:** `pyproject.toml` is the standardized declarative configuration file for Python builds, tooling, and package metadata.
---

### 3. In `pyproject.toml`, what does `[project.scripts]` define?
A. Scheduled cron jobs
B. Terminal CLI commands and entry points that map to specific Python functions
C. HTML web templates
D. Unit tests
**Answer:** B
**Explanation:** `[project.scripts]` maps terminal command names (e.g. `currency-convert`) directly to callable functions (e.g. `currency_converter.cli:main`).
---

### 4. Why is having an `__init__.py` file inside the `currency_converter` folder important?
A. It compiles the code to assembly
B. It marks the directory as a Python package, allowing its internal modules to be imported
C. It generates database tables
D. It opens an HTTP server
**Answer:** B
**Explanation:** An `__init__.py` file designates a directory as an importable Python package.
---

### 5. What file should always be included in version control to inform team members of the exact dependency versions required?
A. `app.exe`
B. `.venv/`
C. `requirements.txt`
D. `python.dll`
**Answer:** C
**Explanation:** `requirements.txt` specifies the list of package dependencies and version constraints for reproducing the environment.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Introduction to Matplotlib** (13: Data Visualization Basics).

👉 **[Continue to Next Lesson: Introduction to Matplotlib →](/tutorials/python-for-intermediate/introduction-to-matplotlib)**
