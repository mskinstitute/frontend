# Data Pipeline: SQL Extraction -> Pandas Cleaning -> Modeling

A professional data analyst does not work in silos. In production environments, enterprise analytics requires connecting the entire **modern data stack**: querying relational operational data stores with **SQL**, transforming and feature engineering with **Pandas**, and generating predictions and statistical insights with **Scikit-Learn**.

---

## 1. Architectural Blueprint of the Data Pipeline

```
+---------------------+     SQL Query     +----------------------+
|  PostgreSQL / MySQL | ----------------> | Pandas Data Pipeline |
|  Enterprise DW      |                   | (Clean, Impute, Feat)|
+---------------------+                   +----------------------+
                                                     |
                                                     v
+---------------------+    Predictions    +----------------------+
| Business Dashboard  | <---------------- | Machine Learning     |
| & Executive Action  |                   | Pipeline (Scikit)    |
+---------------------+                   +----------------------+
```

---

## 2. Step 1: SQL Data Extraction with SQLAlchemy

Never use raw string concatenation with SQL queries to avoid SQL Injection vulnerabilities. Use `sqlalchemy` with parameterized queries:

```python
from sqlalchemy import create_engine
import pandas as pd

# 1. Establish secure connection engine
engine = create_engine("postgresql+psycopg2://analyst_user:SecurePass123@dw.company.internal:5432/analytics_db")

# 2. Optimized SQL Query: Aggregate at the database level where possible!
query = """
SELECT 
    c.customer_id,
    c.signup_date,
    c.subscription_tier,
    COUNT(t.transaction_id) AS total_orders,
    COALESCE(SUM(t.order_amount), 0) AS total_spent,
    MAX(t.transaction_date) AS last_order_date
FROM customers c
LEFT JOIN transactions t ON c.customer_id = t.customer_id
WHERE c.is_test_account = FALSE
GROUP BY c.customer_id, c.signup_date, c.subscription_tier;
"""

df_raw = pd.read_sql(query, con=engine)
print(f"Extracted {len(df_raw):,} records from Enterprise DW.")
```

---

## 3. Step 2: Automated Pandas Pipeline

```python
import numpy as np

def clean_and_engineer(df):
    snapshot = pd.to_datetime('today')
    
    return (
        df
        .assign(
            signup_date=lambda x: pd.to_datetime(x['signup_date']),
            last_order_date=lambda x: pd.to_datetime(x['last_order_date']),
            # Feature engineering
            account_age_days=lambda x: (snapshot - x['signup_date']).dt.days,
            days_since_last_order=lambda x: (snapshot - x['last_order_date']).dt.days.fillna(999),
            avg_order_value=lambda x: np.where(x['total_orders'] > 0, x['total_spent'] / x['total_orders'], 0)
        )
        .dropna(subset=['customer_id'])
        .astype({
            'subscription_tier': 'category',
            'total_orders': 'int32',
            'total_spent': 'float32'
        })
    )

df_clean = clean_and_engineer(df_raw)
```

---

## 4. Step 3: Scikit-Learn Modeling Pipeline

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# Define column types
num_features = ['account_age_days', 'days_since_last_order', 'total_orders', 'total_spent', 'avg_order_value']
cat_features = ['subscription_tier']

# Preprocessor
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), num_features),
    ('cat', OneHotEncoder(drop='first'), cat_features)
])

# Full End-to-End Pipeline
full_model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
])

# Train and execute
# full_model_pipeline.fit(X_train, y_train)
```

---

## 5. Step 4: Exporting Scored Predictions Back to Database

```python
# Generate probabilities and append to customer records
df_clean['churn_probability'] = full_model_pipeline.predict_proba(df_clean)[:, 1]

# Write back to high-speed staging table for CRM automated alerts
df_clean[['customer_id', 'churn_probability']].to_sql(
    'customer_churn_scores', 
    con=engine, 
    if_exists='replace', 
    index=False
)
print("Pipeline complete: Predictions exported to database!")
```

---

# Multiple Choice Questions

### 1. In production data pipelines, why is database aggregation via SQL (`GROUP BY`, `SUM`, `COUNT`) strongly preferred over loading 100 million raw transaction rows into Pandas to group locally?
A. Pandas does not have a groupby method.
B. Relational database engines execute indexed distributed aggregations natively with optimized disk I/O, preventing catastrophic client-side memory exhaustion and massive network transfer latency.
C. SQL cannot handle float values.
D. Pandas cannot read dates.
**Answer:** B
**Explanation:** Pushing computation to the database leverages optimized SQL database engines and minimizes network transfer bandwidth and local RAM usage.
---

### 2. What role does `ColumnTransformer` serve in a Scikit-Learn data science pipeline?
A. It changes column names to uppercase.
B. It applies separate, specialized transformation pipelines to different subsets of columns (e.g., scaling numerical features while one-hot encoding categorical features) in a single unified step.
C. It drops all columns containing missing values.
D. It connects to PostgreSQL via JDBC.
**Answer:** B
**Explanation:** `ColumnTransformer` allows developers to apply disparate preprocessing steps (e.g., StandardScaler on numbers, OneHotEncoder on strings) across heterogeneous columns simultaneously.
---

### 3. Which library is the industry standard for creating robust, secure database engine connections in Python?
A. SQLAlchemy
B. PyCSV
C. Tkinter
D. Beautiful Soup
**Answer:** A
**Explanation:** SQLAlchemy provides comprehensive SQL connection pooling, dialect management, and ORM abstractions for Python enterprise applications.
---

### 4. What is the danger of using string formatting like `f"SELECT * FROM users WHERE id = '{user_input}'"`?
A. It causes Python memory leaks.
B. It creates severe SQL Injection vulnerabilities, allowing malicious inputs to manipulate or delete entire databases.
C. It slows down query execution by 10x.
D. It converts numeric data to boolean.
**Answer:** B
**Explanation:** Dynamic SQL string concatenation invites SQL injection. Always use parameterized queries (`:param`) or SQLAlchemy query binding.
---

### 5. Why should an end-to-end data pipeline export scored model probabilities back into a database table rather than leaving them in a Jupyter notebook?
A. Jupyter notebooks cannot save data.
B. To allow downstream operational systems (CRM, email automation tools, customer service dashboards) to automatically act upon predictions in production.
C. Database tables require less disk storage than CSV files.
D. To prevent the model from overfitting.
**Answer:** B
**Explanation:** Analytics provides business value when operational teams and downstream automated applications can read model scores to trigger customer actions.
---