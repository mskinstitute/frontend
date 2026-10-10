# Handling Duplicates & Data Type Conversions

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Detecting & Removing Duplicate Records
Duplicate rows often occur due to repeated form submissions, database re-syncs, or ETL joining errors.

```python
import pandas as pd

df = pd.DataFrame({
    'Transaction_ID': [101, 102, 103, 102, 104],
    'User': ['Amit', 'Priya', 'Rohan', 'Priya', 'Sneha'],
    'Amount': [1200, 4500, 3100, 4500, 8900]
})

# 1. Identify duplicates
print(df.duplicated()) # Returns boolean Series

# 2. Check for duplicate Transaction IDs only
print(df.duplicated(subset=['Transaction_ID']))

# 3. Drop duplicate rows (keep the first occurrence)
df_unique = df.drop_duplicates(subset=['Transaction_ID'], keep='first')
print(df_unique)
```

### The `keep` Parameter Options:
- **`keep='first'` (Default):** Retains the first occurrence and drops subsequent duplicates.
- **`keep='last'`:** Retains the last occurrence and drops earlier duplicates.
- **`keep=False`:** Drops ALL occurrences of duplicates (keeping only strictly unique rows).

---

## 2. Converting Data Types (`.astype()`)
Often numbers (like `"₹4500"` or phone numbers `"9876543210"`) are imported as generic `object` (string) types. To perform calculations, cast them to proper datatypes:

```python
# Converting data types
df['Transaction_ID'] = df['Transaction_ID'].astype(str)
df['Amount'] = df['Amount'].astype(float)
```

### Safe Conversion with `pd.to_numeric()`
When a column contains dirty strings (like `"N/A"` or `"invalid"`), `.astype(float)` crashes with a ValueError. `pd.to_numeric(errors='coerce')` gracefully converts bad values into `NaN`:

```python
raw_prices = pd.Series(['150.50', '200.00', 'corrupted_val', '310.25'])

# errors='coerce' turns 'corrupted_val' into NaN instead of crashing
clean_prices = pd.to_numeric(raw_prices, errors='coerce')
print(clean_prices)
```

---

## 3. The Categorical Data Type (`category`)
For text columns with limited unique values (e.g. `Gender`, `State`, `Department`), converting from `object` to `category` reduces memory usage by up to **90%** and speeds up grouping:

```python
df['User'] = df['User'].astype('category')
```

---

# Multiple Choice Questions

### 1. Which method drops duplicate records from a DataFrame?
A. `df.remove_repeats()`
B. `df.drop_duplicates()`
C. `df.unique_only()`
D. `df.deduplicate()`
**Answer:** B
**Explanation:** `df.drop_duplicates()` identifies and removes duplicate rows based on all or specified subset columns.
---

### 2. What happens when calling `df.drop_duplicates(keep=False)`?
A. Keeps only the first duplicate
B. Drops every single occurrence of duplicated rows, retaining only values that appeared exactly once
C. Deletes the entire DataFrame
D. Keeps all duplicates
**Answer:** B
**Explanation:** Setting `keep=False` discards all duplicates completely without retaining any copy.
---

### 3. What does `pd.to_numeric(series, errors='coerce')` do when encountering unparseable text?
A. Raises a ValueError
B. Converts the invalid text into `np.nan`
C. Replaces the text with zero
D. Skips the row
**Answer:** B
**Explanation:** Passing `errors='coerce'` forces invalid or unparseable values to become `NaN`.
---

### 4. Which datatype should be used for text columns with low cardinality (few unique strings repeated millions of times) to save memory?
A. `int32`
B. `category`
C. `string[pyarrow]`
D. `float16`
**Answer:** B
**Explanation:** The `category` datatype maps repetitive string values to small internal integers, dramatically slashing RAM usage.
---

### 5. How do you convert an integer column 'Age' into a 32-bit float in Pandas?
A. `df['Age'] = df['Age'].astype('float32')`
B. `df['Age'].to_float()`
C. `df['Age'].cast(float)`
D. `float(df['Age'])`
**Answer:** A
**Explanation:** The `.astype('type_name')` method casts the Series to the target dtype.
---
