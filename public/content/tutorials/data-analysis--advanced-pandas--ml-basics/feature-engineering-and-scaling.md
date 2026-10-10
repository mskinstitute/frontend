# Feature Engineering: One-Hot Encoding, StandardScaler & MinMax

Raw business data (text strings, timestamps, disparate numerical scales) cannot be ingested directly into mathematical estimators like Linear Regression, Logistic Regression, or Support Vector Machines. **Feature Engineering & Preprocessing** transforms raw columns into numerical representations while eliminating numerical scale distortion through feature scaling.

---

## 1. Encoding Categorical Variables

Algorithms require numeric matrices. Categorical strings must be converted systematically:

### A. One-Hot Encoding (Nominal Categories)
Used for unordered categories (e.g., `Department`: ['Sales', 'HR', 'Engineering']).
- Creates binary dummy indicator columns (0 or 1).
- **Dummy Variable Trap:** When using linear models, set `drop='first'` to remove perfect collinearity!

```python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

encoder = OneHotEncoder(drop='first', sparse_output=False)
encoded_array = encoder.fit_transform(df[['department']])
encoded_df = pd.DataFrame(encoded_array, columns=encoder.get_feature_names_out())
```

### B. Ordinal Encoding (Ordered Categories)
Used when categories have an inherent rank (e.g., ['Junior', 'Mid', 'Senior', 'Lead'] or ['Low', 'Medium', 'High']).
```python
from sklearn.preprocessing import OrdinalEncoder

edu_order = [['High School', 'Bachelors', 'Masters', 'PhD']]
ord_enc = OrdinalEncoder(categories=edu_order)
df['education_level'] = ord_enc.fit_transform(df[['education']])
```

---

## 2. Numerical Feature Scaling

When features have radically different scales (e.g., `Age` ranging from 18 to 70 vs `Annual_Salary` ranging from $30,000 to $300,000), distance-based algorithms (KNN, K-Means) and gradient descent algorithms (Logistic Regression, Neural Nets) will treat salary as 10,000 times more important than age!

### Scaling Methods Comparison

| Scaler | Formula | Resulting Distribution | Best Used When |
| :--- | :--- | :--- | :--- |
| **StandardScaler (Z-score)** | $z = rac{x - mu}{sigma}$ | Mean $mu = 0$, Std $sigma = 1$ | Data is Gaussian/normal; default for ML |
| **MinMaxScaler** | $x_{norm} = rac{x - x_{min}}{x_{max} - x_{min}}$ | Bounded strictly between $[0, 1]$ | Neural nets, image pixels, non-Gaussian |
| **RobustScaler** | $x_{rob} = rac{x - Q_2}{IQR}$ | Median 0, scaled by IQR | Dataset has severe uncleaned outliers |

---

## 3. Implementing Scalers with Scikit-Learn

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Initialize scaler
scaler = StandardScaler()

# Crucial rule: Fit ONLY on training data to prevent leakage!
X_train_scaled = scaler.fit_transform(X_train[['age', 'annual_salary']])

# Transform test data using fitted training parameters (do NOT refit!)
X_test_scaled = scaler.transform(X_test[['age', 'annual_salary']])
```

> **Cardinal Rule of Preprocessing:**  
> Never call `fit()` or `fit_transform()` on the entire dataset or test dataset! Scalers must learn parameters ($mu, sigma, x_{min}, x_{max}$) solely from `X_train`. Calling `fit()` on test data causes **Data Leakage**.

---

## 4. Tree-Based Algorithms Exception

> [!NOTE]
> Tree-based algorithms (Decision Trees, Random Forest, XGBoost, LightGBM) make splits based on monotonic feature ordering ($x > c$) and are **completely invariant to monotonic scale**. Scaling is not required for decision trees, but is mandatory for linear models, logistic regression, SVMs, and neural networks.

---

# Multiple Choice Questions

### 1. Why must `scaler.fit_transform()` be called on `X_train`, but only `scaler.transform()` on `X_test`?
A. Calling `fit_transform` on `X_test` causes a Python syntax error.
B. To prevent data leakage; fitting on `X_test` would leak test distribution parameters (mean and standard deviation) into the model pipeline.
C. `scaler.transform()` compresses data to half its original byte size.
D. `X_test` does not contain numeric data.
**Answer:** B
**Explanation:** Test data must represent unseen future production data. Calculating statistics from test data contaminates the model evaluation with prior knowledge of the test set distribution.
---

### 2. Which scaling method transforms feature values to have a mean of 0 and a standard deviation of 1?
A. MinMaxScaler
B. MaxAbsScaler
C. StandardScaler (Z-score standardization)
D. PowerTransformer
**Answer:** C
**Explanation:** StandardScaler subtracts the feature mean $mu$ and divides by standard deviation $sigma$, resulting in a standardized normal distribution with $mu=0$ and $sigma=1$.
---

### 3. Which family of machine learning algorithms is mathematically invariant to feature scaling and requires NO feature normalization?
A. K-Nearest Neighbors (KNN)
B. Support Vector Machines (SVM)
C. Tree-based models (Decision Trees, Random Forests, XGBoost)
D. Logistic Regression with Ridge Penalty
**Answer:** C
**Explanation:** Decision trees partition data by comparing single features against split thresholds ($x_i ge c$). Multiplying or shifting values does not alter the relative order of split points.
---

### 4. What is the **Dummy Variable Trap** in linear regression models when one-hot encoding categorical variables?
A. When an integer column is accidentally treated as text.
B. Perfect multicollinearity caused by including all dummy indicator columns, where one dummy column can be predicted as a linear combination of the others ($k-1$).
C. When categorical encoding creates more than 10,000 columns.
D. When categorical values contain NaN values.
**Answer:** B
**Explanation:** If a category has 3 levels and all 3 dummy columns are included alongside an intercept, their sum equals 1, creating perfect multicollinearity. Setting `drop='first'` avoids this.
---

### 5. If a dataset contains extreme outliers that cannot be immediately removed, which scaler is most resilient because it uses the median and Interquartile Range (IQR)?
A. StandardScaler
B. RobustScaler
C. MinMaxScaler
D. Normalizer
**Answer:** B
**Explanation:** RobustScaler centers using the median ($Q_2$) and scales using the Interquartile Range ($Q_3 - Q_1$), making it robust against extreme outlier distortion.
---