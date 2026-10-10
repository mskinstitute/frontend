# Exponential Smoothing & Moving Average Baseline Models

Before training complex machine learning models (like Random Forests or Gradient Boosted Trees), data analysts must establish robust statistical **baseline models**. Simple baseline forecasts set the performance floor that any advanced algorithm must decisively beat to justify its implementation complexity and computational overhead.

---

## 1. Classical Baseline Benchmarks

1. **Naïve Forecast:** Forecasts that tomorrow will equal today: $hat{Y}_{t+1} = Y_t$.
2. **Seasonal Naïve Forecast:** Forecasts that next Monday will equal last Monday: $hat{Y}_{t+1} = Y_{t+1-m}$ (where $m=7$).
3. **Simple Moving Average Forecast:** Forecasts the average of the last $k$ periods.
4. **Simple Exponential Smoothing (SES):** Weights recent observations using smoothing parameter $alpha in (0, 1)$.

---

## 2. Implementing Holt-Winters Exponential Smoothing

Holt-Winters Exponential Smoothing models both **trend** ($eta$) and **seasonality** ($gamma$):

```python
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import numpy as np

# Split train and test sets chronologically (Never shuffle time series!)
train = df.iloc[:-30]  # All data up to last 30 days
test = df.iloc[-30:]   # Last 30 days holdout

# Fit Holt-Winters Model
hw_model = ExponentialSmoothing(
    train['sales'],
    trend='add',
    seasonal='add',
    seasonal_periods=7
).fit()

# Forecast 30 days ahead
hw_forecast = hw_model.forecast(steps=30)
```

---

## 3. Evaluating Forecast Accuracy

Evaluate forecasts against ground truth test sets using standard business metrics:

```python
# 1. Mean Absolute Error (MAE) - easy for executives to understand ($ error)
mae = np.mean(np.abs(test['sales'] - hw_forecast))

# 2. Root Mean Squared Error (RMSE) - penalizes large catastrophic errors heavily
rmse = np.sqrt(mean_squared_error(test['sales'], hw_forecast))

# 3. Mean Absolute Percentage Error (MAPE) - relative % error
mape = mean_absolute_percentage_error(test['sales'], hw_forecast) * 100

print(f"MAE:  ${mae:,.2f}")
print(f"RMSE: ${rmse:,.2f}")
print(f"MAPE: {mape:.2f}%")
```

---

## 4. Comparing Against the Naïve Baseline

```python
# Naive baseline (yesterday's value)
naive_forecast = test['sales'].shift(1).bfill()
naive_mape = mean_absolute_percentage_error(test['sales'], naive_forecast) * 100

print(f"Naive Baseline MAPE: {naive_mape:.2f}% vs Holt-Winters MAPE: {mape:.2f}%")
```

If an advanced ML model scores an RMSE of 120 while a Naïve forecast scores 115, the ML model is adding negative value and should never be deployed!

---

# Multiple Choice Questions

### 1. Why must time-series data NEVER be split into train and test sets using standard random train_test_split from scikit-learn?
A. Random splitting raises a syntax error with date objects.
B. Random shuffling shuffles future data into the training set (lookahead leakage) and tests the model on past dates, invalidating real-world predictive validity.
C. Random splitting doubles memory consumption.
D. Dates must always be converted to float32 before splitting.
**Answer:** B
**Explanation:** Time-series models predict the future based on the past. Random sampling causes lookahead bias where future data is trained upon to predict historical data.
---

### 2. In Holt-Winters exponential smoothing, what does the **additive seasonal** component assume?
A. The magnitude of the seasonal variation is constant and independent of the overall trend level.
B. Sales will increase exponentially every year.
C. The seasonal effect multiplies the trend by a percentage factor.
D. Residual errors are always zero.
**Answer:** A
**Explanation:** Additive seasonality assumes that seasonal fluctuations add a fixed amount regardless of whether the baseline trend is 1,000 units or 100,000 units.
---

### 3. Which evaluation metric measures forecast error as an intuitive percentage relative to actual values?
A. R-Squared
B. MAPE (Mean Absolute Percentage Error)
C. Mean Squared Error (MSE)
D. Log-Loss
**Answer:** B
**Explanation:** MAPE computes the average percentage divergence $|(Actual - Forecast) / Actual| 	imes 100$, providing an easily communicable metric for business stakeholders.
---

### 4. What is the **Naïve Forecast** benchmark?
A. A complex deep learning neural network.
B. A simple projection that the next time period's value will be identical to the most recently observed value ($Y_{t+1} = Y_t$).
C. The historical overall mean of all data points.
D. A linear regression with 50 engineered polynomial features.
**Answer:** B
**Explanation:** The Naïve method simply projects the latest observed point into the future, providing a fundamental baseline comparison.
---

### 5. If actual test sales are 200 units and the model forecasts 180 units, what is the Absolute Error?
A. -20
B. 20
C. 400
D. 0.10
**Answer:** B
**Explanation:** Absolute Error is $|Actual - Forecast| = |200 - 180| = 20$ units.
---