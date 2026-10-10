---
id: python-intermediate-requirements-txt
slug: requirements-txt
course: python-for-intermediate
chapter: "12: Virtual Environments & Pip"
topic: "12.4 Requirements.txt"
title: "Requirements.txt in Python"
description: "Master requirements.txt in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 59
keywords:
  - python requirements txt
  - python intermediate
  - python requirements.txt
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Working with requirements.txt in Python

In professional software development, sharing code requires sharing its exact dependencies. Instead of telling teammates or DevOps engineers to manually install multiple individual libraries, Python projects use a standardized manifest file called **`requirements.txt`**. This file lists all third-party libraries and version constraints needed to run the application reliably.

---

## 1. Exporting Dependencies with `pip freeze`

When your virtual environment is active and you have installed all necessary packages, export the complete list of installed packages and their exact versions using **`pip freeze`**:

```bash
# Exports active environment packages to requirements.txt
python -m pip freeze > requirements.txt
```

### Sample `requirements.txt` Contents:
```text
# Production dependencies
requests==2.31.0
certifi==2024.7.4
urllib3==2.2.2
charset-normalizer==3.3.2
idna==3.7
```

Each line consists of a package name followed by comparison operators and version numbers.

---

## 2. Installing from `requirements.txt`

When cloning a project repository on a new machine or deploying to a cloud server (e.g. AWS, Docker, Heroku), initialize a fresh virtual environment and install all dependencies in a single step using the **`-r`** flag:

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1

# 2. Install all dependencies from the file
python -m pip install -r requirements.txt
```

`pip` reads every line, resolves transitive dependencies, and installs the exact versions specified.

---

## 3. Version Specifiers and Syntax Rules

`requirements.txt` supports flexible version constraint rules defined by PEP 440:

```text
# 1. Exact match (Deterministic / Immutable build)
requests == 2.31.0

# 2. Minimum version
pandas >= 2.0.0

# 3. Version range
django >= 4.2, < 5.0

# 4. Compatible release (Allows bugfixes up to next minor version)
# Equivalent to: >= 1.2.0, == 1.2.*
fastapi ~= 0.110.0

# 5. Direct installation from a Git repository
git+https://github.com/psf/requests.git@v2.31.0
```

---

## 4. Multi-Environment Architecture: Dev vs. Prod

Production containers should not be bloated with testing tools, debuggers, or linters. The standard industry pattern splits requirements into separate files:

### `requirements.txt` (Core Production)
```text
requests==2.31.0
flask==3.0.3
gunicorn==22.0.0
```

### `requirements-dev.txt` (Local Development & CI/CD)
```text
# Include all production requirements first:
-r requirements.txt

# Additional developer tools:
pytest==8.2.0
black==24.4.2
flake8==7.0.0
mypy==1.10.0
```

To configure a local developer environment:
```bash
python -m pip install -r requirements-dev.txt
```

---

## 5. Best Practices Checklist

- [x] **Commit `requirements.txt` to Version Control**: Always commit `requirements.txt` to Git so your entire team uses matching dependencies.
- [x] **Pin Exact Versions in Production**: Use `==` for production builds to prevent unexpected breaking changes when libraries publish new releases.
- [x] **Avoid Stale Global Freezes**: Run `pip freeze` **only** inside a clean, project-specific virtual environment—never in your global Python environment, which contains unrelated system packages.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Running `pip freeze` in Global Environment
Running `pip freeze > requirements.txt` without an active virtual environment dumps every single package installed on your computer into the project requirements file. Always activate your virtual environment first.

### 2. Forgetting to Install with `-r`
Running `pip install requirements.txt` attempts to install a single package named literally "requirements.txt". Always include the flag: `pip install -r requirements.txt`.

---

---

## 💻 Try It Yourself: Generating and Replicating Environments

### Scenario
Generate a production `requirements.txt` file from an active virtual environment, and demonstrate how a team member recreates the exact environment in a single command.

### Complete Solution
```bash
# Developer 1: Freeze active dependencies
python -m pip freeze > requirements.txt

# Inspect generated requirements.txt
cat requirements.txt

# Developer 2: Recreate identical environment in 1 command
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

---

## Practice Quiz

### 1. Which command generates a `requirements.txt` file listing all packages installed in the active environment?
A. `pip export requirements.txt`
B. `pip save > requirements.txt`
C. `pip freeze > requirements.txt`
D. `pip dump requirements.txt`
**Answer:** C
**Explanation:** `pip freeze` outputs installed packages and exact versions in requirement format, which can be redirected (`>`) into `requirements.txt`.
---

### 2. How do you install all packages listed in a `requirements.txt` file?
A. `pip install requirements.txt`
B. `pip install -r requirements.txt`
C. `pip load requirements.txt`
D. `pip read requirements.txt`
**Answer:** B
**Explanation:** The `-r` (or `--requirement`) flag instructs `pip` to read and install dependencies from the specified file.
---

### 3. How does `requirements-dev.txt` typically reference the base `requirements.txt` file?
A. `import requirements.txt`
B. `include requirements.txt`
C. `-r requirements.txt`
D. `@requirements.txt`
**Answer:** C
**Explanation:** The `-r requirements.txt` directive inside a requirements file tells `pip` to include and parse the referenced requirements file recursively.
---

### 4. What does the version constraint `django >= 4.0, < 5.0` specify?
A. Any version of Django greater than or equal to 4.0, but strictly less than 5.0
B. Any version of Django except 4.5
C. Django 4.0 and Django 5.0 simultaneously
D. Only Django 4.0
**Answer:** A
**Explanation:** The comma represents a logical AND, restricting the permissible version to 4.x releases without upgrading to breaking 5.x releases.
---

### 5. Why is running `pip freeze` inside a global Python environment discouraged?
A. It causes Python to crash
B. It captures unrelated packages from other projects and system tools, resulting in a bloated, incorrect manifest
C. It deletes installed packages
D. It cannot write to text files
**Answer:** B
**Explanation:** Running `pip freeze` in the global environment captures every package ever installed on your system. It should always be executed within an isolated project virtual environment.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project: Package-Ready Mini App** (12: Virtual Environments & Pip).

👉 **[Continue to Next Lesson: Project: Package-Ready Mini App →](/tutorials/python-for-intermediate/project-package-ready-mini-app)**
