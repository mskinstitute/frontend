---
id: reading-writing-files
slug: reading-writing-files
course: python-for-beginners
chapter: 15
topic: 15.2
title: "Reading and Writing Text Files in Python: write(), writelines(), and Stream Iteration"
description: "Master reading and writing text files in Python. Learn string writing with .write(), batch line writing with .writelines(), line-by-line file iteration, and newlines."
difficulty: Beginner
readingTime: 12
order: 79
keywords:
  - python write to file
  - python writelines
  - read file python
  - line by line file iteration
  - newline character file write
  - memory efficient file reading
lastUpdated: 2026-09-30
author: Antigravity Team
version: 1.1.0
---

# Reading and Writing Text Files in Python: `write()`, `writelines()`, & Stream Iteration

File I/O bridges the volatile memory of your Python script with permanent disk storage. Once a file is opened in `'w'`, `'a'`, or `'r'` mode, Python provides a suite of methods to transfer text data into and out of files.

However, writing to files differs from printing to the console screen in subtle ways: while `print()` automatically appends a newline character (`\n`) at the end of every call, **file writing methods do not**. You must manage newlines, line breaks, and stream iteration explicitly.

---

## Real-World Analogy: The Fountain Pen Ledger & The Index Card Batch

```
+-------------------------------------------------------------------------------+
|                    READING & WRITING REAL-WORLD ANALOGIES                     |
+-------------------------------------------------------------------------------+

  1. THE COURT STENOGRAPHER'S FOUNTAIN PEN (`.write()`):
     - The stenographer writes words on a continuous parchment roll.
     - When you write "Item 1", the pen does NOT jump to the next line
       by magic—the stenographer must explicitly pull the carriage return lever
       (`\n`) to begin a new line.
     - You can write strings of any length; the method reports the exact count
       of characters pressed into the page.

  2. THE ARCHIVAL INDEX CARD BUNDLE (`.writelines()`):
     - A postal clerk holds a rubber-banded stack of 10 pre-printed cards.
     - `.writelines()` pastes all 10 cards onto the manifest page in one stroke.
     - Crucial Note: If each card did not already have a newline stamped on its
       bottom edge, they all stick together in one continuous unbroken sentence!

  3. THE LINE-BY-LINE MAGNIFYING GLASS (`for line in file:`):
     - Reading a 500-page property deed one line at a time.
     - You only look at 1 line in memory at any millisecond, keeping your desk
       clean even if the book weighs 10 kilograms.
+-------------------------------------------------------------------------------+
```

---

## Visual Architecture: File Pointer Mechanics

```
================================================================================
                    FILE STREAM POINTER TRAVERSAL
================================================================================

  Initial State: open("data.txt", "w")
  [File Pointer @ Byte 0]
             |
             v
  f.write("Aarav\n")    --> Writes 6 characters ("A", "a", "r", "a", "v", "\n")
  [File Pointer advances to Byte 6]
             |
             v
  f.write("Pooja\n")    --> Writes 6 characters ("P", "o", "o", "j", "a", "\n")
  [File Pointer advances to Byte 12]

  READING BACK: open("data.txt", "r")
  [Read Pointer @ Byte 0]
             |
             v
  Reads "Aarav\n" ----> Next iteration reads "Pooja\n" ----> EOF (Halts)
================================================================================
```

---

## 1. Writing Text to Files: `.write()`

The `.write(string)` method writes a string to the open file and returns the integer number of characters written:

```python
# ==========================================================
# Example 1: The .write() Method and Explicit Newlines
# ==========================================================

f = open("election_booth.txt", "w", encoding="utf-8")

# Note: Explicit '\n' is MANDATORY to separate lines!
chars_1 = f.write("Constituency: New Delhi Central (AC-40)\n")
chars_2 = f.write("Total Registered Voters: 145000\n")
chars_3 = f.write("EVM Status: Operational\n")

f.close()

print(f"File created successfully. Total characters written: {chars_1 + chars_2 + chars_3}")
```

> [!CAUTION]
> **Data Type Requirement:** `.write()` strictly accepts **strings (`str`)**. Passing an integer, float, or list (e.g. `f.write(450)`) raises an immediate `TypeError: write() argument must be str, not int`. Always cast non-strings using `str()` or f-strings: `f.write(f"{amount}\n")`.

---

## 2. Writing Multiple Lines: `.writelines()`

The `.writelines(iterable)` method takes an iterable of strings (such as a list of strings) and writes them to the file in sequence:

```python
# ==========================================================
# Example 2: Batch Writing with .writelines()
# ==========================================================

candidate_manifest = [
    "Candidate 1: Rajesh Kumar (Independent)\n",
    "Candidate 2: Priya Sen (Janata Party)\n",
    "Candidate 3: Vikramaditya Singh (National Congress)\n"
]

f = open("candidates_list.txt", "w", encoding="utf-8")
f.writelines(candidate_manifest)  # Writes all list elements efficiently
f.close()

print("Candidate list flushed to disk via .writelines().")
```

> [!WARNING]
> **No Automatic Newlines:** Despite its name, `.writelines()` does **NOT** insert newline characters between items! If the strings in your list do not end with `\n`, they will be concatenated into one giant single line.

---

## 3. Reading Files: The Three Main Approaches

Python provides three distinct techniques to read data from a text file:

```
+---------------------------+-----------------------------------+-------------------------------------+
| METHOD                    | HOW IT WORKS                      | MEMORY PROFILE                      |
+---------------------------+-----------------------------------+-------------------------------------+
| `f.read()`                | Reads the ENTIRE file as one str  | Loads entire file into RAM. Risky   |
|                           | into memory.                      | for large files (> 1 GB).           |
+---------------------------+-----------------------------------+-------------------------------------+
| `f.readlines()`           | Reads entire file into a list of  | Loads entire list into RAM.         |
|                           | string lines: `['L1\n', 'L2\n']`. | Retains trailing newlines.          |
+---------------------------+-----------------------------------+-------------------------------------+
| `for line in f:`          | Streams one line at a time        | EXTREMELY EFFICIENT! Uses O(1)      |
| (Stream Iteration)        | lazily on demand.                 | RAM even for a 50 GB log file!      |
+---------------------------+-----------------------------------+-------------------------------------+
```

### Approach 1: Stream Iteration (The Gold Standard)
Iterating directly over the file object is the most memory-efficient and Pythonic way to read text files:

```python
# ==========================================================
# Example 3: Memory-Efficient Stream Iteration
# ==========================================================

f = open("candidates_list.txt", "r", encoding="utf-8")

print("=== PARSING CANDIDATE REGISTER (LINE BY LINE) ===")
# Memory-efficient: loads one line at a time
for line_number, line in enumerate(f, start=1):
    # .strip() removes the trailing '\n' and extra whitespace
    clean_text = line.strip()
    print(f"Entry #{line_number}: {clean_text}")

f.close()
```

**Output:**
```text
=== PARSING CANDIDATE REGISTER (LINE BY LINE) ===
Entry #1: Candidate 1: Rajesh Kumar (Independent)
Entry #2: Candidate 2: Priya Sen (Janata Party)
Entry #3: Candidate 3: Vikramaditya Singh (National Congress)
```

---

## 4. Reading Specific Byte Chunks: `f.read(size)`

You can pass an optional integer argument to `read(size)` to read only a specified number of characters:

```python
# ==========================================================
# Example 4: Chunked Reading
# ==========================================================

f = open("candidates_list.txt", "r", encoding="utf-8")

# Read first 11 characters
chunk1 = f.read(11)
print("Chunk 1:", repr(chunk1))

# Read next 12 characters (file pointer continues from byte 11)
chunk2 = f.read(12)
print("Chunk 2:", repr(chunk2))

f.close()
```

**Output:**
```text
Chunk 1: 'Candidate 1'
Chunk 2: ': Rajesh Kum'
```

---

## 5. Do's and Don'ts Best Practices

| Best Practice (DO) | Dangerous Anti-Pattern (DON'T) |
| :--- | :--- |
| **DO** use `for line in file:` for line-by-line parsing to maintain $O(1)$ memory usage. | **DON'T** call `file.read()` on massive 10 GB log files, which exhausts system RAM. |
| **DO** explicitly append `\n` when calling `.write()` or preparing lists for `.writelines()`. | **DON'T** pass non-strings to `.write()`; cast them first with `str()` or f-strings. |
| **DO** use `.strip()` on lines read from a file to remove trailing `\n` characters. | **DON'T** assume `.writelines()` automatically adds line breaks between list items. |

---

## Quick Revision Summary

- **`.write(string)`** writes text to a file and returns character count; does **not** append automatic newlines.
- Passing non-string objects to `.write()` causes a **`TypeError`**.
- **`.writelines(list_of_strings)`** writes a batch of strings to disk without inserting automatic newlines.
- **`for line in file:`** provides lazy, memory-efficient stream iteration ($O(1)$ memory).
- Always use **`line.strip()`** or `line.rstrip('\n')` when processing lines read from files to clean up trailing line breaks.

---

---

## ⚠️ Common Beginner Mistakes & Gotchas

### 1. Forgetting to Close Files (Leaking File Handles)
Always use the `with open()` context manager so files are automatically closed even if an exception occurs:
```python
# ❌ Risky manual file handling
# f = open("notes.txt", "w")
# f.write("Data")
# f.close()  # May never execute if an error occurs above!

# ✅ Production standard context manager
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Data safely flushed to disk")
```

### 2. Accidental Overwrite in `'w'` Mode
Opening an existing file in `'w'` (write) mode immediately truncates (erases) all existing content! To preserve existing data and add to the end, use `'a'` (append) mode.

---

## Practice Quiz

### 1. What happens if you call `file.write(500)` where `file` is opened in text write mode?
A. Python converts 500 to string "500" automatically
B. Python raises a `TypeError: write() argument must be str, not int`
C. Python writes 500 blank spaces to the file
D. Python writes 500 binary bytes

**Answer:** B

---

### 2. What distinguishes `.write()` from `print()` regarding newline characters?
A. `print()` adds no newlines; `.write()` adds two newlines
B. `print()` automatically appends a newline `\n` by default, whereas `.write()` only writes the exact characters supplied without any automatic newline
C. `.write()` cannot write newlines
D. There is no difference; they are aliases

**Answer:** B

---

### 3. If `lines = ["Apple", "Banana", "Cherry"]`, what will appear in a file written with `f.writelines(lines)`?
A. Three separate lines: Apple, Banana, Cherry
B. A single continuous line: `AppleBananaCherry`
C. A list formatted as `['Apple', 'Banana', 'Cherry']`
D. An error because commas are missing

**Answer:** B

---

### 4. Which technique is most memory-efficient for reading a 20 GB web server access log in Python?
A. `data = f.read()`
B. `lines = f.readlines()`
C. `for line in f:`
D. `list(f)`

**Answer:** C

---

### 5. Why is `.strip()` frequently called on lines during file reading (e.g. `for line in f: clean_line = line.strip()`)?
A. To convert the text to lowercase
B. To strip out and remove the invisible trailing newline character `\n` that `.readline()` and stream iteration retain
C. To encrypt the string in memory
D. To convert the string to a list of tokens

**Answer:** B

---

# Practice Challenge: Student Examination Roll List Generator & Parser

Build an automated grade export and parsing engine for a CBSE high school examination board.

### Requirements:
1. Write a function `export_student_marks_csv(filename, student_records)`:
   - Takes a list of student tuples: `(roll_no, name, marks, grade)`.
   - Opens `filename` in write mode `'w'`.
   - Writes a CSV header: `"Roll_No,Student_Name,Marks,Grade\n"`.
   - Writes each student record as a comma-separated line with explicit `\n`.
   - Properly closes the file.
2. Write a function `import_and_analyze_marks_csv(filename)`:
   - Opens `filename` in read mode `'r'`.
   - Uses memory-efficient stream iteration (`for line in f:`) to parse the file line by line.
   - Skips the header line.
   - Splits each line by comma `,` and calculates: Total Students, Class Average Marks, and Top Scorer Name.
   - Properly closes the file and returns the analytics summary.

### Complete Solution

```python
# ==========================================================
# Challenge: CBSE Marks CSV Generator & Stream Parser
# ==========================================================

import os

CSV_FILE = "cbse_batch_2026.csv"

def export_student_marks_csv(filename: str, records: list) -> None:
    """Exports structured student records to a clean CSV file."""
    f = open(filename, "w", encoding="utf-8")
    
    # Write CSV Header with explicit newline
    f.write("Roll_No,Student_Name,Marks,Grade\n")
    
    # Write student records
    for roll, name, marks, grade in records:
        csv_line = f"{roll},{name},{marks},{grade}\n"
        f.write(csv_line)
        
    f.close()
    print(f"[EXPORT] Successfully saved {len(records)} records to {filename}")


def import_and_analyze_marks_csv(filename: str) -> dict:
    """Parses CSV line by line via stream iteration and computes metrics."""
    f = open(filename, "r", encoding="utf-8")
    
    total_students = 0
    total_marks = 0.0
    highest_marks = -1.0
    topper_name = ""
    
    print(f"\n=== PARSING & AUDITING CSV STREAM: {filename} ===")
    
    for line_idx, line in enumerate(f):
        clean_line = line.strip()
        
        # Skip header row (line index 0)
        if line_idx == 0:
            print(f"  [HEADER] Columns: {clean_line}")
            continue
            
        # Parse comma-separated fields
        parts = clean_line.split(",")
        roll = parts[0]
        name = parts[1]
        score = float(parts[2])
        grade = parts[3]
        
        total_students += 1
        total_marks += score
        
        if score > highest_marks:
            highest_marks = score
            topper_name = name
            
        print(f"  Processed Student: {name:<20} (Roll: {roll}) -> Score: {score}")
        
    f.close()
    
    avg_score = (total_marks / total_students) if total_students > 0 else 0.0
    
    return {
        "student_count": total_students,
        "class_average": avg_score,
        "topper": topper_name,
        "highest_score": highest_marks
    }


# Test Student Cohort Data
students_data = [
    ("DPS-101", "Aarav Singhania", 96.5, "A1"),
    ("DPS-102", "Pooja Hegde",      88.0, "A2"),
    ("DPS-103", "Kabir Sen",        94.0, "A1"),
    ("DPS-104", "Meera Deshmukh",   79.5, "B1"),
    ("DPS-105", "Rohan Verma",      98.0, "A1")
]

# 1. Export records to disk
export_student_marks_csv(CSV_FILE, students_data)

# 2. Read and analyze records from disk
analysis = import_and_analyze_marks_csv(CSV_FILE)

print("\n" + "=" * 54)
print(f"Total Enrolled Candidates: {analysis['student_count']}")
print(f"Cohort Academic Average:   {analysis['class_average']:.2f}%")
print(f"Class Top Scorer:          {analysis['topper']} ({analysis['highest_score']}%)")
print("=" * 54)

# Cleanup scratch file
if os.path.exists(CSV_FILE):
    os.remove(CSV_FILE)
    print("\n[CLEANUP] Scratch CSV audit file removed.")
```

```text
Output:
[EXPORT] Successfully saved 5 records to cbse_batch_2026.csv

=== PARSING & AUDITING CSV STREAM: cbse_batch_2026.csv ===
  [HEADER] Columns: Roll_No,Student_Name,Marks,Grade
  Processed Student: Aarav Singhania      (Roll: DPS-101) -> Score: 96.5
  Processed Student: Pooja Hegde          (Roll: DPS-102) -> Score: 88.0
  Processed Student: Kabir Sen            (Roll: DPS-103) -> Score: 94.0
  Processed Student: Meera Deshmukh       (Roll: DPS-104) -> Score: 79.5
  Processed Student: Rohan Verma          (Roll: DPS-105) -> Score: 98.0

======================================================
Total Enrolled Candidates: 5
Cohort Academic Average:   91.20%
Class Top Scorer:          Rohan Verma (98.0%)
======================================================

[CLEANUP] Scratch CSV audit file removed.
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Working with open()** (15: File Handling).

👉 **[Continue to Next Lesson: Working with open() →](/tutorials/python-for-beginners/working-with-open)**
