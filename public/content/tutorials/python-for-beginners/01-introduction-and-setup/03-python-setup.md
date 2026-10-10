---
id: python-setup
slug: python-setup
course: python-for-beginners
chapter: Introduction and Setup
topic: "Python Setup & Installation: PATH, Virtual Environments, and Verification"
difficulty: Beginner
readingTime: 12
order: 3
keywords: ["python setup", "install python", "add python to path", "python repl", "pip package manager", "python virtual environments", "python venv"]
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---

# 🐍 Python Setup & Installation

In the previous lesson, we installed **VS Code** and learned how to run a Python program.

Now let's make sure Python is properly installed and understand a few important tools that you will use throughout this course.

In this lesson, we will learn:

* How Python is installed
* What **PATH** means
* How to check whether Python is working
* What the **Python REPL** is
* What **pip** is
* What a **virtual environment** is
* How to create a `.venv`
* How to verify your Python setup

Don't worry if these terms sound new.

We will understand each one step by step.

---

# 🏠 First, Understand the Big Picture

Think about Python like a tool that you want to use from anywhere on your computer.

Installing Python puts the tool on your computer.

But your computer also needs to know **where that tool is located**.

This is where **PATH** becomes useful.

The basic idea is:

```text
Install Python
      ↓
Computer knows where Python is
      ↓
Terminal can find Python
      ↓
You can run Python commands
```

---

# 📍 What is PATH?

**PATH** is an environment variable used by your operating system.

It contains a list of folders where the operating system looks for executable programs.

You don't need to remember the technical definition.

Think of PATH as a **list of addresses**.

### 🏠 Real-life example

Imagine you want to visit your friend's house.

You know your friend's name, but you also need to know their address.

Similarly:

```text
Program Name → python
Location     → Python installation folder
```

PATH helps your computer find that location.

So when you type:

```bash
python
```

your operating system can look through the locations listed in PATH and find Python.

---

# 🪟 Add Python to PATH on Windows

During Python installation on Windows, you may see an option such as:

```text
☑ Add python.exe to PATH
```

If you see this option, it is a good idea to enable it before installing Python.

This makes it easier to use Python from Command Prompt or PowerShell.

> 💡 **Remember:**
> PATH helps your computer find Python when you type `python` in the terminal.

---

# 🔍 How to Check if Python is Installed

After installing Python, open:

* Command Prompt
* PowerShell
* VS Code Terminal
* Terminal on macOS/Linux

Then type:

```bash
python --version
```

You may see something like:

```text
Python 3.12.2
```

Your version may be different.

That's completely normal.

### What does this command mean?

```text
python
```

means we want to use Python.

```text
--version
```

means we want to know which Python version is installed.

So:

```bash
python --version
```

simply means:

> **"Python, tell me your version."**

---

# ⚠️ If Python Is Not Found

Sometimes you may type:

```bash
python --version
```

and receive an error such as:

```text
'python' is not recognized...
```

Don't panic.

This usually means one of these things:

1. Python is not installed.
2. Python is installed but is not available through PATH.
3. Your terminal needs to be restarted after installation.
4. Your system is using a different Python command.

We will learn how to troubleshoot these situations during the setup process.

> 💡 **Beginner Tip:**
> If you have just installed Python, close and reopen VS Code or your terminal before testing again.

---

# 📦 What is pip?

When you install Python, you get the Python language and tools needed to run Python programs.

But sometimes your project needs additional libraries.

For example, you may want to work with:

* Data
* Excel files
* Websites
* Machine learning
* Images
* APIs

Instead of writing everything from scratch, Python developers often use **packages**.

`pip` is a commonly used tool for **installing and managing Python packages**.

For example:

```bash
python -m pip install requests
```

This command tells Python to use pip to install the `requests` package.

We will learn package installation in more detail later.

---

# 🌐 What is PyPI?

Python packages are commonly published through **PyPI**.

PyPI stands for:

**Python Package Index**

Think of PyPI as a large online collection of Python packages.

A simple way to remember it:

```text
PyPI
 ↓
Collection of Python Packages
 ↓
pip
 ↓
Install Package
 ↓
Your Python Project
```

> 💡 **Easy Example:**
> Think of PyPI as an **app store for Python packages**, and `pip` as one of the tools you use to get those packages.

---

# 🧪 What is the Python REPL?

REPL stands for:

**Read → Eval → Print → Loop**

The name may sound difficult, but the idea is very simple.

The Python REPL lets you type a Python instruction and immediately see the result.

It's like a **Python playground**.

---

## ▶️ Start the Python REPL

Open your terminal and type:

```bash
python
```

You may see something similar to:

```text
Python 3.12.2
>>>
```

The:

```text
>>>
```

symbol means Python is ready for your instruction.

Now try:

```python
2 + 3
```

Python will immediately show:

```text
5
```

Try another example:

```python
name = "Amit"
print(name)
```

Output:

```text
Amit
```

---

# 🎯 Why is REPL Useful?

REPL is useful when you want to quickly test something.

For example:

```python
10 * 5
```

Output:

```text
50
```

You don't need to create a `.py` file just to test a small calculation.

### Think of it like this:

```text
Python File
→ For building complete programs

Python REPL
→ For quickly testing small pieces of code
```

---

# 🚪 How to Exit the Python REPL

To leave the Python REPL, you can type:

```python
exit()
```

and press Enter.

You can also use:

```python
quit()
```

On Windows, another option is:

```text
Ctrl + Z
```

followed by Enter.

On macOS/Linux:

```text
Ctrl + D
```

> 💡 **For beginners, simply remember `exit()`**. It is the easiest option.

---

# 📦 What is a Python Package?

A **package** is a collection of Python code that provides functionality you can use in your own project.

For example, instead of creating every tool yourself, you can use an existing package.

Imagine you are building a house.

You don't manufacture every:

* Screw
* Door handle
* Window
* Light switch

yourself.

You use ready-made components.

Python packages work in a similar way.

```text
Your Project
     ↓
Python Packages
     ↓
Ready-made Functionality
     ↓
Build Your Application Faster
```

---

# 🧰 What is a Virtual Environment?

A **virtual environment** is a separate environment for a Python project.

It allows a project to have its own installed packages instead of depending entirely on packages installed globally on the computer.

### Real-life example

Imagine you have two projects:

```text
Project A
Needs Package Version A

Project B
Needs Package Version B
```

If everything is installed globally, different projects can sometimes require different package versions.

A virtual environment helps keep their dependencies separate.

```text
Computer
│
├── Project A
│   └── .venv
│       └── Project A packages
│
└── Project B
    └── .venv
        └── Project B packages
```

> 💡 **Simple definition:**
> **Virtual environment = A separate Python workspace for a project.**

---

# 🛠️ Creating a Virtual Environment

Let's create one.

Open your terminal inside your project folder.

Run:

```bash
python -m venv .venv
```

This creates a folder named:

```text
.venv
```

inside your project.

Your project may now look like:

```text
Python-Beginners
│
├── hello.py
└── .venv
```

---

# ▶️ Activating the Virtual Environment

The command depends on your operating system.

### Windows

```bash
.venv\Scripts\activate
```

### macOS/Linux

```bash
source .venv/bin/activate
```

After activation, you may see something like:

```text
(.venv)
```

at the beginning of your terminal prompt.

For example:

```text
(.venv) C:\Python-Beginners>
```

This tells you that the virtual environment is active.

---

# 🛑 Deactivating the Virtual Environment

When you are finished working with the virtual environment, you can deactivate it by typing:

```bash
deactivate
```

The `(.venv)` label should disappear from the terminal prompt.

---

# 🤔 Do Beginners Need Virtual Environments?

You may be thinking:

> "Do I need to use `.venv` for every small Python program?"

Not necessarily.

For very simple practice programs, you can learn Python without creating a virtual environment every time.

However, when you start working on **real projects and installing packages**, virtual environments are a very useful habit.

> 🎯 **Course Recommendation:**
> As your projects become larger, we will use virtual environments to keep project dependencies organized.

---

# ✅ Python Setup Checklist

Let's make sure everything is working.

### Step 1 — Check Python

```bash
python --version
```

You should see a Python version.

### Step 2 — Check pip

```bash
python -m pip --version
```

You should see information about pip.

### Step 3 — Start Python

```bash
python
```

You should see:

```text
>>>
```

### Step 4 — Test Python

Try:

```python
print("Python is working!")
```

Expected result:

```text
Python is working!
```

### Step 5 — Exit Python

```python
exit()
```

### Step 6 — Create a Virtual Environment

Inside your project folder:

```bash
python -m venv .venv
```

---

# 📋 Python Setup Cheat Sheet

Keep this small cheat sheet for revision.

| Task                       | Command                     |
| -------------------------- | --------------------------- |
| Check Python version       | `python --version`          |
| Check pip                  | `python -m pip --version`   |
| Start Python REPL          | `python`                    |
| Exit REPL                  | `exit()`                    |
| Create virtual environment | `python -m venv .venv`      |
| Activate on Windows        | `.venv\Scripts\activate`    |
| Activate on macOS/Linux    | `source .venv/bin/activate` |
| Deactivate                 | `deactivate`                |

---

# ⚠️ Common Beginner Mistakes

## Mistake 1: Forgetting PATH

If Python is installed but:

```bash
python --version
```

doesn't work, check your Python installation and PATH configuration.

---

## Mistake 2: Confusing Python with pip

Remember:

```text
Python
→ Runs Python programs

pip
→ Installs and manages Python packages
```

---

## Mistake 3: Installing Everything Globally

Installing packages globally for every project can create dependency conflicts.

For larger projects, prefer a virtual environment.

---

## Mistake 4: Forgetting to Activate `.venv`

If you created a virtual environment but don't activate it, your terminal may continue using the system Python environment.

Check whether:

```text
(.venv)
```

appears in your terminal.

---

## Mistake 5: Thinking Your Version Must Match the Teacher's Version

Your instructor might show:

```text
Python 3.12.2
```

while your computer shows:

```text
Python 3.12.8
```

That does not automatically mean something is wrong.

Different patch versions can exist.

---

# 🧠 Quick Summary

Let's review what we learned.

### PATH

PATH helps your operating system find programs such as Python when you type their commands in the terminal.

### Python Version

Use:

```bash
python --version
```

to check your Python version.

### pip

`pip` is commonly used to install and manage Python packages.

### PyPI

PyPI is the Python Package Index, where many Python packages are published.

### REPL

REPL is an interactive Python environment where you can test Python instructions immediately.

Start it with:

```bash
python
```

### Virtual Environment

A virtual environment provides a separate workspace for a project's Python packages.

Create one with:

```bash
python -m venv .venv
```

---

# 🎯 Remember These 5 Things

If you remember only five things from this lesson, remember these:

```text
1. PATH helps the computer find Python.

2. python --version checks your Python version.

3. pip helps install Python packages.

4. REPL lets you test Python code quickly.

5. .venv keeps project dependencies separated.
```

---

## Practice Quiz

### 1. What is the main purpose of the PATH environment variable?
A. To store Python programs
B. To help the operating system find executable programs
C. To increase internet speed
D. To create Python variables
**Answer:** B To help the operating system find executable programs
**Explanation:** PATH contains locations that the operating system can search when you run a command such as `python`.

---

### 2. Which command checks the installed Python version?
A. `python check`
B. `python --version`
C. `python install`
D. `python version()`
**Answer:** B `python --version`
**Explanation:** This command displays the Python version available through the current command.

---

### 3. What does REPL stand for?
A. Read-Eval-Print Loop
B. Run-Execute-Python-List
C. Read-Python-Execute-Launch
D. Runtime-Execution-Programming-Language
**Answer:** A Read-Eval-Print Loop
**Explanation:** REPL is an interactive environment that reads your input, evaluates it, displays the result, and waits for the next instruction.

---

### 4. Which command starts the Python REPL?
A. `python start`
B. `python repl`
C. `python`
D. `start python`
**Answer:** C `python`
**Explanation:** Running `python` without a filename usually starts the interactive Python shell.

---

### 5. What is pip mainly used for?
A. Creating folders
B. Installing and managing Python packages
C. Editing Python code
D. Starting VS Code
**Answer:** B Installing and managing Python packages
**Explanation:** pip is commonly used to install packages from package repositories such as PyPI.

---

### 6. What is the main purpose of a virtual environment?
A. To make the computer faster
B. To isolate a project's Python packages and dependencies
C. To hide Python code
D. To replace the operating system
**Answer:** B To isolate a project's Python packages and dependencies
**Explanation:** Virtual environments help different projects maintain separate package environments.

---

### 7. Which command creates a virtual environment named `.venv`?
A. `python create .venv`
B. `python -m venv .venv`
C. `pip make .venv`
D. `venv create python`
**Answer:** B `python -m venv .venv`
**Explanation:** This command uses Python's built-in `venv` module to create a virtual environment.

---

### 8. How do you deactivate an active virtual environment?
A. `exit()`
B. `stop venv`
C. `deactivate`
D. `python stop`
**Answer:** C `deactivate`
## **Explanation:** The `deactivate` command returns your terminal to the normal Python environment.


# 🧪 Practice Challenge

Now complete these steps yourself.

### Task 1

Check your Python version:

```bash
python --version
```

### Task 2

Check pip:

```bash
python -m pip --version
```

### Task 3

Start the Python REPL:

```bash
python
```

Then calculate:

```python
25 * 4
```

Expected result:

```text
100
```

### Task 4

Create a virtual environment:

```bash
python -m venv .venv
```

### Task 5

Activate it.

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### Task 6

Check whether `(.venv)` appears in your terminal.

### Task 7

Deactivate it:

```bash
deactivate
```

🎉 **If you completed all seven tasks, your Python environment is ready for the next stage of the course.**
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Syntax & Code Structure** (1: Introduction and Setup).

👉 **[Continue to Next Lesson: Syntax & Code Structure →](/tutorials/python-for-beginners/syntax-code-structure)**
