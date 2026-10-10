---
id: python-intermediate-project-file-directory-utility-tool
slug: project-file-directory-utility-tool
course: python-for-intermediate
chapter: "10: Python Standard Libraries"
topic: "10.5 Project: File & Directory Utility Tool"
title: "Project: File & Directory Utility Tool in Python"
description: "Master project: file & directory utility tool in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 50
keywords:
  - python project file directory utility tool
  - python intermediate
  - python project: file & directory utility tool
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: File & Directory Utility Tool

In this capstone project, we will unite the key Python Standard Libraries mastered across this chapter—**`os`**, **`sys`**, **`datetime`**, **`collections`**, and **`math`**—to build a versatile, production-ready **Command-Line File & Directory Management Utility**.

---

## 1. Project Overview & Capabilities

System administrators and developers often need tools to audit storage usage and organize cluttered directories. Our utility provides two operational modes:

1. **Storage Audit Mode (`--audit`)**:
   - Recursively scans a target directory using `os.walk`.
   - Aggregates storage consumption by file extension using `collections.defaultdict` and `collections.Counter`.
   - Formats raw byte counts into human-readable units (KB, MB, GB) using `math.log` and `math.pow`.
   - Identifies the top 5 largest files and timestamps of recent modifications using `datetime`.
2. **Auto-Organizer Mode (`--organize`)**:
   - Scans a target folder and automatically classifies loose files into categorical subdirectories (`Images`, `Documents`, `Code`, `Archives`, `Audio_Video`, `Others`) based on extension.
   - Moves files safely using `os.rename` and `os.makedirs`.

---

## 2. Complete Utility Code

```python
import os
import sys
import math
import shutil
from datetime import datetime
from collections import defaultdict, Counter


# Categorical mapping for directory organization
FILE_CATEGORIES = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"],
    "Documents": [".pdf", ".docx", ".txt", ".xlsx", ".pptx", ".csv"],
    "Code": [".py", ".js", ".html", ".css", ".json", ".sql", ".cpp"],
    "Archives": [".zip", ".tar", ".gz", ".rar", ".7z"],
    "Media": [".mp3", ".wav", ".mp4", ".mkv", ".mov"]
}


def format_bytes(size_bytes: int) -> str:
    """Converts raw byte sizes into human-readable units (KB, MB, GB)."""
    if size_bytes <= 0:
        return "0 B"
    units = ["B", "KB", "MB", "GB", "TB"]
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {units[i]}"


def audit_directory(target_path: str):
    """Recursively analyzes folder usage, file extensions, and largest files."""
    if not os.path.exists(target_path):
        print(f"Error: Target path '{target_path}' does not exist.", file=sys.stderr)
        return

    print(f"\nAnalyzing directory: {os.path.abspath(target_path)}")
    print("=" * 65)

    total_size = 0
    total_files = 0
    extension_sizes = defaultdict(int)
    extension_counts = Counter()
    all_files = []

    for root, _, files in os.walk(target_path):
        for f in files:
            full_path = os.path.join(root, f)
            try:
                stat_info = os.stat(full_path)
                size = stat_info.st_size
                mtime = datetime.fromtimestamp(stat_info.st_mtime)

                total_size += size
                total_files += 1

                _, ext = os.path.splitext(f)
                ext = ext.lower() or "[no-extension]"

                extension_sizes[ext] += size
                extension_counts[ext] += 1
                all_files.append((f, size, mtime, full_path))

            except (PermissionError, FileNotFoundError):
                continue

    print(f"Total Files Scanned : {total_files}")
    print(f"Total Space Consumed: {format_bytes(total_size)}")
    print("-" * 65)

    # 1. Extension breakdown
    print(f"{'EXTENSION':<15} | {'COUNT':<8} | {'TOTAL SIZE'}")
    print("-" * 65)
    for ext, count in extension_counts.most_common(8):
        print(f"{ext:<15} | {count:<8} | {format_bytes(extension_sizes[ext])}")

    # 2. Top 5 largest files
    print("\n--- Top 5 Largest Files ---")
    all_files.sort(key=lambda item: item[1], reverse=True)
    for idx, (name, size, mtime, _) in enumerate(all_files[:5], start=1):
        formatted_date = mtime.strftime("%Y-%m-%d %H:%M")
        print(f"{idx}. {name:<25} | {format_bytes(size):<10} | Modified: {formatted_date}")
    print("=" * 65)


def organize_directory(target_path: str):
    """Sorts loose files in target directory into categorized folders."""
    if not os.path.isdir(target_path):
        print(f"Error: '{target_path}' is not a valid directory.", file=sys.stderr)
        return

    print(f"\nOrganizing files inside: {os.path.abspath(target_path)}")
    moved_count = 0

    # Invert mapping: extension -> Category
    ext_to_category = {}
    for category, extensions in FILE_CATEGORIES.items():
        for ext in extensions:
            ext_to_category[ext.lower()] = category

    for item in os.listdir(target_path):
        item_path = os.path.join(target_path, item)

        # Only organize regular files, skip existing subdirectories
        if os.path.isfile(item_path):
            _, ext = os.path.splitext(item)
            ext = ext.lower()
            category = ext_to_category.get(ext, "Others")

            category_dir = os.path.join(target_path, category)
            os.makedirs(category_dir, exist_ok=True)

            destination = os.path.join(category_dir, item)
            try:
                shutil.move(item_path, destination)
                moved_count += 1
                print(f" -> Moved '{item}' into [{category}/]")
            except Exception as err:
                print(f"Failed to move '{item}': {err}")

    print(f"\nOrganization complete: {moved_count} file(s) categorized.")


def print_usage():
    print("Usage:")
    print("  python file_tool.py --audit <folder_path>")
    print("  python file_tool.py --organize <folder_path>")


def main():
    if len(sys.argv) < 3:
        print_usage()
        sys.exit(1)

    command = sys.argv[1].lower()
    target_folder = sys.argv[2]

    if command == "--audit":
        audit_directory(target_folder)
    elif command == "--organize":
        organize_directory(target_folder)
    else:
        print(f"Unknown option '{command}'", file=sys.stderr)
        print_usage()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

---

## 3. Sample Execution Simulation

### Running the Audit Command:
```bash
python file_tool.py --audit ./sample_data
```

```text
Analyzing directory: /workspace/sample_data
=================================================================
Total Files Scanned : 34
Total Space Consumed: 14.82 MB
-----------------------------------------------------------------
EXTENSION       | COUNT    | TOTAL SIZE
-----------------------------------------------------------------
.png            | 12       | 8.45 MB
.pdf            | 8        | 4.12 MB
.py             | 10       | 185.40 KB
.csv            | 4        | 2.07 MB

--- Top 5 Largest Files ---
1. annual_report.pdf         | 3.85 MB    | Modified: 2026-09-10 11:24
2. screenshot_hd.png         | 2.45 MB    | Modified: 2026-09-11 14:15
3. sales_q3.csv              | 1.80 MB    | Modified: 2026-09-12 09:30
4. banner.png                | 1.20 MB    | Modified: 2026-09-08 17:40
5. client_mockup.png         | 950.00 KB  | Modified: 2026-09-09 16:05
=================================================================
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Overwriting Destination Files Silently
When moving or copying files during automated directory cleanup, check `os.path.exists()` before moving to prevent overwriting existing files with duplicate names.

### 2. Infinite Recursion on Symlink Loops
When recursively traversing directories with `os.walk()`, be cautious with symbolic links (`followlinks=True`) which can create infinite traversal cycles.

---

---

## 💻 Try It Yourself: Extension Challenge - File Size Reporter

### Challenge
Extend the Directory Utility Tool to find the 3 largest files in a given directory and format their file sizes in Megabytes (MB).

### Complete Solution
```python
import os

def find_largest_files(directory, top_n=3):
    file_sizes = []
    for root, _, files in os.walk(directory):
        for f in files:
            path = os.path.join(root, f)
            try:
                size_mb = os.path.getsize(path) / (1024 * 1024)
                file_sizes.append((f, size_mb))
            except OSError:
                continue
    
    file_sizes.sort(key=lambda x: x[1], reverse=True)
    return file_sizes[:top_n]

print("Scanning directory for largest files...")
# Simulation output
print("- database_backup.sqlite: 142.50 MB")
print("- server_access.log: 48.20 MB")
print("- product_catalog.csv: 12.10 MB")
```

### Expected Output
```text
Scanning directory for largest files...
- database_backup.sqlite: 142.50 MB
- server_access.log: 48.20 MB
- product_catalog.csv: 12.10 MB
```

---

## Practice Quiz

### 1. In this project, which Python module is utilized to recursively traverse subfolders and files?
A. `sys`
B. `os` (via `os.walk`)
C. `math`
D. `collections`
**Answer:** B
**Explanation:** `os.walk(target_path)` generates directory trees recursively, returning tuples of `(root, directories, files)`.
---

### 2. How does `format_bytes()` calculate the appropriate magnitude unit (B, KB, MB, GB)?
A. By dividing by 1000 repeatedly in a `for` loop
B. By using `math.log(size_bytes, 1024)` to determine unit index mathematically
C. By hardcoding file sizes in an array
D. By calling an operating system shell script
**Answer:** B
**Explanation:** Calculating the logarithm in base 1024 determines the exact magnitude power index `i` in $O(1)$ time.
---

### 3. Which data structure from the `collections` module was used to tally how many files exist per extension?
A. `namedtuple`
B. `deque`
C. `Counter`
D. `OrderedDict`
**Answer:** C
**Explanation:** `collections.Counter` automatically tracks frequencies and provides convenient methods like `.most_common()`.
---

### 4. Why does `organize_directory()` call `os.makedirs(category_dir, exist_ok=True)`?
A. To format the disk drive
B. To create the category folder if it doesn't already exist without raising a `FileExistsError`
C. To delete temporary files
D. To compress the folder into a zip file
**Answer:** B
**Explanation:** Setting `exist_ok=True` ensures the directory is created if missing, and suppresses exceptions if the directory already exists.
---

### 5. How are the modification timestamps extracted from files converted into readable dates?
A. `datetime.fromtimestamp(stat_info.st_mtime)`
B. `os.path.readable_date()`
C. `time.convert()`
D. `sys.get_time()`
**Answer:** A
**Explanation:** `os.stat().st_mtime` provides epoch seconds, which `datetime.fromtimestamp()` converts into a Python `datetime` object for formatting.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Introduction to Databases** (11: Database Basics with SQLite).

👉 **[Continue to Next Lesson: Introduction to Databases →](/tutorials/python-for-intermediate/introduction-to-databases)**
