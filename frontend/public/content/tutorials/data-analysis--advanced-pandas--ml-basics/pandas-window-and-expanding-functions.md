# Window Functions & Moving Averages in Pandas

In business intelligence and algorithmic finance, static metrics (like total monthly sales) hide critical intra-period dynamics. **Window functions** allow analysts to calculate moving averages, rolling volatility, cumulative totals, and exponential trends across temporal and partitioned sequences without collapsing the underlying dataset.

---

## 1. Rolling vs Expanding vs Exponential Windows

| Window Type | Method | Scope of Calculation | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **Rolling Window** | `.rolling(window=N)` | Fixed size $N$ past rows sliding forward | 7-day or 30-day Moving Averages |
| **Expanding Window** | `.expanding(min_periods=1)` | All historical rows up to current row | Year-To-Date (YTD) cumulative metrics |
| **Exponential (EWM)** | `.ewm(span=N)` | Decaying weights giving recent data higher priority | Technical analysis, algorithmic trading |

---

## 2. Practical Rolling Calculations

To compute a rolling metric, ensure the DataFrame is sorted chronologically:

```python
import pandas as pd
import numpy as np

# Ensure chronological sorting
df = df.sort_values(by=['date']).reset_index(drop=True)

# 7-Day Simple Moving Average (SMA)
df['revenue_7d_sma'] = df['revenue'].rolling(window=7, min_periods=1).mean()

# 30-Day Rolling Standard Deviation (Volatility indicator)
df['revenue_30d_std'] = df['revenue'].rolling(window=30, min_periods=5).std()

# Rolling sum over 14 periods
df['orders_14d_sum'] = df['orders'].rolling(window=14).sum()
```

> **Note on `min_periods`:** By default, `.rolling(window=7)` returns `NaN` for the first 6 rows. Setting `min_periods=1` begins computing averages immediately from the first row.

---

## 3. Groupby with Rolling Windows (Partitioned Windows)

When analyzing metrics partitioned by entity (e.g., individual retail store branches, user accounts, or product categories), pair `.groupby()` with `.rolling()`:

```python
# Compute 7-day rolling sales per store branch
df['store_7d_avg'] = (
    df
    .groupby('store_id')['sales']
    .rolling(window=7, min_periods=1)
    .mean()
    .reset_index(level=0, drop=True)  # Drop the extra groupby index level
)
```

---

## 4. Expanding Windows for Cumulative Insights

Expanding windows evaluate performance trajectory from the start of an experiment or fiscal period:

```python
# Cumulative Running Total (same as .cumsum(), but extensible to custom funcs)
df['cumulative_revenue'] = df['revenue'].expanding(min_periods=1).sum()

# Running historical maximum drawdown baseline
df['peak_historical_sales'] = df['revenue'].expanding().max()
```

---

## 5. Exponentially Weighted Moving Average (EWMA)

EWMA reacts faster to sudden changes than simple moving averages because recent observations receive exponentially higher weights:

```python
# 12-day Span Exponentially Weighted Moving Average
df['ewma_12'] = df['revenue'].ewm(span=12, adjust=False).mean()
```

---

# Multiple Choice Questions

### 1. What does the `min_periods` parameter in `df['sales'].rolling(window=7, min_periods=3).mean()` do?
A. Forces the rolling calculation to only calculate every 3rd day.
B. Requires at least 3 non-null observations in the 7-day window to calculate a mean, otherwise returning `NaN`.
C. Limits the rolling window to a maximum of 3 values.
D. Sorts the window values across 3 periods.
**Answer:** B
**Explanation:** `min_periods` specifies the minimum number of valid observations required to compute a result for that window rather than returning `NaN`.
---

### 2. How does an **expanding window** differ fundamentally from a **rolling window**?
A. Rolling windows calculate cumulative sums, while expanding windows calculate standard deviations.
B. A rolling window has a fixed sliding width $N$, while an expanding window includes all historical rows from the beginning up to the current row.
C. Expanding windows can only be applied to integer columns.
D. Expanding windows require time-deltas instead of integer counts.
**Answer:** B
**Explanation:** A rolling window maintains a constant sliding duration $N$. An expanding window starts at the beginning of the series and grows with each subsequent step.
---

### 3. Why must a DataFrame be sorted chronologically before computing rolling metrics on time-series data?
A. Pandas will raise a `SortingError` if rows are unordered.
B. Window operations calculate sequentially over adjacent rows; if rows are disordered, the sliding window blends non-contiguous time periods producing invalid results.
C. Moving averages can only be computed on positive sorted integers.
D. Chronological sorting converts the DataFrame into a categorical structure.
**Answer:** B
**Explanation:** `.rolling(N)` operates on successive row indices. If the rows are not ordered by time, the sliding window captures arbitrary observations across disparate dates.
---

### 4. Which Pandas method calculates an exponentially weighted moving average where recent observations carry exponentially greater weight?
A. `df.rolling(decay='exp')`
B. `df.ewm(span=N).mean()`
C. `df.expanding(weighted=True)`
D. `df.moving_decay()`
**Answer:** B
**Explanation:** `.ewm()` (Exponentially Weighted Moving) provides decaying weight parameters such as `span`, `alpha`, and `halflife`.
---

### 5. What is the output of `pd.Series([10, 20, 30]).expanding().mean()`?
A. `Series([10.0, 15.0, 20.0])`
B. `Series([10.0, 20.0, 30.0])`
C. `Series([NaN, 15.0, 25.0])`
D. `Series([20.0, 20.0, 20.0])`
**Answer:** A
**Explanation:** Step 1: Mean of [10] = 10.0. Step 2: Mean of [10, 20] = 15.0. Step 3: Mean of [10, 20, 30] = 20.0.
---