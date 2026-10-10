# Resampling, Rolling Windows & Shifting

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Time-Series Frequency Conversions (`resample`)
**`resample()`** is essentially a `groupby()` operation specifically for time-series data. It groups timestamps into discrete intervals (e.g., daily data into weekly, monthly, or quarterly summaries):

```python
import pandas as pd
import numpy as np

# Create daily sales data for 90 days
dates = pd.date_range(start='2026-01-01', periods=90, freq='D')
df = pd.DataFrame({
    'Daily_Sales': np.random.randint(10000, 50000, size=90)
}, index=dates)

# Resample from Daily to Monthly Sums ('ME' = Month End)
monthly_sales = df.resample('ME').sum()
print("Monthly Revenue:\n", monthly_sales)
```

---

## 2. Rolling Window Calculations (Moving Averages)
In financial markets and business forecasting, daily metrics fluctuate wildly. A **Rolling Moving Average** smooths out noise to reveal underlying trends:

```python
# 7-Day Moving Average of Sales
df['7_Day_MA'] = df['Daily_Sales'].rolling(window=7).mean()

# 30-Day Rolling Standard Deviation (Volatility)
df['30_Day_Volatility'] = df['Daily_Sales'].rolling(window=30).std()
print(df.tail(10))
```

---

## 3. Shifting Data for Period-over-Period Growth (`.shift`)
To compute Day-over-Day or Month-over-Month growth, compare today's sales with yesterday's sales by shifting values down:

```python
# Shift values down by 1 row (yesterday's sales)
df['Prev_Day_Sales'] = df['Daily_Sales'].shift(1)

# Calculate Day-over-Day percentage change
df['DoD_Growth_Pct'] = (
    (df['Daily_Sales'] - df['Prev_Day_Sales']) / df['Prev_Day_Sales']
) * 100

# Or use the built-in shortcut:
df['DoD_Growth_Shortcut'] = df['Daily_Sales'].pct_change() * 100
```

---

# Multiple Choice Questions

### 1. Which method performs time-based frequency aggregation (e.g. converting hourly or daily records into monthly summaries)?
A. `df.resample()`
B. `df.time_group()`
C. `df.retime()`
D. `df.aggregate_time()`
**Answer:** A
**Explanation:** `resample()` is the dedicated time-series frequency conversion and aggregation method in Pandas.
---

### 2. What does `df['Sales'].rolling(window=7).mean()` calculate?
A. The total sum of the first 7 days
B. A 7-period trailing simple moving average
C. The 7 highest sales days
D. Daily sales multiplied by 7
**Answer:** B
**Explanation:** `.rolling(window=7).mean()` calculates the moving average over a sliding window of 7 periods.
---

### 3. What does `Series.shift(1)` do?
A. Moves all values down by 1 row, leaving the first row as NaN
B. Deletes the first row
C. Multiplies values by 1
D. Shifts columns to the left
**Answer:** A
**Explanation:** `shift(1)` moves data down by 1 period, making previous period values available on the current row.
---

### 4. Which built-in Pandas method directly computes the percentage change between the current and previous element?
A. `Series.pct_change()`
B. `Series.percent_diff()`
C. `Series.growth_rate()`
D. `Series.delta_pct()`
**Answer:** A
**Explanation:** `.pct_change()` computes the fractional change from the previous row: `(x_t - x_{t-1}) / x_{t-1}`.
---

### 5. In modern Pandas, what frequency alias represents Month End in `resample()`?
A. `'ME'`
B. `'MON'`
C. `'MONTH'`
D. `'30D'`
**Answer:** A
**Explanation:** In modern Pandas (2.2+), `'ME'` stands for Month End (replacing the deprecated `'M'`).
---
