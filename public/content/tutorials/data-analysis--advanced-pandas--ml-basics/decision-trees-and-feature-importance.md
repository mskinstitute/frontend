# Decision Trees & Feature Importance Interpretation

**Decision Trees** are non-parametric supervised learning models that partition feature space into rectangular regions using hierarchical if-then rules. Because they mimic human logical reasoning and automatically capture non-linear relationships and feature interactions, decision trees are one of the most interpretable tools in a business analyst's toolkit.

---

## 1. How Decision Trees Split: Gini Impurity vs Entropy

At each internal node, the decision tree algorithm tests all available features and numerical thresholds to find the split that maximizes **information gain** (reduction in impurity):

### Gini Impurity
$$Gini = 1 - \sum_{i=1}^{C} p_i^2$$
- A pure node (100% class A) has $Gini = 0.0$.
- An evenly mixed binary node (50% A, 50% B) has maximum impurity $Gini = 0.50$.

### Entropy & Information Gain
$$Entropy = -\sum_{i=1}^{C} p_i \log_2(p_i)$$

---

## 2. Preventing Overfitting: Regularization Hyperparameters

An unconstrained decision tree will continue splitting until every training leaf contains exactly 1 sample, memorizing noise and achieving 100% training accuracy but abysmal test accuracy.

### Critical Hyperparameters:
- `max_depth`: Limits how deep the tree can grow (e.g., 3 to 6 levels for interpretability).
- `min_samples_split`: Minimum samples required to split an internal node.
- `min_samples_leaf`: Minimum samples required to exist at a leaf node (e.g., 20-50).

```python
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
import matplotlib.pyplot as plt

# Pruned decision tree for business interpretability
dt = DecisionTreeClassifier(
    max_depth=4, 
    min_samples_leaf=25, 
    criterion='gini', 
    random_state=42
)
dt.fit(X_train, y_train)
```

---

## 3. Extracting and Visualizing Feature Importance

Decision trees calculate **MDI (Mean Decrease in Impurity)**, reflecting the total weighted reduction in Gini impurity brought by each feature across all splits:

```python
import pandas as pd

feat_importance = pd.DataFrame({
    'Feature': X_train.columns,
    'Importance': dt.feature_importances_
}).sort_values(by='Importance', ascending=False)

print(feat_importance)
```

---

## 4. Visualizing the Tree for Executive Presentations

```python
plt.figure(figsize=(20, 10))
plot_tree(
    dt, 
    feature_names=X_train.columns, 
    class_names=['Retained', 'Churned'],
    filled=True, 
    rounded=True, 
    fontsize=10
)
plt.title("Executive Decision Tree: Customer Churn Drivers")
plt.show()
```

---

# Multiple Choice Questions

### 1. What is the value of the Gini Impurity for a completely pure leaf node where all observations belong to the same class?
A. 1.0
B. 0.50
C. 0.0
D. -1.0
**Answer:** C
**Explanation:** A pure node has $p_1 = 1.0$, giving $Gini = 1 - (1)^2 = 0$. Pure nodes have zero impurity.
---

### 2. Why does an unconstrained decision tree with unlimited `max_depth` and `min_samples_split=2` typically suffer from severe overfitting?
A. It runs out of RAM.
B. It continues splitting until every leaf contains individual data points, memorizing peculiarities and random noise of the training data.
C. It cannot compute Gini impurity.
D. It drops all categorical columns.
**Answer:** B
**Explanation:** Without regularization, trees grow indefinitely, creating hyper-specific partitions that fit training quirks rather than true population trends.
---

### 3. Which hyperparameter prevents overfitting by ensuring that every leaf node contains at least a specified minimum number of samples?
A. `n_estimators`
B. `min_samples_leaf`
C. `learning_rate`
D. `criterion`
**Answer:** B
**Explanation:** `min_samples_leaf` prevents the creation of isolated leaves containing solitary outliers by mandating a minimum population threshold.
---

### 4. How does feature scaling (e.g., standardizing between 0 and 1) affect decision tree splits?
A. It speeds up tree training by 10x.
B. It has zero effect on tree splits because splits depend only on the monotonic ordering of feature values.
C. It alters the Gini impurity calculation.
D. It prevents trees from overfitting.
**Answer:** B
**Explanation:** Decision trees evaluate thresholds ($x \le c$) based on rank order. Linear or monotonic scaling does not change whether a value is greater than or less than a threshold.
---

### 5. What does **Feature Importance** in a Scikit-Learn Decision Tree measure?
A. The $p$-value of each feature under a t-distribution.
B. The normalized total reduction of the impurity criterion (Gini or Entropy) contributed by each feature across all tree splits.
C. The correlation coefficient with the target.
D. The percentage of non-null values in each column.
**Answer:** B
**Explanation:** Feature importance (MDI) measures how much a feature's split nodes reduce the weighted impurity throughout the tree structure.
---