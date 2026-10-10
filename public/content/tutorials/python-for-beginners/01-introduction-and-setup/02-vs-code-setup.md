---
id: vs-code-setup
slug: vs-code-setup
course: python-for-beginners
chapter: Introduction and Setup
topic: "VS Code Setup for Python: Extensions, Terminal, and Configuration"
difficulty: Beginner
readingTime: 12
order: 2
keywords: ["vs code python setup", "visual studio code python", "python extension", "select python interpreter", "python integrated terminal", "code editor python"]
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---


# 💻 Setting Up VS Code for Python

In the previous topic, we learned **what Python is and where it is used**.

Now it is time to prepare our computer so that we can start writing and running Python programs.

For this course, we will use **Visual Studio Code (VS Code)** as our code editor.

By the end of this lesson, you will be able to:

* Install VS Code
* Install Python
* Add Python support to VS Code
* Select the correct Python interpreter
* Create a Python file
* Write your first program
* Run the program using the VS Code terminal

---

# 🧑‍💻 What is VS Code?

**Visual Studio Code**, commonly called **VS Code**, is a code editor developed by Microsoft.

A code editor is a program where programmers **write and manage their code**.

Think of it like a notebook for programmers.

Instead of writing Python code on paper, we write it inside VS Code.

### Why do we use VS Code?

VS Code provides several useful features:

* ✍️ Write and edit code
* 🎨 Highlight Python syntax
* 💡 Suggest code while you type
* 🐛 Help find and debug errors
* 💻 Open a built-in terminal
* 🧩 Add extensions for additional features

> 💡 **Simple idea:**
> **Python** is the programming language.
> **VS Code** is the place where we write and manage our Python code.

---

# 🐍 Before VS Code: Install Python

Before configuring VS Code, Python itself needs to be installed on your computer.

You can download Python from the official Python website.

**Official Python website:**
https://www.python.org/

### Important during installation

On Windows, you may see an option like:

**Add Python to PATH**

If available, enable this option before starting the installation.

This helps Windows find Python when you run Python commands from the terminal.

> ⚠️ **Beginner Tip:**
> If you forget this option, don't worry. Python can still be configured later.

---

# 💻 Step 1: Install VS Code

Download VS Code from the official website:

https://code.visualstudio.com/

Choose the version for your operating system:

* Windows
* macOS
* Linux

After downloading:

1. Open the installer.
2. Follow the installation instructions.
3. Complete the installation.
4. Open VS Code.

You should now see the VS Code window.

---

# 🧩 Step 2: Install the Python Extension

VS Code can support many programming languages.

To make VS Code work nicely with Python, we need to install the **Python extension from Microsoft**.

### How to install it

1. Open VS Code.
2. Look at the left side of the window.
3. Click the **Extensions** icon.
4. Search for:

```text
Python
```

5. Find the Python extension provided by **Microsoft**.
6. Click **Install**.

After installation, VS Code will have Python-specific features such as:

* Code suggestions
* Python file support
* Debugging
* Running Python programs
* Interpreter selection

> 💡 **Remember:**
> The extension adds Python development features to VS Code.
> It does **not** replace the Python installation itself.

---

# 🧠 Step 3: Select the Python Interpreter

This is one of the most important steps.

Your computer may have more than one Python installation.

VS Code needs to know:

> **"Which Python should I use to run this program?"**

This selected Python installation is called the **Python interpreter**.

### How to select it

1. Open VS Code.
2. Press:

```text
Ctrl + Shift + P
```

This opens the **Command Palette**.

3. Search for:

```text
Python: Select Interpreter
```

4. Select the command.
5. Choose the Python version you installed.

You may see something similar to:

```text
Python 3.12
Python 3.11
Python 3.10
```

Choose the interpreter you want to use for the course.

> 💡 **Easy way to remember:**
>
> **Interpreter = The Python installation VS Code uses to run your code.**

---

# 📁 Step 4: Create a Python Project Folder

Before writing code, it is a good habit to keep your course files organized.

For example, create a folder:

```text
Python-Beginners
```

Inside it, you can create folders such as:

```text
Python-Beginners
│
├── Day-01
├── Day-02
├── Day-03
├── Practice
└── Projects
```

This will help you find your programs easily later.

### Open the folder in VS Code

In VS Code:

1. Click **File**
2. Select **Open Folder**
3. Choose your `Python-Beginners` folder
4. Click **Select Folder**

Now VS Code will treat this folder as your working area.

---

# 📝 Step 5: Create Your First Python File

Let's create our first Python file.

In VS Code:

1. Create a new file.
2. Save it as:

```text
hello.py
```

The `.py` extension tells us that this is a **Python file**.

For example:

```text
hello.py
```

is a Python file.

> 💡 **Remember:**
> `.py` → Python source file

---

# ✍️ Step 6: Write Your First Python Program

Inside `hello.py`, write:

```python
print("Hello, World!")
```

Save the file using:

```text
Ctrl + S
```

Your file should look like this:

```python
print("Hello, World!")
```

---

# ▶️ Step 7: Run Your Python Program

There are different ways to run Python code in VS Code.

For beginners, we will first learn the terminal method.

### Open the VS Code Terminal

Go to:

**View → Terminal**

Or use:

```text
Ctrl + `
```

The ` symbol is called a **backtick** and is usually located near the top-left area of the keyboard.

You should see a terminal appear at the bottom of VS Code.

---

## 🚀 Run the Program

If your file is called:

```text
hello.py
```

type:

```bash
python hello.py
```

Then press **Enter**.

You should see:

```text
Hello, World!
```

🎉 Congratulations!

You have successfully run your first Python program.

---

# 🔄 Understand the Complete Process

The complete process looks like this:

```text
Write Python Code
       ↓
Save the .py File
       ↓
Select Python Interpreter
       ↓
Run the Program
       ↓
Python Executes the Code
       ↓
See the Output
```

This basic workflow will become a regular part of your Python learning.

---

# 🧰 Useful VS Code Features

VS Code has many features that can make programming easier.

You don't need to learn everything right now.

Let's understand the most useful ones.

---

## 💡 Code Suggestions

VS Code can suggest code while you type.

For example, when you start writing certain Python functions or objects, VS Code may show suggestions.

This can help you:

* Write code faster
* Discover available options
* Reduce typing mistakes

---

## 🎨 Syntax Highlighting

VS Code displays different parts of your code using different visual formatting.

For example:

```python
name = "Amit"
age = 20
print(name)
```

This makes code easier to read.

---

## 🐛 Debugging

Sometimes your program does not work as expected.

VS Code provides debugging tools that can help you understand what is happening in your program.

We will learn debugging in more detail later in the course.

---

## 💻 Integrated Terminal

The **integrated terminal** allows you to use command-line tools without leaving VS Code.

For example:

```bash
python hello.py
```

You can run Python programs directly from this terminal.

---

# 🧩 Useful Extensions

VS Code supports thousands of extensions.

However, **don't install many extensions just because they are available**.

Install extensions when you actually need them.

Some useful extensions for Python development include:

### Python

Provides core Python development support from Microsoft.

### Jupyter

Useful when working with Jupyter Notebooks.

### Pylance

Provides advanced Python language features such as smart code completion, type information, and code analysis.

### GitLens

Provides additional features for working with Git and source control.

> 💡 **Beginner Tip:**
> For this course, start with the **Python extension**. We will introduce other extensions when they become useful.

---

# ⚙️ VS Code Customization

VS Code can be customized according to your preferences.

You can change things such as:

* Theme
* Font size
* Editor appearance
* Keyboard shortcuts
* Editor settings

You can open Settings using:

```text
Ctrl + ,
```

However, customization is optional.

> 🎯 **Focus first on learning Python.**
> You can customize your editor later.

---

# ⚠️ Common Beginner Problems

You may face a few common problems while setting up Python.

## Problem 1: `python` is not recognized

If the terminal shows an error when you type:

```bash
python
```

Python may not be installed correctly or Windows may not know where Python is located.

Check your Python installation and PATH configuration.

---

## Problem 2: Wrong Python interpreter

Your program may use a different Python version than expected.

Use:

```text
Ctrl + Shift + P
```

and select:

```text
Python: Select Interpreter
```

Then choose the correct Python installation.

---

## Problem 3: Program does not show your latest changes

Make sure you save your file before running it:

```text
Ctrl + S
```

Then run the program again.

> 💡 **Good habit:**
> **Write → Save → Run → Check Output**

---

# 🧪 Hands-On Practice

Now let's verify that your Python environment is working correctly.

Create a file named:

```text
env_check.py
```

Add the following code:

```python
import sys
import platform
import os

print("=" * 50)
print("PYTHON ENVIRONMENT CHECK")
print("=" * 50)

print("Python Version :", sys.version.split()[0])
print("Operating System:", platform.system())
print("Machine:", platform.machine())
print("Python Location:", sys.executable)
print("Working Folder:", os.getcwd())

print("=" * 50)
print("Your Python environment is working!")
print("=" * 50)
```

Save the file.

Then run:

```bash
python env_check.py
```

---

# 🔍 What Does This Program Do?

Don't worry if you don't understand every line yet.

We will learn these concepts later.

For now, understand the purpose:

| Code                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `sys`               | Gives information about Python              |
| `platform`          | Gives information about the computer        |
| `os`                | Helps work with the operating system        |
| `sys.version`       | Shows the Python version                    |
| `platform.system()` | Shows the operating system                  |
| `sys.executable`    | Shows which Python executable is being used |
| `os.getcwd()`       | Shows the current working folder            |

---

# 📺 Example Output

Your output may look different depending on your computer.

For example:

```text
==================================================
PYTHON ENVIRONMENT CHECK
==================================================
Python Version : 3.12.2
Operating System: Windows
Machine: AMD64
Python Location: C:\Users\Student\AppData\Local\Programs\Python\Python312\python.exe
Working Folder: C:\Users\Student\Python-Beginners
==================================================
Your Python environment is working!
==================================================
```

> ⚠️ **Important:**
> Your Python version, username, computer architecture, and folder location may be different. That is completely normal.

---

# 🎯 Setup Checklist

Before moving to the next lesson, make sure you can check all of these:

* [ ] Python is installed
* [ ] VS Code is installed
* [ ] Python extension is installed
* [ ] Correct Python interpreter is selected
* [ ] A `.py` file can be created
* [ ] VS Code terminal can be opened
* [ ] `hello.py` runs successfully
* [ ] `env_check.py` runs successfully

If all of these are working, your Python development environment is ready.

---

# 🧠 Quick Summary

In this lesson, you learned:

* **VS Code** is a code editor.
* Python must be installed separately.
* The **Python extension** adds Python development features to VS Code.
* The **Python interpreter** is the Python installation used to execute your code.
* Python programs are saved using the `.py` extension.
* VS Code has a built-in terminal.
* You can run a Python program using:

```bash
python filename.py
```

* `Ctrl + Shift + P` opens the Command Palette.
* `Ctrl + S` saves your file.
* `Ctrl + `` opens the integrated terminal.

### ⭐ Most Important Workflow

```text
Python Installed
      ↓
VS Code Installed
      ↓
Python Extension
      ↓
Select Interpreter
      ↓
Create .py File
      ↓
Write Code
      ↓
Save
      ↓
Run
      ↓
Check Output
```

---

## Practice Quiz

### 1. What is VS Code?
A. A database
B. A programming language
C. A code editor
D. An operating system
**Answer:** C A code editor
**Explanation:** VS Code is a code editor developed by Microsoft that can be used to write Python and many other types of code.

---

### 2. Which extension should you install to add Python support to VS Code?
A. Python extension by Microsoft
B. Live Server
C. C# Dev Kit
D. Java Extension Pack
**Answer:** A Python extension by Microsoft
**Explanation:** The Microsoft Python extension provides the main Python development features used in VS Code.

---

### 3. What is a Python interpreter?
A. A database
B. The Python installation used to execute Python code
C. A VS Code theme
D. A file extension
**Answer:** B The Python installation used to execute Python code
**Explanation:** VS Code needs to know which Python installation should be used to run your program.

---

### 4. Which shortcut opens the Command Palette in VS Code on Windows?
A. `Ctrl + S`
B. `Ctrl + Shift + P`
C. `Ctrl + Z`
D. `Alt + F4`
**Answer:** B `Ctrl + Shift + P`
**Explanation:** The Command Palette allows you to search for and run VS Code commands such as `Python: Select Interpreter`.

---

### 5. Which extension should a Python file normally have?
A. `.html`
B. `.css`
C. `.py`
D. `.java`
**Answer:** C `.py`
**Explanation:** Python source files normally use the `.py` extension.

---

### 6. Which command can be used to run `hello.py` from the terminal?
A. `run hello.py`
B. `python hello.py`
C. `execute hello.py`
D. `start-python hello.py`
**Answer:** B `python hello.py`
**Explanation:** The Python command followed by the filename tells Python to execute that program.

---

### 7. What does `Ctrl + S` do in VS Code?
A. Opens the terminal
B. Saves the current file
C. Opens the Command Palette
D. Deletes the file
**Answer:** B Saves the current file
**Explanation:** Saving your file before running it helps ensure that Python executes your latest changes.
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Python Setup** (1: Introduction and Setup).

👉 **[Continue to Next Lesson: Python Setup →](/tutorials/python-for-beginners/python-setup)**
