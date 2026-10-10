# Pivot Tables & Cross-Tabulations (pivot_table, crosstab)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Pivot Tables in Pandas
If you know PivotTables in Microsoft Excel, **`pd.pivot_table()`** will feel instantly familiar. A Pivot Table aggregates data and reshapes it into a two-dimensional grid with designated row headers, column headers, and calculated cell values.

---

## 2. Anatomy of `df.pivot_table()`
```python
import pandas as pd

df = pd.DataFrame({
    'Year': [2024, 2024, 2025, 2025, 2024, 2025],
    'Region': ['North', 'South', 'North', 'South', 'North', 'South'],
    'Product': ['Laptop', 'Laptop', 'Laptop', 'Tablet', 'Tablet', 'Laptop'],
    'Sales': [50000, 60000, 55000, 30000, 35000, 65000]
})

# Create Pivot Table: Rows = Region, Columns = Product, Values = Total Sales
pivot = df.pivot_table(
    index='Region',
    columns='Product',
    values='Sales',
    aggfunc='sum',
    fill_value=0,      # Replace NaN with 0 for product-region combinations with no sales
    margins=True,       # Adds 'All' row and column subtotals (Grand Totals!)
    margins_name='Total'
)
print(pivot)
```

**Output:**
```text
Product  Laptop  Tablet   Total
Region                         
North    105000   35000  140000
South    125000   30000  155000
Total    230000   65000  295000
```

---

## 3. What Does `margins=True` Do?
In Excel, PivotTables automatically append Grand Total rows and columns. In Pandas, setting **`margins=True`** generates these subtotal rows and columns automatically.

---

## 4. Cross-Tabulations with `pd.crosstab()`
**`pd.crosstab()`** is specifically designed for computing frequency tables (counts or percentages of occurrences between two categorical variables):

```python
# Frequency count table of Region vs Product
freq_table = pd.crosstab(df['Region'], df['Product'])
print(freq_table)

# Normalized percentage table (Proportions that sum to 100%)
pct_table = pd.crosstab(df['Region'], df['Product'], normalize='index') * 100
print(pct_table)
```

---

# Multiple Choice Questions

### 1. What parameter in `df.pivot_table()` specifies the mathematical aggregation to apply (defaulting to 'mean')?
A. `operation`
B. `aggfunc`
C. `metric`
D. `calc`
**Answer:** B
**Explanation:** `aggfunc='mean'` is the default aggregation function, which can be changed to `'sum'`, `'count'`, etc.
---

### 2. What does `margins=True` add to a Pandas pivot table?
A. Outer margins of whitespace
B. Grand total summary rows and columns for all values
C. Profit margins
D. Border styling
**Answer:** B
**Explanation:** `margins=True` adds an 'All' subtotal row and column reflecting overall aggregations.
---

### 3. How do you replace empty NaN cells in a pivot table with 0?
A. `fill_value=0`
B. `na_zero=True`
C. `null_replace=0`
D. `zero_fill=True`
**Answer:** A
**Explanation:** The `fill_value=0` parameter replaces missing combination cells with 0.
---

### 4. What is the primary use case for `pd.crosstab()`?
A. Merging databases
B. Calculating frequency distribution matrices between two categorical variables
C. Converting Excel files to CSV
D. Sorting dates
**Answer:** B
**Explanation:** `pd.crosstab()` computes cross-tabulation frequency count or percentage matrices between factors.
---

### 5. In `pd.crosstab(df['A'], df['B'], normalize='index')`, what does `normalize='index'` do?
A. Normalizes counts so each row sums to 1.0 (100%)
B. Normalizes each column
C. Normalizes the entire table sum to 1.0
D. Drops index labels
**Answer:** A
**Explanation:** `normalize='index'` computes percentages across rows, ensuring each row totals 100%.
---
