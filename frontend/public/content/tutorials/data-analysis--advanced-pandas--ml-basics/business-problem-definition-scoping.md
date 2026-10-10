# Business Problem Definition & KPI Scoping

A data project rarely fails because of bad code or weak machine learning algorithms—**it fails because it solved the wrong problem**. Top data analysts bridge the gap between vague corporate executive requests (*"Our customer churn is too high, fix it"*) and rigorous, measurable data engineering and analytics deliverables.

---

## 1. The CRISP-DM Framework

**CRISP-DM (Cross-Industry Standard Process for Data Mining)** provides a structured lifecycle for analytics projects:

```
[1. Business Understanding] <---> [2. Data Understanding]
            |                                |
            v                                v
    [6. Deployment]                 [3. Data Preparation]
            ^                                |
            |                                v
    [5. Evaluation]         <--->     [4. Modeling]
```

---

## 2. Deconstructing Vague Business Requests

| Vague Executive Request | Root Business Pain Point | Scoped Analytical Objective | Measurable KPI Metric |
| :--- | :--- | :--- | :--- |
| *"Help us stop losing customers."* | Telecom subscriber churn eroding ARR. | Train a classification model to identify subscribers with $>70\%$ churn risk 60 days prior to contract expiration. | Reduce monthly churn rate from 3.2% to 2.4%; achieve ROC-AUC $> 0.82$. |
| *"Our warehouse inventory costs are out of control."* | Overstocking perishable goods and stockouts on top sellers. | Build a 14-day rolling demand forecasting model per SKU-store pair. | Reduce safety stock holding costs by $120,000; keep Stockout Rate $< 1.5\%$. |
| *"Marketing wants to spend budget better."* | Low conversion rates on generic email blasts. | RFM & K-Means clustering to tailor promotional discounts to specific segments. | Increase email click-through conversion rate from 1.8% to 3.5%. |

---

## 3. Scoping Constraints & Success Criteria

Before writing a single line of SQL or Python, document the **Project Charter**:

1. **Problem Statement:** Concise summary of the current operational deficiency.
2. **Target Variable Definition:** What constitutes the outcome event? (e.g., *"A customer who has placed zero orders in the last 90 consecutive days"*).
3. **Primary Metric vs Secondary Guardrail Metric:**
   - *Primary:* Precision / Recall on churners.
   - *Guardrail Metric:* Margin erosion (do not offer 50% discounts to users who would have stayed anyway!).
4. **Actionability:** What specific business action will be taken based on predictions? If marketing has no capacity or budget to intervene on flagged users, the model has zero ROI.

---

## 4. Cost-Benefit Matrix (Financial Framing)

Always translate model confusion matrix cells into financial terms:

$$\text{Net Benefit} = (TP \times \text{Retained LTV}) - (FP \times \text{Campaign Cost}) - (FN \times \text{Lost Customer Cost})$$

Showing an executive a cost-benefit calculation wins budget approval 100 times faster than showing an ROC-AUC curve!

---

# Multiple Choice Questions

### 1. In the CRISP-DM lifecycle, what is the mandatory first phase of any data analytics project?
A. Data Preparation
B. Business Understanding
C. Machine Learning Modeling
D. Model Evaluation
**Answer:** B
**Explanation:** CRISP-DM begins with Business Understanding—clarifying project objectives, organizational context, and success criteria from a business perspective before touching data.
---

### 2. An executive states: *"Improve our supply chain."* Which of the following represents a properly scoped analytical objective?
A. "Run deep learning neural networks on all warehouse tables."
B. "Forecast daily unit demand for top 50 SKUs across 10 distribution hubs with a MAPE under 8% to reduce stockouts by 15%."
C. "Export all CSV files into Tableau dashboards."
D. "Delete older inventory records."
**Answer:** B
**Explanation:** Option B specifies clear scope (top 50 SKUs, 10 hubs), measurable target metric (MAPE $< 8\%$), and direct business impact (reduce stockouts by 15%).
---

### 3. What is the role of a **Guardrail Metric** in an analytics project?
A. It speeds up SQL query processing.
B. It ensures that optimizing the primary success metric does not inadvertently harm another critical business dimension (e.g., maximizing revenue while causing customer complaints to surge).
C. It limits the size of Python scripts to under 100 lines.
D. It prevents the model from being deployed to production.
**Answer:** B
**Explanation:** Guardrail metrics protect broader business health by monitoring unintended consequences while pursuing primary KPI targets.
---

### 4. Why should a data analyst establish an actionable operational workflow *before* training a predictive model?
A. Because models cannot be saved to disk without a workflow.
B. If the business lacks the personnel, tools, or budget to act upon model outputs (e.g., no team to call at-risk churners), the model generates zero real-world value.
C. To prevent Python memory errors.
D. To satisfy database foreign key constraints.
**Answer:** B
**Explanation:** Predictive insights only generate ROI if the organization has an operational mechanism to execute interventions based on those predictions.
---

### 5. In evaluating a churn retention campaign, what does the term **Net Benefit** capture?
A. Total model training runtime.
B. The financial revenue saved by successfully retaining churners minus the intervention marketing costs and the cost of false alarms.
C. The R-squared score multiplied by 100.
D. The number of rows in the SQL staging table.
**Answer:** B
**Explanation:** Net Benefit financial framing computes the real dollar return: Value of retained customers minus campaign and operational costs.
---