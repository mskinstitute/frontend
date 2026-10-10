# Reading & Writing CSV and TSV Files

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Introduction to Ingesting Tabular Files
Comma-Separated Values (`.csv`) and Tab-Separated Values (`.tsv`) are the most ubiquitous file formats in data analytics. Pandas provides the powerhouse function **`pd.read_csv()`** to load these files directly into memory as DataFrames.

---

## 2. Core `pd.read_csv()` Parameters
Real-world CSV files are frequently messy—they might have missing headers, strange delimiters (like semicolons or tabs), non-standard encoding, or dates stored as plain text strings.

```python
import pandas as pd

df = pd.read_csv(
    'sales_data_2026.csv',
    sep=',',                      # Delimiter: use '\t' for TSV files
    header=0,                     # Row number to use as column names
    usecols=['Date', 'Product', 'Region', 'Revenue', 'Units'], # Load only needed columns (saves RAM)
    parse_dates=['Date'],         # Automatically convert string dates into datetime64 objects
    encoding='utf-8',             # Character encoding (use 'latin1' or 'cp1252' for legacy files)
    na_values=['NA', 'missing', 'N/A', '-'] # Custom strings to treat as NaN
)

print(df.head())
```

---

## 3. Handling Large CSV Files: Chunking
When working with a 5 GB CSV file that exceeds your computer's RAM, loading it all at once causes an `OutOfMemory` crash. Pandas solves this using **`chunksize`**, which returns an iterator that yields smaller DataFrames:

```python
# Process a 10-million row dataset in chunks of 100,000 rows
total_revenue = 0

for chunk in pd.read_csv('massive_transactions.csv', chunksize=100000):
    # Perform aggregation on each batch
    total_revenue += chunk['Revenue'].sum()

print(f"Total Aggregated Revenue: ₹{total_revenue:,.2f}")
```

---

## 4. Writing Data Back to CSV (`to_csv`)
After cleaning or transforming data, export it using `df.to_csv()`:

```python
# Export cleaned data
# CRITICAL TIP: Always set index=False unless you want an extra unnamed '0,1,2,3' column!
df.to_csv('cleaned_sales_report.csv', index=False, encoding='utf-8')
```

---

# Multiple Choice Questions

### 1. What does setting `index=False` accomplish when calling `df.to_csv('output.csv', index=False)`?
A. It deletes the first row of column headers
B. It prevents Pandas from writing the row index numbers as an unwanted column in the CSV file
C. It sorts the dataset in reverse order
D. It compresses the CSV into a ZIP archive
**Answer:** B
**Explanation:** By default, Pandas writes the row index labels to the output file. Setting `index=False` prevents an unwanted extra index column (e.g. `0, 1, 2...`) from being created.
---

### 2. How can you read a Tab-Separated Values (`.tsv`) file using `pd.read_csv()`?
A. Set `sep='\t'`
B. Set `mode='tsv'`
C. Set `format='tab'`
D. `pd.read_csv()` cannot read TSV files
**Answer:** A
**Explanation:** Passing `sep='\t'` tells Pandas to use the tab character as the column delimiter instead of the default comma.
---

### 3. Which parameter in `pd.read_csv()` allows you to load only a specific subset of columns to conserve system memory?
A. `only_cols`
B. `usecols`
C. `columns_filter`
D. `select_fields`
**Answer:** B
**Explanation:** The `usecols` parameter accepts a list of column names or integer positions, loading only those fields into memory.
---

### 4. What parameter should you supply to automatically parse date strings into true Pandas DateTime objects during CSV ingestion?
A. `date_format=True`
B. `parse_dates=['Column_Name']`
C. `auto_datetime=True`
D. `convert_dates=True`
**Answer:** B
**Explanation:** `parse_dates=['Date_Col']` instructs the CSV parser to convert specified columns directly into `datetime64[ns]` objects upon loading.
---

### 5. What does the `chunksize` parameter in `pd.read_csv()` return?
A. The total byte size of the file on disk
B. An iterable `TextFileReader` object that yields chunks of the DataFrame batch-by-batch
C. A list of column names
D. The number of rows in the CSV
**Answer:** B
**Explanation:** When `chunksize=N` is specified, Pandas returns an iterator yielding DataFrames of size `N`, allowing large files to be processed in memory-safe batches.
---
