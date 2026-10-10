# Quick Recap of Import, Modeling & DAX Foundations

Welcome to **Power BI for Intermediate**. In Level 1 (Beginner), you learned the fundamentals of Power BI Desktop: navigating the interface, importing simple Excel sheets, performing basic transformations in Power Query, building fundamental visualizations, and writing elementary DAX formulas such as `SUM`, `AVERAGE`, and `COUNTROWS`.

Before tackling enterprise data models and complex calculation patterns, let us consolidate the core architectural pillars of Microsoft Power BI.

---

## 1. The Three Storage Engines & Connectivity Modes

Power BI Desktop offers three distinct data ingestion modes, each suited to different enterprise workload requirements:

| Storage Mode | Mechanism | Pros | Cons / Constraints | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Import Mode** (Default) | In-memory columnar VertiPaq engine compression. | Blazing fast analytical speed; full DAX expressiveness. | 1 GB dataset size limit per model in Power BI Pro; data freshness requires scheduled refresh. | 90% of business reporting dashboards (< 20M rows). |
| **DirectQuery** | No data is cached locally; DAX queries are converted into native SQL and sent live to source. | Real-time freshness; overcomes the 1 GB dataset size limit. | Slower visual response times; DAX limitations; high load on source database. | Real-time IoT monitoring; multi-billion row enterprise data warehouses (Snowflake, BigQuery). |
| **Dual Mode / Composite** | Tables can be configured as Import or DirectQuery depending on granularity. | Combines speed for aggregates with live drill-down to transactions. | Increased model complexity; requires careful relationship management. | Large-scale financial auditing and enterprise telemetry. |

---

## 2. The VertiPaq Columnar Engine: Why Column Structure Matters

Traditional relational databases (OLTP) like PostgreSQL or MySQL store records **row-by-row**:

```
Row-Oriented Storage (OLTP):
[Row 1: ID=101, Customer="Aarav", State="DL", Amount=450]
[Row 2: ID=102, Customer="Pooja", State="MH", Amount=1200]
[Row 3: ID=103, Customer="Aarav", State="DL", Amount=350]
```

Power BI uses **VertiPaq**, a columnar in-memory database engine:

```
Columnar Storage (VertiPaq OLAP):
ID Column:       [101, 102, 103]
Customer Column: ["Aarav", "Pooja", "Aarav"]  --> Dictionary Encoded: 0: "Aarav", 1: "Pooja" -> [0, 1, 0]
State Column:    ["DL", "MH", "DL"]           --> Dictionary Encoded: 0: "DL", 1: "MH" -> [0, 1, 0]
Amount Column:   [450, 1200, 350]
```

### VertiPaq Compression Rules:
1. **Value Encoding:** Subtraction of minimum values to store smaller integers.
2. **Dictionary Encoding:** Replaces high-cardinality string values with compact integer IDs.
3. **Run-Length Encoding (RLE):** Compresses consecutive identical values (e.g., `["DL", "DL", "DL", "DL"]` stored as `(DL, 4)`).

---

## 3. Calculated Columns vs. Calculated Measures

One of the most critical conceptual milestones for an intermediate analyst is understanding when to use a Calculated Column versus a Measure:

```
                          Calculated Columns vs. Measures
                                         |
            +----------------------------+----------------------------+
            |                                                         |
    Calculated Column                                          Calculated Measure
  - Evaluated during data refresh                           - Evaluated dynamically at query time
  - Stored permanently in RAM/Model                         - Consumes 0 permanent storage memory
  - Operates in Row Context (row-by-row)                    - Operates in Filter Context
  - Used for Slicers, Axes, Groupings                       - Used in Values bucket of visuals
```

### Practical DAX Example

```dax
-- CALCULATED COLUMN (Creates permanent storage in table for each row)
Orders[GrossMarginAmount] = Orders[Sales] - Orders[Cost]

-- CALCULATED MEASURE (Calculates dynamically on the fly based on slicers and visual filters)
Total Profit Margin % = 
DIVIDE(
    [Total Profit], 
    [Total Sales], 
    0
)
```

---

## 4. Evaluation Context Foundations

DAX evaluates expressions in two distinct contexts:

1. **Row Context:**
   - Exists natively in calculated columns and DAX iterators (`SUMX`, `FILTER`, `AVERAGEX`).
   - Knows only the current row's values. It does **NOT** know what other rows exist in the table.
2. **Filter Context:**
   - Created by report visuals, slicers, matrix row/column headers, and the `CALCULATE` function.
   - Restricts the subset of data passed to measures.

---

# Multiple Choice Questions

### 1. What is the primary operational difference between Power BI Import Mode and DirectQuery?
A. Import mode only supports Excel files, while DirectQuery only supports CSV files
B. Import mode caches compressed data in-memory via the VertiPaq engine, whereas DirectQuery passes queries live to the underlying database
C. DirectQuery enables faster client-side visual performance than Import mode
D. Import mode disables all DAX calculations
**Answer:** B
**Explanation:** Import mode pulls data into the local in-memory VertiPaq engine with high columnar compression for ultra-fast reporting. DirectQuery does not store data in memory; it sends live SQL queries to the source system whenever a user interacts with a report.

---

### 2. Why should high-cardinality numerical calculations (such as sales margin percentage) be created as Measures rather than Calculated Columns?
A. Measures cannot calculate division
B. Calculated columns consume permanent RAM storage for every row, whereas measures consume zero RAM until evaluated dynamically
C. Calculated columns only support text data types
D. Measures cannot be filtered by slicers
**Answer:** B
**Explanation:** Calculated columns are evaluated during data refresh and stored permanently in the model's memory for every individual row. Measures are computed on-the-fly inside the active filter context and do not bloat the file size or RAM footprint.

---

### 3. Which compression technique used by VertiPaq replaces repeated text strings with compact integer reference pointers?
A. Run-Length Encoding
B. Dictionary Encoding
C. Bit-Packing Encryption
D. Huffman Tree Hashing
**Answer:** B
**Explanation:** Dictionary Encoding builds an index of unique strings (e.g., State names) and replaces the values in the data column with lightweight integer keys, drastically reducing memory usage.

---

### 4. What type of evaluation context exists natively when calculating a row-by-row formula in a Calculated Column?
A. Filter Context
B. Row Context
C. Cross-Filter Context
D. Time Context
**Answer:** B
**Explanation:** In a calculated column, Power BI automatically creates a Row Context, which allows the formula to reference values from other columns in the same row.

---

### 5. What will occur if a report visual contains a measure using `DIVIDE([Total Profit], [Total Sales], 0)` when `[Total Sales]` evaluates to zero?
A. Power BI crashes with an unhandled divide-by-zero error
B. The visual displays `#DIV/0!`
C. The measure returns the alternate result `0` safely without throwing an error
D. The measure returns `BLANK()` and disables visual filtering
**Answer:** C
**Explanation:** The `DIVIDE()` function in DAX includes built-in division-by-zero protection. If the denominator evaluates to zero or blank, it safely outputs the optional third argument (in this case, `0`), avoiding error screens.

---
