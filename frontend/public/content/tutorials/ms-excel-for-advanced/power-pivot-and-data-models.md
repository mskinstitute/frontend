# Power Pivot Architecture & Creating Data Models

When datasets exceed Excel's physical 1,048,576 row limit, or when reports require linking 5 different transactional tables together without writing thousands of sluggish VLOOKUPs, **Power Pivot** provides enterprise-grade database technology directly inside Microsoft Excel.

---

## 1. What is Power Pivot and the Data Model?

Power Pivot is an in-memory analytics engine powered by Microsoft’s **xVelocity (VertiPaq)** relational database engine:

```
+-----------------------------------+-----------------------------------+
| Standard Excel Worksheet          | Power Pivot Data Model            |
+-----------------------------------+-----------------------------------+
| Max 1,048,576 rows per sheet      | Easily handles 10M to 100M+ rows! |
| Uncompressed storage (.xlsx)      | 10x to 20x columnar compression!  |
| Flattens tables with VLOOKUP      | Relational Star Schema (Joins)    |
| Standard Excel formulas (SUM, IF) | Advanced DAX (Data Analysis Expr) |
+-----------------------------------+-----------------------------------+
```

![Power Pivot Data Model Architecture](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Enabling Power Pivot in Microsoft Excel

Power Pivot is a built-in COM add-in:
1. Go to **File > Options > Add-ins**.
2. At the bottom, in the **Manage** dropdown, select **COM Add-ins** > click **Go...**.
3. Check the box for **Microsoft Power Pivot for Excel**.
4. Click **OK**.
*A new **Power Pivot** tab appears permanently on your Excel Ribbon!*

---

## 3. Loading Data into the Data Model

There are two primary ways to populate the Data Model:
* **Method 1 (From Power Query):** When loading a query, choose **Close & Load To...** > check **Add this data to the Data Model**.
* **Method 2 (From an existing Excel Table):** Click inside an Excel Table > go to the **Power Pivot** ribbon tab > click **Add to Data Model**.

---

## 4. Touring the Power Pivot Window

Click **Power Pivot tab > Manage** to open the separate Power Pivot environment:
* **Data View:** Resembles an Excel sheet with tabs at the bottom representing different tables, but data is read-only and processed in memory.
* **Calculation Area:** The split pane at the bottom where enterprise **DAX Measures** are authored.
* **Diagram View:** The visual schema canvas where you drag and drop lines between common keys to create relational relationships!

---

# Multiple Choice Questions

### 1. What is the physical row capacity limit of the Power Pivot Data Model in Excel?
A. Exactly 1,048,576 rows
B. Up to hundreds of millions of rows, constrained only by available 64-bit computer RAM
C. 65,536 rows
D. 10,000 rows
**Answer:** B
**Explanation:** The Power Pivot engine stores data in compressed in-memory columnar storage, bypassing worksheet row limits to process hundreds of millions of rows.

---

### 2. Where do you go to enable the Power Pivot ribbon tab if it is not currently visible?
A. Review tab > Language
B. File > Options > Add-ins > Manage: COM Add-ins > Check Microsoft Power Pivot for Excel
C. Windows Control Panel > Fonts
D. Formulas tab > Calculation Options
**Answer:** B
**Explanation:** Power Pivot is activated through Excel Options under Add-ins by enabling the COM Add-in.

---

### 3. What high-performance compression engine powers Power Pivot behind the scenes?
A. ZIP32
B. xVelocity (VertiPaq) in-memory analytics engine
C. NTFS
D. GZIP
**Answer:** B
**Explanation:** Power Pivot utilizes Microsoft's proprietary xVelocity (VertiPaq) columnar database engine for high compression and rapid querying.

---

### 4. How does Power Pivot eliminate the need for millions of VLOOKUP formulas across related tables?
A. It deletes non-matching rows
B. It establishes direct relational relationships between tables using key columns in Diagram View
C. It converts text into images
D. It runs macro loops
**Answer:** B
**Explanation:** Defining relationships between tables allows Pivot Tables to aggregate data across multiple tables natively without flattening tables via VLOOKUP.

---

### 5. Which view in the Power Pivot management window provides a visual entity-relationship canvas for connecting tables?
A. Data View
B. Diagram View
C. Normal View
D. Page Layout View
**Answer:** B
**Explanation:** Diagram View renders database tables as visual blocks, allowing analysts to connect primary and foreign keys by dragging lines between them.

---
