# Integrating Azure Machine Learning Models into Power BI

While Power BI provides built-in automated visuals (Key Influencers, Decomposition Tree), complex enterprise predictive modeling (e.g., credit risk scoring, equipment failure prediction, medical diagnosis) is developed by data science teams in **Azure Machine Learning (Azure ML)**.

Power BI enables direct integration with deployed Azure ML web services.

---

## 1. The Machine Learning Integration Pipeline

```
[Data Science Team] ---> Develops & Trains Model in Azure ML (Python / PyTorch)
                                      |
                                      v
                             [Deploys REST Endpoint]
                                      |
                                      v (Access Granted to Power BI Workspace)
                           [Power BI Service / Desktop]
                                      |
                                      v (Invokes Model in Power Query ETL)
                     [Dataset Enriched with Predictive Scores]
                                      |
                                      v
                     [Business Dashboard Displays Forecasts]
```

---

## 2. Invoking Azure ML Models in Power Query

1. In **Power Query Editor**, select the table containing input features (e.g., `LoanApplications`).
2. Go to the **Home** or **Add Column** ribbon tab and click **AI Insights** $\to$ **Azure Machine Learning**.
3. Power BI scans your Azure subscription and lists all published machine learning models you have permission to access.
4. Select the model (e.g., `DefaultRiskPredictor`).
5. Map table columns to model input parameters (e.g., map `ApplicantIncome`, `CreditScore`, `DebtRatio`).
6. Click **OK**. Power BI sends batch requests to the Azure ML endpoint and appends predicted outcome columns (`ProbabilityOfDefault`, `RiskTier`)!

---

# Multiple Choice Questions

### 1. How does Power BI integrate with custom enterprise machine learning models built by data science teams in Python?
A. By rewriting Python into JavaScript
B. By calling deployed Azure Machine Learning REST endpoints directly within the Power Query ETL pipeline
C. By copying Python files onto a USB drive
D. It is not supported
**Answer:** B
**Explanation:** Power BI features a native Azure ML connector in Power Query that can authenticate with Azure and pass table rows to deployed REST scoring endpoints.

### 2. Where is the Azure Machine Learning integration configured in Power BI Desktop?
A. Under the AI Insights menu on the Home or Add Column ribbon tab in Power Query Editor
B. In the Windows Control Panel
C. In Microsoft Word
D. In the Bookmark pane
**Answer:** A
**Explanation:** Azure Machine Learning is accessible inside Power Query Editor under the AI Insights grouping.

### 3. What must an Azure administrator configure to allow a Power BI developer to see an Azure ML model in Power BI?
A. Grant the Power BI user or workspace Read access to the Azure ML Workspace and Endpoint via Azure Role-Based Access Control (RBAC)
B. Share the administrator's personal password
C. Set the model to Public
D. Disable encryption
**Answer:** A
**Explanation:** Azure RBAC controls model discovery and scoring execution, ensuring only authorized corporate users can invoke predictive endpoints.

### 4. When are predictions generated when an Azure ML model is integrated via Power Query?
A. Every time a user hovers over a chart
B. During scheduled dataset refresh when Power Query executes the ETL steps
C. Continuously every millisecond
D. Only when the report is printed
**Answer:** B
**Explanation:** Because the model is invoked inside Power Query, predictions are scored and materialized into the table during dataset refresh.

### 5. What is a key business benefit of displaying Azure ML predictions inside Power BI dashboards?
A. It changes visual fonts to blue
B. It bridges the gap between data science and business operations, allowing decision-makers to act on advanced predictive insights within their familiar dashboard interface
C. It reduces server power usage
D. It eliminates the need for SQL
**Answer:** B
**Explanation:** Embedding predictive model outputs into operational dashboards enables business users to make data-driven decisions backed by advanced data science.

---
