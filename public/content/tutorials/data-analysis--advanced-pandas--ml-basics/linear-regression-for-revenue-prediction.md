# Linear Regression: Coefficients, R-Squared & MSE

**Ordinary Least Squares (OLS) Linear Regression** is the foundation of predictive modeling in business analytics. Whether forecasting quarterly corporate revenue, estimating customer lifetime value (LTV), or quantifying price elasticity, linear regression provides an interpretable, transparent mathematical model that executive leadership can trust.

---

## 1. The Mathematical Formulation

Linear regression models the relationship between a continuous dependent target variable $Y$ and one or more independent predictor features $X$:

$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_p X_p + \epsilon$$

Where:
- $\beta_0$ is the **intercept** (the expected baseline value of $Y$ when all $X=0$).
- $\beta_j$ represents the **slope coefficient** (the expected change in $Y$ for every 1-unit increase in $X_j$, holding all other variables constant).
- $\epsilon$ is the random Gaussian error term.

---

## 2. Training a Revenue Prediction Model in Scikit-Learn

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Features: marketing spend across channels
features = ['adwords_spend', 'meta_ads_spend', 'influencer_spend', 'store_footfall']
X = df[features]
y = df['quarterly_revenue']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

# Train model
lr = LinearRegression()
lr.fit(X_train, y_train)

# Generate predictions
y_pred = lr.predict(X_test)
```

---

## 3. Interpreting Regression Coefficients

In business analytics, explaining the **coefficients** is far more important than just printing predictions:

```python
# Create coefficient dataframe
coef_df = pd.DataFrame({
    'Feature': features,
    'Coefficient (ROI)': lr.coef_
}).sort_values(by='Coefficient (ROI)', ascending=False)

print(f"Baseline Intercept: ${lr.intercept_:,.2f}")
print(coef_df)
```

### Example Interpretation:
If `meta_ads_spend` has a coefficient of **4.25**, it implies:  
*"For every additional $1.00 invested in Meta Advertising, quarterly revenue increases by $4.25, assuming AdWords and influencer spend remain constant."*

---

## 4. Key Performance Metrics

| Metric | Formula | Interpretation |
| :--- | :--- | :--- |
| **$R^2$ (Coefficient of Determination)** | $1 - \frac{SS_{res}}{SS_{tot}}$ | Proportion of target variance explained by features (0.0 to 1.0). |
| **MAE (Mean Absolute Error)** | $\frac{1}{n} \sum |y - \hat{y}|$ | Average dollar forecast error in raw currency units. |
| **MSE (Mean Squared Error)** | $\frac{1}{n} \sum (y - \hat{y})^2$ | Penalizes large catastrophic outliers quadratically. |
| **RMSE (Root MSE)** | $\sqrt{MSE}$ | Error standard deviation in original unit of measurement. |

```python
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"Model R-Squared: {r2:.3f}")
print(f"MAE:  ${mae:,.2f}")
print(f"RMSE: ${rmse:,.2f}")
```

---

# Multiple Choice Questions

### 1. In a multiple linear regression model, what does a coefficient of $\beta = 3.50$ for the feature `email_campaigns` mean?
A. Total company revenue will increase by 3.50% every year.
B. For each additional email campaign sent, revenue is expected to increase by $3.50, holding all other features constant.
C. The model has an accuracy of 3.50%.
D. The feature has no statistical effect on revenue.
**Answer:** B
**Explanation:** A linear regression coefficient represents the expected marginal change in the dependent target variable per one-unit increase in that feature, ceteris paribus (all else held equal).
---

### 2. What does an $R^2$ score of 0.82 signify to business stakeholders?
A. The model makes incorrect predictions 18% of the time.
B. 82% of the total variance in the target variable is explained by the independent predictor features in the model.
C. The model is overfitted and must be retrained.
D. The $p$-value is 0.82.
**Answer:** B
**Explanation:** $R^2$ (coefficient of determination) quantifies the proportion of variation in the dependent target variable that is predictable from the independent variables.
---

### 3. Why is **RMSE** often preferred over **MSE** when communicating results to non-technical executives?
A. RMSE runs on GPU hardware.
B. RMSE is expressed in the exact same original units as the target variable (e.g., dollars or units sold), whereas MSE is squared (e.g., dollars squared).
C. RMSE is always bounded between 0 and 1.
D. MSE can only be calculated on binary outcomes.
**Answer:** B
**Explanation:** Squaring errors in MSE creates unintuitive units (e.g., "squared dollars"). Taking the square root restores the metric to the original scale of measurement.
---

### 4. What happens if two input features in a multiple linear regression model are almost perfectly correlated ($r = 0.99$)?
A. Model accuracy reaches 100%.
B. Multicollinearity occurs, making coefficient estimates unstable, inflating standard errors, and obscuring feature importance.
C. Scikit-learn throws an unhandled OutOfMemory exception.
D. $R^2$ automatically drops to 0.
**Answer:** B
**Explanation:** Severe multicollinearity makes it impossible for OLS to isolate the individual marginal effect of each collinear predictor, causing erratic coefficient swings.
---

### 5. If an analyst observes high $R^2$ on the training set (0.95) but low $R^2$ on the test set (0.41), what problem is present?
A. Underfitting
B. Severe Overfitting (high variance)
C. Low learning rate
D. Vanishing gradient
**Answer:** B
**Explanation:** When training performance far exceeds test set generalization, the model has memorized sample noise rather than generalizable underlying relationships.
---