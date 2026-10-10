# Live Connection vs Data Extract (.hyper)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Live vs Extract: The Strategic Decision

### 1. Live Connection
- Sends real-time queries directly to the underlying data source.
- **Pros:** Real-time data freshness (second-by-second updates).
- **Cons:** Constrained by the speed of the underlying database network.

### 2. Data Extract (`.hyper`)
- Ingests and compresses data into Tableau's proprietary high-performance in-memory columnar database: **Hyper**.
- **Pros:** Extremely fast query execution, offline capability, isolates operational databases from heavy analytics queries.
- **Cons:** Data is only as fresh as the last extract refresh.

---

# Multiple Choice Questions

### 1. What is the underlying high-performance columnar in-memory database engine used by Tableau for data extracts?
A. Hyper
B. VertiPaq
C. SQLite
D. RocksDB
**Answer:** A
**Explanation:** Hyper is Tableau's proprietary, lightning-fast in-memory columnar data engine.
---

### 2. When is a 'Live Connection' strictly required instead of an Extract?
A. When real-time operational monitoring is mandatory (e.g. emergency hospital bed availability or stock trading desks)
B. When working offline on an airplane
C. When using Excel files
D. When creating simple bar charts
**Answer:** A
**Explanation:** Live connections query the live database on every click, reflecting changes instantaneously.
---

### 3. What file extension denotes a Tableau Data Extract?
A. `.hyper`
B. `.extract`
C. `.csv`
D. `.tab`
**Answer:** A
**Explanation:** Tableau data extracts are stored as high-performance `.hyper` files.
---

### 4. Can you configure an Extract to refresh incrementally (loading only new rows) rather than rebuilding the full extract?
A. Yes, under Extract settings, choose 'Incremental refresh' based on an ID or Date column
B. No, extracts must always be 100% rewritten
C. Only on Fridays
D. Only with custom Python scripts
**Answer:** A
**Explanation:** Incremental refresh appends newly added records based on a designated timestamp or sequential key.
---

### 5. What happens to a Tableau workbook with an Extract connection if the user disconnects from the company network?
A. The workbook continues to function at full speed because the data extract is stored locally in memory
B. The workbook closes immediately
C. All charts disappear
D. An error message locks the screen
**Answer:** A
**Explanation:** Extracts are self-contained local copies, allowing full offline analysis without database connectivity.
---
