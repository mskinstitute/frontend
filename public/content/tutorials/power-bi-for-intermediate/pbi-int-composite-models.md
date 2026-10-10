# Composite Models: Combining DirectQuery & Import Modes

Historically in Power BI, a data model had to be **strictly Import Mode** or **strictly DirectQuery Mode**. In 2018, Microsoft revolutionized Power BI architecture with the release of **Composite Models**, allowing a single dataset to seamlessly blend in-memory Import tables with live DirectQuery connections.

---

## 1. The Architecture of Composite Models

In an enterprise composite model, data architects structure tables according to their update frequency and data volume:

```
                            Enterprise Composite Model
                                         |
     +-----------------------------------+-----------------------------------+
     |                                                                       |
Import Mode (In-Memory VertiPaq)                               DirectQuery Mode (Live SQL Source)
- Dimension Tables (Customers, Products)                       - Massive Fact Table (Telemetry, Web Clicks)
- High-Performance Aggregated Facts                            - Hundreds of millions / billions of rows
- Ultra-fast visual response times (< 100ms)                  - Real-time sub-second data freshness
```

---

## 2. Table Storage Modes in Composite Models

Each table in a composite model can be set to one of three storage modes in the Model Properties pane:

1. **Import:** Data is fully loaded into VertiPaq memory.
2. **DirectQuery:** Data remains in the source database; queries are generated on-the-fly.
3. **Dual:** The table can act as either Import or DirectQuery depending on the context of the query.

### The Power of Dual Storage Mode
When an Import table queries a **Dual** table, the Dual table acts like an **Import** table (avoiding cross-network SQL queries). When a DirectQuery table queries a **Dual** table, the Dual table acts like a **DirectQuery** table (avoiding cross-boundary data joins). Setting dimension tables to **Dual** is an industry best practice in composite models!

---

## 3. Managing Data Source Privacy & Cross-Source Joins

When combining data from an on-premises SQL Server and a cloud data source (e.g., Salesforce):
- Power BI may need to send data from one source to another to evaluate a join.
- This triggers **Data Source Privacy Levels**:
  - **Private:** Sensitive corporate data (e.g., HR salaries). Cannot be passed to any other data source.
  - **Organizational:** Internal enterprise data. Can be joined with other Organizational sources.
  - **Public:** Publicly accessible data (e.g., weather feeds, census stats). Can be combined freely.

---

# Multiple Choice Questions

### 1. What is the defining feature of a Power BI Composite Model?
A. It allows Power BI Desktop to run on macOS
B. It allows a single dataset to combine tables using Import mode and DirectQuery mode simultaneously
C. It merges all visuals into a single chart
D. It prevents users from exporting data to Excel
**Answer:** B
**Explanation:** Composite models break the binary choice between Import and DirectQuery, allowing high-speed in-memory Import tables to coexist with live DirectQuery fact tables in the same model.

---

### 2. What is the recommended storage mode for Dimension tables in a composite model connected to a DirectQuery fact table?
A. Import
B. DirectQuery
C. Dual
D. Push
**Answer:** C
**Explanation:** Setting shared dimension tables to Dual mode allows them to satisfy queries locally in memory when paired with Import tables, while behaving like DirectQuery when joined with live DirectQuery facts, avoiding slow cross-source data shipments.

---

### 3. What security risk does Power BI's Privacy Levels setting prevent when joining data across different sources?
A. Virus infections in Excel sheets
B. Data leakage where sensitive data from a private source is sent over the network to an external or untrusted data source during query execution
C. Accidental deletion of report tabs
D. Exceeding local disk storage quotas
**Answer:** B
**Explanation:** Privacy Levels (Private, Organizational, Public) enforce strict boundaries so that confidential data from a private source is never inadvertently serialized and sent as part of a query to a third-party source.

---

### 4. What visual indicator appears on a table header in Model View to signify it is in DirectQuery mode?
A. A green checkmark
B. A blue top stripe across the table card
C. A red lock symbol
D. A yellow exclamation mark
**Answer:** B
**Explanation:** In Power BI Model View, DirectQuery and Dual tables feature a colored header stripe (typically blue) to clearly distinguish them from standard Import tables.

---

### 5. Why are Aggregation Tables frequently implemented alongside DirectQuery fact tables in composite models?
A. To translate SQL code into Python
B. To answer common high-level summary queries instantly from an in-memory Import cache while leaving raw transaction details in DirectQuery
C. To reduce the need for user licenses
D. To disable drillthrough navigation
**Answer:** B
**Explanation:** Aggregations cache pre-summarized data (e.g., sales by month and product category) in memory, allowing 95% of user clicks to return sub-second results while preserving the ability to drill down into billions of live records.

---
