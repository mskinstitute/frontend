# Lag Features, Autocorrelation & Stationarity Checks

Machine learning algorithms (such as XGBoost, Random Forest, or Ridge Regression) do not naturally understand chronological sequence order. To enable supervised learning models to forecast future timestamps, data analysts engineer **lag features** and **rolling statistics**, while validating **stationarity** using statistical tests like the Augmented Dickey-Fuller (ADF) test.

---

## 1. Creating Lag Features with `.shift()`

A lag feature takes the value of a metric at time $t-k$ and maps it to the current row at time $t$:

```python
import pandas as pd
import numpy as np

# Ensure time order
df = df.sort_values('date').reset_index(drop=True)

# Engineer lag features
df['sales_lag_1'] = df['sales'].shift(1)   # Yesterday's sales
df['sales_lag_7'] = df['sales'].shift(7)   # Same day last week
df['sales_lag_14'] = df['sales'].shift(14) # Same day two weeks ago

# Engineer rolling features based on lagged data to prevent data leakage!
df['rolling_mean_7'] = df['sales'].shift(1).rolling(window=7).mean()
df['rolling_std_7'] = df['sales'].shift(1).rolling(window=7).std()
```

> **Critical Leakage Warning:** When engineering rolling features for predicting time $t$, always call `.shift(1)` before `.rolling()`. Otherwise, the target observation at time $t$ will leak into the rolling feature!

---

## 2. Autocorrelation & The ACF Plot

**Autocorrelation** measures the correlation of a time series with its own past lagged values:

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

# Plot Autocorrelation Function (ACF) up to 30 lags
fig, ax = plt.subplots(figsize=(10, 4))
plot_acf(df['sales'].dropna(), lags=30, ax=ax)
plt.title("Autocorrelation Function (ACF)")
plt.show()
```

- If lag 7 exhibits a tall vertical bar breaching the blue confidence band, the data has strong weekly autocorrelation.

---

## 3. What is Stationarity and Why Does it Matter?

A time series is **stationary** if its statistical properties (mean, variance, and covariance) do not change over time:
- **Non-Stationary:** Series with an upward trend or changing volatility. Models trained on non-stationary data fail to generalize because past distributions differ from future distributions.
- **Stationary:** Series oscillating around a constant mean with constant variance.

---

## 4. Testing Stationarity: Augmented Dickey-Fuller (ADF) Test

The ADF hypothesis test evaluates whether a unit root is present:
- **$H_0$ (Null Hypothesis):** Series is Non-Stationary (has unit root).
- **$H_1$ (Alternative Hypothesis):** Series is Stationary ($p$-value $< 0.05$).

```python
from statsmodels.tsa.stattools import adfuller

def check_stationarity(series):
    result = adfuller(series.dropna())
    adf_statistic = result[0]
    p_value = result[1]
    print(f"ADF Statistic: {adf_statistic:.4f}")
    print(f"p-value: {p_value:.4f}")
    
    if p_value < 0.05:
        print(">> Reject H0: Series IS STATIONARY (Ready for modeling)")
    else:
        print(">> Fail to reject H0: Series is NON-STATIONARY (Differencing needed)")

check_stationarity(df['sales'])
```

---

## 5. Achieving Stationarity: Differencing (`.diff()`)

If a series is non-stationary, apply first-order differencing ($Delta Y_t = Y_t - Y_{t-1}$):

```python
# 1st order differencing to remove trend
df['sales_diff'] = df['sales'].diff(1)
check_stationarity(df['sales_diff'])
```

---

# Multiple Choice Questions

### 1. In time series feature engineering, what error occurs if you compute `df['sales'].rolling(7).mean()` without shifting by 1 period before forecasting $t$?
A. Target Data Leakage (the model cheats by including the actual target value in the input feature).
B. Integer overflow error.
C. Multicollinearity violation in decision trees.
D. Division by zero.
**Answer:** A
**Explanation:** If the current row's sales at time $t$ are included in the rolling window feature used to predict sales at time $t$, the model learns from future information that will not be available in production.
---

### 2. In the Augmented Dickey-Fuller (ADF) test, what does a $p$-value of 0.012 indicate?
A. The series is non-stationary and has a persistent trend.
B. The null hypothesis is rejected at the 5% significance level; the series is stationary.
C. The series has an error rate of 1.2%.
D. The model has an R-squared of 0.988.
**Answer:** B
**Explanation:** A $p$-value $< 0.05$ rejects the null hypothesis of non-stationarity, confirming that the statistical properties are time-invariant.
---

### 3. Which Pandas method creates a lag feature representing the value from 7 periods ago?
A. `df['sales'].lag(7)`
B. `df['sales'].shift(7)`
C. `df['sales'].rolling(7)`
D. `df['sales'].offset(7)`
**Answer:** B
**Explanation:** `.shift(k)` moves series values down by $k$ rows, shifting past values into current index alignments.
---

### 4. What does a significant positive spike at lag 12 in a monthly sales ACF plot signify?
A. Data corruption.
B. Annual yearly seasonality (the current month is strongly correlated with the same month 1 year ago).
C. Random Gaussian noise.
D. Negative correlation.
**Answer:** B
**Explanation:** In monthly series, lag 12 represents a 12-month interval (one year), capturing annual cyclical trends.
---

### 5. How does first-order differencing ($Delta Y_t = Y_t - Y_{t-1}$) help stabilize a non-stationary series?
A. It doubles the number of rows.
B. It eliminates constant upward or downward linear trends, bringing the mean to approximately zero.
C. It imputes all missing values.
D. It scales all values strictly between 0 and 1.
**Answer:** B
**Explanation:** Differencing subtracts consecutive elements, removing baseline linear trends and centering variations around zero.
---