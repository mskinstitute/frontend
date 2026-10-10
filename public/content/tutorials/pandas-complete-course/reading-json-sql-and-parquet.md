# Reading JSON, SQL Databases & Parquet Files

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Modern Data Storage Formats
In enterprise data analytics, data rarely lives solely in spreadsheets. Data Analysts frequently ingest data from:
1. **REST APIs & Web Services** (`JSON`)
2. **Relational Databases** (`PostgreSQL`, `MySQL`, `SQL Server`, `SQLite`)
3. **Big Data Lakes & Cloud Warehouses** (`Apache Parquet`)

---

## 2. Ingesting JSON Files (`read_json`)
JSON (JavaScript Object Notation) is hierarchical and nested.

```python
import pandas as pd

# Load flat JSON records
df_users = pd.read_json('users_api.json')

# Normalize semi-structured nested JSON
from pandas import json_normalize

raw_json = [
    {"id": 1, "name": "Amit", "address": {"city": "Delhi", "pincode": 110001}},
    {"id": 2, "name": "Priya", "address": {"city": "Mumbai", "pincode": 400001}}
]

df_flat = pd.json_normalize(raw_json)
print(df_flat)
```

**Output:**
```text
   id   name address.city  address.pincode
0   1   Amit        Delhi           110001
1   2  Priya       Mumbai           400001
```

---

## 3. Querying Relational SQL Databases (`read_sql`)
Pandas integrates with **SQLAlchemy** to query any SQL database and load the results directly into a DataFrame:

```python
from sqlalchemy import create_engine

# 1. Create a database connection engine (e.g., MySQL or PostgreSQL)
engine = create_engine('sqlite:///msk_institute.db')

# 2. Execute SQL query directly into a DataFrame
sql_query = """
    SELECT student_id, name, course, fees_paid
    FROM admissions
    WHERE fees_paid > 10000
    ORDER BY fees_paid DESC;
"""

df_students = pd.read_sql(sql_query, con=engine)
print(df_students.head())
```

---

## 4. Apache Parquet: The Fast Columnar Big Data Format
**Parquet** is a columnar file format that offers:
- **Up to 10x smaller file sizes** via dictionary and run-length compression (snappy).
- **Up to 50x faster read speeds** compared to CSV.
- **Preserved data types** (no need to parse dates or specify column datatypes upon loading).

```bash
pip install pyarrow fastparquet
```

```python
# Export to Parquet
df_students.to_parquet('students.parquet', engine='pyarrow', compression='snappy')

# Read Parquet
df_fast = pd.read_parquet('students.parquet', engine='pyarrow')
```

---

# Multiple Choice Questions

### 1. Which function flattens semi-structured, nested JSON dictionaries into a flat 2D DataFrame?
A. `pd.flatten_json()`
B. `pd.json_normalize()`
C. `pd.unfold_records()`
D. `pd.parse_nested()`
**Answer:** B
**Explanation:** `pd.json_normalize()` flattens nested dictionaries (e.g., `{"address": {"city": "Delhi"}}` becomes column `address.city`).
---

### 2. What library is typically used alongside `pd.read_sql()` to manage database connections?
A. `SQLAlchemy`
B. `SQLiteStudio`
C. `DjangoEngine`
D. `MySQLRunner`
**Answer:** A
**Explanation:** SQLAlchemy provides the universal database abstraction layer and connection pooling recommended by Pandas for `read_sql()`.
---

### 3. Why is Apache Parquet preferred over CSV for storing large analytics datasets?
A. Parquet is columnar, compressed, stores explicit datatypes, and reads significantly faster than CSV
B. Parquet files can be opened in Windows Notepad
C. Parquet only stores text characters
D. Parquet does not allow numbers
**Answer:** A
**Explanation:** Because Parquet is a columnar binary format with built-in compression, it requires less disk space, preserves exact dtypes, and loads faster than row-based text CSVs.
---

### 4. Which parameter in `df.to_parquet()` defines the underlying compression algorithm?
A. `compression='snappy'`
B. `zip='on'`
C. `minify=True`
D. `pack='dense'`
**Answer:** A
**Explanation:** The `compression` parameter accepts algorithms such as `'snappy'` (default), `'gzip'`, or `'brotli'`.
---

### 5. What does `pd.read_sql_table('employees', con=engine)` do?
A. Reads the entire 'employees' database table into a DataFrame without writing an explicit SELECT query
B. Drops the 'employees' table from the database
C. Creates an HTML table named 'employees'
D. Generates a database migration file
**Answer:** A
**Explanation:** `read_sql_table()` inspects the database schema and loads the entire table directly into a DataFrame without requiring an explicit SQL statement.
---
