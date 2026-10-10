# Downcasting Dtypes & Category Encoding for 10x Memory Savings

When working with production datasets exceeding millions of rows in Pandas, the default data types assigned during `pd.read_csv()` or SQL reads frequently lead to severe memory bloat and out-of-memory (`OOM`) crashes. By mastering numerical downcasting and string categorical conversion, you can routinely reduce DataFrame RAM consumption by **70% to 90%** without sacrificing numerical precision or data integrity.

---

## 1. Why Pandas Default Types Waste Massive RAM

By default, 64-bit systems allocate 64-bit containers for nearly all data:
- Integers become `int64` (8 bytes per value), even if values range from 1 to 100.
- Floats become `float64` (8 bytes per value), even if 2 decimal places are needed.
- Strings become `object` dtype, which stores Python pointers referencing variable-length string objects in heap memory (consuming up to 50-80 bytes per string cell!).

### Memory Consumption Table by Dtype

| Data Type | Bytes per Value | Value Range / Purpose |
| :--- | :--- | :--- |
| `int8` | 1 byte | -128 to 127 |
| `uint8` | 1 byte | 0 to 255 (Great for percentages, age, counts) |
| `int16` | 2 bytes | -32,768 to 32,767 |
| `int32` | 4 bytes | -2.14 billion to +2.14 billion |
| `int64` | 8 bytes | Default int (overkill for 99% of columns) |
| `float16` / `float32` | 2 / 4 bytes | High speed, sufficient for currency/sensor readings |
| `category` | 1-2 bytes (int codes) | High cardinality reduction for repetitive strings |

---

## 2. Inspecting True Memory Usage

Never trust `df.info()` alone without passing `memory_usage='deep'`. Without `deep=True`, Pandas only measures the memory used by string pointers, not the strings themselves!

```python
import pandas as pd
import numpy as np

# Inspect deep memory consumption
print(df.info(memory_usage='deep'))

# Memory usage per column in megabytes
mem_per_col = df.memory_usage(deep=True) / (1024 ** 2)
print(mem_per_col.round(2))
```

---

## 3. Automated Downcasting with `pd.to_numeric()`

Pandas provides `pd.to_numeric(col, downcast='integer')` and `downcast='float'` which automatically discovers the smallest safe container that fits the column's minimum and maximum values without overflow:

```python
def optimize_numeric_dtypes(df):
    for col in df.select_dtypes(include=['int64', 'int32']).columns:
        df[col] = pd.to_numeric(df[col], downcast='integer')
        
    for col in df.select_dtypes(include=['float64']).columns:
        df[col] = pd.to_numeric(df[col], downcast='float')
        
    return df
```

---

## 4. Converting Repetitive Strings to `category`

If a string column contains repeated values (such as `City`, `Department`, `Payment_Mode`, or `Order_Status`), storing each row as an independent string object is catastrophic for memory. Converting it to `category` creates an internal integer lookup table:

```python
# Check unique ratio before converting
for col in df.select_dtypes(include=['object']).columns:
    num_unique = df[col].nunique()
    total_rows = len(df[col])
    if num_unique / total_rows < 0.5:  # If fewer than 50% unique values
        df[col] = df[col].astype('category')
```

### Example: Before vs After Benchmark
```python
# 5 Million rows ecommerce dataframe
# Before optimization: 2.84 GB RAM
# After downcasting & category encoding: 312 MB RAM (89% savings!)
```

---

# Multiple Choice Questions

### 1. Why does `df.info()` underestimate memory usage for DataFrame columns containing strings unless `memory_usage='deep'` is specified?
A. String columns are automatically compressed by gzip in Pandas.
B. Without `deep=True`, Pandas only counts the memory of Python object pointers, ignoring the actual string contents stored in heap memory.
C. `df.info()` excludes non-numeric columns from calculation.
D. Strings are stored on disk in swap space rather than RAM.
**Answer:** B
**Explanation:** In Python, object arrays store pointers (references) to string instances in memory. By default, Pandas only tallies the 8-byte pointer per element. Specifying `memory_usage='deep'` walks the pointers to measure actual string data.
---

### 2. Which integer dtype requires only 1 byte per row and safely stores numbers ranging from 0 to 255?
A. `int8`
B. `int16`
C. `uint8`
D. `int32`
**Answer:** C
**Explanation:** `uint8` (unsigned 8-bit integer) stores positive integers from 0 up to 2^8 - 1 = 255 in exactly 1 byte (8 bits).
---

### 3. Under what circumstance does converting an object column to `category` dtype actually increase memory consumption?
A. When the column contains null values.
B. When the column contains almost 100% unique strings (e.g., UUIDs or Customer Tax IDs) where the overhead of the category index exceeds string storage.
C. When the column is used as a groupby key.
D. When saving the DataFrame to Parquet format.
**Answer:** B
**Explanation:** If cardinality is nearly 100% (unique per row), Pandas must maintain both the complete dictionary of unique keys and the categorical codes, increasing memory overhead instead of reducing it.
---

### 4. Which Pandas function can automatically identify the smallest safe numerical container for an existing column?
A. `df.shrink_dtypes()`
B. `pd.to_numeric(col, downcast='integer')`
C. `df.astype('smallest')`
D. `pd.compact(col)`
**Answer:** B
**Explanation:** `pd.to_numeric()` with the `downcast` argument assesses min/max bounds and safely casts to `int8`, `int16`, `int32`, or `float32`.
---

### 5. What happens during arithmetic operations when two `category` columns are concatenated if they do not share identical categories?
A. Pandas converts them to 64-bit floating point numbers.
B. Pandas raises a `TypeError` or falls back to an `object` dtype unless categories are harmonized beforehand.
C. Pandas drops duplicate rows silently.
D. The operation executes 50% faster than standard string concatenation.
**Answer:** B
**Explanation:** Categorical series have strictly defined categorical domains. Combining unaligned categories requires either converting back to string or aligning categories with `set_categories()`.
---