---
id: python-file-methods-read-readline-write
slug: file-methods-read-readline-write
course: python-for-beginners
chapter: 15
topic: 15.4
title: "File Methods: read, readline, readlines, seek, and tell"
description: Master Python file stream methods including read, readline, readlines, write, writelines, seek, tell, and buffer flushing.
difficulty: Beginner
readingTime: 12
order: 81
keywords:
  - read
  - readline
  - readlines
  - seek
  - tell
  - file pointer
  - writelines
  - flush
lastUpdated: 2026-09-30
author: MSK Institute
version: 1.1.0
---

# File Methods: read, readline, readlines, seek, and tell

When you interact with a file in Python, the operating system tracks an invisible bookmark called the **File Cursor (or File Pointer)**. Every read or write operation advances this pointer across the byte stream.

Understanding how to read in varying granularities, move the cursor with `seek()`, inspect its location with `tell()`, and push buffered memory to disk with `flush()` is essential for writing high-performance, memory-efficient Python applications.

---

## The Real-World Analogy: Audio Cassette Tape & Magnetic Read Head

Imagine listening to a classic Hindi song on an old-school Walkman cassette player:

```
+-------------------------------------------------------------------------+
|                  AUDIO CASSETTE TAPE POINTER ANALOGY                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  [Track 1: 180s] -> [Track 2: 210s] -> [Track 3: 240s] -> [Track 4: EOF]|
|                              ▲                                          |
|                              | Magnetic Read Head                       |
|                                                                         |
|  1. tell()      ==> Checks the mechanical counter (e.g., tape is at 180s)|
|  2. read(30)    ==> Plays forward 30 seconds and moves the head ahead   |
|  3. readline()  ==> Plays until the next song pause marker (\n)         |
|  4. readlines() ==> Records all remaining songs into a full playlist    |
|  5. seek(0)     ==> REWIND button: spins tape all the way back to start |
|  6. flush()     ==> Forces wet magnetic ink firmly into the tape ribbon |
|                                                                         |
+-------------------------------------------------------------------------+
```

If the tape head reaches the end of Track 4 (End of File), any subsequent call to `read()` returns an empty string `""` because there is no tape left under the head! To play the tape again, you must press **Rewind** (`seek(0)`).

---

## Technical File Cursor Architecture

When a file is opened, the cursor begins at byte index `0` (unless opened in append mode `'a'`, where it begins at the end).

```
File Content:     P    y    t    h    o    n    \n    3    .    1    2    \n
Byte Offsets:     0    1    2    3    4    5     6    7    8    9   10    11
Cursor Start:    [^] tell() == 0
After read(6):   ---------------------------------> [^] tell() == 6
seek(0):         <--------------------------------- [^] Rewound to byte 0!
```

---

## Core File Methods Overview

| Method | Syntax | Return Value | Memory Footprint | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **`read(size)`** | `f.read(1024)` | `str` (or `bytes`) | Controlled by `size` bytes | Streaming large files in fixed chunks |
| **`read()`** | `f.read()` | `str` (entire file) | Loads whole file into RAM | Small configuration or text files (< 50MB) |
| **`readline()`** | `f.readline()` | `str` (single line) | Tiny (one line) | Line-by-line processing, parsing CSV rows |
| **`readlines()`** | `f.readlines()` | `list[str]` | High (all lines in a list) | Small files when list indexing is needed |
| **`write(str)`** | `f.write("text")` | `int` (chars written) | Minimal | Writing individual strings or formatted records |
| **`writelines()`** | `f.writelines(seq)` | `None` | Low | Writing lists of pre-formatted strings |
| **`tell()`** | `f.tell()` | `int` (byte offset) | None | Inspecting current cursor location |
| **`seek(offset)`** | `f.seek(offset)` | `int` (new offset) | None | Repositioning the cursor |
| **`flush()`** | `f.flush()` | `None` | None | Forcing RAM buffers to disk immediately |

---

## Comprehensive Code Examples

### 1. Reading Granularities: `read()`, `readline()`, and `readlines()`

```python
sample_text = """Train 12001: Shatabdi Express (New Delhi - Bhopal)
Train 12951: Mumbai Rajdhani (Mumbai Central - New Delhi)
Train 22436: Vande Bharat (Varanasi - New Delhi)
Train 12259: Sealdah Duronto (Sealdah - Bikaner)"""

# Setup sample data
with open("train_schedule.txt", "w", encoding="utf-8") as f:
    f.write(sample_text)

# Demonstrate reading methods
with open("train_schedule.txt", "r", encoding="utf-8") as f:
    # 1. read(size): read first 11 characters
    first_chunk = f.read(11)
    print(f"Chunk (11 chars): '{first_chunk}'")
    
    # 2. readline(): read the rest of the first line
    rest_of_line = f.readline()
    print(f"Rest of Line 1: '{rest_of_line.strip()}'")
    
    # 3. readlines(): read all remaining lines as a list
    remaining_lines = f.readlines()
    print(f"Remaining line count: {len(remaining_lines)}")
    for idx, line in enumerate(remaining_lines, start=2):
        print(f"  Line {idx}: {line.strip()}")
```

**Expected Output:**
```text
Chunk (11 chars): 'Train 12001'
Rest of Line 1: ': Shatabdi Express (New Delhi - Bhopal)'
Remaining line count: 3
  Line 2: Train 12951: Mumbai Rajdhani (Mumbai Central - New Delhi)
  Line 3: Train 22436: Vande Bharat (Varanasi - New Delhi)
  Line 4: Train 12259: Sealdah Duronto (Sealdah - Bikaner)
```

---

### 2. Navigating with `tell()` and `seek()`

The `f.tell()` method returns the exact byte position, and `f.seek(offset)` jumps to any byte offset.

```python
with open("railway_code.txt", "w+", encoding="utf-8") as f:
    f.write("INDIAN-RAILWAYS-2026")
    
    print(f"Pointer after writing: {f.tell()} bytes")
    
    # Rewind pointer to start of file
    f.seek(0)
    print(f"Pointer after seek(0): {f.tell()} bytes")
    print(f"Read first 6 chars: '{f.read(6)}'")  # INDIAN
    print(f"Pointer is now at: {f.tell()} bytes")
    
    # Jump directly to index 7 to skip the hyphen
    f.seek(7)
    print(f"Read 8 chars from byte 7: '{f.read(8)}'")  # RAILWAYS
    
    # Jump to the year at byte 16
    f.seek(16)
    print(f"Read remaining year: '{f.read()}'")  # 2026
```

**Expected Output:**
```text
Pointer after writing: 20 bytes
Pointer after seek(0): 0 bytes
Read first 6 chars: 'INDIAN'
Pointer is now at: 6 bytes
Read 8 chars from byte 7: 'RAILWAYS'
Read remaining year: '2026'
```

---

### 3. Efficient Streaming vs `readlines()` Memory Danger

Never call `f.readlines()` or `f.read()` on huge files (e.g., a 10 GB server log or 50 million transaction records). That would attempt to allocate 10 GB of RAM simultaneously, causing an `OutOfMemoryError`.

Instead, use Python's built-in file iterator:

```python
# The Pythonic way: streams line by line with O(1) constant RAM!
with open("train_schedule.txt", "r", encoding="utf-8") as f:
    for line_number, line in enumerate(f, start=1):
        if "Rajdhani" in line or "Vande Bharat" in line:
            print(f"Priority Train [Line {line_number}]: {line.strip()}")
```

**Expected Output:**
```text
Priority Train [Line 2]: Train 12951: Mumbai Rajdhani (Mumbai Central - New Delhi)
Priority Train [Line 3]: Train 22436: Vande Bharat (Varanasi - New Delhi)
```

---

### 4. Writing Sequences with `writelines()` and the `flush()` Mechanism

`writelines()` accepts any iterable of strings (list, tuple, generator). Note that it does **not** add newline characters automatically; you must include `\n` in each element.

```python
gst_invoices = [
    "INV-2026-001,Amitabh Sharma,INR 14500.00\n",
    "INV-2026-002,Priya Patel,INR 8900.50\n",
    "INV-2026-003,Rahul Verma,INR 23120.00\n"
]

with open("gst_invoices.csv", "w", encoding="utf-8") as f:
    # Write header
    f.write("InvoiceID,Customer,Amount\n")
    
    # Write multiple lines at once
    f.writelines(gst_invoices)
    
    # Force RAM buffer contents to flush to the physical storage device immediately
    f.flush()
    print("Buffer flushed to physical disk successfully.")

# Verify contents
with open("gst_invoices.csv", "r", encoding="utf-8") as f:
    print(f.read().strip())
```

**Expected Output:**
```text
Buffer flushed to physical disk successfully.
InvoiceID,Customer,Amount
INV-2026-001,Amitabh Sharma,INR 14500.00
INV-2026-002,Priya Patel,INR 8900.50
INV-2026-003,Rahul Verma,INR 23120.00
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Risky / Inefficient Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Large Files** | `lines = f.readlines()` (loads all into RAM) | `for line in f:` (streams line by line) |
| **Re-reading File** | Closing and reopening the file from scratch | `f.seek(0)` to rewind cursor to start |
| **Reading Chunks** | Reading whole file into memory to slice it | `chunk = f.read(chunk_size)` |
| **Newline handling** | Assuming `writelines()` adds `\n` automatically | Explicitly append `\n` to items in `writelines` |
| **Checking Cursor** | Guessing cursor location after reads | Use `f.tell()` to inspect exact byte offset |
| **Real-time Logging** | Assuming writes hit disk immediately | Call `f.flush()` after critical transactional writes |

---

## Quick Revision Summary Cheat Sheet

- **`f.read(n)`**: Reads next `n` characters (text mode) or bytes (binary mode). At EOF, returns `""`.
- **`f.readline()`**: Reads up to and including the next `\n` character.
- **`f.readlines()`**: Reads all remaining lines into a Python `list[str]`.
- **`for line in f:`**: Memory-efficient lazy generator; optimal for multi-gigabyte files.
- **`f.tell()`**: Returns current cursor position as integer byte offset.
- **`f.seek(0)`**: Resets cursor back to the beginning of the file.
- **`f.writelines(list)`**: Writes an iterable of strings without appending automatic newlines.
- **`f.flush()`**: Flushes write buffer to OS disk without closing the file.

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

### 1. What does the file method f.tell() return?
A. The total number of words in the file
B. The current byte position / offset of the file cursor
C. The file's creation timestamp
D. A boolean flag indicating whether the file has errors
**Answer:** B

---

### 2. If you call f.read() once and it reaches the end of the file, what does a subsequent f.read() call return?
A. None
B. An EOFError exception
C. An empty string `""`
D. It starts over from the first line
**Answer:** C

---

### 3. Which method is the most memory-efficient approach to process a 15 Gigabyte log file on a machine with 8 GB RAM?
A. `f.readlines()` into a list
B. `f.read()` into a single string
C. Iterating line-by-line using `for line in f:`
D. `f.read().split('\n')`
**Answer:** C

---

### 4. What does f.seek(0) do to an open file stream?
A. Clears and truncates the file to 0 bytes
B. Moves the file cursor to the beginning of the file (byte offset 0)
C. Closes the file permanently
D. Deletes the file from disk
**Answer:** B

---

### 5. Does the method f.writelines(["apple", "banana", "cherry"]) automatically insert newline characters between items?
A. Yes, it automatically inserts `\n` after every item
B. Yes, it inserts commas between items
C. No, it concatenates and writes the strings exactly as provided without adding newlines
D. No, it throws a TypeError unless items already contain commas
**Answer:** C

---

# Practice Challenge

### Scenario: High-Speed Resumable Sensor Log Reader

A solar power plant in Rajasthan logs temperature readings every minute to `solar_telemetry.txt`. You must build a Python utility that:
1. Generates `solar_telemetry.txt` with 5 sample sensor readings.
2. Reads the first 2 readings using `readline()`.
3. Saves the cursor position using `tell()`.
4. Reads the remaining file to print subsequent readings.
5. Uses `seek()` with the saved position to rewind and re-read reading #3.
6. Rewinds to byte 0 with `seek(0)` and computes the total character count without reopening the file.

### Starter Code
```python
# Create sample sensor log
with open("solar_telemetry.txt", "w", encoding="utf-8") as f:
    f.write("09:00 AM - 34.2 C\n")
    f.write("09:01 AM - 34.5 C\n")
    f.write("09:02 AM - 35.1 C\n")
    f.write("09:03 AM - 35.8 C\n")
    f.write("09:04 AM - 36.2 C\n")

# TODO: Open file, read first two lines, record tell() bookmark, seek back and verify
```

### Complete Solution
```python
# Step 1: Create sample sensor log
with open("solar_telemetry.txt", "w", encoding="utf-8") as f:
    f.write("09:00 AM - 34.2 C\n")
    f.write("09:01 AM - 34.5 C\n")
    f.write("09:02 AM - 35.1 C\n")
    f.write("09:03 AM - 35.8 C\n")
    f.write("09:04 AM - 36.2 C\n")

# Step 2: Open and inspect using seek & tell
with open("solar_telemetry.txt", "r", encoding="utf-8") as f:
    # Read first two lines
    r1 = f.readline().strip()
    r2 = f.readline().strip()
    print(f"Reading 1: {r1}")
    print(f"Reading 2: {r2}")
    
    # Save bookmark
    bookmark = f.tell()
    print(f"Bookmark position after 2 readings: {bookmark} bytes")
    
    # Read next line
    r3 = f.readline().strip()
    print(f"Reading 3: {r3}")
    
    # Rewind to bookmark and re-read Reading 3
    print("\nRewinding cursor back to bookmark...")
    f.seek(bookmark)
    r3_again = f.readline().strip()
    print(f"Re-read Reading 3: {r3_again}")
    
    # Rewind to start of file to measure total length
    f.seek(0)
    total_content = f.read()
    print(f"\nTotal characters from byte 0: {len(total_content)}")
```

### Expected Output
```text
Reading 1: 09:00 AM - 34.2 C
Reading 2: 09:01 AM - 34.5 C
Bookmark position after 2 readings: 38 bytes
Reading 3: 09:02 AM - 35.1 C

Rewinding cursor back to bookmark...
Re-read Reading 3: 09:02 AM - 35.1 C

Total characters from byte 0: 95
```
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Contact Book** (16: Projects).

👉 **[Continue to Next Lesson: Contact Book →](/tutorials/python-for-beginners/contact-book)**
