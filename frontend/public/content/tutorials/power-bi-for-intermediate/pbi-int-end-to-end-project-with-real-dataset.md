# Capstone Project: End-to-End Analytics with Superstore Dataset

It is time to assemble everything you have learned into a unified **Intermediate Capstone Project**. In this project, you will download the raw `superstore_sales_analytics.csv` dataset, perform enterprise ETL transformations in Power Query, engineer a clean Star Schema data model, construct modular DAX calculations, and build an interactive multi-page dashboard.

---

## 1. Acquiring the Practice Dataset

The dataset is located in the platform's public repository:
- **Download Path:** `/downloads/datasets/superstore_sales_analytics.csv`
- **Rows:** 250 multi-region commercial orders.
- **Fields:** `OrderID`, `OrderDate`, `ShipDate`, `ShipMode`, `CustomerID`, `CustomerName`, `Segment`, `City`, `Region`, `Category`, `SubCategory`, `Sales`, `Quantity`, `Discount`, `Profit`.

---

## 2. Phase 1: Power Query ETL & Star Schema Decomposition

A single flat CSV table violates our Star Schema rules. In Power Query, we will normalize the flat table into **1 Fact Table** and **3 Dimension Tables**:

```
                              ETL Normalization Plan
                                        |
     +-----------------+----------------+-----------------+-----------------+
     |                 |                                  |                 |
[Dim_Customer]    [Dim_Product]                      [Dim_Geography]   [Fact_SalesOrders]
- CustomerID (PK) - SubCategory (PK)                 - City (PK)       - OrderID
- CustomerName    - Category                         - Region          - OrderDate (FK)
- Segment                                                              - ShipDate (FK)
                                                                       - CustomerID (FK)
                                                                       - City (FK)
                                                                       - SubCategory (FK)
                                                                       - Sales, Qty, Profit
```

### Power Query Transformation Steps:
1. Load `superstore_sales_analytics.csv`.
2. Duplicate the query 4 times. Rename queries to:
   - `Fact_SalesOrders`
   - `Dim_Customer`
   - `Dim_Product`
   - `Dim_Geography`
3. In `Dim_Customer`:
   - Select columns: `CustomerID`, `CustomerName`, `Segment`.
   - Remove other columns.
   - Right-click `CustomerID` $\to$ **Remove Duplicates** (ensures a clean 1-side Primary Key!).
4. In `Dim_Product`:
   - Select columns: `SubCategory`, `Category`.
   - Remove other columns $\to$ **Remove Duplicates**.
5. In `Dim_Geography`:
   - Select columns: `City`, `Region`.
   - Remove other columns $\to$ **Remove Duplicates**.
6. In `Fact_SalesOrders`:
   - Keep foreign keys and numeric metrics: `OrderID`, `OrderDate`, `ShipDate`, `ShipMode`, `CustomerID`, `City`, `SubCategory`, `Sales`, `Quantity`, `Discount`, `Profit`.
   - Remove descriptive string columns (`CustomerName`, `Segment`, `Category`, `Region`).
7. Click **Close & Apply**.

---

# Multiple Choice Questions

### 1. Why must "Remove Duplicates" be applied to the primary key column (e.g., CustomerID) when creating a Dimension table in Power Query?
A. Power BI cannot load duplicate text
B. To ensure the column contains strictly unique values, enabling a valid One-to-Many ($1 : *$) relationship with the fact table
C. To reduce the font size of the table
D. To sort the table in reverse order
**Answer:** B
**Explanation:** For a table to serve as the "One" ($1$) side in a standard 1-to-Many dimensional relationship, its primary key column must contain strictly unique, non-duplicate values.

### 2. In the normalized Star Schema model, what is the role of the `Fact_SalesOrders` table?
A. It stores the company's employee handbook
B. It acts as the central transactional table containing foreign keys and numeric measurements (Sales, Quantity, Profit)
C. It acts as a custom tooltip
D. It replaces all slicers
**Answer:** B
**Explanation:** The fact table sits at the center of the star schema, recording transactions and numerical metrics connected to surrounding dimensions via foreign keys.

### 3. What Power Query command creates an identical copy of an existing query for normalization?
A. Split Column
B. Duplicate (or Reference)
C. Transpose
D. Group By
**Answer:** B
**Explanation:** Right-clicking an existing query and choosing "Duplicate" or "Reference" creates an additional pipeline branch to isolate individual dimension entities.

### 4. Which date column in `Fact_SalesOrders` should be connected as the active relationship to `Dim_Date[Date]`?
A. `ShipDate`
B. `OrderDate` (representing the primary commercial transaction timestamp)
C. Neither
D. Both active simultaneously
**Answer:** B
**Explanation:** In standard commercial reporting, `OrderDate` is selected as the primary active relationship so that revenue and order counts align with the date the transaction occurred.

### 5. Why do we remove descriptive columns (like CustomerName, Region) from the Fact table once they exist in Dimension tables?
A. Power BI will crash if columns have the same name
B. To reduce data redundancy, shrink file size, and optimize VertiPaq compression
C. Dimension tables cannot be filtered
D. It is an optional visual preference
**Answer:** B
**Explanation:** Storing descriptive text strings repeatedly across millions of fact rows wastes memory. Removing them and relying on foreign key joins optimizes VertiPaq columnar compression.

---
