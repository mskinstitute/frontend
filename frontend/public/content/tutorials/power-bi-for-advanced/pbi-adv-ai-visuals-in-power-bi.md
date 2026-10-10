# AI-Powered Visuals: Key Influencers & Decomposition Tree

Microsoft has invested billions of dollars integrating automated machine learning directly into Power BI visuals. Rather than requiring users to manually formulate hypotheses, **AI Visuals** scan underlying data patterns to explain root causes and decompose metrics automatically.

---

## 1. The Key Influencers Visual: Automated ML Regression

The **Key Influencers** visual analyzes an outcome metric (e.g., *Customer Churn*, *Late Deliveries*, *High Employee Satisfaction*) and uses built-in logistic or linear regression to tell you:
- *"What factors drive a customer to Churn?"*
- *"What factors increase sales margin?"*

```
+-----------------------------------------------------------------------------+
| KEY INFLUENCERS: What influences Customer Churn to be "Yes"?               |
|                                                                             |
| When...                                    The likelihood of Churn is...    |
| Contract is Month-to-month  -------------> 4.2x More Likely                 |
| Internet Service is Fiber optic ---------> 2.8x More Likely                 |
| Payment Method is Electronic check ------> 2.1x More Likely                 |
| Tenure in Months is < 6 -----------------> 1.9x More Likely                 |
+-----------------------------------------------------------------------------+
```

### How to Configure Key Influencers:
1. Insert the **Key Influencers** visual on the canvas.
2. Drag the target outcome into **Analyze** (e.g., `Dim_Customer[Churn]`).
3. Drag candidate explanatory drivers into **Explain by** (e.g., `Contract`, `TenureMonths`, `MonthlyCharges`, `TechSupport`).
4. Power BI automatically runs regression models in the background and ranks the top statistical drivers!

---

## 2. The Decomposition Tree: Ad-Hoc Root Cause Exploration

The **Decomposition Tree** visual allows executives to break down a high-level metric across any sequence of dimensions on demand:

```
[Total Sales: $10.0M]
        |
        +---> High Split: Category
        |        ├── Technology: $5.0M
        |        ├── Furniture:  $3.0M
        |        └── Supplies:   $2.0M
        |
        +---> AI Split: "Highest Value"
                 └── Technology ---> Region
                         ├── North: $2.4M (AI identifies top driver!)
                         └── West:  $1.6M
```

### The "AI Split" Feature:
Instead of manually choosing the next dimension, users can click the **Sparkle Icon (+)**:
- **High Value:** Power BI automatically scans all dimensions and picks the attribute with the greatest positive contribution!
- **Low Value:** Automatically identifies the attribute driving the greatest decline.

---

# Multiple Choice Questions

### 1. What underlying statistical technique powers the Key Influencers visual when analyzing a binary categorical outcome (such as Churn = Yes/No)?
A. Sorting algorithms
B. Logistic Regression
C. Linear interpolation
D. Monte Carlo simulation
**Answer:** B
**Explanation:** For categorical target variables, the Key Influencers visual runs logistic regression to evaluate the relative odds ratio (likelihood multiplier) of each factor.

### 2. In a Decomposition Tree visual, what does clicking the "High value" option (marked with an AI sparkle icon) do?
A. It deletes low values
B. It automatically evaluates all dimensions in the "Explain by" bucket and dynamically splits the metric by the dimension that contains the highest absolute value
C. It sorts the chart alphabetically
D. It opens Microsoft Excel
**Answer:** B
**Explanation:** The AI split feature automatically evaluates all available dimensions and selects the attribute that reveals the largest contributor to the metric.

### 3. Which fields well in the Key Influencers visual configuration holds the metric you want to understand or predict?
A. Explain by
B. Analyze
C. Tooltip
D. Drillthrough
**Answer:** B
**Explanation:** The **Analyze** well holds the primary outcome metric or attribute being investigated, while the **Explain by** well holds candidate causal drivers.

### 4. What second tab inside the Key Influencers visual groups related drivers into distinct customer personas or behavioral cohorts?
A. Top Segments
B. Raw Data
C. Settings
D. Security
**Answer:** A
**Explanation:** The **Top Segments** tab clusters multiple combined conditions (e.g., "Month-to-month contract AND No tech support") into discrete risk or opportunity segments.

### 5. Why are AI visuals valuable during executive board meetings?
A. They make the presenter look like a software developer
B. They allow live, ad-hoc root cause exploration without requiring pre-built static drill paths or specialized data science coding
C. They disable user slicers
D. They translate voice into text
**Answer:** B
**Explanation:** AI visuals democratize data science, enabling business leaders to uncover root causes and explore multi-dimensional drivers dynamically during discussions.

---
