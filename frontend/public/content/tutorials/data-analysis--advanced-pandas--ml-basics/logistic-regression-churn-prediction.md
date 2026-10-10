# Logistic Regression: Odds Ratios & Customer Churn Prediction

While linear regression predicts continuous numerical outcomes, **Logistic Regression** is the industry standard for modeling binary categorical decisions (e.g., Churn vs Retain, Fraud vs Legitimate, Default vs Repay). By compressing linear combinations through the **Sigmoid (Logit) function**, logistic regression outputs calibrated probabilities bounded strictly between 0 and 1.

---

## 1. The Sigmoid Function & Log-Odds

A standard linear equation can produce predictions from $-\infty$ to $+\infty$, which is mathematically invalid for probabilities. Logistic regression applies the **Sigmoid activation function**:

$$P(Y=1 | X) = \sigma(z) = \frac{1}{1 + e^{-z}}$$

Where $z = \beta_0 + \beta_1 X_1 + \dots + \beta_p X_p$.

### Log-Odds (Logit):
$$\ln\left(\frac{p}{1 - p}\right) = \beta_0 + \beta_1 X_1 + \dots + \beta_p X_p$$

- $\frac{p}{1-p}$ is the **Odds Ratio**.
- Exponentiating a coefficient $e^{\beta_j}$ reveals the multiplicative effect on customer churn odds for each unit change in $X_j$.

---

## 2. Building a Customer Churn Predictor

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

X = df[['monthly_charges', 'tenure_months', 'num_support_tickets', 'contract_is_annual']]
y = df['churned'] # 1 = Churned, 0 = Active

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Best practice: always scale features for Logistic Regression
churn_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', LogisticRegression(random_state=42))
])

churn_pipeline.fit(X_train, y_train)

# Predict probabilities (not just hard 0 or 1 labels!)
churn_probs = churn_pipeline.predict_proba(X_test)[:, 1]
```

---

## 3. Interpreting Odds Ratios for Business Strategy

```python
# Extract coefficients and odds ratios
coefficients = churn_pipeline.named_steps['clf'].coef_[0]
odds_ratios = np.exp(coefficients)

results = pd.DataFrame({
    'Feature': X.columns,
    'Log-Odds (Coef)': coefficients.round(3),
    'Odds Ratio (exp)': odds_ratios.round(3)
}).sort_values(by='Odds Ratio (exp)', ascending=False)

print(results)
```

### Example Insights:
- If `num_support_tickets` has an Odds Ratio of **1.85**: Each additional customer support ticket increases churn odds by **85%**.
- If `contract_is_annual` has an Odds Ratio of **0.32**: Annual contracts reduce churn odds by **68%** compared to monthly contracts!

---

## 4. Probability Threshold Tuning

By default, `predict()` classifies cases as positive if $P \ge 0.50$. In customer retention, proactively reaching out to high-risk customers might warrant a lower threshold (e.g., $P \ge 0.35$):

```python
# Custom business threshold: Flag at 35% churn risk
custom_predictions = (churn_probs >= 0.35).astype(int)
```

---

# Multiple Choice Questions

### 1. What mathematical function maps real numbers from $(-\infty, +\infty)$ to the probability interval $[0, 1]$ in logistic regression?
A. Rectified Linear Unit (ReLU)
B. Sigmoid (Logit) function
C. Softplus function
D. Gaussian kernel
**Answer:** B
**Explanation:** The Sigmoid function $\sigma(z) = \frac{1}{1 + e^{-z}}$ asymptotes at 0 and 1, converting any continuous linear score into a valid probability.
---

### 2. In a churn prediction model, if a feature has an Odds Ratio of $e^{\beta} = 1.0$, what is its impact on customer churn?
A. It doubles the likelihood of churn.
B. It reduces churn to absolute zero.
C. It has no effect on the odds of churn ($1.0 \times$ baseline odds).
D. It indicates an invalid model convergence.
**Answer:** C
**Explanation:** An odds ratio of 1.0 indicates that a change in the predictor feature does not alter the odds of the outcome event occurring.
---

### 3. Why is feature scaling (e.g., `StandardScaler`) essential before fitting a regularized Logistic Regression model in Scikit-Learn?
A. Logistic regression only accepts numbers between 0 and 1.
B. Unscaled features with large numerical magnitudes receive disproportionate penalty shrinkage under L1/L2 regularization compared to smaller scale features.
C. To convert strings into categories.
D. To prevent divide-by-zero errors in the sigmoid formula.
**Answer:** B
**Explanation:** L1/L2 regularization penalizes large weights uniformly. If a feature has large values, its coefficient is artificially small and escapes penalization, distorting feature weights unless features are scaled.
---

### 4. What does `model.predict_proba(X_test)[:, 1]` return in Scikit-Learn binary classification?
A. The accuracy score of the test set.
B. The predicted continuous probability that each observation belongs to Class 1 (positive class).
C. The discrete binary 0 or 1 labels.
D. The log-likelihood error of the loss function.
**Answer:** B
**Explanation:** In scikit-learn, `predict_proba()` returns an array with shape $(N, 2)$ where column 0 is $P(Y=0)$ and column 1 is $P(Y=1)$.
---

### 5. If a telecommunications company wants to proactively identify as many potential churners as possible and is willing to accept a few false alarms, how should they adjust the decision threshold?
A. Increase the classification threshold from 0.50 to 0.85.
B. Lower the classification threshold from 0.50 to 0.30.
C. Set the threshold to 1.0.
D. Delete 50% of the training dataset.
**Answer:** B
**Explanation:** Lowering the probability threshold makes the model more sensitive to positive cases, increasing Recall at the expense of Precision.
---