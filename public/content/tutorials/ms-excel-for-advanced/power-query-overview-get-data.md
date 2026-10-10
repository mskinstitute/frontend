# Power Query Overview & Importing Data from Multiple Sources

**Power Query** (accessed via **Data > Get Data**) is Excel’s built-in **ETL (Extract, Transform, Load)** engine. It eliminates tedious manual copy-pasting and repetitive weekly data cleanup by recording transformation steps into an automated, repeatable data pipeline.

---

## 1. The ETL Philosophy of Power Query

```
+-------------------+      +-------------------+      +-------------------+
| 1. EXTRACT (Get)  | ---> | 2. TRANSFORM      | ---> | 3. LOAD           |
| Pull raw data     |      | Clean, reshape,   |      | Output to Excel   |
| from CSV, Web, SQL|      | unpivot, filter   |      | Table or Data     |
| or Folder.        |      | in Power Query.   |      | Model.            |
+-------------------+      +-------------------+      +-------------------+
```

### The Transformational Advantage:
When you perform data cleaning in traditional Excel (deleting columns, splitting text, replacing nulls), you must manually repeat those steps every week. In Power Query, your cleaning actions are recorded as a repeatable script in the **M code language**. Next month, you simply click **Refresh**, and all 25 cleanup steps execute in milliseconds!

![Power Query and Data Transformation](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Importing Data from Diverse Sources

Under **Data > Get Data**, you can connect to dozens of sources:

* **From File:**
  * **From Workbook:** Import specific tables or sheets from other Excel files.
  * **From Text/CSV:** Ingest massive flat files without Excel’s 1,048,576 row limit freezing your machine.
  * **From Folder:** Ingest and consolidate dozens of monthly CSV or Excel files from a directory simultaneously!
* **From Database:** Connect to Microsoft SQL Server, Access, Oracle, PostgreSQL.
* **From Online Services / Other:** Ingest tables directly from Web URLs, SharePoint Lists, or OData feeds.

---

## 3. The Power Query Editor Interface

When you connect to data, clicking **Transform Data** opens the dedicated **Power Query Editor** window:

1. **Queries Pane (Left):** Lists all active queries in the workbook.
2. **Data Preview Grid (Center):** Shows a live preview of your transforming data.
3. **Query Settings (Right):**
   * **Query Name:** Descriptive table title (e.g., 'FactSales').
   * **Applied Steps List:** A sequential history of every transformation applied (e.g., *Source*, *Promoted Headers*, *Changed Type*, *Filtered Rows*).
4. **Formula Bar (Top):** Displays the underlying **M language** code for the selected step.

---

## 4. Closing and Loading

When transformations are complete:
* Click **Home tab > Close & Load**:
  * **Close & Load:** Exports data into a fresh Excel Table on a new sheet.
  * **Close & Load To...:** Choose between:
    * *Table:* Standard sheet table.
    * *Only Create Connection:* Ingests data directly into the background memory without bloating sheet cells.
    * *Add this data to the Data Model:* Powers high-volume Power Pivot models!

---

# Multiple Choice Questions

### 1. What does ETL stand for in modern data analytics?
A. Edit, Type, Lock
B. Extract, Transform, Load
C. Evaluate, Test, Launch
D. Execute, Track, Link
**Answer:** B
**Explanation:** ETL stands for Extract (connect to raw sources), Transform (clean and reshape data), and Load (output to tables or models).

---

### 2. What is recorded in the 'Applied Steps' pane in the Power Query Editor?
A. User keystrokes and passwords
B. A chronological, repeatable list of every data transformation action applied to the query
C. Windows operating system updates
D. Excel undo history
**Answer:** B
**Explanation:** The Applied Steps pane documents every transformation step in sequence, forming an automated script that re-runs on data refresh.

---

### 3. What programming language powers Power Query behind the scenes?
A. Python
B. VBA
C. M Language
D. C++
**Answer:** C
**Explanation:** Power Query runs on the functional, case-sensitive 'M' formula language (Mashup language).

---

### 4. What happens when you receive next month's sales CSV and need to apply the same 20 cleaning steps you did last month?
A. You must manually repeat all 20 steps
B. You simply replace the file and click 'Data > Refresh All'; Power Query automatically re-executes all transformation steps
C. You must recreate the query from scratch
D. You must convert the file to Word
**Answer:** B
**Explanation:** Power Query pipelines are fully automated; refreshing re-applies all configured Applied Steps to the new source data instantly.

---

### 5. Why would an analyst choose 'Only Create Connection' when loading a 5-million row database query?
A. Excel sheets can only hold 1,048,576 rows; creating a connection allows loading into the Power Pivot Data Model without exceeding sheet limits
B. It reduces computer monitor glare
C. It deletes the source database
D. It prevents the data from being calculated
**Answer:** A
**Explanation:** 'Only Create Connection' avoids writing rows to worksheet cells, allowing massive datasets to be processed within the Power Pivot Data Model.

---
