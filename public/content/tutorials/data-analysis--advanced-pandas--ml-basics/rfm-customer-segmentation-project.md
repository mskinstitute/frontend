# RFM (Recency, Frequency, Monetary) Customer Segmentation

**RFM (Recency, Frequency, Monetary) Analysis** is an empirically proven behavioral segmentation framework used by premier e-commerce, banking, and retail enterprises. By transforming transactional purchase histories into three quantitative pillars, businesses can identify top VIP spenders, churn-risk accounts, and reactivation targets for precision marketing campaigns.

---

## 1. The Three Pillars of RFM

| Dimension | Definition | Calculation | Strategic Business Meaning |
| :--- | :--- | :--- | :--- |
| **Recency ($R$)** | Days since customer's last purchase | $\text{Reference Date} - \text{Last Purchase Date}$ | Customers who bought recently are vastly more responsive to promotions. |
| **Frequency ($F$)** | Total number of completed orders | $\text{COUNT(DISTINCT Order ID)}$ | Measures customer loyalty, habituation, and brand affinity. |
| **Monetary ($M$)** | Cumulative gross revenue spend | $\text{SUM(Order Value)}$ | Identifies top revenue drivers and high-margin accounts. |

---

## 2. Computing RFM Metrics in Pandas

```python
import pandas as pd
import datetime as dt

# Set snapshot reference date (typically 1 day after latest transaction)
snapshot_date = df['order_date'].max() + dt.timedelta(days=1)

# Group transactions by customer
rfm = df.groupby('customer_id').agg({
    'order_date': lambda x: (snapshot_date - x.max()).days,
    'order_id': 'nunique',
    'total_amount': 'sum'
}).rename(columns={
    'order_date': 'Recency',
    'order_id': 'Frequency',
    'total_amount': 'Monetary'
})
```

---

## 3. Binning Scores with Quantiles (`pd.qcut`)

Segment customers by assigning quintile scores from 1 to 5:
- **Recency:** Lower days = Higher score (Score 5 is most recent!).
- **Frequency & Monetary:** Higher volume/spend = Higher score (Score 5 is highest!).

```python
# Recency: reversed labels (lowest recency days = best score 5)
r_labels = [5, 4, 3, 2, 1]
f_labels = [1, 2, 3, 4, 5]
m_labels = [1, 2, 3, 4, 5]

rfm['R_Score'] = pd.qcut(rfm['Recency'], q=5, labels=r_labels).astype(int)
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), q=5, labels=f_labels).astype(int)
rfm['M_Score'] = pd.qcut(rfm['Monetary'], q=5, labels=m_labels).astype(int)

# Create combined RFM Segment string
rfm['RFM_Segment'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)
```

---

## 4. Mapping Executive Customer Personas

```python
def map_rfm_persona(df):
    r, f = df['R_Score'], df['F_Score']
    if r >= 4 and f >= 4:
        return "Champions (VIPs)"
    elif r >= 3 and f >= 3:
        return "Loyal Customers"
    elif r >= 4 and f <= 2:
        return "Recent New Customers"
    elif r <= 2 and f >= 4:
        return "At Risk / Can't Lose Them"
    elif r <= 2 and f <= 2:
        return "Lost / Dormant"
    else:
        return "Potential Loyalists"

rfm['Customer_Segment'] = rfm.apply(map_rfm_persona, axis=1)
```

### Marketing Action Plan:
- **Champions (555, 554):** VIP early access, no discount erosion, invite to loyalty club.
- **At Risk (145, 155):** High spenders who stopped buying! Send personalized re-activation calls or big discount vouchers.
- **Lost (111, 112):** Low lifetime value, inactive; minimize ad spend.

---

# Multiple Choice Questions

### 1. Why are the quintile score labels for **Recency** assigned in reverse order ($5, 4, 3, 2, 1$) compared to Frequency and Monetary?
A. Recency has a negative correlation with customer satisfaction.
B. Fewer elapsed days since the last purchase indicates a more engaged, active customer who deserves the highest score (5).
C. To prevent numerical overflow.
D. Pandas `qcut` requires descending orders for all date columns.
**Answer:** B
**Explanation:** A customer who transacted 2 days ago is much hotter and more responsive than a customer who transacted 400 days ago. Hence, lower recency values receive higher ratings.
---

### 2. A customer has an RFM score of **155** (Recency: 1, Frequency: 5, Monetary: 5). What customer segment do they represent?
A. New First-Time Buyer
B. Lost / At-Risk High-Value VIP (High historical spend and frequency, but haven't purchased in a long time).
C. Unprofitable Bargain Hunter
D. Spam account
**Answer:** B
**Explanation:** High frequency (5) and high monetary (5) show they were historically top customers, but low recency (1) indicates they have not purchased recently and are at high risk of permanent churn.
---

### 3. Which Pandas method is best suited for segmenting continuous monetary spend into 5 quantile-based bins with roughly equal sample counts per bin?
A. `pd.cut()`
B. `pd.qcut()`
C. `df.groupby()`
D. `df.pivot_table()`
**Answer:** B
**Explanation:** `pd.qcut()` partitions data based on sample quantiles, ensuring that each of the 5 bins receives approximately 20% of the customer population.
---

### 4. What is the main strategic marketing advantage of combining RFM Segmentation with K-Means clustering?
A. Eliminates all marketing costs.
B. K-Means discovers nuanced multi-dimensional clusters and optimal decision boundaries automatically without arbitrary manual threshold cutoffs.
C. Converts tabular data into audio formats.
D. Guarantees 100% email open rates.
**Answer:** B
**Explanation:** While rule-based RFM relies on subjective quantile thresholds, K-Means groups customers based on mathematical multi-dimensional density in the RFM feature space.
---

### 5. In RFM data preparation, why is the snapshot reference date commonly chosen as `max_order_date + 1 day` rather than today's actual system date when analyzing historical datasets?
A. Python cannot fetch the current system time.
B. If analyzing historical data from 3 years ago, using today's live date would cause all customers to appear with recencies over 1,000 days, destroying meaningful variation.
C. To comply with GDPR regulations.
D. To convert the timestamp into a string.
**Answer:** B
**Explanation:** When analyzing static historical data snapshots, the reference date must be fixed relative to the dataset's maximum date to preserve realistic recency spans.
---