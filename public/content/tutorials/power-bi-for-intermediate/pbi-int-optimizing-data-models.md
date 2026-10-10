# Optimizing Data Models: Cardinality, Auto Date/Time & Memory Footprint

In corporate reporting, poorly optimized data models lead to massive `.pbix` file sizes (hundreds of megabytes), slow report refresh times, and sluggish user interactions. An intermediate Power BI developer must know how to eliminate memory waste and optimize the VertiPaq engine.

---

## 1. The Number One Culprit: Column Cardinality

**Cardinality** refers to the number of **unique, distinct values** in a column:
- **Low Cardinality:** `Gender` (2 unique values: Male, Female), `Status` (3 unique values).
- **High Cardinality:** `DateTime` with seconds (millions of unique timestamps), `GUIDs`, `TransactionIDs`.

> **VERTIPAQ GOLDEN PRINCIPLE:** Memory consumption is determined primarily by **column cardinality**, NOT total row count! A 10-million row table with low-cardinality columns can take less RAM than a 100,000-row table with 3 high-cardinality GUID columns.

```
Cardinality Memory Comparison:
Column                  Unique Values    Memory Cost
----------------------------------------------------
Dim_Customer[Gender]    2                Negligible (Bytes)
Fact_Sales[Region]      5                Negligible (Bytes)
Fact_Sales[DateTime]    1,500,000        Massive RAM Hog! (Split Date and Time!)
Fact_Sales[UUID]        10,000,000       Disaster! (Remove if not needed for joins)
```

---

## 2. Optimization Technique 1: Splitting DateTime Columns

Never import timestamps that combine Date and Time down to the second into a fact table!

```dax
-- Before: Single Column (High Cardinality)
2025-03-15 14:22:19.450  --> 10,000,000 unique values in VertiPaq!

-- After: Split in Power Query into Two Columns
Date Column: 2025-03-15  --> Only 365 unique values per year!
Time Column: 14:00       --> Group by hour/minute: Max 1,440 unique values!
Memory reduction: Often > 90%!
```

---

## 3. Optimization Technique 2: Disabling "Auto Date/Time"

By default, Power BI Desktop has a feature enabled called **Auto Date/Time**:
- For **EVERY SINGLE date column** in your model, Power BI secretly creates a hidden internal calendar table with full year/month hierarchies.
- If you have 10 tables with 3 date columns each, Power BI creates 30 hidden calendar tables in memory!

### How to Disable Auto Date/Time (Mandatory for Professional Reports):
1. In Power BI Desktop, click **File** $\to$ **Options and settings** $\to$ **Options**.
2. Under **Current File**, select **Data Load**.
3. Under *Time Intelligence*, **UNCHECK** `Auto date/time`.
4. Replace it with your single central `Dim_Date` table. File sizes frequently drop by 50% immediately!

---

## 4. Optimization Technique 3: Removing Unnecessary Columns

- If a column is not used in a relationship, a slicer, a visual, or a DAX formula: **REMOVE IT in Power Query!**
- Removing surrogate keys or internal ETL audit fields (`CreatedBy`, `SourceSystemID`, `RowChecksum`) can halve model size.

---

# Multiple Choice Questions

### 1. Which factor has the greatest influence on the memory consumption of a table in Power BI's VertiPaq engine?
A. The number of rows in the table
B. The cardinality (number of unique distinct values) of the individual columns
C. The background color of the report canvas
D. The font size of the visuals
**Answer:** B
**Explanation:** VertiPaq relies on dictionary encoding and run-length encoding. High-cardinality columns (many unique values) create massive dictionaries, consuming exponential amounts of RAM.

### 2. Why should DateTime columns containing timestamps down to the second be split into separate Date and Time columns?
A. Power BI cannot display time
B. Splitting the column drastically reduces the cardinality of both columns, allowing VertiPaq to compress the data much more efficiently
C. It allows charts to load in 3D
D. It enables DirectQuery on CSV files
**Answer:** B
**Explanation:** Splitting a timestamp with millions of unique combinations into a discrete Date (365 unique values/year) and Time (e.g., hours/minutes) drastically reduces dictionary size and memory overhead.

### 3. What negative impact does the default "Auto Date/Time" setting have on enterprise Power BI models?
A. It deletes historical data older than 1 year
B. It automatically generates a hidden internal calendar table for every single date column across the dataset, significantly bloating file size and RAM usage
C. It blocks DAX measures from evaluating
D. It prevents the report from publishing to the cloud
**Answer:** B
**Explanation:** Auto Date/Time creates dozens of hidden calendar tables behind the scenes, bloating memory. Enterprise developers disable this feature and use a single dedicated Date dimension.

### 4. Where is Auto Date/Time disabled for the current Power BI report file?
A. In Power Query M code
B. Under File $\to$ Options and settings $\to$ Options $\to$ Current File $\to$ Data Load
C. In the Windows Device Manager
D. In the visual formatting tab
**Answer:** B
**Explanation:** Disabling Auto Date/Time for the current `.pbix` file is managed in the Options dialog under Current File $\to$ Data Load $\to$ Time Intelligence.

### 5. What should be done with technical primary keys or surrogate database keys in a fact table that are not used in any relationship or calculation?
A. Rename them to uppercase
B. Remove them during the Power Query ETL stage to conserve memory and reduce refresh duration
C. Duplicate them into another table
D. Change their data type to Decimal
**Answer:** B
**Explanation:** If a column has no analytical, relationship, or reporting value, removing it in Power Query prevents VertiPaq from wasting memory storing high-cardinality values.

---
