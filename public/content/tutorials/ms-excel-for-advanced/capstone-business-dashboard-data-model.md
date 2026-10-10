# Capstone: Building the Business Performance Data Model

Welcome to the three-part **MS Excel Advanced Capstone Project**. In this project, you will build a comprehensive, automated, multi-million dollar **Business Performance Dashboard**. In this first lesson, we ingest disparate corporate datasets, clean them using **Power Query**, establish a relational **Star Schema**, and configure the underlying **Power Pivot Data Model**.

---

## 1. Capstone Project Overview & Data Architecture

Our enterprise model integrates three separate operational data sources:
1. **Fact_Transactions.csv (250,000 rows):** OrderID, TransactionDate, CustomerID, ProductID, UnitsSold, UnitSellingPrice, DiscountAmount.
2. **Dim_Products.xlsx:** ProductID, ProductName, Category, SubCategory, UnitCost.
3. **Dim_Customers.xlsx:** CustomerID, CustomerName, Region, Segment (Enterprise, SMB, Consumer).

```
Capstone Star Schema Blueprint:
           [ Dim_Customers ]
                  │ (1)
                  │
                  ▼ (*)
        [ Fact_Transactions ] ◄──(*)───(1)─ [ Dim_Products ]
                  ▲
                  │ (*)
                  │
                 (1) [ Dim_Calendar ]
```

![Capstone Data Model Architecture](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Step-by-Step: Ingestion & Power Query Transformation

### Step 1: Ingest and Clean 'Fact_Transactions'
1. In a fresh workbook, go to **Data > Get Data > From File > From Text/CSV**.
2. Select 'Fact_Transactions.csv' and click **Transform Data**.
3. **Applied Transformations:**
   * Verify all data types: Ensure 'TransactionDate' is set to **Date**, 'UnitsSold' to **Whole Number**, and financial figures to **Currency**.
   * Replace Nulls: Highlight 'DiscountAmount' > right-click > **Replace Values** (Replace `null` with `0`).
   * Add Custom Column: Click **Add Column > Custom Column** > Name: **GrossRevenue**:
     ```m
     [UnitsSold] * [UnitSellingPrice]
     ```
4. Click **Close & Load To...** > Select **Only Create Connection** and check **Add this data to the Data Model**!

### Step 2: Ingest Dimension Tables
* Ingest 'Dim_Products' and 'Dim_Customers' via Power Query.
* Promote headers, enforce strict Text types on ID codes, and load them as **Connection Only to the Data Model**.

---

## 3. Step-by-Step: Diagram View & Establishing Relationships

1. Go to **Power Pivot > Manage**.
2. Switch to **Diagram View**.
3. Connect the Star Schema:
   * Drag **CustomerID** from *Dim_Customers* to **CustomerID** in *Fact_Transactions* (Establishes 1 : *).
   * Drag **ProductID** from *Dim_Products* to **ProductID** in *Fact_Transactions* (Establishes 1 : *).
4. Create a dedicated **Date Table**:
   * In Power Pivot window, go to **Design tab > Date Table > New**.
   * Link **Date** from the new date table to **TransactionDate** in *Fact_Transactions*.

Your enterprise data model is now fully established, normalized, and optimized for high-speed DAX calculations!

---

# Multiple Choice Questions

### 1. In our Capstone Star Schema, why is 'Fact_Transactions' loaded with 'Only Create Connection' and added to the Data Model?
A. To prevent printing
B. It keeps the heavy 250,000 rows in fast compressed memory without cluttering worksheet cells
C. Worksheets cannot save CSV data
D. It encrypts the operating system
**Answer:** B
**Explanation:** Loading as a connection to the Data Model bypasses worksheet cell limits and speeds up calculation through compressed in-memory storage.

---

### 2. What relationship cardinality exists between 'Dim_Products' and 'Fact_Transactions'?
A. Many-to-Many
B. One-to-Many (1 : *)
C. One-to-One
D. Zero-to-Zero
**Answer:** B
**Explanation:** Each product ID exists once in the Dim_Products master table, but appears many times across transactional sales in Fact_Transactions.

---

### 3. Why is generating a dedicated Calendar/Date table in Power Pivot recommended for enterprise modeling?
A. Because Excel cannot read calendar years
B. It provides continuous, unbroken date sequences required for time-intelligence calculations (such as Year-to-Date and Year-over-Year growth)
C. It translates month names into Latin
D. It is required to save .xlsm files
**Answer:** B
**Explanation:** Dedicated Date tables ensure continuous date sequences without missing weekend gaps, which is mandatory for robust DAX time intelligence.

---

### 4. How did we calculate 'GrossRevenue' during the Power Query transformation step?
A. By writing a VBA macro
B. By adding a Custom Column evaluating '[UnitsSold] * [UnitSellingPrice]'
C. By using AutoSum
D. By typing numbers manually
**Answer:** B
**Explanation:** Custom Columns in Power Query evaluate row-level arithmetic across input columns prior to loading into the Data Model.

---

### 5. In which view of the Power Pivot window do you drag and drop lines between primary and foreign keys to create relationships?
A. Data View
B. Diagram View
C. Normal View
D. Query View
**Answer:** B
**Explanation:** Diagram View provides the visual entity-relationship canvas where relationships are drawn between common table keys.

---
