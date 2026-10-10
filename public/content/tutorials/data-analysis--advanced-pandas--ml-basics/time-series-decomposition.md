# Trend, Seasonality & Residual Decomposition

Time series data in business contexts (e.g., e-commerce order volumes, server API loads, electricity demand) is driven by multiple overlapping dynamics. **Classical Time Series Decomposition** untangles raw metrics into three distinct, interpretable components: **Trend**, **Seasonality**, and **Residual Noise**.

---

## 1. The Core Components of Time Series

1. **Trend ($T_t$):** The overarching long-term directional movement of the metric (e.g., year-over-year revenue expansion or contraction).
2. **Seasonality ($S_t$):** Recurring, predictable periodic patterns tied to the calendar (e.g., weekly weekend spikes, holiday surges every November/December).
3. **Residual Noise ($R_t$ or $I_t$):** The irregular, random variations remaining after removing trend and seasonality. Residuals reflect unexpected events, promotions, or pure stochastic noise.

---

## 2. Additive vs Multiplicative Decomposition

Choosing the proper decomposition mathematical model is crucial:

### Additive Model
$$Y_t = T_t + S_t + R_t$$
- **When to use:** When the magnitude of seasonal fluctuations remains constant regardless of whether the overall trend is increasing or decreasing.

### Multiplicative Model
$$Y_t = T_t \times S_t \times R_t$$
- **When to use:** When the seasonal oscillations grow proportionally as the overall trend increases (very common in growing startups, revenue, and web traffic).

---

## 3. Implementing Decomposition with `statsmodels`

In Python, the `statsmodels` library provides `seasonal_decompose` and `STL` (Seasonal and Trend decomposition using Loess):

```python
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

# 1. Prepare continuous daily indexed time series
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date').asfreq('D')

# Fill small gaps if necessary
df['orders'] = df['orders'].interpolate(method='linear')

# 2. Decompose (period=7 for weekly seasonality in daily data)
result = seasonal_decompose(df['orders'], model='additive', period=7)

# 3. Access components
trend = result.trend
seasonal = result.seasonal
resid = result.resid

# 4. Plot all 4 charts (Observed, Trend, Seasonal, Residual)
fig = result.plot()
fig.set_size_inches(10, 8)
plt.tight_layout()
plt.show()
```

---

## 4. Modern STL Decomposition (Loess Smoothing)

Classical decomposition suffers when seasonality drifts over time or when outliers distort moving averages. **STL** provides robust, non-parametric smoothing:

```python
from statsmodels.tsa.seasonal import STL

stl = STL(df['orders'], period=7, robust=True)
res_stl = stl.fit()
res_stl.plot()
plt.show()
```

---

# Multiple Choice Questions

### 1. When should an analyst choose a **multiplicative** decomposition model over an additive one?
A. When the time series has only 3 data points.
B. When the seasonal variations expand proportionally as the overall level of the trend increases.
C. When the series has zero random noise.
D. When analyzing negative temperature data.
**Answer:** B
**Explanation:** If seasonal swings amplify as sales volume doubles or triples over years, the seasonal component is proportional to trend, necessitating a multiplicative relationship ($Y = T \times S \times R$).
---

### 2. In daily retail sales data exhibiting a recurring weekly pattern (Saturday peaks and Tuesday troughs), what value should be assigned to the `period` parameter in `seasonal_decompose`?
A. 12
B. 365
C. 7
D. 30
**Answer:** C
**Explanation:** For daily data with a weekly cycle, each seasonal period completes every 7 observations.
---

### 3. What does a large, sudden spike in the **Residual** component typically indicate in business analysis?
A. A change in the calendar year.
B. Normal predictable weekly seasonality.
C. An abnormal, unexpected real-world event (such as a viral marketing campaign, supply chain outage, or website outage).
D. An error in the Python floating point interpreter.
**Answer:** C
**Explanation:** Residuals capture irregularities unexplainable by the baseline trend and periodic seasonal swings. Sudden spikes signify outlier events.
---

### 4. What advantage does **STL** (Seasonal-Trend decomposition using Loess) offer over classical decomposition?
A. It cannot handle missing data.
B. It can handle evolving seasonality patterns over time and offers robust outlier resistance.
C. It only runs on GPU hardware.
D. It guarantees zero residuals.
**Answer:** B
**Explanation:** STL uses local weighted regression (Loess), allowing seasonal patterns to change gracefully over time while dampening the distortive impact of outliers when `robust=True`.
---

### 5. If an additive decomposition has an observed value of 250, a trend of 200, and a seasonal adjustment of +40, what is the value of the residual?
A. -10
B. +10
C. +50
D. 0
**Answer:** B
**Explanation:** In an additive model, $Y = T + S + R$. Substituting values: $250 = 200 + 40 + R \implies R = 250 - 240 = +10$.
---