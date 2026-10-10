---
id: python-intermediate-reading-writing-csv-files
slug: reading-writing-csv-files
course: python-for-intermediate
chapter: "4: File Handling Advanced"
topic: "4.2 Reading & Writing CSV Files"
title: "Reading & Writing CSV Files in Python"
description: "Master reading & writing csv files in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 17
keywords:
  - python reading writing csv files
  - python intermediate
  - python reading & writing csv files
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Reading & Writing CSV Files in Python

CSV (Comma-Separated Values) is one of the most ubiquitous plain-text data interchange formats across software engineering, data science, and business analytics. Python provides robust, highly optimized native support for reading, writing, and parsing CSV documents through its built-in `csv` standard library module.

---

## 1. What is a CSV File?

A CSV file stores tabular data (numbers and text) in plain text form, where each line represents a data record (row) and each record consists of one or more fields separated by a delimiter character (most commonly a comma `,`).

```text
id,name,role,department
101,Aarav Sharma,Software Engineer,Engineering
102,Priya Patel,Data Scientist,Analytics
103,Rohan Verma,Product Manager,Product
```

While you could theoretically read a CSV using basic `split(',')` strings, commas frequently occur inside quoted fields (e.g., `"New Delhi, India"` or `"Engineering, Platform"`). Python's `csv` module automatically handles escaping, quotes, delimiters, and line endings.

---

## 2. Reading CSV Files with `csv.reader`

The `csv.reader` object takes an iterable file stream and yields each row as a list of strings.

### Basic Reader Example

```python
import csv

# Open file with utf-8 encoding and newline=''
with open("employees.csv", mode="r", encoding="utf-8", newline="") as file:
    reader = csv.reader(file)
    
    # Read the header row separately
    header = next(reader)
    print(f"Header: {header}")
    
    # Iterate through remaining data rows
    for row in reader:
        emp_id, name, role, dept = row
        print(f"[{emp_id}] {name} -> {role} ({dept})")
```

### Key Considerations:
1. **`next(reader)`**: Moves the iterator past the header line so the loop only processes data records.
2. **String Types**: All extracted values are strings. You must explicitly convert numbers (`int(row[0])` or `float(row[3])`).

---

## 3. Writing CSV Files with `csv.writer`

The `csv.writer` object provides methods to write sequences of data as formatted CSV rows: `writerow()` for a single row and `writerows()` for a collection of rows.

```python
import csv

headers = ["Name", "Score", "Grade"]
students = [
    ["Aarav", 92, "A"],
    ["Diya", 85, "B"],
    ["Kavya", 97, "A+"]
]

# CRITICAL: Always use newline='' when opening files for writing with csv
with open("grades.csv", mode="w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    
    # Write the column headings
    writer.writerow(headers)
    
    # Write all data rows in a single call
    writer.writerows(students)

print("Grades written successfully.")
```

> **Why `newline=''` is mandatory:**
> On Windows systems, default file writing translates `\n` to `\r\n`. Without `newline=''`, the `csv` module adds its own `\r\n`, resulting in blank empty lines between every row. Specifying `newline=''` allows the `csv` module to control line terminators correctly across all platforms.

---

## 4. Dictionary-Based CSV Handling: `DictReader` & `DictWriter`

Working with lists relies on positional indexing (`row[1]`), which easily breaks if columns change order. Python's `csv.DictReader` and `csv.DictWriter` map CSV rows directly to Python dictionaries.

### Reading with `csv.DictReader`

`csv.DictReader` treats the first row as field names (keys) and returns each subsequent row as an `OrderedDict` or standard `dict`.

```python
import csv

with open("employees.csv", mode="r", encoding="utf-8", newline="") as file:
    reader = csv.DictReader(file)
    
    print(f"Detected columns: {reader.fieldnames}")
    
    for row in reader:
        # Access columns cleanly by key name
        print(f"Employee: {row['name']} | Dept: {row['department']}")
```

### Writing with `csv.DictWriter`

When writing dictionaries, specify `fieldnames` and call `writeheader()` before appending rows.

```python
import csv

fieldnames = ["id", "title", "price", "in_stock"]

catalog = [
    {"id": "P01", "title": "Wireless Mouse", "price": 24.99, "in_stock": True},
    {"id": "P02", "title": "Mechanical Keyboard", "price": 79.50, "in_stock": True},
    {"id": "P03", "title": "USB-C Hub", "price": 35.00, "in_stock": False}
]

with open("products.csv", mode="w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    # Writes the header row matching fieldnames
    writer.writeheader()
    
    # Write individual rows or batch
    writer.writerows(catalog)

print("Product catalog saved.")
```

---

## 5. Custom Delimiters and Quoting Options

CSV files often use alternative delimiters like tabs (TSV), semicolons (common in European Excel), or pipes (`|`).

```python
import csv

# Reading a semicolon-separated file
with open("data_eu.csv", mode="r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f, delimiter=";")
    for row in reader:
        print(row)

# Custom quoting: Quote all non-numeric fields
with open("output.csv", mode="w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f, delimiter="|", quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow(["Item", 450, "Electronics"])
```

### Quoting Constants in `csv`:
- `csv.QUOTE_MINIMAL` *(default)*: Quotes fields only if they contain the delimiter, quote char, or line break.
- `csv.QUOTE_ALL`: Quotes every single field regardless of content.
- `csv.QUOTE_NONNUMERIC`: Quotes all string fields and automatically casts unquoted items to floats when reading.
- `csv.QUOTE_NONE`: Never quotes fields; requires an escape character if the delimiter appears inside text.

---

## 6. Summary Comparison Table

| Feature | `csv.reader` / `csv.writer` | `csv.DictReader` / `csv.DictWriter` |
| :--- | :--- | :--- |
| **Data Format** | List of strings (`['101', 'Aarav']`) | Dictionary (`{'id': '101', 'name': 'Aarav'}`) |
| **Indexing** | Numeric index (`row[0]`) | Column key (`row['id']`) |
| **Refactor Safety** | Low (column shifts break index) | High (columns can appear in any order) |
| **Performance** | Slightly faster, lower memory | Minor overhead for dict creation |
| **Best For** | Pure mathematical/raw data arrays | Structured records and entity objects |

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting `newline=''` on Windows
Opening files for CSV writing without `newline=''` causes empty blank rows between every line on Windows due to double carriage-return translation (`\r\r\n`):
```python
# ❌ INCORRECT (Adds blank lines on Windows)
with open("data.csv", "w", encoding="utf-8") as f:
    writer = csv.writer(f)

# ✅ CORRECT
with open("data.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
```

### 2. Assuming CSV Fields are Numbers
All values read from `csv.reader` or `csv.DictReader` are plain strings. Always explicitly convert numbers before arithmetic:
```python
# ❌ INCORRECT: "50" + "10" = "5010"
total = row["price"] + row["tax"]

# ✅ CORRECT
total = float(row["price"]) + float(row["tax"])
```

---

---

## 💻 Try It Yourself: Automated Employee Payroll Filter

### Scenario
You are building an HR payroll processing script. Given a CSV file of employee salaries, write a script that reads the records, filters employees earning above ₹75,000, and writes their names, departments, and revised salaries (with an 8% bonus added) to a new CSV file `bonus_payouts.csv`.

### Starter Code
```python
import csv

# Sample raw payroll data
raw_payroll = [
    ["EmployeeID", "Name", "Department", "Salary"],
    ["E101", "Aarav Sharma", "Engineering", "85000"],
    ["E102", "Priya Patel", "Marketing", "62000"],
    ["E103", "Rohan Verma", "Engineering", "92000"],
    ["E104", "Ananya Gupta", "HR", "54000"],
    ["E105", "Vikram Singh", "Sales", "78000"]
]

# Write raw data to payroll.csv
with open("payroll.csv", "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(raw_payroll)

# TODO: Read payroll.csv with DictReader, calculate 8% bonus for salary >= 75000, 
# and write to bonus_payouts.csv using DictWriter
```

### Complete Solution
```python
import csv

# 1. Process payroll with DictReader & DictWriter
with open("payroll.csv", mode="r", encoding="utf-8", newline="") as infile:
    reader = csv.DictReader(infile)
    
    bonus_records = []
    for row in reader:
        salary = float(row["Salary"])
        if salary >= 75000:
            bonus = salary * 0.08
            bonus_records.append({
                "Name": row["Name"],
                "Department": row["Department"],
                "BaseSalary": f"{salary:,.2f}",
                "BonusAmount": f"{bonus:,.2f}",
                "TotalPayout": f"{salary + bonus:,.2f}"
            })

# 2. Write bonus payouts
fieldnames = ["Name", "Department", "BaseSalary", "BonusAmount", "TotalPayout"]
with open("bonus_payouts.csv", mode="w", encoding="utf-8", newline="") as outfile:
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(bonus_records)

print(f"Successfully processed {len(bonus_records)} bonus payouts.")
with open("bonus_payouts.csv", "r", encoding="utf-8") as f:
    print(f.read())
```

### Expected Output
```text
Successfully processed 3 bonus payouts.
Name,Department,BaseSalary,BonusAmount,TotalPayout
Aarav Sharma,Engineering,"85,000.00","6,800.00","91,800.00"
Rohan Verma,Engineering,"92,000.00","7,360.00","99,360.00"
Vikram Singh,Sales,"78,000.00","6,240.00","84,240.00"
```

---

## Practice Quiz

### 1. What is the primary purpose of specifying `newline=''` when opening a file for the `csv` module?
A. To prevent Python from raising an `IOError` during read mode
B. To prevent duplicate carriage return characters (`\r\r\n`) and blank lines on Windows
C. To force the CSV module to only parse single-line files
D. To automatically remove trailing spaces from every string value
**Answer:** B
**Explanation:** On Windows systems, Python's default text mode converts `\n` to `\r\n`. Without `newline=''`, Python and the csv writer both append carriage returns, resulting in unwanted empty lines between rows.
---

### 2. Which method from `csv.reader` skips or extracts the first row containing column titles?
A. `reader.skip_header()`
B. `reader.pop(0)`
C. `next(reader)`
D. `reader.read_header()`
**Answer:** C
**Explanation:** `csv.reader` is a Python iterator. Calling `next(reader)` consumes and returns the first row (the header), advancing the iterator to the second row.
---

### 3. When using `csv.DictWriter`, what method must be called to write the column names into the first line?
A. `writer.write_columns()`
B. `writer.writeheader()`
C. `writer.writerow_headers()`
D. `writer.create_schema()`
**Answer:** B
**Explanation:** `writer.writeheader()` writes a row with the field names specified during `csv.DictWriter(file, fieldnames=...)` initialization.
---

### 4. Which quoting mode quotes every string field and treats unquoted numbers as floats?
A. `csv.QUOTE_ALL`
B. `csv.QUOTE_MINIMAL`
C. `csv.QUOTE_NONE`
D. `csv.QUOTE_NONNUMERIC`
**Answer:** D
**Explanation:** `csv.QUOTE_NONNUMERIC` instructs the writer to quote all non-numeric fields and instructs the reader to convert all unquoted fields to floats.
---

### 5. What data structure does each iteration over a `csv.DictReader` yield?
A. A tuple of column values
B. A dictionary mapping header names to row values
C. A list of characters
D. A string formatted in JSON
**Answer:** B
**Explanation:** `csv.DictReader` parses the header line and maps each subsequent row's values to their respective header keys as a dictionary.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Working with JSON Files** (4: File Handling Advanced).

👉 **[Continue to Next Lesson: Working with JSON Files →](/tutorials/python-for-intermediate/working-with-json-files)**
