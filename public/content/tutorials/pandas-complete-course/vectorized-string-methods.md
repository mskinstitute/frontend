# Vectorized String Methods (.str accessor)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Power of the `.str` Accessor
When working with textual data in Pandas, you do not need to write loops or `apply()` calls to clean strings. Pandas provides the specialized **`.str` accessor**, allowing you to execute string operations across entire columns simultaneously with built-in null-safety (automatically skipping `NaN` values without crashing).

---

## 2. Common Text Cleaning Operations

```python
import pandas as pd

df = pd.DataFrame({
    'Raw_Name': ['  amit sharma ', 'PRIYA VERMA', 'rohan kumar  ', None],
    'Email': ['amit.s@gmail.com', 'priya.v@yahoo.com', 'rohan.k@outlook.com', None],
    'Phone': ['+91-98765-43210', '+91-87654-32109', '+91-76543-21098', None]
})

# 1. Stripping whitespace & changing case
df['Clean_Name'] = df['Raw_Name'].str.strip().str.title()

# 2. String replacement
df['Clean_Phone'] = df['Phone'].str.replace('+', '').str.replace('-', '')

# 3. String contains (pattern matching)
is_gmail = df['Email'].str.contains('gmail', case=False, na=False)
print("Gmail Users:\n", df[is_gmail])
```

---

## 3. Splitting Strings into Multiple Columns (`expand=True`)
When a column contains concatenated data (e.g. `First_Name Last_Name` or `City, State`):

```python
# Split Name into First and Last names
split_names = df['Clean_Name'].str.split(' ', expand=True)
split_names.columns = ['First_Name', 'Last_Name']
print(split_names)
```

**Output:**
```text
  First_Name Last_Name
0       Amit    Sharma
1      Priya     Verma
2      Rohan     Kumar
3        NaN       NaN
```

---

## 4. Regular Expression (Regex) Extraction (`.str.extract`)
Extract specific patterns (such as email domains or pincodes) using regex capture groups:

```python
# Extract email domain using regex capture group
df['Domain'] = df['Email'].str.extract(r'@([\w\.]+)')
print(df[['Email', 'Domain']])
```

---

# Multiple Choice Questions

### 1. Which accessor prefix is used to call vectorized string operations on a Pandas Series?
A. `.text`
B. `.str`
C. `.string`
D. `.char`
**Answer:** B
**Explanation:** The `.str` accessor exposes all standard Python string functions as vectorized methods on Series.
---

### 2. What does setting `expand=True` do in `Series.str.split(',', expand=True)`?
A. Expands string lengths with spaces
B. Returns a DataFrame where each split token becomes its own column
C. Converts strings to uppercase
D. Joins strings together
**Answer:** B
**Explanation:** By default `split()` returns a Series of Python lists. Setting `expand=True` unpacks those lists into a multi-column DataFrame.
---

### 3. What does the `na=False` argument achieve in `Series.str.contains('keyword', na=False)`?
A. Fills null values with the keyword
B. Treats missing `NaN` entries as False instead of leaving them as NaN, allowing safe Boolean filtering
C. Drops all null values
D. Raises an error if nulls are present
**Answer:** B
**Explanation:** Without `na=False`, `str.contains()` returns `NaN` for missing rows, which triggers a ValueError when used as a boolean indexer.
---

### 4. Which method strips whitespace from both the beginning and end of every string in a Series?
A. `Series.str.trim()`
B. `Series.str.strip()`
C. `Series.str.clean()`
D. `Series.str.compact()`
**Answer:** B
**Explanation:** `Series.str.strip()` strips leading and trailing whitespace from each string.
---

### 5. Which method uses regex capture groups `(...)` to parse structured tokens into new DataFrame columns?
A. `Series.str.extract()`
B. `Series.str.slice()`
C. `Series.str.pluck()`
D. `Series.str.grab()`
**Answer:** A
**Explanation:** `Series.str.extract(r'pattern')` extracts regex capturing groups as distinct columns.
---
