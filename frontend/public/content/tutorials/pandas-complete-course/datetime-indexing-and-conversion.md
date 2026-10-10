# DateTime Parsing, Indexing & .dt Accessor

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Working with Time in Pandas
In real-world business analytics (sales trends, stock prices, churn tracking, server logs), dates are central. Pandas provides the native **`datetime64[ns]`** dtype and **`DatetimeIndex`** for high-performance temporal computations.

---

## 2. Converting Strings to Datetime (`pd.to_datetime`)
```python
import pandas as pd

date_strings = ['2026-01-15', '2026-02-20', '2026-03-25']
dt_series = pd.to_datetime(date_strings)
print(dt_series)
```

### Parsing Non-Standard Date Formats:
```python
# Indian date format: DD/MM/YYYY
raw_dates = pd.Series(['15/08/2026', '26/01/2026', '02/10/2026'])

# Pass exact strptime format
clean_dates = pd.to_datetime(raw_dates, format='%d/%m/%Y')
print(clean_dates)
```

---

## 3. The `.dt` Accessor (Extracting Date Components)
Just as strings have the `.str` accessor, dates have the **`.dt` accessor** for extracting year, month, day, weekday, quarter, etc.:

```python
df = pd.DataFrame({'Timestamp': clean_dates})

df['Year'] = df['Timestamp'].dt.year
df['Month'] = df['Timestamp'].dt.month
df['Month_Name'] = df['Timestamp'].dt.month_name()
df['Day'] = df['Timestamp'].dt.day
df['Day_of_Week'] = df['Timestamp'].dt.day_name()
df['Is_Weekend'] = df['Timestamp'].dt.dayofweek >= 5

print(df)
```

---

## 4. The DatetimeIndex & Date Slicing
Promoting a Datetime column to the DataFrame Index unlocks powerful partial-string date slicing:

```python
df_sales = pd.DataFrame({
    'Revenue': [15000, 22000, 31000]
}, index=pd.to_datetime(['2026-01-05', '2026-01-20', '2026-02-14']))

# Slice all transactions from January 2026 using simple string notation!
jan_sales = df_sales.loc['2026-01']
print(jan_sales)
```

---

# Multiple Choice Questions

### 1. Which function converts strings or Unix epoch integers into Pandas DateTime objects?
A. `pd.parse_time()`
B. `pd.to_datetime()`
C. `pd.make_date()`
D. `pd.cast_date()`
**Answer:** B
**Explanation:** `pd.to_datetime()` is the universal date conversion utility in Pandas.
---

### 2. What accessor is used to extract date properties (such as year, month, and day_name) from a DateTime Series?
A. `.time`
B. `.date`
C. `.dt`
D. `.cal`
**Answer:** C
**Explanation:** The `.dt` accessor exposes date and time attributes on Series of type datetime64.
---

### 3. How do you extract the name of the day of the week (e.g. 'Monday', 'Tuesday') from a DateTime column?
A. `df['Date'].dt.day_name()`
B. `df['Date'].dt.weekday_string()`
C. `df['Date'].dt.name_of_day()`
D. `df['Date'].to_day()`
**Answer:** A
**Explanation:** `.dt.day_name()` returns the string name of the day of the week according to the locale.
---

### 4. What format string parses a date formatted as "25-Dec-2026"?
A. `'%d-%b-%Y'`
B. `'%D-%M-%Y'`
C. `'%d-%m-%y'`
D. `'%day-%month-%year'`
**Answer:** A
**Explanation:** `%d` = 2-digit day, `%b` = abbreviated month name ('Dec'), and `%Y` = 4-digit year.
---

### 5. What unique capability is enabled when setting a `DatetimeIndex` as the DataFrame's index?
A. Partial string indexing (e.g. `df.loc['2026-05']` slices all records in May 2026)
B. Automatic currency conversion
C. All nulls are deleted
D. Columns are sorted alphabetically
**Answer:** A
**Explanation:** A DatetimeIndex allows intuitive time-based slicing using year, month, or date string prefixes.
---
