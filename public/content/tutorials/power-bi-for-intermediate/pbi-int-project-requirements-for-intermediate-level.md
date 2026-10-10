# Project Requirements & Architecture for Intermediate Level

At the intermediate level, business intelligence engineering transitions from ad-hoc charts to **enterprise reporting architecture**. In real organizations, business executives do not care simply about pretty visuals; they rely on data models to track quarterly KPIs, monitor financial burn rates, identify high-risk customer churn, and enforce strict departmental security.

---

## 1. Enterprise Business Requirements Specification

Every professional Power BI project starts with a **Business Requirements Document (BRD)**. Below are the five mandatory architectural standards required for all intermediate projects:

```
                             Enterprise BI Standards
                                        |
     +-----------------+----------------+----------------+-----------------+
     |                 |                |                |                 |
Data Modeling      DAX Measures     Security (RLS)  User Experience    Governance
- Star Schema      - Modular DAX    - Static Roles  - Drillthroughs    - Scheduled Refresh
- Single Direction - Zero Columns   - Org Filtering - Bookmarks        - Power BI Service
- 1-to-Many Only   - DIVIDE safety  - Test as Role  - Custom Tooltips  - Workspace Apps
```

---

## 2. The Star Schema Mandate

The number one reason Power BI reports become sluggish, inaccurate, or fail to calculate correctly is the use of a single flat table or an unstructured "spider-web" schema.

### Star Schema Architecture
A star schema separates data into two distinct table types:
1. **Fact Tables (Center of the Star):**
   - Contain numerical metrics, quantitative measurements, and transactional events (e.g., `SalesAmount`, `QuantitySold`, `DiscountAmount`).
   - Possess high row counts and foreign keys (`CustomerID`, `ProductID`, `DateKey`).
2. **Dimension Tables (Points of the Star):**
   - Contain descriptive business context used for slicing, dicing, and grouping (e.g., `CustomerName`, `ProductCategory`, `CalendarYear`).
   - Possess primary keys with unique, distinct values.

```
       [Dim_Customer]             [Dim_Product]
             \                          /
              \                        /
         (1)   \                      /   (1)
                \                    /
                 v                  v
               [Fact_SalesTransactions]
                 ^                  ^
                /                    \
         (1)   /                      \   (1)
              /                        \
             /                          \
       [Dim_Date]                  [Dim_Geography]
```

---

## 3. Dataset Architecture for Intermediate Projects

Throughout this course, you will work with real business datasets stored in `public/downloads/datasets/`:
- **`superstore_sales_analytics.csv`**: Contains multi-region retail orders with dimensions for Customer Segment, Category, and Shipping Modes.
- **`customer_churn_telecom.csv`**: Contains telecommunication customer retention records with monthly fees, tenure, and payment channels.
- **`retail_store_database.sql`**: A complete 4-table relational database for direct query and ETL pipelines.

---

## 4. Key Performance Indicators (KPIs) to Implement

Your intermediate models will implement industry-standard corporate KPIs:

| KPI Metric | Business Objective | Required DAX Pattern |
| :--- | :--- | :--- |
| **YoY Sales Growth %** | Measures sales acceleration compared to the same period in the prior fiscal year. | `DIVIDE([Sales] - [Sales SPLY], [Sales SPLY])` |
| **Customer Retention Rate** | Tracks percentage of active subscribers retained month-over-month. | `DIVIDE([Retained Customers], [Active Customers PM])` |
| **Gross Margin %** | Evaluates profitability efficiency after cost of goods sold. | `DIVIDE([Total Gross Profit], [Total Revenue], 0)` |
| **Top 10 Contribution %** | Assesses revenue concentration risk across top customers. | `CALCULATE([Total Sales], TOPN(10, ...))` |

---

# Multiple Choice Questions

### 1. In a Star Schema data model, what is the fundamental purpose of a Fact Table?
A. To store descriptive attributes like customer names and product categories
B. To record transactional events and numerical quantitative measurements alongside foreign keys
C. To store report bookmarks and color themes
D. To replace all dimension tables in a flat single table structure
**Answer:** B
**Explanation:** Fact tables sit at the center of a star schema and store quantitative measurements (sales, costs, quantities) accompanied by foreign key columns that connect to surrounding dimension tables.

---

### 2. Why is a Star Schema strongly preferred over a single flat 50-column de-normalized table in Power BI?
A. Star schemas eliminate the need for DAX formulas
B. Star schemas leverage VertiPaq dictionary encoding optimally, drastically reducing memory usage while improving relationship filter propagation performance
C. Star schemas allow reports to bypass Power Query entirely
D. Single flat tables do not support bar charts
**Answer:** B
**Explanation:** Normalizing attributes into distinct dimension tables reduces repeated text strings, allowing the VertiPaq engine to compress data much more effectively and evaluate relationships in optimized $O(1)$ lookups.

---

### 3. What relationship cardinality should connect Dimension tables to Fact tables in a standard star schema?
A. Many-to-Many ($* : *$) with Bi-directional cross filtering
B. One-to-One ($1 : 1$) with No cross filtering
C. One-to-Many ($1 : *$) from Dimension (1) to Fact ($*$) with Single cross-filter direction
D. Many-to-One ($* : 1$) from Fact to Dimension with Cross-filtering disabled
**Answer:** C
**Explanation:** Standard star schema design requires that the primary key in the Dimension table represents the "One" ($1$) side, while the transactional Fact table represents the "Many" ($*$) side, with filters propagating from the dimension to the fact table.

---

### 4. What does the Business Requirements Document (BRD) define prior to building Power BI dashboards?
A. The computer hardware specifications of the developer
B. The strategic business questions, required KPIs, data sources, security roles, and user interaction requirements
C. The licensing cost of Microsoft Windows
D. The CSS styling of web browsers
**Answer:** B
**Explanation:** A BRD aligns technical development with business objectives, identifying data sources, stakeholder KPIs, access permissions (RLS), and functional visual expectations.

---

### 5. In an enterprise Power BI model, what is the best practice regarding the storage location for DAX Measures?
A. Store all measures inside the Date table
B. Group all measures inside dedicated empty tables (e.g., `_Key Measures`) for clean organization and discoverability
C. Scatter measures across whatever table is currently selected
D. Save measures in an external Excel workbook
**Answer:** B
**Explanation:** Creating dedicated measure tables (e.g., `_Sales Measures`, `_Financial KPIs`) keeps calculations cleanly separated from physical data tables, making them easy to maintain and find in complex models.

---
