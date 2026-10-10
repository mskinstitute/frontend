# Classification Metrics: Confusion Matrix, Precision, Recall, F1 & ROC-AUC

In enterprise data science, **raw accuracy is often a dangerous illusion**. In imbalanced business problems—such as fraud detection (0.1% fraud), disease diagnosis, or churn prediction—a dummy model predicting "No Fraud" 100% of the time achieves 99.9% accuracy while delivering zero business value. Professional data analysts evaluate classification systems using the **Confusion Matrix**, **Precision**, **Recall**, **F1-Score**, and **ROC-AUC**.

---

## 1. The Confusion Matrix

```
                         ACTUAL TRUTH
                      Positive       Negative
PREDICTED   Positive [   TP      ] [    FP    ]  --> Precision = TP / (TP + FP)
            Negative [   FN      ] [    TN    ]
                         |
                         v
                    Recall = TP / (TP + FN)
```

- **True Positive (TP):** Fraud correctly predicted as Fraud.
- **True Negative (TN):** Normal user correctly predicted as Normal.
- **False Positive (FP - Type I Error):** False alarm (Normal flagged as Fraud).
- **False Negative (FN - Type II Error):** Catastrophic miss (Fraudster passed undetected).

---

## 2. Precision vs Recall Trade-Off

| Metric | Formula | What it Answers | Optimize When... |
| :--- | :--- | :--- | :--- |
| **Precision** | $\frac{TP}{TP + FP}$ | *"Of all cases flagged positive, how many were truly positive?"* | Cost of False Positive is high (e.g., spam filter blocking urgent email). |
| **Recall (Sensitivity)** | $\frac{TP}{TP + FN}$ | *"Of all actual positive cases, how many did we successfully capture?"* | Cost of False Negative is lethal (e.g., cancer diagnosis, fraud, credit default). |
| **F1-Score** | $2 \times \frac{Precision \times Recall}{Precision + Recall}$ | Harmonic mean balancing both metrics. | Data is imbalanced and both FP and FN matter. |

---

## 3. ROC Curve and ROC-AUC

The **Receiver Operating Characteristic (ROC)** curve plots **True Positive Rate (Recall)** against **False Positive Rate ($FP / [FP+TN]$)** across all possible probability thresholds ($0.0 \to 1.0$).

- **ROC-AUC (Area Under Curve):**
  - **1.0:** Perfect discrimination.
  - **0.5:** Random coin flip (worthless model).
  - **> 0.80:** Excellent discrimination for enterprise production models.

---

## 4. Generating Metrics in Scikit-Learn

```python
from sklearn.metrics import (
    confusion_matrix, 
    classification_report, 
    roc_auc_score, 
    roc_curve
)
import matplotlib.pyplot as plt
import seaborn as sns

# Classification Report
print(classification_report(y_test, y_pred))

# Confusion Matrix Heatmap
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Negative', 'Positive'],
            yticklabels=['Negative', 'Positive'])
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title('Production Confusion Matrix')
plt.show()

# ROC-AUC Score
auc = roc_auc_score(y_test, y_probs)
print(f"ROC-AUC: {auc:.3f}")
```

---

# Multiple Choice Questions

### 1. In a medical screening test where undetected cancer carries fatal consequences, which metric must data analysts prioritize maximizing?
A. Precision
B. Recall (Sensitivity)
C. Specificity
D. Negative Predictive Value
**Answer:** B
**Explanation:** Recall measures the proportion of actual cancer patients correctly diagnosed. Maximizing Recall minimizes False Negatives (fatal missed diagnoses).
---

### 2. What does an ROC-AUC score of 0.50 indicate about a classification model?
A. The model has 50% accuracy on balanced data.
B. The model possesses zero discriminative power and performs no better than random guessing.
C. The model is 100% overfitted.
D. The False Positive Rate is zero.
**Answer:** B
**Explanation:** An AUC of 0.50 corresponds to the diagonal line of chance, meaning the model's ability to rank positive cases higher than negative cases is equivalent to a random coin flip.
---

### 3. Why is the Harmonic Mean used instead of the Arithmetic Mean in calculating the F1-Score?
A. Harmonic mean can be calculated on GPU clusters.
B. Harmonic mean severely penalizes extreme imbalances, preventing a model with 100% precision and 2% recall from receiving an artificially high score.
C. Harmonic mean guarantees zero False Positives.
D. Harmonic mean eliminates the need for test datasets.
**Answer:** B
**Explanation:** If precision is 1.0 and recall is 0.02, arithmetic mean is 0.51, but the harmonic mean (F1) drops to ~0.039, correctly penalizing the dysfunctional balance.
---

### 4. If a model predicts 100 transactions as fraudulent, and 85 are confirmed fraud while 15 are legitimate, what is the Precision?
A. 85%
B. 15%
C. 50%
D. 70%
**Answer:** A
**Explanation:** $Precision = \frac{TP}{TP + FP} = \frac{85}{85 + 15} = \frac{85}{100} = 85\%$.
---

### 5. In credit card fraud where only 0.05% of transactions are fraudulent, why is overall Accuracy an invalid success metric?
A. Accuracy cannot be calculated when datasets exceed 10,000 rows.
B. A naive classifier predicting "Legitimate" for every transaction achieves 99.95% accuracy while missing 100% of fraud cases.
C. Accuracy requires continuous variables.
D. Accuracy causes memory leaks in Scikit-Learn.
**Answer:** B
**Explanation:** The Accuracy Paradox occurs on severely imbalanced datasets, where trivial majority-class classifiers achieve high accuracy while providing zero utility.
---