# Train-Test Split, Cross-Validation & Avoiding Data Leakage

The true measure of a machine learning model is its ability to generalize to **unseen future data**. Evaluating a model on the same data it was trained on produces overly optimistic performance estimates due to **overfitting**. Mastering holdout splitting, Stratified K-Fold Cross-Validation, and rigorous leakage prevention is a core competency for data analysts.

---

## 1. Train-Test Split: Holdout Validation

The simplest validation strategy splits historical data into two disjoint subsets:
- **Training Set (typically 70-80%):** Used by the estimator to learn optimal weights and parameters.
- **Testing Set (typically 20-30%):** Kept in a vault until training is complete to assess real-world out-of-sample generalization.

```python
from sklearn.model_selection import train_test_split

X = df.drop(columns=['target'])
y = df['target']

# 80% Train, 20% Test with fixed reproducibility seed
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.20, 
    random_state=42,
    stratify=y  # Essential for imbalanced classification!
)
```

> **Why `stratify=y` Matters:**  
> In customer churn where only 5% of users churn, a random split might accidentally assign 8% churners to the test set and only 3% to the train set. Stratification preserves identical class ratios across both splits!

---

## 2. K-Fold Cross-Validation

A single train-test split can yield misleading results if the random split happens to contain an unusually easy or hard test set. **K-Fold Cross-Validation** divides the data into $K$ equal folds:
- The model trains on $K-1$ folds and tests on the remaining fold.
- This process repeats $K$ times so every fold acts as the validation set once.
- The final metric is the average performance across all $K$ iterations.

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Compute 5-fold cross validation scores
scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='roc_auc')

print(f"5-Fold ROC-AUC Scores: {scores.round(3)}")
print(f"Mean ROC-AUC: {scores.mean():.3f} (+/- {scores.std():.3f})")
```

---

## 3. Data Leakage: The #1 Killer of Production ML Models

**Data leakage** occurs when information from outside the training dataset (such as the target variable or future test set distributions) inadvertently influences model training:

### Major Sources of Data Leakage:
1. **Global Imputation/Scaling:** Computing the global mean of a column across the entire dataset before calling `train_test_split`.
2. **Lookahead Leakage:** In time series, using future data to predict the past.
3. **Duplicate / Clustered Rows:** Having multiple transactions from the exact same user present in both train and test splits.

---

## 4. Bulletproof Pipelines with Scikit-Learn `Pipeline`

To guarantee that transformers are fit exclusively on training folds during cross-validation, wrap steps in a Scikit-Learn `Pipeline`:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Safe pipeline: Scaling is fit strictly inside each CV fold!
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression())
])

# Evaluates with zero data leakage
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='accuracy')
```

---

# Multiple Choice Questions

### 1. What is the primary purpose of setting `stratify=y` in `train_test_split` for classification?
A. It speeds up the splitting operation by parallelizing it.
B. It ensures that the class distribution proportions in the train and test sets mirror the original dataset proportions.
C. It sorts the dataset alphabetically by target.
D. It automatically imputes missing values in target $y$.
**Answer:** B
**Explanation:** Stratification guarantees that minority classes are represented in identical proportions in both training and test partitions, preventing sampling bias.
---

### 2. In 5-Fold Cross-Validation, how many times is the model trained and evaluated?
A. 1 time
B. 5 times
C. 25 times
D. 10 times
**Answer:** B
**Explanation:** The dataset is partitioned into 5 folds. The model trains 5 separate times, each time using 4 folds for training and 1 fold for evaluation.
---

### 3. Which of the following constitutes severe **Data Leakage**?
A. Computing the mean of `X_train` and using it to impute missing values in both `X_train` and `X_test`.
B. Fitting a `StandardScaler` on the entire combined dataset ($X$) before splitting into train and test sets.
C. Evaluating test set predictions with the Confusion Matrix.
D. Setting `random_state=42` for reproducibility.
**Answer:** B
**Explanation:** Computing scaling statistics over the full dataset before splitting incorporates knowledge of test set distributions into the training data, producing falsely optimistic validation scores.
---

### 4. What is the benefit of wrapping data preprocessing and model estimators inside a Scikit-Learn `Pipeline`?
A. It eliminates the need for Python virtual environments.
B. It automatically prevents data leakage during cross-validation by fitting transformers solely on the training folds of each split.
C. It compiles Python code to native C++ automatically.
D. It prevents the model from ever overfitting.
**Answer:** B
**Explanation:** `Pipeline` encapsulates transformations and estimators so that during cross-validation, `fit` is called strictly on the $K-1$ training folds, preventing leakage into the validation fold.
---

### 5. Why is a standard randomized K-Fold Cross Validation unsuitable for temporal (time series) forecasting?
A. It cannot handle floating point timestamps.
B. It randomly shuffles future observations into training folds, causing temporal lookahead bias.
C. It reduces the size of the dataset to zero.
D. It only works on binary classification.
**Answer:** B
**Explanation:** Standard K-Fold shuffles observations arbitrarily. In time series, future events cannot be used to train models predicting the past. TimeSeriesSplit (expanding window) must be used instead.
---